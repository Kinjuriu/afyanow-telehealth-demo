# AfyaNow

A hackathon prototype for a Kenyan telehealth platform that helps patients
describe a health concern and get matched with an appropriate, verified
clinician.

<img width="1280" height="744" alt="Screenshot 2026-08-12 at 18 06 19" src="https://github.com/user-attachments/assets/e5c996f1-5cbe-49f7-a97b-f26836be5f76" />

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

Defaulting to a General Practitioner in ambiguous cases is a deliberate,
conservative product and safety design choice for this prototype — not a
claim that GP-first routing is the universally correct clinical pathway
for every concern.

### Optional AI-assisted intake (Issue #6)

Patients can optionally start intake by describing their concern in free
text instead of clicking through every step manually. That text is sent to
a hosted open-weight model (`Qwen/Qwen3-4B-Instruct-2507`, via [Hugging
Face Inference Providers](https://huggingface.co/docs/inference-providers))
from a server-side route (`src/app/api/intake/extract`), which returns
suggested answers using the *same* fixed id vocabulary as the manual
wizard. The patient reviews and can correct every suggested answer by
walking through the existing step-by-step intake before continuing — the
model never skips or auto-submits a step.

This is an **information-extraction convenience layer only**:

- It is research-informed by triage literature (WHO/ICRC/MSF Interagency
  Integrated Triage Tool, the Emergency Medicine Kenya Foundation triage
  handbook) as design context, but AfyaNow does **not** claim to implement
  either, and no clinical scoring rules from either source are encoded in
  the prompt or in application logic.
- It never calls, modifies, or bypasses `src/lib/safety.ts`, which remains
  the sole, unmodified, deterministic safety/urgency authority, and runs
  on the patient's final, reviewed answers — not on the model's raw
  suggestion. The model cannot produce an Emergency/Priority/Routine
  result itself.
- The server-side response is validated against a fixed, known id
  vocabulary; anything unrecognized, malformed, wrongly typed, or outside
  that vocabulary is dropped, not guessed or repaired. A field the model
  didn't extract stays empty/null rather than defaulting to an answer, and
  an empty result for emergency warning signs means "not mentioned in the
  text," never "confirmed absent" — the patient still has to explicitly
  answer that question themselves.
- If the request fails, times out, or no token is configured, the intake
  page falls back to the same fully manual flow with no AI involved — it
  never fabricates a response.

Requires an `HF_TOKEN` environment variable server-side (see
`.env.local.example`). Without it, the manual step-by-step intake works
exactly as before.

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
- [Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers)
  (`Qwen/Qwen3-4B-Instruct-2507`) for the optional natural-language intake
  extraction — called server-side with plain `fetch`, no SDK

## How to run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app works fully
without any environment variables. To also try the optional AI-assisted
intake, copy `.env.local.example` to `.env.local` and set `HF_TOKEN` to a
Hugging Face token with "Make calls to Inference Providers" permission.

Also available:

```bash
npm run lint    # ESLint
npm run build   # production build
```

## Current limitations

This is a hackathon prototype, not a production system:

- No authentication, registration, or user accounts
- No real database — all patient, clinician, and consultation data is
  in-memory mock data that resets on page reload
- No real payments or video calling
- The optional AI-assisted intake is an information-extraction convenience
  only (see "Optional AI-assisted intake" above) — research-informed, not
  clinically validated, and never the safety authority
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

**Before any real-world deployment, this routing and safety logic —
including the GP-first default above — would need to be reviewed and
validated by practising clinicians, with the underlying rules evaluated
against appropriate clinical guidance for the intended Kenyan/Nairobi
care context. Materials such as the WHO/ICRC/MSF Interagency Integrated
Triage Tool and the Emergency Medicine Kenya Foundation triage handbook
may inform that future validation work; neither this prototype's
rule-based logic nor its optional AI-assisted intake has been validated
against those or any other clinical triage framework, and no such
validation is claimed here.**
