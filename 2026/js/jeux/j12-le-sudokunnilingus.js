GAMES.sudoku = function (p, el, win, fail) {
  const LOSE = w => {
    fail(w, 1);
    try {
      sol.forEach((v, i) => (cells[i] = v));
      bad = new Set();
      sel = -1;
      draw();
    } catch (e) {
      console.error(e);
    }
  };
  const id = RUN,
    n = p.n,
    bh = p.bh,
    bw = p.bw,
    PH = CONTENU.photos || [],
    SY = p.digits
      ? Array.from({ length: n }, (_, i) => String(i + 1))
      : PH.length >= n
        ? shuffle(PH).slice(0, n)
        : shuffle(EMO).slice(0, n),
    FULL = (1 << n) - 1;
  const peers = [];
  for (let i = 0; i < n * n; i++) {
    const r = Math.floor(i / n),
      c = i % n,
      s = new Set();
    for (let k = 0; k < n; k++) {
      s.add(r * n + k);
      s.add(k * n + c);
    }
    const br = r - (r % bh),
      bc = c - (c % bw);
    for (let a = 0; a < bh; a++) for (let b = 0; b < bw; b++) s.add((br + a) * n + bc + b);
    s.delete(i);
    peers.push([...s]);
  }
  const pc = m => {
    let c = 0;
    while (m) {
      m &= m - 1;
      c++;
    }
    return c;
  };
  const solve = (g, lim, rnd) => {
    let cnt = 0,
      sol = null;
    const rec = () => {
      let best = -1,
        bm = 0,
        bc = 99;
      for (let i = 0; i < n * n; i++)
        if (g[i] < 0) {
          let m = FULL;
          for (const q of peers[i]) if (g[q] >= 0) m &= ~(1 << g[q]);
          const c = pc(m);
          if (c < bc) {
            bc = c;
            best = i;
            bm = m;
            if (c <= 1) break;
          }
        }
      if (best < 0) {
        cnt++;
        if (!sol) sol = [...g];
        return cnt >= lim;
      }
      if (!bc) return false;
      let vs = [];
      for (let v = 0; v < n; v++) if ((bm >> v) & 1) vs.push(v);
      if (rnd) vs = shuffle(vs);
      for (const v of vs) {
        g[best] = v;
        if (rec()) {
          g[best] = -1;
          return true;
        }
      }
      g[best] = -1;
      return false;
    };
    rec();
    return { cnt, sol };
  };
  const sol = solve(Array(n * n).fill(-1), 1, true).sol,
    cells = [...sol];
  let blanks = 0;
  for (const i of shuffle([...Array(n * n).keys()])) {
    if (blanks >= p.blanks) break;
    const v = cells[i];
    cells[i] = -1;
    if (solve([...cells], 2, false).cnt != 1) cells[i] = v;
    else blanks++;
  }
  const FIX = new Set(cells.map((v, i) => (v >= 0 ? i : -1)).filter(i => i >= 0));
  let sel = -1,
    err = 0,
    bad = new Set(),
    nm = false,
    sdE = 0;
  const NT = {},
    CHG = {};
  const RS = vTake('sudoku');
  if (RS && RS.sol && RS.sol.length == sol.length) {
    sol.splice(0, sol.length, ...RS.sol);
    cells.splice(0, cells.length, ...RS.cells);
    FIX.clear();
    RS.fix.forEach(i => FIX.add(i));
    if (RS.sy && RS.sy.length == SY.length) SY.splice(0, SY.length, ...RS.sy);
    Object.entries(RS.nt || {}).forEach(([k, a]) => (NT[k] = new Set(a)));
    err = RS.err || 0;
  }
  G = {
    sol,
    cells,
    check: () => check(),
    save: () => ({
      sol: [...sol],
      cells: [...cells],
      fix: [...FIX],
      sy: [...SY],
      nt: Object.fromEntries(Object.entries(NT).map(([k, v]) => [k, [...v]])),
      err
    })
  };
  const face = v => (v < 0 ? '' : String(SY[v]).startsWith('data:') ? `<img src="${SY[v]}" alt="">` : SY[v]);
  const cell = i =>
    `<button data-i="${i}" class="${FIX.has(i) ? 'fx' : 'us'} ${i == sel ? 'sel' : ''} ${bad.has(i) ? 'bad' : ''} ${sel >= 0 && cells[sel] >= 0 && cells[i] == cells[sel] ? 'same' : ''}" aria-label="Case ${i + 1}">${cells[i] < 0 && NT[i] && NT[i].size ? `<span class="sdn">${Array.from({ length: n }, (_, k) => `<i>${NT[i].has(k) ? SY[k] : ''}</i>`).join('')}</span>` : face(cells[i])}</button>`;
  const left = () => cells.filter(v => v < 0).length;
  const draw = () => {
    el.innerHTML = `<p class="center">Cases vides : ${left()} · Vies : ${vHearts(err)}</p>
  <div class="sdk" style="grid-template-columns:repeat(${n / bw},1fr)">${Array.from({ length: n }, (_, B) => {
    const R0 = Math.floor(B / (n / bw)) * bh,
      C0 = (B % (n / bw)) * bw;
    return `<div class="box" style="grid-template-columns:repeat(${bw},1fr)">${Array.from({ length: bh * bw }, (_, k) => cell((R0 + Math.floor(k / bw)) * n + C0 + (k % bw))).join('')}</div>`;
  }).join('')}</div>
  <div class="gfoot"><div class="pal" style="grid-template-columns:repeat(5,1fr)">${SY.map((_, k) => `<button data-k="${k}" aria-label="Chiffre ${k + 1}">${face(k)}</button>`).join('')}<button data-k="-1" class="alt" aria-label="Effacer">${nm ? '🧽' : '⌫'}</button></div>
  <div class="row"><button class="sm ${nm ? '' : 'alt'}" id="sdm">✏️ Annoter : ${nm ? 'ON' : 'OFF'}</button><button class="sm" id="sdv" ${left() ? 'disabled' : ''}>✔ Valider la grille</button></div></div>${bad.size ? `<p class="center" style="color:#ff8a9a">${bad.size} case${bad.size > 1 ? 's sont fausses' : ' est fausse'} (en rouge) : corrige-les puis valide à nouveau.</p>` : ''}`;
    el.querySelectorAll('.sdk button').forEach(
      b =>
        (b.onclick = () => {
          if (id != RUN) return;
          const i = +b.dataset.i;
          sel = sel == i ? -1 : i;
          draw();
        })
    );
    el.querySelectorAll('.pal button').forEach(
      b =>
        (b.onclick = () => {
          if (id != RUN) return;
          if (sel < 0) {
            toast("Choisis d'abord une case");
            return;
          }
          if (FIX.has(sel)) {
            toast('Cette case fait partie de la grille de départ');
            return;
          }
          const k = +b.dataset.k;
          if (nm) {
            if (cells[sel] >= 0 && k >= 0) {
              toast("Efface d'abord le chiffre de cette case");
              return;
            }
            if (k < 0) delete NT[sel];
            else {
              const S2 = (NT[sel] = NT[sel] || new Set());
              S2.has(k) ? S2.delete(k) : S2.add(k);
              if (S2.size == n && !sdE) {
                sdE = 1;
                EGG(12);
              }
            }
            return draw();
          }
          if (k >= 0 && cells[sel] != k) {
            CHG[sel] = (CHG[sel] || 0) + 1;
            if (CHG[sel] >= 20) ACH('sudokuI');
          }
          cells[sel] = k;
          bad.delete(sel);
          draw();
        })
    );
    $('#sdm').onclick = () => {
      nm = !nm;
      draw();
    };
    $('#sdv').onclick = () => check();
  };
  const check = () => {
    if (id != RUN || left()) return;
    bad = new Set(cells.map((v, i) => (v != sol[i] ? i : -1)).filter(i => i >= 0));
    sel = -1;
    if (!bad.size) {
      draw();
      return setTimeout(() => {
        if (id == RUN) win();
      }, 400);
    }
    err++;
    draw();
    const r = hit();
    if (r == 0 || (r < 0 && err >= 3))
      return setTimeout(() => {
        if (id == RUN) LOSE(`la grille était encore fausse (${bad.size} erreur${bad.size > 1 ? 's' : ''})`);
      }, 900);
    toast(`Pas encore… ${bad.size} erreur${bad.size > 1 ? 's' : ''}${hitT(r)}`);
  };
  draw();
  G.hint = () => {
    if (id != RUN) return false;
    let k = sel >= 0 && !FIX.has(sel) && cells[sel] != sol[sel] ? sel : -1;
    if (k < 0) {
      const c = [...Array(n * n).keys()].filter(i => !FIX.has(i) && cells[i] != sol[i]);
      if (!c.length) return 'La grille est déjà juste : valide-la !';
      k = c[Math.floor(Math.random() * c.length)];
    }
    cells[k] = sol[k];
    FIX.add(k);
    bad.delete(k);
    delete NT[k];
    sel = k;
    draw();
    return true;
  };
};
