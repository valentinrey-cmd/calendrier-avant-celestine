/* ---------- Records, missions, coffres, album, tutos, transfert ---------- */
const VNAME = 'Valentin';
const GNAME = g => {
  const D = Object.values(DAYS).find(x => x && x.g == g);
  return D ? D.t : g;
};
const fmtS = t =>
  t == null ? '—' : t < 60 ? `${t.toFixed(1)} s` : `${Math.floor(t / 60)} min ${String(Math.round(t % 60)).padStart(2, '0')}`;
const fmtN = n => Math.round(n).toLocaleString('fr-FR');
function stG(g) {
  S.st = S.st && typeof S.st == 'object' ? S.st : {};
  return (S.st[g] = S.st[g] || { p: 0, w: 0 });
}
function vrec(g) {
  const a = (CONTENU.recordsValentin || {})[g],
    b = (S.vrec || {})[g];
  if (!a && !b) return null;
  return { ...(a || {}), ...(b || {}) };
}
let GSES = null;
function REC(v) {
  if (GSES && typeof v == 'number' && isFinite(v)) GSES.score = GSES.score == null ? v : Math.max(GSES.score, v);
}
function recStart(d, pr) {
  const D = DAYS[d];
  GSES = { g: D.g, d, t0: Date.now(), pr: !!pr, score: null };
  window.__hint = 0;
  stG(D.g).p++;
  save();
  EV('play');
  if (pr) EV('practice');
  tuto(D.g);
}
function recEnd(ok) {
  const s = GSES;
  if (!s) return;
  GSES = null;
  const st = stG(s.g),
    dt = (Date.now() - s.t0) / 1000,
    rec = [];
  st.tt = (st.tt || 0) + dt;
  if (ok) {
    st.w++;
    EV('win');
    if (!window.__hint) EV('winNoHint');
    if (st.bt == null || dt < st.bt) {
      if (st.bt != null) rec.push('temps');
      st.bt = dt;
    }
  }
  if (s.score != null && (st.bs == null || s.score > st.bs)) {
    if (st.bs != null && s.score > 0) rec.push('score');
    st.bs = s.score;
  }
  save();
  if (rec.length) {
    EV('record');
    setTimeout(() => toast(`🏆 Nouveau record (${rec.join(' et ')}) à ${GNAME(s.g)} !`), 1200);
  }
  const v = vrec(s.g);
  if (v) {
    const bs = v.s != null && s.score != null && s.score > v.s,
      bt = ok && v.t != null && dt < v.t;
    S.beatV = S.beatV || {};
    if ((bs || bt) && !S.beatV[s.g]) {
      S.beatV[s.g] = 1;
      save();
      ACH('beatV');
      setTimeout(
        () =>
          popup(
            `<h2>⚔️ Record battu !</h2><p style="font-size:3rem;margin:.1em 0">🏆</p><p>Tu as battu le record de <b>${VNAME}</b> à <b>${esc(GNAME(s.g))}</b> !</p><p class="muted">${bs ? `${fmtN(s.score)} contre ${fmtN(v.s)}` : `${fmtS(dt)} contre ${fmtS(v.t)}`}</p><button onclick="closePop()">Trop forte 😎</button>`
          ),
        2200
      );
    }
  }
}
function recLine(g) {
  const st = (S.st || {})[g],
    v = vrec(g);
  if (!st && !v) return '';
  const a = [];
  if (st && st.bs != null) a.push(`🏆 ${fmtN(st.bs)}`);
  if (st && st.bt != null) a.push(`⏱️ ${fmtS(st.bt)}`);
  let h = a.length ? `<span>Ton record : ${a.join(' · ')}</span>` : '';
  if (v) {
    const done = (S.beatV || {})[g];
    h += `<span class="vrec ${done ? 'ok' : ''}">⚔️ ${VNAME} : ${[v.s != null ? fmtN(v.s) : '', v.t != null ? fmtS(v.t) : ''].filter(Boolean).join(' · ')}${done ? ' · battu ✓' : ' · à battre !'}</span>`;
  }
  return h ? `<div class="recl">${h}</div>` : '';
}
function statsHTML() {
  const S2 = S.st || {},
    gs = Object.keys(S2).filter(g => S2[g].p > 0);
  const P = gs.reduce((a, g) => a + S2[g].p, 0),
    Wn = gs.reduce((a, g) => a + S2[g].w, 0),
    TT = gs.reduce((a, g) => a + (S2[g].tt || 0), 0);
  const fav = gs.slice().sort((a, b) => S2[b].p - S2[a].p)[0];
  return `<h2>📊 Statistiques</h2><div class="panel"><div class="stgrid"><span><b>${P}</b>parties</span><span><b>${Wn}</b>victoires</span><span><b>${P ? Math.round((Wn / P) * 100) : 0} %</b>de réussite</span><span><b>${Math.round(TT / 60)}</b>min de jeu</span></div>${fav ? `<p class="center muted" style="margin:6px 0">💖 Jeu préféré : <b>${esc(GNAME(fav))}</b></p>` : ''}
 ${gs.length ? '' : '<p class="muted center">Joue à un jeu pour voir tes statistiques.</p>'}</div>`;
}
/* missions du jour */
const MPOOL = [
  { id: 'play3', n: 'Joue 3 parties', ev: 'play', m: 3, r: ['st', 20] },
  { id: 'win2', n: 'Gagne 2 parties', ev: 'win', m: 2, r: ['sc', 20] },
  { id: 'nohint', n: 'Gagne une partie sans utiliser d’indice', ev: 'winNoHint', m: 1, r: ['st', 25] },
  { id: 'prac2', n: 'Rejoue 2 jeux pour le plaisir', ev: 'practice', m: 2, r: ['sc', 15] },
  { id: 'stars60', n: 'Gagne 60 ⭐', ev: 'stars', m: 60, r: ['sc', 20] },
  { id: 'wheel', n: 'Fais tourner la roue de la chance', ev: 'wheel', m: 1, r: ['st', 15], ok: () => feat(7) && !wheelEnd() },
  { id: 'shop', n: 'Achète quelque chose à la boutique', ev: 'buy', m: 1, r: ['st', 20] },
  { id: 'record', n: 'Bats un de tes records', ev: 'record', m: 1, r: ['st', 30] },
  { id: 'ach', n: 'Débloque un succès', ev: 'ach', m: 1, r: ['sc', 25] },
  { id: 'egg', n: 'Trouve un œuf caché', ev: 'egg', m: 1, r: ['gem', 1], ok: () => achEggs() < 24 }
];
function misOn() {
  return false;
}
function missions() {
  const k = dayKey();
  if (!S.mis || S.mis.k != k) {
    let h = 0;
    for (const c of String(k)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const rnd = () => {
      h = (h * 1103515245 + 12345) >>> 0;
      return h / 4294967296;
    };
    const pool = MPOOL.filter(m => !m.ok || m.ok()),
      l = [];
    while (l.length < 3 && pool.length) l.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0].id);
    S.mis = { k, l: l.map(id => ({ id, v: 0, got: 0 })), chest: 0 };
    save();
  }
  return S.mis;
}
function EV(name, n) {
  if (!misOn()) return;
  const M = missions();
  let ch = 0;
  M.l.forEach(x => {
    const m = MPOOL.find(q => q.id == x.id);
    if (!m || m.ev != name || x.v >= m.m) return;
    x.v = Math.min(m.m, x.v + (n || 1));
    ch = 1;
    if (x.v >= m.m) setTimeout(() => toast(`🎯 Mission accomplie : ${m.n} !`), 600);
  });
  if (ch) {
    save();
    misBadge();
  }
}
function misBadge() {
  const e = document.getElementById('mbdg');
  if (!e) return;
  if (!misOn()) {
    e.hidden = true;
    return;
  }
  const M = missions();
  e.hidden = !(
    M.l.some(x => {
      const m = MPOOL.find(q => q.id == x.id);
      return m && x.v >= m.m && !x.got;
    }) ||
    (M.l.every(x => x.got) && !M.chest)
  );
}
function giveRw(k, v, why) {
  if (k == 'st') award(v, why);
  else {
    if (k == 'sc') S.scr = (S.scr || 0) + v;
    else if (k == 'gem') S.gem = (S.gem || 0) + v;
    else if (k == 'hint') S.inv.hint = (S.inv.hint || 0) + v;
    toast(`+${v} ${RWI[k] || '💡'} ${why || ''}`);
  }
  save();
}
/* coffre */
function chest(title, rw, card) {
  popup(
    `<h2>🎁 ${esc(title)}</h2><div class="chest" id="chst"><span class="chl">🎁</span></div><p class="muted" id="chtx">Touche le coffre pour l'ouvrir !</p><div id="chrw"></div>`
  );
  const c = $('#chst');
  let opened = false;
  c.onclick = () => {
    if (opened) return;
    opened = true;
    c.classList.add('open');
    try {
      SFX('perfect');
    } catch (_) {}
    setTimeout(() => {
      try {
        confetti();
      } catch (_) {}
      const items = [];
      rw.forEach(([k, v]) => {
        giveRw(k, v, 'coffre');
        items.push(`<span class="chi">+${v} ${k == 'hint' ? '💡' : RWI[k]}</span>`);
      });
      if (card) {
        const r = albumGive();
        if (r)
          items.push(
            r.dup
              ? `<span class="chi">📸 Carte en double → +10 🔩</span>`
              : `<span class="chi new">📸 Nouvelle carte souvenir n°${r.i + 1} !</span>`
          );
      }
      $('#chtx').textContent = 'Tu as gagné :';
      $('#chrw').innerHTML = `<div class="chis">${items.join('')}</div><button onclick="closePop();render()">Super !</button>`;
      $('#chrw')
        .querySelectorAll('.chi')
        .forEach((e, i) =>
          e.animate(
            [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.2)', opacity: 1, offset: 0.7 }, { transform: 'scale(1)' }],
            { duration: 420, delay: i * 160, fill: 'backwards' }
          )
        );
    }, 700);
  };
}
/* album souvenirs */
function albumGive() {
  const PH = CONTENU.photos || [];
  if (!PH.length) return null;
  S.alb = Array.isArray(S.alb) ? S.alb : [];
  const miss = PH.map((_, i) => i).filter(i => !S.alb.includes(i));
  if (!miss.length || (Math.random() < 0.15 && S.alb.length)) {
    S.scr = (S.scr || 0) + 10;
    save();
    return { dup: 1 };
  }
  const i = miss[Math.floor(Math.random() * miss.length)];
  S.alb.push(i);
  save();
  if (S.alb.length >= PH.length) ACH('albumAll');
  return { i };
}
/* tutoriels */
const TUTO = {
  memory: ['tap', 'Touche deux cartes pour les retourner'],
  colony: ['tap', 'Touche une boîte pour l’envoyer'],
  melee: ['drag', 'Glisse ton doigt sur les lettres d’un mot'],
  flappy: ['tap', 'Touche l’écran pour faire voler Célestine'],
  balls: ['tap2', 'Touche une fiole, puis celle où verser'],
  hockey: ['drag', 'Glisse le doigt pour bouger ta palette'],
  bubble: ['drag', 'Vise avec le doigt, puis lâche pour tirer'],
  zip: ['drag', 'Trace un chemin du 1 jusqu’au dernier numéro'],
  arrows: ['tap', 'Touche une flèche pour la libérer'],
  picross: ['drag', 'Touche ou glisse pour remplir les cases'],
  simon: ['tap', 'Écoute, puis répète la mélodie'],
  sudoku: ['tap2', 'Touche une case, puis un chiffre'],
  photo: ['tap', 'Observe bien la photo avant les questions'],
  stack: ['tap', 'Touche l’écran pour lâcher le cadeau'],
  blocks: ['drag', 'Fais glisser une pièce sur la grille'],
  fleche: ['tap', 'Touche une définition, puis écris le mot'],
  rush: ['drag', 'Fais glisser les véhicules pour libérer la voiture'],
  candy: ['swipe', 'Fais glisser un bonbon vers son voisin'],
  g2048: ['swipe', 'Glisse pour déplacer toutes les tuiles'],
  spot: ['tap', 'Touche les différences sur une des photos'],
  relier: ['drag', 'Relie les points de même couleur'],
  pins: ['tap', 'Touche une épingle pour la retirer'],
  quiz: ['tap', 'Écris ta réponse puis valide'],
  jigsaw: ['drag', 'Fais glisser les pièces, touche-les pour les tourner']
};
function tuto(g) {
  S.tuto = S.tuto || {};
  const t = TUTO[g];
  if (!t || S.tuto[g]) return;
  S.tuto[g] = 1;
  save();
  setTimeout(() => {
    const box = document.querySelector('#gwin .gwbox') || document.body;
    const o = document.createElement('div');
    o.className = 'tuto t-' + t[0];
    o.innerHTML = `<div class="tutoz"><span class="tuh">👆</span>${t[0] == 'drag' ? '<i class="tug"></i>' : ''}${t[0] != 'swipe' && t[0] != 'drag' ? '<i class="tur"></i>' : ''}</div><p>${esc(t[1])}</p><small>Touche pour commencer</small>`;
    const kill = e => {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
    };
    let gone = 0;
    const bye = () => {
      if (gone) return;
      gone = 1;
      o.style.transition = 'opacity .25s';
      o.style.opacity = 0;
      setTimeout(() => o.remove(), 450);
    };
    o.addEventListener('pointerdown', e => {
      kill(e);
      bye();
    });
    ['pointerup', 'click', 'touchstart', 'touchend', 'touchmove', 'mousedown', 'mouseup'].forEach(t =>
      o.addEventListener(t, kill, { passive: false })
    );
    box.appendChild(o);
    setTimeout(() => {
      if (o.isConnected && !gone) {
        gone = 1;
        o.style.pointerEvents = 'none';
        o.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = () => o.remove();
      }
    }, 3600);
  }, 150);
}
/* transfert de progression */
async function packCode(obj, prefix) {
  let js = JSON.stringify(obj);
  let b;
  try {
    if (window.CompressionStream) {
      const cs = new Blob([js]).stream().pipeThrough(new CompressionStream('gzip'));
      const buf = new Uint8Array(await new Response(cs).arrayBuffer());
      let s2 = '';
      for (let i = 0; i < buf.length; i += 8192) s2 += String.fromCharCode.apply(null, buf.subarray(i, i + 8192));
      b = 'z' + btoa(s2);
    }
  } catch (_) {}
  if (!b) b = 'j' + btoa(unescape(encodeURIComponent(js)));
  return prefix + '.' + b;
}
async function unpackCode(code) {
  code = code.trim().replace(/\s+/g, '');
  const m = /^(AV1|VR1)\.([zj])(.+)$/.exec(code);
  if (!m) throw new Error('code');
  let js;
  if (m[2] == 'z') {
    const bin = atob(m[3]),
      u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    const ds = new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));
    js = await new Response(ds).text();
  } else js = decodeURIComponent(escape(atob(m[3])));
  return { kind: m[1], data: JSON.parse(js) };
}
function syncHTML() {
  return `<h2>📲 Jouer sur un autre appareil</h2><div class="panel"><p class="muted" style="margin:0 0 8px">Ta progression est enregistrée sur cet appareil. Pour la retrouver sur ta tablette ou ton téléphone, copie ton code ici, puis colle-le sur l'autre appareil.</p><div class="row"><button onclick="syncExport()">📤 Copier mon code</button><button class="alt" onclick="syncImport()">📥 Coller un code</button></div></div><h2>🎁 Fichier mystère</h2><div class="panel center"><p class="muted" style="margin:0 0 8px">${YTM.count() ? '✅ Fichier mystère ouvert… patience 😉' : "Si Valentin t'a envoyé un fichier mystère, ouvre-le ici."}</p>${mysBtn()}</div>`;
}
async function syncExport() {
  const o = { ...S };
  for (const k in o) if (typeof o[k] == 'string' && o[k].startsWith('data:') && o[k].length > 20000) delete o[k];
  const code = await packCode(o, 'AV1');
  let ok = false;
  try {
    await navigator.clipboard.writeText(code);
    ok = true;
  } catch (_) {}
  popup(
    `<h2>📤 Ton code de progression</h2><p>${ok ? '✅ Code copié ! Colle-le sur ton autre appareil, dans « 📥 Coller un code ».' : 'Copie ce code, puis colle-le sur ton autre appareil.'}</p><textarea class="synct" readonly onclick="this.select()">${code}</textarea><p class="muted" style="font-size:.8rem">Le code contient tout : cases, étoiles, œufs, succès, album… (sauf une photo de puzzle personnalisée).</p><button onclick="closePop()">OK</button>`
  );
}
function syncImport() {
  popup(
    `<h2>📥 Coller un code</h2><p>Colle ici le code copié sur ton autre appareil.</p><textarea class="synct" id="syncin" placeholder="Colle ton code ici…"></textarea><p class="muted" style="font-size:.8rem">⚠️ La progression de cet appareil sera remplacée par celle du code.</p><button onclick="syncDo()">Importer</button><button class="alt" onclick="closePop()">Annuler</button>`
  );
}
async function syncDo() {
  const v = (($('#syncin') || {}).value || '').trim();
  try {
    const r = /^AVENT-/.test(v)
      ? { kind: 'AV1', data: { ...S, ...JSON.parse(decodeURIComponent(escape(atob(v.slice(6))))), sim: 0 } }
      : await unpackCode(v);
    if (r.kind == 'VR1') {
      S.vrec = r.data;
      save();
      closePop();
      toast(`⚔️ Records de ${VNAME} importés !`);
      return render();
    }
    const o = r.data;
    if (!o || !Array.isArray(o.opened)) throw new Error('bad');
    for (const k in S) if (typeof S[k] == 'string' && S[k].startsWith('data:') && !(k in o)) o[k] = S[k];
    localStorage.setItem(KEY, JSON.stringify(o));
    closePop();
    toast('✅ Progression importée !');
    setTimeout(() => location.reload(), 700);
  } catch (e) {
    toast('❌ Ce code ne fonctionne pas, vérifie qu’il est complet');
  }
}
async function vrecExport() {
  const o = {};
  Object.entries(S.st || {}).forEach(([g, x]) => {
    const r = {};
    if (x.bs != null) r.s = x.bs;
    if (x.bt != null) r.t = Math.round(x.bt * 10) / 10;
    if (Object.keys(r).length) o[g] = r;
  });
  const code = await packCode(o, 'VR1');
  try {
    await navigator.clipboard.writeText(code);
  } catch (_) {}
  popup(
    `<h2>⚔️ Code de tes records</h2><p>Envoie-lui ce code : elle le colle dans <b>🎮 menu de démarrage → ⚙️ Options → 📥 Coller un code</b>, et tes records apparaissent à battre dans chaque jeu.</p><textarea class="synct" readonly onclick="this.select()">${code}</textarea><p class="muted">${Object.keys(o).length} jeu(x) avec un record.</p><button onclick="closePop()">OK</button>`
  );
}
/* musique d'ambiance */
function bgmOn() {
  return S.bgm !== false && S.sound !== false && S.music !== false;
}
function bgm() {
  if (window.__vidOn) return;
  if (typeof ALBM != 'undefined' && ALBM.on) return;
  try {
    if (YTM.on()) return;
  } catch (_) {}
  try {
    if (!bgmOn() || document.getElementById('gwin')) return;
    if (MUS.cur && MUS.cur.startsWith('bg')) return;
    MUS.play('noir', 0.025);
    MUS._bg = 1;
  } catch (_) {}
}
