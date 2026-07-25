import type { ReactNode } from "react";
import DemoHeader from "@/components/DemoHeader";
import { ClinicianDataProvider } from "@/components/clinician/ClinicianDataProvider";
import ClinicianNav from "@/components/clinician/ClinicianNav";

export default function ClinicianLayout({ children }: { children: ReactNode }) {
  return (
    <ClinicianDataProvider>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
        <DemoHeader switchTo={{ href: "/patient/intake", label: "Patient demo" }} />
        <ClinicianNav />
        {children}
      </div>
    </ClinicianDataProvider>
  );
}
