GAMES.picross = function (p, el, win, fail) {
  const id = RUN,
    RS = vTake('picross'),
    names = p.pics,
    nm0 = RS && LVD.pics[RS.nm] ? RS.nm : names[Math.floor(Math.random() * names.length)],
    PIC = LVD.pics[nm0],
    P = PIC.map(r => [...r].map(c => (c == '#' ? 1 : 0))),
    H = P.length,
    W = P[0].length,
    BK = W % 5 == 0 ? 5 : W % 4 == 0 ? 4 : 3;
  const clue = a => {
    const o = [];
    let k = 0;
    a.forEach(v => {
      if (v) k++;
      else if (k) {
        o.push(k);
        k = 0;
      }
    });
    if (k) o.push(k);
    return o.length ? o : [0];
  };
  const rc = P.map(clue),
    cc = [...Array(W).keys()].map(c => clue(P.map(r => r[c]))),
    st = P.map(r => r.map(() => 0));
  let err = 0,
    mode = 1,
    done = false,
    pe = 0;
  if (RS) {
    try {
      RS.st.forEach((row, r) =>
        row.forEach((v, c) => {
          if (st[r]) st[r][c] = v;
        })
      );
      err = RS.err || 0;
    } catch (_) {}
  }
  G = { P, st, save: () => ({ nm: nm0, st: st.map(r => [...r]), err }) };
  const LOSE = w => {
    done = true;
    fail(w, 1);
    try {
      P.forEach((row, r) => row.forEach((v, c) => (st[r][c] = v ? 1 : 0)));
      draw();
    } catch (e) {
      console.error(e);
    }
  };

  const isEgg = () => {
    const seen = new Set(),
      K = (r, c) => r * W + c;
    for (let r = 0; r < H; r++)
      for (let c = 0; c < W; c++) {
        if (st[r][c] != 3 || seen.has(K(r, c))) continue;
        const comp = [],
          q = [[r, c]];
        seen.add(K(r, c));
        while (q.length) {
          const [a, b] = q.pop();
          comp.push([a, b]);
          for (let da = -1; da <= 1; da++)
            for (let db = -1; db <= 1; db++) {
              const A = a + da,
                B = b + db;
              if (A < 0 || B < 0 || A >= H || B >= W || seen.has(K(A, B)) || st[A][B] != 3) continue;
              seen.add(K(A, B));
              q.push([A, B]);
            }
        }
        if (comp.length < 8) continue;
        const r0 = Math.min(...comp.map(x => x[0])),
          r1 = Math.max(...comp.map(x => x[0])),
          c0 = Math.min(...comp.map(x => x[1])),
          c1 = Math.max(...comp.map(x => x[1])),
          h = r1 - r0 + 1,
          w = c1 - c0 + 1;
        if (h < 4 || w < 3 || h <= w || h > w * 2.3) continue;
        const inC = new Set(comp.map(([a, b]) => K(a, b))),
          out = new Set(),
          f = [];
        for (let a = r0 - 1; a <= r1 + 1; a++)
          for (let b = c0 - 1; b <= c1 + 1; b++)
            if (a == r0 - 1 || a == r1 + 1 || b == c0 - 1 || b == c1 + 1) {
              out.add(a + ':' + b);
              f.push([a, b]);
            }
        while (f.length) {
          const [a, b] = f.pop();
          for (const [da, db] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
          ]) {
            const A = a + da,
              B = b + db;
            if (A < r0 || A > r1 || B < c0 || B > c1 || out.has(A + ':' + B) || inC.has(K(A, B))) continue;
            out.add(A + ':' + B);
            f.push([A, B]);
          }
        }
        let I = 0,
          U = 0;
        const cy = (r0 + r1) / 2,
          cx = (c0 + c1) / 2,
          ry = h / 2,
          rx = w / 2;
        for (let a = r0; a <= r1; a++)
          for (let b = c0; b <= c1; b++) {
            const inR = !out.has(a + ':' + b),
              inE = ((b - cx) / rx) ** 2 + ((a - cy) / ry) ** 2 <= 1.08;
            if (inR && inE) I++;
            if (inR || inE) U++;
          }
        const hollow = [...Array(h * w).keys()].some(k => {
          const a = r0 + Math.floor(k / w),
            b = c0 + (k % w);
          return !out.has(a + ':' + b) && !inC.has(K(a, b));
        });
        if (hollow && U && I / U >= 0.68) return true;
      }
    return false;
  };
  const draw = () => {
    el.innerHTML = `<p class="center">Vies : ${vHearts(err)}</p><div class="pcx2" style="grid-template-columns:auto repeat(${W},minmax(0,1fr))"><span></span>${cc.map(c => `<span class="ct">${c.join('<br>')}</span>`).join('')}${P.map((row, r) => `<span class="cl">${rc[r].map(v => `<i>${v}</i>`).join('')}</span>${row.map((_, c) => `<button data-r="${r}" data-c="${c}" class="${['', 'on', 'x', 'sk'][st[r][c]]} ${(c + 1) % BK == 0 && c < W - 1 ? 'bR' : ''} ${(r + 1) % BK == 0 && r < H - 1 ? 'bB' : ''}" aria-label="Case ${r + 1}-${c + 1}"></button>`).join('')}`).join('')}</div>
  <div class="row"><button class="sm ${mode == 1 ? '' : 'alt'}" id="m1">⬛ Remplir</button><button class="sm ${mode == 2 ? '' : 'alt'}" id="m2">✕ Vide</button><button class="sm ${mode == 3 ? '' : 'alt'}" id="m3">✏️ Esquisse</button></div>
  <div class="row"><button class="sm" id="pcv">✔ Valider la grille</button></div>`;
    {
      const X = el.querySelector('.pcx2'),
        cw = Math.max(...[...X.querySelectorAll('.cl')].map(e => e.scrollWidth)) + 2,
        av = Math.min(430, el.clientWidth) - 12 - cw - 2 * W,
        cs = Math.max(14, Math.floor(av / W));
      X.style.gridTemplateColumns = `${cw}px repeat(${W},${cs}px)`;
      X.style.gridAutoRows = 'auto';
      X.style.setProperty('--cs', cs + 'px');
      X.style.width = 'fit-content';
      if (done && !err) X.classList.add('won');
    }
    [1, 2, 3].forEach(
      k =>
        ($('#m' + k).onclick = () => {
          mode = k;
          draw();
        })
    );
    $('#pcv').onclick = check;
  };
  const setC = (r, c, v) => {
    if (st[r][c] == v) return;
    st[r][c] = v;
    const b = el.querySelector(`.pcx2 button[data-r="${r}"][data-c="${c}"]`);
    if (b) {
      b.classList.remove('on', 'x', 'sk');
      if (v) b.classList.add(['', 'on', 'x', 'sk'][v]);
    }
  };
  const check = () => {
    if (id != RUN || done) return;
    const ok =
      P.every((_, r) => clue(st[r].map(v => (v == 1 ? 1 : 0))).join() == rc[r].join()) &&
      cc.every((cl, c) => clue(st.map(row => (row[c] == 1 ? 1 : 0))).join() == cl.join());
    if (ok) {
      done = true;
      st.forEach(row =>
        row.forEach((v, c) => {
          if (v != 1) row[c] = 0;
        })
      );
      draw();
      el.querySelector('.pcx2').classList.add('won');
      {
        const NM = {
          loupe: 'une loupe 🔍',
          menottes: 'des menottes 🔗',
          badge: 'un insigne de police 🚓',
          renne: 'un renne 🦌',
          chalet: 'un chalet 🏠',
          bonnet: 'un bonnet de Noël 🧣',
          sapin: 'un sapin 🎄',
          coeur: 'un cœur ❤️',
          cloche: 'une cloche 🔔',
          etoile: 'une étoile ⭐',
          cadeau: 'un cadeau 🎁',
          bonhomme: 'un bonhomme de neige ⛄'
        }[nm0];
        if (NM) {
          const t = document.createElement('p');
          t.className = 'center pcname';
          t.innerHTML = `C'était <b>${NM}</b> !`;
          el.appendChild(t);
        }
      }
      return setTimeout(() => {
        if (id == RUN) win();
      }, 1600);
    }
    err++;
    const bad =
      P.filter((_, r) => clue(st[r].map(v => (v == 1 ? 1 : 0))).join() != rc[r].join()).length +
      cc.filter((cl, c) => clue(st.map(row => (row[c] == 1 ? 1 : 0))).join() != cl.join()).length;
    const r = hit();
    if (r == 0 || (r < 0 && err >= 3))
      return LOSE(
        r == 0
          ? window.CURPR
            ? 'la grille était fausse'
            : `la grille était encore fausse, plus d'essais`
          : `la grille était encore fausse après 3 validations`
      );
    draw();
    toast(`Pas encore… ${bad} ligne${bad > 1 ? 's ou colonnes ne collent' : ' ou colonne ne colle'} pas aux nombres${hitT(r)}`);
  };
  let drag = null;
  const cellOf = e => {
    const b = document.elementFromPoint(e.clientX, e.clientY),
      bt = b && b.closest && b.closest('.pcx2 button');
    return bt ? [+bt.dataset.r, +bt.dataset.c] : null;
  };
  const after = () => {
    if (mode == 3 && !pe && isEgg()) {
      pe = 1;
      EGG(10);
    }
  };
  el.onpointerdown = e => {
    const bt = e.target.closest && e.target.closest('.pcx2 button');
    if (!bt || id != RUN || done) return;
    e.preventDefault();
    const r = +bt.dataset.r,
      c = +bt.dataset.c,
      v = st[r][c] == mode ? 0 : mode;
    drag = { v, lr: r, lc: c };
    setC(r, c, v);
    after();
  };
  el.onpointermove = e => {
    if (!drag || id != RUN || done) return;
    const q = cellOf(e);
    if (!q) return;
    const [r, c] = q;
    if (r == drag.lr && c == drag.lc) return;
    let a = drag.lr,
      b = drag.lc;
    const n = Math.max(Math.abs(r - a), Math.abs(c - b));
    for (let k = 1; k <= n; k++) setC(Math.round(a + ((r - a) * k) / n), Math.round(b + ((c - b) * k) / n), drag.v);
    drag.lr = r;
    drag.lc = c;
    after();
  };
  el.onpointerup = el.onpointercancel = () => {
    drag = null;
  };
  draw();
  G.hint = () => {
    if (id != RUN || done) return false;
    const cand = [];
    P.forEach((row, r) =>
      row.forEach((v, c) => {
        if ((v && st[r][c] != 1) || (!v && st[r][c] == 1)) cand.push([r, c]);
      })
    );
    if (!cand.length) return 'Ta grille est juste : valide-la !';
    shuffle(cand)
      .slice(0, 4)
      .forEach(([r, c]) => setC(r, c, P[r][c] ? 1 : 2));
    return true;
  };
};
