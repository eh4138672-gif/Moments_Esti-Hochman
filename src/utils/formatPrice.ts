// 1800 → "‏1,800 ₪" (פורמט שקלים בעברית, בלי אגורות)
const shekel = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return shekel.format(amount);
}
