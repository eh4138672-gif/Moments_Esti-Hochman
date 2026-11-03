import { Link } from "react-router";
import type { Package } from "../../types/package";
import { formatPrice } from "../../utils/formatPrice";
import CameraSlideshow from "./CameraSlideshow";

interface PackageCardProps {
  pkg: Package;
  showFeatures?: boolean; // בדף החבילות – גם רשימת "מה כלול" וכפתור הרשמה
}

// כרטיס חבילה – בדף הבית (מקוצר) ובדף החבילות (מלא)
function PackageCard({ pkg, showFeatures = false }: PackageCardProps) {
  const isPremium = pkg.includesAlbum; // הפרימיום מודגש: מסגרת ורודה + "הכי משתלם"

  return (
    <article className={`relative flex flex-col overflow-hidden rounded-[2rem] border bg-card ${isPremium ? "border-rose/60" : "border-line"}`}>
      {isPremium && (
        <span className="absolute end-5 top-5 z-10 rounded-full bg-gradient-to-l from-violet via-rose to-sun px-4 py-1 text-sm font-bold text-ink">
          הכי משתלם
        </span>
      )}

      <div className="aspect-[2/1] bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30">
        {/* אם לחבילה יש תמונה בשרת – מציגים אותה. אחרת: מצלמה עם תמונות מתחלפות מהגלריה */}
        {pkg.imageUrl ? (
          <img src={pkg.imageUrl} alt={pkg.name} className="size-full object-cover" />
        ) : (
          <CameraSlideshow startAt={isPremium ? 1 : 0} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-8">
        <div>
          <p className={`text-sm font-bold ${isPremium ? "text-rose" : "text-sky"}`}>חבילת {pkg.name}</p>
          <h3 className="mt-1 text-3xl font-extrabold">{isPremium ? "כולל אלבום מעוצב" : "צילום ועריכה"}</h3>
          <p className="mt-2 text-muted">{pkg.description}</p>
        </div>

        {showFeatures && (
          <ul className="space-y-2">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-rose">✓</span> {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-3xl font-extrabold">{formatPrice(pkg.price)}</span>
          <Link
            to={showFeatures ? "/register" : "/packages"}
            className={`rounded-full px-6 py-2.5 font-bold transition ${
              isPremium ? "bg-gradient-to-l from-berry to-sun text-ink hover:opacity-90" : "border border-line hover:border-rose"
            }`}
          >
            {showFeatures ? "בחירה והרשמה" : "לפרטים"}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PackageCard;
