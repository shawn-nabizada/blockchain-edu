import React, { useState } from "react";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface ProgressiveListProps {
  items: string[];
}

export const ProgressiveList: React.FC<ProgressiveListProps> = ({ items }) => {
  const [visibleCount, setVisibleCount] = useState(1);

  const showNext = () => {
    if (visibleCount < items.length) {
      setVisibleCount(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-3 my-4">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -10 }}
          animate={{ 
            opacity: idx < visibleCount ? 1 : 0.3, 
            x: idx < visibleCount ? 0 : -10,
            filter: idx < visibleCount ? "blur(0px)" : "blur(2px)"
          }}
          className={`flex gap-3 p-3 rounded-lg border ${
            idx < visibleCount ? "bg-white border-slate-200" : "bg-transparent border-transparent"
          }`}
        >
          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${idx < visibleCount ? "bg-blue-500" : "bg-slate-300"}`} />
          <p className={`text-base ${idx < visibleCount ? "text-slate-700" : "text-slate-300"}`}>
            {item}
          </p>
        </motion.div>
      ))}

      {visibleCount < items.length && (
        <button
          onClick={showNext}
          className="w-full py-2 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 border-dashed"
        >
          <ArrowDown className="w-4 h-4" />
          Reveal Next Point
        </button>
      )}
    </div>
  );
};