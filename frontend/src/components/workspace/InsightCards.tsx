"use client";

import { motion } from "framer-motion";
import {
  Eye, Box, FileText, Globe, Palette, Users, Award, Shield,
  BarChart3, Table, PenTool, Sparkles,
} from "lucide-react";
import InsightCard from "./InsightCard";
import type { Analysis } from "@/types";

interface InsightCardsProps {
  analysis: Analysis;
}

export default function InsightCards({ analysis }: InsightCardsProps) {
  const cards = buildCards(analysis);

  if (cards.length === 0) return null;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {cards.map((card, i) => (
        <InsightCard
          key={i}
          icon={card.icon}
          title={card.title}
          confidence={card.confidence}
          variant={card.variant}
          fullWidth={card.fullWidth}
        >
          {card.content}
        </InsightCard>
      ))}
    </motion.div>
  );
}

function buildCards(analysis: Analysis) {
  const cards: {
    icon: typeof Eye;
    title: string;
    content: React.ReactNode;
    confidence?: number;
    variant?: "default" | "success" | "warning" | "info";
    fullWidth?: boolean;
  }[] = [];

  if (analysis.scene_summary) {
    cards.push({
      icon: Eye,
      title: "Scene Summary",
      content: <p>{analysis.scene_summary}</p>,
      fullWidth: true,
    });
  }

  if (analysis.objects?.length) {
    cards.push({
      icon: Box,
      title: "Objects Detected",
      content: (
        <div className="flex flex-wrap gap-1.5">
          {analysis.objects.map((obj, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-vs-primary/15 text-vs-accent text-xs">
              {obj}
            </span>
          ))}
        </div>
      ),
      variant: "info",
    });
  }

  if (analysis.ocr_text) {
    cards.push({
      icon: FileText,
      title: "Extracted Text",
      content: <p className="font-mono text-xs whitespace-pre-wrap">{analysis.ocr_text}</p>,
    });
  }

  if (analysis.languages?.length) {
    cards.push({
      icon: Globe,
      title: "Languages",
      content: (
        <div className="flex flex-wrap gap-1.5">
          {analysis.languages.map((lang, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-sky-400/15 text-sky-300 text-xs">
              {lang}
            </span>
          ))}
        </div>
      ),
      variant: "info",
    });
  }

  if (analysis.colors?.length) {
    cards.push({
      icon: Palette,
      title: "Dominant Colors",
      content: (
        <div className="flex items-center gap-2">
          {analysis.colors.map((color, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs font-mono text-vs-text-muted">{color}</span>
            </div>
          ))}
        </div>
      ),
    });
  }

  if (analysis.faces && analysis.faces.count > 0) {
    cards.push({
      icon: Users,
      title: `Faces (${analysis.faces.count})`,
      content: <p>{analysis.faces.details}</p>,
    });
  }

  if (analysis.logos?.length) {
    cards.push({
      icon: Award,
      title: "Logos & Brands",
      content: (
        <div className="flex flex-wrap gap-1.5">
          {analysis.logos.map((logo, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 text-xs">
              {logo}
            </span>
          ))}
        </div>
      ),
      variant: "warning",
    });
  }

  if (analysis.safety) {
    cards.push({
      icon: Shield,
      title: "Safety",
      content: (
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-md text-xs font-medium ${
              analysis.safety.is_safe
                ? "bg-emerald-400/15 text-emerald-300"
                : "bg-red-400/15 text-red-300"
            }`}
          >
            {analysis.safety.is_safe ? "Safe" : "Flagged"}
          </span>
        </div>
      ),
      variant: analysis.safety.is_safe ? "success" : "warning",
    });
  }

  if (analysis.charts) {
    cards.push({
      icon: BarChart3,
      title: "Charts & Graphs",
      content: <p>{analysis.charts}</p>,
    });
  }

  if (analysis.tables) {
    cards.push({
      icon: Table,
      title: "Tables",
      content: <p>{analysis.tables}</p>,
    });
  }

  if (analysis.handwriting) {
    cards.push({
      icon: PenTool,
      title: "Handwriting",
      content: <p className="font-mono text-xs whitespace-pre-wrap">{analysis.handwriting}</p>,
    });
  }

  if (analysis.quality) {
    cards.push({
      icon: Sparkles,
      title: "Image Quality",
      content: (
        <span
          className={`px-2 py-0.5 rounded-md text-xs font-medium ${
            analysis.quality === "high"
              ? "bg-emerald-400/15 text-emerald-300"
              : analysis.quality === "medium"
                ? "bg-amber-400/15 text-amber-300"
                : "bg-red-400/15 text-red-300"
          }`}
        >
          {analysis.quality.charAt(0).toUpperCase() + analysis.quality.slice(1)}
        </span>
      ),
      confidence: analysis.confidence ?? undefined,
      variant: "success",
    });
  }

  return cards;
}
