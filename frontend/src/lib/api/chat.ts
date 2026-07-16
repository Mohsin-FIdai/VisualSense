import { API_BASE_URL } from "./client";
import type { SSEEvent } from "@/types";

export async function sendMessageStream(
  sessionId: string,
  message: string,
  onChunk: (content: string) => void,
  onDone: (fullContent: string, suggestedQuestions: string[]) => void,
  onError: (error: string) => void
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!response.ok) {
    const err = await response.text();
    onError(err || "Failed to send message");
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError("No response stream available");
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;

      const jsonStr = trimmed.slice(6);
      if (!jsonStr) continue;

      try {
        const event: SSEEvent = JSON.parse(jsonStr);

        switch (event.type) {
          case "chunk":
            if (event.content) onChunk(event.content);
            break;
          case "done":
            onDone(event.content || "", event.suggested_questions || []);
            break;
          case "error":
            onError(event.content || "Unknown error");
            break;
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }
}
