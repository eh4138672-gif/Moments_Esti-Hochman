import type { GalleryItem } from "../../types/gallery";
import { categoryLabels } from "../../utils/statusLabels";

interface GalleryGridProps {
  items: GalleryItem[];
}

// רשת התמונות בסגנון Masonry: columns של CSS מסדר את התמונות בעמודות, כל אחת בגובה הטבעי שלה.
// break-inside-avoid – תמונה לא "נחתכת" בין שתי עמודות
function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <figure key={item.id} className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30">
          <img
            src={item.url}
            alt={item.title}
            loading="lazy" // הדפדפן טוען תמונה רק כשמגיעים אליה בגלילה
            className="min-h-48 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          {/* הכותרת מופיעה כשעוברים עם העכבר */}
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-12 opacity-0 transition group-hover:opacity-100">
            <span className="font-bold">{item.title}</span>
          </figcaption>
          <span className="absolute end-4 top-4 rounded-full bg-ink/80 px-4 py-1 text-sm font-bold">{categoryLabels[item.category]}</span>
        </figure>
      ))}
    </div>
  );
}

export default GalleryGrid;
