import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ISlide } from "../../types";
import { CheckCircle2, XCircle } from "lucide-react";

interface LessonSlideProps {
  slide: ISlide;
  onNext: () => void;
  isLast: boolean;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export const LessonSlide: React.FC<LessonSlideProps> = ({ slide, onNext, isLast }) => {
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    setAnswered(false);
    setSelectedIdx(null);
    setIsCorrect(false);
  }, [slide.id]);

  const handleOptionClick = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(idx);
    const correctIndex = slide.question?.correctIndex;
    const correct = correctIndex !== undefined ? idx === correctIndex : true;
    setIsCorrect(correct);
  };

  return (
    <div className="w-full relative z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="bg-slate-900 p-6 sm:text-left">
            <h2 className="text-2xl font-bold text-white tracking-tight">{slide.title}</h2>
          </motion.div>

          {/* Content Body */}
          <div className="p-6 text-base text-slate-700 leading-relaxed space-y-4">
            <motion.div variants={itemVariants}>
              {slide.content}
            </motion.div>
          </div>

          {/* Interaction Section */}
          <div className="p-6 bg-slate-50 border-t border-slate-100">
            {slide.question ? (
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg flex gap-2">
                  <span className="text-xl">🤔</span> 
                  {slide.question.text}
                </h3>
                
                <div className="grid gap-2">
                  {slide.question.options.map((opt, idx) => {
                    let btnClass = "text-left px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm ";
                    
                    if (answered) {
                      if (idx === slide.question?.correctIndex) {
                        btnClass += "bg-green-50 border-green-500 text-green-900 shadow-[0_0_0_1px_rgba(34,197,94,1)]";
                      } else if (idx === selectedIdx && !isCorrect) {
                        btnClass += "bg-red-50 border-red-500 text-red-900";
                      } else {
                        btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                      }
                    } else {
                      btnClass += "bg-white border-slate-200 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 text-slate-700";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={answered}
                        className={btnClass}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {answered && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={`overflow-hidden rounded-xl border ${
                        isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="p-3 flex gap-3 items-start">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className={`font-bold text-sm ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                            {isCorrect ? "That's correct!" : "Not quite..."}
                          </p>
                          <p className="text-slate-700 mt-1 text-sm leading-snug">{slide.question.explanation}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {answered && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={onNext}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
                  >
                    {isLast ? "Enter Sandbox" : "Next Concept"}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.button
                variants={itemVariants}
                onClick={onNext}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
              >
                {isLast ? "Enter Sandbox" : "Next Concept"}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};