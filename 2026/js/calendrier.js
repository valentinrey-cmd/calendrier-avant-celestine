/* ---------- Calendrier ---------- */
const pcs = p =>
  `background-image:url(${IMG});background-size:400% 600%;background-position:${((p % 4) / 3) * 100}% ${(Math.floor(p / 4) / 5) * 100}%`;
function finHTML() {
  if (!S.vbDone) return '';
  const d = new Date(S.vbDone),
    ds = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
    nb = Object.keys(S.boss || {}).filter(k => S.boss[k]).length;
  return `<div class="panel finb"><div class="fbig">🏆</div><b>Jeu terminé !</b><p>${window.I18N && I18N.on() ? `On ${esc(ds)}, Célestine defeated Valentin… with love 💘` : `Le ${esc(ds)}, Célestine a vaincu Valentin… par amour 💘`}</p><p class="muted" style="font-size:.85rem">👹 ${nb}/6 boss battus · ✅ ${Object.values(S.days).filter(x => x.done && !x.lost).length} jeux réussis · 🏅 ${Object.keys(S.ach || {}).length} succès</p><div class="row"><button class="sm" onclick="vCredits()">🎬 Revoir le générique</button></div></div>`;
}
function calFit() {
  const R = document.documentElement,
    c = document.querySelector('main .cal');
  if (!c) return;
  if (!R.classList.contains('tabp')) {
    c.style.removeProperty('--calh');
    return;
  }
  requestAnimationFrame(() => {
    const top = c.getBoundingClientRect().top + scrollY,
      nv = document.getElementById('tabs'),
      nh = nv && getComputedStyle(nv).position == 'fixed' ? nv.offsetHeight : 70,
      av = innerHeight - top - nh - 14,
      gap = parseFloat(getComputedStyle(c).rowGap) || 8,
      rows = Math.ceil(24 / 4),
      h = Math.max(c.children[0] ? c.children[0].offsetWidth * 0.5 : 80, (av - gap * (rows - 1)) / rows);
    c.style.setProperty('--calh', h.toFixed(1) + 'px');
  });
}
function calView() {
  setTimeout(calFit, 0);
  if (new Date().getHours() < 5 && !window.__nightMsg) {
    window.__nightMsg = 1;
    setTimeout(() => toast('Il est tard… Valentin dort déjà, lui (il ronfle) 😴'), 700);
  }
  const u = unl(),
    n = S.opened.length,
    dn = Object.values(S.days).filter(x => x.done && !x.lost).length;
  app.innerHTML = `<h1 class="calh">Calendrier de l'Avent<button class="infob" onclick="calHelp()" aria-label="Les règles">i</button></h1>${S.vbDone ? '<div class="fintw"><span class="fintg">🏆 TERMINÉ</span></div>' : ''}
 <div class="panel"><div class="row" style="justify-content:space-between;margin:0"><span>📅 ${n}/24 cases</span><span>✅ ${dn} jeux réussis</span><span>🔥 ${flames()} flamme${flames() > 1 ? 's' : ''}</span></div><div class="bar"><i style="width:${(n / 24) * 100}%"></i></div>
 ${u == 0 ? `<p class="center muted" style="margin:4px 0">Les cases s'ouvrent à partir du 1er décembre, à minuit. Patience… 🎅</p>` : ''}</div>${finHTML()}${(S.story || {}).pro ? `<p class="center" style="margin:4px 0 10px"><button class="alt sm" onclick="enqOpen()">🕵️ Carnet d’enquête · ${CLUES.filter(clueOn).length}/${CLUES.length} indices</button></p>` : ''}
 ${feat(7) ? (wheelEnd() ? `<div class="row"><button disabled>🎡 La roue est terminée : joyeux Noël 🎄</button></div>` : `<div class="row"><button onclick="wheel()" ${S.wheel == dayKey() ? 'disabled' : ''}>🎡 Roue de la chance${S.wheel == dayKey() ? ' : reviens demain' : ''}</button></div>`) : ''}
 <div class="cal">${Array.from({ length: 24 }, (_, i) => {
   const d = i + 1,
     o = S.opened.includes(d),
     ok = avail(d),
     D = DAYS[d],
     dn = S.days[d] && S.days[d].done;
   return `<button class="day ${o ? 'done' : ok ? 'ok' : 'lock'}" style="${o ? pcs(S.map[i]) : ''}" aria-label="Jour ${d}${o ? ', ouvert' : ok ? ', disponible' : ', verrouillé'}" onclick="tapDay(${d})">${o || ok ? d : '🔒'}${D.ev && (o || ok) ? `<span class="ev">${D.ev}</span>` : ''}${o ? `<span class="ck">${dn ? (S.days[d].lost ? '😢' : '✅') : '⏳'}</span>` : ''}${bossCfg(d) ? `<span class="bsb ${(S.boss || {})[d] ? 'won' : ''}" title="Boss">${(S.boss || {})[d] ? '🏆' : '👹'}</span>` : ''}</button>`;
 }).join('')}</div>`;
}
const pick = a => a[Math.floor(Math.random() * a.length)];
const JK = {
  lock: ['Patience, jeune padawan 🧘', 'Non.', 'Toujours non.', 'Tu insistes ? Le lieutenant Pépin te surveille 👀'],
  lose: [
    'Même Valentin aurait réussi… non, c’est faux.',
    'C’est la faute du téléphone, évidemment.',
    'Respire. Bois un thé, mange des spéculoos. Réessaie.'
  ],
  hint: ['💡 Indice gratuit : concentre-toi 🙂', 'Même Valentin, aussi débile qu’il soit, l’a réussi sans indice.'],
  lab: [
    'Le Dr Rodolphe fait une pause café ☕',
    'Gérald s’est coincé le doigt dans le fax, ça va aller',
    'La scientifique se dispute pour la radio 📻',
    'Le labo est en grève (24 minutes) 🪧'
  ],
  boot: [
    'Chargement de l’amour… 99 %… toujours 99 %',
    'Chauffage de la machine à café du commissariat…',
    'Calibrage des blagues nulles…',
    'Recherche des clés du brigadier Gérald…'
  ],
  vtap: [
    'Arrête, ça chatouille !',
    'Je sais que je suis beau.',
    'Hé ! On ne touche pas au boss !',
    'Encore ? T’es amoureuse ou quoi ?',
    'Ça ne te fera pas gagner plus vite…',
    'Bon ok… encore une fois.',
    'Tu me déconcentres là.',
    'J’appelle mon avocat.',
    'Hihi.'
  ]
};
let lockT = { d: 0, n: 0 };
function tapDay(d) {
  if (!avail(d)) {
    SFX('bad');
    if (d > unl()) {
      S.lockTaps = (S.lockTaps || 0) + 1;
      save();
      if (S.lockTaps >= 20)
        try {
          ACH('lockTap');
        } catch (_) {}
      lockT = lockT.d == d ? { d, n: lockT.n + 1 } : { d, n: 1 };
      if (!window.__cguSh && cguShame(d)) return;
      if (lockT.n == 10) {
        popup(
          `<h2>⚠️ Erreur 418</h2><p style="font-size:2.6rem;margin:.1em 0">🛠️</p><p><b>Case cassée.</b></p><p>Valentin a été prévenu.<br><small class="muted">(Il s’en fiche.)</small></p><button onclick="closePop()">Ok…</button>`
        );
        return;
      }
      toast(pick(JK.lock));
    }
    return;
  }
  if (S.opened.includes(d)) {
    SFX('tap');
    return go('day', d);
  }
  SFX('open');
  const D = DAYS[d];
  S.opened.push(d);
  S.opened.sort((a, b) => a - b);
  slog('📅', `Ouvre la case ${d} · ${D.t}`);
  award(PTS.open + (D.bonus || 0), D.bonus ? 'cadeau du jour 🎁' : 'case ouverte');
  ding();
  calView();
  openAnim(d, () =>
    popup(
      `<h2>Jour ${d}</h2>${D.ev ? `<div class="ribbon">${D.ev} Événement spécial</div>` : ''}<div class="pc" style="${pcs(S.map[d - 1])}" role="img" aria-label="Fragment du jour ${d}"></div><p>Nouveau morceau de l'image découvert !<br><b>${esc(D.t)}</b></p><button onclick="go('day',${d})">Jouer au jeu du jour</button><button class="alt" onclick="closePop()">Plus tard</button>`
    )
  );
}
