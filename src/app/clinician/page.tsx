"use client";

import Image from "next/image";
import Link from "next/link";
import { useClinicianData, type ClinicianStatus } from "@/components/clinician/ClinicianDataProvider";
import UrgencyBadge from "@/components/clinician/UrgencyBadge";
import StatusPill from "@/components/clinician/StatusPill";
import { getClinicianById } from "@/lib/clinicians";

const STATUS_OPTIONS: { id: ClinicianStatus; label: string }[] = [
  { id: "available", label: "Available now" },
  { id: "appointments-only", label: "Appointments only" },
  { id: "in-consultation", label: "In consultation" },
  { id: "offline", label: "Offline" },
];

export default function ClinicianDashboardPage() {
  const { status, setStatus, patients } = useClinicianData();
  const clinician = getClinicianById("amina-wanjiru")!;

  const waitingQueue = patients.filter(
    (patient) => patient.queueType === "now" && patient.status === "waiting"
  );
  const schedule = patients.filter((patient) => patient.queueType === "scheduled");
  const completedToday = patients.filter((patient) => patient.status === "completed").length;

  const metrics = [
    { label: "Patients waiting", value: waitingQueue.length },
    { label: "Appointments today", value: schedule.length },
    { label: "Consultations completed", value: completedToday },
    { label: "Average response time", value: "2m 45s" },
  ];

  const nextPatient = waitingQueue[0];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100/40 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={clinician.photo!}
              alt={`Profile photo of ${clinician.name}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{clinician.name}</p>
            <p className="text-sm text-indigo-600">{clinician.specialty}</p>
            <p className="text-xs text-slate-500">
              {clinician.affiliation}, {clinician.city}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Availability status
          </p>
          <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Availability status">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = option.id === status;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setStatus(option.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-150 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-indigo-200 bg-white text-slate-700 hover:border-indigo-400"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">Waiting patients</h2>
            {nextPatient && (
              <Link
                href={`/clinician/consultation?patientId=${nextPatient.id}`}
                className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-500"
              >
                Open next patient
              </Link>
            )}
          </div>

          <ul className="mt-4 space-y-3">
            {waitingQueue.length === 0 && (
              <p className="text-sm text-slate-500">No patients waiting right now.</p>
            )}
            {waitingQueue.map((patient) => (
              <li
                key={patient.id}
                className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {patient.name} • {patient.age}
                    </p>
                    <p className="text-xs text-slate-500">{patient.reason}</p>
                  </div>
                  <UrgencyBadge urgency={patient.urgency} />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Waiting {patient.waitingSince}</span>
                  <Link
                    href={`/clinician/consultation?patientId=${patient.id}`}
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Open
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">Today&apos;s schedule</h2>
            <Link
              href="/clinician/consultation"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View full schedule
            </Link>
          </div>

          <ul className="mt-4 space-y-3">
            {schedule.map((patient) => (
              <li
                key={patient.id}
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {patient.scheduledTime} — {patient.name}
                  </p>
                  <p className="text-xs text-slate-500">{patient.reason}</p>
                </div>
                <StatusPill status={patient.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
