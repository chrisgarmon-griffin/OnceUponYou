import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AtelierForm } from "@/components/atelier-form";
import { SiteHeader } from "@/components/site-header";
import type { BriefInput } from "@/lib/book/brief";
import { illuminateBook } from "@/lib/book/illuminate";
import { useBookStore } from "@/lib/book/store";
import { getPressStatus, writeStory } from "@/lib/engine/story";
import type { StoryTemplate } from "@/lib/book/templates";

export const Route = createFileRoute("/make")({ component: MakePage });

function MakePage() {
  const navigate = useNavigate();
  const upsert = useBookStore((s) => s.upsert);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [press, setPress] = useState(true);
  const [shape, setShape] = useState<StoryTemplate | null>(null);
  const [title, setTitle] = useState("A book that could only be theirs");

  useEffect(() => {
    void getPressStatus().then((s) => setPress(s.available));
  }, []);

  async function onSubmit(input: BriefInput) {
    setBusy(true);
    setError(null);
    const result = await writeStory({ data: input });
    if (!result.ok) {
      setError(result.errors[0] || "The press could not set the type.");
      setBusy(false);
      return;
    }
    upsert(result.book);
    void illuminateBook(result.book, upsert);
    setBusy(false);
    await navigate({ to: "/read/$slug", params: { slug: result.book.slug } });
  }

  return (
    <div className="relative min-h-dvh bg-paper">
      <div className="paper-grain absolute inset-0 mix-blend-multiply" />
      <SiteHeader />
      <main className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-10 md:grid-cols-[1.15fr_0.85fr] md:px-8 md:py-14">
        <div>
          <p className="text-sm tracking-[0.18em] text-muted uppercase">The atelier</p>
          <h1 className="mt-3 font-display text-4xl font-medium tracking-tight md:text-5xl">
            Pick the story they would ask for.
          </h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            Twenty shapes, or a brief of your own. The child is the hero either way.
          </p>
          <div className="mt-10">
            <AtelierForm
              onSubmit={onSubmit}
              busy={busy}
              error={error}
              onShapeChange={(t, live) => {
                setShape(t);
                setTitle(live);
              }}
            />
          </div>
          {!press && (
            <p className="mt-6 max-w-lg text-sm text-muted">
              Illustration is resting; Luna&rsquo;s book is fully painted and ready tonight.
            </p>
          )}
        </div>
        <aside className="md:sticky md:top-8 md:self-start">
          <div className="overflow-hidden rounded-[4px_22px_22px_4px] bg-paper-2 book-shadow">
            <img src="/books/luna/cover.jpg" alt="" className="aspect-square w-full object-cover" />
            <div className="px-6 py-5">
              <p className="font-display text-xl">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {shape
                  ? shape.blurb
                  : "A finished twelve-page picture book. Same child, every page. Read Luna first — then make the one that could only be yours."}
              </p>
              {shape ? (
                <p className="mt-3 text-sm text-ink-soft">{shape.job}</p>
              ) : null}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
