import { test } from "node:test";
import assert from "node:assert/strict";
import { parseMatchingParams, prioritizeClinicians } from "./clinician-matching.ts";

const KNOWN_SPECIALTIES = ["General Practitioner", "Dermatologist", "Dentist", "Paediatrician"];

function baseParams(overrides: Partial<Parameters<typeof parseMatchingParams>[0]> = {}) {
  return {
    specialty: "General Practitioner",
    who: "myself",
    urgency: "Routine",
    knownSpecialties: KNOWN_SPECIALTIES,
    ...overrides,
  };
}

test("specialty is preserved when it matches a known specialty", () => {
  const result = parseMatchingParams(baseParams({ specialty: "Dermatologist" }));
  assert.equal(result.specialty, "Dermatologist");
});

test("specialty falls back to 'all' when unrecognized or missing", () => {
  assert.equal(parseMatchingParams(baseParams({ specialty: "Neurosurgeon" })).specialty, "all");
  assert.equal(parseMatchingParams(baseParams({ specialty: null })).specialty, "all");
  assert.equal(parseMatchingParams(baseParams({ specialty: "" })).specialty, "all");
});

test("who is preserved for each valid intake option", () => {
  for (const who of ["myself", "child", "someone-else"]) {
    assert.equal(parseMatchingParams(baseParams({ who })).who, who);
  }
});

test("who falls back to 'myself' when unrecognized or missing", () => {
  assert.equal(parseMatchingParams(baseParams({ who: "the-dog" })).who, "myself");
  assert.equal(parseMatchingParams(baseParams({ who: null })).who, "myself");
  assert.equal(parseMatchingParams(baseParams({ who: "" })).who, "myself");
});

test("urgency is preserved as Priority only for an exact 'Priority' value", () => {
  assert.equal(parseMatchingParams(baseParams({ urgency: "Priority" })).urgency, "Priority");
});

test("urgency falls back to Routine for Routine, missing, or garbage values", () => {
  assert.equal(parseMatchingParams(baseParams({ urgency: "Routine" })).urgency, "Routine");
  assert.equal(parseMatchingParams(baseParams({ urgency: null })).urgency, "Routine");
  assert.equal(parseMatchingParams(baseParams({ urgency: "priority" })).urgency, "Routine");
  assert.equal(parseMatchingParams(baseParams({ urgency: "urgent-please" })).urgency, "Routine");
});

test("Emergency is not treated as a normal matching case — it is folded into Routine, not prioritized", () => {
  const result = parseMatchingParams(baseParams({ urgency: "Emergency" }));
  assert.equal(result.urgency, "Routine");
});

function clinician(id: string, status: "available" | "next") {
  return { id, availability: { status } };
}

test("Routine returns the exact same array reference (no unnecessary reordering)", () => {
  const clinicians = [clinician("a", "next"), clinician("b", "available")];
  const result = prioritizeClinicians(clinicians, "Routine");
  assert.equal(result, clinicians);
});

test("Priority surfaces available clinicians before 'next' clinicians", () => {
  const clinicians = [
    clinician("a", "next"),
    clinician("b", "available"),
    clinician("c", "next"),
    clinician("d", "available"),
  ];
  const result = prioritizeClinicians(clinicians, "Priority");
  assert.deepEqual(
    result.map((c) => c.id),
    ["b", "d", "a", "c"]
  );
});

test("Priority ordering is stable within each availability group", () => {
  const clinicians = [
    clinician("first-available", "available"),
    clinician("first-next", "next"),
    clinician("second-available", "available"),
    clinician("second-next", "next"),
  ];
  const result = prioritizeClinicians(clinicians, "Priority");
  assert.deepEqual(
    result.map((c) => c.id),
    ["first-available", "second-available", "first-next", "second-next"]
  );
});

test("Priority with an all-available list does not change order", () => {
  const clinicians = [clinician("a", "available"), clinician("b", "available")];
  const result = prioritizeClinicians(clinicians, "Priority");
  assert.deepEqual(
    result.map((c) => c.id),
    ["a", "b"]
  );
});

test("prioritizeClinicians never drops or duplicates clinicians", () => {
  const clinicians = [
    clinician("a", "next"),
    clinician("b", "available"),
    clinician("c", "next"),
  ];
  for (const urgency of ["Routine", "Priority"] as const) {
    const result = prioritizeClinicians(clinicians, urgency);
    assert.equal(result.length, clinicians.length);
    assert.deepEqual(
      [...result.map((c) => c.id)].sort(),
      [...clinicians.map((c) => c.id)].sort()
    );
  }
});
