export type IntakeOption = {
  id: string;
  label: string;
};

export const WHO_OPTIONS: IntakeOption[] = [
  { id: "myself", label: "Myself" },
  { id: "child", label: "My child" },
  { id: "someone-else", label: "Someone else" },
];

export const CONCERN_OPTIONS: IntakeOption[] = [
  { id: "skin", label: "Skin rash or itching" },
  { id: "cough-cold", label: "Cough, cold or flu-like symptoms" },
  { id: "stomach", label: "Stomach pain or digestion issues" },
  { id: "mood", label: "Feeling low, anxious or overwhelmed" },
  { id: "womens-health", label: "Women's health concern" },
  { id: "tooth", label: "Tooth or gum pain" },
  { id: "child-fever", label: "Fever or general illness in a child" },
];

export const DURATION_OPTIONS: IntakeOption[] = [
  { id: "today", label: "Started today" },
  { id: "few-days", label: "A few days" },
  { id: "week-plus", label: "A week or more" },
];

export const SEVERITY_OPTIONS: IntakeOption[] = [
  { id: "mild", label: "Mild — manageable" },
  { id: "moderate", label: "Moderate — noticeable discomfort" },
  { id: "severe", label: "Severe — hard to ignore" },
];

export const SYMPTOM_OPTIONS: IntakeOption[] = [
  { id: "fever", label: "Fever" },
  { id: "fatigue", label: "Fatigue" },
  { id: "nausea", label: "Nausea" },
  { id: "headache", label: "Headache" },
  { id: "none", label: "None of these" },
];

export const CONDITION_OPTIONS: IntakeOption[] = [
  { id: "none", label: "None" },
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension" },
  { id: "asthma", label: "Asthma" },
  { id: "other", label: "Other" },
];

export const MEDICATION_OPTIONS: IntakeOption[] = [
  { id: "none", label: "None" },
  { id: "on-medication", label: "Currently on medication" },
  { id: "has-allergies", label: "Known allergies" },
];

export const EMERGENCY_OPTIONS: IntakeOption[] = [
  { id: "chest-pain", label: "Chest pain or pressure" },
  { id: "breathing", label: "Difficulty breathing" },
  { id: "bleeding", label: "Severe bleeding" },
  { id: "consciousness", label: "Fainting or loss of consciousness" },
  { id: "none", label: "None of the above" },
];

const CONCERN_LABELS: Record<string, string> = Object.fromEntries(
  CONCERN_OPTIONS.map((option) => [option.id, option.label.toLowerCase()])
);

const DURATION_LABELS: Record<string, string> = Object.fromEntries(
  DURATION_OPTIONS.map((option) => [option.id, option.label.toLowerCase()])
);

const CONCERN_SPECIALTY: Record<string, string> = {
  skin: "Dermatologist",
  "cough-cold": "General Practitioner",
  stomach: "General Practitioner",
  mood: "Mental Health Counsellor",
  "womens-health": "Gynaecologist",
  tooth: "Dentist",
  "child-fever": "Paediatrician",
};

const URGENCY_BY_SEVERITY: Record<string, string> = {
  severe: "See a clinician today",
  moderate: "See a clinician within 2–3 days",
  mild: "See a clinician when convenient this week",
};

const ALTERNATIVE_BY_SPECIALTY: Record<string, { option: string; reason: string }> = {
  "General Practitioner": {
    option: "Pharmacist consultation",
    reason: "For minor, non-urgent symptoms, a pharmacist can offer quick guidance.",
  },
  Dermatologist: {
    option: "General Practitioner",
    reason: "If you're unsure whether it's skin-specific, a GP can assess first.",
  },
  Paediatrician: {
    option: "General Practitioner",
    reason: "A GP can also assess common childhood illnesses.",
  },
  "Mental Health Counsellor": {
    option: "General Practitioner",
    reason: "A GP can provide an initial assessment and referral.",
  },
  Gynaecologist: {
    option: "General Practitioner",
    reason: "A GP can offer general guidance ahead of a specialist visit.",
  },
  Dentist: {
    option: "General Practitioner",
    reason: "A GP can advise on pain relief while you arrange a dental visit.",
  },
};

export type CareRecommendation = {
  specialty: string;
  explanation: string;
  urgency: string;
  reason: string;
  alternative: string;
  alternativeReason: string;
};

export function getRecommendation(input: {
  who: string;
  concernId: string;
  durationId: string;
  severityId: string;
}): CareRecommendation {
  const { who, concernId, durationId, severityId } = input;

  let specialty = CONCERN_SPECIALTY[concernId] ?? "General Practitioner";
  if (who === "child" && (concernId === "cough-cold" || concernId === "stomach")) {
    specialty = "Paediatrician";
  }

  const urgency = URGENCY_BY_SEVERITY[severityId] ?? URGENCY_BY_SEVERITY.mild;

  const explanation = `Based on your answers, a ${specialty} may be the most appropriate starting point. They can assess your symptoms and refer you to a specialist if needed.`;

  const concernLabel = CONCERN_LABELS[concernId] ?? "your symptoms";
  const durationLabel = DURATION_LABELS[durationId] ?? "this period";
  const reason = `Your main concern (${concernLabel}) at ${severityId} severity, present for ${durationLabel}, best matches this type of care.`;

  const alternative = ALTERNATIVE_BY_SPECIALTY[specialty] ?? ALTERNATIVE_BY_SPECIALTY["General Practitioner"];

  return {
    specialty,
    explanation,
    urgency,
    reason,
    alternative: alternative.option,
    alternativeReason: alternative.reason,
  };
}
