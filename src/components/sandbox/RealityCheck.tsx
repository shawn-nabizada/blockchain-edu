import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, WifiOff, Globe, ShieldAlert } from "lucide-react";

export const RealityCheck: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="max-w-[1920px] mx-auto mt-12 mb-24">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="p-6 flex items-center justify-between text-amber-900">
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-amber-600" />
            <div>
              <h3 className="font-bold text-lg">Reality vs. Simulation</h3>
              <p className="text-sm text-amber-700 opacity-80">This sandbox simplifies some complex mechanics. Click to see what's missing.</p>
            </div>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>

        {isOpen && (
          <div className="px-6 pb-8 grid md:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
            <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold">
                <Globe className="w-4 h-4" />
                <span>P2P Discovery</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                In reality, nodes don't automatically know each other. They must "discover" peers using bootstrap servers and handshake protocols. Our sim hardcodes 4 friends.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold">
                <WifiOff className="w-4 h-4" />
                <span>Latency & Forks</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real messages take time to travel. If Alice and Bob mine a block at the exact same second, the network splits ("Forks"). We streamlined this to 1.5s delay.
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Digital Signatures</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                We use simple "From" fields. Real blockchains use Public/Private Key Cryptography to sign transactions, so nobody can fake a message from you.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};