import {
  buildExtractionSystemPrompt,
  parseExtractedIntake,
  MAX_PATIENT_TEXT_LENGTH,
  type ExtractedIntake,
} from "@/lib/nl-intake";

/**
 * Server-only route (Issue #6). Reads HF_TOKEN from process.env, which is
 * never bundled to the client — only code that runs inside this file, on
 * the server, ever sees it. Calls Hugging Face Inference Providers'
 * OpenAI-compatible chat completions endpoint for
 * Qwen/Qwen3-4B-Instruct-2507 via plain fetch (no SDK).
 *
 * This route is an information-extraction convenience only. It never calls
 * src/lib/safety.ts and never decides Emergency/Priority/Routine — it
 * returns pre-fill suggestions for the existing intake wizard, which the
 * patient reviews/corrects before the existing, unmodified safety check
 * runs client-side.
 */

const HF_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
const MODEL = "Qwen/Qwen3-4B-Instruct-2507";
const REQUEST_TIMEOUT_MS = 15000;

type ExtractSuccess = { ok: true; data: ExtractedIntake };
type ExtractFailure = {
  ok: false;
  reason: "missing_token" | "invalid_input" | "unavailable";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Defensively reads the model's reply text out of the HF response body.
 * Treats the whole response as untrusted/unpredictable shape, not just its
 * message content — a missing or malformed field here is a failure, never
 * something to guess around.
 */
function extractMessageContent(payload: unknown): unknown {
  if (!isRecord(payload)) return undefined;
  const choices = payload.choices;
  if (!Array.isArray(choices) || choices.length === 0) return undefined;
  const first = choices[0];
  if (!isRecord(first)) return undefined;
  const message = first.message;
  if (!isRecord(message)) return undefined;
  return message.content;
}

export async function POST(request: Request) {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return Response.json(
      { ok: false, reason: "missing_token" } satisfies ExtractFailure,
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, reason: "invalid_input" } satisfies ExtractFailure,
      { status: 400 }
    );
  }

  const text = isRecord(body) ? body.text : undefined;
  if (typeof text !== "string" || text.trim().length === 0) {
    return Response.json(
      { ok: false, reason: "invalid_input" } satisfies ExtractFailure,
      { status: 400 }
    );
  }

  const patientText = text.trim().slice(0, MAX_PATIENT_TEXT_LENGTH);

  try {
    const hfResponse = await fetch(HF_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildExtractionSystemPrompt() },
          { role: "user", content: patientText },
        ],
        temperature: 0.1,
        max_tokens: 400,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!hfResponse.ok) {
      return Response.json(
        { ok: false, reason: "unavailable" } satisfies ExtractFailure,
        { status: 502 }
      );
    }

    const payload: unknown = await hfResponse.json();
    const content = extractMessageContent(payload);

    if (typeof content !== "string") {
      return Response.json(
        { ok: false, reason: "unavailable" } satisfies ExtractFailure,
        { status: 502 }
      );
    }

    const data = parseExtractedIntake(content);
    if (data === null) {
      // The model's reply contained no parseable JSON object (e.g. plain
      // prose like "I cannot determine this.", or an empty response). This
      // is an AI processing failure, not a valid-but-empty extraction — it
      // must never be reported as ok:true.
      return Response.json(
        { ok: false, reason: "unavailable" } satisfies ExtractFailure,
        { status: 502 }
      );
    }

    return Response.json({ ok: true, data } satisfies ExtractSuccess);
  } catch {
    // Network error, timeout/abort, or unexpected JSON parse failure. Never
    // fabricate a success response — the client falls back to the manual
    // intake wizard.
    return Response.json(
      { ok: false, reason: "unavailable" } satisfies ExtractFailure,
      { status: 502 }
    );
  }
}
