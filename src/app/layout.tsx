import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { FeedbackProvider } from "@ember-ai-engineering/feedback-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mira · AI notes",
  description:
    "A clean notes workspace with AI assists for summarising, improving, tagging, and expanding your writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <FeedbackProvider appId="notes-taker" logOnly>
          {children}
        </FeedbackProvider>
      </body>
    </html>
  );
}
