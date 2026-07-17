# Product

## Register

product

## Users

Two audiences in one mobile app (Ionic + React PWA):

- **Pet owners**: manage their pets' health data, treatments, reminders, events and shared custody. Casual, on-the-go usage, often one-handed on a phone.
- **Shelter staff & volunteers** (Shelter OS): operational day-to-day work inside a shelter — pets, boxes, internal maps, tasks, walks, inventory, people. Used on-site, quickly, between physical tasks; gloves-off moments, bright and dark environments.

## Product Purpose

Graph-a-Pet is a modular pet and shelter management platform. The app is the mobile operational surface: it must make recording and retrieving pet/shelter information fast and unambiguous. Success = a volunteer or owner finds/records what they need in seconds without training.

## Brand Personality

Functional, warm, flat. The interface serves the work; warmth comes from the pets themselves (photos, per-pet accent colors extracted from the pet's picture) — not from decorative UI. Confident primary color, generous touch targets, clear hierarchy.

## Anti-references

- No gradients, no glassmorphism, no glow-for-decoration: the app is **flat by explicit user preference**.
- No SaaS dashboard clichés (hero metrics, identical card grids with icon+heading+text).
- No cream/beige "warm" washes; warmth via content, not background tint.

## Design Principles

1. **Operational first**: every screen has one primary task; actions the current user can't perform are hidden, not disabled.
2. **Flat and tokenized**: all colors through `$color()` tokens (Ionic CSS custom properties), spacing through `$uw()`; light/dark themes both first-class (dark is the original palette).
3. **The pet is the hero**: pet photo + its extracted main color personalize the screen; UI chrome stays neutral.
4. **Backend-driven permissions**: UI mirrors backend rules (role levels Owner/Manager/Staff/Volunteer); never fake authorization client-side.
5. **Fail loud, recover fast**: every mutation surfaces errors via toast (`messages.errors.fetch` fallback), successes confirm, and data refetches after changes.

## Accessibility & Inclusion

WCAG AA: body text contrast ≥ 4.5:1 in both themes, touch targets ≥ 44px, `prefers-reduced-motion` honored for non-essential animation. i18n in 6 languages (it primary), all copy through i18next keys.
