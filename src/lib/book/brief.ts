import { bandForAge, occasionById, PRONOUNS, styleById, themeById } from "./config";
import { templateById } from "./templates";
import type { Brief, PronounKey } from "./types";

export type BriefInput = {
  name: string;
  age: number | string;
  pronouns: PronounKey | string;
  interests: string | string[];
  companionName?: string;
  companionKind?: string;
  companionLook?: string;
  hair?: string;
  skin?: string;
  eyes?: string;
  glasses?: boolean;
  item?: string;
  other?: string;
  hometown?: string;
  occasion?: string;
  theme?: string;
  style?: string;
  dedication?: string;
  fromName?: string;
  readerNotes?: string;
  templateId?: string;
};

function toList(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value.map((s) => s.trim()).filter(Boolean);
  return String(value || "")
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function clip(value: unknown, max: number) {
  return value == null ? "" : String(value).trim().slice(0, max);
}

export function normalizeBrief(input: BriefInput): { brief: Brief | null; errors: string[] } {
  const errors: string[] = [];
  const name = clip(input.name, 30);
  if (!name) errors.push("A name is required.");

  const age = Number(input.age);
  if (!Number.isFinite(age) || age < 1 || age > 12) errors.push("Age should be between 1 and 12.");

  const pronounKey: PronounKey = ["she", "he", "they"].includes(String(input.pronouns))
    ? (input.pronouns as PronounKey)
    : "they";

  const interests = toList(input.interests).slice(0, 3);
  if (interests.length === 0) {
    errors.push("Tell us one thing they love. That is what makes the book theirs.");
  }

  const companion = clip(input.companionName, 30)
    ? {
        name: clip(input.companionName, 30),
        kind: clip(input.companionKind, 40) || "friend",
        look: clip(input.companionLook, 140),
      }
    : clip(input.companionKind, 40)
      ? {
          name: clip(input.companionKind, 30),
          kind: clip(input.companionKind, 40),
          look: clip(input.companionLook, 140),
        }
      : null;

  const appearance = {
    hair: clip(input.hair, 60),
    skin: clip(input.skin, 40),
    eyes: clip(input.eyes, 30),
    glasses: Boolean(input.glasses),
    signatureItem: clip(input.item, 80),
    other: clip(input.other, 120),
  };
  if (!appearance.hair && !appearance.signatureItem) {
    errors.push("Hair or a signature item — so they look like themselves on every page.");
  }

  if (errors.length) return { brief: null, errors };

  const picked = templateById(input.templateId);

  const brief: Brief = {
    name,
    age,
    pronouns: PRONOUNS[pronounKey],
    pronounKey,
    band: bandForAge(age),
    interests,
    companion,
    appearance,
    hometown: clip(input.hometown, 60),
    occasion: occasionById(String(input.occasion || picked?.occasion || "just_because")),
    theme: themeById(String(input.theme || picked?.theme || "adventure")),
    style: styleById(String(input.style || "watercolor")),
    dedication: clip(input.dedication, 240),
    fromName: clip(input.fromName, 60),
    readerNotes: clip(input.readerNotes, 400),
    storyShape: picked
      ? {
          id: picked.id,
          label: picked.label,
          job: picked.job,
          beats: picked.beats,
          hiddenDetail: picked.hiddenDetail,
          titleHint: picked.titleHint.replace("{name}", name),
          refrainHint: picked.refrainHint,
        }
      : null,
  };
  return { brief, errors };
}
