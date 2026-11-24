GAMES.flappy = function (p, el, win, fail) {
  const id = RUN,
    LW = 360,
    LH = 540,
    GR = 56,
    R = 19,
    BX = 96,
    PH = shuffle([...(CONTENU.photos || [])]);
  el.innerHTML = `<div class="fbw" id="fbw"><canvas id="fbc"></canvas></div><p class="center muted">Touche l'écran (ou Espace) pour la faire voler. Passe ${p.goal} sucres d'orge sans rien toucher !</p>`;
  const cv = $('#fbc'),
    x = cv.getContext('2d'),
    dpr = Math.min(3, devicePixelRatio || 1);
  cv.width = LW * dpr;
  cv.height = LH * dpr;
  x.scale(dpr, dpr);
  const imgs = PH.map(u => {
    const i = new Image();
    i.src = u;
    return i;
  });
  let face = 0;
  let np = 0,
    y = LH * 0.42,
    vy = 0,
    pipes = [],
    score = 0,
    st = 'ready',
    last = 0,
    spawnT = 0,
    spd = p.speed,
    t0 = performance.now(),
    pop = 0;
  const stars = Array.from({ length: 40 }, () => [Math.random() * LW, Math.random() * (LH - GR - 120), Math.random() * 1.5 + 0.4]);
  let off = 0,
    ICE = 0,
    SHD = 0,
    INV = 0;
  const BS = p.boss,
    GR2 = p.grinch;
  let CO = [],
    coT = GR2 ? GR2.every : 0,
    bHit = 0,
    gy = (LH - GR) / 2;
  const flap = () => {
    if (id != RUN) return;
    if (st == 'ready') {
      st = 'play';
      last = performance.now();
    }
    if (st == 'play') vy = -p.jump;
  };
  const newPipe = () => {
    const gp = Math.max(p.gapMin, p.gap - score * p.shrink),
      m = 90 + (score >= p.moveAt ? Math.min(p.ampMax, (score - p.moveAt + 1) * 7) : 0),
      gc = m + gp / 2 + Math.random() * Math.max(1, LH - GR - 2 * m - gp);
    pipes.push({
      x: LW + 40,
      g0: gc,
      gc,
      ok: false,
      amp: score >= p.moveAt ? Math.min(p.ampMax, (score - p.moveAt + 1) * 7) : 0,
      ph: Math.random() * 6.28,
      gp: Math.max(p.gapMin, p.gap - score * p.shrink)
    });
    if (++np == 9) {
      const q = pipes[pipes.length - 1];
      q.hole = 1;
      q.hs = q.g0 < (LH - GR) / 2 ? 1 : -1;
    }
  };
  const cr = (rx, ry, rw, rh) => {
    const cx = Math.max(rx, Math.min(BX, rx + rw)),
      cy = Math.max(ry, Math.min(y, ry + rh));
    return Math.hypot(BX - cx, y - cy) < R * 0.88;
  };
  const hc = q => q.gc + q.hs * (q.gp / 2 + 80),
    hp = q => {
      const t = q.gc - q.gp / 2,
        b = q.gc + q.gp / 2,
        X = q.x - 4,
        Wp = p.pw + 8;
      if (!q.hole) return cr(X, -200, Wp, t + 200) || cr(X, b, Wp, LH);
      const h1 = hc(q) - 42,
        h2 = hc(q) + 42;
      return q.hs > 0
        ? cr(X, -200, Wp, t + 200) || cr(X, b, Wp, h1 - b) || cr(X, h2, Wp, LH)
        : cr(X, -200, Wp, h1 + 200) || cr(X, h2, Wp, t - h2) || cr(X, b, Wp, LH);
    };
  const hit = () => y + R >= LH - GR || pipes.some(hp) || CO.some(c => Math.hypot(BX - c.x, y - c.y) < R * 0.85 + 9);
  const cane = (px, top, bot) => {
    const w = p.pw;
    x.save();
    x.beginPath();
    x.rect(px, top, w, bot - top);
    x.clip();
    x.fillStyle = '#fff';
    x.fillRect(px, top, w, bot - top);
    x.fillStyle = '#e0283f';
    for (let k = -w; k < bot - top + w; k += 22) {
      x.beginPath();
      x.moveTo(px, top + k);
      x.lineTo(px + w, top + k - w * 0.6);
      x.lineTo(px + w, top + k - w * 0.6 + 10);
      x.lineTo(px, top + k + 10);
      x.fill();
    }
    const g = x.createLinearGradient(px, 0, px + w, 0);
    g.addColorStop(0, '#0000002a');
    g.addColorStop(0.35, '#ffffff40');
    g.addColorStop(1, '#00000038');
    x.fillStyle = g;
    x.fillRect(px, top, w, bot - top);
    x.restore();
  };
  const cap = (px, yy) => {
    const w = p.pw + 12;
    const g = x.createLinearGradient(px - 6, 0, px - 6 + w, 0);
    g.addColorStop(0, '#a8812c');
    g.addColorStop(0.4, '#ffe08a');
    g.addColorStop(1, '#a8812c');
    x.fillStyle = g;
    x.beginPath();
    x.roundRect(px - 6, yy - 9, w, 18, 6);
    x.fill();
  };
  const draw = now => {
    const sky = x.createLinearGradient(0, 0, 0, LH);
    sky.addColorStop(0, '#0b1440');
    sky.addColorStop(0.7, '#2a3a7a');
    sky.addColorStop(1, '#5a4a8a');
    x.fillStyle = sky;
    x.fillRect(0, 0, LW, LH);
    x.fillStyle = '#fff';
    stars.forEach(([sx, sy, r], i) => {
      x.globalAlpha = 0.4 + 0.4 * Math.sin(now / 600 + i);
      x.beginPath();
      x.arc(sx, sy, r, 0, 7);
      x.fill();
    });
    x.globalAlpha = 1;
    x.fillStyle = '#fffbe0';
    x.beginPath();
    x.arc(LW - 60, 70, 22, 0, 7);
    x.fill();
    x.fillStyle = '#1c2a5a';
    for (let i = -1; i < 6; i++) {
      const hx = ((i * 110 - off * 0.3) % 660) + (i < 0 ? 0 : 0);
      x.beginPath();
      x.arc(((((i * 110 - off * 0.3) % 770) + 770) % 770) - 100, LH - GR + 10, 80, Math.PI, 0);
      x.fill();
    }
    const bsh = now - bHit < 260 ? Math.sin(now / 18) * 7 : 0;
    if (BS && !GR2) {
      x.save();
      x.globalAlpha = 0.92;
      x.font = '130px system-ui';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(st == 'won' ? '💥' : BS.ic, LW - 52 + bsh, (LH - GR) / 2 + Math.sin(now / 520) * 50);
      x.restore();
    }
    pipes.forEach(q => {
      const top = q.gc - q.gp / 2,
        bot = q.gc + q.gp / 2;
      if (q.hole) {
        const h0 = hc(q),
          h1 = h0 - 42,
          h2 = h0 + 42;
        if (!q.eg) {
          eggDraw(x, q.x + p.pw / 2, h0, 30, 4);
        }
        if (q.hs > 0) {
          cane(q.x, -10, top);
          cane(q.x, bot, h1);
          cane(q.x, h2, LH - GR);
        } else {
          cane(q.x, -10, h1);
          cane(q.x, h2, top);
          cane(q.x, bot, LH - GR);
        }
        x.save();
        x.globalAlpha = 0.6;
        cane(q.x, h1, h2);
        x.restore();
      } else {
        cane(q.x, -10, top);
        cane(q.x, bot, LH - GR);
      }
      cap(q.x, top);
      cap(q.x, bot);
      if (now < ICE) {
        x.fillStyle = '#bfefff66';
        x.fillRect(q.x - 6, -10, p.pw + 12, top + 19);
        x.fillRect(q.x - 6, bot - 9, p.pw + 12, LH - GR - bot + 9);
        x.strokeStyle = '#e8fbff';
        x.lineWidth = 2;
        x.strokeRect(q.x - 6, -10, p.pw + 12, top + 19);
        x.strokeRect(q.x - 6, bot - 9, p.pw + 12, LH - GR - bot + 9);
      }
    });
    if (now < ICE) {
      x.font = '800 16px system-ui';
      x.fillStyle = '#bfefff';
      x.textAlign = 'left';
      x.fillText('🧊 ' + Math.ceil((ICE - now) / 1000) + ' s', 12, 28);
    }
    if (GR2) {
      x.save();
      x.font = '56px system-ui';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(st == 'won' ? '💥' : BS.ic, LW - 34 + bsh, gy);
      CO.forEach(c => {
        x.fillStyle = '#1a1a1a';
        x.shadowColor = '#ff4400';
        x.shadowBlur = 12;
        x.beginPath();
        x.arc(c.x, c.y, 10, 0, 7);
        x.fill();
      });
      x.restore();
    }
    if (BS) {
      const hpv = Math.max(0, p.goal - score);
      x.save();
      x.fillStyle = '#000a';
      x.beginPath();
      x.roundRect(LW / 2 - 110, 104, 220, 16, 8);
      x.fill();
      x.fillStyle = now - bHit < 260 ? '#fff' : '#ff3d6e';
      x.beginPath();
      x.roundRect(LW / 2 - 108, 106, Math.max(0, (216 * hpv) / p.goal), 12, 6);
      x.fill();
      x.font = '800 13px system-ui';
      x.textAlign = 'center';
      x.fillStyle = '#ffd0dc';
      x.fillText(BS.ic + ' ' + BS.n + ' · ' + hpv + ' PV', LW / 2, 138);
      x.restore();
    }
    const gg = x.createLinearGradient(0, LH - GR, 0, LH);
    gg.addColorStop(0, '#f4f8ff');
    gg.addColorStop(1, '#b9c8e8');
    x.fillStyle = gg;
    x.fillRect(0, LH - GR, LW, GR);
    x.fillStyle = '#ffffff';
    for (let i = 0; i < 14; i++) {
      x.beginPath();
      x.arc(((((i * 34 - off) % 476) + 476) % 476) - 20, LH - GR, 12, Math.PI, 0);
      x.fill();
    }
    const im = imgs[face % Math.max(1, imgs.length)],
      rr = R * (1 + pop * 0.3);
    pop *= 0.88;
    x.save();
    x.translate(BX, y);
    x.rotate(Math.max(-0.5, Math.min(1.1, vy / 600)));
    x.fillStyle = '#f3c623';
    x.beginPath();
    x.arc(0, 0, rr + 3, 0, 7);
    x.fill();
    x.beginPath();
    x.arc(0, 0, rr, 0, 7);
    x.clip();
    if (im && im.complete && im.naturalWidth) x.drawImage(im, -rr, -rr, 2 * rr, 2 * rr);
    else {
      x.fillStyle = '#ff7ab6';
      x.fill();
    }
    x.restore();
    if (SHD || now < INV) {
      if (!(now < INV && Math.floor(now / 90) % 2)) {
        x.save();
        x.strokeStyle = '#5ce1e6';
        x.lineWidth = 3.5;
        x.shadowColor = '#5ce1e6';
        x.shadowBlur = 14;
        x.globalAlpha = 0.9;
        x.beginPath();
        x.arc(BX, y, R + 9, 0, 7);
        x.stroke();
        x.restore();
      }
    }
    if (SHD) {
      x.font = '800 16px system-ui';
      x.fillStyle = '#bff7ff';
      x.textAlign = 'left';
      x.fillText('🛡️ Bouclier', 12, 28);
    }
    x.textAlign = 'center';
    x.lineWidth = 6;
    x.strokeStyle = '#0008';
    x.fillStyle = '#fff';
    x.font = '900 46px system-ui,sans-serif';
    x.strokeText(score, LW / 2, 70);
    x.fillText(score, LW / 2, 70);
    x.font = '700 15px system-ui';
    x.fillStyle = '#ffe08a';
    x.fillText(`/ ${p.goal}`, LW / 2, 92);
    if (st == 'ready') {
      x.fillStyle = '#000a';
      x.beginPath();
      x.roundRect(LW / 2 - 120, LH * 0.58, 240, 54, 16);
      x.fill();
      x.fillStyle = '#fff';
      x.font = '800 19px system-ui';
      x.fillText('👆 Touche pour voler', LW / 2, LH * 0.58 + 34);
    }
    if (st == 'dead') {
      x.fillStyle = '#b3122e55';
      x.fillRect(0, 0, LW, LH);
    }
  };
  const loop = now => {
    if (id != RUN) return;
    let dt = Math.min(0.033, (now - (loop.t || now)) / 1000);
    loop.t = now;
    if (st == 'ready') {
      y = LH * 0.42 + Math.sin(now / 300) * 8;
      off += spd * dt * 0.5;
    } else if (st == 'play') {
      if (G.auto) {
        const q = pipes.find(q => q.x + p.pw > BX - R),
          tg = q ? q.gc + q.gp * 0.12 : LH * 0.45;
        if (y > tg && vy > -60) vy = -p.jump;
      }
      vy += p.grav * dt;
      y += vy * dt;
      if (y < R) {
        y = R;
        vy = Math.max(0, vy);
      }
      off += spd * dt;
      spawnT -= dt;
      if (spawnT <= 0) {
        newPipe();
        spawnT = p.every;
      }
      pipes.forEach(q => {
        q.x -= spd * dt;
        q.tt = (q.tt == null ? now / 1000 : q.tt) + (now < ICE ? 0 : dt);
        q.gc = q.g0 + q.amp * Math.sin(q.tt * p.wob + q.ph);
        if (q.hole && !q.eg && BX > q.x && BX < q.x + p.pw && Math.abs(y - hc(q)) < 34) {
          q.eg = 1;
          EGG(4);
        }
        if (!q.ok && q.x + p.pw < BX - R) {
          q.ok = true;
          score++;
          bHit = now;
          REC(score);
          face++;
          pop = 1;
          spd += p.acc;
          if (score >= p.goal) {
            st = 'won';
            setTimeout(() => {
              if (id == RUN) win();
            }, 500);
          }
        }
      });
      pipes = pipes.filter(q => q.x > -p.pw - 20);
      if (GR2 && st == 'play') {
        coT -= dt;
        if (coT <= 0) {
          coT = GR2.every * (0.75 + Math.random() * 0.5);
          const tt = (LW - 60 - BX) / GR2.v;
          CO.push({ x: LW - 60, y: gy, vx: -GR2.v, vy: ((y - gy) / tt) * 0.85 });
        }
        CO.forEach(c => {
          c.x += c.vx * dt;
          c.y += c.vy * dt;
        });
        CO = CO.filter(c => c.x > -20);
      }
      if (st == 'play' && now >= INV && hit()) {
        if (SHD) {
          SHD = 0;
          INV = now + 1600;
          vy = -p.jump * 0.75;
          if (y + R >= LH - GR) y = LH - GR - R - 2;
          pop = 1;
          try {
            toast('🛡️ Bouclier utilisé : tu as survécu !');
          } catch (_) {}
        } else {
          REC(score);
          if (score == 0 && pipes.some(hp)) ACH('flapK');
          st = 'dead';
          vy = -250;
          setTimeout(() => {
            if (id == RUN) fail(`${score} / ${p.goal} sucres d'orge passés`);
          }, 900);
        }
      }
    } else if (st == 'dead') {
      vy += p.grav * dt;
      y = Math.min(LH - GR - R, y + vy * dt);
    }
    if (GR2) gy = (LH - GR) / 2 + Math.sin(now / 650) * ((LH - GR) / 2 - 70);
    draw(now);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  const W = $('#fbw');
  W.onpointerdown = e => {
    e.preventDefault();
    flap();
  };
  G = {
    key: k => {
      if (k == ' ' || k == 'ArrowUp') flap();
    },
    flap,
    score: () => score,
    state: () => st,
    auto: false
  };
  G.hint = () => {
    if (id != RUN || st == 'dead' || st == 'won') return false;
    if (SHD) return 'Le bouclier est déjà actif 🛡️';
    SHD = 1;
    return true;
  };
};
