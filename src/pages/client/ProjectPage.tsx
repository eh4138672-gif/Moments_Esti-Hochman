import { Link, useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { categoryLabels } from "../../utils/statusLabels";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import { getApiError } from "../../utils/apiError";
import StatusStepper from "../../components/ui/StatusStepper";
import Loader from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";

const backLink = (
  <Link to="/my-projects" className="inline-flex items-center gap-2 text-muted transition hover:text-cream">
    → חזרה לפרויקטים שלי
  </Link>
);

// /my-projects/:id – דף של פרויקט אחד
function ProjectPage() {
  // 1. המספר מהכתובת: /my-projects/3 → "3" → 3
  const { id } = useParams();
  const projectId = Number(id);

  // 2. הבאת הפרויקט מהשרת
  const { data: project, isPending, isError, error, refetch } = useProject(projectId);

  // 3. מצבים מיוחדים – כל אחד מחזיר תצוגה אחרת ולא ממשיך הלאה
  if (!Number.isInteger(projectId) || projectId <= 0) {
    return <EmptyState title="הפרויקט לא נמצא" action={backLink} />;
  }

  if (isError) {
    const { status, title } = getApiError(error);
    // 403 = הפרויקט של לקוח אחר · 404 = אין פרויקט כזה. בשניהם אין טעם ב"נסו שוב"
    if (status === 403 || status === 404) {
      return <EmptyState title={status === 403 ? "אין לך הרשאה לצפות בפרויקט הזה" : title} action={backLink} />;
    }
    return <ErrorMessage error={error} onRetry={() => refetch()} />;
  }

  if (isPending) {
    return <Loader text="טוען את הפרויקט..." />;
  }

  // 4. מכאן project בטוח קיים – מציגים את הדף
  return (
    <div className="space-y-8">
      {backLink}

      {/* תמונה ראשית עם הכותרת עליה */}
      <section className="relative h-80 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30">
        {project.coverImageUrl && <img src={project.coverImageUrl} alt={project.clientName} className="absolute inset-0 size-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
        <div className="absolute inset-x-8 bottom-8">
          <span className="rounded-full border border-cream/30 bg-ink/50 px-4 py-1 text-sm">{categoryLabels[project.category]}</span>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{project.clientName}</h1>
        </div>
      </section>

      {/* שורת הפרטים */}
      <dl className="grid gap-6 rounded-[2rem] border border-line bg-card p-8 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="סוג צילומים" value={categoryLabels[project.category]} />
        <Detail label="סוג חבילה" value={`${project.packageName} · ${project.includesAlbum ? "כולל אלבום" : "ללא אלבום"}`} />
        <Detail label="תאריך הצילום" value={formatDate(project.shootDate)} />
        <Detail label="עלות" value={formatPrice(project.cost)} />
      </dl>

      {/* שני ה־Stepper־ים. סטטוס אלבום מוצג רק אם החבילה כוללת אלבום */}
      <div className={`grid gap-6 ${project.includesAlbum ? "md:grid-cols-2" : ""}`}>
        <section className="rounded-[2rem] border border-line bg-card p-8">
          <h2 className="mb-8 text-2xl font-extrabold">סטטוס עבודה</h2>
          <StatusStepper kind="work" status={project.workStatus} />
        </section>
        {project.includesAlbum && (
          <section className="rounded-[2rem] border border-line bg-card p-8">
            <h2 className="mb-8 text-2xl font-extrabold">סטטוס אלבום</h2>
            <StatusStepper kind="album" status={project.albumStatus} />
          </section>
        )}
      </div>

      {/* התמונות מהצילום */}
      <section>
        <h2 className="mb-6 text-3xl font-extrabold">מהצילום שלכם</h2>
        {project.photos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.photos.map((photo) => (
              <a key={photo.id} href={photo.url} target="_blank" rel="noreferrer" className="overflow-hidden rounded-3xl">
                <img src={photo.url} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 hover:scale-105" />
              </a>
            ))}
          </div>
        ) : (
          <EmptyState title="עוד אין כאן תמונות" text='התמונות המלאות יופיעו כאן עם מעבר הסטטוס ל"נמסר".' />
        )}
      </section>
    </div>
  );
}

// פריט אחד בשורת הפרטים: תווית קטנה + ערך מודגש
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-bold">{value}</dd>
    </div>
  );
}

export default ProjectPage;
