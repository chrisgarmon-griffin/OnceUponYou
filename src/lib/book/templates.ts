export type TemplateQuestion = {
  key: string;
  label: string;
  placeholder: string;
  into: "interests" | "item" | "companionName" | "companionKind" | "companionLook" | "notes";
};

export type StoryTemplate = {
  id: string;
  shelf: "boys" | "girls";
  label: string;
  blurb: string;
  titleHint: string;
  theme: string;
  occasion: string;
  interests: string[];
  item: string;
  companionKind: string;
  hiddenDetail: string;
  job: string;
  beats: string[];
  refrainHint: string;
  questions: TemplateQuestion[];
};

export const BOY_TEMPLATES: StoryTemplate[] = [
  {
    id: "sports-star",
    shelf: "boys",
    label: "Sports star",
    blurb: "The big game. Their number on the shirt. Not an astronaut — a captain.",
    titleHint: "{name} and the Big Game",
    theme: "bravery",
    occasion: "just_because",
    interests: ["soccer", "jersey numbers", "practicing in the backyard"],
    item: "a jersey with their number",
    companionKind: "teammate or scrappy team dog",
    hiddenDetail: "a tiny soccer ball",
    job: "the hero wins the day with a skill they already have, not magic",
    beats: [
      "warm-up in the backyard in their real number",
      "something goes wrong at the game only they can fix",
      "one good play, then home, grass on the knees",
    ],
    refrainHint: "a chant the crowd (and the child) can shout",
    questions: [
      { key: "sport", label: "Which sport", placeholder: "soccer", into: "interests" },
      { key: "team", label: "Team name or colors", placeholder: "blue jays, green and gold", into: "interests" },
      { key: "number", label: "Their number", placeholder: "7", into: "item" },
    ],
  },
  {
    id: "race-day",
    shelf: "boys",
    label: "Race day",
    blurb: "Helmet on. A course that starts at the end of the driveway.",
    titleHint: "{name} and the Red Racer",
    theme: "adventure",
    occasion: "just_because",
    interests: ["race cars", "going fast", "checkered flags"],
    item: "a shiny helmet",
    companionKind: "mechanic mouse or little brother",
    hiddenDetail: "a tiny checkered flag",
    job: "speed is fun; finishing with the people they love is the point",
    beats: [
      "the racer is named and lined up",
      "a stall, a puddle, a missed turn",
      "they finish, helmet under one arm",
    ],
    refrainHint: "vroom, vroom — and go!",
    questions: [
      { key: "vehicle", label: "What do they drive", placeholder: "red go-kart, bike, soapbox car", into: "interests" },
      { key: "color", label: "Racing color", placeholder: "red with a lightning bolt", into: "item" },
    ],
  },
  {
    id: "dinosaur-dig",
    shelf: "boys",
    label: "Dinosaur dig",
    blurb: "A backyard excavation. The fossil has a name they already know.",
    titleHint: "{name} and the Last Dinosaur",
    theme: "curiosity",
    occasion: "just_because",
    interests: ["dinosaurs", "digging", "saying the long names"],
    item: "a khaki explorer hat",
    companionKind: "a small dinosaur who is not extinct after all",
    hiddenDetail: "a tiny plastic stegosaurus",
    job: "the expert is the child who already knows every dinosaur name",
    beats: [
      "the dig starts with the right name, said out loud",
      "the fossil is stuck, or lost, or too big",
      "they find it, and put it back where it belongs",
    ],
    refrainHint: "a stompy sound-word they can roar",
    questions: [
      { key: "dino", label: "Favorite dinosaur", placeholder: "T. rex, stegosaurus, triceratops", into: "interests" },
      { key: "find", label: "What are they digging for", placeholder: "a tooth, an egg, a whole skeleton", into: "notes" },
    ],
  },
  {
    id: "rescue-hero",
    shelf: "boys",
    label: "Rescue hero",
    blurb: "Sirens, boots, a job that needs someone small and brave.",
    titleHint: "{name} and the Rescue",
    theme: "bravery",
    occasion: "just_because",
    interests: ["fire trucks", "sirens", "helping"],
    item: "red firefighter boots",
    companionKind: "dalmatian or station cat",
    hiddenDetail: "a tiny gold fire hydrant",
    job: "the hero does the job the grown-ups cannot reach",
    beats: [
      "the alarm, and they already know what to put on",
      "the problem is stuck somewhere small",
      "rescued, then home, boots by the door",
    ],
    refrainHint: "a siren the child can wail",
    questions: [
      { key: "rig", label: "Fire truck, ambulance, or both", placeholder: "the red fire truck", into: "interests" },
      { key: "save", label: "Who needs rescuing", placeholder: "a cat in a tree, a neighbor's dog", into: "notes" },
    ],
  },
  {
    id: "rocket-captain",
    shelf: "boys",
    label: "Rocket captain",
    blurb: "Only if they actually love space. Helmet, countdown, home by supper.",
    titleHint: "{name} and the Countdown",
    theme: "adventure",
    occasion: "just_because",
    interests: ["rockets", "the moon", "counting down"],
    item: "a white space helmet",
    companionKind: "a round robot or stuffed alien",
    hiddenDetail: "a tiny gold star",
    job: "they fly out and come home — the moon is not where they live",
    beats: [
      "countdown in the backyard",
      "one thing goes wrong in the dark",
      "they land, helmet off, supper waiting",
    ],
    refrainHint: "three, two, one — blast off",
    questions: [
      { key: "where", label: "Where are they flying", placeholder: "the moon, a red planet, the next cloud", into: "interests" },
      { key: "packed", label: "What did they pack", placeholder: "a sandwich, a flashlight, a photo of home", into: "notes" },
    ],
  },
  {
    id: "block-hero",
    shelf: "boys",
    label: "Superhero of the block",
    blurb: "A cape from the linen closet. The emergency is next door.",
    titleHint: "{name} Saves the Block",
    theme: "kindness",
    occasion: "just_because",
    interests: ["superheroes", "capes", "helping neighbors"],
    item: "a cape tied at the neck",
    companionKind: "sidekick sibling or dog",
    hiddenDetail: "a tiny paper mask",
    job: "the power is something they already do — running, noticing, being kind",
    beats: [
      "the cape goes on for a real reason",
      "the 'villain' is a problem, not a person to punch",
      "the block is fine, cape on the hook",
    ],
    refrainHint: "a hero call they invent",
    questions: [
      { key: "power", label: "Power they already have", placeholder: "very fast, notices everything, very loud", into: "notes" },
      { key: "cape", label: "Cape color", placeholder: "blue with a lightning bolt", into: "item" },
    ],
  },
  {
    id: "robot-inventor",
    shelf: "boys",
    label: "Robot inventor",
    blurb: "Cardboard, tape, a machine that almost works.",
    titleHint: "{name} Builds a Robot",
    theme: "curiosity",
    occasion: "just_because",
    interests: ["robots", "building", "buttons that beep"],
    item: "safety goggles",
    companionKind: "the robot itself",
    hiddenDetail: "a tiny spare bolt",
    job: "the invention misbehaves, then helps in the way the child intended",
    beats: [
      "the robot is named and switched on",
      "it does the wrong job, too well",
      "they fix it, together, at the workbench",
    ],
    refrainHint: "beep beep, try again",
    questions: [
      { key: "bot", label: "The robot's name", placeholder: "Clank, Beep, Rusty", into: "companionName" },
      { key: "job", label: "What should it do", placeholder: "tidy the toys, make pancakes, find socks", into: "notes" },
    ],
  },
  {
    id: "shark-patrol",
    shelf: "boys",
    label: "Shark patrol",
    blurb: "Deep water, a boat, a creature they already respect.",
    titleHint: "{name} and the Shark",
    theme: "adventure",
    occasion: "just_because",
    interests: ["sharks", "boats", "the deep sea"],
    item: "yellow snorkel goggles",
    companionKind: "a cautious shark or a brave fish",
    hiddenDetail: "a tiny blue fish",
    job: "the ocean is big; the hero is careful and useful",
    beats: [
      "they go out because something in the water needs them",
      "the shark is not the enemy",
      "back to the dock, salt in their hair",
    ],
    refrainHint: "a watery sound they can swish",
    questions: [
      { key: "creature", label: "Favorite sea creature", placeholder: "great white, orca, sea turtle", into: "interests" },
      { key: "craft", label: "Boat or submarine", placeholder: "a little wooden boat", into: "interests" },
    ],
  },
  {
    id: "backyard-knight",
    shelf: "boys",
    label: "Knight of the backyard",
    blurb: "A cardboard sword. A dragon who turns out to need help.",
    titleHint: "{name} and the Dragon",
    theme: "bravery",
    occasion: "just_because",
    interests: ["knights", "dragons", "cardboard swords"],
    item: "a cardboard sword",
    companionKind: "a dragon who is mostly hungry",
    hiddenDetail: "a tiny gold crown",
    job: "knighthood is noticing who needs help, not swinging first",
    beats: [
      "they knight themselves for a reason",
      "the dragon's problem is ordinary and solvable",
      "home, sword by the door, no one is hurt",
    ],
    refrainHint: "a clank they can shout",
    questions: [
      { key: "weapon", label: "Sword, shield, or both", placeholder: "a cardboard sword", into: "item" },
      { key: "protect", label: "What needs protecting", placeholder: "the sandbox, the dog, the last cookie", into: "notes" },
    ],
  },
  {
    id: "big-machines",
    shelf: "boys",
    label: "Big machines",
    blurb: "Diggers, trains, garbage trucks — the machine does something that matters.",
    titleHint: "{name} and the Giant Digger",
    theme: "adventure",
    occasion: "just_because",
    interests: ["diggers", "trains", "construction"],
    item: "a hard hat",
    companionKind: "site dog or the machine itself",
    hiddenDetail: "a tiny orange cone",
    job: "a machine is stuck or needed; the child who knows it best is the one who helps",
    beats: [
      "the machine arrives, named correctly",
      "it gets stuck, or the job is the wrong size",
      "they finish the job, then watch it rumble away",
    ],
    refrainHint: "a rumble they can do with their mouth",
    questions: [
      { key: "machine", label: "Diggers, trains, or trucks", placeholder: "excavator, freight train, garbage truck", into: "interests" },
      { key: "name", label: "The machine's name, if it has one", placeholder: "Big Yellow, Engine 4", into: "notes" },
    ],
  },
];

