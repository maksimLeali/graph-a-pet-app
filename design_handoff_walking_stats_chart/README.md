# Handoff: Walking Stats Chart Redesign

## Overview
Restyled version of the "Walking stats" screen's chart section (currently built with react-chartjs-2). Same data/behavior, new visual treatment: custom line chart, toggleable legend, and a restyled star-rating summary card. Goal: replace the current react-chartjs-2 chart with this look while keeping it in Chart.js/react-chartjs-2 (or reimplement as custom SVG/Recharts — your call) inside the real app.

## About the design file
`Walking Stats Chart.dc.html` in this folder is a **design reference built in HTML/React (Design Components format)** — a prototype showing intended look and behavior, not production code to copy directly. Recreate this design in the app's existing stack (React Native / React + react-chartjs-2, per your codebase) using its established patterns, components and theming.

## Fidelity
**High-fidelity.** Colors, spacing, typography and interaction behavior below should be matched closely.

## Screen: Walking stats — chart card
Mobile screen, max content width ~420px, dark theme.

**Structure (top to bottom):**
1. Title "Walking stats" (26px/800 weight) + small 2px accent underline (46px wide, primary green).
2. Period label, e.g. "6 – 12 luglio 2026" (15px/700, capitalize first letter).
3. Segmented tab control: Settimana / Mese / Anno. Pill container: `padding:4px`, `border-radius:14px`, dark bg, 1px border. Active tab: filled primary green pill, dark green text. Inactive: transparent, muted gray text, subtle highlight on hover.
4. Chart card (rounded 20px, 1px border, padded ~22px/18px):
   - Y-axis labels (0–5) as plain text to the left of the plot, NOT inside the SVG (avoids text-in-svg rendering bugs).
   - Horizontal gridlines, dashed except the baseline (0) which is solid.
   - Lines drawn only where ≥2 data points exist per series; otherwise single points render as dots only (no line).
   - Circular data point markers (8px radius equivalent), stroked with the card background color so they "pop" off gridlines.
   - X-axis labels change per tab granularity (see Data section) — **no rotation needed**, they're short (1 char / short numbers), centered under each column.
   - Legend below the chart, as small toggle chips (colored square swatch + label). Clicking a chip dims/greys it out and hides that series from the chart (toggle, not multi-select filter).
5. Summary card (separate rounded panel below): 2-column grid, one row per metric — label, star glyph (★) in the metric's color, numeric value (bold), and a thin (5px) horizontal progress bar showing value/5 in that metric's color. "Generale" spans both columns as the summary row.

## Data / per-tab granularity
- **Settimana (week)**: x-axis = day initials `L M M G V S D` (Mon–Sun of current week).
- **Mese (month)**: x-axis = week numbers within the month (`1 2 3 4`).
- **Anno (year)**: x-axis = month initials `G F M A M G L A S O N D`.
- Switching tabs currently swaps to a differently-shaped dataset (same metrics, different point count/positions) — wire this to real aggregated data per range in production.
- 5 metrics: Generale, Tiro al guinzaglio, Comportamento, Aggressività, Calma. Each 0–5 scale.

## Interactions & Behavior
- Tap a tab (Settimana/Mese/Anno) → switches chart data + x-axis labels + period label. No animation required, but a soft crossfade/transition on data change would be a nice enhancement.
- Tap a legend chip → toggles that series' visibility on the chart (line + dots disappear, chip dims). Purely client-side UI state, no data refetch needed.
- Summary card is currently static/no interactions.

## Design Tokens
**Palette — monochromatic green family (same hue ~150–165°, varying lightness/chroma), defined in OKLCH:**
- Background: `oklch(12% 0.014 155)`
- Card background: `oklch(15.5% 0.016 155)`
- Card border: `oklch(30% 0.035 152 / 0.45)`
- Primary text: `oklch(97% 0.01 150)`
- Muted text: `oklch(60–66% 0.02 150)`
- Generale (primary accent): `oklch(72% 0.19 152)`
- Tiro al guinzaglio: `oklch(66% 0.13 165)`
- Comportamento: `oklch(83% 0.16 135)`
- Aggressività: `oklch(48% 0.14 155)`
- Calma: `oklch(90% 0.07 150)`

If your codebase's color pipeline doesn't support OKLCH, convert these to hex/HSL equivalents keeping relative lightness/chroma relationships intact.

**Typography:** Manrope (Google Font), weights 400–800. Title 26px/800, period label 15px/700, tab labels 14px/700, axis labels 12–13px/600–700, legend chips 13px/600, summary labels 14px/500, summary values 17px/800.

**Radii:** tabs container 14px, tab pill 10px, cards 20px, legend chips 999px (full pill), progress bar 3px.

## Assets
None — uses a plain text star glyph (★) for ratings, no icon files or images.

## Files
- `Walking Stats Chart.dc.html` — full design reference (HTML/React Design Component). Open in a browser to see the live, interactive version (tab switching + legend toggling both work).
