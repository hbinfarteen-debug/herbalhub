"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import type { Answers, Question } from "@/lib/types";

interface QuestionnaireWizardProps {
  onComplete: (answers: Answers) => void;
  onExit: () => void;
}

export function QuestionnaireWizard({ onComplete, onExit }: QuestionnaireWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question = QUESTIONS[step];
  const progress = useMemo(() => ((step + 1) / TOTAL_QUESTIONS) * 100, [step]);

  const currentAnswer = answers[question.id] ?? "";

  const isStepValid = (() => {
    if (!question.required) return true;
    return currentAnswer.trim().length > 0;
  })();

  const goNext = useCallback(() => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (question.required && currentAnswer.trim().length === 0) return;
    if (step < TOTAL_QUESTIONS - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      onComplete(answers);
    }
  }, [question, step, currentAnswer, answers, onComplete]);

  const updateAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  // For choice questions: select then auto-advance after a short beat so the
  // user sees their selection, unless this is the final question.
  const selectChoice = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (step < TOTAL_QUESTIONS - 1) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => {
        setDirection(1);
        setStep((s) => s + 1);
        advanceTimer.current = null;
      }, 480);
    }
  };

  const goBack = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  return (
    <section className="relative">
      <div className="botanical-bg absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-14">
        {/* Top bar: exit + progress */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={onExit}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card/80 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Exit questionnaire"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>
                Question {step + 1} of {TOTAL_QUESTIONS}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>

        {/* Question card */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur sm:p-9">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <QuestionView
                question={question}
                value={currentAnswer}
                onChange={updateAnswer}
                onSelectChoice={selectChoice}
                onEnter={goNext}
              />
            </motion.div>
          </AnimatePresence>

          {/* Nav buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-6">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={step === 0}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-1.5">
              {QUESTIONS.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => {
                    if (i < step) {
                      setDirection(-1);
                      setStep(i);
                    }
                  }}
                  aria-label={`Go to question ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === step
                      ? "w-6 bg-primary"
                      : i < step
                        ? "w-1.5 bg-primary/60"
                        : "w-1.5 bg-border"
                  )}
                />
              ))}
            </div>

            <Button
              onClick={goNext}
              disabled={!isStepValid}
              className="gap-1.5 rounded-full px-6"
            >
              {step === TOTAL_QUESTIONS - 1 ? (
                <>
                  Brew my remedy
                  <Check className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your answers stay in this session and are only used to shape your
          recommendations.
        </p>
      </div>
    </section>
  );
}

function QuestionView({
  question,
  value,
  onChange,
  onSelectChoice,
  onEnter,
}: {
  question: Question;
  value: string;
  onChange: (v: string) => void;
  onSelectChoice: (v: string) => void;
  onEnter: () => void;
}) {
  if (question.type === "textarea" || question.type === "text") {
    return (
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {question.title}
        </h2>
        {question.subtitle && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {question.subtitle}
          </p>
        )}
        <div className="mt-6">
          {question.type === "textarea" ? (
            <Textarea
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onEnter();
              }}
              placeholder={question.placeholder}
              className="min-h-[120px] resize-none text-base"
            />
          ) : (
            <Input
              autoFocus
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onEnter();
              }}
              placeholder={question.placeholder}
              className="h-12 text-base"
            />
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Tip: press{" "}
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium">
              {question.type === "textarea" ? "⌘ + Enter" : "Enter"}
            </kbd>{" "}
            to continue
          </p>
        </div>
      </div>
    );
  }

  // choice
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {question.title}
      </h2>
      {question.subtitle && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {question.subtitle}
        </p>
      )}
      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {question.options?.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectChoice(opt.value)}
              className={cn(
                "group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                  : "border-border/70 bg-background hover:border-primary/40 hover:bg-secondary/50"
              )}
            >
              {opt.icon && (
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base transition-colors",
                    selected
                      ? "bg-primary/15 text-primary"
                      : "bg-secondary text-foreground/70 group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  {opt.icon}
                </span>
              )}
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {opt.description}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border opacity-0 group-hover:opacity-50"
                )}
              >
                {selected && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
