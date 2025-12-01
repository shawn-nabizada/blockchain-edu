export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Blockchain",
    definition: "A shared, immutable ledger where transactions are recorded in blocks and linked together via hashes."
  },
  {
    term: "Hash",
    definition: "A digital fingerprint (like SHA-256) that turns data into a unique string of characters. Changing the data changes the hash completely."
  },
  {
    term: "Miner",
    definition: "A computer in the network that performs Proof of Work to verify transactions and create new blocks."
  },
  {
    term: "Node",
    definition: "Any computer connected to the blockchain network. Nodes validate blocks and maintain a copy of the ledger."
  },
  {
    term: "Mempool",
    definition: "The 'waiting room' for transactions that have been broadcast but not yet included in a block."
  },
  {
    term: "Proof of Work",
    definition: "A mechanism that requires miners to solve difficult math puzzles (spending energy) to secure the network."
  },
  {
    term: "Consensus",
    definition: "The process by which independent nodes agree on the current state of the blockchain (e.g., Longest Chain Rule)."
  },
  {
    term: "Decentralization",
    definition: "The transfer of control and decision-making from a centralized entity (individual, organization, or group thereof) to a distributed network."
  }
];