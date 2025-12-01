import React, { useRef, useState, useEffect } from "react";
import { Eraser, Pen, Trash2, MousePointer2 } from "lucide-react";

interface DrawingCanvasProps {
  isDark: boolean;
  savedData: string | null;
  onSave: (data: string) => void;
}

type ColorId = "primary" | "red" | "green" | "neutral";

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ isDark, savedData, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeColor, setActiveColor] = useState<ColorId>("primary");
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const lastSavedRef = useRef<string | null>(null);

  const colorMap: Record<ColorId, string> = {
    primary: isDark ? "#60a5fa" : "#2563eb", 
    red: "#dc2626",
    green: "#16a34a",
    neutral: isDark ? "#f8fafc" : "#000000"
  };

  const currentColorHex = colorMap[activeColor];

  // 1. Handle Resize (Only on mount/window resize)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      // Save current content
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

      // Resize
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // Restore
        ctx.drawImage(tempCanvas, 0, 0);
      }
    };

    // Initial resize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []); 

  // 2. Handle External Data Load (Slide Change)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !savedData) return;
    
    if (savedData === lastSavedRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = savedData;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  }, [savedData]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e, canvas);

    ctx.strokeStyle = tool === "eraser" ? (isDark ? "#0f172a" : "#ffffff") : currentColorHex;
    ctx.lineWidth = tool === "eraser" ? 20 : 3;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const data = canvasRef.current.toDataURL();
      lastSavedRef.current = data;
      onSave(data);
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    if ('touches' in e) {
       const rect = canvas.getBoundingClientRect();
       return {
         offsetX: e.touches[0].clientX - rect.left,
         offsetY: e.touches[0].clientY - rect.top
       };
    } else {
       return {
         offsetX: e.nativeEvent.offsetX,
         offsetY: e.nativeEvent.offsetY
       };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastSavedRef.current = "";
    onSave(""); 
  };

  return (
    <div ref={containerRef} className={`relative w-full h-full cursor-crosshair overflow-hidden transition-colors duration-500 ${isDark ? "bg-slate-900 border-l border-slate-700" : "bg-white border-l border-slate-200"}`}>
      <div 
        className="absolute inset-0 pointer-events-none opacity-20" 
        style={{ 
          backgroundImage: `radial-gradient(${isDark ? '#475569' : '#cbd5e1'} 1px, transparent 1px)`, 
          backgroundSize: '20px 20px' 
        }}
      ></div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="block relative z-10"
      />
      
      {/* Toolbar */}
      <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-20 backdrop-blur shadow-xl border rounded-full px-2 py-2 flex items-center gap-2 ${isDark ? "bg-slate-800/90 border-slate-600" : "bg-white/90 border-slate-200"}`}>
        <button 
          onClick={() => setTool("pen")}
          className={`p-2 rounded-full transition-colors ${
            tool === "pen" 
              ? (isDark ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600") 
              : (isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600")
          }`}
        >
          <Pen className="w-4 h-4" />
        </button>
        
        {tool === "pen" && (
          <div className={`flex gap-1.5 border-l border-r px-3 mx-1 ${isDark ? "border-slate-600" : "border-slate-200"}`}>
            {(Object.keys(colorMap) as ColorId[]).map((cKey) => (
              <button
                key={cKey}
                onClick={() => setActiveColor(cKey)}
                className={`w-5 h-5 rounded-full border transition-transform ${activeColor === cKey ? 'scale-125 ring-2 ring-offset-1' : 'hover:scale-110'} ${isDark ? "border-slate-500 ring-slate-500 ring-offset-slate-800" : "border-slate-200 ring-slate-300"}`}
                style={{ backgroundColor: colorMap[cKey] }}
              />
            ))}
          </div>
        )}

        <button 
          onClick={() => setTool("eraser")}
          className={`p-2 rounded-full transition-colors ${
            tool === "eraser"
              ? (isDark ? "bg-slate-600 text-white" : "bg-slate-200 text-slate-800")
              : (isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-600")
          }`}
          title="Eraser"
        >
          <Eraser className="w-4 h-4" />
        </button>

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-slate-600" : "bg-slate-200"}`} />

        <button 
          onClick={clearCanvas}
          className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-red-900/50 text-slate-400 hover:text-red-400" : "hover:bg-red-50 text-slate-400 hover:text-red-600"}`}
          title="Clear Board"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className={`absolute bottom-4 right-4 text-xs font-medium select-none pointer-events-none flex items-center gap-1 ${isDark ? "text-slate-600" : "text-slate-400"}`}>
        <MousePointer2 className="w-3 h-3" />
        Presentation Board
      </div>
    </div>
  );
};