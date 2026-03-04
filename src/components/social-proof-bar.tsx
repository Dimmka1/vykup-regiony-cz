export function SocialProofBar() {
  return (
    <div className="border-b border-slate-200 bg-white py-2.5">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-6 text-sm font-medium text-slate-700 sm:gap-3">
        <span>✓ Bez provize</span>
        <span className="text-slate-300">|</span>
        <span>✓ Právní servis zdarma</span>
        <span className="text-slate-300">|</span>
        <span>✓ Platba do 48h</span>
      </div>
    </div>
  );
}
