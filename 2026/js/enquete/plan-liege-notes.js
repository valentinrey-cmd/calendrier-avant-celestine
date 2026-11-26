/* ================= 🗺️ Plan de Lyon · 📌 Tableau de liège · 📝 Notes ================= */
/* positions calculées depuis les vraies coordonnées GPS (projection simple, ~18 px/km) */
const PLACES = [
  {
    id: 'appart',
    lx: 16,
    ly: 16,
    la: 'start',
    sn: 'Appart',
    n: 'Appart de Célestine · Lyon 8e',
    x: 214,
    y: 462,
    ic: '🏠',
    crime: 1,
    d: 'Rez-de-chaussée, T2. Le vide-poche de la salle de bain.'
  },
  {
    id: 'fac',
    lx: 16,
    ly: -8,
    la: 'start',
    sn: 'Fac',
    n: 'Fac de pharma · Rockefeller',
    x: 220,
    y: 452,
    ic: '🧪',
    who: ['nora', 'erika', 'eya'],
    d: 'BU mercredi, TP vendredi de 8 h 30 à 12 h 30.'
  },
  {
    id: 'commis',
    lx: -16,
    ly: -30,
    la: 'end',
    sn: 'Commissariat',
    n: 'Commissariat du 8e',
    x: 206,
    y: 470,
    ic: '🚓',
    d: 'Le bureau du lieutenant Pépin.'
  },
  {
    id: 'bellecour',
    lx: -16,
    ly: 4,
    la: 'end',
    sn: 'Bellecour',
    n: 'Place Bellecour',
    x: 186,
    y: 446,
    ic: '🚇',
    who: ['valentin', 'eya'],
    d: 'Valentin y change toujours de métro. Eya y faisait du shopping vendredi midi.'
  },
  {
    id: 'resto',
    lx: 16,
    ly: 4,
    la: 'start',
    sn: 'Resto',
    n: 'Le resto du jeudi',
    x: 196,
    y: 436,
    ic: '🍕',
    who: ['emma', 'noemie'],
    d: 'Jeudi soir, à trois.'
  },
  {
    id: 'ongles',
    lx: -16,
    ly: -12,
    la: 'end',
    sn: 'Chez Noémie',
    n: 'Chez Noémie',
    x: 228,
    y: 440,
    ic: '💅',
    who: ['noemie'],
    d: 'Les ongles de mardi.'
  },
  { id: 'ecully', lx: -18, ly: 6, la: 'end', n: 'Écully', x: 109, y: 402, ic: '🏡', who: ['valentin'], d: 'Le week-end de Valentin.' },
  {
    id: 'caluire',
    lx: 16,
    ly: 4,
    la: 'start',
    n: 'Caluire',
    x: 196,
    y: 392,
    ic: '🏪',
    who: ['valentin'],
    d: 'Le magasin de la mère de Valentin, le samedi.'
  },
  {
    id: 'reyrieux',
    lx: 16,
    ly: 4,
    la: 'start',
    n: 'Reyrieux',
    x: 163,
    y: 72,
    ic: '🏡',
    who: ['edgar', 'parents', 'sandrine'],
    d: 'Chez Valérie, et la pharmacie du samedi.'
  },
  { id: 'neuville', lx: 16, ly: 4, la: 'start', n: 'Neuville', x: 212, y: 193, ic: '🏠', who: ['emma'], d: 'Parents d’Emma.' }
];
const FAR = [];
const mpPic = id => {
  const x = SUSP.find(z => z.id == id);
  return x && x.img ? (x.img == 'v' ? VIMG.v : SIMG[x.img]) : '';
};
// les lieux de Lyon, trop proches pour être lisibles de loin : regroupés en une bulle tant qu'on n'a pas zoomé
const MPLY = ['appart', 'fac', 'commis', 'bellecour', 'resto', 'ongles'];
const MPZL = 5; // zoom à partir duquel la bulle « Lyon » s'ouvre
// boussole, titre et échelle : hors du zoom (taille fixe à l'écran)
const MPX = () => `
 <rect x="20" y="20" width="580" height="540" fill="url(#mpV)" pointer-events="none"/>
 <g transform="translate(556 70)" pointer-events="none"><circle r="26" fill="#f7efdc" stroke="#8a6a3a" stroke-width="2"/><path d="M0 -22 L6 0 L0 22 L-6 0Z" fill="#8a6a3a"/><path d="M0 -22 L6 0 L-6 0Z" fill="#c0233a"/><text y="-28" text-anchor="middle" font-size="10" font-weight="900" fill="#6a4a2a">N</text></g>
 <g class="mp-ech" transform="translate(40 540)" pointer-events="none"><rect class="mp-eb" width="92" height="5" fill="#4a3a2a"/><rect class="mp-eh" width="46" height="5" fill="#f7efdc" stroke="#4a3a2a"/><text x="0" y="-5" class="mp-sm">0</text><text class="mp-et" x="88" y="-5" class="mp-sm">5 km</text></g>
 <text x="40" y="44" class="mp-title">Dossier n°24 · Lyon et ses environs</text>`;
