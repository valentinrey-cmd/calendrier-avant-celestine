/* ================= 🎬 CINÉ : moteur des cinématiques (décors, personnages, caméra, sons) ================= */
const CINE = (() => {
  const W = 480,
    H = 900;
  const sv = (body, vb, par) =>
    `<svg viewBox="${vb || '0 0 ' + W + ' ' + H}" preserveAspectRatio="${par || 'xMidYMax slice'}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  const rnd = (a, b) => a + Math.random() * (b - a);
  /* ---------- éléments de décor réutilisables ---------- */
  const pine = (x, y, s, c, snow) => {
    c = c || '#123a2c';
    snow = snow || '#eaf2ff';
    const t = (k, w, h) =>
      `<path d="M${x} ${y - h * s} L${x + w * s} ${y - (h - k) * s} L${x - w * s} ${y - (h - k) * s}Z" fill="${c}"/><path d="M${x} ${y - h * s} L${x + w * s * 0.45} ${y - (h - k * 0.45) * s} Q${x} ${y - (h - k * 0.6) * s} ${x - w * s * 0.45} ${y - (h - k * 0.45) * s}Z" fill="${snow}"/>`;
    return `<rect x="${x - 4 * s}" y="${y - 14 * s}" width="${8 * s}" height="${14 * s}" fill="#4a2c1a"/>${t(46, 34, 60)}${t(40, 27, 92)}${t(34, 20, 118)}`;
  };

  const stars = n => {
    let o = '';
    for (let i = 0; i < n; i++)
      o += `<circle class="cn-tw" cx="${rnd(0, W).toFixed(0)}" cy="${rnd(H * 0.17, H * 0.6).toFixed(0)}" r="${rnd(0.6, 1.8).toFixed(1)}" fill="#fff" style="animation-delay:${rnd(0, 4).toFixed(1)}s;animation-duration:${rnd(2, 5).toFixed(1)}s"/>`;
    return o;
  };

  const ground = (y, c1, c2) =>
    `<path d="M0 ${y + 20} Q120 ${y - 14} 240 ${y + 6} T480 ${y} L480 ${H} L0 ${H}Z" fill="${c1}"/><path d="M0 ${y + 60} Q160 ${y + 30} 300 ${y + 58} T480 ${y + 48} L480 ${H} L0 ${H}Z" fill="${c2}"/>`;
  /* ---------- les 7 décors polar (couches : profondeur 0 = fond immobile → 1 = premier plan) ---------- */
  const guirl = (x1, y1, x2, y2, n, sag) => {
    let o = `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag} ${x2} ${y2}" stroke="#1d4a2e" stroke-width="3" fill="none"/>`;
    for (let i = 1; i < n; i++) {
      const t = i / n,
        x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * ((x1 + x2) / 2) + t * t * x2,
        y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * ((y1 + y2) / 2 + sag) + t * t * y2;
      o += `<circle class="cn-bulb b${i % 3}" cx="${x.toFixed(0)}" cy="${(y + 5).toFixed(0)}" r="4.5" fill="${['#ff4f6b', '#ffd23f', '#5cd6ff'][i % 3]}"/>`;
    }
    return o;
  };
  const facade = (x, w, h, c, seed) => {
    let o = `<rect x="${x}" y="${H * 0.72 - h}" width="${w}" height="${h}" fill="${c}"/>`;
    const cols = Math.floor(w / 34),
      rows = Math.floor(h / 60);
    for (let r = 0; r < rows; r++)
      for (let k = 0; k < cols; k++) {
        const on = Math.sin(seed * 7 + r * 3.1 + k * 1.7) > 0.15;
        o += `<rect ${on ? `class="cn-win d${(r + k) % 3}"` : ''} x="${x + 10 + k * 34}" y="${H * 0.72 - h + 16 + r * 60}" width="18" height="30" rx="2" fill="${on ? '#ffcf6a' : '#1a2033'}"/>`;
      }
    return o;
  };
  const SC = {
    pole: {
      bg: '#1a2230',
      pt: { dust: 18 },
      L: [
        [
          0,
          sv(
            `<defs><linearGradient id="cnCw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a3446"/><stop offset="1" stop-color="#3c4a5e"/></linearGradient><linearGradient id="cnCn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1226"/><stop offset="1" stop-color="#1d2a4a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#cnCw)"/><rect x="0" y="560" width="${W}" height="8" fill="#26303f"/><rect x="40" y="120" width="10" height="${H}" fill="#24303f" opacity=".4"/><rect x="250" y="150" width="190" height="230" fill="url(#cnCn)" stroke="#9aa6b8" stroke-width="8"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${270 + i * 24}" y="${H * 0.72 - 420 + (i % 3) * 30}" width="18" height="${120 - (i % 3) * 30}" fill="#141c30"/>`).join('')}${Array.from({ length: 14 }, (_, i) => `<rect class="cn-win d${i % 3}" x="${274 + ((i * 13) % 160)}" y="${270 + ((i * 29) % 90)}" width="5" height="7" fill="#ffcf6a"/>`).join('')}<g class="cn-wsnow">${Array.from({ length: 18 }, () => `<circle cx="${rnd(256, 436).toFixed(0)}" cy="${rnd(160, 370).toFixed(0)}" r="2" fill="#fff"/>`).join('')}</g><g class="cn-siren"><rect x="254" y="154" width="182" height="222" fill="#3d7bff" opacity=".0"/></g>${Array.from({ length: 11 }, (_, i) => `<rect x="254" y="${158 + i * 20}" width="182" height="7" fill="#c9d1dc" opacity=".55"/>`).join('')}<rect x="20" y="150" width="200" height="150" rx="4" fill="#b88a5a" stroke="#6a4a2a" stroke-width="6"/>${[
              [36, 166, '#f4f1ea', -4],
              [96, 172, '#fff7d8', 3],
              [150, 164, '#eaf2ff', -2],
              [52, 226, '#fff', 5],
              [120, 232, '#f4f1ea', -3]
            ]
              .map(
                ([x, y, c, r]) =>
                  `<g transform="rotate(${r} ${x + 22} ${y + 26})"><rect x="${x}" y="${y}" width="44" height="52" fill="${c}"/><rect x="${x + 5}" y="${y + 5}" width="34" height="26" fill="#8a96a8"/><circle cx="${x + 22}" cy="${y + 2}" r="3.5" fill="#d8283c"/></g>`
              )
              .join(
                ''
              )}<path d="M58 168 L118 174 L172 166 M74 228 L142 234 L118 174" stroke="#d8283c" stroke-width="1.6" fill="none"/>${guirl(10, 140, 230, 140, 9, 22)}<rect x="150" y="60" width="180" height="12" rx="6" fill="#e9f4ff" class="cn-neon"/><text x="330" y="430" font-family="Georgia" font-size="13" fill="#9aa6b8" text-anchor="middle">COMMISSARIAT · LYON 8e</text>`
          )
        ],
        [
          0.45,
          sv(
            `<rect x="356" y="430" width="110" height="250" fill="#6f7a88"/>${[0, 1, 2].map(i => `<rect x="364" y="${442 + i * 78}" width="94" height="66" fill="#7f8a98" stroke="#5a6472" stroke-width="3"/><rect x="398" y="${470 + i * 78}" width="26" height="8" rx="3" fill="#c9d1dc"/>`).join('')}<g transform="translate(372 300)"><path d="M40 0 L74 128 L6 128Z" fill="#2a8a4c"/><path d="M40 0 L62 80 L18 80Z" fill="#34a35a"/><rect x="32" y="128" width="16" height="12" fill="#c8243b"/>${Array.from({ length: 9 }, (_, i) => `<circle class="cn-bulb b${i % 3}" cx="${(40 + Math.sin(i * 2.2) * (8 + i * 3.2)).toFixed(0)}" cy="${(24 + i * 12).toFixed(0)}" r="3.6" fill="${['#ff4f6b', '#ffd23f', '#5cd6ff'][i % 3]}"/>`).join('')}<text x="40" y="6" text-anchor="middle" font-size="18">⭐</text></g><rect x="20" y="470" width="70" height="200" fill="#4a5462"/><rect x="28" y="480" width="54" height="80" fill="#5b6675"/><circle cx="55" cy="600" r="16" fill="#2a3240"/><text x="55" y="530" text-anchor="middle" font-size="22">☕</text>`
          )
        ],
        [
          0.8,
          sv(
            `<rect x="0" y="690" width="${W}" height="210" fill="#5a3a26"/><rect x="0" y="682" width="${W}" height="14" fill="#7a5236"/><g transform="translate(40 600)"><rect x="0" y="40" width="120" height="50" rx="6" fill="#2a2d33"/><rect x="10" y="14" width="100" height="32" rx="4" fill="#3a3e46"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${16 + (i % 6) * 18}" cy="${58 + Math.floor(i / 6) * 14}" r="5" fill="#d8d8d8"/>`).join('')}<rect x="20" y="-30" width="80" height="48" fill="#f7f2e4"/><path d="M28 -18 h60 M28 -8 h52 M28 2 h56" stroke="#9a9a9a" stroke-width="2"/></g><g transform="translate(220 640)">${[0, 1, 2, 3].map(i => `<rect x="${i * 3}" y="${40 - i * 12}" width="110" height="12" fill="${['#e9d29a', '#d9bf80', '#e9d29a', '#c9ad6a'][i]}" stroke="#a8874f"/>`).join('')}<rect x="30" y="-6" width="56" height="16" fill="#d8283c" transform="rotate(-8 58 2)"/><text x="58" y="6" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" transform="rotate(-8 58 2)">CLASSÉ</text></g><g transform="translate(370 610)"><rect x="0" y="50" width="70" height="16" rx="3" fill="#2a2a2a"/><rect x="6" y="30" width="58" height="22" fill="#e8e0c8"/><text x="35" y="46" text-anchor="middle" font-size="11" font-family="Georgia" fill="#3a2a1a">Lt PÉPIN</text></g><g class="cn-smoke">${[0, 1, 2].map(i => `<circle cx="348" cy="640" r="${4 + i * 2}" fill="#fff" opacity=".4" style="animation-delay:${i * 1.1}s"/>`).join('')}</g><rect x="336" y="646" width="26" height="30" rx="4" fill="#f4f4f4"/><path d="M362 652 q10 4 0 14" stroke="#f4f4f4" stroke-width="4" fill="none"/>`
          )
        ]
      ]
    },
    night: {
      bg: '#070b18',
      pt: { rain: 110 },
      L: [
        [
          0,
          sv(
            `<defs><linearGradient id="cnNs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070f"/><stop offset="1" stop-color="#18223d"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#cnNs)"/>${facade(-10, 170, 430, '#232a3c', 1)}${facade(150, 180, 500, '#1e2536', 2)}${facade(320, 180, 450, '#262d40', 3)}<rect x="318" y="${H * 0.72 - 450}" width="7" height="450" fill="#5a6070"/>${guirl(-10, 300, 500, 300, 12, 40)}`
          )
        ],
        [
          0.45,
          sv(
            `<rect x="0" y="${H * 0.72}" width="${W}" height="${H}" fill="#0e1322"/><rect x="0" y="${H * 0.72}" width="${W}" height="10" fill="#2a3246"/><g transform="translate(110 0)"><rect x="-4" y="300" width="8" height="${H * 0.72 - 300}" fill="#2a2f3a"/><path d="M-4 300 Q-4 280 20 280 L34 280" stroke="#2a2f3a" stroke-width="8" fill="none"/><path d="M24 280 L44 280 L40 292 L28 292Z" fill="#3a3f4a"/><ellipse cx="34" cy="300" rx="60" ry="26" fill="#ffd98a" opacity=".16" class="cn-win"/><path d="M28 292 L-30 ${H * 0.72} L98 ${H * 0.72} L40 292Z" fill="#ffe2a0" opacity=".08"/></g>`
          )
        ],
        [
          0.8,
          sv(
            `<rect x="0" y="700" width="${W}" height="200" fill="#0a0e1a"/>${Array.from({ length: 9 }, (_, i) => `<ellipse cx="${30 + i * 56}" cy="${760 + (i % 3) * 40}" rx="${26 + (i % 2) * 14}" ry="5" fill="#ffd98a" opacity="${(0.08 + (i % 3) * 0.04).toFixed(2)}"/>`).join('')}${Array.from({ length: 6 }, (_, i) => `<path d="M${i * 90} 780 h40" stroke="#5c6a8a" stroke-width="2" opacity=".5"/>`).join('')}`
          )
        ]
      ]
    },
    salon: {
      bg: '#3b1530',
      pt: { embers: 26 },
      L: [
        [
          0,
          sv(
            `<defs><pattern id="cnSw" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#6b2346"/><path d="M20 4 Q28 20 20 36 Q12 20 20 4Z" fill="#7c2d52"/></pattern></defs><rect width="${W}" height="${H}" fill="url(#cnSw)"/><rect x="250" y="160" width="170" height="210" rx="6" fill="#132048" stroke="#f3d8a8" stroke-width="10"/><line x1="335" y1="160" x2="335" y2="370" stroke="#f3d8a8" stroke-width="6"/><line x1="250" y1="265" x2="420" y2="265" stroke="#f3d8a8" stroke-width="6"/>${stars(0)}<g class="cn-wsnow">${Array.from({ length: 18 }, () => `<circle cx="${rnd(258, 412).toFixed(0)}" cy="${rnd(170, 360).toFixed(0)}" r="2" fill="#fff"/>`).join('')}</g><path d="M230 140 Q250 260 236 400 L210 400 Q226 260 214 140Z" fill="#b8355d"/><path d="M440 140 Q420 260 434 400 L460 400 Q444 260 456 140Z" fill="#b8355d"/><circle cx="100" cy="150" r="34" fill="#f8efe0" stroke="#7a4a20" stroke-width="6"/><line x1="100" y1="150" x2="100" y2="128" stroke="#333" stroke-width="4" class="cn-hand"/><line x1="100" y1="150" x2="116" y2="150" stroke="#333" stroke-width="3"/>`
          )
        ],
        [
          0.45,
          sv(
            `<rect x="20" y="430" width="180" height="210" fill="#7a5a4a"/><rect x="10" y="420" width="200" height="22" fill="#a07a62"/><rect x="50" y="490" width="120" height="150" rx="8" fill="#1a0a06"/><g class="cn-fire"><path d="M70 640 Q80 560 110 520 Q104 570 130 548 Q150 590 150 640Z" fill="#ff7a1a"/><path d="M84 640 Q92 590 110 566 Q110 600 126 590 Q136 615 134 640Z" fill="#ffd23f"/></g>${[40, 90, 140].map((x, i) => `<path d="M${x} 442 l18 0 l0 40 q0 14 -14 14 l-12 0 q-8 0 -8 -8 q0 -8 8 -8 l8 0Z" fill="${['#c0233a', '#2f8a4c', '#c0233a'][i]}"/><rect x="${x}" y="442" width="18" height="8" fill="#fff"/>`).join('')}<g transform="translate(330 0)"><path d="M70 300 L130 640 L10 640Z" fill="#1d6b3c"/><path d="M70 300 L112 520 L28 520Z" fill="#23804a"/><path d="M70 300 L96 420 L44 420Z" fill="#2a9456"/><text x="70" y="306" text-anchor="middle" font-size="34">⭐</text>${Array.from({ length: 16 }, (_, i) => `<circle class="cn-bulb b${i % 3}" cx="${(70 + Math.sin(i * 2.1) * (14 + i * 3.2)).toFixed(0)}" cy="${(340 + i * 18).toFixed(0)}" r="5" fill="${['#ff4f6b', '#ffd23f', '#5cd6ff'][i % 3]}"/>`).join('')}<rect x="58" y="640" width="24" height="26" fill="#5a3218"/></g>`
          )
        ],
        [
          0.8,
          sv(
            `<rect x="0" y="660" width="${W}" height="240" fill="#5a3218"/>${Array.from({ length: 8 }, (_, i) => `<line x1="${i * 64}" y1="660" x2="${i * 64 - 40}" y2="900" stroke="#4a2810" stroke-width="3"/>`).join('')}<ellipse cx="240" cy="760" rx="210" ry="60" fill="#8a2a3a"/><ellipse cx="240" cy="760" rx="170" ry="44" fill="none" stroke="#e9b35a" stroke-width="4" stroke-dasharray="10 8"/>`
          )
        ]
      ]
    },
    audit: {
      bg: '#14161c',
      pt: { dust: 22 },
      L: [
        [
          0,
          sv(
            `<rect width="${W}" height="${H}" fill="#3a3f48"/>${Array.from({ length: 12 }, (_, i) => `<rect x="0" y="${i * 80}" width="${W}" height="2" fill="#31353d"/>`).join('')}<rect x="60" y="190" width="360" height="200" fill="#0e1218" stroke="#5a606a" stroke-width="10"/><path d="M80 210 L200 210 L120 370 L80 370Z" fill="#fff" opacity=".05"/><circle cx="430" cy="120" r="5" fill="#ff2a3a" class="cn-led"/><rect x="410" y="104" width="30" height="20" rx="3" fill="#2a2e36"/><text x="240" y="420" text-anchor="middle" font-family="Georgia" font-size="12" fill="#8a909a">SALLE D'AUDITION N° 2</text>`
          )
        ],
        [
          0.45,
          sv(
            `<g class="cn-lamp"><line x1="240" y1="0" x2="240" y2="300" stroke="#1a1a1a" stroke-width="3"/><path d="M200 300 L280 300 L262 270 L218 270Z" fill="#2a2e36"/><path d="M200 300 L280 300 L420 700 L60 700Z" fill="#fff3c4" opacity=".14"/><ellipse cx="240" cy="302" rx="40" ry="6" fill="#fff6d0"/></g>`
          )
        ],
        [
          0.8,
          sv(
            `<rect x="60" y="660" width="360" height="22" fill="#8a9098"/><rect x="80" y="682" width="12" height="220" fill="#6a7078"/><rect x="388" y="682" width="12" height="220" fill="#6a7078"/><g transform="translate(170 620)"><rect x="0" y="0" width="140" height="40" fill="#e9d29a" stroke="#a8874f" transform="rotate(-4 70 20)"/><text x="70" y="26" text-anchor="middle" font-size="12" font-weight="800" fill="#7a1f33" transform="rotate(-4 70 20)">DOSSIER 24</text></g><rect x="330" y="630" width="22" height="30" rx="4" fill="#f4f4f4"/>`
          )
        ]
      ]
    },
    ecully: {
      bg: '#0a1020',
      pt: { rain: 80 },
      L: [
        [
          0,
          sv(
            `<defs><linearGradient id="cnEs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b18"/><stop offset="1" stop-color="#26335a"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#cnEs)"/>${stars(30)}<circle cx="390" cy="150" r="26" fill="#f2f0e0" opacity=".85"/>`
          )
        ],
        [
          0.45,
          sv(
            `<rect x="60" y="380" width="300" height="230" fill="#e9dcc2"/><path d="M40 390 L210 270 L380 390Z" fill="#8a3a2a"/><path d="M40 390 L210 270 L380 390 L370 396 L210 282 L50 396Z" fill="#fff"/><rect class="cn-win" x="96" y="430" width="56" height="60" fill="#ffcf6a"/><rect x="250" y="440" width="96" height="170" fill="#7f8a98"/>${Array.from({ length: 6 }, (_, i) => `<rect x="250" y="${452 + i * 26}" width="96" height="3" fill="#6a7482"/>`).join('')}<rect x="170" y="500" width="50" height="110" fill="#5a2e1a"/>${guirl(60, 384, 360, 384, 10, 18)}<path d="M400 610 L400 470 M380 500 L420 470" stroke="#3a2a20" stroke-width="6"/>`
          )
        ],
        [0.8, sv(`${ground(640, '#e8eef8', '#d2dcec')}`)]
      ]
    },
    fac: {
      bg: '#dfe8ee',
      pt: { dust: 12 },
      L: [
        [
          0,
          sv(
            `<rect width="${W}" height="${H}" fill="#e7eef2"/><rect x="0" y="0" width="${W}" height="80" fill="#cfdbe2"/>${Array.from({ length: 4 }, (_, i) => `<rect x="${30 + i * 112}" y="110" width="90" height="170" fill="#9fc3dc" stroke="#fff" stroke-width="6"/>`).join('')}<rect x="40" y="320" width="400" height="120" rx="6" fill="#2a3440"/><text x="240" y="390" text-anchor="middle" font-family="Georgia" font-size="16" fill="#e7eef2">FACULTÉ DE PHARMACIE · ROCKEFELLER</text>${guirl(10, 96, 470, 96, 12, 20)}`
          )
        ],
        [
          0.45,
          sv(
            `<rect x="0" y="560" width="${W}" height="40" fill="#f2f6f8"/><rect x="0" y="600" width="${W}" height="20" fill="#2a3440"/>${[60, 110, 160, 300, 350, 400].map((x, i) => `<rect x="${x}" y="${510 - (i % 3) * 10}" width="18" height="${50 + (i % 3) * 10}" rx="4" fill="#cfe6ff" stroke="#7aa0c0"/><rect x="${x + 2}" y="${530 - (i % 3) * 10}" width="14" height="${28 + (i % 3) * 10}" fill="${['#ff8fb8', '#7be08a', '#ffd34d'][i % 3]}" opacity=".7"/>`).join('')}<path d="M220 560 l18 -60 h14 l18 60z" fill="#e9f2f8" stroke="#7aa0c0"/>`
          )
        ],
        [
          0.8,
          sv(
            `<rect x="0" y="700" width="${W}" height="200" fill="#c7d3db"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${i * 70}" y="700" width="2" height="200" fill="#b0bec8"/>`).join('')}`
          )
        ]
      ]
    },
    pharma: {
      bg: '#1a0e0a',
      pt: { dust: 16 },
      L: [
        [0, sv(`<rect width="${W}" height="${H}" fill="#2a1a14"/>${facade(-10, 500, 620, '#3a2a22', 5)}`)],
        [
          0.45,
          sv(
            `<rect x="30" y="300" width="420" height="330" fill="#4a2414"/><path d="M20 300 L460 300 L440 260 L40 260Z" fill="#7a1f33"/>${Array.from({ length: 11 }, (_, i) => `<path d="M${40 + i * 38} 300 q19 26 38 0" fill="${i % 2 ? '#f3e2b0' : '#7a1f33'}"/>`).join('')}<text x="240" y="290" text-anchor="middle" font-family="Georgia" font-size="22" font-weight="700" fill="#f3e2b0">PHARMACIE</text><g transform="translate(410 200)"><rect x="-14" y="-40" width="28" height="80" fill="#2fd06b" class="cn-win"/><rect x="-40" y="-14" width="80" height="28" fill="#2fd06b" class="cn-win"/></g><rect x="60" y="340" width="360" height="230" fill="#ffe6b0" opacity=".9" class="cn-win"/>${[100, 190, 280, 370].map((x, i) => `<path d="M${x} ${470 - (i % 2) * 10} L${x + 26} ${560} L${x - 26} 560Z" fill="#4a2414"/><circle cx="${x}" cy="${466 - (i % 2) * 10}" r="4" fill="#d9b45f"/>`).join('')}<rect x="60" y="560" width="360" height="10" fill="#c9a66b"/><text x="240" y="610" text-anchor="middle" font-family="Georgia" font-size="13" fill="#f3e2b0">Reyrieux</text>${guirl(30, 300, 450, 300, 12, 16)}`
          )
        ],
        [
          0.8,
          sv(`<rect x="0" y="700" width="${W}" height="200" fill="#d7dde8"/><rect x="0" y="700" width="${W}" height="8" fill="#aab4c4"/>`)
        ]
      ]
    },
    disco: {
      bg: '#14061f',
      pt: { spark: 40 },
      L: [
        [
          0,
          sv(
            `<defs><radialGradient id="cnDg" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#7b3ab6"/><stop offset=".6" stop-color="#2a0f45"/><stop offset="1" stop-color="#0c0414"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#cnDg)"/>`
          )
        ],
        [
          0.1,
          sv(
            `<g class="cn-beams" style="transform-origin:240px 90px">${['#ff3df2', '#3dd5ff', '#ffe03d', '#7dff6a', '#ff7a3d', '#9b7bff'].map((c, i) => `<path d="M240 90 L${-200 + i * 170} 900 L${-120 + i * 170} 900Z" fill="${c}" opacity=".16"/>`).join('')}</g>`
          )
        ],
        [
          0.3,
          sv(
            `<line x1="240" y1="0" x2="240" y2="40" stroke="#aaa" stroke-width="3"/><defs><clipPath id="cnDb"><circle cx="240" cy="90" r="50"/></clipPath></defs><g class="cn-ball" style="transform-origin:240px 90px"><circle cx="240" cy="90" r="50" fill="#c9c9d6"/><g clip-path="url(#cnDb)">${Array.from({ length: 7 }, (_, r) => Array.from({ length: 7 }, (_, k) => `<rect x="${198 + k * 12}" y="${48 + r * 12}" width="11" height="11" fill="${(r + k) % 3 ? '#e8e8f4' : '#8a8aa0'}"/>`).join('')).join('')}</g><circle cx="240" cy="90" r="50" fill="none" stroke="#fff" stroke-width="2"/></g><circle cx="222" cy="72" r="8" fill="#fff" opacity=".9" class="cn-tw"/>`,
            '0 0 480 900',
            'xMidYMin slice'
          )
        ],
        [
          0.7,
          sv(
            `<g class="cn-floor">${Array.from({ length: 6 }, (_, r) => Array.from({ length: 8 }, (_, k) => `<path d="M${k * 60 - r * 30 + r * 0} ${650 + r * 42} l60 0 l${8 + r * 6} 42 l-60 0Z" fill="${['#ff3df2', '#3dd5ff', '#ffe03d', '#7dff6a'][(r + k) % 4]}" class="cn-tile t${(r * 3 + k) % 4}"/>`).join('')).join('')}</g>`
          )
        ]
      ]
    },
    pizza: {
      bg: '#3a1a16',
      pt: { dust: 20 },
      L: [
        [
          0,
          sv(`<defs><linearGradient id="cnPw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1a18"/><stop offset=".5" stop-color="#6e3426"/><stop offset="1" stop-color="#4a2220"/></linearGradient><linearGradient id="cnPn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#081430"/><stop offset="1" stop-color="#2a3a6a"/></linearGradient><radialGradient id="cnPl" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#ffd98a" stop-opacity=".55"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#cnPw)"/>${Array.from({ length: 14 }, (_, i) => `<rect x="${i * 36}" y="0" width="18" height="${H}" fill="#ffffff" opacity=".035"/>`).join('')}<rect x="0" y="560" width="${W}" height="16" fill="#2a1410" opacity=".6"/>
    <rect x="34" y="160" width="182" height="240" rx="6" fill="#2a1410"/><rect x="46" y="172" width="158" height="216" fill="url(#cnPn)"/><circle class="cn-tw" cx="86" cy="250" r="1.2" fill="#fff" style="animation-delay:1.8s"/><circle class="cn-tw" cx="142" cy="197" r="0.8" fill="#fff" style="animation-delay:2.5s"/><circle class="cn-tw" cx="89" cy="216" r="1.8" fill="#fff" style="animation-delay:1.4s"/><circle class="cn-tw" cx="172" cy="242" r="1.4" fill="#fff" style="animation-delay:0.5s"/><circle class="cn-tw" cx="143" cy="285" r="1.3" fill="#fff" style="animation-delay:2.2s"/><circle class="cn-tw" cx="149" cy="197" r="1.6" fill="#fff" style="animation-delay:1.8s"/><circle class="cn-tw" cx="95" cy="193" r="1.7" fill="#fff" style="animation-delay:1.4s"/><circle class="cn-tw" cx="156" cy="287" r="1.5" fill="#fff" style="animation-delay:2.8s"/><circle class="cn-tw" cx="109" cy="278" r="1.2" fill="#fff" style="animation-delay:2.8s"/><circle class="cn-tw" cx="179" cy="201" r="0.9" fill="#fff" style="animation-delay:0.7s"/><circle class="cn-tw" cx="191" cy="238" r="1.4" fill="#fff" style="animation-delay:0.9s"/><circle class="cn-tw" cx="125" cy="232" r="1.2" fill="#fff" style="animation-delay:1.8s"/><circle class="cn-tw" cx="136" cy="289" r="1.5" fill="#fff" style="animation-delay:2.8s"/><circle class="cn-tw" cx="175" cy="299" r="1.5" fill="#fff" style="animation-delay:0.5s"/><path d="M46 340 Q90 300 130 312 Q170 296 204 318 L204 388 L46 388Z" fill="#0e1830"/><g fill="#ffd98a"><rect x="150" y="292" width="26" height="14"/><rect x="147" y="284" width="5" height="22"/><rect x="174" y="284" width="5" height="22"/></g><ellipse cx="163" cy="300" rx="26" ry="14" fill="#ffd98a" opacity=".25"/><path d="M118 318 L116 286 L119 286 L118 272 L120 272 L121 286 L124 286Z" fill="#6a7aa0"/><circle class="cn-tw" cx="119.5" cy="270" r="1.6" fill="#ff4d6d"/><rect x="50" y="313" width="12" height="60" fill="#14213f"/><rect class="cn-win d0" x="53" y="346" width="3" height="4" fill="#ffd36b"/><rect x="64" y="310" width="12" height="60" fill="#14213f"/><rect class="cn-win d1" x="67" y="339" width="3" height="4" fill="#ffd36b"/><rect x="78" y="312" width="12" height="60" fill="#14213f"/><rect class="cn-win d2" x="81" y="338" width="3" height="4" fill="#ffd36b"/><rect x="92" y="322" width="12" height="60" fill="#14213f"/><rect class="cn-win d0" x="95" y="353" width="3" height="4" fill="#ffd36b"/><rect x="106" y="318" width="12" height="60" fill="#14213f"/><rect class="cn-win d1" x="109" y="336" width="3" height="4" fill="#ffd36b"/><rect x="120" y="334" width="12" height="60" fill="#14213f"/><rect class="cn-win d2" x="123" y="336" width="3" height="4" fill="#ffd36b"/><rect x="134" y="314" width="12" height="60" fill="#14213f"/><rect class="cn-win d0" x="137" y="338" width="3" height="4" fill="#ffd36b"/><rect x="148" y="332" width="12" height="60" fill="#14213f"/><rect class="cn-win d1" x="151" y="347" width="3" height="4" fill="#ffd36b"/><rect x="162" y="337" width="12" height="60" fill="#14213f"/><rect class="cn-win d2" x="165" y="354" width="3" height="4" fill="#ffd36b"/><rect x="176" y="325" width="12" height="60" fill="#14213f"/><rect class="cn-win d0" x="179" y="336" width="3" height="4" fill="#ffd36b"/><rect x="190" y="325" width="12" height="60" fill="#14213f"/><rect class="cn-win d1" x="193" y="354" width="3" height="4" fill="#ffd36b"/><rect x="122" y="172" width="6" height="216" fill="#2a1410"/><rect x="46" y="276" width="158" height="6" fill="#2a1410"/>
    <path d="M24 150 Q40 270 30 410 L64 410 Q58 280 70 150Z" fill="#8a1f28"/><path d="M226 150 Q210 270 220 410 L186 410 Q192 280 180 150Z" fill="#8a1f28"/><rect x="16" y="144" width="218" height="10" rx="5" fill="#c9a640"/>
    <g transform="translate(300 160) rotate(4)"><rect x="-6" y="-6" width="128" height="104" fill="#c9a640"/><rect width="116" height="92" fill="#fff6e6"/><rect x="8" y="8" width="100" height="62" fill="#2a3a6a"/><circle cx="58" cy="40" r="14" fill="#ffcf4a" opacity=".9"/><path d="M8 70 Q40 50 70 62 Q90 54 108 66 L108 70Z" fill="#14213f"/><text x="58" y="86" text-anchor="middle" font-family="Caveat,cursive" font-size="13" fill="#7a3b12">nous ♥</text></g>
    ${guirl(10, 110, 470, 110, 15, 46)}
    <path d="M240 0 L240 96" stroke="#1a1010" stroke-width="3"/><path d="M196 140 L284 140 L262 96 L218 96Z" fill="#1f1a18"/><path d="M196 140 L284 140" stroke="#c9a640" stroke-width="4"/><path d="M196 140 L284 140 L470 620 L10 620Z" fill="url(#cnPl)" opacity=".7"/><ellipse cx="240" cy="142" rx="22" ry="7" fill="#fff3c0" class="cn-win"/>`)
        ],
        [
          0.45,
          sv(`${pine(70, 660, 0.9, '#1b4a3a')}${Array.from({ length: 8 }, (_, i) => `<circle class="cn-bulb b${i % 3}" cx="${48 + (i % 4) * 14}" cy="${560 + i * 11}" r="4" fill="${['#ff4f6b', '#ffd23f', '#5cd6ff'][i % 3]}"/>`).join('')}<path d="M70 560 l5 -14 l5 14 l-14 -8 h18z" fill="#ffd23f"/>
    <rect x="330" y="470" width="160" height="22" rx="3" fill="#a8743c"/><rect x="336" y="492" width="150" height="160" fill="#5a3424"/><rect x="346" y="505" width="62" height="130" rx="3" fill="#4a2a1c"/><rect x="414" y="505" width="62" height="130" rx="3" fill="#4a2a1c"/><circle cx="400" cy="570" r="3" fill="#c9a640"/><circle cx="420" cy="570" r="3" fill="#c9a640"/>
    ${[0, 1, 2].map(i => `<g transform="translate(${350 + i * 3} ${448 - i * 16})"><rect width="84" height="16" rx="2" fill="#d6a868"/><rect y="0" width="84" height="4" fill="#e8c48a"/><circle cx="42" cy="9" r="5" fill="#c62f3a"/></g>`).join('')}
    <path d="M452 470 L452 418 Q452 404 460 400 L460 384 L468 384 L468 400 Q476 404 476 418 L476 470Z" fill="#1f4a2e"/><rect x="455" y="430" width="18" height="18" fill="#f3e2b0"/>`)
        ],
        [
          0.8,
          sv(`<path d="M90 610 L390 610 L470 900 L10 900Z" fill="#8a1f28"/><path d="M90 610 L120 610 L108 637 L74 637Z" fill="#fbf3e6"/><path d="M120 610 L150 610 L141 637 L108 637Z" fill="#c62f3a"/><path d="M150 610 L180 610 L174 637 L141 637Z" fill="#fbf3e6"/><path d="M180 610 L210 610 L207 637 L174 637Z" fill="#c62f3a"/><path d="M210 610 L240 610 L240 637 L207 637Z" fill="#fbf3e6"/><path d="M240 610 L270 610 L273 637 L240 637Z" fill="#c62f3a"/><path d="M270 610 L300 610 L306 637 L273 637Z" fill="#fbf3e6"/><path d="M300 610 L330 610 L339 637 L306 637Z" fill="#c62f3a"/><path d="M330 610 L360 610 L372 637 L339 637Z" fill="#fbf3e6"/><path d="M360 610 L390 610 L406 637 L372 637Z" fill="#c62f3a"/><path d="M74 637 L108 637 L92 669 L55 669Z" fill="#c62f3a"/><path d="M108 637 L141 637 L129 669 L92 669Z" fill="#fbf3e6"/><path d="M141 637 L174 637 L166 669 L129 669Z" fill="#c62f3a"/><path d="M174 637 L207 637 L203 669 L166 669Z" fill="#fbf3e6"/><path d="M207 637 L240 637 L240 669 L203 669Z" fill="#c62f3a"/><path d="M240 637 L273 637 L277 669 L240 669Z" fill="#fbf3e6"/><path d="M273 637 L306 637 L314 669 L277 669Z" fill="#c62f3a"/><path d="M306 637 L339 637 L351 669 L314 669Z" fill="#fbf3e6"/><path d="M339 637 L372 637 L388 669 L351 669Z" fill="#c62f3a"/><path d="M372 637 L406 637 L425 669 L388 669Z" fill="#fbf3e6"/><path d="M55 669 L92 669 L76 704 L35 704Z" fill="#fbf3e6"/><path d="M92 669 L129 669 L117 704 L76 704Z" fill="#c62f3a"/><path d="M129 669 L166 669 L158 704 L117 704Z" fill="#fbf3e6"/><path d="M166 669 L203 669 L199 704 L158 704Z" fill="#c62f3a"/><path d="M203 669 L240 669 L240 704 L199 704Z" fill="#fbf3e6"/><path d="M240 669 L277 669 L281 704 L240 704Z" fill="#c62f3a"/><path d="M277 669 L314 669 L322 704 L281 704Z" fill="#fbf3e6"/><path d="M314 669 L351 669 L363 704 L322 704Z" fill="#c62f3a"/><path d="M351 669 L388 669 L404 704 L363 704Z" fill="#fbf3e6"/><path d="M388 669 L425 669 L445 704 L404 704Z" fill="#c62f3a"/><path d="M35 704 L76 704 L59 741 L13 741Z" fill="#c62f3a"/><path d="M76 704 L117 704 L104 741 L59 741Z" fill="#fbf3e6"/><path d="M117 704 L158 704 L149 741 L104 741Z" fill="#c62f3a"/><path d="M158 704 L199 704 L195 741 L149 741Z" fill="#fbf3e6"/><path d="M199 704 L240 704 L240 741 L195 741Z" fill="#c62f3a"/><path d="M240 704 L281 704 L285 741 L240 741Z" fill="#fbf3e6"/><path d="M281 704 L322 704 L331 741 L285 741Z" fill="#c62f3a"/><path d="M322 704 L363 704 L376 741 L331 741Z" fill="#fbf3e6"/><path d="M363 704 L404 704 L421 741 L376 741Z" fill="#c62f3a"/><path d="M404 704 L445 704 L467 741 L421 741Z" fill="#fbf3e6"/><path d="M13 741 L59 741 L41 779 L-9 779Z" fill="#fbf3e6"/><path d="M59 741 L104 741 L91 779 L41 779Z" fill="#c62f3a"/><path d="M104 741 L149 741 L140 779 L91 779Z" fill="#fbf3e6"/><path d="M149 741 L195 741 L190 779 L140 779Z" fill="#c62f3a"/><path d="M195 741 L240 741 L240 779 L190 779Z" fill="#fbf3e6"/><path d="M240 741 L285 741 L290 779 L240 779Z" fill="#c62f3a"/><path d="M285 741 L331 741 L340 779 L290 779Z" fill="#fbf3e6"/><path d="M331 741 L376 741 L389 779 L340 779Z" fill="#c62f3a"/><path d="M376 741 L421 741 L439 779 L389 779Z" fill="#fbf3e6"/><path d="M421 741 L467 741 L489 779 L439 779Z" fill="#c62f3a"/><path d="M-9 779 L41 779 L22 818 L-32 818Z" fill="#c62f3a"/><path d="M41 779 L91 779 L77 818 L22 818Z" fill="#fbf3e6"/><path d="M91 779 L140 779 L131 818 L77 818Z" fill="#c62f3a"/><path d="M140 779 L190 779 L186 818 L131 818Z" fill="#fbf3e6"/><path d="M190 779 L240 779 L240 818 L186 818Z" fill="#c62f3a"/><path d="M240 779 L290 779 L294 818 L240 818Z" fill="#fbf3e6"/><path d="M290 779 L340 779 L349 818 L294 818Z" fill="#c62f3a"/><path d="M340 779 L389 779 L403 818 L349 818Z" fill="#fbf3e6"/><path d="M389 779 L439 779 L458 818 L403 818Z" fill="#c62f3a"/><path d="M439 779 L489 779 L512 818 L458 818Z" fill="#fbf3e6"/><path d="M-32 818 L22 818 L3 859 L-56 859Z" fill="#fbf3e6"/><path d="M22 818 L77 818 L63 859 L3 859Z" fill="#c62f3a"/><path d="M77 818 L131 818 L122 859 L63 859Z" fill="#fbf3e6"/><path d="M131 818 L186 818 L181 859 L122 859Z" fill="#c62f3a"/><path d="M186 818 L240 818 L240 859 L181 859Z" fill="#fbf3e6"/><path d="M240 818 L294 818 L299 859 L240 859Z" fill="#c62f3a"/><path d="M294 818 L349 818 L358 859 L299 859Z" fill="#fbf3e6"/><path d="M349 818 L403 818 L417 859 L358 859Z" fill="#c62f3a"/><path d="M403 818 L458 818 L477 859 L417 859Z" fill="#fbf3e6"/><path d="M458 818 L512 818 L536 859 L477 859Z" fill="#c62f3a"/><path d="M-56 859 L3 859 L-16 900 L-80 900Z" fill="#c62f3a"/><path d="M3 859 L63 859 L48 900 L-16 900Z" fill="#fbf3e6"/><path d="M63 859 L122 859 L112 900 L48 900Z" fill="#c62f3a"/><path d="M122 859 L181 859 L176 900 L112 900Z" fill="#fbf3e6"/><path d="M181 859 L240 859 L240 900 L176 900Z" fill="#c62f3a"/><path d="M240 859 L299 859 L304 900 L240 900Z" fill="#fbf3e6"/><path d="M299 859 L358 859 L368 900 L304 900Z" fill="#c62f3a"/><path d="M358 859 L417 859 L432 900 L368 900Z" fill="#fbf3e6"/><path d="M417 859 L477 859 L496 900 L432 900Z" fill="#c62f3a"/><path d="M477 859 L536 859 L560 900 L496 900Z" fill="#fbf3e6"/><path d="M90 610 L390 610" stroke="#fff" stroke-width="3" opacity=".4"/>
    <ellipse cx="150" cy="700" rx="56" ry="16" fill="#fff" opacity=".95"/><ellipse cx="150" cy="700" rx="40" ry="10" fill="#f3ece0"/><ellipse cx="330" cy="700" rx="56" ry="16" fill="#fff" opacity=".95"/><ellipse cx="330" cy="700" rx="40" ry="10" fill="#f3ece0"/>
    <g transform="translate(240 690)"><ellipse cx="0" cy="6" rx="22" ry="6" fill="#c9a640"/><rect x="-7" y="-46" width="14" height="50" rx="3" fill="#fffaf0"/><ellipse class="cn-win" cx="0" cy="-56" rx="6" ry="11" fill="#ffcf4a"/><ellipse cx="0" cy="-54" rx="3" ry="6" fill="#fff6d0"/><circle cx="0" cy="-54" r="34" fill="#ffcf4a" opacity=".16"/></g>
    ${[190, 290].map(x => `<g transform="translate(${x} 662)"><path d="M-12 -30 Q-14 -6 0 -2 Q14 -6 12 -30Z" fill="#ffffff55" stroke="#fff" stroke-width="1.5"/><path d="M-11 -16 Q0 -8 11 -16 Q12 -6 0 -3 Q-12 -6 -11 -16Z" fill="#8a1f3a"/><rect x="-1" y="-2" width="2" height="18" fill="#fff"/><ellipse cx="0" cy="16" rx="9" ry="3" fill="#fff"/></g>`).join('')}`)
        ]
      ]
    }
  };

  SC.lab = SC.pole;
  /* ---------- personnages dessinés ---------- */
  const mouth = (x, y, w) =>
    `<path class="m0" d="M${x - w} ${y} Q${x} ${y + w * 0.9} ${x + w} ${y}" fill="none" stroke="#5a1a1a" stroke-width="3" stroke-linecap="round"/><ellipse class="m1" cx="${x}" cy="${y + w * 0.35}" rx="${w * 0.7}" ry="${w * 0.55}" fill="#5a1a1a"/>`;
  const eyes = (x1, x2, y, r, col) =>
    `<g class="cn-eye">${[x1, x2].map(x => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.2}" fill="${col || '#1a1a2a'}"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.4}" r="${r * 0.38}" fill="#fff"/>`).join('')}</g>`;
  const ELF = sv(
    `<g class="cn-body"><path d="M40 150 l-2 9 h18 l0 -9Z M64 150 l0 9 h18 l-2 -9Z" fill="#17171d"/><rect x="44" y="126" width="12" height="26" fill="#2b2f3d"/><rect x="64" y="126" width="12" height="26" fill="#2b2f3d"/><path d="M28 136 L35 96 Q60 87 85 96 L92 136Z" fill="#c9a66b"/><path d="M60 98 L50 136 M60 98 L70 136" stroke="#a8874f" stroke-width="2"/><path d="M53 95 L60 113 L67 95Z" fill="#f2f2f2"/><path d="M58.5 97 L60 120 L61.5 97Z" fill="#7a1f33"/><rect x="30" y="116" width="60" height="5" fill="#a8874f"/><rect x="69" y="103" width="10" height="8" rx="1.5" fill="#ffd23f" stroke="#a8874f"/><g class="cn-arm"><path d="M83 100 Q99 104 99 88" stroke="#c9a66b" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="99" cy="86" r="6" fill="#f0c7a4"/><rect x="92" y="70" width="13" height="13" rx="2" fill="#fff" stroke="#5a5a5a"/><path d="M105 73 q6 3 0 7" stroke="#5a5a5a" stroke-width="1.6" fill="none"/><path d="M96 66 q2 -5 0 -9 M101 66 q2 -5 0 -9" stroke="#fff" stroke-width="1.4" fill="none" opacity=".7"/></g><path d="M37 100 Q23 112 27 124" stroke="#c9a66b" stroke-width="9" fill="none" stroke-linecap="round"/><circle cx="28" cy="126" r="6" fill="#f0c7a4"/>
  <rect x="55" y="84" width="10" height="11" fill="#e2b18e"/><ellipse cx="38" cy="68" rx="4" ry="6" fill="#e2b18e"/><ellipse cx="82" cy="68" rx="4" ry="6" fill="#e2b18e"/><ellipse cx="60" cy="66" rx="22" ry="24" fill="#f0c7a4"/><path d="M38 62 Q37 40 60 39 Q83 40 82 62 Q79 49 60 49 Q42 49 38 62Z" fill="#6e6e72"/><path d="M45 57 h11 M64 57 h11" stroke="#4a4a4e" stroke-width="3.2" stroke-linecap="round"/>${eyes(51, 69, 64, 3.2)}<path d="M60 66 q5 8 -2 9" stroke="#c99a7a" stroke-width="2" fill="none"/><path d="M46 78 Q53 72 60 76 Q67 72 74 78 Q67 83 60 80 Q53 83 46 78Z" fill="#59595d"/>${mouth(60, 85, 5)}</g>`,
    '0 0 120 160',
    'xMidYMax meet'
  );
  const BOSS = {
    '🧥': [
      'La silhouette',
      sv(
        `<g class="cn-body"><path d="M26 178 Q26 112 70 104 Q114 112 114 178Z" fill="#1c1f2a"/><path d="M44 52 Q44 20 70 18 Q96 20 96 52 L100 104 Q70 118 40 104Z" fill="#232735"/><ellipse cx="70" cy="66" rx="18" ry="24" fill="#07080c"/><path d="M54 100 L50 130 M86 100 L90 130" stroke="#2c3142" stroke-width="2" fill="none"/><path d="M40 150 h28 v14 h-28Z M72 150 h28 v14 h-28Z" fill="#161922"/><path d="M48 30 Q60 26 66 40" stroke="#3a4156" stroke-width="2" fill="none" opacity=".7"/></g>`,
        '0 0 140 180',
        'xMidYMax meet'
      )
    ]
  };
  /* l'ombre : silhouette de fumée animée (SVG autonome pour une <img>) */
  const SHADOW =
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 253"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2f40"/><stop offset="1" stop-color="#0b0d14"/></linearGradient><linearGradient id="w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#9fc4ff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g><animateTransform attributeName="transform" type="rotate" values="-1.2 110 253;1.2 110 253;-1.2 110 253" dur="5s" repeatCount="indefinite"/><path d="M30 253 Q28 150 110 132 Q192 150 190 253Z" fill="url(#g)"/><path d="M64 70 Q62 18 110 14 Q158 18 156 70 L166 140 Q110 162 54 140Z" fill="url(#g)"/><ellipse cx="110" cy="92" rx="30" ry="40" fill="#030407"/><path d="M80 140 L74 200 M140 140 L146 200" stroke="#3a4156" stroke-width="3" fill="none"/><path d="M60 40 Q90 20 120 30" stroke="url(#w)" stroke-width="10" fill="none"/><path d="M40 170 Q110 150 180 170" stroke="url(#w)" stroke-width="14" fill="none"/></g></svg>`
    );
  /* ---------- sons synthétisés ---------- */
  const ac = () => {
    try {
      if (S.sound === false) return null;
      const A = window.__voxAC || (window.__voxAC = new (window.AudioContext || window.webkitAudioContext)());
      if (A.state == 'suspended') A.resume();
      return A;
    } catch (_) {
      return null;
    }
  };
  let NB = null;
  const noise = A => {
    if (NB) return NB;
    const n = A.sampleRate * 1.5,
      b = A.createBuffer(1, n, A.sampleRate),
      d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return (NB = b);
  };
  const nz = (A, t, dur, f1, f2, q, vol, type) => {
    const s = A.createBufferSource(),
      f = A.createBiquadFilter(),
      g = A.createGain();
    s.buffer = noise(A);
    f.type = type || 'bandpass';
    f.Q.value = q || 1;
    f.frequency.setValueAtTime(f1, t);
    if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(A.destination);
    s.start(t, rnd(0, 1));
    s.stop(t + dur + 0.05);
  };
  const tn = (A, t, f, dur, type, vol, f2) => {
    const o = A.createOscillator(),
      g = A.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.08, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(A.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  };
  const SND = {
    whoosh: (A, t) => nz(A, t, 0.45, 300, 2400, 0.8, 0.18),
    swish: (A, t) => nz(A, t, 0.25, 1200, 4000, 1.2, 0.06),
    thud: (A, t) => {
      tn(A, t, 130, 0.3, 'sine', 0.25, 45);
      nz(A, t, 0.12, 200, 80, 1, 0.12, 'lowpass');
    },
    crack: (A, t) => {
      nz(A, t, 0.18, 2500, 600, 0.6, 0.5, 'highpass');
      tn(A, t, 90, 0.35, 'sine', 0.3, 40);
      nz(A, t + 0.08, 0.3, 900, 300, 0.8, 0.25);
    },
    pop: (A, t) => tn(A, t, 520, 0.12, 'sine', 0.12, 1200),
    ding: (A, t) => {
      [880, 1320, 1760].forEach((f, i) => tn(A, t + i * 0.06, f, 0.9, 'triangle', 0.07));
      nz(A, t, 0.6, 6000, 9000, 2, 0.03);
    },
    magic: (A, t) => {
      [0, 4, 7, 12, 16, 19].forEach((s, i) => tn(A, t + i * 0.05, 660 * Math.pow(2, s / 12), 0.5, 'sine', 0.05));
    },
    stamp: (A, t) => {
      tn(A, t, 180, 0.18, 'square', 0.08, 60);
      nz(A, t, 0.08, 1500, 400, 1, 0.2);
    },
    drone: (A, t) => {
      tn(A, t, 62, 1.6, 'sawtooth', 0.05, 48);
      tn(A, t, 93, 1.6, 'sine', 0.06, 70);
      nz(A, t, 1.2, 300, 120, 4, 0.05);
    },
    steps: (A, t) => {
      for (let i = 0; i < 5; i++) nz(A, t + i * 0.16, 0.07, 500, 300, 2, 0.18, 'lowpass');
    },
    engine: (A, t) => {
      tn(A, t, 55, 1.1, 'sawtooth', 0.06, 90);
      nz(A, t, 1, 200, 500, 3, 0.06);
      for (let i = 0; i < 2; i++) {
        tn(A, t + 1 + i * 0.28, 70, 0.12, 'square', 0.08, 40);
      }
    },
    splash: (A, t) => {
      nz(A, t, 0.7, 1800, 300, 0.6, 0.35, 'lowpass');
      tn(A, t, 300, 0.25, 'sine', 0.1, 90);
    },
    sneeze: (A, t) => {
      nz(A, t, 0.12, 1200, 1800, 3, 0.08);
      nz(A, t + 0.35, 0.35, 3000, 1200, 0.7, 0.3);
    },
    click: (A, t) => tn(A, t, 1800, 0.04, 'square', 0.08),
    paper: (A, t) => {
      for (let i = 0; i < 10; i++) nz(A, t + i * 0.05, 0.05, 3000, 2000, 2, 0.06);
    },
    door: (A, t) => {
      tn(A, t, 220, 0.5, 'sawtooth', 0.03, 320);
      nz(A, t, 0.4, 600, 1400, 2, 0.06);
    },
    fanfare: (A, t) => {
      [
        [0, 523],
        [0.12, 659],
        [0.24, 784],
        [0.36, 1047],
        [0.6, 1047]
      ].forEach(([d, f]) => {
        tn(A, t + d, f, d < 0.5 ? 0.18 : 0.7, 'square', 0.045);
        tn(A, t + d, f * 1.5, d < 0.5 ? 0.18 : 0.7, 'triangle', 0.03);
      });
    },
    sad: (A, t) => {
      [
        [0, 392],
        [0.3, 370],
        [0.6, 349],
        [0.9, 330]
      ].forEach(([d, f]) => tn(A, t + d, f, d < 0.8 ? 0.32 : 0.9, 'sawtooth', 0.035, d < 0.8 ? f : f * 0.92));
    }
  };
  const sfx = (n, d) => {
    const A = ac();
    if (!A || !SND[n]) return;
    try {
      SND[n](A, A.currentTime + (d || 0));
    } catch (_) {}
  };
  /* voix « charabia » : une syllabe chantée par lettre (voyelles imitées par des formants) */
  const FOR = { a: [800, 1250], e: [450, 1900], i: [300, 2300], o: [480, 850], u: [320, 1650] },
    VW = 'aeiou';
  const vowelOf = ch => {
    const c = ch.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    if (!/[a-z]/.test(c)) return null;
    if (VW.includes(c)) return c;
    if (c == 'y') return 'i';
    return VW[(c.charCodeAt(0) * 7) % 5];
  };
  const VOICE = { c: [330, 1.12], v: [150, 0.95], e: [440, 1.2], b: [125, 0.9], shadow: [105, 0.85], x: [210, 1] };
  const BOSSV = { '🧥': 95 };
  let lastV = -1;
  const blip = (w, j, ch, c) => {
    if (w == 'n' || !ch) return;
    const v = vowelOf(ch);
    if (!v) return;
    const A = ac();
    if (!A) return;
    const now = A.currentTime;
    if (now - lastV < 0.055) return;
    lastV = now;
    try {
      let base = VOICE[w] || VOICE.b,
        f0 = base[0];
      if (w == 'v' && c && c.querySelector('.vb-cv.st-shadow')) f0 = VOICE.shadow[0];
      if (w == 'b' && c && BOSSV[c.__boss]) f0 = BOSSV[c.__boss];
      if (w == 'b' && c && c.__person)
        f0 = { emma: 345, noemie: 385, edgar: 145, nora: 360, erika: 375, eya: 350, sandrine: 310, parents: 330 }[c.__person] || f0;
      const code = ch.charCodeAt(0),
        f = f0 * (1 + (((code * 13) % 7) - 3) * 0.035),
        [F1, F2] = FOR[v],
        k = base[1];
      const o = A.createOscillator(),
        g = A.createGain(),
        b1 = A.createBiquadFilter(),
        b2 = A.createBiquadFilter(),
        mx = A.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f * 1.08, now);
      o.frequency.exponentialRampToValueAtTime(f * 0.94, now + 0.07);
      b1.type = b2.type = 'bandpass';
      b1.frequency.value = F1 * k;
      b2.frequency.value = F2 * k;
      b1.Q.value = 5;
      b2.Q.value = 7;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.55, now + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
      mx.gain.value = 0.6;
      o.connect(b1);
      o.connect(b2);
      b1.connect(g);
      b2.connect(g);
      g.connect(mx).connect(A.destination);
      o.start(now);
      o.stop(now + 0.09);
      if (/[sfzcj]/i.test(ch)) nz(A, now, 0.04, 4500, 6000, 2, 0.05);
    } catch (_) {}
  };
  /* ---------- particules ---------- */
  function parts(cv, cfg) {
    const x = cv.getContext('2d');
    let P = [],
      run = true;
    const R = () => {
      cv.width = cv.clientWidth;
      cv.height = cv.clientHeight;
    };
    R();
    const add = (k, n) => {
      for (let i = 0; i < n; i++) P.push({ k, x: Math.random(), y: Math.random(), z: rnd(0.4, 1), s: rnd(0, 6.28), v: rnd(0.5, 1) });
    };
    if (cfg.snow) add('snow', cfg.snow);
    if (cfg.embers) add('emb', cfg.embers);
    if (cfg.spark) add('spk', cfg.spark);
    if (cfg.hearts) add('hrt', cfg.hearts);
    if (cfg.dust) add('dst', cfg.dust);
    if (cfg.rain) add('rn', cfg.rain);
    const red = matchMedia('(prefers-reduced-motion:reduce)').matches;
    (function lp() {
      if (!run || !cv.isConnected) return;
      if (!cv.offsetParent) {
        setTimeout(() => requestAnimationFrame(lp), 400);
        return;
      }
      const w = cv.width,
        h = cv.height,
        sc = w / 400;
      x.clearRect(0, 0, w, h);
      const t = performance.now() / 1000;
      for (const p of P) {
        const z = p.z;
        if (p.k == 'snow') {
          p.y += 0.0012 * z * p.v;
          p.x += Math.sin(t * 0.8 + p.s) * 0.0006;
          if (p.y > 1.02) {
            p.y = -0.02;
            p.x = Math.random();
          }
          x.globalAlpha = 0.5 + z * 0.5;
          x.fillStyle = '#fff';
          x.beginPath();
          x.arc(p.x * w, p.y * h, (1 + z * 2.6) * sc, 0, 7);
          x.fill();
        } else if (p.k == 'emb') {
          p.y -= 0.0016 * p.v;
          p.x += Math.sin(t * 2 + p.s) * 0.0008;
          if (p.y < -0.02) {
            p.y = 1.02;
            p.x = rnd(0.05, 0.45);
          }
          x.globalAlpha = Math.max(0, Math.min(1, p.y)) * 0.9;
          x.fillStyle = p.s > 3 ? '#ffb03a' : '#ff6a1a';
          x.beginPath();
          x.arc(p.x * w, p.y * h, (1 + z * 2) * sc, 0, 7);
          x.fill();
        } else if (p.k == 'spk') {
          const a = (Math.sin(t * 3 + p.s * 5) + 1) / 2;
          x.globalAlpha = a;
          x.fillStyle = ['#ff3df2', '#3dd5ff', '#ffe03d', '#fff'][Math.floor(p.s) % 4];
          const r = (1 + z * 3) * sc;
          x.fillRect(p.x * w - r / 2, p.y * h * 0.75 - r / 2, r, r);
        } else if (p.k == 'hrt') {
          p.y -= 0.0011 * p.v;
          if (p.y < -0.05) {
            p.y = 1.05;
            p.x = Math.random();
          }
          x.globalAlpha = 0.75;
          x.font = `${(12 + z * 16) * sc}px serif`;
          x.fillText(p.s > 3 ? '💕' : '💗', p.x * w + Math.sin(t + p.s) * 10, p.y * h);
        } else if (p.k == 'rn') {
          p.y += 0.012 * p.v * (0.6 + z * 0.6);
          p.x -= 0.0018 * p.v;
          if (p.y > 1.02) {
            p.y = -0.04;
            p.x = Math.random() * 1.1;
          }
          x.globalAlpha = 0.25 + z * 0.45;
          x.strokeStyle = '#bcd3ff';
          x.lineWidth = (0.6 + z) * sc;
          x.beginPath();
          x.moveTo(p.x * w, p.y * h);
          x.lineTo(p.x * w - 3 * sc, p.y * h + (8 + z * 12) * sc);
          x.stroke();
        } else if (p.k == 'dst') {
          p.y += Math.sin(t * 0.5 + p.s) * 0.0004;
          p.x += 0.0003 * p.v;
          if (p.x > 1.02) p.x = -0.02;
          x.globalAlpha = 0.35 + 0.3 * Math.sin(t + p.s);
          x.fillStyle = '#fff6d8';
          x.beginPath();
          x.arc(p.x * w, p.y * h, (1 + z * 1.6) * sc, 0, 7);
          x.fill();
        }
      }
      x.globalAlpha = 1;
      if (!red) requestAnimationFrame(lp);
    })();
    return {
      stop() {
        run = false;
      }
    };
  }
  /* ---------- émotions sur les visages ---------- */
  const EMO = [
    ['angry', /😤|😠|💢|!!!/],
    ['shock', /😱|😳|\?!|!\?|CRAC|😨/],
    ['love', /💘|💖|❤|💕|t’aime/i],
    ['sad', /🥺|😢|😭|désolé/i],
    ['think', /🤔|Hmm|…\?/],
    ['happy', /😂|😁|😄|😇|😏|😋|😎|J’adore|🎉|😈/]
  ];
  const MARK = { angry: '💢', shock: '❗', love: '💗', sad: '💧', think: '❓', happy: '✨' };
  function mark(c, el, k) {
    if (!el || !el.isConnected) return;
    const a = el.getBoundingClientRect(),
      b = c.getBoundingClientRect();
    if (!a.width) return;
    const m = document.createElement('span');
    m.className = 'cn-mark ' + k;
    m.textContent = MARK[k];
    m.style.left = a.left - b.left + a.width * 0.82 + 'px';
    m.style.top = a.top - b.top + a.height * 0.06 + 'px';
    c.appendChild(m);
    setTimeout(() => m.remove(), 1600);
    if (k == 'love') {
      for (let i = 0; i < 5; i++) {
        const h = document.createElement('span');
        h.className = 'cn-mark rise';
        h.textContent = '💕';
        h.style.left = a.left - b.left + a.width * rnd(0.2, 0.8) + 'px';
        h.style.top = a.top - b.top + a.height * 0.3 + 'px';
        h.style.animationDelay = i * 0.15 + 's';
        c.appendChild(h);
        setTimeout(() => h.remove(), 2200);
      }
    }
  }
  function emote(c, el, t) {
    if (!el) return;
    const e = EMO.find(([k, r]) => r.test(t));
    ['angry', 'shock', 'love', 'sad', 'think', 'happy'].forEach(k => el.classList.remove('em-' + k));
    if (!e) return;
    void el.offsetWidth;
    el.classList.add('em-' + e[0]);
    mark(c, el, e[0]);
    setTimeout(() => el.classList.remove('em-' + e[0]), 1500);
  }
  /* ---------- mise en scène ---------- */
  const NAMES = { c: 'Célestine', e: 'Pépin' };
  function build(c, sc) {
    const S0 = SC[sc] || SC.pole;
    let bg = c.querySelector('.cn-bg');
    if (bg) {
      bg.__pt && bg.__pt.stop();
      bg.remove();
    }
    bg = document.createElement('div');
    bg.className = 'cn-bg';
    bg.style.background = S0.bg;
    bg.innerHTML =
      S0.L.map(([d, s]) => `<div class="cn-l" style="--d:${d}">${s}</div>`).join('') +
      '<canvas class="cn-pt"></canvas><div class="cn-spot"></div><div class="cn-vg"></div>';
    c.insertBefore(bg, c.firstChild);
    requestAnimationFrame(() => {
      try {
        bg.__pt = parts(bg.querySelector('.cn-pt'), S0.pt || {});
      } catch (_) {}
    });
    c.dataset.cn = sc;
  }
  function stage(c, sc, opt) {
    opt = opt || {};
    c.classList.add('cine');
    build(c, sc);
    const top = document.createElement('div');
    top.className = 'cn-lb t';
    const bot = document.createElement('div');
    bot.className = 'cn-lb b';
    const nm = document.createElement('div');
    nm.className = 'cn-name';
    const nx = document.createElement('div');
    nx.className = 'cn-next';
    nx.textContent = '▼';
    c.appendChild(top);
    c.appendChild(bot);
    c.appendChild(nm);
    c.appendChild(nx);
    const fd = document.createElement('div');
    fd.className = 'cn-fade';
    c.appendChild(fd);
    setTimeout(() => fd.remove(), 900);
    c.__boss = opt.boss;
    c.__person = opt.person;
    new MutationObserver(() => {
      const m = c.className.match(/\bsc-(\w+)/);
      if (m && m[1] != c.dataset.cn) {
        sfx('swish');
        c.classList.remove('cn-xf');
        void c.offsetWidth;
        c.classList.add('cn-xf');
        build(c, m[1]);
      }
    }).observe(c, { attributes: true, attributeFilter: ['class'] });
    sfx('swish');
  }
  function line(c, w, t) {
    const nm = c.querySelector('.cn-name');
    if (!nm) return;
    const CV = c.querySelector('.vb-cv');
    let n =
      w == 'n'
        ? ''
        : w == 'b'
          ? c.__person
            ? (SUSP.find(z => z.id == c.__person) || {}).n || ''
            : (BOSS[c.__boss] || [''])[0]
          : w == 'v'
            ? CV && CV.classList.contains('st-shadow')
              ? 'La silhouette'
              : 'Valentin'
            : (w == 'e' && c.classList.contains('sick') ? 'Gérald 🤧' : NAMES[w]) || '';
    nm.textContent = n;
    nm.className = 'cn-name ' + (n ? 'on ' : '') + 'w' + w;
    c.dataset.w = w;
    const el = { c: '.vb-cc', v: '.vb-cv', e: '.st-elf', b: '.st-boss' }[w];
    const E = el && c.querySelector(el);
    let cam = 0;
    if (E && E.isConnected) {
      const a = E.getBoundingClientRect(),
        b = c.getBoundingClientRect();
      if (b.width) {
        const cx = (a.left + a.width / 2 - b.left) / b.width;
        cam = Math.max(-1, Math.min(1, (0.5 - cx) * 2.2));
        c.style.setProperty('--sx', (cx * 100).toFixed(0) + '%');
        c.style.setProperty('--sy', (((a.top + a.height / 2 - b.top) / b.height) * 100).toFixed(0) + '%');
      }
    }
    c.style.setProperty('--cam', cam.toFixed(2));
    c.classList.toggle('cn-focus', !!E);
    if (E) emote(c, E, t);
    if (/CRAC/.test(t)) sfx('crack');
    if (/PLOUF/.test(t)) sfx('splash');
    if (/ATCHOUM/.test(t)) sfx('sneeze');
    if (/CLIC|clic/.test(t)) sfx('click');
    if (/calé|cale deux/.test(t)) sfx('engine');
    if (/broyeur/.test(t) && /passé|passe/.test(t)) sfx('paper');
  }
  function fx(c, f) {
    if (!f) return;
    if (Array.isArray(f)) return f.forEach(g => fx(c, g));
    if (typeof f != 'string') return;
    const old = () =>
      c.querySelectorAll('.st-clue,.st-glow').forEach(e => {
        e.classList.add('cn-gone');
        setTimeout(() => e.remove(), 400);
      });
    if (f == 'shadow') {
      sfx('drone');
      sfx('whoosh', 0.2);
    } else if (f == 'peek' || f == 'vout') sfx('whoosh');
    else if (f == 'shake') sfx('thud');
    else if (f == 'clue') {
      old();
      sfx('ding');
      c.classList.remove('cn-flash');
      void c.offsetWidth;
      c.classList.add('cn-flash');
    } else if (f == 'glow') {
      old();
      sfx('magic');
    } else if (f == 'crumbs') [0, 0.15, 0.3, 0.45].forEach(d => sfx('pop', d));
    else if (f == 'unshadow') {
      sfx('magic');
      sfx('thud', 0.1);
    } else if (f.startsWith('pop:')) {
      old();
      sfx('pop');
    } else if (f.startsWith('sus:') || f.startsWith('out:')) {
      old();
      sfx('stamp', 0.25);
    } else if (f.startsWith('run:')) {
      /🚗|🚋|✈️|🛒/.test(f) ? sfx('engine') : (sfx('steps'), sfx('whoosh', 0.3));
    } else if (f == 'cin' || f == 'ein' || f == 'bin' || f == 'vin') sfx('swish');
  }
  const elf = () => `<i class="cn-char cn-elf">${ELF}</i>`;
  const boss = e => (BOSS[e] ? `<i class="cn-char cn-boss">${BOSS[e][1]}</i>` : e);
  return { stage, line, fx, blip, sfx, elf, boss, SHADOW, build, parts, SC, BOSS };
})();
/* ================= 🎁 Ouverture de case, arène, confettis ================= */
function openAnim(d, cb) {
  const done = () => {
    if (!o.isConnected) return;
    clearTimeout(T);
    o.classList.add('out');
    setTimeout(() => o.remove(), 350);
    cb && cb();
  };
  let T = 0;
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) {
    cb && cb();
    return;
  }
  const o = document.createElement('div');
  o.id = 'cnOpen';
  const piece = (() => {
    try {
      return pcs(S.map[d - 1]);
    } catch (_) {
      return '';
    }
  })();
  o.innerHTML = `<div class="op-rays"></div><div class="op-box"><div class="op-in"><div class="pc op-pc" style="${piece}"></div></div><div class="op-door l"></div><div class="op-door r"></div><div class="op-rib v"></div><div class="op-rib h"></div><div class="op-num">${d}</div><div class="op-bow">🎀</div></div><div class="op-sp"></div><p class="op-t">Case ${d}</p>`;
  document.body.appendChild(o);
  o.onclick = done;
  try {
    CINE.sfx('door');
  } catch (_) {}
  setTimeout(() => {
    o.classList.add('open');
    try {
      CINE.sfx('magic');
      CINE.sfx('pop', 0.05);
    } catch (_) {}
    const sp = o.querySelector('.op-sp');
    for (let i = 0; i < 22; i++) {
      const e = document.createElement('i');
      const a = Math.random() * 6.28,
        r = 90 + Math.random() * 120;
      e.style.setProperty('--x', Math.cos(a) * r + 'px');
      e.style.setProperty('--y', Math.sin(a) * r + 'px');
      e.style.animationDelay = Math.random() * 0.2 + 's';
      e.textContent = ['✨', '⭐', '❄️', '✦'][i % 4];
      sp.appendChild(e);
    }
  }, 850);
  T = setTimeout(done, 2300);
}
function cnArena(o) {
  try {
    const ar = o.querySelector('.vb-ar');
    if (!ar) return;
    const w = document.createElement('div');
    w.className = 'cn-arena';
    ar.insertBefore(w, ar.firstChild);
    const M = { 1: 'salon', 2: 'disco', 3: 'pizza', 4: 'pizza', 5: 'pizza' },
      up = () => {
        const sc = M[o.dataset.part || '1'] || 'salon';
        if (w.dataset.cn != sc) CINE.build(w, sc);
      };
    up();
    new MutationObserver(up).observe(o, { attributes: true, attributeFilter: ['data-part'] });
    const hide = () => {
      w.style.display = o.querySelector(':scope > .vb-cut') ? 'none' : '';
    };
    hide();
    new MutationObserver(hide).observe(o, { childList: true });
  } catch (_) {}
}
const SHADE = CINE.SHADOW;
function story(id, cb, tst) {
  const D = STORY[id];
  if (!D) {
    cb && cb();
    return;
  }
  S.story = S.story || {};
  if (!tst && !S.story[id]) {
    S.story[id] = Date.now();
    save();
    try {
      slog('📖', 'Histoire : ' + D.t);
    } catch (_) {}
  }
  const o = document.createElement('div');
  o.id = 'storyo';
  const c = document.createElement('div');
  c.className = 'vb-cut sc-' + D.sc + (window.__sickOn ? ' sick' : '');
  o.appendChild(c);
  c.innerHTML = `<div class="vb-cdeco"></div><div class="vb-cfx"></div><img class="vb-cc off-l" src="${VIMG.c}" alt=""><img class="vb-cv off-r" src="${VIMG.v}" alt="">${D.p ? `<span class="st-boss st-pers off-r"><img src="${susSrc(SUSP.find(z => z.id == D.p))}" alt=""></span>` : D.b ? `<span class="st-boss off-r">${CINE.boss(D.b)}</span>` : ''}<span class="st-elf off-b">${CINE.elf()}</span><div class="vb-cfx2"></div><div class="st-title">📖 ${esc(D.t)}</div><div class="vb-nar"></div><div class="vb-bub"></div><button class="vb-skip">Passer ⏭</button><div class="vb-tap">👆</div>`;
  document.body.appendChild(o);
  try {
    CINE.stage(c, D.sc, { boss: D.b, person: D.p });
  } catch (_) {}
  const $$ = q => c.querySelector(q),
    N = $$('.vb-nar'),
    BU = $$('.vb-bub'),
    CC = $$('.vb-cc'),
    CV = $$('.vb-cv'),
    EL = $$('.st-elf'),
    BS = $$('.st-boss'),
    FX = $$('.vb-cfx2');
  let i = -1,
    iv = 0,
    typing = false,
    full = '';
  try {
    window.__vidOn = 1;
    MUS.stop();
  } catch (_) {}
  try {
    YTM.duck(1 / 40);
  } catch (_) {}
  let fin = 0;
  const done = () => {
    if (fin) return;
    fin = 1;
    clearInterval(iv);
    c.classList.add('out');
    try {
      CINE.sfx('swish');
    } catch (_) {}
    setTimeout(() => {
      o.remove();
      window.__vidOn = 0;
      try {
        YTM.duck(1);
      } catch (_) {}
      try {
        bgm();
      } catch (_) {}
      cb && cb();
    }, 400);
  };
  $$('.vb-skip').onclick = e => {
    e.stopPropagation();
    done();
  };
  const word = (t, x, y) => {
    const w = document.createElement('span');
    w.className = 'vb-cword';
    w.textContent = t;
    w.style.left = x;
    w.style.top = y;
    FX.appendChild(w);
    setTimeout(() => w.remove(), 1200);
  };
  const doFx = f => {
    if (!f) return;
    if (Array.isArray(f)) return f.forEach(doFx);
    try {
      CINE.fx(c, f);
    } catch (_) {}
    const R2 = x => {
      c.classList.remove(x);
      void c.offsetWidth;
      c.classList.add(x);
    };
    if (f == 'cin') CC.classList.remove('off-l');
    if (f == 'vin') {
      CV.classList.remove('off-r', 'st-shadow');
      CV.src = VIMG.v;
    }
    if (f == 'ein') EL.classList.remove('off-b');
    if (f == 'bin' && BS) {
      BS.classList.remove('off-r');
      CV.classList.add('off-r');
    }
    if (f == 'shadow') {
      CV.src = SHADE;
      CV.classList.add('st-shadow');
      CV.classList.add('off-r');
    }
    if (f == 'peek') CV.classList.remove('off-r');
    if (f == 'vout') CV.classList.add('off-r');
    if (f == 'unshadow') {
      CV.src = VIMG.v;
      CV.classList.remove('st-shadow');
      R2('flash');
    }
    if (f == 'glow') {
      const g = document.createElement('span');
      g.className = 'st-glow';
      g.textContent = '✨';
      FX.appendChild(g);
    }
    if (f == 'clue') {
      const g = document.createElement('span');
      g.className = 'st-clue';
      g.textContent = '🔍';
      FX.appendChild(g);
    }
    if (f == 'crumbs') {
      for (let q = 0; q < 7; q++) {
        const m = document.createElement('span');
        m.className = 'st-crumb';
        m.textContent = '👣';
        m.style.left = 15 + q * 11 + '%';
        m.style.animationDelay = q * 0.15 + 's';
        FX.appendChild(m);
      }
    }
    if (f == 'whistle') {
      word('🎵', '74%', '36%');
      setTimeout(() => word('🎶', '80%', '30%'), 400);
    }
    if (typeof f == 'string' && f.startsWith('run:')) {
      const r = document.createElement('span');
      r.className = 'st-run';
      r.textContent = f.slice(4);
      FX.appendChild(r);
      setTimeout(() => r.remove(), 2200);
    }
    if (typeof f == 'string' && (f.startsWith('out:') || f.startsWith('sus:'))) {
      const x = SUSP.find(z => z.id == f.slice(4));
      if (x) {
        FX.querySelectorAll('.st-sus').forEach(e => e.remove());
        const g = document.createElement('div');
        g.className = 'st-sus' + (f[0] == 'o' ? ' out' : '');
        g.innerHTML = susPic(x) + '<b>' + esc(x.n) + '</b>' + (f[0] == 'o' ? '<span>INNOCENT·E</span>' : '');
        FX.appendChild(g);
        try {
          bkT(f[0] == 'o' ? 300 : 500, 0.25, 'square', 0.05, f[0] == 'o' ? 120 : 700);
        } catch (_) {}
        setTimeout(() => g.classList.add('gone'), 2600);
      }
    }
    if (f == 'lineup') {
      const g = document.createElement('div');
      g.className = 'st-line';
      g.innerHTML =
        SUSP.filter(x => x.id != 'valentin')
          .map((x, q) => `<span style="animation-delay:${q * 0.12}s">${susPic(x)}</span>`)
          .join('') + `<span class="vv" style="animation-delay:1.1s"><img src="${VIMG.v}"></span>`;
      FX.appendChild(g);
      setTimeout(() => g.classList.add('gone'), 4200);
    }
    if (typeof f == 'string' && f.startsWith('pop:')) {
      const g = document.createElement('span');
      g.className = 'st-clue';
      g.textContent = f.slice(4);
      FX.appendChild(g);
    }
    if (f == 'shake') R2('shk');
    try {
      bkT(f == 'glow' ? 880 : f == 'shadow' ? 110 : f == 'unshadow' ? 660 : 300, 0.15, 'triangle', 0.04, f == 'unshadow' ? 990 : 300);
    } catch (_) {}
  };
  const show = () => {
    i++;
    if (i >= D.l.length) return done();
    if (D.l[i][0] == 'x') {
      try {
        funPub(() => show(), 1);
      } catch (_) {
        show();
      }
      return;
    }
    const [w, t, op] = D.l[i];
    full = t;
    try {
      if (window.__sickOn && w == 'e' && i % 2 == 0) full = FLUB[(i / 2) % FLUB.length](t);
    } catch (_) {}
    if (op) doFx(op.fx);
    if (w == 'c') CC.classList.remove('off-l');
    if (w == 'e') EL.classList.remove('off-b');
    if (w == 'b' && BS) BS.classList.remove('off-r');
    [
      [CC, 'c'],
      [CV, 'v'],
      [EL, 'e'],
      [BS, 'b']
    ].forEach(([e, k]) => {
      if (!e) return;
      e.classList.toggle('talk', w == k);
      e.classList.toggle('dim', w != 'n' && w != k);
    });
    try {
      CINE.line(c, w, full);
    } catch (_) {}
    const tgt = w == 'n' ? N : BU;
    N.classList.toggle('on', w == 'n');
    BU.className = 'vb-bub' + (w != 'n' ? ' on ' + (w == 'b' ? 'v' : w) : '');
    tgt.textContent = '';
    typing = true;
    let j = 0;
    clearInterval(iv);

    iv = setInterval(() => {
      j++;
      tgt.textContent = full.slice(0, j);
      try {
        CINE.blip(w, j, full[j - 1], c);
      } catch (_) {}
      if (j >= full.length) {
        clearInterval(iv);
        typing = false;
      }
    }, 22);
  };
  c.onclick = () => {
    if (typing) {
      clearInterval(iv);
      typing = false;
      (D.l[i][0] == 'n' ? N : BU).textContent = full;
      return;
    }
    show();
  };
  setTimeout(show, 600);
}
setInterval(() => {
  try {
    if (typeof view != 'undefined' && (view == 'cal' || view == 'me')) storyCheck();
  } catch (_) {}
}, 2500);
function storyAll() {
  const L = STORD.filter(k => k != 'epi');
  let i = 0;
  const nx = () => {
    if (i < L.length) {
      const k = L[i++];
      return story(k, nx, 1);
    }
    window.__afterCredits = () => story('epi', () => toast('📖 Fin de l’histoire (mode test)'), 1);
    vBoss(1, 1, 1);
  };
  nx();
}
function storyBusy() {
  return !!(
    instPend() ||
    document.querySelector('.fun-ov') ||
    document.getElementById('smo') ||
    document.getElementById('facch') ||
    document.getElementById('cgsh') ||
    document.getElementById('storyo') ||
    document.getElementById('boot') ||
    document.getElementById('vbo') ||
    (document.getElementById('gwin') && document.getElementById('gwin').offsetParent) ||
    ($('#pop') && $('#pop').innerHTML.trim()) ||
    document.getElementById('alnew') ||
    document.getElementById('vco') ||
    document.body.classList.contains('playing')
  );
}
const puzOk = () => Object.values(S.puzWon || {}).some(Boolean) || !!(S.done && (S.opened || []).length >= 24);
