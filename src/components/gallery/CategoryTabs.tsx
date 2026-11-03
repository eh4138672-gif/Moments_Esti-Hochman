import type { Category } from "../../types/project";
import { CATEGORIES, categoryLabels } from "../../utils/statusLabels";
import Pill from "../ui/Pill";

interface CategoryTabsProps {
  value?: Category; // undefined = "הכל"
  onChange: (category?: Category) => void;
}

// שורת הטאבים של הגלריה – בנויה מ־Pill.
// grid עם עמודות שוות: הטאבים מתפרסים על כל רוחב העמוד (בטלפון – 3 בשורה)
function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  const tabClass = "w-full py-3.5 text-base md:text-lg";

  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
      <Pill active={value === undefined} onClick={() => onChange(undefined)} className={tabClass}>
        הכל
      </Pill>
      {CATEGORIES.map((category) => (
        <Pill key={category} active={value === category} onClick={() => onChange(category)} className={tabClass}>
          {categoryLabels[category]}
        </Pill>
      ))}
    </div>
  );
}

export default CategoryTabs;
