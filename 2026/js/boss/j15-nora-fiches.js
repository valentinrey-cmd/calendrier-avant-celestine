/* 📚 Nora : les fiches de révision (vrai ou faux, à toute vitesse) */
try {
  GAMES.bfiches = function (p, el, win, fail) {
    const id = RUN;
    const { W, x, P } = bcv(el, 'Glisse la fiche à droite si c’est VRAI, à gauche si c’est FAUX (ou touche les boutons). Vite !');
    const Q = [
      ['Le paracétamol fait baisser la fièvre.', 1],
      ['L’ibuprofène est un antibiotique.', 0],
      ['Les antibiotiques ne marchent pas contre les virus.', 1],
      ['Un rhume se soigne avec des antibiotiques.', 0],
      ['Fleming a découvert la pénicilline.', 1],
      ['Le cœur humain a 2 cavités.', 0],
      ['Le cœur humain a 4 cavités.', 1],
      ['L’insuline est fabriquée par le pancréas.', 1],
      ['L’insuline est fabriquée par le foie.', 0],
      ['Le foie est le plus gros organe interne.', 1],
      ['L’aspirine se mange en salade.', 0],
      ['On trouve de la vitamine C dans les agrumes.', 1],
      ['Le soleil aide la peau à fabriquer de la vitamine D.', 1],
      ['Les globules rouges combattent les microbes.', 0],
      ['Les globules blancs combattent les microbes.', 1],
      ['Un adulte a 206 os.', 1],
      ['Un adulte a 2 000 os.', 0],
      ['H₂O, c’est de l’eau.', 1],
      ['NaCl, c’est du sucre.', 0],
      ['NaCl, c’est du sel.', 1],
      ['Un placebo contient un principe actif.', 0],
      ['Un vaccin entraîne le corps à se défendre.', 1],
      ['Un suppositoire se prend par la bouche.', 0],
      ['La morphine est un antidouleur.', 1],
      ['Un pH de 7, c’est très acide.', 0],
      ['Un pH de 7, c’est neutre.', 1],
      ['Les poumons servent à digérer.', 0],
      ['L’estomac contient de l’acide.', 1],
      ['Trop de paracétamol abîme le foie.', 1],
      ['Doliprane et paracétamol, ce n’est pas la même molécule.', 0],
      ['L’eau pure bout à 100 °C au niveau de la mer.', 1],
      ['L’eau pure bout à 50 °C.', 0],
      ['Le lieutenant Pépin a eu son permis du premier coup.', 0],
      ['Le sang humain contient du fer.', 1],
      ['Les reins filtrent le sang.', 1],
      ['On a trois reins.', 0],
      ['L’ADN a une forme de double hélice.', 1],
      ['Les virus sont plus gros que les bactéries.', 0]
    ];
    const QU = [
      'Plus vite, j’ai un partiel ! 📚',
      'Tu as révisé, au moins ?',
      'Moi je connais tout par cœur. Presque.',
      'Surligné en fluo = important.',
      'J’ai pas dormi de la nuit…',
      'Ça tombe à l’exam, ça !'
    ];
    let st = 'ready',
      hp = p.hp,
      lives = p.lives,
      deck = [],
      cur = null,
      drag = null,
      dx = 0,
      fly = null,
      bHit = 0,
      bad = 0,
      quip = 'Une fiche, une réponse. Go ! ⚡',
      qT = 2.2,
      T = 0,
      inv = 0,
      invT = 9,
      flipT = 7,
      combo = 0,
      res = null;
    const k = () => 1 - hp / p.hp;
    const next = () => {
      if (!deck.length) deck = [...Q.keys()].sort(() => Math.random() - 0.5);
      const i = deck.pop();
      cur = { q: Q[i][0], v: Q[i][1], t: 0, lim: Math.max(2.3, 5.4 - 3 * k()), flip: flipT <= 0 && k() > 0.2, hl: Math.random() < 0.35 };
      if (cur.flip) flipT = 7 + Math.random() * 5;
      dx = 0;
    };
    const answer = a => {
      if (!cur || fly) return;
      const want = inv > 0 ? 1 - cur.v : cur.v;
      const ok = a == want;
      fly = { dir: a ? 1 : -1, t: 0, c: cur };
      if (ok) {
        hp--;
        combo++;
        bHit = performance.now();
        res = { ok: 1, t: 0.5 };
        try {
          SFX('ok');
        } catch (_) {}
        if (combo % 5 == 0) {
          quip = `${combo} d’affilée ! 🔥`;
          qT = 1.4;
        }
        if (hp <= 0) {
          st = 'won';
          setTimeout(() => {
            if (id == RUN) win();
          }, 700);
        }
      } else {
        lives--;
        combo = 0;
        bad = performance.now();
        res = { ok: 0, t: 0.7, v: cur.v };
        try {
          SFX('bad');
        } catch (_) {}
        quip = cur.v ? 'C’était VRAI ! 😱' : 'C’était FAUX ! 😬';
        qT = 1.5;
        if (lives <= 0) {
          st = 'dead';
          setTimeout(() => {
            if (id == RUN) fail('Nora a dit « tu vas te planter au partiel »');
          }, 800);
        }
      }
      cur = null;
    };
    W.onpointerdown = e => {
      e.preventDefault();
      if (st == 'ready') {
        st = 'play';
        next();
        timer(
          p.time,
          () => {
            if (st == 'play') {
              st = 'dead';
              fail(`il restait ${hp} fiches`);
            }
          },
          id
        );
        return;
      }
      if (st != 'play') return;
      const q = P(e);
      if (q[1] > 422 && q[1] < 480) {
        answer(q[0] > 180 ? 1 : 0);
        return;
      }
      drag = { x0: q[0] };
    };
    W.onpointermove = e => {
      if (drag) {
        dx = P(e)[0] - drag.x0;
      }
    };
    W.onpointerup = W.onpointercancel = () => {
      if (!drag) return;
      drag = null;
      if (Math.abs(dx) > 70) answer(dx > 0 ? 1 : 0);
      else dx = 0;
    };
    const upd = dt => {
      T += dt;
      qT = Math.max(0, qT - dt);
      if (res) {
        res.t -= dt;
        if (res.t <= 0) res = null;
      }
      if (fly) {
        fly.t += dt;
        if (fly.t > 0.28) {
          fly = null;
          if (st == 'play') next();
        }
        return;
      }
      if (inv > 0) {
        inv -= dt;
        if (inv <= 0) {
          quip = 'C’est bon, c’est fini, on remet à l’endroit !';
          qT = 1.6;
        }
      } else {
        invT -= dt;
        if (invT <= 0 && k() > 0.15) {
          invT = 12 + Math.random() * 6;
          inv = 6;
          quip = '⚠️ Mode piège : réponds L’INVERSE !';
          qT = 2.2;
        }
      }
      flipT -= dt;
      if (cur) {
        cur.t += dt;
        if (cur.t >= cur.lim) {
          lives--;
          combo = 0;
          bad = performance.now();
          res = { ok: 0, t: 0.7, v: cur.v };
          quip = 'Trop lent ! Fiche suivante.';
          qT = 1.4;
          try {
            SFX('bad');
          } catch (_) {}
          fly = { dir: 0, t: 0, c: cur };
          cur = null;
          if (lives <= 0) {
            st = 'dead';
            setTimeout(() => {
              if (id == RUN) fail('Nora a dit « tu vas te planter au partiel »');
            }, 800);
          }
        }
      }
      if (Math.random() < dt * 0.08) {
        quip = QU[Math.floor(Math.random() * QU.length)];
        qT = 1.8;
      }
    };
    const card = (c, X, Y, rot, a) => {
      x.save();
      x.translate(X, Y);
      x.rotate(rot + (c.flip ? Math.PI : 0));
      x.globalAlpha = a;
      x.shadowColor = '#0006';
      x.shadowBlur = 14;
      x.shadowOffsetY = 6;
      x.fillStyle = '#fffaf0';
      x.beginPath();
      x.roundRect(-140, -100, 280, 200, 8);
      x.fill();
      x.shadowBlur = 0;
      x.shadowOffsetY = 0;
      x.strokeStyle = '#e57373';
      x.lineWidth = 1.5;
      x.beginPath();
      x.moveTo(-140, -62);
      x.lineTo(140, -62);
      x.stroke();
      x.strokeStyle = '#90b4e0';
      x.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        x.beginPath();
        x.moveTo(-140, -34 + i * 28);
        x.lineTo(140, -34 + i * 28);
        x.stroke();
      }
      x.font = '700 12px system-ui';
      x.fillStyle = '#a33';
      x.textAlign = 'left';
      x.fillText('FICHE · PHARMA L2', -128, -74);
      x.font = "700 23px Caveat,'Comic Sans MS',cursive";
      const L = NBX.wrap(x, c.q, 250);
      if (c.hl) {
        x.fillStyle = '#fff17688';
        x.fillRect(-130, -46 + 0 * 28, Math.min(260, x.measureText(L[0]).width + 10), 24);
      }
      x.fillStyle = '#1f2a5a';
      L.slice(0, 4).forEach((l, i) => x.fillText(l, -125, -28 + i * 28));
      x.restore();
    };
    const draw = now => {
      // BU : bureau en bois + lampe
      const g = x.createLinearGradient(0, 0, 0, 540);
      g.addColorStop(0, '#2a2238');
      g.addColorStop(0.32, '#3a2e4a');
      g.addColorStop(0.33, '#8a5a32');
      g.addColorStop(1, '#5e3a1c');
      x.fillStyle = g;
      x.fillRect(0, 0, 360, 540);
      x.strokeStyle = '#00000018';
      x.lineWidth = 2;
      for (let i = 0; i < 9; i++) {
        x.beginPath();
        x.moveTo(0, 190 + i * 40 + Math.sin(i) * 8);
        x.bezierCurveTo(120, 180 + i * 40, 240, 200 + i * 40, 360, 186 + i * 40);
        x.stroke();
      }
      for (let i = 0; i < 6; i++) {
        x.fillStyle = ['#c0392b', '#2e86c1', '#27ae60', '#f39c12', '#8e44ad', '#16a085'][i];
        x.fillRect(214 + i * 22, 40 + (i % 2) * 6, 18, 130 - (i % 2) * 6);
      }
      x.fillStyle = '#4a3a2a';
      x.fillRect(208, 170, 152, 6);
      const lp = x.createRadialGradient(180, 160, 10, 180, 300, 320);
      lp.addColorStop(0, '#ffe9a855');
      lp.addColorStop(1, '#0000');
      x.fillStyle = lp;
      x.fillRect(0, 0, 360, 540);
      bpic(x, 'nora', 52, 64, 70, now - bHit < 200 ? '#53c07a' : now - bad < 250 ? '#ff3d6e' : '#7a5cff', st == 'won');
      NBX.tag(x, 52, 114, 'Nora · révise', '#7a5cff');
      if (qT > 0) NBX.bub(x, 98, 22, 250, quip, { tail: 104, up: 0 });
      if (inv > 0) {
        x.save();
        x.fillStyle = '#ff3d6e';
        x.beginPath();
        x.roundRect(60, 128, 240, 28, 14);
        x.fill();
        x.font = '900 13px system-ui';
        x.fillStyle = '#fff';
        x.textAlign = 'center';
        x.fillText(`🔄 MODE PIÈGE : réponds l’INVERSE · ${Math.ceil(inv)} s`, 180, 147);
        x.restore();
      }
      // pile de fiches
      for (let i = 3; i > 0; i--) {
        x.fillStyle = '#f3ead8';
        x.beginPath();
        x.roundRect(40 + i * 3, 186 + i * 4, 280, 200, 8);
        x.fill();
      }
      if (cur) {
        const rot = dx / 900,
          X = 180 + dx;
        card(cur, X, 286, rot, 1);
        if (Math.abs(dx) > 20) {
          x.save();
          x.globalAlpha = Math.min(1, Math.abs(dx) / 90);
          x.translate(X, 226);
          x.rotate(dx > 0 ? -0.2 : 0.2);
          x.strokeStyle = dx > 0 ? '#2f8f5b' : '#c4213f';
          x.lineWidth = 4;
          x.strokeRect(-56, -20, 112, 40);
          x.font = '900 24px system-ui';
          x.fillStyle = x.strokeStyle;
          x.textAlign = 'center';
          x.fillText(dx > 0 ? 'VRAI' : 'FAUX', 0, 9);
          x.restore();
        }
        const f = Math.max(0, 1 - cur.t / cur.lim);
        NBX.bar(x, 40, 396, 280, f, f < 0.35 ? '#ff3d6e' : '#ffd34d', f < 0.35 ? '#ff8a3d' : '#fff176');
      }
      if (fly) {
        const t = fly.t / 0.28;
        card(fly.c, 180 + fly.dir * t * 320, 286 + (fly.dir ? 0 : t * 200), fly.dir * t * 0.6, 1 - t);
      }
      if (res) {
        x.save();
        x.font = '900 30px system-ui';
        x.textAlign = 'center';
        x.fillStyle = res.ok ? '#7dffa0' : '#ff6b81';
        x.shadowColor = '#000';
        x.shadowBlur = 8;
        x.fillText(res.ok ? (combo >= 5 ? `✓ COMBO ×${combo}` : '✓') : '✗', 180, 186);
        x.restore();
      }
      // boutons
      for (const [a, X, t, c] of [
        [0, 90, '✗ FAUX', '#c4213f'],
        [1, 270, 'VRAI ✓', '#2f8f5b']
      ]) {
        x.save();
        x.shadowColor = '#0007';
        x.shadowBlur = 6;
        x.fillStyle = c;
        x.beginPath();
        x.roundRect(X - 78, 428, 156, 44, 14);
        x.fill();
        x.restore();
        x.font = '900 17px system-ui';
        x.fillStyle = '#fff';
        x.textAlign = 'center';
        x.fillText(t, X, 456);
      }
      NBX.flash(x, now, bad);
      x.fillStyle = '#2a1a0e';
      x.fillRect(0, 484, 360, 56);
      bbar(x, hp, p.hp, `📚 Nora · encore ${hp} fiche${hp > 1 ? 's' : ''}`, now - bHit < 200, 490);
      NBX.hearts(x, lives, p.lives, 352, 170, 'right');
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
      dbg: () => ({ cur, inv, st, hp, lives, fly }),
      key: k => {
        if (k == 'ArrowLeft') answer(0);
        if (k == 'ArrowRight') answer(1);
      },
      hint: () => {
        if (st != 'play') return false;
        lives++;
        inv = 0;
        if (cur) cur.t = 0;
        return true;
      }
    };
  };
} catch (e) {
  console.error(e);
}
