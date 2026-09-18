import type { Brief, CharacterBible } from "./types";

function describeAge(age: number) {
  if (age <= 2) return "toddler";
  if (age <= 4) return "small preschool-age";
  if (age <= 6) return "kindergarten-age";
  if (age <= 8) return "seven-or-eight-year-old";
  return "nine-or-ten-year-old";
}

export function buildCharacterBible(brief: Brief): CharacterBible {
  const a = brief.appearance;
  const parts = [
    `${brief.name}, a ${describeAge(brief.age)} child`,
    a.skin,
    a.hair,
    a.eyes && `${a.eyes} eyes`,
    a.glasses && "round glasses",
    a.signatureItem && `always wearing ${a.signatureItem}`,
    a.other,
  ].filter(Boolean);

  const heroDescriptor = parts.join(", ");
  const companionDescriptor = brief.companion
    ? `${brief.companion.name}, ${brief.companion.kind}${brief.companion.look ? ", " + brief.companion.look : ""}`
    : null;
  const outfit = a.signatureItem
    ? `same outfit on every page featuring ${a.signatureItem}`
    : "same simple outfit on every page: solid color top, comfortable pants";

  return {
    heroName: brief.name,
    heroDescriptor,
    companionName: brief.companion?.name || null,
    companionDescriptor,
    outfit,
    referenceSheetPrompt: [
      `Character reference sheet for a children's picture book.`,
      `${heroDescriptor}. ${outfit}.`,
      companionDescriptor ? `Beside them, ${companionDescriptor}.` : "",
      `Front view and three-quarter view, a calm face and a big smile, full body, plain cream paper background, no text, no letters.`,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export function pageImagePrompt(
  bible: CharacterBible,
  styleTokens: string,
  palette: string,
  scene: string,
  expression: string,
  shot: string,
  hiddenDetail: string,
) {
  const shotNote =
    shot === "wide"
      ? "Wide shot, hero small against a big scene."
      : shot === "close"
        ? "Close shot on the hero's face and hands."
        : "Medium shot, hero waist-up, scene readable behind.";
  return [
    `${styleTokens}. Palette: ${palette}.`,
    `The hero is ${bible.heroDescriptor}. ${bible.outfit}.`,
    bible.companionDescriptor
      ? `The companion is ${bible.companionDescriptor}, same look on every page.`
      : "",
    `Scene: ${scene}`,
    `${bible.heroName} looks ${expression}.`,
    shotNote,
    `Draw only one child. Never duplicate the hero.`,
    hiddenDetail ? `Somewhere small in the scene: ${hiddenDetail}.` : "",
    `No text, no letters, no watermark, no photorealism, no 3D render.`,
  ]
    .filter(Boolean)
    .join(" ");
}
