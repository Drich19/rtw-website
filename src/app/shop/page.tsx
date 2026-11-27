import { Suspense } from "react";
import Catalog from "@/components/Catalog";
export default function Shop() {
  return (
    <Suspense fallback={<p>Loading collection…</p>}>
      <Catalog />
    </Suspense>
  );
}
