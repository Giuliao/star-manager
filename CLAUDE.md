# CLAUDE.md

Read `AGENTS.md` first. It is the canonical project guide for architecture, commands, environment, and change rules.

While working in this repository:

- Preserve the existing Next.js App Router split between server and client code.
- Reuse helpers in `lib/actions/`, `lib/utils.ts`, and `components/ui/` before introducing new patterns.
- Treat `db/schema.ts` plus `drizzle/` migrations as a pair when changing persisted data.
- Keep authenticated GitHub and AI flows protected by the existing auth checks.
- Use `npm run lint` and `npm run build` for verification unless the task requires a narrower command.

