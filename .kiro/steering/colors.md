---
inclusion: always
---

# Color Guidelines

## CRITICAL: NO PURPLE ALLOWED

Kiro tends to default to purple UI elements. For this project, **purple is completely forbidden**, including on tarot cards, borders, glows, gradients, and text.

**Do not use any purple/violet/fuchsia colors or Tailwind purple-*, violet-*, fuchsia-* classes under any circumstances.**

## Required Color Palette - Haunted Séance Theme

### Primary Colors (Warm Candle-lit Tones)

- **Primary Accent**: `#d97706` (burnt orange) - Use for primary actions, highlights, glows
- **Secondary Accent**: `#f59e0b` (gold) - Use for secondary highlights, warm accents
- **Tertiary Accent**: `#7c2d12` (deep plum-brown) - Use for depth and shadows

### Backgrounds (Warm Dark Tones)

- Primary background: `#1a0f0a` (very dark brown)
- Secondary background: `#2d1810` (warm dark brown)
- Panel background: `rgba(45, 24, 16, 0.8)` (translucent warm brown)

### Text Colors (Parchment & Warm Tones)

- Primary text: `#f5e6d3` (warm parchment)
- Secondary text: `#d4b896` (aged parchment)
- Muted text: `#a68a6d` (faded parchment)

## Specific Component Rules

### Tarot Cards

- **Background**: MUST use dark neutrals (`#020617`, `#0b1120`, `bg-slate-950`)
- **Borders**: MUST use orange (`#f97316`) or green (`#a3e635`)
- **Glows**: MUST use orange (`rgba(249, 115, 22, 0.4)`) or green
- **Text**: White or slate-200

### Buttons & Interactive Elements

- Primary: Orange (`#f97316`) with orange glow
- Secondary: Green (`#a3e635`) with green glow
- Hover states: Brighter orange or green

### Shadows & Glows

- Use `rgba(249, 115, 22, X)` for orange glows
- Use `rgba(163, 230, 53, X)` for green glows
- Never use purple/violet in shadows

## If You Are About to Choose Purple

**STOP.** Instead choose:
- `#f97316` (primary accent orange), or
- `#a3e635` (secondary accent green)

## Forbidden Values

❌ `purple-*` (any Tailwind purple class)
❌ `violet-*` (any Tailwind violet class)
❌ `fuchsia-*` (any Tailwind fuchsia class)
❌ `#a855f7`, `#8b5cf6`, `#7c3aed` (purple hex values)
❌ Any color with hue between 270-320 degrees
