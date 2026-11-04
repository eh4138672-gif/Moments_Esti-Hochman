import type { Category } from "../../types/project";
import { CATEGORIES, categoryLabels } from "../../utils/statusLabels";
import Pill from "../ui/Pill";

interface CategoryTabsProps {
  value?: Category;
  onChange: (category?: Category) => void;
}

function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Pill active={value === undefined} onClick={() => onChange(undefined)}>הכל</Pill>
      {CATEGORIES.map((category) => (
        <Pill key={category} active={value === category} onClick={() => onChange(category)}>
          {categoryLabels[category]}
        </Pill>
      ))}
    </div>
  );
}

export default CategoryTabs;
