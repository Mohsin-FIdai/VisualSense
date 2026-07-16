"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { Copy, Check } from "lucide-react";
import { useState, useCallback } from "react";

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const isInline = !match;

  const handleCopy = useCallback(() => {
    const text = String(children).replace(/\n$/, "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [children]);

  if (isInline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded bg-vs-bg-mid text-vs-accent text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative group my-4">
      <div className="flex items-center justify-between px-4 py-2 rounded-t-lg bg-vs-bg-mid border-b border-white/5">
        <span className="text-xs text-vs-text-muted font-mono uppercase">
          {match[1]}
        </span>
        <button
          onClick={handleCopy}
          className="text-vs-text-muted hover:text-vs-text transition-colors p-1 rounded"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <pre className="!mt-0 !rounded-t-none rounded-b-lg bg-vs-bg-mid/80 p-4 overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
      className="prose prose-invert max-w-none text-vs-text text-[15px] leading-relaxed"
      components={{
        code: CodeBlock as never,
        table: ({ children, ...props }) => (
          <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
            <table className="w-full text-sm" {...props}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children, ...props }) => (
          <thead className="bg-vs-bg-mid text-vs-text-secondary" {...props}>
            {children}
          </thead>
        ),
        th: ({ children, ...props }) => (
          <th className="px-4 py-2.5 text-left font-medium border-b border-white/10" {...props}>
            {children}
          </th>
        ),
        td: ({ children, ...props }) => (
          <td className="px-4 py-2 border-b border-white/5" {...props}>
            {children}
          </td>
        ),
        a: ({ children, ...props }) => (
          <a className="text-vs-accent hover:text-vs-primary-light transition-colors underline underline-offset-2" {...props}>
            {children}
          </a>
        ),
        blockquote: ({ children, ...props }) => (
          <blockquote className="border-l-2 border-vs-primary pl-4 my-3 text-vs-text-secondary italic" {...props}>
            {children}
          </blockquote>
        ),
        h1: ({ children, ...props }) => (
          <h1 className="text-2xl font-bold gradient-text mt-6 mb-3" {...props}>{children}</h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="text-xl font-semibold text-vs-text mt-5 mb-2" {...props}>{children}</h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="text-lg font-medium text-vs-text-secondary mt-4 mb-2" {...props}>{children}</h3>
        ),
        ul: ({ children, ...props }) => (
          <ul className="list-disc list-inside space-y-1 my-2 text-vs-text-secondary" {...props}>{children}</ul>
        ),
        ol: ({ children, ...props }) => (
          <ol className="list-decimal list-inside space-y-1 my-2 text-vs-text-secondary" {...props}>{children}</ol>
        ),
        p: ({ children, ...props }) => (
          <p className="my-2 text-vs-text/90" {...props}>{children}</p>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
