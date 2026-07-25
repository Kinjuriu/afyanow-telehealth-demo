import SectionHeading from "./SectionHeading";
import {
  IconStethoscope,
  IconTooth,
  IconHeartPulse,
  IconBrain,
  IconBaby,
  IconDroplet,
} from "./icons";

const categories = [
  {
    icon: IconStethoscope,
    title: "General doctor",
    description: "Everyday health concerns, check-ups and referrals.",
  },
  {
    icon: IconTooth,
    title: "Dentist",
    description: "Oral health, tooth pain and dental guidance.",
  },
  {
    icon: IconHeartPulse,
    title: "Gynaecologist",
    description: "Women's health, reproductive care and check-ups.",
  },
  {
    icon: IconBrain,
    title: "Mental health",
    description: "Confidential support for stress, anxiety and more.",
  },
  {
    icon: IconBaby,
    title: "Paediatric care",
    description: "Health care for infants, children and teens.",
  },
  {
    icon: IconDroplet,
    title: "Dermatology",
    description: "Skin, hair and nail concerns of all kinds.",
  },
];

export default function CareCategories() {
  return (
    <section
      id="services"
      className="bg-gradient-to-b from-white to-indigo-50/60 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Services"
          title="Care for every concern"
          description="From routine check-ups to specialist care, find the right clinician across these categories."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group rounded-3xl border border-indigo-100 bg-white p-6 shadow-sm shadow-indigo-100/40 transition-shadow duration-200 hover:shadow-lg hover:shadow-indigo-100/60"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {category.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
