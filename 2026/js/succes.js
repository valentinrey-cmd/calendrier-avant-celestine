/* ---------- Succès ---------- */
const ACHS = [
  { g: 'Boss', id: 'boss4', ic: '💅', n: 'Vernis craquelé', d: 'Fais craquer Noémie en audition (jour 4).', t: 'M' },
  { g: 'Boss', id: 'boss8', ic: '👁️', n: 'Dix dixièmes', d: 'Réussis le test de vue d’Emma (jour 8).', t: 'M' },
  { g: 'Boss', id: 'boss11', ic: '🌯', n: 'Sauce fromagère', d: 'Sers 6 tacos parfaits à Edgar (jour 11).', t: 'M' },
  { g: 'Boss', id: 'boss15', ic: '📚', n: 'Major de promo', d: 'Bats Nora à ses fiches de révision (jour 15).', t: 'M' },
  { g: 'Boss', id: 'boss19', ic: '💊', n: 'Rush du samedi', d: 'Tiens le comptoir de la pharmacie avec Sandrine (jour 19).', t: 'M' },
  { g: 'Boss', id: 'boss22', ic: '🚇', n: 'Correspondance', d: 'Rattrape Valentin dans le métro Bellecour (jour 22).', t: 'M' },
  { g: 'Boss', id: 'bossV', ic: '💘', n: 'Vaincu par amour', d: 'Accuse le bon coupable et bats le boss final.', t: 'L', s: 1 },
  {
    g: 'Aventure',
    id: 'histoire',
    ic: '📖',
    n: 'Affaire classée',
    d: 'Termine toute l’histoire, du prologue à l’épilogue.',
    t: 'L',
    s: 1,
    c: () => !!(S.story || {}).epi
  },
  {
    g: 'Aventure',
    id: 'first_case',
    ic: '🎄',
    n: 'Premier pas',
    d: 'Ouvre ta première case du calendrier.',
    t: 'F',
    c: () => S.opened.length >= 1
  },
  { g: 'Aventure', id: 'win5', ic: '🏅', n: 'Bonne élève', d: 'Réussis 5 jeux.', t: 'F', p: () => [achWins(), 5] },
  { g: 'Aventure', id: 'win12', ic: '🎖️', n: 'Ça devient sérieux', d: 'Réussis 12 jeux.', t: 'M', p: () => [achWins(), 12] },
  { g: 'Aventure', id: 'win24', ic: '👑', n: "Reine de l'Avent", d: 'Réussis les 24 jeux.', t: 'D', p: () => [achWins(), 24] },
  {
    g: 'Aventure',
    id: 'firsttry5',
    ic: '🎯',
    n: 'Du premier coup',
    d: 'Réussis 5 jeux sans aucun échec.',
    t: 'M',
    p: () => [Object.values(S.days).filter(x => x.done && !x.lost && !x.fails).length, 5]
  },
  {
    g: 'Aventure',
    id: 'flame3',
    ic: '🔥',
    n: 'Toujours là',
    d: 'Garde ta flamme 3 jours d’affilée.',
    t: 'F',
    p: () => [achMaxStreak(), 3]
  },
  {
    g: 'Aventure',
    id: 'flame10',
    ic: '☄️',
    n: 'Fidèle au poste',
    d: 'Garde ta flamme 10 jours d’affilée.',
    t: 'D',
    p: () => [achMaxStreak(), 10]
  },
  { g: 'Aventure', id: 'lab', ic: '🧪', n: 'Apprentie chimiste', d: 'Débloque le Labo.', t: 'F', c: () => feat(3) },
  { g: 'Aventure', id: 'casino', ic: '🎰', n: 'Ça sent la chance', d: 'Débloque le Casino.', t: 'F', c: () => feat(14) },
  { g: 'Aventure', id: 'wheel', ic: '🎡', n: 'Tourne, tourne', d: 'Fais tourner la roue de la chance.', t: 'F', c: () => !!S.wheel },
  { g: 'Aventure', id: 'shop', ic: '🛍️', n: 'Première emplette', d: 'Achète quelque chose à la boutique.', t: 'F' },
  { g: 'Aventure', id: 'bon', ic: '💌', n: 'Bon pour…', d: 'Utilise un de tes bons.', t: 'F', c: () => S.bons.some(b => b.used) },
  {
    g: 'Aventure',
    id: 'puzzle',
    ic: '🧩',
    n: 'Pièce par pièce',
    d: 'Termine le puzzle.',
    t: 'M',
    c: () => Object.values(S.puzWon || {}).some(Boolean)
  },
  { g: 'Aventure', id: 'rich', ic: '💰', n: 'Petite fortune', d: 'Aie 500 ⭐ en poche en même temps.', t: 'M', p: () => [S.pts, 500] },
  {
    g: 'Aventure',
    id: 'lvl5',
    ic: '🏆',
    n: 'Montée en grade',
    d: 'Atteins le niveau 5 dans tes trésors.',
    t: 'M',
    p: () => [lvl() + 1, 5]
  },
  { g: 'Aventure', id: 'cresus', ic: '💎', n: 'Crésus', d: 'Gagne 3 000 ⭐ au total.', t: 'D', p: () => [S.earned, 3000] },
  { g: 'Aventure', id: 'egg1', ic: '🥚', n: "Chasseuse d'œufs", d: 'Trouve ton premier œuf caché.', t: 'F', c: () => achEggs() >= 1 },
  { g: 'Aventure', id: 'egg12', ic: '🧺', n: 'Panier bien rempli', d: 'Trouve 12 œufs cachés.', t: 'M', p: () => [achEggs(), 12] },
  {
    g: 'Aventure',
    id: 'egg24',
    ic: '🗝️',
    n: 'La clé du mystère',
    d: 'Trouve les 24 œufs et débloque le niveau secret.',
    t: 'L',
    p: () => [achEggs(), 24]
  },
  {
    g: 'Aventure',
    id: 'secret700',
    ic: '🌠',
    n: "Pluie d'étoiles",
    d: 'Fais au moins 700 points au niveau secret.',
    t: 'L',
    c: () => !!(S.secret && S.secret.done && (S.secret.score || 0) >= 700)
  },
  { g: 'Jeux', id: 'rushOpt', ic: '🚗', n: 'Chauffeur de génie', d: 'Libère la voiture en faisant le minimum de coups possible.', t: 'D' },
  { g: 'Jeux', id: 'spotFast', ic: '🦅', n: 'Œil de faucon', d: 'Trouve les 7 différences en moins de 40 secondes.', t: 'D' },
  { g: 'Jeux', id: 'stack12', ic: '🗼', n: 'Architecte de précision', d: 'Fais 12 poses parfaites dans une même tour de cadeaux.', t: 'D' },
  { g: 'Jeux', id: 'bb8', ic: '🌪️', n: 'Inarrêtable', d: 'Atteins un combo ×8 à Block blaster.', t: 'L' },
  { g: 'Jeux', id: 'candy30', ic: '🎂', n: 'Pâtissière de génie', d: 'Dépasse 30 000 points à Candy Noël.', t: 'L' },
  { g: 'Aventure', id: 'secRB', ic: '🌈', n: "Chasseuse d'arc-en-ciel", d: 'Attrape 3 étoiles arc-en-ciel au niveau secret.', t: 'D' },
  { g: 'Aventure', id: 'secSafe', ic: '🛡️', n: 'Intouchable', d: 'Termine le niveau secret sans toucher une seule bombe.', t: 'L' },
  { g: 'Jeux', id: 'flapK', ic: '💥', n: 'Kamikaze', d: 'Percute le tout premier sucre d’orge de Flappy Célestine.', t: 'F' },
  { g: 'Jeux', id: 'snakeO', ic: '🫧', n: 'Avalanche', d: 'Fais tomber 10 bulles d’un seul tir.', t: 'M' },
  {
    g: 'Jeux',
    id: 'memF',
    ic: '🐠',
    n: 'Mémoire de poisson rouge',
    d: 'Rate 5 paires alors que tu avais déjà vu la bonne carte, dans une même partie de memory.',
    t: 'M'
  },
  {
    g: 'Jeux',
    id: 'master3',
    ic: '🏒',
    n: 'Mur infranchissable',
    d: 'Bats Valentin à l’air hockey en encaissant 2 buts ou moins.',
    t: 'D'
  },
  { g: 'Jeux', id: 'sudokuI', ic: '🤔', n: 'Grande indécise', d: 'Change 20 fois le chiffre d’une même case du sudoku.', t: 'M' },

  { g: 'Jeux', id: 'stack5', ic: '🎁', n: 'Main de fée', d: 'Fais 5 poses parfaites d’affilée dans la tour de cadeaux.', t: 'D' },
  { g: 'Jeux', id: 'flecheJ', ic: '💘', n: 'Déclaration', d: 'Écris « JETAIME » dans la grille du mot fléché.', t: 'M' },
  { g: 'Jeux', id: 'spotM', ic: '👓', n: 'Myope mais efficace', d: 'Trouve les 7 différences après avoir fait 4 erreurs.', t: 'D' },
  { g: 'Jeux', id: 'quizJ', ic: '💗', n: 'Réponse universelle', d: 'Réponds « je t’aime » à une question du quiz.', t: 'F' },
  { g: 'Jeux', id: 'candyBomb', ic: '🌈', n: 'Bombe sucrée', d: 'Crée une bombe arc-en-ciel à Candy Noël.', t: 'F' },
  { g: 'Jeux', id: 'candyDivin', ic: '😇', n: 'Divin !', d: 'Enchaîne 5 cascades d’un seul coup à Candy Noël.', t: 'M' },
  { g: 'Jeux', id: 'candy3', ic: '🍬', n: 'Sugar Crush', d: 'Obtiens les 3 étoiles à Candy Noël.', t: 'D' },
  { g: 'Jeux', id: 'bbCombo', ic: '🔥', n: 'En feu', d: 'Atteins un combo ×5 à Block blaster.', t: 'M' },
  { g: 'Jeux', id: 'bb4', ic: '💥', n: 'INCROYABLE', d: 'Efface 4 lignes d’un coup à Block blaster.', t: 'D' },
  { g: 'Jeux', id: 'bbClear', ic: '✨', n: 'Table rase', d: 'Vide entièrement le plateau de Block blaster.', t: 'D' },
  { g: 'Aventure', id: 'beatV', ic: '⚔️', n: 'L’élève dépasse le maître', d: 'Bats un record de Valentin.', t: 'D' },
  {
    g: 'Aventure',
    id: 'albumAll',
    ic: '📸',
    n: 'Album complet',
    d: 'Débloque les 27 photos de votre album.',
    t: 'L',
    p: () => [alRev(), alTotal()]
  },
  {
    g: 'Secrets',
    id: 'candyMega',
    ic: '🌋',
    n: 'Apocalypse sucrée',
    d: 'Combine deux bombes arc-en-ciel à Candy Noël.',
    t: 'D',
    s: 'Deux arcs-en-ciel valent mieux qu’un…'
  },
  {
    g: 'Secrets',
    id: 'grinch',
    ic: '🫠',
    n: 'Cambrioleur flambé',
    d: 'Fais tomber le cambrioleur dans la lave.',
    t: 'M',
    s: 'Le cambrioleur n’aime pas du tout la chaleur…'
  },
  {
    g: 'Secrets',
    id: 'klaxon',
    ic: '📯',
    n: 'Klaxonneuse',
    d: 'Klaxonne 10 fois.',
    t: 'F',
    s: 'Dans certains jeux, on a le droit de faire du bruit…'
  },
  {
    g: 'Secrets',
    id: 'lockTap',
    ic: '🚪',
    n: 'Persévérante',
    d: 'Tu as essayé d’ouvrir une case fermée 20 fois. Elle est toujours fermée.',
    t: 'F',
    s: 'Certaines portes restent fermées…'
  },
  {
    g: 'Secrets',
    id: 'touchV',
    ic: '🫶',
    n: 'Elle m’aime',
    d: 'Tu n’as pas pu t’empêcher de le toucher.',
    t: 'F',
    s: 'Le boss final est très… tactile.'
  },
  {
    g: 'Secrets',
    id: 'toit10',
    ic: '🏠',
    n: 'Reine des toits',
    d: 'Trouve les 10 secrets du toit, dans la scène du fichier mystère.',
    t: 'D',
    s: 'Le toit du fichier mystère cache bien des surprises…',
    c: () => !!S.mysTrophee
  },
  {
    g: 'Secrets',
    id: 'persev',
    ic: '💪',
    n: 'Jamais abandonner',
    d: 'Réussis un jeu à ton dernier essai, ou après l’avoir perdu.',
    t: 'M',
    s: 'Tomber sept fois, se relever huit.',
    c: () => Object.values(S.days).some(x => x.late || (x.done && !x.lost && (x.fails || 0) >= 2))
  },
  {
    g: 'Secrets',
    id: 'night',
    ic: '🦉',
    n: 'Oiseau de nuit',
    d: 'Joue entre minuit et 5 h du matin.',
    t: 'M',
    s: 'Les hiboux, eux, ne dorment jamais…'
  },
  {
    g: 'Secrets',
    id: 'noel',
    ic: '🎅',
    n: 'Le grand jour',
    d: 'Ouvre le calendrier le 24 ou le 25 décembre.',
    t: 'F',
    s: 'Reviens un jour très spécial…',
    c: () => {
      const d = new Date();
      return d.getMonth() == 11 && (d.getDate() == 24 || d.getDate() == 25);
    }
  }
];
const ACHT = { F: ['Facile', 'bronze'], M: ['Moyen', 'argent'], D: ['Difficile', 'or'], L: ['Légendaire', 'diamant'] };
const ACHRW = {
  first_case: ['st', 15],
  win5: ['sc', 20],
  win12: ['gem', 1],
  win24: ['gem', 3],
  firsttry5: ['st', 50],
  flame3: ['sc', 15],
  flame10: ['gem', 2],
  lab: ['sc', 10],
  casino: ['st', 15],
  wheel: ['st', 10],
  shop: ['sc', 10],
  bon: ['st', 15],
  puzzle: ['gem', 1],
  rich: ['sc', 30],
  lvl5: ['gem', 1],
  cresus: ['gem', 3],
  egg1: ['st', 15],
  egg12: ['gem', 2],
  egg24: ['gem', 5],
  secret700: ['gem', 5],
  flapK: ['st', 15],
  snakeO: ['sc', 25],
  memF: ['st', 30],
  master3: ['gem', 2],
  sudokuI: ['sc', 25],
  stack5: ['gem', 2],
  flecheJ: ['st', 40],
  spotM: ['gem', 2],
  quizJ: ['sc', 15],
  candyBomb: ['st', 15],
  candyDivin: ['sc', 25],
  candy3: ['gem', 3],
  bbCombo: ['st', 40],
  bb4: ['gem', 2],
  bbClear: ['gem', 2],
  candyMega: ['gem', 2],
  grinch: ['sc', 25],
  klaxon: ['st', 20],
  persev: ['gem', 1],
  night: ['sc', 20],
  noel: ['gem', 2]
};
Object.assign(ACHRW, {
  rushOpt: ['gem', 2],
  spotFast: ['gem', 2],
  stack12: ['gem', 3],
  bb8: ['gem', 5],
  candy30: ['gem', 5],
  secRB: ['st', 120],
  secSafe: ['gem', 5]
});
Object.assign(ACHRW, {
  beatV: ['gem', 3],
  chest5: ['sc', 40],
  albumAll: ['gem', 5],
  boss4: ['sc', 30],
  boss8: ['sc', 30],
  boss11: ['sc', 30],
  boss15: ['sc', 30],
  boss19: ['sc', 30],
  boss22: ['sc', 30],
  bossV: ['gem', 5]
});
const RWI = { st: '⭐', sc: '🔩', gem: '💎' };
function achRw(a) {
  return ACHRW[a.id] || ['st', 10];
}
function achRwHTML(a) {
  const [k, v] = achRw(a);
  return `<span class="achrw"><span class="rw-${k}">+${v} ${RWI[k]}</span></span>`;
}
function achGot(a) {
  return !!(S.achRw || {})[a.id];
}
function achCollect(id) {
  const a = ACHS.find(x => x.id == id),
    A = achS();
  if (!a || !A[id] || achGot(a)) return;
  S.achRw = S.achRw || {};
  S.achRw[id] = 1;
  const [k, v] = achRw(a);
  if (k == 'st') award(v, `succès « ${a.n} »`);
  else {
    if (k == 'sc') S.scr = (S.scr || 0) + v;
    else S.gem = (S.gem || 0) + v;
    toast(`+${v} ${RWI[k]} succès « ${a.n} »`);
  }
  try {
    SFX('perfect');
  } catch (_) {}
  save();
  const y = scrollY;
  meView();
  window.scrollTo(0, y);
  hdr();
  const n = document.querySelector(`[data-acd="${id}"]`);
  if (n)
    n.animate(
      [
        { transform: 'scale(1.3)', filter: 'brightness(1.8)' },
        { transform: 'scale(1)', filter: 'none' }
      ],
      { duration: 450 }
    );
}
function achBadge() {
  const e = document.getElementById('abdg');
  if (!e) return;
  const A = achS();
  e.hidden = !ACHS.some(a => A[a.id] && !achGot(a));
}
function achWins() {
  return Object.values(S.days).filter(x => x.done && !x.lost).length;
}
function achEggs() {
  return (S.eggTroll ? S.eggsReal || [] : eggs()).length;
}
function achMaxStreak() {
  S.maxStreak = Math.max(S.maxStreak || 0, S.streak || 0);
  return S.maxStreak;
}
function achS() {
  if (!S.ach || typeof S.ach != 'object') S.ach = {};
  return S.ach;
}
let achQ = [],
  achBusy = false;
