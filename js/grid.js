/* 3+2 expandable step grid. Panels stay open until their tile is pressed again. */
(function (root) {
  function h(doc, tag, cls, text) {
    var el = doc.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function prefersReducedMotion() {
    return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * @param {HTMLElement} rootEl section element to render into
   * @param {object} project one entry of PORTFOLIO_CONTENT.projects
   * @param {{ onLastNext?: () => void, lastNextLabel?: string }} [opts]
   */
  function createStepGrid(rootEl, project, opts) {
    opts = opts || {};
    var doc = rootEl.ownerDocument;
    var pid = project.id;
    rootEl.textContent = '';

    // ----- project header -----
    var head = h(doc, 'header', 'proj-head');
    var titles = h(doc, 'div', 'proj-titles');
    titles.appendChild(h(doc, 'p', 'proj-label', 'PROJECT ' + project.no));
    var h2 = h(doc, 'h2', 'proj-title', project.title);
    h2.id = pid + '-title';
    titles.appendChild(h2);
    titles.appendChild(h(doc, 'p', 'proj-sub', project.subtitle));
    head.appendChild(titles);
    var n = project.steps.length;
    var expandLabel = n + '단계 모두 펼치기';
    var expandAll = h(doc, 'button', 'expand-all', expandLabel);
    expandAll.type = 'button';
    head.appendChild(expandAll);
    rootEl.appendChild(head);

    // ----- grid -----
    var grid = h(doc, 'div', 'step-grid');
    var rowTop = h(doc, 'div', 'step-row r3');
    // first three steps on top; the rest below (3 → full row, 2 → centred pair)
    var rowBottom = h(doc, 'div', 'step-row ' + (n - 3 >= 3 ? 'r3' : 'r2'));
    grid.appendChild(rowTop);
    grid.appendChild(rowBottom);
    rootEl.appendChild(grid);

    var items = project.steps.map(function (step, i) {
      var art = h(doc, 'article', 'step');
      art.dataset.index = String(i);
      var headId = pid + '-s' + step.no + '-head';
      var panelId = pid + '-s' + step.no + '-panel';

      var btn = h(doc, 'button', 'step-head');
      btn.type = 'button';
      btn.id = headId;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', panelId);
      var top = h(doc, 'span', 'step-top');
      top.appendChild(h(doc, 'span', 'step-no', step.no));
      if (step.plan) top.appendChild(h(doc, 'span', 'badge badge-plan', '계획'));
      var icon = h(doc, 'span', 'step-icon', '+');
      icon.setAttribute('aria-hidden', 'true');
      top.appendChild(icon);
      btn.appendChild(top);
      btn.appendChild(h(doc, 'span', 'step-name', step.name));
      btn.appendChild(h(doc, 'span', 'step-impact', step.impact));
      var chips = h(doc, 'span', 'chips');
      step.keywords.forEach(function (k) { chips.appendChild(h(doc, 'span', 'chip', k)); });
      btn.appendChild(chips);
      art.appendChild(btn);

      var panel = h(doc, 'div', 'step-panel');
      panel.id = panelId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', headId);
      panel.hidden = true;
      var board = h(doc, 'div', 'board grain');
      board.dataset.viz = step.viz;
      panel.appendChild(board);
      var ul = h(doc, 'ul', 'bullets');
      step.bullets.forEach(function (b) { ul.appendChild(h(doc, 'li', null, b)); });
      panel.appendChild(ul);
      var isLast = i === project.steps.length - 1;
      var nextLabel = isLast
        ? (opts.lastNextLabel || '다음 →')
        : '다음: ' + project.steps[i + 1].name + ' →';
      var next = h(doc, 'button', 'step-next' + (isLast ? ' is-last' : ''), nextLabel);
      next.type = 'button';
      panel.appendChild(next);
      art.appendChild(panel);

      (i < 3 ? rowTop : rowBottom).appendChild(art);
      return { art: art, btn: btn, panel: panel, board: board, icon: icon, next: next };
    });

    function isOpen(i) { return !items[i].panel.hidden; }

    function sync() {
      var all = items.every(function (_, i) { return isOpen(i); });
      expandAll.textContent = all ? '모두 접기' : expandLabel;
      expandAll.setAttribute('aria-pressed', all ? 'true' : 'false');
    }

    function setOpen(i, on) {
      var it = items[i];
      it.panel.hidden = !on;
      it.btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      it.art.classList.toggle('is-open', on);
      it.icon.textContent = on ? '−' : '+';
      if (on) root.renderViz(project.steps[i].viz, it.board);
    }

    function open(i) { setOpen(i, true); sync(); }
    function toggle(i) { setOpen(i, !isOpen(i)); sync(); }
    function toggleAll() {
      var all = items.every(function (_, i) { return isOpen(i); });
      items.forEach(function (_, i) { setOpen(i, !all); });
      sync();
    }
    function renderAllViz() {
      items.forEach(function (it, i) { root.renderViz(project.steps[i].viz, it.board); });
    }

    items.forEach(function (it, i) {
      it.btn.addEventListener('click', function () { toggle(i); });
      it.next.addEventListener('click', function () {
        if (i < items.length - 1) {
          open(i + 1);
          var target = items[i + 1].art;
          if (target.scrollIntoView) target.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
        } else if (opts.onLastNext) {
          opts.onLastNext();
        }
      });
    });
    expandAll.addEventListener('click', toggleAll);

    return { toggle: toggle, open: open, toggleAll: toggleAll, isOpen: isOpen, renderAllViz: renderAllViz };
  }

  root.createStepGrid = createStepGrid;
})(typeof window !== 'undefined' ? window : this);
