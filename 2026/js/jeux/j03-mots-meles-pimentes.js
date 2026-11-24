GAMES.melee = function (p, el, win, fail) {
  const LOSE = w => {
    fail(w, 1);
    try {
      pl.forEach(o => {
        if (!found.includes(o)) found.push(o);
      });
      a = b = -1;
      draw();
    } catch (e) {
      console.error(e);
    }
  };
  const id = RUN,
    n = p.n,
    DIR = [
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
      [0, -1],
      [-1, 0],
      [-1, -1],
      [1, -1]
    ].slice(0, p.dirs || 8);
  let g,
    pl,
    egg = null;
  for (;;) {
    g = Array(n * n).fill('');
    pl = [];
    let all = true;
    for (const w of shuffle(p.words)) {
      let done = false;
      for (let t = 0; t < 500 && !done; t++) {
        const DW = DIR.concat(
            DIR.filter(v => v[0] && v[1]),
            DIR.filter(v => v[0] && v[1])
          ),
          [dr, dc] = DW[Math.floor(Math.random() * DW.length)],
          r = Math.floor(Math.random() * n),
          c = Math.floor(Math.random() * n),
          cells = [];
        for (let i = 0; i < w.length; i++) {
          const R = r + dr * i,
            C = c + dc * i;
          if (R < 0 || R >= n || C < 0 || C >= n || (g[R * n + C] && g[R * n + C] != w[i])) {
            cells.length = 0;
            break;
          }
          cells.push(R * n + C);
        }
        if (cells.length == w.length) {
          cells.forEach((k, i) => (g[k] = w[i]));
          pl.push({ w, cells });
          done = true;
        }
      }
      if (!done) {
        all = false;
        break;
      }
    }
    if (all && (p.dirs || 8) == 8) {
      const dg = pl.filter(o => {
        const a = o.cells[0],
          b = o.cells[1];
        return Math.abs(b - a) != 1 && Math.abs(b - a) != n;
      });
      if (dg.length < 4 || dg.filter(o => o.cells[1] < o.cells[0]).length < 2) all = false;
    }
    if (all && p.egg) {
      egg = null;
      for (let t = 0; t < 900 && !egg; t++) {
        const [dr, dc] = DIR[Math.floor(Math.random() * DIR.length)],
          r = Math.floor(Math.random() * n),
          c = Math.floor(Math.random() * n),
          cells = [];
        for (let i = 0; i < 4; i++) {
          const R = r + dr * i,
            C = c + dc * i;
          if (R < 0 || R >= n || C < 0 || C >= n || (g[R * n + C] && g[R * n + C] != 'OEUF'[i])) {
            cells.length = 0;
            break;
          }
          cells.push(R * n + C);
        }
        if (cells.length == 4 && cells.some(k => !g[k])) {
          cells.forEach((k, i) => (g[k] = 'OEUF'[i]));
          egg = cells;
        }
      }
      if (!egg) all = false;
    }
    if (all) break;
  }
  const AB = 'AEIOUSNRTLECDMPGBV';
  g = g.map(x => x || AB[Math.floor(Math.random() * AB.length)]);
  G = { pl };
  const HC = [
    '#e0283f',
    '#21a35a',
    '#2d6fe0',
    '#e0a800',
    '#9b4fd1',
    '#ff4f9a',
    '#ff8a2a',
    '#14a3a3',
    '#8a5a33',
    '#5a8f2a',
    '#c0233a',
    '#3a7bd5'
  ];
  const found = [];
  let a = -1,
    b = -1,
    tapA = -1;
  const RSw = vTake('melee');
  if (RSw) {
    g = RSw.g;
    pl = RSw.pl;
    egg = RSw.egg;
    G.pl = pl;
    RSw.f.forEach(k => {
      if (pl[k]) found.push(pl[k]);
    });
  }
  const TMw = timer(RSw && RSw.left > 3 ? RSw.left : p.time, () => LOSE(`${found.length} mots trouvés sur ${p.words.length}`), id);
  G.save = () => ({ g, pl, egg, f: found.map(f => pl.indexOf(f)), left: Math.round(TMw.left()) });
  el.innerHTML = `<div class="wl" id="wl"></div><div class="melw" id="mw"><svg id="msv" viewBox="0 0 ${n} ${n}" preserveAspectRatio="none"></svg><div class="mel2" style="grid-template-columns:repeat(${n},1fr)">${g.map((ch, k) => `<span data-k="${k}">${ch}</span>`).join('')}</div></div><p class="center muted">Glisse le doigt de la première à la dernière lettre d'un mot (ou touche la première lettre puis la dernière).</p>`;
  const seg = (x, y) => {
    const r0 = Math.floor(x / n),
      c0 = x % n,
      r1 = Math.floor(y / n),
      c1 = y % n,
      dr = r1 - r0,
      dc = c1 - c0;
    if (!(dr == 0 || dc == 0 || Math.abs(dr) == Math.abs(dc))) return null;
    const L = Math.max(Math.abs(dr), Math.abs(dc));
    return Array.from({ length: L + 1 }, (_, i) => (r0 + Math.sign(dr) * i) * n + c0 + Math.sign(dc) * i);
  };
  const line = (cells, col, op) => {
    const f = cells[0],
      l = cells[cells.length - 1];
    return `<line x1="${(f % n) + 0.5}" y1="${Math.floor(f / n) + 0.5}" x2="${(l % n) + 0.5}" y2="${Math.floor(l / n) + 0.5}" stroke="${col}" stroke-opacity="${op}" stroke-width=".78" stroke-linecap="round"/>`;
  };
  const draw = () => {
    const cs = a >= 0 && b >= 0 ? seg(a, b) : null;
    $('#msv').innerHTML =
      found.map((f, i) => line(f.cells, HC[i % HC.length], 0.55)).join('') +
      (cs ? line(cs, '#c9971c', 0.8) : a >= 0 ? line([a], '#c9971c', 0.8) : '');
    if (p.theme) {
      $('#wl').innerHTML =
        `<div class="wlt">Thème : <b>${p.theme}</b> · Mots trouvés : <b>${found.length}</b> / ${p.words.length}</div>${found.map((f, i) => `<span class="fd" style="background:${HC[i % HC.length]}">${f.w}</span>`).join('')}`;
      return;
    }
    $('#wl').innerHTML = p.words
      .map(w => {
        const i = found.findIndex(f => f.w == w);
        return `<span class="${i >= 0 ? 'fd' : ''}" style="${i >= 0 ? `background:${HC[i % HC.length]}` : ''}">${w}</span>`;
      })
      .join('');
  };
  const M = $('#mw'),
    cellAt = e => {
      const r = M.getBoundingClientRect(),
        c = Math.floor(((e.clientX - r.left) / r.width) * n),
        w = Math.floor(((e.clientY - r.top) / r.height) * n);
      return c < 0 || c >= n || w < 0 || w >= n ? -1 : w * n + c;
    };
  const check = cells => {
    if (!cells || cells.length < 2) return;
    const s = cells.join();
    if (egg && (egg.join() == s || [...egg].reverse().join() == s)) {
      EGG(3);
      return;
    }
    const m = pl.find(o => !found.some(f => f.w == o.w) && (o.cells.join() == s || [...o.cells].reverse().join() == s));
    if (m) {
      found.push(m);
      toast('Trouvé : ' + m.w);
      if (found.length == p.words.length) {
        draw();
        return setTimeout(() => {
          if (id == RUN) win();
        }, 400);
      }
    } else toast(p.theme ? "Ce n'est pas un des mots cachés" : "Ce n'est pas un mot de la liste");
  };
  M.onpointerdown = e => {
    if (id != RUN) return;
    const x = cellAt(e);
    if (x < 0) return;
    e.preventDefault();
    try {
      M.setPointerCapture(e.pointerId);
    } catch (_) {}
    a = x;
    b = x;
    draw();
  };
  M.onpointermove = e => {
    if (a < 0) return;
    const x = cellAt(e);
    if (x >= 0 && seg(a, x)) {
      b = x;
      draw();
    }
  };
  M.onpointerup = () => {
    if (a < 0) return;
    const A = a,
      B = b;
    a = b = -1;
    if (A == B) {
      if (tapA >= 0 && tapA != A) {
        const c = seg(tapA, A);
        tapA = -1;
        if (c) check(c);
        else toast('Il faut une ligne droite');
      } else {
        tapA = A;
        a = A;
        b = A;
      }
    } else {
      tapA = -1;
      check(seg(A, B));
    }
    draw();
  };
  draw();
  G.hint = () => {
    if (id != RUN) return false;
    const m = pl.find(o => !found.includes(o));
    if (!m) return false;
    found.push(m);
    a = b = -1;
    draw();
    if (found.length == p.words.length)
      setTimeout(() => {
        if (id == RUN) win();
      }, 400);
    return true;
  };
};
