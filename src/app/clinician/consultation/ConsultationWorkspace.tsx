"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useClinicianData } from "@/components/clinician/ClinicianDataProvider";
import UrgencyBadge from "@/components/clinician/UrgencyBadge";
import StatusPill from "@/components/clinician/StatusPill";
import type { ConsultationPatient } from "@/lib/clinician-patients";

type TabKey = "overview" | "chat" | "notes" | "documents";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "chat", label: "Chat" },
  { key: "notes", label: "Notes" },
  { key: "documents", label: "Documents" },
];

const REFERRAL_SPECIALTIES = [
  "General Practitioner",
  "Dermatologist",
  "Paediatrician",
  "Gynaecologist",
  "Mental Health Counsellor",
  "Dentist",
];

const MOCK_DOCUMENTS = [
  { name: "Intake summary.pdf", date: "Today" },
  { name: "Previous consultation notes.pdf", date: "3 months ago" },
];

type ChatMessage = {
  from: "patient" | "clinician";
  text: string;
};

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function initialChatFor(patient: ConsultationPatient): ChatMessage[] {
  return [
    { from: "patient", text: `Hi doctor, thank you for seeing me about my ${patient.reason.toLowerCase()}.` },
    { from: "clinician", text: "Hello, thanks for waiting. Let's go through your symptoms together." },
  ];
}

export default function ConsultationWorkspace() {
  const searchParams = useSearchParams();
  const { patients, completePatient } = useClinicianData();

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    searchParams.get("patientId")
  );

  const activePatient = useMemo(() => {
    const found = selectedPatientId
      ? patients.find((patient) => patient.id === selectedPatientId)
      : undefined;
    return found ?? patients.find((patient) => patient.status === "waiting") ?? patients[0];
  }, [selectedPatientId, patients]);

  const waitingQueue = patients.filter((patient) => patient.queueType === "now");
  const schedule = patients.filter((patient) => patient.queueType === "scheduled");

  if (!activePatient) {
    return (
      <p className="rounded-2xl border border-indigo-100 bg-white p-6 text-sm text-slate-600 shadow-sm">
        No patients available in this demo session.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr_280px]">
      <aside className="order-2 lg:order-1">
        <details
          className="rounded-3xl border border-indigo-100 bg-white shadow-sm shadow-indigo-100/40 lg:[&_summary]:hidden"
          open
        >
          <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-slate-900 lg:hidden">
            Queue &amp; schedule
          </summary>
          <div className="px-5 pb-5 lg:pt-5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Waiting now
            </h2>
            <ul className="mt-2 space-y-2">
              {waitingQueue.map((patient) => (
                <PatientListItem
                  key={patient.id}
                  patient={patient}
                  isActive={patient.id === activePatient.id}
                  onSelect={() => setSelectedPatientId(patient.id)}
                />
              ))}
            </ul>

            <h2 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Today&apos;s schedule
            </h2>
            <ul className="mt-2 space-y-2">
              {schedule.map((patient) => (
                <PatientListItem
                  key={patient.id}
                  patient={patient}
                  isActive={patient.id === activePatient.id}
                  onSelect={() => setSelectedPatientId(patient.id)}
                />
              ))}
            </ul>
          </div>
        </details>
      </aside>

      <div className="order-1 lg:order-2">
        <ConsultationSession
          key={activePatient.id}
          patient={activePatient}
          onComplete={() => completePatient(activePatient.id)}
        />
      </div>

      <aside className="order-3 h-fit rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm shadow-indigo-100/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">{activePatient.name}</p>
            <p className="text-xs text-slate-500">{activePatient.age} years old</p>
          </div>
          <UrgencyBadge urgency={activePatient.urgency} />
        </div>

        <p className="mt-3 text-sm text-slate-600">{activePatient.reason}</p>

        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-indigo-50/50 p-3 text-xs">
          <VitalCell label="Temp" value={activePatient.vitals.temperature} />
          <VitalCell label="BP" value={activePatient.vitals.bloodPressure} />
          <VitalCell label="Heart rate" value={activePatient.vitals.heartRate} />
          <VitalCell label="SpO2" value={activePatient.vitals.oxygenSaturation} />
        </div>

        <p className="mt-4 text-xs text-slate-400">
          Fictional demo patient — all data is for illustration only.
        </p>
      </aside>
    </div>
  );
}

