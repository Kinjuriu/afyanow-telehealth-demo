"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DemoHeader from "@/components/DemoHeader";
import ProgressBar from "@/components/patient/ProgressBar";
import OptionGroup from "@/components/patient/OptionGroup";
import {
  WHO_OPTIONS,
  CONCERN_OPTIONS,
  DURATION_OPTIONS,
  SEVERITY_OPTIONS,
  SYMPTOM_OPTIONS,
  CONDITION_OPTIONS,
  MEDICATION_OPTIONS,
  EMERGENCY_OPTIONS,
  type IntakeOption,
} from "@/lib/intake";
import { assessSafety } from "@/lib/safety";

type StepKey =
  | "who"
  | "concern"
  | "duration"
  | "severity"
  | "symptoms"
  | "conditions"
  | "medication"
  | "emergency";

type Step = {
  key: StepKey;
  title: string;
  helper?: string;
  options: IntakeOption[];
  multiple: boolean;
};

const STEPS: Step[] = [
  { key: "who", title: "Who needs care?", options: WHO_OPTIONS, multiple: false },
  {
    key: "concern",
    title: "What's the main concern, in your own words?",
    options: CONCERN_OPTIONS,
    multiple: false,
  },
  {
    key: "duration",
    title: "How long has this been going on?",
    options: DURATION_OPTIONS,
    multiple: false,
  },
  {
    key: "severity",
    title: "How severe does it feel?",
    options: SEVERITY_OPTIONS,
    multiple: false,
  },
  {
    key: "symptoms",
    title: "Any related symptoms?",
    helper: "Select all that apply.",
    options: SYMPTOM_OPTIONS,
    multiple: true,
  },
  {
    key: "conditions",
    title: "Any existing conditions we should know about?",
    helper: "Select all that apply.",
    options: CONDITION_OPTIONS,
    multiple: true,
  },
  {
    key: "medication",
    title: "Medication and allergies?",
    helper: "Select all that apply.",
    options: MEDICATION_OPTIONS,
    multiple: true,
  },
  {
    key: "emergency",
    title: "Are you experiencing any of these right now?",
    helper: "This helps us flag anything urgent.",
    options: EMERGENCY_OPTIONS,
    multiple: true,
  },
];

const EMPTY_ANSWERS: Record<StepKey, string[]> = {
  who: [],
  concern: [],
  duration: [],
  severity: [],
  symptoms: [],
  conditions: [],
  medication: [],
  emergency: [],
};

export default function PatientIntakePage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string[]>>(EMPTY_ANSWERS);
  const [emergency, setEmergency] = useState(false);

  function resetIntake() {
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setEmergency(false);
  }

  const step = STEPS[stepIndex];
  const currentSelection = answers[step.key];
  const canContinue = currentSelection.length > 0;

  function handleToggle(id: string) {
    setAnswers((prev) => {
      const existing = prev[step.key];

      if (!step.multiple) {
        return { ...prev, [step.key]: [id] };
      }

      if (id === "none") {
        return { ...prev, [step.key]: ["none"] };
      }

      const withoutNone = existing.filter((value) => value !== "none");
      const next = withoutNone.includes(id)
        ? withoutNone.filter((value) => value !== id)
        : [...withoutNone, id];

      return { ...prev, [step.key]: next };
    });
  }

  function goBack() {
    setStepIndex((index) => Math.max(index - 1, 0));
  }

  function goNext() {
    if (step.key === "emergency") {
      // Safety/urgency assessment runs here, before any specialty
      // recommendation — emergency cases stop the flow entirely, priority
      // and routine cases continue into care navigation with their tier
      // attached.
      const assessment = assessSafety({
        who: answers.who[0] ?? "myself",
        concernId: answers.concern[0] ?? "cough-cold",
        durationId: answers.duration[0] ?? "today",
        severityId: answers.severity[0] ?? "mild",
        emergencyIds: currentSelection,
      });

      if (assessment.level === "Emergency") {
        setEmergency(true);
        return;
      }

      const params = new URLSearchParams({
        who: answers.who[0] ?? "myself",
        concern: answers.concern[0] ?? "cough-cold",
        duration: answers.duration[0] ?? "today",
        severity: answers.severity[0] ?? "mild",
        safety: assessment.level,
      });
      router.push(`/patient/recommendation?${params.toString()}`);
      return;
    }

    setStepIndex((index) => Math.min(index + 1, STEPS.length - 1));
  }

  if (emergency) {
    return <EmergencyNotice onRestart={resetIntake} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
      <DemoHeader switchTo={{ href: "/clinician", label: "Clinician demo" }} />

      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <ProgressBar current={stepIndex + 1} total={STEPS.length} />

        <p className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs leading-relaxed text-slate-600">
          AfyaNow helps identify an appropriate type of care. It does not
          provide a medical diagnosis.
        </p>

        <div className="mt-6 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100/40">
          <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {step.title}
          </h1>
          {step.helper && (
            <p className="mt-1 text-sm text-slate-500">{step.helper}</p>
          )}

          <div className="mt-5">
            <OptionGroup
              options={step.options}
              selected={currentSelection}
              onToggle={handleToggle}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          {stepIndex > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Back
            </button>
          ) : (
            <Link
              href="/"
              className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              Cancel
            </Link>
          )}

          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-opacity duration-150 hover:from-indigo-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step.key === "emergency" ? "See my result" : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
}

function EmergencyNotice({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-white">
      <DemoHeader switchTo={{ href: "/clinician", label: "Clinician demo" }} />
      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            Urgent warning sign selected
          </p>
          <h1 className="mt-2 text-2xl font-bold text-rose-700">
            Please seek in-person or emergency care now
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-rose-700">
            Based on what you selected, this may be a medical emergency.
            AfyaNow&apos;s online consultations are not appropriate for this
            situation. Please go to your nearest emergency room or call your
            local emergency number immediately.
          </p>
          <p className="mt-4 text-xs text-rose-600">
            This is a fictional demonstration screen and does not connect to
            real emergency services.
          </p>

          <button
            type="button"
            onClick={onRestart}
            className="mt-6 rounded-full border border-rose-300 bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            Restart the demo intake
          </button>
        </div>
      </main>
    </div>
  );
}
