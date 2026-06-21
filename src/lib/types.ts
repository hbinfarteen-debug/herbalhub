// Shared types for Herbal Hub

export type QuestionType = "text" | "choice" | "textarea";

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  subtitle?: string;
  placeholder?: string;
  options?: ChoiceOption[];
  required?: boolean;
  /** when true, the input is the primary symptom that drives recommendations */
  isPrimary?: boolean;
}

export type Answers = Record<string, string>;

// Context gathered in the pre-quiz onboarding popup. These shape the whole
// consultation: region drives ingredient availability, sex & pregnancy drive
// herb safety.
export type BiologicalSex = "male" | "female" | "prefer-not";
export type PregnancyStatus =
  | "not-pregnant"
  | "pregnant"
  | "nursing"
  | "trying";

export interface UserProfile {
  /** Human-readable country or region, e.g. "Zimbabwe" */
  region: string;
  /** Culinary/herbal macro-region the country belongs to, e.g. "Southern Africa" */
  macroRegion?: string;
  sex: BiologicalSex;
  /** Only relevant when sex is female */
  pregnancy?: PregnancyStatus;
}

/** Which tier of complexity a tea blend represents. */
export type BlendStyle = "simple" | "optimum" | "superblend";

export interface TeaRecommendation {
  name: string;
  /** Up to 6 herbs/spices — a "super drink" blend */
  herbs: string[];
  benefits: string;
  preparation: string;
  bestTime: string;
  caution?: string;
  /** Where to forage or source the wild/weed herbs in the blend, e.g. "Purslane grows as a low spreading weed in cultivated beds and disturbed soil; dandelion along field edges." Omit if all ingredients are store-bought. */
  whereToFind?: string;
  /** Complexity tier: simple (fewest ingredients), optimum (balanced), superblend (many). */
  blendStyle?: BlendStyle;
}

export interface MealRecommendation {
  name: string;
  keyIngredients: string[];
  why: string;
  briefRecipe: string;
  mealType: string;
}

export interface WellnessTip {
  title: string;
  detail: string;
  icon?: string;
}

export interface RecommendationResult {
  summary: string;
  teas: TeaRecommendation[];
  meals: MealRecommendation[];
  wellnessTips: WellnessTip[];
  disclaimer: string;
}

export interface RecommendRequestBody {
  answers: Answers;
  profile: UserProfile;
}

export interface RecommendApiResponse {
  ok: boolean;
  result?: RecommendationResult;
  error?: string;
}
