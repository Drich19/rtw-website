"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { key, normalize, type Line } from "@/lib/cart";
import { products, sizes, peso, photo, type Product } from "@/lib/collection";
import { Button } from "./ui/button";
const Bag = createContext<{
  lines: Line[];
  set: Dispatch<SetStateAction<Line[]>>;
  ready: boolean;
}>({ lines: [], set: () => {}, ready: false });
export const useBag = () => useContext(Bag);
export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, set] = useState<Line[]>([]),
    [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      let restored: Line[] = [];
      try {
        restored = normalize(
          JSON.parse(localStorage.getItem("rtw.bag") ?? "[]"),
        );
      } catch {}
      set(restored);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem("rtw.bag", JSON.stringify(lines));
      } catch {}
  }, [ready, lines]);
  return <Bag.Provider value={{ lines, set, ready }}>{children}</Bag.Provider>;
}
export function Buy({ product }: { product: Product }) {
  const { set, ready } = useBag();
  const [size, setSize] = useState(""),
    [quantity, setQuantity] = useState(1),
    [message, setMessage] = useState("");
  return (
    <form
      className="buy"
      onSubmit={(e) => {
        e.preventDefault();
        set((old) =>
          normalize([...old, { slug: product.slug, size, color: product.color, quantity }]),
        );
        setMessage("Added to your bag.");
      }}
    >
      <label>
        Size
        <select
          required
          value={size}
          onChange={(e) => {
            setSize(e.target.value);
            setMessage("");
          }}
        >
          <option value="">Choose size</option>
          {sizes.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label>
        Quantity
        <input
          type="number"
          min="1"
          max="99"
          required
          value={quantity || ""}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </label>
      <Button className="action" disabled={!ready}>
        Add to bag
      </Button>
      <div role="status">
        {message} {message && <Link href="/cart">View bag</Link>}
      </div>
    </form>
  );
}
export function BagPage({ checkout = false }: { checkout?: boolean }) {
  const { lines, set, ready } = useBag(),
    [receipt, confirm] = useState<Line[] | null>(null);
  const rows = receipt ?? lines;
  const subtotal = rows.reduce(
    (sum, l) =>
      sum + products.find((p) => p.slug === l.slug)!.price * l.quantity,
    0,
  );
  return (
    <section className={"standard narrow"+(receipt?" receipt":"")}>
      <p className="mono">RTW / {checkout ? "DEMO CHECKOUT" : "BAG"}</p>
      <h1>
        {receipt ? "Order confirmed" : checkout ? "Checkout" : "Your bag"}
        <i>.</i>
      </h1>
      {checkout && (
        <p>
          Academic demonstration. No payment or shipping details are collected.
        </p>
      )}
      {!ready ? (
        <p role="status">Loading bag…</p>
      ) : !rows.length ? (
        <>
          <p>Your bag is empty.</p>
          <Link className="action" href="/shop">
            Explore garments
          </Link>
        </>
      ) : (
        <>
          {receipt && (
            <p role="status">Demo complete. Your bag has been cleared.</p>
          )}
          {rows.map((l) => {
            const p = products.find((p) => p.slug === l.slug)!;
            return (
              <article className="bag-row" key={key(l)}>
                <Image src={photo(p)} alt={p.name} width={76} height={88} />
                <div>
                  <Link href={"/shop/" + p.slug}>{p.name}</Link>
                  <p>
                    {l.color} / {l.size}
                  </p>
                  {checkout ? (
                    <small>Quantity {l.quantity}</small>
                  ) : (
                    <>
                      <label>
                        Quantity{" "}
                        <select
                          value={l.quantity}
                          onChange={(e) =>
                            set((old) =>
                              old.map((x) =>
                                key(x) === key(l)
                                  ? { ...x, quantity: Number(e.target.value) }
                                  : x,
                              ),
                            )
                          }
                        >
                          {Array.from({ length: 99 }, (_, i) => (
                            <option key={i}>{i + 1}</option>
                          ))}
                        </select>
                      </label>{" "}
                      <button
                        onClick={() =>
                          set((old) => old.filter((x) => key(x) !== key(l)))
                        }
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
                <strong>{peso(p.price * l.quantity)}</strong>
              </article>
            );
          })}
          <p className="total">
            Subtotal <strong>{peso(subtotal)}</strong>
          </p>
          {receipt ? (
            <Link href="/shop">Continue shopping</Link>
          ) : checkout ? (
            <Button
              className="action"
              onClick={() => {
                confirm(lines);
                set([]);
              }}
            >
              Confirm demo order
            </Button>
          ) : (
            <Link className="action" href="/checkout">
              Demo checkout
            </Link>
          )}
        </>
      )}
    </section>
  );
}
