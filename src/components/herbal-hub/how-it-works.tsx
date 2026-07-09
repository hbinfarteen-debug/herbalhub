"use client";

import { motion } from "framer-motion";
import { MessageSquareHeart, FlaskConical, Soup, ShieldAlert } from "lucide-react";

const STEPS = [
  {
    icon: MessageSquareHeart,
    title: "Share your story",
    body: "Answer 9 gentle questions about your symptoms, lifestyle, sleep, diet and more so that we get the full picture, not just the surface ache.",
  },
  {
    icon: FlaskConical,
    title: "AI brews your blend",
    body: "Our AI cross-references traditional herbalism with your inputs such as allergies, medications, age and severity to craft teas matched to you.",
  },
  {
    icon: Soup,
    title: "Eat & sip your remedy",
    body: "Get tailored herbal tea recipes plus nourishing meals and lifestyle tips that work with your diet and energy level.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          How it works
        </span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          From symptom to sip in three steps
        </h2>
<p className="mt-4 text-base leading-relaxed text-muted-foreground">
           Herbal Hub treats you like a whole person. We don&apos;t just hand you a
           tea we understand your context first.
         </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="relative rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <step.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold text-muted-foreground">
                Step {i + 1}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {step.body}
            </p>
          </motion.div>
        ))}
      </div>

      <About />
      <Disclaimer />
    </section>
  );
}

function About() {
  return (
    <div
      id="about"
      className="mt-20 grid items-center gap-8 rounded-3xl border border-border/70 bg-secondary/40 p-8 md:grid-cols-2 md:p-12"
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Our philosophy
        </span>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Old wisdom, new intelligence
        </h3>
<p className="mt-4 text-sm leading-relaxed text-muted-foreground">
           For thousands of years, herbalists matched plants to people not just
           to illnesses. A cup of chamomile for the anxious, ginger for the cold,
          turmeric for the inflamed. Herbal Hub carries that tradition forward
          with an AI that listens to the whole you: your sleep, your stress, your
          diet, your pace of life.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Every recommendation respects your allergies and medications, so the
          remedies soothe and never clash.
        </p>
      </div>
      <div className="relative">
        <div className="overflow-hidden rounded-2xl border border-border/70 shadow-lg">
          <img
            src="/herbal/herbs.png"
            alt="Dried herbs and tea ingredients in small wooden bowls"
            className="aspect-square w-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function Disclaimer() {
  return (
    <div
      id="disclaimer"
      className="mt-10 flex gap-4 rounded-2xl border border-amber-300/50 bg-amber-50/60 p-5 dark:border-amber-400/30 dark:bg-amber-500/10"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/70 text-amber-800 dark:bg-amber-400/20 dark:text-amber-300">
        <ShieldAlert className="h-5 w-5" />
      </span>
      <div>
        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
          Wellness, not a prescription
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-amber-800/90 dark:text-amber-100/80">
          Herbal Hub offers educational, lifestyle-oriented suggestions and is
          not a substitute for professional medical advice. Always consult a
          qualified healthcare provider for diagnosis and treatment especially
          if you are pregnant, nursing, on medication, or managing a chronic
          condition.
        </p>
      </div>
    </div>
  );
}
