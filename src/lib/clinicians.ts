export type ConsultationPrices = {
  chat: number;
  voice: number;
  video: number;
};

export type Availability = {
  status: "available" | "next";
  label: string;
};

export type Clinician = {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  registrationNumber: string;
  affiliation: string;
  city: string;
  languages: string[];
  yearsExperience: number;
  rating: number;
  bio: string;
  conditionsTreated: string[];
  availability: Availability;
  prices: ConsultationPrices;
  photo?: string;
};

export const CLINICIANS: Clinician[] = [
  {
    id: "amina-wanjiru",
    name: "Dr. Amina Wanjiru",
    credentials: "MBChB, MMed (Family Medicine)",
    specialty: "General Practitioner",
    registrationNumber: "KMPDC/A12345",
    affiliation: "Sunrise Family Clinic",
    city: "Nairobi",
    languages: ["English", "Kiswahili"],
    yearsExperience: 8,
    rating: 4.8,
    bio: "Dr. Amina has spent eight years helping patients navigate everyday health concerns, from infections to chronic condition management.",
    conditionsTreated: [
      "Colds and flu",
      "Skin infections",
      "Hypertension follow-up",
      "General check-ups",
    ],
    availability: { status: "available", label: "Available now" },
    prices: { chat: 500, voice: 650, video: 800 },
    photo: "/images/dr-amina-wanjiru.jpeg",
  },
  {
    id: "brian-otieno",
    name: "Dr. Brian Otieno",
    credentials: "MBChB",
    specialty: "General Practitioner",
    registrationNumber: "KMPDC/B22981",
    affiliation: "Coast General Clinic",
    city: "Mombasa",
    languages: ["English", "Kiswahili"],
    yearsExperience: 6,
    rating: 4.6,
    bio: "Dr. Brian focuses on accessible primary care for working adults and families along the coast.",
    conditionsTreated: ["Fever", "Digestive issues", "Minor injuries", "Referrals"],
    availability: { status: "next", label: "Next appointment: Today, 2:30 PM" },
    prices: { chat: 450, voice: 600, video: 750 },
  },
  {
    id: "faith-chebet",
    name: "Dr. Faith Chebet",
    credentials: "MBChB, Dip. Family Medicine",
    specialty: "General Practitioner",
    registrationNumber: "KMPDC/F30456",
    affiliation: "Rift Valley Health Point",
    city: "Eldoret",
    languages: ["English", "Kiswahili", "Kalenjin"],
    yearsExperience: 10,
    rating: 4.9,
    bio: "Dr. Faith brings a decade of experience in community-focused primary care across the Rift Valley region.",
    conditionsTreated: ["General illness", "Chronic disease monitoring", "Wellness checks"],
    availability: { status: "available", label: "Available now" },
    prices: { chat: 550, voice: 700, video: 850 },
  },
  {
    id: "grace-mwikali",
    name: "Dr. Grace Mwikali",
    credentials: "MBChB, MMed (Dermatology)",
    specialty: "Dermatologist",
    registrationNumber: "KMPDC/G40233",
    affiliation: "Lavington Skin & Wellness",
    city: "Nairobi",
    languages: ["English", "Kiswahili"],
    yearsExperience: 9,
    rating: 4.9,
    bio: "Dr. Grace specialises in diagnosing and managing skin, hair and nail conditions for patients of all ages.",
    conditionsTreated: ["Acne", "Eczema", "Skin rashes", "Hair loss"],
    availability: { status: "available", label: "Available now" },
    prices: { chat: 600, voice: 750, video: 950 },
  },
  {
    id: "kevin-mutua",
    name: "Dr. Kevin Mutua",
    credentials: "MBChB, MMed (Paediatrics)",
    specialty: "Paediatrician",
    registrationNumber: "KMPDC/K51789",
    affiliation: "Lakeview Children's Clinic",
    city: "Kisumu",
    languages: ["English", "Kiswahili"],
    yearsExperience: 7,
    rating: 4.7,
    bio: "Dr. Kevin cares for infants, children and teenagers, with a focus on calm, family-friendly consultations.",
    conditionsTreated: [
      "Childhood fevers",
      "Vaccination guidance",
      "Growth concerns",
      "Common infections",
    ],
    availability: { status: "next", label: "Next appointment: Tomorrow, 9:00 AM" },
    prices: { chat: 500, voice: 700, video: 900 },
  },
  {
    id: "naomi-achieng",
    name: "Dr. Naomi Achieng",
    credentials: "MBChB, MMed (Obstetrics & Gynaecology)",
    specialty: "Gynaecologist",
    registrationNumber: "KMPDC/N60912",
    affiliation: "Wellwoman Clinic",
    city: "Nairobi",
    languages: ["English", "Kiswahili"],
    yearsExperience: 11,
    rating: 4.8,
    bio: "Dr. Naomi supports women through reproductive health, prenatal guidance and routine gynaecological care.",
    conditionsTreated: ["Reproductive health", "Prenatal check-ins", "Menstrual concerns"],
    availability: { status: "available", label: "Available now" },
    prices: { chat: 650, voice: 800, video: 1000 },
  },
  {
    id: "peter-kamau",
    name: "Peter Kamau",
    credentials: "MSc Clinical Psychology",
    specialty: "Mental Health Counsellor",
    registrationNumber: "KMPDC/P70654",
    affiliation: "Mindcare Kenya",
    city: "Nakuru",
    languages: ["English", "Kiswahili"],
    yearsExperience: 5,
    rating: 4.7,
    bio: "Peter offers confidential, judgement-free support for stress, anxiety and everyday mental wellbeing.",
    conditionsTreated: ["Anxiety", "Stress management", "Low mood", "Sleep difficulties"],
    availability: { status: "available", label: "Available now" },
    prices: { chat: 500, voice: 650, video: 850 },
  },
  {
    id: "sarah-njeri",
    name: "Dr. Sarah Njeri",
    credentials: "BDS",
    specialty: "Dentist",
    registrationNumber: "KMPDC/S80321",
    affiliation: "Bright Smile Dental",
    city: "Nairobi",
    languages: ["English", "Kiswahili"],
    yearsExperience: 8,
    rating: 4.6,
    bio: "Dr. Sarah provides guidance on dental pain, oral hygiene and when in-person dental care is needed.",
    conditionsTreated: ["Tooth pain", "Gum sensitivity", "Oral hygiene guidance"],
    availability: { status: "next", label: "Next appointment: Today, 4:00 PM" },
    prices: { chat: 450, voice: 600, video: 800 },
  },
];

export function getClinicianById(id: string): Clinician | undefined {
  return CLINICIANS.find((clinician) => clinician.id === id);
}

export function getInitials(name: string): string {
  const clean = name.replace(/^Dr\.\s*/i, "");
  const parts = clean.split(" ").filter(Boolean);
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "AN";
}
