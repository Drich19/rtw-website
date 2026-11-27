import Link from "next/link";
export default function Missing() {
  return (
    <section className="standard">
      <p className="mono">404</p>
      <h1>Outside the archive.</h1>
      <Link href="/shop">Return to collection</Link>
    </section>
  );
}
