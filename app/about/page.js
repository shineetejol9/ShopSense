export default function AboutPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-emerald-100/30 via-slate-50 to-slate-100 px-6 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl rounded-4xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <section className="mb-10 space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">About ShopSense</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            A marketplace built for society life in Berhampur.
          </h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            Our marketplace brings trusted local sellers, essential services, and community offers into one lively digital place. Designed for families, residents, and small businesses in Berhampur, it matches the city’s vibrant culture with modern convenience.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">What we deliver</p>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li>• Curated community goods from trusted neighborhood sellers.</li>
              <li>• Fast order browsing with local pickup and delivery options.</li>
              <li>• A seamless checkout flow built for everyday society needs.</li>
            </ul>
          </div>
          <div className="rounded-[28px] border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">Why it matters</p>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li>• Strengthens Berhampur’s local economy by giving sellers an easy digital storefront.</li>
              <li>• Helps residents discover essentials, groceries, gifts, and services nearby.</li>
              <li>• Creates a safer, community-first shopping experience for society living.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { label: "Community first", description: "Built to support local society needs and resident convenience." },
            { label: "Modern trust", description: "Clean design, transparent pricing, and easy order tracking." },
            { label: "Friendly, fast", description: "A polished experience for users who want simple shopping from home." },
          ].map((item) => (
            <div key={item.label} className="rounded-[28px] border border-slate-200/75 bg-white p-6 shadow-lg shadow-slate-200/40">
              <h2 className="text-xl font-semibold text-slate-950">{item.label}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
