"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

export type QuestionType = "text" | "choice" | "rating" | "multi-choice";

export interface Question {
  id: string;
  question_text: string;
  type: QuestionType;
  options: string[] | null;
}

interface SurveyCardProps {
  question: Question;
  answer: any;
  onAnswerChange: (val: any) => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function SurveyCard({
  question,
  answer,
  onAnswerChange,
  onNext,
  onPrev,
  isFirst,
  isLast
}: SurveyCardProps) {

  const toggleChoice = (opt: string) => {
    const current = Array.isArray(answer) ? [...answer] : [];
    if (current.includes(opt)) {
      onAnswerChange(current.filter(i => i !== opt));
    } else {
      onAnswerChange([...current, opt]);
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <textarea
            className="glass-input min-h-[120px] text-white"
            placeholder="Type your answer here..."
            value={answer || ""}
            onChange={(e) => onAnswerChange(e.target.value)}
          />
        );
      case "choice":
      case "multi-choice":
        const isMulti = question.type === "multi-choice";
        return (
          <div className="flex flex-col gap-3">
            {question.options?.map((opt, idx) => {
              const selected = isMulti 
                ? Array.isArray(answer) && answer.includes(opt)
                : answer === opt;
              
              return (
                <button
                  key={idx}
                  onClick={() => isMulti ? toggleChoice(opt) : onAnswerChange(opt)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 backdrop-blur-md flex items-center justify-between ${
                    selected 
                      ? "bg-fuchsia-500/30 border-fuchsia-400 text-white shadow-[0_0_15px_rgba(232,121,249,0.4)]" 
                      : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                  }`}
                >
                  <span className="font-medium text-lg">{opt}</span>
                  {selected && <CheckCircle2 className="w-5 h-5 text-fuchsia-300" />}
                </button>
              );
            })}
          </div>
        );
      case "rating":
        return (
          <div className="flex justify-between items-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => {
              const selected = answer === rating;
              return (
                <button
                  key={rating}
                  onClick={() => onAnswerChange(rating)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 backdrop-blur-md border ${
                    selected
                      ? "bg-gradient-to-br from-cyan-400 to-fuchsia-500 border-white/50 text-white shadow-lg shadow-fuchsia-500/40 scale-110"
                      : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  {rating}
                </button>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  const isAnswerEmpty = () => {
    if (question.type === "multi-choice") {
      return !Array.isArray(answer) || answer.length === 0;
    }
    return !answer;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-panel p-8 sm:p-10 w-full max-w-2xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-white leading-tight">
          {question.question_text}
        </h2>
        
        <div className="mb-10">
          {renderInput()}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              isFirst ? "opacity-30 cursor-not-allowed text-white/50" : "text-white hover:bg-white/10"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <button
            onClick={onNext}
            disabled={isAnswerEmpty()}
            className={`glass-button text-white ${
              isAnswerEmpty() ? "opacity-50" : "bg-gradient-to-r from-fuchsia-600 to-cyan-600 border-transparent shadow-[0_0_15px_rgba(232,121,249,0.3)]"
            }`}
          >
            {isLast ? "Complete Survey" : "Continue"}
            {!isLast && <ArrowRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
