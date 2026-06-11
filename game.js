/* ─────────────────────────────────────────────────
   Hangman — game.js
   ───────────────────────────────────────────────── */

// ── Word bank ──────────────────────────────────────
const WORD_BANK = {
  "gen-z": [
    { word: "rizz",      hint: "Effortless charm or charisma" },
    { word: "ohio",      hint: "Internet slang for something wild or cursed" },
    { word: "sigma",     hint: "A lone wolf who doesn't follow the crowd" },
    { word: "skibidi",   hint: "Nonsensical viral YouTube trend" },
    { word: "slay",      hint: "To absolutely nail something" },
    { word: "bussin",    hint: "Really good, especially food" },
    { word: "lowkey",    hint: "Secretly or subtly" },
    { word: "highkey",   hint: "Very obviously or openly" },
    { word: "sus",       hint: "Suspicious — popularized by Among Us" },
    { word: "cap",       hint: "A lie; 'no cap' means for real" },
    { word: "vibe",      hint: "A feeling or atmosphere" },
    { word: "simp",      hint: "Someone who does too much for a crush" },
    { word: "ghosting",  hint: "Suddenly cutting off all communication" },
    { word: "ratioed",   hint: "When replies outnumber likes on a post" },
    { word: "delulu",    hint: "Delusional — but make it cute" },
  ],
  "animals": [
    { word: "axolotl",    hint: "A smiling Mexican salamander that can regrow limbs" },
    { word: "capybara",   hint: "The world's largest rodent, everyone's best friend" },
    { word: "quokka",     hint: "Australia's happiest-looking animal" },
    { word: "narwhal",    hint: "The unicorn of the sea" },
    { word: "pangolin",   hint: "The only mammal covered in scales" },
    { word: "binturong",  hint: "A bearcat that smells like popcorn" },
    { word: "okapi",      hint: "A giraffe relative with zebra-striped legs" },
    { word: "platypus",   hint: "A mammal that lays eggs and has a duck bill" },
    { word: "tardigrade", hint: "A microscopic 'water bear' that survives almost anything" },
    { word: "mantis",     hint: "An insect that can rotate its head 180 degrees" },
    { word: "fossa",      hint: "Madagascar's top predator, related to mongooses" },
    { word: "dugong",     hint: "A sea cow — possibly the origin of mermaid myths" },
  ],
  "tech": [
    { word: "algorithm",  hint: "A step-by-step set of rules to solve a problem" },
    { word: "recursion",  hint: "A function that calls itself" },
    { word: "latency",    hint: "The delay before data starts transferring" },
    { word: "boolean",    hint: "A data type that is either true or false" },
    { word: "kernel",     hint: "The core of an operating system" },
    { word: "webhook",    hint: "A way for apps to send real-time data to each other" },
    { word: "docker",     hint: "A platform for running software in containers" },
    { word: "refactor",   hint: "Restructuring existing code without changing its behavior" },
    { word: "polymorphism", hint: "When one interface represents different types" },
    { word: "token",      hint: "A piece of data used for authentication or parsing" },
    { word: "payload",    hint: "The actual data in a request, not the headers" },
    { word: "cache",      hint: "Stored data for faster future access" },
  ],
  "food": [
    { word: "croissant",  hint: "A flaky, buttery French pastry" },
    { word: "tahini",     hint: "A paste made from ground sesame seeds" },
    { word: "gnocchi",    hint: "Soft Italian potato dumplings" },
    { word: "kimchi",     hint: "Fermented Korean cabbage" },
    { word: "umami",      hint: "The fifth taste — savory and rich" },
    { word: "brioche",    hint: "A very rich, buttery French bread" },
    { word: "tempeh",     hint: "Fermented soybean cake from Indonesia" },
    { word: "ratatouille", hint: "A French Provençal stewed vegetable dish" },
    { word: "miso",       hint: "A Japanese paste made from fermented soybeans" },
    { word: "poutine",    hint: "Canadian fries topped with gravy and cheese curds" },
    { word: "tiramisu",   hint: "Italian dessert meaning 'pick me up'" },
    { word: "sriracha",   hint: "A tangy Thai-American hot sauce" },
  ],
  "space": [
    { word: "nebula",     hint: "A giant cloud of gas and dust where stars are born" },
    { word: "quasar",     hint: "An extremely luminous active galactic nucleus" },
    { word: "parallax",   hint: "The method used to measure nearby star distances" },
    { word: "aphelion",   hint: "The point in an orbit farthest from the sun" },
    { word: "magnetar",   hint: "A neutron star with an incredibly powerful magnetic field" },
    { word: "solstice",   hint: "When Earth's axis tilts most toward or away from the sun" },
    { word: "exoplanet",  hint: "A planet that orbits a star outside our solar system" },
    { word: "singularity", hint: "The point of infinite density at a black hole's center" },
    { word: "albedo",     hint: "How reflective a surface is — the moon has low albedo" },
    { word: "parsec",     hint: "A unit of distance equal to ~3.26 light-years" },
    { word: "perihelion", hint: "The point in an orbit closest to the sun" },
    { word: "corona",     hint: "The outermost layer of the sun's atmosphere" },
  ],
};

