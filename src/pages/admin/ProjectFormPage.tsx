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

const today = new Date().toLocaleDateString("en-CA");

function toInput(values: ProjectFormValues): ProjectInput {
  return { ...values, notes: values.notes.trim() || null, downloadLink: values.downloadLink || null };
}

function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const projectId = Number(id);
  const navigate = useNavigate();

  const { data: packages, isPending: packagesLoading } = usePackages();
  const { data: project, isPending: projectLoading, isError } = useProject(projectId);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const { showToast } = useToast();

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
        key={project?.id ?? "new"}
        packages={packages ?? []}
        submitLabel={isEdit ? "שמירת שינויים" : "שמירת פרויקט"}
        onSubmit={handleSubmit}
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
