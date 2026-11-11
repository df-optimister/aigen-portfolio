/* Visualization registry: builders register under an id; renderViz draws once per element. */
(function (root) {
  root.VIZ = root.VIZ || {};

  root.renderViz = function renderViz(id, el) {
    if (!el || el.dataset.rendered === '1') return;
    var fn = root.VIZ[id];
    el.dataset.rendered = '1';
    if (typeof fn !== 'function') {
      el.dataset.vizMissing = id;
      var ph = el.ownerDocument.createElement('p');
      ph.className = 'viz-placeholder';
      ph.textContent = '시각화 준비 중';
      el.appendChild(ph);
      return;
    }
    try {
      fn(el);
    } catch (err) {
      el.dataset.vizError = id;
      if (root.console) root.console.error('[viz] ' + id, err);
    }
  };
})(typeof window !== 'undefined' ? window : this);
