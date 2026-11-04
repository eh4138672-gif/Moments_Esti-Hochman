import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  text?: string;
  action?: ReactNode;
}

function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-line px-6 py-14 text-center">
      <p className="text-xl font-bold">{title}</p>
      {text && <p className="max-w-md text-muted">{text}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export default EmptyState;
