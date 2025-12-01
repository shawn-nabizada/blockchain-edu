import React, { useState, useEffect, useCallback } from "react";
import { LessonSlide } from "../components/theory/LessonSlide";
import { DrawingCanvas } from "../components/theory/DrawingCanvas";
import { theorySlides } from "../data/theory-content";
import { glossaryTerms } from "../data/glossary";
import { ArrowRight, BookOpen, Moon, Sun, Book, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroProps {
  onComplete: () => void;
}

export const Introduction: React.FC<IntroProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  
  const [drawings, setDrawings] = useState<Record<string, string>>({});

  const handleNext = useCallback(() => {
    if (currentIndex < theorySlides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(); 
    }
  }, [currentIndex, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentSlide = theorySlides[currentIndex];

  return (
    <div className={`h-screen flex overflow-hidden transition-colors duration-500 ${isDark ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
      
      {/* LEFT PANEL: Added 'shrink-0' to prevent layout shifting */}
      <div className={`w-[45%] shrink-0 h-full flex flex-col relative z-10 border-r shadow-xl overflow-y-auto transition-colors duration-500 ${isDark ? "bg-slate-900/50 border-slate-700" : "bg-slate-50/50 border-slate-200"}`}>
        
        {/* Header Section */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg shadow-sm border transition-colors ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                <BookOpen className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <div>
                <h1 className="font-bold text-xl leading-tight">Blockchain Basics</h1>
                <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>Lesson {currentIndex + 1} of {theorySlides.length}</p>
              </div>
            </div>
            
            {/* Top Controls */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-800 text-yellow-400" : "hover:bg-slate-200 text-slate-600"}`}
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setShowGlossary(true)}
                className={`p-2 rounded-full transition-colors ${isDark ? "hover:bg-slate-800 text-blue-400" : "hover:bg-slate-200 text-blue-600"}`}
                title="Open Glossary"
              >
                <Book className="w-5 h-5" />
              </button>

              <button 
                onClick={onComplete}
                className={`text-xs font-bold flex items-center gap-1 transition-colors px-3 py-1.5 rounded-full ${isDark ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`}
              >
                Skip <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Progress Chain */}
          <div className="flex items-center gap-1 mb-4 pl-1">
            {theorySlides.map((slide, idx) => {
              const isActive = idx === currentIndex;
              const isCompleted = idx < currentIndex;
              
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && (
                    <div className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                      isCompleted ? "bg-blue-500" : (isDark ? "bg-slate-700" : "bg-slate-200")
                    }`} />
                  )}
                  <button 
                    onClick={() => setCurrentIndex(idx)}
                    title={slide.title}
                    className={`w-4 h-4 rounded transition-all duration-300 border-2 cursor-pointer relative group shrink-0 ${
                      isActive 
                        ? "bg-white border-blue-600 scale-125 shadow-lg shadow-blue-500/20 z-10" 
                        : isCompleted 
                          ? "bg-blue-500 border-blue-500 hover:bg-blue-600" 
                          : (isDark ? "bg-slate-800 border-slate-600 hover:border-blue-400" : "bg-slate-100 border-slate-300 hover:border-blue-400")
                    }`} 
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 px-8 pb-12">
           <LessonSlide 
            slide={currentSlide} 
            onNext={handleNext}
            isLast={currentIndex === theorySlides.length - 1}
          />
        </div>
      </div>

      {/* RIGHT PANEL: Drawing Canvas */}
      <div className="flex-1 h-full relative">
        <DrawingCanvas 
          isDark={isDark} 
          savedData={drawings[currentSlide.id] || null}
          onSave={(data) => setDrawings(prev => ({ ...prev, [currentSlide.id]: data }))}
        />
      </div>

      {/* GLOSSARY MODAL */}
      <AnimatePresence>
        {showGlossary && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGlossary(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed right-0 top-0 bottom-0 z-50 w-96 shadow-2xl p-6 overflow-y-auto border-l ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Book className="w-5 h-5 text-blue-500" />
                  Glossary
                </h2>
                <button onClick={() => setShowGlossary(false)} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                {glossaryTerms.map((item) => (
                  <div key={item.term}>
                    <h3 className="font-bold text-blue-500 mb-1">{item.term}</h3>
                    <p className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                      {item.definition}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};