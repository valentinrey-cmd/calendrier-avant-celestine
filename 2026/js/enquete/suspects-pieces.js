/* ================= 🗂️ ENQUÊTE · Le bracelet aux cœurs roses (dossier n°24) ================= */
const SUSP = [
  {
    id: 'noemie',
    n: 'Noémie',
    img: 'noemie',
    r: 'La pote de Célestine',
    tr: [
      '💅 Lui fait les ongles chez elle',
      '🍕 Au resto jeudi soir',
      '💼 Lance son entreprise d’ongles',
      '💑 En couple avec Jean-Baptiste'
    ],
    d: 'Amie de lycée de Célestine. Mardi soir, elle lui a posé ses ongles chez elle.',
    dep: '« Tu avais ton bracelet en arrivant, et tu l’avais en repartant. »',
    a: 'Le bracelet était au poignet de Célestine le mercredi et le jeudi.'
  },
  {
    id: 'emma',
    n: 'Emma',
    img: 'emma',
    r: 'La pote de Célestine',
    tr: [
      '👁️ Ophtalmo',
      '🍕 Au resto jeudi soir',
      '🙄 Ne supporte pas Valentin',
      '💑 En couple avec Côme, parti au Vietnam',
      '🏠 Parents à Neuville'
    ],
    d: 'Amie de lycée de Célestine. Jeudi soir, elles ont dîné au resto avec Noémie.',
    dep: '« Pizza, potins, dessert. Une soirée normale. »',
    a: 'Pendant qu’elle avait le sac, le bracelet était au poignet de Célestine.'
  },
  {
    id: 'nora',
    n: 'Nora',
    img: 'nora',
    r: 'Copine de fac (pharma)',
    tr: ['🧪 Au TP vendredi matin', '📚 Toujours à la BU'],
    d: 'Copine de promo. Au TP du vendredi matin, elle était à côté de Célestine.',
    dep: '« J’étais à fond sur ma manip, je n’ai rien remarqué. »',
    a: 'À 8 h 45, la trousse était déjà vide.'
  },
  {
    id: 'erika',
    n: 'Erika',
    img: 'erika',
    r: 'Copine de fac (pharma)',
    tr: ['🤳 Prend des photos de tout', '🧪 Au TP vendredi matin'],
    d: 'Copine de promo. Elle était aussi au TP du vendredi matin.',
    dep: '« J’ai pris quelques photos, comme d’hab. Je te les envoie si ça peut aider ! »',
    a: 'Ses photos montrent tout le monde… sauf elle près du sac.'
  },
  {
    id: 'eya',
    n: 'Eya',
    img: 'eya',
    r: 'Copine de fac (pharma)',
    tr: ['🛍️ Adore Bellecour', '🧪 A quitté le TP en avance vendredi'],
    d: 'Copine de promo. Vendredi, elle a quitté le TP avant la fin.',
    dep: '« Je suis partie un peu plus tôt, j’avais un truc à faire. »',
    a: 'Elle était à Bellecour… et c’est elle qui a vu quelque chose.'
  },
  {
    id: 'edgar',
    n: 'Edgar',
    img: 'edgar',
    r: 'Le grand frère de Célestine',
    tr: ['🏠 Chez sa mère, Valérie, à Reyrieux', '🌯 Fan de tacos', '🥂 Le roi des toasts', '🛫 Agence de location à Saint-Exupéry'],
    d: 'Son grand frère, deux ans de plus qu’elle. Il était à Reyrieux tout le week-end.',
    dep: '« Ton sac ? Je n’y ai pas touché de tout le week-end. »',
    a: 'Il a vidé tout le sac vendredi soir : il n’y avait déjà plus de bracelet.'
  },
  {
    id: 'parents',
    n: 'Valérie',
    img: 'parents',
    r: 'La mère de Célestine',
    tr: ['🏡 Reyrieux', '🧺 Range tout ce qui traîne'],
    d: 'Sa mère. Elle a accueilli Célestine à Reyrieux tout le week-end.',
    dep: '« J’ai juste rangé ton sac dans ta chambre, ma chérie. »',
    a: 'Valérie a rangé le sac samedi : trousse, porte-monnaie, clés, et rien d’autre.'
  },
  {
    id: 'sandrine',
    n: 'Sandrine',
    img: 'sandrine',
    r: 'Collègue à la pharmacie',
    tr: ['💊 Préparatrice à la pharmacie de Reyrieux', '🧴 Toujours les mains sèches'],
    d: 'Collègue de Célestine à la pharmacie de Reyrieux, le samedi.',
    dep: '« Un samedi de rush, comme d’habitude. Je n’ai même pas eu le temps de déjeuner. »',
    a: 'Dans le casier, il n’y avait que le sac, sans bracelet.'
  },
  {
    id: 'valentin',
    n: 'Valentin',
    img: 'v',
    r: 'Le copain de Célestine',
    tr: [
      '🏠 Vit avec elle la semaine',
      '💼 Travaille le vendredi matin, puis rentre à Écully',
      '🧗 Escalade à MRoc',
      '😏 L’appelle « nulos »'
    ],
    d: 'Son copain. Ils vivent ensemble la semaine ; vendredi, il travaillait, puis il est parti à Écully pour le week-end.',
    dep: '« Vendredi, j’étais au travail, puis direct à Écully. Ton sac, je ne l’ai même pas vu. »',
    a: ''
  }
];
const AVP = {};
const avPic = x =>
  AVP[x.id] ||
  (AVP[x.id] =
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${x.av[1]}"/><circle cx="50" cy="40" r="20" fill="#fff" opacity=".22"/><path d="M14 100 Q50 58 86 100Z" fill="#fff" opacity=".22"/><text x="50" y="${x.av[0].length > 1 ? 60 : 64}" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${x.av[0].length > 1 ? 30 : 44}" fill="#fff">${x.av[0]}</text></svg>`
    ));
const SVGP = {};
const svgPic = e =>
  SVGP[e] ||
  (SVGP[e] =
    'data:image/svg+xml,' +
    encodeURIComponent(
      CINE.BOSS[e][1]
        .replace(/viewBox="[^"]*"/, 'viewBox="28 24 84 84"')
        .replace(/preserveAspectRatio="[^"]*"/, 'preserveAspectRatio="xMidYMid slice"')
        .replace('<g class="cn-body">', '<rect x="0" y="0" width="140" height="180" fill="#e7dfcf"/><g>')
    ));
const susSrc = x =>
  !x ? '' : x.img ? (x.img == 'v' ? VIMG.v : SIMG[x.img]) : x.av ? avPic(x) : x.svg && CINE.BOSS[x.svg] ? svgPic(x.svg) : '';
