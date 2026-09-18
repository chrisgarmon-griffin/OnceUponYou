import { createFileRoute, Link } from "@tanstack/react-router";
import { PhysicalBook } from "@/components/physical-book";
import { SiteHeader } from "@/components/site-header";
import { OCCASIONS } from "@/lib/book/config";
import { BOY_TEMPLATES, GIRL_TEMPLATES } from "@/lib/book/templates";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="relative min-h-dvh bg-paper text-ink">
      <div className="paper-grain absolute inset-0 mix-blend-multiply" />
      <SiteHeader />
      <main>
        <section className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-10 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-16">
          <div className="stagger-in">
            <p className="text-sm tracking-[0.18em] text-muted uppercase">A small press for one child</p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] leading-[1.02] font-medium tracking-tight">
              A picture book that could only be about them.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              Not their name dropped into a template. Their dog. Their street. The thing they cannot stop talking
              about this month — written as the plot, painted as the same child on every page.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/read/$slug"
                params={{ slug: "luna" }}
                className="inline-flex min-h-12 items-center rounded-xl bg-moss px-6 font-medium text-paper transition-transform duration-150 active:scale-[0.96]"
              >
                Read Luna&rsquo;s book
              </Link>
              <Link
                to="/make"
                className="inline-flex min-h-12 items-center rounded-xl border border-line bg-paper px-6 font-medium text-ink transition-transform duration-150 active:scale-[0.96]"
              >
                Make one for your child
              </Link>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted">
              Luna is four. She loves garbage trucks, her dog Biscuit, and jumping in puddles. Next month her brother
              arrives. Open the book.
            </p>
          </div>
          <PhysicalBook caption="Tap to open — 12 pages, one consistent hero" />
        </section>

        <section className="border-t border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3 md:px-8">
            <Moment
              title="The recognition"
              body="The child sees something that could only be about them. Name insertion has been done since the 1980s. Their dog's real name, their yellow boots, the truck that gets stuck — that is the book."
            />
            <Moment
              title="The shout"
              body="A refrain they can beat you to by the second read. Tap Beep, beep, back it up! and the truck answers. Film the face, not the page."
            />
            <Moment
              title="One child, every page"
              body="We lock a character sheet first. Same hair. Same boots. Same floppy ear. The cheap books skip this, and parents notice on page four."
            />
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              The story they are already living
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              If they are a sports star this month, do not hand them an astronaut. If they run a castle in the
              living room, write that. Or skip the shelf and answer a brief of your own.
            </p>
            <div className="mt-10 grid gap-10 md:grid-cols-2">
              <Shelf title="Stories girls ask for" items={GIRL_TEMPLATES.map((t) => t.label)} />
              <Shelf title="Stories boys ask for" items={BOY_TEMPLATES.map((t) => t.label)} />
            </div>
            <Link
              to="/make"
              className="mt-8 inline-flex min-h-11 items-center font-medium text-moss"
            >
              Choose a shape, or write your own
            </Link>
          </div>
        </section>

        <section className="border-t border-line bg-paper-2/70">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
            <h2 className="font-display text-3xl font-medium tracking-tight md:text-4xl">
              Books for the moments that need one
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">
              Nobody searches for an adventure book. They search for a book for the older sibling when the baby
              comes. For the night before kindergarten. For a birthday a grandmother cannot miss.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {OCCASIONS.map((o) => (
                <li
                  key={o.id}
                  className="rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft"
                >
                  {o.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-line">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
            <h2 className="font-display text-3xl font-medium tracking-tight">How a book is made</h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              <li>
                <p className="font-display text-sm tracking-[0.16em] text-moss uppercase">01</p>
                <h3 className="mt-2 font-display text-xl">You tell us the real stuff</h3>
                <p className="mt-2 text-ink-soft">
                  What they love, who they love, how they look. The intake is built to extract the details a template
                  can never fake.
                </p>
              </li>
              <li>
                <p className="font-display text-sm tracking-[0.16em] text-moss uppercase">02</p>
                <h3 className="mt-2 font-display text-xl">We write it to their age</h3>
                <p className="mt-2 text-ink-soft">
                  Chantable lines for a toddler. A problem and a fix for a preschooler. A twist for an early reader.
                  Tired-parent cadence, 7:45pm.
                </p>
              </li>
              <li>
                <p className="font-display text-sm tracking-[0.16em] text-moss uppercase">03</p>
                <h3 className="mt-2 font-display text-xl">Then we paint from one sheet</h3>
                <p className="mt-2 text-ink-soft">
                  A reference of the hero first. Every page is made from it. Hunt the tiny red truck. Lights down for
                  bedtime.
                </p>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-sm text-muted md:flex-row md:justify-between md:px-8">
          <p>Once Upon You. Written one child at a time.</p>
          <p className="max-w-md">
            We do not keep photographs. We do not train on your family. The pictures are painted from the words you
            give us, and mentioned here once, honestly.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Shelf({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-display text-xl">{title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((label) => (
          <li key={label} className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft">
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Moment({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-medium">{title}</h2>
      <p className="mt-3 leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
