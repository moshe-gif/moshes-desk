# Moshe's Desk

The parent operations app: a company-workspace shell for ASP + The Vox Group, built around one
job — know who owes what on every active project, always. Full plan:
`~/.claude/plans/eventual-snacking-globe.md` (local to the machine that planned this; not
committed here).

**This site is real-login only — no Demo Mode.** It shares ASP's real app code live from the
`asp-bookings` repo (`frontend/workspaces/asp.js`, loaded cross-origin) rather than duplicating
it — single source of truth. See `frontend/shell.js` for current status: the real
company-workspace switcher is blocked on Supabase database connectivity as of 2026-09-11 and
isn't built yet; today this site is effectively "ASP, with Demo Mode off."

Related repo: [asp-bookings](https://github.com/moshe-gif/asp-bookings) — the ASP workspace's own
site, unchanged, still has Demo Mode for office/artist use.
