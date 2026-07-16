"use client";

import { motion } from "framer-motion";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export default function SuggestedQuestions({
  questions,
  onSelect,
}: SuggestedQuestionsProps) {
  if (!questions.length) return null;

  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-none"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {questions.map((q, i) => (
        <motion.button
          key={i}
          onClick={() => onSelect(q)}
          className="flex-shrink-0 px-3.5 py-2 rounded-xl glass-subtle text-xs text-vs-text-secondary hover:text-vs-text hover:border-vs-primary/30 transition-all whitespace-nowrap"
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {q}
        </motion.button>
      ))}
    </motion.div>
  );
}
