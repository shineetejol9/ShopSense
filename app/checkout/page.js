"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: "", address: "", phone: "", notes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.address || !form.phone) {
      window.alert("Please fill in your name, address, and phone number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.name,
          address: form.address,
          phone: form.phone,
          notes: form.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to place order right now.");
      }

      window.alert("Thank you! Your order has been placed successfully.");
      setForm({ name: "", address: "", phone: "", notes: "" });
    } catch (error) {
      console.error("Order placement failed:", error);
      window.alert(error.message || "Unable to place order right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-slate-50 to-slate-100 px-6 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-4xl border border-slate-200/80 bg-white/85 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.08)]">
          <div className="grid gap-4 md:grid-cols-[1.3fr_0.9fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Ready to complete your order</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Checkout for your society essentials.
              </h1>
            </div>
            <div className="rounded-[28px] bg-emerald-600/10 p-6 text-slate-950">
              <p className="text-sm uppercase tracking-[0.32em] text-emerald-700">Fast service</p>
              <p className="mt-3 text-lg font-semibold">Pickup or delivery within Berhampur society.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-4xl border border-slate-200/80 bg-white/95 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Delivery details</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Fill in the details so your order reaches the right place quickly.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {[
                { id: "name", label: "Full name", type: "text", placeholder: "Your name" },
                { id: "address", label: "Address", type: "text", placeholder: "Society block, lane or street" },
                { id: "phone", label: "Phone number", type: "tel", placeholder: "+91 98765 43210" },
              ].map((field) => (
                <label key={field.id} className="block">
                  <span className="text-sm font-medium text-slate-700">{field.label}</span>
                  <input
                    type={field.type}
                    value={form[field.id]}
                    placeholder={field.placeholder}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                  />
                </label>
              ))}

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Order notes</span>
                <textarea
                  value={form.notes}
                  placeholder="Delivery instructions or product details"
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="mt-3 w-full rounded-[28px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
