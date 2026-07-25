export type Urgency = "Routine" | "Priority" | "Urgent";
export type ConsultationType = "chat" | "voice" | "video";
export type PatientStatus = "waiting" | "upcoming" | "completed";

export type ConsultationPatient = {
  id: string;
  name: string;
  age: number;
  reason: string;
  urgency: Urgency;
  consultationType: ConsultationType;
  queueType: "now" | "scheduled";
  scheduledTime?: string;
  waitingSince?: string;
  status: PatientStatus;
  intake: {
    concern: string;
    duration: string;
    severity: string;
  };
  symptoms: string[];
  conditions: string[];
  allergies: string[];
  medication: string[];
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    oxygenSaturation: string;
  };
  history: string[];
};

export const INITIAL_PATIENTS: ConsultationPatient[] = [
  {
    id: "p-grace-njoroge",
    name: "Grace Njoroge",
    age: 29,
    reason: "Fever and body aches for two days",
    urgency: "Priority",
    consultationType: "video",
    queueType: "now",
    waitingSince: "8 minutes ago",
    status: "waiting",
    intake: {
      concern: "Fever or general illness",
      duration: "A few days",
      severity: "Moderate — noticeable discomfort",
    },
    symptoms: ["Fever", "Fatigue", "Headache"],
    conditions: ["None"],
    allergies: ["None known"],
    medication: ["Paracetamol as needed"],
    vitals: {
      temperature: "38.4°C",
      bloodPressure: "118/76 mmHg",
      heartRate: "92 bpm",
      oxygenSaturation: "98%",
    },
    history: [
      "No previous consultations on AfyaNow",
      "No chronic conditions on file",
    ],
  },
  {
    id: "p-samuel-kiptoo",
    name: "Samuel Kiptoo",
    age: 41,
    reason: "Persistent cough and chest tightness",
    urgency: "Routine",
    consultationType: "chat",
    queueType: "now",
    waitingSince: "3 minutes ago",
    status: "waiting",
    intake: {
      concern: "Cough, cold or flu-like symptoms",
      duration: "A week or more",
      severity: "Mild — manageable",
    },
    symptoms: ["Fatigue"],
    conditions: ["Asthma"],
    allergies: ["Penicillin"],
    medication: ["Salbutamol inhaler"],
    vitals: {
      temperature: "37.1°C",
      bloodPressure: "124/80 mmHg",
      heartRate: "78 bpm",
      oxygenSaturation: "97%",
    },
    history: ["Previous AfyaNow consultation 3 months ago for seasonal allergies"],
  },
  {
    id: "p-linet-wafula",
    name: "Linet Wafula",
    age: 8,
    reason: "Stomach ache and reduced appetite (reported by parent)",
    urgency: "Routine",
    consultationType: "voice",
    queueType: "scheduled",
    scheduledTime: "10:30 AM",
    status: "upcoming",
    intake: {
      concern: "Stomach pain or digestion issues",
      duration: "Started today",
      severity: "Mild — manageable",
    },
    symptoms: ["Nausea"],
    conditions: ["None"],
    allergies: ["None known"],
    medication: ["None"],
    vitals: {
      temperature: "36.9°C",
      bloodPressure: "—",
      heartRate: "88 bpm",
      oxygenSaturation: "99%",
    },
    history: ["First AfyaNow consultation for this patient"],
  },
  {
    id: "p-daniel-mwangi",
    name: "Daniel Mwangi",
    age: 52,
    reason: "Follow-up on blood pressure medication",
    urgency: "Routine",
    consultationType: "video",
    queueType: "scheduled",
    scheduledTime: "11:15 AM",
    status: "upcoming",
    intake: {
      concern: "Chronic condition follow-up",
      duration: "Ongoing",
      severity: "Mild — manageable",
    },
    symptoms: ["None reported today"],
    conditions: ["Hypertension"],
    allergies: ["None known"],
    medication: ["Amlodipine 5mg daily"],
    vitals: {
      temperature: "36.7°C",
      bloodPressure: "132/85 mmHg",
      heartRate: "74 bpm",
      oxygenSaturation: "98%",
    },
    history: [
      "Ongoing hypertension management since March 2026",
      "Last consultation 30 days ago",
    ],
  },
  {
    id: "p-esther-nyambura",
    name: "Esther Nyambura",
    age: 35,
    reason: "Skin rash review",
    urgency: "Routine",
    consultationType: "chat",
    queueType: "scheduled",
    scheduledTime: "1:00 PM",
    status: "upcoming",
    intake: {
      concern: "Skin rash or itching",
      duration: "A week or more",
      severity: "Mild — manageable",
    },
    symptoms: ["Mild itching"],
    conditions: ["None"],
    allergies: ["None known"],
    medication: ["Antihistamine cream"],
    vitals: {
      temperature: "36.8°C",
      bloodPressure: "116/74 mmHg",
      heartRate: "70 bpm",
      oxygenSaturation: "99%",
    },
    history: ["Previous AfyaNow consultation 2 weeks ago for the same concern"],
  },
  {
    id: "p-john-otieno",
    name: "John Otieno",
    age: 45,
    reason: "General wellness check-up",
    urgency: "Routine",
    consultationType: "video",
    queueType: "scheduled",
    scheduledTime: "9:00 AM",
    status: "completed",
    intake: {
      concern: "General check-up",
      duration: "Not applicable",
      severity: "Mild — manageable",
    },
    symptoms: ["None reported"],
    conditions: ["None"],
    allergies: ["None known"],
    medication: ["None"],
    vitals: {
      temperature: "36.6°C",
      bloodPressure: "120/78 mmHg",
      heartRate: "72 bpm",
      oxygenSaturation: "99%",
    },
    history: ["Annual wellness check-up, previously completed last year"],
  },
];

export function getPatientById(
  patients: ConsultationPatient[],
  id: string
): ConsultationPatient | undefined {
  return patients.find((patient) => patient.id === id);
}
