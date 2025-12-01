import React, { useState } from "react";
import { X, Box, User, Clock, Hash, FileText, ArrowRight, Edit2, Check, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { IBlock } from "../../types";
import { useSimulation } from "../../context/SimulationContext";

interface BlockDetailModalProps {
  block: IBlock | null;
  ownerId: string;
  blockIndex: number;
  onClose: () => void;
}

export const BlockDetailModal: React.FC<BlockDetailModalProps> = ({ block, ownerId, blockIndex, onClose }) => {
  const { nodes, tamperBlock } = useSimulation(); 
  
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<number>(0);

  const getName = (id: string | null) => {
    if (!id) return "System";
    const node = nodes.find(n => n.id === id);
    return node ? node.name : id.substring(0, 6);
  };

  const startEditing = (txId: string, currentAmount: number) => {
    setEditingTxId(txId);
    setEditAmount(currentAmount);
  };

  const saveEdit = (txIndex: number) => {
    if (block) {
      tamperBlock(ownerId, blockIndex, txIndex, editAmount);
      setEditingTxId(null);
    }
  };

  return (
    <AnimatePresence>
      {block && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-slate-200"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-400" />
                  Block Details
                </h2>
                <p className="text-slate-400 text-sm font-mono mt-1">
                  {block.hash.substring(0, 20)}...
                </p>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              
               <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800 text-xs flex gap-2">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 <p><strong>God Mode:</strong> You can tamper with transactions here. Changing a value will break the block's hash and invalidate the chain!</p>
               </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <User className="w-3 h-3" /> Mined By
                  </span>
                  <p className="font-bold text-slate-800">{block.miner}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    <Clock className="w-3 h-3" /> Timestamp
                  </span>
                  <p className="font-mono text-sm text-slate-800">
                    {new Date(block.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1">
                    {/* Hash Icon Used Here */}
                    <Hash className="w-3 h-3" /> Previous Hash
                  </span>
                  <p className="font-mono text-xs text-slate-600 break-all">
                    {block.previousHash || "Genesis (0)"}
                  </p>
                </div>
              </div>

              {/* Transactions List */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Transactions ({block.transactions.length})
                </h3>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                  {block.transactions.length === 0 ? (
                    <div className="text-center py-4 text-slate-400 italic text-sm border-2 border-dashed border-slate-100 rounded-lg">
                      No transactions (Empty Block)
                    </div>
                  ) : (
                    block.transactions.map((tx, idx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm text-sm group hover:border-blue-300 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            {getName(tx.fromAddress)}
                          </span>
                          <ArrowRight className="w-3 h-3 text-slate-300" />
                          <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            {getName(tx.toAddress)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {editingTxId === tx.id ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="number" 
                                value={editAmount}
                                onChange={(e) => setEditAmount(Number(e.target.value))}
                                className="w-20 p-1 border border-blue-400 rounded text-right font-mono"
                                autoFocus
                              />
                              <button 
                                onClick={() => saveEdit(idx)}
                                className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="font-mono font-bold">{tx.amount} ETH</span>
                              <button 
                                onClick={() => startEditing(tx.id, tx.amount)}
                                className="p-1 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                title="Tamper Data"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};