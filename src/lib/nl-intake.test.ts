import { test } from "node:test";
import assert from "node:assert/strict";
import {
  extractJsonObject,
  validateExtractedIntake,
  parseExtractedIntake,
  mapExtractedIntakeToAnswers,
  EMPTY_EXTRACTED_INTAKE,
} from "./nl-intake.ts";

// --- validateExtractedIntake: treats its input as untrusted external data ---

test("valid structured JSON is kept field-by-field", () => {
  const result = validateExtractedIntake({
    concernId: "cough-cold",
    durationId: "few-days",
    severityId: "mild",
    symptomIds: ["fever", "headache"],
    conditionIds: [],
    medicationIds: [],
    emergencyIds: [],
  });
  assert.deepEqual(result, {
    concernId: "cough-cold",
    durationId: "few-days",
    severityId: "mild",
    symptomIds: ["fever", "headache"],
    conditionIds: [],
    medicationIds: [],
    emergencyIds: [],
  });
});

test("non-object input to validateExtractedIntake produces the empty default, not a guess", () => {
  assert.deepEqual(validateExtractedIntake(undefined), EMPTY_EXTRACTED_INTAKE);
  assert.deepEqual(validateExtractedIntake(null), EMPTY_EXTRACTED_INTAKE);
  assert.deepEqual(validateExtractedIntake("a plain string"), EMPTY_EXTRACTED_INTAKE);
  assert.deepEqual(validateExtractedIntake(42), EMPTY_EXTRACTED_INTAKE);
  assert.deepEqual(validateExtractedIntake(["array", "not", "object"]), EMPTY_EXTRACTED_INTAKE);
});

test("missing fields on a valid object default to the empty shape, not a fallback answer", () => {
  assert.deepEqual(validateExtractedIntake({}), EMPTY_EXTRACTED_INTAKE);
});

test("extra/unexpected fields are ignored rather than surfaced", () => {
  const result = validateExtractedIntake({
    concernId: "skin",
    diagnosis: "likely eczema",
    prescription: "hydrocortisone",
    extraNestedField: { unexpected: true },
  });
  assert.equal(result.concernId, "skin");
  assert.deepEqual(Object.keys(result).sort(), [
    "concernId",
    "conditionIds",
    "durationId",
    "emergencyIds",
    "medicationIds",
    "severityId",
    "symptomIds",
  ]);
  assert.equal((result as Record<string, unknown>).diagnosis, undefined);
  assert.equal((result as Record<string, unknown>).prescription, undefined);
});

test("invalid / unrecognized ids are dropped, not repaired by guessing", () => {
  const result = validateExtractedIntake({
    concernId: "made-up-concern",
    durationId: "yesterday", // not a real DURATION_OPTIONS id
    severityId: "extreme", // not a real SEVERITY_OPTIONS id
    symptomIds: ["fever", "not-a-real-symptom"],
  });
  assert.equal(result.concernId, null);
  assert.equal(result.durationId, null);
  assert.equal(result.severityId, null);
  assert.deepEqual(result.symptomIds, ["fever"]);
});

test("wrong data types are dropped rather than coerced", () => {
  const result = validateExtractedIntake({
    concernId: 123,
    durationId: true,
    severityId: { nested: "object" },
    symptomIds: "fever", // string instead of array
    conditionIds: { 0: "diabetes" }, // object instead of array
    medicationIds: null,
    emergencyIds: [1, 2, 3], // array of numbers instead of strings
  });
  assert.deepEqual(result, EMPTY_EXTRACTED_INTAKE);
});

test("explicit null scalar fields are accepted and stay null", () => {
  const result = validateExtractedIntake({
    concernId: null,
    durationId: null,
    severityId: null,
    symptomIds: [],
    conditionIds: [],
    medicationIds: [],
    emergencyIds: [],
  });
  assert.deepEqual(result, EMPTY_EXTRACTED_INTAKE);
});

test("duplicate ids in an array are de-duplicated", () => {
  const result = validateExtractedIntake({
    symptomIds: ["fever", "fever", "headache", "fever"],
  });
  assert.deepEqual(result.symptomIds, ["fever", "headache"]);
});

test("the 'none' sentinel id is never accepted in any array field", () => {
  const result = validateExtractedIntake({
    symptomIds: ["none", "fever"],
    conditionIds: ["none"],
    medicationIds: ["none"],
    emergencyIds: ["none", "chest-pain"],
  });
  assert.deepEqual(result.symptomIds, ["fever"]);
  assert.deepEqual(result.conditionIds, []);
  assert.deepEqual(result.medicationIds, []);
  assert.deepEqual(result.emergencyIds, ["chest-pain"]);
});

// --- parseExtractedIntake: the success/failure boundary ---
//
// A *successful* extraction is any parseable JSON object, even one with
// every field null/empty (that correctly represents an under-specified
// description). A *failed* extraction is anything where no JSON object
// could be found at all — that must surface as `null`, never as a
// successful-looking empty result.

test("a valid JSON object with all fields missing is a successful, fully-uncertain extraction — not a failure", () => {
  const result = parseExtractedIntake("{}");
  assert.notEqual(result, null, "an empty JSON object is a valid extraction, not a failure");
  assert.deepEqual(result, EMPTY_EXTRACTED_INTAKE);
});

