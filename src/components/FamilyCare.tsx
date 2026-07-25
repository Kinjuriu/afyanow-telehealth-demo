import Image from "next/image";
import Button from "./Button";

export default function FamilyCare() {
  return (
    <section className="bg-indigo-50/40 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative order-2 mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl shadow-lg shadow-indigo-100/60 lg:order-1">
            <Image
              src="/images/paediatric-telehealth.jpg"
              alt="A Kenyan telehealth nurse speaking with a patient during a video consultation"
              fill
              sizes="(min-width: 1024px) 32rem, 90vw"
              className="object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">
            <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
              For your household
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Care for you and your family
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
              Get guidance for yourself, your children and other dependants —
              each matched to a verified clinician suited to their needs.
            </p>
            <Button href="#services" variant="primary" className="mt-6">
              Explore care options
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
