// Build a jsdom window from index.html's <body> and run the page scripts in order.
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '../../..');

function bodyMarkup() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const m = html.match(/<body>([\s\S]*?)<\/body>/);
  return m[1].replace(/<script[\s\S]*?<\/script>/g, '');
}

/**
 * @param {string[]} scripts paths relative to repo root, run in order
 * @param {{ boot?: boolean }} [opts] boot=true calls renderAll(PORTFOLIO_CONTENT)
 */
function makeDom(scripts, opts = {}) {
  const dom = new JSDOM(`<!doctype html><html><body>${bodyMarkup()}</body></html>`, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'http://localhost/',
  });
  const w = dom.window;
  for (const s of scripts) w.eval(fs.readFileSync(path.join(ROOT, s), 'utf8'));
  if (opts.boot) w.__app = w.renderAll(w.PORTFOLIO_CONTENT);
  return w;
}

const BASE_SCRIPTS = ['js/content.js', 'js/viz/registry.js', 'js/grid.js', 'js/render.js'];

module.exports = { makeDom, BASE_SCRIPTS, ROOT };
