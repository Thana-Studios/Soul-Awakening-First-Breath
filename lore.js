// ============================================================
//  SOUL AWAKENING — LORE SYSTEM
//  Drop this file into your project and add:
//    <script src="lore.js"></script>
//  in index.html BEFORE script.js
// ============================================================

// ─────────────────────────────────────────────
//  REALM DEFINITIONS
//  Each realm has: a name, a poetic title, a
//  description shown in the Inner Eye, and the
//  colour accent used in the UI.
// ─────────────────────────────────────────────
const REALMS = [
  {
    id: 0,
    name: "Awaiting Birth",
    title: "The Void Before",
    color: "#888",
    description:
      "You have not yet drawn breath. You are neither alive nor dead — merely a thread of will suspended between one life and the next, waiting for Heaven to grant you form.",
  },
  {
    id: 1,
    name: "Mortal Shell",
    title: "Body of Dust",
    color: "#c8a96e",
    description:
      "The lowest rung. You breathe, you bleed, you age. Heaven does not yet acknowledge your existence. And yet — something stirs behind your eyes that should not be there.",
  },
  {
    id: 2,
    name: "Qi Awakening",
    title: "First Breath of the Dao",
    color: "#7ec8a0",
    description:
      "The world's energy answers you for the first time. A river of invisible force flows through your meridians, fragile as morning frost. Most mortals die having never felt this. You have only just begun.",
  },
  {
    id: 3,
    name: "Foundation Forging",
    title: "Roots Beneath Stone",
    color: "#5fa8d3",
    description:
      "You have tempered your dantian into something that will not shatter easily. The Qi that once trembled now sits still as a mountain lake. Elders would call this promising. Rivals would call it threatening.",
  },
  {
    id: 4,
    name: "Core Condensation",
    title: "Heart of Still Water",
    color: "#a07fd4",
    description:
      "A golden core crystallises at the centre of your being — dense, luminous, humming with suppressed power. To reach this stage is to step outside the lifespan of ordinary men. The world begins to feel smaller.",
  },
  {
    id: 5,
    name: "Soul Refinement",
    title: "Fire That Burns Inward",
    color: "#e05c5c",
    description:
      "You turn cultivation inward, burning away impurity in the soul itself. The process is agony. The old you does not survive it intact. What emerges is something harder, stranger, and far more difficult to kill.",
  },
  {
    id: 6,
    name: "Nascent Divinity",
    title: "The Infant God",
    color: "#f0c040",
    description:
      "A second self is born within you — a nascent spirit, a god-seed. It watches through your eyes and does not entirely share your morals. Sects whisper prayers against cultivators at this stage. They are not wrong to fear.",
  },
  {
    id: 7,
    name: "Void Transcendence",
    title: "Between Heaven and Ruin",
    color: "#e8e8ff",
    description:
      "You have partially stepped outside the laws of the mortal world. Space bends around your intent. Time hesitates at your presence. You are no longer entirely here — and that is precisely what makes you dangerous.",
  },
  {
    id: 8,
    name: "Celestial Sovereign",
    title: "One Who Rewrites Heaven",
    color: "#fff7a0",
    description:
      "Legends speak of cultivators who carved their names into the Dao itself. You stand at the precipice of becoming one of them. The heavens have noticed. They are not pleased.",
  },
  {
    id: 9,
    name: "Eternal Dao",
    title: "The Final Breath",
    color: "#ffffff",
    description:
      "You have become something that has no name in any mortal tongue. The cycle of birth and death no longer applies to you. Whether this is enlightenment or simply a different kind of prison — that is a question only you can answer, across however many eternities remain.",
  },
];