const susPic = x => {
  const u = susSrc(x);
  return u ? `<img src="${u}" alt="">` : `<i>${x.e || '❓'}</i>`;
};
/* ---------- les dessins des pièces ---------- */
// Chaque dessin est un SVG 320×220. Les identifiants des dégradés sont préfixés par le nom du dessin
// (plusieurs dessins peuvent s'afficher dans la même fenêtre).
const phSh = (h, k) => {
  // assombrit (k<0) ou éclaircit (k>0) une couleur #rrggbb
  const n = parseInt(h.slice(1), 16),
    f = c => Math.max(0, Math.min(255, Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k)));
  return '#' + [n >> 16, (n >> 8) & 255, n & 255].map(c => f(c).toString(16).padStart(2, '0')).join('');
};
const phDefs = p => `<defs>
<linearGradient id="${p}or" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".35" stop-color="#e9bf52"/><stop offset=".7" stop-color="#b8862a"/><stop offset="1" stop-color="#f3d27a"/></linearGradient>
<radialGradient id="${p}co" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffd6e6"/><stop offset=".5" stop-color="#ff8fb8"/><stop offset="1" stop-color="#d94f86"/></radialGradient>
<radialGradient id="${p}vi" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>
<radialGradient id="${p}gl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="${p}fl" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="${p}om" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="1.6"/></filter>
</defs>`;
// petit cœur rose brillant, centré en (x, y), taille s
const phCoeur = (p, x, y, s, rot = 0, recolle = false) =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s / 10})"><path d="M0 4 C-7 -1 -6 -8 -2.6 -8 C-1.2 -8 -0.3 -7 0 -6 C.3 -7 1.2 -8 2.6 -8 C6 -8 7 -1 0 4Z" fill="url(#${p}co)" stroke="#b83a6c" stroke-width=".7"/><ellipse cx="-2.6" cy="-5" rx="1.6" ry=".9" fill="#fff" opacity=".8" transform="rotate(-30 -2.6 -5)"/>${
    recolle ? '<path d="M-1 -6.5 L.6 -3.2 L-.4 -.6 L1 2" fill="none" stroke="#fff6" stroke-width=".55"/>' : ''
  }</g>`;
// le bracelet : chaîne en maillons dorés le long d'une courbe, avec des cœurs et un fermoir
const phBracelet = (p, x1, y1, x2, y2, sag, o = {}) => {
  const n = o.n || 34,
    hearts = o.h || 5,
    hs = o.hs || 9,
    pt = t => {
      const cx = (x1 + x2) / 2,
        cy = (y1 + y2) / 2 + sag;
      return [(1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2];
    };
  let s = '';
  for (let i = 0; i < n; i++) {
    const [ax, ay] = pt(i / n),
      [bx, by] = pt((i + 1) / n),
      a = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI,
      L = Math.hypot(bx - ax, by - ay);
    s += `<ellipse cx="${(ax + bx) / 2}" cy="${(ay + by) / 2}" rx="${L * 0.62}" ry="${(o.w || 1.6) * (i % 2 ? 0.6 : 1)}" transform="rotate(${a} ${(ax + bx) / 2} ${(ay + by) / 2})" fill="none" stroke="url(#${p}or)" stroke-width="${o.sw || 1}"/>`;
  }
  const [fx, fy] = pt(1);
  s += `<g transform="translate(${fx} ${fy})"><ellipse rx="${hs * 0.45}" ry="${hs * 0.3}" fill="none" stroke="url(#${p}or)" stroke-width="${hs * 0.17}"/></g>`;
  for (let i = 0; i < hearts; i++) {
    const t = (i + 1) / (hearts + 1),
      [hx, hy] = pt(t);
    s +=
      `<line x1="${hx}" y1="${hy - 1}" x2="${hx}" y2="${hy + hs * 0.35}" stroke="url(#${p}or)" stroke-width="${hs * 0.09}"/>` +
      phCoeur(p, hx, hy + hs * 0.75, hs, (t - 0.5) * 14, o.recolle == i);
  }
  if (o.eclat)
    o.eclat.forEach(([ex, ey, er]) => {
      s += `<circle cx="${ex}" cy="${ey}" r="${er}" fill="url(#${p}gl)"/><path d="M${ex - er * 1.4} ${ey} L${ex + er * 1.4} ${ey} M${ex} ${ey - er * 1.4} L${ex} ${ey + er * 1.4}" stroke="#fff" stroke-width="${er * 0.12}" opacity=".9"/>`;
    });
  return s;
};
// Les vraies têtes détourées (media/persos/detoures/…, chemins dans PHTETE de js/medias.js) :
// position des yeux (x, y), écart entre les yeux, largeur et hauteur de l'image (en pixels), et couleur de peau pour le cou.
const PHQUI = {
  celestine: { t: [279.0, 324.0, 234.0, 579, 720], pc: '#efc49f' },
  noemie: { t: [267.5, 185.5, 213.2, 605, 580], pc: '#deb594' },
  emma: { t: [227.0, 263.5, 162.7, 572, 565], pc: '#ca9a92' },
  nora: { t: [204.0, 310.0, 167.4, 422, 620], pc: '#a16340' },
  erika: { t: [228.5, 360.2, 245.1, 564, 727], pc: '#ac6f4a' },
  eya: { t: [230.0, 273.0, 167.4, 425, 583], pc: '#b55d3b' }
};
// un personnage : corps dessiné et vraie tête, les yeux en (x, y - 1), échelle s ; o.haut = couleur du haut, o.blouse, o.lunettes = 'labo'
const phPerso = (p, x, y, s, o) => {
  const q = PHQUI[o.qui],
    sk = q.pc,
    sk2 = phSh(sk, -0.16),
    sk3 = phSh(sk, -0.3),
    top = o.haut || '#2f4a6b',
    top2 = phSh(top, -0.25),
    top3 = phSh(top, 0.18),
    [ex, ey, iod, iw, ih] = q.t,
    k = 16 / iod;
  const corps = `<path d="M-6.5 18 L-7 30 Q0 34 7 30 L6.5 18Z" fill="${sk2}"/><path d="M-6.5 24 Q0 30 6.5 24" fill="none" stroke="${sk3}" stroke-width=".8" opacity=".6"/>
<path d="M-8 28 Q-32 31 -40 66 L40 66 Q32 31 8 28 Q0 36 -8 28Z" fill="${top}"/>
<path d="M-8 28 Q-32 31 -40 66 L-30 66 Q-28 40 -10 31Z" fill="${top3}" opacity=".35"/>
<path d="M-8 28 Q0 36 8 28" fill="none" stroke="${top2}" stroke-width="1.6"/>${
    o.blouse
      ? `<path d="M-40 66 Q-34 31 -8 28 L-3 48 L-6 66Z M40 66 Q34 31 8 28 L3 48 L6 66Z" fill="#fdfdfd" stroke="#cfd8de" stroke-width=".8"/><path d="M-8 28 L-3 48 L-12 40Z M8 28 L3 48 L12 40Z" fill="#eef2f5" stroke="#cfd8de" stroke-width=".6"/><rect x="-30" y="48" width="10" height="8" rx="1" fill="none" stroke="#cfd8de"/><path d="M-27 48 v-5" stroke="#3a6aa8" stroke-width="1.4"/>`
      : ''
  }
<path d="M-28 42 Q-24 54 -26 66 M27 42 Q24 54 27 66 M-14 50 Q-10 58 -12 66" fill="none" stroke="${top2}" stroke-width="1.1" opacity=".55"/>`;
  const tete = `<image href="${PHTETE[o.qui]}" x="${-ex * k}" y="${-1 - ey * k}" width="${iw * k}" height="${ih * k}"/>`;
  const labo =
    o.lunettes == 'labo'
      ? `<g fill="#dff4ff40" stroke="#9cc8e0" stroke-width="1.4"><rect x="-17" y="-7" width="34" height="12" rx="5"/></g><path d="M-17 -3 L-21 -4 M17 -3 L21 -4" stroke="#9cc8e0" stroke-width="1.6"/><path d="M-13 -4 l6 -2" stroke="#fff" stroke-width="1.2" opacity=".8"/>`
      : '';
  return `<g transform="translate(${x} ${y}) scale(${s})">${corps}${tete}${labo}</g>`;
};
// un bras (épaule → main), avec manche et une vraie main
const phBras = (x1, y1, x2, y2, peau, manche, w = 9) => {
  const mx = x1 + (x2 - x1) * 0.6,
    my = y1 + (y2 - y1) * 0.6,
    a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI,
    p2 = phSh(peau, -0.18),
    m2 = phSh(manche, -0.22);
  return `<path d="M${x1} ${y1} L${mx} ${my}" stroke="${manche}" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M${x1} ${y1} L${mx} ${my}" stroke="${m2}" stroke-width="${(w + 3) * 0.3}" stroke-linecap="round" opacity=".35" transform="translate(${w * 0.25} ${w * 0.25})"/><path d="M${mx} ${my} L${x2} ${y2}" stroke="${peau}" stroke-width="${w * 0.78}" stroke-linecap="round"/><g transform="translate(${x2} ${y2}) rotate(${a}) scale(${w / 10})"><path d="M-3 -4.6 C2 -6 7 -5 9 -3 C11 -1.6 11 1.6 9 3 C7 5 2 6 -3 4.6Z" fill="${peau}"/><path d="M1 -5.4 C3 -9 6 -9 6.6 -6.6 C6 -5 4 -4.4 2.4 -4Z" fill="${peau}"/><path d="M4 -1.8 L9.6 -1.2 M4 0.6 L10 1 M4 2.8 L9 3.2" stroke="${p2}" stroke-width=".55" stroke-linecap="round"/></g>`;
};
// en-tête façon appli (story, snap…) et horodatage
const phStory = (p, nom, quand, coul) =>
  `<g><rect width="320" height="44" fill="#0004"/><rect x="10" y="8" width="300" height="3" rx="1.5" fill="#fff5"/><rect x="10" y="8" width="${coul || 120}" height="3" rx="1.5" fill="#fff"/><circle cx="24" cy="26" r="9" fill="url(#${p}co)" stroke="#fff" stroke-width="1.6"/><text x="38" y="30" font-family="Inter,system-ui,sans-serif" font-size="11" font-weight="700" fill="#fff" style="paint-order:stroke" stroke="#0005" stroke-width="2">${nom}</text><text x="${44 + nom.length * 6.2}" y="30" font-family="Inter,system-ui,sans-serif" font-size="10.5" fill="#fffc" style="paint-order:stroke" stroke="#0004" stroke-width="2">${quand}</text></g>`;
const phTampon = (x, y, txt, ancre = 'start') =>
  `<text x="${x}" y="${y}" text-anchor="${ancre}" font-family="'Courier New',monospace" font-size="11" font-weight="700" fill="#ffb347" style="paint-order:stroke" stroke="#000a" stroke-width="2.4" letter-spacing=".5">${txt}</text>`;
const phVig = p => `<rect width="320" height="220" fill="url(#${p}vi)" pointer-events="none"/>`;
const phSvg = (p, corps) => `<svg viewBox="0 0 320 220" xmlns="http://www.w3.org/2000/svg">${phDefs(p)}${corps}${phVig(p)}</svg>`;

