/* Boot sequence. Later tasks add rendering before initNav. */
(function (root) {
  function boot() {
    root.initNav();
  }
  if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window);
