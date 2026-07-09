"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

const MESSAGES = [
  "Listening to your symptoms…",
  "Cross-referencing traditional herbs…",
  "Checking for allergies & interactions…",
  "Pairing herbs with your lifestyle…",
  "Steeping your personalized blend…",
  "Plating nourishing meals…",
];

export function LoadingState() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="relative">
      <div className="botanical-bg absolute inset-0 -z-10" aria-hidden />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6 md:py-28">
        {/* Brewing cup animation */}
        <div className="relative mb-8 h-32 w-32">
          {/* Steam */}
          <div className="absolute left-1/2 top-2 flex -translate-x-1/2 gap-2">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="block h-8 w-1.5 rounded-full bg-primary/30 blur-[2px]"
                animate={{ opacity: [0, 0.6, 0], y: [0, -24], scaleY: [1, 1.4] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
          {/* Cup */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-b-[2.5rem] rounded-t-lg border-2 border-primary/40 bg-primary/10"
          >
            <Leaf className="h-9 w-9 text-primary" />
          </motion.div>
          {/* Saucer */}
          <div className="absolute -bottom-2 left-1/2 h-2.5 w-32 -translate-x-1/2 rounded-full bg-primary/20" />
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        >
          Brewing your remedy
        </motion.h2>

        <RotatingMessages messages={MESSAGES} idx={idx} />

        <p className="mt-6 max-w-sm text-sm text-muted-foreground">
          Our herbalist AI is blending traditional wisdom with your unique
          profile. This usually takes 10–20 seconds.
        </p>
      </div>
    </section>
  );
}

function RotatingMessages({
  messages,
  idx,
}: {
  messages: string[];
  idx: number;
}) {
  return (
    <div className="mt-4 flex h-6 items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="text-sm font-medium text-primary"
        >
          {messages[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
