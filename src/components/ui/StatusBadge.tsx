import type { AlbumStatus, WorkStatus } from "../../types/project";
import { albumStatusLabels, workStatusLabels } from "../../utils/statusLabels";
import { albumStatusColors, workStatusColors } from "../../utils/statusColors";

// שני סוגים: סטטוס עבודה או סטטוס אלבום. TypeScript מוודא שהסטטוס מתאים לסוג
type StatusBadgeProps =
  | { kind: "work"; status: WorkStatus; onClick?: () => void }
  | { kind: "album"; status: AlbumStatus; onClick?: () => void };

// תגית צבעונית עם מסגרת. עם onClick היא הופכת לכפתור (לעדכון מהיר בטבלה)
function StatusBadge(props: StatusBadgeProps) {
  const label = props.kind === "work" ? workStatusLabels[props.status] : albumStatusLabels[props.status];
  const color = props.kind === "work" ? workStatusColors[props.status] : albumStatusColors[props.status];
  const className = `inline-block whitespace-nowrap rounded-full border px-3 py-1 text-sm font-bold ${color}`;

  if (props.onClick) {
    return (
      <button type="button" onClick={props.onClick} className={`${className} transition hover:bg-cream/5`}>
        {label}
      </button>
    );
  }
  return <span className={className}>{label}</span>;
}

export default StatusBadge;