export const GIRL_TEMPLATES: StoryTemplate[] = [
  {
    id: "recital",
    shelf: "girls",
    label: "The recital",
    blurb: "Shoes by the door. A dance they have been practicing in the kitchen.",
    titleHint: "{name} and the Recital",
    theme: "bravery",
    occasion: "just_because",
    interests: ["ballet", "dancing in the kitchen", "sparkly shoes"],
    item: "ballet slippers",
    companionKind: "a shy friend in the wings",
    hiddenDetail: "a tiny satin ribbon",
    job: "nerves are allowed; the dance still happens, in their own way",
    beats: [
      "shoes by the door the night before",
      "something on stage is not as practiced",
      "they dance it anyway, then flowers, then home",
    ],
    refrainHint: "a count they can whisper: and one, and two",
    questions: [
      { key: "dance", label: "Ballet, tap, or their own dance", placeholder: "ballet", into: "interests" },
      { key: "costume", label: "Costume color", placeholder: "pale blue tutu", into: "item" },
    ],
  },
  {
    id: "horse-trail",
    shelf: "girls",
    label: "Horse and the trail",
    blurb: "A real horse's name. A path that goes farther than the paddock.",
    titleHint: "{name} and {horse}",
    theme: "adventure",
    occasion: "just_because",
    interests: ["horses", "riding", "braiding manes"],
    item: "riding boots",
    companionKind: "her horse",
    hiddenDetail: "a tiny horseshoe",
    job: "the horse and the girl solve it together; neither is scenery",
    beats: [
      "they greet the horse by the real name",
      "something on the trail is wrong — a gate, a storm, a lost foal",
      "home to the stable, boots off, apple for the horse",
    ],
    refrainHint: "a clop-clop they can tap on the floor",
    questions: [
      { key: "horse", label: "The horse's name", placeholder: "Maple, Pepper, Snow", into: "companionName" },
      { key: "coat", label: "Color of the horse", placeholder: "chestnut with a white star", into: "companionLook" },
    ],
  },
  {
    id: "runs-the-castle",
    shelf: "girls",
    label: "The girl who runs the castle",
    blurb: "A crown, if she wants one. The kingdom has a problem only she can see.",
    titleHint: "{name} of the Little Kingdom",
    theme: "kindness",
    occasion: "just_because",
    interests: ["castles", "crowns", "making rules that are fair"],
    item: "a small gold crown",
    companionKind: "a practical dragon or a court dog",
    hiddenDetail: "a tiny brass key",
    job: "she is not waiting to be rescued; she is the one who decides",
    beats: [
      "the kingdom is ordinary until it is not",
      "a rule is unfair, or someone small is left out",
      "she fixes it, crown optional, supper on time",
    ],
    refrainHint: "a royal phrase she invents",
    questions: [
      { key: "need", label: "What does her kingdom need", placeholder: "a fair rule, a lost feast, a kinder dragon", into: "notes" },
      { key: "wear", label: "Crown, boots, or both", placeholder: "a crown over messy hair", into: "item" },
    ],
  },
  {
    id: "animal-doctor",
    shelf: "girls",
    label: "Animal doctor",
    blurb: "A clinic on the bedroom floor. The patient has a name.",
    titleHint: "{name} the Animal Doctor",
    theme: "kindness",
    occasion: "just_because",
    interests: ["animals", "bandages", "taking care"],
    item: "a toy stethoscope",
    companionKind: "the patient — kitten, bunny, or stuffed bear",
    hiddenDetail: "a tiny bottle of pretend medicine",
    job: "the doctor is the child; the grown-ups fetch towels",
    beats: [
      "clinic open, patient named",
      "the diagnosis is something they already understand (a thorn, a scare, a lost sock)",
      "the patient is better, clinic closed until tomorrow",
    ],
    refrainHint: "a gentle check-up line they can repeat",
    questions: [
      { key: "patient", label: "Who is the patient", placeholder: "a kitten, our goldfish, stuffed rabbit", into: "companionKind" },
      { key: "clinic", label: "Clinic name", placeholder: "Maple Street Animal Hospital", into: "notes" },
    ],
  },
  {
    id: "the-beam",
    shelf: "girls",
    label: "The beam",
    blurb: "Chalk on the hands. A skill they have been drilling in the living room.",
    titleHint: "{name} on the Beam",
    theme: "bravery",
    occasion: "just_because",
    interests: ["gymnastics", "cartwheels", "the balance beam"],
    item: "a leotard",
    companionKind: "a teammate who is a little scared too",
    hiddenDetail: "a tiny piece of chalk",
    job: "falling is in the story; getting back on is the plot",
    beats: [
      "stretching, the way they really stretch",
      "a wobble, or a missed skill, in public",
      "they go again, then the car ride home",
    ],
    refrainHint: "a coach-count they already know",
    questions: [
      { key: "event", label: "Beam, bars, floor, or vault", placeholder: "the balance beam", into: "interests" },
      { key: "leo", label: "Leotard color", placeholder: "navy with a star", into: "item" },
    ],
  },
  {
    id: "kitchen-scientist",
    shelf: "girls",
    label: "Kitchen scientist",
    blurb: "Goggles. A potion that does one surprising, useful thing.",
    titleHint: "{name} and the Kitchen Lab",
    theme: "curiosity",
    occasion: "just_because",
    interests: ["science", "mixing", "asking why"],
    item: "safety goggles",
    companionKind: "a skeptical little brother or a lab mouse",
    hiddenDetail: "a tiny measuring spoon",
    job: "the experiment goes sideways, then solves an ordinary household problem",
    beats: [
      "the lab is the kitchen, and the rules are real",
      "the mixture does too much",
      "they write down what worked, then tidy up",
    ],
    refrainHint: "hypothesis, mix, surprise",
    questions: [
      { key: "mix", label: "What are they mixing", placeholder: "bubbles, color-changing juice, invisible ink", into: "notes" },
      { key: "goggles", label: "Goggles, coat, or both", placeholder: "too-big safety goggles", into: "item" },
    ],
  },
  {
    id: "tide-keeper",
    shelf: "girls",
    label: "Tide keeper",
    blurb: "The ocean as a job, not a costume. She puts something back.",
    titleHint: "{name} and the Tide",
    theme: "kindness",
    occasion: "just_because",
    interests: ["the ocean", "shells", "tide pools"],
    item: "a string of shells",
    companionKind: "a seal, a gull, or a little crab",
    hiddenDetail: "a tiny spiral shell",
    job: "something from the sea is out of place; she is the one who knows where it goes",
    beats: [
      "the shore, as it really looks to her",
      "a creature or a treasure that does not belong where it is",
      "the tide takes it home, and so does she",
    ],
    refrainHint: "a hush-shush of waves",
    questions: [
      { key: "shore", label: "Beach, cove, or tide pool", placeholder: "the tide pool by the rocks", into: "interests" },
      { key: "creature", label: "Who lives there", placeholder: "a hermit crab, a seal, a blue whale", into: "companionKind" },
    ],
  },
  {
    id: "little-atelier",
    shelf: "girls",
    label: "The little atelier",
    blurb: "Making, not shopping. A thing she sews, paints, or builds for someone.",
    titleHint: "{name} Makes a Thing",
    theme: "kindness",
    occasion: "just_because",
    interests: ["making things", "fabric", "paint"],
    item: "a canvas apron",
    companionKind: "a cat who sits on the pattern",
    hiddenDetail: "a tiny button",
    job: "the made thing is for someone specific, and it almost does not work",
    beats: [
      "the worktable, the real tools",
      "a rip, a wrong color, a missing piece",
      "it is given, and it is enough",
    ],
    refrainHint: "pin, stitch, show you",
    questions: [
      { key: "craft", label: "Sewing, painting, or building", placeholder: "sewing a cape, painting a card", into: "interests" },
      { key: "for", label: "Who is it for", placeholder: "Mama, a baby brother, her best friend", into: "notes" },
    ],
  },
  {
    id: "detective",
    shelf: "girls",
    label: "Detective of the house",
    blurb: "A missing thing. A notebook. She notices what grown-ups walked past.",
    titleHint: "{name} and the Missing {thing}",
    theme: "curiosity",
    occasion: "just_because",
    interests: ["mysteries", "notebooks", "noticing"],
    item: "a magnifying glass",
    companionKind: "a partner — dog, sibling, or stuffed owl",
    hiddenDetail: "a tiny paperclip clue",
    job: "the mystery is domestic and solvable; she is the one who sees it",
    beats: [
      "something real is missing",
      "the wrong suspect, then the right clue",
      "found, explained, cocoa",
    ],
    refrainHint: "a detective line: just the facts",
    questions: [
      { key: "missing", label: "What went missing", placeholder: "the red boot, Grandpa's glasses, the class hamster", into: "notes" },
      { key: "tool", label: "Magnifying glass or notebook", placeholder: "a notebook with a pencil", into: "item" },
    ],
  },
  {
    id: "garden-keeper",
    shelf: "girls",
    label: "Garden keeper",
    blurb: "Dirt under the nails. Something that would not grow — until she tried.",
    titleHint: "{name} and the Secret Garden",
    theme: "kindness",
    occasion: "just_because",
    interests: ["gardens", "worms", "watering cans"],
    item: "yellow gardening gloves",
    companionKind: "a bee, a worm, or a robin",
    hiddenDetail: "a tiny watering can",
    job: "growing is slow; she is patient, and then it blooms",
    beats: [
      "the patch of dirt that is hers",
      "nothing comes up, or something hungry arrives",
      "a first leaf, then home with muddy knees",
    ],
    refrainHint: "a watering chant",
    questions: [
      { key: "plant", label: "Favorite plant or bug", placeholder: "sunflowers, strawberries, worms", into: "interests" },
      { key: "grow", label: "What needs growing", placeholder: "a sunflower for Grandma, tomatoes for supper", into: "notes" },
    ],
  },
];

