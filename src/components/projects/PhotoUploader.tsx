import { useEffect, useState } from "react";
import type { ProjectPhoto } from "../../types/project";
import { useDeleteProjectPhoto, useUploadProjectPhotos } from "../../hooks/useProjectMutations";
import { useToast } from "../../hooks/useToast";
import { validateImage } from "../../utils/validateImage";
import { getApiError } from "../../utils/apiError";
import DropZone from "../ui/DropZone";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";
import { TrashIcon } from "../ui/icons";

const MAX_FILES = 10;

interface PhotoUploaderProps {
  projectId: number;
  photos: ProjectPhoto[];
}

function PhotoUploader({ projectId, photos }: PhotoUploaderProps) {
  const [selected, setSelected] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<ProjectPhoto | null>(null);

  const upload = useUploadProjectPhotos();
  const deletePhoto = useDeleteProjectPhoto();
  const { showToast } = useToast();

  useEffect(() => {
    const urls = selected.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [selected]);

  function addFiles(files: File[]) {
    const errors = files.map(validateImage).filter((message) => message !== null);
    const valid = files.filter((file) => validateImage(file) === null);
    const next = [...selected, ...valid].slice(0, MAX_FILES);
    setSelected(next);
    if (errors.length > 0) setError(errors[0]);
    else if (selected.length + valid.length > MAX_FILES) setError(`אפשר להעלות עד ${MAX_FILES} תמונות בבת אחת`);
    else setError(null);
  }

  function handleUpload() {
    upload.mutate(
      { id: projectId, files: selected },
      {
        onSuccess: (uploaded) => {
          showToast(`${uploaded.length} תמונות הועלו`);
          setSelected([]);
        },
        onError: (err) => setError(getApiError(err).title),
      },
    );
  }

  function confirmDelete() {
    if (!toDelete) return;
    deletePhoto.mutate(
      { id: projectId, photoId: toDelete.id },
      {
        onSuccess: () => {
          showToast("התמונה נמחקה");
          setToDelete(null);
        },
        onError: (err) => showToast(getApiError(err).title, "error"),
      },
    );
  }

  return (
    <section className="space-y-5 rounded-[2rem] border border-line bg-card p-6">
      <div>
        <h2 className="text-xl font-extrabold">גלריית הפרויקט</h2>
        <p className="mt-1 text-sm text-muted">הלקוח רואה את התמונות בדף הפרויקט. הראשונה הופכת לתמונת הכרטיס.</p>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-ink">
              <img src={photo.url} alt="" className="size-full object-cover" />
              <button
                type="button"
                title="מחיקת התמונה"
                onClick={() => setToDelete(photo)}
                className="absolute end-1.5 top-1.5 grid size-8 place-items-center rounded-full bg-ink/80 opacity-0 transition hover:text-rose group-hover:opacity-100"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <DropZone multiple onFiles={addFiles} disabled={upload.isPending} />

      {selected.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold">{selected.length} תמונות מוכנות להעלאה</p>
          <div className="grid grid-cols-4 gap-2">
            {previews.map((url, index) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-xl">
                <img src={url} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  title="הסרה"
                  onClick={() => setSelected(selected.filter((_, i) => i !== index))}
                  className="absolute end-1 top-1 grid size-6 place-items-center rounded-full bg-ink/80 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Button onClick={handleUpload} isLoading={upload.isPending} className="w-full">
            העלאת {selected.length} תמונות
          </Button>
        </div>
      )}

      {error && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">{error}</p>}

      <ConfirmDialog
        open={toDelete !== null}
        title="למחוק את התמונה?"
        message="התמונה תימחק גם מהאזור האישי של הלקוח."
        isLoading={deletePhoto.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
}

export default PhotoUploader;
