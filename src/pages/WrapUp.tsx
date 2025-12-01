import React, { useState } from "react";
import { CheckCircle, AlertTriangle, ArrowRight, Globe, Zap, HelpCircle, ChevronDown, ChevronUp, Key, Eye, Briefcase, Database, Link as LinkIcon, XCircle } from "lucide-react";

interface WrapUpProps {
  onRestart: () => void;
}

export const WrapUp: React.FC<WrapUpProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-slate-900">Mission Complete</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
             You've successfully simulated a decentralized network. But how does this compare to the $1 trillion ecosystem out there?
          </p>
        </div>

        {/* Section 1: Sandbox vs Reality */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6" />
              In Our Sandbox
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span>4 Nodes (Alice, Bob, Clayton, Dave)</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Instant transactions via memory</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Difficulty = 3 (Takes ~1 second)</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Simple currency transfer only</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 p-8 rounded-2xl shadow-xl text-white">
            <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6" />
              In The Real World
            </h2>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>10,000+ Nodes globally</span>
              </li>
              <li className="flex gap-3">
                <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>P2P Gossip Protocol (Takes seconds to propagate)</span>
              </li>
              <li className="flex gap-3">
                <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Difficulty Adjusts (Bitcoin takes ~10 mins)</span>
              </li>
              <li className="flex gap-3">
                <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Smart Contracts (Code that runs on chain)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Reality Check */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Why isn't everything on a Blockchain?
          </h3>
          <p className="text-amber-800 leading-relaxed mb-4">
            Blockchains are <strong>slow</strong> and <strong>expensive</strong> by design.
            Because every node must verify every transaction, the network can only move as fast as its slowest computer.
          </p>
          <p className="text-amber-800 font-medium">
            Use Blockchain for: <span className="text-amber-900">Censorship resistance, Trustless money, Digital ownership.</span>
            <br />
            Use Database for: <span className="text-amber-900">High speed data, Privacy, Large file storage.</span>
          </p>
        </div>

        {/* Section 3: Critical Thinking Challenges */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-slate-900">Critical Thinking Challenges</h3>
          <div className="space-y-4">
            <QuestionCard 
              question="1. The Cost of Trust"
              text="We learned that Proof of Work costs energy and time. If a government offered to run the ledger for free, saving all that energy, would it still be a blockchain?"
              hint="Think about the definition of 'Trust'. If the government runs it, who is the 'Manager'? Does this violate the core goal of decentralization?"
              answer="Likely not. If a single entity (the government) runs the ledger, it becomes a Centralized Database. The core value of a blockchain is that no single entity can censor transactions or rewrite history. By giving control to the government, you re-introduce the 'Manager' we tried to remove, sacrificing censorship resistance for efficiency."
            />
            <QuestionCard 
              question="2. The Immutable Past"
              text="You saw how changing one block breaks the chain (Domino effect). If someone accidentally uploads illegal content or sensitive personal data to the blockchain, how can we remove it? Is 'immutability' always good?"
              hint="This is a major unresolved conflict between Blockchain tech and laws like GDPR (Right to be Forgotten). If you can't delete it, you might have to 'fork' the chain to ignore it."
              answer="Immutability is a double-edged sword. You generally CANNOT remove data from a blockchain without breaking the chain. To 'delete' it, the majority of the network would have to agree to ignore that specific block and rebuild the chain from that point (a Hard Fork). This makes blockchains terrible for storing secrets or private data."
            />
            <QuestionCard 
              question="3. The 51% Scenario"
              text="In our sandbox, we followed the 'Longest Chain Rule'. What would happen if you controlled 3 out of the 4 nodes in the network? Could you rewrite history?"
              hint="Yes. This is called a 51% Attack. If you have the majority of the computing power, you can write a longer chain faster than the honest nodes, effectively rewriting reality."
              answer="Yes, you could. If you control >50% of the computing power, you can mine blocks faster than the rest of the network combined. You could secretly mine a private chain that reverses your own transactions (Double Spending) and then broadcast it. Since it's longer (has more work), the honest nodes would be forced to accept your fake history as the truth."
            />
            <QuestionCard 
              question="4. Scaling Limits"
              text="We saw transactions wait in a 'Mempool'. Why don't we just make blocks 100x bigger or produce them every 0.1 seconds to handle all global transactions instantly?"
              hint="If blocks are huge, only supercomputers can store them. If blocks are too fast, slow internet connections will miss updates. This pushes 'regular people' out of the network, hurting decentralization."
              answer="This is the 'Scalability Trilemma'. If blocks are too big or too fast, the file size of the blockchain grows massively (Terabytes per week). Only expensive data centers could afford to run a Node. Regular users would drop out, and the network would become centralized around a few rich companies, defeating the purpose of a blockchain."
            />
            
            {/* The CEO Scenario Simulator */}
            <ScenarioCard />
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-12 text-center">
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto"
          >
            Start Over
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

// 1. Question Card
const QuestionCard = ({ question, text, hint, answer }: { question: string; text: string; hint: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div 
      className={`bg-white border rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? "border-blue-300 shadow-md" : "border-slate-200 hover:shadow-sm"}`}
    >
      <div 
        className="p-6 flex justify-between items-start gap-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-4">
          <div className={`mt-1 p-2 rounded-lg transition-colors ${isOpen ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500"}`}>
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">{question}</h4>
            <p className="text-slate-600 leading-relaxed">{text}</p>
          </div>
        </div>
        <div className="mt-2 text-slate-400">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      {/* Expandable Section */}
      {isOpen && (
        <div className="px-6 pb-6 pl-22 animate-in fade-in slide-in-from-top-2 duration-200 space-y-6">
          <div className="bg-slate-50 border-l-4 border-blue-400 p-4 rounded-r-lg text-slate-700 text-sm leading-relaxed">
            <span className="font-bold text-blue-600 uppercase text-xs tracking-wider block mb-1 items-center gap-1">
              <Key className="w-3 h-3" /> Thought Starter
            </span>
            {hint}
          </div>

          {!showAnswer ? (
            <button 
              onClick={() => setShowAnswer(true)}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full border border-slate-200"
            >
              <Eye className="w-4 h-4" />
              Reveal Answer
            </button>
          ) : (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg text-slate-800 text-sm leading-relaxed animate-in fade-in zoom-in-95 duration-300">
              <span className="font-bold text-emerald-700 uppercase text-xs tracking-wider block mb-1 items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Answer
              </span>
              {answer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 2. CEO Scenario Simulator
const ScenarioCard = () => {
  const [choice, setChoice] = useState<"db" | "chain" | null>(null);

  return (
    <div className="bg-linear-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden shadow-xl text-white border border-slate-700">
      <div className="p-6 border-b border-slate-700/50">
        <h4 className="font-bold text-lg flex items-center gap-2 mb-2 text-blue-300">
          <Briefcase className="w-5 h-5" /> 
          5. CEO Simulator
        </h4>
        <p className="text-slate-300 leading-relaxed">
          You are the CTO of <strong>LuxBag</strong>, a global luxury handbag brand. 
          Cheap counterfeits are ruining your reputation. Customers want to verify that the bag they bought in Tokyo is 100% authentic.
        </p>
        <p className="mt-4 font-bold text-white">Which technology stack do you choose?</p>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Option A: Database */}
        <button 
          onClick={() => setChoice("db")}
          className={`p-6 text-left transition-all h-full ${choice === "db" ? "bg-slate-800/50" : "hover:bg-slate-800/30"}`}
        >
          {choice === "db" ? (
            <div className="flex flex-col justify-center h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-3 text-red-400">
                <XCircle className="w-8 h-8" />
                <h5 className="font-bold text-xl">Bad Choice</h5>
              </div>
              <p className="text-sm text-red-100 leading-relaxed mb-4">
                Customers have to <strong>trust you</strong> not to edit the database. What if a corrupt employee adds fake bags to the official list? The history isn't verifiable.
              </p>
              <span 
                onClick={(e) => { e.stopPropagation(); setChoice(null); }} 
                className="text-xs font-bold underline hover:text-white cursor-pointer"
              >
                Try Again
              </span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-colors">
                  <Database className="w-6 h-6 text-slate-300" />
                </div>
                <span className="font-bold">Private SQL Database</span>
              </div>
              <p className="text-sm text-slate-400">
                We host a secure server. When a bag is made, we add a record. Customers scan a QR code to check our server.
              </p>
            </>
          )}
        </button>

        {/* Option B: Blockchain */}
        <button 
          onClick={() => setChoice("chain")}
          className={`p-6 text-left transition-all h-full border-l border-slate-700 ${choice === "chain" ? "bg-slate-800/50" : "hover:bg-slate-800/30"}`}
        >
          {choice === "chain" ? (
            <div className="flex flex-col justify-center h-full animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
                <h5 className="font-bold text-xl">Correct!</h5>
              </div>
              <p className="text-sm text-emerald-100 leading-relaxed">
                Even if <strong>LuxBag</strong> goes bankrupt, the proof of authenticity lives forever. The "slowness" is worth the <strong>trustless verification</strong>.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-colors">
                  <LinkIcon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="font-bold">Public Blockchain</span>
              </div>
              <p className="text-sm text-slate-400">
                We issue a "Digital Token" (NFT) for every bag. The history of ownership is tracked on Ethereum.
              </p>
            </>
          )}
        </button>
      </div>
    </div>
  );
};