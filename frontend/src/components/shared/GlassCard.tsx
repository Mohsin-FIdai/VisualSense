"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hover?: boolean;
  padding?: string;
}

export default function GlassCard({
  children,
  className,
  glow = false,
  hover = false,
  padding = "p-6",
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass",
        padding,
        glow && "glow-sm",
        className
      )}
      whileHover={
        hover
          ? {
              scale: 1.02,
              borderColor: "rgba(139, 92, 246, 0.3)",
              transition: { duration: 0.2 },
            }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