// Flatten all words for the "all" option
const ALL_WORDS = Object.values(WORD_BANK).flat();

// Body parts shown in order as attempts decrease
const BODY_PARTS = ["head", "body", "left-arm", "right-arm", "left-leg", "right-leg"];
const MAX_ATTEMPTS = 10;

// ── State ──────────────────────────────────────────
let state = {
  word:         "",
  hint:         "",
  category:     "",
  guessedWord:  [],
  wrongGuesses: [],
  attempts:     MAX_ATTEMPTS,
  gameOver:     false,
  wins:         parseInt(localStorage.getItem("hm_wins")   || "0"),
  losses:       parseInt(localStorage.getItem("hm_losses") || "0"),
  streak:       parseInt(localStorage.getItem("hm_streak") || "0"),
};

// ── DOM refs ───────────────────────────────────────
const wordDisplay   = document.getElementById("word-display");
const keyboard      = document.getElementById("keyboard");
const attemptsLeft  = document.getElementById("attempts-left");
const wrongLetters  = document.getElementById("wrong-letters");
const messageArea   = document.getElementById("message-area");
const hintText      = document.getElementById("hint-text");
const categoryName  = document.getElementById("category-name");
const newGameBtn    = document.getElementById("new-game-btn");
const categorySelect= document.getElementById("category-select");
const statWins      = document.getElementById("wins");
const statLosses    = document.getElementById("losses");
const statStreak    = document.getElementById("streak");

// ── Init ───────────────────────────────────────────
buildKeyboard();
newGame();
updateStatDisplay();

newGameBtn.addEventListener("click", newGame);
categorySelect.addEventListener("change", newGame);

// Keyboard typing support
document.addEventListener("keydown", (e) => {
  if (state.gameOver) return;
  const letter = e.key.toLowerCase();
  if (/^[a-z]$/.test(letter)) handleGuess(letter);
});

// ── New game ───────────────────────────────────────
function newGame() {
  const cat = categorySelect.value;
  const pool = cat === "all" ? ALL_WORDS : WORD_BANK[cat];
  const entry = pool[Math.floor(Math.random() * pool.length)];

  // Determine the category name for display
  const catLabel = cat === "all"
    ? Object.keys(WORD_BANK).find(k => WORD_BANK[k].includes(entry)) || "mixed"
    : cat;

  state.word         = entry.word.toLowerCase();
  state.hint         = entry.hint;
  state.category     = catLabel;
  state.guessedWord  = Array(state.word.length).fill("_");
  state.wrongGuesses = [];
  state.attempts     = MAX_ATTEMPTS;
  state.gameOver     = false;

  resetBodyParts();
  renderWordDisplay();
  renderKeyboard();
  attemptsLeft.textContent = state.attempts;
  wrongLetters.textContent = "—";
  hintText.textContent     = state.hint;
  categoryName.textContent = formatCategory(catLabel);
  messageArea.textContent  = "";
  messageArea.className    = "message-area";

  // Remove any existing overlay
  const existing = document.querySelector(".overlay");
  if (existing) existing.remove();
}

// ── Handle a letter guess ──────────────────────────
function handleGuess(letter) {
  if (state.gameOver) return;
  if (state.guessedWord.includes(letter)) return;
  if (state.wrongGuesses.includes(letter)) return;

  const btn = document.querySelector(`.key[data-letter="${letter}"]`);

  if (state.word.includes(letter)) {
    // Correct
    for (let i = 0; i < state.word.length; i++) {
      if (state.word[i] === letter) state.guessedWord[i] = letter;
    }
    if (btn) btn.classList.add("correct");
    renderWordDisplay();
    setMessage("Nice one!", "info");

    if (!state.guessedWord.includes("_")) {
      endGame(true);
    }
  } else {
    // Wrong
    state.wrongGuesses.push(letter);
    state.attempts--;
    if (btn) btn.classList.add("wrong");
    updateBodyParts();
    attemptsLeft.textContent = state.attempts;
    wrongLetters.textContent = state.wrongGuesses.join("  ") || "—";
    setMessage(`Not in the word. ${state.attempts} left.`, "info");

    // Shake the gallows area
    const gallowsWrap = document.querySelector(".gallows-wrap");
    gallowsWrap.classList.remove("shake");
    void gallowsWrap.offsetWidth;
    gallowsWrap.classList.add("shake");

    if (state.attempts === 0) endGame(false);
  }
}