test("a valid JSON object with some fields present and others missing is a successful partial extraction", () => {
  const content = JSON.stringify({
    concernId: "stomach",
    durationId: null,
    severityId: null,
    symptomIds: ["nausea"],
    conditionIds: [],
    medicationIds: [],
    emergencyIds: [],
  });

  const result = parseExtractedIntake(content);
  assert.notEqual(result, null, "a partially-filled valid object is a success, not a failure");
  assert.deepEqual(result, {
    concernId: "stomach",
    durationId: null,
    severityId: null,
    symptomIds: ["nausea"],
    conditionIds: [],
    medicationIds: [],
    emergencyIds: [],
  });
});

test("unparseable model output is an extraction FAILURE, not a successful empty extraction", () => {
  // The exact example from the spec: prose with no JSON object at all.
  assert.equal(
    parseExtractedIntake("I cannot determine this."),
    null,
    "prose with no JSON must fail, not silently become an empty success"
  );

  assert.equal(parseExtractedIntake("not json at all {{{"), null);
  assert.equal(parseExtractedIntake(""), null, "an empty response is a failure");
  assert.equal(parseExtractedIntake("   "), null, "a whitespace-only response is a failure");
  assert.equal(parseExtractedIntake("null"), null, "a bare JSON null is not an object");
  assert.equal(parseExtractedIntake("[1, 2, 3]"), null, "a JSON array is not an object");
  assert.equal(
    parseExtractedIntake('"just a string"'),
    null,
    "a bare JSON string is not an object"
  );
});

test("model responses with explanatory prose around the JSON are still parsed as a success", () => {
  const content = [
    "Sure! Here's the extracted information:",
    "```json",
    JSON.stringify({ concernId: "skin", symptomIds: ["fever"] }),
    "```",
    "Let me know if you need anything else.",
  ].join("\n");
  const result = parseExtractedIntake(content);
  assert.notEqual(result, null);
  assert.equal(result?.concernId, "skin");
  assert.deepEqual(result?.symptomIds, ["fever"]);
});

test("prose with an inline JSON object (no code fence) is still parsed as a success", () => {
  const content = `Here you go: ${JSON.stringify({ durationId: "today" })} hope that helps.`;
  const result = parseExtractedIntake(content);
  assert.notEqual(result, null);
  assert.equal(result?.durationId, "today");
});

test("extractJsonObject returns null for content with no JSON object at all", () => {
  assert.equal(extractJsonObject("I cannot help with that request."), null);
  assert.equal(extractJsonObject("null"), null);
  assert.equal(extractJsonObject("[1, 2, 3]"), null);
});

// --- The required safety-specific test ---

test("an empty emergencyIds array stays empty and is NEVER converted to the wizard's 'none' option", () => {
  // Simulates a patient description that mentions nothing about emergency
  // warning signs at all, e.g. "I've had a headache." — a valid, successful
  // extraction whose emergencyIds field is legitimately empty.
  const content = JSON.stringify({
    concernId: null,
    durationId: null,
    severityId: null,
    symptomIds: ["headache"],
    conditionIds: [],
    medicationIds: [],
    emergencyIds: [],
  });

  const extracted = parseExtractedIntake(content);
  assert.notEqual(
    extracted,
    null,
    "this is a successful extraction, not a failure — must not be confused with the failure path"
  );
  assert.deepEqual(
    extracted?.emergencyIds,
    [],
    "empty emergencyIds means 'not explicitly reported', not 'confirmed none'"
  );

  const mapped = mapExtractedIntakeToAnswers(extracted!);
  assert.deepEqual(
    mapped.emergency,
    [],
    "the wizard's emergency step must be pre-filled empty, not with ['none']"
  );
  assert.ok(
    !mapped.emergency.includes("none"),
    "'none' must never appear in the pre-filled emergency answer"
  );
  // The empty pre-fill leaves the wizard's emergency step unanswered
  // (`canContinue = currentSelection.length > 0` in page.tsx), so the
  // patient is still required to explicitly answer it themselves before
  // assessSafety() ever runs.
});

test("an explicitly mentioned emergency sign is still captured, not suppressed", () => {
  const content = JSON.stringify({ emergencyIds: ["chest-pain"] });
  const extracted = parseExtractedIntake(content);
  assert.notEqual(extracted, null);
  assert.deepEqual(extracted?.emergencyIds, ["chest-pain"]);

  const mapped = mapExtractedIntakeToAnswers(extracted!);
  assert.deepEqual(mapped.emergency, ["chest-pain"]);
});

test("mapExtractedIntakeToAnswers strips 'none' from every multi-select field even if fed unclean data directly, bypassing the validator", () => {
  // Regression guard: this proves the invariant at the exact site the
  // wizard's pre-fill is decided, not only transitively via
  // validateExtractedIntake's id vocabulary already excluding "none".
  const uncleanExtracted = {
    concernId: null,
    durationId: null,
    severityId: null,
    symptomIds: ["none", "fever"],
    conditionIds: ["none"],
    medicationIds: ["none"],
    emergencyIds: ["none"],
  };

  const mapped = mapExtractedIntakeToAnswers(uncleanExtracted);
  assert.deepEqual(mapped.symptoms, ["fever"]);
  assert.deepEqual(mapped.conditions, []);
  assert.deepEqual(mapped.medication, []);
  assert.deepEqual(
    mapped.emergency,
    [],
    "'none' must never survive into the emergency pre-fill, however it got there"
  );
});

// --- mapExtractedIntakeToAnswers: null scalars must not become defaults ---

test("null scalar fields map to an empty selection, not a default answer", () => {
  const mapped = mapExtractedIntakeToAnswers(EMPTY_EXTRACTED_INTAKE);
  assert.deepEqual(mapped, {
    concern: [],
    duration: [],
    severity: [],
    symptoms: [],
    conditions: [],
    medication: [],
    emergency: [],
  });
});
