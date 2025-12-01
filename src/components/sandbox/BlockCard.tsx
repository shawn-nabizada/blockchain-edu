import React from "react";
import type { IBlock } from "../../types";
import { Box, Hash, Clock, AlertOctagon, Fingerprint, Unlink } from "lucide-react";
import { motion } from "framer-motion";

export type BlockStatus = "valid" | "tampered" | "broken-link";

interface BlockCardProps {
  block: IBlock;
  index: number;
  status: BlockStatus;
  actualHash: string;
}

export const BlockCard: React.FC<BlockCardProps> = ({ block, index, status, actualHash }) => {
  
  // Determine styles based on status
  const isError = status !== "valid";
  
  let borderColor = "border-slate-200";
  let bgColor = "bg-white";
  let icon = <Box className="w-5 h-5" />;
  let statusText = `Block #${index}`;
  let textColor = "text-blue-600";

  if (status === "tampered") {
    borderColor = "border-red-500 ring-2 ring-red-200";
    bgColor = "bg-red-50";
    icon = <AlertOctagon className="w-5 h-5" />;
    statusText = "DATA TAMPERED";
    textColor = "text-red-600";
  } else if (status === "broken-link") {
    borderColor = "border-amber-500 ring-2 ring-amber-200";
    bgColor = "bg-amber-50";
    icon = <Unlink className="w-5 h-5" />;
    statusText = "BROKEN LINK";
    textColor = "text-amber-600";
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`border-2 rounded-xl p-4 w-72 shadow-sm shrink-0 relative overflow-hidden group hover:shadow-md transition-all ${borderColor} ${bgColor}`}
    >
      <div className={`absolute -right-2 -top-2 text-6xl font-bold opacity-20 select-none transition-colors ${
        isError ? "text-red-200" : "text-slate-200 group-hover:text-blue-50"
      }`}>
        {index}
      </div>

      <div className="relative z-10">
        <div className={`flex items-center gap-2 mb-3 ${textColor}`}>
          {icon}
          <span className="font-bold uppercase text-xs tracking-wider">
            {statusText}
          </span>
        </div>

        <div className="space-y-3 text-xs text-slate-600">
          
          {/* HASH DISPLAY (Only show detail if something is wrong) */}
          {status === "tampered" ? (
             <div className="bg-white/60 p-2 rounded border border-red-200 space-y-2">
               <div>
                 <span className="text-[10px] font-bold uppercase text-red-800 block mb-0.5">Stored Hash</span>
                 <div className="font-mono bg-white px-1 rounded text-red-600 break-all leading-tight">
                   {block.hash.substring(0, 16)}...
                 </div>
               </div>
               <div>
                 <span className="text-[10px] font-bold uppercase text-red-800 block mb-0.5 items-center gap-1">
                    <Fingerprint className="w-3 h-3" /> Actual Hash
                 </span>
                 <div className="font-mono bg-white px-1 rounded text-slate-700 break-all leading-tight border border-red-200">
                   {actualHash.substring(0, 16)}...
                 </div>
               </div>
             </div>
          ) : status === "broken-link" ? (
             <div className="bg-white/60 p-2 rounded border border-amber-200 text-amber-800 space-y-1">
                <span className="font-bold flex items-center gap-1">
                   <Unlink className="w-3 h-3" /> Chain Break
                </span>
                <p className="leading-tight opacity-90">
                   Previous block hash does not match. The chain history is invalid from this point forward.
                </p>
             </div>
          ) : (
            // Valid State
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3" />
              <span className="font-mono bg-slate-100 px-1 rounded truncate w-full">
                {block.hash.substring(0, 14)}...
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Prev:</span>
            <span className="font-mono truncate w-24">
              {block.previousHash === "0" ? "GENESIS" : block.previousHash.substring(0, 8)}...
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100/50 flex justify-between items-center">
            <span className="font-semibold text-slate-800">{block.transactions.length} Txns</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 border border-slate-200">
              {block.miner}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};