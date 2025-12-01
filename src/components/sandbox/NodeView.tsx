import React, { useState, useMemo } from "react";
import { ChainView } from "./ChainView";
import { MempoolView } from "./MempoolView";
import type { ITransaction, IBlock } from "../../types";
import { Wallet, Server, Pickaxe, Loader2, Gauge, Wifi } from "lucide-react";
import { useSimulation } from "../../context/SimulationContext";

interface NodeViewProps {
  id: string;
  name: string;
  isUser?: boolean; 
  balance: number;
  mempool: ITransaction[];
  chain: IBlock[];
  miningSpeed: number;
}

export const NodeView: React.FC<NodeViewProps> = ({ 
  id, 
  name, 
  isUser = false, 
  balance, 
  mempool, 
  chain,
  miningSpeed
}) => {
  const { mineBlock, updateNodeSpeed, propagationEvents } = useSimulation();
  const [isMining, setIsMining] = useState(false);

  // Check if there is an active propagation event targeting this node
  const isReceiving = propagationEvents.some(e => e.to === id);

  // Calculate Pending Balance (Current + Incoming - Outgoing in Mempool)
  const pendingBalance = useMemo(() => {
    let pending = balance;
    mempool.forEach(tx => {
      if (tx.fromAddress === id) pending -= tx.amount;
      if (tx.toAddress === id) pending += tx.amount;
    });
    return pending;
  }, [balance, mempool, id]);

  const handleMine = async () => {
    if (isMining) return;
    setIsMining(true);
    // Force a UI delay based on speed
    const delay = 1000 / miningSpeed; 
    await new Promise(r => setTimeout(r, delay));
    
    await mineBlock(id);
    setIsMining(false);
  };

  return (
    <div className={`rounded-2xl border-2 overflow-hidden shadow-xl flex flex-col bg-white transition-all duration-300 ${
      isReceiving ? "ring-4 ring-blue-400 border-blue-400 scale-[1.01]" : 
      isUser ? 'border-blue-500' : 'border-slate-200'
    }`}>
      
      {/* Node Header */}
      <div className={`p-4 ${isUser ? 'bg-blue-50' : 'bg-slate-100'} border-b border-slate-200`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg relative ${isUser ? 'bg-blue-600 text-white' : 'bg-slate-300 text-slate-600'}`}>
              <Server className="w-5 h-5" />
              {/* Online Status Dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight flex items-center gap-2">
                {name}
                {isReceiving && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <Wifi className="w-3 h-3" /> Syncing...
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-0.5">
                <span>Height: {chain.length}</span>
                <span className="text-slate-300">•</span>
                <span>Hashrate: {miningSpeed}x</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
             {/* Wallet Display */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Wallet className="w-4 h-4 text-emerald-500" />
              <span className="font-mono font-bold text-slate-700">
                {balance} <span className="text-slate-400 text-xs">ETH</span>
              </span>
            </div>
            {/* Pending State */}
            {pendingBalance !== balance && (
              <span className="text-xs font-mono font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Pending: {pendingBalance} ETH
              </span>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-4 bg-white/50 p-2 rounded-xl border border-slate-200/50">
          
          {/* Speed Slider */}
          <div className="flex-1 flex items-center gap-3 px-2">
            <Gauge className="w-4 h-4 text-slate-400" />
            <div className="flex-1">
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.5" 
                value={miningSpeed}
                onChange={(e) => updateNodeSpeed(id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 w-8 text-right">{miningSpeed}x</span>
          </div>

          <div className="w-px h-8 bg-slate-300" />

          {/* Mine Button */}
          <button
            onClick={handleMine}
            disabled={isMining || mempool.length === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
              mempool.length === 0 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white hover:shadow active:scale-95"
            }`}
          >
            {isMining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pickaxe className="w-4 h-4" />}
            {isMining ? "Mining..." : "Mine Block"}
          </button>
        </div>
      </div>

      {/* Node Body */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 bg-slate-50/50 grow">
        <div className="lg:col-span-1">
          <MempoolView transactions={mempool} />
        </div>

        <div className="lg:col-span-2">
          <ChainView 
            blocks={chain} 
            ownerId={id} 
            title={`${name}'s Chain`}
          />
        </div>
      </div>
    </div>
  );
};