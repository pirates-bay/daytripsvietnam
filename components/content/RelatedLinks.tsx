import Link from "next/link";

export interface RelatedLink {
  href: string;
  title: string;
}

export function RelatedLinks({ items, heading = "Related reading" }: {
  items: RelatedLink[];
  heading?: string;
}) {
  if (items.length === 0) return null;
  return (
    <aside className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-semibold text-slate-900">{heading}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-brand-700 hover:underline">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
