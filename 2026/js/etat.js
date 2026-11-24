/* ---------- État ---------- */
/* Une sauvegarde impossible à la date réelle (jour simulé, cases futures, fin déjà jouée) vient de tests : on repart de zéro. */
function staleSave(o) {
  try {
    const [y, m, d] = today(),
      ru = y > YEAR ? 24 : y < YEAR || m < 12 ? 0 : Math.min(d, 24),
      E = o.early || [];
    if (y == YEAR && m < 12) {
      if (staleRaw(o, ru, E)) o.tst = 1;
      return false;
    }
    return !!o.tst || staleRaw(o, ru, E);
  } catch (_) {
    return false;
  }
}
function staleRaw(o, ru, E) {
  try {
    return (
      (o.sim || 0) > 0 ||
      (o.opened || []).some(n => n > ru && !E.includes(n)) ||
      (ru < 24 && !!(o.vbDone || o.secretDone || Object.values(o.puzWon || {}).some(Boolean)))
    );
  } catch (_) {
    return false;
  }
}
const SVSL = (() => {
    try {
      const n = +localStorage.getItem('avent_slot');
      return n >= 1 && n <= 3 ? n : 1;
    } catch (_) {
      return 1;
    }
  })(),
  slotKey = n => (n > 1 ? 'avent_v5_s' + n : CLE_SAUVEGARDE);
const KEY = slotKey(SVSL);
try {
  localStorage.removeItem('avent_v3');
  localStorage.removeItem('avent_v4');
} catch (e) {}
let S = {
  pts: 0,
  earned: 0,
  opened: [],
  map: [],
  days: {},
  carnet: {},
  streak: 0,
  lastStreak: 0,
  inv: { hint: 0, joker: 0, dbl: 0, early: 0, jeton: 0 },
  early: [],
  scr: 0,
  gem: 0,
  cap: 2,
  lab: {},
  own: [],
  bons: [],
  theme: 'sapin',
  sound: true,
  storm: false,
  wheel: '',
  sim: 0,
  lvl: 0,
  diff: null,
  perm: [],
  moves: 0,
  t: 0,
  started: false,
  done: false,
  auto: false,
  best: {},
  puzWon: {}
};
let view = 'cal',
  cur = 0,
  U = [],
  G = {};
