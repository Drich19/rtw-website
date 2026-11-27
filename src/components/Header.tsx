"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "./ui/sheet";
import { useBag } from "./Bag";
export default function Header() {
  const { lines } = useBag(),
    [open, set] = useState(false);
  const path = usePathname();
  const nav = (
    <>
      <Link
        aria-current={path.startsWith("/shop") ? "page" : undefined}
        href="/shop"
      >
        Shop
      </Link>
      <Link
        aria-current={path.startsWith("/lookbook") ? "page" : undefined}
        href="/lookbook"
      >
        Lookbook
      </Link>
      <Link
        aria-current={
          path === "/login" || path === "/signup" ? "page" : undefined
        }
        href="/login"
      >
        Account
      </Link>
    </>
  );
  return (
    <header>
      <Link href="/" className="brand" aria-label="RTW Archive home">
        rtw<span>/ archive</span>
      </Link>
      <nav>{nav}</nav>
      <div className="header-end">
        <Link href="/cart">
          Bag ({lines.reduce((n, l) => n + l.quantity, 0)})
        </Link>
        <Sheet open={open} onOpenChange={set}>
          <SheetTrigger className="menu">Menu</SheetTrigger>
          <SheetContent className="mobile-menu">
            <SheetTitle>RTW / archive</SheetTitle>
            <SheetDescription>Browse the collection</SheetDescription>
            <div onClick={() => set(false)}>{nav}</div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