// ─────────────────────────────────────────────
//  CULTIVATE (MEDITATE) FLAVOUR LINES
//  Rotate through these when the player meditates.
// ─────────────────────────────────────────────
const CULTIVATE_LINES = [
  "You sink into stillness. The Qi of heaven and earth flows through you like a river finding its old course.",
  "Hours pass like seconds. When you surface, your dantian is fuller, and the ache in your bones is a little less familiar.",
  "The world outside falls silent. Inside, something ancient and patient begins to stir.",
  "You breathe in. The air tastes of iron and possibility. You breathe out. Dust and doubt leave with it.",
  "Your meridians burn with the effort of refinement. This is what cultivation is — not grace, but endurance.",
  "A single leaf falls outside. By the time it touches the ground, you have drawn one more thread of Qi into yourself.",
  "The technique your master once called 'crude' serves you faithfully. Perhaps one day you will find a better one. Today is not that day.",
  "Silence is a discipline. You are learning it slowly.",
  "The Qi resists. You persist. That is the entirety of the Dao, made small enough to hold in a breath.",
  "Somewhere far above, Heaven watches cultivators the way a river watches stones — without pity, without malice, simply waiting to see what endures.",
  "You feel the edges of your dantian expand, just slightly. Each session is a fraction. Fractions become realms.",
  "The meditation brings no visions, no epiphanies — just the quiet accumulation of power that will one day mean the difference between life and death.",
  "A cold clarity settles over your thoughts. You are not meditating to find peace. You are meditating to survive.",
  "The world does not care that you cultivate. But it will care what you become.",
  "Pain is data. You process it and return to the breath.",
];

// ─────────────────────────────────────────────
//  EXPLORE EVENT POOL
//  Each event: a message string and optional
//  tag ("good", "bad", "neutral", "combat")
// ─────────────────────────────────────────────
const EXPLORE_EVENTS = [
  // ── Spirit Stone finds ──
  {
    tag: "good",
    msg: "Wedged between two roots, half-buried and humming faintly — a Spirit Stone. Someone lost it. Their loss.",
  },
  {
    tag: "good",
    msg: "The ruins of a collapsed sect litter the hillside. Most of it is rubble and bones. One of the bones is clutching a Spirit Stone.",
  },
  {
    tag: "good",
    msg: "A merchant's cart has overturned on the mountain path. The merchant is gone. The Spirit Stones are not.",
  },
  {
    tag: "good",
    msg: "You find a vein of low-grade ore that most cultivators would overlook. You are not most cultivators.",
  },
  {
    tag: "good",
    msg: "A spirit beast nest, long abandoned. Nestled in the dried grass — three small Spirit Stones, residue from whatever creature once slept here.",
  },

  // ── Encounters ──
  {
    tag: "combat",
    msg: "A robed figure steps onto the path and levels a blade at you. 'Your resources or your life.' You choose a third option.",
  },
  {
    tag: "combat",
    msg: "You enter a clearing and find another cultivator already there, meditating. They open one eye. It does not go well for one of you.",
  },
  {
    tag: "combat",
    msg: "The bandit's first mistake was underestimating your cultivation. His second mistake was not running after the first exchange.",
  },
  {
    tag: "combat",
    msg: "A sect disciple with an arrogant mouth and a golden token at his waist challenges you on principle. Principles are rarely good armour.",
  },
  {
    tag: "bad",
    msg: "You encounter a cultivator of greater power. They look at you the way a storm looks at a candle. You retreat. Wisely.",
  },

  // ── Lore / neutral discoveries ──
  {
    tag: "neutral",
    msg: "You find a stone stele half-swallowed by the earth. The inscription reads: 'Those who sought heaven found only its ceiling.' The author's name has been worn away.",
  },
  {
    tag: "neutral",
    msg: "An old hermit watches you pass from the shadow of a cave. He does not speak. His cultivation is beyond your ability to gauge. You walk faster.",
  },
  {
    tag: "neutral",
    msg: "The mountain path splits. You take the narrower fork. It takes longer. But the view from the ridge is worth something, even if Heaven won't grant Qi for scenery.",
  },
  {
    tag: "neutral",
    msg: "You pass the graves of three cultivators. No names. No dates. Just stones, and the grass that has already half-forgiven the ground for covering them.",
  },
  {
    tag: "neutral",
    msg: "A spirit beast watches you from the treeline — massive, ancient, utterly disinterested. It turns and disappears. You exhale.",
  },
  {
    tag: "neutral",
    msg: "You discover the ruins of a cultivation manual, its ink long faded. A single line survives: 'The Dao does not reward the worthy. It rewards the stubborn.'",
  },
  {
    tag: "neutral",
    msg: "Children from a nearby village stare at you as you pass. One tugs another's sleeve and whispers something. They both run.",
  },
  {
    tag: "neutral",
    msg: "The air at this altitude is thin and cold and absolutely saturated with ambient Qi. You breathe it in and feel your meridians ache pleasantly.",
  },

  // ── Bad luck ──
  {
    tag: "bad",
    msg: "A formation trap, old and half-decayed, triggers beneath your foot. It drains a thread of Qi before sputtering out. Whoever set it has been dead for centuries.",
  },
  {
    tag: "bad",
    msg: "You push too deep into unfamiliar territory. Something large begins following you. You don't look back. You just walk faster, and then faster still.",
  },
  {
    tag: "bad",
    msg: "A cursed inscription flares to life as you pass. Your foundation trembles for a moment — like a tower struck by wind. It steadies. But the warning is noted.",
  },
];

