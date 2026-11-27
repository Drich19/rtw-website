"use client";
import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { looks, number, peso, products } from "@/lib/collection";

const count = looks.length;
const wrap = (value: number) => ((value % count) + count) % count;
export default function EnsembleReveal({
  initial = 0,
  initiallyExpanded = false,
}: {
  initial?: number;
  initiallyExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  // An unbounded cursor lets 04 → 01 travel just one quarter-turn.
  const [cursor, setCursor] = useState(initial);
  const selected = wrap(cursor),
    look = looks[selected];
  const touch = useRef<{ x: number; y: number } | null>(null);
  const pieces = look.pieces.map(
    (slug) => products.find((p) => p.slug === slug)!,
  );
  function step(direction: number) {
    setCursor((previous) => previous + direction);
  }
  function select(index: number) {
    setCursor((previous) => {
      const forward = wrap(index - wrap(previous));
      return previous + (forward > count / 2 ? forward - count : forward);
    });
  }
  return (
    <section
      className="campaign"
      data-expanded={expanded}
      aria-label="Four in Frame runway"
      onKeyDown={(e) => {
        if (expanded && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
          e.preventDefault();
          step(e.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="campaign-top">
        <span>RTW ARCHIVE</span>
        <span>
          {expanded
            ? "RUNWAY / LOOK " + number(selected)
            : "CAMPAIGN FILM / 01—04"}
        </span>
      </div>
      <div
        className="campaign-stage"
        id="ensemble-stage"
        style={{ "--cursor": cursor } as CSSProperties}
        onTouchStart={(e) => {
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchCancel={() => {
          touch.current = null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          touch.current = null;
          if (!expanded || !start) return;
          const dx = e.changedTouches[0].clientX - start.x,
            dy = e.changedTouches[0].clientY - start.y;
          if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.4)
            step(dx < 0 ? 1 : -1);
        }}
      >
        <div className="hero-title">
          <h1>
            Four in <em>Frame.</em>
          </h1>
          <p>One collection, four perspectives.</p>
        </div>
        {expanded && (
          <div className="stage-caption" aria-hidden="true">
            FRAME / {number(selected)}
            <b>{look.name}</b>
          </div>
        )}
        {looks.map((item, i) => (
          <button
            key={item.id}
            className="figure"
            style={{ "--i": i } as CSSProperties}
            disabled={!expanded}
            tabIndex={-1}
            aria-label={"Focus " + item.name}
            aria-pressed={expanded && selected === i}
            onClick={() => select(i)}
          >
            <Image
              src={item.image}
              alt={item.name + " full outfit"}
              fill
              sizes="(max-width:650px) 83vw,(max-width:1000px) 52vw,600px"
              loading="eager"
              draggable={false}
            />
          </button>
        ))}
      </div>
      <div className="campaign-bar">
        <button
          className="reveal-control"
          aria-controls="ensemble-stage"
          aria-expanded={expanded}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}{" "}
          {expanded ? "Return to lineup" : "Reveal the four looks"}
        </button>
        {expanded && (
          <div className="run-controls" role="group" aria-label="Runway looks">
            <button aria-label="Previous" onClick={() => step(-1)}>
              <ArrowLeft size={18} />
            </button>
            {looks.map((item, i) => (
              <button
                key={item.id}
                aria-label={"Show " + item.name}
                aria-pressed={selected === i}
                onClick={() => select(i)}
              >
                {number(i)}
              </button>
            ))}
            <button aria-label="Next" onClick={() => step(1)}>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
        <Link href="/shop">Shop all garments</Link>
      </div>
      {expanded && (
        <div className="ensemble-detail" key={look.id} aria-live="polite">
          <div>
            <span className="mono">LOOK {number(selected)} / 04</span>
            <h2>{look.name}</h2>
          </div>
          <div className="ensemble-items">
            <h3 className="mono">Shop this look</h3>
            {pieces.map((p) => (
              <Link key={p.slug} href={"/shop/" + p.slug + "?look=" + selected}>
                {p.name}
                <span>{peso(p.price)} <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
          <div className="look-total">
            Look total
            <strong>{peso(pieces.reduce((sum, p) => sum + p.price, 0))}</strong>
          </div>
        </div>
      )}
    </section>
  );
}
