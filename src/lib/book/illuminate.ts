import { paintImage } from "@/lib/engine/story";
import type { Book } from "./types";

let busy = false;

export function isPainting() {
  return busy;
}

export async function illuminateBook(book: Book, onUpdate: (book: Book) => void) {
  if (busy || book.illustrated) return;
  busy = true;
  let current = book;
  try {
    if (!current.sheetImage) {
      const sheet = await paintImage({ data: { kind: "sheet", book: current } });
      if (sheet.ok) {
        current = { ...current, sheetImage: sheet.url };
        onUpdate(current);
      }
    }
    if (!current.coverImage) {
      const cover = await paintImage({ data: { kind: "cover", book: current } });
      if (cover.ok) {
        current = { ...current, coverImage: cover.url };
        onUpdate(current);
      }
    }
    for (let index = 0; index < current.pages.length; index++) {
      if (current.pages[index]?.image) continue;
      const painted = await paintImage({ data: { kind: "page", book: current, pageIndex: index } });
      if (!painted.ok) continue;
      current = {
        ...current,
        pages: current.pages.map((page, i) => (i === index ? { ...page, image: painted.url } : page)),
      };
      onUpdate(current);
    }
    const done = current.pages.every((p) => p.image) && Boolean(current.coverImage);
    if (done) {
      current = { ...current, illustrated: true };
      onUpdate(current);
    }
  } finally {
    busy = false;
  }
}