/**
 * Keyed by patient.id from the parent, so switching the active patient
 * remounts this component and gives every piece of session state
 * (tab, call, chat, notes) a fresh start — no reset effect required.
 */
function ConsultationSession({
  patient,
  onComplete,
}: {
  patient: ConsultationPatient;
  onComplete: () => void;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [callActive, setCallActive] = useState(true);
  const [callSeconds, setCallSeconds] = useState(0);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => initialChatFor(patient));
  const [chatInput, setChatInput] = useState("");

  const [consultationNotes, setConsultationNotes] = useState("");
  const [assessment, setAssessment] = useState("");
  const [prescription, setPrescription] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
  });
  const [referral, setReferral] = useState({ specialty: "", reason: "" });
  const [followUp, setFollowUp] = useState({ date: "", time: "", notes: "" });
  const [careInstructions, setCareInstructions] = useState("");

  const [draftSaved, setDraftSaved] = useState(false);
  const [carePlanSent, setCarePlanSent] = useState(false);
  const [consultationCompleted, setConsultationCompleted] = useState(false);

  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  useEffect(() => {
    if (!draftSaved) return;
    const timeout = setTimeout(() => setDraftSaved(false), 3000);
    return () => clearTimeout(timeout);
  }, [draftSaved]);

  useEffect(() => {
    if (!carePlanSent) return;
    const timeout = setTimeout(() => setCarePlanSent(false), 3000);
    return () => clearTimeout(timeout);
  }, [carePlanSent]);

  function sendChatMessage() {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, { from: "clinician", text: chatInput.trim() }]);
    setChatInput("");
  }

  function handleCompleteConsultation() {
    onComplete();
    setConsultationCompleted(true);
  }

  return (
    <>
      <div className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm shadow-indigo-100/40 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-slate-900 text-sm font-medium text-white/70">
            {cameraOn ? "Clinician camera (mock)" : "Camera off"}
          </div>
          <div className="flex aspect-video items-center justify-center rounded-2xl bg-indigo-900 text-sm font-medium text-white/70">
            {patient.name} (mock video)
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {callActive ? `Call time ${formatTimer(callSeconds)}` : "Call ended"}
          </span>

          <div className="flex flex-wrap gap-2">
            <ControlButton
              label={micOn ? "Mute" : "Unmute"}
              active={micOn}
              onClick={() => setMicOn((value) => !value)}
            />
            <ControlButton
              label={cameraOn ? "Camera off" : "Camera on"}
              active={cameraOn}
              onClick={() => setCameraOn((value) => !value)}
            />
            <ControlButton label="Chat" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
            <button
              type="button"
              onClick={() => setCallActive(false)}
              disabled={!callActive}
              className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              End call
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-indigo-100 bg-white shadow-sm shadow-indigo-100/40">
        <div className="flex gap-1 overflow-x-auto border-b border-indigo-100 px-3 pt-3" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 rounded-t-xl px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                activeTab === tab.key
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:text-indigo-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === "overview" && <OverviewTab patient={patient} />}

          {activeTab === "chat" && (
            <ChatTab
              messages={chatMessages}
              input={chatInput}
              onInputChange={setChatInput}
              onSend={sendChatMessage}
            />
          )}

          {activeTab === "notes" &&
            (consultationCompleted ? (
              <CompletedNotice patient={patient} />
            ) : (
              <NotesTab
                consultationNotes={consultationNotes}
                setConsultationNotes={setConsultationNotes}
                assessment={assessment}
                setAssessment={setAssessment}
                prescription={prescription}
                setPrescription={setPrescription}
                referral={referral}
                setReferral={setReferral}
                followUp={followUp}
                setFollowUp={setFollowUp}
                careInstructions={careInstructions}
                setCareInstructions={setCareInstructions}
                draftSaved={draftSaved}
                carePlanSent={carePlanSent}
                onSaveDraft={() => setDraftSaved(true)}
                onSendCarePlan={() => setCarePlanSent(true)}
                onComplete={handleCompleteConsultation}
              />
            ))}

          {activeTab === "documents" && <DocumentsTab />}
        </div>
      </div>
    </>
  );
}

