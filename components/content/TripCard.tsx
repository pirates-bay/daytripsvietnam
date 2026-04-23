import Link from "next/link";

export interface TripCardProps {
  href: string;
  title: string;
  blurb: string;
  image?: string;
  imageAlt?: string;
  duration?: string;
  priceFrom?: { amount: number; currency: string };
}

export function TripCard({ href, title, blurb, image, imageAlt, duration, priceFrom }: TripCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {/* Using plain img here so external/placeholder URLs work before Vercel image optimization */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt ?? title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">{title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{blurb}</p>
        {(duration || priceFrom) && (
          <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
            {duration && <span>⏱ {duration}</span>}
            {priceFrom && (
              <span>
                from {priceFrom.currency} {priceFrom.amount}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
