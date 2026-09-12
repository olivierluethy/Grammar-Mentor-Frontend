<div align="center">
  <img src="public/logo426x426.png" alt="AI Grammar Mentor logo" width="140" />
  <h1>AI Grammar Mentor — Frontend</h1>
  <p><b>The grammar checker that teaches you, not just fixes your text.</b><br/>Next.js frontend for a grammar-checking SaaS that turns every mistake into a lesson.</p>
  <p>
    <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js">
    <img alt="React" src="https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white">
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white">
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white">
    <img alt="Clerk" src="https://img.shields.io/badge/Auth-Clerk-6c47ff?logo=clerk&logoColor=white">
  </p>
</div>

---

AI Grammar Mentor is a grammar checker built around teaching. Instead of only
correcting text, it explains each mistake, tracks the errors you make over
time, reads corrections aloud, and generates targeted practice worksheets from
your own history. This repository is the **frontend**: the marketing site, the
interactive checker demo, and the learning tools. The grammar-checking and
billing logic live in a separate backend.

## Features

- **Interactive checker demo.** Paste text, get corrections with per-mistake
  explanations, example sentences, and quiz-style follow-ups.
- **Mistake history.** Every mistake the checker surfaces is recorded to
  `localStorage` so a learner can see recurring errors and track improvement
  over time. Nothing leaves the browser, and history can be wiped at any time.
- **Text-to-speech.** Corrected sentences are read aloud with the browser's
  built-in Web Speech API (`speechSynthesis`) — no external TTS provider, key,
  or network call, with language mapping for many locales.
- **Printable practice sheets.** Builds a personalized worksheet from the
  mistakes a learner actually made, with exercises and a separate answer key,
  rendered for the browser's print dialog ("Save as PDF") — no PDF library or
  server needed.
- **Authentication.** Clerk is wired in at the app root (`ClerkProvider`), with
  dedicated sign-in / sign-up routes; `next-auth` v5 is also included in the
  stack.
- **Subscriptions.** Checkout flows through Lemon Squeezy, with pricing and a
  subscribe page.
- **Content & legal pages.** Landing page, about, blog (with per-slug posts),
  contact, privacy and terms, plus a footer and responsive navbar.
- **Dark, themeable UI.** shadcn/ui + Radix primitives on Tailwind CSS v4.

## Tech stack

- **Framework:** Next.js 16 (App Router) with React 19 and TypeScript
- **UI:** shadcn/ui on Radix primitives, Tailwind CSS v4, `lucide-react`
- **Auth:** Clerk (`@clerk/nextjs`, `@clerk/themes`); `next-auth` v5 included
- **Payments:** Lemon Squeezy
- **Validation & forms:** Zod, React Hook Form
- **Analytics:** Vercel Analytics
- **Deploy target:** Vercel

## Getting started

```bash
# install (pnpm, npm or yarn — a pnpm lockfile is committed)
pnpm install

# configure secrets (see below), then:
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # eslint
```

### Environment variables

Create a `.env.local` file (git-ignored) for local development, and set the same
keys as environment variables in your deploy platform. This is the frontend, so
it only needs auth keys — the checker and billing talk to a hosted backend.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key, read by `ClerkProvider` in the browser. |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key, used server-side. |
| `AUTH_SECRET` | If using next-auth | Session-encryption secret for `next-auth` v5. |

Get the Clerk keys from your [Clerk dashboard](https://dashboard.clerk.com).
Never commit real keys — keep them in `.env.local` and your platform's
environment-variable settings.

## License

Released under the [MIT License](LICENSE) © 2026 Olivier Lüthy. You're free to use, modify and distribute this
software, including commercially, as long as the copyright notice and license are included.

## Author

Built by **Olivier Lüthy** — [GitHub](https://github.com/olivierluethy).
