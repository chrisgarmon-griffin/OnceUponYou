import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildCharacterBible, pageImagePrompt } from "@/lib/book/bible";
import { normalizeBrief, type BriefInput } from "@/lib/book/brief";
import { qaStory } from "@/lib/book/qa";
import { slugify } from "@/lib/utils";
import type { Book, StoryPage } from "@/lib/book/types";

const briefSchema = z.object({
  name: z.string(),
  age: z.union([z.number(), z.string()]),
  pronouns: z.string(),
  interests: z.union([z.string(), z.array(z.string())]),
  companionName: z.string().optional(),
  companionKind: z.string().optional(),
  companionLook: z.string().optional(),
  hair: z.string().optional(),
  skin: z.string().optional(),
  eyes: z.string().optional(),
  glasses: z.boolean().optional(),
  item: z.string().optional(),
  other: z.string().optional(),
  hometown: z.string().optional(),
  occasion: z.string().optional(),
  theme: z.string().optional(),
  style: z.string().optional(),
  dedication: z.string().optional(),
  fromName: z.string().optional(),
  readerNotes: z.string().optional(),
  templateId: z.string().optional(),
});

function stripFences(s: string) {
  return s.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function truckFor(n: number) {
  const spots = [
    { x: 78, y: 74 },
    { x: 22, y: 70 },
    { x: 82, y: 84 },
    { x: 14, y: 80 },
    { x: 88, y: 72 },
    { x: 18, y: 86 },
    { x: 84, y: 88 },
    { x: 12, y: 78 },
    { x: 86, y: 80 },
    { x: 16, y: 88 },
    { x: 76, y: 84 },
    { x: 10, y: 76 },
    { x: 48, y: 82 },
    { x: 30, y: 76 },
    { x: 70, y: 68 },
    { x: 8, y: 84 },
  ];
  return spots[(n - 1) % spots.length];
}

export const getPressStatus = createServerFn({ method: "POST" }).handler(async () => {
  const { getApiKey } = await import("./xai.server");
  return { available: Boolean(getApiKey()) };
});

export const writeStory = createServerFn({ method: "POST" })
  .validator((input: BriefInput) => briefSchema.parse(input))
  .handler(async ({ data }) => {
    const { brief, errors } = normalizeBrief(data);
    if (!brief) return { ok: false as const, errors };

    const bible = buildCharacterBible(brief);
    const system = `You are a working picture-book author. You have written books children ask for every night for a year.
You write for ONE child at a time, and the book must feel like it was written about them and nobody else.

Rules you never break:
- The child's real details are the plot, not decoration. If the child loves garbage trucks, a garbage truck does something in the story that matters.
- Concrete nouns and verbs. No abstractions ("courage", "discovery", "journey"). Show it.
- The hero acts. Adults do not solve the problem. The companion helps but the hero decides.
- Read-aloud rhythm. Every page must sound good spoken by a tired parent at 7:45pm.
- Age band: ${brief.band.label}. ${brief.band.rhythm}. ${brief.band.sentencesPerPage[0]}-${brief.band.sentencesPerPage[1]} sentences per page, hard cap ${brief.band.hardMaxWordsPerPage} words per page.
- Exactly ${brief.band.pages} story pages.
${brief.band.refrain ? "- Include one refrain: a short line repeated on at least 3 pages that a child can chant along to." : "- No refrain. Use a running joke instead."}
- Use the pronouns ${brief.pronouns.subject}/${brief.pronouns.object}/${brief.pronouns.possessive} for the hero.
- The last page lands softly. No moral stated as a lesson. The lesson is what happened.
- Nothing frightening for the age. No real brands, no existing characters, no words a parent would not want read aloud.
- Scene descriptions are for an illustrator: composition, where the hero is, what they are doing, one background detail.

Return ONLY a JSON object matching this shape:
{
  "title": string,
  "refrain": string | null,
  "dedicationDefault": string,
  "pages": [
    {
      "n": number,
      "text": string,
      "scene": string,
      "heroExpression": string,
      "shot": "wide" | "medium" | "close",
      "hiddenDetail": string
    }
  ],
  "backCover": string,
  "parentNote": string
}`;

    const user = `Write the book.

Hero: ${brief.name}, age ${brief.age}. Pronouns ${brief.pronounKey}.
Looks (keep consistent): ${bible.heroDescriptor}. ${bible.outfit}.
Loves (use all of these, the first one drives the plot): ${brief.interests.join("; ")}.
${brief.companion ? `Companion: ${brief.companion.name}, ${brief.companion.kind}${brief.companion.look ? ", " + brief.companion.look : ""}. ${brief.companion.name} helps but never solves it.` : "No companion. The hero meets one new friend in the story who is not a real person."}
${brief.hometown ? `Home: ${brief.hometown}. Ground the opening and closing there.` : ""}
${
  brief.storyShape
    ? `Story shape (do not wander into a different genre): ${brief.storyShape.label}.
Job of this shape: ${brief.storyShape.job}.
Beats to hit in order: ${brief.storyShape.beats.map((b, i) => `(${i + 1}) ${b}`).join(" ")}
Title should feel like: ${brief.storyShape.titleHint}.
Refrain energy: ${brief.storyShape.refrainHint}.
Recurring hidden detail on every page: ${brief.storyShape.hiddenDetail}.
This is not a generic adventure and not a different childhood obsession. Stay inside this shape.`
    : `Occasion: ${brief.occasion.label}. Job of this book: ${brief.occasion.job}.
Beats to hit in order: ${brief.occasion.beats.map((b, i) => `(${i + 1}) ${b}`).join(" ")}
Recurring hidden detail: pick one small object tied to the hero's interests and put it somewhere on every page.`
}
${brief.storyShape && brief.occasion.id !== "just_because" ? `Life moment to honor inside the shape: ${brief.occasion.label}. ${brief.occasion.job}.` : ""}
Theme: ${brief.theme.label}, tone ${brief.theme.tone}. World: ${brief.theme.worldHint}.
Art style: ${brief.style.label}. Write scenes that suit it.
${brief.readerNotes ? `From the parent: "${brief.readerNotes}". Respect this.` : ""}`;

    const { chatJson } = await import("./xai.server");
    const first = await chatJson(system, user);
    if (!first.ok) {
      return { ok: false as const, errors: ["The press is quiet right now. Try Luna's book, or try again in a moment."] };
    }

    let parsed: {
      title: string;
      refrain: string | null;
      dedicationDefault: string;
      pages: StoryPage[];
      backCover: string;
      parentNote: string;
    };
    try {
      parsed = JSON.parse(stripFences(first.text));
    } catch {
      return { ok: false as const, errors: ["The story came back unfinished. Please try once more."] };
    }

    let report = qaStory(parsed, brief);
    if (!report.ok) {
      const retry = await chatJson(
        system,
        `Fix these and return the full JSON again:\n- ${report.hardFailures.join("\n- ")}\n\nPrevious JSON:\n${first.text}`,
      );
      if (retry.ok) {
        try {
          parsed = JSON.parse(stripFences(retry.text));
          report = qaStory(parsed, brief);
        } catch {
          /* keep first */
        }
      }
    }

    const pages: StoryPage[] = (parsed.pages || []).map((page, i) => ({
      n: i + 1,
      text: String(page.text || ""),
      scene: String(page.scene || ""),
      heroExpression: String(page.heroExpression || "curious"),
      shot: page.shot === "wide" || page.shot === "close" ? page.shot : "medium",
      hiddenDetail: String(page.hiddenDetail || "a tiny red toy"),
      image: null,
      truck: truckFor(i + 1),
    }));

    const book: Book = {
      slug: `${slugify(brief.name) || "story"}-${Date.now().toString(36).slice(-4)}`,
      title: parsed.title || `${brief.name} and the Very Big Job`,
      refrain: parsed.refrain || null,
      dedication:
        brief.dedication ||
        parsed.dedicationDefault ||
        `For ${brief.name}.`,
      fromName: brief.fromName,
      pages,
      backCover: parsed.backCover || `A picture book for ${brief.name}.`,
      parentNote: parsed.parentNote || `Let ${brief.name} shout along.`,
      coverImage: null,
      sheetImage: null,
      bible,
      brief,
      illustrated: false,
      createdAt: new Date().toISOString(),
    };

    return { ok: true as const, book, warnings: report.hardFailures };
  });

export const paintImage = createServerFn({ method: "POST" })
  .validator((input: { kind: "sheet" | "cover" | "page"; book: Book; pageIndex?: number }) => input)
  .handler(async ({ data }) => {
    const { book, kind } = data;
    const { bible } = book;
    if (!bible) return { ok: false as const, error: "missing character" };
    const { imagineImage } = await import("./xai.server");

    if (kind === "sheet") {
      const result = await imagineImage(
        `${book.brief.style.tokens}. Palette: ${book.brief.style.palette}. ${bible.referenceSheetPrompt}`,
      );
      return result;
    }

    if (kind === "cover") {
      const opening = book.pages[0]?.scene || `${bible.heroName} looking toward the reader`;
      const prompt = pageImagePrompt(
        bible,
        book.brief.style.tokens,
        book.brief.style.palette,
        `Book cover illustration. ${bible.heroName} front and center, mid-action, looking toward the reader, delighted. Setting: ${opening}`,
        "delighted",
        "wide",
        "",
      );
      return imagineImage(prompt, book.sheetImage || undefined);
    }

    const page = book.pages[data.pageIndex ?? 0];
    if (!page) return { ok: false as const, error: "missing page" };
    const prompt = pageImagePrompt(
      bible,
      book.brief.style.tokens,
      book.brief.style.palette,
      page.scene,
      page.heroExpression,
      page.shot,
      page.hiddenDetail,
    );
    return imagineImage(prompt, book.sheetImage || book.coverImage || undefined);
  });

export const narratePage = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => input)
  .handler(async ({ data }) => {
    const text = data.text.trim().slice(0, 600);
    if (!text) return { ok: false as const, error: "empty" };
    const { speak } = await import("./xai.server");
    return speak(text);
  });
