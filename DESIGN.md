---
name: niu.ie
description: "Personal site of Daniel Callaghan (小牛) — A developer's curated blog and web services portal."
colors:
  primary: "#3871c1"
  primary-foreground: "#faf9f6"
  secondary: "#f3a257"
  secondary-foreground: "#24265d"
  accent: "#4a7c59"
  accent-foreground: "#faf9f6"
  background: "#faf9f6"
  foreground: "#615766"
  card: "#ffffff"
  card-foreground: "#615766"
  border: "#e2e8f0"
  input: "#e2e8f0"
  ring: "#3871c1"
typography:
  display:
    fontFamily: "var(--font-lora), Georgia, serif"
    fontSize: "3rem"
    fontWeight: 400
  body:
    fontFamily: "var(--font-nunito), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  label:
    fontFamily: "var(--font-roboto-condensed), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
spacing:
  container-px: "1rem"
  gap-base: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.5rem"
  button-primary-hover:
    backgroundColor: "rgba(56, 113, 193, 0.9)"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    rounded: "{rounded.md}"
    padding: "0.5rem 1.5rem"
  button-secondary-hover:
    backgroundColor: "rgba(243, 162, 87, 0.9)"
  card-base:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
---

# Design System: niu.ie

## Overview

**Creative North Star: "The Developer's Atelier"**

"The Developer's Atelier" blends rigorous technical layout structure with warm, hand-crafted editorial details. The visual interface is designed to feel highly customized, clean, and interactive, letting the content lead while presenting a polished, premium aesthetic for potential freelance client leads.

The design relies on high-quality typography pairings, a strong dark-mode-first color model, and tactile, confident feedback states. Spacing is comfortable, visual hierarchy is strictly enforced, and interactive items respond dynamically to user navigation.

