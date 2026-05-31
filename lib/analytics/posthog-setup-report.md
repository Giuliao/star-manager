<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into StarManager. The project already had a comprehensive event tracking infrastructure in place (`lib/analytics/events.ts`, `lib/analytics/client.ts`, `lib/analytics/server.ts`, and `components/analytics-user-identity.tsx`). The wizard finalized the integration by:

- **Setting environment variables** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` written to `.env.local`.
- **Configuring a reverse proxy** — Added `/ingest` rewrites and `skipTrailingSlashRedirect: true` to `next.config.mjs` so PostHog traffic routes through the Next.js server, improving ad-blocker resilience.
- **Hardening the client initialization** — Updated `lib/analytics/client.ts` to use `api_host: "/ingest"` (via proxy), added `ui_host`, `defaults: "2026-01-30"`, `capture_exceptions: true`, and `debug` mode in development.
- **Creating a PostHog dashboard** with 5 insights covering the key business flows (see below).

All 22 events were already instrumented across client and server — no new event calls were required.

| Event | Description | File |
|---|---|---|
| `console opened` | User opens the console; triggers identify | `components/analytics-user-identity.tsx` |
| `auth login clicked` | User clicks "Sign in with GitHub" | `app/(portal)/page.tsx` |
| `console cta clicked` | Logged-in user clicks "Goto" CTA | `app/(portal)/page.tsx` |
| `star selected` | User clicks a star to view its content | `app/(console)/console/_components/star-list.tsx` |
| `star search submitted` | User types in the search input (debounced) | `app/(console)/console/_components/star-list.tsx` |
| `sidebar opened` | Mobile sidebar opened via menu button | `app/(console)/console/_components/search-control.tsx` |
| `tag filter selected` | User clicks a tag in the sidebar to filter stars | `components/tag-sidebar.tsx` |
| `tag filter removed` | User removes a tag filter chip | `app/(console)/console/_components/search-control.tsx` |
| `tag created` | New tag created (root or nested) | `components/tag-sidebar.tsx` |
| `tag edited` | Tag renamed in the sidebar | `components/tag-sidebar.tsx` |
| `tag deleted` | Tag deleted from the sidebar | `components/tag-sidebar.tsx` |
| `tag picker opened` | Tag picker popover opened on a star card | `app/(console)/console/_components/star-list.tsx` |
| `tag assigned` | Tag assigned to a starred repository | `app/(console)/console/_components/star-list.tsx` |
| `tag removed` | Tag removed from a starred repository | `app/(console)/console/_components/star-list.tsx` |
| `readme viewed` | Repository README fetched (server-side) | `app/(console)/console/_components/star-content.tsx` |
| `ai summary requested` | AI summarization triggered for a README | `components/float-tip.tsx` |
| `ai summary stream started` | AI chat stream begun (server-side) | `app/api/chat/route.ts` |
| `ai summary completed` | AI summarization completed successfully | `components/float-tip.tsx` |
| `ai summary failed` | AI summarization failed | `components/float-tip.tsx` / `app/api/chat/route.ts` |
| `github stars sync started` | GitHub stars streaming sync begun (server-side) | `app/api/github/route.ts` |
| `github stars sync completed` | All pages of GitHub stars fetched (server-side) | `app/api/github/route.ts` |
| `github stars sync failed` | GitHub stars sync errored out (server-side) | `app/api/github/route.ts` |

## Next steps

We've built a dashboard and five insights to keep an eye on user behavior:

- [Analytics basics dashboard](/dashboard/1649817)
- [Login to Console Conversion Funnel](/insights/Pyq4hjrl) — tracks what fraction of login-button clicks result in a console session
- [Daily Active Users](/insights/lg2lq9uX) — unique users opening the console per day
- [AI Summary Usage](/insights/Y3EC2gCU) — AI summary requests, completions, and failures over time
- [Tag Engagement](/insights/JUcqCilK) — tag assignments, removals, and creations per day
- [Star Engagement Funnel](/insights/Lk62xHW9) — console opened → star selected → README viewed

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
