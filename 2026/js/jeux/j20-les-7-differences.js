GAMES.spot = function (p, el, win, fail) {
  const RSs = vTake('spot'),
    id = RUN,
    A = window[p.a],
    B = window[p.b],
    D = p.d,
    found = new Set();
  let err = 0,
    eg2 = 0,
    ep;
  do {
    ep = [0.08 + Math.random() * 0.84, 0.1 + Math.random() * 0.8];
  } while (D.some(([dx, dy, r]) => Math.hypot(ep[0] - dx, ep[1] - dy) < r + 0.09));
  G = { D, save: () => ({ f: [...found], err, left: Math.round(T.left()) }) };
  if (RSs) {
    RSs.f.forEach(j => found.add(j));
    err = RSs.err || 0;
  }
  const t0p = Date.now(),
    T = timer(RSs && RSs.left > 3 ? RSs.left : p.time, () => fail(`${found.size} différences trouvées sur ${D.length}`), id);
  el.innerHTML = `<p class="center" id="spl"></p><div class="spw"><div class="spi" data-s="0"><img src="${A}" alt="Photo originale"><svg viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div><div class="spi" data-s="1"><img src="${B}" alt="Photo modifiée"><span class="speg" style="left:${ep[0] * 100}%;top:${ep[1] * 100}%">${eggH(20)}</span><svg viewBox="0 0 100 100" preserveAspectRatio="none"></svg></div></div><p class="center muted">Touche une différence sur l'une des deux photos. Une erreur coûte 10 secondes, et 5 erreurs font perdre l'essai.</p>`;
  const ar = () => {
    const im = el.querySelector('.spi img');
    return im.naturalWidth ? im.naturalHeight / im.naturalWidth : 0.58;
  };
  const lab = () =>
    ($('#spl').innerHTML =
      `Différences : <b>${found.size}</b> / ${D.length} · Erreurs : ${'❌'.repeat(err)}${'▫️'.repeat(Math.max(0, 5 - err))}`);
  lab();
  const mark = () =>
    el.querySelectorAll('.spi svg').forEach(s => {
      const k = ar();
      s.innerHTML =
        [...found]
          .map(j => {
            const [x, y, r] = D[j];
            return `<ellipse cx="${x * 100}" cy="${y * 100}" rx="${r * 100 + 2}" ry="${(r / k) * 100 + 2}" class="spc"/>`;
          })
          .join('') + (eg2 ? `<ellipse cx="${ep[0] * 100}" cy="${ep[1] * 100}" rx="4.5" ry="${4.5 / k}" class="spc"/>` : '');
    });
  el.querySelectorAll('.spi').forEach(
    w =>
      (w.onclick = e => {
        if (id != RUN) return;
        const r = w.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height,
          k = r.height / r.width;
        if (!eg2 && Math.hypot(x - ep[0], (y - ep[1]) * k) <= 0.05) {
          eg2 = 1;
          mark();
          EGG(20);
          return;
        }
        let hit = -1;
        D.forEach(([dx, dy, rr], j) => {
          if (found.has(j)) return;
          const ex = x - dx,
            ey = (y - dy) * k;
          if (Math.hypot(ex, ey) <= rr * 1.25 + 0.02) hit = j;
        });
        if (hit >= 0) {
          found.add(hit);
          mark();
          lab();
          if (found.size == D.length && err >= 4) ACH('spotM');
          if (found.size == D.length && Date.now() - t0p < 40000) ACH('spotFast');
          if (found.size == D.length)
            return setTimeout(() => {
              if (id == RUN) win();
            }, 500);
          toast('Bien vu !');
          return;
        }
        if (D.some(([dx, dy, rr], j) => found.has(j) && Math.hypot(x - dx, (y - dy) * k) <= rr * 1.25 + 0.02)) return;
        err++;
        T.add(-10);
        lab();
        const m = document.createElement('i');
        m.className = 'spx';
        m.style.left = x * 100 + '%';
        m.style.top = y * 100 + '%';
        w.appendChild(m);
        setTimeout(() => m.remove(), 700);
        toast('Non ! −10 s');
        if (err >= 5) fail('5 erreurs');
      })
  );
  if (RSs)
    setTimeout(() => {
      if (id == RUN)
        try {
          mark();
        } catch (_) {}
    }, 80);
  G.hint = () => {
    if (id != RUN) return false;
    const j = D.findIndex((_, k) => !found.has(k));
    if (j < 0) return false;
    found.add(j);
    mark();
    lab();
    if (found.size == D.length)
      setTimeout(() => {
        if (id == RUN) win();
      }, 500);
    return true;
  };
};
