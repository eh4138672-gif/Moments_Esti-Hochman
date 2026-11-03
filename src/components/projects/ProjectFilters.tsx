import { useEffect, useState, type ReactNode } from "react";
import type { ProjectFilters as Filters } from "../../types/project";
import type { Package } from "../../types/package";
import {
  ALBUM_STATUS_STEPS,
  CATEGORIES,
  WORK_STATUS_STEPS,
  albumStatusLabels,
  categoryLabels,
  workStatusLabels,
} from "../../utils/statusLabels";

// אפשרויות המיון. כל אחת = שדה + כיוון, ונשמרת כמחרוזת אחת ב־select (למשל "cost-asc")
const SORT_OPTIONS = [
  { value: "shootDate-desc", label: "תאריך צילום (החדש קודם)" },
  { value: "shootDate-asc", label: "תאריך צילום (הישן קודם)" },
  { value: "cost-desc", label: "עלות (הגבוהה קודם)" },
  { value: "cost-asc", label: "עלות (הנמוכה קודם)" },
  { value: "clientName-asc", label: "שם לקוח (א–ת)" },
  { value: "createdAt-desc", label: "נוצר לאחרונה" },
] as const;

interface ProjectFiltersProps {
  filters: Filters; // הסינונים הנוכחיים (מגיעים מהכתובת)
  packages: Package[];
  onChange: (changes: Partial<Filters>) => void; // הדף מעדכן את הכתובת
}

// שורת החיפוש, 4 הסינונים והמיון. הקומפוננטה לא שומרת סינונים בעצמה – רק מדווחת לדף
function ProjectFilters({ filters, packages, onChange }: ProjectFiltersProps) {
  // החיפוש: הטקסט מתעדכן מיד בשדה, אבל נשלח לשרת רק 300ms אחרי שמפסיקים להקליד (debounce)
  const [searchText, setSearchText] = useState(filters.search ?? "");

  useEffect(() => {
    if (searchText === (filters.search ?? "")) return; // אין שינוי – לא שולחים
    const timer = setTimeout(() => onChange({ search: searchText || undefined }), 300);
    return () => clearTimeout(timer); // הוקלדה עוד אות לפני 300ms → מבטלים ומתחילים לספור מחדש
  }, [searchText, filters.search, onChange]);

  const sortValue = `${filters.sortBy ?? "shootDate"}-${filters.sortDir ?? "desc"}`;

  return (
    <div className="grid gap-4 rounded-[2rem] border border-line bg-card p-6 sm:grid-cols-2 lg:grid-cols-6">
      <label className="block sm:col-span-2 lg:col-span-1">
        <span className="mb-2 block text-sm text-muted">חיפוש לפי שם או אימייל</span>
        <input
          type="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="לדוגמה: לוי"
          className="w-full rounded-2xl border border-line bg-ink px-4 py-2.5 outline-none placeholder:text-muted/70 focus:border-violet"
        />
      </label>

      <FilterSelect label="קטגוריה" value={filters.category ?? ""} onChange={(v) => onChange({ category: (v || undefined) as Filters["category"] })}>
        {CATEGORIES.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
      </FilterSelect>

      <FilterSelect label="סוג חבילה" value={filters.packageId?.toString() ?? ""} onChange={(v) => onChange({ packageId: v ? Number(v) : undefined })}>
        {packages.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </FilterSelect>

      <FilterSelect label="סטטוס עבודה" value={filters.workStatus ?? ""} onChange={(v) => onChange({ workStatus: (v || undefined) as Filters["workStatus"] })}>
        {WORK_STATUS_STEPS.map((s) => <option key={s} value={s}>{workStatusLabels[s]}</option>)}
      </FilterSelect>

      <FilterSelect label="סטטוס אלבום" value={filters.albumStatus ?? ""} onChange={(v) => onChange({ albumStatus: (v || undefined) as Filters["albumStatus"] })}>
        {ALBUM_STATUS_STEPS.map((s) => <option key={s} value={s}>{albumStatusLabels[s]}</option>)}
      </FilterSelect>

      <FilterSelect
        label="מיון לפי"
        value={sortValue}
        allOption={false}
        onChange={(v) => {
          const [sortBy, sortDir] = v.split("-") as [Filters["sortBy"], Filters["sortDir"]];
          onChange({ sortBy, sortDir });
        }}
      >
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </FilterSelect>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allOption?: boolean; // להוסיף "הכל" בראש הרשימה (בכל הסינונים חוץ מהמיון)
  children: ReactNode;
}

// select אחד עם תווית. ערך ריק ("") = "הכל" = בלי סינון
function FilterSelect({ label, value, onChange, allOption = true, children }: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-ink px-4 py-2.5 outline-none [color-scheme:dark] focus:border-violet"
      >
        {allOption && <option value="">הכל</option>}
        {children}
      </select>
    </label>
  );
}

export default ProjectFilters;
