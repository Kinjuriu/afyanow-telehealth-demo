import Button from "./Button";
import { IconArrowRight, IconShieldCheck, IconSparkles } from "./icons";

const highlights = [
  "500+ verified clinicians",
  "6 specialties covered",
  "Nairobi • Mombasa • Kisumu",
];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-blue-50 to-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm shadow-indigo-100">
            <IconSparkles className="h-4 w-4" />
            Telehealth, made for Kenya
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find the right care, right when you need it.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Describe what&apos;s wrong in your own words, and AfyaNow matches you
            with an appropriate, verified clinician — so you spend less time
            searching and more time getting better.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#how-it-works" variant="primary">
              Start consultation
              <IconArrowRight className="h-4 w-4" />
            </Button>
            <Button href="#clinicians" variant="secondary">
              Browse clinicians
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
            {highlights.map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <IconShieldCheck className="h-4 w-4 text-indigo-500" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-indigo-100 bg-white/90 p-6 shadow-xl shadow-indigo-100/60 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Symptom match (demo)
            </p>
            <p className="mt-3 text-sm text-slate-600">
              &ldquo;I&apos;ve had a persistent skin rash and mild itching for
              a week.&rdquo;
            </p>

            <div className="mt-5 rounded-2xl bg-indigo-50 p-4">
              <p className="text-xs font-medium text-indigo-500">
                Recommended care
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                Dermatology
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Dr. Amina Wanjiru
                </p>
                <p className="text-xs text-slate-500">
                  Dermatologist • Nairobi
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                Available
              </span>
            </div>

            <p className="mt-4 text-center text-xs text-slate-400">
              Fictional data for demonstration only
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
