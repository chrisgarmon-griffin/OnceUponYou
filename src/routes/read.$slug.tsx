import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookReader } from "@/components/book-reader";
import { LUNA_BOOK } from "@/lib/book/luna";
import { getBook } from "@/lib/book/storage";
import { useBookStore } from "@/lib/book/store";

export const Route = createFileRoute("/read/$slug")({ component: ReadPage });

function ReadPage() {
  const { slug } = Route.useParams();
  const hydrate = useBookStore((s) => s.hydrate);
  const book = useBookStore((s) => {
    if (slug === "luna") return LUNA_BOOK;
    return s.books[slug] ?? getBook(slug);
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!book) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-paper px-6 text-center">
        <h1 className="font-display text-3xl">This copy is not on the shelf.</h1>
        <p className="max-w-md text-muted">It may have been a private printing in another session.</p>
        <Link to="/read/$slug" params={{ slug: "luna" }} className="font-medium text-moss">
          Read Luna&rsquo;s book
        </Link>
      </div>
    );
  }

  return <BookReader book={book} />;
}
