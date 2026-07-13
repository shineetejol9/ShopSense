"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const CART_KEY = "berhampur-cart";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!cartMessage) return;
    const timeout = window.setTimeout(() => setCartMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [cartMessage]);

  const handleSearch = async () => {
    const res = await fetch("/api/ai-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setProducts(data);
  };

  const handleAddToCart = (product) => {
    const saved = localStorage.getItem(CART_KEY);
    const current = saved ? JSON.parse(saved) : [];
    const existingIndex = current.findIndex((item) => item._id === product._id);
    const nextCart = existingIndex >= 0
      ? current.map((item, index) =>
          index === existingIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        )
      : [...current, { ...product, quantity: 1 }];

    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
    window.dispatchEvent(new Event("berhampur-cart-update"));
    setCartMessage(`${product.title} added to cart.`);
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-8 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-[28px] border border-slate-200/80 bg-white/80 px-6 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
                Premium Collection
              </p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Discover our products
              </h1>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
              {products.length} items available
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            />
            <button
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </section>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-sm">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-600 shadow-sm">
            No products available yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product._id}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_45px_rgba(15,23,42,0.12)]"
              >
                <div className="relative h-64 w-full overflow-hidden rounded-t-[24px] bg-slate-100">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-600">
                      Image unavailable
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                    {product.Category || "Category"}
                  </p>
                  <h2 className="mb-2 text-xl font-semibold text-slate-900">
                    {product.title}
                  </h2>
                  <p className="mb-5 text-sm leading-6 text-slate-600 line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-lg font-semibold text-slate-900">
                      ₹{product.Price ?? 0}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product._id}`}
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        View
                      </Link>
                      <button
                        className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}