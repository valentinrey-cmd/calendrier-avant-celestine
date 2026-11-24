GAMES.bossfight = function (p, el, win, fail) {
  const id = RUN,
    LW = 360,
    LH = 540,
    PH = [bimgU()];
  el.innerHTML = `<div class="fbw" id="bfw"><canvas id="bfc"></canvas></div><p class="center muted">Glisse le doigt pour te déplacer. Tes questions ❓ partent toutes seules : vise Noémie et esquive ses reproches, son vernis et ses flacons !</p>`;
  const cv = $('#bfc'),
    x = cv.getContext('2d'),
    dpr = Math.min(3, devicePixelRatio || 1);
  cv.width = LW * dpr;
  cv.height = LH * dpr;
  x.scale(dpr, dpr);
  const im = new Image();
  if (PH[0]) im.src = PH[0];
  let st = 'ready',
    px = LW / 2,
    tx = LW / 2,
    py = LH - 78,
    lives = p.lives,
    hp = p.hp,
    bx = LW / 2,
    by = 110,
    shots = [],
    balls = [],
    warns = [],
    fireT = 0,
    atkT = 1.4,
    inv = 0,
    bHit = 0,
    T = 0,
    pop = 0,
    atkN = '',
    atkNT = 0,
    lastK = -1;
  const snow = Array.from({ length: 50 }, () => [Math.random() * LW, Math.random() * LH, Math.random() * 1.6 + 0.5]);
  const W = $('#bfw');
  const pos = e => {
    const r = cv.getBoundingClientRect();
    tx = Math.max(24, Math.min(LW - 24, ((e.clientX - r.left) / r.width) * LW));
  };
  W.onpointerdown = e => {
    e.preventDefault();
    pos(e);
    if (st == 'ready') {
      st = 'play';
      timer(
        p.time,
        () => {
          if (st == 'play') {
            st = 'dead';
            fail('le temps est écoulé ⏱️');
          }
        },
        id
      );
    }
  };
  W.onpointermove = e => {
    if (e.buttons || e.pointerType == 'touch') pos(e);
  };
  const phase = () => (hp > p.hp * 0.5 ? 0 : hp > p.hp * 0.22 ? 1 : 2);
  const ATK = [
    [
      '💬 Reproche !',
      0,
      (ph, sp) => {
        const a = Math.atan2(py - by, px - bx);
        balls.push({ t: 'ball', x: bx, y: by + 30, vx: Math.cos(a) * sp * 1.15, vy: Math.sin(a) * sp * 1.15, r: 11 });
      }
    ],
    [
      '🗯️ Rafale de « t’es sérieuse ? » !',
      0,
      (ph, sp) => {
        const n = [3, 3, 5][ph],
          a0 = Math.atan2(py - by, px - bx);
        for (let i = 0; i < n; i++) {
          const a = a0 + (i - (n - 1) / 2) * 0.26;
          balls.push({ t: 'ball', x: bx, y: by + 30, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 10 });
        }
      }
    ],
    [
      '💧 Pluie de vernis !',
      0,
      (ph, sp) => {
        const n = [3, 4, 5][ph];
        for (let i = 0; i < n; i++)
          balls.push({ t: 'ice', x: 20 + Math.random() * (LW - 40), y: -20 - Math.random() * 140, vx: 0, vy: sp * 0.95, r: 11 });
      }
    ],
    [
      '🧴 Flacons volants !',
      0,
      (ph, sp) => {
        const n = [2, 2, 3][ph];
        for (let i = 0; i < n; i++)
          balls.push({
            t: 'mini',
            x: 40 + (i * (LW - 80)) / Math.max(1, n - 1),
            y: -30 - i * 50,
            vx: 0,
            vy: sp * 0.55,
            r: 15,
            zz: Math.random() * 6,
            amp: 70 + Math.random() * 40,
            x0: 40 + (i * (LW - 80)) / Math.max(1, n - 1)
          });
      }
    ],
    [
      '💅 La lime à ongles !',
      1,
      (ph, sp) => {
        const tx0 = px,
          a = Math.atan2(py - by, tx0 - bx);
        warns.push({
          x1: bx,
          y1: by + 30,
          x2: bx + Math.cos(a) * 900,
          y2: by + 30 + Math.sin(a) * 900,
          t: 0.7,
          cb: () => balls.push({ t: 'carrot', x: bx, y: by + 30, vx: Math.cos(a) * sp * 1.7, vy: Math.sin(a) * sp * 1.7, r: 10, ang: a })
        });
      }
    ],
    [
      '💨 Le séchoir à ongles !',
      1,
      (ph, sp) => {
        const n = [8, 8, 10][ph],
          o = Math.random() * 6;
        for (let i = 0; i < n; i++) {
          const a = o + (i / n) * Math.PI * 2;
          balls.push({ t: 'ball', x: bx, y: by, vx: Math.cos(a) * sp * 0.7, vy: Math.sin(a) * sp * 0.7, r: 9 });
        }
      }
    ],
    [
      '🫙 Le pot de gel géant !',
      2,
      (ph, sp) => {
        const L = Math.random() < 0.5;
        balls.push({ t: 'big', x: L ? 40 : LW - 40, y: by + 40, vx: (L ? 1 : -1) * sp * 0.75, vy: sp * 0.35, r: 28, bnc: 1 });
      }
    ]
  ];
  const attack = () => {
    const ph = phase();
    const sp = [230, 250, 270][ph] * (p.sp || 1);
    const ok = ATK.map((a, i) => i).filter(i => ATK[i][1] <= ph && i != lastK);
    const k = ok[Math.floor(Math.random() * ok.length)];
    lastK = k;
    atkN = ATK[k][0];
    atkNT = 1.1;
    try {
      SFX('tap');
    } catch (_) {}
    ATK[k][2](ph, sp);
  };
  const draw = now => {
    const g = x.createLinearGradient(0, 0, 0, LH);
    g.addColorStop(0, '#3a3f48');
    g.addColorStop(1, '#1e2128');
    x.fillStyle = g;
    x.fillRect(0, 0, LW, LH);
    x.fillStyle = '#fff6d0';
    snow.forEach(s => {
      x.globalAlpha = 0.18;
      x.beginPath();
      x.arc(s[0], (s[1] + Math.sin(now / 900 + s[0]) * 20) % LH, s[2], 0, 7);
      x.fill();
    });
    x.globalAlpha = 1;
    x.fillStyle = '#fff3c41a';
    x.beginPath();
    x.moveTo(LW / 2 - 30, 0);
    x.lineTo(LW / 2 + 30, 0);
    x.lineTo(LW, LH - 30);
    x.lineTo(0, LH - 30);
    x.fill();
    x.fillStyle = '#8a9098';
    x.fillRect(0, LH - 30, LW, 30);
    const sh = now - bHit < 160 ? Math.sin(now / 15) * 6 : 0;
    x.save();
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    if (phase() == 2) {
      x.shadowColor = '#ff3d6e';
      x.shadowBlur = 24;
    }
    x.restore();
    bpic(x, p.who, bx + sh, by, 86, phase() == 2 ? '#ff3d6e' : '#f3c623', st == 'won');
    x.save();
    x.fillStyle = '#000a';
    x.beginPath();
    x.roundRect(LW / 2 - 120, 16, 240, 16, 8);
    x.fill();
    x.fillStyle = now - bHit < 160 ? '#fff' : ['#ff3d6e', '#ff8a1f', '#ff2020'][phase()];
    x.beginPath();
    x.roundRect(LW / 2 - 118, 18, Math.max(0, (236 * hp) / p.hp), 12, 6);
    x.fill();
    x.font = '800 12px system-ui';
    x.textAlign = 'center';
    x.fillStyle = '#ffd0dc';
    x.fillText(p.n + (phase() == 2 ? ' · VEXÉE 😤' : ''), LW / 2, 48);
    x.restore();
    x.font = '18px system-ui';
    x.textAlign = 'left';
    x.fillText('❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, p.lives - lives)), 10, LH - 40);
    x.font = '18px system-ui';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    shots.forEach(s => x.fillText('❓', s.x, s.y));
    x.textBaseline = 'alphabetic';
    warns.forEach(w => {
      x.save();
      x.strokeStyle = `rgba(255,80,110,${0.35 + 0.35 * Math.sin(now / 60)})`;
      x.lineWidth = 6;
      x.setLineDash([12, 10]);
      x.beginPath();
      x.moveTo(w.x1, w.y1);
      x.lineTo(w.x2, w.y2);
      x.stroke();
      x.restore();
    });
    balls.forEach(b => {
      if (b.t == 'ball' || !b.t) {
        x.fillStyle = '#fff';
        x.strokeStyle = '#d94f86';
        x.lineWidth = 2.5;
        x.beginPath();
        x.arc(b.x, b.y, b.r, 0, 7);
        x.fill();
        x.stroke();
        x.fillStyle = '#d94f86';
        x.font = '700 ' + Math.round(b.r * 0.9) + 'px system-ui';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText('…', b.x, b.y - 2);
      } else {
        x.save();
        x.translate(b.x, b.y);
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        if (b.t == 'carrot') {
          x.rotate(b.ang + Math.PI / 4);
          x.font = '30px system-ui';
          x.fillText('💅', 0, 0);
        } else if (b.t == 'ice') {
          x.font = '24px system-ui';
          x.fillText('💧', 0, 0);
        } else if (b.t == 'mini') {
          x.font = '30px system-ui';
          x.fillText('🧴', 0, 0);
        } else if (b.t == 'big') {
          x.rotate(T * 4 * (b.vx > 0 ? 1 : -1));
          x.fillStyle = '#ffd1dc';
          x.strokeStyle = '#d94f86';
          x.lineWidth = 4;
          x.beginPath();
          x.arc(0, 0, b.r, 0, 7);
          x.fill();
          x.stroke();
          x.fillStyle = '#fff';
          x.beginPath();
          x.arc(-8, -6, 4, 0, 7);
          x.arc(9, 7, 3, 0, 7);
          x.fill();
        }
        x.restore();
      }
    });
    if (atkNT > 0) {
      x.save();
      x.globalAlpha = Math.min(1, atkNT * 2);
      x.font = '900 20px system-ui';
      x.textAlign = 'center';
      x.fillStyle = '#fff';
      x.strokeStyle = '#0b1440';
      x.lineWidth = 5;
      x.strokeText(atkN, LW / 2, 180);
      x.fillText(atkN, LW / 2, 180);
      x.restore();
    }
    if (!(now < inv && Math.floor(now / 90) % 2)) {
      const rr = 22 * (1 + pop * 0.25);
      pop *= 0.9;
      x.save();
      x.translate(px, py);
      x.fillStyle = '#f3c623';
      x.beginPath();
      x.arc(0, 0, rr + 3, 0, 7);
      x.fill();
      x.beginPath();
      x.arc(0, 0, rr, 0, 7);
      x.clip();
      if (im.complete && im.naturalWidth) x.drawImage(im, -rr, -rr, 2 * rr, 2 * rr);
      else {
        x.fillStyle = '#ff7ab6';
        x.fill();
      }
      x.restore();
    }
    if (st == 'ready') {
      x.fillStyle = '#000a';
      x.beginPath();
      x.roundRect(LW / 2 - 130, LH * 0.5, 260, 54, 16);
      x.fill();
      x.fillStyle = '#fff';
      x.font = '800 18px system-ui';
      x.textAlign = 'center';
      x.fillText('👆 Touche pour commencer', LW / 2, LH * 0.5 + 34);
    }
    if (st == 'dead') {
      x.fillStyle = '#b3122e55';
      x.fillRect(0, 0, LW, LH);
    }
  };
  const loop = now => {
    if (id != RUN) return;
    const dt = Math.min(0.033, (now - (loop.t || now)) / 1000);
    loop.t = now;
    if (st == 'play') {
      T += dt;
      px += (tx - px) * Math.min(1, dt * 14);
      const ph = phase();
      bx = LW / 2 + Math.sin(T * [0.9, 1.3, 1.8][ph]) * (LW / 2 - 60);
      by = 110 + Math.sin(T * 2.1) * 18;
      fireT -= dt;
      if (fireT <= 0) {
        fireT = 0.26;
        shots.push({ x: px, y: py - 26 });
      }
      shots.forEach(s => (s.y -= 540 * dt));
      shots = shots.filter(s => {
        if (Math.hypot(s.x - bx, s.y - by) < 46) {
          hp--;
          bHit = now;
          if (hp <= 0 && st == 'play') {
            st = 'won';
            try {
              SFX('ok');
            } catch (_) {}
            setTimeout(() => {
              if (id == RUN) win();
            }, 900);
          }
          return false;
        }
        return s.y > -20;
      });
      atkT -= dt;
      if (atkT <= 0) {
        attack();
        atkT = [1.3, 1.12, 1][ph] * (p.atk || 1) * (0.8 + Math.random() * 0.4);
      }
      atkNT -= dt;
      warns = warns.filter(w => {
        w.t -= dt;
        if (w.t <= 0) {
          w.cb();
          return false;
        }
        return true;
      });
      balls.forEach(b => {
        if (b.t == 'mini') {
          b.zz += dt * 3;
          b.y += b.vy * dt;
          b.x = b.x0 + Math.sin(b.zz) * b.amp;
        } else {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        }
        if (b.t == 'big') {
          b.vy += 320 * dt;
          if (b.y > LH - 30 - b.r && b.vy > 0 && b.bnc < 4) {
            b.vy = -Math.abs(b.vy) * 0.82;
            b.bnc++;
          }
          if ((b.x < b.r && b.vx < 0) || (b.x > LW - b.r && b.vx > 0)) b.vx *= -1;
        }
      });
      balls = balls.filter(b => {
        if (now >= inv && Math.hypot(b.x - px, b.y - py) < b.r + 18) {
          lives--;
          inv = now + 1300;
          pop = 1;
          try {
            SFX('bad');
          } catch (_) {}
          if (lives <= 0 && st == 'play') {
            st = 'dead';
            setTimeout(() => {
              if (id == RUN) fail(`elle avait encore ${hp} PV de mauvaise foi`);
            }, 900);
          }
          return false;
        }
        return b.y < LH + 40 && b.y > -260 && b.x > -40 && b.x < LW + 40;
      });
    }
    draw(now);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  G = {
    hint: () => {
      if (id != RUN || st != 'play') return false;
      if (lives >= p.lives + 2) return 'Tu as déjà plein de vies ❤️';
      lives++;
      return true;
    }
  };
};
