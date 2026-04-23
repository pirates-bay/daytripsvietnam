export interface FaqItem {
  q: string;
  a: string;
}

export function Faq({ items, heading = "Frequently asked questions" }: {
  items: FaqItem[];
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading" className="my-10">
      <h2 id="faq-heading" className="text-2xl font-semibold text-slate-900 mb-4">
        {heading}
      </h2>
      <div className="divide-y divide-slate-200 border-y border-slate-200">
        {items.map((f, i) => (
          <details key={i} className="group py-4">
            <summary className="cursor-pointer text-lg font-medium text-slate-900 list-none flex items-start justify-between gap-4">
              <span>{f.q}</span>
              <span aria-hidden className="mt-1 text-brand-700 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-slate-700 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
