GAMES.stack = function (p, el, win, fail) {
  const id = RUN,
    W = 300,
    H = 560,
    BH = 20,
    G0 = H - 58,
    COL = [
      ['#e8344e', '#a3122b', '#ffd24a', 'dots'],
      ['#2fae5e', '#17693a', '#ffffff', 'stripes'],
      ['#3f7fe8', '#1d4bb0', '#ffd24a', 'stars'],
      ['#b45ae0', '#6d2596', '#fff3c4', 'dots'],
      ['#ff9a2f', '#c25a07', '#7a1f33', 'stripes'],
      ['#f6f1e7', '#c9bfae', '#e8344e', 'stars'],
      ['#16b3a8', '#0b6f69', '#ffd24a', 'dots']
    ];
  el.innerHTML = `<p class="center" style="margin:0 0 4px">Étage <b id="stn">0</b> / ${p.goal}</p><div class="pgwrap"><canvas class="pcv" id="stc" style="aspect-ratio:300/560"></canvas></div><p class="center muted" style="font-size:.85rem">Touche l'écran pour lâcher le cadeau et monte jusqu'à la ligne rouge !</p>`;
  const cv = $('#stc'),
    x = cv.getContext('2d'),
    dpr = Math.min(3, window.devicePixelRatio || 1);
  cv.width = W * dpr;
  cv.height = H * dpr;
  x.scale(dpr, dpr);
  const yOf = l => G0 - (l + 1) * BH,
    FIN = yOf(p.goal - 1);
  let AUTOP = 0,
    pe = 0,
    seg = 0,
    ptot = 0,
    over = false,
    raf = 0,
    T = [{ x: 77, w: 146, c: 0 }],
    mv = { x: -146, w: 146, dir: 1, c: 1, v: 1 },
    falls = [],
    perf = 0,
    flash = 0,
    pops = [],
    last = performance.now(),
    tt = 0;
  timer(p.time, () => end(false, 'le temps est écoulé ⏱️'), id);
  function end(ok, w) {
    if (over) return;
    over = true;
    try {
      REC(T.length - 1);
    } catch (_) {}
    setTimeout(
      () => {
        cancelAnimationFrame(raf);
        ok ? win() : fail(w);
      },
      ok ? 900 : 900
    );
  }
  function drop() {
    if (over) return;
    let ap = 0;
    if (AUTOP) {
      ap = 1;
      AUTOP = 0;
      mv.x = T[T.length - 1].x;
    }
    const top = T[T.length - 1],
      a = Math.max(mv.x, top.x),
      b = Math.min(mv.x + mv.w, top.x + top.w);
    if (b - a <= 0) {
      SFX('bad');
      falls.push({ x: mv.x, w: mv.w, y: 0, lvl: T.length, c: mv.c, vy: 0, r: 0, vr: (mv.x < top.x ? -1 : 1) * 3 });
      mv.w = 0;
      return end(false, 'le cadeau est tombé à côté de la tour 🎁');
    }
    let nx = a,
      nw = b - a;
    if (Math.abs(mv.x - top.x) < 4) {
      perf++;
      pe++;
      if (pe >= 5) ACH('stack5');
      if (++ptot >= 12) ACH('stack12');
      if (pe >= 3 && !seg) {
        seg = 1;
        EGG(14);
        pops.push({ t: 0, txt: '🥚 ŒUF SECRET !' });
      }
      flash = 1;
      SFX('perfect');
      const gr = Math.min(146 - top.w, 3 + Math.min(perf - 1, 3));
      if (gr > 0) {
        top.x = Math.max(0, Math.min(W - top.w - gr, top.x - gr / 2));
        top.w += gr;
        top.t = tt;
      }
      nx = top.x;
      nw = top.w;
      pops.push({ t: 0, txt: gr > 0 ? `PARFAIT ! +${Math.round(gr)}` : 'PARFAIT !' });
      try {
        navigator.vibrate && navigator.vibrate(20);
      } catch (_) {}
    } else {
      perf = 0;
      pe = 0;
      SFX('drop');
      if (mv.x < top.x) falls.push({ x: mv.x, w: top.x - mv.x, y: 0, lvl: T.length, c: mv.c, vy: 0, r: 0, vr: -2.5 });
      if (mv.x + mv.w > top.x + top.w)
        falls.push({ x: top.x + top.w, w: mv.x + mv.w - top.x - top.w, y: 0, lvl: T.length, c: mv.c, vy: 0, r: 0, vr: 2.5 });
    }
    T.push({ x: nx, w: nw, c: mv.c, t: tt });
    $('#stn').textContent = T.length - 1;
    if (T.length - 1 >= p.goal) {
      confetti();
      pops.push({ t: 0, txt: 'ARRIVÉE ! 🎉' });
      return end(true);
    }
    mv = { x: Math.random() < 0.5 ? -nw : W, w: nw, dir: 0, c: (mv.c + 1) % COL.length, v: 0.88 + Math.random() * 0.26 };
    mv.dir = mv.x < 0 ? 1 : -1;
  }
  cv.addEventListener('pointerdown', e => {
    e.preventDefault();
    drop();
  });
  function rr(a, b, w, h, r) {
    x.beginPath();
    if (x.roundRect) x.roundRect(a, b, w, h, r);
    else x.rect(a, b, w, h);
  }
  function gift(bx, by, bw, c, bow, glow) {
    if (bw <= 0) return;
    const [a, d, rb, pat] = COL[c],
      h = BH - 1,
      r = Math.min(4, bw / 3);
    x.save();
    if (glow) {
      x.shadowColor = '#ffe27a';
      x.shadowBlur = 12;
    } else {
      x.shadowColor = '#0006';
      x.shadowBlur = 4;
      x.shadowOffsetY = 2;
    }
    const g = x.createLinearGradient(0, by, 0, by + h);
    g.addColorStop(0, a);
    g.addColorStop(1, d);
    x.fillStyle = g;
    rr(bx, by, bw, h, r);
    x.fill();
    x.restore();
    x.save();
    rr(bx, by, bw, h, r);
    x.clip();
    x.fillStyle = 'rgba(255,255,255,.22)';
    if (pat == 'dots') {
      for (let i = bx + 4; i < bx + bw; i += 9)
        for (let j = by + 4; j < by + h; j += 8) {
          x.beginPath();
          x.arc(i + ((j - by) % 16 ? 4 : 0), j, 1.6, 0, 7);
          x.fill();
        }
    } else if (pat == 'stripes') {
      x.lineWidth = 3;
      x.strokeStyle = 'rgba(255,255,255,.2)';
      for (let i = bx - h; i < bx + bw; i += 9) {
        x.beginPath();
        x.moveTo(i, by + h);
        x.lineTo(i + h, by);
        x.stroke();
      }
    } else {
      x.font = '7px serif';
      x.fillStyle = 'rgba(255,255,255,.45)';
      for (let i = bx + 3; i < bx + bw; i += 12) x.fillText('★', i + ((i | 0) % 2 ? 3 : 0), by + h / 2 + 3);
    }
    x.fillStyle = 'rgba(255,255,255,.35)';
    x.fillRect(bx, by, bw, 3);
    x.fillStyle = 'rgba(0,0,0,.18)';
    x.fillRect(bx, by + h - 3, bw, 3);
    x.restore();
    if (bw > 12) {
      const cx = bx + bw / 2;
      x.fillStyle = rb;
      x.fillRect(cx - 3, by, 6, h);
      x.fillStyle = 'rgba(255,255,255,.35)';
      x.fillRect(cx - 3, by, 2, h);
    }
    if (bow && bw > 18) {
      const cx = bx + bw / 2;
      x.fillStyle = rb;
      x.strokeStyle = 'rgba(0,0,0,.25)';
      x.lineWidth = 1;
      [[-1], [1]].forEach(([s]) => {
        x.beginPath();
        x.ellipse(cx + s * 6, by - 4, 7, 4.5, s * 0.45, 0, 7);
        x.fill();
        x.stroke();
      });
      x.beginPath();
      x.moveTo(cx - 2, by - 2);
      x.lineTo(cx - 7, by + 7);
      x.lineTo(cx - 3, by + 5);
      x.fill();
      x.beginPath();
      x.moveTo(cx + 2, by - 2);
      x.lineTo(cx + 7, by + 7);
      x.lineTo(cx + 3, by + 5);
      x.fill();
      x.beginPath();
      x.arc(cx, by - 3, 3, 0, 7);
      x.fill();
    }
  }
  const sky = document.createElement('canvas');
  sky.width = W * dpr;
  sky.height = H * dpr;
  {
    const g = sky.getContext('2d');
    g.scale(dpr, dpr);
    const b = g.createLinearGradient(0, 0, 0, H);
    b.addColorStop(0, '#0b1735');
    b.addColorStop(0.7, '#1b3d66');
    b.addColorStop(1, '#2a5a83');
    g.fillStyle = b;
    g.fillRect(0, 0, W, H);
    for (let k = 0; k < 60; k++) {
      g.fillStyle = `rgba(255,255,255,${0.2 + (k % 4) * 0.15})`;
      g.beginPath();
      g.arc((k * 97 + 11) % W, (k * 61 + 5) % (H * 0.7), 0.6 + (k % 3) * 0.45, 0, 7);
      g.fill();
    }
    g.fillStyle = '#fff8d8';
    g.beginPath();
    g.arc(248, 58, 18, 0, 7);
    g.fill();
    g.fillStyle = '#0b1735';
    g.beginPath();
    g.arc(256, 52, 16, 0, 7);
    g.fill();
    g.fillStyle = '#10294a';
    [
      [262, G0 + 6, 40, 150],
      [30, G0 + 6, 26, 110]
    ].forEach(([cx, by, w2, h2]) => {
      for (let k = 0; k < 3; k++) {
        const y0 = by - (k * h2) / 3.4;
        g.beginPath();
        g.moveTo(cx - w2 + k * 7, y0);
        g.lineTo(cx, y0 - h2 / 2.2);
        g.lineTo(cx + w2 - k * 7, y0);
        g.fill();
      }
    });
    g.fillStyle = '#e9f3fa';
    g.beginPath();
    g.moveTo(0, G0 + 4);
    g.quadraticCurveTo(W / 2, G0 - 6, W, G0 + 4);
    g.lineTo(W, H);
    g.lineTo(0, H);
    g.fill();
    g.fillStyle = '#d3e5f1';
    g.fillRect(0, G0 + 26, W, H);
  }
  function loop(now) {
    if (id != RUN) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    tt += dt;
    const lv = T.length - 1,
      sp = (143 + lv * 12) * (mv.v || 1) * (lv >= 14 ? 1 + 0.1 * Math.sin(tt * 2.1) : 1);
    if (!over) {
      mv.x += mv.dir * sp * dt;
      if (mv.x > W - mv.w * 0.2 && mv.dir > 0) mv.dir = -1;
      if (mv.x < -mv.w * 0.8 && mv.dir < 0) mv.dir = 1;
    }
    x.drawImage(sky, 0, 0, W, H);
    for (let k = 0; k < 8; k++) {
      const tw = 0.5 + 0.5 * Math.sin(tt * 3 + k * 1.7);
      x.fillStyle = ['#ff4d6a', '#ffd24a', '#4ab3ff', '#7ed957'][k % 4];
      x.globalAlpha = 0.4 + 0.6 * tw;
      x.beginPath();
      x.arc(262 + (((k * 13) % 30) - 15) * (1 - (k % 3) * 0.25), G0 - 20 - k * 14, 2.2, 0, 7);
      x.fill();
    }
    x.globalAlpha = 1;
    x.fillStyle = 'rgba(255,255,255,.7)';
    for (let k = 0; k < 45; k++) {
      const sx = (k * 83 + Math.sin(tt + k) * 10 + tt * 6 * ((k % 3) + 1)) % W,
        sy = (k * 131 + tt * 22 * ((k % 4) + 1)) % H;
      x.beginPath();
      x.arc(sx, sy, 0.7 + (k % 3) * 0.45, 0, 7);
      x.fill();
    }
    x.font = '700 10px system-ui';
    x.textAlign = 'left';
    for (let l = 5; l < p.goal; l += 5) {
      const y = yOf(l - 1);
      x.strokeStyle = 'rgba(255,255,255,.18)';
      x.setLineDash([3, 5]);
      x.lineWidth = 1;
      x.beginPath();
      x.moveTo(0, y);
      x.lineTo(W, y);
      x.stroke();
      x.setLineDash([]);
      x.fillStyle = 'rgba(255,255,255,.45)';
      x.fillText(l, 4, y - 3);
    }
    const pu = 0.6 + 0.4 * Math.sin(tt * 4);
    x.save();
    x.shadowColor = '#ff2d4a';
    x.shadowBlur = 10 * pu;
    x.strokeStyle = '#ff2d4a';
    x.lineWidth = 3;
    x.setLineDash([10, 6]);
    x.lineDashOffset = -tt * 20;
    x.beginPath();
    x.moveTo(0, FIN);
    x.lineTo(W, FIN);
    x.stroke();
    x.restore();
    [
      [10, 1],
      [W - 10, -1]
    ].forEach(([fx, s]) => {
      x.strokeStyle = '#ddd';
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(fx, FIN);
      x.lineTo(fx, FIN - 26);
      x.stroke();
      for (let i = 0; i < 3; i++)
        for (let j = 0; j < 2; j++) {
          x.fillStyle = (i + j) % 2 ? '#fff' : '#e0243b';
          x.fillRect(fx + (s > 0 ? 0 : -15) + i * 5, FIN - 26 + j * 5, 5, 5);
        }
    });
    x.fillStyle = '#ff4d6a';
    x.font = '800 11px system-ui';
    x.textAlign = 'center';
    x.fillText(`ARRIVÉE · ${p.goal} ÉTAGES`, W / 2, FIN - 7);
    T.forEach((b, i) => {
      const dy = b.t && tt - b.t < 0.18 ? -(1 - (tt - b.t) / 0.18) * 4 : 0;
      gift(b.x, yOf(i) + dy, b.w, b.c, i == T.length - 1, false);
    });
    falls = falls.filter(f => f.y < H + 80);
    falls.forEach(f => {
      f.vy += 1100 * dt;
      f.y += f.vy * dt;
      f.r += f.vr * dt;
      x.save();
      x.translate(f.x + f.w / 2, yOf(f.lvl) + f.y + BH / 2);
      x.rotate(f.r);
      x.globalAlpha = 0.9;
      gift(-f.w / 2, -BH / 2, f.w, f.c, false, false);
      x.restore();
    });
    if (!over && mv.w > 0) {
      const yy = yOf(T.length) - 8 + Math.sin(tt * 6) * 1.5;
      x.strokeStyle = 'rgba(255,255,255,.25)';
      x.setLineDash([2, 4]);
      x.beginPath();
      x.moveTo(mv.x + mv.w / 2, yy + BH);
      x.lineTo(mv.x + mv.w / 2, yOf(T.length - 1));
      x.stroke();
      x.setLineDash([]);
      gift(mv.x, yy, mv.w, mv.c, true, true);
    }
    if (flash > 0) {
      flash -= dt * 2.5;
      const t2 = T[T.length - 1];
      x.strokeStyle = `rgba(255,226,122,${flash})`;
      x.lineWidth = 3;
      rr(t2.x - 3, yOf(T.length - 1) - 3, t2.w + 6, BH + 5, 5);
      x.stroke();
    }
    pops = pops.filter(q => q.t < 1);
    pops.forEach(q => {
      q.t += dt * 1.2;
      x.globalAlpha = 1 - q.t;
      x.fillStyle = '#ffe27a';
      x.font = '900 20px system-ui';
      x.textAlign = 'center';
      x.fillText(q.txt, W / 2, yOf(T.length - 1) - 30 - q.t * 30);
      x.globalAlpha = 1;
    });
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
  G.hint = () => {
    if (id != RUN || over) return false;
    if (AUTOP) return 'Le prochain cadeau est déjà garanti parfait ✨';
    AUTOP = 1;
    return true;
  };
};
