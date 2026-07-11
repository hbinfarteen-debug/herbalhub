"use client";

import { useCallback, useState } from "react";
import { SiteHeader } from "@/components/herbal-hub/site-header";
import { SiteFooter } from "@/components/herbal-hub/site-footer";
import { Hero } from "@/components/herbal-hub/hero";
import { HowItWorks } from "@/components/herbal-hub/how-it-works";
import { OnboardingDialog } from "@/components/herbal-hub/onboarding-dialog";
import { QuestionnaireWizard } from "@/components/herbal-hub/questionnaire-wizard";
import { LoadingState } from "@/components/herbal-hub/loading-state";
import { ResultsDisplay } from "@/components/herbal-hub/results-display";
import { SupportSection } from "@/components/herbal-hub/support-section";
import { WhatsAppButton } from "@/components/herbal-hub/whatsapp-button";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import type { Answers, RecommendationResult, UserProfile } from "@/lib/types";

type Stage = "intro" | "questions" | "loading" | "results" | "error";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [primaryConcern, setPrimaryConcern] = useState("");
  const [answers, setAnswers] = useState<Answers | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const startConsultation = useCallback(() => {
    setResult(null);
    setErrorMsg("");
    setOnboardingOpen(true);
  }, []);

  const handleOnboardingComplete = useCallback((p: UserProfile) => {
    setProfile(p);
    setStage("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleComplete = useCallback(
    async (answers: Answers) => {
      setPrimaryConcern(answers.primaryConcern?.trim() || "");
      setAnswers(answers);
      setStage("loading");
      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, profile }),
        });

        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const data = (await res.json()) as {
          ok: boolean;
          result?: RecommendationResult;
          error?: string;
        };

        if (!data.ok || !data.result) {
          throw new Error(data.error || "No recommendations returned");
        }

        setResult(data.result);
        setStage("results");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error("[herbal-hub] recommend failed:", err);
        setErrorMsg(
          err instanceof Error ? err.message : "Something went wrong."
        );
        setStage("error");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [profile]
  );

  const retryWithSaved = useCallback(async () => {
    if (!answers || !profile) return;
    setResult(null);
    setErrorMsg("");
    setStage("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, profile }),
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = (await res.json()) as {
        ok: boolean;
        result?: RecommendationResult;
        error?: string;
      };

      if (!data.ok || !data.result) {
        throw new Error(data.error || "No recommendations returned");
      }

      setResult(data.result);
      setStage("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[herbal-hub] recommend failed:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setStage("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [answers, profile]);

  const restart = useCallback(() => {
    setResult(null);
    setErrorMsg("");
    setPrimaryConcern("");
    setAnswers(null);
    setProfile(null);
    setStage("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader onRestart={restart} />

      <main className="flex-1">
        {stage === "intro" && (
          <>
            <Hero onStart={startConsultation} />
            <HowItWorks />
            <StartCTA onStart={startConsultation} />
            <SupportSection />
          </>
        )}

        {stage === "questions" && (
          <QuestionnaireWizard
            onComplete={handleComplete}
            onExit={restart}
          />
        )}

        {stage === "loading" && <LoadingState />}

        {stage === "results" && result && profile && (
          <ResultsDisplay
            result={result}
            primaryConcern={primaryConcern}
            profile={profile}
            onRestart={restart}
            onRetry={answers ? retryWithSaved : undefined}
          />
        )}

        {stage === "error" && (
          <ErrorState message={errorMsg} onRetry={retryWithSaved} onHome={restart} />
        )}
      </main>

      <SiteFooter />

      {/* Floating WhatsApp chat button — always visible */}
      <WhatsAppButton />

      {/* Pre-quiz onboarding popup: region + sex + pregnancy */}
      <OnboardingDialog
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}

function StartCTA({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 text-center sm:p-12">
        <div className="botanical-bg absolute inset-0 -z-10 opacity-70" aria-hidden />
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Ready to find your remedy?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Nine gentle questions stand between you and a personalized cup of
          healing. Let&apos;s begin.
        </p>
        <Button
          size="lg"
          onClick={onStart}
          className="mt-6 h-12 rounded-full px-8 text-base shadow-md"
        >
          Start the consultation
        </Button>
      </div>
    </section>
  );
}

function ErrorState({
  message,
  onRetry,
  onHome,
}: {
  message: string;
  onRetry: () => void;
  onHome: () => void;
}) {
  return (
    <section className="relative">
      <div className="botanical-bg absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
          The kettle went cold
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          We couldn&apos;t brew your remedy just now. {message} Please try again
          in a moment.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button onClick={onRetry} className="gap-2 rounded-full">
            <RotateCcw className="h-4 w-4" />
            Try again
          </Button>
          <Button onClick={onHome} variant="outline" className="rounded-full">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}
