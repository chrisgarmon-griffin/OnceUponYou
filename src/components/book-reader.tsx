import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Pause,
  Sun,
  Volume2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { narratePage } from "@/lib/engine/story";
import { honkTwice, pageRustle } from "@/lib/book/sound";
import type { Book } from "@/lib/book/types";
import { cn } from "@/lib/utils";

type Leaf =
  | { kind: "cover" }
  | { kind: "dedication" }
  | { kind: "page"; index: number }
  | { kind: "close" };

export function BookReader({ book }: { book: Book }) {
  const leaves = useMemo<Leaf[]>(() => {
    const list: Leaf[] = [{ kind: "cover" }, { kind: "dedication" }];
    book.pages.forEach((_, index) => list.push({ kind: "page", index }));
    list.push({ kind: "close" });
    return list;
  }, [book.pages]);

  const [i, setI] = useState(0);
  const [dir, setDir] = useState<"left" | "right">("right");
  const [night, setNight] = useState(false);
  const [found, setFound] = useState<Set<number>>(new Set());
  const [hint, setHint] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [honk, setHonk] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cache = useRef<Record<string, string>>({});

  const leaf = leaves[i];
  const storyPage = leaf.kind === "page" ? book.pages[leaf.index] : null;
  const totalStory = book.pages.length;
  const foundCount = found.size;

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next >= leaves.length || next === i) return;
      setDir(next > i ? "right" : "left");
      setI(next);
      setHint(false);
      pageRustle();
      audioRef.current?.pause();
      setPlaying(false);
    },
    [i, leaves.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(i + 1);
      }
      if (e.key === "ArrowLeft") go(i - 1);
      if (e.key === "Escape") setNight(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i]);

  useEffect(() => {
    let x0 = 0;
    const el = document.getElementById("reader-stage");
    if (!el) return;
    const start = (e: TouchEvent) => {
      x0 = e.changedTouches[0]?.clientX ?? 0;
    };
    const end = (e: TouchEvent) => {
      const x1 = e.changedTouches[0]?.clientX ?? 0;
      if (x1 - x0 > 50) go(i - 1);
      if (x0 - x1 > 50) go(i + 1);
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end);
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, [go, i]);

  async function readAloud() {
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    const text =
      leaf.kind === "cover"
        ? book.title
        : leaf.kind === "dedication"
          ? `${book.dedication} ${book.fromName}`
          : leaf.kind === "close"
            ? `${book.backCover} ${book.parentNote}`
            : storyPage?.text || "";
    if (!text) return;

    const cached = cache.current[text];
    if (cached) {
      playSrc(cached);
      return;
    }

    const result = await narratePage({ data: { text } });
    if (result.ok && result.audio) {
      cache.current[text] = result.audio;
      playSrc(result.audio);
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.92;
      u.onend = () => setPlaying(false);
      setPlaying(true);
      window.speechSynthesis.speak(u);
    }
  }

  function playSrc(src: string) {
    audioRef.current?.pause();
    const a = new Audio(src);
    audioRef.current = a;
    a.onended = () => setPlaying(false);
    void a.play();
    setPlaying(true);
  }

  function tapRefrain() {
    honkTwice();
    setHonk(true);
    window.setTimeout(() => setHonk(false), 420);
  }

  function markFound(n: number) {
    setFound((prev) => new Set(prev).add(n));
  }

  const image =
    leaf.kind === "cover"
      ? book.coverImage
      : leaf.kind === "page"
        ? storyPage?.image
        : null;

  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-hidden transition-colors duration-500",
        night ? "bg-night text-paper" : "bg-paper text-ink",
      )}
    >
      <div className="paper-grain absolute inset-0 mix-blend-multiply" />
      <header className="no-print relative z-20 flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link
          to="/"
          className={cn(
            "inline-flex size-11 items-center justify-center rounded-full",
            night ? "text-paper/80 hover:bg-paper/10" : "text-muted hover:bg-paper-2",
          )}
          aria-label="Close book"
        >
          <X className="size-5" />
        </Link>
        <p className="min-w-0 flex-1 truncate text-center font-display text-sm tracking-wide text-muted">
          {leaf.kind === "page" ? `${leaf.index + 1} / ${totalStory}` : book.title}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant={night ? "night" : "quiet"}
            size="icon"
            onClick={() => void readAloud()}
            aria-label={playing ? "Pause reading" : "Read aloud"}
          >
            {playing ? <Pause className="size-5" /> : <Volume2 className="size-5" />}
          </Button>
          <Button
            variant={night ? "night" : "quiet"}
            size="icon"
            onClick={() => setNight((v) => !v)}
            aria-label={night ? "Morning light" : "Bedtime light"}
          >
            {night ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </div>
      </header>

      <div
        id="reader-stage"
        className="relative mx-auto flex min-h-[calc(100dvh-4.25rem)] w-full max-w-5xl flex-col px-3 pb-3 md:px-8"
      >
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div
            key={`${leaf.kind}-${i}`}
            className={cn(
              "relative w-[min(100%,calc(100dvh-8.25rem),720px)]",
              dir === "right" ? "page-enter" : "page-enter-left",
            )}
          >
            {leaf.kind === "cover" && (
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => go(i + 1)}
                aria-label="Open the book"
              >
                <CoverLeaf book={book} image={image} night={night} />
              </button>
            )}
            {leaf.kind === "dedication" && (
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => go(i + 1)}
                aria-label="Turn the page"
              >
                <DedicationLeaf book={book} night={night} />
              </button>
            )}
            {leaf.kind === "page" && storyPage && (
              <StoryLeaf
                book={book}
                page={storyPage}
                night={night}
                honk={honk}
                hint={hint}
                found={found.has(storyPage.n)}
                onFound={() => markFound(storyPage.n)}
                onRefrain={tapRefrain}
                onTurn={(side) => go(i + (side === "next" ? 1 : -1))}
              />
            )}
            {leaf.kind === "close" && (
              <CloseLeaf book={book} night={night} found={foundCount} total={totalStory} />
            )}
          </div>
        </div>

        <div className="no-print mt-2 flex items-center justify-between gap-3">
          <Button
            variant={night ? "night" : "ghost"}
            size="icon"
            onClick={() => go(i - 1)}
            disabled={i === 0}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="flex flex-1 flex-col items-center gap-1.5">
            {leaf.kind === "page" && (
              <button
                type="button"
                onClick={() => setHint(true)}
                className={cn("text-xs tracking-wide", night ? "text-paper/50" : "text-muted")}
              >
                {foundCount} of {totalStory} found · look closer
              </button>
            )}
            <div
              className={cn("h-0.5 w-40 overflow-hidden rounded-full", night ? "bg-paper/20" : "bg-line")}
              aria-hidden
            >
              <div
                className={cn("h-full rounded-full transition-[width] duration-300", night ? "bg-paper" : "bg-ink")}
                style={{ width: `${(i / Math.max(leaves.length - 1, 1)) * 100}%` }}
              />
            </div>
          </div>
          <Button
            variant={night ? "night" : "ghost"}
            size="icon"
            onClick={() => go(i + 1)}
            disabled={i === leaves.length - 1}
            aria-label="Next page"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function CoverLeaf({ book, image, night }: { book: Book; image: string | null | undefined; night: boolean }) {
  return (
    <div className="relative mx-auto aspect-square overflow-hidden rounded-[4px_22px_22px_4px] bg-paper-2 book-shadow">
      {image ? (
        <img src={image} alt="" className={cn("size-full object-cover", night && "brightness-90")} />
      ) : (
        <div className="size-full bg-paper-2" />
      )}
      <div className="absolute inset-y-0 left-0 w-2.5 bg-linear-to-r from-ink/20 to-transparent" />
      <div className="absolute inset-x-[8%] top-[8%] text-center">
        <h1 className="font-display text-[clamp(1.7rem,5vw,2.8rem)] leading-[1.05] font-semibold text-ink [text-shadow:0_1px_0_rgba(244,239,230,0.75)]">
          {book.title}
        </h1>
      </div>
    </div>
  );
}

