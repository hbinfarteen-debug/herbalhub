"use client";

import { MessageCircle } from "lucide-react";

// WhatsApp chat — opens a chat with Barry Changwa (+263 775 939 688).
const WHATSAPP_NUMBER = "263775939688";
const WHATSAPP_MESSAGE =
  "Hello Herbal Hub! I have a question about herbal remedies.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Herbal Hub on WhatsApp"
      className="group fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white shadow-lg shadow-[#25D366]/30 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/40 sm:bottom-6 sm:right-6"
    >
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-60 blur-md transition-opacity group-hover:opacity-80" />
      <span className="flex h-7 w-7 items-center justify-center">
        <MessageCircle className="h-6 w-6" />
      </span>
      <span className="hidden text-sm font-semibold sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
