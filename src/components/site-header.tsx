import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function SiteHeader({ inverted = false }: { inverted?: boolean }) {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-5 py-4 md:px-8 md:py-5">
        <Link
          to="/"
          className={cn(
            "shrink-0 font-display text-lg font-medium tracking-tight md:text-xl",
            inverted ? "text-paper" : "text-ink",
          )}
        >
          Once Upon <em className="italic text-moss">You</em>
        </Link>
        <nav
          className={cn(
            "flex shrink-0 items-center gap-3 text-sm md:gap-5",
            inverted ? "text-paper/70" : "text-muted",
          )}
        >
          <Link
            to="/read/$slug"
            params={{ slug: "luna" }}
            className="hidden hover:text-ink sm:inline"
          >
            Luna&rsquo;s book
          </Link>
          <Link
            to="/make"
            className={cn(
              "rounded-lg px-3 py-2 font-medium",
              inverted ? "bg-paper text-ink" : "bg-moss text-paper",
            )}
          >
            Make a book
          </Link>
        </nav>
      </div>
    </header>
  );
}