function DedicationLeaf({ book, night }: { book: Book; night: boolean }) {
  return (
    <div
      className={cn(
        "mx-auto flex aspect-square max-w-xl flex-col items-center justify-center rounded-[22px] px-10 text-center book-shadow",
        night ? "bg-night-paper" : "bg-paper-2",
      )}
    >
      <p className={cn("text-xs tracking-[0.22em] uppercase", night ? "text-paper/45" : "text-muted")}>
        This copy
      </p>
      <p className="mt-8 font-display text-2xl leading-snug font-medium italic md:text-3xl">{book.dedication}</p>
      {book.fromName ? (
        <p className={cn("mt-8 font-display text-base", night ? "text-paper/70" : "text-ink-soft")}>
          {book.fromName}
        </p>
      ) : null}
    </div>
  );
}

function StoryLeaf({
  book,
  page,
  night,
  honk,
  hint,
  found,
  onFound,
  onRefrain,
  onTurn,
}: {
  book: Book;
  page: Book["pages"][number];
  night: boolean;
  honk: boolean;
  hint: boolean;
  found: boolean;
  onFound: () => void;
  onRefrain: () => void;
  onTurn: (side: "prev" | "next") => void;
}) {
  const parts = splitRefrain(page.text, book.refrain);

  return (
    <figure className="relative aspect-square overflow-hidden rounded-[18px] bg-paper-2 book-shadow">
      {page.image ? (
        <img
          src={page.image}
          alt=""
          className={cn("size-full object-cover", night && "brightness-[0.88]")}
        />
      ) : (
        <div className={cn("flex size-full items-end p-6", night ? "bg-night-2" : "bg-paper-3")}>
          <p className="max-w-sm font-display text-sm italic text-muted">{page.scene}</p>
        </div>
      )}
      <button
        type="button"
        className="absolute inset-y-0 left-0 w-1/3"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => onTurn("prev")}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 w-1/3"
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => onTurn("next")}
      />
      <button
        type="button"
        aria-label={found ? "Found the hidden detail" : "Look for the hidden detail"}
        onClick={onFound}
        className="absolute z-10 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: `${page.truck.x}%`, top: `${page.truck.y}%` }}
      >
        {hint && !found && (
          <span className="absolute inset-2 animate-pulse rounded-full bg-paper/50" />
        )}
        {found && (
          <img
            src="/books/luna/truck.svg"
            alt=""
            className="found-ring absolute top-1/2 left-1/2 w-10 -translate-x-1/2 -translate-y-1/2 drop-shadow"
          />
        )}
      </button>
      <figcaption
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 py-4 md:px-6",
          night ? "bg-night-paper/92" : "bg-paper/94",
        )}
      >
        <p
          className={cn(
            "font-display text-[0.98rem] leading-relaxed md:text-[1.12rem]",
            honk && "honk-pop",
          )}
        >
          {parts.map((part, idx) =>
            part.chant ? (
              <button
                key={idx}
                type="button"
                onClick={onRefrain}
                className="pointer-events-auto inline font-semibold text-moss italic underline decoration-moss/30 decoration-2 underline-offset-4"
              >
                {part.text}
              </button>
            ) : (
              <span key={idx}>{part.text}</span>
            ),
          )}
        </p>
      </figcaption>
    </figure>
  );
}

