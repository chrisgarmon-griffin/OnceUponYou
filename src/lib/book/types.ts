export type PronounKey = "she" | "he" | "they";

export type Pronouns = {
  subject: string;
  object: string;
  possessive: string;
  reflexive: string;
};

export type Companion = {
  name: string;
  kind: string;
  look: string;
};

export type Appearance = {
  hair: string;
  skin: string;
  eyes: string;
  glasses: boolean;
  signatureItem: string;
  other: string;
};

export type AgeBand = {
  id: "toddler" | "preschool" | "reader";
  label: string;
  pages: number;
  sentencesPerPage: [number, number];
  maxWordsPerPage: number;
  hardMaxWordsPerPage: number;
  refrain: boolean;
  rhythm: string;
  illustrationNote: string;
};

export type Occasion = {
  id: string;
  label: string;
  job: string;
  beats: string[];
};

export type Theme = {
  id: string;
  label: string;
  tone: string;
  worldHint: string;
};

export type ArtStyle = {
  id: string;
  label: string;
  tokens: string;
  palette: string;
};

export type Brief = {
  name: string;
  age: number;
  pronouns: Pronouns;
  pronounKey: PronounKey;
  band: AgeBand;
  interests: string[];
  companion: Companion | null;
  appearance: Appearance;
  hometown: string;
  occasion: Occasion;
  theme: Theme;
  style: ArtStyle;
  dedication: string;
  fromName: string;
  readerNotes: string;
  storyShape?: {
    id: string;
    label: string;
    job: string;
    beats: string[];
    hiddenDetail: string;
    titleHint: string;
    refrainHint: string;
  } | null;
};

export type StoryPage = {
  n: number;
  text: string;
  scene: string;
  heroExpression: string;
  shot: "wide" | "medium" | "close";
  hiddenDetail: string;
  image?: string | null;
  truck: { x: number; y: number };
};

export type CharacterBible = {
  heroName: string;
  heroDescriptor: string;
  companionName: string | null;
  companionDescriptor: string | null;
  outfit: string;
  referenceSheetPrompt: string;
};

export type Book = {
  slug: string;
  title: string;
  refrain: string | null;
  dedication: string;
  fromName: string;
  pages: StoryPage[];
  backCover: string;
  parentNote: string;
  coverImage: string | null;
  sheetImage?: string | null;
  bible?: CharacterBible;
  brief: Brief;
  illustrated: boolean;
  createdAt: string;
};
