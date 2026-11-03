import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useProjects } from "../../hooks/useProjects";
import { usePackages } from "../../hooks/usePackages";
import { useDeleteProject, useUpdateProjectStatus } from "../../hooks/useProjectMutations";
import { useToast } from "../../hooks/useToast";
import type { Project, ProjectFilters as Filters, ProjectStatusInput } from "../../types/project";
import { ALBUM_STATUS_STEPS, CATEGORIES, WORK_STATUS_STEPS } from "../../utils/statusLabels";
import { getApiError } from "../../utils/apiError";
import ProjectFilters from "../../components/projects/ProjectFilters";
import ProjectsTable from "../../components/projects/ProjectsTable";
import { Skeleton } from "../../components/ui/Loader";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const SORT_FIELDS = ["shootDate", "cost", "clientName", "createdAt"];

// קורא את הסינונים מהכתובת: ?category=Family&sortBy=cost → { category: "Family", sortBy: "cost" }
// ערך לא מוכר (מישהו שינה את הכתובת ידנית) פשוט לא נכנס
function readFilters(params: URLSearchParams): Filters {
  const pick = <T extends string>(key: string, allowed: readonly string[]) => {
    const value = params.get(key);
    return value && allowed.includes(value) ? (value as T) : undefined;
  };
  const packageId = Number(params.get("packageId"));

  return {
    search: params.get("search") || undefined,
    category: pick("category", CATEGORIES),
    packageId: packageId > 0 ? packageId : undefined,
    workStatus: pick("workStatus", WORK_STATUS_STEPS),
    albumStatus: pick("albumStatus", ALBUM_STATUS_STEPS),
    sortBy: pick("sortBy", SORT_FIELDS),
    sortDir: pick("sortDir", ["asc", "desc"]),
  };
}

// /admin/projects – כל הפרויקטים
function AdminProjectsPage() {
  // ---- 1. הסינונים נשמרים בכתובת (URL) ולא ב־useState ----
  // כך "חזרה" בדפדפן עובד, ורענון הדף לא מאבד את הסינון
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = readFilters(searchParams);

  // useCallback – אותה פונקציה בכל רינדור (ה־debounce של החיפוש תלוי בה)
  const updateFilters = useCallback(
    (changes: Partial<Filters>) => {
      // מתחילים מהכתובת שבאמת מוצגת עכשיו (window.location) – כך שני שינויים רצופים
      // לא "דורסים" אחד את השני (ה־searchParams של React Router מתעדכן רק ברינדור הבא)
      const next = new URLSearchParams(window.location.search);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === undefined || value === "") next.delete(key); // "הכל" = מוחקים מהכתובת
        else next.set(key, String(value));
      });
      setSearchParams(next, { replace: true }); // replace – לא מוסיפים צעד להיסטוריה על כל אות בחיפוש
    },
    [setSearchParams],
  );

  // ---- 2. הבאת המידע ----
  const filtered = useProjects(filters); // לטבלה – עם הסינונים
  const all = useProjects(); // למונים – תמיד כל הפרויקטים (בלי סינון אין בקשה נוספת: אותו מפתח במטמון)
  const { data: packages = [] } = usePackages();

  // ---- 3. פעולות ----
  const updateStatus = useUpdateProjectStatus();
  const deleteMutation = useDeleteProject();
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<Project | null>(null); // הפרויקט שמחכה לאישור מחיקה

  function changeStatus(id: number, data: ProjectStatusInput) {
    updateStatus.mutate(
      { id, data },
      {
        onSuccess: () => showToast("הסטטוס עודכן"),
        // למשל: ניסיון לשנות אלבום בחבילת בסיס – השרת מחזיר 400 עם הסבר
        onError: (error) => showToast(getApiError(error).title, "error"),
      },
    );
  }

  function confirmDelete() {
    if (!toDelete) return;
    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => {
        showToast(`הפרויקט "${toDelete.clientName}" נמחק`);
        setToDelete(null);
      },
      onError: (error) => showToast(getApiError(error).title, "error"),
    });
  }

  // ---- 4. המונים – מחושבים מהרשימה המלאה ----
  const allProjects = all.data ?? [];
  const editingCount = allProjects.filter((p) => p.workStatus === "Editing").length;
  const albumsInProgress = allProjects.filter((p) => p.albumStatus === "SelectingPhotos" || p.albumStatus === "Designing").length;

  const hasFilters = searchParams.toString() !== "";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-violet">ממשק ניהול</p>
          <h1 className="mt-1 text-4xl font-extrabold md:text-5xl">כל הפרויקטים</h1>
        </div>
        <Link to="/admin/projects/new" className="rounded-full bg-gradient-to-l from-berry to-sun px-7 py-3 font-bold text-ink transition hover:opacity-90">
          + פרויקט חדש
        </Link>
      </header>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        <Counter value={allProjects.length} label="פרויקטים במערכת" color="text-cream" />
        <Counter value={editingCount} label="בשלבי עריכה" color="text-sun" />
        <Counter value={albumsInProgress} label="אלבומים בתהליך" color="text-rose" />
      </div>

      <ProjectFilters filters={filters} packages={packages} onChange={updateFilters} />

      {filtered.isPending ? (
        <Skeleton className="h-96" />
      ) : filtered.isError ? (
        <ErrorMessage error={filtered.error} onRetry={() => filtered.refetch()} />
      ) : filtered.data.length === 0 ? (
        <EmptyState
          title={hasFilters ? "לא נמצאו פרויקטים" : "אין עדיין פרויקטים"}
          text={hasFilters ? "נסי לשנות את החיפוש או את הסינונים." : "צרי את הפרויקט הראשון – הלקוח יראה אותו באזור האישי."}
          action={
            hasFilters ? (
              <button type="button" onClick={() => setSearchParams({})} className="rounded-full border border-line px-6 py-2.5 font-bold hover:border-rose">
                ניקוי הסינונים
              </button>
            ) : undefined
          }
        />
      ) : (
        <>
          <p className="text-muted">
            מוצגים {filtered.data.length} מתוך {allProjects.length} פרויקטים
          </p>
          <ProjectsTable
            projects={filtered.data}
            onStatusChange={changeStatus}
            onDelete={setToDelete}
          />
        </>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="למחוק את הפרויקט?"
        message={toDelete ? `הפרויקט "${toDelete.clientName}" והתמונות שלו יימחקו לצמיתות.` : undefined}
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

// קופסת מונה: מספר גדול בצבע + תווית
function Counter({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-3xl border border-line bg-card px-4 py-4 md:rounded-[2rem] md:px-6 md:py-5">
      <p className={`text-3xl font-extrabold md:text-4xl ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-muted md:text-base">{label}</p>
    </div>
  );
}

export default AdminProjectsPage;
