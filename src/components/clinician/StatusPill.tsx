import type { PatientStatus } from "@/lib/clinician-patients";

const STATUS_LABELS: Record<PatientStatus, string> = {
  waiting: "Waiting",
  upcoming: "Upcoming",
  completed: "Completed",
};

const STATUS_STYLES: Record<PatientStatus, string> = {
  waiting: "bg-amber-50 text-amber-700",
  upcoming: "bg-indigo-50 text-indigo-600",
  completed: "bg-emerald-50 text-emerald-600",
};

export default function StatusPill({ status }: { status: PatientStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[0.65rem] font-semibold ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
