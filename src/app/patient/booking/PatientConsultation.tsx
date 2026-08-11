"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Clinician } from "@/lib/clinicians";
import { getInitials } from "@/lib/clinicians";

type ConsultationType = "chat" | "voice" | "video";

type ChatMessage = {
  from: "patient" | "clinician";
  text: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { from: "patient", text: "Hi doctor, thank you for seeing me today." },
  {
    from: "clinician",
    text: "Hello! Happy to help — go ahead and tell me a bit more about what's going on.",
  },
];

const AUTO_REPLY =
  "Noted, thank you for sharing that. (Automated demo reply — this is a fictional conversation.)";

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function PatientConsultation({
  clinician,
  type,
}: {
  clinician: Clinician;
  type: ConsultationType;
}) {
  const [ended, setEnded] = useState(false);

  if (ended) {
    return <EndedNotice clinician={clinician} type={type} />;
  }

  return (
    <div className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40 sm:p-6">
      <ConsultationHeader clinician={clinician} type={type} />

      {type === "chat" && <ChatConsultation onEnd={() => setEnded(true)} />}
      {type === "voice" && (
        <CallConsultation type="voice" clinician={clinician} onEnd={() => setEnded(true)} />
      )}
      {type === "video" && (
        <CallConsultation type="video" clinician={clinician} onEnd={() => setEnded(true)} />
      )}
    </div>
  );
}

function ConsultationHeader({
  clinician,
  type,
}: {
  clinician: Clinician;
  type: ConsultationType;
}) {
  const typeLabel =
    type === "chat" ? "Chat consultation" : type === "voice" ? "Voice call" : "Video call";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-4">
      <div className="flex items-center gap-3">
        {clinician.photo ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <Image
              src={clinician.photo}
              alt={`Profile photo of ${clinician.name}`}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white">
            {getInitials(clinician.name)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{clinician.name}</p>
          <p className="text-xs text-indigo-600">{clinician.specialty}</p>
        </div>
      </div>

      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
        Demo {typeLabel.toLowerCase()} — not a real appointment
      </span>
    </div>
  );
}

function ChatConsultation({ onEnd }: { onEnd: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.from !== "patient") return;

    const timeout = setTimeout(() => {
      setMessages((prev) => [...prev, { from: "clinician", text: AUTO_REPLY }]);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "patient", text: input.trim() }]);
    setInput("");
  }

  return (
    <div className="mt-4">
      <div className="max-h-80 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              message.from === "patient"
                ? "ml-auto bg-indigo-600 text-white"
                : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <label htmlFor="patient-chat-input" className="sr-only">
          Message the clinician
        </label>
        <input
          id="patient-chat-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type a message (demo only)"
          className="flex-1 rounded-full border border-indigo-200 px-4 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
        <button
          type="submit"
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Send
        </button>
      </form>

      <p className="mt-3 text-xs text-slate-400">
        Fictional demo conversation — no real messages are sent or stored.
      </p>

      <button
        type="button"
        onClick={onEnd}
        className="mt-4 w-full rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
      >
        End demo consultation
      </button>
    </div>
  );
}

function CallConsultation({
  type,
  clinician,
  onEnd,
}: {
  type: "voice" | "video";
  clinician: Clinician;
  onEnd: () => void;
}) {
  const [status, setStatus] = useState<"connecting" | "connected">("connecting");
  const [seconds, setSeconds] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setStatus("connected"), 1800);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (status !== "connected") return;
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="mt-4">
      {type === "video" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-900 text-sm font-medium text-white/70">
            {clinician.name} (mock video)
          </div>
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-indigo-900 text-sm font-medium text-white/70">
            {cameraOn ? "Your video (demo — camera not accessed)" : "Camera off"}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900 py-10 text-white">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-xl font-bold">
            {getInitials(clinician.name)}
          </div>
          <p className="mt-4 text-sm font-medium text-white/80">{clinician.name}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {status === "connecting" ? "Connecting…" : `Call time ${formatTimer(seconds)}`}
        </span>

        <div className="flex flex-wrap gap-2">
          <CallControlButton
            label={micOn ? "Mute" : "Unmute"}
            active={micOn}
            onClick={() => setMicOn((value) => !value)}
          />
          {type === "video" && (
            <CallControlButton
              label={cameraOn ? "Camera off" : "Camera on"}
              active={cameraOn}
              onClick={() => setCameraOn((value) => !value)}
            />
          )}
          <button
            type="button"
            onClick={onEnd}
            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500"
          >
            End call
          </button>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Simulated {type === "video" ? "video" : "voice"} call for demo purposes only — no real
        {type === "video" ? " camera or video" : " microphone or voice"} connection is made.
      </p>
    </div>
  );
}

function CallControlButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-150 ${
        active
          ? "border-indigo-600 bg-indigo-600 text-white"
          : "border-indigo-200 bg-white text-slate-700 hover:border-indigo-400"
      }`}
    >
      {label}
    </button>
  );
}

function EndedNotice({
  clinician,
  type,
}: {
  clinician: Clinician;
  type: ConsultationType;
}) {
  const typeLabel = type === "chat" ? "chat" : type === "voice" ? "voice call" : "video call";

  return (
    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
        Demo consultation ended
      </p>
      <h1 className="mt-2 text-xl font-bold text-emerald-700">
        Your {typeLabel} with {clinician.name} has ended
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-emerald-700">
        This was a fictional demo consultation for illustration only — no real appointment,
        call, or payment took place, and no medical advice was given.
      </p>
      <Link
        href="/patient/clinicians"
        className="mt-6 inline-block rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        Browse clinicians
      </Link>
    </div>
  );
}
