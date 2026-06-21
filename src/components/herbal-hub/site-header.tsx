"use client";

import { Leaf } from "lucide-react";

interface SiteHeaderProps {
  onRestart?: () => void;
}

export function SiteHeader({ onRestart }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={onRestart}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Herbal Hub home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Herbal Hub
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              Nature&apos;s remedies, personalized
            </span>
          </span>
        </button>

        <nav className="flex items-center gap-1">
          <a
            href="#how-it-works"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:block"
          >
            How it works
          </a>
          <a
            href="#about"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:block"
          >
            About
          </a>
          <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-border/70 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            AI-Powered
          </span>
        </nav>
      </div>
    </header>
  );
}
