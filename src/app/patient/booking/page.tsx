import { Suspense } from "react";
import DemoHeader from "@/components/DemoHeader";
import BookingFlow from "./BookingFlow";

export default function PatientBookingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
      <DemoHeader switchTo={{ href: "/clinician", label: "Clinician demo" }} />

      <main className="mx-auto max-w-xl px-4 py-10 sm:px-6">
        <Suspense
          fallback={
            <p className="text-sm text-slate-500">Loading booking details…</p>
          }
        >
          <BookingFlow />
        </Suspense>
      </main>
    </div>
  );
}
