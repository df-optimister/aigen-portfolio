/* Boot sequence: render from content, then wire navigation. */
(function (root) {
  function boot() {
    root.__app = root.renderAll(root.PORTFOLIO_CONTENT);
    root.initNav();
  }
  if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
