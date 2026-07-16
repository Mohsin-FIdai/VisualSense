"use client";

import { useCallback } from "react";
import { sendMessageStream } from "@/lib/api/chat";
import { useSessionStore } from "@/stores/session-store";

export function useChat() {
  const {
    sessionId,
    isStreaming,
    setIsStreaming,
    addMessage,
    appendStreamingContent,
    clearStreaming,
    setSuggestedQuestions,
  } = useSessionStore();

  const sendMessage = useCallback(
    async (message: string) => {
      if (!sessionId || isStreaming) return;

      // Add user message immediately
      addMessage({
        id: crypto.randomUUID(),
        session_id: sessionId,
        role: "user",
        content: message,
        created_at: new Date().toISOString(),
      });

      setIsStreaming(true);

      await sendMessageStream(
        sessionId,
        message,
        // onChunk
        (chunk) => {
          appendStreamingContent(chunk);
        },
        // onDone
        (fullContent, suggestedQuestions) => {
          // Add assistant message
          addMessage({
            id: crypto.randomUUID(),
            session_id: sessionId,
            role: "assistant",
            content: fullContent,
            created_at: new Date().toISOString(),
          });
          clearStreaming();
          setSuggestedQuestions(suggestedQuestions);
        },
        // onError
        (error) => {
          addMessage({
            id: crypto.randomUUID(),
            session_id: sessionId,
            role: "assistant",
            content: `⚠️ An error occurred: ${error}`,
            created_at: new Date().toISOString(),
          });
          clearStreaming();
        }
      );
    },
    [
      sessionId,
      isStreaming,
      setIsStreaming,
      addMessage,
      appendStreamingContent,
      clearStreaming,
      setSuggestedQuestions,
    ]
  );

  return { sendMessage, isStreaming };
}
