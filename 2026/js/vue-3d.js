/* ================= 🧊 VUE 3D · des objets en vrai volume, à faire tourner du doigt ================= */
// Les modèles ont été faits avec Meshy (photos du vrai bracelet + descriptions), puis allégés pour la tablette.
// Fichiers : dossier 2026/3d/, listés dans FICHIERS.modeles3d (js/fichiers.js).
// L'affichage utilise la bibliothèque model-viewer (3d/model-viewer.min.js, environ 1 Mo), chargée seulement
// à la première ouverture d'un objet 3D, puis gardée en cache pour marcher sans connexion.
//
// Un objet : f = fichier, t = titre, s = petite phrase, o = angle de départ de la caméra,
// det = détails à trouver en touchant le modèle : [x, y, z (position dans le modèle), ce que Célestine remarque].
// Les détails trouvés sont gardés dans S.det, avec la clé 'v3_' + objet + numéro (comme les détails des photos).
const OBJ3D = {
  bracelet: {
    f: '3d/bracelet.glb',
    t: 'Mon bracelet',
    s: 'Plaqué or, maille forçat, un cœur rose serti griffes.',
    o: '20deg 62deg auto',
    det: [
      [0.04, 0.03, 0.9, 'Un seul cœur rose, taillé comme une pierre et tenu par de petites griffes.'],
      [-0.4, 0, -0.78, 'Un fermoir mousqueton, et deux petits anneaux pour régler la longueur.']
    ],
    // après le boss final : le même bracelet avec la petite plaque gravée « ♥ 03.07.2025 ♥ » accrochée près du fermoir
    // (plaque ajoutée à la main au modèle Meshy, voir CLAUDE.md) ; grav = centre de la plaque, grt = angle de caméra face au texte
    fg: '3d/bracelet-grave.glb',
    grav: [-0.976, -0.037, -0.452],
    grt: 245
  },
  coeur: {
    f: '3d/coeur.glb',
    t: 'Le cœur, de très près',
    s: 'Agrandissement du Dr Rodolphe, en volume.',
    o: '30deg 68deg auto',
    det: [[0.128, 0.052, -0.123, 'Sur une griffe : une trace brillante, comme de la colle. Ce cœur a été recollé.']]
  },
  vinted: {
    f: '3d/vinted.glb',
    t: 'Le bracelet de l’annonce',
    s: 'Celui qu’erika_lyo vend 12 € sur Vinted.',
    o: '30deg 70deg auto',
    det: [
      [-0.08, -0.28, 0.16, 'Ce cœur-là est tout plat et lisse : il n’est pas taillé comme une pierre.'],
      [0.63, 0, 0.03, 'Il pend à un gros anneau rond, au lieu d’être serti dans la chaîne.']
    ]
  },
  // les souvenirs de Célestine gagnés contre les boss (vitrine des Trésors)
  ongles: { f: '3d/ongles.glb', t: 'Tes ongles étoilés', s: 'Amande nude, petites étoiles noires et points blancs 💅', o: '180deg 80deg auto' },
  lunettes: { f: '3d/lunettes.glb', t: 'Tes lunettes', s: 'Tes grandes lunettes écaille 👓', o: '20deg 75deg auto' },
  tacos: { f: '3d/tacos.glb', t: 'La galette de tacos', s: 'Bien grillée, avec ses frites et sa sauce fromagère 🌯', o: '20deg 60deg auto' },
  // figurines animées (personnages faits avec Meshy, avec un squelette) : anim = [nom de l'animation dans le fichier, bouton]
  figValentin: {
    f: '3d/fig-valentin.glb',
    t: 'Valentin en figurine',
    s: 'Il danse pour fêter tes boss vaincus 🕺',
    o: '0deg 80deg auto',
    anim: [
      ['danse', '🕺 Danse'],
      ['salut', '👋 Coucou']
    ]
  },
  figCelestine: {
    f: '3d/fig-celestine.glb',
    t: 'Célestine en figurine',
    s: 'Elle danse pour fêter l’enquête résolue 💃',
    o: '0deg 80deg auto',
    anim: [
      ['danse', '💃 Danse'],
      ['joie', '🎉 Saut de joie'],
      ['salut', '👋 Coucou']
    ]
  }
};

