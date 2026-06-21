import type {
  BiologicalSex,
  PregnancyStatus,
} from "./types";

// Macro culinary / herbal regions. These map countries into broad traditions
// so the AI can reason about locally available plants and staple foods.
export type MacroRegion =
  | "Southern Africa"
  | "East Africa"
  | "West & Central Africa"
  | "North Africa"
  | "South Asia"
  | "East Asia"
  | "Southeast Asia"
  | "Middle East & Central Asia"
  | "Mediterranean"
  | "Northern & Western Europe"
  | "Central & Eastern Europe"
  | "Latin America & Caribbean"
  | "North America"
  | "Oceania"
  | "Other / not listed";

export interface Country {
  name: string;
  macro: MacroRegion;
}

// A curated, globally representative country list. Searchable in the combobox.
export const COUNTRIES: Country[] = [
  // Southern Africa
  { name: "Zimbabwe", macro: "Southern Africa" },
  { name: "South Africa", macro: "Southern Africa" },
  { name: "Botswana", macro: "Southern Africa" },
  { name: "Zambia", macro: "Southern Africa" },
  { name: "Namibia", macro: "Southern Africa" },
  { name: "Malawi", macro: "Southern Africa" },
  { name: "Mozambique", macro: "Southern Africa" },
  { name: "Lesotho", macro: "Southern Africa" },
  { name: "Eswatini", macro: "Southern Africa" },
  { name: "Madagascar", macro: "Southern Africa" },
  // East Africa
  { name: "Kenya", macro: "East Africa" },
  { name: "Tanzania", macro: "East Africa" },
  { name: "Uganda", macro: "East Africa" },
  { name: "Ethiopia", macro: "East Africa" },
  { name: "Rwanda", macro: "East Africa" },
  { name: "Somalia", macro: "East Africa" },
  { name: "Sudan", macro: "East Africa" },
  { name: "South Sudan", macro: "East Africa" },
  { name: "Eritrea", macro: "East Africa" },
  { name: "Djibouti", macro: "East Africa" },
  // West & Central Africa
  { name: "Nigeria", macro: "West & Central Africa" },
  { name: "Ghana", macro: "West & Central Africa" },
  { name: "Senegal", macro: "West & Central Africa" },
  { name: "Côte d'Ivoire", macro: "West & Central Africa" },
  { name: "Cameroon", macro: "West & Central Africa" },
  { name: "Democratic Republic of the Congo", macro: "West & Central Africa" },
  { name: "Mali", macro: "West & Central Africa" },
  { name: "Burkina Faso", macro: "West & Central Africa" },
  { name: "Niger", macro: "West & Central Africa" },
  { name: "Benin", macro: "West & Central Africa" },
  { name: "Togo", macro: "West & Central Africa" },
  { name: "Sierra Leone", macro: "West & Central Africa" },
  { name: "Liberia", macro: "West & Central Africa" },
  // North Africa
  { name: "Egypt", macro: "North Africa" },
  { name: "Morocco", macro: "North Africa" },
  { name: "Tunisia", macro: "North Africa" },
  { name: "Algeria", macro: "North Africa" },
  { name: "Libya", macro: "North Africa" },
  // South Asia
  { name: "India", macro: "South Asia" },
  { name: "Pakistan", macro: "South Asia" },
  { name: "Bangladesh", macro: "South Asia" },
  { name: "Sri Lanka", macro: "South Asia" },
  { name: "Nepal", macro: "South Asia" },
  // East Asia
  { name: "China", macro: "East Asia" },
  { name: "Japan", macro: "East Asia" },
  { name: "South Korea", macro: "East Asia" },
  { name: "Mongolia", macro: "East Asia" },
  { name: "Taiwan", macro: "East Asia" },
  // Southeast Asia
  { name: "Indonesia", macro: "Southeast Asia" },
  { name: "Vietnam", macro: "Southeast Asia" },
  { name: "Thailand", macro: "Southeast Asia" },
  { name: "Philippines", macro: "Southeast Asia" },
  { name: "Malaysia", macro: "Southeast Asia" },
  { name: "Myanmar", macro: "Southeast Asia" },
  { name: "Cambodia", macro: "Southeast Asia" },
  { name: "Singapore", macro: "Southeast Asia" },
  // Middle East & Central Asia
  { name: "Turkey", macro: "Middle East & Central Asia" },
  { name: "Iran", macro: "Middle East & Central Asia" },
  { name: "Saudi Arabia", macro: "Middle East & Central Asia" },
  { name: "United Arab Emirates", macro: "Middle East & Central Asia" },
  { name: "Iraq", macro: "Middle East & Central Asia" },
  { name: "Lebanon", macro: "Middle East & Central Asia" },
  { name: "Israel", macro: "Middle East & Central Asia" },
  { name: "Jordan", macro: "Middle East & Central Asia" },
  { name: "Kazakhstan", macro: "Middle East & Central Asia" },
  { name: "Uzbekistan", macro: "Middle East & Central Asia" },
  { name: "Afghanistan", macro: "Middle East & Central Asia" },
  // Mediterranean
  { name: "Greece", macro: "Mediterranean" },
  { name: "Italy", macro: "Mediterranean" },
  { name: "Spain", macro: "Mediterranean" },
  { name: "Portugal", macro: "Mediterranean" },
  { name: "Cyprus", macro: "Mediterranean" },
  { name: "Malta", macro: "Mediterranean" },
  // Northern & Western Europe
  { name: "United Kingdom", macro: "Northern & Western Europe" },
  { name: "Ireland", macro: "Northern & Western Europe" },
  { name: "France", macro: "Northern & Western Europe" },
  { name: "Germany", macro: "Northern & Western Europe" },
  { name: "Netherlands", macro: "Northern & Western Europe" },
  { name: "Belgium", macro: "Northern & Western Europe" },
  { name: "Switzerland", macro: "Northern & Western Europe" },
  { name: "Austria", macro: "Northern & Western Europe" },
  { name: "Sweden", macro: "Northern & Western Europe" },
  { name: "Norway", macro: "Northern & Western Europe" },
  { name: "Denmark", macro: "Northern & Western Europe" },
  { name: "Finland", macro: "Northern & Western Europe" },
  { name: "Iceland", macro: "Northern & Western Europe" },
  // Central & Eastern Europe
  { name: "Poland", macro: "Central & Eastern Europe" },
  { name: "Romania", macro: "Central & Eastern Europe" },
  { name: "Czechia", macro: "Central & Eastern Europe" },
  { name: "Hungary", macro: "Central & Eastern Europe" },
  { name: "Bulgaria", macro: "Central & Eastern Europe" },
  { name: "Serbia", macro: "Central & Eastern Europe" },
  { name: "Croatia", macro: "Central & Eastern Europe" },
  { name: "Ukraine", macro: "Central & Eastern Europe" },
  { name: "Russia", macro: "Central & Eastern Europe" },
  // Latin America & Caribbean
  { name: "Mexico", macro: "Latin America & Caribbean" },
  { name: "Brazil", macro: "Latin America & Caribbean" },
  { name: "Argentina", macro: "Latin America & Caribbean" },
  { name: "Colombia", macro: "Latin America & Caribbean" },
  { name: "Peru", macro: "Latin America & Caribbean" },
  { name: "Chile", macro: "Latin America & Caribbean" },
  { name: "Venezuela", macro: "Latin America & Caribbean" },
  { name: "Ecuador", macro: "Latin America & Caribbean" },
  { name: "Bolivia", macro: "Latin America & Caribbean" },
  { name: "Cuba", macro: "Latin America & Caribbean" },
  { name: "Dominican Republic", macro: "Latin America & Caribbean" },
  { name: "Jamaica", macro: "Latin America & Caribbean" },
  { name: "Haiti", macro: "Latin America & Caribbean" },
  { name: "Puerto Rico", macro: "Latin America & Caribbean" },
  // North America
  { name: "United States", macro: "North America" },
  { name: "Canada", macro: "North America" },
  // Oceania
  { name: "Australia", macro: "Oceania" },
  { name: "New Zealand", macro: "Oceania" },
  { name: "Fiji", macro: "Oceania" },
  { name: "Papua New Guinea", macro: "Oceania" },
];

