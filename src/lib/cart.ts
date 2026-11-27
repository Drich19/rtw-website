import { products, sizes } from "./collection";
export type Line = {
  slug: string;
  size: string;
  color: string;
  quantity: number;
};
export const key = (l: Line) => JSON.stringify([l.slug, l.size, l.color]);
export function normalize(input: unknown): Line[] {
  const result: Line[] = [];
  if (!Array.isArray(input)) return result;
  for (const row of input) {
    if (!row || typeof row !== "object") continue;
    const product = products.find((p) => p.slug === row.slug);
    if (
      !product ||
      !sizes.includes(row.size) ||
      row.color !== product.color ||
      !Number.isInteger(row.quantity) ||
      row.quantity < 1
    )
      continue;
    const line = {
      slug: product.slug,
      size: row.size,
      color: product.color,
      quantity: Math.min(99, row.quantity),
    };
    const existing = result.find((l) => key(l) === key(line));
    if (existing)
      existing.quantity = Math.min(99, existing.quantity + line.quantity);
    else result.push(line);
  }
  return result;
}