// chargement de la bibliothèque, une seule fois
let V3P = null;
const v3Charge = () =>
  V3P ||
  (V3P = new Promise((ok, ko) => {
    if (window.customElements && customElements.get('model-viewer')) return ok();
    const s = document.createElement('script');
    s.src = FICHIERS.modeles3d[0];
    s.onload = () => customElements.whenDefined('model-viewer').then(ok);
    s.onerror = () => {
      V3P = null;
      ko();
    };
    document.head.appendChild(s);
  }));

const v3Pos = p => p.map(v => v + 'm').join(' ');
// le <model-viewer> d'un objet ; o.grav = la version gravée (fichier fg) quand l'objet en a une
function v3MV(id, o = {}) {
  const M = OBJ3D[id],
    D = S.det || {};
  return `<model-viewer class="v3-mv" src="${(o.grav && M.fg) || M.f}" alt="${esc(M.t)}" camera-controls min-camera-orbit="auto auto 0.05m" touch-action="none" orbit-sensitivity="0.5" interpolation-decay="110" min-camera-orbit="auto 15deg auto" max-camera-orbit="auto 165deg auto" ${M.anim ? `autoplay animation-name="${M.anim[0][0]}"` : 'auto-rotate rotation-per-second="14deg"'} interaction-prompt="none" environment-image="neutral" exposure="1.15" shadow-intensity="1" camera-orbit="${M.o}">${(
    M.det || []
  )
    .map((d, i) => `<span slot="hotspot-${i}" class="v3-hs${D['v3_' + id + i] ? ' on' : ''}" data-position="${v3Pos(d)}"><b>${i + 1}</b></span>`)
    .join('')}</model-viewer>`;
}
const v3Liste = id =>
  (OBJ3D[id].det || []).map((d, i) => ((S.det || {})['v3_' + id + i] ? `<li><b>${i + 1}.</b> ${esc(d[3])}</li>` : '')).join('');

// ouvre un objet en grand. o.retour = code à lancer avec le bouton retour (sinon on ferme),
// o.grav = montrer la gravure (après le boss final), o.s2 = 2e phrase (après le boss final), o.nouveau = animation d'arrivée
function vue3d(id, o = {}) {
  const M = OBJ3D[id];
  if (!M) return;
  // un souvenir pas encore vu : on le note (S.v3Vus) et il arrive avec son animation
  if (o.nouveau) {
    S.v3Vus = S.v3Vus || [];
    if (!S.v3Vus.includes(id)) S.v3Vus.push(id);
    save();
  }
  window.__v3 = { id, o };
  const n = (M.det || []).length,
    sous = o.s2 && M.s2 ? M.s2 : M.s;
  popup(
    `<div class="v3"><h2>🧊 ${esc(M.t)}</h2>${sous ? `<p class="muted v3-s">${esc(sous)}</p>` : ''}<div class="v3-zone" id="v3z"><p class="v3-load">⏳ Chargement de l’objet en 3D…</p></div>${
      M.anim ? `<p class="v3-anims">${M.anim.map(([a, l], i) => `<button class="sm${i ? ' alt' : ''}" onclick="v3Anim(this,'${a}')">${l}</button>`).join('')}</p>` : ''
    }<p class="ph-hint">🔄 Fais-le tourner du doigt, pince pour zoomer.${
      n ? ' Touche un détail pour le noter.' : ''
    }</p>${n ? `<ul class="ph-det" id="v3d">${v3Liste(id)}</ul>` : ''}<button class="alt" onclick="${o.retour ? o.retour.replace(/"/g, '&quot;') : 'closePop()'}">${
      o.retour ? '← Retour' : 'Fermer'
    }</button></div>`
  );
  try {
    SFX('tap');
  } catch (_) {}
  v3Charge().then(
    () => {
      const z = document.getElementById('v3z');
      if (!z || !window.__v3 || window.__v3.id != id) return;
      z.innerHTML = v3MV(id, o) + '<p class="v3-load">⏳ Chargement de l’objet en 3D…</p>';
      const mv = z.querySelector('model-viewer'),
        ld = z.querySelector('.v3-load');
      v3Stop(mv);
      mv.addEventListener('load', () => {
        if (ld) ld.remove();
        if (o.nouveau) v3Arrivee(mv, z);
      });
      mv.addEventListener('error', () => ld && (ld.textContent = '😕 L’objet n’a pas pu s’afficher. Réessaie avec une connexion.'));
      if (n) v3Toucher(mv, id);
    },
    () => {
      const z = document.getElementById('v3z');
      if (z) z.innerHTML = '<p class="v3-load">😕 La 3D a besoin d’une connexion la première fois. Réessaie avec Internet.</p>';
    }
  );
  try {
    slog('🧊', 'Objet 3D ouvert : ' + M.t);
  } catch (_) {}
}

