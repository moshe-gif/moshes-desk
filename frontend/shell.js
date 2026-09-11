// Shell: owns auth/session, the workspace switcher, routing/mount, and the cross-company views
// (unified digest, unified who-owes-what, Settings) -- see
// ~/.claude/plans/eventual-snacking-globe.md, decisions #5 and #5a.
//
// Current state (2026-09-11): this site's job right now is "the real ASP workspace, real-login
// only" -- the actual company-aware switcher (resolving a signed-in user's company_members rows,
// letting them switch between ASP/VOX, mounting workspaces/vox.js for real) is blocked on the
// live Supabase project being unreachable (see the plan's "Live-DB status" note). Building that
// logic now would be unverifiable against real data, so it isn't here yet -- this file currently
// only does the one thing that IS verifiable today: keep Demo Mode off on this site.
"use strict";

window.ASP_DISABLE_DEMO_MODE = true;
window.Workspaces = window.Workspaces || {};

// TODO (Phase 1b, once the Supabase project is reachable again):
//   - resolve the signed-in user's company_members rows
//   - render the workspace switcher control
//   - call Workspaces.asp.mount()/Workspaces.vox.mount() for real instead of asp.js
//     self-mounting unconditionally as it does today
//   - own the cross-company digest / who-owes-what / Settings views
