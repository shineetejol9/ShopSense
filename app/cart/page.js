"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const CART_KEY = "berhampur-cart";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");

  const loadCart = () => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(CART_KEY) : null;
    const current = stored ? JSON.parse(stored) : [];
    setItems(Array.isArray(current) ? current : []);
  };

  useEffect(() => {
    loadCart();
    const handleUpdate = () => loadCart();
    window.addEventListener("berhampur-cart-update", handleUpdate);
    return () => window.removeEventListener("berhampur-cart-update", handleUpdate);
  }, []);

  const updateQuantity = (id, quantity) => {
    const next = items
      .map((item) => (item._id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
      .filter((item) => item.quantity > 0);

    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event("berhampur-cart-update"));
  };

  const removeItem = (id) => {
    const next = items.filter((item) => item._id !== id);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    setItems(next);
    setMessage("Item removed from cart.");
    window.dispatchEvent(new Event("berhampur-cart-update"));
  };

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (item.Price || 0) * (item.quantity || 1), 0),
    [items]
  );

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [message]);

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#eef2ff_0%,#f8fafc_100%)] px-6 py-10 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-4xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
                Your cart
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Review your Berhampur essentials.
              </h1>
            </div>
            <Link
              href="/checkout"
              className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Continue to checkout
            </Link>
          </div>
        </section>

        {message ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-900 shadow-sm">
            {message}
          </div>
        ) : null}

        {items.length === 0 ? (
          <section className="rounded-4xl border border-dashed border-slate-300 bg-white/90 p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-950">Your cart is empty</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Browse the marketplace and add products that make life easier for your society.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
            >
              Explore products
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="space-y-6">
              {items.map((item) => (
                <article key={item._id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-slate-100">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-600">
                            No image
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
                        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                        <p className="mt-3 text-sm font-medium text-slate-900">₹{item.Price ?? 0}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
                        <button
                          type="button"
                          className="px-3 text-lg font-semibold text-slate-900"
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) - 1)}
                        >
                          −
                        </button>
                        <span className="mx-3 min-w-8 text-center font-semibold">{item.quantity || 1}</span>
                        <button
                          type="button"
                          className="px-3 text-lg font-semibold text-slate-900"
                          onClick={() => updateQuantity(item._id, (item.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
                        onClick={() => removeItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Checkout summary</p>
                  <p className="mt-4 text-4xl font-semibold text-slate-950">₹{total}</p>
                </div>
                <div className="space-y-4 rounded-[28px] bg-slate-50 p-5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Items</span>
                    <span>{items.reduce((count, item) => count + (item.quantity || 1), 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Delivery</span>
                    <span>₹49</span>
                  </div>
                </div>
                <div className="rounded-[28px] bg-emerald-600/10 p-5 text-slate-950">
                  <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Estimated total</p>
                  <p className="mt-4 text-2xl font-semibold">₹{total + 49}</p>
                </div>
                <Link
                  href="/checkout"
                  className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Checkout now
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
