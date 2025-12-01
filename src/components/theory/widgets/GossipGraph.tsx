import React, { useState } from "react";
import { motion } from "framer-motion";

export const GossipGraph: React.FC = () => {
  const [active, setActive] = useState(false);

  const triggerGossip = () => {
    setActive(true);
    setTimeout(() => setActive(false), 2000);
  };

  // Node Positions (Center + 3 Satellites)
  const nodes = [
    { id: 0, x: 50, y: 50, label: "You" }, // Center
    { id: 1, x: 20, y: 20, label: "A" },
    { id: 2, x: 80, y: 20, label: "B" },
    { id: 3, x: 50, y: 80, label: "C" },
  ];

  return (
    <div className="mt-4 flex flex-col items-center">
      <div className="relative w-64 h-64 bg-slate-50 rounded-full border border-slate-200 shadow-inner overflow-hidden cursor-pointer" onClick={triggerGossip}>
        {/* Helper Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity z-0">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Click Center</span>
        </div>

        <svg className="w-full h-full absolute inset-0 pointer-events-none">
          {/* Connection Lines */}
          {nodes.slice(1).map((node) => (
            <line
              key={node.id}
              x1="50%"
              y1="50%"
              x2={`${node.x}%`}
              y2={`${node.y}%`}
              stroke={active ? "#3b82f6" : "#cbd5e1"}
              strokeWidth="2"
              className="transition-colors duration-300"
            />
          ))}
          
          {/* Animated Pulses (Gossip) */}
          {active && nodes.slice(1).map((node, i) => (
            <motion.circle
              key={`pulse-${node.id}`}
              cx="50%"
              cy="50%"
              r="4"
              fill="#3b82f6"
              initial={{ cx: "50%", cy: "50%", opacity: 1 }}
              animate={{ cx: `${node.x}%`, cy: `${node.y}%`, opacity: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
            />
          ))}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full flex items-center justify-center font-bold text-xs shadow-md border-2 transition-all duration-300 z-10 ${
              node.id === 0 
                ? "bg-blue-600 border-blue-400 text-white hover:scale-110" 
                : active 
                  ? "bg-blue-100 border-blue-500 text-blue-700" 
                  : "bg-white border-slate-300 text-slate-500"
            }`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.label}
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-2 text-center">Click "You" to broadcast a message</p>
    </div>
  );
};