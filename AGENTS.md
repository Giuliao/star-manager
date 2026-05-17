# AGENTS.md

## Project Summary

Star Manager is a Next.js App Router application for managing GitHub starred repositories. It combines GitHub OAuth, GitHub API reads, hierarchical tag management, README rendering, and AI-generated summaries.

## Stack

- Next.js 16 with React 19 and TypeScript
- App Router with server components, server actions, and route handlers
- NextAuth/Auth.js with GitHub provider
- Drizzle ORM with PostgreSQL
- Redux Toolkit for client-side console state
- Tailwind CSS plus local shadcn-style UI components
- Vercel AI SDK with an OpenAI-compatible provider

## Important Paths

- `app/(portal)/page.tsx`: public landing page and sign-in entry
- `app/(console)/console/layout.tsx`: authenticated console shell and split-pane layout
- `app/(console)/console/_components/`: star list and README content views
- `app/api/github/route.ts`: streamed GitHub star pagination endpoint
- `app/api/chat/route.ts`: authenticated AI chat endpoint
- `auth.ts`: auth callbacks and user bootstrap logic
- `db/schema.ts`: PostgreSQL schema definitions
- `lib/actions/`: server actions for GitHub, tags, users, and AI
- `lib/store/`: Redux slice setup for console UI state
- `components/ui/`: shared primitive UI components
- `drizzle/`: generated SQL migrations and metadata

## Local Commands

Use the package scripts already defined by the repo:

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:migrate
```

The repo currently contains both `bun.lockb` and `pnpm-lock.yaml`. Do not switch package managers or regenerate lockfiles unless the task explicitly calls for it.

## Environment

Local development expects `.env.local`. The code directly reads:

- `DATABASE_URL`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

Auth.js may also depend on its usual runtime configuration when running OAuth locally. Never commit secrets or replace local env files with sample values unless requested.

## Architecture Notes

- Prefer server components and server actions for data access already handled on the server.
- Client components are used where interaction is required, especially sidebar and list state.
- Tag data is stored as a user-specific hierarchy in `tag_user_relations`; use the helpers in `lib/actions/tag.ts` and `parseTagData` in `lib/utils.ts` instead of rebuilding the shape ad hoc.
- README content is fetched from GitHub, sanitized, then rendered through `next-mdx-remote`.
- Console interaction state lives in the Redux slice at `lib/store/star-slice.ts`.
- Route handlers stream long-running responses for GitHub pagination and AI output; preserve streaming behavior when changing those flows.

## Change Guidelines

- Follow the existing `@/` import alias and the current file placement conventions.
- Keep database schema changes paired with Drizzle migration updates under `drizzle/`.
- Reuse existing UI primitives from `components/ui/` before adding new ones.
- Keep auth-sensitive work behind `auth()` checks in route handlers and server paths.
- Be careful with mixed server/client boundaries: files using hooks, browser APIs, or Redux must remain client components.
- Avoid broad refactors when touching the tag tree code; nested updates are mutation-sensitive and easy to regress.

## Verification

For most changes, run:

```bash
npm run lint
npm run build
```

For database work, also run the appropriate Drizzle command and inspect the generated migration. There is no dedicated automated test suite in the repo today, so changes to auth, tag mutations, streaming routes, or README rendering deserve a quick manual pass in the app.

