import { looks } from "@/lib/collection";
import EnsembleReveal from "@/components/EnsembleReveal";
export default async function Lookbook({
  searchParams,
}: {
  searchParams: Promise<{ look?: string }>;
}) {
  const index = Number((await searchParams).look);
  return (
    <EnsembleReveal
      initiallyExpanded
      key={index}
      initial={
        Number.isInteger(index) && index >= 0 && index < looks.length
          ? index
          : 1
      }
    />
  );
}