// une épingle, dessinée autour de (0, 0) ; sa position est donnée par mapLay
const mpPin = (p, X, crimes, big) => {
  const W = p.who || [],
    c = p.crime ? '#c0233a' : '#2a4a7a';
  return `<g class="mp-p ${MPLY.includes(p.id) ? 'mp-ly' : ''}" data-x="${p.x}" data-y="${p.y}" data-id="${p.id}" transform="translate(${p.x} ${p.y})" onclick="event.stopPropagation();mapTap('${p.id}')">${p.crime ? '<circle r="22" class="mp-pulse"/>' : ''}
<ellipse cx="0" cy="1" rx="6" ry="2.4" fill="#0003"/><path d="M0 0 c-9 -12 -14 -17 -14 -25 a14 14 0 1 1 28 0 c0 8 -5 13 -14 25z" fill="${c}" stroke="#fff" stroke-width="2"/><text y="-20" text-anchor="middle" font-size="13">${p.ic}</text>
${p.crime && crimes ? `<circle cx="13" cy="-36" r="9" fill="#ffd76a" stroke="#c0233a" stroke-width="2"/><text x="13" y="-32" text-anchor="middle" font-size="10" font-weight="900" fill="#7a0a14">${crimes}</text>` : ''}
<text x="${p.lx}" y="${p.ly}" text-anchor="${p.la}" class="mp-lb">${esc(p.sn || p.n.split(' · ')[0])}</text>
${W.map((w, k) => `<g class="${X[w] ? 'mp-out' : ''}"><clipPath id="mpc${p.id}${k}${big ? 'b' : ''}"><circle cx="${18 + k * 20}" cy="-30" r="9"/></clipPath><circle cx="${18 + k * 20}" cy="-30" r="10.5" fill="#fff"/><image href="${mpPic(w)}" x="${9 + k * 20}" y="-40" width="18" height="21" clip-path="url(#mpc${p.id}${k}${big ? 'b' : ''})" preserveAspectRatio="xMidYMid slice"/></g>`).join('')}</g>`;
};
// place les épingles et adapte traits et textes au zoom z (déplacement tx, ty), comme une appli de cartes
function mapLay(svg, z, tx, ty, k = 1) {
  svg
    .querySelectorAll('.mp-p')
    .forEach(g => g.setAttribute('transform', `translate(${(+g.dataset.x * z + tx).toFixed(1)} ${(+g.dataset.y * z + ty).toFixed(1)})`));
  const cl = svg.querySelector('.mp-clu');
  if (cl) cl.setAttribute('transform', `translate(${(+cl.dataset.x * z + tx).toFixed(1)} ${(+cl.dataset.y * z + ty).toFixed(1)})`);
  svg.classList.toggle('mp-zly', z >= MPZL);
  svg.classList.toggle('mp-zhi', z >= 3);
  // traits : largeur à l'écran = la plus grande entre « vue d'ensemble » (data-w) et la vraie largeur zoomée (data-rw)
  svg.querySelectorAll('[data-w]').forEach(e => e.setAttribute('stroke-width', Math.max(+e.dataset.w / z, +e.dataset.rw || 0).toFixed(3)));
  svg.querySelectorAll('[data-fs]').forEach(e => (e.style.fontSize = (+e.dataset.fs / z).toFixed(3) + 'px'));
  // échelle : une distance ronde qui fait entre 50 et 120 px à l'écran (18 px par km au zoom 1)
  const km = [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10].find(d => d * 18 * z * k >= 50) || 10,
    L = km * 18 * z,
    lab = km < 1 ? km * 1000 + ' m' : km + ' km',
    hb = document.querySelector('#mpbig .mpb-ech');
  if (hb && svg.closest('#mpbig')) {
    hb.querySelector('i').style.width = (L * k).toFixed(0) + 'px';
    hb.querySelector('span').textContent = lab;
  }
  const eb = svg.querySelector('.mp-eb');
  if (eb) {
    eb.setAttribute('width', L.toFixed(1));
    svg.querySelector('.mp-eh').setAttribute('width', (L / 2).toFixed(1));
    const et = svg.querySelector('.mp-et');
    et.setAttribute('x', (L - 4).toFixed(1));
    et.textContent = lab;
  }
}
function mapSVG(sd, big) {
  const X = S.enqX || {},
    crimes = MEF.filter(m => sd[m[0]]).length,
    B = big ? 'b' : '';
  const bld = (x, y, n, c) => {
    let o = '';
    for (let k = 0; k < n; k++) {
      const a = k * 2.39,
        r = 4 + k * 1.7,
        bx = x + Math.cos(a) * r,
        by = y + Math.sin(a) * r * 0.7;
      o += `<rect x="${(bx - 3).toFixed(1)}" y="${(by - 3).toFixed(1)}" width="6" height="6" rx="1" fill="${c || '#d9c6a3'}" stroke="#b8a27a" stroke-width=".6"/>`;
    }
    return o;
  };
  const tree = (x, y, s) =>
    `<path d="M${x} ${y - 9 * s} l${5 * s} ${9 * s} h${-10 * s}z" fill="#7fa86a"/><path d="M${x} ${y - 13 * s} l${4 * s} ${7 * s} h${-8 * s}z" fill="#93ba7c"/>`;
  let trees = '';
  [
    [60, 250],
    [80, 270],
    [100, 240],
    [125, 300],
    [140, 320],
    [90, 330],
    [300, 240],
    [330, 260],
    [360, 230],
    [420, 300],
    [460, 270],
    [60, 120],
    [90, 150],
    [260, 120],
    [300, 90],
    [480, 420],
    [430, 450],
    [60, 500],
    [100, 520],
    [300, 520]
  ].forEach(([x, y], k) => (trees += tree(x, y, 0.9 + (k % 3) * 0.15)));
  // détails de Lyon, visibles quand on zoome : rues, ponts, quartiers (largeurs fixes à l'écran)
  const rue = d =>
      `<path d="${d}" fill="none" stroke="#fffaf0" stroke-width="2.6" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`,
    rue2 = d =>
      `<path d="${d}" fill="none" stroke="#f3d79a" stroke-width="3.4" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`,
    qu = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" class="mp-qu" data-fs="11">${t}</text>`;
  const det = `<g class="mp-det">
 <rect x="182.4" y="443.6" width="5.2" height="3" rx=".4" fill="#e9dcbc" stroke="#cbb88e" stroke-width=".3"/>
 ${rue2('M246 398 C258 430 254 468 240 494')}${rue2('M150 470 C162 468 168 474 172 486')}
 ${rue('M186 446 L189 428 L193 414')}${rue('M200 432 L238 432')}${rue('M201 452 L236 458')}${rue('M197 462 L234 470')}${rue('M206 470 L212 490')}${rue('M214 462 L226 446 L232 432')}${rue('M206 412 L210 440 L206 470')}${rue('M178 456 L184 470 L190 482')}${rue('M160 438 L170 448 L160 460')}
 ${rue('M176.6 447 L184 446')}${rue('M191 449 L203.5 451')}${rue('M188 438 L204 437')}${rue('M184 466 L198 466')}
 ${qu(181, 436, 'Presqu’île')}${qu(165, 452, 'Vieux Lyon')}${qu(186, 418, 'Croix-Rousse')}${qu(218, 427, 'Part-Dieu')}${qu(199, 459, 'Guillotière')}${qu(226, 478, 'Lyon 8e')}${qu(196, 486, 'Gerland')}${qu(177, 480, 'Confluence')}${qu(243, 384, 'Parc de la Tête d’Or')}
</g>`;
  // bulle « Lyon » tant qu'on n'a pas zoomé
  const L = PLACES.filter(p => MPLY.includes(p.id)),
    cx = L.reduce((a, p) => a + p.x, 0) / L.length,
    cy = L.reduce((a, p) => a + p.y, 0) / L.length;
  const clu = `<g class="mp-clu" data-x="${cx.toFixed(1)}" data-y="${cy.toFixed(1)}" transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)})" onclick="event.stopPropagation();${big ? 'mapLyon()' : 'mapBig(1)'}"><circle r="27" fill="#c0233a" opacity=".18" class="mp-pulse"/><circle r="19" fill="#c0233a" stroke="#fff" stroke-width="3"/><text y="5" text-anchor="middle" font-size="15" font-weight="900" fill="#fff">${L.length}</text><text x="25" y="5" class="mp-lb">Lyon · ${L.length} lieux</text></g>`;
  return `<svg viewBox="20 20 580 540" class="mp-svg" xmlns="http://www.w3.org/2000/svg"><defs>
  <pattern id="mpP${B}" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#f1e6cc"/><circle cx="12" cy="18" r="1" fill="#e2d3b0"/><circle cx="44" cy="40" r="1.2" fill="#e2d3b0"/><circle cx="30" cy="8" r=".8" fill="#e2d3b0"/></pattern>
  <pattern id="mpW${B}" width="18" height="10" patternUnits="userSpaceOnUse"><rect width="18" height="10" fill="#8cc0e6"/><path d="M0 6 q4.5 -3 9 0 t9 0" stroke="#b5d8f2" stroke-width="1" fill="none"/></pattern>
  <radialGradient id="mpV" cx=".5" cy=".5" r=".75"><stop offset=".65" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#6a4a20" stop-opacity=".28"/></radialGradient></defs>
 <g class="mp-z"><rect x="-2000" y="-2000" width="4600" height="4600" fill="url(#mpP${B})"/>
 <path d="M40 300 C80 240 150 230 170 300 C185 350 140 380 90 370 C55 362 30 340 40 300Z" fill="#c9d9a8" opacity=".75"/><text x="96" y="300" class="mp-zone" data-fs="11">Monts d’Or</text>
 <path d="M150 400 C160 410 172 418 176 432 C170 440 160 440 152 432Z" fill="#c9d9a8"/><text x="158" y="424" class="mp-zone" data-fs="9">Fourvière</text>
 <g class="mp-lo">${trees}</g>
 <path d="M20 360 Q120 345 240 360 T600 330" stroke="#e6cfa0" data-w="7" data-rw=".35" stroke-width="7" fill="none"/>
 <path d="M115 20 C130 150 150 250 150 330 C150 380 160 420 178 445" stroke="#e8b45a" data-w="5" data-rw=".45" stroke-width="5" fill="none" stroke-linecap="round"/><text x="128" y="160" class="mp-rd" data-fs="9" transform="rotate(80 128 160)">A6</text>
 <path d="M205 450 C300 460 420 475 530 498" stroke="#e8b45a" data-w="5" data-rw=".45" stroke-width="5" fill="none"/><text x="360" y="462" class="mp-rd" data-fs="9">A43</text>
 <path d="M250 330 C320 310 420 300 600 250" stroke="#e8b45a" data-w="4" data-rw=".45" stroke-width="4" fill="none"/><text x="470" y="288" class="mp-rd" data-fs="9">A42</text>
 <path d="M90 20 C100 60 110 90 150 130 C185 165 205 185 212 210 C218 250 204 300 196 340 C190 370 168 392 168 415 C168 440 180 455 172 485 L168 560" stroke="url(#mpW${B})" data-w="13" data-rw="2.6" stroke-width="13" fill="none" stroke-linecap="round"/><text x="182" y="268" class="mp-riv" data-fs="14" transform="rotate(-80 182 268)">Saône</text>
 <path d="M600 330 C520 340 450 360 400 370 C340 382 280 382 240 384 C215 386 206 398 205 420 C204 445 190 468 172 486 L160 560" stroke="url(#mpW${B})" data-w="18" data-rw="3.6" stroke-width="18" fill="none" stroke-linecap="round"/><text x="420" y="356" class="mp-riv" data-fs="14" transform="rotate(-12 420 356)">Rhône</text>
 <path d="M228 392 c6 -8 18 -10 24 -2 c4 8 -2 16 -10 16 c-8 0 -16 -6 -14 -14z" fill="#9fd08a" stroke="#7fb06a" stroke-width=".5"/><ellipse cx="238" cy="396" rx="5" ry="3" fill="#8cc0e6"/>
 <g class="mp-lo">${bld(189, 440, 14, '#e5d2ae')}${bld(262, 420, 10)}${bld(109, 402, 6)}${bld(80, 430, 5)}${bld(370, 412, 6)}${bld(212, 193, 6)}${bld(163, 72, 5)}</g>
 <rect x="505" y="485" width="56" height="20" rx="4" fill="#d7d0c0" stroke="#b8ae98"/><path d="M510 492 h46 M510 498 h46" stroke="#fff" stroke-width="1.5" stroke-dasharray="5 4"/>
 ${det}</g>
 <g class="mp-pins">${PLACES.map(p => mpPin(p, X, crimes, big)).join('')}${clu}</g>${big ? '' : MPX()}</svg>`;
}
function mapHTML(sd) {
  return `<div class="mp"><div class="mp-wrap" onclick="mapBig()">${mapSVG(sd, false)}<span class="mp-zoom">🔍 Touche pour agrandir</span></div>
 <div class="mp-far2">${FAR.map(([w, t, d]) => `<button class="mp-fb" onclick="mapInfo(${JSON.stringify(t).replace(/"/g, '&quot;')},${JSON.stringify(d).replace(/"/g, '&quot;')})"><img src="${mpPic(w)}" alt="">${esc(t)}</button>`).join('')}</div>
 <p class="mp-info" id="mpi">Touche un lieu pour le détail.</p></div>`;
}
function mapInfo(t, d) {
  document.querySelectorAll('#mpi,#mpbi').forEach(e => {
    e.innerHTML = `<b>${esc(t)}</b><br>${esc(d)}`;
    e.classList.add('on');
  });
}
function mapTap(id) {
  const p = PLACES.find(x => x.id == id),
    sd = S.story || {};
  if (!p) return;
  try {
    SFX('tap');
  } catch (_) {}
  mapInfo(p.n, p.d || '');
}
/* plein écran : glisser pour déplacer, pincer (ou boutons) pour zoomer */
// plein écran ; ly = 1 : s'ouvre directement zoomé sur Lyon
const MPZM = 30;
function mapBig(ly) {
  const sd = S.story || {};
  const o = document.createElement('div');
  o.id = 'mpbig';
  o.innerHTML = `<div class="mpb-h"><b>🗺️ Plan de l’enquête</b><button class="mpb-x" aria-label="Fermer">✕</button></div><div class="mpb-v">${mapSVG(sd, true)}</div><div class="mpb-ech"><i></i><span>5 km</span></div><div class="mpb-nord">N</div><div class="mpb-c"><button data-z="1.4">＋</button><button data-z="0.7">－</button><button data-z="0">⟲</button><button data-ly="1" aria-label="Zoomer sur Lyon">🏙️</button></div><p class="mp-info" id="mpbi">Glisse pour te déplacer · pince ou utilise ＋ － pour zoomer · touche un lieu ou la bulle de Lyon.</p>`;
  document.body.appendChild(o);
  try {
    SFX('tap');
  } catch (_) {}
  const V = o.querySelector('.mpb-v'),
    G = o.querySelector('.mp-z'),
    svg = V.querySelector('svg');
  let z = 1,
    tx = 0,
    ty = 0;
  const P = new Map();
  let st = null;
  const M = () => {
    const r = svg.getBoundingClientRect(),
      k = Math.min(r.width / 580, r.height / 540),
      ox = (r.width - 580 * k) / 2,
      oy = (r.height - 540 * k) / 2;
    return { r, k, ox, oy, x0: 20 - ox / k, x1: 20 + (r.width - ox) / k, y0: 20 - oy / k, y1: 20 + (r.height - oy) / k };
  };
  const cl = (t, a, b, lo, hi) => {
    const w = (b - a) * z,
      vis = hi - lo;
    return w >= vis ? Math.max(hi - b * z, Math.min(lo - a * z, t)) : lo + (vis - w) / 2 - a * z;
  };
  let z0 = 1;
  const ap = () => {
    const m = M();
    z = Math.max(z0, Math.min(MPZM, z));
    tx = cl(tx, 20, 600, m.x0, m.x1);
    ty = cl(ty, 20, 560, m.y0, m.y1);
    G.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${z.toFixed(3)})`);
    mapLay(svg, z, tx, ty, M().k);
  };
  const zoomAt = (f, cx, cy) => {
    const { r, k, ox, oy } = M(),
      px = 20 + (cx - r.left - ox) / k,
      py = 20 + (cy - r.top - oy) / k,
      nz = Math.max(z0, Math.min(MPZM, z * f));
    tx = px - ((px - tx) * nz) / z;
    ty = py - ((py - ty) * nz) / z;
    z = nz;
    ap();
  };
  const fit = () => {
    const m = M();
    z0 = Math.max(1, (m.y1 - m.y0) / 540, (m.x1 - m.x0) / 580);
    z = z0;
    // centrée sur les lieux de l'enquête (d'Écully à Reyrieux et Lyon)
    tx = cl((m.x0 + m.x1) / 2 - 172 * z, 20, 600, m.x0, m.x1);
    ty = cl((m.y0 + m.y1) / 2 - 280 * z, 20, 560, m.y0, m.y1);
    ap();
  };
  // zoom animé vers un point (x, y) de la carte
  const flyTo = (x, y, nz) => {
    const m = M(),
      a = { z, tx, ty },
      b = { z: nz, tx: (m.x0 + m.x1) / 2 - x * nz, ty: (m.y0 + m.y1) / 2 - y * nz },
      t0 = performance.now();
    const f = t => {
      const k = Math.min(1, (t - t0) / 550),
        e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      z = a.z + (b.z - a.z) * e;
      tx = a.tx + (b.tx - a.tx) * e;
      ty = a.ty + (b.ty - a.ty) * e;
      ap();
      if (k < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  window.mapLyon = () => {
    const cl = svg.querySelector('.mp-clu');
    flyTo(+cl.dataset.x - 2, +cl.dataset.y, 8.5);
  };
  V.addEventListener('pointerdown', e => {
    P.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (P.size == 1) st = { x: e.clientX, y: e.clientY, tx, ty };
    if (P.size == 2) {
      const [a, b] = [...P.values()];
      st = { d: Math.hypot(a.x - b.x, a.y - b.y), z, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    }
  });
  V.addEventListener('pointermove', e => {
    if (!P.has(e.pointerId)) return;
    P.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const { k } = M();
    if (P.size == 1 && st && st.tx != null) {
      tx = st.tx + (e.clientX - st.x) / k;
      ty = st.ty + (e.clientY - st.y) / k;
      ap();
    } else if (P.size == 2 && st && st.d) {
      const [a, b] = [...P.values()],
        d = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((st.z * d) / st.d / z, st.cx, st.cy);
    }
  });
  const up = e => {
    P.delete(e.pointerId);
    if (P.size == 1) {
      const [a] = [...P.values()];
      st = { x: a.x, y: a.y, tx, ty };
    } else if (!P.size) st = null;
  };
  V.addEventListener('pointerup', up);
  V.addEventListener('pointercancel', up);
  V.addEventListener(
    'wheel',
    e => {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 1.15 : 0.87, e.clientX, e.clientY);
    },
    { passive: false }
  );
  let lt = 0;
  V.addEventListener('click', e => {
    const n = Date.now();
    if (n - lt < 300 && !e.target.closest('.mp-p')) zoomAt(1.8, e.clientX, e.clientY);
    lt = n;
  });
  o.querySelectorAll('.mpb-c button').forEach(
    b =>
      (b.onclick = () => {
        if (b.dataset.ly) return window.mapLyon();
        const f = +b.dataset.z;
        if (!f) {
          fit();
        } else {
          const r = svg.getBoundingClientRect();
          zoomAt(f, r.left + r.width / 2, r.top + r.height / 2);
        }
      })
  );
  o.querySelector('.mpb-x').onclick = () => {
    o.classList.add('out');
    setTimeout(() => o.remove(), 200);
  };
  requestAnimationFrame(() => {
    fit();
    if (ly) setTimeout(() => window.mapLyon(), 150);
  });
}
/* ---------- tableau de liège ---------- */
function brdItems() {
  const sd = S.story || {};
  return SUSP.map(x => ({ id: 's:' + x.id, k: 's', x })).concat(CLUES.filter(clueOn).map(c => ({ id: 'c:' + c[0], k: 'c', c })));
}
function brdPos(it, i) {
  const P = (S.enqP = S.enqP || {});
  if (P[it.id]) return P[it.id];
  if (it.k == 's') {
    const k = SUSP.findIndex(z => 's:' + z.id == it.id);
    return { x: 6 + (k % 3) * 31, y: 2 + Math.floor(k / 3) * 17.5 };
  }
  const k = CLUES.findIndex(c => 'c:' + c[0] == it.id);
  return { x: 4 + (k % 3) * 32, y: 57 + Math.floor(k / 3) * 10.5 };
}
function brdHTML() {
  const X = S.enqX || {};
  return `<p class="enq-h"><small>Déplace les cartes, puis touche deux cartes pour les relier par un fil rouge.</small></p><div class="brd" id="brd"><svg class="brd-l" id="brdl"></svg>${brdItems()
    .map((it, i) => {
      const p = brdPos(it, i);
      return it.k == 's'
        ? `<div class="brd-i brd-s ${X[it.x.id] ? 'out' : ''}" data-id="${it.id}" style="left:${p.x}%;top:${p.y}%">${susPic(it.x)}<b>${esc(it.x.n)}</b></div>`
        : `<div class="brd-i brd-c" data-id="${it.id}" style="left:${p.x}%;top:${p.y}%"><span>${it.c[1]}</span><b>${esc(it.c[3])}</b></div>`;
    })
    .join(
      ''
    )}</div><p class="center" style="margin:6px 0 0"><button class="alt sm" onclick="brdReset()">🧹 Retirer tous les fils</button></p>`;
}
function brdDraw() {
  const B = document.getElementById('brd'),
    L = document.getElementById('brdl');
  if (!B || !L) return;
  const r = B.getBoundingClientRect(),
    c = id => {
      const e = B.querySelector(`[data-id="${id}"]`);
      if (!e) return null;
      const a = e.getBoundingClientRect();
      return [a.left - r.left + a.width / 2, a.top - r.top + Math.min(14, a.height / 2)];
    };
  L.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
  L.innerHTML = (S.enqL || [])
    .map(([a, b]) => {
      const p = c(a),
        q = c(b);
      if (!p || !q) return '';
      const mx = (p[0] + q[0]) / 2,
        my = (p[1] + q[1]) / 2 + 18;
      return `<path d="M${p[0]} ${p[1]} Q${mx} ${my} ${q[0]} ${q[1]}" stroke="#c0233a" stroke-width="2.4" fill="none"/><circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#c0233a"/><circle cx="${q[0]}" cy="${q[1]}" r="4" fill="#c0233a"/>`;
    })
    .join('');
}
function brdReset() {
  askBox('Retirer tous les fils rouges ?', '', 'Retirer', 'Annuler').then(y => {
    if (!y) return;
    S.enqL = [];
    save();
    brdDraw();
  });
}
function brdInit() {
  const B = document.getElementById('brd');
  if (!B) return;
  let sel = null;
  brdDraw();
  B.querySelectorAll('.brd-i').forEach(e => {
    let st = null;
    e.onpointerdown = ev => {
      ev.preventDefault();
      e.setPointerCapture(ev.pointerId);
      const r = B.getBoundingClientRect(),
        a = e.getBoundingClientRect();
      st = { x: ev.clientX, y: ev.clientY, ox: a.left - r.left, oy: a.top - r.top, m: 0, r };
    };
    e.onpointermove = ev => {
      if (!st) return;
      const dx = ev.clientX - st.x,
        dy = ev.clientY - st.y;
      if (Math.abs(dx) + Math.abs(dy) > 6) st.m = 1;
      if (!st.m) return;
      const x = Math.max(0, Math.min(st.r.width - e.offsetWidth, st.ox + dx)),
        y = Math.max(0, Math.min(st.r.height - e.offsetHeight, st.oy + dy));
      e.style.left = (x / st.r.width) * 100 + '%';
      e.style.top = (y / st.r.height) * 100 + '%';
      brdDraw();
    };
    e.onpointerup = ev => {
      if (!st) return;
      const moved = st.m;
      st = null;
      if (moved) {
        S.enqP = S.enqP || {};
        S.enqP[e.dataset.id] = { x: parseFloat(e.style.left), y: parseFloat(e.style.top) };
        save();
        return;
      }
      const id = e.dataset.id;
      if (!sel) {
        sel = id;
        e.classList.add('sel');
        try {
          SFX('tap');
        } catch (_) {}
        return;
      }
      if (sel == id) {
        sel = null;
        e.classList.remove('sel');
        return;
      }
      S.enqL = S.enqL || [];
      const k = S.enqL.findIndex(([a, b]) => (a == sel && b == id) || (a == id && b == sel));
      if (k >= 0) S.enqL.splice(k, 1);
      else S.enqL.push([sel, id]);
      save();
      try {
        SFX(k >= 0 ? 'tap' : 'ok');
      } catch (_) {}
      B.querySelectorAll('.sel').forEach(z => z.classList.remove('sel'));
      sel = null;
      brdDraw();
    };
    e.onpointercancel = () => {
      st = null;
    };
  });
}
/* ---------- notes ---------- */
function noteHTML(id, ph) {
  const v = (S.enqN || {})[id] || '';
  return `<label class="enq-n"><span>📝 Mes notes</span><textarea data-notr rows="3" placeholder="${esc(ph || 'Tes déductions…')}" oninput="noteSet('${id}',this.value)">${esc(v)}</textarea></label>`;
}
let noteT = 0;
function noteSet(id, v) {
  S.enqN = S.enqN || {};
  S.enqN[id] = v.slice(0, 2000);
  clearTimeout(noteT);
  noteT = setTimeout(() => {
    save();
    try {
      slog('📝', 'Note d’enquête (' + id + ') : ' + v.slice(0, 80));
    } catch (_) {}
  }, 800);
}
