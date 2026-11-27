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
    grav: [-0.63, -0.02, -0.69]
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
  bonhomme: { f: '3d/bonhomme.glb', t: 'Le bonhomme de neige', s: 'Le gardien du toit du fichier mystère ☃️', o: '15deg 75deg auto' },
  traineau: { f: '3d/traineau.glb', t: 'Le traîneau du Père Noël', s: 'Il a fini dans la neige du toit 🛷', o: '35deg 72deg auto' },
  pizza: { f: '3d/pizza.glb', t: 'Les boîtes de Pizza Mario', s: 'Un souvenir de Trévoux 🍕', o: '30deg 65deg auto' },
  cadenas: { f: '3d/cadenas.glb', t: 'Le cadenas à code', s: 'Huit chiffres… tu les connais ? 🔒', s2: 'Le code : 03.07.2025. Le jour où tout a commencé 💖', o: '20deg 75deg auto' }
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
// le <model-viewer> d'un objet ; o.grav = afficher l'endroit de la gravure (o.grav peut être le texte de l'étiquette)
function v3MV(id, o = {}) {
  const M = OBJ3D[id],
    D = S.det || {};
  return `<model-viewer class="v3-mv" src="${M.f}" alt="${esc(M.t)}" camera-controls touch-action="none" orbit-sensitivity="0.5" interpolation-decay="110" min-camera-orbit="auto 15deg auto" max-camera-orbit="auto 165deg auto" auto-rotate rotation-per-second="14deg" interaction-prompt="none" environment-image="neutral" exposure="1.15" shadow-intensity="1" camera-orbit="${M.o}">${(
    M.det || []
  )
    .map((d, i) => `<span slot="hotspot-${i}" class="v3-hs${D['v3_' + id + i] ? ' on' : ''}" data-position="${v3Pos(d)}"><b>${i + 1}</b></span>`)
    .join('')}${o.grav && M.grav ? `<span slot="hotspot-grav" class="v3-hs on v3-grav" data-position="${v3Pos(M.grav)}"><em>${typeof o.grav == 'string' ? o.grav : '✨ 03.07.2025'}</em></span>` : ''}</model-viewer>`;
}
const v3Liste = id =>
  (OBJ3D[id].det || []).map((d, i) => ((S.det || {})['v3_' + id + i] ? `<li><b>${i + 1}.</b> ${esc(d[3])}</li>` : '')).join('');

// ouvre un objet en grand. o.retour = code à lancer avec le bouton retour (sinon on ferme),
// o.grav = montrer la gravure (après le boss final)
function vue3d(id, o = {}) {
  const M = OBJ3D[id];
  if (!M) return;
  window.__v3 = { id, o };
  const n = (M.det || []).length,
    sous = o.s2 && M.s2 ? M.s2 : M.s;
  popup(
    `<div class="v3"><h2>🧊 ${esc(M.t)}</h2>${sous ? `<p class="muted v3-s">${esc(sous)}</p>` : ''}<div class="v3-zone" id="v3z"><p class="v3-load">⏳ Chargement de l’objet en 3D…</p></div><p class="ph-hint">🔄 Fais-le tourner du doigt, pince pour zoomer.${
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
      mv.addEventListener('load', () => ld && ld.remove());
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

// boss final : le bracelet gravé tourne en 3D dans la carte de la gravure (sinon le dessin reste)
function v3Gravure(carte) {
  v3Charge().then(
    () => {
      const sv = carte.querySelector('svg');
      if (!sv || !carte.isConnected) return;
      const w = document.createElement('div');
      w.className = 'v3-carte';
      w.innerHTML = v3MV('bracelet', { grav: '✨ gravé ici' }) + '<small class="v3-tourne">🔄 Tourne-le du doigt</small>';
      const mv = w.querySelector('model-viewer');
      mv.setAttribute('camera-orbit', '200deg 55deg auto');
      v3Stop(mv);
      // toucher le bracelet ne fait pas avancer la scène
      ['pointerdown', 'click', 'touchstart'].forEach(t => mv.addEventListener(t, e => e.stopPropagation()));
      mv.addEventListener('load', () => {
        sv.replaceWith(w);
        carte.classList.add('v3-ok');
      });
      w.style.cssText = 'position:absolute;opacity:0;pointer-events:none';
      carte.appendChild(w);
      mv.addEventListener('load', () => (w.style.cssText = ''), { once: true });
    },
    () => {}
  );
}
