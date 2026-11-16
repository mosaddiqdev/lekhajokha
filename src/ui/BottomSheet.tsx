import { type PointerEvent, type ReactNode, useEffect, useRef, useState } from "react";
import styles from "./BottomSheet.module.css";
import { WIDE } from "./viewport";

type Props = { open: boolean; onClose: () => void; label: string; children: ReactNode };

// Past this many pixels of downward drag, letting go closes the sheet.
const DISMISS_DRAG = 90;

export function BottomSheet({ open, onClose, label, children }: Props) {
  // mounted keeps the sheet in the page while it slides out. shown is the
  // animated state: it flips one frame after mounting so the slide-in plays.
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const dragFrom = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      setShown(false);
      return;
    }
    setMounted(true);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShown(true);
        sheet.current?.focus();
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia(WIDE).matches) return;
    dragFrom.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragFrom.current === null || !sheet.current) return;
    const dragged = Math.max(0, event.clientY - dragFrom.current);
    sheet.current.style.transition = "none";
    sheet.current.style.transform = `translateY(${dragged}px)`;
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragFrom.current === null || !sheet.current) return;
    const dragged = event.clientY - dragFrom.current;
    dragFrom.current = null;
    sheet.current.style.transition = "";
    sheet.current.style.transform = "";
    if (dragged > DISMISS_DRAG) onClose();
  };

  return (
    <>
      <div
        className={styles.scrim}
        data-shown={shown}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheet}
        className={styles.sheet}
        data-shown={shown}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && !open) setMounted(false);
        }}
      >
        <div
          className={styles.grabber}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <span className={styles.bar} />
        </div>
        {children}
      </div>
    </>
  );
}
