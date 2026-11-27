/* ---------- Neige & confettis ---------- */
const cv = $('#fx'),
  cx = cv.getContext('2d');
let P = [],
  F = [];
const sz = () => {
  cv.width = innerWidth;
  cv.height = innerHeight;
};
sz();
addEventListener('resize', sz);
const HEART = () => S.coeurs !== false && (S.own.includes('coeurs') || !!S.vbDone);
const GIFT = (() => {
  const a = [];
  ['🎁', '🎁', '💝', '🎀'].forEach(e => {
    const c = document.createElement('canvas');
    c.width = c.height = 48;
    const x = c.getContext('2d');
    x.font = '38px serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(e, 24, 27);
    a.push(c);
  });
  return a;
})();
function snowCount() {
  const n = S.fxbg === false ? 0 : S.vbDone && S.coeurs !== false ? 150 : HEART() ? 70 : 0;
  while (F.length < n)
    F.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 1 + Math.random() * 2.2, s: 0.3 + Math.random() });
  F.length = n;
  hdr();
}
snowCount();
function confetti() {
  const co = ['#ffd76a', '#ff4f6b', '#5cd68a', '#6ab8ff', '#ffffff', '#ff9ec4', '#b48cff'];
  const W = cv.width,
    Hh = cv.height;
  for (let i = 0; i < 160; i++) {
    const k = i % 3,
      x0 = k == 0 ? W / 2 : k == 1 ? -10 : W + 10,
      y0 = k == 0 ? Hh * 0.42 : Hh * 0.75;
    P.push({
      x: x0,
      y: y0,
      vx: k == 0 ? (Math.random() - 0.5) * 16 : k == 1 ? 4 + Math.random() * 9 : -4 - Math.random() * 9,
      vy: -Math.random() * 16 - (k ? 8 : 3),
      c: co[i % co.length],
      s: 5 + Math.random() * 7,
      r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.4,
      f: Math.random() * 6.28,
      sh: i % 4
    });
  }
}
(function loop() {
  cx.clearRect(0, 0, cv.width, cv.height);
  if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
    const hz = HEART() && !document.body.classList.contains('playing') && !document.getElementById('v3z'); // pause pendant un objet 3D (js/vue-3d.js)
    cx.fillStyle = '#fffb';
    if (hz)
      F.forEach((f, i) => {
        f.y += f.s * 0.55;
        f.x += Math.sin(f.y / 40) * 0.3;
        if (f.y > cv.height) {
          f.y = -40;
          f.x = Math.random() * cv.width;
        }
        if (hz && S.vbDone && i % 6 == 0) {
          const z = 16 + f.r * 7;
          f.y += f.s * 0.25;
          cx.globalAlpha = 0.8;
          cx.save();
          cx.translate(f.x, f.y);
          cx.rotate(Math.sin(f.y / 60 + i) * 0.35);
          cx.drawImage(GIFT[i % GIFT.length], -z / 2, -z / 2, z, z);
          cx.restore();
          cx.globalAlpha = 1;
        } else if (hz) {
          const V = !!S.vbDone,
            k = f.r * (V ? 2.9 : 2.1),
            x = f.x,
            y = f.y;
          if (V) f.y += f.s * 0.35;
          cx.fillStyle = (V ? ['#ff4f8bbb', '#ff9ec4cc', '#e0283fa8', '#ffd1e3cc'] : ['#ff4f8b55', '#ff9ec466', '#e0283f4d', '#ffd1e366'])[
            i % 4
          ];
          cx.beginPath();
          cx.moveTo(x, y + k * 0.35);
          cx.bezierCurveTo(x, y, x - k, y, x - k, y + k * 0.35);
          cx.bezierCurveTo(x - k, y + k * 0.8, x, y + k * 1.05, x, y + k * 1.4);
          cx.bezierCurveTo(x, y + k * 1.05, x + k, y + k * 0.8, x + k, y + k * 0.35);
          cx.bezierCurveTo(x + k, y, x, y, x, y + k * 0.35);
          cx.fill();
        } else {
          cx.beginPath();
          cx.arc(f.x, f.y, f.r, 0, 7);
          cx.fill();
        }
      });
  }
  P = P.filter(p => p.y < cv.height + 20);
  P.forEach(p => {
    p.vy = Math.min(p.vy + 0.32, 5.5);
    p.vx *= 0.985;
    p.f = (p.f || 0) + 0.12;
    p.x += p.vx + Math.sin(p.f) * 0.6;
    p.y += p.vy;
    p.r = (p.r || 0) + (p.vr || 0.1);
    cx.save();
    cx.translate(p.x, p.y);
    cx.rotate(p.r);
    cx.scale(1, Math.cos(p.f * 1.3));
    cx.fillStyle = p.c;
    if (p.sh == 1) {
      cx.beginPath();
      cx.arc(0, 0, p.s * 0.45, 0, 7);
      cx.fill();
    } else if (p.sh == 2) {
      cx.fillRect(-p.s * 0.15, -p.s, p.s * 0.3, p.s * 2);
    } else if (p.sh == 3) {
      cx.beginPath();
      for (let q = 0; q < 10; q++) {
        const rr = q % 2 ? p.s * 0.3 : p.s * 0.7,
          a = (q * Math.PI) / 5;
        cx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
      }
      cx.fill();
    } else cx.fillRect(-p.s / 2, -p.s * 0.3, p.s, p.s * 0.6);
    cx.restore();
  });
  requestAnimationFrame(loop);
})();
