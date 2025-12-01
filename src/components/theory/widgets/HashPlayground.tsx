import React, { useState, useEffect } from "react";
import { sha256 } from "../../../logic/Block";
import { RefreshCw } from "lucide-react"; // Removed Copy

export const HashPlayground: React.FC = () => {
  const [input, setInput] = useState("Blockchain is cool");
  const [hash, setHash] = useState("");

  useEffect(() => {
    sha256(input).then(setHash);
  }, [input]);

  return (
    <div className="bg-slate-100 p-6 rounded-xl border border-slate-200 mt-4 shadow-inner">
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Input Data</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-medium text-slate-700 transition-all"
          placeholder="Type anything here..."
        />
      </div>

      <div className="relative group">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SHA-256 Hash (Fingerprint)</label>
        <div className="break-all font-mono text-xs bg-slate-800 text-green-400 p-4 rounded-lg leading-relaxed shadow-lg relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01]">
          {hash}
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-3 flex gap-2 items-center">
        <RefreshCw className="w-3 h-3" />
        Try changing just one character. Notice how the entire hash changes?
      </p>
    </div>
  );
};