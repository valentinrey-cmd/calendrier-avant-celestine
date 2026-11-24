GAMES.balls = function (p, el, win, fail) {
  const id = RUN,
    K = 4,
    U = 30,
    C = p.colors,
    T = C + p.empty,
    COL = ['#e0283f', '#ff8a1f', '#f6d32a', '#2fb35a', '#2d8fe0', '#3c3fb0', '#9b4fd1', '#14c8c8', '#ffffff'];
  let tubes = [...Array(C).keys()].map(c => Array(K).fill(c));
  for (let e = 0; e < p.empty; e++) tubes.push([]);
  const run = t => {
      let n = 0;
      for (let j = t.length - 1; j >= 0 && t[j] == t[t.length - 1]; j--) n++;
      return n;
    },
    amt = (a, b) => (tubes[a].length ? Math.min(run(tubes[a]), K - tubes[b].length) : 0);
  const full = t => t.length == K && t.every(x => x == t[0]),
    solved = () => tubes.every(t => !t.length || full(t));
  const can = (a, b) =>
    a != b &&
    tubes[a].length &&
    tubes[b].length < K &&
    (!tubes[b].length || tubes[b][tubes[b].length - 1] == tubes[a][tubes[a].length - 1]);
  const solve = () => {
    const seen = new Set(),
      path = [];
    let steps = 0;
    const key = () =>
      tubes
        .map(t => t.join(''))
        .sort()
        .join('|');
    solve.cut = false;
    const dfs = () => {
      if (solved()) return true;
      if (++steps > 60000) {
        solve.cut = true;
        return false;
      }
      const k = key();
      if (seen.has(k)) return false;
      seen.add(k);
      const mv = [];
      for (let a = 0; a < T; a++)
        for (let b = 0; b < T; b++) {
          if (!can(a, b)) continue;
          if (full(tubes[a])) continue;
          if (!tubes[b].length && tubes[a].every(x => x == tubes[a][0])) continue;
          const n = amt(a, b);
          mv.push([a, b, n, (tubes[b].length ? 10 : 0) + (run(tubes[a]) == n ? 5 : 0)]);
        }
      mv.sort((x, y) => y[3] - x[3]);
      for (const [a, b, n] of mv) {
        for (let j = 0; j < n; j++) tubes[b].push(tubes[a].pop());
        path.push([a, b]);
        if (dfs()) return true;
        path.pop();
        for (let j = 0; j < n; j++) tubes[a].push(tubes[b].pop());
      }
      return false;
    };
    const ok = dfs();
    solve.last = [...path];
    return ok ? path.length : -1;
  };
  let scr = [],
    L0 = -1;
  for (let g = 0; g < 200; g++) {
    const bag = shuffle([...Array(C * K).keys()].map(x => x % C));
    tubes = [...Array(C).keys()].map(c => bag.slice(c * K, c * K + K));
    for (let e = 0; e < p.empty; e++) tubes.push([]);
    if (tubes.some(t => t.length && t.every(x => x == t[0]))) continue;
    const sv = tubes.map(t => [...t]);
    L0 = solve();
    tubes = sv;
    if (L0 > 0) {
      scr = Array(L0);
      break;
    }
  }
  const RSb = vTake('balls');
  if (RSb) tubes = RSb.tubes;
  const lim = RSb ? RSb.lim : scr.length + p.slack;
  let sel = -1,
    mv = RSb ? RSb.mv : 0,
    busy = false,
    pot = 0,
    TMb = null;
  G = {
    tubes: () => tubes,
    scr,
    lim,
    busy: () => busy,
    save: () => ({ tubes: tubes.map(t => [...t]), mv, lim, left: TMb ? Math.round(TMb.left()) : p.time })
  };
  const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  TMb = timer(RSb && RSb.left > 3 ? RSb.left : p.time, () => fail('le temps est écoulé ⏱️'), id);
  const draw = () => {
    el.innerHTML = `<p class="center">Coups : <b>${mv}</b> / ${lim}</p><div class="tubes">${tubes.map((t, i) => `<button class="tube ltube ${sel == i ? 'sel' : ''} ${full(t) ? 'fin' : ''}" data-i="${i}" aria-label="Fiole ${i + 1}" style="height:${K * U + 18}px"><span class="lq">${t.map((c, k) => `<b style="--c:${COL[c]}" class="${k == t.length - 1 ? 'top' : ''}"></b>`).join('')}</span></button>`).join('')}</div><p class="center muted">Touche une fiole puis une autre pour y verser le liquide du dessus. Fais glisser une fiole pour changer sa place.</p>`;
    el.querySelectorAll('.tube').forEach(b => {
      b.onclick = () => {
        if (b.__dr) return;
        tap(+b.dataset.i);
      };
      b.onpointerdown = e => {
        if (id != RUN || busy) return;
        const x0 = e.clientX,
          y0 = e.clientY,
          i = +b.dataset.i;
        let dr = false;
        const mv = ev => {
          const dx = ev.clientX - x0,
            dy = ev.clientY - y0;
          if (!dr && Math.hypot(dx, dy) > 12) {
            dr = true;
            b.__dr = 1;
            if (sel >= 0) {
              sel = -1;
              el.querySelectorAll('.tube.sel').forEach(q => q.classList.remove('sel'));
            }
            b.style.zIndex = 40;
            b.style.transition = 'none';
            b.style.pointerEvents = 'none';
          }
          if (dr) {
            ev.preventDefault();
            b.style.transform = `translate(${dx / TKX()}px,${dy / TKX()}px) scale(1.06) rotate(${Math.max(-8, Math.min(8, dx / 12))}deg)`;
          }
        };
        const up = ev => {
          removeEventListener('pointermove', mv);
          removeEventListener('pointerup', up);
          removeEventListener('pointercancel', up);
          if (!dr) return;
          let j = -1,
            best = 1e9;
          el.querySelectorAll('.tube').forEach(q => {
            if (q === b) return;
            const r = q.getBoundingClientRect(),
              d = Math.hypot(r.left + r.width / 2 - ev.clientX, r.top + r.height / 2 - ev.clientY);
            if (d < best) {
              best = d;
              j = +q.dataset.i;
            }
          });
          if (best > 110) j = -1;
          if (j >= 0 && j != i && id == RUN) {
            const t2 = tubes.splice(i, 1)[0];
            tubes.splice(j, 0, t2);
            try {
              SFX('tap');
            } catch (_) {}
          }
          draw();
        };
        addEventListener('pointermove', mv, { passive: false });
        addEventListener('pointerup', up);
        addEventListener('pointercancel', up);
      };
    });
  };
  const rbOK = () => {
    const R = [...Array(C).keys()],
      seq = tubes
        .filter(t => t.length)
        .map(t => t[0])
        .join();
    return seq == R.join() || seq == R.slice().reverse().join();
  };
  const finish = (a, b, k) => {
    for (let j = 0; j < k; j++) tubes[b].push(tubes[a].pop());
    mv++;
    sel = -1;
    busy = false;
    draw();
    if (solved()) {
      busy = true;
      if (rbOK()) EGG(5);
      el.querySelector('.tubes').classList.add('won');
      return setTimeout(() => {
        if (id == RUN) win();
      }, 700);
    }
    if (mv >= lim) {
      busy = true;
      setTimeout(() => {
        if (id == RUN) fail('plus de coups disponibles');
      }, 400);
      return;
    }
    let any = false;
    for (let x = 0; x < T && !any; x++)
      for (let y = 0; y < T; y++)
        if (can(x, y) && !full(tubes[x])) {
          any = true;
          break;
        }
    if (!any) {
      busy = true;
      setTimeout(() => {
        if (id == RUN) fail('tu es bloquée : plus aucun versement possible 🧪');
      }, 500);
      return;
    }
    const sv = tubes.map(q => [...q]),
      L3 = solve();
    tubes = sv;
    if (L3 < 0 && !solve.cut) {
      busy = true;
      setTimeout(() => {
        if (id == RUN) fail('tu es bloquée : plus aucune solution possible 🧪');
      }, 500);
    }
  };
  const tap = i => {
    if (id != RUN || busy) return;
    if (sel < 0) {
      if (tubes[i].length) {
        sel = i;
        draw();
      }
      return;
    }
    if (sel == i) {
      sel = -1;
      return draw();
    }
    if (tubes[i].length >= K) {
      toast('Cette fiole est pleine');
      sel = -1;
      return draw();
    }
    if (!can(sel, i)) {
      try {
        SFX('bad');
      } catch (_) {}
      sel = -1;
      draw();
      const D2 = el.querySelector(`.tube[data-i="${i}"]`);
      if (D2 && D2.animate)
        D2.animate(
          [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-7px) rotate(-4deg)' },
            { transform: 'translateX(7px) rotate(4deg)' },
            { transform: 'translateX(-5px) rotate(-2deg)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(0)' }
          ],
          { duration: 380 }
        );
      return;
    }
    const a = sel,
      k = amt(a, i);
    const S = el.querySelector(`.tube[data-i="${a}"]`),
      D = el.querySelector(`.tube[data-i="${i}"]`);
    if (rm || !S || !D || !S.animate) return finish(a, i, k);
    busy = true;
    S.style.transition = 'none';
    S.classList.remove('sel');
    const r0 = S.getBoundingClientRect(),
      r1 = D.getBoundingClientRect(),
      dir = r1.left >= r0.left ? 1 : -1;
    const px = r1.left + r1.width / 2 - dir * 4,
      py = r1.top - 22,
      dx = px - (r0.left + r0.width / 2),
      dy = py - r0.top,
      ang = dir * 104,
      D0 = 1150,
      col = COL[tubes[a][tubes[a].length - 1]];
    S.style.zIndex = 30;
    S.style.transformOrigin = '50% 0';
    S.animate(
      [
        { transform: 'translate(0,-14px) rotate(0deg)' },
        { transform: `translate(${dx / TKX()}px,${dy / TKX()}px) rotate(${dir * 60}deg)`, offset: 0.32 },
        { transform: `translate(${dx / TKX()}px,${dy / TKX()}px) rotate(${ang}deg)`, offset: 0.44 },
        { transform: `translate(${dx / TKX()}px,${dy / TKX()}px) rotate(${ang}deg)`, offset: 0.74 },
        { transform: `translate(${dx / TKX()}px,${dy / TKX()}px) rotate(${dir * 50}deg)`, offset: 0.84 },
        { transform: 'translate(0,0) rotate(0deg)' }
      ],
      { duration: D0, easing: 'ease-in-out' }
    ).onfinish = () => {
      S.style.zIndex = '';
      if (id == RUN) finish(a, i, k);
    };
    setTimeout(() => {
      if (id != RUN) return;
      const lqS = [...S.querySelectorAll('.lq b')],
        lqD = D.querySelector('.lq');
      const surf = r1.bottom - 3 - tubes[i].length * U - k * U,
        st = document.createElement('div');
      st.className = 'lstream';
      st.style.cssText = `--c:${col};left:${px - 3}px;top:${py}px;height:${Math.max(10, surf - py + k * U)}px`;
      document.body.appendChild(st);
      st.animate(
        [
          { transform: 'scaleY(0)', transformOrigin: '50% 0' },
          { transform: 'scaleY(1)', transformOrigin: '50% 0', offset: 0.2 },
          { transform: 'scaleY(1)', transformOrigin: '50% 100%', offset: 0.8 },
          { transform: 'scaleY(0)', transformOrigin: '50% 100%' }
        ],
        { duration: D0 * 0.36, easing: 'ease-out' }
      ).onfinish = () => st.remove();
      lqS.slice(-k).forEach(x => (x.style.height = '0px'));
      for (let j = 0; j < k; j++) {
        const n = document.createElement('b');
        n.style.cssText = `--c:${col};height:0px`;
        lqD.appendChild(n);
        requestAnimationFrame(() => requestAnimationFrame(() => (n.style.height = U + 'px')));
      }
    }, D0 * 0.4);
  };
  draw();
  G.hint = () => {
    if (id != RUN || busy) return 'Attends la fin du versement…';
    if (solved()) return false;
    const sv = tubes.map(q => [...q]);
    const L2 = solve();
    tubes = sv;
    if (L2 <= 0) return 'Plus de solution possible ici : il faudrait recommencer';
    const [a, b] = solve.last[0];
    sel = -1;
    draw();
    tap(a);
    setTimeout(() => {
      if (id == RUN) tap(b);
    }, 250);
    return true;
  };
};
