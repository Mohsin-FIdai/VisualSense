"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import InsightCards from "./InsightCards";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import SuggestedQuestions from "./SuggestedQuestions";
import ThinkingAnimation from "./ThinkingAnimation";
import { useSessionStore } from "@/stores/session-store";
import { useChat } from "@/hooks/use-chat";
import type { Analysis } from "@/types";

interface ChatPanelProps {
  analysis: Analysis | null;
}

export default function ChatPanel({ analysis }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, isStreaming, streamingContent, suggestedQuestions, isAnalyzing } =
    useSessionStore();
  const { sendMessage } = useChat();

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <GlassCard className="flex flex-col h-full" padding="p-4">
      {/* Scrollable content area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 min-h-0 pr-1"
      >
        {/* Analysis Cards */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-sm font-medium text-vs-text-muted uppercase tracking-wider mb-3">
              AI Analysis
            </h3>
            <InsightCards analysis={analysis} />
          </motion.div>
        )}

        {/* Loading analysis */}
        {isAnalyzing && !analysis && <ThinkingAnimation />}

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="space-y-4 pt-2 border-t border-white/5">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Streaming message */}
            {isStreaming && streamingContent && (
              <ChatMessage
                message={{
                  id: "streaming",
                  session_id: "",
                  role: "assistant",
                  content: streamingContent,
                  created_at: new Date().toISOString(),
                }}
                isStreaming
                streamingContent={streamingContent}
              />
            )}

            {/* Streaming thinking */}
            {isStreaming && !streamingContent && <ThinkingAnimation />}
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="mt-3">
        <SuggestedQuestions
          questions={suggestedQuestions}
          onSelect={handleSuggestedQuestion}
        />
      </div>

      {/* Chat input */}
      <ChatInput onSend={sendMessage} disabled={isStreaming} />
    </GlassCard>
  );
}