export const ALL_TEMPLATES = [...BOY_TEMPLATES, ...GIRL_TEMPLATES];

export function templateById(id: string | undefined) {
  if (!id) return null;
  return ALL_TEMPLATES.find((t) => t.id === id) ?? null;
}

export function composeFromTemplate(
  template: StoryTemplate,
  answers: Record<string, string>,
) {
  const interests = [...template.interests];
  let item = template.item;
  let companionName = "";
  let companionKind = template.companionKind;
  let companionLook = "";
  const notes: string[] = [];

  for (const q of template.questions) {
    const value = (answers[q.key] || "").trim();
    if (!value) continue;
    if (q.into === "interests") {
      interests.unshift(value);
    } else if (q.into === "item") {
      item = q.key === "number" ? `a jersey with the number ${value}` : value;
      if (q.key === "number") interests.push(`jersey number ${value}`);
    } else if (q.into === "companionName") {
      companionName = value;
    } else if (q.into === "companionKind") {
      companionKind = value;
    } else if (q.into === "companionLook") {
      companionLook = value;
    } else {
      notes.push(`${q.label}: ${value}`);
    }
  }

  const unique = [...new Set(interests)].slice(0, 3);
  return {
    interests: unique.join(", "),
    item,
    companionName,
    companionKind,
    companionLook,
    notes: notes.join(". "),
  };
}
