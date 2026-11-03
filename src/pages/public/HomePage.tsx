import { Link } from "react-router";
import { useGallery } from "../../hooks/useGallery";
import { usePackages } from "../../hooks/usePackages";
import { categoryLabels } from "../../utils/statusLabels";
import PackageCard from "../../components/packages/PackageCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { Skeleton } from "../../components/ui/Loader";

// ארבעת השלבים של "איך זה עובד" – טקסט קבוע, לא מהשרת
const STEPS = [
  { title: "כניסה לאתר", text: "עמוד בית פתוח לכולם, בלי צורך בהתחברות." },
  { title: "גלריית עבודות", text: "תמונות לפי קטגוריות – תינוקות, ילדים, משפחה וטבע." },
  { title: "בחירת חבילה", text: "חבילת בסיס או פרימיום עם אלבום, עוד לפני קביעת תאריך." },
  { title: "הרשמה והתחברות", text: "מעבר לאזור האישי אחרי סגירת הצילום." },
];

const gradientText = "bg-gradient-to-l from-sky via-rose to-sun bg-clip-text text-transparent";
// דף הבית – פתוח לכולם
function HomePage() {
  const { data: photos, isPending: photosLoading } = useGallery(undefined, 5); // 5 עבודות נבחרות
  const { data: packages, isPending: packagesLoading } = usePackages();

  return (
    <div className="space-y-28">
      {/* ---------- 1. Hero ---------- */}
      <section className="relative -mt-4 overflow-hidden rounded-[2.5rem] border border-line bg-gradient-to-br from-sun/25 via-rose/15 to-violet/25">
        {photos?.[0] && <img src={photos[0].url} alt="" className="absolute inset-0 size-full object-cover opacity-40" />}
        <div className="absolute inset-0 bg-gradient-to-l from-ink/95 via-ink/70 to-ink/10" />

        <div className="relative max-w-2xl px-8 py-24 md:px-14 md:py-32">
          <span className="rounded-full border border-cream/30 px-4 py-1.5 text-sm">סטודיו לצילום ילדים ומשפחה</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-tight md:text-7xl">
            רגעים קטנים,
            <br />
            <span className={gradientText}>זיכרונות גדולים.</span>
          </h1>
          <p className="mt-6 text-lg text-cream/80">
            עיינו בגלריית העבודות, בחרו חבילה שמתאימה לכם, והתחברו לאזור האישי כדי לעקוב אחר הצילום, העריכה והאלבום – הכול במקום אחד.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/gallery" className="rounded-full bg-gradient-to-l from-berry to-sun px-8 py-3.5 font-bold text-ink transition hover:opacity-90">
              לגלריית העבודות
            </Link>
            <Link to="/packages" className="rounded-full border border-cream/30 px-8 py-3.5 font-bold transition hover:border-rose">
              לחבילות הצילום
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- 2. עבודות נבחרות מהגלריה ---------- */}
      <section className="text-center">
        <h2 className="font-display text-5xl font-extrabold md:text-7xl">PORTFOLIO</h2>
        <p className="bg-gradient-to-l from-berry to-rose bg-clip-text font-display text-5xl font-extrabold text-transparent md:text-7xl">MOMENTS</p>
        <p className="mx-auto mt-4 max-w-lg text-muted">גלריה פתוחה לכולם – ללא צורך בהתחברות. עיינו לפי קטגוריות: תינוקות, ילדים, משפחה וטבע.</p>

        <div className="mt-12 grid grid-cols-2 items-end gap-4 md:grid-cols-5">
          {photosLoading
            ? Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-72" />)
            : photos?.map((photo) => (
                <Link
                  key={photo.id}
                  to={`/gallery?category=${photo.category}`}
                  // מלבן עם פינות מעוגלות. במעבר עכבר – קופץ קצת למעלה והתמונה מתקרבת
                  className="group relative h-80 overflow-hidden rounded-3xl bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30 transition duration-500 hover:-translate-y-2"
                >
                  <img src={photo.url} alt={photo.title} className="size-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-4 end-4 rounded-full bg-ink/80 px-4 py-1 text-sm font-bold">
                    {categoryLabels[photo.category]}
                  </span>
                </Link>
              ))}
        </div>

        <Link to="/gallery" className="mt-10 inline-block rounded-full border border-line px-8 py-3 font-bold transition hover:border-rose">
          לכל הגלריה
        </Link>
      </section>

      {/* ---------- 3. איך זה עובד ---------- */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold text-sun">איך זה עובד</p>
            <h2 className="mt-2 text-4xl font-extrabold md:text-5xl">מהכניסה לאתר ועד לאלבום המוכן</h2>
          </div>
          <p className="max-w-sm text-muted">עמוד הבית והגלריה פתוחים לכולם. ההתחברות נדרשת רק כדי להיכנס לאזור האישי.</p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-[2rem] border border-line bg-card p-7">
              <span className="grid size-12 place-items-center rounded-full bg-gradient-to-l from-violet via-rose to-sun text-lg font-extrabold text-ink">
                {index + 1}
              </span>
              <h3 className="mt-6 text-xl font-extrabold">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- 4. החבילות ---------- */}
      <section className="text-center">
        <h2 className="font-display text-5xl font-extrabold md:text-6xl">PACKAGES</h2>
        <p className="mt-3 text-muted">שתי חבילות מרכזיות. המנהלת מגדירה אותן, והלקוח בוחר.</p>

        <div className="mt-10 grid gap-6 text-right md:grid-cols-2">
          {packagesLoading ? (
            <>
              <Skeleton className="h-96" />
              <Skeleton className="h-96" />
            </>
          ) : (
            packages?.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)
          )}
        </div>
      </section>

      {/* ---------- 5. האזור האישי ---------- */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <p className="font-bold text-violet">האזור האישי</p>
          <h2 className="mt-2 text-4xl font-extrabold leading-tight md:text-5xl">תמיד יודעים באיזה שלב הצילום שלכם</h2>
          <p className="mt-4 text-lg text-muted">אחרי ההתחברות רואים את הפרויקטים האישיים – סטטוס עבודה וסטטוס אלבום, בלי לשלוח הודעות ולחכות לתשובה.</p>
          <Link to="/my-projects" className="mt-8 inline-block rounded-full bg-gradient-to-l from-berry to-sun px-8 py-3.5 font-bold text-ink transition hover:opacity-90">
            לצפייה באזור האישי
          </Link>
        </div>

        {/* כרטיס דוגמה – רק להמחשה, לא מהשרת */}
        <div className="rounded-[2rem] border border-line bg-card p-8">
          <div className="flex items-center gap-4">
            <span className="size-14 rounded-2xl bg-gradient-to-br from-sun/40 via-rose/30 to-violet/40" />
            <div>
              <h3 className="text-xl font-extrabold">צילום משפחת לוי</h3>
              <p className="text-sm text-muted">צילום טבע · חבילת פרימיום</p>
            </div>
          </div>
          <dl className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="font-bold">סטטוס עבודה</dt>
              <dd><StatusBadge kind="work" status="Editing" /></dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-bold">סטטוס אלבום</dt>
              <dd><StatusBadge kind="album" status="SelectingPhotos" /></dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
