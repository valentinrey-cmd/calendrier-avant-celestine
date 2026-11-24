GAMES.fleche = function (p, el, win, fail) {
  const id = RUN,
    F = FLECHE,
    H = F.h,
    Wd = F.w,
    sol = {},
    clue = {};
  F.words.forEach((o, wi) => {
    const [dr, dc] = o.d == 'A' ? [0, 1] : [1, 0];
    o.cells = [...o.w].map((ch, i) => {
      const k = (o.r + dr * i) * Wd + o.c + dc * i;
      sol[k] = ch;
      return k;
    });
    const ck = (o.r - dr) * Wd + o.c - dc;
    (clue[ck] = clue[ck] || []).push(wi);
  });
  const val = {},
    bad = new Set(),
    okc = new Set(),
    ks = Object.keys(sol);
  let sel = 0,
    pos = 0,
    err = 0,
    tb = '',
    fe = 0,
    TM = null;
  const LV = 3;
  const RS = vTake('fleche');
  if (RS) {
    Object.assign(val, RS.val || {});
    (RS.okc || []).forEach(k => okc.add(k));
    sel = RS.sel || 0;
    err = RS.err || 0;
  }
  G = {
    words: F.words,
    clue,
    get sel() {
      return sel;
    },
    save: () => ({ val: { ...val }, okc: [...okc], sel, err, left: TM ? Math.round(TM.left()) : p.time })
  };
  const tOut = () => {
    if (id != RUN) return;
    err++;
    try {
      SFX('bad');
    } catch (_) {}
    const r = hit();
    if (r == 0 || (r < 0 && err >= LV))
      return fail(r == 0 ? (window.CURPR ? 'le temps est écoulé ⏱️' : "plus d'essais 💔") : 'plus de vies 💔');
    toast(r < 0 ? '⏱️ Temps écoulé : une vie en moins, +20 secondes' : `⏱️ Temps écoulé : +20 secondes${hitT(r)}`);
    draw();
    TM = timer(20, tOut, id);
  };
  TM = timer(RS && RS.left > 5 ? RS.left : p.time, tOut, id);
  const chk = () => {
    F.words.forEach(o => {
      if (o.cells.every(k => okc.has(k) || val[k] == sol[k]) && o.cells.some(k => okc.has(k)) && o.cells.every(k => val[k] == sol[k]))
        o.cells.forEach(k => okc.add(k));
    });
  };
  const vW = () => {
    if (id != RUN) return;
    const w = F.words[sel];
    if (w.cells.every(k => okc.has(k))) return toast('Ce mot est déjà validé');
    if (!w.cells.every(k => val[k])) return toast('Remplis tout le mot avant de valider');
    if (w.cells.every(k => val[k] == sol[k])) {
      w.cells.forEach(k => {
        okc.add(k);
        bad.delete(k);
      });
      chk();
      try {
        SFX('ok');
      } catch (_) {}
      toast('✅ Mot validé !');
      if (ks.every(k => val[k] == sol[k])) {
        K.blur();
        return win();
      }
      const nx = F.words.findIndex(o => !o.cells.every(k => okc.has(k)));
      if (nx >= 0) {
        sel = nx;
        pos = 0;
      }
      return draw();
    }
    err++;
    w.cells.forEach(k => {
      if (!okc.has(k)) bad.add(+k);
    });
    try {
      SFX('bad');
    } catch (_) {}
    const r = hit();
    if (r == 0 || (r < 0 && err >= LV)) {
      K.blur();
      return fail(r == 0 ? (window.CURPR ? 'le mot était faux' : "plus d'essais 💔") : 'plus de vies 💔');
    }
    toast(r < 0 ? "❌ Ce n'est pas ça : une vie en moins" : `❌ Ce n'est pas ça${hitT(r)}`);
    draw();
  };
  const typeL = l => {
    if (id != RUN) return;
    tb = (tb + String(l).toUpperCase()).slice(-7);
    if (tb.endsWith('OEUF') && !fe) {
      fe = 1;
      EGG(16);
    }
    if (tb == 'JETAIME') ACH('flecheJ');
    const w = F.words[sel];
    while (okc.has(w.cells[pos]) && pos < w.cells.length - 1) pos++;
    if (!okc.has(w.cells[pos])) {
      val[w.cells[pos]] = l;
      bad.delete(w.cells[pos]);
    }
    if (pos < w.cells.length - 1) pos++;
    draw();
  };
  const delL = () => {
    if (id != RUN) return;
    const w = F.words[sel];
    if ((!val[w.cells[pos]] || okc.has(w.cells[pos])) && pos > 0) pos--;
    if (okc.has(w.cells[pos])) return draw();
    delete val[w.cells[pos]];
    bad.delete(w.cells[pos]);
    draw();
  };
  const K = hiddenKeyboard(el, typeL, delL, vW);
  const draw = () => {
    const ws = F.words[sel];
    el.innerHTML = `<p class="center" style="margin:0 0 4px">Vies : ${vHearts(err)}</p><div class="fq">${ws.d == 'A' ? '→' : '↓'} ${esc(ws.q)} <small>(${ws.w.length} lettres)</small></div>
  <div class="fl" style="grid-template-columns:repeat(${Wd},1fr)">${Array.from({ length: H * Wd }, (_, k) => (sol[k] ? `<button data-k="${k}" class="lc ${ws.cells.includes(k) ? 'hl' : ''} ${ws.cells[pos] == k ? 'cu' : ''} ${bad.has(k) ? 'bad' : ''} ${okc.has(+k) ? 'okc' : ''}">${val[k] || ''}</button>` : clue[k] ? `<button data-c="${k}" class="cc" aria-label="Définition">${clue[k].map(i => `<span class="${i == sel ? 'on' : ''}">${F.words[i].d == 'A' ? '→' : '↓'}</span>`).join('')}</button>` : '<span class="bk2"></span>')).join('')}</div>
  <p class="center muted" style="margin:6px 0">Touche une case : le clavier s'ouvre.</p><div class="row"><button id="fvw" ${ws.cells.every(k => val[k]) && !ws.cells.every(k => okc.has(k)) ? '' : 'disabled'}>✔ Valider ce mot</button></div>`;
    el.querySelectorAll('.lc').forEach(
      b =>
        (b.onclick = () => {
          const k = +b.dataset.k,
            mine = F.words.map((o, i) => (o.cells.includes(k) ? i : -1)).filter(i => i >= 0);
          if (mine.length > 1 && mine.includes(sel) && F.words[sel].cells[pos] == k) sel = mine.find(i => i != sel);
          else if (!mine.includes(sel)) sel = mine[0];
          pos = F.words[sel].cells.indexOf(k);
          K.focus({ preventScroll: true });
          draw();
        })
    );
    el.querySelectorAll('.cc').forEach(
      b =>
        (b.onclick = () => {
          const Lc = clue[+b.dataset.c];
          sel = Lc.length > 1 && Lc[0] == sel ? Lc[1] : Lc[0];
          pos = 0;
          K.focus({ preventScroll: true });
          draw();
        })
    );
    $('#fvw').onclick = () => {
      vW();
      K.focus({ preventScroll: true });
    };
  };
  draw();
  G.hint = () => {
    if (id != RUN) return false;
    const w = F.words[sel],
      k = w.cells.find(q => val[q] != sol[q] && !okc.has(q));
    if (k == null) return 'Ce mot est déjà juste : choisis-en un autre';
    val[k] = sol[k];
    bad.delete(k);
    chk();
    if (ks.every(q => val[q] == sol[q])) {
      K.blur();
      win();
      return true;
    }
    draw();
    return true;
  };
};
