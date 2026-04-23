export function AnswerSummary({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-speakable
      className="rounded-xl border border-brand-100 bg-brand-50/60 px-5 py-4 text-base leading-relaxed text-slate-800 md:text-lg"
    >
      <p className="m-0">{children}</p>
    </div>
  );
}
