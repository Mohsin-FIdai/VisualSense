"use client";

import { formatFileSize } from "@/lib/utils";
import type { ImageMetadata as ImageMeta } from "@/types";
import { FileImage, Ruler, HardDrive } from "lucide-react";

interface ImageMetadataProps {
  metadata: ImageMeta;
  filename: string;
}

export default function ImageMetadata({ metadata, filename }: ImageMetadataProps) {
  const items = [
    {
      icon: FileImage,
      label: "File",
      value: filename,
    },
    {
      icon: Ruler,
      label: "Dimensions",
      value: metadata.width && metadata.height
        ? `${metadata.width} × ${metadata.height}`
        : "Unknown",
    },
    {
      icon: HardDrive,
      label: "Size",
      value: formatFileSize(metadata.file_size),
    },
  ];

  return (
    <div className="glass-subtle p-4 rounded-xl space-y-3">
      <h3 className="text-xs font-medium text-vs-text-muted uppercase tracking-wider">
        Image Info
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <item.icon size={14} className="text-vs-text-muted flex-shrink-0" />
            <span className="text-xs text-vs-text-muted w-16">{item.label}</span>
            <span className="text-xs text-vs-text-secondary truncate">
              {item.value}
            </span>
          </div>
        ))}
        {metadata.format && (
          <div className="mt-2">
            <span className="inline-flex px-2 py-0.5 rounded-md bg-vs-primary/15 text-vs-accent text-xs font-mono">
              {metadata.format.toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
