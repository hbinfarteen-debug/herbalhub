# Herbal Hub — Work Log

---
Task ID: 1
Agent: main (Z.ai Code)
Task: Build "Herbal Hub" — an AI-powered website that recommends herbal teas and meals based on a user's pain/illness, after a 9-question intake.

Work Log:
- Read existing scaffold (Next.js 16, Tailwind 4, shadcn/ui, z-ai-web-dev-sdk).
- Loaded LLM + image-generation skills.
- Designed a herbal/natural visual theme (sage green + warm cream + honey amber) in `src/app/globals.css` with light/dark variants, botanical background texture, brew/steam keyframe animations, and an elegant scrollbar.
- Updated `src/app/layout.tsx` metadata (title, description, OG) for Herbal Hub.
- Created `src/lib/types.ts` (Question, Answers, TeaRecommendation, MealRecommendation, WellnessTip, RecommendationResult, API types).
- Created `src/lib/questions.ts` — the 9 intake questions: primary concern (textarea), duration, severity, age range, allergies (text), medications (text), diet, activity level, sleep & stress.
- Generated 2 of 3 botanical images via `z-ai image` CLI (`hero.png`, `herbs.png`). The 3rd (`meals.png`) repeatedly hit 429 rate limits and was dropped since it isn't referenced by any component.
- Built components in `src/components/herbal-hub/`:
  - `site-header.tsx` — sticky translucent header with leaf logo + nav.
  - `site-footer.tsx` — 3-column footer with links + wellness tagline.
  - `hero.tsx` — Framer Motion hero with headline, CTA, hero image, floating "Today's blend" card, trust stats.
  - `how-it-works.tsx` — 3-step explainer + "Old wisdom, new intelligence" about section + amber wellness disclaimer.
  - `questionnaire-wizard.tsx` — the 9-question wizard with animated transitions, progress bar, dot stepper, auto-advance on choice selection (480ms beat), keyboard shortcuts (Enter / ⌘+Enter) on text inputs, back/exit, validation.
  - `loading-state.tsx` — animated brewing cup with steam + rotating status messages.
  - `results-display.tsx` — tea cards (herbs, benefits, preparation, best time, caution), meal cards (ingredients, why, recipe, meal type), wellness tip cards, disclaimer, restart + print actions.
- Built API route `src/app/api/recommend/route.ts`:
  - Maps raw answers to human-readable labels.
  - Builds a detailed system+user prompt for "Sage" the herbalist AI (Western/Ayurvedic/TCM), enforcing allergy & medication safety, accessible herbs, diet-matched meals.
  - Requires strict JSON output matching the `RecommendationResult` schema.
  - Parses JSON defensively (strips markdown fences, extracts outer object), validates shape.
  - Graceful fallback result if the LLM fails or returns unparseable output.
- Wired `src/app/page.tsx` as the single user-visible route with a stage machine: intro → questions → loading → results | error. Uses `flex min-h-screen flex-col` + `main flex-1` + `mt-auto` footer for correct sticky-footer behavior.
- Ran `bun run lint` — clean.
- Self-verified end-to-end with Agent Browser:
  - Home renders hero, how-it-works, about, disclaimer, CTA, footer — no console errors.
  - Walked all 9 questions (auto-advance on choices works, keyboard shortcuts work).
  - Loading state shows brewing animation.
  - Results render teas, meals, wellness tips, disclaimer, restart/print buttons.
  - Fixed a React "setState during render" warning in `goNext` (was calling setStep/setDirection/onComplete inside a setAnswers updater) by simplifying to read `currentAnswer`/`answers` directly.
  - Verified clean console after fix (no errors/warnings).
  - Verified mobile (390×844) and desktop (1280×900) layouts.
  - Verified footer positioning (natural push on long pages, sticks on short pages via flex structure).
  - dev.log shows `POST /api/recommend 200` (13–25s LLM latency), no server errors.

Stage Summary:
- Single-page Next.js 16 app at `/` with a complete AI herbal-remedy flow.
- 9-question intake wizard → z-ai-web-dev-sdk LLM (server-side only) → structured tea + meal + wellness recommendations.
- Herbal theme (sage/cream/amber), fully responsive, sticky footer, Framer Motion animations, accessible.
- Lint clean, no runtime/console errors, verified interactive via Agent Browser.
- Key files: `src/app/page.tsx`, `src/app/api/recommend/route.ts`, `src/lib/questions.ts`, `src/lib/types.ts`, `src/components/herbal-hub/*`.
