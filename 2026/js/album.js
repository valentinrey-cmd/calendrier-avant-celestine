/* ---------- 🎵 Boîte à musique de l'album ---------- */
const ALBM = (() => {
  let A = null,
    G = null,
    iv = null,
    on = false,
    t0 = 0,
    step = 0;
  const fq = s => {
    const m = /^([A-G])(#|b)?(\d)$/.exec(s);
    const k = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] == '#' ? 1 : m[2] == 'b' ? -1 : 0);
    return 440 * 2 ** ((k + 12 * (+m[3] + 1) - 69) / 12);
  };
  const CH = { C: ['C3', 'E4', 'G4'], Am: ['A2', 'C4', 'E4'], F: ['F2', 'A3', 'C4'], G: ['G2', 'B3', 'D4'], Em: ['E3', 'G4', 'B4'] };
  const BARS = [
    ['C', 'E5:2 G5:1'],
    ['Am', 'E5:1.5 D5:.5 C5:1'],
    ['F', 'A4:2 C5:1'],
    ['G', 'B4:2 D5:1'],
    ['C', 'E5:2 G5:1'],
    ['Em', 'B5:1.5 A5:.5 G5:1'],
    ['F', 'A5:2 F5:1'],
    ['G', 'G5:3'],
    ['Am', 'C6:2 B5:1'],
    ['Em', 'G5:2 E5:1'],
    ['F', 'F5:1.5 E5:.5 D5:1'],
    ['C', 'E5:2 C5:1'],
    ['F', 'A5:2 G5:1'],
    ['G', 'F5:1 E5:1 D5:1'],
    ['C', 'C5:3'],
    ['C', 'R:3']
  ];
  const BEAT = 60 / 80;
  function bell(f, t, d, v) {
    const o = A.createOscillator(),
      o2 = A.createOscillator(),
      g = A.createGain(),
      g2 = A.createGain();
    o.type = 'sine';
    o2.type = 'sine';
    o.frequency.value = f;
    o2.frequency.value = f * 2.01;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(v, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    g2.gain.setValueAtTime(0, t);
    g2.gain.linearRampToValueAtTime(v * 0.28, t + 0.004);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.45);
    o.connect(g);
    o2.connect(g2);
    g.connect(G);
    g2.connect(G);
    o.start(t);
    o2.start(t);
    o.stop(t + d + 0.05);
    o2.stop(t + d + 0.05);
  }
  function bar(i, t) {
    const [c, mel] = BARS[i % BARS.length],
      ch = CH[c];
    bell(fq(ch[0]), t, 2.2, 0.16);
    bell(fq(ch[1]), t + BEAT, 1.4, 0.07);
    bell(fq(ch[2]), t + 2 * BEAT, 1.4, 0.07);
    let x = 0;
    mel.split(' ').forEach(n => {
      const [p, d] = n.split(':');
      if (p != 'R') bell(fq(p), t + x * BEAT, 1.8, 0.2);
      x += +d;
    });
  }
  function tick() {
    if (!on) return;
    while (t0 < A.currentTime + 1.2) {
      bar(step++, t0);
      t0 += 3 * BEAT;
    }
  }
  let fa = null,
    fu = null,
    fm = 0,
    stok = 0,
    hy = 0;
  function start() {
    if (on || S.sound === false || S.music === false) return;
    try {
      if (YTM.hold()) hy = 1;
    } catch (_) {}
    on = true;
    const tok = ++stok;
    (async () => {
      let bl = null;
      try {
        const o = await MDB.all();
        bl = o && o.b26 && o.b26.blob;
      } catch (_) {}
      if (!on || tok != stok) return;
      if (bl) {
        fm = 1;
        try {
          MUS.stop();
        } catch (_) {}
        fu = URL.createObjectURL(bl);
        fa = new Audio(fu);
        fa.loop = true;
        fa.volume = 0;
        try {
          await fa.play();
        } catch (_) {}
        const A2 = fa;
        let v = 0;
        const iv2 = setInterval(() => {
          if (fa !== A2) {
            clearInterval(iv2);
            return;
          }
          v = Math.min(0.6, v + 0.04);
          A2.volume = v;
          if (v >= 0.6) clearInterval(iv2);
        }, 120);
        return;
      }
      on = false;
      synthStart();
    })();
  }
  function synthStart() {
    if (on || S.sound === false || S.music === false) return;
    try {
      A = window.__eggAC || (window.__eggAC = new (window.AudioContext || window.webkitAudioContext)());
      if (A.state == 'suspended') A.resume();
      try {
        MUS.stop();
      } catch (_) {}
      G = A.createGain();
      G.gain.setValueAtTime(0, A.currentTime);
      G.gain.linearRampToValueAtTime(0.55, A.currentTime + 1.5);
      const dl = A.createDelay(),
        fb = A.createGain(),
        wet = A.createGain();
      dl.delayTime.value = 0.34;
      fb.gain.value = 0.32;
      wet.gain.value = 0.3;
      G.connect(A.destination);
      G.connect(dl);
      dl.connect(fb);
      fb.connect(dl);
      dl.connect(wet);
      wet.connect(A.destination);
      G._fx = [dl, fb, wet];
      on = true;
      step = 0;
      t0 = A.currentTime + 0.15;
      tick();
      iv = setInterval(tick, 250);
    } catch (e) {
      console.error(e);
    }
  }
  const rel = keep => {
    if (hy && !keep) {
      hy = 0;
      setTimeout(() => {
        try {
          YTM.unhold();
        } catch (_) {}
      }, 1 * 700);
      return 1;
    }
    return 0;
  };
  function stop(fade, keep) {
    if (!on) return;
    const ry = rel(keep);
    if (fm) {
      on = false;
      fm = 0;
      stok++;
      const A2 = fa,
        U = fu;
      fa = null;
      fu = null;
      if (A2) {
        let v = A2.volume;
        const f2 = setInterval(
          () => {
            v -= 0.06;
            if (v <= 0) {
              clearInterval(f2);
              try {
                A2.pause();
              } catch (_) {}
              if (U) URL.revokeObjectURL(U);
            } else A2.volume = v;
          },
          Math.max(30, (fade || 0.4) * 100)
        );
      }
      if (!ry && !keep)
        setTimeout(() => {
          try {
            bgm();
          } catch (_) {}
        }, 1500);
      return;
    }
    on = false;
    stok++;
    clearInterval(iv);
    const g = G;
    try {
      g.gain.cancelScheduledValues(A.currentTime);
      g.gain.setTargetAtTime(0, A.currentTime, fade || 0.4);
      setTimeout(() => {
        try {
          g.disconnect();
          g._fx.forEach(n => n.disconnect());
        } catch (_) {}
      }, 3000);
    } catch (_) {}
    if (!ry && !keep)
      setTimeout(() => {
        try {
          bgm();
        } catch (_) {}
      }, 1500);
  }
  return {
    start,
    stop,
    get on() {
      return on;
    }
  };
})();
/* ---------- 📸 Déblocage des photos de l'album ---------- */
function alTotal() {
  return alC().chapitres.reduce((a, c) => a + (c.photos || []).length, 0);
}
function alRev() {
  const days = Object.values(S.days || {}).filter(x => x && x.done).length,
    puz = Object.values(S.puzWon || {}).some(Boolean) ? 1 : 0,
    sec = S.secret && S.secret.done ? 1 : 0;
  return Math.min(alTotal(), 1 + days + puz + sec);
}
function alTick() {
  if (instPend()) return;
  const r = alRev(),
    b = document.getElementById('albdg');
  if (b) b.hidden = !(alOk() && r > (S.alSeen || 1));
  if (r > (S.alNew || 1) && !window.__alNT) window.__alNT = setTimeout(alNotify, 3200);
}
function alNotify() {
  window.__alNT = 0;
  const r = alRev(),
    from = S.alNew || 1;
  if (r <= from) return;
  if (document.body.classList.contains('playing') || document.getElementById('spl') || document.getElementById('alz')) {
    window.__alNT = setTimeout(alNotify, 2500);
    return;
  }
  const A = alPhotos(),
    x = A[from];
  S.alNew = from + 1;
  save();
  if (!x) return;
  let o = document.getElementById('alnew');
  if (o) o.remove();
  o = document.createElement('div');
  o.id = 'alnew';
  const ok = alOk();
  o.innerHTML = `<div class="aln-in"><p class="aln-k">✨ Nouveau souvenir gagné ✨</p><div class="aln-pol ${ok ? '' : 'blur'}"><img src="${x.src}" alt="">${ok ? '' : '<span class="aln-lk">🔒</span>'}</div>${ok ? `<p class="aln-t">${x.titre || ''}</p>${x.date ? `<p class="aln-d">${x.date}</p>` : ''}` : `<p class="aln-t" style="font-size:1.5rem">Un souvenir t'attend…</p><p class="aln-d">Pour le voir, fabrique l'album dans le 💝 coffre à souvenirs du labo 🧪</p>`}<p class="aln-c">${S.alNew} / ${alTotal()} souvenirs</p><div class="row"><button class="aln-go">${ok ? "📖 Voir dans l'album" : '🧪 Aller au labo'}</button><button class="alt aln-x">Plus tard</button></div></div>`;
  document.body.appendChild(o);
  try {
    bkT(784, 0.25, 'sine', 0.05);
    setTimeout(() => bkT(1046, 0.35, 'sine', 0.05), 140);
    setTimeout(() => bkT(1318, 0.5, 'sine', 0.04), 280);
  } catch (_) {}
  const cl = () => {
    o.classList.add('out');
    setTimeout(() => {
      o.remove();
      if ((S.alNew || 1) < alRev()) window.__alNT = setTimeout(alNotify, 700);
    }, 300);
  };
  o.querySelector('.aln-x').onclick = cl;
  o.querySelector('.aln-go').onclick = () => {
    if (!alOk()) {
      cl();
      try {
        closePop();
      } catch (_) {}
      go('lab');
      return;
    }
    const P = alPages(),
      pg = P.findIndex(p => p.items && p.items.some(it => it.idx == from));
    alS().goto = Math.max(0, pg);
    cl();
    try {
      closePop();
    } catch (_) {}
    go('book');
  };
  if (S.alNew >= alTotal())
    try {
      ACH('albumAll');
    } catch (_) {}
}
/* ---------- 📖 L'album photo ---------- */
function bkT(f, d, type, v, f2) {
  if (S.sound === false) return;
  try {
    const A = eggAC();
    if (!A) return;
    const t = A.currentTime,
      o = A.createOscillator(),
      g = A.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(v || 0.05, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g);
    g.connect(A.destination);
    o.start(t);
    o.stop(t + d + 0.02);
  } catch (_) {}
}
const alC = () => CONTENU.album || { chapitres: [] };
function alS() {
  if (!S.alp || typeof S.alp != 'object') S.alp = { p: 0 };
  return S.alp;
}
function alPhotos() {
  const R = [];
  alC().chapitres.forEach((c, ci) => (c.photos || []).forEach((ph, k) => R.push({ ...ph, ch: c.titre, ci, k })));
  return R;
}
function alPages() {
  const P = [];
  let idx = 0;
  const VV = CONTENU.videos || [];
  alC().chapitres.forEach((c, ci) => {
    const ph = (c.photos || []).map(x => ({ ...x, idx: idx++ })),
      it = [];
    VV.forEach((v, k) => {
      if (v.ch == c.titre && !v.apres) it.push({ vid: k });
    });
    ph.forEach(x => {
      it.push(x);
      VV.forEach((v, k) => {
        if (v.ch == c.titre && v.apres == x.titre) it.push({ vid: k });
      });
    });
    for (let i = 0; i < it.length; i += 2) P.push({ ch: c, ci, first: i == 0, items: it.slice(i, i + 2) });
  });
  if (P.length % 2) P.push({ blank: 1 });
  return P;
}
function vidN() {
  return Math.min((CONTENU.videos || []).length, Object.keys(S.boss || {}).length);
}
const vidOk = k => k < vidN();
function vidFig(k) {
  const V = (CONTENU.videos || [])[k] || {};
  if (!vidOk(k))
    return `<figure class="al-ph lock al-vid"><div class="al-fr vide al-myst"><span>🎬</span><small>Vidéo mystère</small></div><figcaption><em>⚔️ Bats un boss pour la découvrir</em></figcaption></figure>`;
  return `<figure class="al-ph al-vid" onclick="event.stopPropagation();vidPlay(${k})"><div class="al-fr"><img src="${V.poster}" alt="" loading="lazy"><span class="al-play">▶</span><i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i></div><figcaption><b>🎬 ${V.titre || ''}</b>${V.date ? `<small>${V.date}</small>` : ''}</figcaption></figure>`;
}
const alAW = () => {
  const m = document.getElementById('app');
  return Math.max(280, (m ? m.clientWidth : innerWidth) - 8);
};
const alSpread = () => innerWidth > innerHeight && alAW() >= 640;
function alSize() {
  const sp = alSpread(),
    H = Math.max(300, innerHeight - 205),
    W = alAW() - 12,
    pw = Math.floor(Math.min(sp ? W / 2 : W, (H * 300) / 430, sp ? 560 : 520));
  document.documentElement.style.setProperty('--alw', pw + 'px');
}
function alPageHTML(P, i) {
  let p = P[i];
  if (!p) return `<div class="al-page empty"></div>`;
  if (p.blank) return `<div class="al-page"><div class="al-end">❤</div></div>`;
  const RV = alRev();
  if (p.items.every(x => (x.vid != null ? !vidOk(x.vid) : x.idx >= RV)))
    return `<div class="al-page"><div class="al-ch" style="visibility:hidden">·</div><div class="al-phs">${p.items.map(x => (x.vid != null ? vidFig(x.vid) : `<figure class="al-ph lock"><div class="al-fr vide"><span>📷</span></div><figcaption>&nbsp;</figcaption></figure>`)).join('')}</div><span class="al-n">${i + 1}</span></div>`;
  p = { ...p, items: p.items.map(x => (x.vid == null && x.idx >= RV ? { idx: x.idx, lock: 1 } : x)) };
  return `<div class="al-page">${p.first ? `<div class="al-ch"><span>${p.ch.titre}</span>${p.ch.date ? `<small>${p.ch.date}</small>` : ''}</div>` : `<div class="al-ch sm"><span>${p.ch.titre}</span></div>`}
 <div class="al-phs ${p.items.length == 2 && p.items.every(x => x.src && x.o == 'p') ? 'duo' : p.items.length == 1 ? 'solo' : ''}">${p.items.map(x => (x.vid != null ? vidFig(x.vid) : x.lock ? `<figure class="al-ph lock"><div class="al-fr vide"><span>📷</span></div><figcaption>&nbsp;</figcaption></figure>` : `<figure class="al-ph" onclick="event.stopPropagation();alZoom(${x.idx})"><div class="al-fr ${x.src ? '' : 'vide'}">${x.src ? `<img src="${x.src}" alt="" loading="lazy" style="object-position:${x.pos || 'center'}">` : `<span>📷</span>`}${/20(2[7-9]|[3-9]\d)|longtemps/.test(x.date || '') ? '<span class="al-pred">🔮 Prédiction garantie à 97 %</span>' : ''}<i class="c1"></i><i class="c2"></i><i class="c3"></i><i class="c4"></i></div><figcaption><b>${x.titre || ''}</b>${x.date ? `<small>${x.date}</small>` : ''}${x.txt ? `<em>${x.txt}</em>` : ''}</figcaption></figure>`)).join('')}</div><span class="al-n">${i + 1}</span></div>`;
}
function bookView() {
  if (!feat(1)) {
    $('#app').innerHTML =
      `<h1>Album</h1><div class="panel center"><p style="font-size:2.5rem;margin:0">🔒</p><p>L'album s'ouvre avec la case du 1er décembre.</p></div>`;
    return;
  }
  const B = alS();
  alSize();
  if (window.__prevView != 'book') B.open = 0;
  $('#app').innerHTML =
    `<div class="al-wrap" id="alw"><div class="al-snow"></div><div class="al-stage" id="als">${B.open ? alOpenHTML() : alCoverHTML()}</div></div>`;
  if (B.open) alBind();
  else alCoverBind();
  if (!window.__alRs) {
    window.__alRs = 1;
    let tm;
    addEventListener('resize', () => {
      clearTimeout(tm);
      tm = setTimeout(() => {
        if (view == 'book' && !document.getElementById('alz')) {
          alSize();
          if (alS().open) {
            $('#als').innerHTML = alOpenHTML();
            alBind();
          }
        }
      }, 200);
    });
  }
}
function alCoverHTML(cp) {
  const L = alC(),
    sp = alSpread(),
    P = alPages(),
    q = cp == null ? 0 : cp;
  return `<div class="al-book closed ${sp ? 'sp' : ''}" id="alb">
 ${sp ? `<div class="al-half R">${alPageHTML(P, q + 1)}</div>` : `<div class="al-half S">${alPageHTML(P, q)}</div>`}
 <div class="al-cover" id="alcv"><div class="face f">
  <svg class="bk-frame" viewBox="0 0 300 430" preserveAspectRatio="none"><defs><linearGradient id="bkg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2b8"/><stop offset=".5" stop-color="#d9a92e"/><stop offset="1" stop-color="#8a5f12"/></linearGradient></defs><rect x="14" y="14" width="272" height="402" rx="6" fill="none" stroke="url(#bkg)" stroke-width="3"/><rect x="24" y="24" width="252" height="382" rx="4" fill="none" stroke="url(#bkg)" stroke-width="1"/>
  ${[
    [24, 24, 1, 1],
    [276, 24, -1, 1],
    [24, 406, 1, -1],
    [276, 406, -1, -1]
  ]
    .map(
      ([x, y, a, b]) =>
        `<path transform="translate(${x} ${y}) scale(${a} ${b})" d="M0 0 q30 4 40 30 q-12 -8 -22 -4 q8 10 4 22 q-6 -14 -22 -18z" fill="url(#bkg)"/>`
    )
    .join('')}</svg>
  <div class="al-ttl"><div class="bk-tree">✦</div><h1>${L.titre || 'Notre Histoire'}</h1><p>${L.sousTitre || 'Célestine & Valentin'}</p><div class="bk-dots"><i></i><i></i><i></i></div></div>
  <div class="bk-rib h"></div><div class="bk-seal" id="bkseal"><span>C</span><span class="hrt">♥</span><span>V</span><i class="s1"></i><i class="s2"></i></div></div>
  <div class="face b">${sp ? alPageHTML(P, q) : ''}</div></div></div>
 <p class="bk-hint">${alOk() ? 'Un album scellé… touche le sceau pour l’ouvrir' : '🔒 Un album verrouillé… <small style="display:block">Fabrique-le dans le 💝 coffre à souvenirs du labo</small>'}</p>`;
}
const alOk = () => S.own.includes('album');
function alCoverBind() {
  const B = alS(),
    bk = $('#alb');
  let busy = false;
  bk.onclick = () => {
    if (busy) return;
    if (!alOk()) {
      bk.classList.remove('shake');
      void bk.offsetWidth;
      bk.classList.add('shake');
      bkT(140, 0.18, 'square', 0.05);
      bkT(110, 0.25, 'sine', 0.07);
      const h = $('.bk-hint');
      if (h) {
        h.innerHTML = '🔒 Cet album est verrouillé…<br><small>Fabrique-le dans le <b>💝 coffre à souvenirs</b> du labo 🧪</small>';
        h.classList.add('lockmsg');
      }
      toast("🔒 Fabrique l'album dans le coffre à souvenirs du labo");
      return;
    }
    busy = true;
    const s = $('#bkseal');
    s.classList.add('crack');
    bkT(180, 0.15, 'sawtooth', 0.06);
    setTimeout(() => {
      s.classList.add('broken');
      document.querySelectorAll('.bk-rib').forEach(r => r.classList.add('fall'));
      bkT(660, 0.25, 'triangle', 0.06, 1320);
      try {
        confetti();
      } catch (_) {}
    }, 550);
    setTimeout(() => {
      bkT(523, 0.12, 'triangle', 0.05);
      setTimeout(() => bkT(784, 0.3, 'sine', 0.05), 140);
      bk.classList.add('opening');
      $('.bk-hint').style.opacity = 0;
    }, 1350);
    setTimeout(() => {
      B.open = 1;
      B.p = B.goto || 0;
      B.goto = 0;
      S.alSeen = alRev();
      save();
      try {
        alTick();
      } catch (_) {}
      $('#als').innerHTML = alOpenHTML();
      alBind(true);
    }, 1350 + 1300);
    setTimeout(() => ALBM.start(), 1350);
  };
}
function alOpenHTML() {
  const P = alPages(),
    B = alS(),
    sp = alSpread();
  let p = Math.min(Math.max(0, B.p | 0), P.length - 1);
  if (sp) p -= p % 2;
  B.p = p;
  const tot = sp ? P.length / 2 : P.length,
    cur = sp ? p / 2 + 1 : p + 1;
  return `<div class="al-book open ${sp ? 'sp' : ''}" id="alb">${sp ? `<div class="al-half L" id="alL">${alPageHTML(P, p)}</div><div class="al-half R" id="alR">${alPageHTML(P, p + 1)}</div><div class="al-gut"></div>` : `<div class="al-half S" id="alS">${alPageHTML(P, p)}</div>`}</div>
 <div class="bk-nav"><button class="alt sm" id="bkprev" ${cur <= 1 ? 'disabled' : ''}>‹</button><span id="bkpn">${cur} / ${tot}</span><button class="alt sm" id="bknext" ${cur >= tot ? 'disabled' : ''}>›</button></div>
 <p class="bk-hint2"><button class="alt sm" onclick="alClose()">📕 Refermer l’album</button></p>`;
}
let alBusy = false;
function alBind(first) {
  const bk = $('#alb');
  if (first) bk.classList.add('appear');
  $('#bkprev').onclick = e => {
    e.stopPropagation();
    alFlip(-1);
  };
  $('#bknext').onclick = e => {
    e.stopPropagation();
    alFlip(1);
  };
  let x0 = null,
    y0 = 0;
  bk.onpointerdown = e => {
    x0 = e.clientX;
    y0 = e.clientY;
  };
  bk.onpointerup = e => {
    if (x0 == null) return;
    const dx = e.clientX - x0,
      dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) alFlip(dx < 0 ? 1 : -1);
  };
}
function alNav() {
  const P = alPages(),
    B = alS(),
    sp = alSpread(),
    tot = sp ? P.length / 2 : P.length,
    cur = sp ? B.p / 2 + 1 : B.p + 1;
  $('#bkpn').textContent = `${cur} / ${tot}`;
  $('#bkprev').disabled = cur <= 1;
  $('#bknext').disabled = cur >= tot;
}
function pageFlip(d) {
  if (S.sound === false) return;
  try {
    const A = eggAC();
    if (!A) return;
    const t = A.currentTime,
      sr = A.sampleRate,
      n = Math.floor(sr * 0.6),
      b = A.createBuffer(1, n, sr),
      q = b.getChannelData(0);
    for (let i = 0; i < n; i++) {
      const u = i / n,
        env = Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.25)), 1.4) * (1 - u * 0.4);
      q[i] = (Math.random() * 2 - 1) * env * (Math.random() < 0.035 ? 2.6 : 1);
    }
    const src = A.createBufferSource(),
      bp = A.createBiquadFilter(),
      hp = A.createBiquadFilter(),
      g = A.createGain();
    src.buffer = b;
    bp.type = 'bandpass';
    bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(d > 0 ? 3200 : 2400, t);
    bp.frequency.exponentialRampToValueAtTime(d > 0 ? 1100 : 1600, t + 0.5);
    hp.type = 'highpass';
    hp.frequency.value = 500;
    g.gain.setValueAtTime(0.32, t);
    src.connect(hp);
    hp.connect(bp);
    bp.connect(g);
    g.connect(A.destination);
    src.start(t);
    const n2 = Math.floor(sr * 0.09),
      b2 = A.createBuffer(1, n2, sr),
      q2 = b2.getChannelData(0);
    for (let i = 0; i < n2; i++) q2[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n2, 3);
    const s2 = A.createBufferSource(),
      lp = A.createBiquadFilter(),
      g2 = A.createGain();
    s2.buffer = b2;
    lp.type = 'lowpass';
    lp.frequency.value = 900;
    g2.gain.value = 0.35;
    s2.connect(lp);
    lp.connect(g2);
    g2.connect(A.destination);
    s2.start(t + 0.62);
  } catch (_) {}
}
function alFlip(d) {
  const B = alS(),
    P = alPages(),
    sp = alSpread(),
    st = sp ? 2 : 1,
    n = B.p + d * st;
  if (alBusy || n < 0 || n >= P.length) return;
  alBusy = true;
  pageFlip(d);
  const bk = $('#alb'),
    leaf = document.createElement('div');
  leaf.className = 'al-leaf ' + (d > 0 ? 'fw' : 'bw') + (sp ? '' : ' one');
  if (sp) {
    if (d > 0) {
      leaf.innerHTML = `<div class="face f">${alPageHTML(P, B.p + 1)}</div><div class="face b">${alPageHTML(P, n)}</div>`;
      $('#alR').innerHTML = alPageHTML(P, n + 1);
    } else {
      leaf.innerHTML = `<div class="face f">${alPageHTML(P, B.p)}</div><div class="face b">${alPageHTML(P, n + 1)}</div>`;
      $('#alL').innerHTML = alPageHTML(P, n);
    }
  } else {
    if (d > 0) {
      leaf.innerHTML = `<div class="face f">${alPageHTML(P, B.p)}</div><div class="face b"><div class="al-page"></div></div>`;
      $('#alS').innerHTML = alPageHTML(P, n);
    } else {
      leaf.classList.add('in');
      leaf.innerHTML = `<div class="face f">${alPageHTML(P, n)}</div><div class="face b"><div class="al-page"></div></div>`;
    }
  }
  bk.appendChild(leaf);
  B.p = n;
  save();
  setTimeout(() => {
    if (sp) {
      if (d > 0) $('#alL').innerHTML = alPageHTML(P, n);
      else $('#alR').innerHTML = alPageHTML(P, n + 1);
    } else if (d < 0) $('#alS').innerHTML = alPageHTML(P, n);
    leaf.remove();
    alNav();
    alBusy = false;
  }, 760);
}
function alClose() {
  if (alBusy || window.__alClosing) return;
  window.__alClosing = 1;
  ALBM.stop(1.2);
  const B = alS(),
    st = $('#als');
  const p = B.p | 0;
  B.open = 0;
  save();
  bkT(520, 0.18, 'triangle', 0.04, 300);
  st.innerHTML = alCoverHTML(p);
  const bk = $('#alb');
  bk.classList.add('opening', 'noanim', 'reseal');
  $('.bk-hint').style.opacity = 0;
  void bk.offsetWidth;
  requestAnimationFrame(() => {
    bk.classList.remove('noanim');
    requestAnimationFrame(() => {
      bk.classList.remove('opening');
      setTimeout(() => {
        bkT(110, 0.25, 'sine', 0.09);
        bk.classList.add('thud');
      }, 1150);
      setTimeout(() => {
        bk.querySelectorAll('.bk-rib').forEach(r => r.classList.add('in'));
        bkT(700, 0.2, 'triangle', 0.03, 1200);
      }, 1350);
      setTimeout(() => {
        const se = $('#bkseal');
        se.classList.add('drop');
        setTimeout(() => {
          bkT(160, 0.2, 'square', 0.05);
          bkT(90, 0.35, 'sine', 0.08);
          bk.classList.add('stamp');
        }, 430);
      }, 1850);
      setTimeout(() => {
        bk.classList.remove('reseal', 'thud', 'stamp');
        $('.bk-hint').style.opacity = 1;
        window.__alClosing = 0;
        alCoverBind();
      }, 2700);
    });
  });
}
function alZoom(i) {
  const A = alPhotos().slice(0, alRev());
  if (!A[i]) return;
  let o = document.getElementById('alz');
  if (!o) {
    o = document.createElement('div');
    o.id = 'alz';
    document.body.appendChild(o);
  }
  const x = A[i];
  o.innerHTML = `<button class="alz-x" aria-label="Fermer">✕</button><div class="alz-in">${x.src ? `<img src="${x.src}" alt="">` : `<div class="alz-v"><span>📷</span><small>Photo à venir</small></div>`}<p class="alz-t">${x.titre || ''}</p>${x.date ? `<p class="alz-c" style="color:#f2cf6e">${x.date}</p>` : ''}${x.txt ? `<p class="alz-c" style="font-size:1.15rem;margin-top:4px;color:#f4e6c8">${x.txt}</p>` : ''}<p class="alz-c">${x.ch} · ${i + 1} / ${A.length}</p></div>${i > 0 ? `<button class="alz-a l">‹</button>` : ''}${i < A.length - 1 ? `<button class="alz-a r">›</button>` : ''}`;
  {
    const im = o.querySelector('.alz-in img');
    if (im) {
      let n = 0;
      im.onclick = e => {
        e.stopPropagation();
        if (++n == 3) {
          const t = document.createElement('div');
          t.className = 'alz-stamp';
          t.innerHTML = '✅ Photo approuvée par Valentin<small>(il est beau dessus, lui aussi)</small>';
          o.querySelector('.alz-in').appendChild(t);
          try {
            SFX('ok');
          } catch (_) {}
        }
      };
    }
  }
  o.classList.add('on');
  const cl = () => {
    o.classList.remove('on');
    setTimeout(() => o.remove(), 250);
  };
  o.querySelector('.alz-x').onclick = cl;
  o.onclick = e => {
    if (e.target == o) cl();
  };
  const l = o.querySelector('.alz-a.l'),
    r = o.querySelector('.alz-a.r');
  if (l)
    l.onclick = e => {
      e.stopPropagation();
      alZoom(i - 1);
    };
  if (r)
    r.onclick = e => {
      e.stopPropagation();
      alZoom(i + 1);
    };
  let x0 = null;
  o.onpointerdown = e => (x0 = e.clientX);
  o.onpointerup = e => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (dx < -50 && i < A.length - 1) alZoom(i + 1);
    else if (dx > 50 && i > 0) alZoom(i - 1);
  };
}
