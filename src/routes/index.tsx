import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Search,
  Heart,
  Moon,
  Gift,
  GraduationCap,
  Baby,
  WandSparkles,
  X,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { ALL_TEMPLATES } from "@/lib/book/templates";
import { CATEGORIES, FEATURED_IDS, STORY_META, type Category } from "@/lib/book/catalogue";
export const Route = createFileRoute("/")({ component: Home });
function Home() {
  const [category, setCategory] = useState<Category>("All stories");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const sorted = useMemo(
    () =>
      [...ALL_TEMPLATES].sort((a, b) => {
        const ai = FEATURED_IDS.indexOf(a.id),
          bi = FEATURED_IDS.indexOf(b.id);
        return (ai < 0 ? 20 : ai) - (bi < 0 ? 20 : bi);
      }),
    [],
  );
  const matches = sorted.filter(
    (t) =>
      (category === "All stories" || STORY_META[t.id]?.category === category) &&
      `${t.label} ${t.interests.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
  );
  const shown = expanded || query || category !== "All stories" ? matches : matches.slice(0, 4);
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="home-main">
        <section className="welcome-grid">
          <div className="welcome-copy">
            <p className="eyebrow">
              <span className="tiny-star">✦</span> THE NEXT CHAPTER IS THEIRS
            </p>
            <h1>
              Their little world.
              <br />
              An <em>extraordinary</em>
              <br className="desktop-break" /> story.
            </h1>
            <p className="welcome-intro">
              The dog they love. The boots they won’t take off. Turn the little things that make
              them <em>them</em> into a story to keep.
            </p>
            <div className="hero-actions">
              <Link to="/make" search={{}} className="button primary">
                Create their story <ArrowRight size={18} />
              </Link><a className="button secondary" href="/family.html">Tell a family story</a>
              <Link to="/read/$slug" params={{ slug: "luna" }} className="text-button">
                <BookOpen size={18} />
                Read a sample
              </Link>
            </div>
            <div className="hero-note">
              <span className="avatar-leaves">
                <Heart size={16} />
              </span>
              <span>
                Made for their age. Inspired by their world.
                <br />
                <strong>Meant to be read together.</strong>
              </span>
            </div>
          </div>
          <Link
            to="/read/$slug"
            params={{ slug: "luna" }}
            className="featured-book"
            aria-label="Read Luna and the Very Big Job"
          >
            <div className="featured-art">
              <img
                src="/books/luna/cover.jpg"
                alt="Luna in her yellow rain boots with Biscuit the dog, waving to a green truck"
                fetchPriority="high"
              />
              <span className="sample-label">
                <BookOpen size={14} /> A LITTLE LOOK INSIDE
              </span>
              <div className="featured-caption">
                <span>MEET OUR FIRST LITTLE HERO</span>
                <h2>
                  Luna and the
                  <br />
                  <em>Very Big Job</em>
                </h2>
              </div>
              <span className="book-open">
                <ArrowRight size={24} />
              </span>
            </div>
            <div className="featured-meta">
              <span>
                <span className="status-dot" />
                The complete sample story
              </span>
              <span>
                12 pages <span className="meta-divider">·</span> Ages 4–6
              </span>
            </div>
            <span className="floating-note">
              Small boots.
              <br />
              Very big possibilities.<span>↗</span>
            </span>
          </Link>
        </section>
        <div className="value-strip">
          <span>
            <Sparkles size={17} /> Their details become the story
          </span>
          <span>
            <BookOpen size={17} /> A reading level that fits
          </span>
          <span>
            <Heart size={17} /> Your words on the dedication page
          </span>
        </div>
        <section className="discover-section" id="stories">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FOLLOW THEIR WONDER</p>
              <h2>What’s their kind of magic?</h2>
            </div>
            <p>
              A starting point for every imagination.
              <br />
              Every story is for every child.
            </p>
          </div>
          <div className="discover-toolbar">
            <div className="filter-tabs" aria-label="Story categories">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  aria-pressed={category === c}
                  className={category === c ? "active" : ""}
                  onClick={() => {
                    setCategory(c);
                    setExpanded(false);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="search-box">
              <Search size={17} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find their thing…"
                aria-label="Search story ideas"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </label>
          </div>
          <div className="story-grid">
            {shown.map((t) => {
              const meta = STORY_META[t.id];
              const Icon = meta.icon;
              return (
                <Link
                  key={t.id}
                  to="/make"
                  search={{ template: t.id }}
                  className={`story-card color-${meta.color}`}
                >
                  <div className="story-card-art">
                    <span className="story-category">{meta.category}</span>
                    <div className="story-orbit" />
                    <Icon className="story-icon" strokeWidth={1.1} />
                    <span className="starlet one">✦</span>
                    <span className="starlet two">✧</span>
                    <span className="story-card-arrow">
                      <ArrowRight size={17} />
                    </span>
                  </div>
                  <div className="story-card-copy">
                    <h3>{t.label}</h3>
                    <p>{meta.short}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          {matches.length === 0 && (
            <div className="empty-state">
              <Search size={28} />
              <h3>No stories found for “{query}”</h3>
              <p>Try “space,” “animals,” or start with your own idea.</p>
              <Link to="/make" search={{ template: "own" }} className="button secondary">
                Create your own story
              </Link>
            </div>
          )}
          <div className="discovery-bottom">
            {category === "All stories" && !query && (
              <button className="text-button" onClick={() => setExpanded((v) => !v)}>
                {expanded
                  ? "Show featured stories"
                  : `Explore all ${ALL_TEMPLATES.length} story ideas`}
                <ArrowRight size={17} />
              </button>
            )}
            <Link to="/make" search={{ template: "own" }} className="text-button muted">
              <WandSparkles size={17} />
              Something entirely their own
            </Link>
          </div>
        </section>
        <section className="moments-section">
          <div>
            <p className="eyebrow">FOR THE CHAPTER THEY’RE IN</p>
            <h2>
              Little stories.
              <br />
              <em>Big life moments.</em>
            </h2>
            <p>
              A new sibling, a brave first day, or just one more story before the lights go out.
            </p>
          </div>
          <div className="moments-grid">
            {[
              {
                id: "bedtime",
                label: "One more bedtime story",
                sub: "A gentle way to end the day",
                icon: Moon,
              },
              {
                id: "new_sibling",
                label: "Becoming a big sibling",
                sub: "A new role to grow into",
                icon: Baby,
              },
              {
                id: "first_day",
                label: "That brave first day",
                sub: "A little rehearsal for something new",
                icon: GraduationCap,
              },
              {
                id: "birthday",
                label: "Another year of being them",
                sub: "A birthday story to keep",
                icon: Gift,
              },
            ].map((m) => (
              <Link to="/make" search={{ occasion: m.id }} key={m.id}>
                <span className="moment-icon">
                  <m.icon size={22} strokeWidth={1.5} />
                </span>
                <span>
                  <strong>{m.label}</strong>
                  <small>{m.sub}</small>
                </span>
                <ArrowRight size={17} />
              </Link>
            ))}
          </div>
        </section>
        <section className="how-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FROM THEIR WORLD TO THE PAGE</p>
              <h2>You know the hero. Let’s tell their story.</h2>
            </div>
            <Link to="/make" search={{}} className="button secondary">
              Start a book <ArrowRight size={17} />
            </Link>
          </div>
          <div className="how-grid">
            {[
              {
                n: "01",
                title: "Tell us their little things",
                text: "Their name, favorite things, and the people or pets who belong in their world.",
              },
              {
                n: "02",
                title: "Make it feel like them",
                text: "Choose a story, a look, and the words you want them to remember.",
              },
              {
                n: "03",
                title: "Read, refine, repeat",
                text: "Review every page, make it your own, and keep it on your bookshelf.",
              },
            ].map((s) => (
              <div key={s.n}>
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
