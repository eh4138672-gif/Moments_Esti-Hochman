import { useRef, useState, type DragEvent } from "react";
import { ALLOWED_IMAGE_TYPES } from "../../utils/validateImage";

interface DropZoneProps {
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

function DropZone({ multiple = false, onFiles, disabled = false }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files);
    onFiles(multiple ? files : files.slice(0, 1));
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex w-full flex-col items-center gap-2 rounded-3xl border-2 border-dashed px-6 py-10 text-center transition disabled:cursor-not-allowed disabled:opacity-50 ${
        isDragging ? "border-rose bg-rose/10" : "border-line hover:border-rose/60"
      }`}
    >
      <span className="text-3xl text-rose">⇪</span>
      <span className="font-bold">גררו תמונות לכאן</span>
      <span className="text-sm text-muted">או לחצו לבחירת קבצים · jpg / png / webp עד 10MB</span>
      <input
        ref={inputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        onChange={(e) => {
          onFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
    </button>
  );
}

export default DropZone;
