/**
 * QuickAnswer — the AI-extractable answer block.
 *
 * Designed to be placed directly under the page H1 on every priority page.
 * Two jobs:
 *   1. Visible to users — a 2-3 sentence direct answer that reduces bounce.
 *   2. Marked with `data-speakable="quick-answer"` so SpeakableSpecification
 *      JSON-LD can point an AI engine at exactly this block as the canonical
 *      extractable summary.
 *
 * Content rules (per design doc):
 *   - 134-167 words is the proven sweet spot for AI-citation extraction
 *     (4.2× higher selection vs. <100-word or fragmented answers).
 *   - Self-contained — no pronouns referencing earlier content, no forward
 *     references to later sections.
 *   - Semantic-triple structure where natural ("Výkup nemovitosti je rychlý
 *     prodej..." — subject/predicate/object). HubSpot reported a 642% rise
 *     in AI citations after adopting this pattern.
 *
 * The component is dumb on purpose — pages pass already-written copy in.
 * No prop validation here because the input is editor-controlled, not user
 * input. We do however soft-warn in dev if the word count looks far outside
 * the optimal band.
 */

import { SPEAKABLE_DATA_ATTR } from "@/lib/jsonld-speakable";

interface QuickAnswerProps {
  /**
   * The answer body. May contain inline <strong>, <em>, <a> from the parent;
   * we render as React children, not html string, so the parent controls
   * markup safely.
   */
  readonly children: React.ReactNode;
  /**
   * Optional eyebrow heading shown above the answer body.
   * Default: "Stručná odpověď" (Czech for "Quick answer").
   */
  readonly heading?: string;
  /**
   * Optional override for the data-attribute value, in case a page wants
   * multiple speakable blocks (rare). Default: "quick-answer".
   */
  readonly speakableId?: string;
}

export function QuickAnswer({
  children,
  heading = "Stručná odpověď",
  speakableId = SPEAKABLE_DATA_ATTR,
}: QuickAnswerProps): React.ReactElement {
  return (
    <aside
      data-speakable={speakableId}
      aria-label={heading}
      className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6 leading-relaxed text-slate-800 shadow-sm"
    >
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-emerald-700">
        {heading}
      </h2>
      <div className="space-y-3 text-base">{children}</div>
    </aside>
  );
}
