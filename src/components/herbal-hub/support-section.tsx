"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Copy, Check, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

// EcoCash mobile-money details for Barry Changwa (Zimbabwe).
const ECOCASH_NUMBER = "0775939688";
const ECOCASH_ACCOUNT_NAME = "Barry Changwa";

export function SupportSection() {
  const [copied, setCopied] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(ECOCASH_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available — no-op
    }
  };

  return (
    <section id="support" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 p-8 sm:p-12"
      >
        <div className="botanical-bg absolute inset-0 -z-10 opacity-70" aria-hidden />

        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur">
            <Heart className="h-3.5 w-3.5 fill-primary" />
            Support Herbal Hub
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Keep the kettle brewing
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Herbal Hub is free for everyone. Your support keeps the servers
            running, the AI brewing, and helps bring more projects like this to
            life — that way plant wisdom stays within everyone&apos;s reach. Every cup
            of gratitude counts.
          </p>
        </div>

        {/* EcoCash support card */}
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Smartphone className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Support via EcoCash
              </p>
              <p className="text-sm font-semibold text-foreground">
                Mobile money · Zimbabwe
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">
                Account name
              </span>
              <span className="text-sm font-bold text-foreground">
                {ECOCASH_ACCOUNT_NAME}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
              <span className="text-xs font-medium text-muted-foreground">
                EcoCash number
              </span>
              <span className="text-sm font-bold tracking-wide text-foreground">
                {ECOCASH_NUMBER}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Button
              onClick={copyNumber}
              variant="outline"
              className="flex-1 gap-2 rounded-full"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-primary" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy number
                </>
              )}
            </Button>
            <a
              href={`tel:+263775939688`}
              className="flex-1"
            >
              <Button className="w-full gap-2 rounded-full">
                <Heart className="h-4 w-4 fill-primary-foreground" />
                Support {ECOCASH_ACCOUNT_NAME.split(" ")[0]}
              </Button>
            </a>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Dial <span className="font-semibold text-foreground">*153#</span> on
            your phone to send EcoCash to{" "}
            <span className="font-semibold text-foreground">
              {ECOCASH_NUMBER}
            </span>{" "}
            · Account:{" "}
            <span className="font-semibold text-foreground">
              {ECOCASH_ACCOUNT_NAME}
            </span>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Thank you for keeping plant wisdom accessible to all 🌿
        </p>
      </motion.div>
    </section>
  );
}