const PH = {
  // 1. le bracelet dans son écrin, le jour du cadeau
  bracelet: phSvg(
    'br',
    `<rect width="320" height="220" fill="#3b1d24"/><rect width="320" height="220" fill="url(#brgl)" opacity=".12"/>
<path d="M0 150 L320 150 L320 220 L0 220Z" fill="#6e4a33"/><path d="M0 150 L320 150" stroke="#8a6046" stroke-width="2"/>
${Array.from({ length: 7 }, (_, i) => `<path d="M0 ${162 + i * 9} Q160 ${158 + i * 9} 320 ${164 + i * 9}" stroke="#5e3e2a" stroke-width=".8" fill="none" opacity=".6"/>`).join('')}
<g transform="translate(160 118)"><ellipse cx="0" cy="44" rx="120" ry="10" fill="#000" opacity=".35" filter="url(#brom)"/>
<path d="M-104 -58 L104 -58 L96 -96 L-96 -96Z" fill="#7a1f33"/><path d="M-96 -92 L96 -92 L100 -62 L-100 -62Z" fill="#f6e8ec"/><path d="M-96 -92 L96 -92 L100 -62 L-100 -62Z" fill="url(#brgl)" opacity=".5"/>
<text x="0" y="-74" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="11" fill="#a35a70">Joyeux Noël, mon amour</text>
<rect x="-110" y="-58" width="220" height="100" rx="8" fill="#8c2639"/><rect x="-102" y="-50" width="204" height="84" rx="5" fill="#a83a52"/>
<path d="M-102 -50 h204 v20 q-102 10 -204 0Z" fill="#c25a72" opacity=".45"/>
<ellipse cx="0" cy="-6" rx="78" ry="24" fill="#7a1f33" opacity=".55"/>
${phBracelet('br', -74, -14, 74, -14, 30, {
  n: 46,
  h: 5,
  hs: 15,
  w: 2.3,
  sw: 1.5,
  eclat: [
    [-30, 2, 5],
    [42, -2, 4]
  ]
})}
</g>
<g transform="translate(250 176) rotate(-8)"><rect x="-34" y="-18" width="68" height="40" rx="3" fill="#fffaf0"/><path d="M-34 -18 L34 -18" stroke="#e2c7a2"/><text x="0" y="0" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="10" fill="#7a3a4a">24 · 12 · 2025</text><text x="0" y="13" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="8.5" fill="#a0707a">— V. ♡</text></g>
<g transform="translate(46 182) rotate(12)"><path d="M-26 -4 Q0 -14 26 -4 Q0 6 -26 -4Z" fill="#c8a24a"/><path d="M-6 -6 Q-22 -26 -4 -16 Q4 -26 6 -6Z" fill="#e8c35a"/></g>`
  ),
  // 2. le sac vidé sur le lit, dimanche soir
  sac: phSvg(
    'sc',
    `<rect width="320" height="220" fill="#e9e1d6"/>
${Array.from({ length: 12 }, (_, i) => `<path d="M${i * 30 - 20} 0 L${i * 30 + 40} 220" stroke="#ddd3c4" stroke-width="10" opacity=".5"/>`).join('')}
<path d="M0 0 L320 0 L320 26 Q160 40 0 26Z" fill="#d6ccbd"/>
<g transform="translate(92 118)"><ellipse cx="0" cy="62" rx="74" ry="9" fill="#000" opacity=".2" filter="url(#scom)"/>
<path d="M-62 -20 L62 -20 L54 60 L-54 60Z" fill="#2f2523"/><path d="M-62 -20 L62 -20 L60 -4 L-60 -4Z" fill="#3e302c"/><path d="M-50 60 L-56 -10 M50 60 L56 -10" stroke="#1f1816" stroke-width="1.5"/>
<path d="M-34 -20 C-30 -70 30 -70 34 -20" fill="none" stroke="#2f2523" stroke-width="7"/><path d="M-34 -20 C-30 -66 30 -66 34 -20" fill="none" stroke="#4a3a35" stroke-width="2"/>
<rect x="-14" y="10" width="28" height="18" rx="3" fill="#3e302c" stroke="#c9a45a" stroke-width="1.2"/><circle cx="0" cy="19" r="2.5" fill="#c9a45a"/>
<path d="M-60 -4 Q0 8 60 -4" fill="none" stroke="#1a1312" stroke-width="2" opacity=".6"/></g>
<g transform="translate(224 60) rotate(-6)"><rect x="-48" y="-16" width="96" height="34" rx="14" fill="#f48fb5"/><rect x="-48" y="-16" width="96" height="14" rx="10" fill="#f9b4cd"/><path d="M-40 -2 h80" stroke="#b9577e" stroke-width="2" stroke-dasharray="2.5 1.5"/><rect x="38" y="-6" width="10" height="7" rx="2" fill="#d9d9d9"/><path d="M-40 -2 Q0 6 40 -2" fill="none" stroke="#c46a90" stroke-width="1" opacity=".6"/><text x="0" y="13" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="8" fill="#fff" font-weight="700">ouverte · vide</text></g>
<g transform="translate(232 128) rotate(8)"><rect x="-34" y="-20" width="68" height="40" rx="5" fill="#6b4126"/><rect x="-34" y="-20" width="68" height="16" rx="5" fill="#7d4e30"/><path d="M-30 -4 h60" stroke="#4e2e1a" stroke-width="1"/><circle cx="24" cy="-6" r="3.4" fill="#d4b15e"/><rect x="-28" y="4" width="34" height="3" rx="1" fill="#4e2e1a" opacity=".6"/></g>
<g transform="translate(272 182)"><circle r="9" fill="none" stroke="#a8a8a8" stroke-width="3"/><path d="M6 6 L30 22 L28 26 L24 24 L22 28 L18 25" fill="#c7c7c7" stroke="#8a8a8a" stroke-width="1"/><circle cx="-14" cy="12" r="7" fill="#ffd34d" stroke="#c89b20"/><text x="-14" y="15" text-anchor="middle" font-size="8">🏠</text></g>
<g transform="translate(184 182) rotate(-14)"><rect x="-22" y="-12" width="44" height="24" rx="3" fill="#ffffff" stroke="#cfd8e2"/><rect x="-22" y="-12" width="44" height="8" fill="#4aa3df"/><path d="M-6 0 q6 6 12 0" fill="none" stroke="#9cb4c8" stroke-width="1.5"/></g>
<g transform="translate(36 40) rotate(20)"><rect x="-5" y="-16" width="10" height="32" rx="4" fill="#e85d8a"/><rect x="-5" y="-16" width="10" height="10" rx="4" fill="#f7f7f7"/></g>`
  ),
  // 3. le vide-poche de la salle de bain, vide
  videpoche: phSvg(
    'vp',
    `<rect width="320" height="220" fill="#eef3f4"/>
${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 40} 0 V128" stroke="#d7e1e4" stroke-width="2"/>`).join('')}${Array.from({ length: 4 }, (_, i) => `<path d="M0 ${i * 32} H320" stroke="#d7e1e4" stroke-width="2"/>`).join('')}
<rect x="0" y="128" width="320" height="14" fill="#f7f7f5"/><rect x="0" y="142" width="320" height="6" fill="#c9d3d6"/><path d="M0 148 H320 V220 H0Z" fill="#dfe7ea"/>
<rect x="206" y="0" width="114" height="106" rx="4" fill="#cfe2ea" stroke="#b5c7cf" stroke-width="3"/><path d="M220 12 L250 0 M226 40 L300 4 M240 80 L318 30" stroke="#fff" stroke-width="5" opacity=".5"/>
<g transform="translate(150 128)"><ellipse cx="0" cy="2" rx="52" ry="9" fill="#000" opacity=".18" filter="url(#vpom)"/><path d="M-48 -6 Q-46 8 0 8 Q46 8 48 -6Z" fill="#f2c6d3"/><ellipse cx="0" cy="-6" rx="48" ry="10" fill="#f7d7e0" stroke="#d9a3b3" stroke-width="1.6"/><ellipse cx="0" cy="-5" rx="38" ry="6.5" fill="#fbe9ee"/><ellipse cx="-12" cy="-7" rx="10" ry="2" fill="#fff" opacity=".7"/></g>
<g transform="translate(46 128)"><rect x="-12" y="-46" width="24" height="46" rx="5" fill="#bcdaf0" opacity=".9"/><rect x="-12" y="-46" width="6" height="46" rx="3" fill="#fff" opacity=".5"/><rect x="-4" y="-66" width="3" height="26" rx="1.5" fill="#4fb0e8"/><rect x="2" y="-62" width="3" height="22" rx="1.5" fill="#ff8fb8"/></g>
<g transform="translate(88 128)"><rect x="-10" y="-34" width="20" height="34" rx="4" fill="#f3c6a0"/><rect x="-3" y="-44" width="6" height="12" fill="#ddd"/><path d="M-3 -44 h12 v3 h-12z" fill="#ddd"/><rect x="-7" y="-24" width="14" height="10" rx="2" fill="#fff" opacity=".7"/></g>
<g transform="translate(254 128)"><path d="M-16 0 L-12 -22 L12 -22 L16 0Z" fill="#e7dccd"/><path d="M0 -22 C-14 -40 -20 -46 -24 -58 M0 -22 C4 -44 2 -54 6 -64 M0 -22 C10 -36 22 -42 26 -52" stroke="#5f8f5a" stroke-width="2.4" fill="none"/>${[
      [-24, -58],
      [6, -64],
      [26, -52],
      [-14, -40],
      [12, -40]
    ]
      .map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="7" ry="3.4" fill="#79b06f" transform="rotate(-30 ${a} ${b})"/>`)
      .join('')}</g>
<path d="M286 142 v70 q0 6 -6 6 h-30 q-6 0 -6 -6 v-70Z" fill="#f2a9c0"/><path d="M244 150 h42 M244 158 h42" stroke="#e48aa8" stroke-width="2"/>`
  ),
  // 4. la story de Noémie : « Prête pour le gel »
  storyn: phSvg(
    'sn',
    `<rect width="320" height="220" fill="#2b1a26"/><circle cx="250" cy="80" r="70" fill="#8a5cff" opacity=".18" filter="url(#snfl)"/>
<path d="M0 110 L320 110 L320 220 L0 220Z" fill="#e9dcc8"/><path d="M0 110 L320 110" stroke="#cdbfa8" stroke-width="2"/>
<path d="M30 128 L208 122 L216 204 L22 212Z" fill="#f6f0f6"/><path d="M30 128 L208 122 L210 140 L28 146Z" fill="#ffffff" opacity=".6"/>
${['#ff4f7b', '#c0233a', '#ffd1dc', '#7a5cff', '#f3c623']
  .map(
    (c, i) =>
      `<g transform="translate(${44 + i * 30} 104)"><ellipse cx="0" cy="26" rx="13" ry="3" fill="#000" opacity=".25"/><rect x="-10" y="-4" width="20" height="30" rx="5" fill="${c}"/><rect x="-10" y="-4" width="6" height="30" rx="3" fill="#fff" opacity=".35"/><rect x="-6" y="8" width="12" height="10" rx="1.5" fill="#fff" opacity=".8"/><rect x="-5" y="-22" width="10" height="19" rx="2" fill="#1c1c1c"/><rect x="-5" y="-22" width="3" height="19" fill="#555"/></g>`
  )
  .join('')}
<g transform="translate(262 136)"><ellipse cx="0" cy="30" rx="48" ry="8" fill="#000" opacity=".3"/><path d="M-44 28 L-40 -4 Q0 -30 40 -4 L44 28Z" fill="#f2f2f6"/><path d="M-32 28 L-30 4 Q0 -14 30 4 L32 28Z" fill="#b48cff"/><path d="M-30 28 L-28 6 Q0 -10 28 6 L30 28Z" fill="#d9c4ff" opacity=".6"/><rect x="-10" y="-20" width="20" height="5" rx="2" fill="#7a5cff"/><circle cx="26" cy="-6" r="2.5" fill="#56f07a"/></g>
<g transform="translate(70 178) rotate(-10)"><rect x="-26" y="-3" width="52" height="6" rx="3" fill="#d8b4a0"/><rect x="-26" y="-3" width="52" height="2" rx="1" fill="#fff" opacity=".4"/></g>
${[
  [44, 196],
  [58, 200],
  [36, 186]
]
  .map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="#fff" stroke="#eee"/>`)
  .join('')}
