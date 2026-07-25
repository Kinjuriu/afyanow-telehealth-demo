"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { INITIAL_PATIENTS, type ConsultationPatient } from "@/lib/clinician-patients";

export type ClinicianStatus =
  | "available"
  | "appointments-only"
  | "in-consultation"
  | "offline";

type ClinicianDataContextValue = {
  status: ClinicianStatus;
  setStatus: (status: ClinicianStatus) => void;
  patients: ConsultationPatient[];
  completePatient: (id: string) => void;
};

const ClinicianDataContext = createContext<ClinicianDataContextValue | null>(null);

export function ClinicianDataProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ClinicianStatus>("available");
  const [patients, setPatients] = useState<ConsultationPatient[]>(INITIAL_PATIENTS);

  function completePatient(id: string) {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === id ? { ...patient, status: "completed" } : patient
      )
    );
  }

  return (
    <ClinicianDataContext.Provider value={{ status, setStatus, patients, completePatient }}>
      {children}
    </ClinicianDataContext.Provider>
  );
}

export function useClinicianData() {
  const context = useContext(ClinicianDataContext);
  if (!context) {
    throw new Error("useClinicianData must be used within ClinicianDataProvider");
  }
  return context;
}
