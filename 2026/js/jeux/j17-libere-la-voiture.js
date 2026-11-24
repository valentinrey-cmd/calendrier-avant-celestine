GAMES.rush = function (p, el, win, fail) {
  const id = RUN,
    RSr = vTake('rush'),
    LV =
      RSr && LVD.rush[RSr.k]
        ? LVD.rush[RSr.k]
        : (() => {
            const L = LVD.rush;
            let k,
              g = 0;
            do {
              k = Math.floor(Math.random() * L.length);
            } while (L.length > 1 && k == S.rushLast && g++ < 20);
            S.rushLast = k;
            save();
            return L[k];
          })(),
    cars = LV.cars.map(([r, c, L, h]) => ({ r, c, L, h }));
  let mv = RSr ? RSr.mv : 0,
    kt = 0,
    kg = 0,
    TMr = null;
  if (RSr)
    RSr.pos.forEach((v, i) => {
      const k = cars[i];
      if (k) {
        if (k.h) k.c = v;
        else k.r = v;
      }
    });
  G = {
    save: () => ({ k: LVD.rush.indexOf(LV), pos: cars.map(k => (k.h ? k.c : k.r)), mv, left: TMr ? Math.round(TMr.left()) : p.time }),
    sol: LV.sol,
    cars,
    move: (i, v) => {
      const k = cars[i];
      if (k.h) k.c = v;
      else k.r = v;
      mv++;
      draw();
      check();
    }
  };
  const MLN = [
      ['A', '#e5007d'],
      ['B', '#0094d9'],
      ['C', '#f39200'],
      ['D', '#00a650']
    ],
    BLN = ['C1', 'C3', 'C13', '86', 'C2', 'C5', '27', 'C9', '38', 'C14'];
  const occ = skip => {
    const g = Array(36).fill(-1);
    cars.forEach((k, i) => {
      if (i == skip) return;
      for (let j = 0; j < k.L; j++) g[(k.r + (k.h ? 0 : j)) * 6 + k.c + (k.h ? j : 0)] = i;
    });
    return g;
  };
  const range = i => {
    const k = cars[i],
      g = occ(i);
    let lo = k.h ? k.c : k.r,
      hi = lo;
    const free = v => {
      const r = k.h ? k.r : v,
        c = k.h ? v : k.c;
      return v >= 0 && v < 6 && g[r * 6 + c] < 0;
    };
    while (free(lo - 1)) lo--;
    while (free(hi + k.L)) hi++;
    return [lo, hi];
  };
  const check = () => {
    if (cars[0].c + 2 == 6) {
      if (mv <= LV.min) ACH('rushOpt');
      setTimeout(() => {
        if (id == RUN) win();
      }, 500);
      return true;
    }
  };
  TMr = timer(RSr && RSr.left > 3 ? RSr.left : p.time, () => fail('le temps est écoulé ⏱️'), id);
  const draw = () => {
    el.innerHTML = `<p class="center">Coups : ${mv} · Le minimum possible est ${LV.min}</p><div class="rh" id="rh"><div class="exit">➜</div>${cars
      .map((k, i) => {
        const mt = k.L >= 3,
          ml = MLN[i % 4],
          lab = i ? (mt ? `<b class="vl" style="background:${ml[1]}">${ml[0]}</b>` : `<b class="vl">${BLN[i % BLN.length]}</b>`) : '';
        return `<div class="car ${i ? 'veh ' + (mt ? 'metro' : 'bus') + (k.h ? '' : ' v') : 'red'}" data-i="${i}" style="left:${(k.c * 100) / 6}%;top:${(k.r * 100) / 6}%;width:${((k.h ? k.L : 1) * 100) / 6}%;height:${((k.h ? 1 : k.L) * 100) / 6}%;--ln:${mt ? ml[1] : '#e2001a'}"><span>${i ? lab + '<i class="vt">TCL</i>' : '<i class="rcar">🚗</i>'}</span></div>`;
      })
      .join(
        ''
      )}</div><p class="center muted">Fais glisser les bus et les métros TCL (seulement dans leur sens) pour libérer la sortie à la voiture rouge 🚗.</p>`;
    const B = $('#rh');
    B.querySelectorAll('.car').forEach(
      d =>
        (d.onpointerdown = e => {
          if (id != RUN) return;
          e.preventDefault();
          const i = +d.dataset.i,
            k = cars[i],
            [lo, hi] = range(i),
            cell = B.getBoundingClientRect().width / 6,
            s0 = k.h ? k.c : k.r,
            p0 = k.h ? e.clientX : e.clientY;
          let v = s0;
          try {
            d.setPointerCapture(e.pointerId);
          } catch (_) {}
          d.onpointermove = ev => {
            const dl = ((k.h ? ev.clientX : ev.clientY) - p0) / cell,
              raw = Math.max(lo, Math.min(hi, s0 + dl));
            v = Math.round(raw);
            d.style[k.h ? 'left' : 'top'] = (raw * 100) / 6 + '%';
          };
          d.onpointerup = d.onpointercancel = () => {
            d.onpointermove = d.onpointerup = null;
            if (v != s0) {
              if (k.h) k.c = v;
              else k.r = v;
              mv++;
              kt = 0;
            } else if (i == 0) {
              kt++;
              honk();
              if (kt >= 3 && !kg) {
                kg = 1;
                EGG(17);
              }
            }
            draw();
            check();
          };
        })
    );
  };
  draw();
  G.hint = () => {
    if (id != RUN) return false;
    if (cars[0].c + 2 == 6) return false;
    const N = cars.length,
      st0 = cars.map(k => (k.h ? k.c : k.r)),
      seen = new Set([st0.join()]);
    let Q = [[st0, null]],
      h = 0,
      found = null;
    while (h < Q.length && !found && seen.size < 300000) {
      const [ps, fm] = Q[h++];
      const g = Array(36).fill(-1);
      cars.forEach((k, i) => {
        for (let j = 0; j < k.L; j++) g[(k.h ? k.r : ps[i] + j) * 6 + (k.h ? ps[i] + j : k.c)] = i;
      });
      for (let i = 0; i < N && !found; i++) {
        const k = cars[i],
          fr = v =>
            v >= 0 &&
            v + k.L - 1 < 6 &&
            [...Array(k.L).keys()].every(j => {
              const q = g[(k.h ? k.r : v + j) * 6 + (k.h ? v + j : k.c)];
              return q < 0 || q == i;
            });
        for (const dd of [-1, 1]) {
          let v = ps[i] + dd;
          while (fr(v)) {
            const ns = [...ps];
            ns[i] = v;
            const kk = ns.join();
            if (!seen.has(kk)) {
              seen.add(kk);
              const m = fm || [i, v];
              if (i == 0 && v + 2 == 6) {
                found = m;
                break;
              }
              Q.push([ns, m]);
            }
            v += dd;
          }
          if (found) break;
        }
      }
    }
    if (!found) return 'Pas de solution trouvée';
    G.move(found[0], found[1]);
    const d = el.querySelector(`.car[data-i="${found[0]}"]`);
    if (d) d.animate([{ filter: 'brightness(1.8)' }, { filter: 'none' }], { duration: 600 });
    return true;
  };
};
