GAMES.zip = function (p, el, win, fail) {
  const LOSE = w => {
    fail(w, 1);
    try {
      path = [...P];
      draw();
    } catch (e) {
      console.error(e);
    }
  };
  const id = RUN,
    n = p.n,
    L = n * n;
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
  for (let t = 0; t < L * 60; t++) {
    if (Math.random() < 0.5) P.reverse();
    const cand = nb(P[0]).filter(v => v != P[1]),
      v = cand[Math.floor(Math.random() * cand.length)],
      j = P.indexOf(v);
    P = [...P.slice(0, j).reverse(), ...P.slice(j)];
  }
  const idx = [0, L - 1, ...shuffle([...Array(L - 2).keys()].map(x => x + 1)).slice(0, p.k - 2)].sort((a, b) => a - b),
    num = {};
  idx.forEach((k, i) => (num[P[k]] = i + 1));
  const RSz = vTake('zip');
  if (RSz) {
    P = RSz.P;
    Object.keys(num).forEach(k => delete num[k]);
    Object.assign(num, RSz.num);
  }
  let TMz = null;
  G = { P, n, save: () => ({ P, num, path, rev, left: TMz ? Math.round(TMz.left()) : p.time }) };
  let path = RSz ? RSz.path : [],
    drag = false,
    rev = RSz ? RSz.rev : false;
  TMz = timer(RSz && RSz.left > 3 ? RSz.left : p.time, () => LOSE('le temps est écoulé ⏱️'), id);
  el.innerHTML = `<p class="center" id="zl"></p><div class="flow zipb" id="zw"><svg viewBox="0 0 ${n} ${n}" id="zsv"></svg></div><p class="center muted">Pars du 1 et trace un seul chemin qui passe par <b>toutes</b> les cases, en suivant les numéros dans l'ordre.</p>`;
  const nextNum = () => (rev ? p.k - path.filter(x => num[x]).length : path.filter(x => num[x]).length + 1);
  const ZC = ['#f3c623', '#ff7ab6', '#e0283f', '#2d6fe0', '#21a35a', '#9b4fd1', '#ff8a2a', '#14c8c8', '#ffffff', '#c9971c'];
  let lastHit = 0;
  const draw = () => {
    const hit = path.filter(x => num[x]).length,
      zc = ZC[Math.max(0, hit - 1) % ZC.length];
    if (hit > lastHit && hit > 1) {
      const w = $('#zw');
      w.classList.remove('zflash');
      void w.offsetWidth;
      w.classList.add('zflash');
    }
    lastHit = hit;
    let s = '';
    for (let i = 0; i <= n; i++) s += `<path d="M${i} 0V${n}M0 ${i}H${n}" stroke="#ffffff22" stroke-width=".03"/>`;
    path.forEach(x => (s += `<rect x="${x % n}" y="${Math.floor(x / n)}" width="1" height="1" fill="${zc}" opacity=".22"/>`));
    if (path.length > 1)
      s += `<polyline points="${path.map(x => `${(x % n) + 0.5},${Math.floor(x / n) + 0.5}`).join(' ')}" fill="none" stroke="${zc}" stroke-width=".42" stroke-linecap="round" stroke-linejoin="round"/>`;
    Object.entries(num).forEach(([x, k]) => {
      x = +x;
      s += `<circle cx="${(x % n) + 0.5}" cy="${Math.floor(x / n) + 0.5}" r=".34" fill="#111" stroke="${path.includes(x) ? zc : '#fff'}" stroke-width=".05"/><text x="${(x % n) + 0.5}" y="${Math.floor(x / n) + 0.62}" text-anchor="middle" font-size=".36" font-weight="800" fill="#fff">${k}</text>`;
    });
    $('#zsv').innerHTML = s;
    $('#zl').textContent = `Cases : ${path.length}/${L} · prochain numéro : ${Math.max(1, Math.min(nextNum(), p.k))}`;
  };
  const cellAt = e => {
    const r = $('#zsv').getBoundingClientRect(),
      c = Math.floor(((e.clientX - r.left) / r.width) * n),
      w = Math.floor(((e.clientY - r.top) / r.height) * n);
    return c < 0 || c >= n || w < 0 || w >= n ? -1 : w * n + c;
  };
  const ext = x => {
    const last = path[path.length - 1];
    if (!nb(last).includes(x)) return false;
    const j = path.indexOf(x);
    if (j >= 0) {
      path = path.slice(0, j + 1);
      return true;
    }
    if (num[x] && num[x] != nextNum()) return false;
    path.push(x);
    return true;
  };
  const W = $('#zw');
  W.onpointerdown = e => {
    if (id != RUN) return;
    const x = cellAt(e);
    if (x < 0) return;
    e.preventDefault();
    try {
      W.setPointerCapture(e.pointerId);
    } catch (_) {}
    if (num[x] == 1) {
      path = [x];
      rev = false;
    } else if (num[x] == p.k && (!path.includes(x) || path[0] == x)) {
      path = [x];
      rev = true;
    } else {
      const j = path.indexOf(x);
      if (j < 0) return;
      path = path.slice(0, j + 1);
    }
    drag = true;
    draw();
  };
  W.onpointermove = e => {
    if (!drag || id != RUN) return;
    const x = cellAt(e);
    if (x < 0) return;
    let g2 = 0;
    while (g2++ < 2 * n) {
      const last = path[path.length - 1];
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
    if (!drag) return;
    drag = false;
    if (path.length == L && num[path[L - 1]] == (rev ? 1 : p.k)) {
      if (rev) {
        EGG(7);
        try {
          navigator.vibrate && navigator.vibrate([90, 50, 90, 50, 160]);
        } catch (_) {}
        const zb = $('#zsv');
        if (zb && zb.animate)
          zb.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(-9px) rotate(-1.5deg)' },
              { transform: 'translateX(9px) rotate(1.5deg)' },
              { transform: 'translateX(-7px)' },
              { transform: 'translateX(6px)' },
              { transform: 'translateX(-3px)' },
              { transform: 'translateX(0)' }
            ],
            { duration: 600 }
          );
        try {
          SFX('bad');
        } catch (_) {}
        toast('Dans le mauvais sens, ça ne compte pas !');
        setTimeout(() => {
          if (id != RUN) return;
          path = [];
          rev = false;
          draw();
        }, 650);
      } else
        setTimeout(() => {
          if (id == RUN) win();
        }, 300);
    } else if (path.length == L) toast('Il faut finir sur le dernier numéro');
  };
  draw();
  G.hint = () => {
    if (id != RUN) return false;
    if (rev) {
      rev = false;
      path = [];
    }
    let k = 0;
    while (k < path.length && path[k] == P[k]) k++;
    let e = k;
    while (e < L && !num[P[e]]) e++;
    if (e >= L) e = L - 1;
    path = P.slice(0, e + 1);
    drag = false;
    draw();
    if (path.length == L)
      setTimeout(() => {
        if (id == RUN) win();
      }, 300);
    return true;
  };
};