function PatientListItem({
  patient,
  isActive,
  onSelect,
}: {
  patient: ConsultationPatient;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive}
        className={`w-full rounded-2xl border p-3 text-left transition-colors duration-150 ${
          isActive
            ? "border-indigo-600 bg-indigo-50"
            : "border-indigo-100 bg-white hover:border-indigo-300"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-slate-900">{patient.name}</p>
          <StatusPill status={patient.status} />
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">{patient.reason}</p>
        <p className="mt-1 text-[0.65rem] text-slate-400">
          {patient.queueType === "now" ? `Waiting ${patient.waitingSince}` : patient.scheduledTime}
        </p>
      </button>
    </li>
  );
}

function ControlButton({
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

function VitalCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium text-slate-500">{label}</p>
      <p className="mt-0.5 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function OverviewTab({ patient }: { patient: ConsultationPatient }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Intake summary
        </h3>
        <p className="mt-1 text-sm text-slate-700">
          {patient.intake.concern} · {patient.intake.duration} · {patient.intake.severity}
        </p>
      </div>

      <InfoList label="Reported symptoms" items={patient.symptoms} />
      <InfoList label="Existing conditions" items={patient.conditions} />
      <InfoList label="Allergies" items={patient.allergies} />
      <InfoList label="Current medication" items={patient.medication} />
      <InfoList label="Relevant previous history" items={patient.history} />
    </div>
  );
}

function InfoList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</h3>
      <ul className="mt-1 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full bg-indigo-50/70 px-3 py-1 text-xs text-slate-700"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChatTab({
  messages,
  input,
  onInputChange,
  onSend,
}: {
  messages: ChatMessage[];
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div>
      <div className="max-h-72 space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              message.from === "clinician"
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
          onSend();
        }}
      >
        <label htmlFor="chat-input" className="sr-only">
          Message the patient
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
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
    </div>
  );
}

type PrescriptionState = { medication: string; dosage: string; frequency: string; duration: string };
type ReferralState = { specialty: string; reason: string };
type FollowUpState = { date: string; time: string; notes: string };

function NotesTab({
  consultationNotes,
  setConsultationNotes,
  assessment,
  setAssessment,
  prescription,
  setPrescription,
  referral,
  setReferral,
  followUp,
  setFollowUp,
  careInstructions,
  setCareInstructions,
  draftSaved,
  carePlanSent,
  onSaveDraft,
  onSendCarePlan,
  onComplete,
}: {
  consultationNotes: string;
  setConsultationNotes: (value: string) => void;
  assessment: string;
  setAssessment: (value: string) => void;
  prescription: PrescriptionState;
  setPrescription: (value: PrescriptionState) => void;
  referral: ReferralState;
  setReferral: (value: ReferralState) => void;
  followUp: FollowUpState;
  setFollowUp: (value: FollowUpState) => void;
  careInstructions: string;
  setCareInstructions: (value: string) => void;
  draftSaved: boolean;
  carePlanSent: boolean;
  onSaveDraft: () => void;
  onSendCarePlan: () => void;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Consultation notes">
        <textarea
          value={consultationNotes}
          onChange={(event) => setConsultationNotes(event.target.value)}
          rows={3}
          placeholder="Document what the patient reported and your observations (fictional demo)."
          className="w-full rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </Field>

      <Field label="Assessment / diagnosis">
        <textarea
          value={assessment}
          onChange={(event) => setAssessment(event.target.value)}
          rows={2}
          placeholder="e.g. Likely viral upper respiratory infection (fictional demo)."
          className="w-full rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </Field>

      <div>
        <p className="text-sm font-semibold text-slate-900">Prescription</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <input
            value={prescription.medication}
            onChange={(event) => setPrescription({ ...prescription, medication: event.target.value })}
            placeholder="Medication"
            aria-label="Prescription medication"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <input
            value={prescription.dosage}
            onChange={(event) => setPrescription({ ...prescription, dosage: event.target.value })}
            placeholder="Dosage"
            aria-label="Prescription dosage"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <input
            value={prescription.frequency}
            onChange={(event) => setPrescription({ ...prescription, frequency: event.target.value })}
            placeholder="Frequency"
            aria-label="Prescription frequency"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <input
            value={prescription.duration}
            onChange={(event) => setPrescription({ ...prescription, duration: event.target.value })}
            placeholder="Duration"
            aria-label="Prescription duration"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">Referral</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_2fr]">
          <select
            value={referral.specialty}
            onChange={(event) => setReferral({ ...referral, specialty: event.target.value })}
            aria-label="Referral specialty"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          >
            <option value="">No referral needed</option>
            {REFERRAL_SPECIALTIES.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <input
            value={referral.reason}
            onChange={(event) => setReferral({ ...referral, reason: event.target.value })}
            placeholder="Reason for referral"
            aria-label="Referral reason"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">Follow-up scheduling</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <input
            type="date"
            value={followUp.date}
            onChange={(event) => setFollowUp({ ...followUp, date: event.target.value })}
            aria-label="Follow-up date"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <input
            type="time"
            value={followUp.time}
            onChange={(event) => setFollowUp({ ...followUp, time: event.target.value })}
            aria-label="Follow-up time"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
          <input
            value={followUp.notes}
            onChange={(event) => setFollowUp({ ...followUp, notes: event.target.value })}
            placeholder="Follow-up note"
            aria-label="Follow-up note"
            className="rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
      </div>

      <Field label="Patient education / care instructions">
        <textarea
          value={careInstructions}
          onChange={(event) => setCareInstructions(event.target.value)}
          rows={2}
          placeholder="e.g. Rest, fluids, and return if symptoms worsen (fictional demo)."
          className="w-full rounded-xl border border-indigo-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3 border-t border-indigo-100 pt-4">
        <button
          type="button"
          onClick={onSaveDraft}
          className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={onSendCarePlan}
          className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
        >
          Send fictional care plan to patient
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:from-indigo-500 hover:to-blue-500"
        >
          Complete consultation
        </button>

        {draftSaved && <span className="text-xs font-medium text-emerald-600">Draft saved</span>}
        {carePlanSent && (
          <span className="text-xs font-medium text-emerald-600">Care plan sent (demo only)</span>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-900">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function CompletedNotice({ patient }: { patient: ConsultationPatient }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
        Consultation completed
      </p>
      <h3 className="mt-2 text-lg font-bold text-emerald-700">
        {patient.name}&apos;s consultation has been marked complete
      </h3>
      <p className="mt-2 text-sm text-emerald-700">
        This is a fictional demo confirmation — no real medical record was created.
      </p>
      <Link
        href="/clinician"
        className="mt-4 inline-block rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
      >
        Return to dashboard
      </Link>
    </div>
  );
}

function DocumentsTab() {
  return (
    <div>
      <ul className="space-y-2">
        {MOCK_DOCUMENTS.map((document) => (
          <li
            key={document.name}
            className="flex items-center justify-between rounded-2xl border border-indigo-100 bg-indigo-50/40 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">{document.name}</span>
            <span className="text-xs text-slate-500">{document.date}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-400">
        Fictional demo documents — no real files are attached.
      </p>
    </div>
  );
}
