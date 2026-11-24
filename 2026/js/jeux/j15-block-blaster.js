GAMES.blocks = function (p, el, win, fail) {
  const id = RUN,
    n = 8,
    SH = [
      [[0, 0]],
      [
        [0, 0],
        [0, 1]
      ],
      [
        [0, 0],
        [1, 0]
      ],
      [
        [0, 0],
        [0, 1],
        [0, 2]
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0]
      ],
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
      ],
      [
        [0, 0],
        [1, 0],
        [1, 1]
      ],
      [
        [0, 1],
        [1, 0],
        [1, 1]
      ],
      [
        [0, 0],
        [0, 1],
        [1, 1]
      ],
      [
        [0, 0],
        [0, 1],
        [1, 0]
      ],
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3]
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0]
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [2, 1]
      ],
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 1]
      ],
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2]
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2]
      ],
      [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2]
      ],
      [
        [0, 1],
        [1, 1],
        [2, 0],
        [2, 1]
      ],
      [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4]
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0]
      ]
    ],
    COL = ['#ff3b5c', '#22d07a', '#3d7bff', '#ffcc1f', '#a65bff', '#ff6fc8', '#ff8a1f', '#19d3e0', '#fff1c9'];
  const g = Array(n * n).fill(-1);
  let hand = [],
    sel = -1,
    score = 0,
    shown = 0,
    over = false,
    streak = 0,
    bombs = 0,
    arm = false,
    reroll = 1,
    newHand = true,
    pend = null,
    recShown = false;
  let dn = 0,
    eggP = 0,
    eK = 0,
    revived = false;
  const best0 = S.bbBest || 0;
  const deal = () => {
    dn++;
    newHand = true;
    hand = [0, 1, 2].map(() => ({ s: SH[Math.floor(Math.random() * SH.length)], c: Math.floor(Math.random() * 8) }));
    if (!eggP && dn >= 6 && Math.random() < 0.45)
      hand[Math.floor(Math.random() * 3)] = {
        s: [
          [0, 0],
          [0, 1],
          [1, 0],
          [1, 1]
        ],
        c: 8
      };
  };
  deal();
  const RSk = vTake('blocks');
  if (RSk) {
    RSk.g.forEach((v, i) => (g[i] = v));
    hand = RSk.hand.map(h => h && { s: h.s, c: h.c });
    score = RSk.score || 0;
    shown = score;
    streak = RSk.streak || 0;
    bombs = RSk.bombs || 0;
    reroll = RSk.reroll != null ? RSk.reroll : reroll;
  }
  const fits = (s, r, c) =>
    s.every(([a, b]) => {
      const R = r + a,
        C = c + b;
      return R >= 0 && R < n && C >= 0 && C < n && g[R * n + C] < 0;
    });
  const canFit = h => h && [...Array(n * n).keys()].some(i => fits(h.s, Math.floor(i / n), i % n));
  const any = () => hand.some(canFit);
  const piece = (h, sz) => {
    const w = Math.max(...h.s.map(x => x[1])) + 1,
      hh = Math.max(...h.s.map(x => x[0])) + 1;
    return `<div class="mini" style="grid-template-columns:repeat(${w},${sz}px);grid-auto-rows:${sz}px">${Array.from({ length: w * hh }, (_, i) => `<i class="${h.s.some(([a, b]) => a * w + b == i) ? 'bq' : ''}" style="--k:${COL[h.c]}">${h.c == 8 && h.s.some(([a, b]) => a * w + b == i) ? '<b class="egc">' + eggH(15) + '</b>' : ''}</i>`).join('')}</div>`;
  };
  // sons
  const AC = eggAC(),
    tn = (f, d, tp, v, dl) => {
      if (!AC || S.sound === false) return;
      const t = AC.currentTime + (dl || 0),
        o = AC.createOscillator(),
        gg = AC.createGain();
      o.type = tp || 'triangle';
      o.frequency.value = f;
      gg.gain.setValueAtTime(0.0001, t);
      gg.gain.exponentialRampToValueAtTime(v || 0.07, t + 0.01);
      gg.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(gg).connect(AC.destination);
      o.start(t);
      o.stop(t + d + 0.02);
    };
  const sPlace = () => {
      tn(180, 0.08, 'sine', 0.09);
      tn(360, 0.05, 'triangle', 0.03);
    },
    sClear = (L, st) => {
      const base = [523, 587, 659, 698, 784, 880][Math.min(5, st - 1)];
      [0, 4, 7, 12].slice(0, Math.min(4, L + 1)).forEach((s2, i) => tn(base * Math.pow(2, s2 / 12), 0.35, 'triangle', 0.06, i * 0.06));
    },
    sWow = () => {
      [0, 4, 7, 12, 16, 19, 24].forEach((s2, i) => tn(523 * Math.pow(2, s2 / 12), 0.4, 'triangle', 0.06, i * 0.07));
    };
  // effets
  const geo = () => {
    const B = $('#bb'),
      w = $('#bbw');
    if (!B || !w) return null;
    const br = B.getBoundingClientRect(),
      wr = w.getBoundingClientRect(),
      cs = (br.width - 10 - 3 * (n - 1)) / n;
    return { B, w, ox: br.left - wr.left + 5, oy: br.top - wr.top + 5, cs, step: cs + 3 };
  };
  const runFx = () => {
    const P = pend;
    pend = null;
    if (!P) return;
    const G0 = geo();
    if (!G0) return;
    const { B, w, ox, oy, cs, step } = G0;
    P.placed.forEach(i => {
      const d = B.children[i];
      if (d)
        d.animate(
          [
            { transform: 'scale(.4)', filter: 'brightness(2)' },
            { transform: 'scale(1.12)', offset: 0.6 },
            { transform: 'scale(1)', filter: 'none' }
          ],
          { duration: 280, easing: 'ease-out' }
        );
    });
    const pc = P.placed.length
      ? P.placed.reduce((a, i) => [a[0] + Math.floor(i / n), a[1] + (i % n)], [0, 0]).map(v => v / P.placed.length)
      : [3.5, 3.5];
    P.cleared.forEach(([i, col]) => {
      const r = Math.floor(i / n),
        c = i % n,
        dl = Math.hypot(r - pc[0], c - pc[1]) * 28,
        q = document.createElement('i');
      q.className = 'bclr';
      q.style.cssText = `left:${ox + c * step}px;top:${oy + r * step}px;width:${cs}px;height:${cs}px;--k:${col}`;
      w.appendChild(q);
      q.animate(
        [
          { transform: 'scale(1)', filter: 'brightness(1)', opacity: 1 },
          { transform: 'scale(1.18)', filter: 'brightness(2.6)', opacity: 1, offset: 0.35 },
          { transform: 'scale(0) rotate(25deg)', filter: 'brightness(3)', opacity: 0 }
        ],
        { duration: 420, delay: dl, easing: 'cubic-bezier(.3,.6,.4,1)' }
      ).onfinish = () => q.remove();
      for (let j = 0; j < 3; j++) {
        const s2 = document.createElement('i');
        s2.className = 'bpart';
        const x0 = ox + c * step + cs / 2,
          y0 = oy + r * step + cs / 2,
          a = Math.random() * 6.28,
          d = 30 + Math.random() * 60;
        s2.style.cssText = `left:${x0}px;top:${y0}px;background:${col}`;
        w.appendChild(s2);
        s2.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
            {
              transform: `translate(calc(-50% + ${Math.cos(a) * d}px),calc(-50% + ${Math.sin(a) * d - 20}px)) scale(.2) rotate(${a * 60}deg)`,
              opacity: 0
            }
          ],
          { duration: 600 + Math.random() * 300, delay: dl + 120, easing: 'cubic-bezier(.2,.7,.4,1)' }
        ).onfinish = () => s2.remove();
      }
    });
    if (P.pts) {
      const t = document.createElement('div');
      t.className = 'bbtxt lv' + P.lv;
      t.innerHTML =
        (P.word ? `<b>${P.word}</b>` : '') +
        (P.combo > 1 ? `<span class="bbcb">COMBO ×${P.combo}</span>` : '') +
        `<em>+${P.pts}</em>` +
        (P.extra || '');
      w.appendChild(t);
      setTimeout(() => t.remove(), 1500);
      const pp = document.createElement('div');
      pp.className = 'bbpt';
      pp.textContent = '+' + P.pts;
      pp.style.cssText = `left:${ox + pc[1] * step + cs / 2}px;top:${oy + pc[0] * step}px`;
      w.appendChild(pp);
      setTimeout(() => pp.remove(), 1000);
    }
    if (P.big) {
      B.classList.remove('shake');
      void B.offsetWidth;
      B.classList.add('shake');
      try {
        navigator.vibrate && navigator.vibrate(P.lv >= 4 ? [40, 30, 60] : 30);
      } catch (_) {}
    }
    if (P.allClear)
      try {
        confetti();
      } catch (_) {}
    if (P.rec) {
      const t = document.createElement('div');
      t.className = 'bbtxt lv6 rec';
      t.innerHTML = '<b>NOUVEAU RECORD !</b>';
      w.appendChild(t);
      setTimeout(() => t.remove(), 1600);
    }
  };
  const countUp = () => {
    const e = $('#bbs');
    if (!e) return;
    const from = shown,
      to = score;
    if (from == to) {
      e.textContent = to;
      return;
    }
    const t0 = performance.now(),
      D = Math.min(700, 200 + (to - from) * 4);
    const f = now => {
      const q = Math.min(1, (now - t0) / D),
        v = Math.round(from + (to - from) * (1 - Math.pow(1 - q, 3)));
      const e2 = $('#bbs');
      if (e2) e2.textContent = v;
      shown = v;
      if (q < 1 && id == RUN) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
    e.parentElement.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 300 });
  };
  const clearAt = (rows, cols, extra) => {
    const set = new Set(extra || []);
    rows.forEach(i => {
      for (let j = 0; j < n; j++) set.add(i * n + j);
    });
    cols.forEach(i => {
      for (let j = 0; j < n; j++) set.add(j * n + i);
    });
    const out = [...set].filter(i => g[i] >= 0).map(i => [i, COL[g[i]]]);
    {
      const ne = [...set].filter(i => g[i] == 8).length;
      if (ne) {
        eK += ne;
        if (eK >= 4) EGG(15);
      }
    }
    set.forEach(i => (g[i] = -1));
    return out;
  };
  const after = () => {
    REC(score);
    if (hand.every(x => !x)) deal();
    if (score > (S.bbBest || 0)) {
      if (best0 > 0 && !recShown && pend) {
        recShown = true;
        pend.rec = 1;
      }
      S.bbBest = score;
      save();
    }
    draw();
    runFx();
    countUp();
    if (score >= p.goal) {
      over = true;
      setTimeout(() => {
        if (id == RUN) win();
      }, 1100);
    } else if (!any() && !bombs && !reroll) {
      if (!revived && (S.gem || 0) >= 1) {
        revived = true;
        window.__bbRev = y => {
          closePop();
          if (id != RUN) return;
          if (y) {
            S.gem--;
            save();
            bombs++;
            reroll++;
            deal();
            draw();
            toast('💣 +1 bombe et 🔄 nouvelles pièces !');
          } else {
            over = true;
            fail(`plus de place pour les pièces (score ${score}/${p.goal})`);
          }
        };
        popup(
          `<h2>Plus de place !</h2><p>Il te manque <b>${p.goal - score}</b> points.</p><button onclick="__bbRev(1)">Continuer : 💣 bombe + 🔄 nouvelles pièces pour 1 💎</button><button class="alt" onclick="__bbRev(0)">Terminer la partie</button><p class="muted">Tu as ${S.gem || 0} 💎</p>`
        );
        return;
      }
      over = true;
      setTimeout(() => {
        if (id == RUN) fail(`plus de place pour les pièces (score ${score}/${p.goal})`);
      }, 900);
    }
  };
  const WORDS = ['', 'Bien !', 'Super !', 'Excellent !', 'Fantastique !', 'INCROYABLE !'],
    MUL = [0, 1, 3, 6, 10, 10];
  const place = (k, r, c) => {
    const h = hand[k];
    if (over || !h || !fits(h.s, r, c)) return false;
    const placed = h.s.map(([a, b]) => (r + a) * n + c + b);
    placed.forEach(i => (g[i] = h.c));
    if (h.c == 8) eggP = 1;
    score += h.s.length;
    hand[k] = null;
    sel = -1;
    const rows = [],
      cols = [];
    for (let i = 0; i < n; i++) {
      if ([...Array(n).keys()].every(j => g[i * n + j] >= 0)) rows.push(i);
      if ([...Array(n).keys()].every(j => g[j * n + i] >= 0)) cols.push(i);
    }
    const Ln = rows.length + cols.length;
    pend = { placed, cleared: [], pts: 0 };
    if (Ln) {
      streak++;
      const cl = clearAt(rows, cols),
        mult = 1 + 0.5 * (streak - 1),
        pts = Math.round(cl.length * MUL[Math.min(Ln, 5)] * mult);
      score += pts;
      const lv = Math.min(5, Ln + (streak >= 4 ? 1 : 0));
      Object.assign(pend, { cleared: cl, pts, word: WORDS[Math.min(Ln, 5)], combo: streak, lv, big: Ln >= 2 || streak >= 3 });
      if (Ln >= 4) ACH('bb4');
      if (streak >= 5) ACH('bbCombo');
      if (streak >= 8) ACH('bb8');
      if (streak > 0 && streak % 3 == 0) {
        bombs++;
        pend.extra = '<small>💣 Bombe gagnée !</small>';
      }
      if (!g.some(v => v >= 0)) {
        score += 300;
        pend.pts += 300;
        pend.word = 'PLATEAU VIDE !';
        pend.lv = 6;
        pend.big = true;
        pend.allClear = 1;
        ACH('bbClear');
        sWow();
      } else sClear(Ln, streak);
    } else {
      streak = 0;
      sPlace();
    }
    after();
    return true;
  };
  const bomb = i => {
    const r = Math.floor(i / n),
      c = i % n,
      ex = [];
    for (let a = -2; a <= 2; a++)
      for (let b = -2; b <= 2; b++) {
        const R = r + a,
          C = c + b;
        if (R >= 0 && R < n && C >= 0 && C < n) ex.push(R * n + C);
      }
    bombs--;
    arm = false;
    const cl = clearAt([], [], ex);
    score += cl.length * 5;
    pend = { placed: [], cleared: cl, pts: cl.length * 5, word: 'BOUM !', lv: 4, big: true };
    tn(90, 0.5, 'sawtooth', 0.08);
    after();
  };
  G = {
    save: () => ({ g: [...g], hand: hand.map(h => h && { s: h.s, c: h.c }), score, streak, bombs, reroll }),
    place,
    hand: () => hand,
    fits,
    n,
    score: () => score
  };
  const draw = () => {
    const nh = newHand;
    newHand = false;
    el.innerHTML = `<div class="bbhd"><div class="bbsc"><small>Score</small><b id="bbs">${shown}</b><span>/ ${p.goal}</span></div><div class="bbrt"><span class="bbrec">🏆 ${Math.max(S.bbBest || 0, score)}</span>${streak > 1 ? `<span class="bbst on" style="--h:${Math.min(streak, 8)}">🔥 Combo ×${streak}</span>` : '<span class="bbst">🔥 Combo</span>'}</div></div><div class="bbbar"><i style="width:${Math.min(100, (score / p.goal) * 100)}%"></i></div><div class="bbw" id="bbw"><div class="bb2 ${arm ? 'arm' : ''}" id="bb">${g.map((v, i) => `<div data-i="${i}" class="${v >= 0 ? 'f' : ''}" style="${v >= 0 ? `--k:${COL[v]}` : ''}">${v == 8 ? '<b class="egc">' + eggH(15) + '</b>' : ''}</div>`).join('')}</div></div>
  <div class="hand">${hand.map((h, k) => `<div class="hp ${h ? '' : 'used'} ${sel == k ? 'sel' : ''} ${h && !canFit(h) ? 'nofit' : ''} ${nh && h ? 'deal' : ''}" style="animation-delay:${k * 70}ms" data-k="${k}">${h ? piece(h, 22) : ''}</div>`).join('')}</div>
  <div class="row bboost"><button class="sm alt" id="bbB" ${bombs ? '' : 'disabled'}>💣 Bombe ×${bombs}</button><button class="sm alt" id="bbR" ${reroll ? '' : 'disabled'}>🔄 Nouvelles pièces ×${reroll}</button></div><p class="center muted">Enchaîne les lignes pour faire grimper le combo 🔥 : tous les 3 combos, une bombe 💣 qui détruit un carré 5×5.</p>`;
    const B = $('#bb'),
      cs = () => (B.getBoundingClientRect().width - 10 - 3 * (n - 1)) / n + 3,
      pv = (a, lines, col) => {
        B.style.setProperty('--pk', col || '#fff');
        B.querySelectorAll('div').forEach((d, i) => {
          d.classList.toggle('pv', !!a && a.includes(i));
          d.classList.toggle('pl', !!lines && lines.has(i));
        });
      };
    $('#bbB').onclick = () => {
      if (!bombs || id != RUN) return;
      arm = !arm;
      draw();
      if (arm) toast('Touche la case où lancer la bombe');
    };
    $('#bbR').onclick = () => {
      if (!reroll || id != RUN) return;
      reroll--;
      deal();
      toast('Nouvelles pièces !');
      after();
    };
    B.querySelectorAll('div').forEach(
      d =>
        (d.onclick = () => {
          if (id != RUN) return;
          const i = +d.dataset.i;
          if (arm) return bomb(i);
          if (sel < 0) return;
          if (!place(sel, Math.floor(i / n), i % n)) toast('Ça ne rentre pas ici');
        })
    );
    const lines = (s, r, c) => {
      const t = [...g];
      s.forEach(([a, b]) => (t[(r + a) * n + c + b] = 1));
      const o = new Set();
      for (let i = 0; i < n; i++) {
        if ([...Array(n).keys()].every(j => t[i * n + j] >= 0)) for (let j = 0; j < n; j++) o.add(i * n + j);
        if ([...Array(n).keys()].every(j => t[j * n + i] >= 0)) for (let j = 0; j < n; j++) o.add(j * n + i);
      }
      return o;
    };
    el.querySelectorAll('.hp').forEach(
      hp =>
        (hp.onpointerdown = e => {
          const k = +hp.dataset.k;
          if (!hand[k] || id != RUN) return;
          e.preventDefault();
          arm = false;
          sel = k;
          try {
            hp.setPointerCapture(e.pointerId);
          } catch (_) {}
          const gh = document.createElement('div');
          gh.className = 'ghost';
          gh.innerHTML = piece(hand[k], cs() - 3);
          document.body.appendChild(gh);
          let tg = null,
            moved = false;
          const x0 = e.clientX,
            y0 = e.clientY;
          const mv = ev => {
            if (Math.abs(ev.clientX - x0) + Math.abs(ev.clientY - y0) > 8) moved = true;
            const s = cs(),
              br = B.getBoundingClientRect(),
              gx = ev.clientX - s * 0.5,
              gy = ev.clientY - s * 2.4;
            gh.style.left = gx + 'px';
            gh.style.top = gy + 'px';
            gh.style.display = moved ? 'block' : 'none';
            hp.style.opacity = moved ? 0.25 : 1;
            const c = Math.round((gx - br.left - 5) / s),
              r = Math.round((gy - br.top - 5) / s),
              ok = moved && fits(hand[k].s, r, c);
            if (ok && (!tg || tg[0] != r || tg[1] != c)) tn(900, 0.03, 'sine', 0.02);
            tg = ok ? [r, c] : null;
            pv(tg && hand[k].s.map(([a, b]) => (r + a) * n + c + b), tg && lines(hand[k].s, r, c), COL[hand[k].c]);
          };
          mv(e);
          hp.onpointermove = mv;
          hp.onpointerup = hp.onpointercancel = () => {
            gh.remove();
            hp.onpointermove = hp.onpointerup = null;
            if (tg && id == RUN) place(k, tg[0], tg[1]);
            else draw();
          };
        })
    );
  };
  draw();
  G.hint = () => {
    if (id != RUN || over) return false;
    deal();
    sel = -1;
    draw();
    return true;
  };
  setTimeout(() => {
    if (id != RUN) return;
    const BO = [
        { id: 'b', ic: '💣', n: 'Une bombe de départ', p: 40 },
        { id: 'r', ic: '🔄', n: '+1 nouvelles pièces', p: 30 }
      ],
      sl = new Set(),
      tot = () => [...sl].reduce((a, k) => a + BO.find(b => b.id == k).p, 0);
    const dr = () =>
      popup(
        `<h2>Boosters</h2><p class="muted">Choisis tes bonus de départ</p><div class="cc-bl pop">${BO.map(b => `<button class="${sl.has(b.id) ? 'on' : ''}" onclick="__bbB('${b.id}')"><span>${b.ic}</span>${b.n}<em>${b.p} ⭐</em></button>`).join('')}</div><button onclick="__bbB('go')">${tot() ? `Jouer (−${tot()} ⭐)` : 'Jouer sans booster'}</button><p class="muted">Tu as ${S.pts} ⭐</p>`
      );
    window.__bbB = k => {
      if (id != RUN) {
        closePop();
        return;
      }
      if (k == 'go') {
        const T2 = tot();
        if (T2) {
          S.pts -= T2;
          save();
          try {
            hdr();
          } catch (_) {}
          if (sl.has('b')) bombs++;
          if (sl.has('r')) reroll++;
        }
        closePop();
        draw();
        return;
      }
      const c = BO.find(b => b.id == k);
      if (sl.has(k)) sl.delete(k);
      else {
        if (tot() + c.p > S.pts) {
          toast('Pas assez d’étoiles ⭐');
          return;
        }
        sl.add(k);
      }
      dr();
    };
    dr();
  }, 350);
};
