/* ---------- Puzzle (4×6) ---------- */
const LV = {
    easy: { n: 'Facile', d: 'Pièces proches de leur place', mix: 14, p: 100 },
    normal: { n: 'Moyen', d: 'Mélange moyen', mix: 80, p: 200 },
    hard: { n: 'Difficile', d: 'Beaucoup de coups', mix: 600, p: 300 }
  },
  C = 4,
  R = 6,
  N = 24;
function mix() {
  const run = () => {
    let p, e, last;
    do {
      p = [...Array(N).keys()];
      e = N - 1;
      last = -1;
      for (let k = 0; k < LV[S.diff].mix; k++) {
        const o = [],
          r = Math.floor(e / C),
          c = e % C;
        if (r > 0) o.push(e - C);
        if (r < R - 1) o.push(e + C);
        if (c > 0) o.push(e - 1);
        if (c < C - 1) o.push(e + 1);
        const f = o.filter(x => x != last),
          t = f[Math.floor(Math.random() * f.length)];
        [p[e], p[t]] = [p[t], p[e]];
        last = e;
        e = t;
      }
    } while (p.every((v, i) => v == i));
    return p;
  };
  const dd = p =>
    p.reduce(
      (s, id, pos) => (id == N - 1 ? s : s + Math.abs((pos % C) - (id % C)) + Math.abs(Math.floor(pos / C) - Math.floor(id / C))),
      0
    );
  let b = run();
  if (S.diff == 'hard')
    for (let i = 0; i < 60; i++) {
      const q = run();
      if (dd(q) > dd(b)) b = q;
    }
  return b;
}
const TEST = () => CONTENU.modeTest || S.sim > 0;
function pickDiff(k) {
  popup(
    `<h2>${LV[k].n} ?</h2><p>Tu ne pourras plus changer de difficulté ensuite.</p><button onclick="newGame('${k}')">C'est parti</button><button class="alt" onclick="closePop()">Je réfléchis</button>`
  );
}
function resetPuz() {
  S.diff = S.diffLock = null;
  S.perm = [];
  S.done = false;
  S.started = false;
  S.auto = false;
  S.puzWon = {};
  S.best = {};
  save();
  toast('Puzzle réinitialisé 🧩');
  go('puz');
}
function newGame(d) {
  if (d) S.diff = d;
  S.diffLock = S.diff;
  S.perm = mix();
  S.moves = 0;
  S.t = 0;
  S.started = false;
  S.done = false;
  S.auto = false;
  U = [];
  save();
  go('puz');
}
const solvedPos = () => S.perm.length == N && S.perm.every((v, i) => v == i);
function rev(id) {
  if (S.done || id == N - 1) return true;
  return S.opened.includes(S.map.indexOf(id) + 1);
}
function puzView() {
  if (!feat(1)) {
    app.innerHTML = `<h1>Le puzzle</h1><div class="panel center"><p style="font-size:2.5rem;margin:0">🔒</p><p>Le puzzle s'ouvre avec la case du 1er décembre.</p></div>`;
    return;
  }
  if (!S.diff && S.diffLock) S.diff = S.diffLock;
  if (S.diff && S.perm.length != N) return newGame();
  if (!S.diff) {
    app.innerHTML = `<h1>Le puzzle</h1><p class="center">Le brigadier Gérald a passé le formulaire d’accusation au broyeur ! Chaque case du calendrier te rend un morceau. Recolle-les : le formulaire complet t’attend le 24.</p><p class="center"><b>⚠️ Choisis bien : la difficulté est définitive.</b></p>${Object.entries(
      LV
    )
      .map(
        ([k, l]) =>
          `<button class="ch" style="text-align:center" onclick="pickDiff('${k}')"><b>${l.n}</b> · ${l.d}${S.puzWon[k] ? ' · ✅' : ` · +${l.p} ⭐`}</button>`
      )
      .join('')}`;
    return;
  }

  app.innerHTML = `<h1>Puzzle · ${LV[S.diff].n}</h1> <div id="bw"><div class="fi" id="fi"><div id="bd" role="group" aria-label="Plateau du puzzle"></div><div class="bk vrs" onclick="$('#fi').classList.remove('on')"><div class="vrs-in"><p class="vrs-h">✉️ Au dos de la fiche</p><p>Célestine,</p><p>si tu lis ces lignes, c’est que tu as recollé les 24 morceaux. Bravo !</p><p>C’est le <b>formulaire d’accusation</b>. Envoie-le au procureur avec le fax du labo 🧪.</p><p>⚠️ Le procureur ne devine rien : il attend un nom. Le nom du coupable, c’est toi qui dois le trouver. Relis bien ton carnet 📓.</p><p class="vrs-s">— Lieutenant Pépin 👮</p><button class="sm" onclick="event.stopPropagation();go('lab')">🧪 Aller au labo</button></div></div></div></div>
 <div class="row"><button class="alt sm" id="pzh" onclick="peek()">💡 Indice (${S.inv.hint || 0})</button></div>
 <p id="st" class="center" aria-live="polite"></p>`;
  build();
  stats();
  if (S.done) $('#fi').classList.add('on');
  chk();
}
const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
function chk() {
  if (!S.done && solvedPos() && S.opened.length >= 24) win(false);
  else stats();
}
function bgs(id) {
  const c = id % C,
    r = Math.floor(id / C);
  return `background-image:url(${IMG});background-size:400% 600%;background-position:${(c / 3) * 100}% ${(r / 5) * 100}%;width:25%;height:${100 / 6}%`;
}
function paint() {
  const bd = $('#bd');
  if (!bd) return;
  [...bd.children].forEach((t, id) => {
    if (rev(id)) {
      t.style.cssText = bgs(id);
      t.textContent = '';
    } else {
      t.style.cssText = `width:25%;height:${100 / 6}%;background:repeating-linear-gradient(45deg,#7a1f33,#7a1f33 8px,#8f2a41 8px,#8f2a41 16px);display:grid;place-items:center;font-size:24px`;
      t.textContent = '🎁';
    }
  });
  place();
}
function build() {
  const bd = $('#bd');
  bd.innerHTML = '';
  for (let id = 0; id < N; id++) {
    const t = document.createElement('div');
    t.className = 't' + (id == N - 1 ? ' em' : '');
    t.dataset.id = id;
    t.setAttribute('role', 'button');
    t.setAttribute('aria-label', 'Pièce ' + (id + 1));
    bd.appendChild(t);
  }
  bd.onclick = e => {
    if (S.done) {
      $('#fi').classList.add('on');
      return;
    }
    const t = e.target.closest('.t');
    if (t) slide(S.perm.indexOf(+t.dataset.id));
  };
  let x0,
    y0,
    tp = -1,
    vd = 0;
  bd.ontouchstart = e => {
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
    const t = S.done ? null : e.target.closest('.t');
    tp = t ? S.perm.indexOf(+t.dataset.id) : -1;
    vd = 0;
    if (tp >= 0) {
      const h = S.perm.indexOf(N - 1);
      vd = h == tp + C ? 1 : h == tp - C ? -1 : 0;
    }
  };
  bd.ontouchmove = e => {
    if (tp < 0 || !vd) return;
    const dx = e.touches[0].clientX - x0,
      dy = e.touches[0].clientY - y0;
    if (Math.abs(dy) >= Math.abs(dx) && dy * vd > 0 && e.cancelable) e.preventDefault();
  };
  bd.ontouchend = e => {
    if (tp < 0 || S.done) return;
    const dx = e.changedTouches[0].clientX - x0,
      dy = e.changedTouches[0].clientY - y0;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    const h = S.perm.indexOf(N - 1),
      H = Math.abs(dx) > Math.abs(dy);
    const ok = H ? (dx < 0 ? h == tp - 1 && tp % C > 0 : h == tp + 1 && tp % C < C - 1) : dy < 0 ? h == tp - C : h == tp + C;
    if (ok) slide(tp);
    tp = -1;
  };
  paint();
}
function place() {
  const bd = $('#bd');
  if (!bd) return;
  S.perm.forEach((id, pos) => {
    const t = bd.children[id];
    t.style.left = (pos % C) * 25 + '%';
    t.style.top = (Math.floor(pos / C) * 100) / 6 + '%';
  });
  bd.children[N - 1].style.opacity = S.done ? 1 : 0;
}
function stats() {
  if (!$('#st')) return;
  $('#st').textContent = S.done
    ? S.auto
      ? 'Puzzle résolu automatiquement.'
      : 'Bravo, puzzle terminé !'
    : solvedPos()
      ? `Tout est en place ! Ouvre les ${24 - S.opened.length} dernières cases pour révéler la surprise.`
      : '';
}
function slide(pos) {
  if (S.done) return;
  const E = N - 1,
    e = S.perm.indexOf(E),
    r = Math.floor(pos / C),
    c = pos % C,
    er = Math.floor(e / C),
    ec = e % C;
  if (pos == e || (r != er && c != ec)) return;
  U.push([...S.perm]);
  if (U.length > 300) U.shift();
  const st = r == er ? (pos < e ? -1 : 1) : pos < e ? -C : C;
  let cu = e;
  while (cu != pos) {
    const nx = cu + st;
    S.perm[cu] = S.perm[nx];
    cu = nx;
  }
  S.perm[pos] = E;
  S.moves++;
  if (S.moves == 150 && !S.done) setTimeout(() => toast('150 coups… Valentin, lui, aurait déjà jeté le téléphone par la fenêtre.'), 300);
  S.started = true;
  place();
  stats();
  save();
  chk();
}
addEventListener('keydown', e => {
  if (view == 'day' && G && G.key && !e.target.closest('input,textarea')) {
    if (e.key.startsWith('Arrow')) e.preventDefault();
    G.key(e.key == 'Enter' ? '⏎' : e.key == 'Backspace' ? '⌫' : e.key);
  }
});
addEventListener('keydown', e => {
  if (view != 'puz' || S.done || !e.key.startsWith('Arrow') || !$('#bd')) return;
  e.preventDefault();
  const k = e.key,
    ep = S.perm.indexOf(N - 1);
  if (k == 'ArrowLeft' && ep % C < C - 1) slide(ep + 1);
  if (k == 'ArrowRight' && ep % C > 0) slide(ep - 1);
  if (k == 'ArrowUp' && ep + C < N) slide(ep + C);
  if (k == 'ArrowDown' && ep >= C) slide(ep - C);
});
function puzPlan(perm, budget) {
  const E = N - 1;
  const md = p => {
    let h = 0;
    for (let pos = 0; pos < N; pos++) {
      const id = p[pos];
      if (id == E) continue;
      h += Math.abs((pos % C) - (id % C)) + Math.abs(((pos / C) | 0) - ((id / C) | 0));
    }
    for (let r = 0; r < R; r++) {
      for (let a = 0; a < C; a++) {
        const x = p[r * C + a];
        if (x == E || ((x / C) | 0) != r) continue;
        for (let b = a + 1; b < C; b++) {
          const y = p[r * C + b];
          if (y != E && ((y / C) | 0) == r && y < x) h += 2;
        }
      }
    }
    for (let c = 0; c < C; c++) {
      for (let a = 0; a < R; a++) {
        const x = p[a * C + c];
        if (x == E || x % C != c) continue;
        for (let b = a + 1; b < R; b++) {
          const y = p[b * C + c];
          if (y != E && y % C == c && y < x) h += 2;
        }
      }
    }
    return h;
  };
  for (const W of [2, 3, 5]) {
    const start = perm.slice(),
      k0 = start.join(','),
      H = [],
      par = new Map(),
      g = new Map();
    const push = n => {
      H.push(n);
      let i = H.length - 1;
      while (i) {
        const q = (i - 1) >> 1;
        if (H[q].f <= H[i].f) break;
        [H[q], H[i]] = [H[i], H[q]];
        i = q;
      }
    };
    const pop = () => {
      const t = H[0],
        l = H.pop();
      if (H.length) {
        H[0] = l;
        let i = 0;
        for (;;) {
          const a = 2 * i + 1,
            b = a + 1;
          let m = i;
          if (a < H.length && H[a].f < H[m].f) m = a;
          if (b < H.length && H[b].f < H[m].f) m = b;
          if (m == i) break;
          [H[m], H[i]] = [H[i], H[m]];
          i = m;
        }
      }
      return t;
    };
    g.set(k0, 0);
    par.set(k0, null);
    push({ p: start, k: k0, g: 0, f: W * md(start) });
    let n = 0;
    while (H.length && n < budget) {
      const cur = pop();
      if (cur.g > g.get(cur.k)) continue;
      n++;
      if (cur.p.every((v, i) => v == i)) {
        const path = [];
        let k = cur.k;
        while (par.get(k)) {
          const [pk, mv] = par.get(k);
          path.push(mv);
          k = pk;
        }
        return path.reverse();
      }
      const e = cur.p.indexOf(E),
        r = (e / C) | 0,
        c = e % C;
      for (const t of [r > 0 ? e - C : -1, r < R - 1 ? e + C : -1, c > 0 ? e - 1 : -1, c < C - 1 ? e + 1 : -1]) {
        if (t < 0) continue;
        const q = cur.p.slice();
        q[e] = q[t];
        q[t] = E;
        const kk = q.join(','),
          ng = cur.g + 1;
        if (g.has(kk) && g.get(kk) <= ng) continue;
        g.set(kk, ng);
        par.set(kk, [cur.k, t]);
        push({ p: q, k: kk, g: ng, f: ng + W * md(q) });
      }
    }
  }
  return null;
}
let PLAN = null,
  PZB = false;
