/* ---------- Langue (FR / EN) ---------- */
window.I18N = (() => {
  let on = false,
    BR = false;
  try {
    const lg = JSON.parse(localStorage.getItem(CLE_SAUVEGARDE) || '{}').lang;
    on = lg === 'en' || lg === 'br';
    BR = lg === 'br';
  } catch (_) {}
  const BM = '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵',
    brl = s =>
      s
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[a-z]/gi, c => BM[c.toLowerCase().charCodeAt(0) - 97])
        .replace(/[0-9]/g, d => BM[(+d + 9) % 10]);
  const D = window.TRADUCTIONS_EN;
  const keys = Object.keys(D)
    .filter(k => k.length >= 3)
    .sort((a, b) => b.length - a.length);
  const LT = /\p{L}/u,
    rx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let RE = null;
  const C = new Map();
  function tr(s) {
    if (!on || typeof s !== 'string' || !s) return s;
    const c = C.get(s);
    if (c !== undefined) return c;
    let r = s;
    const t = s.trim();
    if (BR) {
      r = brl(s);
      if (C.size > 6000) C.clear();
      C.set(s, r);
      return r;
    }
    if (t && D[t] !== undefined) r = s.replace(t, D[t]);
    else if (/[A-Za-zÀ-ÿ]{2}/.test(s)) {
      try {
        RE = RE || new RegExp(keys.map(rx).join('|'), 'g');
        r = s.replace(RE, (m, o, x) => {
          if (LT.test(m[0]) && o > 0 && LT.test(x[o - 1])) return m;
          const e = o + m.length;
          if (LT.test(m[m.length - 1]) && e < x.length && LT.test(x[e])) return m;
          return D[m];
        });
      } catch (_) {}
    }
    if (C.size > 6000) C.clear();
    C.set(s, r);
    return r;
  }
  const AT = ['placeholder', 'title', 'aria-label'];
  function walk(n) {
    if (n.nodeType === 3) {
      const p = n.parentNode;
      if (!p || p.nodeName == 'SCRIPT' || p.nodeName == 'STYLE' || p.nodeName == 'TEXTAREA' || (p.closest && p.closest('[data-notr]')))
        return;
      const v = n.nodeValue,
        w = tr(v);
      if (w !== v) n.nodeValue = w;
      return;
    }
    if (n.nodeType !== 1) return;
    const nm = n.nodeName;
    if (nm == 'SCRIPT' || nm == 'STYLE' || nm == 'TEXTAREA' || n.hasAttribute('data-notr')) return;
    for (const a of AT)
      if (n.hasAttribute(a)) {
        const v = n.getAttribute(a),
          w = tr(v);
        if (w !== v) n.setAttribute(a, w);
      }
    for (let c = n.firstChild; c; c = c.nextSibling) walk(c);
  }
  if (on) {
    document.documentElement.lang = BR ? 'fr' : 'en';
    if (BR) document.documentElement.classList.add('brl');
    new MutationObserver(L => {
      for (const m of L) {
        if (m.type == 'childList') m.addedNodes.forEach(walk);
        else if (m.type == 'characterData') walk(m.target);
        else if (m.type == 'attributes') {
          const v = m.target.getAttribute(m.attributeName),
            w = tr(v);
          if (v && w !== v) m.target.setAttribute(m.attributeName, w);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: AT });
    const fx = l => (!BR && typeof l == 'string' && /^fr/i.test(l) ? 'en-GB' : l);
    for (const f of ['toLocaleDateString', 'toLocaleString', 'toLocaleTimeString']) {
      const o = Date.prototype[f];
      Date.prototype[f] = function (l, ...a) {
        return o.call(this, fx(l), ...a);
      };
    }
    {
      const o = Number.prototype.toLocaleString;
      Number.prototype.toLocaleString = function (l, ...a) {
        return o.call(this, fx(l), ...a);
      };
    }
    const P = CanvasRenderingContext2D.prototype;
    for (const f of ['fillText', 'strokeText', 'measureText']) {
      const o = P[f];
      P[f] = function (t, ...a) {
        return o.call(this, typeof t == 'string' ? tr(t) : t, ...a);
      };
    }
    document.addEventListener('DOMContentLoaded', () => {
      walk(document.body);
      document.title = tr(document.title);
    });
  }
  return { on: () => on && !BR, br: () => BR, tr };
})();
