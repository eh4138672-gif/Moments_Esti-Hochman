import type { GalleryItem } from "../../types/gallery";
import { categoryLabels } from "../../utils/statusLabels";

interface GalleryGridProps {
  items: GalleryItem[];
  onOpen: (index: number) => void;
}

function GalleryGrid({ items, onOpen }: GalleryGridProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onOpen(index)}
          aria-label={`הגדלת התמונה: ${item.title}`}
          className="group relative mb-4 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-3xl bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30 text-right"
        >
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="min-h-48 w-full object-cover transition duration-500 group-hover:scale-105"
          />

          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-4 pb-3 pt-8 opacity-0 transition group-hover:opacity-100">
            <span className="text-xs text-cream/80">{item.title}</span>
          </span>
          <span className="absolute end-4 top-4 rounded-full bg-ink/80 px-4 py-1 text-sm font-bold">{categoryLabels[item.category]}</span>
        </button>
      ))}
    </div>
  );
}

export default GalleryGrid;
