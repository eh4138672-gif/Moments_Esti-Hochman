import { useEffect } from "react";
import type { GalleryItem } from "../../types/gallery";
import { categoryLabels } from "../../utils/statusLabels";

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

function Lightbox({ items, index, onChange, onClose }: LightboxProps) {
  const item = items[index];
  const hasMany = items.length > 1;

  const next = () => onChange((index + 1) % items.length);
  const prev = () => onChange((index - 1 + items.length) % items.length);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0d11] p-4" onClick={onClose}>
      <button
        type="button"
        onClick={onClose}
        aria-label="סגירה"
        className="absolute end-5 top-5 grid size-11 place-items-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
      >
        ✕
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="התמונה הקודמת"
            className="absolute start-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20"
          >
            ›
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="התמונה הבאה"
            className="absolute end-4 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl transition hover:bg-white/20"
          >
            ‹
          </button>
        </>
      )}

      <figure className="flex max-h-full max-w-5xl flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
        <img src={item.url} alt={item.title} className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl shadow-black/60" />
        <figcaption className="flex items-center gap-3 text-sm text-cream/80">
          <span className="rounded-full bg-white/10 px-3 py-1 font-bold">{categoryLabels[item.category]}</span>
          <span>{item.title}</span>
          {hasMany && (
            <span dir="ltr" className="text-muted">
              {index + 1} / {items.length}
            </span>
          )}
        </figcaption>
      </figure>
    </div>
  );
}

export default Lightbox;
