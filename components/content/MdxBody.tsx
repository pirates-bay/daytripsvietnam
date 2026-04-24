import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import remarkGfm from "remark-gfm";

const components = {
  a: ({ href = "", ...rest }: React.ComponentProps<"a">) => {
    const internal = href.startsWith("/");
    if (internal) return <Link href={href} {...rest} />;
    return <a href={href} rel="noopener" target="_blank" {...rest} />;
  },
};

export function MdxBody({ source }: { source: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-table:text-sm prose-th:bg-slate-50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2">
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
