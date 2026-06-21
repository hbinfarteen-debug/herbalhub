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

export interface TeaRecommendation {
  name: string;
  herbs: string[];
  benefits: string;
  preparation: string;
  bestTime: string;
  caution?: string;
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
}

export interface RecommendApiResponse {
  ok: boolean;
  result?: RecommendationResult;
  error?: string;
}
