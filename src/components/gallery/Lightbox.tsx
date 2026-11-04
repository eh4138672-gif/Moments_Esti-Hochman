import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryItem } from "../../types/gallery";
import { categoryLabels } from "../../utils/statusLabels";

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

const toolButton = "grid size-10 place-items-center rounded-full text-cream/90 transition hover:bg-white/10";

function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const item = items[index];
  const hasMany = items.length > 1;
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const next = () => onChange((index + 1) % items.length);
  const prev = () => onChange((index - 1 + items.length) % items.length);

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  }

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !document.fullscreenElement) onClose();
      if (event.key === "ArrowLeft") onChange((index + 1) % items.length);
      if (event.key === "ArrowRight") onChange((index - 1 + items.length) % items.length);
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onChange, onClose]);

  if (!item) return null;

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-[100] flex flex-col bg-black/85" onClick={onClose}>
      <div className="flex justify-end gap-1 p-3" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={toggleFullscreen} aria-label={isFullscreen ? "יציאה ממסך מלא" : "מסך מלא"} className={toolButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isFullscreen ? (
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            ) : (
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            )}
          </svg>
        </button>
        <button type="button" onClick={onClose} aria-label="סגירה" className={`${toolButton} text-xl`}>
          ✕
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20">
        {hasMany && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="התמונה הקודמת"
            className="absolute start-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-4xl text-cream/90 transition hover:bg-white/10 sm:start-5"
          >
            ›
          </button>
        )}

        <figure className="flex h-full max-w-full flex-col items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
          <img src={item.url} alt={item.title} className="min-h-0 max-w-full flex-1 object-contain" />
          <figcaption className="flex items-center gap-3 text-sm text-cream/80">
            <span className="rounded-full bg-white/10 px-3 py-1 font-bold">{categoryLabels[item.category]}</span>
            <span>{item.title}</span>
            {hasMany && (
              <span dir="ltr" className="text-cream/50">
                {index + 1} / {items.length}
              </span>
            )}
          </figcaption>
        </figure>

        {hasMany && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="התמונה הבאה"
            className="absolute end-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full text-4xl text-cream/90 transition hover:bg-white/10 sm:end-5"
          >
            ‹
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}

export default Lightbox;
