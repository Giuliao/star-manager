# Copilot Instructions

This is a Next.js 16 App Router project for managing GitHub starred repositories with hierarchical tags and AI summaries.

Prefer the repository's existing patterns:

- Server actions in `lib/actions/` for database and GitHub operations
- Route handlers in `app/api/` for streamed GitHub and AI responses
- Redux state in `lib/store/star-slice.ts` for interactive console state
- Shared UI primitives from `components/ui/`
- `@/` path aliases for imports

Important constraints:

- Keep server/client component boundaries intact.
- Reuse `parseTagData` for tag-tree shaping.
- Pair schema changes in `db/schema.ts` with Drizzle migrations.
- Preserve auth checks around GitHub and AI functionality.
- Do not alter package-manager lockfiles unless explicitly asked; both `bun.lockb` and `pnpm-lock.yaml` are present.

Useful commands:

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:migrate
```

See `AGENTS.md` for the full project guide.
