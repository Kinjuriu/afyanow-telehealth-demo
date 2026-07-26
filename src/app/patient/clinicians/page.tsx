import { Suspense } from "react";
import DemoHeader from "@/components/DemoHeader";
import ClinicianBrowser from "./ClinicianBrowser";

export default function PatientCliniciansPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
      <DemoHeader switchTo={{ href: "/clinician", label: "Clinician demo" }} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Browse clinicians
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Fictional demo profiles for illustration only.
        </p>

        <Suspense
          fallback={
            <p className="mt-8 text-sm text-slate-500">Loading clinicians…</p>
          }
        >
          <ClinicianBrowser />
        </Suspense>
      </main>
    </div>
  );
}
