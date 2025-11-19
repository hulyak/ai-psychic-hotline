# AI Psychic Hotline – UI Look & Feel

## 1. Overall concept

The UI should feel like a **candlelit tarot séance** happening on a table:

- The **background** is a dark room.
- The **main panel** feels like a mystical altar or reading table.
- **Tarot cards** glow warmly against the darkness.
- The tone is **eerie, calm, and elegant**, not cartoony.

Absolutely **no purple / violet / magenta** anywhere.

The style should be:

- Minimal, focused, and readable.
- Atmospheric through **color, typography, and subtle glow**, not clutter.

---

## 2. Color system

Use the following design tokens:

```css
:root {
  --background: #0a0a0a;      /* page background (dark room) */
  --foreground: #ededed;      /* default text (soft light) */

  --accent-primary: #f97316;  /* candlelight orange */
  --accent-secondary: #a3e635;/* eerie green */

  --card-base: #7c2d12;       /* warm burnt orange card background */
  --card-inner: #1c1917;      /* darker inner panel */
  --card-text: #fef3c7;       /* “bone” text on cards */

  --muted: #9ca3af;           /* secondary text */
  --border-subtle: #27272a;   /* card & panel separators */
}
````

**Rules:**

* Page background: `--background`.
* Main text: `--foreground`.
* Emphasis, buttons, active states: `--accent-primary` and `--accent-secondary`.
* Tarot cards: use `--card-base`, `--card-inner`, `--card-text`.
* Secondary text / hints: `--muted`.
* Never use purple/violet/fuchsia or Tailwind `purple-*`, `violet-*`, `fuchsia-*`.

---

## 3. Layout and structure

### 3.1 Page layout

Overall layout is **centered** and **constrained**:

* Full viewport background:

  * Solid `--background` with a very subtle radial glow in the center (darker towards edges).
* Main content:

  * A centered column with max width ~`960px`:

    * Header
    * Main “altar” panel (question + cards + fortune)
    * Footer note

Spacing:

* Outer padding: `padding: 2rem 1.5rem` on mobile, more on desktop.
* Vertical gaps: `gap: 1.5rem–2rem` between sections.

### 3.2 Header

A simple, slightly mystical header:

* Title: **“AI Psychic Hotline”**

  * Font: serif / display.
  * Color: `--accent-primary`.
  * Optional subtle text shadow.
* Subtitle: small line of copy, e.g.:

  * “Ask a question. Draw the cards. Hear what the spirits say.”
  * Color: `--muted`.

---

## 4. Main panel (the “altar”)

This is the core area, visually distinct from the background.

### 4.1 Container

* Background: very dark neutral (e.g. `#020617` or `#111827`).
* Border: 1px solid `--border-subtle`.
* Extra highlight: soft outer glow in `rgba(249, 115, 22, 0.25)` (orange).
* Corner radius: `16–24px`.
* Padding: `24–32px` inside.
* Layout:

  * On mobile: stacked vertically (question → cards → fortune).
  * On desktop: two-column layout:

    * Left: question + controls.
    * Right: cards + fortune.

### 4.2 Question area (make this **not boring**)

We do **not** want a plain black-and-white box. The question area should feel like a **magic input field**.

Components:

1. **Label row**

   * Small label text: “Your question”
   * Color: `--muted`.
   * Optionally an icon (e.g. small crystal ball / speech bubble).

2. **Input container**

   * Background: slightly lighter than panel, e.g. `#111827`.
   * Border: 1px solid `--border-subtle`; on focus, border turns `--accent-primary`.
   * Corners: `12px–16px`.
   * Padding: `12–16px` inside.
   * Shadow: very subtle inner or outer shadow to feel inset.

3. **Textarea / input**

   * Full width.
   * Background: transparent (inherit container).
   * Text color: `--foreground`.
   * Placeholder: soft and descriptive, e.g.

     * “Whisper your question to the spirits…”
   * Placeholder color: `--muted`.

4. **Call-to-action button**

   * Text: e.g. “Summon the Reading”.
   * Background: `--accent-primary`.
   * Text color: almost black (`#020617`) or `#111827`.
   * Border radius: `9999px` (pill-shaped).
   * Padding: `0.6rem 1.5rem`.
   * Hover: slightly lighter orange + soft glow.
   * Disabled / loading state:

     * Darker orange, small spinner or text like “Consulting the spirits…”.