// figurine : changer d'animation (bouton sous la zone)
function v3Anim(b, a) {
  const mv = document.querySelector('#v3z model-viewer');
  if (!mv) return;
  mv.animationName = a;
  mv.currentTime = 0;
  mv.play();
  b.parentNode.querySelectorAll('button').forEach(x => x.classList.toggle('alt', x != b));
  try {
    SFX('tap');
  } catch (_) {}
}
// dès que Célestine le touche, l'objet arrête de tourner tout seul (sinon il « lutte » contre le doigt)
const v3Stop = mv => mv.addEventListener('camera-change', e => e.detail && e.detail.source == 'user-interaction' && (mv.autoRotate = false));
// toucher le modèle (sans le faire tourner) : on cherche le détail le plus proche, à l'écran
function v3Toucher(mv, id) {
  let x0 = 0,
    y0 = 0;
  mv.addEventListener('pointerdown', e => {
    x0 = e.clientX;
    y0 = e.clientY;
  });
  mv.addEventListener('click', e => {
    if (Math.hypot(e.clientX - x0, e.clientY - y0) > 8) return;
    const r = mv.getBoundingClientRect(),
      x = e.clientX - r.left,
      y = e.clientY - r.top,
      lim = Math.max(30, r.width * 0.09);
    let best = -1,
      bd = 1e9;
    (OBJ3D[id].det || []).forEach((d, i) => {
      const h = mv.queryHotspot && mv.queryHotspot('hotspot-' + i);
      if (!h || !h.canvasPosition) return;
      const dd = Math.hypot(h.canvasPosition.x - x, h.canvasPosition.y - y);
      if (dd < bd) {
        bd = dd;
        best = i;
      }
    });
    if (best < 0 || bd > lim) {
      const p = document.createElement('b');
      p.className = 'ph-rien';
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      mv.parentNode.appendChild(p);
      setTimeout(() => p.remove(), 600);
      return;
    }
    const k = 'v3_' + id + best;
    S.det = S.det || {};
    if (S.det[k]) return;
    S.det[k] = 1;
    save();
    try {
      SFX('ok');
    } catch (_) {}
    try {
      slog('🔎', 'Détail repéré en 3D : ' + OBJ3D[id].det[best][3]);
    } catch (_) {}
    toast('🔎 Détail repéré !');
    const hs = mv.querySelector(`[slot="hotspot-${best}"]`),
      l = document.getElementById('v3d');
    if (hs) hs.classList.add('on');
    if (l) l.innerHTML = v3Liste(id);
  });
}

// des paillettes dorées et un flash, par-dessus un objet 3D (zone = son conteneur)
function v3Eclat(zone, n = 26) {
  const f = document.createElement('div');
  f.className = 'v3-flash';
  const p = document.createElement('div');
  p.className = 'v3-pail';
  p.innerHTML = Array.from(
    { length: n },
    () =>
      `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;--d:${(Math.random() * 0.9).toFixed(2)}s;--s:${(
        0.6 +
        Math.random() * 0.9
      ).toFixed(2)}"></i>`
  ).join('');
  zone.append(f, p);
  setTimeout(() => (f.remove(), p.remove()), 2600);
}

