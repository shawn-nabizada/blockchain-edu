import React from "react";
import type { ITransaction } from "../../types";
import { Layers, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulation } from "../../context/SimulationContext";

interface MempoolViewProps {
  transactions: ITransaction[];
}

export const MempoolView: React.FC<MempoolViewProps> = ({ transactions }) => {
  const { nodes } = useSimulation();

  // Helper to lookup names
  const getName = (id: string | null) => {
    if (!id) return "SYS"; // System
    const node = nodes.find(n => n.id === id);
    return node ? node.name : id.substring(0, 4);
  };

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 h-full flex flex-col">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Layers className="w-4 h-4" />
        Mempool (Pending)
      </h3>

      <div className="space-y-2 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {transactions.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-8 italic">
            No pending transactions...
          </div>
        ) : (
          <AnimatePresence>
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 text-xs flex justify-between items-center gap-3"
              >
                {/* Minimal Layout: A -> B */}
                <div className="flex items-center gap-2">
                  <span 
                    title={getName(tx.fromAddress)} // Full name on hover
                    className="font-bold bg-blue-100 text-blue-700 w-6 h-6 flex items-center justify-center rounded-full border border-blue-200"
                  >
                    {getName(tx.fromAddress).charAt(0)}
                  </span>
                  
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  
                  <span 
                    title={getName(tx.toAddress)} // Full name on hover
                    className="font-bold bg-green-100 text-green-700 w-6 h-6 flex items-center justify-center rounded-full border border-green-200"
                  >
                    {getName(tx.toAddress).charAt(0)}
                  </span>
                </div>

                <span className="font-mono font-bold text-slate-700">
                  {tx.amount} ETH
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};