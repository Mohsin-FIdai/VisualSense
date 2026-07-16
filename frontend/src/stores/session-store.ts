import { create } from "zustand";
import type { ImageData, Message, Analysis } from "@/types";

interface SessionState {
  sessionId: string | null;
  image: ImageData | null;
  messages: Message[];
  analysis: Analysis | null;
  isAnalyzing: boolean;
  isStreaming: boolean;
  streamingContent: string;
  suggestedQuestions: string[];

  setSession: (id: string) => void;
  setImage: (image: ImageData) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  updateStreamingContent: (content: string) => void;
  appendStreamingContent: (chunk: string) => void;
  clearStreaming: () => void;
  setAnalysis: (analysis: Analysis) => void;
  setSuggestedQuestions: (questions: string[]) => void;
  setIsAnalyzing: (v: boolean) => void;
  setIsStreaming: (v: boolean) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: null,
  image: null,
  messages: [],
  analysis: null,
  isAnalyzing: false,
  isStreaming: false,
  streamingContent: "",
  suggestedQuestions: [],

  setSession: (id) => set({ sessionId: id }),
  setImage: (image) => set({ image }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  updateStreamingContent: (content) => set({ streamingContent: content }),
  appendStreamingContent: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),
  clearStreaming: () => set({ streamingContent: "", isStreaming: false }),
  setAnalysis: (analysis) =>
    set({
      analysis,
      suggestedQuestions: analysis.suggested_questions || [],
    }),
  setSuggestedQuestions: (questions) => set({ suggestedQuestions: questions }),
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),
  setIsStreaming: (v) => set({ isStreaming: v }),
  reset: () =>
    set({
      sessionId: null,
      image: null,
      messages: [],
      analysis: null,
      isAnalyzing: false,
      isStreaming: false,
      streamingContent: "",
      suggestedQuestions: [],
    }),
}));