// Build a country -> macro-region lookup
const COUNTRY_MACRO = new Map(COUNTRIES.map((c) => [c.name, c.macro]));

export function macroForCountry(name: string): MacroRegion | undefined {
  return COUNTRY_MACRO.get(name);
}

// Order macro regions for display
export const MACRO_REGION_ORDER: MacroRegion[] = [
  "Southern Africa",
  "East Africa",
  "West & Central Africa",
  "North Africa",
  "South Asia",
  "East Asia",
  "Southeast Asia",
  "Middle East & Central Asia",
  "Mediterranean",
  "Northern & Western Europe",
  "Central & Eastern Europe",
  "Latin America & Caribbean",
  "North America",
  "Oceania",
  "Other / not listed",
];

export const SEX_OPTIONS: {
  value: BiologicalSex;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "female",
    label: "Female",
    description: "Allows pregnancy & nursing safety checks",
    icon: "♀",
  },
  {
    value: "male",
    label: "Male",
    description: "Tailors hormone- & prostate-relevant herbs",
    icon: "♂",
  },
  {
    value: "prefer-not",
    label: "Prefer not to say",
    description: "We'll keep recommendations broadly safe",
    icon: "•",
  },
];

export const PREGNANCY_OPTIONS: {
  value: PregnancyStatus;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "not-pregnant",
    label: "Not pregnant",
    description: "No pregnancy restrictions",
    icon: "🚫",
  },
  {
    value: "pregnant",
    label: "Pregnant",
    description: "Avoid uterine-stimulating herbs",
    icon: "🤰",
  },
  {
    value: "nursing",
    label: "Nursing / breastfeeding",
    description: "Favor milk-supporting, baby-safe herbs",
    icon: "🍼",
  },
  {
    value: "trying",
    label: "Trying to conceive",
    description: "Gentle, fertility-conscious choices",
    icon: "🌱",
  },
];

