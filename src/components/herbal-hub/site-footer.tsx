import { Leaf, Mail, Heart } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="text-base font-semibold text-foreground">
                Herbal Hub
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Personalized herbal teas and nourishing meals, powered by AI and
              rooted in traditional herbal wisdom.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Explore</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#how-it-works" className="transition-colors hover:text-primary">
                  How it works
                </a>
              </li>
              <li>
                <a href="#about" className="transition-colors hover:text-primary">
                  Our philosophy
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="transition-colors hover:text-primary">
                  Wellness disclaimer
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Stay grounded</h3>
            <p className="text-sm text-muted-foreground">
              Brew slowly, eat seasonally, rest deeply.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>hello@herbalhub.ai</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Herbal Hub. A wellness companion, not a doctor.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="h-3.5 w-3.5 fill-primary text-primary" /> and a lot of herbs
          </p>
        </div>
      </div>
    </footer>
  );
}
