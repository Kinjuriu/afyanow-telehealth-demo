"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CLINICIANS } from "@/lib/clinicians";
import ClinicianCard from "@/components/patient/ClinicianCard";
import { parseMatchingParams, prioritizeClinicians } from "@/lib/clinician-matching";

type ConsultationType = "chat" | "voice" | "video";

const CONSULTATION_TYPES: { id: ConsultationType; label: string }[] = [
  { id: "chat", label: "Chat" },
  { id: "voice", label: "Voice" },
  { id: "video", label: "Video" },
];

const MAX_PRICE_CEILING = 1200;

export default function ClinicianBrowser() {
  const searchParams = useSearchParams();

  const specialties = useMemo(
    () => Array.from(new Set(CLINICIANS.map((clinician) => clinician.specialty))),
    []
  );
  const languages = useMemo(
    () => Array.from(new Set(CLINICIANS.flatMap((clinician) => clinician.languages))),
    []
  );

  // Specialty, urgency (Issue #2's safety level), and who the consultation
  // is for are all carried forward from the recommendation page via query
  // parameters — validated here rather than trusted directly from the URL.
  const matchingContext = useMemo(
    () =>
      parseMatchingParams({
        specialty: searchParams.get("specialty"),
        who: searchParams.get("who"),
        urgency: searchParams.get("urgency"),
        knownSpecialties: specialties,
      }),
    [searchParams, specialties]
  );

  const [availableOnly, setAvailableOnly] = useState(false);
  const [specialty, setSpecialty] = useState(matchingContext.specialty);
  const [language, setLanguage] = useState("all");
  const [consultationType, setConsultationType] = useState<ConsultationType>("chat");
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE_CEILING);

  const filtered = CLINICIANS.filter((clinician) => {
    if (availableOnly && clinician.availability.status !== "available") return false;
    if (specialty !== "all" && clinician.specialty !== specialty) return false;
    if (language !== "all" && !clinician.languages.includes(language)) return false;
    if (clinician.prices[consultationType] > maxPrice) return false;
    return true;
  });

  // Priority patients see currently available clinicians surfaced first;
  // Routine leaves the existing filter order untouched.
  const orderedClinicians = prioritizeClinicians(filtered, matchingContext.urgency);

  return (
    <div
      className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]"
      data-who={matchingContext.who}
      data-urgency={matchingContext.urgency}
    >
      <aside className="h-fit rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
        <h2 className="text-sm font-semibold text-slate-900">Filters</h2>

        <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
            className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
          />
          Available now
        </label>

        <div className="mt-4">
          <label htmlFor="specialty-filter" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Specialty
          </label>
          <select
            id="specialty-filter"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            <option value="all">All specialties</option>
            {specialties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label htmlFor="language-filter" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Language
          </label>
          <select
            id="language-filter"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            <option value="all">All languages</option>
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="mt-4">
          <legend className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Consultation type
          </legend>
          <div className="mt-1.5 flex gap-2">
            {CONSULTATION_TYPES.map((type) => {
              const isSelected = consultationType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setConsultationType(type.id)}
                  className={`flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors duration-150 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-indigo-200 bg-white text-slate-700 hover:border-indigo-400"
                  }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4">
          <label htmlFor="price-filter" className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Maximum price: KES {maxPrice}
          </label>
          <input
            id="price-filter"
            type="range"
            min={400}
            max={MAX_PRICE_CEILING}
            step={50}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="mt-2 w-full accent-indigo-600"
          />
        </div>
      </aside>

      <div>
        {matchingContext.urgency === "Priority" && orderedClinicians.length > 0 && (
          <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-700">
            Because a prompt consultation was suggested, currently available
            clinicians are shown first below.
          </p>
        )}
        {orderedClinicians.length === 0 ? (
          <p className="rounded-2xl border border-indigo-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
            No clinicians match these filters yet. Try adjusting them.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {orderedClinicians.map((clinician) => (
              <ClinicianCard
                key={clinician.id}
                clinician={clinician}
                consultationType={consultationType}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