// boss final : le bracelet gravé en 3D remplace le dessin de la carte, avec un vrai plan de cinéma :
// la caméra arrive de loin, fait le tour du bracelet au ralenti, plonge sur la petite plaque où la date est gravée (flash, paillettes),
// puis recule. Si Célestine touche le bracelet, le film s'arrête et elle le tourne elle-même.
function v3Gravure(carte) {
  v3Charge().then(
    () => {
      const sv = carte.querySelector('svg');
      if (!sv || !carte.isConnected) return;
      const w = document.createElement('div');
      w.className = 'v3-carte';
      w.innerHTML = v3MV('bracelet', { grav: 1 }) + '<small class="v3-tourne">🔄 Tourne-le du doigt</small>';
      const mv = w.querySelector('model-viewer');
      mv.removeAttribute('auto-rotate');
      mv.setAttribute('camera-orbit', '70deg 82deg 170%');
      // toucher le bracelet ne fait pas avancer la scène
      ['pointerdown', 'click', 'touchstart'].forEach(t => mv.addEventListener(t, e => e.stopPropagation()));
      w.style.cssText = 'position:absolute;opacity:0;pointer-events:none';
      carte.appendChild(w);
      mv.addEventListener(
        'load',
        () => {
          sv.replaceWith(w);
          w.style.cssText = '';
          carte.classList.add('v3-ok');
          v3Film(mv, w);
        },
        { once: true }
      );
    },
    () => {}
  );
}
function v3Film(mv, w) {
  const T = [],
    M = OBJ3D.bracelet,
    th = M.grt,
    plan = (ms, fn) => T.push(setTimeout(() => w.isConnected && fn(), ms));
  let vu = 0;
  const revele = () => {
    if (vu++) return;
    v3Eclat(w);
    try {
      SFX('ok');
    } catch (_) {}
  };
  mv.addEventListener('camera-change', e => {
    if (!e.detail || e.detail.source != 'user-interaction' || !T.length) return;
    T.forEach(clearTimeout);
    T.length = 0;
    mv.interpolationDecay = 110;
  });
  // 1. tour du bracelet au ralenti, 2. on s'approche de la plaque, 3. gros plan sur la date gravée (flash, paillettes), 4. on recule
  plan(150, () => {
    mv.interpolationDecay = 1100;
    mv.cameraOrbit = `${th - 50}deg 55deg 105%`;
  });
  plan(2600, () => {
    mv.interpolationDecay = 800;
    mv.cameraTarget = v3Pos(M.grav);
    mv.cameraOrbit = `${th}deg 34deg 0.62m`;
  });
  plan(4300, () => {
    mv.interpolationDecay = 700;
    mv.cameraOrbit = `${th}deg 16deg 0.44m`;
  });
  plan(5600, revele);
  plan(8800, () => {
    mv.interpolationDecay = 600;
    mv.cameraTarget = 'auto auto auto';
    mv.cameraOrbit = `${th}deg 55deg auto`;
  });
  plan(10800, () => {
    T.length = 0;
    mv.interpolationDecay = 110;
    mv.autoRotate = true;
  });
}

// un nouveau souvenir arrive dans la vitrine : il tombe du ciel en tournant (en fait la caméra tourne autour), rebondit, puis brille
function v3Arrivee(mv, zone) {
  const c = mv.getBoundingBoxCenter(),
    d = mv.getDimensions(),
    H = Math.max(d.x, d.y, d.z) * 1.6,
    D = 1800,
    rebond = k => {
      const n = 7.5625,
        q = 2.75;
      if (k < 1 / q) return n * k * k;
      if (k < 2 / q) return n * (k -= 1.5 / q) * k + 0.75;
      if (k < 2.5 / q) return n * (k -= 2.25 / q) * k + 0.9375;
      return n * (k -= 2.625 / q) * k + 0.984375;
    };
  mv.autoRotate = false;
  const o0 = mv.getCameraOrbit();
  zone.classList.add('v3-nouveau');
  const b = document.createElement('b');
  b.className = 'v3-banniere';
  b.textContent = '✨ Nouveau souvenir !';
  zone.appendChild(b);
  // l'objet attend hors de l'écran, au-dessus, que la 3D soit vraiment affichée
  mv.cameraTarget = `${c.x}m ${c.y - H}m ${c.z}m`;
  mv.jumpCameraToGoal();
  let t0 = 0;
  const pas = now => {
    if (!mv.isConnected) return;
    t0 = t0 || now;
    const k = Math.min(1, (now - t0) / D);
    mv.cameraTarget = `${c.x}m ${c.y - (1 - rebond(k)) * H}m ${c.z}m`;
    mv.cameraOrbit = `${(o0.theta * 57.2958 - (1 - (1 - k) ** 3) * 720).toFixed(1)}deg ${(o0.phi * 57.2958).toFixed(1)}deg ${o0.radius}m`;
    mv.jumpCameraToGoal();
    if (k < 1) return requestAnimationFrame(pas);
    v3Eclat(zone, 34);
    try {
      SFX('ok');
    } catch (_) {}
    setTimeout(() => mv.isConnected && (mv.autoRotate = true), 900);
  };
  const go = () => setTimeout(() => requestAnimationFrame(pas), 250);
  if (mv.modelIsVisible) go();
  else mv.addEventListener('model-visibility', e => e.detail.visible && go(), { once: true });
}
