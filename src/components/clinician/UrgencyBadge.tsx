import type { Urgency } from "@/lib/clinician-patients";

const URGENCY_STYLES: Record<Urgency, string> = {
  Routine: "bg-slate-100 text-slate-600",
  Priority: "bg-amber-50 text-amber-700",
  Urgent: "bg-rose-50 text-rose-700",
};

export default function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ${URGENCY_STYLES[urgency]}`}
    >
      {urgency}
    </span>
  );
}
