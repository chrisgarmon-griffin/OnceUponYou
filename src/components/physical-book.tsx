import { Link } from "@tanstack/react-router";
import { LUNA_BOOK } from "@/lib/book/luna";

export function PhysicalBook({
  title = LUNA_BOOK.title,
  cover = LUNA_BOOK.coverImage || "/books/luna/cover.jpg",
  slug = "luna",
  caption = "Open the book",
}: {
  title?: string;
  cover?: string;
  slug?: string;
  caption?: string;
}) {
  return (
    <Link to="/read/$slug" params={{ slug }} className="block focus-visible:outline-none">
      <div className="group relative mx-auto w-full max-w-[28rem] [perspective:1400px]">
        <div className="relative aspect-square origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(-18deg)_rotateZ(-2deg)] group-hover:[transform:rotateY(-8deg)_rotateZ(-1deg)]">
          <div className="book-shadow absolute inset-0 overflow-hidden rounded-[4px_18px_18px_4px] bg-paper-2">
            <img src={cover} alt="" className="size-full object-cover" draggable={false} />
            <div className="absolute inset-y-0 left-0 w-3 bg-linear-to-r from-ink/25 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-br from-paper/20 via-transparent to-ink/10" />
            <div className="absolute inset-x-8 top-[9%] text-center">
              <p className="font-display text-[clamp(1.4rem,4.2vw,2.15rem)] leading-[1.05] font-semibold tracking-tight text-ink [text-shadow:0_1px_0_rgba(244,239,230,0.7)]">
                {title}
              </p>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-5 text-center font-display text-sm tracking-wide text-muted">{caption}</p>
    </Link>
  );
}
