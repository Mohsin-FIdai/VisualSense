"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  confidence?: number;
  variant?: "default" | "success" | "warning" | "info";
  fullWidth?: boolean;
}

const variantColors = {
  default: "text-vs-accent",
  success: "text-emerald-400",
  warning: "text-amber-400",
  info: "text-sky-400",
};

const variantBg = {
  default: "bg-vs-accent/10",
  success: "bg-emerald-400/10",
  warning: "bg-amber-400/10",
  info: "bg-sky-400/10",
};

export default function InsightCard({
  icon: Icon,
  title,
  children,
  confidence,
  variant = "default",
  fullWidth = false,
}: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={fullWidth ? "col-span-full" : ""}
    >
      <GlassCard
        className="overflow-hidden"
        padding="p-0"
        hover
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", variantBg[variant])}>
                <Icon size={16} className={variantColors[variant]} />
              </div>
              <h4 className="text-sm font-medium text-vs-text">{title}</h4>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-vs-text-muted hover:text-vs-text p-1 transition-colors"
            >
              <ChevronDown
                size={14}
                className={cn("transition-transform", expanded && "rotate-180")}
              />
            </button>
          </div>

          {/* Content */}
          <div
            className={cn(
              "text-sm text-vs-text-secondary overflow-hidden transition-all",
              !expanded && "max-h-24"
            )}
          >
            {children}
          </div>
        </div>

        {/* Confidence bar */}
        {confidence !== undefined && confidence > 0 && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-vs-bg-mid rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    confidence > 0.8
                      ? "bg-emerald-400"
                      : confidence > 0.5
                        ? "bg-amber-400"
                        : "bg-red-400"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
              <span className="text-xs text-vs-text-muted w-10 text-right">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
