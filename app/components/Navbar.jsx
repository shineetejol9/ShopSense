"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CART_KEY = "berhampur-cart";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem(CART_KEY) : null;
      const current = stored ? JSON.parse(stored) : [];
      setCartCount(Array.isArray(current) ? current.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0);
    };

    updateCartCount();
    window.addEventListener("berhampur-cart-update", updateCartCount);
    return () => window.removeEventListener("berhampur-cart-update", updateCartCount);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3 text-slate-950">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-600/20">
            S
          </div>
          <div>
            <p className="text-base font-semibold">ShopSense</p>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Society Marketplace</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-700 transition hover:text-emerald-600">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-slate-700 transition hover:text-emerald-600">
            About
          </Link>
          <Link href="/cart" className="text-sm font-medium text-slate-700 transition hover:text-emerald-600">
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          <Link href="/checkout" className="rounded-full border border-slate-900/10 bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">
            Checkout
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          <span className="text-xl">{open ? "×" : "☰"}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white/95 px-6 pb-6 md:hidden">
          <nav className="space-y-3 pt-4">
            <Link href="/" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Home
            </Link>
            <Link href="/about" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              About
            </Link>
            <Link href="/cart" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>
            <Link href="/checkout" className="block rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
              Checkout
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