function ACH(id) {
  if (instPend()) return;
  const A = achS();
  if (A[id]) return;
  const a = ACHS.find(x => x.id == id);
  if (!a) return;
  slog('🏆', `Succès : ${a.n}`);
  A[id] = Date.now();
  try {
    EV('ach');
  } catch (_) {}
  save();
  achBadge();
  achQ.push(a);
  achShow();
}
function achCheck() {
  if (instPend()) return;
  try {
    const A = achS();
    ACHS.forEach(a => {
      if (A[a.id]) return;
      let ok = false;
      if (a.c) ok = a.c();
      else if (a.p) {
        const [v, m] = a.p();
        ok = v >= m;
      }
      if (ok) ACH(a.id);
    });
    achBadge();
  } catch (e) {
    console.error(e);
  }
}
function achChime(t) {
  if (S.sound === false) return;
  const A = eggAC();
  if (!A) return;
  const t0 = A.currentTime,
    base = t == 'L' ? 523 : t == 'D' ? 587 : t == 'M' ? 659 : 698;
  [0, 4, 7, 12, 16].forEach((s2, i) => {
    const o = A.createOscillator(),
      g = A.createGain(),
      tt = t0 + i * 0.07;
    o.type = 'triangle';
    o.frequency.value = base * Math.pow(2, s2 / 12);
    g.gain.setValueAtTime(0.0001, tt);
    g.gain.exponentialRampToValueAtTime(0.07, tt + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.5);
    o.connect(g).connect(A.destination);
    o.start(tt);
    o.stop(tt + 0.55);
  });
}
function achShow() {
  if (achBusy || !achQ.length) return;
  achBusy = true;
  let a = achQ.shift();
  let more = 0;
  if (achQ.length >= 3) {
    more = achQ.length;
    achQ = [];
  }
  const e = document.createElement('div');
  e.className = 'achpop t' + a.t;
  e.innerHTML = `<span class="achic">${a.ic}</span><span class="achtx"><small>🏆 Succès débloqué !${more ? ` (+${more} autres)` : ''}</small><b>${esc(a.n)}</b>${achRwHTML(a)}</span>`;
  e.onclick = () => {
    e.remove();
    achBusy = false;
    go('me');
    setTimeout(() => {
      const x = document.getElementById('achsec');
      if (x) x.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    achShow();
  };
  document.body.appendChild(e);
  achChime(a.t);
  try {
    const ic = e.querySelector('.achic');
    for (let q = 0; q < 10; q++) {
      const s2 = document.createElement('i');
      s2.className = 'ach-sp';
      s2.textContent = ['✨', '⭐', '✦'][q % 3];
      s2.style.setProperty('--a', q * 36 + 'deg');
      ic.appendChild(s2);
    }
  } catch (_) {}
  e.animate(
    [
      { transform: 'translate(-50%,-140%)', opacity: 0 },
      { transform: 'translate(-50%,12px)', opacity: 1, offset: 0.12 },
      { transform: 'translate(-50%,0)', offset: 0.18 },
      { transform: 'translate(-50%,0)', opacity: 1, offset: 0.88 },
      { transform: 'translate(-50%,-140%)', opacity: 0 }
    ],
    { duration: 3600, easing: 'ease-out' }
  ).onfinish = () => {
    e.remove();
    achBusy = false;
    achShow();
  };
}
function achHTML() {
  const A = achS(),
    n = ACHS.filter(a => A[a.id]).length,
    fmt = t => new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return `<h2 id="achsec">🏆 Succès <small class="muted">${n} / ${ACHS.length}</small></h2><div class="panel">${(() => {
    const k = ACHS.filter(a => A[a.id] && !achGot(a)).length;
    return k ? `<p class="achwait">🎁 ${k} récompense${k > 1 ? 's' : ''} à collecter !</p>` : '';
  })()}<div class="bar"><i style="width:${(n / ACHS.length) * 100}%"></i></div>
 ${['Aventure', 'Jeux', 'Boss', 'Secrets']
   .map(
     gn =>
       `<h3 class="achg">${gn == 'Aventure' ? '🗺️' : gn == 'Jeux' ? '🎮' : gn == 'Boss' ? '⚔️' : '🤫'} ${gn}</h3><div class="achl">${ACHS.filter(
         a => a.g == gn
       )
         .map(a => {
           const on = !!A[a.id],
             sec = a.s && !on;
           let pr = '';
           if (!on && a.p) {
             const [v, m] = a.p();
             pr = `<span class="achpb"><i style="width:${Math.min(100, (v / m) * 100)}%"></i></span><small class="achpn">${Math.min(v, m)} / ${m}</small>`;
           }
           return `<div class="ach t${a.t} ${on ? 'on' : ''}"><span class="achic">${sec ? '❓' : a.ic}${on ? '<i class="achok">✓</i>' : '<i class="achlk">🔒</i>'}</span><span class="achtx"><b>${sec ? '???' : esc(a.n)}</b><small>${sec ? `<i>${esc(a.s)}</i>` : esc(a.d)}</small>${pr}${on ? '' : achRwHTML(a)}${on ? `<small class="achdt">Débloqué le ${fmt(A[a.id])}</small>` : ''}</span>${
             on
               ? achGot(a)
                 ? `<span class="achcol done" data-acd="${a.id}">✓ ${(() => {
                     const [k, v] = achRw(a);
                     return `+${v} ${RWI[k]}`;
                   })()}</span>`
                 : `<button class="achcol" data-ac="${a.id}" onclick="achCollect('${a.id}')">Collecter<br><b>${(() => {
                     const [k, v] = achRw(a);
                     return `+${v} ${RWI[k]}`;
                   })()}</b></button>`
               : `<span class="achtier">${ACHT[a.t][0]}</span>`
           }</div>`;
         })
         .join('')}</div>`
   )
   .join('')}</div>`;
}
function achReset() {
  S.ach = {};
  S.achRw = {};
  S.maxStreak = 0;
  S.honks = 0;
  save();
  toast('🏆 Succès réinitialisés');
  admin();
}
