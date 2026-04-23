import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";

const components = {
  a: ({ href = "", ...rest }: React.ComponentProps<"a">) => {
    const internal = href.startsWith("/");
    if (internal) return <Link href={href} {...rest} />;
    return <a href={href} rel="noopener" target="_blank" {...rest} />;
  },
};

export function MdxBody({ source }: { source: string }) {
  return (
    <div className="prose prose-slate max-w-none">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
