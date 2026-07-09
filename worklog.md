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

---
Task ID: 2
Agent: main (Z.ai Code)
Task: Add pre-quiz onboarding popup that captures region/country, biological sex, and pregnancy/nursing status — so the AI prioritizes regionally available herbs & foods (e.g. Zimbabwe → zumbani, moringa, rooibos, sadza) and keeps herbs safe for pregnancy.

Work Log:
- Read previous worklog and current source (types.ts, page.tsx, api/recommend/route.ts, results-display.tsx).
- Decided UX: a popup **OnboardingDialog** (shadcn Dialog) that appears when the user clicks "Find my remedy", BEFORE the 9 questions. Collects region/sex/pregnancy, then transitions into the existing wizard.
- Extended `src/lib/types.ts`: added `BiologicalSex`, `PregnancyStatus`, `UserProfile { region, macroRegion, sex, pregnancy }`; added `profile` to `RecommendRequestBody`.
- Created `src/lib/onboarding.ts`: curated ~120-country list grouped into 15 macro culinary/herbal regions (Southern Africa, East Africa, South Asia, East Asia, etc.), sex options, pregnancy options, and a `detectCountryFromTimezone()` helper mapping IANA timezones → country (e.g. Africa/Harare → Zimbabwe) for auto-prefill.
- Built `src/components/herbal-hub/onboarding-dialog.tsx`:
  - Three-step "Before we begin" popup: (1) searchable country combobox (Popover + Command, grouped by macro-region) with timezone auto-detect, (2) biological sex cards, (3) pregnancy/nursing cards shown ONLY when sex = female (Framer Motion height animation).
  - Validation: "Begin consultation" disabled until region + sex (+ pregnancy if female) chosen.
  - Selecting a non-female sex clears any stale pregnancy choice (handled in click handler, not effect — per React guidance).
  - A11y: combobox trigger has aria-expanded/aria-controls/aria-haspopup; pregnancy section conditionally rendered.
- Wired into `src/app/page.tsx`: added `onboardingOpen` + `profile` state; "Find my remedy" now opens the dialog; on submit stores profile and advances to questions; profile sent with the recommend API call; passed to ResultsDisplay.
- Updated `src/app/api/recommend/route.ts`:
  - `buildPrompt(answers, profile)` now injects region/sex/pregnancy context.
  - System prompt instructs the AI to PRIORITIZE herbs & foods native to the user's region (with concrete examples per macro-region), may include a non-regional herb only with a local alternative noted.
  - Pregnancy = hard safety constraint: explicitly forbids uterine-stimulating/emmenagogue herbs (pennyroyal, rue, dong quai, cohosh, tansy, mugwort, high-dose rosemary/sage, etc.) and favors pregnancy-safe options. Nursing: avoids milk-reducing herbs, favors fenugreek/fennel/moringa.
  - `fallbackResult(answers, profile)` now returns regionally-flavored fallback herbs (e.g. Zumbani+Ginger+Rooibos for Zimbabwe, Tulsi for South Asia) and meals (Sadza with greens for Southern Africa, Ginger-Turmeric Dal for South Asia, Congee for East Asia, Pepper Soup for West Africa) with pregnancy-aware cautions.
  - Request validation requires profile (region, sex, pregnancy if female).
- Updated `src/components/herbal-hub/results-display.tsx`: header now shows three badges — "For: <concern>", "Region: <country>", and a "Pregnancy-safe" badge (only when pregnant/nursing/trying).
- Fixed lint issues: removed setState-in-effect for pregnancy clearing (moved to click handler); kept timezone detection effect with a targeted eslint-disable (legitimate client-only API sync to avoid SSR hydration mismatch); fixed combobox a11y (removed role="combobox", added aria-controls/aria-haspopup, id on PopoverContent).
- `bun run lint` — clean (0 errors, 0 warnings).
- Browser-verified end-to-end with Agent Browser:
  - Onboarding popup opens on "Find my remedy"; country combobox searchable & grouped; Female reveals pregnancy question; Male does NOT.
  - "Begin consultation" correctly gated by validation.
  - Full flow: Zimbabwe + Female + Pregnant + morning sickness → AI returned Zimbabwe-specific herbs (Zumbani, ginger, rooibos, baobab, moringa), local meals (rapoko millet porridge, moringa & pumpkin seed stew with sadza, baobab smoothie), pregnancy-safe cautions on every tea.
  - Results header shows "For:", "Region: Zimbabwe", "Pregnancy-safe" badges.
  - Tested Male path (US): no pregnancy question, Begin enabled after region+sex.
  - No console errors/warnings; dev.log shows POST /api/recommend 200 (~16s), no server errors.

