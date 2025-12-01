import React from "react";
import { useSimulation } from "../context/SimulationContext";
import { NodeView } from "../components/sandbox/NodeView";
import { NetworkControls } from "../components/sandbox/NetworkControls";
import { RealityCheck } from "../components/sandbox/RealityCheck";
import { Loader2 } from "lucide-react";

export const Sandbox: React.FC = () => {
  const { nodes } = useSimulation();

  if (nodes.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 flex-col gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p>Initializing Network Nodes...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      
      {/* LEFT SIDEBAR: Controls */}
      <NetworkControls />

      {/* MAIN CONTENT: Node Grid */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-[1920px] mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Live Network Status</h1>
            <p className="text-slate-500">Monitoring 4 active peer nodes</p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-8">
            {nodes.map((node) => (
              <NodeView
                key={node.id}
                id={node.id}
                name={node.name}
                isUser={true} 
                balance={node.balance}
                mempool={node.mempool}
                chain={node.chain}
                miningSpeed={node.miningSpeed} // Pass the new prop
              />
            ))}
          </div>

          {/* New Section */}
          <RealityCheck />
        </div>
      </div>
    </div>
  );
};