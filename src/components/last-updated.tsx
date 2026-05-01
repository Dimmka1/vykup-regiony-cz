/**
 * Visible "Aktualizováno: 1. května 2026" stamp.
 *
 * Pulled from the central registry in `lib/last-updated.ts`. Renders nothing
 * if the path isn't registered (silent fallback — doesn't break the page).
 *
 * AI Overview correlations: visible last-updated dates correlate with citation
 * rate (44% of citations from 2025+ content). The same ISO date should be
 * mirrored to Article schema dateModified where applicable.
 */

import {
  getLastUpdated,
  formatLastUpdatedCs,
  type IsoDate,
} from "@/lib/last-updated";

interface LastUpdatedProps {
  /**
   * Pathname of the current page (no host, no query). E.g. "/vykup-bytu".
   * Caller passes in because this is a server component used inside pages
   * that already know their canonical path.
   */
  readonly path: string;
  /**
   * Optional explicit override — useful if the page wants to display a
   * different date than the registry (e.g. blog posts using their own
   * `dateModified`).
   */
  readonly date?: IsoDate;
  /**
   * Tailwind classes to apply to the wrapper. Lets pages style the stamp
   * to fit their visual context.
   */
  readonly className?: string;
}

export function LastUpdated({
  path,
  date,
  className,
}: LastUpdatedProps): React.ReactElement | null {
  const iso = date ?? getLastUpdated(path);
  if (!iso) return null;
  const formatted = formatLastUpdatedCs(iso);

  return (
    <p
      className={
        className ?? "mt-3 text-xs uppercase tracking-wide text-slate-500"
      }
    >
      <time dateTime={iso}>Aktualizováno: {formatted}</time>
    </p>
  );
}
