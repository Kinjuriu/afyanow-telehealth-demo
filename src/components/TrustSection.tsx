import SectionHeading from "./SectionHeading";
import {
  IconBadge,
  IconShieldCheck,
  IconBuilding,
  IconClock,
  IconTag,
} from "./icons";

const pillars = [
  {
    icon: IconShieldCheck,
    title: "Verified licences",
    description:
      "Every clinician's practising licence is checked before they join AfyaNow.",
  },
  {
    icon: IconBadge,
    title: "Confirmed qualifications",
    description:
      "Credentials and specialisations are verified against official records.",
  },
  {
    icon: IconBuilding,
    title: "Facility affiliations",
    description:
      "See the hospitals and clinics each clinician is affiliated with.",
  },
  {
    icon: IconClock,
    title: "Real-time availability",
    description:
      "Only book clinicians who are actually available to see you now.",
  },
  {
    icon: IconTag,
    title: "Transparent pricing",
    description:
      "Know the exact consultation fee upfront — no hidden charges.",
  },
];

export default function TrustSection() {
  return (
    <section id="clinicians" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5 lg:items-start">
          <div className="lg:col-span-2">
            <SectionHeading
              align="left"
              eyebrow="Browse clinicians"
              title="Every clinician is verified, so you can trust who you talk to"
              description="AfyaNow checks every clinician before they can accept consultations, so you always know exactly who is caring for you."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-3">
            {pillars.map((pillar, index) => (
              <div
                key={pillar.title}
                className={`rounded-3xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm shadow-indigo-100/40 ${
                  index === pillars.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <pillar.icon className="h-7 w-7 text-indigo-600" />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">
                  {pillar.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
