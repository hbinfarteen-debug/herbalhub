import type { Question } from "./types";

// The 9-question intake that gives the AI a holistic picture
// of the user before recommending herbs & meals.
export const QUESTIONS: Question[] = [
  {
    id: "primaryConcern",
    type: "textarea",
    isPrimary: true,
    required: true,
    title: "What's the main pain, symptom, or illness you'd like help with?",
    subtitle:
      "Describe what you're feeling in your own words — the more detail, the better the remedy.",
    placeholder:
      "e.g. I've had a tension headache behind my eyes and feel jittery…",
  },
  {
    id: "duration",
    type: "choice",
    required: true,
    title: "How long have you been experiencing this?",
    subtitle: "Duration helps gauge whether you need soothing or sustained support.",
    options: [
      { value: "today", label: "Just started today", icon: "⚡" },
      { value: "few-days", label: "A few days", icon: "🌱" },
      { value: "week", label: "About a week", icon: "🌿" },
      { value: "several-weeks", label: "Several weeks", icon: "🍃" },
      { value: "chronic", label: "Chronic / ongoing (months+)", icon: "🌳" },
    ],
  },
  {
    id: "severity",
    type: "choice",
    required: true,
    title: "How intense would you say it is right now?",
    subtitle: "This helps balance potency with gentleness in the recommendations.",
    options: [
      {
        value: "mild",
        label: "Mild",
        description: "Noticeable but I can carry on with my day",
        icon: "•",
      },
      {
        value: "moderate",
        label: "Moderate",
        description: "Affects my focus and energy",
        icon: "••",
      },
      {
        value: "severe",
        label: "Severe",
        description: "Hard to function normally",
        icon: "•••",
      },
    ],
  },
  {
    id: "ageRange",
    type: "choice",
    required: true,
    title: "Which age range do you fall into?",
    subtitle: "Some herbs are best tailored to different life stages.",
    options: [
      { value: "under-18", label: "Under 18" },
      { value: "18-30", label: "18 – 30" },
      { value: "31-50", label: "31 – 50" },
      { value: "51-65", label: "51 – 65" },
      { value: "over-65", label: "Over 65" },
    ],
  },
  {
    id: "allergies",
    type: "text",
    title: "Any known allergies?",
    subtitle:
      "Especially to plants, herbs, pollens, or foods. Type 'none' if you don't have any.",
    placeholder: "e.g. ragweed, chamomile, peanuts, none…",
  },
  {
    id: "medications",
    type: "text",
    title: "Are you taking any medications or supplements?",
    subtitle:
      "Important to avoid herb–drug interactions. Type 'none' if you aren't taking anything.",
    placeholder: "e.g. blood pressure meds, iron supplement, birth control, none…",
  },
  {
    id: "diet",
    type: "choice",
    required: true,
    title: "What's your dietary preference?",
    subtitle: "So every meal suggestion actually fits your kitchen.",
    options: [
      { value: "omnivore", label: "Omnivore", description: "I eat everything", icon: "🍽️" },
      { value: "vegetarian", label: "Vegetarian", icon: "🥗" },
      { value: "vegan", label: "Vegan", icon: "🌱" },
      { value: "gluten-free", label: "Gluten-free", icon: "🌾" },
      { value: "dairy-free", label: "Dairy-free", icon: "🥛" },
      { value: "keto", label: "Keto / low-carb", icon: "🥑" },
    ],
  },
  {
    id: "activity",
    type: "choice",
    required: true,
    title: "How active is your typical day?",
    subtitle: "Activity level shapes energy and recovery needs.",
    options: [
      { value: "sedentary", label: "Mostly sedentary", description: "Desk-bound, little movement" },
      { value: "light", label: "Lightly active", description: "Some walking, light movement" },
      { value: "active", label: "Active", description: "Regular exercise a few times a week" },
      { value: "very-active", label: "Very active", description: "Daily training or physical work" },
    ],
  },
  {
    id: "sleepStress",
    type: "choice",
    required: true,
    title: "How are your sleep and stress lately?",
    subtitle: "These two quietly shape almost every other symptom.",
    options: [
      {
        value: "poor-sleep-high-stress",
        label: "Poor sleep, high stress",
        description: "Wired and tired",
        icon: "😵",
      },
      {
        value: "poor-sleep-low-stress",
        label: "Poor sleep, low stress",
        description: "Tired but calm",
        icon: "😴",
      },
      {
        value: "good-sleep-high-stress",
        label: "Good sleep, high stress",
        description: "Rested but tense",
        icon: "😤",
      },
      {
        value: "good-sleep-low-stress",
        label: "Good sleep, low stress",
        description: "Rested and relaxed",
        icon: "😌",
      },
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTIONS.length;
