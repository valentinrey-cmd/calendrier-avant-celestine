GAMES.memory = function (p, el, win, fail) {
  const id = RUN,
    RSm = vTake('memory'),
    PHA = CONTENU.photos || [],
    phi = RSm ? RSm.phi : shuffle([...PHA.keys()]).slice(0, p.pairs),
    ph = phi.map(k => PHA[k]).filter(Boolean),
    emo = RSm ? RSm.emo : shuffle(EMO).slice(0, p.pairs - ph.length),
    fs = [...ph.map(u => ({ u })), ...emo.map(e => ({ e }))];
  const cards = RSm && RSm.cards.length == fs.length * 2 ? RSm.cards : shuffle([...fs.keys(), ...fs.keys()]),
    cols = cards.length > 16 ? 6 : 4;
  G = { cards, fs };
  el.innerHTML = `<div class="mem" style="grid-template-columns:repeat(${cols},1fr);max-width:${cols * 92}px">${cards.map((c, i) => `<button data-i="${i}" aria-label="Carte ${i + 1}">🎁</button>`).join('')}</div>`;
  const B = el.querySelectorAll('.mem button');
  let open = [],
    ok = 0,
    lock = false;
  const face = (b, c) => {
    const f = fs[c];
    b.classList.add('f');
    b.innerHTML = f.u ? `<img src="${f.u}" alt="">` : f.e;
  };
  const TMm = timer(RSm && RSm.left > 3 ? RSm.left : p.time, () => fail('le temps est écoulé ⏱️'), id);
  if (RSm && RSm.cards == cards) {
    (RSm.m || []).forEach(i => {
      if (B[i]) {
        face(B[i], cards[i]);
        B[i].classList.add('m');
      }
    });
    ok = (RSm.m || []).length / 2;
  }
  G.save = () => ({
    phi,
    emo,
    cards,
    m: [...B].map((b, i) => (b.classList.contains('m') ? i : -1)).filter(i => i >= 0),
    left: Math.round(TMm.left())
  });
  const seen = new Set();
  let perf = true,
    RF = 0,
    rfc = 0,
    knew = false;
  const mate = i => cards.findIndex((v, j) => j != i && v == cards[i]);
  B.forEach(
    b =>
      (b.onclick = () => {
        if (id != RUN) return;
        const i = +b.dataset.i;
        if (lock || open.includes(i) || b.classList.contains('m')) return;
        face(b, cards[i]);
        if (seen.has(i)) RF = 1;
        if (!open.length) knew = seen.has(mate(i));
        seen.add(i);
        open.push(i);
        if (open.length < 2) return;
        const [a, c] = open,
          rf = RF;
        RF = 0;
        if (cards[a] == cards[c]) {
          B[a].classList.add('m');
          B[c].classList.add('m');
          open = [];
          if (++ok == fs.length) {
            if (perf) EGG(1);
            win();
          }
        } else {
          if (rf) perf = false;
          if (knew && ++rfc >= 5) ACH('memF');
          lock = true;
          setTimeout(() => {
            [a, c].forEach(j => {
              B[j].classList.remove('f');
              B[j].textContent = '🎁';
            });
            open = [];
            lock = false;
          }, 700);
        }
      })
  );
  G.hint = () => {
    if (id != RUN) return false;
    if (lock) return 'Attends un instant…';
    perf = false;
    let a = open.length == 1 ? open[0] : cards.findIndex((v, j) => !B[j].classList.contains('m'));
    if (a < 0) return false;
    const c = cards.findIndex((v, j) => j != a && v == cards[a]);
    [a, c].forEach(j => {
      face(B[j], cards[j]);
      B[j].classList.add('m');
    });
    open = [];
    if (++ok == fs.length) win();
    return true;
  };
};
