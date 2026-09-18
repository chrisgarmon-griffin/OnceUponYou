import { create } from "zustand";
import { LUNA_BOOK } from "./luna";
import { getBook, listCustomBooks, saveBook } from "./storage";
import type { Book } from "./types";

type BookStore = {
  books: Record<string, Book>;
  hydrate: () => void;
  upsert: (book: Book) => void;
  find: (slug: string) => Book | null;
};

export const useBookStore = create<BookStore>((set, get) => ({
  books: { luna: LUNA_BOOK },
  hydrate: () => {
    const extra = Object.fromEntries(listCustomBooks().map((b) => [b.slug, b]));
    set({ books: { luna: LUNA_BOOK, ...extra } });
  },
  upsert: (book) => {
    set((state) => ({ books: { ...state.books, [book.slug]: book } }));
    if (book.slug !== "luna") saveBook(book);
  },
  find: (slug) => {
    if (slug === "luna") return LUNA_BOOK;
    return get().books[slug] || getBook(slug);
  },
}));
