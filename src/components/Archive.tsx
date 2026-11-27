"use client";
import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { products, peso, number, photo } from "@/lib/collection";

export function ArchiveRack() {
  const [active, setActive] = useState(1);
  const mobile = useRef<HTMLDivElement>(null);
  const selectedIndex = useRef(1);
  function slideWidth(strip: HTMLDivElement) {
    return strip.querySelector(".slide")?.getBoundingClientRect().width ?? 0;
  }
  useEffect(() => {
    const strip = mobile.current;
    if (!strip) return;
    const align = () => {
      strip.scrollLeft = selectedIndex.current * slideWidth(strip);
    };
    align();
    const observer = new ResizeObserver(align);
    observer.observe(strip);
    return () => observer.disconnect();
  }, []);
  const count = 5;
  const product = products[active];
  function select(index: number) {
    if (index < 0 || index >= count) return;
    selectedIndex.current = index;
    setActive(index);
    const strip = mobile.current;
    if (strip?.clientWidth)
      strip.scrollTo({ left: index * slideWidth(strip), behavior: "instant" });
  }
  function keys(event: KeyboardEvent) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      select(active + (event.key === "ArrowLeft" ? -1 : 1));
    }
  }
  const name = (i: number) => products[i].name;
  const src = (i: number) => photo(products[i]);
  return (
    <section
      className="feature rack"
      aria-label="Archive Rack"
      onKeyDown={keys}
    >
      <div className="feature-heading">
        <div>
          <p className="mono">RTW / VOLUME 01</p>
          <h2 className="stage-heading">
            The Archive Rack
            <i>.</i>
          </h2>
        </div>
        <span className="mono count">GARMENTS / {number(count - 1)}</span>
      </div>
      <div className="spread">
        <div className="stage-shell">
          <div className="stage">
            <div className="rail" />
            {Array.from({ length: count }, (_, i) => {
              const delta = i - active;
              const x = (i - 2) * 13 + Math.sign(delta) * 9;
              const style = {
                "--x": x + "%",
                "--turn": Math.sign(delta) * -58 + "deg",
                "--scale": 1 - Math.min(Math.abs(delta), 2) * 0.055,
                "--lift": "0%",
                zIndex: 10 - Math.abs(delta),
              } as CSSProperties;
              return (
                <button
                  key={i}
                  style={style}
                  className={"specimen " + (i === active ? "selected" : "")}
                  onClick={() => select(i)}
                  aria-label={"Select " + name(i)}
                  aria-pressed={i === active}
                >
                  <Image
                    src={src(i)}
                    alt={name(i)}
                    fill
                    sizes="300px"
                    loading={i === active ? "eager" : "lazy"}
                  />
                </button>
              );
            })}
          </div>
          <div
            className="mobile-stage"
            ref={mobile}
            onScroll={(e) => {
              const el = e.currentTarget;
              const width = slideWidth(el);
              if (width) {
                const index = Math.min(
                  count - 1,
                  Math.max(0, Math.round(el.scrollLeft / width)),
                );
                selectedIndex.current = index;
                setActive(index);
              }
            }}
          >
            <div className="mobile-track">
              {Array.from({ length: count }, (_, i) => (
                <div className="slide" key={i}>
                  <Image
                    src={src(i)}
                    alt={name(i)}
                    fill
                    sizes="90vw"
                    loading={i === active ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="stage-controls">
            <button
              aria-label="Previous"
              disabled={active === 0}
              onClick={() => select(active - 1)}
            >
              ←
            </button>
            <div className="index-buttons">
              {Array.from({ length: count }, (_, i) => (
                <button
                  key={i}
                  onClick={() => select(i)}
                  aria-pressed={i === active}
                  aria-label={"Show " + name(i)}
                >
                  {number(i)}
                </button>
              ))}
            </div>
            <button
              aria-label="Next"
              disabled={active === count - 1}
              onClick={() => select(active + 1)}
            >
              →
            </button>
          </div>
        </div>
        <aside className="dossier" aria-live="polite">
          <div className="mono">GARMENT N° {number(active)}</div>
          <h2>{name(active)}</h2>
          <p>{product.description}</p>
          <dl>
            <dt>Material</dt>
            <dd>{product.material}</dd>
            <dt>Colour</dt>
            <dd>{product.color}</dd>
          </dl>
          <strong className="price">{peso(product.price)}</strong>
          <Link className="action" href={"/shop/" + product.slug}>
            View product
          </Link>
        </aside>
      </div>
    </section>
  );
}
