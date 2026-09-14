// Shell: owns auth/session, the workspace switcher, routing/mount, and the cross-company views
// (unified digest, unified who-owes-what, Settings) -- see
// ~/.claude/plans/eventual-snacking-globe.md, decisions #5 and #5a.
//
// Real login (magic link / passkey) is live again as of 2026-09-14 (the Supabase project was
// paused, not gone -- see the plan's "Live-DB status" note for the full story) and
// company_members/companies (migrations 0004/0005) are genuinely applied now, so the real
// switcher below is no longer blocked.
//
// Demo Mode gets the switcher too (as of 2026-09-14, per Moshe): it's a client-side-only
// preview with no real Supabase session, so there's no company_members row to look up -- instead
// a fixed two-option list stands in (ASP + VOX placeholder). Harmless since VOX has no real
// content to protect yet; this goes away naturally once the real switcher is the only one anyone
// needs to use day to day.
"use strict";

window.Workspaces = window.Workspaces || {};

const SHELL_SUPABASE_URL = 'https://psgpxbkncuavlnpplykf.supabase.co';
const SHELL_SUPABASE_KEY = 'sb_publishable_Orec7KI9Lwqd_ZfsKaEq9g__ewGiEiT';
// Reuse workspaces/asp.js's own client (it loads before this file -- see index.html's script
// order) instead of creating a second one against the same project: Supabase's SDK warns that
// two GoTrueClient instances sharing one storage key "may produce undefined behavior" (caught
// live via a console warning during verification, 2026-09-14). Falls back to creating our own
// only if asp.js hasn't registered one for some reason (e.g. script order changes later, or a
// future workspace doesn't expose one) -- shell.js still works standalone either way.
const shellSupabase = window.supabaseClient
  || (window.supabase ? window.supabase.createClient(SHELL_SUPABASE_URL, SHELL_SUPABASE_KEY) : null);

const COMPANY_PREF_KEY = 'moshes_desk_company_pref';

async function shellLoadMemberships(userId) {
  const { data, error } = await shellSupabase
    .from('company_members')
    .select('role, companies(id, slug, name, accent_hex)')
    .eq('user_id', userId);
  if (error) { console.warn('[shell] could not load company_members:', error.message); return []; }
  return (data || []).filter(m => m.companies);
}

function shellShowCompany(slug) {
  const app = document.getElementById('app');
  const voxHost = document.getElementById('voxHost');
  if (slug === 'vox') {
    if (app) app.style.display = 'none';
    if (voxHost) {
      voxHost.style.display = 'block';
      if (window.Workspaces.vox) window.Workspaces.vox.mount(voxHost);
    }
  } else {
    if (app) app.style.display = '';
    if (voxHost) {
      if (window.Workspaces.vox) window.Workspaces.vox.unmount();
      voxHost.style.display = 'none';
    }
  }
}

function shellRenderSwitcher(memberships) {
  const existing = document.getElementById('companySwitcher');
  if (existing) existing.remove();
  if (memberships.length <= 1) return; // nothing to switch between -- don't show a 1-option control

  const pref = localStorage.getItem(COMPANY_PREF_KEY);
  const current = memberships.find(m => m.companies.slug === pref)
    || memberships.find(m => m.companies.slug === 'asp')
    || memberships[0];

  const bar = document.createElement('div');
  bar.id = 'companySwitcher';
  bar.style.cssText = 'position:fixed; top:14px; right:14px; z-index:9999; display:flex; gap:4px; background:var(--surface,#fff); padding:5px; border-radius:var(--r-md,12px); box-shadow:var(--shadow-md,0 8px 24px rgba(0,0,0,.12)); border:1px solid var(--border,#e1e1e6);';

  memberships.forEach(m => {
    const active = m.companies.slug === current.companies.slug;
    const btn = document.createElement('button');
    btn.textContent = m.companies.name;
    btn.style.cssText = `border:none; padding:7px 14px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:-apple-system,sans-serif; transition:.15s ease; background:${active ? m.companies.accent_hex : 'transparent'}; color:${active ? '#fff' : 'var(--ink-2,#67676D)'};`;
    btn.onclick = () => {
      localStorage.setItem(COMPANY_PREF_KEY, m.companies.slug);
      shellShowCompany(m.companies.slug);
      shellRenderSwitcher(memberships); // re-render to move the active highlight
    };
    bar.appendChild(btn);
  });

  document.body.appendChild(bar);
  shellShowCompany(current.companies.slug);
}

async function shellInit() {
  if (!shellSupabase) return;
  const { data: { session } } = await shellSupabase.auth.getSession();
  if (!session) return; // no real session -- Demo Mode is handled separately, see shellWatchDemoMode
  const memberships = await shellLoadMemberships(session.user.id);
  shellRenderSwitcher(memberships);
}

if (shellSupabase) {
  shellSupabase.auth.onAuthStateChange((_event, session) => {
    if (session) shellInit();
  });
}
shellInit();

// Demo Mode lives entirely inside workspaces/asp.js's own closure (S.user/S.realSession aren't
// reachable any other way) -- window.S is exposed there for exactly this kind of debug/host
// access, so a light poll is the simplest reliable way to notice a demo login without asp.js
// needing to know shell.js exists at all. A real session always sets S.realSession too, so this
// never fires for one -- shellInit() above already owns that path.
const DEMO_MEMBERSHIPS = [
  { companies: { slug: 'asp', name: 'ASP', accent_hex: '#4C6FA5' } },
  { companies: { slug: 'vox', name: 'The Vox Group', accent_hex: '#64748B' } },
];
let shellDemoActive = false;
setInterval(() => {
  const s = window.S;
  const inDemo = !!(s && s.user && !s.realSession);
  if (inDemo === shellDemoActive) return;
  shellDemoActive = inDemo;
  if (inDemo) {
    shellRenderSwitcher(DEMO_MEMBERSHIPS);
  } else {
    document.getElementById('companySwitcher')?.remove();
    shellShowCompany('asp');
  }
}, 400);

// TODO (next): cross-company views (unified digest, unified who-owes-what) living in the shell
// rather than either workspace; a real nav-integrated switcher placement once a workspace calls
// into Shell.renderSwitcher() as a shared primitive instead of this shell-owned floating pill.
