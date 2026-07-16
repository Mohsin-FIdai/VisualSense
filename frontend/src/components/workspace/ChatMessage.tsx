"use client";

import { motion } from "framer-motion";
import { Copy, Check, Sparkles, User } from "lucide-react";
import { useState, useCallback } from "react";
import GlassCard from "@/components/shared/GlassCard";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import StreamingText from "./StreamingText";
import { formatRelativeTime } from "@/lib/utils";
import type { Message } from "@/types";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  streamingContent?: string;
}

export default function ChatMessage({
  message,
  isStreaming = false,
  streamingContent,
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
          isUser
            ? "bg-vs-primary/20 border border-vs-primary/30"
            : "bg-gradient-to-br from-vs-accent/30 to-vs-primary/30 border border-vs-accent/20"
        }`}
      >
        {isUser ? (
          <User size={14} className="text-vs-primary-light" />
        ) : (
          <Sparkles size={14} className="text-vs-accent" />
        )}
      </div>

      {/* Message card */}
      <GlassCard
        className={`max-w-[80%] relative group ${
          isUser
            ? "bg-vs-primary/10 border-vs-primary/15"
            : ""
        }`}
        padding="px-4 py-3"
      >
        {/* Content */}
        <div className="text-sm">
          {isStreaming && streamingContent !== undefined ? (
            <StreamingText content={streamingContent} />
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
          <span className="text-xs text-vs-text-muted">
            {formatRelativeTime(message.created_at)}
          </span>

          {!isUser && !isStreaming && (
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-vs-text-muted hover:text-vs-text p-1 rounded"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
            </button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
