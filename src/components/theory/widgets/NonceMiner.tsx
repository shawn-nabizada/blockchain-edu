import React, { useState } from "react";
import { Pickaxe, CheckCircle2, RefreshCcw, BrainCircuit, XCircle } from "lucide-react";

const SOLUTION = [
  1, 2, 3, 4,
  3, 4, 1, 2,
  2, 3, 4, 1,
  4, 1, 2, 3
];

const PREFILLED = [0, 3, 4, 7, 8, 11, 12, 15];

const INITIAL_GRID = SOLUTION.map((val, idx) => 
  PREFILLED.includes(idx) ? val : null
);

export const NonceMiner: React.FC = () => {
  const [grid, setGrid] = useState<(number | null)[]>(INITIAL_GRID);
  const [status, setStatus] = useState<"playing" | "verifying" | "success" | "error">("playing");

  const handleCellClick = (idx: number) => {
    if (PREFILLED.includes(idx) || status === "success") return;

    setGrid(prev => {
      const newGrid = [...prev];
      const currentVal = newGrid[idx] || 0;
      const nextVal = currentVal >= 4 ? null : currentVal + 1;
      newGrid[idx] = nextVal;
      return newGrid;
    });
    
    if (status === "error") setStatus("playing");
  };

  const verify = () => {
    setStatus("verifying");
    
    setTimeout(() => {
      const isCorrect = grid.every((val, idx) => val === SOLUTION[idx]);
      setStatus(isCorrect ? "success" : "error");
    }, 600);
  };

  const reset = () => {
    setGrid(INITIAL_GRID);
    setStatus("playing");
  };

  return (
    <div className={`mt-6 p-6 rounded-2xl border-2 transition-all duration-500 relative overflow-hidden ${
      status === "success" 
        ? "bg-green-50 border-green-500 shadow-xl" 
        : status === "error"
          ? "bg-red-50 border-red-300 shadow-sm"
          : "bg-white border-slate-200 shadow-sm"
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <h3 className={`font-bold text-lg flex items-center gap-2 ${
            status === "success" ? "text-green-800" : 
            status === "error" ? "text-red-800" : "text-slate-800"
          }`}>
            {status === "success" ? <CheckCircle2 className="w-6 h-6" /> : 
             status === "error" ? <XCircle className="w-6 h-6" /> :
             <BrainCircuit className="w-6 h-6 text-blue-500" />}
            
            {status === "success" ? "Valid Block Found!" : 
             status === "error" ? "Invalid Proof" :
             "Manual Proof of Work"}
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            You are the Miner. Fill the empty squares so every row, column, and 2x2 box contains 1-4.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        
        <div className="relative p-2 bg-slate-900 rounded-xl shadow-2xl shrink-0">
          <div className="grid grid-cols-4 gap-1 w-64 h-64 border-4 border-slate-700 bg-slate-700">
            {grid.map((num, idx) => {
              const isFixed = PREFILLED.includes(idx);
              
              const borderR = (idx % 2 === 1 && idx % 4 !== 3) ? "border-r-4 border-slate-900" : "";
              const borderB = (idx >= 4 && idx <= 7) ? "border-b-4 border-slate-900" : "";

              return (
                <div 
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  className={`flex items-center justify-center text-3xl font-bold select-none transition-colors duration-200 ${borderR} ${borderB} ${
                    isFixed 
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : status === "success" 
                        ? "bg-green-500 text-white cursor-default"
                        : status === "error"
                          ? "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer"
                          : "bg-white text-blue-600 hover:bg-blue-50 cursor-pointer active:scale-95"
                  }`}
                >
                  {num || <span className="opacity-10 text-slate-400 text-sm">•</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full md:max-w-xs">
          
          <div className="bg-slate-100 p-4 rounded-lg text-xs text-slate-600 space-y-2">
            <p className="font-bold uppercase text-slate-400">Rules:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Click empty cells to cycle numbers (1-4).</li>
              <li>Numbers cannot repeat in rows or columns.</li>
              <li>Solve it to "Mine" the block.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {status !== "success" ? (
              <button
                onClick={verify}
                disabled={status === "verifying"}
                className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg ${
                  status === "error"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {status === "verifying" ? (
                  "Verifying..." 
                ) : (
                  <>
                    <Pickaxe className="w-5 h-5 fill-current" />
                    Verify Work (Mine)
                  </>
                )}
              </button>
            ) : (
              <div className="py-3 bg-green-100 text-green-800 rounded-xl font-bold text-center border border-green-200">
                Block Mined Successfully!
              </div>
            )}

            <button
              onClick={reset}
              className="py-3 text-slate-500 font-bold hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCcw className="w-4 h-4" />
              {status === "success" ? "Mine Another Block (Reset)" : "Clear Grid"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};