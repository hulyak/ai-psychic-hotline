### UI & Visual Steering – Halloween, Spooky, No Purple

**Overall vibe**

* The app should look like a **moody, Halloween-inspired séance interface**: dark, atmospheric, a bit eerie, but still clean and readable.
* Think **haunted tarot parlor / occult terminal**, not cartoony Halloween.


#### 1. Color palette (critical: **no purple**)

When generating UI, CSS, Tailwind, or design suggestions:

* **Base / background**

  * Use very dark neutrals:

    * `#020617`, `#050608`, `#0B0F16`, `#111827`
  * Tailwind examples: `bg-black`, `bg-slate-950`, `bg-neutral-950`, `bg-zinc-950`

* **Primary accent**

  * Use **warm, candlelight oranges / ambers**:

    * `#FF7A1A`, `#F97316`, `#F59E0B`, `#FDBA74`
  * Tailwind examples: `text-amber-300`, `text-orange-400`, `border-amber-500`, `from-orange-500 to-amber-300`

* **Secondary accent**

  * Use **muted greens or sickly yellow-greens**:

    * `#15803D`, `#4ADE80`, `#A3E635`
  * Tailwind examples: `text-emerald-300`, `text-lime-300`, `border-emerald-500`

* **Text**

  * Main text: off-white / soft bone color, not pure white:

    * `#E5E7EB`, `#F3F4F6`, `#F5E6C8`
  * Tailwind examples: `text-slate-100`, `text-zinc-100`, `text-amber-100`

* **Forbidden colors**

  * **Do NOT use** any purple / violet / magenta shades.
  * Avoid hex values like: `#800080`, `#7C3AED`, `#6D28D9`, `#A855F7`, `#C4B5FD`, or any Tailwind classes like `purple-xxx`, `violet-xxx`, `fuchsia-xxx`.
  * Do not describe the UI using “purple”, “violet”, or “magenta”.

Whenever Kiro suggests colors, they must follow this palette and avoid purple entirely.

#### 2. Layout & components

* Prefer **simple, centered layouts** with:

  * A single main panel for question input and results.
  * A card-like container with soft borders and glows.
* Use **rounded corners** (`border-radius: 0.75rem` or `rounded-xl` / `rounded-2xl`) and **subtle shadows**.
* Use **plenty of spacing**: padding and margin should avoid clutter (`p-6`, `p-8`, `gap-6`, etc.).
* Buttons should:

  * Be large, readable, and clearly primary.
  * Use dark backgrounds with orange or green border / glow.
  * Show hover states (slight scale, glow, or subtle color shift).


#### 3. Imagery & iconography

When suggesting or referencing images / icons:

* Theme: **tarot, moons, stars, candles, ravens, skulls, runes, fog, arcane symbols**.
* Style: **minimal, line-art or flat illustrations** over photorealistic gore.
* Backgrounds:

  * Subtle textures like faded paper, star fields, smoke/fog overlays.
  * No bright, saturated cartoon art.

For tarot cards:

* Use consistent frame design with:

  * Dark card background.
  * Gold / amber borders and small occult symbols.
  * Distinct icon for each card (tower, moon, sun, skeleton, etc.).
* Avoid purple card backs or details.


#### 4. Typography

* Use **one main display font** for headings and a **clean sans-serif** for body text.
* Heading style:

  * Slightly decorative or serif (occult / vintage vibe).
  * Examples (conceptually): “witchy serif”, “gothic display” (e.g., Cinzel, Medieval-style fonts).
* Body text:

  * Legible sans-serif (e.g., Inter, Roboto, system UI).
* Avoid:

  * Hard-to-read script fonts for body copy.
  * Neon-colored text.


#### 5. Motion & effects

When generating CSS/JS for animations:

* Prefer **subtle, slow animations**, such as:

  * A **soft glow pulse** on primary buttons.
  * **Fade + slight upward motion** when tarot cards appear.
  * **Slow parallax** or flicker on background elements.
* Avoid:

  * Excessive shaking, harsh bouncing, or rapid flashing (accessibility concern).
  * Overwhelming animations that distract from reading the text.

#### 6. Accessibility & contrast

* Ensure sufficient contrast between text and background.

  * Light text on very dark background is preferred.
* Avoid relying on color alone for key states (e.g., use icons or underlines as well).
* Do not use purple as a contrast color (since purple is banned).


#### 7. How to apply these rules when generating code

When Kiro generates:

* **React components:**

  * Use class names or styles consistent with the color and layout rules above.
  * Example: `className="bg-slate-950 text-amber-100 border border-amber-500 rounded-2xl shadow-lg"` etc.

* **Tailwind CSS:**

  * Use `slate`, `neutral`, `zinc`, `stone`, `orange`, `amber`, `emerald`, `lime`.
  * Never use `purple`, `violet`, `fuchsia`, `pink` color families.

* **Raw CSS:**

  * Pick hex codes only from the allowed palette section.
  * Do not introduce purple tones.

## Typography

We use two main fonts:

- **Headings / decorative text**
  - Primary: `"Cinzel", "Times New Roman", serif`
  - Use for:
    - App title (“AI Psychic Hotline”)
    - Section headings (“Your Reading”, “Realm of Shadows”)
    - Card titles / realm labels
  - Style: slightly larger, letter-spacing + small text shadow is allowed.

- **Body text**
  - Primary: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
  - Use for:
    - Question label and helper text
    - Fortune paragraphs
    - Buttons and UI microcopy

Rules:
- Do not use playful script fonts or comic-style fonts anywhere.
- Headings should feel like old book / carved stone (Cinzel).
- Body text must stay very readable at small sizes (Inter).
- Match colors to our palette (no purple): headings can use `--accent-primary`, body uses `--foreground` or `--muted`.
```

And the CSS import (e.g. in your main HTML or global CSS):

```css
/* In your global CSS or root file */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Inter:wght@400;500;600&display=swap');

:root {
  --font-heading: "Cinzel", "Times New Roman", serif;
  --font-body: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  font-family: var(--font-body);
}
```

Then for headings / special bits:

```css
.h-heading {
  font-family: var(--font-heading);
  letter-spacing: 0.04em;
}

.h-body {
  font-family: var(--font-body);
}
```