// ── End game ───────────────────────────────────────
function endGame(won) {
  state.gameOver = true;

  if (won) {
    state.wins++;
    state.streak++;
    localStorage.setItem("hm_wins",   state.wins);
    localStorage.setItem("hm_streak", state.streak);
  } else {
    state.losses++;
    state.streak = 0;
    localStorage.setItem("hm_losses", state.losses);
    localStorage.setItem("hm_streak", "0");
    // Reveal the full word
    state.guessedWord = state.word.split("");
    renderWordDisplay(true);
  }
  updateStatDisplay();

  // Show overlay after brief delay
  setTimeout(() => showOverlay(won), 500);
}

// ── Overlay ────────────────────────────────────────
function showOverlay(won) {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="overlay-card">
      <div class="overlay-emoji">${won ? "🎉" : "💀"}</div>
      <div class="overlay-title">${won ? winTitle() : "You ran out of attempts"}</div>
      <div class="overlay-word">${state.word}</div>
      <div class="overlay-sub">${state.hint}</div>
      <div class="overlay-sub">${
        won
          ? `Streak: ${state.streak} &nbsp;·&nbsp; Wins: ${state.wins}`
          : `Streak reset · Losses: ${state.losses}`
      }</div>
      <button class="overlay-btn" id="overlay-new">Play again</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById("overlay-new").addEventListener("click", () => {
    overlay.remove();
    newGame();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

function winTitle() {
  if (state.streak >= 5) return "On fire! 🔥";
  if (state.streak >= 3) return "Hat trick!";
  return "You got it!";
}

// ── Render word display ────────────────────────────
function renderWordDisplay(reveal = false) {
  wordDisplay.innerHTML = "";
  state.guessedWord.forEach((char, i) => {
    const tile = document.createElement("div");
    tile.className = "letter-tile";

    const charEl = document.createElement("span");
    charEl.className = "letter-char";

    if (char !== "_") {
      charEl.textContent = char;
      // Animate newly revealed letters
      const wasHidden = !reveal && state.word[i] === char
        && state.guessedWord.filter(c => c === char).length === 1;
      charEl.classList.add("revealed");
    } else {
      charEl.textContent = "_";
    }

    const bar = document.createElement("div");
    bar.className = "letter-bar";

    tile.appendChild(charEl);
    tile.appendChild(bar);
    wordDisplay.appendChild(tile);
  });
}

// ── Keyboard ───────────────────────────────────────
function buildKeyboard() {
  "abcdefghijklmnopqrstuvwxyz".split("").forEach(letter => {
    const btn = document.createElement("button");
    btn.className     = "key";
    btn.textContent   = letter;
    btn.dataset.letter= letter;
    btn.setAttribute("aria-label", `Guess letter ${letter}`);
    btn.addEventListener("click", () => handleGuess(letter));
    keyboard.appendChild(btn);
  });
}

function renderKeyboard() {
  document.querySelectorAll(".key").forEach(btn => {
    btn.classList.remove("correct", "wrong");
    btn.disabled = false;
  });
}

// ── Gallows body parts ─────────────────────────────
function updateBodyParts() {
  // Show one body part every ~1.67 wrong guesses (6 parts over ~10 attempts)
  const wrongCount = state.wrongGuesses.length;
  const showCount  = Math.floor((wrongCount / MAX_ATTEMPTS) * BODY_PARTS.length);
  BODY_PARTS.forEach((id, idx) => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("visible", idx < showCount);
  });
}

function resetBodyParts() {
  BODY_PARTS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("visible");
  });
}

// ── Stat display ───────────────────────────────────
function updateStatDisplay() {
  statWins.textContent   = state.wins;
  statLosses.textContent = state.losses;
  statStreak.textContent = state.streak;
}

// ── Helpers ────────────────────────────────────────
function setMessage(text, type = "info") {
  messageArea.textContent = text;
  messageArea.className   = `message-area ${type}`;
}

function formatCategory(cat) {
  const labels = {
    "gen-z":   "Gen Z slang",
    "animals": "Animals",
    "tech":    "Tech & code",
    "food":    "Food",
    "space":   "Space",
  };
  return labels[cat] || cat;
}
