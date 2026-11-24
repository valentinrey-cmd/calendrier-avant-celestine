/* 🚇 Valentin : poursuite dans les couloirs du métro Bellecour (v3 : douce et fluide) */
try {
  GAMES.bmetro = function (p, el, win, fail) {
    const id = RUN;
    const { W, x, P } = bcv(
      el,
      'Touche à gauche ou à droite (ou glisse) pour changer de couloir. Évite la foule et rattrape Valentin avant son métro !'
    );
    const VX = 180,
      VY = 168,
      PY = 470,
      FAR = 60,
      N = -1.3,
      HW = 170,
      H = 400;
    const kz = D => 1 / (1 + Math.max(-0.95, D) / 7),
      pt = (o, D, h) => {
        const k = kz(D);
        return [VX + o * k, VY + (PY - VY) * k - h * k];
      };
    const fog = D => Math.max(0, Math.min(1, (FAR - D) / 14));
    const OB = ['🧳', '🎸', '🚧', '🛴', '🛒', '📦', '🧍', '👨‍👩‍👧'],
      EX = [
        'J’ai mon métro !',
        'Je change juste à Bellecour !',
        'C’est pour la forme, hein !',
        'Tu m’as vu ? Non.',
        'Je suis pressé, c’est tout !',
        'Ligne D, ligne D…'
      ];
    const POST = [
      ['BELLECOUR', '#2b4c7e', '#fff'],
      ['LUMIÈRES', '#d9884a', '#2b1a0e'],
      ['LIGNE D', '#3f8f5b', '#fff'],
      ['LIGNE A', '#b8404a', '#fff'],
      ['PRESQU’ÎLE', '#6a5a93', '#fff']
    ];
    // décor fixe pré-dessiné une seule fois (aucun scintillement)
    const off = document.createElement('canvas');
    off.width = 720;
    off.height = 1080;
    const o = off.getContext('2d');
    o.scale(2, 2);
    {
      const q = (a, b, c, d, f) => {
        o.fillStyle = f;
        o.beginPath();
        o.moveTo(...a);
        o.lineTo(...b);
        o.lineTo(...c);
        o.lineTo(...d);
        o.fill();
      };
      o.fillStyle = '#1c2236';
      o.fillRect(0, 0, 360, 540);
      let g = o.createLinearGradient(0, 0, 0, VY);
      g.addColorStop(0, '#232a40');
      g.addColorStop(1, '#3a4160');
      q(pt(-HW, FAR, H), pt(HW, FAR, H), pt(HW, N, H), pt(-HW, N, H), g);
      for (const s of [-1, 1]) {
        g = o.createLinearGradient(VX + s * HW * kz(N), 0, VX, 0);
        g.addColorStop(0, '#b8a888');
        g.addColorStop(1, '#efe5cf');
        q(pt(s * HW, FAR, 0), pt(s * HW, FAR, H), pt(s * HW, N, H), pt(s * HW, N, 0), g);
        g = o.createLinearGradient(VX + s * HW * kz(N), 0, VX, 0);
        g.addColorStop(0, '#2d4f86');
        g.addColorStop(1, '#6f8fc4');
        q(pt(s * HW, FAR, 58), pt(s * HW, N, 58), pt(s * HW, N, 74), pt(s * HW, FAR, 74), g);
        q(pt(s * HW, FAR, 0), pt(s * HW, N, 0), pt(s * HW, N, 18), pt(s * HW, FAR, 18), '#00000022');
      }
      g = o.createLinearGradient(0, VY, 0, 540);
      g.addColorStop(0, '#a3a29e');
      g.addColorStop(1, '#5d5c5a');
      q(pt(-HW, FAR, 0), pt(HW, FAR, 0), pt(HW, N, 0), pt(-HW, N, 0), g);
      o.strokeStyle = '#ffffff30';
      o.lineWidth = 2;
      for (const l of [-55, 55]) {
        o.beginPath();
        o.moveTo(...pt(l, FAR, 0));
        o.lineTo(...pt(l, N, 0));
        o.stroke();
      }
      const fg = o.createRadialGradient(VX, VY - 10, 2, VX, VY - 10, 110);
      fg.addColorStop(0, '#fff3d0');
      fg.addColorStop(0.35, '#fff3d066');
      fg.addColorStop(1, '#fff3d000');
      o.fillStyle = fg;
      o.fillRect(0, 40, 360, 260);
    }
    const glow = document.createElement('canvas');
    glow.width = glow.height = 64;
    {
      const gx = glow.getContext('2d'),
        gg = gx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gg.addColorStop(0, '#fff6d8cc');
      gg.addColorStop(1, '#fff6d800');
      gx.fillStyle = gg;
      gx.fillRect(0, 0, 64, 64);
    }
    let st = 'ready',
      lane = 1,
      ln = 1,
      gap = 0,
      O = [],
      spT = 1,
      inv = 0,
      bad = 0,
      bHit = 0,
      lives = p.lives,
      vl = 1,
      vln = 1,
      vlT = 2,
      T = 0,
      quip = EX[0],
      qT = 2,
      run = 0,
      boost = 0,
      sx0 = null,
      gates = 10,
      dist = 0;
    const k = () => gap;
    const spawn = () => {
      if (gates <= 0) {
        gates = 9 + Math.random() * 5;
        const op = Math.floor(Math.random() * 3);
        for (let i = 0; i < 3; i++) O.push({ l: i, D: FAR, gate: 1, open: i == op });
        return;
      }
      const n = Math.random() < 0.32 + 0.3 * k() ? 2 : 1,
        ls = [0, 1, 2].sort(() => Math.random() - 0.5).slice(0, n);
      for (const l of ls)
        O.push({
          l,
          D: FAR + Math.random() * 4,
          e: OB[Math.floor(Math.random() * OB.length)],
          mv: Math.random() < 0.18 + 0.15 * k() ? 1 : 0
        });
      if (Math.random() < 0.28) {
        const fl = [0, 1, 2].find(l => !ls.includes(l));
        if (fl != null) O.push({ l: fl, D: FAR + 8, e: Math.random() < 0.55 ? '☕' : '🎫', bon: 1 });
      }
    };
    const mv = d => {
      if (st == 'play') lane = Math.max(0, Math.min(2, lane + d));
    };
    W.onpointerdown = e => {
      e.preventDefault();
      if (st == 'ready') {
        st = 'play';
        timer(
          p.time,
          () => {
            if (st == 'play') {
              st = 'dead';
              fail('les portes du métro se sont refermées sur Valentin');
            }
          },
          id
        );
        return;
      }
      sx0 = P(e)[0];
    };
    W.onpointerup = e => {
      if (sx0 == null) return;
      const q = P(e)[0],
        d = q - sx0;
      if (Math.abs(d) > 25) mv(d > 0 ? 1 : -1);
      else mv(q < 180 ? -1 : 1);
      sx0 = null;
    };
    const upd = dt => {
      T += dt;
      qT = Math.max(0, qT - dt);
      inv = Math.max(0, inv - dt);
      boost = Math.max(0, boost - dt);
      ln += (lane - ln) * (1 - Math.exp(-dt * 12));
      vln += (vl - vln) * (1 - Math.exp(-dt * 4));
      const sp = (p.v * (1 + 0.45 * k()) * (boost ? 1.3 : 1)) / 10;
      run += dt * (boost ? 13 : 10);
      dist += sp * dt;
      gap = Math.min(1, gap + dt * (p.rate + (boost ? p.rate * 1.4 : 0)));
      if (gap >= 1) {
        st = 'won';
        bHit = performance.now();
        quip = 'Ok ok ! Je… changeais juste de métro. 😅';
        qT = 3;
        setTimeout(() => {
          if (id == RUN) win();
        }, 1100);
        return;
      }
      spT -= dt;
      if (spT <= 0) {
        spawn();
        gates--;
        spT = Math.max(0.5, 1 - 0.45 * k()) * (0.85 + Math.random() * 0.3);
      }
      for (const o of O) {
        o.D -= sp * dt;
        if (o.mv && o.D < 40 && o.D > 15 && !o.tl) {
          o.tl = 1;
          o.to = o.l == 1 ? (Math.random() < 0.5 ? 0 : 2) : 1;
        }
        if (o.tl) {
          o.l += (o.to - o.l) * (1 - Math.exp(-dt * 2.4));
        }
        if (!o.hit && Math.abs(o.D) < 1.6 && Math.abs(o.l - ln) < 0.55) {
          o.hit = 1;
          if (o.bon) {
            if (o.e == '☕') {
              boost = 2.5;
              quip = '☕ Un café et ça repart !';
              qT = 1.2;
            } else {
              gap = Math.min(1, gap + 0.05);
              quip = '🎫 Pas besoin de faire la queue !';
              qT = 1.2;
            }
            try {
              SFX('ok');
            } catch (_) {}
          } else if (o.gate && o.open) {
          } else if (!inv) {
            lives--;
            inv = 1.1;
            bad = performance.now();
            gap = Math.max(0, gap - 0.08);
            try {
              SFX('bad');
            } catch (_) {}
            quip = o.gate ? 'Bip ! Portillon fermé ⛔' : ['Pardon madame !', 'Aïe, la valise…', 'Désolée monsieur !'][lives % 3];
            qT = 1.3;
            if (lives <= 0) {
              st = 'dead';
              setTimeout(() => {
                if (id == RUN) fail('Célestine s’est perdue dans la correspondance');
              }, 900);
            }
          }
        }
      }
      O = O.filter(o => o.D > -3);
      vlT -= dt;
      if (vlT <= 0) {
        vlT = 1.6 + Math.random() * 1.4;
        vl = Math.floor(Math.random() * 3);
        if (Math.random() < 0.4) {
          quip = EX[Math.floor(Math.random() * EX.length)];
          qT = 1.8;
        }
      }
    };
    const person = (X, Y, s, coat, hair, ph, skin, lg) => {
      x.save();
      x.translate(X, Y);
      x.scale(s, s);
      x.fillStyle = '#0000002a';
      x.beginPath();
      x.ellipse(0, 0, 22, 6, 0, 0, 7);
      x.fill();
      const a = Math.sin(ph) * 0.5,
        b = Math.abs(Math.cos(ph)) * 3;
      x.translate(0, -b);
      x.fillStyle = '#2b2b3a';
      x.save();
      x.translate(-7, -34);
      x.rotate(a);
      x.beginPath();
      x.roundRect(-4, 0, 8, 34, 3);
      x.fill();
      x.restore();
      x.save();
      x.translate(7, -34);
      x.rotate(-a);
      x.beginPath();
      x.roundRect(-4, 0, 8, 34, 3);
      x.fill();
      x.restore();
      x.fillStyle = coat;
      x.save();
      x.translate(-17, -76);
      x.rotate(-a * 0.7);
      x.beginPath();
      x.roundRect(-6, 0, 8, 32, 4);
      x.fill();
      x.restore();
      x.save();
      x.translate(17, -76);
      x.rotate(a * 0.7);
      x.beginPath();
      x.roundRect(-2, 0, 8, 32, 4);
      x.fill();
      x.restore();
      x.beginPath();
      x.roundRect(-17, -82, 34, 52, [12, 12, 6, 6]);
      x.fill();
      x.fillStyle = skin || '#f1c9a5';
      x.fillRect(-4, -88, 8, 8);
      x.fillStyle = hair;
      x.beginPath();
      x.arc(0, -98, 13, 0, 7);
      x.fill();
      if (lg) {
        const sw = Math.sin(ph) * 2.5;
        x.beginPath();
        x.moveTo(-13, -100);
        x.quadraticCurveTo(-17 + sw, -80, -15 + sw, -58);
        x.quadraticCurveTo(0 + sw, -50, 15 + sw, -58);
        x.quadraticCurveTo(17 + sw, -80, 13, -100);
        x.closePath();
        x.fill();
        x.strokeStyle = '#ffffff22';
        x.lineWidth = 1.2;
        x.beginPath();
        x.moveTo(-5, -104);
        x.quadraticCurveTo(-7 + sw, -80, -6 + sw, -60);
        x.moveTo(5, -104);
        x.quadraticCurveTo(7 + sw, -80, 6 + sw, -60);
        x.stroke();
      }
      x.restore();
    };
    const quad = (a, b, c, d) => {
      x.beginPath();
      x.moveTo(...a);
      x.lineTo(...b);
      x.lineTo(...c);
      x.lineTo(...d);
      x.fill();
    };
    const draw = now => {
      x.drawImage(off, 0, 0, 360, 540);
      // repères en mouvement, discrets : joints du sol, piliers, néons, affiches (apparition en fondu)
      const s8 = dist % 8;
      for (let D = FAR - s8; D > N; D -= 8) {
        x.globalAlpha = 0.1 * fog(D);
        x.fillStyle = '#000';
        quad(pt(-HW, D, 0), pt(HW, D, 0), pt(HW, D - 0.35, 0), pt(-HW, D - 0.35, 0));
      }
      const s10 = dist % 10;
      for (let D = FAR - s10; D > N; D -= 10) {
        const f = fog(D);
        x.globalAlpha = 0.08 * f;
        x.fillStyle = '#3a2a10';
        for (const s of [-1, 1]) quad(pt(s * HW, D, 0), pt(s * HW, D, H), pt(s * HW, D - 1.2, H), pt(s * HW, D - 1.2, 0));
        x.globalAlpha = f * 0.9;
        x.fillStyle = '#fff8e2';
        quad(pt(-26, D, H), pt(26, D, H), pt(26, D - 1.6, H), pt(-26, D - 1.6, H));
        const c = pt(0, D - 0.8, H),
          w = 110 * kz(D);
        x.globalAlpha = f * 0.7;
        x.drawImage(glow, c[0] - w / 2, c[1] - w / 4, w, w / 2);
      }
      const s20 = dist % 20,
        pi = Math.floor(dist / 20);
      for (let D = FAR - s20, j = 0; D > N + 5; D -= 20, j++)
        for (const s of [-1, 1]) {
          const P0 = POST[(pi + j + (s > 0 ? 2 : 0)) % POST.length];
          x.globalAlpha = fog(D);
          x.fillStyle = P0[1];
          quad(pt(s * HW, D, 110), pt(s * HW, D - 6, 110), pt(s * HW, D - 6, 220), pt(s * HW, D, 220));
          const k2 = kz(D - 3);
          if (k2 > 0.32) {
            const a = pt(s * HW, D - 3, 162);
            x.save();
            x.translate(a[0], a[1]);
            x.scale(k2 * 0.55, k2);
            x.fillStyle = P0[2];
            x.font = '900 18px system-ui';
            x.textAlign = 'center';
            x.fillText(P0[0].slice(0, 12), 0, 6);
            x.restore();
          }
        }
      x.globalAlpha = 1;
      // objets et Valentin, du fond vers l'avant, en fondu depuis le fond
      const items = O.filter(o => !(o.hit && (o.bon || !o.gate))).map(o => ({ o, D: o.D }));
      const vD = 4 + (1 - gap) * 34;
      items.push({ v: 1, D: vD });
      items.sort((a, b) => b.D - a.D);
      let vxy = null;
      for (const it of items) {
        const D = it.D,
          kk = kz(D);
        if (D > FAR) continue;
        x.globalAlpha = fog(D);
        if (it.v) {
          const X = VX + (vln - 1) * 110 * kk,
            Y = VY + (PY - VY) * kk;
          person(X, Y, kk * 1.05, '#2b5c9a', '#3a2a1e', run * 1.1, '#e9c09b');
          x.globalAlpha = 1;
          bpic(x, 'valentin', X, Y - 128 * kk, Math.max(20, 44 * kk), now - bHit < 300 ? '#53c07a' : '#f3c623', st == 'won');
          vxy = [X, Y - 128 * kk];
          continue;
        }
        const o = it.o,
          X = VX + (o.l - 1) * 110 * kk,
          Y = VY + (PY - VY) * kk;
        if (o.gate) {
          const w = 84 * kk,
            h = 66 * kk;
          x.fillStyle = '#6b7183';
          x.beginPath();
          x.roundRect(X - w / 2, Y - h, w * 0.24, h, 4 * kk);
          x.fill();
          x.beginPath();
          x.roundRect(X + w / 4 + w * 0.01, Y - h, w * 0.24, h, 4 * kk);
          x.fill();
          x.fillStyle = o.open ? '#43d17a' : '#e8505b';
          x.beginPath();
          x.arc(X - w * 0.38, Y - h * 0.85, 4 * kk + 1, 0, 7);
          x.fill();
          if (!o.open) {
            x.fillStyle = '#d9434ecc';
            x.beginPath();
            x.roundRect(X - w / 4, Y - h * 0.6, w / 2, 9 * kk, 4 * kk);
            x.fill();
          } else {
            x.fillStyle = '#43d17a2a';
            x.fillRect(X - w / 4, Y - h, w / 2, h);
          }
          continue;
        }
        x.fillStyle = '#0000002a';
        x.beginPath();
        x.ellipse(X, Y, 26 * kk, 7 * kk, 0, 0, 7);
        x.fill();
        if (o.bon) {
          x.drawImage(glow, X - 36 * kk, Y - 70 * kk, 72 * kk, 72 * kk);
        }
        bemo(x, o.e, X, Y - 34 * kk, Math.max(8, 64 * kk));
      }
      x.globalAlpha = 1;
      // Célestine, de dos
      const cX = VX + (ln - 1) * 110;
      x.save();
      if (inv > 0) x.globalAlpha = 0.45 + 0.35 * Math.sin(now / 70);
      person(cX, PY + 34, 1.05, '#a3324f', '#4a2a18', run * 1.25, null, 1);
      x.restore();
      if (boost) {
        const g = x.createRadialGradient(180, 300, 120, 180, 300, 330);
        g.addColorStop(0, '#ffcf4a00');
        g.addColorStop(1, '#ffcf4a44');
        x.fillStyle = g;
        x.fillRect(0, 0, 360, 540);
      }
      // bulle fixe en haut, avec une flèche vers Valentin
      if (qT > 0 && vxy) {
        x.save();
        x.globalAlpha = Math.min(1, qT * 3);
        NBX.bub(x, 76, 48, 276, quip, {});
        x.strokeStyle = '#ffffffcc';
        x.lineWidth = 2;
        x.beginPath();
        x.moveTo(214, 84);
        x.lineTo(vxy[0], Math.max(92, vxy[1] - 26));
        x.stroke();
        x.restore();
      }
      // panneau de station
      x.fillStyle = '#14213d';
      x.fillRect(0, 0, 360, 40);
      x.font = '900 17px system-ui';
      x.textAlign = 'center';
      x.fillStyle = '#fff';
      x.fillText('BELLECOUR', 180, 26);
      for (const [t, c, X] of [
        ['A', '#d62828', 62],
        ['D', '#2a9d4a', 298]
      ]) {
        x.fillStyle = c;
        x.beginPath();
        x.arc(X, 20, 11, 0, 7);
        x.fill();
        x.font = '900 13px system-ui';
        x.fillStyle = '#fff';
        x.fillText(t, X, 25);
      }
      NBX.flash(x, now, bad);
      // plan de la ligne = progression
      x.fillStyle = '#14213df0';
      x.fillRect(0, 500, 360, 40);
      x.strokeStyle = '#2a9d4a';
      x.lineWidth = 6;
      x.lineCap = 'round';
      x.beginPath();
      x.moveTo(30, 516);
      x.lineTo(330, 516);
      x.stroke();
      for (let i = 0; i <= 5; i++) {
        x.fillStyle = '#fff';
        x.beginPath();
        x.arc(30 + i * 60, 516, 4, 0, 7);
        x.fill();
      }
      bemo(x, '🏃‍♀️', 30 + 300 * gap, 514, 20);
      bpic(x, 'valentin', 330, 516, 20, '#f3c623');
      x.font = '800 10px system-ui';
      x.fillStyle = '#cfe';
      x.textAlign = 'center';
      x.fillText(`${Math.round(gap * 100)} % · rattrape Valentin`, 180, 535);
      NBX.hearts(x, lives, p.lives, 8, 62);
      NBX.end(x, st);
    };
    const loop = now => {
      if (id != RUN) return;
      const dt = Math.min(0.04, (now - (loop.t || now)) / 1000);
      loop.t = now;
      if (st == 'play') upd(dt);
      draw(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    G = {
      dbg: () => ({ O, lane, st, gap, lives }),
      key: k => {
        if (k == 'ArrowLeft') mv(-1);
        if (k == 'ArrowRight') mv(1);
      },
      hint: () => {
        if (st != 'play') return false;
        gap = Math.min(0.95, gap + 0.15);
        lives++;
        return true;
      }
    };
  };
} catch (e) {
  console.error(e);
}
