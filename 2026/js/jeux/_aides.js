function bcv(el, hint) {
  el.innerHTML = `<div class="fbw"><canvas></canvas></div><p class="center muted">${hint}</p>`;
  const W = el.querySelector('.fbw'),
    cv = W.querySelector('canvas'),
    x = cv.getContext('2d'),
    dpr = Math.min(3, devicePixelRatio || 1);
  cv.width = 360 * dpr;
  cv.height = 540 * dpr;
  x.scale(dpr, dpr);
  const P = e => {
    const r = cv.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 360, ((e.clientY - r.top) / r.height) * 540];
  };
  return { W, cv, x, P };
}
function bimgU() {
  try {
    return lvlPic(lvl()) || (CONTENU.photos || [])[0] || '';
  } catch (_) {
    return '';
  }
}
const BPIM = {};
function bpicSrc(w) {
  if (w == 'sil') return svgPic('🧥');
  if (w == 'celestine') return VIMG.c;
  return susSrc((typeof SUSP != 'undefined' && SUSP.find(z => z.id == w)) || null);
}
function bpic(x, w, X, Y, s, ring, ko) {
  let im = BPIM[w];
  if (!im) {
    im = BPIM[w] = new Image();
    im.src = bpicSrc(w);
  }
  const r = s / 2;
  x.save();
  x.translate(X, Y);
  x.fillStyle = ring || '#f3c623';
  x.beginPath();
  x.arc(0, 0, r + 4, 0, 7);
  x.fill();
  x.beginPath();
  x.arc(0, 0, r, 0, 7);
  x.clip();
  x.fillStyle = '#e7dfcf';
  x.fill();
  if (im.complete && im.naturalWidth) {
    const k = Math.max(s / im.naturalWidth, s / im.naturalHeight);
    x.drawImage(im, (-im.naturalWidth * k) / 2, (-im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k);
  }
  if (ko) {
    x.fillStyle = '#0006';
    x.fillRect(-r, -r, s, s);
    x.font = s * 0.5 + 'px system-ui';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText('😵', 0, 0);
  }
  x.restore();
}
function bemo(x, e, X, Y, s) {
  x.save();
  x.fillStyle = '#000';
  x.font = s + 'px system-ui';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(e, X, Y);
  x.restore();
}
function bbar(x, hp, mx, n, fl, y) {
  y = y || 16;
  x.save();
  x.fillStyle = '#000a';
  x.beginPath();
  x.roundRect(60, y, 240, 16, 8);
  x.fill();
  x.fillStyle = fl ? '#fff' : '#ff3d6e';
  x.beginPath();
  x.roundRect(62, y + 2, Math.max(0, (236 * hp) / mx), 12, 6);
  x.fill();
  x.font = '800 12px system-ui';
  x.textAlign = 'center';
  x.fillStyle = '#ffd0dc';
  x.fillText(n, 180, y + 31);
  x.restore();
}
function bready(x, t) {
  x.save();
  x.fillStyle = '#000b';
  x.beginPath();
  x.roundRect(40, 262, 280, 56, 16);
  x.fill();
  x.fillStyle = '#fff';
  x.font = '800 17px system-ui';
  x.textAlign = 'center';
  x.fillText(t || '👆 Touche pour commencer', 180, 297);
  x.restore();
}
function TKX() {
  const R = document.documentElement;
  return R.classList.contains('tab') ? +getComputedStyle(R).getPropertyValue('--tk') || 1 : 1;
}
