"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/stores/ui-store";

export default function DynamicBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mousePosition, scrollPosition } = useUIStore();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      useUIStore.getState().setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    const handleScroll = () => {
      useUIStore.getState().setScrollPosition(window.scrollY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Shift hue based on scroll position for color cycling
  const hueShift = (scrollPosition * 0.05) % 60;
  const mx = mousePosition.x * 0.02;
  const my = mousePosition.y * 0.02;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ background: "#050208" }}
    >
      {/* Primary gradient orb */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, hsl(${270 + hueShift}, 70%, 25%) 0%, transparent 70%)`,
          top: `${-20 + my}%`,
          left: `${-10 + mx}%`,
          transition: "top 0.3s ease-out, left 0.3s ease-out",
        }}
      />

      {/* Secondary gradient orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, hsl(${250 + hueShift}, 60%, 30%) 0%, transparent 70%)`,
          bottom: `${-15 - my * 0.5}%`,
          right: `${-10 - mx * 0.5}%`,
          transition: "bottom 0.3s ease-out, right 0.3s ease-out",
        }}
      />

      {/* Accent orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, hsl(${285 + hueShift}, 80%, 35%) 0%, transparent 70%)`,
          top: `${50 + my * 0.3}%`,
          left: `${60 + mx * 0.3}%`,
          transition: "top 0.3s ease-out, left 0.3s ease-out",
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
        }}
      />
    </div>
  );
}
