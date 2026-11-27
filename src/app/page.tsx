import Link from "next/link";
import Image from "next/image";
import EnsembleReveal from "@/components/EnsembleReveal";
import { ArchiveRack } from "@/components/Archive";
import { categories, looks, number } from "@/lib/collection";
export default function Home() {
  return (
    <>
      <EnsembleReveal />
      <ArchiveRack />
      <section className="editorial">
        <div className="section-title">
          <div>
            <p className="mono">CONTACT SHEET / VOL. 01</p>
            <h2>Studies in silhouette</h2>
          </div>
          <Link href="/lookbook">Explore lookbook</Link>
        </div>
        <div className="contact">
          {looks.map((look, i) => (
            <Link href={"/lookbook?look=" + i} key={look.name}>
              <Image
                src={look.image}
                width={592}
                height={888}
                sizes="(max-width:600px) 31vw, 370px"
                alt={look.name + " styled outfit"}
              />
              <span>
                {number(i)} / {look.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="categories">
        <h2>Shop by category</h2>
        {categories.map((c) => (
          <Link href={"/shop?category=" + c} key={c}>
            {c}
          </Link>
        ))}
      </section>
    </>
  );
}
