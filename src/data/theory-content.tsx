import type { ISlide } from "../types";
import { HashPlayground } from "../components/theory/widgets/HashPlayground";
import { NonceMiner } from "../components/theory/widgets/NonceMiner";
import { GossipGraph } from "../components/theory/widgets/GossipGraph";
import { ProgressiveList } from "../components/theory/widgets/ProgressiveList";

export const theorySlides: ISlide[] = [
  {
    id: "intro",
    title: "The Problem of Trust",
    content: (
      <div className="space-y-4">
        <p>
          Imagine you and three friends want to keep track of who owes money to whom.
          You could write it in a shared notebook, but what if one friend sneaks in at night and changes a number?
        </p>
        <ProgressiveList items={[
          "Traditional systems rely on a central 'Manager' (like a Bank).",
          "If the Manager is corrupt or hacked, the system fails.",
          "Blockchain asks: Can we manage the ledger together without trusting any single person?"
        ]} />
      </div>
    ),
  },
  {
    id: "transactions",
    title: "Transactions & The Mempool",
    content: (
      <div className="space-y-4">
        <p>
          A <strong>Transaction</strong> is just a signed message saying "User A sends 5 coins to User B."
        </p>
        <p>
          When you send money, it doesn't go straight into the history books. It enters a waiting area called the <strong>Mempool</strong> (Memory Pool).
        </p>
        <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300 text-center text-slate-500 italic text-sm">
          Think of the Mempool as a "Pending Folder" where transactions wait for a Miner to pick them up.
        </div>
      </div>
    ),
    question: {
      text: "Why do you think transactions wait in a Mempool instead of being instant?",
      options: [
        "To allow time to verify they are valid",
        "Because computers are slow",
        "To let users cancel them"
      ],
      correctIndex: 0,
      explanation: "Exactly. The network needs a moment to check if you actually have the money before creating a permanent record."
    }
  },
  {
    id: "blocks",
    title: "Blocks: The Pages of History",
    content: (
      <div className="space-y-4">
        <p>
          If transactions are individual sentences, a <strong>Block</strong> is a page in the book.
        </p>
        <ProgressiveList items={[
          "Miners grab a handful of transactions from the mempool.",
          "They verify that the senders have enough money.",
          "They glue them together into a Block and seal it.",
          "Once sealed, the block is added to the chain forever."
        ]} />
      </div>
    ),
  },
  {
    id: "hashing",
    title: "Hashes: Digital Fingerprints",
    content: (
      <div className="space-y-4">
        <p>
          How do we stop people from tearing out a page (Block) or rewriting it? We use <strong>Hashes</strong>.
        </p>
        <p>
          A hash is a unique digital fingerprint. If you change even one tiny letter in the data, the hash changes completely.
        </p>
        {/* Interactive Widget 1 */}
        <HashPlayground />
      </div>
    ),
    question: {
      text: "If you change a transaction from 5 years ago, what happens to the latest block?",
      options: [
        "Nothing, it's too old",
        "The latest block's link becomes invalid",
        "The system auto-corrects it"
      ],
      correctIndex: 1,
      explanation: "Correct! The chain is broken. To fake an old record, you would have to re-do the work for EVERY block that came after it."
    }
  },
  {
    id: "pow",
    title: "Proof of Work: The Cost of Truth",
    content: (
      <div className="space-y-4">
        <p>
          Making a block needs to be difficult. If it were instant, a hacker could rewrite history in seconds.
        </p>
        <p>
          <strong>Proof of Work</strong> requires miners to solve a hard math puzzle to "find" a valid hash.
        </p>
        {/* Interactive Widget 2 */}
        <NonceMiner />
      </div>
    ),
    question: {
      text: "Does Proof of Work make the network faster or safer?",
      options: [
        "Faster",
        "Safer",
        "Both"
      ],
      correctIndex: 1,
      explanation: "Safer! It deliberately slows things down so that no single person can overwhelm the system."
    }
  },
  {
    id: "nodes",
    title: "Nodes: Strength in Numbers",
    content: (
      <div className="space-y-4">
        <p>
          A <strong>Node</strong> is just a computer running the blockchain software. Every node keeps its own copy of the ledger.
        </p>
        <p>
          When a new block is found, it spreads across the network using a "Gossip Protocol."
        </p>
        {/* Interactive Widget 3 */}
        <GossipGraph />
      </div>
    ),
    question: {
      text: "What happens if one node goes offline?",
      options: [
        "The network stops",
        "Data is lost",
        "The network continues normally"
      ],
      correctIndex: 2,
      explanation: "Right. Because every node has a copy, the network is incredibly resilient."
    }
  },
  {
    id: "consensus",
    title: "Consensus: Agreeing on Truth",
    content: (
      <div className="space-y-4">
        <p>
          Sometimes, two miners find a block at the exact same time. The network briefly splits into two paths!
        </p>
        <p>
          The rule to fix this is the <strong>Longest Chain Rule</strong>. Nodes always trust the chain with the most work put into it.
        </p>
      </div>
    ),
    question: {
      text: "If you see two valid chains, which one should you follow?",
      options: [
        "The newest one",
        "The longest one",
        "The one with my transaction"
      ],
      correctIndex: 1,
      explanation: "The longest one represents the most computational effort, so it is the one the network will eventually settle on."
    }
  },
  {
    id: "transition",
    title: "Your Turn to Mine",
    content: (
      <div className="space-y-4">
        <p>
          Enough theory. You are about to enter the Sandbox.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
          <h3 className="font-bold text-blue-800 mb-2">Your Mission:</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-700">
            <li>Send transactions between Alice, Bob, and others.</li>
            <li>Mine blocks to secure those transactions.</li>
            <li><strong>Try to break it!</strong> Edit a block and see if the network rejects your lie.</li>
          </ul>
        </div>
      </div>
    ),
  }
];