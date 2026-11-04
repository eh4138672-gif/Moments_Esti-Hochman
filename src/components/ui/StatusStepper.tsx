import type { AlbumStatus, WorkStatus } from "../../types/project";
import {
  ALBUM_STATUS_STEPS,
  WORK_STATUS_STEPS,
  albumStatusLabels,
  workStatusLabels,
} from "../../utils/statusLabels";

type StatusStepperProps = { kind: "work"; status: WorkStatus } | { kind: "album"; status: AlbumStatus };

function StatusStepper(props: StatusStepperProps) {
  const steps: string[] = props.kind === "work" ? WORK_STATUS_STEPS : ALBUM_STATUS_STEPS;
  const labels: Record<string, string> = props.kind === "work" ? workStatusLabels : albumStatusLabels;
  const currentIndex = steps.indexOf(props.status);

  return (
    <ol className="flex">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <li key={step} className="relative flex flex-1 flex-col items-center gap-3 text-center">
            {index > 0 && (
              <span
                className={`absolute top-5 start-[-50%] h-0.5 w-full ${
                  index <= currentIndex ? "bg-gradient-to-l from-rose to-sun" : "bg-line"
                }`}
              />
            )}

            <span
              className={`relative z-10 grid size-10 place-items-center rounded-full border-2 ${
                isDone
                  ? "border-transparent bg-gradient-to-l from-berry to-sun text-ink"
                  : isCurrent
                    ? "border-rose bg-ink ring-4 ring-rose/20"
                    : "border-line bg-ink"
              }`}
            >
              {isDone && "✓"}
              {isCurrent && <span className="size-3 rounded-full bg-rose" />}
            </span>

            <span className={`text-sm ${isCurrent ? "font-bold text-rose" : isDone ? "font-bold text-cream" : "text-muted"}`}>
              {labels[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default StatusStepper;
