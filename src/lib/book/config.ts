import type { AgeBand, ArtStyle, Occasion, Theme } from "./types";

export const AGE_BANDS: Record<AgeBand["id"], AgeBand> = {
  toddler: {
    id: "toddler",
    label: "Toddler, 1–3",
    pages: 10,
    sentencesPerPage: [1, 1],
    maxWordsPerPage: 12,
    hardMaxWordsPerPage: 14,
    refrain: true,
    rhythm: "sing-song, sound words, repetition the child can predict",
    illustrationNote:
      "big central hero, minimal background clutter, one clear action per page",
  },
  preschool: {
    id: "preschool",
    label: "Preschool, 4–6",
    pages: 12,
    sentencesPerPage: [2, 3],
    maxWordsPerPage: 40,
    hardMaxWordsPerPage: 45,
    refrain: true,
    rhythm: "warm read-aloud cadence, a little humor, one problem and one fix",
    illustrationNote:
      "hero plus one companion, expressive faces, a small background detail the child will hunt for on every page",
  },
  reader: {
    id: "reader",
    label: "Early reader, 7–9",
    pages: 16,
    sentencesPerPage: [3, 5],
    maxWordsPerPage: 85,
    hardMaxWordsPerPage: 95,
    refrain: false,
    rhythm: "chapter-book voice, jokes the kid will repeat at dinner, one twist",
    illustrationNote:
      "fuller scenes, hero mid-action, secondary characters recur with consistent looks",
  },
};

export function bandForAge(age: number): AgeBand {
  if (age <= 3) return AGE_BANDS.toddler;
  if (age <= 6) return AGE_BANDS.preschool;
  return AGE_BANDS.reader;
}

export const OCCASIONS: Occasion[] = [
  {
    id: "new_sibling",
    label: "A new baby",
    job: "reframe the child from replaced to promoted",
    beats: [
      "hero notices things at home are changing",
      "hero worries out loud exactly once",
      "hero discovers a job only a big sibling can do",
    ],
  },
  {
    id: "first_day",
    label: "First day of school",
    job: "rehearse the scary day somewhere safe",
    beats: [
      "the night before, shoes by the door",
      "the doorway moment",
      "one small win before lunch",
    ],
  },
  {
    id: "birthday",
    label: "Birthday",
    job: "make the child feel like the whole day is about them",
    beats: [
      "the whole world seems to know what day it is",
      "a quest tied to the number they are turning",
      "the people they love show up at the end",
    ],
  },
  {
    id: "bedtime",
    label: "Bedtime",
    job: "wind down and end asleep",
    beats: [
      "the day empties out one thing at a time",
      "a soft, slow journey",
      "home in bed, the last line is a whisper",
    ],
  },
  {
    id: "moving",
    label: "Moving house",
    job: "carry the old home into the new one",
    beats: [
      "what the hero will miss, named specifically",
      "the boxes and the empty rooms",
      "the first thing in the new place that feels like theirs",
    ],
  },
  {
    id: "potty",
    label: "Potty training",
    job: "make the hero the expert, not the patient",
    beats: [
      "the hero already knows something the grown-ups forgot",
      "a silly setback nobody is mad about",
      "a celebration the family can copy in real life",
    ],
  },
  {
    id: "just_because",
    label: "Just because",
    job: "pure delight, the child as a capable hero",
    beats: [
      "an ordinary day turns strange",
      "the hero solves it with something they already love",
      "home again, a little taller",
    ],
  },
];

export const THEMES: Theme[] = [
  {
    id: "adventure",
    label: "Adventure",
    tone: "brisk, wide-eyed",
    worldHint: "a place the child could almost reach from their own backyard",
  },
  {
    id: "kindness",
    label: "Kindness",
    tone: "warm, gentle",
    worldHint: "a place where someone small needs help",
  },
  {
    id: "bravery",
    label: "Bravery",
    tone: "steady, encouraging",
    worldHint: "a place that looks scarier than it turns out to be",
  },
  {
    id: "curiosity",
    label: "Curiosity",
    tone: "playful, driven by questions",
    worldHint: "a place full of things that do not add up",
  },
  {
    id: "silly",
    label: "Silly",
    tone: "giggly, escalating",
    worldHint: "a place where one small rule has stopped working",
  },
];

export const ART_STYLES: ArtStyle[] = [
  {
    id: "watercolor",
    label: "Soft watercolor",
    tokens:
      "soft watercolor children's picture book illustration, visible paper texture, loose wet edges, gentle ink outline, warm limited palette",
    palette: "warm cream paper, moss green, coral, marigold, sky wash",
  },
  {
    id: "gouache",
    label: "Bold gouache",
    tokens:
      "flat gouache children's book illustration, matte opaque paint, chunky shapes, mid-century picture book feel, confident brush marks",
    palette: "mustard, teal, brick red, off-white",
  },
  {
    id: "pencil",
    label: "Colored pencil",
    tokens:
      "colored pencil children's book illustration, soft hatching, hand-drawn warmth, light paper grain, cozy",
    palette: "muted pastels, warm greys, one bright accent",
  },
];

export function occasionById(id: string) {
  return OCCASIONS.find((o) => o.id === id) ?? OCCASIONS[0];
}
export function themeById(id: string) {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
export function styleById(id: string) {
  return ART_STYLES.find((s) => s.id === id) ?? ART_STYLES[0];
}

export const PRONOUNS = {
  she: {
    subject: "she",
    object: "her",
    possessive: "her",
    reflexive: "herself",
  },
  he: {
    subject: "he",
    object: "him",
    possessive: "his",
    reflexive: "himself",
  },
  they: {
    subject: "they",
    object: "them",
    possessive: "their",
    reflexive: "themselves",
  },
} as const;