${phBracelet('sn', 112, 168, 192, 164, 14, { n: 30, h: 5, hs: 9, w: 1.4, eclat: [[150, 182, 3.4]] })}
${phStory('sn', 'noemie.nails', '18 h 05', 96)}
<g transform="translate(160 66) rotate(-4)"><rect x="-86" y="-15" width="172" height="28" rx="8" fill="#fff"/><text x="0" y="5" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="800" fill="#c0234a">Prête pour le gel 💅</text></g>`
  ),
  // 5. les ongles finis, le bracelet de nouveau au poignet
  ongles: phSvg(
    'og',
    `<rect width="320" height="220" fill="#f4e3ec"/><circle cx="70" cy="60" r="90" fill="#fff" opacity=".5" filter="url(#ogfl)"/>
<path d="M0 176 Q160 160 320 184 V220 H0Z" fill="#ead2dd"/>
<g transform="translate(176 150) rotate(-6)">
<ellipse cx="6" cy="44" rx="30" ry="7" fill="#b98aa0" opacity=".22" filter="url(#ogom)"/>
${(() => {
  const pe = '#f2c9aa',
    om = '#dba586',
    // un doigt : base (bx, by), longueur L, largeur w, angle a (degrés)
    doigt = (bx, by, L, w, a) =>
      `<g transform="translate(${bx} ${by}) rotate(${a})"><path d="M${-w / 2} 4 L${-w * 0.4} ${-L + w * 0.42} A${w * 0.4} ${w * 0.42} 0 0 1 ${w * 0.4} ${-L + w * 0.42} L${w / 2} 4Z" fill="${pe}"/><path d="M${w * 0.18} ${-L * 0.9} L${w * 0.3} 0" stroke="${om}" stroke-width="${w * 0.22}" opacity=".35" stroke-linecap="round"/><path d="M${-w * 0.3} ${-L * 0.36} q${w * 0.3} 1.6 ${w * 0.6} 0 M${-w * 0.28} ${-L * 0.64} q${w * 0.28} 1.3 ${w * 0.56} 0" fill="none" stroke="${om}" stroke-width=".7" opacity=".8"/><rect x="${-w * 0.3}" y="${-L + w * 0.12}" width="${w * 0.6}" height="${L * 0.25}" rx="${w * 0.3}" fill="#ffb3cc"/><path d="M${-w * 0.3} ${-L + w * 0.12 + L * 0.2} q${w * 0.3} ${w * 0.25} ${w * 0.6} 0" fill="none" stroke="#ef8fb1" stroke-width=".6"/><rect x="${-w * 0.16}" y="${-L + w * 0.3}" width="${w * 0.16}" height="${L * 0.13}" rx="${w * 0.08}" fill="#fff" opacity=".85"/></g>`;
  const dg = [
    [-14, -38, 39, 10.6, -4],
    [-2.4, -40, 44, 10.8, -1],
    [8.8, -38.5, 41, 10.4, 2.5],
    [19.2, -33, 31, 8.8, 7]
  ];
  // les doigts d'abord, puis la paume par-dessus : elle remonte entre les doigts (creux arrondis) et dessine les jointures
  return `${dg.map(d => doigt(...d)).join('')}
<g transform="translate(-21 -2) rotate(-34)"><path d="M-5.5 10 L-5 -26 A5 5.4 0 0 1 5 -26 L5.5 10Z" fill="${pe}"/><path d="M-4 -12 q4 1.6 8 0" fill="none" stroke="${om}" stroke-width=".7"/><rect x="-3.4" y="-30" width="6.8" height="9.5" rx="3.4" fill="#ffb3cc"/><rect x="-1.6" y="-28.4" width="1.4" height="5.4" rx=".7" fill="#fff" opacity=".85"/></g>
<path d="M-17 150 L-17 36 Q-18 22 -21 8 Q-23 -12 -20.2 -34 Q-14 -42.5 -8.4 -38.6 Q-2.4 -44.5 3.4 -38.2 Q8.8 -43 14.4 -34.4 Q19.2 -38.8 23.6 -29 Q24.6 -18 23.6 -10 Q22 -6 20 8 Q17 22 17 36 L18 150Z" fill="${pe}"/>
<path d="M17 36 Q17 22 20 8 Q22 -6 23.6 -10 Q24.6 -18 23.6 -29 L20.6 -24 Q21 -12 17 -2 Q14 14 12 30 L12 150 L18 150Z" fill="${om}" opacity=".4"/>
<path d="M-24 -18 Q-23 0 -19 16" fill="none" stroke="#fff" stroke-width="3" opacity=".22" stroke-linecap="round"/>
<path d="M-17.5 -35 Q-14 -38.4 -10.5 -35 M-5.8 -36.6 Q-2.4 -40.2 1 -36.6 M5.6 -35.6 Q8.8 -38.8 12 -35.4 M16.4 -30.6 Q19.2 -33.2 21.8 -30" fill="none" stroke="${om}" stroke-width=".9" opacity=".75" stroke-linecap="round"/>
<path d="M-11 -26 Q-10 -6 -7 12 M-1 -28 L0 12 M9 -26 Q8 -6 5 12" fill="none" stroke="${om}" stroke-width=".9" opacity=".35"/>
<path d="M-17 40 Q0 45 17 40" fill="none" stroke="${om}" stroke-width=".9" opacity=".6"/>`;
})()}
${phBracelet('og', -18, 34, 18, 34, 10, { n: 24, h: 5, hs: 7.5, w: 1.4, sw: 1, eclat: [[-3, 52, 3]] })}
</g>
${phStory('og', 'noemie.nails', '19 h 40', 230)}
<g transform="translate(78 82) rotate(-6)"><rect x="-58" y="-15" width="116" height="28" rx="14" fill="#fff"/><text x="0" y="5" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="14" font-weight="800" fill="#e0567f">Baby pink 💗</text></g>`
  ),
  // 6. selfie d'Erika à la BU, mercredi 13 h
  bu: phSvg(
    'bu',
    `<rect width="320" height="220" fill="#d9cbb5"/>
${Array.from(
  { length: 3 },
  (_, r) =>
    `<rect x="0" y="${r * 44}" width="320" height="6" fill="#8a6a48"/>` +
    Array.from({ length: 34 }, (_, i) => {
      const h = 26 + ((i * 7 + r * 5) % 11),
        c = ['#7a2f3a', '#2f4a6b', '#3f6b4a', '#c9a04a', '#5a3a6b', '#b85a3a', '#2a2a2a', '#8aa0b8'][(i * 3 + r) % 8];
      return `<rect x="${i * 9.6 + (r % 2) * 3}" y="${r * 44 + 6 + (38 - h)}" width="8.4" height="${h}" fill="${c}"/><rect x="${i * 9.6 + (r % 2) * 3 + 1}" y="${r * 44 + 10 + (38 - h)}" width="6.4" height="2" fill="#fff" opacity=".35"/>`;
    }).join('')
).join('')}
<rect x="0" y="132" width="320" height="88" fill="#cbb9a0"/>
${phPerso('bu', 50, 120, 1.12, { qui: 'eya', haut: '#d9b36a' })}
${phPerso('bu', 270, 118, 1.12, { qui: 'nora', haut: '#4a6b8a' })}
${phPerso('bu', 120, 112, 1.22, { qui: 'celestine', haut: '#f0e6dc' })}
${phPerso('bu', 196, 116, 1.18, { qui: 'erika', haut: '#7a2f3a' })}
${phBras(146, 150, 154, 98, '#f3cfb3', '#f0e6dc', 11)}
<g transform="translate(154 96)"><rect x="-5" y="-20" width="5" height="14" rx="2.5" fill="#f3cfb3"/><rect x="1" y="-22" width="5" height="16" rx="2.5" fill="#f3cfb3"/></g>
${phBras(220, 160, 236, 214, '#f0c8a8', '#7a2f3a', 12)}
${phBracelet('bu', 143, 110, 163, 106, 4, { n: 14, h: 3, hs: 5, w: 1, sw: 0.8, eclat: [[156, 114, 2.6]] })}
<rect x="0" y="150" width="320" height="22" fill="#0007"/><text x="160" y="166" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff">pause BU, on survit 📚😵</text>
${phTampon(312, 210, 'MER. 13:02 · BU ROCKEFELLER', 'end')}`
  ),
  // 7. le resto de jeudi, 21 h 12
  resto: phSvg(
    're',
    `<rect width="320" height="220" fill="#3a1c14"/>
${Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, i) => `<rect x="${i * 38 + (r % 2) * 19 - 10}" y="${r * 20}" width="34" height="16" rx="2" fill="#6a2e1e" opacity="${0.5 + ((i + r) % 3) * 0.12}"/>`).join('')).join('')}
<path d="M0 18 Q80 34 160 20 Q240 6 320 24" fill="none" stroke="#2a1a12" stroke-width="1.2"/>
${Array.from({ length: 11 }, (_, i) => {
  const x = i * 31 + 6,
    y = 22 + Math.sin(i * 0.9) * 7;
  return `<circle cx="${x}" cy="${y}" r="10" fill="#ffcf70" opacity=".25" filter="url(#refl)"/><circle cx="${x}" cy="${y}" r="3" fill="#ffe7a8"/>`;
}).join('')}
${phPerso('re', 64, 96, 1.1, { qui: 'noemie', haut: '#2a2a3a' })}
${phPerso('re', 256, 94, 1.1, { qui: 'emma', haut: '#5a3a7a' })}
${phPerso('re', 160, 90, 1.16, { qui: 'celestine', haut: '#a8323e' })}
<path d="M0 156 L320 156 L320 220 L0 220Z" fill="#7a4a2a"/><path d="M0 156 L320 156" stroke="#9a6a44" stroke-width="3"/>
<g transform="translate(160 184)"><ellipse cx="0" cy="6" rx="78" ry="16" fill="#000" opacity=".3"/><ellipse cx="0" cy="0" rx="74" ry="15" fill="#d8d8d8"/><ellipse cx="0" cy="-2" rx="62" ry="12" fill="#e0a040"/><ellipse cx="0" cy="-3" rx="54" ry="9.5" fill="#d9472e"/>${[
      [-30, -4],
      [-8, -6],
      [16, -2],
      [36, -5],
      [-18, 1],
      [4, 2],
      [26, 2]
    ]
      .map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="7" ry="3.6" fill="#fff4d6"/>`)
      .join('')}${[
      [-36, 0],
      [10, -6],
      [30, 0]
    ]
      .map(([a, b]) => `<ellipse cx="${a}" cy="${b}" rx="4" ry="1.8" fill="#4a9a3a"/>`)
      .join('')}<path d="M0 -12 L-26 9 M0 -12 L28 8 M0 -12 L2 12" stroke="#b77a2a" stroke-width="1"/></g>
${[
  [54, 160],
  [270, 158]
]
  .map(
    ([a, b]) =>
      `<g transform="translate(${a} ${b})"><path d="M-9 -30 Q-9 -12 0 -10 Q9 -12 9 -30Z" fill="#fff" opacity=".35" stroke="#fff8" stroke-width="1"/><path d="M-8.4 -22 Q-8 -12 0 -11 Q8 -12 8.4 -22Z" fill="#8a1a2a"/><path d="M0 -10 V0 M-7 0 h14" stroke="#fff8" stroke-width="1.5"/></g>`
  )
  .join('')}
${phBras(136, 142, 196, 128, '#f3cfb3', '#a8323e', 10)}
<g transform="translate(200 126)"><path d="M-7 -26 Q-7 -10 0 -8 Q7 -10 7 -26Z" fill="#fff" opacity=".35" stroke="#fff8"/><path d="M-6.4 -20 Q-6 -10 0 -9 Q6 -10 6.4 -20Z" fill="#8a1a2a"/><path d="M0 -8 V2" stroke="#fff8" stroke-width="1.4"/></g>
${phBracelet('re', 176, 126, 186, 140, 0, { n: 12, h: 3, hs: 4.6, w: 1, sw: 0.8, eclat: [[184, 136, 2.6]] })}
${phTampon(10, 210, 'JEU. 21:12 · « les meufs 🍕 »')}`
  ),
  // 8. pendant que Célestine est aux toilettes : Emma, le sac sur les genoux
  resto2: phSvg(
    'r2',
    `<rect width="320" height="220" fill="#3a1c14"/>
${Array.from({ length: 6 }, (_, r) => Array.from({ length: 9 }, (_, i) => `<rect x="${i * 38 + (r % 2) * 19 - 10}" y="${r * 20}" width="34" height="16" rx="2" fill="#6a2e1e" opacity="${0.5 + ((i + r) % 3) * 0.12}"/>`).join('')).join('')}
${Array.from({ length: 6 }, (_, i) => `<circle cx="${i * 60 + 20}" cy="${18 + (i % 2) * 6}" r="11" fill="#ffcf70" opacity=".25" filter="url(#r2fl)"/><circle cx="${i * 60 + 20}" cy="${18 + (i % 2) * 6}" r="3" fill="#ffe7a8"/>`).join('')}
<g transform="translate(236 104)"><rect x="-26" y="-10" width="52" height="80" rx="6" fill="#5a3320"/><rect x="-30" y="66" width="60" height="10" rx="3" fill="#4a2a18"/><path d="M-22 -6 Q-30 30 -18 70 L18 70 Q26 30 22 -6 Q0 4 -22 -6Z" fill="#c0233a"/><path d="M-6 -2 L-2 70 M8 -2 L4 70" stroke="#8a1a2a" stroke-width="1.6"/><text x="0" y="-16" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="10" fill="#ffe0b0">la chaise de Célestine</text></g>
${phPerso('r2', 96, 76, 1.08, { qui: 'emma', haut: '#5a3a7a' })}
<path d="M44 140 L148 140 L150 150 L42 150Z" fill="#4a2f52"/>
<g transform="translate(98 150)"><path d="M-44 -6 L44 -6 L38 46 L-38 46Z" fill="#2f2523"/><path d="M-44 -6 L44 -6 L42 6 L-42 6Z" fill="#43342f"/><path d="M-24 -6 C-22 -36 22 -36 24 -6" fill="none" stroke="#2f2523" stroke-width="5"/><rect x="-10" y="16" width="20" height="13" rx="2" fill="#3e302c" stroke="#c9a45a"/><path d="M-30 -6 Q-20 -18 -6 -10" fill="none" stroke="#f48fb5" stroke-width="7" stroke-linecap="round"/><text x="0" y="40" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="8" font-weight="700" fill="#ffe0b0">sac de Célestine</text></g>
${phBras(66, 120, 62, 146, '#f3d2b8', '#5a3a7a', 9)}${phBras(126, 120, 150, 134, '#f3d2b8', '#5a3a7a', 9)}
<path d="M150 150 L320 150 L320 220 L150 220Z" fill="#7a4a2a"/><path d="M150 150 L320 150" stroke="#9a6a44" stroke-width="3"/><path d="M150 150 L150 220" stroke="#5a3420" stroke-width="3"/>
<g transform="translate(192 162)"><rect x="-22" y="-8" width="44" height="18" rx="8" fill="#1c1c1c"/><path d="M-22 -8 Q0 -24 22 -8" fill="#333" stroke="#111"/><g fill="#cfeaff88" stroke="#222" stroke-width="2"><circle cx="-8" cy="1" r="6"/><circle cx="8" cy="1" r="6"/></g><path d="M-2 1 h4" stroke="#222" stroke-width="2"/></g>
<g transform="translate(160 136) rotate(-12)"><rect x="-10" y="-18" width="20" height="36" rx="4" fill="#111"/><rect x="-8" y="-15" width="16" height="28" rx="2" fill="#e8f6ff"/><text x="0" y="-5" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="7.5" font-weight="800" fill="#1a5a8a">E</text><text x="0" y="3" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="5" font-weight="700" fill="#1a5a8a">F P</text><text x="0" y="9" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="3" font-weight="700" fill="#1a5a8a">T O Z</text></g>
<g transform="translate(270 186)"><ellipse cx="0" cy="6" rx="40" ry="9" fill="#000" opacity=".3"/><ellipse cx="0" cy="0" rx="36" ry="8" fill="#d8d8d8"/><path d="M-30 -1 L0 -6 L28 0 L0 6Z" fill="#e0a040"/><path d="M-24 -1 L0 -4 L22 0 L0 4Z" fill="#d9472e"/></g>
${phTampon(10, 210, 'JEU. 21:40 · chaise vide 👀')}`
  ),
  // 9. la photo du TP : Nora tient la trousse rose
  tp: phSvg(
    'tp',
    `<rect width="320" height="220" fill="#e8eef2"/>
${Array.from({ length: 4 }, (_, i) => `<rect x="${12 + i * 78}" y="10" width="68" height="70" rx="2" fill="#bcd8ea"/><path d="M${12 + i * 78} 45 h68 M${46 + i * 78} 10 v70" stroke="#fff" stroke-width="3"/><path d="M${18 + i * 78} 70 L${60 + i * 78} 16" stroke="#fff" stroke-width="6" opacity=".35"/>`).join('')}
<rect x="0" y="84" width="320" height="8" fill="#cfd8de"/>
${phPerso('tp', 80, 98, 1.0, { qui: 'eya', haut: '#ffffff', blouse: 1 })}
${phPerso('tp', 196, 92, 1.14, { qui: 'nora', haut: '#ffffff', blouse: 1, lunettes: 'labo' })}
<path d="M0 150 L320 150 L320 220 L0 220Z" fill="#2a3440"/><path d="M0 150 L320 150" stroke="#46566a" stroke-width="3"/>
${phBras(170, 132, 150, 150, '#c98e64', '#ffffff', 10)}${phBras(222, 132, 196, 156, '#c98e64', '#ffffff', 10)}
<g transform="translate(172 152) rotate(-8)"><rect x="-30" y="-11" width="60" height="22" rx="10" fill="#f48fb5"/><rect x="-30" y="-11" width="60" height="9" rx="7" fill="#f9b4cd"/><path d="M-24 0 h48" stroke="#b9577e" stroke-width="1.6" stroke-dasharray="2 1.2"/><text x="0" y="8.5" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-size="7" fill="#fff">Célestine</text></g>
${[
  [40, 172, '#9be0b0'],
  [70, 176, '#ffd76b'],
  [256, 170, '#a8c8ff'],
  [286, 176, '#ffb0c8']
]
  .map(
    ([a, b, c]) =>
      `<g transform="translate(${a} ${b})"><path d="M-6 -24 v12 L-14 10 Q-14 16 -8 16 h16 Q14 16 14 10 L6 -12 v-12Z" fill="#e8f6ff" opacity=".85" stroke="#9cc8e0"/><path d="M-11 4 L11 4 L14 10 Q14 16 8 16 h-16 Q-14 16 -14 10Z" fill="${c}"/><rect x="-7" y="-27" width="14" height="4" rx="1" fill="#9cc8e0"/></g>`
  )
  .join('')}
<g transform="translate(120 186)"><rect x="-26" y="-4" width="52" height="10" rx="2" fill="#c9d3da"/>${[-18, -6, 6, 18].map(a => `<rect x="${a - 2.5}" y="-28" width="5" height="26" rx="2" fill="#e8f6ff" stroke="#9cc8e0" stroke-width=".8"/><rect x="${a - 2.5}" y="-12" width="5" height="10" rx="2" fill="#ff8fb8" opacity=".8"/>`).join('')}</g>
${phTampon(312, 210, 'VEN. 8:50 · TP SALLE 214', 'end')}`
  ),
  // 10. le selfie du vendredi matin, 7 h 51 (le bracelet brille dans le vide-poche)
  snap: phSvg(
    'sp',
    `<rect width="320" height="220" fill="#eef3f4"/>
${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 40} 0 V220" stroke="#d7e1e4" stroke-width="2"/>`).join('')}${Array.from({ length: 7 }, (_, i) => `<path d="M0 ${i * 32} H320" stroke="#d7e1e4" stroke-width="2"/>`).join('')}
<rect x="196" y="74" width="124" height="10" fill="#f7f7f5"/><rect x="196" y="84" width="124" height="4" fill="#c9d3d6"/>
<g transform="translate(262 74)"><path d="M-24 -4 Q-23 4 0 4 Q23 4 24 -4Z" fill="#f2c6d3"/><ellipse cx="0" cy="-4" rx="24" ry="5" fill="#f7d7e0" stroke="#d9a3b3" stroke-width="1"/>${phBracelet(
      'sp',
      -14,
      -6,
      14,
      -6,
      3,
      {
        n: 14,
        h: 3,
        hs: 4,
        w: 0.9,
        sw: 0.7,
        eclat: [
          [2, -4, 4.2],
          [-8, -5, 2.4]
        ]
      }
    )}</g>
