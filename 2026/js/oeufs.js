function eggs() {
  if (!Array.isArray(S.eggs)) S.eggs = [];
  return S.eggs;
}
function eggBadge() {
  const b = document.getElementById('eggb');
  if (b) {
    const E = eggs();
    b.innerHTML = `${eggH(E.length ? (S.eggLast && E.includes(S.eggLast) ? S.eggLast : E[E.length - 1]) : 0, 'hd')} ${E.length}/24`;
  }
}
function eggAC() {
  try {
    const A = window.__eggAC || (window.__eggAC = new (window.AudioContext || window.webkitAudioContext)());
    if (A.state == 'suspended') A.resume();
    return A;
  } catch (_) {
    return null;
  }
}
function eggChime() {
  if (S.sound === false) return;
  const A = eggAC();
  if (!A) return;
  const t = A.currentTime;
  [1046.5, 1318.5, 1568, 2093, 2637].forEach((f, i) => {
    const o = A.createOscillator(),
      g = A.createGain(),
      t0 = t + i * 0.085;
    o.type = 'sine';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.11, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
    o.connect(g).connect(A.destination);
    o.start(t0);
    o.stop(t0 + 0.75);
  });
}
function honk() {
  S.honks = (S.honks || 0) + 1;
  if (S.honks >= 10) ACH('klaxon');
  if (S.sound === false) return;
  const A = eggAC();
  if (!A) return;
  const t = A.currentTime,
    d = 0.42,
    o = A.createGain(),
    lp = A.createBiquadFilter(),
    ws = A.createWaveShaper(),
    cv = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = i / 128 - 1;
    cv[i] = Math.tanh(x * 3);
  }
  ws.curve = cv;
  lp.type = 'lowpass';
  lp.frequency.value = 2600;
  lp.Q.value = 0.8;
  o.gain.setValueAtTime(0.0001, t);
  o.gain.exponentialRampToValueAtTime(0.16, t + 0.015);
  o.gain.setValueAtTime(0.16, t + d - 0.06);
  o.gain.exponentialRampToValueAtTime(0.0001, t + d);
  ws.connect(lp).connect(o).connect(A.destination);
  [349.2, 440, 352, 437].forEach((f, i) => {
    const q = A.createOscillator(),
      g = A.createGain();
    q.type = i < 2 ? 'sawtooth' : 'square';
    q.frequency.value = f;
    g.gain.value = i < 2 ? 0.5 : 0.18;
    q.connect(g).connect(ws);
    q.start(t);
    q.stop(t + d + 0.02);
  });
}
/* ---------- 🥚 24 œufs uniques ---------- */
const EGGN = [
  '',
  'Œuf mémoire',
  'Œuf fourmilière',
  'Œuf pimenté',
  "Œuf sucre d'orge volant",
  'Œuf arc-en-ciel',
  'Œuf air hockey',
  'Œuf zip',
  'Œuf bulle dorée',
  'Œuf flèches',
  'Œuf pixel',
  'Œuf Simon',
  'Œuf sudoku',
  'Œuf œil de lynx',
  'Œuf tour de cadeaux',
  'Œuf blocs',
  'Œuf mot fléché',
  'Œuf TCL',
  'Œuf bonbon',
  'Œuf 2048',
  'Œuf loupe',
  'Œuf points reliés',
  'Œuf de lave',
  'Œuf quiz',
  'Œuf puzzle'
];
function eggArt(d) {
  const E = 'M25 2C13 2 4 20 4 33c0 10 9 15 21 15s21-5 21-15C46 20 37 2 25 2Z',
    id = 'e' + d;
  const g = (a, b, c) =>
    `<radialGradient id="${id}g" cx="35%" cy="28%" r="80%"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></radialGradient>`;
  const R = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');
  let df = '',
    pat = '';
  const T = (x, y, t, s, c, w) =>
    `<text x="${x}" y="${y}" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="${s}" fill="${c}" text-anchor="middle" dominant-baseline="middle"${w ? ` stroke="${w}" stroke-width=".6"` : ''}>${t}</text>`;
  switch (d) {
    case 1:
      df = g('#d7f0ff', '#5aa8e8', '#1f5f9e');
      pat = R(6, i => {
        const x = 8 + (i % 3) * 12,
          y = 13 + Math.floor(i / 3) * 16;
        return `<rect x="${x}" y="${y}" width="10" height="13" rx="2" fill="${i == 2 ? '#fff' : '#e0283f'}" stroke="#fff" stroke-width="1"/>${i == 2 ? T(x + 5, y + 7, '🎁', 7) : T(x + 5, y + 7.5, '?', 8, '#fff')}`;
      });
      break;
    case 2:
      df = g('#fff3d6', '#f2c98a', '#b9874a');
      pat =
        R(42, i => {
          const x = 4 + (i % 7) * 6,
            y = 6 + Math.floor(i / 7) * 6;
          return `<rect x="${x}" y="${y}" width="5.4" height="5.4" rx="1" fill="${['#ef3b4f', '#ff9a1f', '#ffd83a', '#3cc35a', '#3f8cff', '#b05cff'][(i * 7 + Math.floor(i / 7)) % 6]}"/>`;
        }) +
        `<g transform="translate(25 44)"><ellipse cx="-4" rx="3" ry="2.2" fill="#2a1a12"/><ellipse cx="0" rx="1.6" ry="1.3" fill="#2a1a12"/><circle cx="3" r="1.8" fill="#2a1a12"/><path d="M-3 0l-2 3M0 0l0 3M2 0l2 3M-3 0l-2-3M0 0l0-3M2 0l2-3" stroke="#2a1a12" stroke-width=".6"/></g>`;
      break;
    case 3:
      df = g('#fff6e6', '#ffd9b0', '#e89a5a');
      pat =
        R(20, i => T(8 + (i % 5) * 8.5, 9 + Math.floor(i / 5) * 9, 'ABCDEFGHIJKLMNOPQRST'[(i * 7) % 20], 6, '#b0452a')) +
        `<g transform="translate(25 30) rotate(-30)"><path d="M-10 0 Q-2 -6 10 -2 Q12 2 6 4 Q-4 6 -10 0Z" fill="#e0182f"/><path d="M10 -2 q4 -4 2 -7" stroke="#2fa84a" stroke-width="2" fill="none"/></g>`;
      break;
    case 4:
      df = g('#fff', '#fff', '#ddd');
      pat =
        R(10, i => `<path d="M${-20 + i * 9} 50 L${10 + i * 9} 0 L${14 + i * 9} 0 L${-16 + i * 9} 50Z" fill="#e0283f"/>`) +
        `<path d="M2 26 q-8 -10 2 -12 q4 4 4 12z" fill="#fff" stroke="#bbb" stroke-width=".6"/><path d="M48 26 q8 -10 -2 -12 q-4 4 -4 12z" fill="#fff" stroke="#bbb" stroke-width=".6"/>`;
      break;
    case 5:
      df = g('#fff', '#fff', '#ddd');
      pat = ['#e0283f', '#ff8a1f', '#f6d32a', '#2fb35a', '#2d8fe0', '#3c3fb0', '#9b4fd1']
        .map((c, i) => `<rect x="0" y="${2 + i * 6.6}" width="50" height="6.8" fill="${c}"/>`)
        .join('');
      break;
    case 6:
      df = g('#6a5a8a', '#3a2a5a', '#1a1030');
      pat = R(4, r =>
        R(
          4,
          c =>
            `<circle cx="${12 + c * 9}" cy="${13 + r * 9}" r="3.4" fill="${['#e0283f', '#2fb35a', '#2d8fe0', '#f6d32a', '#ff7ab6', '#ff8a1f', '#9b4fd1'][(r * 3 + c * 5) % 7]}" stroke="#0006" stroke-width=".6"/><circle cx="${11 + c * 9}" cy="${12 + r * 9}" r="1" fill="#fff8"/>`
        )
      );
      break;
    case 7:
      df = g('#fff', '#e8f2ff', '#9fb8d8');
      pat =
        `<path d="M12 12 H38 V22 H12 V32 H38 V42 H14" stroke="#ff7a1f" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
        [
          [12, 12, 1],
          [38, 22, 2],
          [12, 32, 3],
          [14, 42, 4]
        ]
          .map(([x, y, n]) => `<circle cx="${x}" cy="${y}" r="4" fill="#1d1d2b"/>${T(x, y + 0.4, n, 5.5, '#fff')}`)
          .join('');
      break;
    case 8:
      df = g('#c8f0a0', '#4fb04a', '#1f5a1a');
      pat =
        R(40, i => {
          const x = (i % 6) * 9 - 2 + (Math.floor(i / 6) % 2) * 4.5,
            y = 4 + Math.floor(i / 6) * 6.5;
          return `<path d="M${x} ${y} q4.5 6 9 0" fill="none" stroke="#1f6a1a" stroke-width="1.2"/>`;
        }) +
        `<circle cx="18" cy="20" r="2" fill="#ffd34d"/><circle cx="18" cy="20" r=".8" fill="#111"/><circle cx="32" cy="20" r="2" fill="#ffd34d"/><circle cx="32" cy="20" r=".8" fill="#111"/><path d="M25 30 v6 l-2 3 M25 36 l2 3" stroke="#e0283f" stroke-width="1.2" fill="none"/>`;
      break;
    case 9:
      df = g('#fff8e0', '#ffd86a', '#c9971c');
      pat = R(9, i => {
        const x = 11 + (i % 3) * 14,
          y = 15 + Math.floor(i / 3) * 13,
          a = [0, 90, 180, 270][(i * 3) % 4];
        return `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M-5 0 H3 M0 -3.5 L4 0 L0 3.5" stroke="${['#e0283f', '#2d6fe0', '#2fb35a', '#9b4fd1'][i % 4]}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      });
      break;
    case 10:
      df = g('#fff', '#f3f3f3', '#c8c8c8');
      {
        const P = ['.....##.....', '....####....', '...##..##...', '..##....##..', '.##########.', '..#.#..#.#..', '..########..'];
        pat =
          P.map((r, y) =>
            [...r]
              .map((c, x) => (c == '#' ? `<rect x="${1 + x * 4}" y="${12 + y * 4}" width="3.6" height="3.6" fill="#1d1d2b"/>` : ''))
              .join('')
          ).join('') + R(13, i => `<path d="M${1 + i * 4} 0V50" stroke="#0001" stroke-width=".3"/>`);
      }
      break;
    case 11:
      df = g('#555', '#333', '#111');
      pat = `<path d="M25 25 L25 0 A30 30 0 0 0 0 25Z" fill="#2fb35a"/><path d="M25 25 L50 25 A30 30 0 0 0 25 0Z" fill="#e0283f"/><path d="M25 25 L0 25 A30 30 0 0 0 25 50Z" fill="#f6d32a"/><path d="M25 25 L25 50 A30 30 0 0 0 50 25Z" fill="#2d8fe0"/><circle cx="25" cy="25" r="6" fill="#222" stroke="#fff3" stroke-width="1"/><path d="M25 0V50M0 25H50" stroke="#111" stroke-width="2"/>`;
      break;
    case 12:
      df = g('#fff', '#f6f6ff', '#c8cce8');
      pat =
        R(4, i => `<path d="M${4 + i * 14} 0V50M0 ${7 + i * 13}H50" stroke="#3a3f8a" stroke-width="${i % 3 == 0 ? 1.2 : 0.5}"/>`) +
        [
          [11, 14, 3],
          [25, 14, 7],
          [39, 27, 1],
          [11, 27, 9],
          [25, 40, 5],
          [39, 14, 2],
          [25, 27, 8]
        ]
          .map(([x, y, n]) => T(x, y, n, 7, '#2a2f7a'))
          .join('');
      break;
    case 13:
      df = g('#ffe2b8', '#e09a5a', '#9a5a2a');
      pat = `<path d="M0 50 L10 20 L20 30 L30 12 L40 26 L50 18 V50Z" fill="#b8642a" opacity=".6"/><ellipse cx="25" cy="27" rx="14" ry="8" fill="#fff"/><circle cx="25" cy="27" r="6" fill="#2fa86a"/><circle cx="25" cy="27" r="3" fill="#111"/><circle cx="23" cy="25" r="1.2" fill="#fff"/><path d="M11 27 Q25 15 39 27" stroke="#3a2010" stroke-width="1.2" fill="none"/>`;
      break;
    case 14:
      df = g('#fff', '#f0f0f0', '#ccc');
      pat = [
        ['#e0283f', 4],
        ['#2fb35a', 14],
        ['#2d8fe0', 24],
        ['#ffd34d', 34],
        ['#c58bff', 44]
      ]
        .map(
          ([c, y], i) =>
            `<rect x="${6 + (i % 2) * 3}" y="${y}" width="38" height="10" fill="${c}"/><rect x="${23 + (i % 2) * 3}" y="${y}" width="4" height="10" fill="#fff9"/>`
        )
        .join('');
      break;
    case 15:
      df = g('#5a6aa8', '#2a3368', '#121838');
      pat = R(30, i => {
        const x = 2 + (i % 6) * 8,
          y = 4 + Math.floor(i / 6) * 9;
        const c = ['#ff4f7a', '#3d7bff', '#ffcc1f', '#a65bff', '#ff6fc8', '#ff8a1f', '#19d3e0'][(i * 5) % 7];
        return (i * 7) % 3
          ? `<rect x="${x}" y="${y}" width="7.4" height="8.4" rx="1.4" fill="${c}"/><rect x="${x + 1}" y="${y + 1}" width="5.4" height="2" rx=".8" fill="#fff6"/>`
          : '';
      });
      break;
    case 16:
      df = g('#fff0f6', '#ffc3db', '#e07aa8');
      pat =
        R(12, i => {
          const x = 6 + (i % 4) * 10.5,
            y = 13 + Math.floor(i / 4) * 11;
          return `<rect x="${x}" y="${y}" width="9.5" height="10" fill="#fff" stroke="#c2185b" stroke-width=".6"/>${T(x + 4.75, y + 5.4, 'CELESTINEMAM'[i], 6, '#c2185b')}`;
        }) + `<path transform="translate(25 6) scale(.4)" d="M0 4C0-2-8-2-8 4c0 5 8 9 8 11 0-2 8-6 8-11 0-6-8-6-8 0Z" fill="#e0283f"/>`;
      break;
    case 17:
      df = g('#ffd6ec', '#e5007d', '#8a0049');
      pat = `<rect x="0" y="30" width="50" height="20" fill="#3a3a44"/><path d="M0 40 H50" stroke="#fff" stroke-width="1.2" stroke-dasharray="4 3"/><g transform="translate(25 24)"><rect x="-14" y="-6" width="28" height="12" rx="3" fill="#fff"/><rect x="-11" y="-4" width="6" height="4" fill="#8ad0ff"/><rect x="-3" y="-4" width="6" height="4" fill="#8ad0ff"/><rect x="5" y="-4" width="6" height="4" fill="#8ad0ff"/><rect x="-14" y="2" width="28" height="2" fill="#e5007d"/><circle cx="-8" cy="7" r="2.2" fill="#111"/><circle cx="8" cy="7" r="2.2" fill="#111"/></g>${T(25, 10, 'TCL', 6, '#fff')}`;
      break;
    case 18:
      df = g('#fff0fa', '#ffc0e4', '#e07ab8');
      pat = [
        [13, 14, '#ff2d55'],
        [33, 13, '#ffd21a'],
        [24, 26, '#2f7bff'],
        [12, 36, '#25c96a'],
        [36, 36, '#a64dff']
      ]
        .map(
          ([x, y, c]) =>
            `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.6" fill="${c}"/><ellipse cx="${x - 1.8}" cy="${y - 1.6}" rx="2" ry="1.2" fill="#fff9"/><path d="M${x - 6} ${y}l-4 -3v6zM${x + 6} ${y}l4 -3v6z" fill="${c}"/>`
        )
        .join('');
      break;
    case 19:
      df = g('#fff6e0', '#f2d8a0', '#c9a160');
      pat = [
        [4, 8, '#eee4da', '2', '#776e65'],
        [26, 8, '#f2b179', '8', '#fff'],
        [4, 28, '#f67c5f', '32', '#fff'],
        [26, 28, '#edc850', '512', '#fff']
      ]
        .map(
          ([x, y, b, n, c]) =>
            `<rect x="${x}" y="${y}" width="20" height="18" rx="3" fill="${b}"/>${T(x + 10, y + 9.5, n, n.length > 2 ? 7 : 9, c)}`
        )
        .join('');
      break;
    case 20:
      df = g('#fff', '#e8f4ff', '#a8c8e8');
      pat = `<rect x="0" y="0" width="25" height="50" fill="#ffe8b8" opacity=".7"/><path d="M25 0V50" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="18" r="3" fill="#e0283f"/><circle cx="38" cy="18" r="3" fill="#2d8fe0"/><circle cx="24" cy="30" r="9" fill="#bfefff66" stroke="#5a3a1a" stroke-width="2.4"/><path d="M30 37 l8 8" stroke="#5a3a1a" stroke-width="3.4" stroke-linecap="round"/>`;
      break;
    case 21:
      df = g('#2a2f4a', '#161a30', '#080a18');
      pat = [
        [
          '#ff4f7b',
          [
            [8, 12],
            [8, 26],
            [20, 26]
          ]
        ],
        [
          '#4fc3ff',
          [
            [30, 10],
            [42, 10],
            [42, 30]
          ]
        ],
        [
          '#7be08a',
          [
            [12, 38],
            [30, 38],
            [30, 30]
          ]
        ],
        [
          '#ffd34d',
          [
            [24, 14],
            [34, 22]
          ]
        ]
      ]
        .map(
          ([c, P]) =>
            `<path d="M${P.map(p => p.join(' ')).join(' L')}" stroke="${c}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${P[0][0]}" cy="${P[0][1]}" r="3.4" fill="${c}"/><circle cx="${P[P.length - 1][0]}" cy="${P[P.length - 1][1]}" r="3.4" fill="${c}"/>`
        )
        .join('');
      break;
    case 22:
      df = g('#5a4a4a', '#2a1a1a', '#0a0505');
      pat = `<path d="M0 32 Q12 26 25 32 T50 30 V50 H0Z" fill="#ff7a1f"/><path d="M0 34 Q12 29 25 35 T50 33" stroke="#ffd34d" stroke-width="1.2" fill="none"/><path d="M10 6 L18 16 L14 24 L22 30 M30 18 L38 8" stroke="#ff7a1f" stroke-width="1.6" fill="none"/><path d="M6 20 H44" stroke="#f2b52c" stroke-width="2.4"/><circle cx="44" cy="20" r="2.4" fill="#f2b52c"/>`;
      break;
    case 23:
      df = g('#fff4f8', '#ffc6dc', '#d97aa0');
      pat =
        R(7, i =>
          T(
            8 + (i % 4) * 11 + Math.floor(i / 4) * 5,
            14 + Math.floor(i / 4) * 14,
            i % 2 ? '?' : '♥',
            i % 2 ? 10 : 9,
            i % 2 ? '#7a1a4a' : '#e0283f'
          )
        ) + T(25, 42, '?', 12, '#fff', '#c2185b');
      break;
    case 24:
      df = g('#d8f0ff', '#8ac0e8', '#3a7ab8');
      pat = `<path d="M0 25 H18 a4 4 0 1 0 6 0 H25 V0 M25 25 V31 a4 4 0 1 1 0 6 V50 M25 25 H31 a4 4 0 1 1 6 0 H50" stroke="#fff" stroke-width="1.6" fill="none"/><rect x="0" y="0" width="25" height="25" fill="#ffd34d" opacity=".5"/><rect x="25" y="25" width="25" height="25" fill="#ff7ab6" opacity=".5"/>`;
      break;
    default:
      df = g('#fff', '#f6e7c8', '#d9bb85');
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs>${df}<clipPath id="${id}c"><path d="${E}"/></clipPath></defs><path d="${E}" fill="#0003" transform="translate(1.2 1.6)"/><path d="${E}" fill="url(#${id}g)"/><g clip-path="url(#${id}c)">${pat}</g><path d="${E}" fill="none" stroke="#0002" stroke-width="1"/><ellipse cx="17" cy="14" rx="4" ry="7" fill="#fff" opacity=".3" transform="rotate(-20 17 14)"/></svg>`;
}
const EGGU = {},
  EGGI = {};
function eggSrc(d) {
  d = d == null ? window.CURD || 1 : d;
  return EGGU[d] || (EGGU[d] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(eggArt(d)));
}
function eggImg(d) {
  d = d == null ? window.CURD || 1 : d;
  if (!EGGI[d]) {
    const i = new Image();
    i.src = eggSrc(d);
    EGGI[d] = i;
  }
  return EGGI[d];
}
function eggH(d, cls) {
  return `<img class="eggi ${cls || ''}" src="${eggSrc(d)}" alt="œuf">`;
}
function eggDraw(c, cx, cy, s, d) {
  const i = eggImg(d);
  if (i.complete && i.naturalWidth) {
    c.drawImage(i, cx - s / 2, cy - s / 2, s, s);
  } else {
    c.save();
    c.font = `${s * 0.9}px serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('🥚', cx, cy);
    c.restore();
  }
}
for (let d = 1; d <= 24; d++) eggImg(d);
function eggFx(n, d) {
  const e = document.createElement('div');
  e.className = 'eggfx';
  e.innerHTML = `${eggH(d, 'big')}<b>${EGGN[d] || 'Œuf secret'} · ${n}/24 !</b>`;
  document.body.appendChild(e);
  const b = document.getElementById('eggb'),
    r = b && b.getBoundingClientRect(),
    dx = r ? r.left + r.width / 2 - innerWidth / 2 : 0,
    dy = r ? r.top + r.height / 2 - innerHeight * 0.42 : -innerHeight * 0.4;
  e.animate(
    [
      { transform: 'translate(-50%,-50%) scale(0) rotate(-30deg)', opacity: 0 },
      { transform: 'translate(-50%,-50%) scale(1.15) rotate(8deg)', opacity: 1, offset: 0.18 },
      { transform: 'translate(-50%,-50%) scale(1) rotate(-6deg)', offset: 0.3 },
      { transform: 'translate(-50%,-50%) scale(1) rotate(5deg)', offset: 0.42 },
      { transform: 'translate(-50%,-50%) scale(1) rotate(0)', opacity: 1, offset: 0.7 },
      { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.15)`, opacity: 0.2 }
    ],
    { duration: 2300, easing: 'ease-in-out', fill: 'forwards' }
  ).onfinish = () => {
    e.remove();
    if (b) {
      b.classList.remove('pulse');
      void b.offsetWidth;
      b.classList.add('pulse');
    }
  };
}
function EGG(d) {
  d = d || window.CURD;
  if (!d) return;
  const E = eggs();
  if (!E.includes(d)) slog('🥚', `Trouve l'œuf du jour ${d}`);
  if (S.eggTroll) {
    if (!Array.isArray(S.eggsReal)) S.eggsReal = [];
    if (!S.eggsReal.includes(d)) {
      S.eggsReal.push(d);
      save();
    }
  }
  if (E.includes(d)) {
    toast(`${eggH(d)} Tu avais déjà trouvé l'${(EGGN[d] || 'œuf de ce jour').replace(/^Œ/, 'œ')} !`);
    return;
  }
  E.push(d);
  E.sort((a, b) => a - b);
  save();
  try {
    EV('egg');
  } catch (_) {}
  S.eggLast = d;
  save();
  eggChime();
  eggFx(E.length, d);
  eggBadge();
  try {
    navigator.vibrate && navigator.vibrate([30, 60, 30]);
  } catch (_) {}
  if (E.length == 24)
    setTimeout(() => {
      confetti();
      popup(
        `<h2>🥚 Les 24 œufs !</h2><p style="font-size:3rem;margin:.2em 0">🪺</p><p>Tu as trouvé tous les œufs cachés du calendrier. Bravo, détective !</p><p><b>🔓 Le niveau secret est débloqué.</b></p><button onclick="closePop();eggSecret()">Voir le niveau secret</button>`
      );
    }, 2500);
}
function fastSpin() {
  return !!S.arrowFolle;
}
function arrowFolle() {
  S.arrowFolle = !S.arrowFolle;
  save();
  toast(S.arrowFolle ? '🌀 Flèches en folie activé : ça va tourner TRÈS vite' : '🌀 Flèches en folie désactivé');
  admin();
}
function eggTroll() {
  if (!S.eggTroll) {
    S.eggsReal = [...eggs()];
    S.eggs = Array.from({ length: 24 }, (_, i) => i + 1);
    S.eggTroll = true;
    toast('🥚 Les 24 œufs sont débloqués (troll activé)');
  } else {
    S.eggs = Array.isArray(S.eggsReal) ? [...S.eggsReal].sort((a, b) => a - b) : [];
    S.eggTroll = false;
    toast('🥚 Troll désactivé : retour aux vrais œufs');
  }
  save();
  eggBadge();
  admin();
}
function eggBasket() {
  const E = eggs(),
    n = E.length;
  popup(`<h2>🧺 Mes œufs cachés</h2><p style="margin:.2em 0"><b>${n}</b> / 24 trouvés</p><div class="eggbk">${Array.from({ length: 24 }, (_, i) => (E.includes(i + 1) ? `<span class="on" aria-label="Jour ${i + 1} : ${EGGN[i + 1]}" title="${EGGN[i + 1]}">${eggH(i + 1)}<small>${i + 1}</small></span>` : `<span aria-label="Jour ${i + 1}">${i + 1}</span>`)).join('')}</div>
 <p class="muted" style="font-size:.9rem;text-align:left">Chaque jeu du calendrier cache un œuf. Pour savoir comment le trouver, relis bien le texte de chaque jeu… très attentivement. Un œuf compte dès qu'il est trouvé, même si la partie est perdue, et même en rejouant pour le plaisir.</p>
 <p>${n >= 24 ? '🔓 <b>Niveau secret débloqué !</b>' : `🔒 Niveau secret : trouve les ${24 - n} œuf${24 - n > 1 ? 's' : ''} qui manque${24 - n > 1 ? 'nt' : ''}`}</p>
 <div class="row">${n >= 24 ? '<button onclick="closePop();eggSecret()">🗝️ Niveau secret</button>' : ''}<button class="alt" onclick="closePop()">Fermer</button></div>`);
}