**Key Characteristics:**
- **Atelier Editorial:** Classic serif fonts for prominent headings and article titles, paired with a soft, readable sans font for body reading.
- **Warm Contrast Canvas:** A default light-mode background on warm paper (#faf9f6) and a deep charcoal orchid dark-mode canvas, accented by cobalt, warm orange, and sage.
- **Tactile Depth:** Clean container grids featuring subtle borders, distinct shadows, and responsive vertical offsets on hover.

## Colors

The palette balances clean neutral backgrounds with colorful accents that differentiate writing categories and guide conversion actions.

### Primary
- **Atelier Cobalt** (#3871c1): The signature theme color, representing developer precision. Used for primary navigation, titles, primary buttons, and the software category tag.

### Secondary
- **Tangerine Peel** (#f3a257): A warm, friendly accent. Used for key call-to-actions, contact links, and the music category tag.

### Accent
- **Muted Sage** (#4a7c59): A secondary accent representing nature or leisure. Used for success indicators and the games category tag.

### Neutral
- **Warm Paper** (#faf9f6): The clean, off-white background color for light mode.
- **Charcoal Orchid** (#615766): The primary text color for body copy, offering readable contrast.
- **Obsidian Black** (oklch(0.145 0 0)): The base dark-mode background color.
- **Pure Bone** (oklch(0.985 0 0)): The primary text color for dark-mode body copy.

### Named Rules
**The Accent Rarity Rule.** Colorful accents (Cobalt, Tangerine, and Sage) must never collectively cover more than 15% of any given viewport layout. Their purpose is to command visual attention to specific details.

## Typography

**Display Font:** Lora (with serif fallback)
**Body Font:** Nunito (with sans-serif fallback)
**Label/Mono Font:** Roboto Condensed (with sans-serif fallback)

The typography pairings contrast the organic, historical feel of Lora with the friendly readability of Nunito and the technical efficiency of Roboto Condensed.

### Hierarchy
- **Display** (Regular, 3rem / 48px to 4.5rem / 72px, line-height 1.15): Used for the author's name, hero headings, and main page titles.
- **Headline** (Medium, 2rem / 32px to 2.5rem / 40px, line-height 1.2): Used for sections and blog titles.
- **Title** (SemiBold, 1.25rem / 20px to 1.5rem / 24px, line-height 1.3): Used for cards and secondary list headers.
- **Body** (Light, 1rem / 16px, line-height 1.6): Used for paragraphs, content blocks, and reading text.
- **Label** (Medium, 0.875rem / 14px, letter-spacing normal): Used for buttons, navigation links, and badge tags.

### Named Rules
**The Editorial Width Rule.** Any block of body or prose copy must have a maximum width of 65ch (characters) to guarantee comfortable horizontal eye tracking.

## Layout

The site layout features a single-column block layout on mobile, transitioning to standard multi-column grids (two columns on tablet, three columns on desktop) for cards and articles. 

Containers use a responsive padding model:
- **Mobile:** 1rem (16px) margins.
- **Tablet & Desktop:** 2rem (32px) margins with a maximum site width of 80rem (1280px).
- **Navigation:** The header is sticky at the top of the viewport with a blur filter to let scrolling content pass behind it seamlessly.

## Elevation & Depth

This system avoids heavy shadows, using thin borders and low-opacity colors in light mode, and tonal gray card layer nesting in dark mode. Interactive elements lift upward on hover.

### Shadow Vocabulary
- **Resting Shadow** (`box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05)`): A subtle shadow to give cards anchor.
- **Elevated Shadow** (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`): Used when a card or component is hovered.

### Named Rules
**The Lift-On-Hover Rule.** All interactive card blocks must translate vertically upwards by -4px (`transform: translateY(-4px)`) and shift shadow state to Elevated Shadow when hovered, returning smoothly when at rest.

## Shapes

Shapes are soft and friendly, avoiding harsh angles. 
- **Small Corners** (6px / `var(--radius-sm)`): Used for buttons and badges.
- **Medium Corners** (8px / `var(--radius-md)`): Used for inputs and form fields.
- **Large Corners** (12px / `var(--radius-xl)`): Used for cards, sheets, and model dialogs.

## Components

### Buttons
- **Shape:** Rounded-md (8px).
- **Primary:** Background color Atelier Cobalt (`#3871c1`), text color Pure Bone (`#faf9f6`), height `h-9` or `h-10` with horizontal padding `px-4` or `px-6`.
- **Hover / Focus:** Hover shifts background opacity to 90% (`bg-primary/90`). Focus receives a 3px ring using the primary color at 50% opacity.
- **Secondary:** Background color Tangerine Peel (`#f3a257`), text color dark blue (`#24265d`), height matching primary.

### Cards / Containers
- **Corner Style:** Rounded-xl (12px / `var(--radius-xl)`).
- **Background:** `bg-card` (White in light mode, Dark Grey in dark mode).
- **Shadow Strategy:** Resting shadow by default, transitions to Elevated shadow.
- **Border:** `border-border` (`#e2e8f0` in light mode, low opacity white in dark mode).
- **Internal Padding:** `p-6` (24px).

### Inputs / Fields
- **Style:** Stroke `#e2e8f0`, background transparent or `dark:bg-input/30`, corners `rounded-md` (8px).
- **Focus:** Border shifts to ring color with a 3px outer ring at 50% opacity.

### Navigation
- **Header Navigation:** Horizontal row on desktop, using condensed type `font-condensed font-medium text-sm text-foreground hover:text-primary transition-colors`. Mobile nav uses a pull-out sheet drawer from the right.

## Do's and Don'ts

### Do:
- **Do** wrap all article reading text inside container constraints that limit content width to `max-w-3xl` and `max-w-prose`.
- **Do** color-code categories consistently using Cobalt (`#3871c1`) for software, Orange (`#f3a257`) for music, and Sage (`#4a7c59`) for games.
- **Do** use a sticky header with a backdrop-blur filter to preserve scroll visibility.

### Don't:
- **Don't** use solid saturated colors for dark backgrounds. Keep dark mode backgrounds to muted tones like `oklch(0.145 0 0)`.
- **Don't** use full-width buttons on desktop screens; restrict their width to the content size or a maximum of `max-w-xs`.
