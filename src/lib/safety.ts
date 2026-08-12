/**
 * Patient-side safety/urgency tier, produced before any care-navigation or
 * specialty recommendation runs. "Priority" and "Routine" intentionally use
 * the same words as the clinician-side `Urgency` type in
 * `clinician-patients.ts`, so a Priority/Routine result can be handed to
 * clinician-facing matching/prioritization logic (see Issue #3) without
 * renaming. "Emergency" has no clinician-side equivalent by design: those
 * patients never reach clinician matching in this demo — they are
 * redirected to seek in-person/emergency care instead of a value from the
 * clinician `Urgency` enum (which assumes an ordinary telehealth queue).
 */
export type SafetyLevel = "Emergency" | "Priority" | "Routine";

export type SafetyAssessmentInput = {
  who: string;
  concernId: string;
  durationId: string;
  severityId: string;
  emergencyIds: string[];
};

export type SafetyAssessment = {
  level: SafetyLevel;
  headline: string;
  message: string;
};

const EMERGENCY_NONE_ID = "none";

/**
 * True if the patient selected any emergency warning sign other than "none".
 * The emergency step's options (`EMERGENCY_OPTIONS` in intake.ts) always
 * submit either "none" or one of the specific warning-sign ids, so any
 * other selected id is treated as a warning sign.
 */
function hasEmergencyWarningSign(emergencyIds: string[]): boolean {
  return emergencyIds.some((id) => id !== EMERGENCY_NONE_ID);
}

/**
 * Conservative, deterministic rule for the "Priority" tier: prompt (not
 * routine) assessment is suggested when severity is already "severe", or
 * when a "moderate" concern has only just started today. Both signals are
 * already collected by the existing intake (`SEVERITY_OPTIONS`,
 * `DURATION_OPTIONS`) — no new questions or symptom-specific heuristics are
 * introduced. This is not a clinical scoring model: it is a narrow,
 * inspectable boundary intended to avoid under-flagging noticeable, recent
 * symptoms as routine, not a claim about actual medical urgency.
 */
function isPriority(durationId: string, severityId: string): boolean {
  if (severityId === "severe") return true;
  if (severityId === "moderate" && durationId === "today") return true;
  return false;
}

/**
 * Determines the patient's safety/urgency tier from intake answers, before
 * any specialty/care-navigation recommendation is produced. This function
 * makes no diagnosis and asserts no clinical validity — it only decides
 * whether AfyaNow's remote consultation flow is appropriate at all
 * (Emergency), should be expedited (Priority), or can proceed as an
 * ordinary consultation (Routine).
 */
export function assessSafety(input: SafetyAssessmentInput): SafetyAssessment {
  const { durationId, severityId, emergencyIds } = input;

  if (hasEmergencyWarningSign(emergencyIds)) {
    return {
      level: "Emergency",
      headline: "Please seek in-person or emergency care now",
      message:
        "Based on what you selected, this may be a medical emergency. AfyaNow's online consultations are not appropriate for this situation. Please go to your nearest emergency room or call your local emergency number immediately.",
    };
  }

  if (isPriority(durationId, severityId)) {
    return {
      level: "Priority",
      headline: "A prompt consultation may be appropriate",
      message:
        "Based on your answers, a clinician should assess this soon rather than wait. You can continue to find an available clinician now.",
    };
  }

  return {
    level: "Routine",
    headline: "A routine consultation is appropriate",
    message:
      "Based on your answers, this looks appropriate for an ordinary consultation. A clinician can assess this when convenient.",
  };
}

export function isSafetyLevel(value: string | null | undefined): value is SafetyLevel {
  return value === "Emergency" || value === "Priority" || value === "Routine";
}
