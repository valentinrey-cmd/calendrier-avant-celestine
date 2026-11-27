/* ---------- Trésors ---------- */
function meView() {
  if (!feat(1)) {
    app.innerHTML = `<h1>Mes trésors</h1><div class="panel center"><p style="font-size:2.5rem;margin:0">🔒</p><p>Tes trésors s'ouvrent avec la case du 1er décembre.</p></div>${syncHTML()}`;
    return;
  }
  const L = lvl(),
    nx = LEVELS[L + 1],
    pc = nx ? ((S.earned - LEVELS[L][0]) / (nx[0] - LEVELS[L][0])) * 100 : 100;
  app.innerHTML = `<h1>Mes trésors</h1>
 <div class="panel center"><div style="font-size:2rem"><span class="lvpic" style="background-image:url(${lvlPic(L)})"></span></div><h2 style="margin:0">Niveau ${L + 1} · ${LEVELS[L][1]}</h2><div class="bar"><i style="width:${pc}%"></i></div><p class="muted" style="margin:0">${nx ? `${S.earned}/${nx[0]} ⭐ gagnés pour le niveau suivant` : 'Niveau maximum !'} · Chaque niveau offre un 💡 et 2 💎</p>
  <div class="lvls">${LEVELS.map((l, i) => `<div class="lvi ${i <= L ? 'ok' : ''} ${i == L ? 'cur' : ''}"><span class="lvpic sm" style="background-image:url(${lvlPic(i)})"></span><small>${i + 1}</small><b>${i <= L ? esc(l[1]) : '???'}</b><em>${l[0]} ⭐</em></div>`).join('')}</div></div>
 ${vitrineHTML()}${S.vbDone ? `<h2>📊 Bilan de l’aventure</h2><div class="panel center"><button onclick="bilanOpen()">📊 Voir mon bilan</button></div>` : ''}<h2>🕵️ Carnet d’enquête</h2><div class="panel">${enqHTML('sus')}<p class="center" style="margin:8px 0 0"><button class="alt sm" onclick="enqOpen('dep')">📓 Ouvrir le carnet complet</button></p></div>${storyHTML()}${achHTML()}${plHTML()}${statsHTML()}<h2>💌 Mes bons</h2>${S.bons.length ? S.bons.map((b, i) => `<div class="bon ${b.used ? 'used' : ''}"><div class="ic">${b.ic}</div><div class="tx"><b>${esc(b.n)}</b><br><small>${b.used ? 'Utilisé' : 'À utiliser quand tu veux'}</small><br><small class="muted" style="font-size:.7rem"><i>*Valable uniquement si Valentin est de bonne humeur (il l’est toujours avec toi).</i></small></div>${b.used ? '' : `<button class="sm" onclick="showBon(${i})">Utiliser</button>`}</div>`).join('') : '<p class="muted">Pas encore de bon : fais un tour à la boutique !</p>'}
 <h2>🎒 Mes bonus</h2><div class="panel">🔩 Pièces : <b>${S.scr}</b> · 💎 Gemmes : <b>${S.gem}</b><br>💡 Indices : <b>${S.inv.hint}</b> · 🃏 Jokers : <b>${S.inv.joker}</b> · ✨ Points doublés : <b>${S.inv.dbl}</b> · 🎟️ Jetons : <b>${S.inv.jeton || 0}</b><br>🔓 Cases en avance : <b>${S.inv.early}</b> ${S.inv.early && nextEarly() ? `<button class="sm" onclick="useEarly()">Ouvrir le jour ${nextEarly()}</button>` : ''}</div>
`;
}

// 🧊 La vitrine 3D : le bracelet, puis un souvenir de plus à chaque boss vaincu (objets dans OBJ3D, js/vue-3d.js)
const VITRINE = ['bonhomme', 'traineau', 'pizza', 'cadenas'];
function vitrineHTML() {
  const nb = Object.keys(S.boss || {}).filter(k => S.boss[k]).length + (S.vbDone ? 1 : 0),
    o = S.vbDone ? "{grav:1,s2:1}" : '{}',
    case3d = (id, ok, ic) =>
      ok
        ? `<button class="v3-case" onclick="vue3d('${id}',${o})"><span>${ic}</span><b>${esc(OBJ3D[id].t)}</b><small>🧊 Voir en 3D</small></button>`
        : `<div class="v3-case lock"><span>🔒</span><b>Souvenir mystère</b><small>⚔️ Bats un boss</small></div>`;
  return `<h2>🧊 Ma vitrine 3D</h2><div class="panel"><p class="muted" style="margin:0 0 8px">Des objets en vrai volume, à faire tourner du doigt. Un nouveau souvenir à chaque boss vaincu.</p><div class="v3-vit">${case3d(
    'bracelet',
    1,
    '💗'
  )}${VITRINE.map((id, i) => case3d(id, nb > i, ['☃️', '🛷', '🍕', '🔒'][i])).join('')}</div></div>`;
}
