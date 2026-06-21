import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Herbal Hub — AI Herbal Tea & Meal Remedies",
  description:
    "Herbal Hub uses AI to craft personalized herbal tea and meal recommendations based on your symptoms, lifestyle, and wellbeing. Answer 9 thoughtful questions and discover nature's remedies.",
  keywords: [
    "herbal tea",
    "natural remedies",
    "herbalism",
    "holistic wellness",
    "AI wellness",
    "herbal meals",
    "botanical healing",
  ],
  authors: [{ name: "Herbal Hub" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Herbal Hub — AI Herbal Tea & Meal Remedies",
    description:
      "Personalized herbal teas and nourishing meals, powered by AI and traditional herbal wisdom.",
    siteName: "Herbal Hub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Herbal Hub — AI Herbal Tea & Meal Remedies",
    description:
      "Personalized herbal teas and nourishing meals, powered by AI and traditional herbal wisdom.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
