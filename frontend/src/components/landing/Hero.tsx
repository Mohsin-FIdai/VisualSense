"use client";

import { motion } from "framer-motion";
import Logo from "@/components/shared/Logo";

export default function Hero() {
  return (
    <motion.div
      className="flex flex-col items-center text-center gap-6 mb-12"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.2 } },
      }}
    >
      <Logo size="xl" />

      <motion.p
        className="text-2xl md:text-3xl font-light gradient-text tracking-wide"
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6 }}
      >
        See Beyond the Pixels.
      </motion.p>

      <motion.p
        className="text-vs-text-muted text-lg max-w-xl leading-relaxed"
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.6 }}
      >
        Upload any image. AI understands everything inside it.
        <br />
        Then ask it anything.
      </motion.p>
    </motion.div>
  );
}
