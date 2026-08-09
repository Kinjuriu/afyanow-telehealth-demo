# AfyaNow

A hackathon prototype for a Kenyan telehealth platform that helps patients
describe a health concern and get matched with an appropriate, verified
clinician.

## Product overview

AfyaNow lets a patient describe what's wrong in plain language, get a
suggested type of care (e.g. General Practitioner, Dermatologist), browse
verified clinicians who match that need, and book a chat, voice, or video
consultation. A parallel clinician workspace lets a demo clinician manage
availability, run a mock consultation, and document clinical notes.

## Care-navigation pipeline

AfyaNow's patient flow is a one-way pipeline:

Patient input → structured information → safety/urgency screening →
care-navigation recommendation → clinician matching → clinician
consultation

Structured intake answers first pass through a conservative, rule-based
safety/urgency check (emergency / priority / routine). Only non-emergency
cases reach the care-navigation step, which recommends a starting point —
General Practitioner by default, a specialist only where the concern is
clearly specialist-specific, a paediatrician where appropriate for a
child. **AfyaNow does not diagnose.** The recommendation narrows down
where to start; the clinician who accepts the consultation is responsible
for the actual clinical assessment, diagnosis, and treatment.

## Main demo journey

**Patient side** (`/patient/intake` → `/patient/recommendation` →
`/patient/clinicians` → `/patient/clinicians/[id]` → `/patient/booking`):
1. Answer a short conversational intake (who needs care, main concern,
   duration, severity, symptoms, conditions, medication/allergies, and an
   emergency-warning-sign check that stops the flow if triggered).
2. Get a fictional care-type recommendation with urgency and an alternative
   option.
3. Browse and filter matching clinicians, view a full profile, and pick a
   chat/voice/video consultation with a mock booking confirmation.

**Clinician side** (`/clinician` → `/clinician/consultation` →
`/clinician/availability` / `/clinician/profile`):
1. View a dashboard with availability status, quick metrics, a waiting
   queue, and today's schedule.
2. Open a mock consultation workspace with a video-call placeholder, call
   timer, tabs (Overview / Chat / Notes / Documents), and clinical actions
   (notes, assessment, prescription, referral, follow-up, care
   instructions) that can be saved as a draft or used to complete the
   consultation.
3. Configure demo availability, working hours, and consultation pricing.

Use the "Clinician demo" / "Patient demo" link in the header to switch
between the two sides, or "Exit demo" to return to the landing page.

## Technology used

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS 4
- No external UI, state, or data-fetching libraries — all mock data lives in
  local TypeScript files (`src/lib/`) and demo state is plain React
  `useState`/Context

## How to run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Also available:

```bash
npm run lint    # ESLint
npm run build   # production build
```

## Current limitations

This is a hackathon prototype, not a production system:

- No authentication, registration, or user accounts
- No real database — all patient, clinician, and consultation data is
  in-memory mock data that resets on page reload
- No real payments, video calling, or AI/LLM integration
- No admin tools or clinician onboarding flow
- Clinician photos and profiles are illustrative demo content

**All medical and clinician data — names, qualifications, registration
numbers, affiliations, ratings, patient cases, and vitals — is fictional
demonstration data and does not represent real people, institutions, or
medical records.**

**The intake → safety/urgency screening → care-navigation recommendation
pipeline is simple rule-based demo logic (a conservative emergency /
priority / routine check, followed by a concern → specialty lookup with a
few overrides), not a clinical decision-support tool. It has not been
clinically validated and must not be used for real medical triage or
diagnosis.**
