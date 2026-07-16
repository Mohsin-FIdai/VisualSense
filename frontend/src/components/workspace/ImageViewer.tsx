"use client";

import { useRef, useCallback, MouseEvent } from "react";
import { useUIStore } from "@/stores/ui-store";

interface ImageViewerProps {
  src: string;
  alt: string;
}

export default function ImageViewer({ src, alt }: ImageViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const { imageZoom, imageRotation, imagePosition, setImageZoom, setImagePosition, resetImageTransform } =
    useUIStore();

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setImageZoom(imageZoom + delta);
    },
    [imageZoom, setImageZoom]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      isDragging.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setImagePosition({
        x: imagePosition.x + dx,
        y: imagePosition.y + dy,
      });
    },
    [imagePosition, setImagePosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleDoubleClick = useCallback(() => {
    resetImageTransform();
  }, [resetImageTransform]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden rounded-xl bg-vs-bg-darkest/50 flex items-center justify-center"
      style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full object-contain transition-transform duration-150 select-none"
        style={{
          transform: `scale(${imageZoom}) rotate(${imageRotation}deg) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
        }}
        draggable={false}
      />

      {/* Zoom indicator */}
      {imageZoom !== 1 && (
        <div className="absolute bottom-3 right-3 glass-subtle px-2.5 py-1 rounded-lg text-xs text-vs-text-muted">
          {Math.round(imageZoom * 100)}%
        </div>
      )}
    </div>
  );
}
