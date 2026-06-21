"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Leaf, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="botanical-bg absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="order-2 md:order-1"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            AI-guided herbal wellness
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Sip &amp; eat your way
            <br />
            back to{" "}
            <span className="relative whitespace-nowrap text-primary">
              balance
              <svg
                className="absolute -bottom-2 left-0 w-full text-accent"
                viewBox="0 0 200 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M2 9C40 3 160 3 198 9"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tell Herbal Hub what ails you. After 9 thoughtful questions, our AI
            blends traditional herbalism with your lifestyle to craft personalized
            teas and nourishing meals.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={onStart}
              className="group h-12 rounded-full px-7 text-base shadow-md transition-all hover:shadow-lg"
            >
              Find my remedy
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              ~2 minutes · 9 questions
            </div>
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            <TrustStat icon={<Leaf className="h-4 w-4" />} label="Herbal teas" value="Curated" />
            <TrustStat icon={<Sparkles className="h-4 w-4" />} label="Meal ideas" value="Tailored" />
            <TrustStat icon={<ShieldCheck className="h-4 w-4" />} label="Allergy-aware" value="Safe" />
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          className="order-1 md:order-2"
        >
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 blur-2xl" />
            <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-xl">
              <img
                src="/herbal/hero.png"
                alt="Fresh herbs, chamomile, mint, ginger, lemon and a steaming cup of herbal tea on a wooden table"
                className="aspect-[4/3] w-full object-cover"
                loading="eager"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-border/70 bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:-left-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Leaf className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-xs font-medium text-muted-foreground">Today&apos;s blend</p>
                <p className="text-sm font-semibold text-foreground">Chamomile · Ginger</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3 text-center">
      <div className="mx-auto mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <p className="text-sm font-semibold text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}
