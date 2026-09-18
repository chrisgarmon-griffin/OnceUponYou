export function getApiKey() {
  return process.env.XAI_API_KEY || "";
}

export async function chatJson(system: string, user: string, maxTokens = 4000) {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false as const, error: "unavailable" as const };

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.85,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) {
    return { ok: false as const, error: `story ${res.status}` };
  }
  const body = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const text = body.choices[0]?.message.content ?? "";
  return { ok: true as const, text };
}

export async function imagineImage(prompt: string, referenceUrl?: string) {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false as const, error: "unavailable" as const };

  const endpoint = referenceUrl
    ? "https://api.x.ai/v1/images/edits"
    : "https://api.x.ai/v1/images/generations";

  const payload = referenceUrl
    ? {
        model: "grok-imagine-image-2.0",
        prompt,
        image: { url: referenceUrl, type: "image_url" },
      }
    : {
        model: "grok-imagine-image-2.0",
        prompt,
        n: 1,
      };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    return { ok: false as const, error: `art ${res.status}: ${detail.slice(0, 180)}` };
  }
  const body = (await res.json()) as {
    data?: { url?: string; b64_json?: string }[];
    url?: string;
  };
  const url = body.data?.[0]?.url || body.url;
  const b64 = body.data?.[0]?.b64_json;
  if (url) return { ok: true as const, url };
  if (b64) return { ok: true as const, url: `data:image/jpeg;base64,${b64}` };
  return { ok: false as const, error: "no image returned" };
}

export async function speak(text: string) {
  const apiKey = getApiKey();
  if (!apiKey) return { ok: false as const, error: "unavailable" as const };

  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ text, voice_id: "eve" }),
  });
  if (!res.ok) return { ok: false as const, error: `voice ${res.status}` };
  const buf = Buffer.from(await res.arrayBuffer());
  return { ok: true as const, audio: `data:audio/mpeg;base64,${buf.toString("base64")}` };
}
