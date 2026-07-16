"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }, []);

  return (
    <div className="glass-strong p-3 rounded-2xl">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about this image..."
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-vs-text text-sm placeholder:text-vs-text-muted resize-none outline-none py-2 px-1 max-h-40"
        />

        <motion.button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background:
              value.trim() && !disabled
                ? "linear-gradient(135deg, #7C3AED, #A855F7)"
                : "rgba(139, 92, 246, 0.1)",
          }}
          whileHover={value.trim() && !disabled ? { scale: 1.05 } : {}}
          whileTap={value.trim() && !disabled ? { scale: 0.95 } : {}}
        >
          <ArrowUp size={16} className="text-white" />
        </motion.button>
      </div>
    </div>
  );
}