function CloseLeaf({
  book,
  night,
  found,
  total,
}: {
  book: Book;
  night: boolean;
  found: number;
  total: number;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex max-w-xl flex-col gap-6 rounded-[22px] px-8 py-12 book-shadow",
        night ? "bg-night-paper" : "bg-paper-2",
      )}
    >
      <p className="font-display text-2xl leading-snug">{book.backCover}</p>
      <p className={cn("font-display italic", night ? "text-paper/70" : "text-ink-soft")}>{book.parentNote}</p>
      <p className="text-sm text-muted">
        Hidden details found: {found} of {total}. The share is the face, not the book — film the first read.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/make"
          className="inline-flex min-h-11 items-center rounded-lg bg-moss px-4 font-medium text-paper"
        >
          Make one for your child
        </Link>
        <Link
          to="/"
          className={cn(
            "inline-flex min-h-11 items-center rounded-lg px-4 font-medium",
            night ? "bg-paper/10 text-paper" : "bg-paper text-ink",
          )}
        >
          Back to the atelier
        </Link>
      </div>
    </div>
  );
}

function splitRefrain(text: string, refrain: string | null) {
  if (!refrain || !text.includes(refrain)) return [{ text, chant: false }];
  const parts = text.split(refrain);
  const out: { text: string; chant: boolean }[] = [];
  parts.forEach((chunk, idx) => {
    if (chunk) out.push({ text: chunk, chant: false });
    if (idx < parts.length - 1) out.push({ text: refrain, chant: true });
  });
  return out;
}
