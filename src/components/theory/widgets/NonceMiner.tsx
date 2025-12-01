import React, { useState, useEffect } from "react";
import { sha256 } from "../../../logic/Block";
import { Pickaxe, CheckCircle, RotateCcw } from "lucide-react";

export const NonceMiner: React.FC = () => {
  const [nonce, setNonce] = useState(0);
  const [hash, setHash] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  
  // Target: Hash must start with "0" (Easy difficulty for demo)
  // Real Bitcoin requires ~19 zeros
  const TARGET_PREFIX = "00"; 

  useEffect(() => {
    const calculate = async () => {
      const data = `Block Data` + nonce;
      const h = await sha256(data);
      setHash(h);
      if (h.startsWith(TARGET_PREFIX)) {
        setIsSolved(true);
      } else {
        setIsSolved(false);
      }
    };
    calculate();
  }, [nonce]);

  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-500 mt-4 ${isSolved ? "bg-green-50 border-green-500 shadow-green-100" : "bg-white border-slate-200 shadow-sm"}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700">Find the Golden Nonce</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded ${isSolved ? "bg-green-200 text-green-800" : "bg-slate-100 text-slate-500"}`}>
          Target: Starts with "{TARGET_PREFIX}"
        </span>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <div className="bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
          <span className="text-xs text-slate-400 block uppercase font-bold">Nonce</span>
          <span className="font-mono text-xl font-bold text-blue-600">{nonce}</span>
        </div>
        
        <button
          onClick={() => setNonce(prev => prev + 1)}
          disabled={isSolved}
          className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 ${
            isSolved 
              ? "bg-green-500 text-white cursor-default" 
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          }`}
        >
          {isSolved ? (
            <>
              <CheckCircle className="w-5 h-5" /> Solved!
            </>
          ) : (
            <>
              <Pickaxe className="w-5 h-5" /> Mine (Increment)
            </>
          )}
        </button>

        {isSolved && (
          <button 
            onClick={() => setNonce(0)}
            className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="font-mono text-xs break-all bg-slate-900 text-slate-400 p-3 rounded border border-slate-700">
        <span className="text-slate-600 select-none mr-2">Hash:</span>
        <span className={isSolved ? "text-green-400 font-bold" : ""}>
          {hash.substring(0, 2)}
        </span>
        {hash.substring(2)}
      </div>
    </div>
  );
};