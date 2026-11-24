/* ---------- Moteur du jeu « Sauve Célestine » (jour 22) ---------- */
const PIN = {
  W: 300,
  H: 520,
  GR: 1400,
  R: { h: 16, g: 12, l: 4.2, w: 4.2, s: 4.2, b: 13, e: 9 },
  M: { h: 9, g: 7, l: 1, w: 0.8, s: 5, b: 14, e: 4 },
  // Boîte commune : côtés, entonnoir vers la hotte, et la hotte
  BOX: [
    [16, 16, 284, 16],
    [16, 16, 16, 330],
    [284, 16, 284, 330],
    [16, 330, 122, 402],
    [284, 330, 178, 402],
    [66, 440, 66, 508],
    [234, 440, 234, 508],
    [66, 508, 234, 508]
  ],
  SHAPE: [
    [16, 16],
    [284, 16],
    [284, 330],
    [178, 402],
    [122, 402],
    [16, 330]
  ],
  LV: []
};
// Niveaux : w = murs en plus, p = tiges [x1,y1,x2,y2,côté poignée 'a'|'b'], h = Célestine, g = Grinchs, f = liquides [type,x1,y1,x2,y2]
PIN.LV = [
  {
    t: 'Le déluge',
    w: [
      [150, 16, 150, 120],
      [16, 150, 146, 186],
      [150, 186, 150, 240],
      [72, 244, 72, 274]
    ],
    p: [
      [16, 120, 150, 120, 'a'],
      [150, 120, 284, 120, 'b'],
      [150, 240, 284, 240, 'b'],
      [100, 408, 200, 408, 'b'],
      [16, 274, 72, 274, 'a']
    ],
    h: [217, 100],
    g: [[150, 392]],
    f: [
      ['w', 22, 40, 144, 114],
      ['l', 156, 190, 278, 234]
    ],
    e: [[42, 256]]
  },
  {
    t: 'Le versoir',
    tilt: 1,
    w: [
      [70, 16, 70, 120],
      [190, 16, 190, 120],
      [16, 288, 112, 256],
      [188, 256, 284, 288]
    ],
    p: [
      [190, 120, 284, 120, 'b'],
      [112, 256, 188, 256, 'b'],
      [100, 408, 200, 408, 'b'],
      [70, 120, 190, 120, 'a']
    ],
    h: [237, 100],
    g: [
      [150, 240],
      [150, 392]
    ],
    f: [
      ['w', 76, 40, 184, 114],
      ['l', 22, 232, 70, 264],
      ['l', 230, 232, 278, 264]
    ]
  },
  {
    t: 'Clé sous la lave',
    tilt: 1,
    w: [
      [100, 16, 100, 110],
      [190, 16, 190, 110],
      [16, 212, 112, 212],
      [178, 212, 284, 236],
      [16, 110, 40, 110]
    ],
    p: [
      [190, 110, 284, 110, 'b'],
      [40, 110, 100, 110, 'a'],
      [112, 212, 178, 212, 'b', 'or'],
      [100, 408, 200, 408, 'b'],
      [100, 110, 190, 110, 'a']
    ],
    h: [237, 90],
    g: [[150, 392]],
    f: [
      ['l', 22, 66, 94, 104],
      ['w', 106, 40, 184, 104]
    ],
    k: [[40, 192, 'or']]
  },
  {
    t: 'Les sentinelles',
    w: [
      [120, 16, 120, 124],
      [180, 16, 180, 124],
      [16, 206, 124, 206],
      [16, 290, 124, 290],
      [176, 290, 284, 326]
    ],
    p: [
      [120, 62, 180, 62, 'a'],
      [120, 124, 180, 124, 'b'],
      [180, 100, 284, 100, 'b'],
      [124, 206, 176, 206, 'b'],
      [124, 290, 176, 290, 'b']
    ],
    h: [150, 40],
    g: [
      [150, 192],
      [110, 274, 96, 206, 70]
    ],
    b: [[150, 104]],
    f: [['l', 186, 64, 232, 94]]
  },
  {
    t: 'Tout dans le bon ordre',
    w: [
      [150, 16, 150, 120],
      [16, 200, 110, 236],
      [284, 200, 190, 236]
    ],
    p: [
      [16, 120, 150, 120, 'a'],
      [150, 120, 284, 120, 'b'],
      [110, 236, 190, 236, 'b'],
      [100, 408, 200, 408, 'a']
    ],
    h: [80, 100],
    g: [[150, 224]],
    f: [
      ['l', 156, 40, 278, 114],
      ['w', 22, 250, 278, 322]
    ]
  },
  {
    t: 'Tout bouge',
    tilt: 1,
    w: [
      [60, 130, 284, 130],
      [16, 250, 128, 250],
      [172, 250, 284, 250]
    ],
    p: [[128, 250, 172, 250, 'b', 'or']],
    h: [200, 112],
    g: [[230, 234, 36, 264, 50]],
    b: [[118, 114]],
    f: [],
    k: [[262, 112, 'or']]
  },
  {
    t: 'Le cadeau-enclume',
    w: [
      [150, 16, 150, 220],
      [217, 16, 217, 110]
    ],
    p: [
      [16, 110, 150, 110, 'a'],
      [150, 110, 217, 110, 'a'],
      [217, 110, 284, 110, 'b'],
      [16, 220, 150, 220, 'a'],
      [150, 220, 284, 220, 'b']
    ],
    h: [250, 90],
    g: [[184, 204, 168, 266, 40]],
    b: [[183, 90]],
    f: [
      ['w', 22, 30, 144, 104],
      ['l', 22, 150, 144, 214]
    ]
  },
  {
    t: 'Le grand voyage',
    tilt: 1,
    w: [
      [60, 16, 60, 100],
      [104, 120, 284, 120],
      [16, 222, 236, 222]
    ],
    p: [
      [16, 100, 60, 100, 'a'],
      [200, 70, 200, 117, 'a'],
      [100, 408, 200, 408, 'b', 'rouge']
    ],
    h: [245, 100],
    g: [[72, 206]],
    f: [
      ['l', 20, 22, 56, 96],
      ['w', 22, 290, 278, 330]
    ],
    k: [[150, 204, 'rouge']]
  },
  {
    t: 'Deux cambrioleurs, un seul passage',
    w: [
      [120, 16, 120, 100],
      [180, 16, 180, 100],
      [16, 180, 128, 180],
      [172, 180, 284, 180],
      [16, 290, 128, 290],
      [172, 290, 284, 290]
    ],
    p: [
      [120, 100, 180, 100, 'b'],
      [128, 180, 172, 180, 'b'],
      [128, 290, 172, 290, 'a']
    ],
    h: [150, 80],
    g: [
      [60, 164, 36, 264, 72],
      [240, 274, 36, 264, 47]
    ],
    f: []
  },
  {
    t: 'Le grand final',
    w: [
      [100, 16, 100, 100],
      [200, 16, 200, 100],
      [16, 210, 120, 210],
      [180, 210, 284, 210],
      [200, 226, 200, 300]
    ],
    p: [
      [16, 100, 100, 100, 'a'],
      [100, 100, 200, 100, 'a'],
      [200, 100, 284, 100, 'b'],
      [120, 210, 180, 210, 'b'],
      [200, 300, 284, 300, 'b'],
      [110, 408, 190, 408, 'a']
    ],
    h: [150, 80],
    g: [
      [230, 194, 36, 264, 45],
      [150, 392]
    ],
    b: [[58, 80]],
    f: [
      ['l', 206, 24, 278, 94],
      ['w', 206, 226, 278, 294]
    ]
  }
];
const pinLocked = (w, s) => !!s.key && !w.keys[s.key];
function pinWorld(i) {
  const D = PIN.LV[i],
    P = [];
  const add = (k, x, y) => P.push({ k, x, y, px: x, py: y, r: PIN.R[k], m: PIN.M[k] });
  add('h', D.h[0], D.h[1]);
  D.g.forEach(g => {
    add('g', g[0], g[1]);
    if (g[2]) {
      const q = P[P.length - 1];
      q.pat = [g[2], g[3]];
      q.v = g[4] || 50;
      q.dir = 1;
    }
  });
  (D.b || []).forEach(b => add('b', b[0], b[1]));
  (D.e || []).forEach(b => add('e', b[0], b[1]));
  D.f.forEach(([k, x1, y1, x2, y2]) => {
    const r = PIN.R[k],
      s = 2 * r + 0.3;
    let row = 0;
    for (let y = y2 - r; y >= y1 + r; y -= s * 0.87, row++) for (let x = x1 + r + (row % 2 ? r : 0); x <= x2 - r; x += s) add(k, x, y);
  });
  return {
    P,
    segs: [...PIN.BOX, ...D.w].map(a => ({ a, r: 5 })),
    pins: D.p.map(q => ({ a: q.slice(0, 4), side: q[4], key: q[5] || '', r: 5, on: true, out: 0 })),
    st: '',
    fx: [],
    t: 0,
    tilt: 0,
    keys: {},
    K: (D.k || []).map(k => ({ x: k[0], y: k[1], c: k[2], got: false }))
  };
}
function pinSeg(q, s) {
  const [x1, y1, x2, y2] = s.a,
    dx = x2 - x1,
    dy = y2 - y1,
    l = dx * dx + dy * dy;
  let t = ((q.x - x1) * dx + (q.y - y1) * dy) / l;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const cx = x1 + t * dx,
    cy = y1 + t * dy;
  let ex = q.x - cx,
    ey = q.y - cy;
  const d2 = ex * ex + ey * ey,
    m = q.r + s.r;
  if (d2 < m * m) {
    let d = Math.sqrt(d2);
    if (d < 1e-6) {
      ex = 0;
      ey = -1;
      d = 1;
    }
    const nx = ex / d,
      ny = ey / d,
      pen = m - d;
    q.x += nx * pen;
    q.y += ny * pen;
    const vx = q.x - q.px,
      vy = q.y - q.py,
      vn = vx * nx + vy * ny,
      f = q.k == 'l' || q.k == 'w' ? 0.995 : 0.97;
    if (vn < 0) {
      const tx = vx - vn * nx,
        ty = vy - vn * ny;
      q.px = q.x - tx * f;
      q.py = q.y - ty * f;
    }
  }
}
function pinStep(w, dt) {
  const P = w.P;
  w.dt = dt;
  for (const q of P)
    if (q.pat && !q.dead) {
      if (q.x < q.pat[0]) q.dir = 1;
      else if (q.x > q.pat[1]) q.dir = -1;
      else {
        q.stk = Math.abs(q.x - (q.lx ?? q.x)) < q.v * dt * 0.3 ? (q.stk || 0) + dt : 0;
        if (q.stk > 0.25) {
          q.dir *= -1;
          q.stk = 0;
        }
      }
      q.lx = q.x;
      q.px = q.x - q.dir * q.v * dt;
    }
  {
    const h = P.find(o => o.k == 'h');
    for (const q of P)
      if (q.k == 'g' && !q.dead) {
        if (h && w.t > 1.2 && !w.st && Math.abs(h.y - q.y) < 34 && Math.abs(h.x - q.x) < 170 && Math.abs(q.y - q.py) < 1.2) {
          const d = Math.sign(h.x - q.x) || 1;
          q.dir = d;
          q.chase = 1;
          q.px = q.x - d * 78 * dt;
        } else q.chase = 0;
      }
  }
  const ta = ((w.tilt || 0) * Math.PI) / 180,
    gx = PIN.GR * Math.sin(ta) * dt * dt,
    g = PIN.GR * Math.cos(ta) * dt * dt;
  w.t += dt;
  for (const q of P) {
    const vx = (q.x - q.px) * 0.997,
      vy = (q.y - q.py) * 0.997;
    q.px = q.x;
    q.py = q.y;
    const f = q.k == 's' ? 1.5 : 1;
    q.x += vx + gx * f;
    q.y += vy + g * f;
  }
  const live = w.segs.concat(w.pins.filter(s => s.on));
  for (let it = 0; it < 3; it++) {
    const C = 14,
      grid = new Map();
    for (let i = 0; i < P.length; i++) {
      const q = P[i];
      if (q.dead) continue;
      const k = ((q.x / C) | 0) * 1000 + ((q.y / C) | 0);
      let a = grid.get(k);
      if (!a) grid.set(k, (a = []));
      a.push(i);
    }
    for (let i = 0; i < P.length; i++) {
      const a = P[i];
      if (a.dead) continue;
      const cx = (a.x / C) | 0,
        cy = (a.y / C) | 0,
        rr = a.r > 8 ? 2 : 1;
      for (let ox = -rr; ox <= rr; ox++)
        for (let oy = -rr; oy <= rr; oy++) {
          const L = grid.get((cx + ox) * 1000 + cy + oy);
          if (!L) continue;
          for (const j of L) {
            if (j <= i) continue;
            const b = P[j];
            if (b.dead) continue;
            const dx = b.x - a.x,
              dy = b.y - a.y,
              m = a.r + b.r,
              d2 = dx * dx + dy * dy;
            if (d2 >= m * m || d2 < 1e-9) continue;
            if (a.k != b.k) {
              if ((a.k == 's' && (b.k == 'l' || b.k == 'w')) || (b.k == 's' && (a.k == 'l' || a.k == 'w'))) continue;
              if (pinReact(w, a, b)) continue;
            }
            const d = Math.sqrt(d2),
              pen = m - d,
              nx = dx / d,
              ny = dy / d,
              ia = 1 / a.m,
              ib = 1 / b.m,
              s = pen / (ia + ib);
            a.x -= nx * s * ia;
            a.y -= ny * s * ia;
            b.x += nx * s * ib;
            b.y += ny * s * ib;
          }
        }
    }
    for (const q of P) {
      if (q.dead) continue;
      for (const s of live) pinSeg(q, s);
      if (q.x < q.r) q.x = q.r;
      if (q.x > PIN.W - q.r) q.x = PIN.W - q.r;
    }
  }
  if (P.some(q => q.dead)) w.P = P.filter(q => !q.dead);
  w.P = w.P.filter(q => q.y < PIN.H + 30 && !((q.k == 'w' || q.k == 's') && q.y > 456));
  {
    const h = w.P.find(q => q.k == 'h');
    if (h)
      for (const k of w.K)
        if (!k.got && Math.hypot(h.x - k.x, h.y - k.y) < 24) {
          k.got = true;
          w.keys[k.c] = 1;
          w.fx.push({ x: k.x, y: k.y, t: 0, c: '#ffe27a', big: 1, key: 1 });
        }
  }
  if (!w.st) {
    const h = w.P.find(q => q.k == 'h');
    if (!h) w.st = 'lost';
    else if (h.y > 418 && w.wp == null) w.wp = w.t;
    for (const q of w.P) {
      if (q.k == 'l' && q.y > 436) {
        w.st = 'sack';
        break;
      }
      if (q.k == 'g' && q.y > 440) {
        w.st = 'grinchsack';
        break;
      }
    }
    if (!w.st && w.wp != null) {
      let mv = false;
      for (const q of w.P)
        if ((q.k == 'l' || (q.k == 'g' && !q.pat) || q.k == 'b') && q.y < 436 && Math.hypot(q.x - q.px, q.y - q.py) > 0.15) {
          mv = true;
          break;
        }
      w.calm = mv ? 0 : (w.calm || 0) + dt;
      if (w.t - w.wp > 1 && (w.calm > 0.6 || w.t - w.wp > 6)) w.st = 'win';
    }
  }
}
function pinReact(w, a, b) {
  const ks = a.k + b.k,
    has = k => a.k == k || b.k == k;
  if (has('l') && has('w')) {
    const L = a.k == 'l' ? a : b,
      W = a.k == 'w' ? a : b;
    L.k = 's';
    L.m = PIN.M.s;
    W.dead = true;
    w.fx.push({ x: W.x, y: W.y, t: 0, c: '#f2f6f8' });
    return true;
  }
  if (has('e') && (has('l') || has('g'))) {
    const E = a.k == 'e' ? a : b;
    E.dead = true;
    w.fx.push({ x: E.x, y: E.y, t: 0, c: has('l') ? '#ff8a2a' : '#7ed957', big: 1 });
    return true;
  }
  if (has('h') && has('l')) {
    if (!w.st) w.st = 'burn';
    return false;
  }
  if (has('h') && has('g')) {
    if (!w.st) w.st = 'grinch';
    return false;
  }
  if (has('g') && has('b')) {
    const g = a.k == 'g' ? a : b,
      B = a.k == 'b' ? a : b,
      dt = w.dt || 1 / 180,
      rv = Math.hypot(B.x - B.px - (g.x - g.px), B.y - B.py - (g.y - g.py)) / dt;
    if (rv > 220 && B.y < g.y) {
      g.dead = true;
      w.fx.push({ x: g.x, y: g.y, t: 0, c: '#7ed957', big: 1 });
      return true;
    }
    return false;
  }
  if (has('g') && has('l')) {
    const g = a.k == 'g' ? a : b;
    g.dead = true;
    try {
      ACH('grinch');
    } catch (_) {}
    w.fx.push({ x: g.x, y: g.y, t: 0, c: '#7ed957', big: 1 });
    return true;
  }
  return false;
}
/* Contre-rotation : si le téléphone pivote pendant un jeu, le jeu reste dans le sens du téléphone */
function orientFix() {
  const R = document.documentElement,
    gw = document.getElementById('gwin');
  let a =
    screen.orientation && typeof screen.orientation.angle == 'number'
      ? screen.orientation.angle
      : typeof window.orientation == 'number'
        ? window.orientation
        : 0;
  a = ((a % 360) + 360) % 360;
  const land =
      innerWidth > innerHeight &&
      Math.min(innerWidth, innerHeight) < 600 &&
      (matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window),
    on = !!gw && land && (a == 90 || a == 270);
  R.style.setProperty('--vw', innerWidth + 'px');
  R.style.setProperty('--vh', innerHeight + 'px');
  R.classList.toggle('rotL', on && a == 90);
  R.classList.toggle('rotR', on && a == 270);
}
['resize', 'orientationchange'].forEach(e =>
  addEventListener(e, () => {
    orientFix();
    setTimeout(orientFix, 250);
  })
);
if (screen.orientation && screen.orientation.addEventListener)
  screen.orientation.addEventListener('change', () => setTimeout(orientFix, 50));
setInterval(orientFix, 700);
