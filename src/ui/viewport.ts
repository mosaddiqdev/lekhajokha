import { useEffect, useState } from "react";

// Past this width the app shows two panes: the list, and the open screen beside it.
export const WIDE = "(min-width: 900px)";

export function useWide(): boolean {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches);
  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const onChange = () => setWide(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return wide;
}

// iOS keeps the page the same height when the keyboard opens, so the bottom
// dock would hide behind it. The visual viewport is the part still showing.
export function followKeyboard(): void {
  const viewport = window.visualViewport;
  if (!viewport) return;
  const update = () => {
    document.documentElement.style.setProperty("--app-height", `${viewport.height}px`);
  };
  viewport.addEventListener("resize", update);
  update();
}
