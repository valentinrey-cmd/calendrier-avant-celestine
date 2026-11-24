GAMES.relier = function (p, el, win, fail) {
  const LOSE = w => {
    fail(w, 1);
    try {
      paths = segs.map(s => [...s]);
      draw();
    } catch (e) {
      console.error(e);
    }
  };
  const id = RUN,
    n = p.n,
    L = n * n,
    k = p.k;
  let P = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) P.push(r * n + (r % 2 ? n - 1 - c : c));
  const nb = x => {
    const r = Math.floor(x / n),
      c = x % n,
      o = [];
    if (r) o.push(x - n);
    if (r < n - 1) o.push(x + n);
    if (c) o.push(x - 1);
    if (c < n - 1) o.push(x + 1);
    return o;
  };
  for (let t = 0; t < L * 40; t++) {
    if (Math.random() < 0.5) P.reverse();
    const cand = nb(P[0]).filter(v => v != P[1]),
      v = cand[Math.floor(Math.random() * cand.length)],
      j = P.indexOf(v);
    P = [...P.slice(0, j).reverse(), ...P.slice(j)];
  }
  let cuts;
  do {
    cuts = shuffle([...Array(L - 1).keys()].map(x => x + 1))
      .slice(0, k - 1)
      .sort((a, b) => a - b);
  } while ([0, ...cuts, L].some((c, i, a) => i && c - a[i - 1] < 3));
  const RSl = vTake('relier'),
    segs = RSl ? RSl.segs : [0, ...cuts].map((c, i, a) => P.slice(c, i < a.length - 1 ? a[i + 1] : L)),
    COL = ['#e53950', '#2fae5b', '#3b7be8', '#f0c020', '#a259e6', '#ff8a2a', '#29c4c4', '#f06bd0'],
    dot = {};
  segs.forEach((s, i) => {
    dot[s[0]] = i;
    dot[s[s.length - 1]] = i;
  });
  let paths = RSl ? RSl.paths : segs.map(() => []),
    cur = -1,
    TMl = null;
  G = { segs, n, save: () => ({ segs, paths, left: TMl ? Math.round(TMl.left()) : p.time }) };
  const GH = -1;
  let gp = null,
    gl = null,
    rg = 0,
    eg21 = 0;
  const EGc = segs.map(sg => {
    const A = sg[0],
      B = sg[sg.length - 1],
      md = (x, y) => Math.abs(Math.floor(x / n) - Math.floor(y / n)) + Math.abs((x % n) - (y % n)),
      c = sg.slice(1, -1).filter((x, j) => sg.length < 5 || (j > 0 && j < sg.length - 3));
    if (!c.length) return -1;
    const sc = x => md(x, A) + md(x, B) - md(A, B) + Math.random() * 0.5;
    return c.reduce((m, x) => (sc(x) > sc(m) ? x : m), c[0]);
  });
  G.EGc = EGc;
  const owner = () => {
    const o = Array(L).fill(-1);
    paths.forEach((pa, i) => pa.forEach(x => (o[x] = i)));
    return o;
  };
  const linked = i => {
    const pa = paths[i];
    return pa.length > 1 && dot[pa[0]] == i && dot[pa[pa.length - 1]] == i;
  };
  el.innerHTML = `<p class="center" id="fl"></p><div class="flow" id="fw"><svg viewBox="0 0 ${n} ${n}" id="fsv"></svg></div>`;
  const draw = () => {
    let s = '';
    for (let i = 0; i <= n; i++) s += `<path d="M${i} 0V${n}M0 ${i}H${n}" stroke="#ffffff30" stroke-width=".03"/>`;
    EGc.forEach((ec, i) => {
      if (ec >= 0)
        s += `<ellipse cx="${(ec % n) + 0.5}" cy="${Math.floor(ec / n) + 0.52}" rx=".2" ry=".27" fill="${COL[i]}" opacity=".22"/>`;
    });
    paths.forEach((pa, i) => {
      pa.forEach(x => (s += `<rect x="${x % n}" y="${Math.floor(x / n)}" width="1" height="1" fill="${COL[i]}" opacity=".22"/>`));
      if (pa.length > 1)
        s += `<polyline points="${pa.map(x => `${(x % n) + 0.5},${Math.floor(x / n) + 0.5}`).join(' ')}" fill="none" stroke="${COL[i]}" stroke-width=".34" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
    EGc.forEach((ec, i) => {
      if (ec >= 0 && paths[i].includes(ec))
        s += `<ellipse cx="${(ec % n) + 0.5}" cy="${Math.floor(ec / n) + 0.52}" rx=".12" ry=".16" fill="#fff" opacity=".55"/>`;
    });
    Object.entries(dot).forEach(([x, i]) => {
      x = +x;
      s += `<circle cx="${(x % n) + 0.5}" cy="${Math.floor(x / n) + 0.5}" r=".34" fill="${COL[i]}" stroke="#fff" stroke-width=".04"/>`;
    });
    if (GH >= 0 && !rg)
      s += `<circle cx="${(GH % n) + 0.5}" cy="${Math.floor(GH / n) + 0.5}" r=".15" fill="#fff" stroke="#ffffff66" stroke-width=".06"/>`;
    {
      const gq = gp || gl;
      if (gq && gq.length > 1)
        s += `<polyline points="${gq.map(x => `${(x % n) + 0.5},${Math.floor(x / n) + 0.5}`).join(' ')}" fill="none" stroke="#fff" stroke-width=".2" stroke-dasharray=".22 .12" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
    $('#fsv').innerHTML = s;
    $('#fl').textContent =
      `Reliés : ${paths.filter((_, i) => linked(i)).length}/${k} · Cases remplies : ${Math.round((owner().filter(x => x >= 0).length / L) * 100)} %`;
  };
  const cellAt = e => {
    const r = $('#fsv').getBoundingClientRect(),
      c = Math.floor(((e.clientX - r.left) / r.width) * n),
      w = Math.floor(((e.clientY - r.top) / r.height) * n);
    return c < 0 || c >= n || w < 0 || w >= n ? -1 : w * n + c;
  };
  const ext = x => {
    const pa = paths[cur],
      last = pa[pa.length - 1];
    if (!nb(last).includes(x)) return false;
    const j = pa.indexOf(x);
    if (j >= 0) {
      paths[cur] = pa.slice(0, j + 1);
      return true;
    }
    if (linked(cur) || (dot[x] !== undefined && dot[x] != cur)) return false;
    const o = owner()[x];
    if (o >= 0) paths[o] = paths[o].slice(0, paths[o].indexOf(x));
    pa.push(x);
    return true;
  };
  const W = $('#fw');
  W.onpointerdown = e => {
    if (id != RUN) return;
    const x = cellAt(e);
    if (x < 0) return;
    e.preventDefault();
    try {
      W.setPointerCapture(e.pointerId);
    } catch (_) {}
    if (x == GH && !rg && owner()[x] < 0) {
      gp = [x];
      cur = -1;
      draw();
      return;
    }
    if (dot[x] !== undefined) {
      cur = dot[x];
      paths[cur] = [x];
    } else {
      const o = owner()[x];
      if (o < 0) return;
      cur = o;
      paths[o] = paths[o].slice(0, paths[o].indexOf(x) + 1);
    }
    draw();
  };
  W.onpointermove = e => {
    if (gp && id == RUN) {
      const x = cellAt(e);
      if (x < 0) return;
      const l = gp[gp.length - 1];
      if (x == l || !nb(l).includes(x)) return;
      if (x == GH && gp.length >= 4) {
        gl = [...gp, x];
        gp = null;
        rg = 1;
        EGG(21);
        draw();
        setTimeout(() => {
          gl = null;
          if (id == RUN) draw();
        }, 900);
        return;
      }
      if (gp.includes(x) || owner()[x] >= 0 || dot[x] !== undefined) return;
      gp.push(x);
      draw();
      return;
    }
    if (cur < 0 || id != RUN) return;
    const x = cellAt(e);
    if (x < 0) return;
    let g2 = 0;
    while (g2++ < 2 * n) {
      const pa = paths[cur],
        last = pa[pa.length - 1];
      if (last == x) break;
      const lr = Math.floor(last / n),
        lc = last % n,
        xr = Math.floor(x / n),
        xc = x % n;
      const st = Math.abs(xr - lr) >= Math.abs(xc - lc) ? last + Math.sign(xr - lr) * n : last + Math.sign(xc - lc);
      if (!ext(st)) break;
    }
    draw();
  };
  W.onpointerup = W.onpointercancel = () => {
    if (gp) {
      gp = null;
      draw();
      return;
    }
    if (cur < 0) return;
    cur = -1;
    if (!eg21 && paths.every((_, i) => linked(i) && (EGc[i] < 0 || paths[i].includes(EGc[i])))) {
      eg21 = 1;
      EGG(21);
    }
    if (paths.every((_, i) => linked(i))) {
      if (owner().every(x => x >= 0)) return win();
      toast('Presque ! Il faut aussi remplir toutes les cases 😉');
    }
  };
  TMl = timer(RSl && RSl.left > 3 ? RSl.left : p.time, () => LOSE('le temps est écoulé ⏱️'), id);
  draw();
  setTimeout(() => {
    allowScroll();
    W.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, 50);
  G.hint = () => {
    if (id != RUN) return false;
    const i2 = segs.findIndex((s, i) => !linked(i));
    if (i2 < 0) return 'Toutes les paires sont reliées : remplis les cases vides !';
    const sg = new Set(segs[i2]);
    paths = paths.map((pa, i) => {
      if (i == i2) return [...segs[i2]];
      const k = pa.findIndex(x => sg.has(x));
      return k < 0 ? pa : pa.slice(0, k);
    });
    cur = -1;
    draw();
    if (paths.every((_, i) => linked(i)) && owner().every(x => x >= 0))
      setTimeout(() => {
        if (id == RUN) win();
      }, 300);
    return true;
  };
};