// ─────────────────────────────────────────────
//  BREAKTHROUGH MESSAGES
// ─────────────────────────────────────────────
const BREAKTHROUGH_SUCCESS = [
  (realm) =>
    `The dam breaks. Qi floods every meridian at once and you scream without sound. When it ends, you stand in the ${realm}. The world looks different from here.`,
  (realm) =>
    `Heaven relents. A crack runs through the ceiling of your old self and light pours through. You have entered the ${realm}. You will not be returning to who you were.`,
  (realm) =>
    `Something inside you that was always too small finally grows to fit. ${realm} — a name you will carry until you outgrow it too.`,
  (realm) =>
    `The breakthrough is neither graceful nor painless. But it is successful. You rise, blood on your lips and a new fire in your dantian. ${realm}. It suits you.`,
  (realm) =>
    `The heavens make no announcement. No thunder, no divine light. Only a profound and sudden silence — and then the absolute certainty that you have become something more. ${realm}.`,
];

const BREAKTHROUGH_FAILURE = [
  "The Qi backlashes. Your meridians contract violently and you are thrown backward into your own skin, smaller than before. The realm holds its door shut.",
  "You push against the barrier with everything you have. The barrier does not care. It was here before you were born and will be here after. Today is not your day.",
  "A hairline fracture runs through your dantian. You feel it like a crack in cold glass. You pull back before it shatters. Humiliating. Necessary. Try again when the wound closes.",
  "The heavens test you and find you wanting. Not permanently — but for now, the door to the next realm is sealed against you. Cultivation is patience wearing the mask of ambition.",
  "Your foundation holds, but only just. The breakthrough attempt has left you shaken and your Qi reserves depleted. Retreat. Recover. Heaven is not merciful to those who rush.",
  "The energy tears through your meridians like a river breaking its banks, except there is no fertile plain on the other side — only pain. You survive. You have not yet broken through.",
];

// ─────────────────────────────────────────────
//  DEATH / REINCARNATION MESSAGES
// ─────────────────────────────────────────────
const DEATH_LINES = [
  "Time runs out. Your body fails quietly, without ceremony — a candle at the end of its wick. But the soul does not end. It turns, and begins again.",
  "The Great Cycle completes. You had a name, a realm, a small fire of power. All of it dissolves into the river of rebirth. In the current, there is no grief — only momentum.",
  "You die as most cultivators do: not in glorious battle, but simply out of time. The path was real. The footsteps remain. Another version of you will find them.",
  "Heaven reclaims what it lent you. The Qi disperses. The body stills. But somewhere in the vast dark between lives, a thread of will refuses to unravel entirely. It remembers.",
  "The hourglass empties. You have lived one life in the pursuit of something most mortals never even name. That is not nothing. It is, in fact, everything. Begin again.",
  "Death arrives not as an enemy but as a formality — the universe closing a tab. You have already left the table. The next life is already sitting down.",
];

