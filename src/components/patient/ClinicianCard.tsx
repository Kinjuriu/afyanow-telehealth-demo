import Image from "next/image";
import Link from "next/link";
import { getInitials, type Clinician } from "@/lib/clinicians";
import { IconShieldCheck } from "@/components/icons";

type ClinicianCardProps = {
  clinician: Clinician;
  consultationType: "chat" | "voice" | "video";
};

export default function ClinicianCard({ clinician, consultationType }: ClinicianCardProps) {
  const isAvailable = clinician.availability.status === "available";

  return (
    <div className="flex h-full flex-col rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
      <div className="flex items-center gap-3">
        {clinician.photo ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
            <Image
              src={clinician.photo}
              alt={`Profile photo of ${clinician.name}`}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white">
            {getInitials(clinician.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{clinician.name}</p>
          <p className="text-xs font-medium text-indigo-600">{clinician.specialty}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <IconShieldCheck className="h-4 w-4" />
        Verified licence
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {clinician.affiliation}, {clinician.city}
      </p>
      <p className="mt-1 text-xs text-slate-500">{clinician.languages.join(" and ")}</p>
      <p className="mt-1 text-xs text-slate-500">
        {clinician.yearsExperience} yrs experience • ★ {clinician.rating.toFixed(1)}
      </p>

      <span
        className={`mt-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
          isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
        }`}
      >
        {clinician.availability.label}
      </span>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-indigo-50/50 p-3 text-center">
        <PriceCell label="Chat" value={clinician.prices.chat} active={consultationType === "chat"} />
        <PriceCell label="Voice" value={clinician.prices.voice} active={consultationType === "voice"} />
        <PriceCell label="Video" value={clinician.prices.video} active={consultationType === "video"} />
      </div>

      <div className="mt-auto flex gap-2 pt-4">
        <Link
          href={`/patient/clinicians/${clinician.id}`}
          className="flex-1 rounded-full border border-indigo-200 bg-white px-4 py-2 text-center text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          View profile
        </Link>
        <Link
          href={`/patient/booking?clinicianId=${clinician.id}&type=${consultationType}`}
          className="flex-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2 text-center text-xs font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-blue-500"
        >
          Select clinician
        </Link>
      </div>
    </div>
  );
}

function PriceCell({ label, value, active }: { label: string; value: number; active: boolean }) {
  return (
    <div className={`rounded-xl px-2 py-1.5 ${active ? "bg-white shadow-sm" : ""}`}>
      <p className="text-[0.65rem] font-medium text-slate-500">{label}</p>
      <p className={`text-xs font-semibold ${active ? "text-indigo-700" : "text-slate-700"}`}>
        KES {value}
      </p>
    </div>
  );
}
