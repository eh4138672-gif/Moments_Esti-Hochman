import { Link, useNavigate, useParams } from "react-router";
import { useProject } from "../../hooks/useProject";
import { usePackages } from "../../hooks/usePackages";
import { useCreateProject, useUpdateProject } from "../../hooks/useProjectMutations";
import { useToast } from "../../hooks/useToast";
import type { ProjectFormValues } from "../../schemas/projectSchema";
import type { ProjectInput } from "../../types/project";
import ProjectForm from "../../components/projects/ProjectForm";
import PhotoUploader from "../../components/projects/PhotoUploader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

// היום בפורמט "YYYY-MM-DD" – ברירת המחדל לתאריך בפרויקט חדש
const today = new Date().toLocaleDateString("en-CA");

// הערכים מהטופס → מה שהשרת מצפה לקבל (הערה או קישור ריקים נשלחים כ־null)
function toInput(values: ProjectFormValues): ProjectInput {
  return { ...values, notes: values.notes.trim() || null, downloadLink: values.downloadLink || null };
}

// /admin/projects/new ו־/admin/projects/:id/edit – אותו דף
function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined; // יש id בכתובת = עריכה
  const projectId = Number(id);
  const navigate = useNavigate();

  const { data: packages, isPending: packagesLoading } = usePackages();
  // בהוספה projectId הוא NaN – ה־hook לא שולח בקשה בכלל (enabled ב־useProject)
  const { data: project, isPending: projectLoading, isError } = useProject(projectId);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const { showToast } = useToast();

  // שמירה: POST בהוספה, PUT בעריכה. mutateAsync – כדי שהטופס יוכל לתפוס שגיאה ולהציג אותה ליד השדה
  async function handleSubmit(values: ProjectFormValues) {
    const data = toInput(values);
    if (isEdit) await updateMutation.mutateAsync({ id: projectId, data });
    else await createMutation.mutateAsync(data);
    showToast(isEdit ? "השינויים נשמרו" : `הפרויקט "${data.clientName}" נוצר`);
    navigate("/admin/projects");
  }

  const backLink = (
    <Link to="/admin/projects" className="text-muted transition hover:text-cream">→ חזרה לכל הפרויקטים</Link>
  );

  if (isEdit && isError) {
    return <EmptyState title="הפרויקט לא נמצא" action={backLink} />;
  }
  if (packagesLoading || (isEdit && projectLoading)) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {backLink}
      <header>
        <h1 className="text-4xl font-extrabold md:text-5xl">{isEdit ? "עריכת פרויקט" : "פרויקט חדש"}</h1>
        <p className="mt-2 text-muted">שדות עם כוכבית הם חובה.</p>
      </header>

      <ProjectForm
        // key – כשעוברים מפרויקט לפרויקט, הטופס נבנה מחדש עם הערכים החדשים
        key={project?.id ?? "new"}
        packages={packages ?? []}
        submitLabel={isEdit ? "שמירת שינויים" : "שמירת פרויקט"}
        onSubmit={handleSubmit}
        // תמונות אפשר להעלות רק לפרויקט שכבר קיים (צריך id) – לכן רק בעריכה
        sidebar={
          isEdit && project ? (
            <PhotoUploader projectId={project.id} photos={project.photos} />
          ) : (
            <p className="rounded-[2rem] border border-dashed border-line p-6 text-sm text-muted">
              אחרי שמירת הפרויקט אפשר יהיה להעלות אליו תמונות – בלחיצה על העיפרון בטבלה.
            </p>
          )
        }
        defaultValues={
          isEdit && project
            ? {
                clientName: project.clientName,
                clientEmail: project.clientEmail,
                category: project.category,
                packageId: project.packageId,
                workStatus: project.workStatus,
                albumStatus: project.albumStatus,
                shootDate: project.shootDate,
                cost: project.cost,
                notes: project.notes ?? "",
                downloadLink: project.downloadLink ?? "",
              }
            : { clientName: "", clientEmail: "", workStatus: "Photographed", albumStatus: "None", shootDate: today, notes: "", downloadLink: "" }
        }
      />
    </div>
  );
}

export default ProjectFormPage;
