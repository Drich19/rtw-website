"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products, categories, peso, photo } from "@/lib/collection";
export default function Catalog() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const params = useSearchParams(),
    q = params.get("q") ?? "",
    category = params.get("category") ?? "",
    sort = params.get("sort") ?? "";
  function change(key: string, value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    window.history.replaceState(
      null,
      "",
      next.size ? "/shop?" + next : "/shop",
    );
  }
  const found = products
    .filter(
      (p) =>
        (!category || p.category === category) &&
        [p.name, p.material, p.color]
          .join(" ")
          .toLowerCase()
          .includes(q.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  return (
    <section className="standard">
      <p className="mono">VOLUME 01 / CATALOG</p>
      <h1>
        All garments<i>.</i>
      </h1>
      <div className="filters">
        <label>
          Search
          <input
            type="search"
            value={q}
            onChange={(e) => change("q", e.target.value)}
            placeholder="Name, colour or fabric"
          />
        </label>
        <button className="filter-toggle" aria-controls="catalog-options"
          aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}>
          Filter &amp; sort{category && " · " + category}
          <span aria-hidden="true">{filtersOpen ? " −" : " +"}</span>
        </button>
        <div id="catalog-options" className="filter-options" data-open={filtersOpen}>
          <label>
            Category
            <select
              value={category}
              onChange={(e) => change("category", e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Sort
            <select value={sort} onChange={(e) => change("sort", e.target.value)}>
              <option value="">Archive order</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </label>
        </div>
        {(q || category || sort) && <button onClick={() => window.history.replaceState(null, "", "/shop")}>
          Reset
        </button>}
      </div>
      <p role="status">{found.length} garments</p>
      <div className="grid">
        {found.map((p) => (
          <Link key={p.slug} href={"/shop/" + p.slug}>
            <div className="catalog-photo">
              <Image
                src={photo(p)}
                alt={p.name}
                fill
                sizes="(max-width:700px) 45vw, 24vw"
              />
            </div>
            <h2>{p.name}</h2>
            <span>{peso(p.price)}</span>
          </Link>
        ))}
      </div>
      {!found.length && <p>Try another name, colour or category.</p>}
    </section>
  );
}
