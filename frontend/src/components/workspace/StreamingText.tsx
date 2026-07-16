"use client";

import MarkdownRenderer from "@/components/shared/MarkdownRenderer";

interface StreamingTextProps {
  content: string;
}

export default function StreamingText({ content }: StreamingTextProps) {
  return (
    <div className="relative">
      <MarkdownRenderer content={content} />
      <span className="inline-block w-0.5 h-5 bg-vs-accent animate-pulse ml-0.5 align-middle" />
    </div>
  );
}