try {
  let o = JSON.parse(localStorage.getItem(KEY) || '{}');
  if (!CONTENU.modeTest && staleSave(o)) {
    o = {};
    localStorage.removeItem(KEY);
    localStorage.removeItem('avent_img');
  }
  Object.assign(S, o);
  S.inv = Object.assign({ hint: 0, joker: 0, dbl: 0, early: 0, jeton: 0 }, o.inv || {});
} catch (e) {}
let IMG = DEF_IMG;
try {
  IMG = localStorage.getItem('avent_img') || DEF_IMG;
} catch (e) {}
function save() {
  if (window.__noSave) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
  try {
    syncState();
  } catch (_) {}
}
/* ---------- Suivi en direct (Firebase) ---------- */
const SYNCU = 'https://calendrier-celestine-default-rtdb.europe-west1.firebasedatabase.app/avent-c7v4k9q2/' + (CONTENU.syncRoom || 'c');
let syncT = 0;
function syncReq(p, m, b) {
  try {
    if (!/^https?:/.test(location.protocol)) return;
    fetch(SYNCU + '/' + p + '.json' + (m == 'POST' ? '' : '?x-http-method-override=' + m), {
      method: 'POST',
      body: JSON.stringify(b),
      keepalive: true,
      mode: 'no-cors'
    }).catch(() => {});
  } catch (_) {}
}
function instPend() {
  try {
    return !!document.getElementById('inst') || (APP.web() && !APP.standalone() && !sessionStorage.getItem('instSkip'));
  } catch (_) {
    return false;
  }
}
function syncSnap() {
  let L = 0;
  try {
    L = lvl();
  } catch (_) {}
  let A = 0;
  try {
    A = Object.keys(achS()).length;
  } catch (_) {}
  let E = 0;
  try {
    E = eggs().length;
  } catch (_) {}
  const D = {};
  for (const k in S.days || {}) {
    const x = S.days[k] || {};
    D[k] = { d: x.done ? 1 : 0, l: x.lost ? 1 : 0, f: x.fails || 0, s: x.score || 0, e: x.extra || 0 };
  }
  return {
    at: Date.now(),
    acc: S.accTry || 0,
    enq: {
      x: Object.keys(S.enqX || {}).length,
      l: (S.enqL || []).length,
      n: Object.values(S.enqN || {}).filter(v => v && String(v).trim()).length
    },
    rev: (S.story || {}).rev || 0,
    sim: S.sim || 0,
    pts: S.pts,
    earned: S.earned,
    lvl: L + 1,
    lvlN: LEVELS[L][1],
    scr: S.scr || 0,
    gem: S.gem || 0,
    inv: S.inv || {},
    eggs: E,
    ach: A,
    achT: typeof ACHS != 'undefined' ? ACHS.length : 0,
    opened: S.opened || [],
    days: D,
    streak: S.streak || 0,
    bons: (S.bons || []).map(b => ({ ic: b.ic, n: b.n, u: b.used ? 1 : 0, at: b.at || 0 })),
    own: S.own || [],
    puz: {
      diff: S.diff || null,
      done: !!S.done,
      auto: !!S.auto,
      moves: S.moves || 0,
      t: S.t || 0,
      ok: (S.perm || []).filter((v, i) => v == i).length
    },
    secret: S.secret ? { done: !!S.secret.done, score: S.secret.score || 0 } : null,
    boss: S.boss || {},
    bossTry: S.bossTry || {},
    vids: (() => {
      try {
        return vidN();
      } catch (_) {
        return 0;
      }
    })(),
    vidT: (CONTENU.videos || []).length,
    alb: (() => {
      try {
        return alRev();
      } catch (_) {
        return 0;
      }
    })(),
    albT: (() => {
      try {
        return alTotal();
      } catch (_) {
        return 0;
      }
    })(),
    vb: S.vbDone || 0,
    machine: S.secretDone ? 1 : 0,
    puzWon: S.puzWon || {},
    lang: S.lang || 'fr',
    saves: Object.keys(S.vsave || {}),
    set: { lum: S.lum == null ? 100 : S.lum, fsz: S.fsz || 'n', warm: !!S.warm, snd: S.sound !== false, mus: S.music !== false }
  };
}
function syncState() {
  clearTimeout(syncT);
  syncT = setTimeout(() => syncReq('state', 'PUT', syncSnap()), 1500);
}
function syncLive(g) {
  try {
    const o = { at: Date.now(), view: typeof view != 'undefined' ? view : '', vis: document.hidden ? 0 : 1, sim: S.sim || 0 };
    if (g !== undefined) window.__lg = g;
    if (window.__lg) o.game = window.__lg;
    syncReq('live', 'PUT', o);
  } catch (_) {}
}
function slog(ic, txt) {
  syncReq('log', 'POST', { at: Date.now(), ic, txt, sim: S.sim || 0 });
}
document.addEventListener('visibilitychange', () => syncLive());
setInterval(() => {
  if (!document.hidden) syncLive();
}, 30000);
setTimeout(() => {
  syncLive();
  syncState();
}, 1200);
if (S.map.length != 24) {
  S.map = shuffle([...Array(24).keys()]);
  save();
}
/* ---------- Date (heure de Paris) ---------- */
function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris' }).format(new Date()).split('-').map(Number);
}
function unl() {
  if (S.sim) return Math.min(S.sim, 24);
  if (CONTENU.modeTest) return 24;
  const [y, m, d] = today();
  if (y > YEAR) return 24;
  if (y < YEAR || m < 12) return 0;
  return Math.min(d, 24);
}
const dayKey = () => (S.sim ? 'sim' + S.sim : today().join('-'));
const avail = d => d <= unl() || S.early.includes(d);
const feat = d => S.opened.includes(d);
/* Flammes : défis du jour réussis d'affilée (le jour même) */
const FLM = { 3: 10, 7: 25, 14: 50, 24: 100 };
const wheelEnd = () => {
  if (S.sim || CONTENU.modeTest) return false;
  const [y, m, d] = today();
  return y > YEAR || (y == YEAR && m == 12 && d > 24);
};
const flames = () => (CONTENU.modeTest || S.lastStreak >= unl() - 1 ? S.streak : 0);
function flameWin(d) {
  if (!(d == unl() || CONTENU.modeTest)) return;
  S.streak = S.lastStreak == d - 1 ? S.streak + 1 : 1;
  S.lastStreak = d;
  S.flm = S.flm || [];
  const n = S.streak,
    b = FLM[n];
  if (b && !S.flm.includes(n)) {
    S.flm.push(n);
    S.scr += FLMS[n] || 0;
    save();
    setTimeout(() => {
      award(b, `série de ${n} 🔥`);
      confetti();
      popup(
        `<h2>${n} flammes !</h2><span class="flm">🔥</span><p style="font-size:1.2rem;margin:.4em 0">${n} défis du jour réussis d'affilée${n == 24 ? ' : la série parfaite !' : ''}<br><b>+${b} ⭐ · +${FLMS[n] || 0} 🔩</b></p><button onclick="closePop()">Trop fort 🔥</button>`
      );
    }, 1800);
  }
}
function flameLost(d) {
  if (d == unl() || CONTENU.modeTest) S.streak = 0;
}
