import { NextResponse } from "next/server";
import OpenAI from "openai";
import { QUESTIONS } from "@/lib/questions";
import type {
  Answers,
  BlendStyle,
  PregnancyStatus,
  RecommendationResult,
  RecommendApiResponse,
  UserProfile,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

// Map machine answer keys to human labels for the prompt
const LABEL_MAP: Record<string, Record<string, string>> = {
  duration: {
    today: "Just started today",
    "few-days": "A few days",
    week: "About a week",
    "several-weeks": "Several weeks",
    chronic: "Chronic / ongoing (months or more)",
  },
  severity: {
    mild: "Mild — noticeable but manageable",
    moderate: "Moderate — affects daily focus/energy",
    severe: "Severe — hard to function normally",
  },
  ageRange: {
    "under-18": "Under 18",
    "18-30": "18–30",
    "31-50": "31–50",
    "51-65": "51–65",
    "over-65": "Over 65",
  },
  diet: {
    omnivore: "Omnivore (eats everything)",
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    "gluten-free": "Gluten-free",
    "dairy-free": "Dairy-free",
    keto: "Keto / low-carb",
  },
  activity: {
    sedentary: "Mostly sedentary",
    light: "Lightly active",
    active: "Active (regular exercise)",
    "very-active": "Very active (daily training / physical work)",
  },
  sleepStress: {
    "poor-sleep-high-stress": "Poor sleep + high stress (wired and tired)",
    "poor-sleep-low-stress": "Poor sleep + low stress (tired but calm)",
    "good-sleep-high-stress": "Good sleep + high stress (rested but tense)",
    "good-sleep-low-stress": "Good sleep + low stress (rested and relaxed)",
  },
};

function labeled(key: string, value: string): string {
  const map = LABEL_MAP[key];
  if (map && map[value]) return map[value];
  return value;
}

function buildProfile(answers: Answers): string {
  return QUESTIONS.map((q) => {
    const raw = answers[q.id]?.trim();
    if (!raw) return `${q.title} — (skipped)`;
    return `${q.title}\n  → ${labeled(q.id, raw)}`;
  }).join("\n");
}

const PREGNANCY_LABEL: Record<PregnancyStatus, string> = {
  "not-pregnant": "Not pregnant",
  pregnant: "Currently pregnant — AVOID uterine-stimulating/emmenagogue herbs",
  nursing: "Currently nursing / breastfeeding — favor milk-supporting, baby-safe herbs",
  trying: "Trying to conceive — keep choices gentle and fertility-conscious",
};

function buildContext(profile: UserProfile): string {
  const sexLabel =
    profile.sex === "female"
      ? "Female"
      : profile.sex === "male"
        ? "Male"
        : "Prefer not to say";

  const lines: string[] = [
    `Region / country: ${profile.region}${
      profile.macroRegion ? ` (macro-region: ${profile.macroRegion})` : ""
    }`,
    `Biological sex: ${sexLabel}`,
  ];

  if (profile.sex === "female" && profile.pregnancy) {
    lines.push(`Pregnancy status: ${PREGNANCY_LABEL[profile.pregnancy]}`);
  }
  return lines.join("\n");
}

function buildPrompt(
  answers: Answers,
  profile: UserProfile
): { system: string; user: string } {
  const profileText = buildProfile(answers);
  const contextText = buildContext(profile);
  const isPregnant = profile.pregnancy === "pregnant";
  const isNursing = profile.pregnancy === "nursing";

  const system = `You are Sage, an expert clinical herbalist and holistic nutritionist with deep knowledge of Western, Ayurvedic, Traditional Chinese, African, and Indigenous herbal traditions from around the world.

Your job: given a person's full wellness profile AND their regional + biological context, recommend personalized herbal teas, nourishing meals, and lifestyle tips.

REGIONAL INGREDIENTS (IMPORTANT):
- The person lives in ${profile.region}${
    profile.macroRegion ? ` (${profile.macroRegion})` : ""
  }. PRIORITIZE herbs, spices, weeds, and foods that are native to or commonly available in that region and its cuisine — including wild forageable plants that grow freely in nature.
- For each tea and meal, prefer locally rooted ingredients first. For example, for Southern Africa think zumbani (Lippia javanica), moringa, rooibos, African potato, sorghum, millet (rapoko/ragi), sweet potato leaves, baobab, AND common wild/forageable plants like purslane (pursley/tsonga greens), spider plant (nyevhe/ulude), blackjack (nchere), dandelion, plantain (broadleaf weed), stinging nettle, chickweed, wild mint, devil's thorn; for South Asia think tulsi, ginger, turmeric, cardamom, ashwagandha, curry leaf, AND forageables like purslane (kulfa/luni), dandelion, nettle; for East Asia think goji, jujube, chrysanthemum, astragalus, ginger, AND purslane (ma chi xian); for the Mediterranean think chamomile, sage, thyme, olive leaf, fennel, AND wild forageables like dandelion, mallow (malva), borage, chicory.
- SPICES count as herbs for tea blends — use regional warming spices (ginger, cinnamon, clove, cardamom, black pepper, turmeric, etc.) where they fit the person's condition.
- Include at least one wild/forageable plant in each tea blend whenever a safe, effective one exists for the region and condition. These "weed" plants are often the most accessible medicine.
- You MAY include a well-known non-regional herb if it is especially effective, but always note where it's from and offer a local alternative. Never make a person feel their local pantry is insufficient.

FORAGING NOTES (whereToFind):
- For every tea blend that includes a wild or forageable plant, fill the "whereToFind" field with a short, practical note on WHERE in nature to find each forageable ingredient (e.g. "Purslane grows as a low spreading weed in cultivated beds, garden edges and disturbed soil after rain; dandelion along field margins and lawns; wild mint near streams and damp ditches").
- Name the plant AND its typical habitat so a beginner can locate it. Mention a safe look-alike warning ONLY if genuinely needed.
- If ALL ingredients in a blend are store-bought/cultivated (no wild plants), set whereToFind to null or omit it.

SEX & PREGNANCY SAFETY:
- Tailor hormone-, cycle-, and prostate-relevant herbs to the stated biological sex where useful.
- ${
    isPregnant
      ? "The person is PREGNANT. This is a hard constraint: NEVER recommend uterine-stimulating or emmenagogue herbs (e.g. pennyroyal, rue, dong quai, blue/black cohosh, tansy, mugwort, yarrow in medicinal doses, high-dose rosemary/sage/parsley seed, aloe latex, juniper berry in quantity). Favor pregnancy-safe options like ginger (for nausea), mild chamomile in moderation, peppermint, lemon balm, raspberry leaf (traditionally third trimester), rooibos, and nourishing broths. When in doubt, choose the gentler option and note the caution."
      : isNursing
        ? "The person is NURSING. Avoid herbs that reduce milk supply (e.g. sage, peppermint in large amounts, parsley in quantity, oregano) and any stimulant laxatives. Favor milk-supporting, baby-safe herbs like fenugreek, fennel, millet/ragi porridge, moringa, and gentle nourishing foods."
        : "No special pregnancy/nursing constraints apply."
  }

PRINCIPLES:
- Treat the whole person, not just the named symptom. Weave in their sleep, stress, activity, age, diet, region and sex.
- STRICTLY respect allergies and medications. Never recommend an herb or food the person is allergic to, and flag herb–drug interactions in the caution field.
- Keep preparations practical for a home kitchen using ingredients realistic for their region. Teas should be infusions or decoctions a beginner can make.
- Meals must fit the stated diet exactly and use whole, nourishing, regionally sensible ingredients.
- Be warm, specific and actionable. Avoid generic filler.

You MUST respond with a single valid JSON object and nothing else — no markdown fences, no commentary. The JSON must match this exact shape:

{
  "summary": "2-3 sentence empathetic summary acknowledging their situation, region, and the approach you're taking",
  "teas": [
    {
      "name": "Tea blend name (evocative, may reference local tradition)",
      "herbs": ["herb/spice 1", "..."],
      "blendStyle": "simple | optimum | superblend",
      "benefits": "Why this tea for this person, tied to their profile, region and (if relevant) pregnancy safety",
      "preparation": "Clear, step-by-step brewing instructions with amounts and steep time, using accessible local ingredients",
      "bestTime": "When in the day to drink it",
      "caution": "Any relevant caution, interaction, or pregnancy note, or null",
      "whereToFind": "Short practical foraging note: where in nature to find each WILD ingredient in the blend (habitat + when). null or omitted if all ingredients are store-bought."
    }
  ],
  "meals": [
    {
      "name": "Meal name",
      "keyIngredients": ["ingredient 1", "ingredient 2", "..."],
      "why": "Why this meal supports their recovery, tied to their profile and region",
      "briefRecipe": "A 3-5 line approachable recipe outline (not a full cookbook recipe)",
      "mealType": "Breakfast | Lunch | Dinner | Snack"
    }
  ],
  "wellnessTips": [
    {
      "title": "Short tip title",
      "detail": "1-2 sentence practical, profile-aware suggestion",
      "icon": "a single emoji"
    }
  ],
  "disclaimer": "A one-line reminder that this is educational, not medical advice, tailored to their case"
}

THREE-TIER TEA PROGRESSION (IMPORTANT): Provide EXACTLY 3 teas, in this order, escalating in complexity so the person can choose their level of effort:
1. blendStyle "simple" — the FEWEST ingredients possible (2-3 herbs/spices). A gentle, easy-to-source starter tea. Think: the 2-3 most effective, accessible local herbs for this person's condition.
2. blendStyle "optimum" — an OPTIMUM balanced blend (4-5 herbs/spices). The sweet spot of potency and simplicity — adds a supporting herb or two and a regional spice to the simple base.
3. blendStyle "superblend" — a SUPERBLEND with MANY relevant herbs and spices (6-8 ingredients). The most potent synergistic formula, layering complementary herbs + warming spices + at least one wild/forageable plant from their region.
Each blend must use MORE ingredients than the one before it. Include at least one wild/forageable plant in the optimum and superblend (and the simple one too, if a safe single-herb option exists). Set "blendStyle" on every tea exactly as above.

Provide exactly 3 teas, 2-3 meals, and 3-4 wellness tips. Every field is required (caution and whereToFind may be null). Output ONLY the JSON.`;

  const user = `Here is the person's context gathered before the quiz:

${contextText}

And here is their wellness profile gathered from 9 questions:

${profileText}

Now craft their personalized herbal tea and meal recommendations as the JSON object described. Remember: respect their allergies ("${answers.allergies || "none stated"}") and medications ("${answers.medications || "none stated"}"), match their diet ("${labeled("diet", answers.diet || "omnivore")}"), honor their age ("${labeled("ageRange", answers.ageRange || "31-50")}"), and PRIORITIZE ingredients native to ${profile.region}.`;

  return { system, user };
}

function safeParseJson(content: string): RecommendationResult | null {
  if (!content) return null;
  // Strip markdown fences if present
  let text = content.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  // Find the outermost JSON object
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  text = text.slice(start, end + 1);

  try {
    const parsed = JSON.parse(text) as RecommendationResult;
    if (
      !parsed ||
      typeof parsed.summary !== "string" ||
      !Array.isArray(parsed.teas) ||
      !Array.isArray(parsed.meals) ||
      !Array.isArray(parsed.wellnessTips)
    ) {
      return null;
    }
    // Normalize blendStyle + ensure simple → optimum → superblend ordering.
    normalizeTeas(parsed);
    return parsed;
  } catch {
    return null;
  }
}

/** Infer blendStyle from herb count when missing, and sort teas ascending by
 *  complexity so the UI always shows Simple → Optimum → Superblend. */
function normalizeTeas(result: RecommendationResult): void {
  const order: Record<BlendStyle, number> = {
    simple: 0,
    optimum: 1,
    superblend: 2,
  };
  for (const tea of result.teas) {
    if (!tea.blendStyle) {
      const n = tea.herbs?.length ?? 0;
      tea.blendStyle =
        n <= 3 ? "simple" : n <= 5 ? "optimum" : "superblend";
    }
  }
  result.teas.sort((a, b) => {
    const ra = order[a.blendStyle ?? "optimum"] ?? 1;
    const rb = order[b.blendStyle ?? "optimum"] ?? 1;
    if (ra !== rb) return ra - rb;
    // tie-break by herb count ascending
    return (a.herbs?.length ?? 0) - (b.herbs?.length ?? 0);
  });
}

function fallbackResult(
  answers: Answers,
  profile: UserProfile
): RecommendationResult {
  const concern = answers.primaryConcern?.trim() || "what you're feeling";
  const isPregnant = profile.pregnancy === "pregnant";
  const isNursing = profile.pregnancy === "nursing";

  // Pick regionally-flavored fallback herbs/foods
  const regionalHerbs = regionalFallbackHerbs(profile.region);
  const regionalMeal = regionalFallbackMeal(profile.region);
  const foraging = regionalForagingNote(profile.region);

  // Build the three-tier progression from the regional herb pool:
  //  simple (2-3) → optimum (4-5) → superblend (all, up to ~8)
  const simpleHerbs = regionalHerbs.slice(0, 3);
  const optimumHerbs = regionalHerbs.slice(0, 5);
  const superHerbs = regionalHerbs;
  const regionLabel = profile.region;

  const pregnancyCaution = isPregnant
    ? "Pregnancy: this blend avoids uterine stimulants, but confirm any herb with your midwife or doctor."
    : isNursing
      ? "Nursing: skip large amounts of peppermint/sage, which can reduce milk supply."
      : "Skip if allergic to any ingredient.";

  return {
    summary:
      "We couldn't reach the herbalist AI just now, but here's a gentle, safe starting point you can build on — in three steps from simple to superblend. Please try again shortly for a fully personalized blend.",
    teas: [
      {
        name: `${regionLabel} Simple Starter`,
        herbs: simpleHerbs,
        blendStyle: "simple",
        benefits: `The fewest ingredients to begin easing ${concern} — just the most accessible, effective local herbs from ${regionLabel}. A gentle entry point you can brew in minutes.`,
        preparation:
          "Steep 1 tsp of the blend in 250ml just-boiled water for 8–10 minutes, covered. Strain and sip warm. Up to 3 cups a day.",
        bestTime: "Whenever symptoms flare, or morning and evening",
        caution: pregnancyCaution,
        whereToFind: foraging,
      },
      {
        name: `${regionLabel} Optimum Blend`,
        herbs: optimumHerbs,
        blendStyle: "optimum",
        benefits: `A balanced 4–5 herb blend for ${concern} — the sweet spot of potency and simplicity, adding a supporting herb and a regional warming spice to the simple base.`,
        preparation:
          "Steep 1 heaped tsp of the blend in 300ml just-boiled water for 10–12 minutes, covered. Strain and sip warm. Drink 2–3 cups through the day.",
        bestTime: "Morning and afternoon",
        caution: pregnancyCaution,
        whereToFind: foraging,
      },
      {
        name: `${regionLabel} Superblend`,
        herbs: superHerbs,
        blendStyle: "superblend",
        benefits: `A potent synergistic superblend for ${concern}, layering many relevant herbs, spices and wild-forageable plants from ${regionLabel} for the strongest combined effect.`,
        preparation:
          "Steep 1 heaped tsp of the blend in 350ml just-boiled water for 12–15 minutes, covered. Strain and sip warm. Drink 2–3 cups through the day; rotate with the simpler blends if desired.",
        bestTime: "Through the day for sustained support",
        caution: pregnancyCaution,
        whereToFind: foraging,
      },
    ],
    meals: [
      {
        name: regionalMeal.name,
        keyIngredients: regionalMeal.ingredients,
        why: `A whole-food, regionally familiar base from ${profile.region} that supports recovery without weighing you down.`,
        briefRecipe: regionalMeal.recipe,
        mealType: "Lunch",
      },
    ],
    wellnessTips: [
      {
        title: "Hydrate warmly",
        detail: "Sip warm water or herbal tea through the day — cold drinks can dampen digestion.",
        icon: "💧",
      },
      {
        title: "Rest before midnight",
        detail: "Aim to be in bed by 10:30pm; the deepest repair sleep happens in the first half of the night.",
        icon: "🌙",
      },
      {
        title: "Move gently",
        detail: "A 10-minute walk after meals aids digestion and calms the nervous system.",
        icon: "🚶",
      },
    ],
    disclaimer:
      "This is educational guidance, not medical advice. Consult a qualified healthcare provider for diagnosis or treatment.",
  };
}

function regionalFallbackHerbs(region: string): string[] {
  const r = region.toLowerCase();
  if (r.includes("zimbabwe") || r.includes("south africa") || r.includes("botswana") || r.includes("zambia") || r.includes("malawi") || r.includes("mozambique") || r.includes("namibia"))
    return ["Zumbani (Lippia javanica)", "Ginger", "Lemon", "Rooibos", "Wild mint", "Purslane (wild)", "Blackjack (nchere)", "Honey"];
  if (r.includes("india") || r.includes("pakistan") || r.includes("bangladesh") || r.includes("sri lanka") || r.includes("nepal"))
    return ["Tulsi (holy basil)", "Ginger", "Turmeric", "Lemongrass", "Black pepper", "Purslane (kulfa)", "Cardamom", "Fennel"];
  if (r.includes("china") || r.includes("japan") || r.includes("korea") || r.includes("taiwan"))
    return ["Ginger", "Jujube (red date)", "Chrysanthemum", "Goji berry", "Green tea", "Purslane (ma chi xian)", "Tangerine peel", "Licorice root"];
  if (r.includes("nigeria") || r.includes("ghana") || r.includes("senegal") || r.includes("cameroon") || r.includes("kenya") || r.includes("tanzania") || r.includes("uganda") || r.includes("ethiopia"))
    return ["Ginger", "Moringa leaf", "Scent leaf (basil)", "Lemongrass", "Cloves", "Purslane (wild)", "Baobab", "Cinnamon"];
  if (r.includes("turkey") || r.includes("iran") || r.includes("morocco") || r.includes("egypt") || r.includes("lebanon"))
    return ["Chamomile", "Mint", "Rosehip", "Cinnamon", "Ginger", "Dandelion (wild)", "Anise", "Sage"];
  if (r.includes("mexico") || r.includes("brazil") || r.includes("argentina") || r.includes("peru") || r.includes("colombia"))
    return ["Chamomile (manzanilla)", "Ginger", "Lemongrass", "Cinnamon", "Lime", "Purslane (verdolaga)", "Cacao", "Hibiscus"];
  return ["Chamomile", "Ginger", "Lemon balm", "Nettle (wild)", "Dandelion (wild)", "Honey", "Cinnamon", "Rosehip"];
}

function regionalForagingNote(region: string): string {
  const r = region.toLowerCase();
  if (r.includes("zimbabwe") || r.includes("south africa") || r.includes("botswana") || r.includes("zambia") || r.includes("malawi") || r.includes("mozambique") || r.includes("namibia"))
    return "Purslane grows as a low, fleshy-leaved weed in cultivated beds, garden edges and disturbed soil after rain — look for reddish stems and paddle-shaped leaves. Wild mint flourishes along stream banks and damp ditches. Zumbani (Lippia javanica) is a common wild shrub in grasslands and fallow fields, harvest the leaves in the dry season.";
  if (r.includes("india") || r.includes("pakistan") || r.includes("bangladesh") || r.includes("sri lanka") || r.includes("nepal"))
    return "Purslane (kulfa/luni) grows as a low spreading weed in vegetable beds and moist ground after monsoon. Lemongrass is often cultivated in home gardens. Tulsi grows in many courtyards and temple gardens.";
  if (r.includes("china") || r.includes("japan") || r.includes("korea") || r.includes("taiwan"))
    return "Purslane (ma chi xian) grows as a low succulent weed in gardens, field edges and sidewalk cracks in summer. Chrysanthemum and goji are commonly cultivated; jujube (red date) from trees in late autumn.";
  if (r.includes("nigeria") || r.includes("ghana") || r.includes("senegal") || r.includes("cameroon") || r.includes("kenya") || r.includes("tanzania") || r.includes("uganda") || r.includes("ethiopia"))
    return "Purslane grows as a creeping weed in cultivated beds and market-garden edges after rain. Scent leaf (African basil) is widely grown around homes. Moringa leaves from trees common in homesteads.";
  if (r.includes("turkey") || r.includes("iran") || r.includes("morocco") || r.includes("egypt") || r.includes("lebanon"))
    return "Dandelion grows wild in lawns, field margins and roadsides — the leaves and roots are both usable. Chamomile and mint are often cultivated in home gardens. Rosehip from wild rose bushes in autumn.";
  if (r.includes("mexico") || r.includes("brazil") || r.includes("argentina") || r.includes("peru") || r.includes("colombia"))
    return "Purslane (verdolaga) grows as a low spreading weed in vegetable gardens and moist fields. Manzanilla (chamomile) is cultivated in home gardens. Lemongrass in backyard patches.";
  return "Dandelion grows wild in lawns, field margins and roadsides. Nettle flourishes in rich, damp soil at woodland edges and stream banks — wear gloves to harvest. Lemon balm is often found in herb gardens.";
}

function regionalFallbackMeal(region: string): { name: string; ingredients: string[]; recipe: string } {
  const r = region.toLowerCase();
  if (r.includes("zimbabwe") || r.includes("south africa") || r.includes("botswana") || r.includes("zambia") || r.includes("malawi") || r.includes("mozambique") || r.includes("namibia"))
    return {
      name: "Sadza with Leafy Greens & Peanut Sauce",
      ingredients: ["Mealie meal (maize)", "Rape / chou moellier greens", "Peanut butter", "Tomato", "Onion"],
      recipe:
        "Cook sadza from mealie meal. Saute onion and tomato, add chopped greens and simmer until soft. Swirl in a spoon of peanut butter for a nourishing sauce and serve over the sadza.",
    };
  if (r.includes("india") || r.includes("pakistan") || r.includes("bangladesh") || r.includes("sri lanka") || r.includes("nepal"))
    return {
      name: "Ginger-Turmeric Dal & Rice",
      ingredients: ["Red lentils", "Turmeric", "Ginger", "Tomato", "Basmati rice", "Ghee"],
      recipe:
        "Simmer lentils with turmeric, grated ginger and tomato until soft. Temper with ghee and cumin. Serve over basmati rice for a warming, easy-to-digest meal.",
    };
  if (r.includes("china") || r.includes("japan") || r.includes("korea") || r.includes("taiwan"))
    return {
      name: "Ginger-Jujube Congee",
      ingredients: ["Rice", "Ginger", "Jujube (red date)", "Scallion", "Stock"],
      recipe:
        "Simmer rice in plenty of stock with sliced ginger and jujubes until it becomes a soft porridge. Top with scallions and sip slowly.",
    };
  if (r.includes("nigeria") || r.includes("ghana") || r.includes("senegal") || r.includes("cameroon"))
    return {
      name: "Pepper Soup with Plantain",
      ingredients: ["Fish or chicken", " scent leaf / basil", "Chili", "Plantain", "Garlic"],
      recipe:
        "Simmer fish or chicken with chili, garlic and scent leaf in a light broth until tender. Serve with boiled plantain for a warming, restorative meal.",
    };
  return {
    name: "Warming Root Vegetable Bowl",
    ingredients: ["Sweet potato", "Carrot", "Ginger", "Greens", "Olive oil"],
    recipe:
      "Roast cubed sweet potato and carrot with grated ginger and olive oil at 200°C for 25 min. Serve over greens with a squeeze of lemon.",
  };
}

export async function POST(request: Request) {
  let body: { answers?: Answers; profile?: UserProfile };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<RecommendApiResponse>(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const answers = body.answers;
  const profile = body.profile;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json<RecommendApiResponse>(
      { ok: false, error: "Missing answers" },
      { status: 400 }
    );
  }
  if (
    !profile ||
    !profile.region ||
    !profile.sex ||
    (profile.sex === "female" && !profile.pregnancy)
  ) {
    return NextResponse.json<RecommendApiResponse>(
      { ok: false, error: "Missing onboarding profile (region, sex, pregnancy)" },
      { status: 400 }
    );
  }

  if (!answers.primaryConcern || answers.primaryConcern.trim().length < 2) {
    return NextResponse.json<RecommendApiResponse>(
      { ok: false, error: "Please describe your primary concern" },
      { status: 400 }
    );
  }

  const { system, user } = buildPrompt(answers, profile);

  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const completion = await client.chat.completions.create({
      model: "qwen/qwen3-32b",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const content = completion?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParseJson(content);

    if (!parsed) {
      return NextResponse.json<RecommendApiResponse>({
        ok: false,
        error: "Sorry, the robots are striking",
      });
    }

    // Ensure disclaimer exists
    if (!parsed.disclaimer) {
      parsed.disclaimer =
        "This is educational guidance, not medical advice. Consult a qualified healthcare provider for diagnosis or treatment.";
    }

    return NextResponse.json<RecommendApiResponse>({ ok: true, result: parsed });
  } catch (err) {
    console.error("[recommend] LLM error:", err);
    return NextResponse.json<RecommendApiResponse>({
      ok: false,
      error: "Sorry, the robots are striking",
    });
  }
}
