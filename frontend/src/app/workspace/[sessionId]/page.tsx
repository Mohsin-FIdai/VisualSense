"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { getSession } from "@/lib/api/session";
import { useSessionStore } from "@/stores/session-store";
import { API_BASE_URL } from "@/lib/api/client";
import ImagePanel from "@/components/workspace/ImagePanel";
import ChatPanel from "@/components/workspace/ChatPanel";
import ThinkingAnimation from "@/components/workspace/ThinkingAnimation";
import Logo from "@/components/shared/Logo";
import type { SessionDetail, ImageMetadata } from "@/types";

export default function WorkspacePage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSessionData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    setSession,
    setImage,
    setMessages,
    setAnalysis,
    setSuggestedQuestions,
    setIsAnalyzing,
    analysis,
  } = useSessionStore();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let pollCount = 0;
    const MAX_POLLS = 20; // 60 seconds max

    async function loadBackground() {
      try {
        const data = await getSession(sessionId);
        if (data.analysis) {
          if (data.analysis.status === "failed") {
            setIsAnalyzing(false);
            setError(`Analysis failed: ${data.analysis.error || "Model error. Try again."}`);
          } else {
            setSessionData(data);
            setAnalysis(data.analysis);
            setIsAnalyzing(false);
            if (data.analysis.suggested_questions) {
              setSuggestedQuestions(data.analysis.suggested_questions);
            }
          }
        } else {
          pollCount++;
          if (pollCount < MAX_POLLS) {
            timeoutId = setTimeout(loadBackground, 3000);
          } else {
            setIsAnalyzing(false);
            setError("Analysis timed out. Please try uploading the image again.");
          }
        }
      } catch (e) {
        pollCount++;
        if (pollCount < MAX_POLLS) {
          timeoutId = setTimeout(loadBackground, 3000);
        } else {
          setIsAnalyzing(false);
          setError("Failed to connect to the server.");
        }
      }
    }

    async function load() {
      try {
        setLoading(true);
        const data = await getSession(sessionId);
        setSessionData(data);
        setSession(sessionId);

        if (data.image) {
          setImage(data.image);
        }
        if (data.messages) {
          setMessages(data.messages);
        }
        if (data.analysis) {
          if (data.analysis.status === "failed") {
            setIsAnalyzing(false);
            setError(`Analysis failed: ${data.analysis.error || "Model error. Try again."}`);
          } else {
            setAnalysis(data.analysis);
            setIsAnalyzing(false);
            if (data.analysis.suggested_questions) {
              setSuggestedQuestions(data.analysis.suggested_questions);
            }
          }
        } else {
          // Start polling for background analysis
          setIsAnalyzing(true);
          timeoutId = setTimeout(loadBackground, 3000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) load();

    return () => clearTimeout(timeoutId);
  }, [sessionId, setSession, setImage, setMessages, setAnalysis, setSuggestedQuestions, setIsAnalyzing]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <Logo size="md" />
        <ThinkingAnimation />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Logo size="md" />
        <p className="text-vs-text-muted text-sm">
          {error || "Session not found"}
        </p>
        <a
          href="/"
          className="px-4 py-2 rounded-xl bg-vs-primary/20 text-vs-accent text-sm hover:bg-vs-primary/30 transition-colors"
        >
          Start New Analysis
        </a>
      </div>
    );
  }

  const imageSrc = session.image
    ? `${API_BASE_URL}/${session.image.storage_path}`
    : "";

  const metadata: ImageMetadata = session.image
    ? {
        width: session.image.width,
        height: session.image.height,
        file_size: session.image.file_size,
        mime_type: session.image.mime_type,
        format: session.image.mime_type.split("/")[1]?.toUpperCase() || null,
        exif: session.image.exif_data,
      }
    : { width: null, height: null, file_size: 0, mime_type: "", format: null, exif: null };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <motion.header
        className="flex items-center justify-between px-6 py-3 border-b border-white/5"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <a href="/">
          <Logo size="sm" animate={false} />
        </a>
        <h2 className="text-sm text-vs-text-muted truncate max-w-md">
          {session.title}
        </h2>
      </motion.header>

      {/* Workspace */}
      <motion.div
        className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Left — Image Panel */}
        {session.image && (
          <div className="w-full lg:w-[40%] h-[40vh] lg:h-full">
            <ImagePanel
              imageSrc={imageSrc}
              imageAlt={session.image.original_name}
              metadata={metadata}
              filename={session.image.original_name}
            />
          </div>
        )}

        {/* Right — Chat Panel */}
        <div className="flex-1 min-h-0">
          <ChatPanel analysis={analysis} />
        </div>
      </motion.div>
    </div>
  );
}
