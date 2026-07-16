"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImagePlus, Clipboard, AlertCircle } from "lucide-react";
import { useUpload } from "@/hooks/use-upload";
import GlassCard from "@/components/shared/GlassCard";
import LoadingOrb from "@/components/shared/LoadingOrb";

const LOADING_MESSAGES = [
  "Reading pixels...",
  "Finding objects...",
  "Extracting text...",
  "Understanding scene...",
  "Recognizing patterns...",
  "Analyzing relationships...",
  "Generating insights...",
];

export default function UploadZone() {
  const { upload, isUploading, progress, error, setError } = useUpload();
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        upload(acceptedFiles[0]);
      }
    },
    [upload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif", ".bmp", ".tiff"],
    },
    maxSize: 20 * 1024 * 1024,
    multiple: false,
    disabled: isUploading,
    onDropRejected: (rejections) => {
      const msg = rejections[0]?.errors[0]?.message || "Invalid file";
      setError(msg);
    },
  });

  // Paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], "pasted-image.png", { type: imageType });
          upload(file);
          return;
        }
      }
      setError("No image found in clipboard");
    } catch {
      setError("Unable to access clipboard. Try drag & drop or browse.");
    }
  }, [upload, setError]);

  // Keyboard paste listener
  useEffect(() => {
    const handler = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            upload(file);
          }
        }
      }
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [upload]);

  // Cycle loading messages
  useEffect(() => {
    if (!isUploading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isUploading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <GlassCard
        className={`relative overflow-hidden transition-all duration-300 ${
          isDragActive ? "glow border-vs-accent/40 scale-[1.02]" : ""
        } ${error ? "border-red-500/30" : ""}`}
        padding="p-0"
      >
        {isUploading ? (
          /* Upload / Analysis in progress */
          <div className="flex flex-col items-center justify-center py-16 px-8 gap-6">
            <LoadingOrb />

            <AnimatePresence mode="wait">
              <motion.p
                key={loadingMsgIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-vs-text-secondary text-sm"
              >
                {LOADING_MESSAGES[loadingMsgIndex]}
              </motion.p>
            </AnimatePresence>

            {/* Progress bar */}
            <div className="w-full max-w-xs h-1 bg-vs-bg-mid rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-vs-primary to-vs-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(progress, 10)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        ) : (
          /* Drop zone */
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />

            <div className="flex flex-col items-center justify-center py-16 px-8 gap-5">
              {/* Upload icon */}
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vs-accent/20 to-vs-primary/20 flex items-center justify-center border border-vs-primary/20"
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
              >
                <Upload className="w-7 h-7 text-vs-accent" />
              </motion.div>

              <div className="text-center">
                <p className="text-vs-text text-lg font-medium mb-1">
                  {isDragActive ? "Drop your image here" : "Drop your image here"}
                </p>
                <p className="text-vs-text-muted text-sm">
                  or use the options below
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                    input?.click();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-vs-primary to-vs-secondary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <ImagePlus size={16} />
                  Browse Files
                </button>

                <button
                  onClick={handlePaste}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-subtle text-vs-text-secondary text-sm hover:text-vs-text hover:border-vs-primary/30 transition-all"
                >
                  <Clipboard size={16} />
                  Paste
                </button>
              </div>

              {/* Supported formats */}
              <p className="text-xs text-vs-text-muted mt-2">
                Supports JPEG, PNG, WebP, GIF • Max 20MB
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 pb-4"
            >
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-4 py-2.5">
                <AlertCircle size={16} />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient border effect when drag-active */}
        {isDragActive && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none glow-border" />
        )}
      </GlassCard>
    </motion.div>
  );
}
