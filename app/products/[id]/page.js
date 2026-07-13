"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";


const CART_KEY = "berhampur-cart";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    if (!params?.id) return;

    setLoading(true);
    fetch(`/api/products/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params?.id]);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const handleAddToCart = () => {
    if (!product) return;
    const saved = localStorage.getItem(CART_KEY);
    const current = saved ? JSON.parse(saved) : [];
    const existing = current.findIndex((item) => item._id === product._id);
    const nextCart = existing >= 0
      ? current.map((item, index) =>
        index === existing ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
      : [...current, { ...product, quantity: 1 }];

    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
    window.dispatchEvent(new Event("berhampur-cart-update"));
    setMessage("Added to cart successfully.");
  };

  const askAI = async (type) => {
    if (!product) return;

    try {
      setAiLoading(true);
      setAiResponse("");

      const res = await fetch("/api/product-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          product,
        }),
      });

      const data = await res.json();

      setAiResponse(data.answer);
    } catch (error) {
      console.error(error);
      setAiResponse("Something went wrong.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          Loading product details...
        </div>
      </main>
    );
  }

  if (!product?._id) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl rounded-4xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-xl font-semibold">Product not found</p>
          <p className="mt-3 text-sm text-slate-600">This product may no longer be available.</p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            Back to shop
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-10 text-slate-950 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-4xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="relative h-80 w-full overflow-hidden rounded-4xl bg-slate-100 shadow-inner lg:max-w-[45%] lg:h-[28rem]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-medium text-slate-600">
                  Image unavailable
                </div>
              )}
            </div>
            <div className="space-y-6 lg:max-w-[55%]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-600/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700">
                  {product.Category || "Local Favorite"}
                </span>
                <span className="text-sm text-slate-500">Society pick · Exclusive to ShopSense</span>
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                  {product.title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  {product.description || "Fresh items chosen for your society's everyday needs."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Price</span>
                    <span className="text-lg font-semibold text-slate-950">₹{product.Price ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Availability</span>
                    <span className="font-semibold text-emerald-700">In stock</span>
                  </div>
                </div>

                <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  {message ? (
                    <div className="rounded-3xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
                      {message}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    className="w-full rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
                    onClick={handleAddToCart}
                  >
                    Add to cart
                  </button>
                  <Link
                    href="/cart"
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-4xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600/10 text-sm font-semibold text-emerald-700">
              AI
            </span>
            <h2 className="text-lg font-semibold text-slate-950">AI says</h2>
          </div>
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 min-h-[120px]">
            {aiLoading ? (
              <p className="text-slate-500">Thinking...</p>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {aiResponse || "Choose one of the options below to get AI insights."}
              </p>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => askAI("proscons")}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              👍 About the product
            </button>
            <button
              type="button"
              onClick={() => askAI("worth")}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              💰 Worth the Money?
            </button>
            <button
              type="button"
              onClick={() => askAI("bestfor")}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              🎯 Best For
            </button>
            <button
              type="button"
              onClick={() => askAI("occasion")}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              ✨ Best Occasion
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}