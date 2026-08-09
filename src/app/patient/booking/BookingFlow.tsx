"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import PrototypeDisclaimer from "@/components/patient/PrototypeDisclaimer";
import { getClinicianById, getInitials } from "@/lib/clinicians";

type ConsultationType = "chat" | "voice" | "video";

const CONSULTATION_OPTIONS: {
  id: ConsultationType;
  label: string;
  description: string;
  waitEstimate: string;
}[] = [
  { id: "chat", label: "Chat", description: "Message-based consultation", waitEstimate: "~5 min" },
  { id: "voice", label: "Voice call", description: "Audio-only consultation", waitEstimate: "~8 min" },
  { id: "video", label: "Video call", description: "Face-to-face consultation", waitEstimate: "~10 min" },
];

function isConsultationType(value: string | null): value is ConsultationType {
  return value === "chat" || value === "voice" || value === "video";
}

export default function BookingFlow() {
  const searchParams = useSearchParams();
  const clinicianId = searchParams.get("clinicianId");
  const typeParam = searchParams.get("type");
  const clinician = clinicianId ? getClinicianById(clinicianId) : undefined;

  const [type, setType] = useState<ConsultationType>(
    isConsultationType(typeParam) ? typeParam : "chat"
  );
  const [confirmed, setConfirmed] = useState(false);

  if (!clinician) {
    return (
      <div className="rounded-3xl border border-indigo-100 bg-white p-6 text-sm text-slate-600 shadow-sm shadow-indigo-100/40">
        <p>No clinician selected yet.</p>
        <Link
          href="/patient/clinicians"
          className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Browse clinicians
        </Link>
      </div>
    );
  }

  const selectedOption = CONSULTATION_OPTIONS.find((option) => option.id === type)!;
  const price = clinician.prices[type];

  if (confirmed) {
    return (
      <div className="rounded-3xl border border-indigo-100 bg-white p-8 text-center shadow-sm shadow-indigo-100/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
          Demo booking confirmed
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          You&apos;re set for a {selectedOption.label.toLowerCase()} consultation
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          This is a mock confirmation for demonstration only — no real
          appointment has been made and no payment was processed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Return to homepage
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Book your consultation</h1>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-100/40">
        {clinician.photo ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
            <Image
              src={clinician.photo}
              alt={`Profile photo of ${clinician.name}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-lg font-bold text-white">
            {getInitials(clinician.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{clinician.name}</p>
          <p className="text-sm text-indigo-600">{clinician.specialty}</p>
          <p className="text-xs text-slate-500">
            {clinician.affiliation}, {clinician.city}
          </p>
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-slate-900">
          Choose consultation type
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {CONSULTATION_OPTIONS.map((option) => {
            const isSelected = option.id === type;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setType(option.id)}
                className={`rounded-2xl border p-4 text-left transition-colors duration-150 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-indigo-100 bg-white hover:border-indigo-300"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                <p className="mt-1 text-xs text-slate-500">{option.description}</p>
                <p className="mt-2 text-sm font-semibold text-indigo-600">
                  KES {clinician.prices[option.id]}
                </p>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Consultation price
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">KES {price}</p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-100/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            Estimated wait
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">
            {selectedOption.waitEstimate}
          </p>
        </div>
      </div>

      <PrototypeDisclaimer className="mt-6" />

      <Button
        variant="primary"
        className="mt-6 w-full"
        onClick={() => setConfirmed(true)}
      >
        Continue to consultation
      </Button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Demo only — no real payment will be taken.
      </p>
    </div>
  );
}
