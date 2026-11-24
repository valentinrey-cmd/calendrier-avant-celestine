/* 👁️ Emma : le test de vue (cabinet d'ophtalmo, lettre intruse de plus en plus floue) */
try {
  GAMES.bvue = function (p, el, win, fail) {
    const id = RUN;
    const { W, x, P } = bcv(
      el,
      'Trouve la lettre différente des autres avant la fin du chrono. Plus ça avance, plus c’est petit et flou 👓'
    );
    const PAIRS = [
      ['E', 'F'],
      ['O', 'Q'],
      ['C', 'G'],
      ['P', 'R'],
      ['M', 'N'],
      ['V', 'Y'],
      ['U', 'V'],
      ['B', '8'],
      ['D', 'O'],
      ['K', 'X'],
      ['H', 'N'],
      ['W', 'V'],
      ['T', 'I'],
      ['3', '8'],
      ['6', '9'],
      ['Z', '2'],
      ['S', '5']
    ];
    const QU = [
      'Ligne suivante.',
      'Plus petit…',
      'Tu louches ?',
      'Sans plisser les yeux !',
      'Ne t’approche pas de l’écran.',
      'Lis-moi ça.',
      'Hmm… intéressant. 🧐',
      'Un œil, puis l’autre.'
    ];
    let st = 'ready',
      hp = p.hp,
      lives = p.lives,
      R = null,
      bHit = 0,
      bad = 0,
      glass = 0,
      naked = 0,
      nakedT = 8,
      gl = null,
      glT = 6,
      quip = 'Asseyez-vous. On commence. 👁️',
      qT = 2.5,
      T = 0,
      show = null,
      num = 0;
    const BX = 34,
      BY = 168,
      BW = 292,
      BH = 272;
    const k = () => 1 - hp / p.hp;
    const round = () => {
      num++;
      const n = [3, 4, 4, 5, 5, 6, 6][Math.min(6, Math.floor(k() * 7))],
        pr = PAIRS[Math.floor(Math.random() * PAIRS.length)],
        sw = Math.random() < 0.5;
      R = {
        n,
        a: sw ? pr[1] : pr[0],
        b: sw ? pr[0] : pr[1],
        odd: Math.floor(Math.random() * n * n),
        t: 0,
        lim: 5.6 - 2.9 * k(),
        jit: Array.from({ length: n * n }, () => [(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5])
      };
      if (Math.random() < 0.5) {
        quip = QU[Math.floor(Math.random() * QU.length)];
        qT = 2.2;
      }
    };
    const blur = () => (glass > 0 ? 0 : Math.min(5.5, 0.5 + k() * 3.6) + (naked > 0 ? 3.2 : 0));
    const lose = why => {
      lives--;
      bad = performance.now();
      try {
        SFX('bad');
      } catch (_) {}
      show = { i: R.odd, t: 0.75 };
      quip = why;
      qT = 1.6;
      if (lives <= 0) {
        st = 'dead';
        setTimeout(() => {
          if (id == RUN) fail('Emma t’a déclarée « bonne pour les lunettes »');
        }, 900);
      }
    };
    W.onpointerdown = e => {
      e.preventDefault();
      if (st == 'ready') {
        st = 'play';
        round();
        timer(
          p.time,
          () => {
            if (st == 'play') {
              st = 'dead';
              fail(`il restait ${hp} planches à lire`);
            }
          },
          id
        );
        return;
      }
      if (st != 'play' || show) return;
      const q = P(e);
      if (gl && Math.hypot(q[0] - gl.x, q[1] - gl.y) < 36) {
        gl = null;
        glass = 4.5;
        naked = 0;
        try {
          SFX('ok');
        } catch (_) {}
        quip = 'Hé ! Rends-moi mes lunettes ! 👓';
        qT = 1.8;
        return;
      }
      const c = R.n,
        cs = BW / c,
        rs = BH / c,
        cx = Math.floor((q[0] - BX) / cs),
        cy = Math.floor((q[1] - BY) / rs);
      if (cx < 0 || cy < 0 || cx >= c || cy >= c) return;
      const i = cy * c + cx;
      if (i == R.odd) {
        hp--;
        bHit = performance.now();
        try {
          SFX('ok');
        } catch (_) {}
        show = { i, t: 0.32, ok: 1 };
        if (hp <= 0) {
          st = 'won';
          setTimeout(() => {
            if (id == RUN) win();
          }, 800);
        }
      } else lose('Non. Ça, c’est un « ' + R.a + ' ».');
    };
    const upd = dt => {
      T += dt;
      qT = Math.max(0, qT - dt);
      glass = Math.max(0, glass - dt);
      naked = Math.max(0, naked - dt);
      if (show) {
        show.t -= dt;
        if (show.t <= 0) {
          show = null;
          if (st == 'play') round();
        }
        return;
      }
      R.t += dt;
      if (R.t >= R.lim) lose('Trop lent ! Patient suivant.');
      nakedT -= dt;
      if (nakedT <= 0) {
        nakedT = 8 + Math.random() * 5;
        naked = 3.4;
        quip = 'J’enlève mes lunettes, tiens. Pour voir. 😎';
        qT = 2;
      }
      glT -= dt;
      if (glT <= 0 && !gl) {
        glT = 12 + Math.random() * 6;
        gl = { x: 70 + Math.random() * 220, y: 200 + Math.random() * 220, t: 3.2 };
      }
      if (gl) {
        gl.t -= dt;
        if (gl.t <= 0) gl = null;
      }
    };
    const letter = (ch, X, Y, s, b) => {
      x.font = `800 ${s}px Arial,Helvetica,sans-serif`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillStyle = '#111';
      if (b <= 0.2) {
        x.fillText(ch, X, Y);
        return;
      }
      x.globalAlpha = 0.3;
      for (const [dx, dy] of [
        [0, 0],
        [b, 0],
        [-b, 0],
        [0, b],
        [0, -b],
        [b * 0.7, b * 0.7],
        [-b * 0.7, -b * 0.7],
        [b * 0.7, -b * 0.7]
      ])
        x.fillText(ch, X + dx, Y + dy);
      x.globalAlpha = 1;
    };
    const draw = now => {
      // cabinet : mur bleu-vert, lambris, diplôme
      const g = x.createLinearGradient(0, 0, 0, 540);
      g.addColorStop(0, '#cfe6e4');
      g.addColorStop(1, '#a9cfcb');
      x.fillStyle = g;
      x.fillRect(0, 0, 360, 540);
      x.fillStyle = '#ffffff22';
      for (let i = 0; i < 360; i += 24) x.fillRect(i, 0, 12, 540);
      x.fillStyle = '#e9dcc4';
      x.fillRect(250, 26, 86, 60);
      x.strokeStyle = '#8a6a3a';
      x.lineWidth = 4;
      x.strokeRect(250, 26, 86, 60);
      x.fillStyle = '#8a6a3a';
      x.font = '700 8px Georgia';
      x.textAlign = 'center';
      x.fillText('DIPLÔME', 293, 46);
      x.fillRect(266, 54, 54, 2);
      x.fillRect(272, 62, 42, 2);
      bemo(x, '🏅', 293, 76, 14);
      // Emma en blouse
      x.fillStyle = '#fff';
      x.beginPath();
      x.ellipse(70, 130, 46, 22, 0, Math.PI, 0);
      x.fill();
      bpic(x, 'emma', 70, 76, 74, now - bHit < 200 ? '#53c07a' : now - bad < 250 ? '#ff3d6e' : '#ffffff', st == 'won');
      NBX.tag(x, 70, 128, 'Dr Emma · ophtalmo', '#2f6f8f');
      if (naked > 0) bemo(x, '👓', 112, 48, 24);
      if (qT > 0) NBX.bub(x, 122, 72, 206, quip, { tail: 126, up: 0 });
      // boîte lumineuse (planche de Monoyer)
      x.save();
      x.shadowColor = '#0006';
      x.shadowBlur = 18;
      x.fillStyle = '#2b2f36';
      x.beginPath();
      x.roundRect(BX - 14, BY - 34, BW + 28, BH + 60, 14);
      x.fill();
      x.restore();
      const lg = x.createRadialGradient(180, BY + BH / 2, 40, 180, BY + BH / 2, 240);
      lg.addColorStop(0, '#ffffff');
      lg.addColorStop(1, '#eef3f6');
      x.fillStyle = lg;
      x.beginPath();
      x.roundRect(BX - 4, BY - 6, BW + 8, BH + 12, 6);
      x.fill();
      x.font = '800 10px system-ui';
      x.textAlign = 'center';
      x.fillStyle = '#9fb4c2';
      x.fillText(`TEST DE VUE · PLANCHE ${num}`, 180, BY - 16);
      if (R) {
        const c = R.n,
          cs = BW / c,
          rs = BH / c,
          b = blur(),
          sz = Math.min(cs, rs) * (0.62 - 0.2 * k());
        for (let r = 0; r < c; r++) {
          x.font = '700 8px system-ui';
          x.textAlign = 'right';
          x.fillStyle = '#b8c6cf';
          x.fillText((10 - r * (c > 4 ? 1.5 : 2) - Math.round(k() * 3)).toFixed(0) + '/10', BX + BW + 12, BY + (r + 0.5) * rs + 3);
        }
        for (let i = 0; i < c * c; i++) {
          const X = BX + ((i % c) + 0.5) * cs + R.jit[i][0],
            Y = BY + (Math.floor(i / c) + 0.5) * rs + R.jit[i][1];
          if (show && show.i == i) {
            x.fillStyle = show.ok ? '#53c07a55' : '#ffd34d99';
            x.beginPath();
            x.arc(X, Y, sz * 0.75, 0, 7);
            x.fill();
          }
          letter(i == R.odd ? R.b : R.a, X, Y, sz, b);
        }
        const f = Math.max(0, 1 - R.t / R.lim);
        NBX.bar(x, BX, BY + BH + 10, BW, f, f < 0.3 ? '#ff3d6e' : '#5ab0ff', f < 0.3 ? '#ff8a3d' : '#7fe0ff');
      }
      if (gl) {
        x.save();
        x.globalAlpha = Math.min(1, gl.t * 2);
        x.fillStyle = '#ffd34d55';
        x.beginPath();
        x.arc(gl.x, gl.y, 32 + Math.sin(T * 8) * 4, 0, 7);
        x.fill();
        bemo(x, '👓', gl.x, gl.y, 44);
        x.restore();
      }
      if (naked > 0 && !glass) NBX.vign(x, 0.55);
      if (glass > 0) {
        NBX.tag(x, 180, BY - 42, `👓 Vision nette : ${Math.ceil(glass)} s`, '#2f8f5b');
      }
      NBX.flash(x, now, bad);
      x.fillStyle = '#1e3a44';
      x.fillRect(0, 486, 360, 54);
      bbar(x, hp, p.hp, `👁️ Emma · encore ${hp} planche${hp > 1 ? 's' : ''}`, now - bHit < 200, 492);
      NBX.hearts(x, lives, p.lives, 10, 26);
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
      dbg: () => ({ R, gl, show, st, hp, lives }),
      hint: () => {
        if (st != 'play') return false;
        lives++;
        glass = 6;
        return true;
      }
    };
  };
} catch (e) {
  console.error(e);
}