// Best-effort timezone -> country hint so the combobox can pre-select.
// Covers common IANA zones. Returns undefined if unknown.
const TZ_TO_COUNTRY: Record<string, string> = {
  "Africa/Harare": "Zimbabwe",
  "Africa/Maputo": "Mozambique",
  "Africa/Johannesburg": "South Africa",
  "Africa/Gaborone": "Botswana",
  "Africa/Lusaka": "Zambia",
  "Africa/Lilongwe": "Malawi",
  "Africa/Windhoek": "Namibia",
  "Africa/Maseru": "Lesotho",
  "Africa/Mbabane": "Eswatini",
  "Antananarivo": "Madagascar",
  "Africa/Nairobi": "Kenya",
  "Africa/Dar_es_Salaam": "Tanzania",
  "Africa/Kampala": "Uganda",
  "Africa/Addis_Ababa": "Ethiopia",
  "Africa/Kigali": "Rwanda",
  "Africa/Mogadishu": "Somalia",
  "Africa/Khartoum": "Sudan",
  "Africa/Juba": "South Sudan",
  "Africa/Asmara": "Eritrea",
  "Africa/Lagos": "Nigeria",
  "Africa/Accra": "Ghana",
  "Africa/Dakar": "Senegal",
  "Africa/Abidjan": "Côte d'Ivoire",
  "Africa/Douala": "Cameroon",
  "Africa/Kinshasa": "Democratic Republic of the Congo",
  "Africa/Bamako": "Mali",
  "Africa/Ouagadougou": "Burkina Faso",
  "Africa/Niamey": "Niger",
  "Africa/Porto-Novo": "Benin",
  "Africa/Lome": "Togo",
  "Africa/Freetown": "Sierra Leone",
  "Africa/Monrovia": "Liberia",
  "Africa/Cairo": "Egypt",
  "Africa/Casablanca": "Morocco",
  "Africa/Tunis": "Tunisia",
  "Africa/Algiers": "Algeria",
  "Africa/Tripoli": "Libya",
  "Asia/Kolkata": "India",
  "Asia/Karachi": "Pakistan",
  "Asia/Dhaka": "Bangladesh",
  "Asia/Colombo": "Sri Lanka",
  "Asia/Kathmandu": "Nepal",
  "Asia/Shanghai": "China",
  "Asia/Tokyo": "Japan",
  "Asia/Seoul": "South Korea",
  "Asia/Ulaanbaatar": "Mongolia",
  "Asia/Taipei": "Taiwan",
  "Asia/Jakarta": "Indonesia",
  "Asia/Ho_Chi_Minh": "Vietnam",
  "Asia/Bangkok": "Thailand",
  "Asia/Manila": "Philippines",
  "Asia/Kuala_Lumpur": "Malaysia",
  "Asia/Yangon": "Myanmar",
  "Asia/Phnom_Penh": "Cambodia",
  "Asia/Singapore": "Singapore",
  "Asia/Istanbul": "Turkey",
  "Asia/Tehran": "Iran",
  "Asia/Riyadh": "Saudi Arabia",
  "Asia/Dubai": "United Arab Emirates",
  "Asia/Baghdad": "Iraq",
  "Asia/Beirut": "Lebanon",
  "Asia/Jerusalem": "Israel",
  "Asia/Amman": "Jordan",
  "Asia/Almaty": "Kazakhstan",
  "Asia/Tashkent": "Uzbekistan",
  "Asia/Kabul": "Afghanistan",
  "Europe/Athens": "Greece",
  "Europe/Rome": "Italy",
  "Europe/Madrid": "Spain",
  "Europe/Lisbon": "Portugal",
  "Asia/Nicosia": "Cyprus",
  "Europe/Malta": "Malta",
  "Europe/London": "United Kingdom",
  "Europe/Dublin": "Ireland",
  "Europe/Paris": "France",
  "Europe/Berlin": "Germany",
  "Europe/Amsterdam": "Netherlands",
  "Europe/Brussels": "Belgium",
  "Europe/Zurich": "Switzerland",
  "Europe/Vienna": "Austria",
  "Europe/Stockholm": "Sweden",
  "Europe/Oslo": "Norway",
  "Europe/Copenhagen": "Denmark",
  "Europe/Helsinki": "Finland",
  "Atlantic/Reykjavik": "Iceland",
  "Europe/Warsaw": "Poland",
  "Europe/Bucharest": "Romania",
  "Europe/Prague": "Czechia",
  "Europe/Budapest": "Hungary",
  "Europe/Sofia": "Bulgaria",
  "Europe/Belgrade": "Serbia",
  "Europe/Zagreb": "Croatia",
  "Europe/Kyiv": "Ukraine",
  "Europe/Moscow": "Russia",
  "America/Mexico_City": "Mexico",
  "America/Sao_Paulo": "Brazil",
  "America/Argentina/Buenos_Aires": "Argentina",
  "America/Bogota": "Colombia",
  "America/Lima": "Peru",
  "America/Santiago": "Chile",
  "America/Caracas": "Venezuela",
  "America/Guayaquil": "Ecuador",
  "America/La_Paz": "Bolivia",
  "America/Havana": "Cuba",
  "America/Santo_Domingo": "Dominican Republic",
  "America/Jamaica": "Jamaica",
  "America/Port-au-Prince": "Haiti",
  "America/Puerto_Rico": "Puerto Rico",
  "America/New_York": "United States",
  "America/Chicago": "United States",
  "America/Denver": "United States",
  "America/Los_Angeles": "United States",
  "America/Toronto": "Canada",
  "America/Vancouver": "Canada",
  "Australia/Sydney": "Australia",
  "Australia/Melbourne": "Australia",
  "Pacific/Auckland": "New Zealand",
  "Pacific/Fiji": "Fiji",
  "Pacific/Port_Moresby": "Papua New Guinea",
};

export function detectCountryFromTimezone(): string | undefined {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return undefined;
    return TZ_TO_COUNTRY[tz];
  } catch {
    return undefined;
  }
}
