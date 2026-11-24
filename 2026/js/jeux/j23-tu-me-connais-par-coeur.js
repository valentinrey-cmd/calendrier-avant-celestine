GAMES.quiz = function (p, el, win, fail) {
  const id = RUN,
    RS = vTake('quiz'),
    qs0 = shuffle(CONTENU.quiz.filter(x => x.a && x.a.length)),
    qs =
      RS && RS.order ? [...RS.order.map(t => qs0.find(x => x.q == t)).filter(Boolean), ...qs0.filter(x => !RS.order.includes(x.q))] : qs0,
    need = Math.min(p.need, Math.max(1, qs.length - 1));
  let i = 0,
    good = 0;
  G = { qs };
  let qe = 0;
  const nz = s =>
    (
      ' ' +
      String(s)
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[’'`-]/g, ' ')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, ' ') +
      ' '
    )
      .replace(/^ (?:(?:le|la|l|les|de|du|des|un|une|c|est|cest) )+/, ' ')
      .trim();
  const lev = (a, b) => {
    const d = Array.from({ length: b.length + 1 }, (_, k) => k);
    for (let x = 1; x <= a.length; x++) {
      let pr = d[0];
      d[0] = x;
      for (let y = 1; y <= b.length; y++) {
        const t2 = d[y];
        d[y] = Math.min(d[y] + 1, d[y - 1] + 1, pr + (a[x - 1] == b[y - 1] ? 0 : 1));
        pr = t2;
      }
    }
    return d[b.length];
  };
  const okA = (s, ans) => {
    const u = nz(s);
    if (!u) return false;
    return ans.some(r => {
      const v = nz(r),
        tol = v.length <= 4 ? 0 : v.length <= 7 ? 1 : v.length <= 12 ? 2 : 3;
      return lev(u, v) <= tol || (' ' + u + ' ').includes(' ' + v + ' ') || u.split(' ').some(w => w.length > 3 && lev(w, v) <= tol);
    });
  };
  const QH = qs.map(() => false),
    ok = qs.map(() => false),
    tried = qs.map(() => ''),
    LV = 3;
  let lives = LV,
    busy = 0;
  if (RS) {
    (RS.ok || []).forEach((v, k) => {
      if (k < ok.length) ok[k] = v;
    });
    (RS.tried || []).forEach((v, k) => {
      if (k < tried.length) tried[k] = v;
    });
    (RS.qh || []).forEach((v, k) => {
      if (k < QH.length) QH[k] = v;
    });
    good = ok.filter(Boolean).length;
    i = Math.min(RS.i || 0, qs.length - 1);
    lives = RS.lives || LV;
  }
  G.save = () => ({ order: qs.map(x => x.q), ok: [...ok], tried: [...tried], qh: [...QH], i, lives });
  const show = () => {
    const q = qs[i];
    G.i = i;
    el.innerHTML = `<p class="center" style="margin:0 0 4px">✅ ${good}/${need} · Vies : ${vHearts(LV - lives)}</p>
  <div class="row" style="gap:6px;margin:4px 0 8px">${qs.map((_, k) => `<button class="sm ${k == i ? '' : 'alt'}" data-q="${k}" style="min-width:38px;padding:6px 0">${ok[k] ? '✅' : k + 1}</button>`).join('')}</div>
  <h3>${esc(q.q)}</h3>${QH[i] && !ok[i] ? `<p class="center" style="color:#ffe08a;margin:0 0 6px">💡 La réponse commence par « <b>${esc(q.a[0].trim()[0].toUpperCase())}</b> »</p>` : ''}${ok[i] ? `<p class="center" style="font-size:1.1rem">✅ <b>${esc(tried[i])}</b></p>` : `<input id="qzi" type="text" autocomplete="off" autocapitalize="sentences" placeholder="Ta réponse…" style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:2px solid #ffffff33;background:#0006;color:inherit;font:inherit;font-size:1.05rem"><p id="qzr" class="center" style="min-height:1.4em"></p>`}
  <div class="row"><button class="alt" id="qzp" ${i ? '' : 'disabled'}>◀</button>${ok[i] ? '' : '<button id="qzv">Valider</button>'}<button class="alt" id="qzn" ${i < qs.length - 1 ? '' : 'disabled'}>▶</button></div>`;
    el.querySelectorAll('[data-q]').forEach(
      b =>
        (b.onclick = () => {
          if (busy) return;
          i = +b.dataset.q;
          try {
            SFX('tap');
          } catch (_) {}
          show();
        })
    );
    $('#qzp').onclick = () => {
      if (busy || !i) return;
      i--;
      show();
    };
    $('#qzn').onclick = () => {
      if (busy || i >= qs.length - 1) return;
      i++;
      show();
    };
    if (ok[i]) return;
    const inp = $('#qzi'),
      bt = $('#qzv');
    setTimeout(() => inp.focus(), 80);
    const val = () => {
      if (id != RUN || busy || !inp.value.trim()) return;
      if (
        !qe &&
        ['oeuf', 'unoeuf', 'loeuf', 'oeufs', 'desoeufs', 'lesoeufs'].includes(
          inp.value
            .toLowerCase()
            .replace(/œ/g, 'oe')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z]/g, '')
        )
      ) {
        qe = 1;
        inp.value = '';
        EGG(23);
        $('#qzr').innerHTML = '🥚 Tiens, un œuf ! Maintenant, la vraie réponse…';
        return;
      }
      {
        const nv = inp.value
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z]/g, '');
        if (nv == 'jetaime' || nv == 'jetaimes') ACH('quizJ');
      }
      if (okA(inp.value, q.a)) {
        ok[i] = true;
        tried[i] = inp.value.trim();
        good++;
        try {
          SFX('ok');
        } catch (_) {}
        inp.style.borderColor = '#3ddc84';
        $('#qzr').innerHTML = '✅ Bonne réponse !';
        busy = 1;
        setTimeout(() => {
          busy = 0;
          if (id != RUN) return;
          if (good >= need) return win();
          const nx = qs.findIndex((_, k) => k > i && !ok[k]),
            nf = nx >= 0 ? nx : ok.indexOf(false);
          if (nf >= 0) i = nf;
          show();
        }, 900);
      } else {
        lives--;
        try {
          SFX('bad');
        } catch (_) {}
        const r = hit();
        if (r >= 0) lives = r;
        inp.style.borderColor = '#ff3b5c';
        $('#qzr').innerHTML = '❌ Faux !' + (r > 0 ? ` <small>−1 vie (il t'en reste ${r})</small>` : '');
        el.querySelector('p').innerHTML = `✅ ${good}/${need} · Vies : ${vHearts(LV - lives)}`;
        if (lives <= 0) {
          busy = 1;
          setTimeout(() => {
            if (id == RUN) fail(window.CURPR ? 'mauvaise réponse' : "plus d'essais 💔");
          }, 900);
          return;
        }
        inp.select();
      }
    };
    bt.onclick = val;
    inp.onkeydown = e => {
      if (e.key == 'Enter') val();
    };
  };
  show();
  G.hint = () => {
    if (id != RUN || busy) return false;
    if (ok[i]) return 'Cette question est déjà trouvée';
    if (QH[i]) return "Tu as déjà l'indice pour cette question";
    QH[i] = true;
    show();
    return true;
  };
};
