import SectionHeading from "./SectionHeading";
import { IconChat, IconClipboard, IconUserCheck, IconPlay } from "./icons";

const steps = [
  {
    icon: IconChat,
    title: "Describe what's wrong",
    description:
      "Tell us your symptoms and concerns in your own words — no medical jargon needed.",
  },
  {
    icon: IconClipboard,
    title: "Get a recommended care type",
    description:
      "AfyaNow suggests the specialty best suited to your concern, from general care to specialists.",
  },
  {
    icon: IconUserCheck,
    title: "Choose an available clinician",
    description:
      "Compare verified profiles, qualifications and prices, then pick who feels right for you.",
  },
  {
    icon: IconPlay,
    title: "Begin the consultation",
    description:
      "Connect with your chosen clinician as soon as they're available.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Four simple steps to the right care"
          description="AfyaNow takes the guesswork out of finding help, so you can focus on feeling better."
        />

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-3xl border border-indigo-100 bg-indigo-50/40 p-6 shadow-sm shadow-indigo-100/50"
            >
              <span className="absolute -left-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-200">
                {index + 1}
              </span>
              <step.icon className="h-9 w-9 text-indigo-600" />
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
