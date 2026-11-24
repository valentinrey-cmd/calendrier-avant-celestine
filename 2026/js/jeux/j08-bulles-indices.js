/* 🫧 Jour 8 : bubble shooter des indices */
try {
  GAMES.bubble = function (p, el, win, fail) {
    const id = RUN;
    const { W, x, P } = bcv(
      el,
      `Vise avec le doigt et lâche pour tirer. 3 bulles de même couleur éclatent. Libère les ${p.clues} indices 🔎 !`
    );
    const R = 18,
      C = 10,
      RH = R * Math.sqrt(3),
      COL = ['#ff4d6d', '#ffd23f', '#3ddc84', '#4d9fff', '#b77bff', '#ff9a3c'].slice(0, p.colors),
      SX = 180,
      SY = 486,
      DL = 446;
    let st = 'ready',
      top = 44,
      grid = [],
      cur = null,
      nxt = null,
      shot = null,
      aim = null,
      shots = 0,
      freed = 0,
      pops = [],
      falls = [],
      T = 0,
      egg = null,
      quip = '',
      qT = 0;
    const cols = r => (r % 2 ? C - 1 : C),
      cx = (r, c) => R + c * 2 * R + (r % 2 ? R : 0),
      cy = r => top + R + r * RH;
    const rc = () => COL[Math.floor(Math.random() * COL.length)];
    for (let r = 0; r < p.rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols(r); c++) grid[r][c] = { c: rc() };
    }
    {
      const cand = [];
      for (let r = 1; r < p.rows; r++) for (let c = 0; c < cols(r); c++) cand.push([r, c]);
      cand.sort(() => Math.random() - 0.5);
      cand.slice(0, p.clues).forEach(([r, c]) => (grid[r][c].k = 1));
      const ec = Math.floor(Math.random() * cols(0));
      grid[0][ec].egg = 1;
      grid[0][ec].c = '#ffd700';
    }
    const live = () => {
      const s = new Set();
      grid.forEach(
        row =>
          row &&
          row.forEach(b => {
            if (b && !b.egg) s.add(b.c);
          })
      );
      return [...s];
    };
    const pickC = () => {
      const L = live();
      return L.length ? L[Math.floor(Math.random() * L.length)] : rc();
    };
    cur = pickC();
    nxt = pickC();
    const nb = (r, c) => {
      const o =
        r % 2
          ? [
              [-1, 0],
              [-1, 1],
              [0, -1],
              [0, 1],
              [1, 0],
              [1, 1]
            ]
          : [
              [-1, -1],
              [-1, 0],
              [0, -1],
              [0, 1],
              [1, -1],
              [1, 0]
            ];
      return o.map(([a, b]) => [r + a, c + b]).filter(([a, b]) => a >= 0 && b >= 0 && b < cols(a));
    };
    const get = (r, c) => grid[r] && grid[r][c];
    const say = t => {
      quip = t;
      qT = 1.8;
    };
    const snap = (px, py) => {
      let best = null,
        bd = 1e9;
      const r0 = Math.max(0, Math.round((py - top - R) / RH));
      for (let r = Math.max(0, r0 - 1); r <= r0 + 1; r++) {
        for (let c = 0; c < cols(r); c++) {
          if (get(r, c)) continue;
          const d = Math.hypot(cx(r, c) - px, cy(r) - py);
          if (d < bd) {
            bd = d;
            best = [r, c];
          }
        }
      }
      return best;
    };
    const land = (r, c, col) => {
      grid[r] = grid[r] || [];
      grid[r][c] = { c: col };
      LB[r + ',' + c] = performance.now();
      const same = [[r, c]],
        seen = new Set([r + ',' + c]);
      for (let i = 0; i < same.length; i++)
        for (const [a, b] of nb(...same[i])) {
          const q = get(a, b);
          if (q && !q.egg && q.c == col && !seen.has(a + ',' + b)) {
            seen.add(a + ',' + b);
            same.push([a, b]);
          }
        }
      let dropped = 0;
      if (same.length >= 3) {
        same.forEach(([a, b]) => {
          const q = grid[a][b];
          if (q.k) {
            freed++;
            say('🔎 Indice libéré !');
          }
          pops.push({ x: cx(a, b), y: cy(a), c: q.c, t: 0.35, k: q.k });
          for (let z = 0; z < 6; z++) {
            const an = Math.random() * 6.28,
              v = 60 + Math.random() * 120;
            PD.push({ x: cx(a, b), y: cy(a), vx: Math.cos(an) * v, vy: Math.sin(an) * v, r: 1.5 + Math.random() * 2.5, c: q.c, t: 0.5 });
          }
          grid[a][b] = null;
        });
        try {
          SFX('ok');
        } catch (_) {}
        // bulles qui ne tiennent plus
        const keep = new Set(),
          q = [];
        for (let c2 = 0; c2 < cols(0); c2++)
          if (get(0, c2)) {
            keep.add('0,' + c2);
            q.push([0, c2]);
          }
        for (let i = 0; i < q.length; i++)
          for (const [a, b] of nb(...q[i]))
            if (get(a, b) && !keep.has(a + ',' + b)) {
              keep.add(a + ',' + b);
              q.push([a, b]);
            }
        grid.forEach(
          (row, a) =>
            row &&
            row.forEach((bb, b) => {
              if (bb && !keep.has(a + ',' + b)) {
                if (bb.k) {
                  freed++;
                  say('🔎 Indice libéré !');
                }
                falls.push({
                  x: cx(a, b),
                  y: cy(a),
                  y0: cy(a),
                  vy: -60 - Math.random() * 80,
                  vx: (Math.random() - 0.5) * 80,
                  sp: Math.random() < 0.5 ? -1 : 1,
                  c: bb.c,
                  k: bb.k,
                  e: bb.egg
                });
                grid[a][b] = null;
                dropped++;
              }
            })
        );
        if (dropped >= 10) ACH('snakeO');
        if (dropped) say(dropped >= 6 ? `💥 ${dropped} bulles d’un coup !` : 'Et ça tombe !');
      } else
        try {
          bkT(300, 0.05, 'triangle', 0.04);
        } catch (_) {}
      shots++;
      if (shots % p.drop == 0) {
        top += RH;
        say('⬇️ Le plafond descend…');
      }
      if (freed >= p.clues) {
        st = 'won';
        say('Tous les indices sont libres ! 🎉');
        setTimeout(() => {
          if (id == RUN) win();
        }, 900);
        return;
      }
      let low = 0;
      grid.forEach(
        (row, a) =>
          row &&
          row.forEach(b => {
            if (b) low = Math.max(low, cy(a) + R);
          })
      );
      if (low >= DL) {
        st = 'dead';
        setTimeout(() => {
          if (id == RUN) fail('les bulles ont atteint la ligne 🫧');
        }, 700);
      }
    };
    const fire = (tx, ty) => {
      if (shot || st != 'play') return;
      let a = Math.atan2(ty - SY, tx - SX);
      a = Math.max(-Math.PI + 0.15, Math.min(-0.15, a));
      shot = { x: SX, y: SY, vx: Math.cos(a) * 820, vy: Math.sin(a) * 820, c: cur };
      try {
        bkT(420, 0.06, 'triangle', 0.04);
      } catch (_) {}
      cur = nxt;
      nxt = pickC();
    };
    W.onpointerdown = e => {
      e.preventDefault();
      if (st == 'ready') {
        st = 'play';
        T0 = performance.now();
        timer(
          p.time,
          () => {
            if (st == 'play') {
              st = 'dead';
              fail(`le temps est écoulé (${freed}/${p.clues} indices)`);
            }
          },
          id
        );
        return;
      }
      aim = P(e);
    };
    W.onpointermove = e => {
      if (aim) aim = P(e);
    };
    W.onpointerup = e => {
      if (!aim) return;
      const q = P(e);
      aim = null;
      if (q[1] < SY - 20) fire(q[0], q[1]);
    };
    let T0 = 0;
    const upd = dt => {
      T += dt;
      qT = Math.max(0, qT - dt);
      pops.forEach(o => (o.t -= dt));
      pops = pops.filter(o => o.t > 0);
      falls.forEach(o => {
        o.vy += 1400 * dt;
        o.y += o.vy * dt;
        o.x += (o.vx || 0) * dt;
      });
      PD.forEach(d => {
        d.vy += 600 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        d.t -= dt;
      });
      PD = PD.filter(d => d.t > 0);
      falls = falls.filter(o => o.y < 600);
      if (!shot) return;
      const n = 6;
      for (let k = 0; k < n; k++) {
        shot.x += (shot.vx * dt) / n;
        shot.y += (shot.vy * dt) / n;
        if (shot.x < R) {
          shot.x = R;
          shot.vx *= -1;
        }
        if (shot.x > 360 - R) {
          shot.x = 360 - R;
          shot.vx *= -1;
        }
        let hit = shot.y < top + R ? 'top' : null;
        let eg = null,
          hb = null,
          hd = 1e9;
        if (!hit)
          grid.forEach(
            (row, a) =>
              row &&
              row.forEach((b, c) => {
                if (!b) return;
                const d = Math.hypot(cx(a, c) - shot.x, cy(a) - shot.y);
                if (d < R * 1.8 && d < hd) {
                  hd = d;
                  hb = [a, c];
                  hit = 'b';
                  eg = b.egg ? [a, c] : null;
                }
              })
          );
        if (hit) {
          let cand = hit == 'top' ? [...Array(cols(0)).keys()].map(c => [0, c]) : nb(...hb);
          cand = cand.filter(([a, c]) => !get(a, c));
          if (!cand.length && hb) {
            const s2 = snap(shot.x, shot.y);
            if (s2) cand = [s2];
          }
          let best = null,
            bd = 1e9;
          cand.forEach(([a, c]) => {
            const d = Math.hypot(cx(a, c) - shot.x, cy(a) - shot.y);
            if (d < bd) {
              bd = d;
              best = [a, c];
            }
          });
          if (eg) {
            EGG(8);
            pops.push({ x: cx(eg[0], eg[1]), y: cy(eg[0]), c: '#ffd700', t: 0.6 });
            grid[eg[0]][eg[1]] = null;
            say('🥚 Une bulle dorée !');
          }
          const col = shot.c;
          shot = null;
          if (best) land(best[0], best[1], col);
          return;
        }
      }
    };
    const DPR = Math.min(3, devicePixelRatio || 1),
      SPR = {};
    const sprite = c => {
      if (SPR[c]) return SPR[c];
      const cv = document.createElement('canvas'),
        S2 = (R * 2 + 6) * DPR;
      cv.width = cv.height = S2;
      const o = cv.getContext('2d');
      o.scale(DPR, DPR);
      o.translate(R + 3, R + 3);
      let g = o.createRadialGradient(-R * 0.35, -R * 0.4, 1, 0, 0, R);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.18, c);
      g.addColorStop(0.85, c);
      g.addColorStop(1, '#00000055');
      o.fillStyle = g;
      o.beginPath();
      o.arc(0, 0, R - 1, 0, 7);
      o.fill();
      g = o.createLinearGradient(0, R * 0.2, 0, R);
      g.addColorStop(0, '#0000');
      g.addColorStop(1, '#0004');
      o.fillStyle = g;
      o.beginPath();
      o.arc(0, 0, R - 1, 0, 7);
      o.fill();
      o.strokeStyle = '#ffffff55';
      o.lineWidth = 1.2;
      o.beginPath();
      o.arc(0, 0, R - 1.6, 0, 7);
      o.stroke();
      o.fillStyle = '#ffffffcc';
      o.beginPath();
      o.ellipse(-R * 0.35, -R * 0.45, R * 0.28, R * 0.15, -0.6, 0, 7);
      o.fill();
      o.fillStyle = '#ffffff66';
      o.beginPath();
      o.arc(R * 0.38, R * 0.32, R * 0.09, 0, 7);
      o.fill();
      return (SPR[c] = cv);
    };
    const BG = document.createElement('canvas');
    BG.width = 360 * DPR;
    BG.height = 540 * DPR;
    {
      const o = BG.getContext('2d');
      o.scale(DPR, DPR);
      let g = o.createLinearGradient(0, 0, 0, 540);
      g.addColorStop(0, '#0b1030');
      g.addColorStop(0.6, '#2a1a55');
      g.addColorStop(1, '#4a2260');
      o.fillStyle = g;
      o.fillRect(0, 0, 360, 540);
      for (let i = 0; i < 70; i++) {
        o.globalAlpha = 0.25 + Math.random() * 0.6;
        o.fillStyle = '#fff';
        o.beginPath();
        o.arc(Math.random() * 360, Math.random() * 360, Math.random() * 1.3 + 0.3, 0, 7);
        o.fill();
      }
      o.globalAlpha = 1;
      g = o.createRadialGradient(270, 120, 4, 270, 120, 90);
      g.addColorStop(0, '#fff6d855');
      g.addColorStop(1, '#fff6d800');
      o.fillStyle = g;
      o.fillRect(160, 20, 220, 220);
      o.fillStyle = '#fff3c4';
      o.beginPath();
      o.arc(270, 120, 16, 0, 7);
      o.fill();
      o.fillStyle = '#120c2a';
      o.beginPath();
      o.moveTo(0, 470);
      o.quadraticCurveTo(60, 400, 130, 410);
      o.lineTo(130, 470);
      o.fill();
      o.fillRect(70, 380, 40, 30);
      o.fillRect(62, 370, 8, 40);
      o.fillRect(110, 370, 8, 40);
      for (let i = 0; i < 14; i++) {
        const h = 40 + ((i * 37) % 60),
          xx = 130 + i * 17;
        o.fillStyle = '#160f33';
        o.fillRect(xx, 470 - h, 16, h);
        o.fillStyle = '#ffcf6a';
        for (let yy = 470 - h + 6; yy < 464; yy += 9)
          for (let k2 = 0; k2 < 2; k2++) if ((i * 7 + yy + k2 * 3) % 5 < 2) o.fillRect(xx + 3 + k2 * 7, yy, 3, 4);
      }
      o.fillStyle = '#0a0720';
      o.fillRect(0, 470, 360, 70);
      o.fillStyle = '#ffcf6a22';
      for (let i = 0; i < 30; i++) o.fillRect(Math.random() * 360, 476 + Math.random() * 50, 8 + Math.random() * 16, 1.5);
    }
    let topV = top,
      LB = {},
      PD = [];
    const bub = (X, Y, c, k, e, a, sc) => {
      x.save();
      x.globalAlpha = a == null ? 1 : a;
      const s2 = (R * 2 + 6) * (sc || 1);
      x.drawImage(sprite(c), X - s2 / 2, Y - s2 / 2, s2, s2);
      if (k) {
        x.fillStyle = '#ffffffdd';
        x.beginPath();
        x.arc(X, Y, R * 0.55, 0, 7);
        x.fill();
        x.font = '15px system-ui';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillStyle = '#000';
        x.fillText('🔎', X, Y + 1);
      }
      if (e) {
        const tw = (Math.sin(performance.now() / 260) + 1) / 2;
        x.globalAlpha = (a == null ? 1 : a) * tw;
        x.font = '12px system-ui';
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillStyle = '#000';
        x.fillText('✨', X + 9, Y - 9);
      }
      x.restore();
    };
    const draw = now => {
      x.drawImage(BG, 0, 0, 360, 540);
      topV += (top - topV) * 0.12;
      const off = topV - top;
      // plafond en laiton
      let g = x.createLinearGradient(0, 0, 0, topV);
      g.addColorStop(0, '#1a1238');
      g.addColorStop(1, '#2b1d55');
      x.fillStyle = g;
      x.fillRect(0, 0, 360, topV);
      g = x.createLinearGradient(0, topV - 8, 0, topV);
      g.addColorStop(0, '#fff0b0');
      g.addColorStop(1, '#a8791e');
      x.fillStyle = g;
      x.fillRect(0, topV - 8, 360, 8);
      for (let i = 0; i < 360; i += 40) {
        x.fillStyle = '#7a5210';
        x.beginPath();
        x.arc(i + 20, topV - 4, 2.2, 0, 7);
        x.fill();
      }
      x.font = '800 12px system-ui';
      x.textAlign = 'left';
      x.textBaseline = 'middle';
      x.fillStyle = '#fff';
      x.fillText(`🔎 ${freed}/${p.clues} indices`, 10, 16);
      x.textAlign = 'right';
      const nd = p.drop - (shots % p.drop);
      x.fillStyle = nd <= 2 ? '#ff9ab0' : '#cfd8ff';
      x.fillText(`⬇️ dans ${nd} tir${nd > 1 ? 's' : ''}`, 350, 16);
      grid.forEach(
        (row, a) =>
          row &&
          row.forEach((b, c) => {
            if (!b) return;
            const key = a + ',' + c,
              l = LB[key];
            let s = 1;
            if (l != null) {
              const t = (now - l) / 260;
              if (t >= 1) delete LB[key];
              else s = 1 + Math.sin(t * Math.PI) * 0.16;
            }
            bub(cx(a, c), cy(a) + off, b.c, b.k, b.egg, 1, s);
          })
      );
      for (const o of pops) {
        const k = 1 - o.t / 0.35;
        x.save();
        x.globalAlpha = Math.max(0, o.t / 0.35);
        x.strokeStyle = o.c;
        x.lineWidth = 3 * (1 - k) + 1;
        x.beginPath();
        x.arc(o.x, o.y + off, R + k * 16, 0, 7);
        x.stroke();
        x.restore();
      }
      for (const d of PD) {
        x.globalAlpha = Math.max(0, d.t * 2);
        x.fillStyle = d.c;
        x.beginPath();
        x.arc(d.x, d.y, d.r, 0, 7);
        x.fill();
      }
      x.globalAlpha = 1;
      for (const o of falls) {
        x.save();
        x.translate(o.x, o.y);
        x.rotate(((o.y - o.y0) / 60) * (o.sp || 1));
        bub(0, 0, o.c, o.k, o.e, Math.max(0, 1 - (o.y - o.y0) / 400));
        x.restore();
      }
      // ligne d'alerte
      let low = 0;
      grid.forEach(
        (row, a) =>
          row &&
          row.forEach(b => {
            if (b) low = Math.max(low, cy(a) + R);
          })
      );
      const dz = Math.max(0, 1 - (DL - low) / 90);
      x.save();
      x.setLineDash([6, 6]);
      x.lineDashOffset = -now / 40;
      x.strokeStyle = `rgba(255,77,109,${0.35 + dz * 0.6})`;
      x.lineWidth = 2 + dz * 2;
      x.beginPath();
      x.moveTo(0, DL);
      x.lineTo(360, DL);
      x.stroke();
      x.restore();
      // visée
      if (aim && !shot && st == 'play') {
        let a = Math.atan2(aim[1] - SY, aim[0] - SX);
        a = Math.max(-Math.PI + 0.15, Math.min(-0.15, a));
        let px = SX,
          py = SY,
          vx = Math.cos(a),
          vy = Math.sin(a);
        for (let i = 0; i < 46; i++) {
          px += vx * 11;
          py += vy * 11;
          if (px < R || px > 360 - R) vx *= -1;
          if (py < top + R) break;
          x.globalAlpha = 1 - i / 46;
          x.fillStyle = cur;
          x.beginPath();
          x.arc(px, py, 2.6, 0, 7);
          x.fill();
        }
        x.globalAlpha = 1;
      }
      // canon + Célestine
      const a0 = aim ? Math.max(-Math.PI + 0.15, Math.min(-0.15, Math.atan2(aim[1] - SY, aim[0] - SX))) : -Math.PI / 2;
      x.save();
      x.translate(SX, SY);
      x.rotate(a0 + Math.PI / 2);
      g = x.createLinearGradient(-10, 0, 10, 0);
      g.addColorStop(0, '#8a5e14');
      g.addColorStop(0.5, '#ffe08a');
      g.addColorStop(1, '#8a5e14');
      x.fillStyle = g;
      x.beginPath();
      x.roundRect(-10, -52, 20, 46, 7);
      x.fill();
      x.fillStyle = '#5a3a08';
      x.fillRect(-11, -54, 22, 6);
      x.restore();
      g = x.createRadialGradient(SX, SY + 10, 4, SX, SY + 10, 40);
      g.addColorStop(0, '#3a2a6a');
      g.addColorStop(1, '#1a1238');
      x.fillStyle = g;
      x.beginPath();
      x.arc(SX, SY + 14, 34, Math.PI, 0);
      x.fill();
      if (cur) bub(SX, SY, cur);
      bpic(x, 'celestine', SX + 52, SY + 16, 30, '#ff7aa8', st == 'dead');
      if (nxt) {
        bub(70, SY + 20, nxt, 0, 0, 0.9, 0.8);
        x.font = '700 10px system-ui';
        x.textAlign = 'center';
        x.fillStyle = '#cfd8ff';
        x.fillText('suivante', 70, SY + 44);
      }
      if (shot) {
        x.save();
        x.globalAlpha = 0.25;
        bub(shot.x - shot.vx * 0.02, shot.y - shot.vy * 0.02, shot.c);
        x.restore();
        bub(shot.x, shot.y, shot.c);
      }
      if (qT > 0) {
        x.save();
        x.globalAlpha = Math.min(1, qT * 3);
        x.font = '800 14px system-ui';
        x.textAlign = 'center';
        x.fillStyle = '#fff';
        x.shadowColor = '#000';
        x.shadowBlur = 8;
        x.fillText(quip, 180, DL + 22);
        x.restore();
      }
      if (st == 'ready') bready(x, '👆 Touche pour commencer');
      if (st == 'dead') {
        x.fillStyle = '#b3122e44';
        x.fillRect(0, 0, 360, 540);
      }
    };
    const loop = now => {
      if (id != RUN) return;
      const dt = Math.min(0.033, (now - (loop.t || now)) / 1000) || 0.016;
      loop.t = now;
      if (st == 'play') upd(dt);
      draw(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    G = {
      hint: () => {
        if (st != 'play') return false;
        top = Math.max(44, top - RH);
        say('⬆️ Le plafond remonte !');
        return true;
      },
      dbg: () => ({
        st,
        freed,
        shots,
        top,
        cur,
        shot: !!shot,
        B: grid.flatMap((row, a) => (row ? row.map((b, c) => (b ? { x: cx(a, c), y: cy(a), c: b.c } : null)).filter(Boolean) : []))
      })
    };
  };
} catch (e) {
  console.error(e);
}
