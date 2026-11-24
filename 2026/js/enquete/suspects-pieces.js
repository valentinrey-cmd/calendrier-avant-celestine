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
    d: 'Amie de lycée de Célestine. Mardi, le bracelet est resté une heure sur sa table.',
    dep: '« Pendant les ongles, tu as gardé ton bracelet au poignet. Je n’y ai pas touché. »',
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
    d: 'Amie de lycée de Célestine. Jeudi, elle avait son sac sur les genoux.',
    dep: '« Ton sac ? Je n’y ai pas touché de la soirée. »',
    a: 'Pendant qu’elle avait le sac, le bracelet était au poignet de Célestine.'
  },
  {
    id: 'nora',
    n: 'Nora',
    img: 'nora',
    r: 'Copine de fac (pharma)',
    tr: ['🧪 Au TP vendredi matin', '📚 Toujours à la BU'],
    d: 'Copine de promo. Elle était juste à côté de Célestine au TP du vendredi.',
    dep: '« Ta trousse ? Je ne l’ai jamais ouverte. »',
    a: 'À 8 h 45, la trousse était déjà vide.'
  },
  {
    id: 'erika',
    n: 'Erika',
    img: 'erika',
    r: 'Copine de fac (pharma)',
    tr: ['🤳 Prend des photos de tout', '🧪 Au TP vendredi matin'],
    d: 'Copine de promo. Ses photos ont souvent un temps d’avance.',
    dep: '« J’ai rien vu, j’étais concentrée sur ma manip. »',
    a: 'Ses photos montrent tout le monde… sauf elle près du sac.'
  },
  {
    id: 'eya',
    n: 'Eya',
    img: 'eya',
    r: 'Copine de fac (pharma)',
    tr: ['🛍️ Adore Bellecour', '🧪 A quitté le TP en avance vendredi'],
    d: 'Copine de promo. Vendredi, elle est partie du TP avant tout le monde.',
    dep: '« Vendredi après-midi, j’étais à la BU. »',
    a: 'Elle était à Bellecour… et c’est elle qui a vu quelque chose.'
  },
  {
    id: 'edgar',
    n: 'Edgar',
    img: 'edgar',
    r: 'Le grand frère de Célestine',
    tr: ['🏠 Chez sa mère, Valérie, à Reyrieux', '🌯 Fan de tacos', '🥂 Le roi des toasts', '🛫 Agence de location à Saint-Exupéry'],
    d: 'Deux ans de plus que Célestine. Le sac est resté tout le week-end dans l’entrée de sa maison.',
    dep: '« Ton sac ? Je n’y ai pas touché de tout le week-end. »',
    a: 'Il a vidé tout le sac vendredi soir : il n’y avait déjà plus de bracelet.'
  },
  {
    id: 'parents',
    n: 'Valérie',
    img: 'parents',
    r: 'La mère de Célestine',
    tr: ['🏡 Reyrieux', '🧺 Range tout ce qui traîne'],
    d: 'Elle a accueilli Célestine tout le week-end et a rangé son sac samedi matin.',
    dep: '« J’ai juste rangé ton sac dans ta chambre, ma chérie. »',
    a: 'Valérie a rangé le sac samedi : trousse, porte-monnaie, clés, et rien d’autre.'
  },
  {
    id: 'sandrine',
    n: 'Sandrine',
    img: 'sandrine',
    r: 'Collègue à la pharmacie',
    tr: ['💊 Préparatrice à la pharmacie de Reyrieux', '🧴 Toujours les mains sèches'],
    d: 'Collègue du samedi. Elle a ouvert le casier de Célestine.',
    dep: '« Ton casier ? Je ne l’ai jamais ouvert. »',
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
    d: 'Il vit avec elle, donc forcément… Mais il n’a jamais approché le sac de la semaine.',
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
const HEARTS = (x, y, n, s) =>
  Array.from(
    { length: n },
    (_, i) =>
      `<path d="M${x + i * s} ${y} c-3 -4 -8 -1 -5 3 l5 5 l5 -5 c3 -4 -2 -7 -5 -3z" fill="#ff8fb8" stroke="#d94f86" stroke-width=".8"/>`
  ).join('');
const CHAIN = (x1, y1, x2, y2, sag) =>
  `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag} ${x2} ${y2}" fill="none" stroke="#e6b94a" stroke-width="2" stroke-dasharray="3 1.5"/>`;
const PH = {
  bracelet: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#f6efe6"/><rect x="18" y="16" width="124" height="80" rx="6" fill="#7a1f33"/><rect x="24" y="22" width="112" height="68" rx="4" fill="#a83a52"/>${CHAIN(36, 52, 124, 52, 22)}${HEARTS(52, 66, 4, 18)}<rect x="74" y="72" width="10" height="5" rx="2" fill="#e6b94a"/><text x="80" y="104" text-anchor="middle" font-size="7" fill="#7a5a3a">24 déc. 2025 · le cadeau de Valentin</text></svg>`,
  sac: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#d9cfc0"/><path d="M20 40 h70 l-6 56 h-58z" fill="#3a2a2a"/><path d="M36 40 q19 -30 38 0" fill="none" stroke="#3a2a2a" stroke-width="4"/><rect x="96" y="30" width="52" height="20" rx="8" fill="#ff8fb8"/><text x="122" y="44" text-anchor="middle" font-size="7" fill="#fff">trousse</text><rect x="100" y="58" width="36" height="22" rx="4" fill="#5a3a24"/><text x="118" y="72" text-anchor="middle" font-size="6.5" fill="#fff">porte-monnaie</text><g transform="translate(102 86)"><circle r="5" fill="none" stroke="#999" stroke-width="2"/><rect x="4" y="-2" width="16" height="4" fill="#bbb"/></g><text x="56" y="104" text-anchor="middle" font-size="7" fill="#3a2a2a">dim. 29 · 21 h 30 : rien</text></svg>`,
  videpoche: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#e9f0f2"/><rect x="0" y="62" width="160" height="10" fill="#cfd9dd"/><ellipse cx="80" cy="62" rx="34" ry="9" fill="#f7d7e0" stroke="#d9a3b3" stroke-width="2"/><ellipse cx="80" cy="60" rx="26" ry="5" fill="#fbe9ee"/><rect x="20" y="30" width="16" height="32" rx="3" fill="#b9d7e8"/><rect x="124" y="36" width="12" height="26" rx="3" fill="#f3c6a0"/><text x="80" y="96" text-anchor="middle" font-size="7.5" fill="#5a6a72">le vide-poche de la salle de bain, vide</text></svg>`,
  storyn: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#2a1a24"/><rect x="10" y="56" width="140" height="54" fill="#e9dcc8"/>${['#ff4f7b', '#c0233a', '#ffd1dc', '#7a5cff', '#f3c623'].map((c, i) => `<rect x="${20 + i * 14}" y="36" width="9" height="22" rx="2" fill="${c}"/><rect x="${21 + i * 14}" y="30" width="7" height="7" fill="#222"/>`).join('')}${CHAIN(96, 74, 140, 74, 8)}${HEARTS(104, 82, 3, 12)}<rect x="96" y="40" width="44" height="12" rx="3" fill="#a070ff"/><text x="118" y="49" text-anchor="middle" font-size="6.5" fill="#fff">lampe UV</text><text x="8" y="14" font-size="7.5" fill="#fff">noemie.nails · mar. 18 h 05 · « Prête pour le gel ✨ »</text></svg>`,
  ongles: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#f3e6ef"/><path d="M40 110 L58 54 Q80 40 104 54 L118 110Z" fill="#f0c7a4"/>${[52, 66, 80, 94, 108].map((x, i) => `<rect x="${x - 5}" y="${30 + Math.abs(2 - i) * 6}" width="10" height="28" rx="5" fill="#f0c7a4"/><rect x="${x - 4}" y="${30 + Math.abs(2 - i) * 6}" width="8" height="9" rx="4" fill="#ff8fb8"/>`).join('')}${CHAIN(50, 92, 114, 92, 6)}${HEARTS(64, 98, 3, 14)}<text x="6" y="12" font-size="7.5" fill="#7a3a5a">mar. 19 h 40 · « Baby pink 💗 »</text></svg>`,
  bu: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#d8e2ea"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${i * 28}" y="0" width="24" height="44" fill="#9fb3c4"/>`).join('')}${[
    [34, '#e8b4a0', '#3a2a1a'],
    [64, '#f0c8a8', '#d9b36a'],
    [94, '#c98e64', '#1a1a1a'],
    [124, '#e2b18e', '#5a3a24']
  ]
    .map(
      ([x, sk, h]) =>
        `<circle cx="${x}" cy="58" r="12" fill="${sk}"/><path d="M${x - 12} 56 q12 -16 24 0" fill="${h}"/><rect x="${x - 14}" y="70" width="28" height="40" rx="6" fill="#fff"/>`
    )
    .join(
      ''
    )}<path d="M58 84 l-10 10" stroke="#f0c8a8" stroke-width="7" stroke-linecap="round"/>${CHAIN(44, 96, 54, 90, 2)}<circle cx="50" cy="94" r="2.5" fill="#ff8fb8"/><text x="6" y="106" font-size="7" fill="#fff">mer. 13 h · BU Rockefeller</text></svg>`,
  resto: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#4a2418"/><rect x="0" y="70" width="160" height="40" fill="#7a4a2a"/><ellipse cx="80" cy="76" rx="40" ry="8" fill="#f3e2b0"/><circle cx="80" cy="74" r="14" fill="#e0a040"/>${[
    [40, '#f0c8a8', '#d9b36a'],
    [80, '#e8b4a0', '#3a2a1a'],
    [120, '#f0c8a8', '#2a1a10']
  ]
    .map(
      ([x, sk, h]) =>
        `<circle cx="${x}" cy="36" r="11" fill="${sk}"/><path d="M${x - 11} 34 q11 -14 22 0" fill="${h}"/><rect x="${x - 12}" y="47" width="24" height="18" rx="5" fill="#2a3a5a"/>`
    )
    .join(
      ''
    )}<path d="M92 60 l8 10" stroke="#e8b4a0" stroke-width="6" stroke-linecap="round"/>${CHAIN(94, 66, 104, 72, 1)}<circle cx="99" cy="70" r="2.4" fill="#ff8fb8"/><text x="6" y="104" font-size="7" fill="#fff">jeu. 21 h 12 · « les meufs 🍕 »</text></svg>`,
  resto2: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#4a2418"/><rect x="0" y="70" width="160" height="40" fill="#7a4a2a"/><circle cx="58" cy="38" r="12" fill="#f0c8a8"/><path d="M46 36 q12 -16 24 0" fill="#2a1a10"/><rect x="44" y="50" width="28" height="22" rx="5" fill="#5a3a7a"/><path d="M40 70 h40 l-4 26 h-32z" fill="#3a2a2a"/><rect x="80" y="62" width="30" height="12" rx="5" fill="#2a2a2a"/><circle cx="88" cy="68" r="4" fill="none" stroke="#9fd0ff" stroke-width="2"/><circle cx="100" cy="68" r="4" fill="none" stroke="#9fd0ff" stroke-width="2"/><rect x="118" y="30" width="22" height="40" rx="3" fill="#111"/><rect x="120" y="34" width="18" height="30" fill="#4fd1ff"/><text x="6" y="104" font-size="7" fill="#fff">jeu. 21 h 40 · chaise de Célestine vide</text></svg>`,
  tp: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#eef3f6"/><rect x="0" y="66" width="160" height="44" fill="#2a3440"/>${[30, 52, 74].map(x => `<rect x="${x}" y="44" width="10" height="22" rx="3" fill="#cfe6ff" stroke="#7aa0c0"/>`).join('')}<circle cx="118" cy="36" r="12" fill="#c98e64"/><path d="M106 34 q12 -16 24 0" fill="#1a1a1a"/><rect x="104" y="48" width="28" height="22" rx="5" fill="#fff" stroke="#ccc"/><rect x="92" y="56" width="26" height="11" rx="5" fill="#ff8fb8"/><text x="105" y="64" text-anchor="middle" font-size="5.5" fill="#fff">C.</text><text x="6" y="104" font-size="7" fill="#fff">ven. 8 h 50 · TP de chimie analytique</text></svg>`,
  snap: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#e9f0f2"/><rect x="88" y="22" width="60" height="10" fill="#cfd9dd"/><ellipse cx="118" cy="22" rx="18" ry="5" fill="#f7d7e0" stroke="#d9a3b3" stroke-width="1.5"/><path d="M108 21 q10 4 20 0" fill="none" stroke="#e6b94a" stroke-width="1.6" stroke-dasharray="2 1"/><circle cx="114" cy="21" r="1.6" fill="#ff8fb8"/><circle cx="121" cy="22" r="1.6" fill="#ff8fb8"/><circle cx="58" cy="50" r="18" fill="#f0c8a8"/><path d="M40 46 q18 -26 36 0 l2 16 q-20 -8 -40 0Z" fill="#6a3a24"/><circle cx="51" cy="50" r="5" fill="none" stroke="#333" stroke-width="1.6"/><circle cx="65" cy="50" r="5" fill="none" stroke="#333" stroke-width="1.6"/><path d="M30 110 q28 -44 56 0Z" fill="#f2f2f2"/><rect x="70" y="58" width="14" height="24" rx="2" fill="#111"/><rect x="0" y="0" width="160" height="14" fill="#fffc00"/><text x="6" y="10" font-size="7.5" fill="#111">ven. 7 h 51 · « en retard 😭 »</text></svg>`,
  zoom: `<svg viewBox="0 0 160 110"><rect width="160" height="110" fill="#f7d7e0"/><ellipse cx="80" cy="60" rx="70" ry="30" fill="#fbe9ee" stroke="#d9a3b3" stroke-width="3"/>${CHAIN(24, 58, 136, 58, 10)}${HEARTS(42, 66, 5, 20)}<rect x="74" y="64" width="12" height="6" rx="2" fill="#e6b94a"/><circle cx="130" cy="20" r="14" fill="none" stroke="#333" stroke-width="3"/><path d="M140 30 l12 12" stroke="#333" stroke-width="4"/><text x="6" y="104" font-size="7" fill="#7a3a5a">agrandissement ×8 · Dr Rodolphe</text></svg>`
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
      ['Mar. 24 · 18 h', 'Ongles chez Noémie', 'Noémie'],
      ['Mer. 25 · 13 h', 'Pause à la BU', 'Nora, Erika, Eya'],
      ['Jeu. 26 · 20 h', 'Resto', 'Emma, Noémie'],
      ['Ven. 27 · 8 h 30 → 12 h 30', 'TP', 'Nora, Erika, Eya'],
      ['Ven. 27 · soir → dim. 29', 'Reyrieux', 'Valérie, Edgar'],
      ['Sam. 28 · 9 h → 19 h', 'Pharmacie', 'Sandrine'],
      ['Tous les soirs de semaine', 'À l’appart', 'Valentin']
    ],
    sum: 'La liste des moments où quelqu’un a pu approcher le bracelet.',
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
    src: 'Audition de Valentin (témoin)',
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
