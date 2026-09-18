import type { Brief, Book } from "./types";

const UNSAFE = /\b(kill|killed|dead|die|blood|gun|knife|stupid|hate|shut up|damn|hell)\b/i;

export function qaStory(
  story: Pick<Book, "title" | "refrain" | "pages">,
  brief: Brief,
) {
  const band = brief.band;
  const hard: string[] = [];
  const pages = Array.isArray(story.pages) ? story.pages : [];

  if (pages.length !== band.pages) hard.push(`expected ${band.pages} pages, got ${pages.length}`);
  if (!story.title || !story.title.toLowerCase().includes(brief.name.toLowerCase())) {
    hard.push("title must include the child's name");
  }
  if (band.refrain && !story.refrain) hard.push("this age band requires a refrain");

  let refrainHits = 0;
  const wrong = wrongPronounPattern(brief);

  pages.forEach((page, i) => {
    const text = String(page?.text || "");
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words > band.hardMaxWordsPerPage) {
      hard.push(`page ${i + 1} has ${words} words, cap ${band.hardMaxWordsPerPage}`);
    }
    if (UNSAFE.test(text)) hard.push(`page ${i + 1} is not suitable for read-aloud`);
    if (wrong && wrong.test(text)) hard.push(`page ${i + 1} uses the wrong pronoun for ${brief.name}`);
    if (!page?.scene || !String(page.scene).toLowerCase().includes(brief.name.toLowerCase())) {
      hard.push(`page ${i + 1} scene must place ${brief.name} in frame`);
    }
    if (story.refrain && text.includes(story.refrain)) refrainHits++;
  });

  if (band.refrain && story.refrain && refrainHits < 3) {
    hard.push(`refrain must appear on at least 3 pages, found ${refrainHits}`);
  }
  if (brief.companion && !pages.some((p) => String(p?.text || "").includes(brief.companion!.name))) {
    hard.push(`companion ${brief.companion.name} never appears`);
  }

  return { hardFailures: hard, ok: hard.length === 0 };
}

function wrongPronounPattern(brief: Brief) {
  const n = brief.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const wrong = { she: "he|his|him", he: "she|her", they: "she|her|he|his|him" }[brief.pronounKey];
  return new RegExp(`\\b${n}\\b[^.!?]{0,40}\\b(${wrong})\\b`, "i");
}
