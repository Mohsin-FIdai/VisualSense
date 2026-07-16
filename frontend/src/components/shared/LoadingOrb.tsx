"use client";

import { motion } from "framer-motion";

export default function LoadingOrb() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-vs-accent to-vs-primary opacity-60 blur-md"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-vs-secondary to-vs-accent opacity-50 blur-sm"
        animate={{
          scale: [1.2, 0.8, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-8 h-8 rounded-full bg-gradient-to-b from-vs-primary-light to-vs-primary opacity-80"
        animate={{
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
