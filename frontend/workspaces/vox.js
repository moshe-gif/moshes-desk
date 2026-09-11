// VOX workspace module -- placeholder. Real content lands in Phase 6 of the parent-app plan
// (~/.claude/plans/eventual-snacking-globe.md). Not mounted yet -- Phase 1b's workspace switcher
// will call mount()/unmount() here the same way it will for workspaces/asp.js, once real
// company_members data exists to switch on.
(function(){
  window.Workspaces = window.Workspaces || {};
  window.Workspaces.vox = {
    id: 'vox',
    mount(container){
      container.innerHTML = '<div style="padding:40px;text-align:center;color:var(--ink-3, #9A9AA1);">The Vox Group workspace is coming soon.</div>';
    },
    unmount(){},
  };
})();
