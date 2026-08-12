/**
 * Natural-language intake extraction (Issue #6). Turns a patient's free-text
 * description into pre-fills for the *existing* structured intake wizard
 * (src/app/patient/intake/page.tsx) — it never talks to safety.ts directly
 * and never produces an Emergency/Priority/Routine result itself. The
 * patient still answers every step of the existing wizard, and
 * src/lib/safety.ts remains the sole, unmodified safety/urgency authority.
 *
 * The id/label vocabulary below intentionally mirrors src/lib/intake.ts as
 * local literals rather than a runtime import of those constants, and
 * should be kept in sync with intake.ts by hand. This was checked, not
 * assumed: importing intake.ts here would need a relative specifier ending
 * in an explicit ".ts" extension to resolve under `node --test`'s native
 * ESM loader (as safety.test.ts and clinician-matching.test.ts already do
 * for their own same-directory imports) — but this project's tsconfig.json
 * does not enable `allowImportingTsExtensions`, so that same explicit
 * extension fails TypeScript's check (TS5097) for any file actually
 * reachable from the app, which nl-intake.ts is (route.ts, page.tsx) and
 * those test files aren't. Resolving that would mean changing project-wide
 * tsconfig, which is out of scope here — so, as clinician-matching.ts also
 * chose for the same underlying reason, this module stays import-free of
 * intake.ts.
 *
 * The "none" sentinel id used by several option lists in intake.ts is
 * deliberately excluded from every vocabulary below. "none" is a manual-UI
 * affordance meaning "the patient explicitly denied this" — free-text
 * extraction can only ever detect explicit mentions, never an explicit
 * denial, so the model is never offered that id and can never emit it.
 */

export type VocabEntry = { id: string; label: string };

const CONCERN_VOCAB: VocabEntry[] = [
  { id: "skin", label: "Skin rash or itching" },
  { id: "cough-cold", label: "Cough, cold or flu-like symptoms" },
  { id: "stomach", label: "Stomach pain or digestion issues" },
  { id: "mood", label: "Feeling low, anxious or overwhelmed" },
  { id: "womens-health", label: "Women's health concern" },
  { id: "tooth", label: "Tooth or gum pain" },
  { id: "child-fever", label: "Fever or general illness in a child" },
];

const DURATION_VOCAB: VocabEntry[] = [
  { id: "today", label: "Started today" },
  { id: "few-days", label: "A few days" },
  { id: "week-plus", label: "A week or more" },
];

const SEVERITY_VOCAB: VocabEntry[] = [
  { id: "mild", label: "Mild — manageable" },
  { id: "moderate", label: "Moderate — noticeable discomfort" },
  { id: "severe", label: "Severe — hard to ignore" },
];

const SYMPTOM_VOCAB: VocabEntry[] = [
  { id: "fever", label: "Fever" },
  { id: "fatigue", label: "Fatigue" },
  { id: "nausea", label: "Nausea" },
  { id: "headache", label: "Headache" },
];

const CONDITION_VOCAB: VocabEntry[] = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "asthma", label: "Asthma" },
  { id: "other", label: "Other" },
];

const MEDICATION_VOCAB: VocabEntry[] = [
  { id: "on-medication", label: "Currently on medication" },
  { id: "has-allergies", label: "Known allergies" },
];

const EMERGENCY_VOCAB: VocabEntry[] = [
  { id: "chest-pain", label: "Chest pain or pressure" },
  { id: "breathing", label: "Difficulty breathing" },
  { id: "bleeding", label: "Severe bleeding" },
  { id: "consciousness", label: "Fainting or loss of consciousness" },
];

const CONCERN_IDS = new Set(CONCERN_VOCAB.map((entry) => entry.id));
const DURATION_IDS = new Set(DURATION_VOCAB.map((entry) => entry.id));
const SEVERITY_IDS = new Set(SEVERITY_VOCAB.map((entry) => entry.id));
const SYMPTOM_IDS = new Set(SYMPTOM_VOCAB.map((entry) => entry.id));
const CONDITION_IDS = new Set(CONDITION_VOCAB.map((entry) => entry.id));
const MEDICATION_IDS = new Set(MEDICATION_VOCAB.map((entry) => entry.id));
const EMERGENCY_IDS = new Set(EMERGENCY_VOCAB.map((entry) => entry.id));

/** Upper bound on the free-text the patient can submit for extraction. */
export const MAX_PATIENT_TEXT_LENGTH = 800;

/**
 * The extraction schema. Every field defaults to "not stated" (null / empty
 * array), never to a guessed value. See field-level notes below — these are
 * load-bearing for how src/app/patient/intake/page.tsx is allowed to use
 * this data.
 */
