/* 💊 Sandrine : le comptoir de la pharmacie (rayonnages, croix verte, clients pressés) */
try {
  GAMES.bcomptoir = function (p, el, win, fail) {
    const id = RUN;
    const { W, x, P } = bcv(
      el,
      'Lis ce que veut chaque client et touche le bon produit avant qu’il s’impatiente. Ne sers pas ceux qui viennent juste discuter !'
    );
    const IT = [
      { e: '🌡️', k: 'fievre', l: 'Fièvre', c: '#e74c3c' },
      { e: '🧻', k: 'rhume', l: 'Rhume', c: '#3498db' },
      { e: '🍬', k: 'gorge', l: 'Gorge', c: '#e67e22' },
      { e: '🩹', k: 'bobo', l: 'Bobo', c: '#c0a16b' },
      { e: '🧴', k: 'peau', l: 'Peau sèche', c: '#1abc9c' },
      { e: '🍼', k: 'bebe', l: 'Bébé', c: '#f78fb3' }
    ];
    const ASK = {
      fievre: ['🤒 J’ai 38,5 !', '🥵 Je suis brûlant', '🤒 Mon fils est chaud'],
      rhume: ['🤧 Atchoum !', '🤧 Mon nez coule', '🤧 Je renifle depuis lundi'],
      gorge: ['😷 Mal à la gorge', '🗣️ J’ai plus de voix', '😷 J’ai la gorge qui gratte'],
      bobo: ['🤕 Je me suis coupé', '🔪 L’épluche-légumes…', '🦵 Je suis tombée à vélo'],
      peau: ['🥶 Mes mains gercent', '🧤 J’ai la peau sèche', '💋 Mes lèvres craquent'],
      bebe: ['👶 C’est pour mon petit', '🍼 Le bébé a faim', '👶 Pour ma petite-fille']
    };
    const CHAT = [
      '🙋 Je viens dire bonjour !',
      '☁️ Il fait gris, hein ?',
      '📰 Vous avez vu le match ?',
      '🐈 Mon chat va bien, merci.',
      '🎄 Vous fermez à quelle heure ?'
    ];
    const FACES = ['👵', '👴', '👨', '🧔', '👩', '🧑‍🎓', '👷', '🤵', '👩‍🦳', '🧑‍🦱'],
      COATS = ['#5b6abf', '#bf5b7a', '#3f8f6b', '#b58a3a', '#6a4a8a', '#2f6f8f', '#8a3f3f'];
    const SL = [64, 180, 296];
    let st = 'ready',
      hp = p.hp,
      lives = p.lives,
      C = [null, null, null],
      shelf = [...IT.keys()],
      spT = 0.5,
      bHit = 0,
      bad = 0,
      quip = 'Samedi, 9 h. Les clients arrivent ! 🏃‍♀️',
      qT = 2.5,
      shuf = 0,
      shT = 18,
      T = 0,
      pops = [];
    const k = () => 1 - hp / p.hp;
    const spawn = () => {
      const fr = C.map((c, i) => (c ? -1 : i)).filter(i => i >= 0);
      if (!fr.length) return;
      const s = fr[Math.floor(Math.random() * fr.length)],
        chat = Math.random() < 0.16,
        it = IT[Math.floor(Math.random() * IT.length)],
        arr = chat ? CHAT : ASK[it.k];
      C[s] = {
        f: FACES[Math.floor(Math.random() * FACES.length)],
        co: COATS[Math.floor(Math.random() * COATS.length)],
        k: chat ? null : it.k,
        t: arr[Math.floor(Math.random() * arr.length)],
        pat: 0,
        lim: (chat ? 4.5 : 8.6 - 4.4 * k()) * (0.9 + Math.random() * 0.25),
        in: 0
      };
    };
    const hurt = why => {
      lives--;
      bad = performance.now();
      quip = why;
      qT = 1.6;
      try {
        SFX('bad');
      } catch (_) {}
      if (lives <= 0) {
        st = 'dead';
        setTimeout(() => {
          if (id == RUN) fail('la file d’attente est sortie dans la rue');
        }, 900);
      }
    };
    const btn = i => {
      const c = i % 3,
        r = Math.floor(i / 3);
      return [16 + c * 112, 392 + r * 70, 104, 62];
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
              fail(`il restait ${hp} clients à servir`);
            }
          },
          id
        );
        return;
      }
      if (st != 'play' || shuf > 0) return;
      const q = P(e);
      for (let i = 0; i < 6; i++) {
        const [bx, by, bw, bh] = btn(i);
        if (q[0] > bx && q[0] < bx + bw && q[1] > by && q[1] < by + bh) {
          const it = IT[shelf[i]];
          let best = -1;
          C.forEach((c, j) => {
            if (c && !c.gone && c.k == it.k && (best < 0 || c.lim - c.pat < C[best].lim - C[best].pat)) best = j;
          });
          if (best >= 0) {
            const c = C[best];
            c.gone = 1;
            c.ok = 1;
            c.end = 0.6;
            hp--;
            bHit = performance.now();
            pops.push({ x: SL[best], y: 190, t: 1, e: '💶' });
            try {
              SFX('ok');
            } catch (_) {}
            quip = ['Merci, bonne journée !', 'Parfait, merci !', 'Ah, enfin ! 😌'][hp % 3];
            qT = 1.2;
            if (hp <= 0) {
              st = 'won';
              setTimeout(() => {
                if (id == RUN) win();
              }, 900);
            }
          } else {
            const ch = C.findIndex(c => c && !c.gone && !c.k);
            hurt(ch >= 0 ? 'Il voulait juste discuter, lui…' : `Personne n’a demandé ${it.e} !`);
          }
          return;
        }
      }
    };
    const upd = dt => {
      T += dt;
      qT = Math.max(0, qT - dt);
      for (const o of pops) {
        o.t -= dt;
        o.y -= 40 * dt;
      }
      pops = pops.filter(o => o.t > 0);
      if (shuf > 0) {
        shuf -= dt;
        if (shuf <= 0) shelf.sort(() => Math.random() - 0.5);
        return;
      }
      shT -= dt;
      if (shT <= 0) {
        shT = 16 + Math.random() * 7;
        shuf = 1.1;
        quip = '📦 Sandrine range la livraison… tout a bougé !';
        qT = 2.2;
      }
      spT -= dt;
      if (spT <= 0) {
        spawn();
        spT = (2 - 1.1 * k()) * (0.7 + Math.random() * 0.6);
      }
      C.forEach((c, i) => {
        if (!c) return;
        c.in = Math.min(1, c.in + dt * 4);
        if (c.gone) {
          c.end -= dt;
          if (c.end <= 0) C[i] = null;
          return;
        }
        c.pat += dt;
        if (c.pat >= c.lim) {
          c.gone = 1;
          c.end = 0.6;
          if (c.k) {
            c.angry = 1;
            hurt('😡 Un client part sans rien !');
          } else {
            c.bye = 1;
          }
        }
      });
    };
    const draw = now => {
      x.fillStyle = '#eef7f1';
      x.fillRect(0, 0, 360, 540);
      // rayonnages au fond
      for (let r = 0; r < 3; r++) {
        x.fillStyle = '#d6e6dc';
        x.fillRect(0, 96 + r * 58, 360, 6);
        for (let i = 0; i < 24; i++) {
          const h = 18 + ((i * 7 + r * 13) % 14),
            w = 11 + ((i * 5 + r) % 6);
          x.fillStyle = ['#e8f0ff', '#ffe8ef', '#fff4d6', '#e0f7ef', '#f3e6ff'][(i + r) % 5];
          x.fillRect(4 + i * 15, 96 + r * 58 - h, w, h);
          x.fillStyle = ['#5b8def', '#e0457b', '#e6a23c', '#2f8f5b', '#8a5cf6'][(i + r) % 5];
          x.fillRect(4 + i * 15, 96 + r * 58 - h + 4, w, 3);
        }
      }
      x.fillStyle = '#eef7f1cc';
      x.fillRect(0, 40, 360, 190);
      // enseigne
      x.fillStyle = '#1f7a4c';
      x.fillRect(0, 0, 360, 38);
      x.save();
      x.translate(30, 19);
      const on = Math.floor(T * 2) % 2;
      x.shadowColor = '#4dff9a';
      x.shadowBlur = on ? 16 : 4;
      x.fillStyle = on ? '#4dff9a' : '#2fbf6b';
      x.fillRect(-4, -12, 8, 24);
      x.fillRect(-12, -4, 24, 8);
      x.restore();
      x.font = '900 14px system-ui';
      x.textAlign = 'center';
      x.fillStyle = '#fff';
      x.fillText('PHARMACIE DE REYRIEUX', 190, 24);
      bpic(x, 'sandrine', 318, 70, 48, now - bHit < 200 ? '#53c07a' : now - bad < 250 ? '#ff3d6e' : '#1f7a4c', st == 'won');
      if (qT > 0) NBX.bub(x, 10, 46, 284, quip, { tail: 286, up: 0 });
      x.fillStyle = '#1f3d30';
      x.fillRect(0, 94, 360, 42);
      bbar(x, hp, p.hp, `💊 Sandrine · encore ${hp} client${hp > 1 ? 's' : ''}`, now - bHit < 200, 97);
      C.forEach((c, i) => {
        if (!c) return;
        const X = SL[i],
          a = c.gone ? Math.max(0, c.end / 0.6) : c.in,
          y0 = (1 - c.in) * 30;
        x.save();
        x.globalAlpha = a;
        x.fillStyle = c.co;
        x.beginPath();
        x.roundRect(X - 30, 268 + y0, 60, 50, [22, 22, 4, 4]);
        x.fill();
        x.fillStyle = '#0002';
        x.fillRect(X - 2, 272 + y0, 4, 40);
        if (!c.gone) {
          const f = 1 - c.pat / c.lim;
          x.strokeStyle = '#0002';
          x.lineWidth = 5;
          x.beginPath();
          x.arc(X, 246 + y0, 28, 0, 7);
          x.stroke();
          x.strokeStyle = f < 0.3 ? '#ff3d6e' : f < 0.6 ? '#ffb347' : '#53c07a';
          x.beginPath();
          x.arc(X, 246 + y0, 28, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2);
          x.stroke();
        }
        bemo(x, c.angry ? '😡' : c.ok ? '😊' : c.f, X, 246 + y0, 42);
        const sp = c.t.indexOf(' ');
        x.fillStyle = c.k ? '#fff' : '#fff7d6';
        x.strokeStyle = c.k ? '#9bc' : '#e6c36a';
        x.lineWidth = 1.5;
        x.beginPath();
        x.roundRect(X - 55, 142, 110, 68, 10);
        x.fill();
        x.stroke();
        x.beginPath();
        x.moveTo(X - 7, 210);
        x.lineTo(X, 219);
        x.lineTo(X + 7, 210);
        x.fill();
        bemo(x, c.t.slice(0, sp), X, 160, 22);
        x.font = '700 11px system-ui';
        x.textAlign = 'center';
        x.fillStyle = '#24443a';
        NBX.wrap(x, c.t.slice(sp + 1), 100)
          .slice(0, 2)
          .forEach((l, j) => x.fillText(l, X, 184 + j * 14));
        x.restore();
      });
      for (const o of pops) {
        x.globalAlpha = o.t;
        bemo(x, o.e, o.x, o.y, 28);
        x.globalAlpha = 1;
      }
      // comptoir
      const cg = x.createLinearGradient(0, 318, 0, 350);
      cg.addColorStop(0, '#c99a62');
      cg.addColorStop(1, '#8a6036');
      x.fillStyle = cg;
      x.fillRect(0, 318, 360, 30);
      x.fillStyle = '#ffffff55';
      x.fillRect(0, 318, 360, 3);
      x.fillStyle = '#e3ede7';
      x.fillRect(0, 348, 360, 192);
      x.font = '800 11px system-ui';
      x.textAlign = 'center';
      x.fillStyle = '#4a6a5a';
      x.fillText('TIROIRS · touche le bon produit', 180, 378);
      for (let i = 0; i < 6; i++) {
        const [bx, by, bw, bh] = btn(i),
          it = IT[shelf[i]],
          j = shuf > 0 ? Math.sin(now / 40 + i) * 6 : 0;
        x.save();
        x.shadowColor = '#0003';
        x.shadowBlur = 5;
        x.shadowOffsetY = 3;
        x.fillStyle = '#fff';
        x.beginPath();
        x.roundRect(bx + j, by, bw, bh, 10);
        x.fill();
        x.restore();
        x.fillStyle = shuf > 0 ? '#999' : it.c;
        x.beginPath();
        x.roundRect(bx + j, by + bh - 18, bw, 18, [0, 0, 10, 10]);
        x.fill();
        x.fillStyle = '#ccc';
        x.fillRect(bx + j + bw / 2 - 14, by + 6, 28, 4);
        bemo(x, shuf > 0 ? '📦' : it.e, bx + bw / 2 + j, by + 26, 26);
        x.font = '800 11px system-ui';
        x.fillStyle = '#fff';
        x.fillText(shuf > 0 ? '…' : it.l, bx + bw / 2 + j, by + bh - 5);
      }
      NBX.flash(x, now, bad);
      NBX.hearts(x, lives, p.lives, 354, 338, 'right');
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
      dbg: () => ({ C, shelf, IT, shuf, st, hp, lives }),
      hint: () => {
        if (st != 'play') return false;
        lives++;
        C.forEach(c => {
          if (c && !c.gone) c.pat = 0;
        });
        return true;
      }
    };
  };
} catch (e) {
  console.error(e);
}
