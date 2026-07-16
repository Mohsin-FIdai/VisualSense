"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
}

const sizeMap = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-5xl",
  xl: "text-7xl",
};

export default function Logo({
  size = "md",
  className,
  animate = true,
}: LogoProps) {
  const Wrapper = animate ? motion.div : "div";

  return (
    <Wrapper
      className={cn("flex items-center gap-3", className)}
      {...(animate
        ? {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: "easeOut" },
          }
        : {})}
    >
      {/* Logo icon — stylized eye */}
      <div className="relative">
        <div
          className={cn(
            "rounded-2xl bg-gradient-to-br from-vs-accent via-vs-primary to-vs-secondary flex items-center justify-center",
            size === "xl" ? "w-16 h-16" : size === "lg" ? "w-12 h-12" : size === "md" ? "w-10 h-10" : "w-8 h-8"
          )}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={cn(
              "text-white",
              size === "xl" ? "w-9 h-9" : size === "lg" ? "w-7 h-7" : size === "md" ? "w-5 h-5" : "w-4 h-4"
            )}
          >
            <path
              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-vs-accent via-vs-primary to-vs-secondary opacity-40 blur-xl -z-10" />
      </div>

      {/* Logo text */}
      <h1 className={cn("font-bold tracking-tight gradient-text", sizeMap[size])}>
        VisualSense
      </h1>
    </Wrapper>
  );
}
