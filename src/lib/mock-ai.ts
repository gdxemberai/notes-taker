/**
 * Mock AI handler. Returns canned-but-varied responses with simulated latency
 * and a streaming effect. No real model calls — purely client-side.
 */

import type { AIResult } from "./types";

const SUMMARIES = [
  "Three priorities for the offsite: lock the activation metric, run the $24 pricing test, and decide on the legacy importer.",
  "Marco's frustrated with the EU launch slipping. Wants a single owner, a written go/no-go date, and permission to delay. Worth giving him all three.",
  "Reading queue is heavy on systems thinking — Caro, Grove, Eghbal. Currently mid-Power Broker, slow but rewarding.",
  "Pitch for a local-only meeting summariser. Differentiator is 'what was promised but unclear' — the third bullet nobody else extracts.",
  "Three apartments to see Saturday. Sunset one is over budget on paper but parking nets out cheaper than the Divisadero option.",
  "Five staff-eng candidates. Devon is internal and de facto doing the role — promotion call before someone else hires him out.",
];

const IMPROVEMENTS_PREFIXES = [
  "Tightened a few sentences and removed the throat-clearing in the opening:",
  "Restructured for skimmability — moved the decision to the top, supporting points below:",
  "Cut roughly 20% without losing anything material. Same argument, faster:",
];

const TITLE_SUGGESTIONS: Record<string, string[]> = {
  default: [
    "Quick thoughts and next steps",
    "Working notes — needs a pass",
    "Draft: still in motion",
  ],
};

const TAG_PALETTES = [
  ["draft", "needs-review", "thinking"],
  ["meeting", "follow-up", "action-items"],
  ["weekend-project", "experiment", "exploratory"],
  ["1:1", "team", "people"],
  ["product", "metrics", "Q2"],
];

const EXPANSIONS = [
  "Adding a bit more context and a couple of supporting points:\n\nThe argument here rests on three things — the data we already have, the qualitative signal from last week's interviews, and the fact that the alternative (doing nothing) has its own non-trivial cost. None of these alone is decisive, but stacked they make the case.\n\nA reasonable counter is that we've been wrong before about exactly this kind of bet. Worth flagging that risk explicitly when you bring it to the team.",
  "Expanded with a more concrete example:\n\nConsider the Stripe analogy. They held the line on developer experience for years even when it cost them on enterprise features, and the moat that built was real. Same shape of decision here, smaller scale.\n\nThe meta-point is that boring infrastructure investments compound, and skipping them to chase the next thing usually shows up as pain 18 months later.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function fakeLatency(): number {
  return 600 + Math.floor(Math.random() * 700); // 0.6-1.3s
}

export interface RunOptions {
  kind: AIResult["kind"];
  content: string;
  onChunk?: (textSoFar: string) => void;
  signal?: AbortSignal;
}

/**
 * Simulates an AI call: thinks, then streams a canned response back chunk
 * by chunk via `onChunk` (so the UI can render a typewriter effect).
 */
export async function runAI(options: RunOptions): Promise<AIResult> {
  const { kind, content, onChunk, signal } = options;

  await sleep(fakeLatency(), signal);
  if (signal?.aborted) throw new Error("aborted");

  let text = "";
  switch (kind) {
    case "summary":
      text = pick(SUMMARIES);
      break;
    case "improve":
      text = `${pick(IMPROVEMENTS_PREFIXES)}\n\n${refine(content)}`;
      break;
    case "title":
      text = inferTitle(content);
      break;
    case "tags":
      text = pick(TAG_PALETTES).join(", ");
      break;
    case "expand":
      text = pick(EXPANSIONS);
      break;
  }

  if (onChunk) {
    await streamText(text, onChunk, signal);
  }

  return {
    kind,
    content: text,
    meta: { tokens: Math.floor(text.length / 3.6), model: "ai-mock-v1" },
  };
}

function refine(input: string): string {
  if (!input.trim()) return "(nothing to improve yet — start writing first)";
  const trimmed = input.trim();
  const firstParaEnd = trimmed.indexOf("\n\n");
  const firstPara = firstParaEnd >= 0 ? trimmed.slice(0, firstParaEnd) : trimmed;
  return firstPara.replace(/\s+/g, " ").trim();
}

function inferTitle(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return pick(TITLE_SUGGESTIONS.default);
  const firstSentence = trimmed.split(/[.\n]/)[0]?.trim() ?? "";
  if (firstSentence.length > 8 && firstSentence.length < 60) {
    return capitalise(firstSentence);
  }
  return pick(TITLE_SUGGESTIONS.default);
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function streamText(
  full: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const chunkSize = 4;
  let i = 0;
  while (i < full.length) {
    if (signal?.aborted) return;
    i = Math.min(i + chunkSize, full.length);
    onChunk(full.slice(0, i));
    await sleep(18 + Math.random() * 24);
  }
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Error("aborted"));
    const t = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(t);
        reject(new Error("aborted"));
      },
      { once: true }
    );
  });
}
