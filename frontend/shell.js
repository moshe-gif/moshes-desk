// Shell: owns auth/session, the workspace switcher, routing/mount, and the cross-company views
// (unified digest, unified who-owes-what, Settings) -- see
// ~/.claude/plans/eventual-snacking-globe.md, decisions #5 and #5a.
//
// Current state (2026-09-14): Demo Mode is back on, per Moshe -- real login (magic link/passkey)
// still doesn't work at all right now because the live Supabase project is unreachable (see the
// plan's "Live-DB status" note, and the "Failed to fetch" toast reproduced 2026-09-11), so
// Demo Mode is the only way to actually use this site until that's resolved. This reverses the
// "real login only" call from the site's first build -- ASP_DISABLE_DEMO_MODE is intentionally
// NOT set here anymore.
//
// The actual company-aware switcher (resolving a signed-in user's company_members rows, letting
// them switch between ASP/VOX, mounting workspaces/vox.js for real) is still blocked on that same
// live-DB issue -- building it now would be unverifiable against real data, so it isn't here yet.
"use strict";

window.Workspaces = window.Workspaces || {};

// TODO (Phase 1b, once the Supabase project is reachable again):
//   - resolve the signed-in user's company_members rows
//   - render the workspace switcher control
//   - call Workspaces.asp.mount()/Workspaces.vox.mount() for real instead of asp.js
//     self-mounting unconditionally as it does today
//   - own the cross-company digest / who-owes-what / Settings views
