import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { QUESTIONS } from "@/lib/questions";
import type {
  Answers,
  RecommendationResult,
  RecommendApiResponse,
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

function buildPrompt(answers: Answers): { system: string; user: string } {
  const profile = buildProfile(answers);

  const system = `You are Sage, an expert clinical herbalist and holistic nutritionist with deep knowledge of Western, Ayurvedic, and Traditional Chinese herbal traditions.

Your job: given a person's full wellness profile, recommend personalized herbal teas, nourishing meals, and lifestyle tips.

PRINCIPLES:
- Treat the whole person, not just the named symptom. Weave in their sleep, stress, activity, age and diet.
- STRICTLY respect allergies and medications. Never recommend an herb or food the person is allergic to, and flag herb–drug interactions in the caution field.
- Prefer common, accessible, food-safe herbs (e.g. chamomile, ginger, peppermint, lemon balm, turmeric, lavender, rooibos, tulsi, fennel, cinnamon, nettle, rosehip, eleuthero).
- Keep preparations practical for a home kitchen. Teas should be infusions or decoctions a beginner can make.
- Meals must fit the stated diet exactly and use whole, nourishing ingredients.
- Be warm, specific and actionable. Avoid generic filler.

You MUST respond with a single valid JSON object and nothing else — no markdown fences, no commentary. The JSON must match this exact shape:

{
  "summary": "2-3 sentence empathetic summary acknowledging their situation and the approach you're taking",
  "teas": [
    {
      "name": "Tea blend name (evocative)",
      "herbs": ["herb 1", "herb 2", "herb 3"],
      "benefits": "Why this tea for this person, tied to their profile",
      "preparation": "Clear, step-by-step brewing instructions with amounts and steep time",
      "bestTime": "When in the day to drink it",
      "caution": "Any relevant caution or interaction note, or null"
    }
  ],
  "meals": [
    {
      "name": "Meal name",
      "keyIngredients": ["ingredient 1", "ingredient 2", "..."],
      "why": "Why this meal supports their recovery, tied to their profile",
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

Provide 2-3 teas, 2-3 meals, and 3-4 wellness tips. Every field is required (caution may be null). Output ONLY the JSON.`;

  const user = `Here is the person's wellness profile gathered from 9 questions:

${profile}

Now craft their personalized herbal tea and meal recommendations as the JSON object described. Remember: respect their allergies ("${answers.allergies || "none stated"}") and medications ("${answers.medications || "none stated"}"), match their diet ("${labeled("diet", answers.diet || "omnivore")}"), and honor their age ("${labeled("ageRange", answers.ageRange || "31-50")}").`;

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
    return parsed;
  } catch {
    return null;
  }
}

function fallbackResult(answers: Answers): RecommendationResult {
  const concern = answers.primaryConcern?.trim() || "what you're feeling";
  return {
    summary:
      "We couldn't reach the herbalist AI just now, but here's a gentle, safe starting point you can build on. Please try again shortly for a fully personalized blend.",
    teas: [
      {
        name: "Calm & Comfort Infusion",
        herbs: ["Chamomile", "Lemon balm", "Ginger"],
        benefits: `A soothing baseline for ${concern} — gentle on the nervous system and easy to digest.`,
        preparation:
          "Steep 1 tsp of the blend in 250ml just-boiled water for 8–10 minutes, covered. Strain and sip warm.",
        bestTime: "Evening, or whenever symptoms flare",
        caution: "Skip if allergic to ragweed or daisies.",
      },
    ],
    meals: [
      {
        name: "Warming Root Vegetable Bowl",
        keyIngredients: ["Sweet potato", "Carrot", "Ginger", "Greens", "Olive oil"],
        why: "Whole-food, anti-inflammatory base that supports recovery without weighing you down.",
        briefRecipe:
          "Roast cubed sweet potato and carrot with grated ginger and olive oil at 200°C for 25 min. Serve over greens with a squeeze of lemon.",
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

export async function POST(request: Request) {
  let body: { answers?: Answers };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<RecommendApiResponse>(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const answers = body.answers;
  if (!answers || typeof answers !== "object") {
    return NextResponse.json<RecommendApiResponse>(
      { ok: false, error: "Missing answers" },
      { status: 400 }
    );
  }

  if (!answers.primaryConcern || answers.primaryConcern.trim().length < 2) {
    return NextResponse.json<RecommendApiResponse>(
      { ok: false, error: "Please describe your primary concern" },
      { status: 400 }
    );
  }

  const { system, user } = buildPrompt(answers);

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: system },
        { role: "user", content: user },
      ],
      thinking: { type: "disabled" },
    });

    const content = completion?.choices?.[0]?.message?.content ?? "";
    const parsed = safeParseJson(content);

    if (!parsed) {
      // Surface a graceful fallback so the UX never breaks
      return NextResponse.json<RecommendApiResponse>({
        ok: true,
        result: fallbackResult(answers),
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
      ok: true,
      result: fallbackResult(answers),
    });
  }
}
