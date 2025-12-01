import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { IBlock, ITransaction } from "../types";
import { Block, calculateBlockHash } from "../logic/Block";
import { Transaction } from "../logic/Transaction";

export interface LogEntry {
  id: string;
  timestamp: number;
  message: string;
  type: "info" | "success" | "error" | "warning";
}

export interface NodeState {
  id: string;
  name: string;
  chain: IBlock[];
  mempool: ITransaction[];
  balance: number;
  miningSpeed: number; // Multiplier (0.5x to 2.0x)
}

// Visual event for the UI to render flying packets
export interface PropagationEvent {
  id: string;
  from: string;
  to: string;
  timestamp: number;
}

interface SimulationContextType {
  nodes: NodeState[];
  logs: LogEntry[];
  difficulty: number;
  propagationEvents: PropagationEvent[];
  setDifficulty: (diff: number) => void;
  updateNodeSpeed: (nodeId: string, speed: number) => void;
  addTransaction: (from: string, to: string, amount: number) => boolean; 
  mineBlock: (nodeId: string) => Promise<void>;
  tamperBlock: (nodeId: string, blockIndex: number, txIndex: number, newAmount: number) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // New State Variables
  const [difficulty, setDifficulty] = useState(2);
  const [propagationEvents, setPropagationEvents] = useState<PropagationEvent[]>([]);

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs(prev => [...prev, {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      message,
      type
    }]);
  };

  useEffect(() => {
    const initSimulation = async () => {
      const genesisBlock = new Block(Date.now(), [], "0", "System");
      await genesisBlock.mineBlock(2);
      const initialBlock = { ...genesisBlock, transactions: [] };

      const initialNodes: NodeState[] = [
        { id: "node1", name: "Alice", chain: [initialBlock], mempool: [], balance: 100, miningSpeed: 1 },
        { id: "node2", name: "Bob", chain: [initialBlock], mempool: [], balance: 100, miningSpeed: 1 },
        { id: "node3", name: "Clayton", chain: [initialBlock], mempool: [], balance: 100, miningSpeed: 1 },
        { id: "node4", name: "Dave", chain: [initialBlock], mempool: [], balance: 100, miningSpeed: 1 },
      ];
      setNodes(initialNodes);
      addLog("Network initialized with 4 peers.", "info");
    };
    initSimulation();
  }, []);

  const updateNodeSpeed = (nodeId: string, speed: number) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, miningSpeed: speed } : n));
  };

  const addTransaction = (from: string, to: string, amount: number): boolean => {
    const sender = nodes.find(n => n.id === from);
    // Simple check: Balance + Pending Transactions not yet mined? 
    // For simplicity in this demo, we check confirmed balance. 
    if (!sender || sender.balance < amount) {
      addLog(`Transaction failed: ${sender?.name} has insufficient funds.`, "error");
      return false;
    }

    const newTx = new Transaction(from, to, amount);

    setNodes((prev) => prev.map(node => ({
      ...node,
      mempool: [...node.mempool, newTx]
    })));
    
    return true;
  };

  const calculateBlockBalanceChange = (block: IBlock, nodeId: string): number => {
    let change = 0;
    block.transactions.forEach(tx => {
      if (tx.fromAddress === nodeId) change -= tx.amount;
      if (tx.toAddress === nodeId) change += tx.amount;
    });
    return change;
  };

  const validateChain = async (chain: IBlock[]): Promise<boolean> => {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      if (current.previousHash !== previous.hash) return false;
      const recalculatedHash = await calculateBlockHash(current);
      if (current.hash !== recalculatedHash) return false;
    }
    return true;
  };

  const mineBlock = async (minerId: string) => {
    const minerNode = nodes.find(n => n.id === minerId);
    if (!minerNode) return;

    addLog(`${minerNode.name} started mining (Diff: ${difficulty})...`, "info");

    const txsToMine = minerNode.mempool.slice(0, 5);
    const lastBlock = minerNode.chain[minerNode.chain.length - 1];
    
    const isMinerChainValid = await validateChain(minerNode.chain);
    if (!isMinerChainValid) {
       addLog(`${minerNode.name} tried to mine on an invalid chain! Operation aborted.`, "error");
       return;
    }

    const newBlockLogic = new Block(Date.now(), txsToMine, lastBlock.hash, minerNode.name);
    
    // Simulate Mining Speed:
    // Real mining is CPU bound. We will simulate "speed" by delaying the start 
    // or adding a fake delay if the CPU is too fast. 
    // For this educational tool, we let the CPU do the work (mineBlock) but we use
    // the difficulty to control the "actual" time.
    
    await newBlockLogic.mineBlock(difficulty); 
    const validBlock = { ...newBlockLogic }; 

    addLog(`${minerNode.name} found Block #${minerNode.chain.length}! Hash: ${validBlock.hash.substring(0, 8)}...`, "success");

    let newMinerChain: IBlock[] = [];

    // 1. Update Miner immediately
    setNodes(prev => prev.map(node => {
        if (node.id === minerId) {
          newMinerChain = [...node.chain, validBlock];
          const txImpact = calculateBlockBalanceChange(validBlock, node.id);
          return {
            ...node,
            chain: newMinerChain,
            mempool: [],
            balance: node.balance + 10 + txImpact
          };
        }
        return node;
    }));

    // 2. Trigger Propagation Visuals
    const newEvents = nodes
      .filter(n => n.id !== minerId)
      .map(n => ({
        id: crypto.randomUUID(),
        from: minerId,
        to: n.id,
        timestamp: Date.now()
      }));
    setPropagationEvents(prev => [...prev, ...newEvents]);

    // Remove events after animation (1s)
    setTimeout(() => {
      setPropagationEvents(prev => prev.filter(e => !newEvents.find(ne => ne.id === e.id)));
    }, 1000);

    // 3. Propagate to peers (Simulated Network Delay)
    // We divide delay by miningSpeed to simulate a "faster connection/processing" 
    const delay = 1500 / minerNode.miningSpeed; 

    setTimeout(async () => {
      addLog(`Propagating new chain from ${minerNode.name} to network...`, "info");
      
      const isNewChainValid = await validateChain(newMinerChain);

      setNodes(prev => prev.map(node => {
        if (node.id === minerId) return node; 

        if (newMinerChain.length > node.chain.length) {
          if (isNewChainValid) {
             const txImpact = calculateBlockBalanceChange(validBlock, node.id);
             return {
               ...node,
               chain: newMinerChain,
               mempool: [],
               balance: node.balance + txImpact 
             };
          } else {
             if (node.id === "node2") { 
                addLog(`REJECTED: ${node.name} detected invalid hash in ${minerNode.name}'s chain.`, "error");
             }
          }
        }
        return node;
      }));
    }, delay);
  };

  const tamperBlock = (nodeId: string, blockIndex: number, txIndex: number, newAmount: number) => {
    setNodes(prev => prev.map(node => {
      if (node.id !== nodeId) return node;

      const newChain = [...node.chain];
      const targetBlock = { ...newChain[blockIndex] };
      const newTransactions = [...targetBlock.transactions];

      newTransactions[txIndex] = {
        ...newTransactions[txIndex],
        amount: newAmount
      };

      targetBlock.transactions = newTransactions;
      newChain[blockIndex] = targetBlock;
      
      addLog(`${node.name} tampered with Block #${blockIndex}! Hash is now invalid.`, "warning");

      return { ...node, chain: newChain };
    }));
  };

  return (
    <SimulationContext.Provider value={{ 
      nodes, 
      logs, 
      difficulty, 
      setDifficulty, 
      propagationEvents,
      updateNodeSpeed,
      addTransaction, 
      mineBlock, 
      tamperBlock 
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error("useSimulation must be used within a SimulationProvider");
  return context;
};