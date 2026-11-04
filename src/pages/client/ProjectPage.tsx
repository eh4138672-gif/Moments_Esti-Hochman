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

function ProjectPage() {
  const { id } = useParams();
  const projectId = Number(id);

  const { data: project, isPending, isError, error, refetch } = useProject(projectId);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return <EmptyState title="הפרויקט לא נמצא" action={backLink} />;
  }

  if (isError) {
    const { status, title } = getApiError(error);
    if (status === 403 || status === 404) {
      return <EmptyState title={status === 403 ? "אין לך הרשאה לצפות בפרויקט הזה" : title} action={backLink} />;
    }
    return <ErrorMessage error={error} onRetry={() => refetch()} />;
  }

  if (isPending) {
    return <Loader text="טוען את הפרויקט..." />;
  }

  return (
    <div className="space-y-8">
      {backLink}

      <section className="relative h-80 overflow-hidden rounded-[2rem] bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30">
        {project.coverImageUrl && <img src={project.coverImageUrl} alt={project.clientName} className="absolute inset-0 size-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
        <div className="absolute inset-x-8 bottom-8">
          <span className="rounded-full border border-cream/30 bg-ink/50 px-4 py-1 text-sm">{categoryLabels[project.category]}</span>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">{project.clientName}</h1>
        </div>
      </section>

      <dl className="grid gap-6 rounded-[2rem] border border-line bg-card p-8 sm:grid-cols-2 lg:grid-cols-4">
        <Detail label="סוג צילומים" value={categoryLabels[project.category]} />
        <Detail label="סוג חבילה" value={`${project.packageName} · ${project.includesAlbum ? "כולל אלבום" : "ללא אלבום"}`} />
        <Detail label="תאריך הצילום" value={formatDate(project.shootDate)} />
        <Detail label="עלות" value={formatPrice(project.cost)} />
      </dl>

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

      <section>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-extrabold">מהצילום שלכם</h2>

          {project.downloadLink && (
            <a
              href={project.downloadLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gradient-to-l from-berry to-sun px-7 py-3 font-bold text-ink transition hover:opacity-90"
            >
              ⬇ להורדת כל התמונות
            </a>
          )}
        </div>
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-bold">{value}</dd>
    </div>
  );
}

export default ProjectPage;
