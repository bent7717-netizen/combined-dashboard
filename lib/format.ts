// See asset-tracker/lib/format.ts: avoid Intl.NumberFormat's `style: "currency"`
// for JPY — Node's ICU and browser ICU can render different yen glyphs
// (half-width ¥ vs full-width ￥) for the same locale, causing SSR/client
// hydration mismatches. Format the number plainly and prepend ¥ ourselves.
export function formatJpy(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "—";
  const sign = value < 0 ? "-" : "";
  const formatted = new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 0 }).format(Math.abs(value));
  return `${sign}¥${formatted}`;
}