<g transform="translate(222 74)"><rect x="-6" y="-24" width="12" height="24" rx="3" fill="#bcdaf0"/><rect x="-2" y="-36" width="2" height="16" fill="#4fb0e8"/></g><g transform="translate(304 74)"><rect x="-5" y="-20" width="10" height="20" rx="3" fill="#f3c6a0"/></g>
${phPerso('sp', 112, 104, 1.5, { qui: 'celestine', haut: '#c9a27a' })}
<path d="M64 196 L64 220 M160 196 V220" stroke="#a8825e" stroke-width="2"/><path d="M98 150 L112 200 L126 150" fill="none" stroke="#a8825e" stroke-width="2"/>
${phBras(150, 170, 166, 112, '#f3cfb3', '#c9a27a', 13)}
<g transform="translate(168 98) rotate(8)"><rect x="-15" y="-27" width="30" height="54" rx="6" fill="#1a1a1a"/><rect x="-12" y="-24" width="24" height="48" rx="4" fill="#2a2a2a"/><circle cx="-6" cy="-18" r="3.4" fill="#111" stroke="#555"/><circle cx="-6" cy="-18" r="1.4" fill="#3a6aa8"/></g>
<rect x="0" y="0" width="320" height="220" fill="#fff" opacity=".06"/>
<rect x="0" y="150" width="320" height="22" fill="#0007"/><text x="160" y="166" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="12" font-weight="700" fill="#fff">en retard 😭</text>
${phTampon(312, 16, 'VEN. 7:51', 'end')}`
  ),
  // 11. l'agrandissement ×8 du Dr Rodolphe
  zoom: phSvg(
    'zm',
    `<rect width="320" height="220" fill="#1d2a33"/>
