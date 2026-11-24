/* 🏒 Jour 6 : air hockey contre Valentin */
try {
  GAMES.hockey = function (p, el, win, fail) {
    const id = RUN;
    const { W, x, P } = bcv(el, `Glisse le doigt pour bouger ta palette 💗. Premier à ${p.goal} buts !`);
    const TW = 360,
      GW = 150,
      PR = 14,
      MR = 25,
      TOP = 34,
      BOT = 506,
      LFT = 16,
      RGT = 344,
      MID = (TOP + BOT) / 2;
    const QV = [
      'Trop facile ! 😎',
      'Arrête, ça glisse là !',
      'Tu triches, c’est sûr.',
      'C’était un coup de chance…',
      'Ok, ok… revanche.',
      'Je te laisse gagner, hein.',
      'Pas mal… pour une débutante.',
      'Je suis le roi de l’air hockey 👑'
    ];
    let derr = 0,
      side = 0,
      aimX = 180,
      stall = 0,
      cool = 0,
      st = 'ready',
      sc = [0, 0],
      pk = { x: 180, y: MID, vx: 0, vy: 0 },
      me = { x: 180, y: BOT - 70, vx: 0, vy: 0, tx: 180, ty: BOT - 70 },
      va = { x: 180, y: TOP + 70, vx: 0, vy: 0 },
      serve = 0,
      quip = 'Prête ? Je ne vais pas te faire de cadeau. 😏',
      qT = 2.6,
      walls = new Set(),
      last = '',
      flash = 0,
      flashC = '',
      T = 0,
      trail = [],
      shake = 0;
    const reset = who => {
      pk = { x: 180, y: who == 'me' ? MID + 60 : MID - 60, vx: 0, vy: 0 };
      serve = 0.8;
      walls.clear();
      last = '';
      trail = [];
    };
    const say = t => {
      quip = t;
      qT = 2;
    };
    let sndT = 0;
    const CT = {};
    W.onpointerdown = e => {
      e.preventDefault();
      if (st == 'ready') {
        st = 'play';
        reset('me');
      }
      const q = P(e);
      me.tx = q[0];
      me.ty = q[1];
    };
    W.onpointermove = e => {
      if (e.buttons || e.pointerType == 'touch') {
        const q = P(e);
        me.tx = q[0];
        me.ty = q[1];
      }
    };
    const sep = m => {
      const dx = pk.x - m.x,
        dy = pk.y - m.y,
        d = Math.hypot(dx, dy) || 0.01;
      if (d < PR + MR) {
        const nx = dx / d,
          ny = dy / d;
        m.x = pk.x - nx * (PR + MR);
        m.y = pk.y - ny * (PR + MR);
      }
    };
    const hitM = (m, who) => {
      const dx = pk.x - m.x,
        dy = pk.y - m.y,
        d = Math.hypot(dx, dy),
        R0 = PR + MR;
      if (d >= R0) {
        if (CT[who] > 0) CT[who]--;
        return;
      }
      const nx = d ? dx / d : 0,
        ny = d ? dy / d : who == 'me' ? -1 : 1;
      pk.x = m.x + nx * R0;
      pk.y = m.y + ny * R0;
      let mvx = m.vx,
        mvy = m.vy;
      const ms = Math.hypot(mvx, mvy);
      if (ms > 1300) {
        mvx *= 1300 / ms;
        mvy *= 1300 / ms;
      }
      const vn = (pk.vx - mvx) * nx + (pk.vy - mvy) * ny;
      if (vn < 0) {
        pk.vx -= 1.85 * vn * nx;
        pk.vy -= 1.85 * vn * ny;
        if (who == 'va') {
          const sh = Math.max(Math.hypot(pk.vx, pk.vy), 540 + Math.random() * 240),
            ax = aimX - pk.x,
            ay = BOT + 30 - pk.y,
            al = Math.hypot(ax, ay) || 1;
          pk.vx = (ax / al) * sh;
          pk.vy = Math.max(120, (ay / al) * sh);
          if (Math.random() < 0.3)
            try {
              say(
                ['Prends ça ! 💥', 'Attention, ça arrive !', 'Tir de champion 😎', 'Celle-là, tu l’arrêtes pas !'][(Math.random() * 4) | 0]
              );
            } catch (_) {}
          aimX = Math.random() < 0.35 ? (Math.random() < 0.5 ? -60 : 420) : 180 + (Math.random() - 0.5) * 90;
          cool = Math.max(cool, 0.35);
        }
        const sp = Math.hypot(pk.vx, pk.vy);
        if (sp > p.max) {
          pk.vx *= p.max / sp;
          pk.vy *= p.max / sp;
        }
        if (last != who) walls.clear();
        last = who;
        if (-vn > 120 && !CT[who]) {
          sparks(pk.x - nx * PR, pk.y - ny * PR, who == 'me' ? '#ff7aa8' : '#f3c623', Math.min(14, (-vn / 60) | 0));
          hsnd('hit', -vn);
        }
      }
      CT[who] = 5;
    };
    const hsnd = (k, v) => {
      const n = performance.now();
      if (n - sndT < 70) return;
      sndT = n;
      const g = Math.min(1, v / 700);
      try {
        if (k == 'hit') {
          bkT(1250, 0.025, 'square', 0.018 + 0.03 * g, 520);
          bkT(150, 0.07, 'sine', 0.05 + 0.07 * g, 90);
        } else if (k == 'wall') {
          bkT(820, 0.02, 'triangle', 0.015 + 0.025 * g, 360);
          bkT(220, 0.04, 'sine', 0.02 + 0.03 * g, 140);
        }
      } catch (_) {}
    };
    const goal = who => {
      gT = 1.1;
      gW = 'BUT !';
      sparks(pk.x, who == 'me' ? TOP : BOT, who == 'me' ? '#53e08a' : '#ff4d6d', 40);
      if (who == 'me') {
        sc[0]++;
        flash = 1;
        flashC = '#53e08a';
        shake = 0.3;
        try {
          SFX('ok');
        } catch (_) {}
        if (walls.has('l') && walls.has('r') && last == 'me') {
          EGG(6);
        }
        say(['NOOON ! 😱', 'Comment t’as fait ça ?!', 'Coup de chance…', 'Je t’ai laissée marquer.', 'Arrête de rire !'][sc[0] % 5]);
      } else {
        sc[1]++;
        flash = 1;
        flashC = '#ff4d6d';
        shake = 0.3;
        try {
          SFX('bad');
        } catch (_) {}
        say(QV[Math.floor(Math.random() * QV.length)]);
      }
      if (sc[0] >= p.goal) {
        st = 'won';
        if (sc[1] <= 2) ACH('master3');
        setTimeout(() => {
          if (id == RUN) win();
        }, 1100);
        return;
      }
      if (sc[1] >= p.goal) {
        st = 'dead';
        setTimeout(() => {
          if (id == RUN) fail(`Valentin a gagné ${sc[1]} à ${sc[0]} 😈`);
        }, 1100);
        return;
      }
      reset(who == 'me' ? 'va' : 'me');
    };
    const upd = dt => {
      T += dt;
      gT = Math.max(0, gT - dt);
      for (const s of SP) {
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.t -= dt;
      }
      SP = SP.filter(s => s.t > 0);
      qT = Math.max(0, qT - dt);
      flash = Math.max(0, flash - dt * 2);
      shake = Math.max(0, shake - dt);
      // ma palette
      const tx = Math.max(LFT + MR, Math.min(RGT - MR, me.tx)),
        ty = Math.max(MID + MR, Math.min(BOT - MR, me.ty)),
        ox = me.x,
        oy = me.y;
      {
        const k = 1 - Math.exp(-dt * 34);
        me.x += (tx - me.x) * k;
        me.y += (ty - me.y) * k;
      }
      me.vx = (me.x - ox) / dt;
      me.vy = (me.y - oy) / dt;
      // Valentin
      const ox2 = va.x,
        oy2 = va.y,
        lvl = p.ai * (1 + 0.06 * sc[0]);
      let gx, gy;
      cool = Math.max(0, cool - dt);
      {
        const sd = pk.y < MID;
        if (sd && !side) derr = (Math.random() - 0.5) * 180;
        if (sd && !side) aimX = Math.random() < 0.4 ? (Math.random() < 0.5 ? -70 : 430) : 180 + (Math.random() - 0.5) * 80;
        side = sd;
      }
      const spk = Math.hypot(pk.vx, pk.vy);
      let lv = lvl;
      if (pk.y < MID - 4 && serve <= 0 && cool <= 0) {
        const above = pk.y < va.y - 4;
        if (above) {
          const sx = pk.x < 180 ? 1 : -1,
            beside = Math.abs(va.x - pk.x) > PR + MR + 10;
          gx = pk.x + sx * (PR + MR + 22);
          gy = beside ? Math.max(TOP + MR, pk.y - (PR + MR + 12)) : Math.max(va.y, pk.y + PR + MR + 10);
          if (pk.vy < -120) {
            gx = 180 + Math.max(-GW / 2, Math.min(GW / 2, pk.x - 180)) * 0.8;
            gy = TOP + MR;
            if (Math.abs(va.x - pk.x) < PR + MR + 4 && va.y > pk.y) gx = pk.x + sx * (PR + MR + 18);
          }
        } else if (pk.vy < -160) {
          const tt = Math.max(0.05, (pk.y - (TOP + 56)) / -pk.vy);
          gx = pk.x + pk.vx * tt * 0.6 + derr;
          gy = TOP + 56;
          lv = lvl * 0.26;
        } else if (spk < 340 || pk.y < MID - 60) {
          const ddx = aimX - pk.x,
            ddy = BOT + 30 - pk.y,
            dl = Math.hypot(ddx, ddy) || 1,
            ux = ddx / dl,
            uy = ddy / dl,
            bx = pk.x - ux * (PR + MR + 6),
            by = pk.y - uy * (PR + MR + 6),
            beh = (va.x - pk.x) * ux + (va.y - pk.y) * uy < -(PR + MR) * 0.6;
          if (beh || Math.hypot(va.x - bx, va.y - by) < 12) {
            gx = pk.x + ux * 110;
            gy = pk.y + uy * 110;
            lv = lvl * 1.7;
          } else {
            gx = bx;
            gy = by;
            lv = lvl * 1.25;
          }
        } else {
          gx = pk.x + pk.vx * 0.05;
          gy = pk.y - 20;
        }
      } else {
        gx = 180 + (pk.x - 180) * 0.35 + Math.sin(T * 1.7) * 45;
        gy = TOP + 92 + Math.sin(T * 1.1) * 12;
      }
      gy = Math.max(TOP + MR, Math.min(MID - MR - 14, gy));
      gx = Math.max(LFT + MR, Math.min(RGT - MR, gx));
      const dx = gx - va.x,
        dy = gy - va.y,
        dd = Math.hypot(dx, dy),
        mv = Math.min(dd, lv * dt);
      if (dd > 0) {
        va.x += (dx / dd) * mv;
        va.y += (dy / dd) * mv;
      }
      va.vx = (va.x - ox2) / dt;
      va.vy = (va.y - oy2) / dt;
      if (serve > 0) {
        serve = Math.max(0, serve - dt);
        return;
      }
      // palet
      const n = 10;
      for (let k = 0; k < n; k++) {
        const h = dt / n;
        pk.x += pk.vx * h;
        pk.y += pk.vy * h;
        const inG = Math.abs(pk.x - 180) < GW / 2 - PR * 0.4;
        if (pk.x < LFT + PR) {
          pk.x = LFT + PR;
          if (pk.vx < 0) {
            if (pk.vx < -200 && !CT.l) hsnd('wall', -pk.vx);
            pk.vx = -pk.vx * 0.88;
            walls.add('l');
          }
          CT.l = 4;
        } else if (CT.l) CT.l--;
        if (pk.x > RGT - PR) {
          pk.x = RGT - PR;
          if (pk.vx > 0) {
            if (pk.vx > 200 && !CT.r) hsnd('wall', pk.vx);
            pk.vx = -pk.vx * 0.88;
            walls.add('r');
          }
          CT.r = 4;
        } else if (CT.r) CT.r--;
        if (!inG) {
          if (pk.y < TOP + PR) {
            pk.y = TOP + PR;
            if (pk.vy < 0) {
              if (pk.vy < -200 && !CT.t) hsnd('wall', -pk.vy);
              pk.vy = -pk.vy * 0.88;
            }
            CT.t = 4;
          } else if (CT.t) CT.t--;
          if (pk.y > BOT - PR) {
            pk.y = BOT - PR;
            if (pk.vy > 0) {
              if (pk.vy > 200 && !CT.b) hsnd('wall', pk.vy);
              pk.vy = -pk.vy * 0.88;
            }
            CT.b = 4;
          } else if (CT.b) CT.b--;
        }
        // coins arrondis
        for (const [ccx, ccy] of [
          [LFT + 20, TOP + 20],
          [RGT - 20, TOP + 20],
          [LFT + 20, BOT - 20],
          [RGT - 20, BOT - 20]
        ]) {
          const ox = pk.x - ccx,
            oy = pk.y - ccy;
          if (Math.sign(ox) == Math.sign(ccx - 180) && Math.sign(oy) == Math.sign(ccy - MID)) {
            const dd = Math.hypot(ox, oy),
              lim = 20 - PR + 6;
            if (dd > lim) {
              const ux = ox / dd,
                uy = oy / dd;
              pk.x = ccx + ux * lim;
              pk.y = ccy + uy * lim;
              const vn = pk.vx * ux + pk.vy * uy;
              if (vn > 0) {
                pk.vx -= 1.88 * vn * ux;
                pk.vy -= 1.88 * vn * uy;
              }
            }
          }
        }
        if (pk.y < TOP - PR) {
          goal('me');
          return;
        }
        if (pk.y > BOT + PR) {
          goal('va');
          return;
        }
        hitM(me, 'me');
        hitM(va, 'va');
        // palet coincé entre une palette et un bord : c'est la palette qui recule
        const cx2 = Math.max(LFT + PR, Math.min(RGT - PR, pk.x)),
          cy2 = inG ? pk.y : Math.max(TOP + PR, Math.min(BOT - PR, pk.y));
        if (cx2 != pk.x || cy2 != pk.y) {
          pk.x = cx2;
          pk.y = cy2;
          sep(me);
          sep(va);
        }
      }
      if (Math.hypot(pk.vx, pk.vy) < 25) {
        stall += dt;
        if (stall > 1.6) {
          stall = 0;
          cool = 1.2;
          pk.vx += (180 - pk.x) * 1.6;
          pk.vy += (MID - pk.y) * 1.6;
        }
      } else stall = 0;
      const f = Math.pow(0.8, dt);
      pk.vx *= f;
      pk.vy *= f;
      if (Math.hypot(pk.vx, pk.vy) < 30 && Math.abs(pk.y - MID) < 6) {
        pk.vy += (Math.random() < 0.5 ? -1 : 1) * 40;
      }
      trail.push([pk.x, pk.y]);
      if (trail.length > 12) trail.shift();
      if (Math.random() < dt * 0.06) say(QV[Math.floor(Math.random() * QV.length)]);
    };
    const DPR = Math.min(3, devicePixelRatio || 1),
      TB = document.createElement('canvas');
    TB.width = 360 * DPR;
    TB.height = 540 * DPR;
    {
      const o = TB.getContext('2d');
      o.scale(DPR, DPR);
      let g = o.createRadialGradient(180, 270, 60, 180, 270, 420);
      g.addColorStop(0, '#24345f');
      g.addColorStop(1, '#070b18');
      o.fillStyle = g;
      o.fillRect(0, 0, 360, 540);
      o.fillStyle = '#ffffff08';
      for (let i = 0; i < 9; i++) {
        o.beginPath();
        o.moveTo(40 * i - 40, 0);
        o.lineTo(40 * i + 60, 0);
        o.lineTo(40 * i - 140, 540);
        o.lineTo(40 * i - 240, 540);
        o.fill();
      }
      o.save();
      o.shadowColor = '#000';
      o.shadowBlur = 24;
      o.shadowOffsetY = 10;
      g = o.createLinearGradient(0, 0, 360, 0);
      g.addColorStop(0, '#2b2f3a');
      g.addColorStop(0.5, '#4a5060');
      g.addColorStop(1, '#2b2f3a');
      o.fillStyle = g;
      o.beginPath();
      o.roundRect(LFT - 10, TOP - 12, RGT - LFT + 20, BOT - TOP + 24, 26);
      o.fill();
      o.restore();
      o.strokeStyle = '#ffffff30';
      o.lineWidth = 2;
      o.beginPath();
      o.roundRect(LFT - 8, TOP - 10, RGT - LFT + 16, BOT - TOP + 20, 24);
      o.stroke();
      g = o.createLinearGradient(0, TOP, 0, BOT);
      g.addColorStop(0, '#dff1ff');
      g.addColorStop(0.5, '#f8fcff');
      g.addColorStop(1, '#dff1ff');
      o.fillStyle = g;
      o.beginPath();
      o.roundRect(LFT, TOP, RGT - LFT, BOT - TOP, 18);
      o.fill();
      o.save();
      o.beginPath();
      o.roundRect(LFT, TOP, RGT - LFT, BOT - TOP, 18);
      o.clip();
      o.fillStyle = '#7fb0e0';
      for (let i = 0; i < 15; i++)
        for (let j = 0; j < 24; j++) {
          o.globalAlpha = 0.22;
          o.beginPath();
          o.arc(LFT + 10 + i * 23, TOP + 10 + j * 20.4, 1.2, 0, 7);
          o.fill();
        }
      o.globalAlpha = 1;
      g = o.createLinearGradient(LFT, TOP, RGT, BOT);
      g.addColorStop(0, '#ffffff00');
      g.addColorStop(0.45, '#ffffff66');
      g.addColorStop(0.55, '#ffffff00');
      o.fillStyle = g;
      o.fillRect(LFT, TOP, RGT - LFT, BOT - TOP);
      o.font = '900 34px system-ui';
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.fillStyle = '#3f7fe812';
      o.fillText('LYON 8e', 180, MID - 120);
      o.fillText('DOSSIER 24', 180, MID + 120);
      o.strokeStyle = '#e8344e';
      o.lineWidth = 4;
      o.beginPath();
      o.moveTo(LFT, MID);
      o.lineTo(RGT, MID);
      o.stroke();
      o.strokeStyle = '#3f7fe8';
      o.lineWidth = 3;
      o.beginPath();
      o.arc(180, MID, 50, 0, 7);
      o.stroke();
      o.fillStyle = '#3f7fe8';
      o.beginPath();
      o.arc(180, MID, 7, 0, 7);
      o.fill();
      for (const [y0, dir] of [
        [TOP, 1],
        [BOT, -1]
      ]) {
        o.strokeStyle = '#3f7fe8';
        o.lineWidth = 3;
        o.beginPath();
        o.arc(180, y0, 72, dir > 0 ? 0 : Math.PI, dir > 0 ? Math.PI : Math.PI * 2);
        o.stroke();
        o.strokeStyle = '#e8344e';
        o.lineWidth = 2;
        o.beginPath();
        o.moveTo(LFT, y0 + dir * 110);
        o.lineTo(RGT, y0 + dir * 110);
        o.stroke();
      }
      o.restore();
      for (const y0 of [TOP - 9, BOT + 1]) {
        g = o.createLinearGradient(0, y0, 0, y0 + 8);
        g.addColorStop(0, '#05070d');
        g.addColorStop(1, '#1a1f2b');
        o.fillStyle = g;
        o.beginPath();
        o.roundRect(180 - GW / 2, y0, GW, 8, 4);
        o.fill();
      }
      o.strokeStyle = '#ff4fa3';
      o.lineWidth = 4;
      o.shadowColor = '#ff4fa3';
      o.shadowBlur = 14;
      o.beginPath();
      o.roundRect(LFT, TOP, RGT - LFT, BOT - TOP, 18);
      o.stroke();
      o.shadowBlur = 0;
    }
    const GL = document.createElement('canvas');
    GL.width = GL.height = 64;
    {
      const o = GL.getContext('2d'),
        g = o.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, '#ffffffcc');
      g.addColorStop(1, '#ffffff00');
      o.fillStyle = g;
      o.fillRect(0, 0, 64, 64);
    }
    let SP = [],
      gT = 0,
      gW = '';
    const sparks = (X, Y, c, n) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.28,
          v = 80 + Math.random() * 220;
        SP.push({ x: X, y: Y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, t: 0.5 + Math.random() * 0.4, c });
      }
    };
    const mallet = (m, ring, face) => {
      x.save();
      x.globalAlpha = 0.35;
      x.fillStyle = '#0a1a33';
      x.beginPath();
      x.ellipse(m.x + 4, m.y + 8, MR * 1.02, MR * 0.86, 0, 0, 7);
      x.fill();
      x.restore();
      let g = x.createRadialGradient(m.x - 9, m.y - 11, 3, m.x, m.y, MR + 3);
      g.addColorStop(0, '#ffffff');
      g.addColorStop(0.35, ring);
      g.addColorStop(1, '#00000088');
      x.fillStyle = g;
      x.beginPath();
      x.arc(m.x, m.y, MR + 2, 0, 7);
      x.fill();
      bpic(x, face, m.x, m.y, MR * 1.42, ring, (st == 'won' && face == 'valentin') || (st == 'dead' && face == 'celestine'));
      x.fillStyle = '#ffffff55';
      x.beginPath();
      x.ellipse(m.x - 8, m.y - 12, 9, 5, -0.6, 0, 7);
      x.fill();
    };
    const draw = now => {
      x.save();
      if (shake) x.translate(((Math.random() - 0.5) * 8 * shake) / 0.3, ((Math.random() - 0.5) * 8 * shake) / 0.3);
      x.drawImage(TB, 0, 0, 360, 540);
      // traînée lissée
      if (trail.length > 2) {
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1],
            b = trail[i],
            k = i / trail.length;
          x.strokeStyle = `rgba(63,127,232,${k * 0.35})`;
          x.lineWidth = PR * 2 * k;
          x.lineCap = 'round';
          x.beginPath();
          x.moveTo(a[0], a[1]);
          x.lineTo(b[0], b[1]);
          x.stroke();
        }
      }
      // palet
      x.save();
      x.globalAlpha = 0.3;
      x.fillStyle = '#0a1a33';
      x.beginPath();
      x.ellipse(pk.x + 3, pk.y + 5, PR, PR * 0.8, 0, 0, 7);
      x.fill();
      x.restore();
      let g = x.createRadialGradient(pk.x - 4, pk.y - 5, 2, pk.x, pk.y, PR);
      g.addColorStop(0, '#6a7390');
      g.addColorStop(1, '#0c0f1a');
      x.fillStyle = g;
      x.beginPath();
      x.arc(pk.x, pk.y, PR, 0, 7);
      x.fill();
      x.strokeStyle = '#ffd34d';
      x.lineWidth = 2.2;
      x.beginPath();
      x.arc(pk.x, pk.y, PR * 0.62, 0, 7);
      x.stroke();
      x.fillStyle = '#ffffff40';
      x.beginPath();
      x.ellipse(pk.x - 4, pk.y - 5, 5, 3, -0.6, 0, 7);
      x.fill();
      mallet(va, '#f3c623', 'valentin');
      mallet(me, '#ff7aa8', 'celestine');
      for (const s of SP) {
        x.globalAlpha = Math.max(0, s.t * 1.6);
        x.drawImage(GL, s.x - 6, s.y - 6, 12, 12);
        x.fillStyle = s.c;
        x.beginPath();
        x.arc(s.x, s.y, 2, 0, 7);
        x.fill();
      }
      x.globalAlpha = 1;
      x.restore();
      // tableau de score
      g = x.createLinearGradient(0, 0, 0, 30);
      g.addColorStop(0, '#1d2a4a');
      g.addColorStop(1, '#0d1424');
      x.fillStyle = g;
      x.fillRect(0, 0, 360, 30);
      bpic(x, 'valentin', 16, 15, 18, '#f3c623');
      bpic(x, 'celestine', 344, 15, 18, '#ff7aa8');
      x.font = '900 18px ui-monospace,Menlo,monospace';
      x.textBaseline = 'middle';
      x.textAlign = 'center';
      x.fillStyle = '#ffd34d';
      x.shadowColor = '#ffd34d';
      x.shadowBlur = 8;
      x.fillText(sc[1], 108, 16);
      x.fillStyle = '#ff9ec0';
      x.shadowColor = '#ff7aa8';
      x.fillText(sc[0], 252, 16);
      x.shadowBlur = 0;
      x.font = '800 10px system-ui';
      x.fillStyle = '#9fb4d8';
      x.fillText(`— premier à ${p.goal} —`, 180, 16);
      x.textAlign = 'left';
      x.fillStyle = '#ffd34d';
      x.fillText('Valentin', 30, 16);
      x.textAlign = 'right';
      x.fillStyle = '#ff9ec0';
      x.fillText('Célestine', 330, 16);
      if (qT > 0) {
        x.save();
        x.globalAlpha = Math.min(1, qT * 3);
        NBX.bub(x, 64, TOP + 92, 232, quip, { tail: Math.max(80, Math.min(280, va.x)), up: 1 });
        x.restore();
      }
      if (gT > 0) {
        const k = 1 - gT / 1.1,
          sz = 30 + Math.min(1, k * 4) * 22;
        x.save();
        x.globalAlpha = Math.min(1, gT * 2);
        x.font = `900 ${sz}px system-ui`;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.lineWidth = 6;
        x.strokeStyle = '#14213d';
        x.strokeText(gW, 180, MID);
        x.fillStyle = flashC;
        x.fillText(gW, 180, MID);
        x.restore();
      }
      if (st == 'ready') bready(x, '👆 Touche pour engager');
      if (st == 'dead') {
        x.fillStyle = '#b3122e44';
        x.fillRect(0, 0, 360, 540);
      }
    };
    const loop = now => {
      if (id != RUN) return;
      const dt = Math.min(0.033, (now - (loop.t || now)) / 1000) || 0.016;
      loop.t = now;
      if (st == 'play') {
        upd(dt / 2);
        if (st == 'play') upd(dt / 2);
      } else {
        for (const s of SP) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.t -= dt;
        }
        gT = Math.max(0, gT - dt);
      }
      draw(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    G = {
      hint: () => {
        if (st != 'play') return false;
        p.ai *= 0.8;
        say('Je… je suis fatigué. 😮‍💨');
        return true;
      },
      dbg: () => ({ pk, me, va, sc, st, last })
    };
  };
} catch (e) {
  console.error(e);
}
