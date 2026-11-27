"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { looks } from "@/lib/collection";

export default function StyledLookLink({ slug, defaultIndex }: { slug: string; defaultIndex: number }) {
  const origin = useSearchParams().get("look");
  const sourceIndex = looks.findIndex((look, i) => String(i) === origin && look.pieces.includes(slug));
  const index = sourceIndex >= 0 ? sourceIndex : defaultIndex;
  return (
    <Link className="styled-link" href={"/lookbook?look=" + index}>
      {sourceIndex >= 0 ? "Back to " : "See it styled in "}{looks[index].name}
    </Link>
  );
}
