"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/api/upload";
import { useSessionStore } from "@/stores/session-store";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setSession, setAnalysis, setImage } = useSessionStore();

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        const response = await uploadImage(file, setProgress);

        setSession(response.session_id);
        if (response.analysis) {
          setAnalysis(response.analysis);
        }

        router.push(`/workspace/${response.session_id}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setError(message);
      } finally {
        setIsUploading(false);
      }
    },
    [router, setSession, setAnalysis, setImage]
  );

  return { upload, isUploading, progress, error, setError };
}
