import { Link } from "react-router";
import type { Project } from "../../types/project";
import { categoryLabels } from "../../utils/statusLabels";
import { categoryColors } from "../../utils/statusColors";
import { formatDate } from "../../utils/formatDate";
import StatusBadge from "../ui/StatusBadge";

interface ProjectCardProps {
  project: Project;
}

// כרטיס של פרויקט אחד באזור האישי. לחיצה → דף הפרויקט
function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/my-projects/${project.id}`}
      className="group overflow-hidden rounded-[2rem] border border-line bg-card transition hover:-translate-y-1 hover:border-rose/50"
    >
      {/* תמונת הכרטיס – ואם עוד אין תמונות, רקע בגרדיאנט */}
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30">
        {project.coverImageUrl && (
          <img src={project.coverImageUrl} alt={project.clientName} className="size-full object-cover transition duration-500 group-hover:scale-105" />
        )}
      </div>

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between text-sm">
          <span className={`font-bold ${categoryColors[project.category]}`}>{categoryLabels[project.category]}</span>
          <span className="text-muted">{formatDate(project.shootDate)}</span>
        </div>

        <div>
          <h3 className="text-2xl font-extrabold">{project.clientName}</h3>
          <p className="text-muted">חבילת {project.packageName}</p>
        </div>

        <dl className="space-y-3">
          <div className="flex items-center justify-between">
            <dt className="text-muted">עבודה</dt>
            <dd><StatusBadge kind="work" status={project.workStatus} /></dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">אלבום</dt>
            <dd><StatusBadge kind="album" status={project.albumStatus} /></dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

export default ProjectCard;
