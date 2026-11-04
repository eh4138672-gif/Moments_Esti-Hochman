interface LoaderProps {
  text?: string;
}

function Loader({ text = "טוען..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted" role="status">
      <span className="size-8 animate-spin rounded-full border-4 border-line border-t-rose" />
      <span>{text}</span>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-card ${className}`} />;
}

export default Loader;