export type ExtractedIntake = {
  /**
   * null means the patient's text did not explicitly state a main concern —
   * not "unknown", not a default. Never guessed from adjacent context.
   */
  concernId: string | null;
  /** Same null semantics as concernId, for how long the concern has lasted. */
  durationId: string | null;
  /** Same null semantics as concernId, for how severe it feels. */
  severityId: string | null;
  /**
   * Empty array means no related symptom was explicitly mentioned — NOT
   * "patient confirmed no other symptoms". The "none" id is never valid
   * here; only explicit mentions are ever included.
   */
  symptomIds: string[];
  /** Same "mentioned vs. confirmed absent" semantics as symptomIds. */
  conditionIds: string[];
  /** Same "mentioned vs. confirmed absent" semantics as symptomIds. */
  medicationIds: string[];
  /**
   * Empty array means "no emergency warning sign was explicitly reported in
   * the patient's text" — it must NEVER be read as "the patient confirmed
   * no emergency warning signs". The patient still answers the existing
   * emergency question in the wizard before assessSafety() runs; this
   * field only ever pre-fills specific signs that were actually mentioned,
   * and is never used to pre-select the wizard's "None of the above".
   */
  emergencyIds: string[];
};

export const EMPTY_EXTRACTED_INTAKE: ExtractedIntake = {
  concernId: null,
  durationId: null,
  severityId: null,
  symptomIds: [],
  conditionIds: [],
  medicationIds: [],
  emergencyIds: [],
};

function vocabLines(vocab: VocabEntry[]): string {
  return vocab.map((entry) => `${entry.id} — ${entry.label}`).join("\n");
}

/**
 * System prompt for the extraction request. Inlines the full id/label
 * vocabulary (~27 entries, well under a kilobyte) — small enough that no
 * compaction or retrieval strategy is needed. Deliberately contains no
 * clinical scoring/triage rules of any kind: it only asks the model to
 * restate what the patient already wrote using the same fixed vocabulary
 * the manual wizard uses, or to leave fields empty.
 */
export function buildExtractionSystemPrompt(): string {
  return `You extract structured information from a patient's free-text description of a health concern, for a telehealth intake form.

You are not a diagnostic tool. Do not diagnose, suggest treatment, or offer medical advice. Only extract what the patient explicitly wrote — never infer, guess, or default to the closest-sounding option.

Rules:
- Use ONLY the ids listed below. Never invent new ids.
- If the text does not clearly and explicitly state a field, leave it null (single-choice fields) or an empty array (multi-choice fields).
- concernId is the strictest field: only choose one if the text clearly and specifically matches that exact category's theme — not merely the closest-sounding option out of a list you must pick from. If the description is a set of general physical symptoms (e.g. headache, fatigue, nausea, dizziness, body aches, fever) with no wording that specifically matches one category's theme, concernId MUST be null — record those as symptomIds instead. In particular, only choose "mood" when the patient uses emotional/psychological language (e.g. "anxious", "overwhelmed", "sad", "down", "depressed", "stressed") — physical symptoms alone, even several of them together, are never sufficient to choose "mood".
  Example: "I've had a bad headache since yesterday. I've also been feeling very tired and nauseous." -> concernId: null, symptomIds: ["headache", "fatigue", "nausea"]. Do NOT choose "mood" for this — nothing emotional was described.
- For symptoms, conditions, medication/allergies, and emergency warning signs: include an id only if that specific thing was explicitly mentioned. An empty array means nothing was mentioned about that topic — it does NOT mean the patient confirmed they have none of it. There is no "none" id in any list below; never invent one.
- Respond with ONLY a single JSON object, no explanation, no markdown code fences, matching exactly this shape:
{"concernId": string|null, "durationId": string|null, "severityId": string|null, "symptomIds": string[], "conditionIds": string[], "medicationIds": string[], "emergencyIds": string[]}

Main concern (concernId) — pick at most one:
${vocabLines(CONCERN_VOCAB)}

Duration (durationId) — pick at most one:
${vocabLines(DURATION_VOCAB)}

Severity (severityId) — pick at most one:
${vocabLines(SEVERITY_VOCAB)}

Related symptoms (symptomIds) — any explicitly mentioned:
${vocabLines(SYMPTOM_VOCAB)}

Existing conditions (conditionIds) — any explicitly mentioned:
${vocabLines(CONDITION_VOCAB)}

Medication/allergies (medicationIds) — any explicitly mentioned:
${vocabLines(MEDICATION_VOCAB)}

Emergency warning signs (emergencyIds) — any explicitly mentioned:
${vocabLines(EMERGENCY_VOCAB)}`;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Extracts a JSON *object* from raw model output, tolerating explanatory
 * prose or markdown code fences around it. Returns null (never throws) if
 * no parseable JSON object can be found — this includes plain unparseable
 * text (e.g. "I cannot determine this."), an empty/whitespace-only
 * response, and JSON that parses but isn't an object (a bare `null`, an
 * array, a string, a number). All of these are extraction *failures*: the
 * model did not produce the structured object it was asked for, and that
 * must never be silently treated the same as a valid object whose fields
 * happen to be empty. See parseExtractedIntake for how this distinction is
 * carried through to the API response.
 */