Stage Summary:
- Herbal Hub now gathers region/country, biological sex, and pregnancy/nursing status via a pre-quiz popup before the 9 symptom questions.
- The AI (z-ai-web-dev-sdk LLM) PRIORITIZES regionally native herbs & foods while still allowing well-known alternatives, and strictly avoids contraindicated herbs during pregnancy/nursing.
- Results display region + pregnancy-safe badges; fallback path is also region-aware.
- Lint clean; full flow verified interactive in the browser for both a Zimbabwe-pregnant and a US-male case.

---
Task ID: 3
Agent: main (Z.ai Code)
Task: Enhance herbal blends to use regional spices + forageable weeds (e.g. purslane) with foraging-location notes, allow up to 6-herb "super drink" blends, change contact email to bchangwaz@gmail.com, add a WhatsApp chat button, and add an EcoCash donate button (0775939688 / Barry Changwa).

Work Log:
- Read previous worklog + current source (types.ts, api/recommend/route.ts, results-display.tsx, site-footer.tsx).
- Added `whereToFind?: string` to `TeaRecommendation` in `src/lib/types.ts` (foraging-location note for wild ingredients).
- Updated `src/app/api/recommend/route.ts` prompt:
  - REGIONAL INGREDIENTS section now explicitly includes SPICES and WILD/FORAGEABLE weeds per macro-region (Southern Africa: purslane, spider plant/nyevhe, blackjack/nchere, dandelion, plantain, stinging nettle, chickweed, wild mint, devil's thorn; South Asia: purslane/kulfa, dandelion, nettle; East Asia: purslane/ma chi xian; Mediterranean: dandelion, mallow, borage, chicory).
  - Instructs the AI to include at least one wild/forageable plant in each tea blend when safe.
  - New FORAGING NOTES section requires the `whereToFind` field for any blend with wild plants — naming the plant + its typical habitat so a beginner can locate it.
  - Teas now allow UP TO 6 herbs/spices per blend ("super drink"); JSON schema updated; instruction favors 4-6 synergistic ingredients.
  - Fallback `regionalFallbackHerbs` now returns 6-herb blends with forageable plants (e.g. Zimbabwe: Zumbani, Ginger, Rooibos, Purslane, Wild mint, Lemon). Added `regionalForagingNote()` with habitat descriptions per macro-region. Fallback tea renamed to "Super-Blend" with whereToFind populated.
- Updated `src/components/herbal-hub/results-display.tsx` TeaCard:
  - Herb section now shows a count label ("Super-blend herbs · 6" when ≥5 herbs).
  - New "Where to find the wild herbs" card (primary-tinted, MapPin icon) renders `tea.whereToFind` when present.
- Rebuilt `src/components/herbal-hub/site-footer.tsx` (4-column): Explore / Get in touch (bchangwaz@gmail.com + WhatsApp +263 775 939 688) / Support us (EcoCash card: Barry Changwa / 0775939688 / Donate link). Email changed from hello@herbalhub.ai.
- Created `src/components/herbal-hub/whatsapp-button.tsx`: floating green WhatsApp FAB (bottom-right, z-50) linking to https://wa.me/263775939688 with a prefilled greeting. Always visible across all stages.
- Created `src/components/herbal-hub/donate-section.tsx`: "Keep the kettle brewing" donate section with an EcoCash card showing Account name (Barry Changwa) + EcoCash number (0775939688), a copy-to-clipboard button (with Copied! state), a "Donate to Barry" button (tel: link), and *153# dial instructions.
- Wired into `src/app/page.tsx`: DonateSection added to intro stage (after StartCTA); WhatsAppButton rendered globally (always visible).
- `bun run lint` — clean (0 errors, 0 warnings).
- API verified with Zimbabwe + male + dry cough: AI returned 3 teas each with 6 herbs including forageable weeds (zumbani, blackjack/Bidens pilosa, purslane, wild mint) AND whereToFind notes ("Zumbani grows wild in bushlands and savannah; wild ginger found in forested areas and riverbanks; blackjack grows abundantly as a weed in disturbed soils, gardens, and roadsides after rains").
- Browser-verified end-to-end with Agent Browser:
  - Home: donate section ("Keep the kettle brewing", EcoCash, Barry Changwa, 0775939688, *153# instructions), footer (bchangwaz@gmail.com, WhatsApp link, EcoCash card), floating WhatsApp button all present.
  - Copy-to-clipboard button works (shows "Copied!").
  - Full Zimbabwe + Male flow → results show "SUPER-BLEND HERBS · 6" + "WHERE TO FIND THE WILD HERBS" cards with foraging notes + Region: Zimbabwe badge.
  - WhatsApp floating button visible on results page too.
  - No console errors/warnings; dev.log shows POST /api/recommend 200 (~18s), no server errors.

Stage Summary:
- Herbal tea blends now combine up to 6 regional herbs + spices + wild forageable weeds (purslane, zumbani, blackjack, dandelion, nettle, etc.), each with a practical foraging-location note so users can find the wild plants in nature.
- Contact email changed to bchangwaz@gmail.com.
- Floating WhatsApp chat button (wa.me/263775939688) on every screen.
- Donate section + footer EcoCash card for 0775939688 / Barry Changwa with copy + dial instructions.
- Lint clean; full flow verified in browser.

---
Task ID: 4
Agent: main (Z.ai Code)
Task: Make the three herbal tea recommendations follow a clear progression — 1st = simplest (fewest ingredients), 2nd = optimum blend, 3rd = superblend with many herbs/spices.

Work Log:
- Added `BlendStyle = "simple" | "optimum" | "superblend"` type + `blendStyle?` field to `TeaRecommendation` in `src/lib/types.ts`.
- Updated `src/app/api/recommend/route.ts`:
  - Prompt now has a "THREE-TIER TEA PROGRESSION (IMPORTANT)" block requiring EXACTLY 3 teas in order: simple (2-3 herbs), optimum (4-5 herbs), superblend (6-8 herbs) — each using MORE ingredients than the last, with forageable plants in optimum+superblend. Added `blendStyle` to the JSON schema.
  - Added `normalizeTeas()` in `safeParseJson`: infers blendStyle from herb count if the AI omits it, and SORTS teas simple → optimum → superblend so the UI order is always correct even if the AI returns them out of order.
  - Rewrote `fallbackResult` teas array to produce all three tiers from the regional herb pool (simple = first 3, optimum = first 5, superblend = all 8), each with blendStyle + foraging notes.
  - Expanded `regionalFallbackHerbs` to 8 herbs per region (was 6) so the superblend is meaningfully bigger than the optimum.
- Updated `src/components/herbal-hub/results-display.tsx`:
  - Added `BLEND_STYLE_META` (label + emoji + description) and a `BlendStyleBadge` component with tier-specific colors (emerald=simple, amber=optimum, rose=superblend).
  - TeaCard now shows a tier badge above the tea name; herb section label simplified to "Herbs & spices · N".
  - Teas ResultSection retitled: "Three blends, your choice of depth" with a description explaining the simple→optimum→superblend ladder. Grid changed to single-column so the progression reads as a clear ladder.
- `bun run lint` — clean (0 errors, 0 warnings).
- API verified: Zimbabwe + male + dry cough → 3 teas returned in order: [simple] 2 herbs, [optimum] 4 herbs, [superblend] 6 herbs.
- Browser-verified end-to-end: results page shows "Three blends, your choice of depth" heading, then three tea cards in order each with a colored tier badge (Simple 🌱 / Optimum ⚖️ / Superblend 🔥) and escalating herb counts (2 → 4 → 7). No console errors; dev.log shows POST /api/recommend 200.

Stage Summary:
- Each consultation now yields exactly 3 teas in a deliberate complexity ladder: Simple (fewest ingredients) → Optimum (balanced) → Superblend (many herbs & spices), each labeled with a color-coded tier badge and using more ingredients than the one before.
- Server-side normalizer guarantees the order and infers missing blendStyle from herb count, so the UI is consistent even if the AI is imperfect.
- Fallback path follows the same three-tier structure with region-aware herbs.
- Lint clean; verified in browser.
