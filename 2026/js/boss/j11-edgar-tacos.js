/* 🌯 Edgar : tacos express (boutique de nuit, broche qui tourne, néon) */
try {
  GAMES.bkebab = function (p, el, win, fail) {
    const id = RUN;
    const { W, x, P } = bcv(
      el,
      'Glisse le doigt pour déplacer la galette. Attrape SEULEMENT le prochain ingrédient de la commande, évite les autres !'
    );
    const ING = [
      ['🥩', 'viande'],
      ['🥗', 'salade'],
      ['🍗', 'poulet'],
      ['🧅', 'oignons'],
      ['🧀', 'cheddar'],
      ['🌶️', 'harissa'],
      ['🍟', 'frites']
    ];
    const QU = [
      'Sauce fromagère, toujours.',
      'Plus vite, j’ai faim !',
      'Les frites DEDANS, hein.',
      'J’ai sauté le goûter, là.',
      'Tu le fais exprès ?',
      'Ça sent bon…',
      'Maman m’attend pour dîner. Chut.'
    ];
    let st = 'ready',
      hp = p.hp,
      lives = p.lives,
      px = 180,
      tx = 180,
      F = [],
      sp = 0.9,
      ord = [],
      got = 0,
      stack = [],
      bHit = 0,
      bad = 0,
      quip = 'Un tacos XL. Vite. 🌯',
      qT = 2.5,
      serve = 0,
      T = 0,
      len = 3,
      inv = 0,
      pf = [];
    const order = () => {
      const a = [...ING.keys()].sort(() => Math.random() - 0.5);
      ord = a.slice(0, len);
      got = 0;
      stack = [];
      len = Math.min(5, len + 1);
    };
    const spawn = () => {
      const need = ord[got],
        r = Math.random();
      let i;
      if (r < 0.35) i = need;
      else if (r < 0.4) i = -1;
      else {
        do {
          i = Math.floor(Math.random() * ING.length);
        } while (i == need);
      }
      F.push({
        i,
        x: 40 + Math.random() * 290,
        y: 170,
        v: (185 + 165 * (1 - hp / p.hp)) * (0.85 + Math.random() * 0.35),
        r: (Math.random() - 0.5) * 3,
        a: 0,
        w: Math.random() < 0.2 * (1 - hp / p.hp) + 0.05 ? (Math.random() < 0.5 ? -1 : 1) * 60 : 0
      });
    };
    W.onpointerdown = e => {
      e.preventDefault();
      if (st == 'ready') {
        st = 'play';
        order();
        timer(
          p.time,
          () => {
            if (st == 'play') {
              st = 'dead';
              fail(`Edgar attend encore ${hp} tacos`);
            }
          },
          id
        );
      }
      tx = P(e)[0];
    };
    W.onpointermove = e => {
      if (e.buttons || e.pointerType == 'touch') tx = P(e)[0];
    };
    const upd = dt => {
      T += dt;
      qT = Math.max(0, qT - dt);
      inv = Math.max(0, inv - dt);
      px += (Math.max(40, Math.min(330, tx)) - px) * Math.min(1, dt * 14);
      for (const o of pf) {
        o.t -= dt;
        o.y -= 50 * dt;
      }
      pf = pf.filter(o => o.t > 0);
      if (serve > 0) {
        serve -= dt;
        if (serve <= 0) {
          if (hp <= 0) {
            st = 'won';
            setTimeout(() => {
              if (id == RUN) win();
            }, 500);
            return;
          }
          order();
        }
        return;
      }
      sp -= dt;
      if (sp <= 0) {
        spawn();
        sp = Math.max(0.42, 0.8 - 0.38 * (1 - hp / p.hp)) * (0.8 + Math.random() * 0.4);
      }
      for (const f of F) {
        f.y += f.v * dt;
        f.a += f.r * dt;
        if (f.w) {
          f.x += f.w * dt;
          if (f.x < 30 || f.x > 330) f.w = -f.w;
        }
        const top = 470 - stack.length * 13;
        if (!f.done && Math.abs(f.y - top) < 18 && Math.abs(f.x - px) < 46) {
          f.done = 1;
          if (f.i == ord[got] || f.i == -1) {
            stack.push(f.i == -1 ? '🫕' : ING[f.i][0]);
            got++;
            pf.push({ x: px, y: top - 20, t: 0.6, e: '+1' });
            try {
              SFX('ok');
            } catch (_) {}
            if (f.i == -1) {
              quip = 'La sauce fromagère, ça compte toujours !';
              qT = 1.4;
            }
            if (got >= ord.length) {
              hp--;
              bHit = performance.now();
              serve = 1.1;
              F = [];
              quip = ['Mmmh… PARFAIT. 🤤', 'Ok… celui-là, il est bon.', 'Encore un ! J’ai encore faim.'][hp % 3];
              qT = 1.6;
              try {
                bkT(660, 0.15, 'triangle', 0.06);
                setTimeout(() => bkT(990, 0.25, 'triangle', 0.06), 120);
              } catch (_) {}
            }
          } else if (!inv) {
            lives--;
            inv = 0.8;
            bad = performance.now();
            try {
              SFX('bad');
            } catch (_) {}
            quip = `Des ${ING[f.i][1]} ?! J’ai rien demandé !`;
            qT = 1.6;
            if (lives <= 0) {
              st = 'dead';
              setTimeout(() => {
                if (id == RUN) fail('Edgar a fait « beurk » et il est parti manger ailleurs');
              }, 800);
            }
          }
        }
      }
      F = F.filter(f => !f.done && f.y < 560);
      if (Math.random() < dt * 0.15) {
        quip = QU[Math.floor(Math.random() * QU.length)];
        qT = 1.8;
      }
    };
    const draw = now => {
      // carrelage blanc + lumière jaune
      x.fillStyle = '#f3ead8';
      x.fillRect(0, 0, 360, 540);
      x.strokeStyle = '#d8ccb4';
      x.lineWidth = 1;
      for (let y = 0; y < 540; y += 20) {
        x.beginPath();
        x.moveTo(0, y);
        x.lineTo(360, y);
        x.stroke();
      }
      for (let y = 0; y < 540; y += 20)
        for (let i = ((y / 20) % 2) * 10; i < 360; i += 20) {
          x.beginPath();
          x.moveTo(i, y);
          x.lineTo(i, y + 20);
          x.stroke();
        }
      const lg = x.createRadialGradient(180, 160, 20, 180, 200, 420);
      lg.addColorStop(0, '#ffd98a44');
      lg.addColorStop(1, '#3a241888');
      x.fillStyle = lg;
      x.fillRect(0, 0, 360, 540);
      // broche qui tourne
      x.save();
      x.translate(26, 300);
      x.fillStyle = '#777';
      x.fillRect(-2, -150, 4, 300);
      const bg = x.createLinearGradient(-24, 0, 24, 0);
      bg.addColorStop(0, '#5a2a12');
      bg.addColorStop(0.5, '#b8642a');
      bg.addColorStop(1, '#5a2a12');
      x.fillStyle = bg;
      x.beginPath();
      x.moveTo(-26, -110);
      x.lineTo(26, -110);
      x.lineTo(16, 110);
      x.lineTo(-16, 110);
      x.fill();
      x.strokeStyle = '#4a1e0a88';
      x.lineWidth = 2;
      for (let i = 0; i < 10; i++) {
        const yy = -110 + ((i * 24 + T * 40) % 220);
        x.beginPath();
        x.moveTo(-24 + yy * 0.045, yy);
        x.lineTo(24 - yy * 0.045, yy + 6);
        x.stroke();
      }
      x.fillStyle = '#ff8a3d33';
      x.fillRect(22, -120, 14, 240);
      x.restore();
      // néon
      x.fillStyle = '#2a1a12';
      x.beginPath();
      x.roundRect(78, 96, 144, 52, 10);
      x.fill();
      x.strokeStyle = '#5a3a22';
      x.lineWidth = 3;
      x.stroke();
      x.save();
      x.font = '900 22px system-ui';
      x.textAlign = 'center';
      x.shadowColor = '#ff4fa3';
      x.shadowBlur = Math.floor(T * 3) % 9 == 0 ? 2 : 16;
      x.fillStyle = '#ffd1ea';
      x.fillText('TACOS', 150, 120);
      x.shadowColor = '#3de0ff';
      x.fillStyle = '#d6fbff';
      x.font = '800 12px system-ui';
      x.fillText('DU 8e · OUVERT TARD', 150, 138);
      x.restore();
      // ticket de commande
      x.save();
      x.shadowColor = '#0004';
      x.shadowBlur = 6;
      x.fillStyle = '#fffdf6';
      x.beginPath();
      x.moveTo(12, 10);
      x.lineTo(214, 10);
      x.lineTo(214, 80);
      for (let i = 0; i <= 20; i++) x.lineTo(214 - i * 10.1, 80 + (i % 2 ? 6 : 0));
      x.closePath();
      x.fill();
      x.restore();
      x.font = '800 10.5px ui-monospace,Menlo,monospace';
      x.fillStyle = '#555';
      x.textAlign = 'left';
      x.fillText('TICKET · EDGAR · À EMPORTER', 20, 25);
      ord.forEach((i, j) => {
        const X = 30 + j * 31;
        bemo(x, ING[i][0], X, 54, 24);
        if (j < got) {
          x.strokeStyle = '#2f8f5b';
          x.lineWidth = 3;
          x.beginPath();
          x.moveTo(X - 11, 54);
          x.lineTo(X + 11, 54);
          x.stroke();
        }
        if (j == got && !serve) {
          x.strokeStyle = '#e0457b';
          x.lineWidth = 2.5;
          x.beginPath();
          x.roundRect(X - 15, 38, 30, 32, 6);
          x.stroke();
        }
      });
      bpic(x, 'edgar', 300, 52, 64, now - bHit < 200 ? '#53c07a' : now - bad < 250 ? '#ff3d6e' : '#ffcf4a', st == 'won');
      if (qT > 0) NBX.bub(x, 122, 150, 226, quip, { tail: 300, up: 1 });
      for (const f of F) {
        x.fillStyle = '#0002';
        x.beginPath();
        x.ellipse(f.x, 488, 14, 4, 0, 0, 7);
        x.fill();
        x.save();
        x.translate(f.x, f.y);
        x.rotate(f.a);
        bemo(x, f.i == -1 ? '🫕' : ING[f.i][0], 0, 0, 36);
        x.restore();
      }
      // comptoir inox
      const cg = x.createLinearGradient(0, 494, 0, 540);
      cg.addColorStop(0, '#d9dee3');
      cg.addColorStop(1, '#8a939c');
      x.fillStyle = cg;
      x.fillRect(0, 494, 360, 46);
      x.fillStyle = '#ffffff88';
      x.fillRect(0, 494, 360, 2);
      const by = 482;
      x.save();
      if (inv > 0 && Math.floor(now / 80) % 2) x.globalAlpha = 0.4;
      x.fillStyle = '#0003';
      x.beginPath();
      x.ellipse(px, by + 12, 54, 8, 0, 0, 7);
      x.fill();
      x.fillStyle = '#e8c27a';
      x.beginPath();
      x.ellipse(px, by, 54, 14, 0, 0, 7);
      x.fill();
      x.fillStyle = '#c98f45';
      for (let i = -3; i <= 3; i++) {
        x.beginPath();
        x.arc(px + i * 12, by - 2 + (i % 2) * 3, 1.6, 0, 7);
        x.fill();
      }
      stack.forEach((e, j) => bemo(x, e, px + (j % 2 ? 8 : -8), by - 12 - j * 13, 26));
      x.restore();
      for (const o of pf) {
        x.globalAlpha = o.t / 0.6;
        x.font = '900 16px system-ui';
        x.fillStyle = '#2f8f5b';
        x.textAlign = 'center';
        x.fillText(o.e, o.x, o.y);
        x.globalAlpha = 1;
      }
      if (serve > 0) {
        x.fillStyle = '#0006';
        x.fillRect(0, 0, 360, 540);
        bemo(x, '🌯', 180, 280, 90 * (1 + (1.1 - serve) * 0.3));
        x.save();
        x.font = '900 30px system-ui';
        x.textAlign = 'center';
        x.shadowColor = '#ff4fa3';
        x.shadowBlur = 14;
        x.fillStyle = '#fff';
        x.fillText('SERVI !', 180, 370);
        x.restore();
      }
      NBX.flash(x, now, bad);
      bbar(x, hp, p.hp, `🌯 Edgar · encore ${hp} tacos`, now - bHit < 200, 500);
      NBX.hearts(x, lives, p.lives, 352, 104, 'right');
      NBX.end(x, st);
    };
    const loop = now => {
      if (id != RUN) return;
      const dt = Math.min(0.05, (now - (loop.t || now)) / 1000);
      loop.t = now;
      if (st == 'play') upd(dt);
      draw(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    G = {
      dbg: () => ({ F, ord, got, px, st, hp, lives, stack, serve }),
      key: k => {
        if (k == 'ArrowLeft') tx = px - 60;
        if (k == 'ArrowRight') tx = px + 60;
      },
      hint: () => {
        if (st != 'play') return false;
        lives++;
        F = F.filter(f => f.i == ord[got]);
        return true;
      }
    };
  };
} catch (e) {
  console.error(e);
}
