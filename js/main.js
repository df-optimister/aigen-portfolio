/* Boot sequence: render from content, then wire navigation and print. */
(function (root) {
  function boot() {
    var app = root.__app = root.renderAll(root.PORTFOLIO_CONTENT);
    root.initNav();
    // Print/PDF shows every panel, so every visualization must exist first.
    root.addEventListener('beforeprint', function () {
      Object.keys(app.grids).forEach(function (k) { app.grids[k].renderAllViz(); });
      root.document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    });
  }
  if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
