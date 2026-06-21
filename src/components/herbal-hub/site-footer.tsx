import { Leaf, Mail, Heart, MessageCircle, Smartphone } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/263775939688";
const ECOCASH_NUMBER = "0775939688";
const ECOCASH_ACCOUNT_NAME = "Barry Changwa";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
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
              <li>
                <a href="#donate" className="transition-colors hover:text-primary">
                  Donate
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Get in touch</h3>
            <p className="text-sm text-muted-foreground">
              Questions, feedback or a herb to share? Reach Barry directly.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:bchangwaz@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                bchangwaz@gmail.com
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp: +263 775 939 688
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Support us</h3>
            <div className="rounded-xl border border-border/70 bg-card/60 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Smartphone className="h-4 w-4 text-primary" />
                EcoCash
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Account name:{" "}
                <span className="font-semibold text-foreground">
                  {ECOCASH_ACCOUNT_NAME}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                Number:{" "}
                <span className="font-semibold text-foreground">
                  {ECOCASH_NUMBER}
                </span>
              </p>
              <a href="#donate">
                <button className="mt-2 text-xs font-semibold text-primary transition-opacity hover:opacity-80">
                  Donate →
                </button>
              </a>
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
