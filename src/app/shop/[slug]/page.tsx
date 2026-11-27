import { Suspense } from "react";
import StyledLookLink from "@/components/StyledLookLink";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { products, looks, peso, photo } from "@/lib/collection";
import { Buy } from "@/components/Bag";
export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}
export default async function Detail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params,
    p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const lookIndex = looks.findIndex(look => look.pieces.includes(slug));
  return (
    <section className="standard">
      <Link href="/shop">All garments</Link>
      <div className="detail">
        <div className="product-photo">
          <Image
            src={photo(p)}
            alt={p.color + " " + p.name}
            fill
            sizes="(max-width:700px) 90vw, 45vw"
            loading="eager"
          />
        </div>
        <div>
          <p className="mono">{p.category} / VOLUME 01</p>
          <h1>{p.name}</h1>
          <strong className="price">{peso(p.price)}</strong>
          <p>{p.description}</p>
          <p>
            {p.material} · {p.color}
          </p>
          <Buy product={p} />
          {lookIndex >= 0 && (
            <Suspense fallback={<Link className="styled-link" href={"/lookbook?look=" + lookIndex}>See it styled in {looks[lookIndex].name}</Link>}>
              <StyledLookLink slug={slug} defaultIndex={lookIndex} />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
}
