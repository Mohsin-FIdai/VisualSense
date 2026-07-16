"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import LoadingOrb from "@/components/shared/LoadingOrb";

const MESSAGES = [
  "Reading pixels...",
  "Finding objects...",
  "Extracting text...",
  "Understanding scene...",
  "Recognizing patterns...",
  "Analyzing relationships...",
  "Generating insights...",
];

export default function ThinkingAnimation() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <LoadingOrb />
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-vs-text-secondary text-sm font-light"
        >
          {MESSAGES[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
