import { test } from "node:test";
import assert from "node:assert/strict";
import { assessSafety } from "./safety.ts";

function baseInput(overrides: Partial<Parameters<typeof assessSafety>[0]> = {}) {
  return {
    who: "myself",
    concernId: "cough-cold",
    durationId: "few-days",
    severityId: "mild",
    emergencyIds: ["none"],
    ...overrides,
  };
}

test("any emergency warning sign produces Emergency, regardless of severity", () => {
  for (const emergencyId of ["chest-pain", "breathing", "bleeding", "consciousness"]) {
    const result = assessSafety(baseInput({ emergencyIds: [emergencyId], severityId: "mild" }));
    assert.equal(result.level, "Emergency");
  }
});

test("selecting 'none' alongside a real warning sign still produces Emergency", () => {
  const result = assessSafety(baseInput({ emergencyIds: ["none", "chest-pain"] }));
  assert.equal(result.level, "Emergency");
});

test("no warning signs and severe severity produces Priority", () => {
  const result = assessSafety(baseInput({ emergencyIds: ["none"], severityId: "severe" }));
  assert.equal(result.level, "Priority");
});

test("moderate severity starting today produces Priority", () => {
  const result = assessSafety(
    baseInput({ emergencyIds: ["none"], severityId: "moderate", durationId: "today" })
  );
  assert.equal(result.level, "Priority");
});

test("moderate severity present for a week is Routine, not Priority", () => {
  const result = assessSafety(
    baseInput({ emergencyIds: ["none"], severityId: "moderate", durationId: "week-plus" })
  );
  assert.equal(result.level, "Routine");
});

test("mild severity is always Routine regardless of duration", () => {
  for (const durationId of ["today", "few-days", "week-plus"]) {
    const result = assessSafety(baseInput({ emergencyIds: ["none"], severityId: "mild", durationId }));
    assert.equal(result.level, "Routine");
  }
});

test("severe severity outranks a longer duration and stays Priority", () => {
  const result = assessSafety(
    baseInput({ emergencyIds: ["none"], severityId: "severe", durationId: "week-plus" })
  );
  assert.equal(result.level, "Priority");
});

test("emergency takes priority even when severity alone would only justify Priority/Routine", () => {
  const result = assessSafety(
    baseInput({ emergencyIds: ["breathing"], severityId: "mild", durationId: "week-plus" })
  );
  assert.equal(result.level, "Emergency");
});

test("no diagnosis-style language appears in any tier's copy", () => {
  const forbidden = [/you have/i, /this means you/i, /you likely have/i];
  const levels = [
    baseInput({ emergencyIds: ["chest-pain"] }),
    baseInput({ emergencyIds: ["none"], severityId: "severe" }),
    baseInput({ emergencyIds: ["none"], severityId: "mild" }),
  ];
  for (const input of levels) {
    const result = assessSafety(input);
    const text = `${result.headline} ${result.message}`;
    for (const pattern of forbidden) {
      assert.equal(pattern.test(text), false, `"${pattern}" matched: ${text}`);
    }
  }
});
