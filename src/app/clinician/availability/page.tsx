"use client";

import { useState } from "react";

type DayHours = {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
};

const INITIAL_HOURS: DayHours[] = [
  { day: "Monday", enabled: true, start: "08:00", end: "17:00" },
  { day: "Tuesday", enabled: true, start: "08:00", end: "17:00" },
  { day: "Wednesday", enabled: true, start: "08:00", end: "17:00" },
  { day: "Thursday", enabled: true, start: "08:00", end: "17:00" },
  { day: "Friday", enabled: true, start: "08:00", end: "16:00" },
  { day: "Saturday", enabled: true, start: "09:00", end: "13:00" },
  { day: "Sunday", enabled: false, start: "09:00", end: "13:00" },
];

type BreakPeriod = {
  label: string;
  enabled: boolean;
  start: string;
  end: string;
};

const INITIAL_BREAKS: BreakPeriod[] = [
  { label: "Morning break", enabled: true, start: "10:30", end: "10:45" },
  { label: "Lunch break", enabled: true, start: "13:00", end: "14:00" },
];

const APPOINTMENT_DURATIONS = [15, 30, 45, 60];

export default function ClinicianAvailabilityPage() {
  const [hours, setHours] = useState<DayHours[]>(INITIAL_HOURS);
  const [breaks, setBreaks] = useState<BreakPeriod[]>(INITIAL_BREAKS);
  const [instantConsultations, setInstantConsultations] = useState(true);
  const [appointmentDuration, setAppointmentDuration] = useState(30);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [chatPrice, setChatPrice] = useState(500);
  const [voicePrice, setVoicePrice] = useState(650);
  const [videoPrice, setVideoPrice] = useState(800);
  const [saved, setSaved] = useState(false);

  function updateDay(index: number, changes: Partial<DayHours>) {
    setHours((prev) =>
      prev.map((day, i) => (i === index ? { ...day, ...changes } : day))
    );
  }

  function updateBreak(index: number, changes: Partial<BreakPeriod>) {
    setBreaks((prev) =>
      prev.map((period, i) => (i === index ? { ...period, ...changes } : period))
    );
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900">Availability &amp; pricing</h1>
      <p className="mt-1 text-sm text-slate-600">
        Configure your demo working hours, consultation types and prices.
        Changes are kept only for this session.
      </p>

      <section className="mt-6 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
        <h2 className="text-sm font-semibold text-slate-900">Weekly working hours</h2>
        <div className="mt-3 space-y-2">
          {hours.map((day, index) => (
            <div
              key={day.day}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 px-4 py-3"
            >
              <label className="flex w-32 items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={(event) => updateDay(index, { enabled: event.target.checked })}
                  className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                {day.day}
              </label>
              <input
                type="time"
                value={day.start}
                disabled={!day.enabled}
                onChange={(event) => updateDay(index, { start: event.target.value })}
                aria-label={`${day.day} start time`}
                className="rounded-xl border border-indigo-200 px-3 py-1.5 text-sm disabled:opacity-40"
              />
              <span className="text-sm text-slate-400">to</span>
              <input
                type="time"
                value={day.end}
                disabled={!day.enabled}
                onChange={(event) => updateDay(index, { end: event.target.value })}
                aria-label={`${day.day} end time`}
                className="rounded-xl border border-indigo-200 px-3 py-1.5 text-sm disabled:opacity-40"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
        <h2 className="text-sm font-semibold text-slate-900">Break periods</h2>
        <div className="mt-3 space-y-2">
          {breaks.map((period, index) => (
            <div
              key={period.label}
              className="flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/30 px-4 py-3"
            >
              <label className="flex w-40 items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={period.enabled}
                  onChange={(event) => updateBreak(index, { enabled: event.target.checked })}
                  className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                />
                {period.label}
              </label>
              <input
                type="time"
                value={period.start}
                disabled={!period.enabled}
                onChange={(event) => updateBreak(index, { start: event.target.value })}
                aria-label={`${period.label} start time`}
                className="rounded-xl border border-indigo-200 px-3 py-1.5 text-sm disabled:opacity-40"
              />
              <span className="text-sm text-slate-400">to</span>
              <input
                type="time"
                value={period.end}
                disabled={!period.enabled}
                onChange={(event) => updateBreak(index, { end: event.target.value })}
                aria-label={`${period.label} end time`}
                className="rounded-xl border border-indigo-200 px-3 py-1.5 text-sm disabled:opacity-40"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
          <h2 className="text-sm font-semibold text-slate-900">Instant consultations</h2>
          <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={instantConsultations}
              onChange={(event) => setInstantConsultations(event.target.checked)}
              className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
            />
            Accept instant consultations while online
          </label>
        </div>

        <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
          <h2 className="text-sm font-semibold text-slate-900">Appointment duration</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {APPOINTMENT_DURATIONS.map((duration) => {
              const isSelected = appointmentDuration === duration;
              return (
                <button
                  key={duration}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setAppointmentDuration(duration)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-150 ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-indigo-200 bg-white text-slate-700 hover:border-indigo-400"
                  }`}
                >
                  {duration} min
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
        <h2 className="text-sm font-semibold text-slate-900">Consultation types &amp; prices</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <PriceControl
            label="Chat"
            enabled={chatEnabled}
            onToggle={setChatEnabled}
            price={chatPrice}
            onPriceChange={setChatPrice}
          />
          <PriceControl
            label="Voice"
            enabled={voiceEnabled}
            onToggle={setVoiceEnabled}
            price={voicePrice}
            onPriceChange={setVoicePrice}
          />
          <PriceControl
            label="Video"
            enabled={videoEnabled}
            onToggle={setVideoEnabled}
            price={videoPrice}
            onPriceChange={setVideoPrice}
          />
        </div>
      </section>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-500 hover:to-blue-500"
        >
          Save availability settings
        </button>
        {saved && (
          <span className="text-sm font-medium text-emerald-600">
            Saved for this demo session
          </span>
        )}
      </div>
    </main>
  );
}

function PriceControl({
  label,
  enabled,
  onToggle,
  price,
  onPriceChange,
}: {
  label: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  price: number;
  onPriceChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => onToggle(event.target.checked)}
          className="h-4 w-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
        />
        {label} enabled
      </label>
      <label className="mt-3 block text-xs font-medium text-slate-500">
        {label} price (KES)
        <input
          type="number"
          min={0}
          step={50}
          value={price}
          disabled={!enabled}
          onChange={(event) => onPriceChange(Number(event.target.value))}
          className="mt-1 w-full rounded-xl border border-indigo-200 px-3 py-2 text-sm disabled:opacity-40"
        />
      </label>
    </div>
  );
}
