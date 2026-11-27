import type { ReactNode } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { BagProvider } from "@/components/Bag";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "./globals.css";
import "./campaign.css";
export const metadata = {
  title: "RTW / Archive — Volume 01",
  description:
    "Explore an editorial ready-to-wear study in ten garments and four coordinated looks.",
};
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <BagProvider>
          <Header />
          <main id="main">{children}</main>
          <footer>
            <Link className="brand" href="/">
              rtw<span>/ archive</span>
            </Link>
            <span>Classroom edition · Synthetic fashion photography</span>
            <Link href="/shop">Browse collection</Link>
          </footer>
        </BagProvider>
      </body>
    </html>
  );
}
