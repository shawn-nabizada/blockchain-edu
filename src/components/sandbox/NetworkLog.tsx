import React, { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

interface NetworkLogProps {
  logs: LogEntry[];
}

export const NetworkLog: React.FC<NetworkLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-64 border-t border-slate-200 bg-slate-900 text-slate-300 font-mono text-xs">
      <div className="p-3 bg-slate-800 border-b border-slate-700 flex items-center gap-2 font-bold text-slate-200">
        <Terminal className="w-4 h-4" />
        Network Events
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {logs.length === 0 && (
          <div className="text-slate-600 italic">No network activity yet...</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-slate-500 mr-2">
              [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute:"2-digit", second:"2-digit" })}]
            </span>
            <span className={
              log.type === "error" ? "text-red-400" :
              log.type === "success" ? "text-green-400" :
              log.type === "warning" ? "text-amber-400" : "text-blue-300"
            }>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};