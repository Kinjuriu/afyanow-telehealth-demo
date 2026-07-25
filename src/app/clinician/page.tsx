import Link from "next/link";
import DemoHeader from "@/components/DemoHeader";

export default function ClinicianComingSoonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
      <DemoHeader />

      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm shadow-indigo-100/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Clinician workspace
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Coming in Phase 3
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            The clinician login and workspace — for managing availability,
            consultations and patient messages — is planned for a future
            phase of this AfyaNow prototype.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-500 hover:to-blue-500"
          >
            Return to homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
