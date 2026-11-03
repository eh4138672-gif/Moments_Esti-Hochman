import type { Package } from "../../types/package";

// שורות ההשוואה. included – פונקציה שמחליטה לכל חבילה אם השורה כלולה בה
const ROWS: { label: string; included: (pkg: Package) => boolean }[] = [
  { label: "צילום", included: () => true },
  { label: "עריכת תמונות", included: () => true },
  { label: "מסירה דיגיטלית", included: () => true },
  { label: "מעקב סטטוס עבודה", included: () => true },
  { label: "אלבום מעוצב", included: (pkg) => pkg.includesAlbum },
  { label: "מעקב סטטוס אלבום", included: (pkg) => pkg.includesAlbum },
];

interface ComparisonTableProps {
  packages: Package[];
}

// "השוואה במבט אחד" – עמודה לכל חבילה. מה שתלוי באלבום נקבע לפי includesAlbum מהשרת
function ComparisonTable({ packages }: ComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-[2rem] border border-line bg-card">
      <table className="w-full min-w-[28rem] text-center">
        <thead className="bg-line/40">
          <tr>
            <th className="px-6 py-4 text-right font-bold text-muted">מה כלול</th>
            {packages.map((pkg) => (
              <th key={pkg.id} className={`px-6 py-4 font-extrabold ${pkg.includesAlbum ? "text-rose" : "text-sky"}`}>
                {pkg.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {ROWS.map((row) => (
            <tr key={row.label}>
              <td className="px-6 py-4 text-right font-bold">{row.label}</td>
              {packages.map((pkg) => (
                <td key={pkg.id} className="px-6 py-4">
                  {row.included(pkg) ? <span className="font-bold text-rose">✓ כלול</span> : <span className="text-muted">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;
