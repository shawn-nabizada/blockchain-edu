import React, { useState, useEffect } from "react";
import { useSimulation } from "../../context/SimulationContext";
import { Send, ArrowRight, Activity, Zap, Layers } from "lucide-react";
import { NetworkLog } from "./NetworkLog";

export const NetworkControls: React.FC = () => {
  const { addTransaction, nodes, logs, difficulty, setDifficulty } = useSimulation(); 
  
  // Initialize state lazily if nodes exist, otherwise empty
  const [from, setFrom] = useState(nodes.length > 0 ? nodes[0].id : "");
  const [to, setTo] = useState(nodes.length > 1 ? nodes[1].id : "");
  const [amount, setAmount] = useState(10);

  // Sync state when nodes populate (if they were empty on mount)
  useEffect(() => {
    if (nodes.length > 0) {
      if (!from) setFrom(nodes[0].id);
      if (!to && nodes.length > 1) setTo(nodes[1].id);
    }
  }, [nodes, from, to]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (from === to) {
      alert("Cannot send to yourself!");
      return;
    }
    addTransaction(from, to, Number(amount));
  };

  const senderNode = nodes.find(n => n.id === from);
  const maxBlockHeight = nodes.length > 0 ? Math.max(...nodes.map(n => n.chain.length)) : 0;

  return (
    <div className="w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-xl z-20">
      
      {/* Header Stats */}
      <div className="p-6 bg-slate-900 text-white shrink-0">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-blue-400" />
          Control Panel
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
              <Layers className="w-3 h-3" /> Height
            </span>
            <span className="text-2xl font-mono font-bold text-blue-400">#{maxBlockHeight}</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 uppercase font-bold flex items-center gap-1 mb-1">
              <Zap className="w-3 h-3" /> Difficulty
            </span>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="1" 
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>1</span>
              <span>Level {difficulty}</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Send className="w-4 h-4" />
          New Transaction
        </h3>
        
        <form onSubmit={handleSend} className="space-y-5">
          {/* Sender */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">From</label>
            <select 
              value={from} 
              onChange={(e) => setFrom(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  {n.name} ({n.balance} ETH)
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center text-slate-300">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Recipient */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">To</label>
            <select 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-medium text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {nodes.filter(n => n.id !== from).map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
              <span className="text-xs text-slate-400">Max: {senderNode?.balance || 0}</span>
            </div>
            <div className="relative">
              <input 
                type="number" 
                min="1" 
                max={senderNode?.balance || 100}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-3 pl-3 pr-12 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <span className="absolute right-3 top-3 text-xs font-bold text-slate-400 pointer-events-none">ETH</span>
            </div>
          </div>

          <button 
            type="submit"
            disabled={!senderNode || amount > (senderNode?.balance || 0)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            Broadcast Transaction
          </button>
        </form>
      </div>
      
      <NetworkLog logs={logs} />
    </div>
  );
};