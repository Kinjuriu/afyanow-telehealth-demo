import Image from "next/image";
import { IconShieldCheck, IconBadge } from "@/components/icons";
import ClinicianCard from "@/components/patient/ClinicianCard";
import { getClinicianById } from "@/lib/clinicians";

export default function ClinicianProfilePage() {
  const clinician = getClinicianById("amina-wanjiru")!;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
        Fictional demonstration profile
      </span>

      <div className="mt-4 grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
        <div className="mx-auto w-40 sm:w-48 lg:w-full">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-lg shadow-indigo-100/60">
            <Image
              src={clinician.photo!}
              alt={`Profile photo of ${clinician.name}`}
              fill
              sizes="(min-width: 1024px) 220px, 12rem"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{clinician.name}</h1>
          <p className="mt-1 text-sm font-semibold text-indigo-600">{clinician.specialty}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{clinician.bio}</p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <IconShieldCheck className="h-3.5 w-3.5" />
              Verified licence
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              <IconBadge className="h-3.5 w-3.5" />
              Verified qualifications
            </span>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Qualifications" value={clinician.credentials} />
            <Detail label="Registration number" value={clinician.registrationNumber} />
            <Detail label="Affiliation" value={`${clinician.affiliation}, ${clinician.city}`} />
            <Detail label="Languages" value={clinician.languages.join(", ")} />
            <Detail
              label="Conditions commonly treated"
              value={clinician.conditionsTreated.join(", ")}
            />
            <Detail label="Availability" value={clinician.availability.label} />
          </dl>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-100/40">
            <PriceCell label="Chat" value={clinician.prices.chat} />
            <PriceCell label="Voice" value={clinician.prices.voice} />
            <PriceCell label="Video" value={clinician.prices.video} />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900">Public-profile preview</h2>
        <p className="mt-1 text-xs text-slate-500">
          This is what patients see when browsing clinicians on AfyaNow.
        </p>
        <div className="mt-3 max-w-sm">
          <ClinicianCard clinician={clinician} consultationType="chat" />
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-700">{value}</dd>
    </div>
  );
}

function PriceCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">KES {value}</p>
    </div>
  );
}
