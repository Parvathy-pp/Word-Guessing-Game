# Word Guessing Game

A polished, browser-based word guessing game with five word categories, persistent stats, and keyboard support.

---

## Files

```
hangman/
├── index.html   — page structure and SVG gallows
├── style.css    — dark theme, animations, responsive layout
├── game.js      — all game logic, word bank, state management
└── README.md    — this file
```

---

## How to play

1. Open `index.html` in any modern browser — no server or build step needed.
2. Letters are displayed as `_` blanks. Guess one letter at a time by:
   - **clicking** a letter on the on-screen keyboard, or
   - **typing** on your physical keyboard.
3. A correct guess reveals every instance of that letter. A wrong guess costs one attempt and adds a body part to the gallows.
4. You start with **10 attempts**. The game ends when you complete the word or run out of tries.
5. After each round, click **Play again** or use the **New game** button.
6. Use the **category dropdown** to focus on a specific theme.

---

## Features

| Feature | Detail |
|---|---|
| **5 categories** | Gen Z slang, Animals, Tech & code, Food, Space |
| **60+ words** | Balanced across categories with a hint for each |
| **Persistent stats** | Wins, losses, and streak stored in `localStorage` |
| **SVG gallows** | Body parts appear progressively as attempts decrease |
| **Animations** | Letter reveals, gallows shake on wrong guess, pop-in overlay |
| **Physical keyboard** | Type letters directly — no clicking required |
| **Responsive** | Works on mobile screens down to ~320px |
| **Accessible** | ARIA labels on all interactive elements, visible focus rings |

---

## Customizing the word bank

Words live in `game.js` inside the `WORD_BANK` object. Each entry has a `word` and a `hint`:

```js
"food": [
  { word: "tiramisu", hint: "Italian dessert meaning 'pick me up'" },
  // add more here
],
```

To add a new category:

1. Add a new key and array to `WORD_BANK` in `game.js`.
2. Add a matching `<option>` in the `<select>` inside `index.html`.
3. Add the display label to the `formatCategory()` function in `game.js`.

---

## Adjusting difficulty

Two constants at the top of `game.js` control difficulty:

```js
const MAX_ATTEMPTS = 10;   // total guesses allowed
const BODY_PARTS   = [...]; // 6 parts — shown proportionally across attempts
```

Lower `MAX_ATTEMPTS` for a harder game. The gallows parts will scale automatically.

---

## Clearing saved stats

Stats are saved in the browser's `localStorage`. To reset them, open the browser console and run:

```js
localStorage.removeItem("hm_wins");
localStorage.removeItem("hm_losses");
localStorage.removeItem("hm_streak");
```

Then refresh the page.

---

## Browser support

Works in all evergreen browsers (Chrome, Firefox, Safari, Edge). No dependencies, no build tools, no npm.