${Array.from({ length: 17 }, (_, i) => `<path d="M${i * 20} 0 V220" stroke="#2c3e4a" stroke-width="1"/>`).join('')}${Array.from({ length: 12 }, (_, i) => `<path d="M0 ${i * 20} H320" stroke="#2c3e4a" stroke-width="1"/>`).join('')}
<circle cx="150" cy="112" r="96" fill="#f7d7e0"/><circle cx="150" cy="112" r="96" fill="url(#zmgl)" opacity=".25"/>
<clipPath id="zmcl"><circle cx="150" cy="112" r="96"/></clipPath><ellipse cx="150" cy="150" rx="140" ry="40" fill="#fbe9ee" stroke="#d9a3b3" stroke-width="5" clip-path="url(#zmcl)"/>
<g>${phBracelet('zm', 74, 92, 226, 92, 28, { n: 40, h: 5, hs: 19, w: 3, sw: 1.8, recolle: 2 })}</g>
<circle cx="150" cy="112" r="96" fill="none" stroke="#c9d6de" stroke-width="7"/><circle cx="150" cy="112" r="102" fill="none" stroke="#7d8e99" stroke-width="3"/>
<g font-family="'Courier New',monospace" font-size="10" fill="#9fe8ff" font-weight="700"><path d="M226 92 L262 58" stroke="#9fe8ff" stroke-width="1.2"/><text x="264" y="56">FERMOIR</text><path d="M190 120 L262 134" stroke="#9fe8ff" stroke-width="1.2"/><text x="264" y="132">5 CŒURS</text><text x="264" y="144">ROSES</text><path d="M154 128 L250 178" stroke="#ffb347" stroke-width="1.2"/><text x="252" y="184" fill="#ffb347">trace de</text><text x="252" y="196" fill="#ffb347">colle ?</text></g>
${phTampon(8, 16, 'LABO · ×8 · VIDE-POCHE · 7:51')}
<g transform="translate(26 196)"><path d="M0 0 h50 M0 -4 v8 M50 -4 v8" stroke="#9fe8ff" stroke-width="1.5"/><text x="25" y="-6" text-anchor="middle" font-family="'Courier New',monospace" font-size="8" fill="#9fe8ff">1 cm</text></g>`
  )
};
/* ---------- les pièces du dossier ---------- */
const PIECES = [
  {
    id: 'p_main',
    d: 1,
    ic: '📄',
    src: 'Commissariat du 8e',
    t: 'Main courante',
    k: 'pv',
    sum: 'Célestine pense avoir rangé le bracelet dans sa trousse vendredi. Dimanche soir, il n’y est plus.',
    body: [
      'MAIN COURANTE · n° 2026/8e/12-018 · mardi 1er décembre 2026, 8 h 40',
      'Déclarante : Célestine, étudiante en pharmacie, Lyon 8e.',
      '« J’ai perdu, ou on m’a volé, mon bracelet : une chaîne fine en or avec des petits cœurs roses. Valentin me l’a offert le 24 décembre dernier.',
      'Je l’enlève pour les TP et pour la douche. Vendredi matin, j’avais TP : je l’ai rangé dans ma trousse, comme d’habitude.',
      'Je suis partie le vendredi soir chez mes parents, à Reyrieux. J’ai travaillé samedi à la pharmacie. Dimanche à 21 h 30, en vidant mon sac : plus de bracelet. Ni dans la trousse, ni dans le sac, ni dans le vide-poche. »',
      'Personnes vues dans la semaine : Noémie, Emma, Nora, Erika, Eya, Edgar, Valérie, Sandrine, Valentin.'
    ]
  },
  {
    id: 'p_photos',
    d: 1,
    ic: '📷',
    src: 'Photos de Célestine',
    t: 'Le bracelet, le sac, le vide-poche',
    k: 'photo',
    ph: ['bracelet', 'sac', 'videpoche'],
    cap: ['Le bracelet, le jour où Valentin l’a offert', 'Le sac vidé, dimanche soir', 'Le vide-poche de la salle de bain'],
    sum: 'Le bracelet ; le sac vidé ; le vide-poche vide.'
  },
  {
    id: 'p_agenda',
    d: 2,
    ic: '🗓️',
    src: 'Agenda de Célestine',
    t: 'Sa semaine',
    k: 'tab',
    cols: ['Quand', 'Quoi', 'Avec qui'],
    rows: [
      ['Lun. 23 · 8 h → 12 h', 'Cours de pharmacologie', 'La promo'],
      ['Lun. 23 · 12 h 30', 'Déj au resto U', 'Nora, Eya'],
      ['Lun. 23 · 17 h 30', 'Courses au Carrefour City', '—'],
      ['Lun. 23 · 20 h 30', 'Pâtes et série', 'Valentin'],
      ['Mar. 24 · 8 h → 12 h', 'TD de chimie analytique', 'La promo'],
      ['Mar. 24 · 14 h', 'Appel avec maman', 'Valérie'],
      ['Mar. 24 · 18 h → 19 h 40', 'Ongles chez Noémie', 'Noémie'],
      ['Mar. 24 · 20 h 30', 'Dîner à l’appart', 'Valentin'],
      ['Mer. 25 · 9 h → 12 h', 'Révisions à l’appart', '—'],
      ['Mer. 25 · 13 h', 'Pause à la BU', 'Nora, Erika, Eya'],
      ['Mer. 25 · 16 h', 'Lessive et ménage', '—'],
      ['Mer. 25 · 19 h', 'Pilates', '—'],
      ['Mer. 25 · 21 h', 'Soirée film', 'Valentin'],
      ['Jeu. 26 · 8 h → 12 h', 'Cours de galénique', 'La promo'],
      ['Jeu. 26 · 14 h', 'Poste : renvoyer un colis Vinted', '—'],
      ['Jeu. 26 · 17 h', 'Café', 'Erika'],
      ['Jeu. 26 · 20 h → 23 h', 'Resto', 'Emma, Noémie'],
      ['Ven. 27 · 7 h 30', 'Réveil (en retard)', '—'],
      ['Ven. 27 · 8 h 30 → 12 h 30', 'TP', 'Nora, Erika, Eya'],
      ['Ven. 27 · 13 h', 'Déj rapide à la fac', 'Nora, Erika'],
      ['Ven. 27 · 15 h', 'Sieste', '—'],
      ['Ven. 27 · soir → dim. 29', 'Week-end à Reyrieux', 'Valérie, Edgar'],
      ['Sam. 28 · 9 h → 19 h', 'Pharmacie', 'Sandrine'],
      ['Sam. 28 · 20 h', 'Raclette en famille', 'Valérie, Edgar'],
      ['Dim. 29 · 11 h', 'Grasse mat’ et brunch', 'Valérie, Edgar'],
      ['Dim. 29 · 15 h', 'Balade au bord de la Saône', 'Valérie'],
      ['Dim. 29 · 20 h 10', 'Retour à l’appart', '—']
    ],
    sum: 'Toute sa semaine, du lundi au dimanche.',
    ev: [
      ['241800', 'Mar. 24 · 18 h', 'Ongles chez Noémie'],
      ['262000', 'Jeu. 26 · 20 h', 'Resto avec Emma et Noémie'],
      ['270830', 'Ven. 27 · 8 h 30', 'TP à la fac'],
      ['280900', 'Sam. 28 · 9 h → 19 h', 'Pharmacie avec Sandrine']
    ]
  },
  {
    id: 'p_storyn',
    d: 3,
    ic: '📸',
    src: 'Instagram de Noémie',
    t: 'Story « Prête pour le gel »',
    k: 'photo',
    ph: ['storyn'],
    cap: ['Mardi 18 h 05. Sur la table de Noémie, à côté des flacons : le bracelet.'],
    sum: 'Mardi 18 h 05, le bracelet est posé sur la table de Noémie.',
    ev: [['241805', 'Mar. 24 · 18 h 05', 'Le bracelet est sur la table de Noémie']]
  },
  {
    id: 'p_ongles',
    d: 4,
    ic: '💅',
    src: 'Instagram de Noémie',
    t: 'Les ongles finis',
    k: 'photo',
    ph: ['ongles'],
    cap: ['Mardi 19 h 40. Les ongles de Célestine… et le bracelet de nouveau au poignet.'],
    sum: 'Mardi 19 h 40, le bracelet est de retour au poignet.',
    ev: [['241940', 'Mar. 24 · 19 h 40', 'Le bracelet est de retour au poignet']]
  },
  {
    id: 'p_bu',
    d: 5,
    ic: '🤳',
    src: 'Snapchat d’Erika',
    t: 'Selfie à la BU',
    k: 'photo',
    ph: ['bu'],
    cap: ['Mercredi 13 h, BU Rockefeller. Au poignet de Célestine : l’éclat rose du bracelet.'],
    sum: 'Mercredi 13 h, le bracelet est au poignet.',
    ev: [['251300', 'Mer. 25 · 13 h', 'Bracelet au poignet à la BU']]
  },
  {
    id: 'p_resto',
    d: 6,
    ic: '🍕',
    src: 'Photo d’Emma',
    t: 'Le resto de jeudi',
    k: 'photo',
    ph: ['resto'],
    cap: ['Jeudi 21 h 12. Les trois, une pizza, et le bracelet au poignet de Célestine.'],
    sum: 'Jeudi 21 h 12, le bracelet est au poignet.',
    ev: [['262112', 'Jeu. 26 · 21 h 12', 'Bracelet au poignet au resto']]
  },
  {
    id: 'p_resto2',
    d: 7,
    ic: '📸',
    src: 'Photo de Noémie',
    t: 'Pendant que Célestine est aux toilettes',
    k: 'photo',
    ph: ['resto2'],
    cap: ['Jeudi 21 h 40. Emma, le sac de Célestine sur les genoux, un étui à lunettes ouvert devant elle.'],
    sum: 'Jeudi 21 h 40, Emma a le sac de Célestine sur les genoux.',
    ev: [['262140', 'Jeu. 26 · 21 h 40', 'Emma tient le sac de Célestine']]
  },
  {
    id: 'p_valerie',
    d: 9,
    ic: '💬',
    src: 'Téléphone de Célestine',
    t: 'Message de Valérie',
    k: 'sms',
    who: 'Maman 💛',
    m: [
      ['d', 'Sam. 28 nov.'],
      ['them', '08:12', 'Ma chérie, Edgar a pris 20 € dans ton porte-monnaie hier soir, il te les rend 🙄'],
      ['them', '08:13', 'J’ai rangé ton sac dans ta chambre, il traînait dans l’entrée'],
      ['me', '08:40', 'PARDON ?? 😤']
    ],
    sum: 'Edgar a pris 20 € dans le porte-monnaie vendredi soir. Valérie a rangé le sac samedi matin.'
  },
  {
    id: 'p_regle',
    d: 10,
    ic: '📋',
    src: 'Fac de pharma Lyon 1',
    t: 'Règlement des TP',
    k: 'doc',
    rows: [
      ['Bijoux', 'Interdits pendant les manipulations'],
      ['Où les ranger', 'Dans son sac ou sa trousse, avant d’entrer'],
      ['Vendredi 27', 'TP de 8 h 30 à 12 h 30, salle 214'],
      ['Présents', 'Célestine, Nora, Erika, Eya (partie à 11 h 30)']
    ],
    sum: 'Pourquoi Célestine est sûre d’avoir rangé le bracelet dans sa trousse.'
  },
  {
    id: 'p_kebab',
    d: 11,
    ic: '🧾',
    src: 'Ticket de caisse',
    t: 'Le tacos de Reyrieux',
    k: 'doc',
    rows: [
      ['Date', 'Vendredi 27 novembre, 23 h 04'],
      ['Commande', '1 tacos XL poulet, frites, sauce fromagère'],
      ['Payé', '20,00 € en espèces']
    ],
    sum: 'Vendredi 23 h 04, un tacos payé avec un billet de 20 €.'
  },
  {
    id: 'p_smsv',
    d: 12,
    ic: '💬',
    src: 'Téléphone de Célestine',
    t: 'SMS de vendredi matin',
    k: 'sms',
    who: 'Valentin ❤️',
    m: [
      ['d', 'Ven. 27 nov.'],
      ['me', '07:55', 'Trop en retard, j’y vais 😭'],
      ['them', '07:56', 'Courage pour le TP nulos ❤️'],
      ['them', '08:05', 'Je pars aussi, j’ai fermé à clé 🔑']
    ],
    sum: 'Célestine part à 7 h 55. Valentin part à 8 h 05 et ferme à clé.',
    ev: [
      ['270755', 'Ven. 27 · 7 h 55', 'Célestine quitte l’appart'],
      ['270805', 'Ven. 27 · 8 h 05', 'Valentin quitte l’appart et ferme à clé']
    ]
  },
  {
    id: 'p_tp',
    d: 13,
    ic: '🧪',
    src: 'Snapchat d’Erika',
    t: 'Photo de TP',
    k: 'photo',
    ph: ['tp'],
    cap: ['Vendredi 8 h 50. Nora tient la trousse rose de Célestine.'],
    sum: 'Vendredi 8 h 50, Nora tient la trousse de Célestine.',
    ev: [['270850', 'Ven. 27 · 8 h 50', 'Nora tient la trousse de Célestine']]
  },
  {
    id: 'p_sandrine',
    d: 14,
    ic: '💬',
    src: 'Téléphone de Célestine',
    t: 'Message de Sandrine',
    k: 'sms',
    who: 'Sandrine (pharma)',
    m: [
      ['d', 'Sam. 28 nov.'],
      ['them', '14:02', 'J’ai pris un peu de ta crème pour les mains 🙈 la mienne est vide'],
      ['me', '14:30', 'Pas de souci 😘']
    ],
    sum: 'Samedi 14 h, Sandrine a ouvert le casier de Célestine.'
  },
  {
    id: 'p_snap',
    d: 16,
    ic: '👻',
    src: 'Souvenirs Snapchat de Célestine',
    t: 'Selfie du vendredi matin',
    k: 'photo',
    ph: ['snap'],
    cap: [
      'Vendredi 7 h 51, dans le miroir de la salle de bain : « en retard 😭 ». Au fond, sur l’étagère, dans le vide-poche… un éclat doré et rose.'
    ],
    sum: 'Vendredi 7 h 51, juste avant de partir : quelque chose de doré et rose brille dans le vide-poche.',
    ev: [['270751', 'Ven. 27 · 7 h 51', 'Selfie : un éclat doré et rose dans le vide-poche']]
  },
  {
    id: 'p_cles',
    d: 17,
    ic: '🔑',
    src: 'Vérifications de Gérald',
    t: 'Qui entre à l’appart',
    k: 'doc',
    rows: [
      ['Clés de l’appartement', '2 : Célestine, Valentin'],
      ['Fenêtres', 'Barreaux et volets, sur cour'],
      ['Vendredi 8 h 05 → dimanche 20 h 10', 'Aucune entrée, aucune trace'],
      ['Dimanche 20 h 10', 'Retour de Célestine'],
      ['Dimanche 21 h 15', 'Retour de Valentin']
    ],
    sum: 'Après le départ de Valentin vendredi 8 h 05, personne n’entre avant le retour de Célestine.',
    ev: [
      ['292010', 'Dim. 29 · 20 h 10', 'Célestine rentre à l’appart'],
      ['292130', 'Dim. 29 · 21 h 30', 'Plus de bracelet nulle part']
    ]
  },
  {
    id: 'p_zoom',
    d: 18,
    ic: '🔬',
    src: 'Dr Rodolphe, police scientifique',
    t: 'Agrandissement du selfie',
    k: 'photo',
    ph: ['zoom'],
    cap: [
      'Agrandissement ×8 du vide-poche : une chaîne dorée, un fermoir, cinq petits cœurs roses. Note : « C’est le bracelet. À 7 h 51, il n’était pas dans la trousse. »'
    ],
    sum: 'Le Dr Rodolphe confirme : vendredi 7 h 51, le bracelet est dans le vide-poche.'
  },
  {
    id: 'p_eya',
    d: 20,
    ic: '💬',
    src: 'Message d’Eya',
    t: 'Ce qu’Eya a vu',
    k: 'sms',
    who: 'Eya (fac)',
    m: [
      ['d', 'Dim. 20 déc.'],
      ['them', '19:12', 'Je voulais rien dire parce que j’avais séché… mais vendredi midi j’étais à Bellecour'],
      ['them', '19:12', 'Et j’ai vu Valentin sortir d’une petite boutique, vers 12 h 35. Il avait l’air de cacher un truc 👀']
    ],
    sum: 'Vendredi 12 h 35, Eya voit Valentin sortir d’une petite boutique à Bellecour.',
    ev: [['271235', 'Ven. 27 · 12 h 35', 'Eya voit Valentin sortir d’une boutique à Bellecour']]
  },
  {
    id: 'p_valerie2',
    d: 21,
    ic: '✉️',
    src: 'Lettre de Valérie',
    t: 'Le sac rangé',
    k: 'lettre',
    body: [
      'Lieutenant,',
      'Samedi matin, j’ai rangé le sac de ma fille, qui traînait dans l’entrée. Je le connais par cœur, je le range depuis qu’elle a 12 ans.',
      'Dedans : sa trousse rose, son porte-monnaie (moins 20 €, merci Edgar), ses clés et un paquet de mouchoirs.',
      'Aucun bijou. Je l’aurais vu, je l’aurais mis de côté.',
      'Valérie'
    ],
    sum: 'Samedi matin, il n’y a aucun bijou dans le sac.'
  },
  /* aveux */
  {
    id: 'a4',
    a: 4,
    ic: '🗣️',
    src: 'Audition de Noémie',
    t: 'Aveux · Noémie',
    k: 'aveu',
    who: 'noemie',
    body: '« Bon… je t’ai fait l’enlever pour le gel. Et je l’ai fait tomber. Un petit cœur s’est ébréché, je l’ai recollé à la colle à ongles. Pardon ! Mais je te l’ai remis au poignet à 19 h 40, juré. »',
    sum: 'Elle a ébréché un cœur et l’a recollé. Le bracelet est rendu mardi à 19 h 40.'
  },
  {
    id: 'a8',
    a: 8,
    ic: '🗣️',
    src: 'Audition d’Emma',
    t: 'Aveux · Emma',
    k: 'aveu',
    who: 'emma',
    body: '« Ok, j’ai pris ton sac. J’ai sorti tes lunettes pour tester tes verres avec mon appli : je voulais t’en offrir des nouvelles pour Noël. Ta correction a bougé, d’ailleurs. Et ton bracelet, tu l’avais au poignet, en face de moi. »',
    sum: 'Elle testait ses lunettes. Le bracelet était au poignet de Célestine pendant ce temps.'
  },
  {
    id: 'a11',
    a: 11,
    ic: '🗣️',
    src: 'Audition d’Edgar',
    t: 'Aveux · Edgar',
    k: 'aveu',
    who: 'edgar',
    body: '« J’avoue : 20 balles pour un tacos. Mais j’ai retourné TOUT ton sac pour trouver le porte-monnaie. La trousse, les poches, tout. Il n’y avait aucun bracelet, j’en suis sûr. »',
    sum: 'Vendredi soir, il a vidé tout le sac : aucun bracelet.',
    ev: [['272250', 'Ven. 27 · 22 h 50', 'Edgar vide le sac : aucun bracelet']]
  },
  {
    id: 'a15',
    a: 15,
    ic: '🗣️',
    src: 'Audition de Nora',
    t: 'Aveux · Nora',
    k: 'aveu',
    who: 'nora',
    body: '« Oui, j’ai pris ta trousse à 8 h 45 pour ton correcteur… et j’ai copié tes résultats, pardon. Mais je te jure, il n’y avait pas de bracelet dedans. Juste des stylos et ton surligneur rose. »',
    sum: 'Vendredi 8 h 45, la trousse était déjà sans bracelet.',
    ev: [['270845', 'Ven. 27 · 8 h 45', 'Nora ouvre la trousse : pas de bracelet']]
  },
  {
    id: 'a19',
    a: 19,
    ic: '🗣️',
    src: 'Audition de Sandrine',
    t: 'Aveux · Sandrine',
    k: 'aveu',
    who: 'sandrine',
    body: '« D’accord, j’ai ouvert ton casier pour ta crème. Mais il n’y avait que ton sac et ton manteau. Pas de bijou, rien qui brille. »',
    sum: 'Samedi, aucun bracelet dans le casier.'
  },
  {
    id: 'a22',
    a: 22,
    ic: '🗣️',
    src: 'Audition de Valentin',
    t: 'Déclaration · Valentin',
    k: 'aveu',
    who: 'valentin',
    body: '« Ah… si, je suis passé récupérer un truc à Bellecour. Un truc pour moi. Rien à voir. »',
    sum: 'Valentin reconnaît s’être arrêté dans une boutique à Bellecour.'
  }
];
/* ---------- les auditions ---------- */
const AUD = {
  4: {
    who: 'noemie',
    ic: '💅',
    n: 'Noémie',
    dec: [
      'Mardi, on a fait tes ongles chez moi, de 18 h à 19 h 40.',
      'Pendant les ongles, tu as gardé ton bracelet au poignet.',
      'Je t’ai fait un baby pink, comme tu voulais.',
      'Jeudi, on était au resto avec Emma.'
    ],
    lie: 1,
    ok: ['p_storyn'],
    gain: 'a4'
  },
  8: {
    who: 'emma',
    ic: '👁️',
    n: 'Emma',
    dec: [
      'Jeudi, on était au resto à trois, avec Noémie.',
      'Tu es allée aux toilettes vers 21 h 40.',
      'Ton sac ? Je n’y ai pas touché de la soirée.',
      'On a partagé une pizza, comme d’habitude.'
    ],
    lie: 2,
    ok: ['p_resto2'],
    gain: 'a8'
  },
  11: {
    who: 'edgar',
    ic: '🌯',
    n: 'Edgar',
    dec: [
      'Vendredi soir, j’étais chez les parents à Reyrieux.',
      'Ton sac est resté dans l’entrée tout le week-end.',
      'Je n’ai pas touché à ton sac de tout le week-end.',
      'Samedi matin, Maman l’a rangé dans ta chambre.'
    ],
    lie: 2,
    ok: ['p_valerie', 'p_kebab'],
    gain: 'a11'
  },
  15: {
    who: 'nora',
    ic: '🧪',
    n: 'Nora',
    dec: [
      'Vendredi, on avait TP de 8 h 30 à 12 h 30.',
      'J’étais juste à côté de toi, sur la paillasse.',
      'Ta trousse ? Je ne l’ai jamais ouverte.',
      'Eya est partie avant la fin, vers 11 h 30.'
    ],
    lie: 2,
    ok: ['p_tp'],
    gain: 'a15'
  },
  19: {
    who: 'sandrine',
    ic: '💊',
    n: 'Sandrine',
    dec: [
      'Samedi, on était ensemble de 9 h à 19 h.',
      'Ton sac était dans ton casier, au vestiaire.',
      'Ton casier, je ne l’ai jamais ouvert.',
      'On a eu un rush terrible vers 17 h.'
    ],
    lie: 2,
    ok: ['p_sandrine'],
    gain: 'a19'
  },
  22: {
    who: 'valentin',
    ic: '💼',
    n: 'Valentin',
    dec: [
      'Vendredi, je suis parti de l’appart vers 8 h 05.',
      'J’ai travaillé jusqu’à 12 h.',
      'À midi, je ne me suis arrêté nulle part, j’ai juste changé de métro à Bellecour.',
      'Le week-end, j’étais à Écully et au magasin à Caluire.'
    ],
    lie: 2,
    ok: ['p_eya'],
    gain: 'a22'
  }
};
const CLUES = PIECES.map(p => [p.id, p.ic, p.src, p.t, p.sum]);
const MEF = [];
const pcOn = p => (p.a ? !!(S.aud || {})[p.a] : p.d <= 0 || (S.opened || []).includes(p.d) || (S.demOn && p.d <= 24));
function clueOn(c) {
  const p = PIECES.find(x => x.id == c[0]);
  return !!p && pcOn(p);
}
