import { useState } from "react";
import { Link } from "react-router";
import type { AlbumStatus, Project, ProjectStatusInput, WorkStatus } from "../../types/project";
import {
  ALBUM_STATUS_STEPS,
  WORK_STATUS_STEPS,
  albumStatusLabels,
  categoryLabels,
  workStatusLabels,
} from "../../utils/statusLabels";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/formatPrice";
import StatusBadge from "../ui/StatusBadge";
import { PencilIcon, TrashIcon } from "../ui/icons";

interface ProjectsTableProps {
  projects: Project[];
  onStatusChange: (id: number, data: ProjectStatusInput) => void;
  onDelete: (project: Project) => void;
}

function ProjectsTable({ projects, onStatusChange, onDelete }: ProjectsTableProps) {
  return (
    <div className="relative overflow-x-auto rounded-[2rem] border border-line bg-card">
      <table className="w-full min-w-[56rem] text-right">
        <thead className="bg-line/40 text-sm text-muted">
          <tr>
            <th className="px-6 py-4 font-bold" colSpan={2}>לקוח / משפחה</th>
            <th className="px-4 py-4 font-bold">קטגוריה</th>
            <th className="px-4 py-4 font-bold">חבילה</th>
            <th className="px-4 py-4 font-bold">סטטוס עבודה</th>
            <th className="px-4 py-4 font-bold">סטטוס אלבום</th>
            <th className="px-4 py-4 font-bold">תאריך צילום</th>
            <th className="px-4 py-4 font-bold">עלות</th>
            <th className="px-6 py-4"><span className="sr-only">פעולות</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {projects.map((project) => (
            <tr key={project.id} className="transition hover:bg-ink/40">
              <td className="py-4 ps-6">
                <div className="size-14 overflow-hidden rounded-2xl bg-gradient-to-br from-sun/30 via-rose/20 to-violet/30">
                  {project.coverImageUrl && <img src={project.coverImageUrl} alt="" className="size-full object-cover" />}
                </div>
              </td>
              <td className="px-4 py-4">
                <p className="font-bold">{project.clientName}</p>
                <p className="text-sm text-muted">{project.clientEmail}</p>
              </td>
              <td className="px-4 py-4 text-cream/80">{categoryLabels[project.category]}</td>
              <td className="px-4 py-4 text-cream/80">{project.packageName}</td>
              <td className="px-4 py-4">
                <QuickStatus
                  current={project.workStatus}
                  steps={WORK_STATUS_STEPS}
                  labels={workStatusLabels}
                  badge={(onClick) => <StatusBadge kind="work" status={project.workStatus} onClick={onClick} />}
                  onSelect={(workStatus) => onStatusChange(project.id, { workStatus: workStatus as WorkStatus })}
                />
              </td>
              <td className="px-4 py-4">
                {project.includesAlbum ? (
                  <QuickStatus
                    current={project.albumStatus}
                    steps={ALBUM_STATUS_STEPS}
                    labels={albumStatusLabels}
                    badge={(onClick) => <StatusBadge kind="album" status={project.albumStatus} onClick={onClick} />}
                    onSelect={(albumStatus) => onStatusChange(project.id, { albumStatus: albumStatus as AlbumStatus })}
                  />
                ) : (
                  <StatusBadge kind="album" status="None" />
                )}
              </td>
              <td className="px-4 py-4 text-cream/80">{formatDate(project.shootDate)}</td>
              <td className="px-4 py-4 font-bold">{formatPrice(project.cost)}</td>
              <td className="py-4 pe-6">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    title="עריכה"
                    className="grid size-10 place-items-center rounded-full border border-line transition hover:border-violet hover:text-violet"
                  >
                    <PencilIcon size={16} />
                  </Link>
                  <button
                    type="button"
                    title="מחיקה"
                    onClick={() => onDelete(project)}
                    className="grid size-10 place-items-center rounded-full border border-line transition hover:border-rose hover:text-rose"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface QuickStatusProps {
  current: string;
  steps: string[];
  labels: Record<string, string>;
  badge: (onClick: () => void) => React.ReactNode;
  onSelect: (status: string) => void;
}

function QuickStatus({ current, steps, labels, badge, onSelect }: QuickStatusProps) {
  const [open, setOpen] = useState(false);

  function choose(status: string) {
    setOpen(false);
    if (status !== current) onSelect(status);
  }

  return (
    <div className="relative inline-block">
      {badge(() => setOpen(!open))}
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <ul className="absolute start-0 top-full z-30 mt-2 min-w-44 overflow-hidden rounded-2xl border border-line bg-card py-1 shadow-xl shadow-black/40">
            {steps.map((step) => (
              <li key={step}>
                <button
                  type="button"
                  onClick={() => choose(step)}
                  className={`w-full px-4 py-2 text-right text-sm transition hover:bg-line/50 ${step === current ? "font-bold text-rose" : ""}`}
                >
                  {labels[step]}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ProjectsTable;
