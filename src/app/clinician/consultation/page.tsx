import { Suspense } from "react";
import ConsultationWorkspace from "./ConsultationWorkspace";

export default function ClinicianConsultationPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <p className="text-sm text-slate-500">Loading consultation workspace…</p>
        }
      >
        <ConsultationWorkspace />
      </Suspense>
    </main>
  );
}
