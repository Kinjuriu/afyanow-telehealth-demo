import type { SafetyLevel } from "./safety";

/**
 * Mirrors the ids in WHO_OPTIONS (src/lib/intake.ts) as a local literal set
 * rather than a runtime import: intake.ts is settled from Issue #1 and not
 * to be modified, and keeping this module free of runtime cross-file
 * imports lets its tests run directly with `node --test` (the same
 * tradeoff already made in safety.ts for Issue #2). The `SafetyLevel`
 * type-only import above doesn't have this problem — type-only imports are
 * erased entirely by TypeScript/Node's type stripping.
 */
const VALID_WHO_IDS = new Set(["myself", "child", "someone-else"]);
const DEFAULT_WHO_ID = "myself";

export type MatchingContext = {
  specialty: string;
  who: string;
  urgency: SafetyLevel;
};

export type ParseMatchingParamsInput = {
  specialty: string | null | undefined;
  who: string | null | undefined;
  urgency: string | null | undefined;
  knownSpecialties: string[];
};

/**
 * Safely resolves the clinician-matching query parameters carried forward
 * from the recommendation page, rather than trusting the URL directly.
 * Anything missing or unrecognized falls back to a safe default instead of
 * being passed through as-is.
 *
 * "Emergency" is deliberately not treated as a distinct matching case:
 * Issue #2 already stops emergency cases before they ever reach this page,
 * so if "Emergency" (or any other unrecognized value) arrives via a
 * hand-edited or stale URL, it's treated the same as "Routine" — the safe,
 * non-prioritized default — rather than inventing new emergency-matching
 * behavior here.
 */
export function parseMatchingParams(input: ParseMatchingParamsInput): MatchingContext {
  const { specialty, who, urgency, knownSpecialties } = input;

  const validSpecialty =
    specialty && knownSpecialties.includes(specialty) ? specialty : "all";

  const validWho = who && VALID_WHO_IDS.has(who) ? who : DEFAULT_WHO_ID;

  const validUrgency: SafetyLevel = urgency === "Priority" ? "Priority" : "Routine";

  return { specialty: validSpecialty, who: validWho, urgency: validUrgency };
}

/**
 * Orders clinicians for display based on the patient's safety/urgency tier.
 * Priority patients see currently available clinicians surfaced first;
 * Routine (and anything else) leaves the existing order untouched — for
 * Routine this is a true no-op, returning the same array reference. This is
 * a display-ordering convenience only: it filters no one out, and a
 * clinician being shown first does not imply they are clinically better
 * than one shown later.
 */
export function prioritizeClinicians<T extends { availability: { status: string } }>(
  clinicians: T[],
  urgency: SafetyLevel
): T[] {
  if (urgency !== "Priority") {
    return clinicians;
  }

  return [...clinicians].sort((a, b) => {
    const rank = (clinician: T) => (clinician.availability.status === "available" ? 0 : 1);
    return rank(a) - rank(b);
  });
}
