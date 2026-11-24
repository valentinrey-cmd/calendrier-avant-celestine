GAMES.photo = function (p, el, win, fail) {
  const ex = 10 + Math.random() * 80,
    ey = 12 + Math.random() * 74,
    id = RUN,
    img = window[p.img],
    qs = shuffle(p.qs)
      .slice(0, p.q)
      .map(q => ({ ...q, ch: shuffle(q.ch) }));
  let i = 0,
    good = 0;
  G = {
    qs,
    get i() {
      return i;
    }
  };
  el.innerHTML = `<p class="center">Observe bien cette photo… tu as <b id="phs">${p.show}</b> secondes. Les questions viendront après !</p><div class="phw" style="position:relative"><img src="${img}" alt="Photo à observer" id="phi"><button id="phe" class="phegg" aria-label="Petit œuf" style="left:${ex}%;top:${ey}%">${eggH(13)}</button></div>`;
  $('#phe').onclick = e => {
    e.stopPropagation();
    if (id != RUN) return;
    e.currentTarget.remove();
    EGG(13);
  };
  let s = p.show;
  const iv = setInterval(() => {
    if (id != RUN) return clearInterval(iv);
    s--;
    const e = $('#phs');
    if (e) e.textContent = s;
    if (s <= 0) {
      clearInterval(iv);
      ask();
    }
  }, 1000);
  const ask = () => {
    if (id != RUN) return;
    if (i >= qs.length) {
      return good >= p.need ? win() : fail(`${good} bonnes réponses sur ${qs.length} (il en fallait ${p.need})`);
    }
    const q = qs[i];
    el.innerHTML = `<p class="center">Question ${i + 1} / ${qs.length} · Bonnes réponses : ${good}</p><h3 class="center">${esc(q.t)}</h3><div class="qch">${q.ch.map((c, k) => `<button class="alt" data-k="${k}">${esc(c)}</button>`).join('')}</div>`;
    el.querySelectorAll('.qch button').forEach(
      b =>
        (b.onclick = () => {
          if (id != RUN) return;
          const ok = q.ch[+b.dataset.k] == q.a;
          if (ok) good++;
          b.classList.add(ok ? 'ok' : 'ko');
          el.querySelectorAll('.qch button').forEach(x => (x.disabled = true));
          i++;
          setTimeout(ask, 700);
        })
    );
  };
  G.hint = () => {
    if (id != RUN) return false;
    const bs = [...el.querySelectorAll('.qch button')].filter(b => !b.disabled && b.style.visibility != 'hidden');
    if (!bs.length) return 'Attends les questions !';
    const q = qs[i],
      wr = bs.filter(b => q.ch[+b.dataset.k] != q.a);
    if (bs.length <= 2 || wr.length < 2) return "Pas d'indice possible sur cette question";
    shuffle(wr)
      .slice(0, 2)
      .forEach(b => {
        b.style.visibility = 'hidden';
      });
    return true;
  };
};
