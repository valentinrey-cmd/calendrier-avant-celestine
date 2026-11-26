/* ---------- rendu d'une pièce du dossier ---------- */
function linkySVG() {
  const D = [
    ['12h', 0.22],
    ['', 0.24],
    ['13h', 0.22],
    ['', 0.21],
    ['14h', 0.22],
    ['', 0.23],
    ['15h', 0.22],
    ['', 1.2],
    ['16h', 0.23],
    ['', 0.22],
    ['17h', 0.21],
    ['', 0.22],
    ['18h', 0.23],
    ['', 0.22],
    ['19h', 0.21],
    ['', 0.22],
    ['20h', 0.21],
    ['', 0.22],
    ['21h', 0.22],
    ['', 0.21],
    ['22h', 0.22],
    ['', 0.21],
    ['23h', 0.22],
    ['', 0.22],
    ['0h', 0.21],
    ['', 0.24],
    ['1h', 1.4],
    ['', 0.23],
    ['2h', 0.22],
    ['', 0.21],
    ['3h', 0.22],
    ['', 0.21],
    ['4h', 0.22],
    ['', 0.22],
    ['5h', 0.21],
    ['', 0.22],
    ['6h', 0.22],
    ['', 0.21],
    ['7h', 0.22]
  ];
  const w = 300,
    h = 120,
    bw = w / D.length;
  let o = `<svg viewBox="0 0 ${w + 30} ${h + 34}" class="pc-lk"><rect x="28" y="4" width="${w}" height="${h}" fill="#fbfaf5" stroke="#cfc8b4"/>`;
  [0, 0.5, 1, 1.5].forEach(v => {
    const y = 4 + h - (v / 1.6) * h;
    o += `<line x1="28" x2="${28 + w}" y1="${y}" y2="${y}" stroke="#e6e0cf"/><text x="24" y="${y + 3}" text-anchor="end" font-size="7" fill="#7a6a50">${String(v).replace('.', ',')}</text>`;
  });
  D.forEach(([l, v], i) => {
    const bh = (v / 1.6) * h,
      x = 28 + i * bw;
    o += `<rect x="${(x + 0.6).toFixed(1)}" y="${(4 + h - bh).toFixed(1)}" width="${(bw - 1.2).toFixed(1)}" height="${bh.toFixed(1)}" fill="${v > 1 ? '#d8283c' : '#5a8ac0'}"/>`;
    if (l)
      o += `<text x="${x.toFixed(1)}" y="${h + 16}" font-size="6.5" fill="#5a4a30" transform="rotate(-50 ${x.toFixed(1)} ${h + 16})" text-anchor="end">${l}</text>`;
  });
  return (
    o +
    `<text x="${28 + w / 2}" y="${h + 33}" text-anchor="middle" font-size="7.5" fill="#5a4a30">sam. 28 nov. 12 h → dim. 29 nov. 7 h · puissance moyenne par demi-heure (kW)</text></svg>`
  );
}
function planSVG() {
  return `<svg viewBox="0 0 320 230" class="pc-plan"><rect x="0" y="0" width="320" height="230" fill="#f7f2e4"/><g stroke="#3a2a1a" stroke-width="4" fill="none"><rect x="20" y="20" width="280" height="190"/><line x1="150" y1="20" x2="150" y2="120"/><line x1="20" y1="120" x2="210" y2="120"/><line x1="210" y1="120" x2="210" y2="210"/><line x1="230" y1="20" x2="230" y2="120"/></g>
 <rect x="20" y="150" width="6" height="40" fill="#7a1f33"/><text x="30" y="200" font-size="9" fill="#7a1f33" font-weight="800">PORTE BLINDÉE</text>
 <text x="40" y="50" font-size="13" font-weight="800" fill="#3a2a1a">Salon</text><text x="160" y="50" font-size="13" font-weight="800" fill="#3a2a1a">Cuisine</text><text x="236" y="50" font-size="11" font-weight="800" fill="#3a2a1a">Chambre</text><text x="40" y="150" font-size="11" fill="#3a2a1a">Entrée</text><text x="220" y="160" font-size="11" font-weight="800" fill="#3a2a1a">Salle d’eau</text>
 <rect x="156" y="88" width="40" height="26" fill="#e9d29a" stroke="#a8874f"/><text x="176" y="104" text-anchor="middle" font-size="8" fill="#5a3a10">placard</text>
 <rect x="170" y="16" width="44" height="8" fill="#8cc0e6" stroke="#3a6a9a"/><text x="192" y="12" text-anchor="middle" font-size="8" fill="#3a6a9a">fenêtre (cour)</text>
 <rect x="200" y="56" width="22" height="10" fill="#fff" stroke="#888"/><text x="211" y="76" text-anchor="middle" font-size="7" fill="#555">radiateur</text>
 <rect x="60" y="16" width="60" height="8" fill="#8cc0e6" stroke="#3a6a9a"/><text x="90" y="12" text-anchor="middle" font-size="8" fill="#3a6a9a">fenêtres (rue)</text>
 <text x="300" y="224" text-anchor="end" font-size="8" fill="#7a6a50">4e étage gauche · escalier en face de la porte</text></svg>`;
}
function smsHTML(p) {
  return `<div class="pc-sms"><div class="pc-smsh">${p.grp ? '👥' : '👤'} ${esc(p.who)}</div>${p.m.map(m => (m[0] == 'd' ? `<div class="pc-smsd">${esc(m[1])}</div>` : m[0] == 'ph' ? `<div class="pc-bub th ph">${PH[m[1]]}</div>` : `<div class="pc-bub ${m[0] == 'me' ? 'me' : 'th'}">${p.grp && m[0] != 'me' ? `<b>${esc(m[0])}</b>` : ''}${esc(m[2])}<small>${esc(m[1])}</small></div>`)).join('')}</div>`;
}
// agenda de la semaine : jours en colonnes, heures sur le côté (pièce de type « agd »)
const AGJ = ['Lun. 23', 'Mar. 24', 'Mer. 25', 'Jeu. 26', 'Ven. 27', 'Sam. 28', 'Dim. 29'];
const agH = h => `${Math.floor(h)} h${h % 1 ? ' ' + String(Math.round((h % 1) * 60)).padStart(2, '0') : ''}`;
function agdHTML(p) {
  const H0 = 7,
    H1 = 24,
    R = 22; // hauteur d'une heure (px)
  const heures = Array.from({ length: H1 - H0 }, (_, i) => `<div class="ag-h" style="top:${i * R}px">${H0 + i} h</div>`).join('');
  const col = d =>
    `<div class="ag-c">${p.ag
      .map((e, i) => [e, i])
      .filter(([e]) => e[0] == d)
      .map(
        ([e, i]) =>
          `<button class="ag-e ag-${e[5]}" style="top:${(e[1] - H0) * R}px;height:${Math.max(13, (e[2] - e[1]) * R - 2)}px" onclick="agTap(${p.d},${i})">${e[5] == 'bg' ? '' : `<b>${esc(e[3])}</b>`}</button>`
      )
      .join('')}</div>`;
  return `<div class="ag"><div class="ag-t"><span></span>${AGJ.map(j => `<span>${j.replace(' ', '<br>')}</span>`).join('')}</div><div class="ag-g" style="height:${(H1 - H0) * R}px"><div class="ag-hs">${heures}</div>${AGJ.map((_, d) => col(d)).join('')}</div><div class="ag-leg"><i class="ag-cours"></i>Cours <i class="ag-amis"></i>Amis <i class="ag-famille"></i>Famille <i class="ag-travail"></i>Travail <i class="ag-perso"></i>Perso</div><p class="ag-info" id="agi">Touche un créneau pour le détail.</p></div>`;
}
function agTap(d, i) {
  const p = PIECES.find(x => x.d == d && x.k == 'agd'),
    e = p && p.ag[i],
    o = document.getElementById('agi');
  if (!e || !o) return;
  o.innerHTML = `<b>${esc(e[3])}</b><br>${AGJ[e[0]]} · ${agH(e[1])} → ${e[2] >= 24 ? 'minuit' : agH(e[2])}${e[4] ? ' · avec ' + esc(e[4]) : ''}`;
  o.classList.add('on');
}
function pieceBody(p) {
  const k = p.k;
  if (k == 'pv') return `<div class="pc-pv">${p.body.map((l, i) => `<p class="${i == 0 ? 'h' : ''}">${esc(l)}</p>`).join('')}</div>`;
  if (k == 'sms') return smsHTML(p) + (p.note ? `<p class="pc-note">${esc(p.note)}</p>` : '');
  if (k == 'doc')
    return `<div class="pc-doc">${p.rows.map(r => `<div><small>${esc(r[0])}</small><b>${esc(r[1])}</b></div>`).join('')}${p.note ? `<p class="pc-note">${esc(p.note)}</p>` : ''}</div>`;
  if (k == 'agd') return agdHTML(p);
  if (k == 'tab')
    return `<table class="pc-tab"><tr>${p.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr>${p.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table>${p.note ? `<p class="pc-note">${esc(p.note)}</p>` : ''}`;
  if (k == 'photo')
    return `<div class="pc-phs">${p.ph.map((f, i) => `<figure class="pc-ph">${PH[f]}<figcaption>${esc(p.cap[i] || '')}</figcaption></figure>`).join('')}</div>`;
  if (k == 'linky') return linkySVG();
  if (k == 'plan') return planSVG();
  if (k == 'lettre')
    return `<div class="pc-let">${p.body.map(l => `<p>${esc(l)}</p>`).join('')}</div>${p.ph ? `<figure class="pc-ph">${PH[p.ph]}<figcaption>Photo jointe</figcaption></figure>` : ''}`;
  if (k == 'insta')
    return `<div class="pc-ig"><div class="pc-igh">◯ noemie.nails · 19 h 52</div>${PH[p.ph]}<p>${esc(p.cap)}</p></div><div class="pc-doc">${p.rows.map(r => `<div><small>${esc(r[0])}</small><b>${esc(r[1])}</b></div>`).join('')}</div>`;
  if (k == 'aveu') {
    const x = SUSP.find(z => z.id == p.who);
    return `<div class="pc-av"><div class="pc-avp">${x ? susPic(x) : ''}</div><q>${esc(p.body.replace(/^« | »$/g, ''))}</q><span class="pc-stamp">${p.who == 'valentin' ? 'DÉCLARATION' : 'AVEUX'}</span></div>`;
  }
  return '';
}
function pieceOpen(id) {
  const p = PIECES.find(x => x.id == id);
  if (!p || !pcOn(p)) return;
  S.pcRead = S.pcRead || {};
  if (!S.pcRead[id]) {
    S.pcRead[id] = 1;
    save();
  }
  try {
    SFX('tap');
  } catch (_) {}
  popup(
    `<div class="pc-full"><p class="pc-src">${p.ic} ${esc(p.src)}${p.d ? ` · reçue le ${p.d} déc.` : ''}</p><h2>${esc(p.t)}</h2>${pieceBody(p)}${noteHTML('pc_' + id, 'Ce que j’en pense…')}<button class="alt" onclick="enqOpen('pc')">← Retour au dossier</button></div>`
  );
}
/* ---------- arrivée des pièces ---------- */
function pcNews() {
  try {
    const R = (S.pcSeen = S.pcSeen || {});
    const N = PIECES.filter(p => pcOn(p) && !R[p.id]);
    if (!N.length) return;
    N.forEach(p => (R[p.id] = Date.now()));
    save();
    toast(N.length == 1 ? `📁 Nouvelle pièce au dossier : ${N[0].t}` : `📁 ${N.length} nouvelles pièces au dossier`);
    try {
      slog('📁', 'Pièces reçues : ' + N.map(p => p.t).join(', '));
    } catch (_) {}
  } catch (_) {}
}
/* ---------- le carnet ---------- */
function enqHTML(t) {
  t = t || window.__enqT || 'pc';
  window.__enqT = t;
  const sd = S.story || {},
    X = S.enqX || {},
    on = PIECES.filter(pcOn),
    R = S.pcRead || {};
  const T = [
    ['pc', '📁 Pièces'],
    ['aud', '🎙️ Auditions'],
    ['sus', '🕵️ Suspects'],
    ['fri', '🗓️ Frise'],
    ['map', '🗺️ Carte'],
    ['brd', '📌 Tableau']
  ];
  let B = '';
  if (t == 'pc')
    B = `<p class="enq-h"><small>Les pièces brutes du dossier. Pépin ne conclut jamais à ta place : croise-les.</small></p><div class="pc-list">${PIECES.filter(
      p => !p.a
    )
      .map(p =>
        pcOn(p)
          ? `<button class="pc-it ${R[p.id] ? '' : 'new'}" onclick="pieceOpen('${p.id}')"><span>${p.ic}</span><div><small>Jour ${p.d} · ${esc(p.src)}</small><b>${esc(p.t)}</b></div></button>`
          : `<div class="pc-it off"><span>🔒</span><div><small>Jour ${p.d}</small><b>Pièce à venir</b></div></div>`
      )
      .join('')}</div>${noteHTML('_', 'Mes pistes, mes soupçons…')}`;
  if (t == 'aud') {
    const A = S.aud || {};
    B = `<p class="enq-h"><small>Chaque audition s’ouvre en battant le boss du jour : le suspect passe aux aveux.</small></p>${Object.entries(
      AUD
    )
      .map(([d, a]) => {
        const x = SUSP.find(z => z.id == a.who),
          won = (S.boss || {})[d],
          done = A[d],
          g = PIECES.find(p => p.id == a.gain);
        return `<div class="au-c ${done ? 'done' : ''}"><div class="au-p">${susPic(x)}</div><div><small>Jour ${d}</small><b>${esc(a.n)}</b>${done ? `<q>${esc(g.body.replace(/^« | »$/g, ''))}</q>` : won ? `<button class="sm" onclick="audGo(${d})">🗣️ Lire ${a.who == 'valentin' ? 'sa déposition' : 'ses aveux'}</button>` : `<span class="pn">${+d <= unl() ? 'Bats le boss du jour pour l’auditionner.' : 'Pas encore convoqué·e.'}</span>`}</div></div>`;
      })
      .join('')}`;
  }
  if (t == 'sus')
    B = `<p class="enq-h"><small>Touche une fiche pour la lire. Barre toi-même les innocents.</small></p><div class="enq-su">${SUSP.map(
      x => {
        const out = !!X[x.id],
          g = sd.rev && x.id == 'valentin';
        return `<button class="enq-s ${out ? 'out' : ''} ${g ? 'guilty' : ''}" onclick="susOpen('${x.id}')">${susPic(x)}<b>${esc(x.n)}</b><small>${g ? 'COUPABLE 💖' : out ? 'Barré·e' : 'Suspect'}</small></button>`;
      }
    ).join('')}</div>`;
  if (t == 'fri') {
    const E = [];
    on.forEach(p => (p.ev || []).forEach(e => E.push([e[0], e[1], e[2], p.ic])));
    E.sort((a, b) => (a[0] < b[0] ? -1 : 1));
    B = `<p class="enq-h"><small>Les faits datés tirés de tes pièces, dans l’ordre. Les trous, c’est à toi de les combler.</small></p><div class="enq-fr">${E.map(e => `<div class="enq-fi"><span>${e[3]}</span><div><small>${esc(e[1])}</small><b>${esc(e[2])}</b></div></div>`).join('') || '<p class="muted">Rien pour l’instant.</p>'}</div>${noteHTML('fri', 'Ma frise : ce qui s’est passé entre ces heures…')}`;
  }
  if (t == 'map') B = `<p class="enq-h"><small>Lyon et ses environs : où chacun a croisé Célestine.</small></p>${mapHTML(sd)}`;
  if (t == 'brd') B = brdHTML();
  return `<div class="enq"><p class="muted" style="margin:0 0 8px;font-size:.85rem">📁 Dossier n°24 · Le bracelet aux cœurs roses · <b>${on.length}/${PIECES.length}</b> pièces</p><div class="enq-tabs">${T.map(([k, l]) => `<button class="${k == t ? 'on' : ''}" onclick="enqOpen('${k}')">${l}</button>`).join('')}</div>${B}</div>`;
}
function enqOpen(t) {
  popup(
    `<h2>🕵️ Dossier n°24</h2>${enqHTML(t)}${window.__audD ? `<button onclick="audGo(window.__audD)">🎙️ Revenir à l’audition</button>` : window.__accCb ? `<button onclick="accuse(window.__accCb)">⚖️ Revenir à l’accusation</button>` : ''}<button class="alt" onclick="closePop()">Fermer</button>`
  );
  if (window.__enqT == 'brd') setTimeout(brdInit, 60);
}
function susToggle(id) {
  S.enqX = S.enqX || {};
  if (S.enqX[id]) delete S.enqX[id];
  else S.enqX[id] = 1;
  save();
  try {
    SFX(S.enqX[id] ? 'tap' : 'ok');
  } catch (_) {}
  susOpen(id);
}
function susOpen(id) {
  const x = SUSP.find(z => z.id == id);
  if (!x) return;
  const sd = S.story || {},
    out = !!(S.enqX || {})[id],
    g = sd.rev && x.id == 'valentin',
    L = PIECES.filter(p => p.a && p.who == id && pcOn(p));
  popup(
    `<div class="sus-f ${out ? 'out' : ''}"><div class="sus-ph">${susPic(x)}${g ? '<span class="sus-st g">COUPABLE</span>' : out ? '<span class="sus-st">BARRÉ·E</span>' : ''}</div><h2 style="margin:.3em 0 0">${esc(x.n)}</h2><p class="muted" style="margin:2px 0 8px">${esc(x.r)}</p><div class="sus-tr">${x.tr.map(t => `<span>${esc(t)}</span>`).join('')}</div><p style="margin:10px 0">${esc(x.d)}</p><div class="sus-al s sus-dep"><b>🗣️ Sa première déclaration</b><q>${esc(x.dep)}</q>${L.map(p => `<q><small>🆕 ${esc(p.t)}</small>${esc(p.body)}</q>`).join('')}</div>${noteHTML(x.id)}${g ? '<p class="sus-al g">💖 Il a tout avoué. Voleur de bracelet !</p>' : `<button class="${out ? '' : 'alt'}" onclick="susToggle('${id}')">${out ? '↩️ Remettre dans les suspects' : '❌ Barrer : innocent·e'}</button>`}<button class="alt" onclick="enqOpen('sus')">← Retour au dossier</button></div>`
  );
}
/* ---------- l'audition : aveux après le boss ---------- */
function audGrant(d) {
  d = +d;
  if (!AUD[d]) return;
  S.aud = S.aud || {};
  if (!S.aud[d]) {
    S.aud[d] = Date.now();
    save();
  }
}
function audGo(d) {
  d = +d;
  const a = AUD[d];
  if (!a) return;
  audGrant(d);
  window.__audD = null;
  return pieceOpen(a.gain);
}
/* ---------- l'accusation : on peut se tromper, retour au dossier ---------- */
function accuse(cb) {
  window.__accCb = cb;
  popup(
    `<h2>⚖️ Formulaire d’accusation</h2><p class="muted" style="margin:0 0 6px">Qui a pris le bracelet ?</p><div class="enq-su">${SUSP.map(x => `<button class="enq-s ${(S.enqX || {})[x.id] ? 'out' : ''}" onclick="accuseAsk('${x.id}')">${susPic(x)}<b>${esc(x.n)}</b></button>`).join('')}</div><p style="margin-top:10px"><button class="alt" onclick="enqOpen()">📁 Relire le dossier</button><button class="alt" onclick="closePop()">Plus tard</button></p>`
  );
}
function accuseAsk(id) {
  const x = SUSP.find(z => z.id == id);
  popup(
    `<div class="sus-f"><div class="sus-ph">${susPic(x)}</div><h2>Accuser ${esc(x.n)} ?</h2><button onclick="accuseGo('${id}')">⚖️ Oui, c’est ${esc(x.n)}</button><button class="alt" onclick="accuse(window.__accCb)">← Réfléchir encore</button></div>`
  );
}
function accuseGo(id, again) {
  const x = SUSP.find(z => z.id == id);
  S.accTry = (S.accTry || 0) + 1;
  if (id == 'valentin') S.accDone = id;
  save();
  try {
    slog('⚖️', 'Accuse : ' + x.n + (id == 'valentin' ? ' ✅' : ' ❌'));
  } catch (_) {}
  closePop();
  const cb = window.__accCb;
  S.story = S.story || {};
  const fin = () => {
    S.story.rev = S.story.rev || Date.now();
    save();
    try {
      confetti();
    } catch (_) {}
    window.__vbNoIntro = 1;
    cb && cb();
  };
  if (id == 'valentin') {
    window.__accCb = null;
    if (S.story.acc_valentin) delete S.story.acc_valentin;
    return story('acc_valentin', fin);
  }
  try {
    SFX('bad');
  } catch (_) {}
  S.enqX = S.enqX || {};
  S.enqX[id] = 1;
  save();
  story(
    'acc_' + id,
    () => {
      try {
        render();
      } catch (_) {}
      enqOpen('sus');
    },
    1
  );
}
function storyHTML() {
  const sd = S.story || {},
    L = STORD.filter(k => sd[k]);
  return `<h2>📖 L’histoire</h2><div class="panel">${L.length ? `<p class="muted" style="margin:0 0 8px;font-size:.85rem">Le mystère du bracelet aux cœurs roses… Revois les scènes déjà débloquées.</p><div class="st-list">${L.map(k => `<button class="sm alt" onclick="story('${k}')">${esc(STORY[k].t)}</button>`).join('')}</div>` : '<p class="muted" style="margin:0">L’histoire commence avec la première case…</p>'}</div>`;
}
function showBon(i) {
  const b = S.bons[i];
  popup(
    `<div style="font-size:3rem">${b.ic}</div><h2>BON POUR</h2><p style="font:700 1.3rem Georgia,serif">${esc(b.n)}</p><p class="muted">Montre ce bon pour en profiter 💝</p><button onclick="S.bons[${i}].used=true;slog('💝','Utilise le bon '+S.bons[${i}].n);save();closePop();meView();toast('Bon utilisé, profite bien !')">Marquer comme utilisé</button><button class="alt" onclick="closePop()">Pas encore</button>`
  );
}
const nextEarly = () => {
  for (let d = unl() + 1; d <= 23; d++) if (!S.early.includes(d)) return d;
  return 0;
};
function useEarly() {
  const d = nextEarly();
  if (!d || S.inv.early < 1) return;
  S.inv.early--;
  S.early.push(d);
  save();
  toast(`🔓 Le jour ${d} est ouvert !`);
  go('cal');
  tapDay(d);
}
/* ---------- Mode test caché (toucher 7 fois la photo) ---------- */
{
  let bt = 0,
    bl = 0;
  document.addEventListener(
    'pointerdown',
    e => {
      if (view != 'cal') return;
      const t = e.target;
      if (t.closest('button,a,input,.day,.panel,header,nav,#pop,.toast,#gwin')) return;
      const n = Date.now();
      bt = n - bl < 1500 ? bt + 1 : 1;
      bl = n;
    },
    true
  );
}
