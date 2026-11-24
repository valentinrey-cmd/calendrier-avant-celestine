GAMES.g2048 = function (p, el, win, fail) {
  const id = RUN,
    N = 4,
    PH = CONTENU.photos || [],
    IMG = PH.length >= 8 ? shuffle([...PH]).slice(0, 8) : [],
    EM = { 2: '❄️', 4: '⭐', 8: '🔔', 16: '🍪', 32: '🧦', 64: '🎁', 128: '⛄', 256: '🦌', 512: '🎅' };
  let ks = '',
    kg2 = 0,
    DEL = 0,
    T = [],
    score = 0,
    done = false,
    busy = false,
    qd = null;
  const face = v => {
    const k = Math.log2(v) - 1;
    return IMG[k] ? `<img src="${IMG[k]}" alt="">` : `<span>${EM[v] || '🎄'}</span>`;
  };
  el.innerHTML = `<p class="center">Objectif : la tuile <b>${p.goal}</b> · Score <b id="g4s">0</b></p><div class="g48 ph g48s" id="g48">${'<div class="c"></div>'.repeat(16)}<div class="g4l" id="g4l"></div></div>
  <p class="center muted">Glisse le doigt sur la grille (ou flèches du clavier). Deux têtes identiques fusionnent en la suivante.</p>`;
  const LY = $('#g4l'),
    pos = t => {
      t.el.style.transform = `translate(${t.c * 100}%,${t.r * 100}%)`;
    },
    paint = t => {
      t.in.className = 'c v' + Math.min(t.v, 2048);
      t.in.innerHTML = `${face(t.v)}<small>${t.v}</small>`;
    };
  const mk = (r, c, v) => {
    const t = { r, c, v },
      d = document.createElement('div');
    d.className = 'g4t';
    d.innerHTML = '<div></div>';
    t.el = d;
    t.in = d.firstChild;
    paint(t);
    pos(t);
    LY.appendChild(d);
    t.in.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 160, easing: 'ease-out' });
    T.push(t);
    return t;
  };
  const add = () => {
    const occ = new Set(T.map(t => t.r * N + t.c)),
      e = [...Array(16).keys()].filter(i => !occ.has(i));
    if (e.length) {
      const i = e[Math.floor(Math.random() * e.length)];
      mk(Math.floor(i / N), i % N, Math.random() < 0.9 ? 2 : 4);
    }
  };
  const RS4 = vTake('g2048');
  if (RS4 && RS4.t && RS4.t.length) {
    RS4.t.forEach(([r, c, v]) => mk(r, c, v));
    score = RS4.score || 0;
    setTimeout(() => {
      const e = $('#g4s');
      if (e) e.textContent = score;
    }, 0);
  } else {
    add();
    add();
  }
  const at = () => {
    const g = Array(16).fill(null);
    T.forEach(t => (g[t.r * N + t.c] = t));
    return g;
  };
  const can = () => {
    const g = at();
    return g.some((t, i) => !t || (i % N < N - 1 && g[i + 1] && g[i + 1].v == t.v) || (i < 12 && g[i + N] && g[i + N].v == t.v));
  };
  const move = (d, qq) => {
    if (id != RUN || done) return;
    if (!qq) {
      ks = (ks + d).slice(-8);
      if (ks == 'UUDDLRLR' && !kg2) {
        kg2 = 1;
        EGG(19);
      }
    }
    if (busy) {
      qd = d;
      return;
    }
    const g = at();
    let moved = false;
    const dead = [],
      up = [];
    for (let k = 0; k < N; k++) {
      const idx = [...Array(N).keys()].map(i =>
        d == 'L' ? k * N + i : d == 'R' ? k * N + N - 1 - i : d == 'U' ? i * N + k : (N - 1 - i) * N + k
      );
      let j = 0,
        last = null;
      idx.forEach(i => {
        const t = g[i];
        if (!t) return;
        if (last && last.v == t.v && !last.m) {
          t.r = last.r;
          t.c = last.c;
          last.m = 1;
          last.v *= 2;
          score += last.v;
          dead.push(t);
          up.push(last);
          moved = true;
          return;
        }
        const q = idx[j++];
        const r = Math.floor(q / N),
          c = q % N;
        if (r != t.r || c != t.c) moved = true;
        t.r = r;
        t.c = c;
        last = t;
      });
    }
    if (!moved) return;
    busy = true;
    T.forEach(pos);
    T = T.filter(t => !dead.includes(t));
    setTimeout(() => {
      if (id != RUN) return;
      dead.forEach(t => t.el.remove());
      up.forEach(t => {
        t.m = 0;
        paint(t);
        t.in.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 170 });
      });
      add();
      $('#g4s').textContent = score;
      REC(score);
      busy = false;
      if (Math.max(...T.map(t => t.v)) >= p.goal) {
        done = true;
        return setTimeout(() => {
          if (id == RUN) win();
        }, 450);
      }
      if (!can()) {
        done = true;
        return setTimeout(() => {
          if (id == RUN) fail(`plus aucun mouvement possible (meilleure tuile : ${Math.max(...T.map(t => t.v))})`);
        }, 450);
      }
      if (qd) {
        const q = qd;
        qd = null;
        move(q, 1);
      }
    }, 125);
  };
  const B = $('#g48');
  let x0 = null,
    y0;
  B.onpointerdown = e => {
    x0 = e.clientX;
    y0 = e.clientY;
  };
  B.onpointerup = e => {
    if (x0 == null) return;
    const dx = e.clientX - x0,
      dy = e.clientY - y0;
    x0 = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) {
      if (DEL && !busy) {
        const R = B.getBoundingClientRect(),
          cw = (R.width - 16) / 4,
          c = Math.floor((e.clientX - R.left - 8) / cw),
          rr = Math.floor((e.clientY - R.top - 8) / cw),
          tl = T.find(q => q.r == rr && q.c == c);
        if (tl) {
          DEL = 0;
          B.classList.remove('g4del');
          T = T.filter(q => q != tl);
          tl.in.animate(
            [
              { transform: 'scale(1)', opacity: 1 },
              { transform: 'scale(0)', opacity: 0 }
            ],
            { duration: 220 }
          ).onfinish = () => tl.el.remove();
          try {
            SFX('pin');
          } catch (_) {}
        }
      }
      return;
    }
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'R' : 'L') : dy > 0 ? 'D' : 'U');
  };
  G = {
    save: () => ({ t: T.map(t => [t.r, t.c, t.v]), score }),
    move,
    board: () => {
      const b = Array(16).fill(0);
      T.forEach(t => (b[t.r * N + t.c] = t.v));
      return b;
    },
    key: k => {
      const m = { ArrowLeft: 'L', ArrowRight: 'R', ArrowUp: 'U', ArrowDown: 'D' }[k];
      if (m) move(m);
    }
  };
  G.hint = () => {
    if (id != RUN || done || busy) return false;
    if (T.length < 3) return 'Pas besoin de ranger pour l’instant 😉';
    const mn = Math.min(...T.map(t => t.v)),
      gone = T.length - T.filter(t => t.v != mn).length >= T.length - 1 ? [] : T.filter(t => t.v == mn);
    gone.forEach(
      tl =>
        (tl.in.animate(
          [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0)', opacity: 0 }
          ],
          { duration: 260 }
        ).onfinish = () => tl.el.remove())
    );
    T = T.filter(t => !gone.includes(t));
    const ord = [];
    for (let r = N - 1; r >= 0; r--) {
      const k = N - 1 - r;
      for (let i = 0; i < N; i++) ord.push([r, k % 2 ? N - 1 - i : i]);
    }
    T.sort((a, b) => b.v - a.v).forEach((t, i) => {
      t.r = ord[i][0];
      t.c = ord[i][1];
      pos(t);
    });
    busy = true;
    setTimeout(() => {
      busy = false;
      if (!can()) {
        add();
      }
    }, 300);
    try {
      SFX('perfect');
    } catch (_) {}
    toast(`✨ Rangement magique !${gone.length ? ` Les ${mn} disparaissent` : ''}`);
    return true;
  };
};
