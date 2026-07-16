import { create } from "zustand";

interface UIState {
  scrollPosition: number;
  mousePosition: { x: number; y: number };
  imageZoom: number;
  imageRotation: number;
  imagePosition: { x: number; y: number };

  setScrollPosition: (pos: number) => void;
  setMousePosition: (pos: { x: number; y: number }) => void;
  setImageZoom: (zoom: number) => void;
  setImageRotation: (rotation: number) => void;
  setImagePosition: (pos: { x: number; y: number }) => void;
  resetImageTransform: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  scrollPosition: 0,
  mousePosition: { x: 0, y: 0 },
  imageZoom: 1,
  imageRotation: 0,
  imagePosition: { x: 0, y: 0 },

  setScrollPosition: (pos) => set({ scrollPosition: pos }),
  setMousePosition: (pos) => set({ mousePosition: pos }),
  setImageZoom: (zoom) => set({ imageZoom: Math.max(0.5, Math.min(3, zoom)) }),
  setImageRotation: (rotation) => set({ imageRotation: rotation }),
  setImagePosition: (pos) => set({ imagePosition: pos }),
  resetImageTransform: () =>
    set({ imageZoom: 1, imageRotation: 0, imagePosition: { x: 0, y: 0 } }),
}));
