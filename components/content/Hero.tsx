export function Hero({ eyebrow, title, summary, image, imageAlt }: {
  eyebrow?: string;
  title: string;
  summary: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 text-white">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={imageAlt ?? ""}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          fetchPriority="high"
        />
      )}
      <div className="relative px-6 py-16 md:px-12 md:py-24">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold leading-tight md:text-5xl">
          {title}
        </h1>
        <p data-speakable className="mt-4 max-w-2xl text-lg text-slate-100">
          {summary}
        </p>
      </div>
    </section>
  );
}
