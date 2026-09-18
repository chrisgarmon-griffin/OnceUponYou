# Once Upon You

A small press for one child. Personalized picture books that could only be about them — their dog, their street, the thing they cannot stop talking about this month.

Not a name dropped into a template. The child is the plot.

## What it is

- Read **Luna and the Very Big Job** — a finished twelve-page picture book, same girl on every page.
- Commission a book from twenty story shapes (sports star, detective, recital…) or a short brief of your own.
- Stories are written to age, then painted from a locked character sheet so the hero stays consistent.

## Run it

```bash
npm install
cp .env.example .env
# add XAI_API_KEY if you want new books written and illustrated
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

Without an API key, Luna's book is fully painted and ready. New commissions can still set type from a fallback sample.

## Stack

TanStack Start, React 19, Vite, Tailwind v4. Auth and a database are intentionally off until there is something worth saving.

## Story shapes

**Girls ask for:** the recital, horse and the trail, the girl who runs the castle, animal doctor, the beam, kitchen scientist, tide keeper, the little atelier, detective of the house, garden keeper.

**Boys ask for:** sports star, race day, dinosaur dig, rescue hero, rocket captain, superhero of the block, robot inventor, shark patrol, knight of the backyard, big machines.

Any child may pick from either shelf.
