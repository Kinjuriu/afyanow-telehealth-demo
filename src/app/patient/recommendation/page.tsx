import DemoHeader from "@/components/DemoHeader";
import Button from "@/components/Button";
import PrototypeDisclaimer from "@/components/patient/PrototypeDisclaimer";
import { getRecommendation } from "@/lib/intake";
import { isSafetyLevel } from "@/lib/safety";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function asString(value: string | string[] | undefined, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

export default async function PatientRecommendationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const who = asString(params.who, "myself");
  const concernId = asString(params.concern, "cough-cold");
  const durationId = asString(params.duration, "today");
  const severityId = asString(params.severity, "mild");

  // The safety/urgency tier was already decided during intake (see
  // src/lib/safety.ts) before this recommendation was generated — emergency
  // cases never reach this page. It defaults to "Routine" only for direct/
  // bookmarked links that skip the intake flow, not as a fallback within the
  // normal flow.
  const safetyParam = asString(params.safety, "Routine");
  const safetyLevel = isSafetyLevel(safetyParam) ? safetyParam : "Routine";

  const result = getRecommendation({ who, concernId, durationId, severityId });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
      <DemoHeader switchTo={{ href: "/clinician", label: "Clinician demo" }} />

      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
          Recommended starting point
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {result.specialty}
        </h1>

        <p className="mt-4 rounded-2xl border border-indigo-100 bg-white p-5 text-sm leading-relaxed text-slate-600 shadow-sm shadow-indigo-100/40">
          {result.explanation}
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Suggested urgency
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {result.urgency}
            </p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Why this recommendation
            </p>
            <p className="mt-1 text-sm text-slate-600">{result.reason}</p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-indigo-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Alternative option
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {result.alternative}
          </p>
          <p className="mt-1 text-sm text-slate-600">{result.alternativeReason}</p>
        </div>

        <PrototypeDisclaimer className="mt-6" />

        <Button
          href={`/patient/clinicians?specialty=${encodeURIComponent(result.specialty)}&urgency=${encodeURIComponent(safetyLevel)}&who=${encodeURIComponent(who)}`}
          variant="primary"
          className="mt-6 w-full sm:w-auto"
        >
          Continue to matching clinicians
        </Button>
      </main>
    </div>
  );
}