// ─────────────────────────────────────────────
//  ASCEND (PRE-ATTEMPT) FLAVOUR
//  Shown briefly before the breakthrough resolves.
// ─────────────────────────────────────────────
const ASCEND_ATTEMPT_LINES = [
  "You gather every thread of Qi in your dantian, pull it inward, and push — against the barrier, against yourself, against the ceiling Heaven built to keep mortals small.",
  "This is the moment every cultivator fears and craves in equal measure. You close your eyes. You push.",
  "The technique requires absolute will. You supply it, teeth clenched, veins burning, the world narrowing to a single point of intent.",
  "You have prepared for this. You have cultivated, suffered, and endured. Now comes the reckoning.",
  "The barrier between realms is not stone or steel — it is the resistance of the Dao itself, testing whether you deserve to stand one step higher. You answer.",
];

// ─────────────────────────────────────────────
//  HELPER UTILITIES
// ─────────────────────────────────────────────

/** Pick a random item from an array */
function loreRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Cycle index tracker so cultivate lines don't repeat too soon */
let _cultivateIndex = Math.floor(Math.random() * CULTIVATE_LINES.length);
function nextCultivateLine() {
  const line = CULTIVATE_LINES[_cultivateIndex];
  _cultivateIndex = (_cultivateIndex + 1) % CULTIVATE_LINES.length;
  return line;
}

/** Get realm data by name or index */
function getRealmData(nameOrIndex) {
  if (typeof nameOrIndex === "number")
    return REALMS[nameOrIndex] || REALMS[0];
  return REALMS.find((r) => r.name === nameOrIndex) || REALMS[0];
}

// ─────────────────────────────────────────────
//  PUBLIC API
//  Call these from script.js wherever you want
//  lore to appear. Each returns a string.
// ─────────────────────────────────────────────

/**
 * Call this when the player meditates / cultivates.
 * Returns a flavour string.
 */
function loreCultivate() {
  return nextCultivateLine();
}

/**
 * Call this when the player explores.
 * Returns an object: { tag, msg }
 * tag is "good" | "bad" | "neutral" | "combat"
 */
function loreExplore() {
  return loreRandom(EXPLORE_EVENTS);
}

/**
 * Call this BEFORE resolving the breakthrough roll.
 * Returns a short "attempt" flavour string.
 */
function loreAscendAttempt() {
  return loreRandom(ASCEND_ATTEMPT_LINES);
}

/**
 * Call this AFTER a successful breakthrough.
 * Pass the new realm name as a string.
 * Returns a flavour string.
 */
function loreBreakthroughSuccess(newRealmName) {
  const fn = loreRandom(BREAKTHROUGH_SUCCESS);
  return fn(newRealmName);
}

/**
 * Call this AFTER a failed breakthrough.
 * Returns a flavour string.
 */
function loreBreakthroughFailure() {
  return loreRandom(BREAKTHROUGH_FAILURE);
}

/**
 * Call this when the player runs out of lifespan.
 * Returns a flavour string.
 */
function loreDeath() {
  return loreRandom(DEATH_LINES);
}

/**
 * Returns the full realm object for the Inner Eye panel.
 * Pass realm name (string) or realm index (number).
 *
 * Example usage in script.js:
 *   const r = loreGetRealm(currentRealmIndex);
 *   document.getElementById("realm-display").textContent = r.name;
 *   // then populate Inner Eye with r.title and r.description
 */
function loreGetRealm(nameOrIndex) {
  return getRealmData(nameOrIndex);
}

/**
 * Builds the Inner Eye stat list HTML with realm lore.
 * Call this wherever you currently populate #extra-stats.
 * Pass the current realm index (number).
 */
function loreRenderInnerEye(realmIndex) {
  const realm = getRealmData(realmIndex);
  const list = document.getElementById("extra-stats");
  if (!list) return;

  // Inject realm lore block at the top
  const existing = list.querySelector(".lore-realm-block");
  if (existing) existing.remove();

  const block = document.createElement("li");
  block.className = "lore-realm-block";
  block.innerHTML = `
    <div class="lore-realm-title" style="color:${realm.color}; font-family:'Cinzel',serif; font-size:0.85rem; margin-bottom:4px;">
      ✦ ${realm.title} ✦
    </div>
    <div class="lore-realm-desc" style="font-size:0.78rem; color:#b0a090; line-height:1.55; font-style:italic;">
      ${realm.description}
    </div>
  `;
  list.prepend(block);
}