const PZHM = 10;
function peek() {
  if (S.done || PZB) return;
  if (!(S.inv.hint > 0)) return toast("Tu n'as plus d'indice 💡 : fabrique-en au labo 🧪");
  if (solvedPos()) return toast('Tout est déjà en place !');
  const run = () => {
    S.inv.hint--;
    save();
    const b = $('#pzh');
    if (b) b.textContent = `💡 Indice (${S.inv.hint})`;
    const mv = PLAN.m.splice(0, PZHM);
    let i = 0;
    PZB = true;
    const st = () => {
      if (i >= mv.length || view != 'puz' || S.done) {
        PZB = false;
        PLAN.k = S.perm.join(',');
        return;
      }
      slide(mv[i++]);
      setTimeout(st, 190);
    };
    st();
  };
  const k = S.perm.join(',');
  if (PLAN && PLAN.k == k && PLAN.m.length) return run();
  toast('💡 Je cherche les bons coups…');
  PZB = true;
  setTimeout(() => {
    const m = puzPlan(S.perm, 90000);
    PZB = false;
    if (!m) {
      toast('Indice indisponible pour le moment, réessaie');
      return;
    }
    PLAN = { k, m };
    run();
  }, 60);
}
function win(auto) {
  S.done = true;
  S.auto = auto;
  slog('🧩', `Puzzle terminé (${LV[S.diff].n}, ${S.moves} coups)`);
  let rec = false,
    pts = 0;
  if (!auto) {
    const b = S.best[S.diff];
    if (!b || S.t < b.t || (S.t == b.t && S.moves < b.m)) {
      S.best[S.diff] = { t: S.t, m: S.moves };
      rec = true;
    }
    if (!S.puzWon[S.diff]) {
      S.puzWon[S.diff] = 1;
      pts = LV[S.diff].p;
    }
    confetti();
  }
  paint();
  stats();
  save();
  $('#fi') && $('#fi').classList.add('on');
  try {
    if (pts) award(pts, 'puzzle terminé');
  } catch (_) {}
  const tf = () => {
    if ((S.story || {}).fichok) return;
    if (storyBusy()) return setTimeout(tf, 1500);
    story('fichok');
  };
  setTimeout(tf, 2600);
}
function solve() {
  if (S.done || S.opened.length < 24) return;
  S.perm = S.perm.map((_, i) => i);
  U = [];
  win(true);
}
setInterval(() => {
  if (view == 'puz' && S.started && !S.done && !document.hidden && $('#tm')) {
    S.t++;
    stats();
    if (S.t % 5 == 0) save();
  }
}, 1000);
/* ---------- Image du puzzle (import + recadrage) ---------- */
addEventListener('change', e => {
  const c = e.target.classList;
  if (e.target.type == 'file' && !c.contains('mpick') && !c.contains('mysmk')) onPick(e);
});
function onPick(e) {
  const f = e.target.files[0];
  e.target.value = '';
  if (!f) return;
  if (f.type && !f.type.startsWith('image/')) {
    appAlert('Choisis une image.');
    return;
  }
  if (f.size > 40e6) {
    appAlert('Image trop lourde (40 Mo max).');
    return;
  }
  const u = URL.createObjectURL(f),
    i = new Image();
  i.onerror = () => {
    URL.revokeObjectURL(u);
    appAlert('Impossible de lire cette image.');
  };
  i.onload = () =>
    cropUI(
      i,
      (sx, sy, sw, sh) => {
        closePop();
        const W = 1200,
          H = 1800,
          c = document.createElement('canvas');
        c.width = W;
        c.height = H;
        draw(i, c, sx, sy, sw, sh, W, H);
        URL.revokeObjectURL(u);
        IMG = c.toDataURL('image/jpeg', 0.92);
        try {
          localStorage.setItem('avent_img', IMG);
        } catch (x) {
          appAlert('Image trop lourde pour être sauvegardée.');
        }
        toast('Nouvelle image 📷');
        render();
      },
      () => URL.revokeObjectURL(u)
    );
  i.src = u;
}
function cropUI(i, done, cancel) {
  const iw = i.naturalWidth,
    ih = i.naturalHeight;
  popup(
    `<h2>Recadrer l'image</h2><p style="margin:0 0 8px;font-size:.9rem">Fais glisser la photo et zoome. La grille montre les pièces.</p><div class="crop" id="cv"></div><label style="display:flex;gap:8px;align-items:center">− <input id="cz" type="range" min="1" max="4" step="0.01" value="1" aria-label="Zoom" style="flex:1;accent-color:var(--r)"> +</label><p><button id="cok">Valider</button> <button class="alt" id="cno">Annuler</button></p>`
  );
  const v = $('#cv'),
    z = $('#cz');
  i.alt = '';
  v.appendChild(i);
  const W = v.clientWidth,
    H = W * 1.5;
  v.style.height = H + 4 + 'px';
  const b = Math.max(W / iw, H / ih);
  let s = b,
    x = (W - iw * s) / 2,
    y = (H - ih * s) / 2;
  const put = () => {
    x = Math.min(0, Math.max(W - iw * s, x));
    y = Math.min(0, Math.max(H - ih * s, y));
    i.style.width = iw + 'px';
    i.style.transform = `translate(${x}px,${y}px) scale(${s})`;
    z.value = s / b;
  };
  const zoom = (ns, cx, cy) => {
    ns = Math.min(4 * b, Math.max(b, ns));
    x = cx - ((cx - x) * ns) / s;
    y = cy - ((cy - y) * ns) / s;
    s = ns;
    put();
  };
  put();
  z.oninput = () => zoom(+z.value * b, W / 2, H / 2);
  v.onwheel = e => {
    e.preventDefault();
    const r = v.getBoundingClientRect();
    zoom(s * (e.deltaY < 0 ? 1.1 : 1 / 1.1), e.clientX - r.left, e.clientY - r.top);
  };
  const P = new Map();
  v.onpointerdown = e => {
    v.setPointerCapture(e.pointerId);
    P.set(e.pointerId, [e.clientX, e.clientY]);
  };
  v.onpointermove = e => {
    if (!P.has(e.pointerId)) return;
    const r = v.getBoundingClientRect();
    if (P.size == 1) {
      const [a, c] = P.get(e.pointerId);
      x += e.clientX - a;
      y += e.clientY - c;
      put();
    } else {
      const [p, q] = [...P.values()],
        d0 = Math.hypot(p[0] - q[0], p[1] - q[1]),
        m0 = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      P.set(e.pointerId, [e.clientX, e.clientY]);
      const [p2, q2] = [...P.values()],
        d1 = Math.hypot(p2[0] - q2[0], p2[1] - q2[1]),
        m1 = [(p2[0] + q2[0]) / 2, (p2[1] + q2[1]) / 2];
      x += m1[0] - m0[0];
      y += m1[1] - m0[1];
      if (d0 > 0) zoom((s * d1) / d0, m1[0] - r.left, m1[1] - r.top);
      else put();
      return;
    }
    P.set(e.pointerId, [e.clientX, e.clientY]);
  };
  v.onpointerup = v.onpointercancel = e => P.delete(e.pointerId);
  $('#cok').onclick = () => done(-x / s, -y / s, W / s, H / s);
  $('#cno').onclick = () => {
    closePop();
    cancel();
  };
}
function sharpen(c, a) {
  const x = c.getContext('2d'),
    W = c.width,
    H = c.height,
    d = x.getImageData(0, 0, W, H),
    s = d.data,
    o = new Uint8ClampedArray(s);
  for (let y = 1; y < H - 1; y++)
    for (let X = 1; X < W - 1; X++) {
      const p = (y * W + X) * 4;
      for (let k = 0; k < 3; k++)
        o[p + k] = s[p + k] * (1 + 4 * a) - a * (s[p + k - 4] + s[p + k + 4] + s[p + k - W * 4] + s[p + k + W * 4]);
    }
  d.data.set(o);
  x.putImageData(d, 0, 0);
}
function draw(i, c, sx, sy, sw, sh, w, h) {
  let src = i,
    cw = sw,
    ch = sh,
    ox = sx,
    oy = sy;
  while (cw * 1.6 < w) {
    const t = document.createElement('canvas');
    t.width = Math.round(cw * 1.5);
    t.height = Math.round(ch * 1.5);
    const q = t.getContext('2d');
    q.imageSmoothingQuality = 'high';
    q.drawImage(src, ox, oy, cw, ch, 0, 0, t.width, t.height);
    src = t;
    ox = oy = 0;
    cw = t.width;
    ch = t.height;
  }
  const g = c.getContext('2d');
  g.imageSmoothingQuality = 'high';
  g.drawImage(src, ox, oy, cw, ch, 0, 0, w, h);
  sharpen(c, 0.3);
}
