import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ART_STYLES, OCCASIONS, THEMES } from "@/lib/book/config";
import { BOY_TEMPLATES, GIRL_TEMPLATES, composeFromTemplate, templateById } from "@/lib/book/templates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BriefInput } from "@/lib/book/brief";
import type { StoryTemplate } from "@/lib/book/templates";

type Shelf = "boys" | "girls" | "own";

export function AtelierForm({
  onSubmit,
  busy,
  error,
  onShapeChange,
}: {
  onSubmit: (input: BriefInput) => void;
  busy: boolean;
  error: string | null;
  onShapeChange?: (template: StoryTemplate | null, title: string) => void;
}) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("4");
  const [pronouns, setPronouns] = useState("she");
  const [shelf, setShelf] = useState<Shelf>("girls");
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [interests, setInterests] = useState("");
  const [occasion, setOccasion] = useState("just_because");
  const [theme, setTheme] = useState("adventure");
  const [style, setStyle] = useState("watercolor");
  const [hair, setHair] = useState("");
  const [skin, setSkin] = useState("");
  const [item, setItem] = useState("");
  const [hometown, setHometown] = useState("");
  const [companionName, setCompanionName] = useState("");
  const [companionKind, setCompanionKind] = useState("");
  const [companionLook, setCompanionLook] = useState("");
  const [fromName, setFromName] = useState("");
  const [readerNotes, setReaderNotes] = useState("");

  const templates = shelf === "boys" ? BOY_TEMPLATES : shelf === "girls" ? GIRL_TEMPLATES : [];
  const picked = templateById(templateId ?? undefined);

  const liveTitle = useMemo(() => {
    const n = name.trim() || "Your child";
    if (picked) return picked.titleHint.replace("{name}", n).replace("{horse}", answers.horse || "Maple");
    return `${n} and the Very Big Job`;
  }, [name, picked, answers.horse]);

  function selectShelf(next: Shelf) {
    setShelf(next);
    setTemplateId(null);
    setAnswers({});
    setItem("");
    setCompanionName("");
    setCompanionKind("");
    setCompanionLook("");
    setTheme("adventure");
    setOccasion("just_because");
    onShapeChange?.(null, name.trim() ? `${name.trim()} and the Very Big Job` : "A book that could only be theirs");
  }

  function selectTemplate(t: StoryTemplate) {
    setTemplateId(t.id);
    setAnswers({});
    setTheme(t.theme);
    setOccasion(t.occasion);
    setItem(t.item);
    setCompanionKind(t.companionKind);
    onShapeChange?.(t, t.titleHint.replace("{name}", name.trim() || "Your child"));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    let mergedInterests = interests;
    let mergedItem = item;
    let mergedCompanionName = companionName;
    let mergedCompanionKind = companionKind;
    let mergedCompanionLook = companionLook;
    let mergedNotes = readerNotes;

    if (picked) {
      const composed = composeFromTemplate(picked, answers);
      mergedInterests = composed.interests;
      mergedItem = item || composed.item;
      mergedCompanionName = companionName || composed.companionName;
      mergedCompanionKind = companionKind || composed.companionKind;
      mergedCompanionLook = companionLook || composed.companionLook;
      mergedNotes = [composed.notes, readerNotes].filter(Boolean).join(". ");
    }

    onSubmit({
      name,
      age,
      pronouns,
      interests: mergedInterests,
      occasion,
      theme,
      style,
      hair,
      skin,
      item: mergedItem,
      hometown,
      companionName: mergedCompanionName,
      companionKind: mergedCompanionKind,
      companionLook: mergedCompanionLook,
      fromName,
      readerNotes: mergedNotes,
      templateId: picked?.id,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8" noValidate>
      <fieldset>
        <legend className="font-display text-xl">What is this book about</legend>
        <p className="mt-1 text-sm text-muted">
          Sports star, not astronaut, if that is the truth. Any child may pick from either shelf — or write a brief of
          your own.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["girls", "Stories girls ask for"],
              ["boys", "Stories boys ask for"],
              ["own", "Write our own"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => selectShelf(id)}
              className={cn(
                "min-h-11 rounded-lg px-4 text-sm font-medium transition-colors",
                shelf === id ? "bg-moss text-paper" : "border border-line bg-paper text-ink hover:bg-paper-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {shelf !== "own" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTemplate(t)}
              className={cn(
                "rounded-lg border px-3.5 py-3 text-left transition-colors",
                templateId === t.id
                  ? "border-moss bg-paper-2"
                  : "border-line bg-paper hover:border-moss/40 hover:bg-paper-2/70",
              )}
            >
              <p className="font-display text-[1.05rem] leading-tight">{t.label}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{t.blurb}</p>
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-[1fr_5.5rem_8.5rem]">
        <Field label="Child's name">
          <input
            required
            maxLength={30}
            value={name}
            onChange={(e) => {
              const next = e.target.value;
              setName(next);
              if (picked) {
                onShapeChange?.(
                  picked,
                  picked.titleHint
                    .replace("{name}", next.trim() || "Your child")
                    .replace("{horse}", answers.horse || "Maple"),
                );
              }
            }}
            placeholder="Luna"
            className={fieldClass}
            autoComplete="off"
          />
        </Field>
        <Field label="Age">
          <input
            required
            type="number"
            min={1}
            max={12}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Pronouns">
          <select value={pronouns} onChange={(e) => setPronouns(e.target.value)} className={fieldClass}>
            <option value="she">she / her</option>
            <option value="he">he / him</option>
            <option value="they">they / them</option>
          </select>
        </Field>
      </div>

      {picked && (
        <div className="grid gap-4 rounded-xl border border-line bg-paper-2/60 p-5">
          <p className="font-display text-lg">A few things only you know</p>
          {picked.questions.map((q) => (
            <Field key={q.key} label={q.label}>
              <input
                value={answers[q.key] || ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.key]: e.target.value }))}
                placeholder={q.placeholder}
                className={fieldClass}
              />
            </Field>
          ))}
          <Field label="If someone always comes along, their real name">
            <input
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              placeholder="Biscuit, or leave blank"
              className={fieldClass}
            />
          </Field>
        </div>
      )}

      {shelf === "own" && (
        <div className="grid gap-4">
          <Field
            label="What can they not stop talking about"
            hint="The first thing becomes the plot. Be specific."
          >
            <input
              required={shelf === "own"}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="garbage trucks, our dog Biscuit, jumping in puddles"
              className={fieldClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Who never leaves their side">
              <input
                value={companionName}
                onChange={(e) => setCompanionName(e.target.value)}
                placeholder="Name"
                className={fieldClass}
              />
            </Field>
            <Field label="Who are they">
              <input
                value={companionKind}
                onChange={(e) => setCompanionKind(e.target.value)}
                placeholder="scruffy brown dog"
                className={fieldClass}
              />
            </Field>
            <Field label="Look">
              <input
                value={companionLook}
                onChange={(e) => setCompanionLook(e.target.value)}
                placeholder="one floppy ear"
                className={fieldClass}
              />
            </Field>
          </div>
          <Field label="What should happen in this story, in one sentence">
            <textarea
              value={readerNotes}
              onChange={(e) => setReaderNotes(e.target.value)}
              placeholder="She is nervous about the baby. The truck gets stuck and only she can help."
              rows={3}
              className={cn(fieldClass, "resize-y")}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Why this book">
              <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={fieldClass}>
                {OCCASIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Feeling">
              <select value={theme} onChange={(e) => setTheme(e.target.value)} className={fieldClass}>
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-line bg-paper-2/60 p-5">
        <p className="font-display text-lg">So they look like themselves</p>
        <p className="mt-1 text-sm text-muted">Same hair, same boots, same companion — on every page.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Hair">
            <input
              value={hair}
              onChange={(e) => setHair(e.target.value)}
              placeholder="curly dark brown hair in two puffs"
              className={fieldClass}
            />
          </Field>
          <Field label="Something they always wear">
            <input
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder={picked?.item || "yellow rain boots"}
              className={fieldClass}
            />
          </Field>
          <Field label="Skin">
            <input
              value={skin}
              onChange={(e) => setSkin(e.target.value)}
              placeholder="light brown"
              className={fieldClass}
            />
          </Field>
          <Field label="Home, if it matters">
            <input
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              placeholder="a blue house on Maple Street"
              className={fieldClass}
            />
          </Field>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Paint">
          <select value={style} onChange={(e) => setStyle(e.target.value)} className={fieldClass}>
            {ART_STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="From">
          <input
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            placeholder="Love, Grandma Jo"
            className={fieldClass}
          />
        </Field>
      </div>

      {picked && (
        <Field label="Anything else — a new baby, a first day, a fear to honor">
          <textarea
            value={readerNotes}
            onChange={(e) => setReaderNotes(e.target.value)}
            placeholder="Baby brother Theo arrives next month."
            rows={2}
            className={cn(fieldClass, "resize-y")}
          />
        </Field>
      )}

      {shelf !== "own" && (
        <Field label="Is this for a particular moment">
          <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className={fieldClass}>
            {OCCASIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      )}

      {error && (
        <p className="rounded-lg bg-ink/90 px-4 py-3 text-sm text-paper" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={busy || (shelf !== "own" && !picked)}>
          {busy ? "Setting the type…" : "Write the book"}
        </Button>
        <p className="text-sm text-muted">{liveTitle}</p>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm text-muted">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

const fieldClass =
  "min-h-11 w-full rounded-lg border border-line bg-paper px-3 text-[0.95rem] text-ink outline-none transition-shadow placeholder:text-muted/70 focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-moss)_35%,transparent)]";
