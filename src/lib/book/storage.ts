import type { Book } from "./types";
import { LUNA_BOOK } from "./luna";

const KEY = "ouy.books.v1";

function readAll(): Record<string, Book> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Book>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeAll(books: Record<string, Book>) {
  localStorage.setItem(KEY, JSON.stringify(books));
}

export function getBook(slug: string): Book | null {
  if (slug === "luna") return LUNA_BOOK;
  return readAll()[slug] ?? null;
}

export function saveBook(book: Book) {
  const all = readAll();
  all[book.slug] = book;
  writeAll(all);
}

export function listCustomBooks(): Book[] {
  return Object.values(readAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
