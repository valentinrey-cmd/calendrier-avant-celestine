GAMES.candy = function (p, el, win, fail) {
  const id = RUN,
    N = 9,
    NC = 7,
    MOVES = p.moves || 22,
    TG = p.target || 9000,
    STS = [TG, Math.round(TG * 1.35), Math.round(TG * 1.7)],
    SPD = () => window.__ccSpeed || 1;
  el.innerHTML = `<div class="cc-hud"><div class="cc-box"><small>Coups</small><b id="ccm">${MOVES}</b></div><div class="cc-sc"><div class="cc-sct"><small>Score</small><b id="ccs">0</b></div><div class="cc-bar"><i id="ccb"></i>${STS.map((v, i) => `<u data-i="${i}" style="left:${(v / STS[2]) * 100}%">★</u>`).join('')}</div></div><div class="cc-box"><small>Objectif</small><b>${TG}</b></div></div><div class="cc-free" id="ccf" hidden></div><div class="cc-wrap" id="ccw"><canvas id="ccc"></canvas></div><p class="center muted cc-tip" id="cct">Fais glisser un bonbon vers son voisin pour les échanger.</p>`;
  const BASE = ['#ff2d55', '#ff8c1a', '#ffd21a', '#25c96a', '#2f7bff', '#a64dff', '#ff5fc8'],
    LIG = ['#ffb3c2', '#ffd2a0', '#fff6b0', '#b4f5cd', '#b5d2ff', '#e4c4ff', '#ffd0ef'],
    DRK = ['#9e0027', '#a84a00', '#a87f00', '#08703a', '#0a3a9e', '#55158f', '#a0106e'];
  const W0 = Math.min(el.clientWidth || 360, 430),
    cs = Math.floor((W0 - 14) / N),
    PAD = 7,
    BS = cs * N + PAD * 2,
    dpr = Math.min(3, devicePixelRatio || 1),
    cv = $('#ccc'),
    x = cv.getContext('2d');
  cv.width = BS * dpr;
  cv.height = BS * dpr;
  cv.style.width = BS + 'px';
  cv.style.height = BS + 'px';
  x.scale(dpr, dpr);
  const TAU = Math.PI * 2,
    R = Math.random,
    rnd = n => Math.floor(R() * n),
    sleep = ms => new Promise(r => setTimeout(r, ms / SPD()));
  // ---------- sprites ----------
  const SPR = {},
    mkc = () => {
      const c = document.createElement('canvas');
      c.width = c.height = Math.ceil(cs * dpr * 1.3);
      const g = c.getContext('2d');
      g.scale(dpr, dpr);
      g.translate(cs * 0.65, cs * 0.65);
      return [c, g];
    };
  const shape = (g, k, r) => {
    g.beginPath();
    if (k == 0) {
      g.ellipse(0, 0, r * 1.08, r * 0.78, -0.35, 0, TAU);
    } else if (k == 1) {
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU + TAU / 12;
        g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      g.closePath();
    } else if (k == 2) {
      g.moveTo(0, -r * 1.05);
      g.bezierCurveTo(r * 0.55, -r * 0.45, r * 0.95, r * 0.05, r * 0.85, r * 0.4);
      g.arc(0, r * 0.35, r * 0.86, 0, Math.PI);
      g.bezierCurveTo(-r * 0.95, r * 0.05, -r * 0.55, -r * 0.45, 0, -r * 1.05);
    } else if (k == 3) {
      const s = r * 0.86,
        q = r * 0.32;
      g.moveTo(-s + q, -s);
      g.arcTo(s, -s, s, s, q);
      g.arcTo(s, s, -s, s, q);
      g.arcTo(-s, s, -s, -s, q);
      g.arcTo(-s, -s, s, -s, q);
    } else if (k == 4) {
      g.arc(0, 0, r * 0.95, 0, TAU);
    } else if (k == 5) {
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * TAU - Math.PI / 2;
        g.moveTo(Math.cos(a) * r * 0.5 + r * 0.5, Math.sin(a) * r * 0.5);
        g.arc(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5, r * 0.5, 0, TAU);
      }
    } else {
      g.moveTo(0, r * 0.98);
      g.bezierCurveTo(-r * 1.3, r * 0.1, -r * 0.9, -r * 1.1, 0, -r * 0.42);
      g.bezierCurveTo(r * 0.9, -r * 1.1, r * 1.3, r * 0.1, 0, r * 0.98);
    }
  };
  const gloss = (g, k, r, base, lig, drk) => {
    g.save();
    g.shadowColor = '#0007';
    g.shadowBlur = cs * 0.1;
    g.shadowOffsetY = cs * 0.05;
    g.translate(0, r * 0.09);
    shape(g, k, r);
    g.fillStyle = drk;
    g.fill();
    g.restore();
    const gr = g.createRadialGradient(-r * 0.3, -r * 0.45, r * 0.05, 0, 0, r * 1.25);
    gr.addColorStop(0, lig);
    gr.addColorStop(0.38, base);
    gr.addColorStop(1, drk);
    shape(g, k, r);
    g.fillStyle = gr;
    g.fill();
    g.save();
    shape(g, k, r);
    g.clip();
    g.save();
    g.globalAlpha = 0.5;
    g.translate(0, -r * 0.06);
    g.scale(0.76, 0.76);
    shape(g, k, r);
    const ig = g.createLinearGradient(0, -r, 0, r * 0.8);
    ig.addColorStop(0, lig);
    ig.addColorStop(1, base + '00');
    g.fillStyle = ig;
    g.fill();
    g.restore();
    if (k == 4) {
      g.strokeStyle = '#ffffff8c';
      g.lineWidth = r * 0.17;
      g.lineCap = 'round';
      for (let i = 0; i < 4; i++) {
        g.beginPath();
        for (let t = 0; t <= 1.0001; t += 0.05) {
          const an = (i * TAU) / 4 + t * 2.4,
            rad = t * r * 0.92;
          g.lineTo(Math.cos(an) * rad, Math.sin(an) * rad);
        }
        g.stroke();
      }
      g.fillStyle = lig;
      g.beginPath();
      g.arc(0, 0, r * 0.16, 0, TAU);
      g.fill();
    } else if (k == 1) {
      g.fillStyle = lig + '88';
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const an = (i / 6) * TAU + TAU / 12;
        g.lineTo(Math.cos(an) * r * 0.5, Math.sin(an) * r * 0.5 - r * 0.05);
      }
      g.closePath();
      g.fill();
      g.strokeStyle = '#ffffff40';
      g.lineWidth = cs * 0.018;
      for (let i = 0; i < 6; i++) {
        const an = (i / 6) * TAU + TAU / 12;
        g.beginPath();
        g.moveTo(Math.cos(an) * r * 0.5, Math.sin(an) * r * 0.5 - r * 0.05);
        g.lineTo(Math.cos(an) * r, Math.sin(an) * r);
        g.stroke();
      }
    } else if (k == 3) {
      const s2 = r * 0.55,
        q = r * 0.22,
        ig2 = g.createLinearGradient(0, -s2, 0, s2);
      ig2.addColorStop(0, lig);
      ig2.addColorStop(1, base);
      g.fillStyle = ig2;
      g.globalAlpha = 0.75;
      g.beginPath();
      g.moveTo(-s2 + q, -s2 - r * 0.05);
      g.arcTo(s2, -s2 - r * 0.05, s2, s2, q);
      g.arcTo(s2, s2 - r * 0.05, -s2, s2, q);
      g.arcTo(-s2, s2 - r * 0.05, -s2, -s2, q);
      g.arcTo(-s2, -s2 - r * 0.05, s2, -s2, q);
      g.fill();
      g.globalAlpha = 1;
    } else if (k == 2) {
      g.strokeStyle = '#ffffff55';
      g.lineWidth = cs * 0.03;
      g.beginPath();
      g.moveTo(0, -r * 0.85);
      g.quadraticCurveTo(-r * 0.35, r * 0.1, -r * 0.05, r * 0.95);
      g.stroke();
    } else if (k == 0) {
      g.strokeStyle = '#ffffff40';
      g.lineWidth = cs * 0.035;
      g.beginPath();
      g.ellipse(0, 0, r * 0.72, r * 0.45, -0.35, 0.3, 2.4);
      g.stroke();
    } else if (k == 5) {
      for (let i = 0; i < 5; i++) {
        const an = (i / 5) * TAU - Math.PI / 2;
        g.fillStyle = '#ffffff55';
        g.beginPath();
        g.ellipse(Math.cos(an) * r * 0.55 - r * 0.06, Math.sin(an) * r * 0.55 - r * 0.08, r * 0.15, r * 0.09, an, 0, TAU);
        g.fill();
      }
      const cg = g.createRadialGradient(-r * 0.06, -r * 0.06, 1, 0, 0, r * 0.3);
      cg.addColorStop(0, '#fff');
      cg.addColorStop(1, lig);
      g.fillStyle = cg;
      g.beginPath();
      g.arc(0, 0, r * 0.27, 0, TAU);
      g.fill();
    }
    const sp = g.createLinearGradient(0, -r * 1.05, 0, -r * 0.1);
    sp.addColorStop(0, '#ffffffd0');
    sp.addColorStop(1, '#ffffff00');
    g.fillStyle = sp;
    g.beginPath();
    g.ellipse(-r * 0.12, -r * 0.52, r * 0.62, r * 0.3, -0.2, 0, TAU);
    g.fill();
    g.strokeStyle = '#ffffff50';
    g.lineWidth = cs * 0.03;
    g.beginPath();
    g.ellipse(0, r * 0.12, r * 0.78, r * 0.62, 0, 0.35, Math.PI - 0.35);
    g.stroke();
    g.restore();
    g.fillStyle = '#fff';
    g.beginPath();
    g.ellipse(-r * 0.48, -r * 0.36, r * 0.1, r * 0.055, -0.7, 0, TAU);
    g.fill();
    g.beginPath();
    g.arc(-r * 0.3, -r * 0.52, r * 0.035, 0, TAU);
    g.fill();
    g.lineWidth = Math.max(1, cs * 0.022);
    g.strokeStyle = drk;
    shape(g, k, r);
    g.stroke();
  };
  for (let k = 0; k < NC; k++) {
    const r = cs * 0.37;
    {
      const [c, g] = mkc();
      gloss(g, k, r, BASE[k], LIG[k], DRK[k]);
      SPR[k + 'n'] = c;
    }
    for (const d of ['h', 'v']) {
      const [c, g] = mkc();
      gloss(g, k, r, BASE[k], LIG[k], DRK[k]);
      g.save();
      shape(g, k, r);
      g.clip();
      g.fillStyle = '#ffffffd9';
      for (let i = -2; i <= 2; i++) {
        if (d == 'h') g.fillRect(-r * 1.2, i * r * 0.42 - r * 0.08, r * 2.4, r * 0.16);
        else g.fillRect(i * r * 0.42 - r * 0.08, -r * 1.2, r * 0.16, r * 2.4);
      }
      g.restore();
      SPR[k + d] = c;
    }
    {
      const [c, g] = mkc(),
        rr = r * 0.78;
      g.save();
      g.shadowColor = '#0005';
      g.shadowBlur = cs * 0.08;
      g.fillStyle = BASE[k];
      [-1, 1].forEach(s => {
        g.beginPath();
        g.moveTo(s * rr * 0.85, 0);
        g.lineTo(s * rr * 1.6, -rr * 0.75);
        g.quadraticCurveTo(s * rr * 1.35, 0, s * rr * 1.6, rr * 0.75);
        g.closePath();
        g.fill();
      });
      g.restore();
      [-1, 1].forEach(s => {
        g.fillStyle = LIG[k] + 'aa';
        g.beginPath();
        g.moveTo(s * rr * 0.95, -rr * 0.05);
        g.lineTo(s * rr * 1.45, -rr * 0.55);
        g.lineTo(s * rr * 1.3, -rr * 0.05);
        g.fill();
      });
      const gr = g.createLinearGradient(0, -rr, 0, rr);
      gr.addColorStop(0, LIG[k]);
      gr.addColorStop(0.5, BASE[k]);
      gr.addColorStop(1, DRK[k]);
      g.fillStyle = gr;
      g.beginPath();
      g.roundRect(-rr, -rr * 0.9, rr * 2, rr * 1.8, rr * 0.45);
      g.fill();
      g.strokeStyle = '#fff';
      g.lineWidth = cs * 0.035;
      g.setLineDash([cs * 0.06, cs * 0.05]);
      g.beginPath();
      g.roundRect(-rr * 0.78, -rr * 0.68, rr * 1.56, rr * 1.36, rr * 0.3);
      g.stroke();
      g.setLineDash([]);
      g.fillStyle = '#ffffff80';
      g.beginPath();
      g.ellipse(-rr * 0.3, -rr * 0.5, rr * 0.45, rr * 0.15, -0.2, 0, TAU);
      g.fill();
      SPR[k + 'w'] = c;
    }
    {
      const [c, g] = mkc(),
        rr = r;
      const gr = g.createRadialGradient(-rr * 0.3, -rr * 0.3, 1, 0, 0, rr);
      gr.addColorStop(0, LIG[k]);
      gr.addColorStop(0.5, BASE[k]);
      gr.addColorStop(1, DRK[k]);
      g.save();
      g.shadowColor = '#0005';
      g.shadowBlur = cs * 0.08;
      g.fillStyle = gr;
      g.beginPath();
      g.ellipse(-rr * 0.1, 0, rr * 0.75, rr * 0.55, 0, 0, TAU);
      g.fill();
      g.beginPath();
      g.moveTo(rr * 0.5, 0);
      g.lineTo(rr * 1.05, -rr * 0.55);
      g.quadraticCurveTo(rr * 0.85, 0, rr * 1.05, rr * 0.55);
      g.closePath();
      g.fill();
      g.restore();
      g.fillStyle = DRK[k];
      g.beginPath();
      g.moveTo(-rr * 0.1, -rr * 0.5);
      g.quadraticCurveTo(rr * 0.15, -rr * 0.95, rr * 0.35, -rr * 0.4);
      g.fill();
      g.fillStyle = '#fff';
      g.beginPath();
      g.arc(-rr * 0.45, -rr * 0.12, rr * 0.17, 0, TAU);
      g.fill();
      g.fillStyle = '#222';
      g.beginPath();
      g.arc(-rr * 0.48, -rr * 0.1, rr * 0.08, 0, TAU);
      g.fill();
      g.strokeStyle = '#fff8';
      g.lineWidth = cs * 0.025;
      g.beginPath();
      g.arc(-rr * 0.1, rr * 0.05, rr * 0.35, 0.2, 1.3);
      g.stroke();
      SPR[k + 'f'] = c;
    }
  }
  {
    const [c, g] = mkc(),
      r = cs * 0.38;
    const gr = g.createRadialGradient(-r * 0.35, -r * 0.4, 1, 0, 0, r);
    gr.addColorStop(0, '#a86b45');
    gr.addColorStop(0.5, '#5b2f17');
    gr.addColorStop(1, '#2a1307');
    g.save();
    g.shadowColor = '#0007';
    g.shadowBlur = cs * 0.1;
    g.fillStyle = gr;
    g.beginPath();
    g.arc(0, 0, r, 0, TAU);
    g.fill();
    g.restore();
    for (let i = 0; i < 26; i++) {
      const a = R() * TAU,
        d = Math.sqrt(R()) * r * 0.82;
      g.save();
      g.translate(Math.cos(a) * d, Math.sin(a) * d);
      g.rotate(R() * TAU);
      g.fillStyle = BASE[i % 6];
      g.beginPath();
      g.roundRect(-cs * 0.045, -cs * 0.016, cs * 0.09, cs * 0.032, cs * 0.016);
      g.fill();
      g.restore();
    }
    g.fillStyle = '#ffffff40';
    g.beginPath();
    g.ellipse(-r * 0.35, -r * 0.45, r * 0.4, r * 0.2, -0.5, 0, TAU);
    g.fill();
    SPR.b = c;
  }
  {
    const [c, g] = mkc(),
      r = cs * 0.36;
    const gr = g.createRadialGradient(-r * 0.3, -r * 0.5, 1, 0, 0, r * 1.2);
    gr.addColorStop(0, '#fffef7');
    gr.addColorStop(0.55, '#f7e6c4');
    gr.addColorStop(1, '#d3ad6a');
    g.save();
    g.shadowColor = '#ffd86a';
    g.shadowBlur = cs * 0.25;
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(0, cs * 0.02, r * 0.78, r * 1.02, 0, 0, TAU);
    g.fill();
    g.restore();
    g.fillStyle = '#ffffffb0';
    g.beginPath();
    g.ellipse(-r * 0.28, -r * 0.42, r * 0.18, r * 0.3, -0.4, 0, TAU);
    g.fill();
    SPR.egg = c;
    {
      const im = eggImg(18),
        put = () => {
          const [c2, g2] = mkc();
          g2.drawImage(im, -cs * 0.48, -cs * 0.48, cs * 0.96, cs * 0.96);
          SPR.egg = c2;
        };
      if (im.complete && im.naturalWidth) put();
      else im.addEventListener('load', put);
    }
  }
  const sprOf = t => (t.sp == 'egg' ? SPR.egg : t.sp == 'b' ? SPR.b : SPR[t.c + (t.sp || 'n')]);
  // ---------- state ----------
  let revived = false,
    B = Array.from({ length: N }, () => Array(N).fill(null)),
    score = 0,
    moves = MOVES,
    busy = true,
    over = false,
    sel = null,
    free = false,
    eggDone = false,
    cascade = 0,
    shown = 0,
    starsGot = 0,
    lastSwap = null;
  const dying = [],
    FX = [],
    PT = [],
    TX = [];
  let SHK = 0;
  const mk = (c, sp) => ({ c, sp: sp || null, x: 0, y: 0, vy: 0, s: 1, a: 1, sq: 0, ph: R() * TAU });
  const at = (r, c) => (r >= 0 && r < N && c >= 0 && c < N ? B[r][c] : null);
  const runs = () => {
    const out = [];
    for (let r = 0; r < N; r++) {
      let c = 0;
      while (c < N) {
        const t = B[r][c];
        if (!t || t.c < 0 || t.sp == 'egg' || t.sp == 'b') {
          c++;
          continue;
        }
        let e = c + 1;
        while (e < N && B[r][e] && B[r][e].c == t.c && B[r][e].sp != 'egg' && B[r][e].sp != 'b') e++;
        if (e - c >= 3) out.push({ d: 'h', cells: Array.from({ length: e - c }, (_, i) => [r, c + i]), col: t.c });
        c = e;
      }
    }
    for (let c = 0; c < N; c++) {
      let r = 0;
      while (r < N) {
        const t = B[r][c];
        if (!t || t.c < 0 || t.sp == 'egg' || t.sp == 'b') {
          r++;
          continue;
        }
        let e = r + 1;
        while (e < N && B[e][c] && B[e][c].c == t.c && B[e][c].sp != 'egg' && B[e][c].sp != 'b') e++;
        if (e - r >= 3) out.push({ d: 'v', cells: Array.from({ length: e - r }, (_, i) => [r + i, c]), col: t.c });
        r = e;
      }
    }
    return out;
  };
  const squares = () => {
    const out = [];
    for (let r = 0; r < N - 1; r++)
      for (let c = 0; c < N - 1; c++) {
        const q = [
          [r, c],
          [r, c + 1],
          [r + 1, c],
          [r + 1, c + 1]
        ].map(([a, b]) => B[a][b]);
        if (q.every(t => t && t.c >= 0 && t.sp != 'egg' && t.sp != 'b' && t.c == q[0].c))
          out.push({
            cells: [
              [r, c],
              [r, c + 1],
              [r + 1, c],
              [r + 1, c + 1]
            ],
            col: q[0].c
          });
      }
    return out;
  };
  const K = (r, c) => r * N + c,
    RC = k => [Math.floor(k / N), k % N];
  const groups = () => {
    const rs = runs(),
      sq = squares(),
      gs = [];
    rs.forEach(run => {
      const ks = run.cells.map(([a, b]) => K(a, b));
      let g = gs.find(g => g.col == run.col && ks.some(k => g.set.has(k)));
      if (!g) {
        g = { col: run.col, set: new Set(), runs: [] };
        gs.push(g);
      }
      ks.forEach(k => g.set.add(k));
      g.runs.push(run);
    });
    for (let i = 0; i < gs.length; i++)
      for (let j = gs.length - 1; j > i; j--)
        if (gs[i].col == gs[j].col && [...gs[j].set].some(k => gs[i].set.has(k))) {
          gs[j].set.forEach(k => gs[i].set.add(k));
          gs[i].runs.push(...gs[j].runs);
          gs.splice(j, 1);
        }
    sq.forEach(q => {
      const ks = q.cells.map(([a, b]) => K(a, b));
      let g = gs.find(g => g.col == q.col && ks.some(k => g.set.has(k)));
      if (g) {
        if (!g.runs.some(r => r.cells.length >= 4) && !(g.runs.some(r => r.d == 'h') && g.runs.some(r => r.d == 'v'))) {
          ks.forEach(k => g.set.add(k));
          g.sq = 1;
        }
      } else {
        gs.push({ col: q.col, set: new Set(ks), runs: [], sq: 1 });
      }
    });
    gs.forEach(g => {
      const L = Math.max(0, ...g.runs.map(r => r.cells.length));
      g.kind =
        L >= 5
          ? 'b'
          : g.runs.some(r => r.d == 'h') && g.runs.some(r => r.d == 'v')
            ? 'w'
            : L == 4
              ? g.runs.find(r => r.cells.length == 4).d == 'h'
                ? 'v'
                : 'h'
              : g.sq
                ? 'f'
                : null;
    });
    return gs;
  };
  const anyMatch = () => groups().length > 0;
  const swapCells = (a, b) => {
    const t = B[a[0]][a[1]];
    B[a[0]][a[1]] = B[b[0]][b[1]];
    B[b[0]][b[1]] = t;
  };
  const isCombo = (t1, t2) => t1 && t2 && t1.sp != 'egg' && t2.sp != 'egg' && (t1.sp == 'b' || t2.sp == 'b' || (t1.sp && t2.sp));
  const validSwap = (a, b) => {
    const t1 = at(...a),
      t2 = at(...b);
    if (!t1 || !t2) return false;
    if (isCombo(t1, t2)) return true;
    swapCells(a, b);
    const ok = anyMatch();
    swapCells(a, b);
    return ok;
  };
  const findMove = () => {
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++)
        for (const [dr, dc] of [
          [0, 1],
          [1, 0]
        ]) {
          const b = [r + dr, c + dc];
          if (b[0] < N && b[1] < N && validSwap([r, c], b)) return [[r, c], b];
        }
    return null;
  };
  // ---------- fill ----------
  const fresh = () => {
    let tries = 0;
    do {
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++) {
          let k;
          do {
            k = rnd(NC);
          } while ((c >= 2 && B[r][c - 1].c == k && B[r][c - 2].c == k) || (r >= 2 && B[r - 1][c].c == k && B[r - 2][c].c == k));
          B[r][c] = mk(k);
        }
    } while (++tries < 50 && !findMove());
  };
  fresh();
  {
    const ec = 1 + rnd(N - 2);
    B[0][ec] = mk(-1, 'egg');
  }
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      const t = B[r][c];
      t.x = c;
      t.y = r - N - 1 - (N - r) * 0.35;
      t.vy = 0;
    }
  // ---------- tweens & fx ----------
  const TW = [];
  const tween = (o, props, ms, ease) =>
    new Promise(res => {
      const from = {};
      for (const k in props) from[k] = o[k];
      TW.push({
        o,
        from,
        to: props,
        t: 0,
        d: ms / 1000,
        ease: ease || (q => (q < 0.5 ? 2 * q * q : 1 - Math.pow(-2 * q + 2, 2) / 2)),
        res
      });
    });
  const settled = () => {
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const t = B[r][c];
        if (t && (Math.abs(t.y - r) > 0.001 || Math.abs(t.x - c) > 0.001)) return false;
      }
    return !TW.length;
  };
  const waitSettle = () =>
    new Promise(res => {
      const f = () => {
        if (id != RUN) return;
        if (settled()) res();
        else setTimeout(f, 30);
      };
      f();
    });
  const cx = c => PAD + c * cs + cs / 2,
    cy = r => PAD + r * cs + cs / 2;
  const burst = (r, c, col, n) => {
    for (let i = 0; i < (n || 9); i++) {
      const a = R() * TAU,
        v = ((70 + R() * 190) * cs) / 45;
      PT.push({
        x: cx(c) + (R() - 0.5) * cs * 0.3,
        y: cy(r) + (R() - 0.5) * cs * 0.3,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 60,
        l: 0,
        L: 0.45 + R() * 0.45,
        c: i % 4 == 0 ? '#fff' : col,
        r: ((2.2 + R() * 3.2) * cs) / 45,
        sd: i % 4 != 0,
        ro: R() * TAU,
        vr: (R() - 0.5) * 14,
        st: i % 4 == 0
      });
    }
  };
  const say = (txt, col, big, c2) => {
    TX.push({ x: BS / 2, y: BS * 0.45, txt, col, c2, l: 0, big, word: 1 });
    for (let i = 0; i < 18; i++) {
      const a = R() * TAU,
        v = ((120 + R() * 220) * cs) / 45;
      PT.push({
        x: BS / 2 + Math.cos(a) * cs,
        y: BS * 0.45 + Math.sin(a) * cs * 0.4,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 60,
        l: 0,
        L: 0.6 + R() * 0.5,
        c: ['#fff', '#ffe14a', '#ff7ab6', '#7fd8ff'][i % 4],
        r: ((2 + R() * 3) * cs) / 45,
        st: 1
      });
    }
  };
  const pts = (r, c, v, col, dk) => TX.push({ x: cx(c), y: cy(r), txt: String(v), col, dk, l: 0 });
  // audio
  const AC = eggAC(),
    tone = (f, d, tp, v, sl) => {
      if (!AC || S.sound === false) return;
      const t = AC.currentTime,
        o = AC.createOscillator(),
        g = AC.createGain();
      o.type = tp || 'sine';
      o.frequency.setValueAtTime(f, t);
      if (sl) o.frequency.exponentialRampToValueAtTime(sl, t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v || 0.07, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(AC.destination);
      o.start(t);
      o.stop(t + d + 0.02);
    };
  const popS = n => {
    const f = [523, 587, 659, 698, 784, 880, 988, 1046][Math.min(7, n)];
    tone(f, 0.14, 'triangle', 0.07);
    tone(f * 2, 0.08, 'sine', 0.03);
  };
  // ---------- clearing ----------
  const clearSet = (set, src) => {
    // set: Map key->delay(ms)
    const q = [...set.keys()],
      done = new Map();
    let maxD = 0;
    const add = (k, d) => {
      if (!done.has(k) && !set.has(k)) {
        set.set(k, d);
        q.push(k);
      } else if (set.has(k) && set.get(k) > d) set.set(k, d);
    };
    while (q.length) {
      const k = q.shift();
      if (done.has(k)) continue;
      const [r, c] = RC(k),
        t = B[r][c];
      const d = set.get(k) || 0;
      done.set(k, d);
      if (!t || t.sp == 'egg') {
        set.delete(k);
        continue;
      }
      if (t.sp && !t.used) {
        t.used = 1;
        const sp = t.sp;
        if (sp == 'h') {
          FX.push({ k: 'beam', d: 'h', r, c, col: BASE[t.c], t: -d / 1000 });
          for (let i = 0; i < N; i++) add(K(r, i), d + Math.abs(i - c) * 35);
        } else if (sp == 'v') {
          FX.push({ k: 'beam', d: 'v', r, c, col: BASE[t.c], t: -d / 1000 });
          for (let i = 0; i < N; i++) add(K(i, c), d + Math.abs(i - r) * 35);
        } else if (sp == 'w') {
          FX.push({ k: 'ring', r, c, col: BASE[t.c], t: -d / 1000, R: 1.7 });
          setTimeout(() => {
            SHK = Math.max(SHK, 0.28);
          }, d / SPD());
          for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (at(r + a, c + b) && (a || b)) add(K(r + a, c + b), d + 60);
          if (!t.armed) {
            t.armed = 1;
            t.used = 0;
            set.delete(k);
            done.delete(k);
            done.set(k, -1);
            continue;
          }
        } else if (sp == 'b') {
          const col =
            t.bc != null
              ? t.bc
              : (() => {
                  const cs2 = [];
                  B.forEach(row =>
                    row.forEach(u => {
                      if (u && u.c >= 0) cs2.push(u.c);
                    })
                  );
                  return cs2.length ? cs2[rnd(cs2.length)] : 0;
                })();
          const tg = [];
          B.forEach((row, a) =>
            row.forEach((u, b) => {
              if (u && u.c == col && u !== t) tg.push([a, b]);
            })
          );
          FX.push({ k: 'bolt', r, c, tg, col: BASE[col], t: -d / 1000 });
          SHK = Math.max(SHK, 0.2);
          tg.forEach(([a, b], i) => {
            const u = B[a][b];
            if (u) u.hl = 1;
            add(K(a, b), d + 180 + i * 25);
          });
        } else if (sp == 'f') {
          const n = t.fn || 3,
            tg = [];
          const pool = [];
          B.forEach((row, a) =>
            row.forEach((u, b) => {
              if (u && u.sp != 'egg' && !set.has(K(a, b)) && u !== t) pool.push([a, b]);
            })
          );
          shuffle(pool);
          for (let i = 0; i < n && i < pool.length; i++) {
            const [a, b] = pool[i];
            tg.push([a, b]);
            if (t.fp) {
              const u = B[a][b];
              if (u && !u.sp) {
                u.sp = t.fp == 's' ? (R() < 0.5 ? 'h' : 'v') : t.fp;
                u.c = u.c < 0 ? 0 : u.c;
              }
            }
            FX.push({ k: 'fish', r, c, a, b, col: t.c, t: -d / 1000 - i * 0.06, ph: R() * TAU });
            const u2 = B[a][b];
            if (u2)
              setTimeout(
                () => {
                  u2.hl = 1;
                },
                (d + 250) / SPD()
              );
            add(K(a, b), d + 600 + i * 60);
          }
        }
      }
    }
    let n = 0;
    set.forEach((d, k) => {
      const [r, c] = RC(k),
        t = B[r][c];
      if (!t) return;
      if (t.sp == 'w' && t.armed && !t.used2) {
        /* armed wrapped hit again -> second blast later handled */
      }
      if (t.sp == 'w' && t.armed && d === -1) return;
      B[r][c] = null;
      t.dieAt = d / 1000;
      t.dt = 0;
      dying.push(t);
      maxD = Math.max(maxD, d);
      n++;
      if (!t.mergeTo)
        setTimeout(() => {
          if (id == RUN) burst(r, c, t.sp == 'b' ? '#a86b45' : BASE[Math.max(0, t.c)], 9);
        }, d / SPD());
    });
    return { n, maxD };
  };

  // ---------- resolve ----------
  const createSpecial = (g, swapK) => {
    if (!g.kind) return null;
    const ks = [...g.set];
    let pk = swapK != null && g.set.has(swapK) ? swapK : null;
    if (pk == null) {
      if (g.kind == 'w') {
        const h = g.runs.find(r => r.d == 'h'),
          v = g.runs.find(r => r.d == 'v');
        const hs = new Set(h.cells.map(([a, b]) => K(a, b)));
        const it = v.cells.map(([a, b]) => K(a, b)).find(k => hs.has(k));
        pk = it != null ? it : ks[0];
      } else {
        const L = g.runs.sort((a, b) => b.cells.length - a.cells.length)[0];
        pk = L ? K(...L.cells[Math.floor(L.cells.length / 2)]) : ks[0];
      }
    }
    const [r, c] = RC(pk),
      t = B[r][c];
    if (t && t.sp) {
      const alt = ks.find(k => {
        const [a, b] = RC(k);
        return B[a][b] && !B[a][b].sp;
      });
      if (alt == null) return null;
      pk = alt;
    }
    return { k: pk, kind: g.kind, col: g.col };
  };
  const resolve = async swapKs => {
    cascade = 0;
    for (;;) {
      if (id != RUN) return;
      const gs = groups();
      const armed = [];
      B.forEach((row, r) =>
        row.forEach((t, c) => {
          if (t && t.sp == 'w' && t.armed) armed.push([r, c]);
        })
      );
      if (!gs.length && !armed.length) break;
      cascade++;
      const set = new Map(),
        news = [];
      let gain = 0;
      gs.forEach(g => {
        const sp = createSpecial(g, cascade == 1 && swapKs ? swapKs.find(k => g.set.has(k)) : null);
        g.set.forEach(k => set.set(k, 0));
        if (sp) {
          set.delete(sp.k);
          news.push(sp);
          const [sr, sc2] = RC(sp.k);
          g.set.forEach(k => {
            if (k == sp.k) return;
            const [a, b] = RC(k),
              u = B[a][b];
            if (u && !u.sp) u.mergeTo = [sr, sc2];
          });
        }
        const n = g.set.size,
          v = (n <= 3 ? 60 : n == 4 ? 120 : n == 5 ? 200 : n * 40) * cascade;
        gain += v;
        const ks = [...g.set],
          [mr, mc] = RC(ks[Math.floor(ks.length / 2)]);
        pts(mr, mc, v, BASE[g.col], DRK[g.col]);
      });
      armed.forEach(([r, c]) => {
        const t = B[r][c];
        t.sp = 'w';
        t.used = 0;
        t.armed = 0;
        t.final = 1;
        FX.push({ k: 'ring', r, c, col: BASE[t.c], t: 0, R: 1.9 });
        SHK = Math.max(SHK, 0.32);
        for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (at(r + a, c + b)) set.set(K(r + a, c + b), 60);
        t.sp = null;
      });
      news.forEach(sp => {
        const [r, c] = RC(sp.k),
          t = B[r][c];
        if (t && !t.sp) {
          /* turn the candy into the special */
        }
      });
      const res = clearSet(set);
      gain += res.n * 20 * (cascade > 1 ? cascade - 1 : 0) + res.n * 10;
      news.forEach(sp => {
        const [r, c] = RC(sp.k);
        let t = B[r][c];
        if (!t) {
          t = mk(sp.col);
          t.x = c;
          t.y = r;
          B[r][c] = t;
        }
        t.c = sp.col;
        t.sp = sp.kind == 'b' ? 'b' : sp.kind;
        t.used = 0;
        t.armed = 0;
        if (t.sp == 'b') t.c = -2;
        t.s = 1.5;
        tween(t, { s: 1 }, 300, q => 1 - Math.pow(1 - q, 3));
        gain += sp.kind == 'b' ? 200 : sp.kind == 'w' ? 150 : 120;
        if (sp.kind == 'b') ACH('candyBomb');
        tone(sp.kind == 'b' ? 880 : 660, 0.3, 'sine', 0.06, sp.kind == 'b' ? 1760 : 1320);
        FX.push({ k: 'make', r, c, col: sp.kind == 'b' ? '#ffe14a' : BASE[sp.col], t: -0.12 });
        setTimeout(() => {
          if (id == RUN) burst(r, c, '#fff', 10);
        }, 120 / SPD());
      });
      score += gain;
      popS(cascade);
      upd();
      if (cascade >= 5) ACH('candyDivin');
      if (cascade == 2) say('Sucré !', '#ff7ab6', 0, '#c2187a');
      else if (cascade == 3) say('Savoureux !', '#ffb020', 0, '#d0510a');
      else if (cascade == 4) say('Délicieux !', '#3fe08a', 1, '#0d8a4a');
      else if (cascade >= 5) say('Divin !', '#c58bff', 1, '#6a1fc2');
      await sleep(res.maxD + 260);
      await gravity();
    }
  };
  const gravity = async () => {
    for (let c = 0; c < N; c++) {
      let w = N - 1;
      for (let r = N - 1; r >= 0; r--) {
        const t = B[r][c];
        if (t) {
          if (w != r) {
            B[w][c] = t;
            B[r][c] = null;
          }
          w--;
        }
      }
      let k = 0;
      for (let r = w; r >= 0; r--) {
        const t = mk(rnd(NC));
        t.x = c;
        t.y = -1 - k - R() * 0.15;
        k++;
        B[r][c] = t;
      }
    }
    await waitSettle();
    await checkEgg();
  };
  const checkEgg = async () => {
    for (let c = 0; c < N; c++) {
      const t = B[N - 1][c];
      if (t && t.sp == 'egg' && !eggDone) {
        eggDone = true;
        tone(784, 0.2, 'triangle', 0.08);
        await tween(t, { y: N - 1 + 0.35, s: 1.25 }, 200);
        await tween(t, { y: N + 1.2, a: 0, s: 0.6 }, 420);
        B[N - 1][c] = null;
        EGG(18);
        const n = mk(rnd(NC));
        n.x = c;
        n.y = -1;
        B[0][c] = n;
        await gravity();
      }
    }
  };
  const upd = () => {
    $('#ccs').textContent = score;
    $('#ccm').textContent = moves;
    $('#ccb').style.width = Math.min(100, (score / STS[2]) * 100) + '%';
    el.querySelectorAll('.cc-bar u').forEach((u, i) => {
      if (score >= STS[i] && !u.classList.contains('on')) {
        u.classList.add('on');
        if (i >= starsGot) {
          starsGot = i + 1;
          tone(1046 + i * 200, 0.35, 'triangle', 0.07);
          say(['Objectif atteint ! ⭐', '⭐⭐', '⭐⭐⭐'][i], '#ffe14a', 1);
        }
      }
    });
    const mm = $('#ccm');
    if (mm) mm.parentElement.classList.toggle('low', moves <= 5);
  };
  // ---------- combos ----------
  const doCombo = async (a, b) => {
    const t1 = at(...a),
      t2 = at(...b),
      set = new Map(),
      [r, c] = b;
    const S1 = t1.sp,
      S2 = t2.sp;
    let note = '';
    const kinds = [S1, S2].sort().join('');
    if (S1 == 'b' && S2 == 'b') {
      note = 'Méga explosion !';
      ACH('candyMega');
      SHK = 0.7;
      FX.push({ k: 'flash', t: 0 });
      B.forEach((row, i) =>
        row.forEach((u, j) => {
          if (u && u.sp != 'egg') set.set(K(i, j), Math.hypot(i - r, j - c) * 45);
        })
      );
      t1.used = t2.used = 1;
      FX.push({ k: 'ring', r, c, col: '#fff', t: 0, R: 9 });
    } else if (S1 == 'b' || S2 == 'b') {
      const bomb = S1 == 'b' ? t1 : t2,
        o = S1 == 'b' ? t2 : t1,
        col = o.c;
      bomb.used = 1;
      const tg = [];
      B.forEach((row, i) =>
        row.forEach((u, j) => {
          if (u && u.c == col) tg.push([i, j]);
        })
      );
      const bk = S1 == 'b' ? a : b;
      FX.push({ k: 'bolt', r: bk[0], c: bk[1], tg, t: 0 });
      set.set(K(...bk), 0);
      if (!o.sp) tg.forEach(([i, j], n) => set.set(K(i, j), 180 + n * 30));
      else {
        note = o.sp == 'w' ? 'Bonbons emballés partout !' : o.sp == 'f' ? 'Banc de poissons !' : 'Rayures partout !';
        tg.forEach(([i, j]) => {
          const u = B[i][j];
          u.sp = o.sp == 'h' || o.sp == 'v' ? (R() < 0.5 ? 'h' : 'v') : o.sp;
          u.used = 0;
          u.s = 1.4;
          tween(u, { s: 1 }, 300);
        });
        await sleep(420);
        tg.forEach(([i, j], n) => set.set(K(i, j), n * 70));
      }
    } else if (kinds == 'hh' || kinds == 'hv' || kinds == 'vv') {
      t1.used = t2.used = 1;
      note = '';
      SHK = 0.25;
      FX.push({ k: 'beam', d: 'h', r, c, col: '#fff', t: 0 }, { k: 'beam', d: 'v', r, c, col: '#fff', t: 0 });
      for (let i = 0; i < N; i++) {
        set.set(K(r, i), Math.abs(i - c) * 35);
        set.set(K(i, c), Math.abs(i - r) * 35);
      }
    } else if (kinds == 'hw' || kinds == 'vw') {
      t1.used = t2.used = 1;
      note = 'Croix géante !';
      SHK = 0.4;
      for (let o = -1; o <= 1; o++) {
        FX.push({ k: 'beam', d: 'h', r: r + o, c, col: '#fff', t: 0 }, { k: 'beam', d: 'v', r, c: c + o, col: '#fff', t: 0 });
        for (let i = 0; i < N; i++) {
          if (at(r + o, i)) set.set(K(r + o, i), Math.abs(i - c) * 35);
          if (at(i, c + o)) set.set(K(i, c + o), Math.abs(i - r) * 35);
        }
      }
    } else if (kinds == 'ww') {
      t1.used = t2.used = 1;
      note = 'Boum !';
      SHK = 0.5;
      FX.push({ k: 'ring', r, c, col: '#fff', t: 0, R: 2.6 });
      for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (at(r + i, c + j)) set.set(K(r + i, c + j), Math.hypot(i, j) * 60);
    } else {
      const f = S1 == 'f' ? t1 : t2,
        o = S1 == 'f' ? t2 : t1;
      if (o.sp == 'f') {
        f.fn = 6;
        o.used = 1;
        note = 'Banc de poissons !';
      } else {
        f.fp = o.sp == 'w' ? 'w' : 's';
        o.used = 1;
        f.fn = 3;
        note = o.sp == 'w' ? 'Poissons bombes !' : 'Poissons rayés !';
      }
      set.set(K(...(S1 == 'f' ? a : b)), 0);
      set.set(K(...(S1 == 'f' ? b : a)), 0);
    }
    if (note) say(note, '#fff', 1);
    tone(220, 0.5, 'sawtooth', 0.05, 880);
    const res = clearSet(set);
    score += res.n * 40 + 300;
    upd();
    await sleep(res.maxD + 300);
    await gravity();
    await resolve(null);
  };
  // ---------- turn ----------
  const turn = async (a, b, forced) => {
    if (busy || over) return;
    const t1 = at(...a),
      t2 = at(...b);
    if (!t1 || !t2) return;
    busy = true;
    sel = null;
    swapCells(a, b);
    await Promise.all([tween(t1, { x: b[1], y: b[0] }, 170), tween(t2, { x: a[1], y: a[0] }, 170)]);
    const combo = !forced && isCombo(t1, t2),
      ok = combo || anyMatch() || forced;
    if (!ok) {
      tone(180, 0.15, 'square', 0.04);
      swapCells(a, b);
      await Promise.all([tween(t1, { x: a[1], y: a[0] }, 170), tween(t2, { x: b[1], y: b[0] }, 170)]);
      busy = false;
      return;
    }
    if (!forced) moves--;
    upd();
    if (combo) {
      await doCombo(b, a);
    } else {
      const ks = [K(...a), K(...b)];
      await resolve(ks);
    }
    await checkEgg();
    if (!findMove()) {
      say('Mélange !', '#fff', 1);
      await shuffleBoard();
    }
    busy = false;
    if (moves <= 0) await end();
  };
  const shuffleBoard = async () => {
    let tries = 0;
    do {
      const all = [];
      B.forEach(row =>
        row.forEach(t => {
          if (t && t.sp != 'egg') all.push(t);
        })
      );
      shuffle(all);
      let i = 0;
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (B[r][c] && B[r][c].sp != 'egg') B[r][c] = all[i++];
    } while (++tries < 40 && (anyMatch() || !findMove()));
    const ps = [];
    B.forEach((row, r) =>
      row.forEach((t, c) => {
        if (t) ps.push(tween(t, { x: c, y: r }, 450));
      })
    );
    await Promise.all(ps);
    if (anyMatch()) await resolve(null);
  };
  const end = async () => {
    if (over) return;
    busy = true;
    if (score < TG && !revived && (S.gem || 0) >= 1) {
      const y = await askRevive();
      if (y && id == RUN) {
        revived = true;
        S.gem--;
        save();
        moves += 5;
        upd();
        say('+5 coups !', '#ffe14a', 1, '#d0510a');
        busy = false;
        return;
      }
    }
    const sp = [];
    B.forEach((row, r) =>
      row.forEach((t, c) => {
        if (t && t.sp && t.sp != 'egg') sp.push([r, c]);
      })
    );
    if (sp.length) {
      say('Sugar Crush !', '#ff7ab6', 1);
      tone(523, 0.2, 'triangle', 0.08);
      setTimeout(() => tone(784, 0.4, 'triangle', 0.08), 180);
      await sleep(700);
      for (const [r, c] of sp) {
        const t = B[r][c];
        if (!t || !t.sp || t.sp == 'egg') continue;
        const res = clearSet(new Map([[K(r, c), 0]]));
        score += res.n * 30;
        upd();
        await sleep(res.maxD + 200);
        await gravity();
        await resolve(null);
      }
    }
    over = true;
    REC(score);
    if (score >= STS[2]) ACH('candy3');
    if (score >= 30000) ACH('candy30');
    await sleep(500);
    if (id != RUN) return;
    if (score >= TG) {
      try {
        SFX('win');
      } catch (_) {}
      win();
    } else fail(`il manquait ${TG - score} points (${score} / ${TG})`);
  };
  // ---------- input ----------
  const cell = e => {
    const r0 = cv.getBoundingClientRect(),
      px = (e.clientX - r0.left) * (BS / r0.width) - PAD,
      py = (e.clientY - r0.top) * (BS / r0.height) - PAD;
    return [Math.floor(py / cs), Math.floor(px / cs)];
  };
  let down = null;
  const freeTxt = st => {
    const f = $('#ccf');
    if (!f) return;
    if (!st) {
      f.hidden = true;
      return;
    }
    f.hidden = false;
    f.innerHTML =
      st == 1
        ? `<b>💡 Échange libre</b><span>1. Touche un premier bonbon.<br>2. Touche un deuxième bonbon, <b>n'importe où</b> sur la grille.<br>Ils échangent leur place, et ça ne coûte <b>aucun coup</b> !</span>`
        : `<b>💡 Échange libre</b><span>Super ! Maintenant touche le bonbon avec lequel l'échanger.<br><small>(Touche le même bonbon pour changer d'avis.)</small></span>`;
    f.animate(
      [
        { transform: 'scale(.92)', opacity: 0.4 },
        { transform: 'scale(1)', opacity: 1 }
      ],
      { duration: 260, easing: 'cubic-bezier(.2,1.5,.4,1)' }
    );
  };
  cv.onpointerdown = e => {
    if (id != RUN || busy || over) return;
    e.preventDefault();
    const [r, c] = cell(e);
    if (!at(r, c)) return;
    try {
      cv.setPointerCapture(e.pointerId);
    } catch (_) {}
    if (free) {
      if (!sel) {
        sel = [r, c];
        tone(660, 0.06, 'sine', 0.05);
        freeTxt(2);
      } else {
        const a = sel;
        if (a[0] == r && a[1] == c) {
          sel = null;
          freeTxt(1);
          return;
        }
        sel = null;
        free = false;
        freeTxt(0);
        turn(a, [r, c], true);
      }
      return;
    }
    if (sel && Math.abs(sel[0] - r) + Math.abs(sel[1] - c) == 1) {
      const a = sel;
      sel = null;
      turn(a, [r, c]);
      return;
    }
    sel = [r, c];
    down = { r, c, x: e.clientX, y: e.clientY };
    tone(660, 0.05, 'sine', 0.04);
  };
  cv.onpointermove = e => {
    if (!down || busy || free) return;
    const dx = e.clientX - down.x,
      dy = e.clientY - down.y,
      th = cs * 0.35 * (cv.getBoundingClientRect().width / BS);
    if (Math.max(Math.abs(dx), Math.abs(dy)) < th) return;
    const [r, c] = [down.r, down.c],
      b = Math.abs(dx) > Math.abs(dy) ? [r, c + Math.sign(dx)] : [r + Math.sign(dy), c];
    down = null;
    if (at(...b)) {
      sel = null;
      turn([r, c], b);
    }
  };
  cv.onpointerup = cv.onpointercancel = () => {
    down = null;
  };
  // ---------- render ----------
  let last = performance.now(),
    idle = 0;
  const loop = now => {
    if (id != RUN) return;
    const dt = Math.min(0.05, (now - last) / 1000) * SPD();
    last = now;
    for (let i = TW.length - 1; i >= 0; i--) {
      const w = TW[i];
      w.t += dt;
      const q = Math.min(1, w.t / w.d),
        e = w.ease(q);
      for (const k in w.to) w.o[k] = w.from[k] + (w.to[k] - w.from[k]) * e;
      if (q >= 1) {
        TW.splice(i, 1);
        w.res();
      }
    }
    const inTw = new Set(TW.map(w => w.o));
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const t = B[r][c];
        if (!t || inTw.has(t)) continue;
        if (t.x != c) ((t.x += (c - t.x) * Math.min(1, dt * 14)), Math.abs(t.x - c) < 0.01 && (t.x = c));
        if (t.y < r) {
          t.vy += 34 * dt;
          t.y += t.vy * dt;
          if (t.y >= r) {
            t.y = r;
            if (t.vy > 3) t.sq = Math.min(0.25, t.vy * 0.025);
            t.vy = 0;
          }
        } else if (t.y > r) {
          t.y = r;
        }
        if (t.sq > 0) t.sq = Math.max(0, t.sq - dt * 1.6);
      }
    x.clearRect(0, 0, BS, BS);
    x.save();
    if (SHK > 0) {
      SHK = Math.max(0, SHK - dt);
      const m = cs * 0.22 * Math.min(1, SHK / 0.3);
      x.translate((R() - 0.5) * m, (R() - 0.5) * m);
    }
    x.save();
    x.fillStyle = '#ffffff26';
    x.beginPath();
    x.roundRect(0, 0, BS, BS, 16);
    x.fill();
    x.restore();
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        x.fillStyle = (r + c) % 2 ? '#ffffff1c' : '#ffffff36';
        x.beginPath();
        x.roundRect(PAD + c * cs + 1, PAD + r * cs + 1, cs - 2, cs - 2, cs * 0.18);
        x.fill();
      }
    if (sel) {
      x.save();
      x.strokeStyle = free ? '#ffe14a' : '#fff';
      x.lineWidth = 3;
      x.shadowColor = free ? '#ffe14a' : '#fff';
      x.shadowBlur = 12;
      x.beginPath();
      x.roundRect(PAD + sel[1] * cs + 2, PAD + sel[0] * cs + 2, cs - 4, cs - 4, cs * 0.2);
      x.stroke();
      x.restore();
    }
    const hint = !busy && !over && (idle += dt) > 6 ? findMove() : null;
    if (busy) idle = 0;
    const drawT = (t, extraS) => {
      const img = sprOf(t),
        sz = cs * 1.3;
      let s = t.s * (extraS || 1);
      const sx = s * (1 + t.sq),
        sy = s * (1 - t.sq);
      x.save();
      x.globalAlpha = t.a;
      x.translate(PAD + t.x * cs + cs / 2, PAD + t.y * cs + cs / 2 + t.sq * cs * 0.2);
      if (t.sp == 'b') x.rotate(now / 900);
      if (t.sp == 'egg') {
        x.rotate(Math.sin(now / 300) * 0.08);
      }
      if (t.sp == 'f') x.translate(0, Math.sin(now / 250 + t.ph) * cs * 0.03);
      if (t.hl) x.translate((R() - 0.5) * cs * 0.06, (R() - 0.5) * cs * 0.06);
      if (t.armed) {
        const k3 = 1 + Math.sin(now / 60) * 0.07;
        x.scale(k3, k3);
      }
      x.scale(sx, sy);
      x.drawImage(img, -sz / 2, -sz / 2, sz, sz);
      const fl = t.fl || (t.hl ? 0.45 + Math.sin(now / 45) * 0.35 : 0);
      if (fl > 0) {
        x.globalCompositeOperation = 'lighter';
        x.globalAlpha = Math.min(1, fl);
        x.drawImage(img, -sz / 2, -sz / 2, sz, sz);
        x.globalAlpha = t.a;
        x.globalCompositeOperation = 'source-over';
      }
      if (t.armed) {
        x.globalCompositeOperation = 'lighter';
        x.globalAlpha = 0.4 + Math.sin(now / 80) * 0.3;
        x.drawImage(img, -sz / 2, -sz / 2, sz, sz);
      }
      x.restore();
    };
    x.save();
    x.beginPath();
    x.rect(0, PAD - 2, BS, BS);
    x.clip();
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        const t = B[r][c];
        if (!t) continue;
        let es = 1;
        if (hint && ((hint[0][0] == r && hint[0][1] == c) || (hint[1][0] == r && hint[1][1] == c))) es = 1 + Math.sin(now / 150) * 0.08;
        if (sel && sel[0] == r && sel[1] == c) es = 1.08;
        drawT(t, es);
      }
    for (let i = dying.length - 1; i >= 0; i--) {
      const t = dying[i];
      t.dt += dt;
      const q = t.dt - t.dieAt;
      if (q < 0) {
        drawT(t);
        continue;
      }
      if (q > 0.26) {
        dying.splice(i, 1);
        continue;
      }
      if (t.mergeTo) {
        const k4 = Math.min(1, dt * 18);
        t.x += (t.mergeTo[1] - t.x) * k4;
        t.y += (t.mergeTo[0] - t.y) * k4;
        t.s = 1 - q * 2.4;
        t.a = 1 - q / 0.26;
        t.fl = 0.3;
      } else {
        t.s = q < 0.07 ? 1 + q * 3.4 : 1.24 * (1 - (q - 0.07) / 0.19);
        t.a = 1 - Math.max(0, (q - 0.12) / 0.14);
        t.fl = q < 0.12 ? (1 - q / 0.12) * 0.95 : 0;
      }
      drawT(t);
    }
    x.restore();
    for (let i = FX.length - 1; i >= 0; i--) {
      const f = FX[i];
      f.t += dt;
      if (f.t < 0) continue;
      const L =
        f.k == 'beam'
          ? N / 28.6 + 0.35
          : f.k == 'bolt'
            ? 0.3 + (f.tg ? f.tg.length : 0) * 0.025 + 0.45
            : f.k == 'fish'
              ? 0.62
              : f.k == 'make'
                ? 0.45
                : f.k == 'flash'
                  ? 0.6
                  : 0.6;
      if (f.t > L) {
        FX.splice(i, 1);
        continue;
      }
      const q = f.t / L;
      x.save();
      x.globalCompositeOperation = 'lighter';
      if (f.k == 'beam') {
        const hd = f.t * 28.6,
          X0 = cx(f.c),
          Y0 = cy(f.r),
          fade = Math.max(0, 1 - Math.max(0, f.t - N / 28.6 + 0.05) / 0.3),
          wd = cs * (f.w || 1);
        x.globalAlpha = fade;
        if (f.t < 0.15) {
          const gl = x.createRadialGradient(X0, Y0, 0, X0, Y0, cs * 1.2);
          gl.addColorStop(0, '#fff');
          gl.addColorStop(0.4, f.col);
          gl.addColorStop(1, '#0000');
          x.fillStyle = gl;
          x.globalAlpha = fade * (1 - f.t / 0.15);
          x.beginPath();
          x.arc(X0, Y0, cs * 1.2, 0, TAU);
          x.fill();
          x.globalAlpha = fade;
        }
        for (const dir of [-1, 1]) {
          const lim = f.d == 'h' ? (dir < 0 ? X0 - PAD : BS - PAD - X0) : dir < 0 ? Y0 - PAD : BS - PAD - Y0,
            len = Math.min(hd * cs, lim + cs * 0.5),
            X1 = f.d == 'h' ? X0 + dir * len : X0,
            Y1 = f.d == 'h' ? Y0 : Y0 + dir * len;
          const g =
            f.d == 'h'
              ? x.createLinearGradient(0, Y0 - wd * 0.42, 0, Y0 + wd * 0.42)
              : x.createLinearGradient(X0 - wd * 0.42, 0, X0 + wd * 0.42, 0);
          g.addColorStop(0, '#0000');
          g.addColorStop(0.25, f.col);
          g.addColorStop(0.5, '#fff');
          g.addColorStop(0.75, f.col);
          g.addColorStop(1, '#0000');
          x.fillStyle = g;
          if (f.d == 'h') x.fillRect(Math.min(X0, X1), Y0 - wd * 0.42, Math.abs(X1 - X0), wd * 0.84);
          else x.fillRect(X0 - wd * 0.42, Math.min(Y0, Y1), wd * 0.84, Math.abs(Y1 - Y0));
          if (hd * cs < lim + cs) {
            const hg = x.createRadialGradient(X1, Y1, 0, X1, Y1, wd * 0.75);
            hg.addColorStop(0, '#fff');
            hg.addColorStop(0.35, f.col);
            hg.addColorStop(1, '#0000');
            x.fillStyle = hg;
            x.beginPath();
            x.arc(X1, Y1, wd * 0.75, 0, TAU);
            x.fill();
            if (R() < 0.9)
              PT.push({
                x: X1,
                y: Y1,
                vx: ((f.d == 'h' ? -dir * 60 : (R() - 0.5) * 160) * cs) / 45,
                vy: ((f.d == 'v' ? -dir * 60 : (R() - 0.5) * 160) * cs) / 45,
                l: 0,
                L: 0.3 + R() * 0.25,
                c: R() < 0.5 ? '#fff' : f.col,
                r: ((1.5 + R() * 2) * cs) / 45,
                st: 1,
                ng: 1
              });
          }
        }
      } else if (f.k == 'ring') {
        const e = 1 - Math.pow(1 - q, 3),
          X0 = cx(f.c),
          Y0 = cy(f.r),
          RR = cs * f.R;
        if (q < 0.3) {
          const fg = x.createRadialGradient(X0, Y0, 0, X0, Y0, RR * (0.6 + q * 1.6));
          fg.addColorStop(0, '#fff');
          fg.addColorStop(0.5, f.col);
          fg.addColorStop(1, '#0000');
          x.globalAlpha = 1 - q / 0.3;
          x.fillStyle = fg;
          x.beginPath();
          x.arc(X0, Y0, RR * (0.6 + q * 1.6), 0, TAU);
          x.fill();
        }
        x.globalAlpha = 1 - q;
        x.strokeStyle = f.col;
        x.lineWidth = cs * 0.4 * (1 - q);
        x.beginPath();
        x.arc(X0, Y0, RR * 1.15 * e + 2, 0, TAU);
        x.stroke();
        x.strokeStyle = '#fff';
        x.lineWidth = cs * 0.12 * (1 - q);
        x.beginPath();
        x.arc(X0, Y0, RR * 0.95 * e + 2, 0, TAU);
        x.stroke();
        x.lineCap = 'round';
        for (let k = 0; k < 14; k++) {
          const an = (k / 14) * TAU + f.r,
            r1 = RR * 0.35 * e,
            r2 = RR * (0.5 + e * 0.9);
          x.strokeStyle = k % 2 ? '#fff' : f.col;
          x.lineWidth = cs * 0.08 * (1 - q);
          x.beginPath();
          x.moveTo(X0 + Math.cos(an) * r1, Y0 + Math.sin(an) * r1);
          x.lineTo(X0 + Math.cos(an) * r2, Y0 + Math.sin(an) * r2);
          x.stroke();
        }
        if (f.t < dt * 1.5)
          for (let k = 0; k < 16; k++) {
            const an = R() * TAU,
              v = ((150 + R() * 200) * cs) / 45;
            PT.push({
              x: X0,
              y: Y0,
              vx: Math.cos(an) * v,
              vy: Math.sin(an) * v,
              l: 0,
              L: 0.5 + R() * 0.3,
              c: k % 2 ? '#fff' : f.col,
              r: ((2 + R() * 2.5) * cs) / 45,
              st: 1
            });
          }
      } else if (f.k == 'bolt') {
        const X0 = cx(f.c),
          Y0 = cy(f.r),
          rr2 = cs * (0.7 + Math.sin(f.t * 30) * 0.08);
        const bg = x.createRadialGradient(X0, Y0, 0, X0, Y0, rr2 * 1.6);
        bg.addColorStop(0, '#fff');
        bg.addColorStop(0.35, f.col || '#bfe3ff');
        bg.addColorStop(1, '#0000');
        x.globalAlpha = Math.min(1, (1 - q) * 2);
        x.fillStyle = bg;
        x.beginPath();
        x.arc(X0, Y0, rr2 * 1.6, 0, TAU);
        x.fill();
        x.lineCap = 'round';
        x.lineJoin = 'round';
        (f.tg || []).forEach(([a, b], ii) => {
          const ta = 0.08 + ii * 0.025,
            u = f.t - ta;
          if (u < 0 || u > 0.5) return;
          const X2 = cx(b),
            Y2 = cy(a),
            gr2 = Math.min(1, u / 0.06),
            ex = X0 + (X2 - X0) * gr2,
            ey = Y0 + (Y2 - Y0) * gr2;
          x.globalAlpha = 1 - Math.max(0, (u - 0.3) / 0.2);
          const path = () => {
            x.beginPath();
            x.moveTo(X0, Y0);
            const sg = 6;
            for (let s2 = 1; s2 <= sg; s2++) {
              const v = s2 / sg,
                jx = s2 < sg ? (R() - 0.5) * cs * 0.45 : 0,
                jy = s2 < sg ? (R() - 0.5) * cs * 0.45 : 0;
              x.lineTo(X0 + (ex - X0) * v + jx, Y0 + (ey - Y0) * v + jy);
            }
          };
          x.shadowColor = f.col || '#bfe3ff';
          x.shadowBlur = cs * 0.4;
          x.strokeStyle = f.col || '#bfe3ff';
          x.lineWidth = cs * 0.14;
          path();
          x.stroke();
          x.shadowBlur = 0;
          x.strokeStyle = '#fff';
          x.lineWidth = cs * 0.05;
          path();
          x.stroke();
          if (gr2 >= 1) {
            const hg = x.createRadialGradient(X2, Y2, 0, X2, Y2, cs * 0.6);
            hg.addColorStop(0, '#fffc');
            hg.addColorStop(1, '#0000');
            x.fillStyle = hg;
            x.beginPath();
            x.arc(X2, Y2, cs * 0.6, 0, TAU);
            x.fill();
          }
        });
      } else if (f.k == 'fish') {
        x.globalCompositeOperation = 'source-over';
        const e = q < 0.15 ? 0 : Math.min(1, (q - 0.15) / 0.75),
          ee = e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2,
          X = cx(f.c) + (cx(f.b) - cx(f.c)) * ee,
          Y = cy(f.r) + (cy(f.a) - cy(f.r)) * ee - Math.sin(ee * Math.PI) * cs * 1.6 - (q < 0.15 ? (q / 0.15) * cs * 0.4 : 0);
        const ang = Math.atan2(cy(f.a) - cy(f.r) - Math.cos(ee * Math.PI) * cs * 1.6, cx(f.b) - cx(f.c)) + Math.PI;
        x.translate(X, Y);
        x.rotate(ang + Math.sin(f.t * 28 + f.ph) * 0.35);
        const sc2 = 1.05 + Math.sin(f.t * 20) * 0.08;
        x.scale(sc2, sc2);
        x.drawImage(SPR[f.col + 'f'], -cs * 0.65, -cs * 0.65, cs * 1.3, cs * 1.3);
        if (R() < 0.5)
          PT.push({
            x: X + (R() - 0.5) * cs * 0.2,
            y: Y + (R() - 0.5) * cs * 0.2,
            vx: (R() - 0.5) * 20,
            vy: -10,
            l: 0,
            L: 0.5 + R() * 0.3,
            c: '#fff',
            r: ((1.5 + R() * 2.5) * cs) / 45,
            bub: 1,
            ng: 1
          });
        if (q > 0.9 && !f.sp2) {
          f.sp2 = 1;
          burst(f.a, f.b, BASE[f.col], 10);
        }
      } else if (f.k == 'make') {
        const X0 = cx(f.c),
          Y0 = cy(f.r),
          RR = cs * (0.4 + q * 0.9);
        x.globalAlpha = 1 - q;
        const mg = x.createRadialGradient(X0, Y0, 0, X0, Y0, RR);
        mg.addColorStop(0, '#fff');
        mg.addColorStop(0.5, f.col);
        mg.addColorStop(1, '#0000');
        x.fillStyle = mg;
        x.beginPath();
        x.arc(X0, Y0, RR, 0, TAU);
        x.fill();
        x.strokeStyle = '#fff';
        x.lineWidth = cs * 0.08 * (1 - q);
        x.beginPath();
        x.arc(X0, Y0, RR * 1.1, 0, TAU);
        x.stroke();
      } else if (f.k == 'flash') {
        x.globalAlpha = (1 - q) * 0.8;
        x.fillStyle = '#fff';
        x.fillRect(0, 0, BS, BS);
      }
      x.restore();
    }
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i];
      p.l += dt;
      if (p.l > p.L) {
        PT.splice(i, 1);
        continue;
      }
      if (p.ng) {
        p.vy -= 40 * dt;
        p.vx *= 0.96;
      } else p.vy += 420 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      x.globalAlpha = 1 - p.l / p.L;
      x.fillStyle = p.c;
      if (p.sd) {
        x.save();
        x.translate(p.x, p.y);
        x.rotate(p.ro + p.l * p.vr);
        x.beginPath();
        x.moveTo(0, -p.r * 1.2);
        x.lineTo(p.r, p.r * 0.8);
        x.lineTo(-p.r * 0.9, p.r * 0.6);
        x.closePath();
        x.fill();
        x.fillStyle = '#ffffff70';
        x.beginPath();
        x.moveTo(0, -p.r * 1.2);
        x.lineTo(p.r * 0.3, 0);
        x.lineTo(-p.r * 0.9, p.r * 0.6);
        x.closePath();
        x.fill();
        x.restore();
      } else if (p.bub) {
        x.strokeStyle = '#ffffffcc';
        x.lineWidth = 1.2;
        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, TAU);
        x.stroke();
      } else if (p.st) {
        x.save();
        x.translate(p.x, p.y);
        x.rotate(p.l * 8);
        x.fillRect(-p.r, -p.r * 0.35, p.r * 2, p.r * 0.7);
        x.fillRect(-p.r * 0.35, -p.r, p.r * 0.7, p.r * 2);
        x.restore();
      } else {
        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, TAU);
        x.fill();
      }
    }
    x.globalAlpha = 1;
    for (let i = TX.length - 1; i >= 0; i--) {
      const t = TX[i];
      t.l += dt;
      const L = t.word ? 1.3 : 0.9;
      if (t.l > L) {
        TX.splice(i, 1);
        continue;
      }
      const q = t.l / L;
      x.save();
      x.globalAlpha = q > 0.7 ? 1 - (q - 0.7) / 0.3 : 1;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      if (t.word) {
        const e =
            q < 0.22
              ? (() => {
                  const u = q / 0.22;
                  return 1 - Math.pow(2, -10 * u) * Math.cos(u * TAU * 1.2);
                })()
              : 1,
          sc = 0.2 + e * 0.95 + Math.max(0, q - 0.7) * 0.4;
        x.translate(t.x, t.y - q * cs * 0.5);
        x.rotate(Math.sin(t.l * 9) * 0.07 * (1 - q));
        x.scale(sc, sc);
        const fs = t.big ? cs * 1.3 : cs * 1.1;
        x.font = `${fs}px 'Lilita One',system-ui,sans-serif`;
        x.lineJoin = 'round';
        const mw = x.measureText(t.txt).width;
        if (mw > BS * 0.74) {
          const k2 = (BS * 0.74) / mw;
          x.scale(k2, k2);
        }
        x.shadowColor = '#0008';
        x.shadowBlur = cs * 0.25;
        x.shadowOffsetY = cs * 0.1;
        x.lineWidth = cs * 0.34;
        x.strokeStyle = '#4a1257';
        x.strokeText(t.txt, 0, 0);
        x.shadowColor = 'transparent';
        x.lineWidth = cs * 0.13;
        x.strokeStyle = '#fff';
        x.strokeText(t.txt, 0, 0);
        const g = x.createLinearGradient(0, -fs * 0.45, 0, fs * 0.4);
        g.addColorStop(0, '#fffbe0');
        g.addColorStop(0.45, t.col);
        g.addColorStop(1, t.c2 || '#c2187a');
        x.fillStyle = g;
        x.fillText(t.txt, 0, 0);
        x.globalCompositeOperation = 'lighter';
        x.globalAlpha *= 0.35;
        x.fillStyle = '#fff';
        x.save();
        x.beginPath();
        x.rect(-mw, -fs, mw * 2, fs * 0.42);
        x.clip();
        x.fillText(t.txt, 0, 0);
        x.restore();
      } else {
        const u = Math.min(1, t.l / 0.18),
          el2 = 1 - Math.pow(2, -9 * u) * Math.cos(u * TAU * 1.1),
          yy = t.y - Math.max(0, q - 0.3) * cs * 1.2;
        x.translate(t.x, yy);
        x.scale(0.3 + el2 * 0.85, 0.3 + el2 * 0.85);
        const fs = cs * 0.82;
        x.font = `${fs}px 'Lilita One',system-ui,sans-serif`;
        x.lineJoin = 'round';
        x.shadowColor = '#0007';
        x.shadowBlur = cs * 0.15;
        x.shadowOffsetY = cs * 0.06;
        x.lineWidth = cs * 0.24;
        x.strokeStyle = t.dk || '#3a0a45';
        x.strokeText(t.txt, 0, 0);
        x.shadowColor = 'transparent';
        x.lineWidth = cs * 0.09;
        x.strokeStyle = '#fff';
        x.strokeText(t.txt, 0, 0);
        const g2 = x.createLinearGradient(0, -fs * 0.45, 0, fs * 0.4);
        g2.addColorStop(0, '#ffffff');
        g2.addColorStop(0.5, t.col);
        g2.addColorStop(1, t.dk || t.col);
        x.fillStyle = g2;
        x.fillText(t.txt, 0, 0);
      }
      x.restore();
    }
    x.restore();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  const boosters = () =>
    new Promise(res => {
      const w = $('#ccw');
      if (!w) return res();
      w.style.position = 'relative';
      const o = document.createElement('div');
      o.className = 'cc-bst';
      const B3 = [
          { id: 'm3', ic: '➕', n: '+3 coups', p: 40 },
          { id: 'st', ic: '🍭', n: '2 bonbons rayés', p: 50 },
          { id: 'bm', ic: '🌈', n: '1 bombe arc-en-ciel', p: 80 }
        ],
        sl = new Set(),
        tot = () => [...sl].reduce((a, k) => a + B3.find(b => b.id == k).p, 0);
      const dr = () => {
        o.innerHTML = `<b class="cc-bt">Boosters</b><small>Choisis tes bonus de départ</small><div class="cc-bl">${B3.map(b => `<button class="${sl.has(b.id) ? 'on' : ''} ${b.p > S.pts && !sl.has(b.id) ? 'no' : ''}" data-b="${b.id}"><span>${b.ic}</span>${b.n}<em>${b.p} ⭐</em></button>`).join('')}</div><button class="cc-go">${tot() ? `Jouer (−${tot()} ⭐)` : 'Jouer sans booster'}</button><small>Tu as ${S.pts} ⭐</small>`;
        o.querySelectorAll('[data-b]').forEach(
          bt =>
            (bt.onclick = () => {
              const k = bt.dataset.b,
                c = B3.find(b => b.id == k);
              if (sl.has(k)) sl.delete(k);
              else {
                if (tot() + c.p > S.pts) {
                  toast('Pas assez d’étoiles ⭐');
                  return;
                }
                sl.add(k);
              }
              tone(660, 0.06, 'sine', 0.05);
              dr();
            })
        );
        o.querySelector('.cc-go').onclick = () => {
          const T2 = tot();
          if (T2) {
            S.pts -= T2;
            save();
            try {
              hdr();
            } catch (_) {}
          }
          o.remove();
          if (sl.has('m3')) moves += 3;
          const cand = [];
          B.forEach(row =>
            row.forEach(t => {
              if (t && !t.sp) cand.push(t);
            })
          );
          shuffle(cand);
          if (sl.has('st'))
            cand.splice(0, 2).forEach(t => {
              t.sp = R() < 0.5 ? 'h' : 'v';
              t.s = 1.6;
              tween(t, { s: 1 }, 450);
            });
          if (sl.has('bm')) {
            const t = cand.shift();
            if (t) {
              t.sp = 'b';
              t.c = -2;
              t.s = 1.6;
              tween(t, { s: 1 }, 450);
            }
          }
          if (sl.size) tone(880, 0.3, 'triangle', 0.07, 1760);
          upd();
          res();
        };
      };
      dr();
      w.appendChild(o);
    });
  const askRevive = () =>
    new Promise(res => {
      const w = $('#ccw');
      const o = document.createElement('div');
      o.className = 'cc-bst';
      o.innerHTML = `<b class="cc-bt">Plus de coups !</b><small>Il te manque <b>${fmtN(TG - score)}</b> points</small><button class="cc-go" data-y>Continuer : +5 coups pour 1 💎</button><button class="cc-no" data-n>Terminer la partie</button><small>Tu as ${S.gem || 0} 💎</small>`;
      o.querySelector('[data-y]').onclick = () => {
        o.remove();
        res(true);
      };
      o.querySelector('[data-n]').onclick = () => {
        o.remove();
        res(false);
      };
      w.appendChild(o);
    });
  (async () => {
    try {
      await document.fonts.load(`40px 'Lilita One'`);
    } catch (_) {}
    await waitSettle();
    await boosters();
    busy = false;
    upd();
  })();
  G = {
    allMoves: () => {
      const o = [];
      for (let r = 0; r < N; r++)
        for (let c = 0; c < N; c++)
          for (const [dr, dc] of [
            [0, 1],
            [1, 0]
          ]) {
            const b = [r + dr, c + dc];
            if (b[0] < N && b[1] < N && validSwap([r, c], b)) o.push([[r, c], b]);
          }
      return o;
    },
    get over() {
      return over;
    },
    get score() {
      return score;
    },
    get moves() {
      return moves;
    },
    get busy() {
      return busy;
    },
    board: () => B,
    findMove,
    turn: (a, b, f) => turn(a, b, f),
    hint: () => {
      if (id != RUN || over) return false;
      if (busy) return 'Attends que les bonbons se posent…';
      if (free) return 'Échange libre déjà actif : touche deux bonbons';
      free = true;
      sel = null;
      freeTxt(1);
      return true;
    }
  };
};
