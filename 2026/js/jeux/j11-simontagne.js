GAMES.simon = function (p, el, win, fail) {
  const id = RUN,
    B = [
      ['#e0283f', 'Rouge', 523.25],
      ['#2e9b4f', 'Vert', 659.25],
      ['#f3c623', 'Or', 783.99],
      ['#2d6fe0', 'Bleu', 1046.5]
    ];
  el.innerHTML = `<p class="center" style="margin:0 0 6px">Manche <b id="sir">1</b> / ${p.goal}</p><p class="center" id="sim" style="min-height:1.5em;margin:0 0 8px">Écoute bien…</p><div class="simon">${B.map((b, i) => `<button data-i="${i}" style="--c:${b[0]}" aria-label="Clochette ${b[1]}" disabled><span>🔔</span></button>`).join('')}</div>`;
  let seq = [],
    pos = 0,
    listen = false,
    over = false,
    AC = null,
    sil = 0,
    sgot = 0;
  const armS = () => {
    clearTimeout(sil);
    if (sgot) return;
    sil = setTimeout(() => {
      if (id != RUN || over || !listen || sgot) return;
      sgot = 1;
      $('#sim').textContent = '🤫… une clochette secrète a sonné !';
      EGG(11);
      setTimeout(() => {
        if (id == RUN && !over && listen) $('#sim').textContent = 'À toi ! 🎵';
      }, 2600);
    }, 20000);
  };
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
  } catch (_) {}
  timer(p.time, () => end(false, 'le temps est écoulé ⏱️'), id);
  const btns = [...el.querySelectorAll('.simon button')];
  function end(ok, w) {
    if (over) return;
    over = true;
    try {
      REC(Math.max(0, seq.length - (ok ? 0 : 1)));
    } catch (_) {}
    btns.forEach(b => (b.disabled = true));
    setTimeout(() => (ok ? win() : fail(w)), ok ? 500 : 700);
  }
  function ring(i, d) {
    const b = btns[i];
    b.classList.add('on');
    setTimeout(() => b.classList.remove('on'), d * 0.85);
    if (!AC) return;
    try {
      const t = AC.currentTime,
        f = B[i][2];
      [
        [1, 0.32],
        [2.76, 0.08],
        [5.4, 0.03]
      ].forEach(([m, v]) => {
        const o = AC.createOscillator(),
          g = AC.createGain();
        o.type = 'sine';
        o.frequency.value = f * m;
        g.gain.setValueAtTime(v, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.35, (d / 1000) * 1.6));
        o.connect(g).connect(AC.destination);
        o.start(t);
        o.stop(t + 1.2);
      });
    } catch (_) {}
  }
  function play(slow) {
    listen = false;
    btns.forEach(b => (b.disabled = true));
    $('#sim').textContent = slow ? '💡 Je te la rejoue lentement… 👂' : 'Écoute bien… 👂';
    const d = slow ? 800 : Math.max(300, 620 - seq.length * 28);
    let k = 0;
    const nx = () => {
      if (id != RUN || over) return;
      if (k >= seq.length) {
        listen = true;
        pos = 0;
        btns.forEach(b => (b.disabled = false));
        $('#sim').textContent = 'À toi ! 🎵';
        armS();
        return;
      }
      ring(seq[k++], d);
      setTimeout(nx, d + 90);
    };
    setTimeout(nx, 650);
  }
  function round() {
    seq.push(Math.floor(Math.random() * 4));
    $('#sir').textContent = seq.length;
    play();
  }
  btns.forEach((b, i) =>
    b.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (!listen || over) return;
      clearTimeout(sil);
      if (AC && AC.state == 'suspended') AC.resume();
      ring(i, 260);
      if (i != seq[pos]) {
        $('#sim').textContent = 'Oups… ❌';
        try {
          navigator.vibrate && navigator.vibrate([60, 40, 60]);
        } catch (_) {}
        return end(false, `mauvaise clochette (manche ${seq.length})`);
      }
      pos++;
      if (pos < seq.length) armS();
      if (pos >= seq.length) {
        listen = false;
        btns.forEach(b => (b.disabled = true));
        if (seq.length >= p.goal) {
          $('#sim').textContent = 'Parfait ! 🎉';
          return end(true);
        }
        $('#sim').textContent = 'Bravo ! ✨';
        setTimeout(() => {
          if (id == RUN && !over) round();
        }, 700);
      }
    })
  );
  if (AC && AC.state == 'suspended') AC.resume();
  round();
  G.hint = () => {
    if (id != RUN || over) return false;
    if (!listen) return 'Attends que ce soit ton tour';
    play(1);
    return true;
  };
};
