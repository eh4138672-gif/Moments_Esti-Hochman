import type { ReactNode } from "react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { projectSchema, type ProjectFormValues } from "../../schemas/projectSchema";
import type { Package } from "../../types/package";
import {
  ALBUM_STATUS_STEPS,
  CATEGORIES,
  WORK_STATUS_STEPS,
  albumStatusLabels,
  categoryLabels,
  workStatusLabels,
} from "../../utils/statusLabels";
import { applyServerErrors } from "../../utils/applyServerErrors";
import FormField from "../ui/FormField";
import Button from "../ui/Button";
import Pill from "../ui/Pill";
import StatusBadge from "../ui/StatusBadge";

interface ProjectFormProps {
  defaultValues: DefaultValues<ProjectFormValues>; // ריק בהוספה, הפרויקט הקיים בעריכה
  packages: Package[];
  submitLabel: string;
  onSubmit: (values: ProjectFormValues) => Promise<unknown>; // הדף מחליט אם זה POST או PUT
  sidebar?: ReactNode; // תוכן נוסף בעמודת הצד, מתחת ל"תצוגת הלקוח" (בעריכה: העלאת תמונות)
}

// טופס אחד להוספה ולעריכה. הטופס לא יודע איזה מהשניים – הוא רק אוסף ובודק את השדות
function ProjectForm({ defaultValues, packages, submitLabel, onSubmit, sidebar }: ProjectFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema), defaultValues });

  // watch – "מסתכל" על שדות ומרנדר מחדש כשהם משתנים (בשביל הנעילה ו"תצוגת הלקוח")
  const selectedPackage = packages.find((p) => p.id === watch("packageId"));
  const hasAlbum = selectedPackage?.includesAlbum ?? false;
  const workStatus = watch("workStatus");
  const albumStatus = watch("albumStatus");

  // בחירת חבילה: ממלאים את העלות לפי המחיר, ובחבילה בלי אלבום – נועלים את האלבום על "ללא אלבום"
  function choosePackage(pkg: Package) {
    setValue("packageId", pkg.id, { shouldValidate: true });
    setValue("cost", pkg.price, { shouldValidate: true });
    if (!pkg.includesAlbum) setValue("albumStatus", "None");
  }

  async function submit(values: ProjectFormValues) {
    try {
      await onSubmit(values);
    } catch (error) {
      applyServerErrors(error, setError); // שגיאות 400 מהשרת נכנסות ליד השדות
    }
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <form onSubmit={handleSubmit(submit)} noValidate className="space-y-7 rounded-[2rem] border border-line bg-card p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="שם לקוח / משפחה *" placeholder="לדוגמה: משפחת לוי" registration={register("clientName")} error={errors.clientName} />
          <FormField label="אימייל הלקוח *" type="email" placeholder="name@example.com" registration={register("clientEmail")} error={errors.clientEmail} />
        </div>
        <p className="-mt-4 text-sm text-muted">לפי האימייל הפרויקט מקושר ללקוח – כשהוא יירשם, הפרויקט יופיע אצלו באזור האישי.</p>

        {/* Controller – מחבר ל־react-hook-form שדה שאינו input רגיל (כאן: שורת כפתורי Pill) */}
        <PillGroup label="סוג צילומים / קטגוריה *" error={errors.category?.message}>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <>
                {CATEGORIES.map((c) => (
                  <Pill key={c} active={field.value === c} onClick={() => field.onChange(c)}>{categoryLabels[c]}</Pill>
                ))}
              </>
            )}
          />
        </PillGroup>

        <PillGroup label="סוג חבילה *" error={errors.packageId?.message}>
          {packages.map((pkg) => (
            <Pill key={pkg.id} active={selectedPackage?.id === pkg.id} onClick={() => choosePackage(pkg)}>{pkg.name}</Pill>
          ))}
        </PillGroup>
        {selectedPackage && (
          <p className="-mt-4 text-sm text-muted">
            {hasAlbum ? "החבילה כוללת אלבום – סטטוס האלבום יוצג ללקוח." : "בחבילה הזו אין אלבום – סטטוס האלבום נעול על \"ללא אלבום\"."}
          </p>
        )}

        <PillGroup label="סטטוס עבודה">
          <Controller
            control={control}
            name="workStatus"
            render={({ field }) => (
              <>
                {WORK_STATUS_STEPS.map((s) => (
                  <Pill key={s} active={field.value === s} onClick={() => field.onChange(s)}>{workStatusLabels[s]}</Pill>
                ))}
              </>
            )}
          />
        </PillGroup>

        <PillGroup label="סטטוס אלבום" error={errors.albumStatus?.message}>
          <Controller
            control={control}
            name="albumStatus"
            render={({ field }) => (
              <>
                {ALBUM_STATUS_STEPS.map((s) => (
                  // בלי אלבום – רק "ללא אלבום" אפשרי, השאר מושבתים
                  <Pill key={s} active={field.value === s} disabled={!hasAlbum && s !== "None"} onClick={() => field.onChange(s)}>
                    {albumStatusLabels[s]}
                  </Pill>
                ))}
              </>
            )}
          />
        </PillGroup>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="תאריך הצילום *" type="date" registration={register("shootDate")} error={errors.shootDate} className="[color-scheme:dark]" />
          {/* valueAsNumber – השדה מחזיר מספר ולא טקסט, כמו שהשרת מצפה */}
          <FormField label="עלות (₪) *" type="number" min={0} placeholder="0" registration={register("cost", { valueAsNumber: true })} error={errors.cost} />
        </div>

        {/* התמונות המלאות כבדות מדי להעלאה – שולחים ללקוח קישור להורדה (ג׳מבו, Google Drive וכו') */}
        <FormField
          label="קישור להורדת התמונות המלאות (ג׳מבו)"
          type="url"
          dir="ltr"
          placeholder="https://..."
          registration={register("downloadLink")}
          error={errors.downloadLink}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-bold">הערות פנימיות (רק המנהלת רואה)</span>
          <textarea
            {...register("notes")}
            rows={3}
            className="w-full rounded-2xl border border-line bg-ink px-4 py-3 outline-none focus:border-violet"
          />
          {errors.notes && <span className="mt-1.5 block text-sm text-rose">{errors.notes.message}</span>}
        </label>

        {errors.root && <p className="rounded-2xl bg-rose/10 px-4 py-3 text-sm text-rose">{errors.root.message}</p>}

        <div className="flex gap-3">
          <Button type="submit" isLoading={isSubmitting}>{submitLabel}</Button>
          <Link to="/admin/projects" className="rounded-full border border-line px-6 py-3 font-bold transition hover:border-rose">ביטול</Link>
        </div>
      </form>

      <div className="space-y-6">
        {/* "תצוגת הלקוח" – מתעדכנת חי בזמן שבוחרים סטטוס */}
        <aside className="rounded-[2rem] border border-line bg-card p-6">
          <h2 className="text-xl font-extrabold">תצוגת הלקוח</h2>
          <p className="mt-1 text-sm text-muted">כך יראו הסטטוסים באזור האישי.</p>
          <dl className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted">עבודה</dt>
              <dd><StatusBadge kind="work" status={workStatus} /></dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">אלבום</dt>
              <dd><StatusBadge kind="album" status={albumStatus} /></dd>
            </div>
          </dl>
        </aside>
        {sidebar}
      </div>
    </div>
  );
}

// כותרת + שורת כפתורי Pill + הודעת שגיאה
function PillGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {error && <span className="mt-1.5 block text-sm text-rose">{error}</span>}
    </fieldset>
  );
}

export default ProjectForm;
