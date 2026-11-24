/* ---------- Laboratoire ---------- */
const HR = 36e5,
  MN = 6e4,
  CONSO = ['hint', 'joker', 'dbl', 'early', 'jeton'];
// Machines : jour d'ouverture (case à ouvrir), prix de réparation (🔩), durée de réparation (heures), niveau max
const MACH = [
  {
    id: 'astuce',
    ic: '🔧',
    n: 'La fabrique à bonus',
    day: 4,
    cost: 20,
    up: [20, 40],
    rep: 1,
    max: 3,
    unlk: 1,
    items: ['joker', 'hint', 'dbl'],
    d: 'Fabrique des 🃏 jokers. Améliore-la pour débloquer les 💡 indices, puis les ✨ points doublés.'
  },
  {
    id: 'conv',
    ic: '🔄',
    n: 'Convertisseur',
    day: 5,
    cost: 15,
    up: [15, 30],
    rep: 1,
    max: 3,
    conv: true,
    d: "Échange tes ⭐ contre des 🔩, ou l'inverse."
  },
  {
    id: 'deco',
    ic: '🎨',
    n: 'Atelier déco',
    day: 8,
    cost: 40,
    up: [40, 60],
    rep: 3,
    max: 3,
    unlk: 1,
    items: ['coeurs', 'fondrose', 'ordore'],
    d: "Fabrique des décorations pour embellir l'appli. Chaque amélioration débloque une nouvelle déco."
  },
  {
    id: 'jeton',
    ic: '🎰',
    n: 'Imprimante à jetons',
    day: 11,
    cost: 25,
    rep: 4,
    max: 3,
    flat: 1,
    items: ['jeton'],
    d: 'Imprime des 🎟️ jetons : une mise gratuite au casino. Chaque amélioration rend tes jetons plus précieux (10 ⭐ → 25 ⭐ → 50 ⭐).'
  },
  {
    id: 'studio',
    ic: '💝',
    n: 'Le coffre à souvenirs',
    day: 3,
    cost: 20,
    up: [20, 30],
    rep: 1,
    max: 3,
    unlk: 1,
    items: ['playlist', 'album', 'voix'],
    d: ''
  },
  {
    id: 'secret',
    ic: '📠',
    n: 'Le fax du procureur',
    day: 24,
    cost: 0,
    rep: 0,
    max: 1,
    items: ['secret'],
    d: 'Il envoie ton formulaire d’accusation au procureur. Il lui faut le formulaire recollé.'
  }
];
// Recettes : prix en 🔩 et durée en minutes (au niveau 1)
const RCP = {
  hint: { c: 10, t: 20 },
  joker: { c: 15, t: 45 },
  coeurs: { c: 30, t: 60 },
  fondrose: { c: 35, t: 90 },
  ordore: { c: 40, t: 120 },
  jeton: { c: 10, t: 60 },
  dbl: { c: 25, t: 120 },
  album: { c: 50, t: 240 },
  voix: { c: 50, t: 240 },
  playlist: { c: 10, t: 30 },
  surprise3: { c: 120, t: 300 },
  early: { c: 50, t: 240 },
  secret: { c: 0, t: 60 }
};
const CONV = { t: 30, lots: [1, 5] };
// 10 ⭐ → 5 🔩 ou 10 🔩 → 5 ⭐, par lot
const CAPS = [
  [2, 0],
  [4, 20],
  [6, 35],
  [10, 55]
];
// places de l'entrepôt et prix pour y passer
const FLMS = { 3: 25, 7: 40, 14: 60, 24: 120 };
// 🔩 gagnées aux paliers de flammes
let curM = null,
  labSig = '';
const LBM = id => {
  if (!S.lab || typeof S.lab != 'object') S.lab = {};
  return S.lab[id] || (S.lab[id] = { lv: 0, rep: 0, job: null });
};
const MOF = id => MACH.find(M => M.id == id);
const itm = id =>
  id == 'album'
    ? { ic: '📖', n: 'L’album souvenir' }
    : id == 'playlist'
      ? { ic: '🎵', n: 'Notre playlist' }
      : id == 'surprise3'
        ? { ic: '🎁', n: (CONTENU.coffre3 || {}).n || 'Surprise à venir' }
        : id == 'secret'
          ? { ic: '⚖️', n: 'Feu vert du procureur' }
          : id == 'conv'
            ? { ic: '🔄', n: 'Conversion' }
            : SHOP.find(x => x.id == id);
