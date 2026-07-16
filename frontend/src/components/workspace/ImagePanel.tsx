"use client";

import { ZoomIn, ZoomOut, RotateCw, Maximize2, RotateCcw, Download } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import GlassCard from "@/components/shared/GlassCard";
import ImageViewer from "./ImageViewer";
import ImageMetadata from "./ImageMetadata";
import type { ImageMetadata as ImageMeta } from "@/types";

interface ImagePanelProps {
  imageSrc: string;
  imageAlt: string;
  metadata: ImageMeta;
  filename: string;
}

export default function ImagePanel({
  imageSrc,
  imageAlt,
  metadata,
  filename,
}: ImagePanelProps) {
  const { imageZoom, imageRotation, setImageZoom, setImageRotation, resetImageTransform } =
    useUIStore();

  const toolbarActions = [
    { icon: ZoomIn, label: "Zoom In", action: () => setImageZoom(imageZoom + 0.2) },
    { icon: ZoomOut, label: "Zoom Out", action: () => setImageZoom(imageZoom - 0.2) },
    { icon: RotateCw, label: "Rotate Right", action: () => setImageRotation(imageRotation + 90) },
    { icon: RotateCcw, label: "Rotate Left", action: () => setImageRotation(imageRotation - 90) },
    { icon: Maximize2, label: "Reset", action: () => resetImageTransform() },
    {
      icon: Download,
      label: "Download",
      action: () => {
        const a = document.createElement("a");
        a.href = imageSrc;
        a.download = filename;
        a.click();
      },
    },
  ];

  return (
    <GlassCard
      className="flex flex-col h-full gap-4"
      padding="p-4"
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-1">
        {toolbarActions.map((action) => (
          <button
            key={action.label}
            onClick={action.action}
            title={action.label}
            className="p-2 rounded-lg hover:bg-vs-surface text-vs-text-muted hover:text-vs-text transition-colors"
          >
            <action.icon size={16} />
          </button>
        ))}
      </div>

      {/* Image Viewer */}
      <div className="flex-1 min-h-0">
        <ImageViewer src={imageSrc} alt={imageAlt} />
      </div>

      {/* Metadata */}
      <ImageMetadata metadata={metadata} filename={filename} />
    </GlassCard>
  );
}
