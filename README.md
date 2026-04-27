# Mira — AI notes taker

A clean, focused notes workspace with quick AI assists. Built with Next.js (App Router), React 19, Tailwind 4, and the `@ember-ai-engineering/feedback-widget` package.

## Features

- **Master-detail layout** — sidebar with notes list, search, and folder tabs; main editor area
- **AI assists** — Summarise, Improve writing, Expand, Suggest title, Suggest tags. Each runs locally with a streaming-text simulation.
- **Embedded feedback widget** — `@ember-ai-engineering/feedback-widget` is wired into the root layout so reviewers can pin and submit feedback on any element.
- **Auto-save indicator** — pill in the header shows save state.

## Local development

The widget package is hosted on **GitHub Packages**, which requires a token to install. Generate a Personal Access Token with `read:packages` scope and export it before running `npm install`:

```bash
export GITHUB_TOKEN=<your-pat>
npm install
npm run dev
```

The `.npmrc` reads `${GITHUB_TOKEN}` at install time. The token is never written to disk.

## Deploying to Render

Add `GITHUB_TOKEN` as an environment variable in your Render service settings (with `read:packages` scope). Render's build step (`npm install`) will pick it up automatically.

- Build command: `npm run build`
- Start command: `npm run start`

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind 4
- TypeScript
- `@ember-ai-engineering/feedback-widget`

## Conventions

- All UI is client-side; mock data lives in `src/lib/mock-notes.ts`.
- AI responses are canned, varied, and streamed via `src/lib/mock-ai.ts` — no model calls are made.
- The widget runs in `logOnly` mode by default. Once a feedback backend exists, swap `logOnly` for `apiUrl={...}` in `src/app/layout.tsx`.