const stock = () => CONSO.reduce((s, k) => s + (S.inv[k] || 0), 0);
const labOpen = () => !!S.demOn || feat(3);
function mState(M) {
  if (M.id == 'secret' && S.demOn) return 'idle';
  const m = LBM(M.id),
    t = Date.now();
  if (!feat(M.day)) return 'lock';
  if (!m.lv) return 'broken';
  if (m.rep > t) return 'rep';
  if (m.job) return m.job.end <= t ? 'done' : 'run';
  return 'idle';
}
const rtime = (M, it) => Math.round((it == 'conv' ? CONV.t : RCP[it].t) * MN);
const crate = () => [5, 5, 7, 10][LBM('conv').lv || 1];
const jetVal = () => [10, 10, 25, 50][Math.max(1, LBM('jeton').lv || 1)];
const itOpen = (M, it) => !M.unlk || M.items.indexOf(it) < Math.max(1, LBM(M.id).lv);
const vCount = () => (CONTENU.voix || []).length;
function upLbl(M, i) {
  if (M.unlk) return (itm(M.items[i]) || {}).ic + ' ' + ((itm(M.items[i]) || {}).n || '');
  if (M.id == 'jeton') return `Jeton = ${[10, 25, 50][i]} ⭐`;
  if (M.id == 'conv') return `${[50, 75, 100][i]} %`;
  return UPL[i];
}
const fmtT = ms => {
  const s = Math.max(0, Math.ceil(ms / 1000)),
    h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    x = s % 60;
  return h ? `${h} h ${String(m).padStart(2, '0')}` : m ? `${m} min ${String(x).padStart(2, '0')}` : `${x} s`;
};
const fmtD = ms => {
  const m = Math.round(ms / MN);
  return m >= 60 ? (m % 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')}` : `${m / 60} h`) : `${m} min`;
};
const gemCost = ms => Math.max(1, Math.ceil(ms / HR));
const upCost = M => {
  const m = LBM(M.id);
  return M.flat ? M.cost : M.up ? M.up[m.lv - 1] : m.lv == 1 ? Math.max(20, M.cost) : M.cost * 2;
};
const UPL = ['Base', '+30 % de vitesse', 'Double production'];
const owned = it => ['album', 'coeurs', 'fondrose', 'ordore', 'voix', 'playlist', 'surprise3'].includes(it) && S.own.includes(it);
const capNext = () => CAPS.find(c => c[0] > S.cap);
const MCOL = {
  astuce: '#4ab3ff',
  conv: '#3ddc84',
  deco: '#ff7ab6',
  jeton: '#ffb02e',
  ampli: '#ffd24a',
  studio: '#ff7ab6',
  temps: '#5ce1e6',
  secret: '#ff5fa2'
};
const STL = {
  lock: ['Bientôt', '#8a8f94'],
  broken: ['En panne', '#ff4d5e'],
  rep: ['Réparation', '#ff9a2a'],
  run: ['En production', '#4ab3ff'],
  done: ['Terminé !', '#ffd24a'],
  idle: ['Prête', '#3ddc84']
};
const pct = (s, e) => Math.max(0, Math.min(100, ((Date.now() - s) / Math.max(1, e - s)) * 100));
function span(M) {
  const m = LBM(M.id),
    s = mState(M);
  if (s == 'rep') return [m.repS || m.rep - M.rep * HR, m.rep];
  if (s == 'run') return [m.job.s, m.job.end];
  return null;
}
function bar(s, e) {
  return `<div class="bar mbar"><i class="pb" data-s="${s}" data-e="${e}" style="width:${pct(s, e)}%"></i></div>`;
}
function port(M, sz) {
  const s = mState(M),
    m = LBM(M.id),
    sp = span(M),
    p = sp ? pct(...sp) : s == 'idle' || s == 'done' ? 100 : 0;
  const ic = s == 'lock' && M.id == 'secret' ? '❓' : s == 'run' ? itm(m.job.it).ic : s == 'done' ? itm(m.job.it).ic : M.ic;
  return `<div class="port ${s}" style="--a:${MCOL[M.id]};--p:${p};--sz:${sz}px" ${sp ? `data-s="${sp[0]}" data-e="${sp[1]}"` : ''}><div class="pg"><span>${ic}</span></div></div>`;
}
function chip(M, sh) {
  const s = mState(M),
    m = LBM(M.id),
    sp = span(M),
    [l, c] = STL[s];
  return `<span class="schip" style="--sc:${c}"><i></i>${sh && sp ? '' : s == 'lock' ? `Le ${M.day} déc.` : l}${sp ? `${sh ? '' : ' · '}<b class="cd" data-e="${sp[1]}">${fmtT(sp[1] - Date.now())}</b>` : ''}</span>`;
}
const allMade = M => (M.id == 'secret' && S.demOn) || (M.items && M.items.every(it => owned(it) || (it == 'secret' && S.secretDone)));
function mpop(h) {
  popup(h);
  const c = $('#pop .card');
  if (c) c.classList.add('mcard');
}
function labView() {
  if (!labOpen()) {
    app.innerHTML = `<h1>Laboratoire</h1><div class="panel center"><p style="font-size:2.5rem;margin:0">🔒</p><p>Le laboratoire ouvre avec la case du 3 décembre.</p></div>`;
    return;
  }
  MACH.forEach(M => {
    const m = LBM(M.id);
    if (m.lv && m.rep <= Date.now()) m.seen = 1;
  });
  save();
  const nx = capNext(),
    st = stock();
  app.innerHTML = `<h1>🧪 Le laboratoire</h1>
 <div class="gauges"><div class="gauge"><small>Pièces</small><b>🔩 ${S.scr}</b></div><div class="gauge gem"><small>Gemmes</small><b>💎 ${S.gem}</b></div><button class="ghelp" onclick="labHelp()" aria-label="Comment ça marche">?</button></div>
 <div class="labroom"><div class="lab">${[MOF('studio'), ...MACH.filter(M => M.id != 'secret' && M.id != 'studio')].map(mCard).join('')}<div class="mc soon" aria-label="Bientôt"><div class="port lock" style="--sz:58px"><div class="pg"><span>🚧</span></div></div><div class="plate">Nouvelle machine</div><span class="soonb">COMING SOON</span></div>${MACH.filter(
   M => M.id == 'secret'
 )
   .map(mCard)
   .join('')}</div><div class="lfloor">· · · LABO DE LA SCIENTIFIQUE · · ·</div></div>
 <h2>📦 Entrepôt</h2><div class="panel whs"><div class="row" style="justify-content:space-between;margin:0;align-items:center"><span><b>${st}</b>/${S.cap} places</span>${nx ? `<button class="alt sm" ${S.scr < nx[1] ? 'disabled' : ''} onclick="capUp()">Agrandir à ${nx[0]} · ${nx[1]} 🔩</button>` : '<span class="muted">Taille max</span>'}</div><div class="slots">${Array.from({ length: S.cap }, (_, i) => `<i class="${i < st ? 'on' : ''}"></i>`).join('')}</div>
  ${
    CONSO.filter(k => S.inv[k] > 0)
      .map(k => {
        const x = itm(k);
        return `<div class="stk"><div class="ic">${x.ic}</div><div class="tx"><b>${esc(x.n)}</b> × ${S.inv[k]}</div><button class="alt sm" onclick="recycle('${k}')">♻️ +${Math.floor(RCP[k].c / 2)} 🔩</button></div>`;
      })
      .join('') || '<p class="muted" style="margin:6px 0 0">Ton entrepôt est vide. Lance une production !</p>'
  }
</div>`;
  labSig = labState();
}
function mCard(M) {
  const s = mState(M),
    m = LBM(M.id);
  let b = '';
  const strike = s == 'idle' && M.id != 'secret' && [...(dayKey() + M.id)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % 9 == 0;
  if (s == 'broken')
    b = `<button class="sm" onclick="event.stopPropagation();repair('${M.id}')" ${S.scr < M.cost ? 'disabled' : ''}>${M.cost ? `🔧 ${M.cost} 🔩` : M.id == 'secret' ? (puzOk() ? '📜 Insérer la fiche' : '🧩 Fiche manquante') : 'Allumer'}</button>`;
  else if (s == 'done') b = `<button class="sm glow" onclick="event.stopPropagation();collect('${M.id}')">Récupérer</button>`;
  else if (s == 'idle' && !allMade(M))
    b = `<button class="sm" onclick="event.stopPropagation();mOpen('${M.id}')">${M.conv ? 'Convertir' : 'Produire'}</button>`;
  else if (s == 'idle') b = `<span class="mt">${M.id == 'secret' ? 'Surprise livrée 💝' : 'Tout est fabriqué ✓'}</span>`;
  else if (s == 'rep' || s == 'run') {
    const sp = span(M);
    b = bar(sp[0], sp[1]);
  }
  return `<div class="mc ${s} ${M.id == 'secret' ? 'secret' : ''}" style="--a:${MCOL[M.id]}" ${s == 'lock' ? `onclick="mOpen('${M.id}')"` : `onclick="mOpen('${M.id}')" role="button" tabindex="0"`} aria-label="${esc(M.n)}">
  ${m.lv > 1 ? `<span class="lv">${'★'.repeat(m.lv)}</span>` : ''}
  ${strike ? '<span class="mstrk">✊ En grève — revendication : plus de câlins</span>' : ''}${port(M, 58)}<div class="plate">${s == 'lock' && M.id == 'secret' ? '???' : esc(M.n)}</div>${s == 'broken' || s == 'lock' || s == 'idle' ? '' : chip(M, 1)}${b}</div>`;
}
function mPanel(id) {
  const M = MOF(id),
    m = LBM(id),
    s = mState(M),
    t = Date.now(),
    sp = span(M);
  let h = `<div class="mpan" data-id="${id}" style="--a:${MCOL[id]}"><button class="mx" onclick="closePop();curM=null" aria-label="Fermer">✕</button>
 <div class="mhead"><div class="mgear a">⚙️</div><div class="mgear b">⚙️</div>${port(M, 96)}</div>
 <div class="plate big">${esc(M.n)}</div>
 <div class="mstat">${chip(M)}${m.lv ? `<span class="stars">${'★'.repeat(m.lv)}<i>${'★'.repeat(M.max - m.lv)}</i></span>` : ''}</div>

 ${M.conv ? `<div class="mbal"><span>⭐ <b>${S.pts}</b></span><span>🔩 <b>${S.scr}</b></span></div>` : `<div class="mbal"><span>🔩 <b>${S.scr}</b></span><span>💎 <b>${S.gem}</b></span><span>📦 <b>${stock()}/${S.cap}</b></span></div>`}`;
  if (s == 'broken' && id == 'secret')
    h += puzOk()
      ? `<div class="msec"><div class="mbig">📜</div><p>Le fax attend ton formulaire d’accusation. Glisse-le dedans !</p><button class="big" onclick="repair('secret')">📜 Faxer le formulaire</button></div>`
      : `<div class="msec"><div class="mbig">🧩</div><p>Le fax ne peut rien envoyer : le formulaire d’accusation a été broyé par Gérald.</p><p class="muted">Recolle les 24 morceaux dans l’onglet Puzzle.</p><button class="big" onclick="closePop();curM=null;go('puz')">🧩 Aller au puzzle</button></div>`;
  else if (s == 'broken')
    h += `<div class="msec"><div class="mbig">🔧</div><p>Cette machine est hors service.${M.rep ? `<br>Réparation : <b>${M.rep} h</b>` : ''}</p><button class="big" ${S.scr < M.cost ? 'disabled' : ''} onclick="repair('${id}')">${M.cost ? `Réparer · ${M.cost} 🔩` : 'Allumer la machine'}</button>${S.scr < M.cost ? `<p class="why">Il te manque ${M.cost - S.scr} 🔩</p>` : ''}</div>`;
  else if (s == 'rep' || s == 'run') {
    const g = gemCost(sp[1] - t);
    h += `<div class="msec"><p class="mlbl">${s == 'rep' ? '🔧 Réparation en cours' : `Fabrication : <b>${itm(m.job.it).ic} ${esc(itm(m.job.it).n)}</b>`}</p><p class="muted" style="margin:-4px 0 6px;font-size:.85rem"><i>${esc(pick(JK.lab))}</i></p><div class="mtime cd" data-e="${sp[1]}">${fmtT(sp[1] - t)}</div>${bar(sp[0], sp[1])}
  <button class="big gembtn" ${S.gem < g ? 'disabled' : ''} onclick="speedUp('${id}')">⚡ Finir maintenant · ${g} 💎</button>${S.gem < g ? `<p class="why">Il te faut ${g} 💎 (tu en as ${S.gem})</p>` : '<p class="muted" style="font-size:.8rem;margin:4px 0 0">1 💎 par heure restante</p>'}</div>`;
  } else if (s == 'done')
    h += `<div class="msec ready"><div class="mbig">${itm(m.job.it).ic}</div><p><b>C'est prêt !</b></p><button class="big glow" onclick="collect('${id}')">Récupérer</button></div>`;
  if (s != 'broken') {
    const lk = s == 'rep' ? 'En réparation' : s == 'run' || s == 'done' ? 'Atelier occupé' : '';
    if (M.conv)
      h += `<div class="cvs ${lk ? 'off' : ''}">
  <button class="big" ${lk || S.pts < 10 ? 'disabled' : ''} onclick="convGo('s',1)">10 ⭐ ➜ ${crate()} 🔩</button>
  <button class="big" ${lk || S.scr < 10 ? 'disabled' : ''} onclick="convGo('p',1)">10 🔩 ➜ ${crate()} ⭐</button>
  ${lk ? `<p class="why">${lk}</p>` : `<p class="muted" style="font-size:.8rem;margin:4px 0 0">⏱️ ${fmtD(rtime(M, 'conv'))}</p>`}</div>`;
    else if (allMade(M)) {
      if (s == 'idle')
        h +=
          M.id == 'secret'
            ? `<div class="msec"><div class="mbig">${S.vbDone ? '💘' : '😈'}</div><p>${S.vbDone ? 'Valentin a été vaincu… par amour 💘' : (S.story || {}).rev ? 'Valentin t’attend de pied ferme… 😈' : 'Feu vert du procureur : à toi d’inscrire le nom du coupable. ✍️'}</p><p class="vgm" id="vgm"></p><button onclick="vTry(this)">${S.vbDone ? '⚔️ Rejouer le combat final' : (S.story || {}).rev ? '⚔️ Affronter Valentin' : '⚖️ Démasquer le coupable'}</button>${S.vbDone ? '<button class="alt" onclick="closePop();vCredits()">🎬 Revoir le générique</button>' : ''}</div>`
            : `<div class="msec"><div class="mbig">✅</div><p>Tout ce que fabrique cette machine est déjà à toi.</p></div>`;
    } else {
      const full = stock() >= S.cap;
      h += `<h3 class="msh">${lk ? 'Recettes' : 'Fabriquer'}</h3>${lk ? `<p class="muted" style="font-size:.82rem;margin:-2px 0 6px">⏳ Une seule fabrication à la fois : tu pourras lancer la suivante quand l'atelier sera libre.</p>` : ''}<div class="rgrid">${M.items
        .map(it => {
          const x = itm(it),
            r = RCP[it],
            own = owned(it),
            soon =
              (it == 'voix' && !(CONTENU.voix || []).length) ||
              (it == 'playlist' && !(CONTENU.playlist || []).length) ||
              (it == 'surprise3' && !CONTENU.coffre3),
            done = it == 'secret' && S.secretDone,
            cons = CONSO.includes(it);
          if (!itOpen(M, it))
            return `<div class="rt off lockd"><div class="ri">🔒</div><b>${esc(x.n)}</b><small class="why">Se débloque au niveau ${M.items.indexOf(it) + 1}</small></div>`;
          const why = own
              ? ''
              : soon
                ? 'Bientôt disponible'
                : done
                  ? ''
                  : lk
                    ? lk
                    : cons && full
                      ? 'Entrepôt plein'
                      : S.scr < r.c
                        ? `Il manque ${r.c - S.scr} 🔩`
                        : '',
            dis = own || soon || done || !!why;
          return `<div class="rt ${dis ? 'off' : ''}"><div class="ri">${x.ic}</div><b>${esc(x.n)}</b><div class="rmeta">${r.c ? `<span>🔩 ${r.c}</span>` : '<span>Gratuit</span>'}<span>⏱️ ${fmtD(rtime(M, it))}</span></div>${cons ? `<small>En stock : ${S.inv[it] || 0}</small>` : ''}<button class="sm" ${dis ? 'disabled' : ''} onclick="prod('${id}','${it}')">${own ? '✓ Déjà à toi' : done ? '✓ Fait' : 'Lancer'}</button>${why ? `<small class="why">${why}</small>` : ''}</div>`;
        })
        .join('')}</div>`;
    }
  }
  if (m.lv && M.max > 1) {
    const c = m.lv < M.max ? upCost(M) : 0;
    h += `<h3 class="msh">Améliorations</h3><div class="utrack">${Array.from({ length: M.max }, (_, i) => `<div class="un ${i < m.lv ? 'on' : ''} ${i == m.lv ? 'nx' : ''}"><i>${i + 1}</i><small>${upLbl(M, i)}</small></div>`).join('<span class="ul"></span>')}</div>
  ${m.lv < M.max ? (s == 'rep' ? '<p class="muted" style="font-size:.85rem">Disponible après la réparation</p>' : `<button class="brass" ${S.scr < c ? 'disabled' : ''} onclick="upgrade('${id}')">⬆️ Niveau ${m.lv + 1} · ${c} 🔩</button>${S.scr < c ? `<p class="why">Il manque ${c - S.scr} 🔩</p>` : ''}`) : '<p class="muted" style="font-size:.85rem;margin:6px 0 0">Niveau maximum atteint ✨</p>'}`;
  }
  return h + '</div>';
}
function mOpen(id) {
  const M = MOF(id);
  if (mState(M) == 'lock') {
    const c =
      document.querySelector(`.mc[onclick*="'${id}'"]`) ||
      [...document.querySelectorAll('.mc')].find(e => e.getAttribute('onclick') && e.getAttribute('onclick').includes(id));
    if (c) {
      c.classList.remove('shake');
      void c.offsetWidth;
      c.classList.add('shake');
    }
    toast(
      M.id == 'secret'
        ? '🔒 Le fax du procureur dort sous sa housse jusqu’au 24 décembre'
        : `🔒 ${esc(M.n)} se débloque le ${M.day} décembre`
    );
    return;
  }
  curM = id;
  mpop(mPanel(id));
}
function labRefresh() {
  if (view == 'lab') labView();
  if (curM && $(`#pop .mpan[data-id="${curM}"]`)) $('#pop .card').innerHTML = mPanel(curM);
  labSig = labState();
  updBadge();
  hdr();
}
function repair(id) {
  const M = MOF(id),
    m = LBM(id);
  if (m.lv || S.scr < M.cost || mState(M) == 'lock') return;
  if (id == 'secret' && !puzOk()) {
    try {
      SFX('bad');
    } catch (_) {}
    toast('📜 Il manque le formulaire : recolle les 24 morceaux dans l’onglet 🧩 Puzzle');
    return;
  }
  S.scr -= M.cost;
  m.lv = 1;
  m.repS = Date.now();
  m.rep = Date.now() + M.rep * HR;
  m.seen = M.rep ? 0 : 1;
  save();
  if (id == 'secret') {
    closePop();
    curM = null;
    labRefresh();
    return story('mach', () => {
      labRefresh();
      mOpen('secret');
    });
  }
  toast(M.rep ? `🔧 Réparation lancée : ${M.rep} h` : 'La machine se réveille…');
  labRefresh();
}
function prod(id, it) {
  const M = MOF(id),
    m = LBM(id),
    r = RCP[it];
  if (mState(M) != 'idle' || S.scr < r.c || owned(it) || !itOpen(M, it)) return;
  if (CONSO.includes(it) && stock() >= S.cap) return toast('📦 Entrepôt plein');
  if (it == 'secret' && S.secretDone) return;
  S.scr -= r.c;
  const t = Date.now();
  m.job = { it, s: t, end: t + rtime(M, it) };
  save();
  toast(`⚙️ C'est parti : ${itm(it).n}`);
  labRefresh();
}
function convGo(dir, k) {
  const M = MOF('conv'),
    m = LBM('conv');
  if (mState(M) != 'idle') return;
  if (dir == 's') {
    if (S.pts < 10 * k) return;
    S.pts -= 10 * k;
  } else {
    if (S.scr < 10 * k) return;
    S.scr -= 10 * k;
  }
  const t = Date.now();
  m.job = { it: 'conv', dir, q: crate() * k, s: t, end: t + rtime(M, 'conv') };
  save();
  toast('🔄 Conversion lancée');
  labRefresh();
}
function collect(id) {
  const M = MOF(id),
    m = LBM(id);
  if (mState(M) != 'done') return;
  const j = m.job,
    it = j.it;
  try {
    slog('🧪', `Labo : récupère ${(RCP[it] && RCP[it].n) || it}`);
  } catch (_) {}
  let n = 1,
    txt = '';
  if (CONSO.includes(it)) {
    if (stock() >= S.cap) {
      toast("📦 Entrepôt plein : fais de la place d'abord");
      return mOpen(id);
    }
    S.inv[it] = (S.inv[it] || 0) + n;
    txt = `+${n} ${itm(it).n}`;
  } else if (it == 'conv') {
    if (j.dir == 's') S.scr += j.q;
    else S.pts += j.q;
    txt = j.dir == 's' ? `+${j.q} 🔩` : `+${j.q} ⭐`;
  } else if (it == 'secret') {
    S.secretDone = 1;
    txt = '⚖️ Le procureur a répondu : tu peux accuser.';
  } else {
    if (!S.own.includes(it)) S.own.push(it);
    S[it] = true;
    snowCount();
    txt = `${itm(it).n} : activé !`;
  }
  m.job = null;
  save();
  ding();
  curM = null;
  labRefresh();
  confetti();
  const ic = it == 'conv' ? (j.dir == 's' ? '🔩' : '⭐') : itm(it).ic;
  mpop(
    `<div class="mpan" style="--a:${MCOL[id]}"><div class="rays"><div class="rb"></div><span class="got">${ic}</span>${n > 1 ? '<span class="x2">×2</span>' : ''}</div><h2>${it == 'secret' ? 'Feu vert du procureur !' : n > 1 ? 'Double production !' : 'Fabriqué !'}</h2><p style="font-size:1.15rem;margin:.3em 0">${esc(txt)}</p>${it == 'secret' ? `<p>À toi de désigner le <b>coupable</b> : la machine vérifiera. ⚖️</p><p class="vgm" id="vgm"></p><button class="big" onclick="vTry(this)">⚖️ Démasquer le coupable</button>` : ''}${['coeurs', 'fondrose', 'ordore', 'voix'].includes(it) ? '<p class="muted">Tu peux l\'activer ou le couper dans le menu de démarrage → ⚙️ Options.</p>' : ''}${CONSO.includes(it) ? `<p class="muted">📦 Entrepôt : ${stock()}/${S.cap}</p>` : ''}<button class="big" onclick="closePop()">Super !</button></div>`
  );
}
function speedUp(id) {
  const M = MOF(id),
    m = LBM(id),
    s = mState(M),
    t = Date.now();
  if (s != 'rep' && s != 'run') return;
  const e = s == 'rep' ? m.rep : m.job.end,
    g = gemCost(e - t);
  if (S.gem < g) return;
  S.gem -= g;
  if (s == 'rep') m.rep = t;
  else m.job.end = t;
  save();
  toast(`⚡ -${g} 💎`);
  labRefresh();
}
function upgrade(id) {
  const M = MOF(id),
    m = LBM(id);
  if (!m.lv || m.lv >= M.max || mState(M) == 'rep') return;
  const c = upCost(M);
  if (S.scr < c) return;
  S.scr -= c;
  m.lv++;
  save();
  confetti();
  toast(`⬆️ ${M.n} niveau ${m.lv} : ${upLbl(M, m.lv - 1)} !`);
  labRefresh();
}
function capUp() {
  const nx = capNext();
  if (!nx || S.scr < nx[1]) return;
  S.scr -= nx[1];
  S.cap = nx[0];
  save();
  toast(`📦 Entrepôt : ${nx[0]} places`);
  labRefresh();
}
function recycle(k) {
  const x = itm(k),
    v = Math.floor(RCP[k].c / 2);
  mpop(
    `<div class="mpan" style="--a:#3ddc84"><div class="mbig">${x.ic}</div><h2>Recycler ?</h2><p>Transformer 1 ${esc(x.n)} en <b>${v} 🔩</b> ?</p><button class="big" onclick="recycleOk('${k}')">♻️ Recycler</button><button class="alt" onclick="closePop()">Annuler</button></div>`
  );
}
function recycleOk(k) {
  if (!(S.inv[k] > 0)) return closePop();
  S.inv[k]--;
  S.scr += Math.floor(RCP[k].c / 2);
  save();
  closePop();
  toast(`♻️ +${Math.floor(RCP[k].c / 2)} 🔩`);
  labRefresh();
}
function labHelp() {
  mpop(`<div class="mpan" style="--a:#ffd24a"><button class="mx" onclick="closePop()" aria-label="Fermer">✕</button><div class="mbig">🧪</div><h2>Le laboratoire</h2><div class="hlp">
 <p><b>🔩 Pièces</b> : elles servent à réparer, améliorer et faire tourner les machines. Tu en gagnes en réussissant les mini-jeux (+25), à la roue, avec les flammes 🔥, en recyclant des bonus et avec le convertisseur.</p>
 <p><b>💎 Gemmes</b> : rares ! Tu en gagnes 2 à chaque niveau et parfois à la roue. Elles finissent un chrono tout de suite (1 💎 par heure restante).</p>
 <p><b>⏱️ Chronos</b> : ils continuent même quand l'appli est fermée. Un <b>!</b> rouge apparaît sur l'onglet Labo quand quelque chose est prêt.</p>
 <p><b>🆕 Nouvelles machines</b> : elles arrivent au fil des cases de décembre.</p></div><button class="big" onclick="closePop()">Compris !</button></div>`);
}
const labState = () => MACH.map(M => mState(M)).join();
function updBadge() {
  const b = $('#lbdg');
  if (!b) return;
  b.hidden = !(
    labOpen() &&
    MACH.some(M => {
      const s = mState(M),
        m = LBM(M.id);
      return s == 'done' || (s == 'idle' && m.lv && !m.seen);
    })
  );
}
setInterval(() => {
  const sg = labState();
  if (sg != labSig) {
    labSig = sg;
    if (view == 'lab') labView();
    if (curM && $(`#pop .mpan[data-id="${curM}"]`)) $('#pop .card').innerHTML = mPanel(curM);
  }
  updBadge();
  if (view != 'lab' && !$('#pop .mpan')) return;
  const t = Date.now();
  document.querySelectorAll('.cd[data-e]').forEach(e => (e.textContent = fmtT(+e.dataset.e - t)));
  document.querySelectorAll('.pb[data-e]').forEach(e => (e.style.width = pct(+e.dataset.s, +e.dataset.e) + '%'));
  document.querySelectorAll('.port[data-e]').forEach(e => e.style.setProperty('--p', pct(+e.dataset.s, +e.dataset.e)));
}, 1000);
