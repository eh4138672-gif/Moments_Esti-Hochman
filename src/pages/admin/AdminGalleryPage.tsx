import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGallery } from "../../hooks/useGallery";
import { useDeleteGalleryItem, useUploadGalleryItem } from "../../hooks/useGalleryMutations";
import { useToast } from "../../hooks/useToast";
import { gallerySchema, type GalleryFormValues } from "../../schemas/gallerySchema";
import type { GalleryItem } from "../../types/gallery";
import { CATEGORIES, categoryLabels } from "../../utils/statusLabels";
import { applyServerErrors } from "../../utils/applyServerErrors";
import { getApiError } from "../../utils/apiError";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import Pill from "../../components/ui/Pill";
import DropZone from "../../components/ui/DropZone";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ErrorMessage from "../../components/ui/ErrorMessage";
import EmptyState from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Loader";
import { TrashIcon } from "../../components/ui/icons";

function AdminGalleryPage() {
  const { data: items, isPending, isError, error, refetch } = useGallery();
  const deleteMutation = useDeleteGalleryItem();
  const { showToast } = useToast();
  const [toDelete, setToDelete] = useState<GalleryItem | null>(null);

  function confirmDelete() {
    if (!toDelete) return;
    deleteMutation.mutate(toDelete.id, {
      onSuccess: () => {
        showToast("התמונה נמחקה מהגלריה");
        setToDelete(null);
      },
      onError: (err) => showToast(getApiError(err).title, "error"),
    });
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="font-bold text-violet">ממשק ניהול</p>
        <h1 className="mt-1 text-4xl font-extrabold md:text-5xl">ניהול גלריה</h1>
        <p className="mt-2 text-muted">התמונות כאן מופיעות בגלריה הפתוחה ובדף הבית.</p>
      </header>

      <UploadForm />

      <section>
        <h2 className="mb-4 text-2xl font-extrabold">בגלריה עכשיו {items && `(${items.length})`}</h2>
        {isPending ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="aspect-square" />)}
          </div>
        ) : isError ? (
          <ErrorMessage error={error} onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState title="הגלריה ריקה" text="העלי את התמונה הראשונה בטופס שלמעלה." />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item) => (
              <figure key={item.id} className="group relative overflow-hidden rounded-3xl border border-line bg-card">
                <img src={item.url} alt={item.title} className="aspect-square w-full object-cover" />
                <figcaption className="p-3">
                  <p className="truncate font-bold">{item.title}</p>
                  <p className="text-sm text-muted">{categoryLabels[item.category]}</p>
                </figcaption>
                <button
                  type="button"
                  title="מחיקה"
                  onClick={() => setToDelete(item)}
                  className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-ink/80 transition hover:text-rose"
                >
                  <TrashIcon size={16} />
                </button>
              </figure>
            ))}
          </div>
        )}
      </section>

      <ConfirmDialog
        open={toDelete !== null}
        title="למחוק את התמונה מהגלריה?"
        message={toDelete ? `"${toDelete.title}" תימחק גם מדף הבית.` : undefined}
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

function UploadForm() {
  const upload = useUploadGalleryItem();
  const { showToast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<GalleryFormValues>({ resolver: zodResolver(gallerySchema), defaultValues: { title: "" } });

  const file = watch("file");
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function onSubmit(values: GalleryFormValues) {
    try {
      await upload.mutateAsync(values);
      showToast(`"${values.title}" נוספה לגלריה`);
      reset({ title: "" });
    } catch (error) {
      applyServerErrors(error, setError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 rounded-[2rem] border border-line bg-card p-6 md:grid-cols-[16rem_1fr] md:p-8">
      <div>
        <Controller
          control={control}
          name="file"
          render={({ field }) =>
            preview ? (
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <img src={preview} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => field.onChange(undefined)}
                  className="absolute end-2 top-2 rounded-full bg-ink/80 px-3 py-1 text-sm font-bold"
                >
                  החלפה
                </button>
              </div>
            ) : (
              <DropZone onFiles={(files) => field.onChange(files[0])} />
            )
          }
        />
        {errors.file && <span className="mt-1.5 block text-sm text-rose">{errors.file.message}</span>}
      </div>

      <div className="space-y-5">
        <FormField label="כותרת *" placeholder="לדוגמה: צילום בשדה החמניות" registration={register("title")} error={errors.title} />

        <fieldset>
          <legend className="mb-3 text-sm font-bold">קטגוריה *</legend>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <Pill key={c} active={field.value === c} onClick={() => field.onChange(c)}>{categoryLabels[c]}</Pill>
                ))}
              </div>
            )}
          />
          {errors.category && <span className="mt-1.5 block text-sm text-rose">{errors.category.message}</span>}
        </fieldset>

        {errors.root && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">{errors.root.message}</p>}

        <Button type="submit" isLoading={isSubmitting}>העלאה לגלריה</Button>
      </div>
    </form>
  );
}

export default AdminGalleryPage;
