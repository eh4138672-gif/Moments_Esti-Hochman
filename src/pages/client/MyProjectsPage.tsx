import { Link } from "react-router";
import { useMyProjects } from "../../hooks/useMyProjects";
import ProjectCard from "../../components/projects/ProjectCard";
import { Skeleton } from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";

// /my-projects – האזור האישי של הלקוח
function MyProjectsPage() {
  const { data: projects, isPending, isError, error, refetch } = useMyProjects();

  // המונים מחושבים מתוך הרשימה – אין להם קריאה נפרדת לשרת
  const total = projects?.length ?? 0;
  const editing = projects?.filter((p) => p.workStatus === "Editing").length ?? 0;

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="font-bold text-violet">האזור האישי</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold md:text-6xl">MY PROJECTS</h1>
          <p className="mt-4 text-lg text-muted">כאן רואים רק את הפרויקטים שלכם, עם הסטטוס העדכני של העבודה והאלבום.</p>
        </div>

        {projects && projects.length > 0 && (
          <div className="flex gap-4">
            <Counter value={total} label="פרויקטים" />
            <Counter value={editing} label="בעריכה" />
          </div>
        )}
      </header>

      {isPending ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : isError ? (
        <ErrorMessage error={error} onRetry={() => refetch()} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="הסטודיו עוד לא פתח לך פרויקט"
          text="אחרי הצילום, הפרויקט שלכם יופיע כאן – עם הסטטוס של העבודה והאלבום."
          action={
            <Link to="/packages" className="rounded-full border border-line px-6 py-2.5 font-bold transition hover:border-rose">
              לחבילות הצילום
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <section className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border border-line bg-card px-8 py-8">
        <div>
          <h2 className="text-2xl font-extrabold">רוצים לתעד עוד רגע?</h2>
          <p className="mt-1 text-muted">עיינו בחבילות ובחרו את המתאימה לצילום הבא.</p>
        </div>
        <Link to="/packages" className="rounded-full bg-gradient-to-l from-berry to-sun px-8 py-3 font-bold text-ink transition hover:opacity-90">
          לחבילות הצילום
        </Link>
      </section>
    </div>
  );
}

// קופסת מונה קטנה: מספר גדול + תווית
function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-24 rounded-3xl border border-line bg-card px-6 py-4 text-center">
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}

export default MyProjectsPage;
