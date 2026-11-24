GAMES.arrows = function (p, el, win, fail) {
  const id = RUN,
    n = p.n,
    DV = [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1]
    ],
    COL = ['#f3c623', '#ff7ab6', '#14c8c8', '#ff8a2a', '#b77bff', '#3ddc84', '#5b8cff', '#ffd1e8', '#9be15d'];
  const inb = (r, c) => r >= 0 && r < n && c >= 0 && c < n,
    nb = i => {
      const r = Math.floor(i / n),
        c = i % n;
      return DV.filter(([a, b]) => inb(r + a, c + b)).map(([a, b]) => (r + a) * n + c + b);
    };
  const rayO = (own, h, d) => {
    const o = [];
    let r = Math.floor(h / n) + DV[d][0],
      c = (h % n) + DV[d][1];
    while (inb(r, c)) {
      o.push(r * n + c);
      r += DV[d][0];
      c += DV[d][1];
    }
    return o;
  };
  function gen() {
    const own = Array(n * n).fill(-1),
      AR = [];
    for (let t = 0; t < 20000; t++) {
      const em = [];
      own.forEach((v, i) => {
        if (v < 0) em.push(i);
      });
      if (!em.length) break;
      const h = em[Math.floor(Math.random() * em.length)];
      const ds = shuffle([0, 1, 2, 3]).filter(d => rayO(own, h, d).every(x => own[x] < 0));
      if (!ds.length) continue;
      const d = ds[0],
        ry = new Set(rayO(own, h, d)),
        L = p.min + Math.floor(Math.random() * (p.max - p.min + 1)),
        body = [h];
      const fl = Math.random() < p.rot;
      let cu = h;
      if (!fl)
        for (let k = 1; k < L; k++) {
          const op = nb(cu).filter(x => own[x] < 0 && !body.includes(x) && !ry.has(x));
          if (!op.length) break;
          const nx = op[Math.floor(Math.random() * op.length)];
          body.push(nx);
          cu = nx;
        }
      if (body.length < 2 && !fl && t < 16000) continue;
      AR.push({ d, d0: d, cells: body, c: COL[AR.length % COL.length], gone: false, rot: fl ? 1 : 0, rt: d });
      body.forEach(x => (own[x] = AR.length - 1));
    }
    // pièges : flèches tournantes et bombes
    const early = [...AR.keys()]
      .reverse()
      .slice(1, Math.max(4, Math.floor(AR.length * 0.45)))
      .filter(k => !AR[k].rot);
    shuffle(early)
      .slice(0, p.bombs)
      .forEach(k => (AR[k].bomb = 1));
    return { own, AR };
  }
  const FL = a => {
    a.d = (a.d + 1) % 4;
    a.rt++;
  };
  // vérifie qu'une partie est faisable (recherche aléatoire) et règle le compte à rebours des bombes
  function solve(B) {
    for (let tr = 0; tr < 250; tr++) {
      const own = [...B.own],
        A = B.AR.map(a => ({ ...a, cells: [...a.cells] })),
        bt = {};
      A.forEach((a, k) => {
        if (a.bomb) bt[k] = 0;
      });
      let mv = 0,
        ok = true;
      while (A.some(a => !a.gone)) {
        const fr = A.map((a, k) => k).filter(k => !A[k].gone && rayO(own, A[k].cells[0], A[k].d).every(x => own[x] < 0));
        if (!fr.length) {
          ok = false;
          break;
        }
        const bf = fr.filter(k => A[k].bomb),
          k = bf.length && Math.random() < 0.7 ? bf[0] : fr[Math.floor(Math.random() * fr.length)];
        A[k].gone = true;
        A[k].cells.forEach(x => (own[x] = -1));
        mv++;
        if (A[k].bomb) bt[k] = mv;
        A.forEach(a => {
          if (a.rot && !a.gone) FL(a);
        });
      }
      if (ok) return bt;
    }
    return null;
  }
  let B, bt;
  for (let g2 = 0; g2 < 40; g2++) {
    B = gen();
    bt = solve(B);
    if (bt) break;
  }
  if (!bt) {
    B.AR.forEach(a => {
      a.rot = 0;
      a.bomb = 0;
    });
    bt = {};
  }
  const own = B.own,
    AR = B.AR;
  AR.forEach((a, k) => {
    if (a.bomb) a.cd = bt[k] + p.slack;
  });
  let EGA = -1;
  {
    const ls = new Set();
    for (let tr = 0; tr < 300; tr++) {
      const o = [...own],
        A = AR.map(a => ({ ...a, cells: [...a.cells] }));
      let ok = true,
        lk = -1;
      while (A.some(a => !a.gone)) {
        const fr = A.map((a, k) => k).filter(k => !A[k].gone && rayO(o, A[k].cells[0], A[k].d).every(x => o[x] < 0));
        if (!fr.length) {
          ok = false;
          break;
        }
        const bf = fr.filter(k => A[k].bomb).sort((x, y) => A[x].cd - A[y].cd),
          k = bf.length && Math.random() < 0.7 ? bf[0] : fr[Math.floor(Math.random() * fr.length)];
        lk = k;
        A[k].gone = true;
        A[k].cells.forEach(x => (o[x] = -1));
        A.forEach(a => {
          if (a.gone) return;
          if (a.rot) FL(a);
          if (a.bomb) a.cd--;
        });
        if (A.some(a => a.bomb && !a.gone && a.cd <= 0)) {
          ok = false;
          break;
        }
      }
      if (ok && lk >= 0 && !AR[lk].bomb && AR[lk].cells.length > 1) ls.add(lk);
    }
    const mid = (n - 1) / 2,
      dist = k => Math.min(...AR[k].cells.map(c => Math.hypot(Math.floor(c / n) - mid, (c % n) - mid)));
    const cd = [...ls].sort((a, b) => dist(a) - dist(b));
    EGA = cd.length ? cd[0] : -1;
  }
  let err = 0,
    busy = 0,
    moves = 0;
  const total = AR.length;
  G = { n, left: () => AR.filter(a => !a.gone).length };
  const ray = (h, d) => rayO(own, h, d),
    blk = k => {
      const a = AR[k],
        r = ray(a.cells[0], a.d);
      for (let i = 0; i < r.length; i++) if (own[r[i]] >= 0) return i + 1;
      return 0;
    };
  timer(p.time, () => fail(`le temps est écoulé ⏱️ (${AR.filter(a => !a.gone).length} flèches restantes)`), id);
  const ctr = i => [(i % n) + 0.5, Math.floor(i / n) + 0.5];
  const pathOf = a => {
    const pts = [...a.cells].reverse().map(ctr),
      [hx, hy] = ctr(a.cells[0]),
      ext = n + a.cells.length + 2,
      ex = [hx + DV[a.d][1] * ext, hy + DV[a.d][0] * ext],
      L = a.cells.length - 1;
    return { d: `M${pts.map(q => q.join(' ')).join(' L')} L${ex.join(' ')}`, da: `${Math.max(0.001, L)} ${ext + L + 4}` };
  };
  const svg = AR.map((a, k) => {
    const P = pathOf(a),
      [hx, hy] = ctr(a.cells[0]),
      m = a.cells[Math.floor(a.cells.length / 2)],
      [mx, my] = ctr(m);
    return `<g class="ag ${a.rot ? 'rotr' : ''}" data-a="${k}" style="--c:${a.c}"><path class="ab" d="${P.d}" stroke-dasharray="${P.da}" stroke-dashoffset="0"/><g class="ah" transform="translate(${hx} ${hy})">${a.rot ? '<circle class="rdisc" r=".44"/><path class="rarc" d="M.3 -.33 A.45 .45 0 0 1 .44 .1"/><path class="rarh" d="M.44 .22 L.33 .04 L.55 .05Z"/>' : ''}<path class="hd" d="${a.rot ? 'M0 -.3 L.24 .1 L-.24 .1Z' : 'M0 -.46 L.4 .06 L-.4 .06Z'}" transform="rotate(${a.d * 90})"/></g>${a.bomb ? `<g class="abomb" transform="translate(${mx} ${my})"><circle r=".42"/><text y=".03">${a.cd}</text></g>` : ''}</g>`;
  }).join('');
  el.innerHTML = `<p class="center" id="arl"></p><div class="arw2 arsp" id="arw"><svg viewBox="-.15 -.15 ${n + 0.3} ${n + 0.3}" id="asv"><g id="arot"><g class="adots">${Array.from({ length: n * n }, (_, i) => `<circle cx="${(i % n) + 0.5}" cy="${Math.floor(i / n) + 0.5}" r=".06"/>`).join('')}</g>${
    EGA >= 0
      ? (() => {
          const a = AR[EGA],
            m = a.cells[Math.floor(a.cells.length / 2)];
          return `<image class="aegg" href="${eggSrc(9)}" x="${(m % n) + 0.1}" y="${Math.floor(m / n) + 0.1}" width=".8" height=".8"/>`;
        })()
      : ''
  }${svg}</g></svg></div>
  <div class="aleg"><span><i class="lr">↻</i>flèche dans un rond : tourne d'un quart de tour (sens des aiguilles d'une montre) à chaque flèche qui part</span><span><i class="lb">5</i>💣 bombe : à faire partir avant la fin du compte à rebours</span></div>`;
  const S = $('#asv');
  const lab = () =>
    ($('#arl').innerHTML =
      `Flèches : <b>${AR.filter(a => !a.gone).length}</b> / ${total} · Erreurs : ${'❌'.repeat(err)}${'▫️'.repeat(Math.max(0, p.err - err))}`);
  lab();
  const refresh = k => {
    const a = AR[k],
      g = S.querySelector(`[data-a="${k}"]`);
    if (!g) return;
    const P = pathOf(a),
      ab = g.querySelector('.ab'),
      hp = g.querySelector('.ah path');
    ab.setAttribute('d', P.d);
    ab.setAttribute('stroke-dasharray', P.da);
    if (a.rot) {
      const hd = g.querySelector('.ah .hd');
      hd.animate([{ transform: `rotate(${(a.rt - 1) * 90}deg)` }, { transform: `rotate(${a.rt * 90}deg)` }], {
        duration: 280,
        easing: 'ease-out'
      });
      hd.setAttribute('transform', `rotate(${a.d * 90})`);
    }
    const bb = g.querySelector('.abomb text');
    if (bb) {
      bb.textContent = a.cd;
      g.querySelector('.abomb').classList.toggle('hot', a.cd <= 2);
    }
  };
  const anim = (k, D, back, dur) => {
    const g = S.querySelector(`[data-a="${k}"]`),
      a = AR[k],
      ab = g.querySelector('.ab'),
      ah = g.querySelector('.ah'),
      [hx, hy] = ctr(a.cells[0]),
      dx = DV[a.d][1],
      dy = DV[a.d][0];
    const kf = back ? [0, -D, 0] : [0, -D],
      tk = back ? [0, D, 0] : [0, D],
      o = back ? { duration: dur, easing: 'ease-in-out' } : { duration: dur, easing: 'cubic-bezier(.45,0,.85,.55)' };
    ab.animate(
      kf.map(v => ({ strokeDashoffset: v })),
      o
    );
    return ah.animate(
      tk.map(v => ({ transform: `translate(${hx + dx * v}px,${hy + dy * v}px)` })),
      o
    );
  };
  let ANG = 0;
  {
    let lt = performance.now();
    const W0 = $('#arw'),
      spin = now => {
        if (id != RUN) return;
        ANG = (ANG + ((now - lt) * (fastSpin() ? 540 : p.spin || 4)) / 1000) % 360;
        lt = now;
        W0.style.transform = `rotate(${ANG.toFixed(2)}deg)`;
        requestAnimationFrame(spin);
      };
    requestAnimationFrame(spin);
  }
  S.onclick = e => {
    if (id != RUN || busy) return;
    const R0 = $('#arw').getBoundingClientRect(),
      a0 = (-ANG * Math.PI) / 180,
      dx0 = (e.clientX - (R0.left + R0.width / 2)) / TKX(),
      dy0 = (e.clientY - (R0.top + R0.height / 2)) / TKX(),
      ux = dx0 * Math.cos(a0) - dy0 * Math.sin(a0),
      uy = dx0 * Math.sin(a0) + dy0 * Math.cos(a0),
      sw = S.clientWidth,
      sh = S.clientHeight,
      c = Math.floor(((ux + sw / 2) / sw) * (n + 0.3) - 0.15),
      rr = Math.floor(((uy + sh / 2) / sh) * (n + 0.3) - 0.15);
    if (!inb(rr, c)) return;
    const k = own[rr * n + c];
    if (k < 0) return;
    const a = AR[k],
      b = blk(k),
      g = S.querySelector(`[data-a="${k}"]`);
    if (!b) {
      a.gone = true;
      moves++;
      a.cells.forEach(x2 => (own[x2] = -1));
      lab();
      if (k == EGA) {
        const eg = S.querySelector('.aegg');
        if (AR.every(q => q.gone)) {
          EGG(9);
          if (eg) eg.animate([{ opacity: 1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: 1400, fill: 'forwards' });
        } else if (eg) eg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 300, fill: 'forwards' });
      }
      const D = ray(a.cells[0], a.d).length + a.cells.length + 1;
      g.classList.add('go');
      anim(k, D, false, Math.max(320, D * 55)).onfinish = () => g.remove();
      if (AR.every(q => q.gone)) {
        busy = 1;
        setTimeout(() => {
          if (id == RUN) win();
        }, 600);
        return;
      }
      busy = 1;
      setTimeout(() => {
        busy = 0;
        if (id != RUN) return;
        AR.forEach((q, j) => {
          if (q.gone) return;
          if (q.rot) FL(q);
          if (q.bomb) q.cd--;
          refresh(j);
        });
        if (!AR.some((q, j) => !q.gone && !blk(j))) {
          busy = 1;
          setTimeout(() => {
            if (id == RUN) fail("plus aucune flèche ne peut s'envoler : mauvais ordre 🔁");
          }, 500);
          return;
        }
        const bo = AR.findIndex(q => q.bomb && !q.gone && q.cd <= 0);
        if (bo >= 0) {
          const bg = S.querySelector(`[data-a="${bo}"]`);
          if (bg) bg.classList.add('boom');
          try {
            SFX('burn');
          } catch (_) {}
          busy = 1;
          setTimeout(() => {
            if (id == RUN) fail('une bombe a explosé 💣');
          }, 700);
        }
      }, 260);
      return;
    }
    err++;
    lab();
    busy = 1;
    g.classList.add('bad');
    const ob = own[ray(a.cells[0], a.d)[b - 1]],
      og = S.querySelector(`[data-a="${ob}"]`);
    setTimeout(() => {
      if (og) {
        og.classList.add('hitb');
        setTimeout(() => og.classList.remove('hitb'), 350);
      }
    }, 180);
    anim(k, b - 1 + 0.32, true, Math.max(380, (b + 1) * 90)).onfinish = () => {
      busy = 0;
      g.classList.remove('bad');
      if (err >= p.err && id == RUN) fail(p.err > 1 ? `${p.err} flèches bloquées` : 'une flèche bloquée : pas le droit à l’erreur');
    };
  };
  G.hint = () => {
    if (id != RUN || busy) return false;
    let best = -1;
    for (let tr = 0; tr < 500 && best < 0; tr++) {
      const o = [...own],
        A = AR.map(a => ({ ...a, cells: [...a.cells] }));
      let first = -1,
        ok = true;
      while (A.some(a => !a.gone)) {
        const fr = A.map((a, k) => k).filter(k => !A[k].gone && rayO(o, A[k].cells[0], A[k].d).every(x => o[x] < 0));
        if (!fr.length) {
          ok = false;
          break;
        }
        const bf = fr.filter(k => A[k].bomb).sort((x, y) => A[x].cd - A[y].cd),
          k = bf.length && Math.random() < 0.7 ? bf[0] : fr[Math.floor(Math.random() * fr.length)];
        if (first < 0) first = k;
        A[k].gone = true;
        A[k].cells.forEach(x => (o[x] = -1));
        A.forEach(a => {
          if (a.gone) return;
          if (a.rot) FL(a);
          if (a.bomb) a.cd--;
        });
        if (A.some(a => a.bomb && !a.gone && a.cd <= 0)) {
          ok = false;
          break;
        }
      }
      if (ok) best = first;
    }
    if (best < 0) return 'Je ne trouve plus de solution sûre… le mauvais ordre a peut-être déjà été joué';
    const g = S.querySelector(`[data-a="${best}"]`);
    if (g) {
      g.classList.add('ahint');
      setTimeout(() => g.classList.remove('ahint'), 4000);
    }
    return true;
  };
};
