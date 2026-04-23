import Link from "next/link";

export interface Crumb {
  name: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600 mb-4">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.url} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="text-slate-900 font-medium">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.url} className="hover:text-brand-700 hover:underline">
                    {c.name}
                  </Link>
                  <span aria-hidden className="px-1 text-slate-400">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
