import Image from "next/image";
import Button from "./Button";
import { IconArrowRight, IconShieldCheck, IconSparkles } from "./icons";

const highlights = [
  "Verified clinician profiles",
  "Multiple care specialties",
  "Designed for patients across Kenya",
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

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:px-8">
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
            <Button href="/patient/intake" variant="primary">
              Start consultation
              <IconArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/patient/clinicians" variant="secondary">
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

        <div className="relative mx-auto w-full max-w-md pb-10 pr-4 sm:pb-12 sm:pr-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl shadow-indigo-100/60">
            <Image
              src="/images/telehealth-hero.jpg"
              alt="A patient having a video consultation with a doctor from home using a laptop"
              fill
              priority
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-2 -right-2 w-52 rounded-2xl border border-indigo-100 bg-white/95 p-4 shadow-lg shadow-indigo-100/60 backdrop-blur sm:w-56">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-indigo-500">
              Recommended care
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              Dermatology
            </p>
            <div className="mt-3 flex items-center gap-2.5 border-t border-slate-100 pt-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
                <Image
                  src="/images/clinicians/dr-amina-wanjiru.jpeg"
                  alt="Dr. Amina Wanjiru"
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-slate-900">
                  Dr. Amina Wanjiru
                </p>
                <p className="text-[0.65rem] text-slate-500">Nairobi</p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-[0.65rem] font-semibold text-emerald-600">
                Available
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
