import { Link, useSearchParams } from "react-router";
import { useGallery } from "../../hooks/useGallery";
import type { Category } from "../../types/project";
import { CATEGORIES, categoryLabels } from "../../utils/statusLabels";
import CategoryTabs from "../../components/gallery/CategoryTabs";
import GalleryGrid from "../../components/gallery/GalleryGrid";
import { Skeleton } from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";

// /gallery – גלריית העבודות, פתוחה לכולם
function GalleryPage() {
  // הקטגוריה נשמרת בכתובת (?category=Kids) – כך הקישורים מדף הבית פותחים ישר את הקטגוריה הנכונה
  const [searchParams, setSearchParams] = useSearchParams();
  const param = searchParams.get("category");
  const category = CATEGORIES.includes(param as Category) ? (param as Category) : undefined;

  // מפתח אחר לכל קטגוריה → מעבר בין טאבים מביא את התמונות מהשרת (GET /gallery?category=...)
  const { data: items, isPending, isError, error, refetch } = useGallery(category);

  function changeCategory(next?: Category) {
    setSearchParams(next ? { category: next } : {}, { replace: true });
  }

  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="font-display text-5xl font-extrabold md:text-7xl">PORTFOLIO</h1>
        <p className="bg-gradient-to-l from-berry to-rose bg-clip-text font-display text-5xl font-extrabold text-transparent md:text-7xl">MOMENTS</p>
        <p className="mt-4 text-muted">בחרו קטגוריה כדי לראות את העבודות. הגלריה פתוחה לכולם.</p>
      </header>

      <CategoryTabs value={category} onChange={changeCategory} />

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-64" />)}
        </div>
      ) : isError ? (
        <ErrorMessage error={error} onRetry={() => refetch()} />
      ) : items.length === 0 ? (
        <EmptyState title="אין עדיין תמונות בקטגוריה הזו" text="נסו קטגוריה אחרת, או חזרו בקרוב." />
      ) : (
        <>
          {/* המונה מחושב מהתשובה – כמה תמונות חזרו */}
          <p className="text-center text-muted">
            {items.length} תמונות בקטגוריה: {category ? categoryLabels[category] : "הכל"}
          </p>
          <GalleryGrid items={items} />
        </>
      )}

      <section className="rounded-[2rem] border border-line bg-card px-8 py-12 text-center">
        <h2 className="text-3xl font-extrabold">אהבתם את מה שראיתם?</h2>
        <p className="mt-2 text-muted">בחרו חבילה ועברו להרשמה – ההתחברות נדרשת רק אחרי סגירת הצילום.</p>
        <Link to="/packages" className="mt-6 inline-block rounded-full bg-gradient-to-l from-berry to-sun px-8 py-3.5 font-bold text-ink transition hover:opacity-90">
          לחבילות הצילום
        </Link>
      </section>
    </div>
  );
}

export default GalleryPage;
