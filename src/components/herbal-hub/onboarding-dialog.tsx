"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Check, ChevronsUpDown, MapPin, Heart, ArrowRight, Leaf } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  COUNTRIES,
  MACRO_REGION_ORDER,
  SEX_OPTIONS,
  PREGNANCY_OPTIONS,
  detectCountryFromTimezone,
  macroForCountry,
} from "@/lib/onboarding";
import type {
  BiologicalSex,
  PregnancyStatus,
  UserProfile,
} from "@/lib/types";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingDialog({
  open,
  onOpenChange,
  onComplete,
}: OnboardingDialogProps) {
  const [region, setRegion] = useState<string>("");
  const [sex, setSex] = useState<BiologicalSex | "">("");
  const [pregnancy, setPregnancy] = useState<PregnancyStatus | "">("");
  const [comboOpen, setComboOpen] = useState(false);
  const [detected, setDetected] = useState<string | undefined>();

  // Auto-detect country from the browser timezone once, on mount. This must
  // run on the client (not during SSR) to reflect the user's actual locale,
  // so we intentionally seed state from a browser-only API here.
  useEffect(() => {
    const guess = detectCountryFromTimezone();
    if (guess) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDetected(guess);
      setRegion(guess);
    }
  }, []);

  // Selecting a biological sex — also clears any stale pregnancy choice so a
  // female-only value never lingers after switching to male/prefer-not.
  const handleSexChange = (value: BiologicalSex) => {
    setSex(value);
    if (value !== "female") setPregnancy("");
  };

  const canSubmit =
    region.trim().length > 0 && sex !== "" && (sex !== "female" || pregnancy !== "");

  const handleSubmit = () => {
    if (!canSubmit) return;
    const macro = macroForCountry(region);
    const profile: UserProfile = {
      region,
      macroRegion: macro,
      sex: sex as BiologicalSex,
      pregnancy:
        sex === "female" ? (pregnancy as PregnancyStatus) : undefined,
    };
    onOpenChange(false);
    onComplete(profile);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto gap-0 p-0 sm:max-w-lg">
        {/* Header band */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/12 via-accent/10 to-primary/5 px-6 py-7">
          <div className="botanical-bg absolute inset-0 -z-10 opacity-80" aria-hidden />
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Leaf className="h-5 w-5" />
              </span>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Before we begin
              </DialogTitle>
            </div>
<DialogDescription className="text-sm leading-relaxed text-muted-foreground">
               A little context helps us choose herbs and ingredients you can
               actually find nearby and keep everything safe for your body.
             </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-7 px-6 py-6">
          {/* Region */}
          <Field
            step={1}
            icon={<Globe2 className="h-4 w-4" />}
            label="Where in the world are you?"
            hint="We'll prioritize herbs, teas and foods native to your region."
          >
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-expanded={comboOpen}
                  aria-controls="region-combobox"
                  aria-haspopup="listbox"
                  className={cn(
                    "flex h-12 w-full items-center justify-between rounded-xl border bg-background px-4 text-left text-sm transition-colors",
                    region
                      ? "border-primary/40 text-foreground"
                      : "border-border text-muted-foreground",
                    "hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    {region || "Search for your country…"}
                  </span>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                id="region-combobox"
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
              >
                <Command>
                  <CommandInput placeholder="Type a country…" className="h-10" />
                  <CommandList className="max-h-64">
                    <CommandEmpty>No country found.</CommandEmpty>
                    {MACRO_REGION_ORDER.map((macro) => {
                      const items = COUNTRIES.filter((c) => c.macro === macro);
                      if (items.length === 0) return null;
                      return (
                        <CommandGroup key={macro} heading={macro}>
                          {items.map((c) => (
                            <CommandItem
                              key={c.name}
                              value={c.name}
                              onSelect={(value) => {
                                setRegion(value);
                                setComboOpen(false);
                              }}
                              className="gap-2"
                            >
                              <Check
                                className={cn(
                                  "h-4 w-4",
                                  region.toLowerCase() === c.name.toLowerCase()
                                    ? "opacity-100 text-primary"
                                    : "opacity-0"
                                )}
                              />
                              {c.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {detected && detected === region && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-primary">
                <MapPin className="h-3 w-3" />
                Auto-detected from your timezone — change if it&apos;s off.
              </p>
            )}
          </Field>

          {/* Sex */}
          <Field
            step={2}
            icon={<Heart className="h-4 w-4" />}
            label="What's your biological sex?"
            hint="Some herbs interact with hormones or pregnancy — this keeps you safe."
          >
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {SEX_OPTIONS.map((opt) => {
                const selected = sex === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSexChange(opt.value)}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-all",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                        : "border-border/70 bg-background hover:border-primary/40 hover:bg-secondary/50"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "text-base",
                          selected ? "text-primary" : "text-foreground/70"
                        )}
                      >
                        {opt.icon}
                      </span>
                      <span className="text-sm font-semibold text-foreground">
                        {opt.label}
                      </span>
                    </span>
                    <span className="text-[11px] leading-tight text-muted-foreground">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Pregnancy (conditional) */}
          <AnimatePresence initial={false}>
            {sex === "female" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <Field
                  step={3}
                  icon={<Leaf className="h-4 w-4" />}
                  label="Are you currently pregnant or nursing?"
                  hint="Many common herbs are unsafe in pregnancy — we'll steer clear."
                >
                  <div className="grid grid-cols-2 gap-2.5">
                    {PREGNANCY_OPTIONS.map((opt) => {
                      const selected = pregnancy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPregnancy(opt.value)}
                          className={cn(
                            "flex items-start gap-2.5 rounded-xl border p-3 text-left transition-all",
                            selected
                              ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                              : "border-border/70 bg-background hover:border-primary/40 hover:bg-secondary/50"
                          )}
                        >
                          <span className="text-base leading-none">{opt.icon}</span>
                          <span className="flex-1">
                            <span className="block text-sm font-semibold text-foreground">
                              {opt.label}
                            </span>
                            <span className="mt-0.5 block text-[11px] leading-tight text-muted-foreground">
                              {opt.description}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-secondary/30 px-6 py-4">
          <p className="hidden text-xs text-muted-foreground sm:block">
            You can change any of this later.
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="ml-auto gap-1.5 rounded-full px-6"
          >
            Begin consultation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  step,
  icon,
  label,
  hint,
  children,
}: {
  step: number;
  icon: React.ReactNode;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
          {step}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-primary/80">{icon}</span>
            <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          </div>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {hint}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
