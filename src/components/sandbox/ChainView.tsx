import React, { useState, useEffect } from "react";
import type { IBlock } from "../../types";
import { BlockCard, type BlockStatus } from "./BlockCard";
import { Link } from "lucide-react";
import { BlockDetailModal } from "./BlockDetailModal";
import { calculateBlockHash } from "../../logic/Block";

interface ChainViewProps {
  blocks: IBlock[];
  ownerId: string;
  title?: string;
}

export const ChainView: React.FC<ChainViewProps> = ({ blocks, ownerId, title = "Local Blockchain" }) => {
  const [selectedBlockIdx, setSelectedBlockIdx] = useState<number | null>(null);
  const [blockStatuses, setBlockStatuses] = useState<BlockStatus[]>([]);
  const [calculatedHashes, setCalculatedHashes] = useState<string[]>([]);

  // The DOMINO EFFECT Logic
  useEffect(() => {
    const validateChain = async () => {
      const statuses: BlockStatus[] = [];
      const realHashes: string[] = [];

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const actualHash = await calculateBlockHash(block);
        realHashes.push(actualHash);

        // 1. Check Self-Integrity
        const isDataValid = actualHash === block.hash;

        // 2. Check Link-Integrity (Domino Effect)
        let isLinkValid = true;
        if (i > 0) {
          const previousRealHash = realHashes[i - 1];
          // Does my "previousHash" field match the ACTUAL hash of the block before me?
          isLinkValid = block.previousHash === previousRealHash;
        } else {
          // Genesis block must have "0" as previous
          isLinkValid = block.previousHash === "0";
        }

        if (!isDataValid) {
          statuses.push("tampered"); // I am the source of the lie
        } else if (!isLinkValid) {
          statuses.push("broken-link"); // I am honest, but my history is broken
        } else {
          statuses.push("valid");
        }
      }
      
      setBlockStatuses(statuses);
      setCalculatedHashes(realHashes);
    };

    validateChain();
  }, [blocks]);

  const selectedBlock = selectedBlockIdx !== null ? blocks[selectedBlockIdx] : null;

  return (
    <>
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col h-full">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Link className="w-4 h-4" />
          {title}
        </h3>
        
        <div className="flex items-start gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-300">
          {blocks.map((block, idx) => (
            <React.Fragment key={block.hash || idx}>
              <div 
                onClick={() => setSelectedBlockIdx(idx)} 
                className="cursor-pointer transition-transform hover:-translate-y-1 active:scale-95"
              >
                <BlockCard 
                  block={block} 
                  index={idx} 
                  status={blockStatuses[idx] || "valid"} 
                  actualHash={calculatedHashes[idx] || ""}
                />
              </div>
              
              {idx < blocks.length - 1 && (
                <div className={`h-32 flex items-center transition-colors duration-500 ${
                  // Turn the arrow RED if the link is broken
                  blockStatuses[idx+1] === "broken-link" ? "text-red-500" : "text-slate-300"
                }`}>
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <BlockDetailModal 
        block={selectedBlock} 
        ownerId={ownerId}
        blockIndex={selectedBlockIdx || 0}
        onClose={() => setSelectedBlockIdx(null)} 
      />
    </>
  );
};