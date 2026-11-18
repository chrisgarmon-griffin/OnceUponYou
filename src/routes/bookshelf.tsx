import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Download,
  Upload,
  Plus,
  Search,
  PencilLine,
  Trash2,
  ShieldCheck,
  Undo2,
  X,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { BookCover } from "@/components/book-cover";
import { useBookStore } from "@/lib/book/store";
import { downloadBackup, importBackup, getReadingProgress } from "@/lib/book/storage";
import type { Book } from "@/lib/book/types";
export const Route = createFileRoute("/bookshelf")({ component: Bookshelf });
function Bookshelf() {
  const { books, hydrate, remove, upsert } = useBookStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState<Book | null>(null);
  const [draft, setDraft] = useState("");
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    hydrate();
    setReady(true);
    try {
      setDraft(JSON.parse(localStorage.getItem("ouy.draft.v2") || "null")?.input?.name || "");
    } catch {
      /* No saved draft. */
    }
  }, [hydrate]);
  const list = Object.values(books).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const custom = list.filter((b) => b.slug !== "luna");
  const shown = list.filter(
    (b) =>
      (filter !== "mine" || b.slug !== "luna") &&
      `${b.title} ${b.brief.name}`.toLowerCase().includes(query.toLowerCase()),
  );
  async function restore(file?: File) {
    if (!file) return;
    try {
      const count = await importBackup(file);
      hydrate();
      setMessage(`${count} ${count === 1 ? "book" : "books"} restored. Existing books were kept.`);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "We couldn’t read that backup.");
    }
    if (inputRef.current) inputRef.current.value = "";
  }
  function deleteBook(book: Book) {
    try {
      remove(book.slug);
      setDeleted(book);
      setMessage(`“${book.title}” removed from this bookshelf.`);
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main" className="shelf-main">
        <div className="page-heading">
          <div>
            <p className="eyebrow">THE STORIES THAT BELONG TO YOU</p>
            <h1>Your little library.</h1><a href="/family.html#shelf" className="text-button">Family bookshelf →</a>
            <p>Old favorites, new adventures, and the next “read it again.”</p>
          </div>
          <Link to="/make" search={{}} className="button primary">
            <Plus size={17} />
            Create a book
          </Link>
        </div>
        <div className="shelf-notice">
          <ShieldCheck size={20} />
          <div>
            <strong>This bookshelf lives on this device.</strong>
            <p>Download a backup to keep your books safe or bring them to another browser.</p>
          </div>
          <div className="backup-actions">
            <button
              className="text-button"
              disabled={!custom.length}
              onClick={() => {
                downloadBackup(custom);
                setMessage("Bookshelf backup downloaded.");
              }}
            >
              <Download size={16} />
              Back up books
            </button>
            <button className="text-button" onClick={() => inputRef.current?.click()}>
              <Upload size={16} />
              Restore
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => void restore(e.target.files?.[0])}
              aria-label="Restore bookshelf backup"
            />
          </div>
        </div>
        {message && (
          <div className="notice" role="status">
            <span>{message}</span>
            {deleted && (
              <button
                onClick={() => {
                  try {
                    upsert(deleted);
                    setDeleted(null);
                    setMessage("Your book is back on the shelf.");
                  } catch (e) {
                    setError(String(e));
                  }
                }}
              >
                <Undo2 size={14} /> Undo
              </button>
            )}
            <button onClick={() => setMessage("")} aria-label="Dismiss message">
              <X size={15} />
            </button>
          </div>
        )}
        {error && (
          <div role="alert" className="form-error">
            {error}
          </div>
        )}
        {draft && (
          <div className="draft-banner">
            <PencilLine size={22} />
            <div>
              <strong>{draft}’s next chapter is waiting.</strong>
              <p>Your unfinished book is saved and ready to continue.</p>
            </div>
            <Link to="/make" search={{}} className="text-button">
              Continue draft <ArrowRight size={16} />
            </Link>
          </div>
        )}
        <div className="shelf-toolbar">
          <div className="filter-tabs">
            <button
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={filter === "all" ? "active" : ""}
            >
              All books <span>{list.length}</span>
            </button>
            <button
              onClick={() => setFilter("mine")}
              aria-pressed={filter === "mine"}
              className={filter === "mine" ? "active" : ""}
            >
              Made by you <span>{custom.length}</span>
            </button>
          </div>
          <label className="search-box">
            <Search size={16} />
            <input
              aria-label="Search your bookshelf"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a favorite…"
            />
          </label>
        </div>
        <div className="bookshelf-grid">
          {shown.map((book) => {
            const progress = ready ? getReadingProgress(book.slug) : null;
            return (
              <article className="shelf-book" key={book.slug}>
                <Link
                  to="/read/$slug"
                  params={{ slug: book.slug }}
                  aria-label={`Read ${book.title}`}
                >
                  <BookCover
                    title={book.title}
                    image={book.coverImage}
                    name={book.brief.name}
                    template={book.brief.storyShape?.id}
                  />
                </Link>
                <div className="shelf-book-status">
                  <span>
                    {book.slug === "luna"
                      ? "SAMPLE BOOK"
                      : book.preview
                        ? "PERSONALIZED PREVIEW"
                        : book.illustrated
                          ? "ILLUSTRATED STORY"
                          : "STORY DRAFT"}
                  </span>
                  {progress && progress.index > 1 && (
                    <span className="reading-progress-dot" title="Reading progress saved" />
                  )}
                </div>
                <h2>{book.title}</h2>
                <p>
                  For {book.brief.name} <span>·</span> {book.pages.length} pages
                </p>
                <div className="shelf-book-actions">
                  <Link to="/read/$slug" params={{ slug: book.slug }} className="text-button">
                    <BookOpen size={15} />
                    {progress && progress.index > 0 && progress.index < book.pages.length + 2
                      ? "Keep reading"
                      : "Read book"}
                  </Link>
                  {book.slug !== "luna" && (
                    <>
                      <Link
                        to="/edit/$slug"
                        params={{ slug: book.slug }}
                        className="icon-button"
                        aria-label={`Edit ${book.title}`}
                      >
                        <PencilLine size={17} />
                      </Link>
                      <button
                        className="icon-button"
                        onClick={() => deleteBook(book)}
                        aria-label={`Remove ${book.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
          {!query && filter === "all" && (
            <Link to="/make" search={{}} className="new-book-card">
              <span>
                <Plus size={28} strokeWidth={1.25} />
              </span>
              <h2>
                A story only
                <br />
                <em>you could start.</em>
              </h2>
              <p>
                The next space on your shelf
                <br />
                is waiting for their world.
              </p>
              <span className="text-button">
                Let’s make a book <ArrowRight size={16} />
              </span>
            </Link>
          )}
        </div>
        {!shown.length && (
          <div className="empty-state">
            <BookOpen size={32} />
            <h3>
              {query ? "That story isn’t on this shelf yet." : "Their first story starts here."}
            </h3>
            <p>
              {query
                ? "Try a different title or your child’s name."
                : "Create a personalized book, then make every word your own."}
            </p>
            <Link to="/make" search={{}} className="button primary">
              Create a book <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