5. **Optional voice button**

   * Secondary ghost button with icon only (mic), sitting next to CTA.
   * Border-only style with orange or green outline.

---

## 5. Tarot cards

The cards should visually pop and feel like **physical cards on the table**.

### 5.1 Card layout

* Display as a **horizontal row** that wraps on small screens.
* Gap between cards: `1rem–1.5rem`.
* Align them center.

### 5.2 Card styling

* Size:

  * Aspect ratio: ~`2:3` (e.g. 160×240 or 200×320).
* Background:

  * Outer: `--card-base` (burnt orange).
  * Optional inner rectangle: `--card-inner` to create a framed look.
* Borders:

  * Outer border: `--accent-primary` (orange).
  * Optional thin inner border: `--accent-secondary` (green).
* Text:

  * Card name: `--card-text` (cream) at top.
  * Minor text (e.g. “upright”, “reversed”): `--muted`.
* Effects:

  * Subtle drop shadow (like a real card placed on the table).
  * On hover: small scale-up (`1.03`) + slightly stronger glow in orange/green.

### 5.3 Card states

* **Face up**:

  * Show name and orientation, maybe a simple symbol.
* **Loading / drawing**:

  * You can first show face-down backs (same colors, no text) then flip them via animation.

---

## 6. Fortune area

This is the “output” of the psychic – it should read like a scroll or whispered message.

### 6.1 Container

* Background: slightly lighter than main panel, e.g. `#111827`.
* Border-left: `3–4px` solid `--accent-primary`.
* Corner radius: `12px–16px`.
* Padding: `16–24px`.
* Max width: ~`600px`, centered under cards on mobile, right side on desktop.

### 6.2 Text

* Font: clean sans serif for readability, but allow a slightly decorative serif for the first line.
* Colors:

  * Main fortune text: `--foreground`.
  * Intro line (e.g. “The cards whisper…”): `--accent-primary`.
* Length: assume 3–6 sentences.

### 6.3 Controls

Under the fortune:

* “🔊 Hear the reading” button (if TTS enabled):

  * Ghost button with orange border.
* “New reading” button:

  * Secondary style: dark background, orange border, white text.

---

## 7. States & feedback

### 7.1 Initial state

* Show:

  * Header.
  * Empty question area.
  * Subtle hint text under the button:

    * “Ask about your future, a decision, or something that haunts you…”

* No cards or fortune yet.

* Maybe a **faint, slow-moving background pattern** (stars, mist).

### 7.2 Loading state

After pressing “Summon”:

* Disable question input and CTA.
* Show:

  * Small animated indicator: “Shuffling the deck…” then “Consulting the spirits…”.
  * Optional subtle pulsing glow around the main panel.

### 7.3 Error state

If LLM/API fails:

* Show an error banner inside the altar panel:

  * Background: dark red-tinted neutral (e.g. `#1f2933`).
  * Text: “The spirits are silent. Try again in a moment.”
  * Retry button.

---

## 8. Typography

* **Headings (H1/H2)**

  * Slightly gothic/serif style.
  * Use for:

    * App title.
    * Section titles (e.g. “Your Reading”).
  * Color: `--accent-primary` or `--foreground`.

* **Body text**

  * Clean sans serif.
  * Color: `--foreground`.
  * Secondary info: `--muted`.

* **Buttons**

  * All-caps optional but keep text short and clear.

---

## 9. Responsive behavior

* **Mobile (narrow)**

  * Stack: question → cards → fortune.
  * Center everything with generous padding.
  * Ensure buttons are large enough to tap.

* **Desktop**

  * Use a two-column layout inside the altar panel:

    * Left: question + controls + extra hints.
    * Right: cards at top, fortune below.

---

## 10. Implementation hints for Kiro

When generating React + CSS/Tailwind:

* Use the tokens in this file (`--background`, `--accent-primary`, etc.).
* For Tailwind, approximate with:

  * Backgrounds: `bg-black`, `bg-slate-950`, `bg-neutral-950`.
  * Text: `text-slate-100`, `text-amber-100`.
  * Accents: `text-amber-400`, `border-amber-500`, `text-lime-300`, `border-lime-400`.
* Always:

  * Avoid purple/violet/fuchsia classes.
  * Use shadows and gradients sparingly to suggest glow, not neon chaos.
* The question box must **not** be plain black-and-white; it should follow the styled container guidelines in §4.2.