export function extractJsonObject(content: string): Record<string, unknown> | null {
  const trimmed = content.trim();

  const attempts: Array<() => unknown> = [
    () => JSON.parse(trimmed),
    () => {
      const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (!fenced) throw new Error("no fenced block");
      return JSON.parse(fenced[1].trim());
    },
    () => {
      const start = trimmed.indexOf("{");
      const end = trimmed.lastIndexOf("}");
      if (start === -1 || end === -1 || end <= start) throw new Error("no braces");
      return JSON.parse(trimmed.slice(start, end + 1));
    },
  ];

  for (const attempt of attempts) {
    try {
      const value = attempt();
      if (isPlainObject(value)) return value;
    } catch {
      // Try the next strategy.
    }
  }

  return null;
}

function cleanScalarId(value: unknown, validIds: Set<string>): string | null {
  if (typeof value !== "string") return null;
  if (!validIds.has(value)) return null;
  return value;
}

function cleanIdArray(value: unknown, validIds: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  const cleaned = value.filter(
    (item): item is string => typeof item === "string" && validIds.has(item)
  );
  return [...new Set(cleaned)];
}

/**
 * The untrusted-input boundary: treats `parsed` as arbitrary external data
 * (it may be anything a model chose to emit, or garbage from a failed
 * parse). Every field is independently clamped against the known id
 * vocabulary; anything that doesn't match — wrong type, unrecognized id,
 * duplicate, the "none" sentinel, or an unexpected extra field — is dropped
 * rather than repaired or guessed. Always returns a well-formed
 * ExtractedIntake, never throws.
 */
export function validateExtractedIntake(parsed: unknown): ExtractedIntake {
  if (!isPlainObject(parsed)) {
    return { ...EMPTY_EXTRACTED_INTAKE };
  }

  return {
    concernId: cleanScalarId(parsed.concernId, CONCERN_IDS),
    durationId: cleanScalarId(parsed.durationId, DURATION_IDS),
    severityId: cleanScalarId(parsed.severityId, SEVERITY_IDS),
    symptomIds: cleanIdArray(parsed.symptomIds, SYMPTOM_IDS),
    conditionIds: cleanIdArray(parsed.conditionIds, CONDITION_IDS),
    medicationIds: cleanIdArray(parsed.medicationIds, MEDICATION_IDS),
    emergencyIds: cleanIdArray(parsed.emergencyIds, EMERGENCY_IDS),
  };
}

/**
 * Raw model text -> validated ExtractedIntake, or `null` if no JSON object
 * could be found at all. `null` means extraction *failed* (e.g. the model
 * replied "I cannot determine this." or returned empty/non-JSON output) —
 * callers (the route handler) must treat that as an AI processing failure,
 * never as a successful-but-empty result. A non-null return is always a
 * genuine success, even when every field inside it is null/[] (a valid
 * JSON object such as `{}` legitimately means "nothing was explicitly
 * stated for any field" — that is a correct extraction of an
 * under-specified description, not a failure).
 */
export function parseExtractedIntake(content: string): ExtractedIntake | null {
  const parsed = extractJsonObject(content);
  if (parsed === null) return null;
  return validateExtractedIntake(parsed);
}

/**
 * Shape of the wizard's per-step answers that ExtractedIntake maps onto —
 * a subset of the StepKey union in src/app/patient/intake/page.tsx ("who"
 * is intentionally not covered; it is never inferred from free text).
 */
export type IntakeStepAnswers = {
  concern: string[];
  duration: string[];
  severity: string[];
  symptoms: string[];
  conditions: string[];
  medication: string[];
  emergency: string[];
};

/**
 * Drops the "none" sentinel from a pre-fill array, defensively, at the
 * exact point where ExtractedIntake becomes wizard state. validateExtractedIntake
 * already excludes "none" from every array field's valid-id set, so this is
 * redundant against today's validator — but this is the mapping function
 * Issue #6's architecture designates as the one place that decides what the
 * wizard sees, so the invariant is enforced here explicitly rather than
 * resting solely on an upstream exclusion list staying correct forever.
 */
function withoutNoneSentinel(ids: string[]): string[] {
  return ids.filter((id) => id !== "none");
}

/**
 * Maps validated extraction output onto the wizard's answers shape. A null
 * scalar becomes an empty selection (so that step still requires the
 * patient to choose), not a default. emergencyIds (and every other
 * multi-select field) is passed through with "none" stripped — specific
 * detected items only. Critically, an empty array here pre-fills the
 * emergency step as unanswered, never as "None of the above": only the
 * patient explicitly clicking that option in the wizard can select it. The
 * patient must still explicitly answer the emergency step before
 * assessSafety() runs.
 */
export function mapExtractedIntakeToAnswers(extracted: ExtractedIntake): IntakeStepAnswers {
  return {
    concern: extracted.concernId ? [extracted.concernId] : [],
    duration: extracted.durationId ? [extracted.durationId] : [],
    severity: extracted.severityId ? [extracted.severityId] : [],
    symptoms: withoutNoneSentinel(extracted.symptomIds),
    conditions: withoutNoneSentinel(extracted.conditionIds),
    medication: withoutNoneSentinel(extracted.medicationIds),
    emergency: withoutNoneSentinel(extracted.emergencyIds),
  };
}
