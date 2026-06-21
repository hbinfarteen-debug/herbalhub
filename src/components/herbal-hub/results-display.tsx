"use client";

import { motion } from "framer-motion";
import {
  Coffee,
  UtensilsCrossed,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Clock,
  Leaf,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  RecommendationResult,
  TeaRecommendation,
  MealRecommendation,
  WellnessTip,
} from "@/lib/types";

interface ResultsDisplayProps {
  result: RecommendationResult;
  primaryConcern: string;
  onRestart: () => void;
}

export function ResultsDisplay({
  result,
  primaryConcern,
  onRestart,
}: ResultsDisplayProps) {
  return (
    <section className="relative">
      <div className="botanical-bg absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-14">
        {/* Header / summary */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Your personalized remedy
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A blend brewed just for you
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            {result.summary}
          </p>
          {primaryConcern && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground">
              <Leaf className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">For:</span>
              <span className="font-medium">{primaryConcern}</span>
            </div>
          )}
        </motion.div>

        {/* Teas */}
        <ResultSection
          icon={<Coffee className="h-5 w-5" />}
          eyebrow="Herbal Teas"
          title="Sip these through your day"
          description="Brewed gently to match your symptoms and constitution."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {result.teas.map((tea, i) => (
              <TeaCard key={i} tea={tea} index={i} />
            ))}
          </div>
        </ResultSection>

        {/* Meals */}
        <ResultSection
          icon={<UtensilsCrossed className="h-5 w-5" />}
          eyebrow="Nourishing Meals"
          title="Food as gentle medicine"
          description="Whole-food recipes that work with your diet and recovery."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {result.meals.map((meal, i) => (
              <MealCard key={i} meal={meal} index={i} />
            ))}
          </div>
        </ResultSection>

        {/* Wellness tips */}
        <ResultSection
          icon={<Sparkles className="h-5 w-5" />}
          eyebrow="Wellness Rituals"
          title="Small habits, steady recovery"
          description="Daily touches that help the herbs and meals do their work."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.wellnessTips.map((tip, i) => (
              <TipCard key={i} tip={tip} index={i} />
            ))}
          </div>
        </ResultSection>

        {/* Disclaimer */}
        <div className="mt-10 flex gap-3 rounded-2xl border border-amber-300/50 bg-amber-50/60 p-5 dark:border-amber-400/30 dark:bg-amber-500/10">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" />
          <p className="text-sm leading-relaxed text-amber-900/90 dark:text-amber-100/80">
            <span className="font-semibold">Wellness note: </span>
            {result.disclaimer}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            onClick={onRestart}
            variant="outline"
            className="gap-2 rounded-full"
          >
            <RotateCcw className="h-4 w-4" />
            Start a new consultation
          </Button>
          <Button
            onClick={() => window.print()}
            variant="ghost"
            className="gap-2 rounded-full"
          >
            <ShieldCheck className="h-4 w-4" />
            Save / print my remedy
          </Button>
        </div>
      </div>
    </section>
  );
}

function ResultSection({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function TeaCard({ tea, index }: { tea: TeaRecommendation; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="h-full overflow-hidden border-border/70 transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg leading-tight text-foreground">
                {tea.name}
              </CardTitle>
              <CardDescription className="mt-1.5 leading-relaxed">
                {tea.benefits}
              </CardDescription>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Coffee className="h-4 w-4" />
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {tea.herbs.map((herb) => (
              <Badge
                key={herb}
                variant="secondary"
                className="border-primary/20 bg-primary/5 font-medium text-primary"
              >
                <Leaf className="mr-1 h-3 w-3" />
                {herb}
              </Badge>
            ))}
          </div>

          <div className="rounded-xl bg-secondary/50 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Preparation
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {tea.preparation}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Best time:</span>
            <span>{tea.bestTime}</span>
          </div>

          {tea.caution && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300/40 bg-amber-50/60 p-2.5 text-xs leading-relaxed text-amber-900/90 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-100/80">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700 dark:text-amber-300" />
              <span>{tea.caution}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MealCard({ meal, index }: { meal: MealRecommendation; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="h-full overflow-hidden border-border/70 transition-shadow hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-1.5">
                <Badge
                  variant="outline"
                  className="border-accent/40 bg-accent/10 text-accent-foreground"
                >
                  {meal.mealType}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight text-foreground">
                {meal.name}
              </CardTitle>
              <CardDescription className="mt-1.5 leading-relaxed">
                {meal.why}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Key ingredients
            </p>
            <div className="flex flex-wrap gap-1.5">
              {meal.keyIngredients.map((ing) => (
                <Badge key={ing} variant="secondary" className="font-medium">
                  {ing}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-secondary/50 p-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              How to make it
            </p>
            <p className="text-sm leading-relaxed text-foreground/90">
              {meal.briefRecipe}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TipCard({ tip, index }: { tip: WellnessTip; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className="h-full border-border/70 bg-card/80 transition-shadow hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-2 p-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{tip.icon ?? "🌿"}</span>
            <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {tip.detail}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
