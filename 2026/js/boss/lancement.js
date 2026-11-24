function bossReset(d) {
  if (d) {
    if (S.boss) delete S.boss[d];
    if (S.bossTry) delete S.bossTry[d];
  } else {
    S.boss = {};
    S.bossTry = {};
  }
  save();
  toast('👹 Boss réinitialisé' + (d ? '' : 's'));
  if (d) startBox(d);
  else admin();
}
function bossOffer(d) {
  if (document.getElementById('spl') || document.getElementById('alnew')) {
    setTimeout(() => bossOffer(d), 1500);
    return;
  }
  if (cur != d || view != 'day' || document.getElementById('gwin')) return;
  const B = bossCfg(d);
  if (!B || (S.boss || {})[d]) return;
  popup(
    `<h2>📨 Convocation au commissariat</h2><p class="center" style="font-size:3.4rem;margin:.2em 0">${B.ic}</p><p class="center"><b>${B.n}</b> est convoqué·e en audition. La réussir débloque une <b>🎬 vidéo mystère</b> de votre album.</p><p class="muted center" style="font-size:.85rem">C’est gratuit et tu peux le retenter autant de fois que tu veux. Tu pourras aussi l'affronter plus tard depuis cette case.</p><button onclick="closePop();launchBoss(${d})">🎙️ Commencer l’audition</button><button class="alt" onclick="closePop()">Plus tard</button>`
  );
}
function launchBoss(d, test) {
  const B = bossCfg(d);
  if (!B) return;
  if (!(S.story || {})['b' + d] && STORY['b' + d]) return story('b' + d, () => launchBoss(d, test));
  S.bossTry = S.bossTry || {};
  const n = S.bossTry[d] || 0;
  if (!test && (S.boss || {})[d]) return;

  if (!test) {
    S.bossTry[d] = n + 1;
    save();
    try {
      slog('👹', `Boss jour ${d} · ${B.n} : tentative ${n + 1}`);
    } catch (_) {}
  }
  window.CURD = d;
  window.CURPR = true;
  allowScroll();
  lastY = scrollY;
  RUN++;
  G = {};
  $('#gmsg').innerHTML = '';
  document.body.classList.add('playing');
  const id = RUN;
  let over = false;
  const end = (ok, why, quit) => {
    if (over || id != RUN) return;
    over = true;
    RUN++;
    const fin = () => {
      const y0 = lockY;
      closeGame();
      bossResult(d, ok, why, test);
      allowScroll();
      window.scrollTo(0, y0);
      lastY = y0;
    };
    if (ok && document.getElementById('gwin')) bossKO(B, fin);
    else if (!ok && !quit && document.getElementById('gwin')) bossLose(B, d, fin);
    else fin();
  };
  const g = $('#game');
  g.classList.remove('solv');
  g.onpointerdown = g.onpointermove = g.onpointerup = g.onpointercancel = null;
  try {
    $('#lives').textContent = '';
  } catch (_) {}
  openGame(d, true, w => end(false, w, 1), `${B.ic} AUDITION · ${B.n}${test ? ' (test)' : ''}`);
  if (B.quiet) {
    try {
      YTM.stopGame();
    } catch (_) {}
    try {
      MUS.stop();
    } catch (_) {}
  } else {
    try {
      if (!YTM.start(d)) MUS.day(d);
    } catch (_) {}
  }
  g.innerHTML = `<div class="bossin"><span>🎙️ AUDITION 🎙️</span><b class="bi">${B.ic}</b><b>${B.n}</b></div>`;
  try {
    SFX('lose');
  } catch (_) {}
  setTimeout(() => {
    if (id != RUN) return;
    const RL = BRULES[d] || [];
    g.innerHTML = `<div class="bossr"><p class="bri">${B.ic}</p><h3>Comment faire craquer ${esc(B.n)} ?</h3><ul>${RL.map(t => `<li>${t}</li>`).join('')}</ul><button id="bgo">🎙️ J’ai compris, c’est parti !</button></div>`;
    $('#bgo').onclick = () => {
      if (id != RUN) return;
      if (!B.quiet) {
        try {
          YTM.stopGame();
        } catch (_) {}
        try {
          MUS.stop();
        } catch (_) {}
        let okm = false;
        try {
          okm = YTM.boss('b' + d);
        } catch (_) {}
        if (!okm) {
          try {
            MUS.play({ 4: 'filature', 8: 'pluie', 11: 'enquete', 15: 'noir', 19: 'lyon', 22: 'filature' }[d] || 'enquete', 0.06);
          } catch (_) {}
        }
        try {
          slog('🎵', 'Musique de boss (jour ' + d + ')' + (okm ? '' : ' · mélodie de secours'));
        } catch (_) {}
      }
      GAMES[B.g](
        B.p,
        g,
        () => end(true),
        w => end(false, w)
      );
    };
  }, 1800);
}
function bossResult(d, ok, why, test) {
  try {
    SFX(ok ? 'win' : 'lose');
  } catch (_) {}
  if (test && !ok) {
    startBox(d, `Boss raté (test) : ${esc(why)}.`);
    return bossRetry(d, why, 1);
  }
  if (ok) {
    S.boss = S.boss || {};
    S.boss[d] = Date.now();
    try {
      audGrant(d);
    } catch (_) {}
    if (!(S.story || {})['w' + d]) S.storyQ = 'w' + d;
    save();
    try {
      ACH('boss' + d);
    } catch (_) {}
    try {
      slog('🏆', `Boss du jour ${d} vaincu ! Vidéo ${vidN()} débloquée 🎬`);
    } catch (_) {}
    ding();
    confetti();
    splash(true);
    startBox(d, 'Audition réussie ! 🎙️');
    setTimeout(vidNew, 1500);
  } else {
    try {
      slog('💥', `Boss du jour ${d} raté : ${String(why || '').replace(/<[^>]+>/g, '')}`);
    } catch (_) {}
    startBox(d, `${esc(bossCfg(d).n)} n’a pas craqué : ${esc(why)}. Tu peux retenter gratuitement.`);
    bossRetry(d, why, 0);
  }
}
function bossRetry(d, why, test) {
  const B = bossCfg(d);
  if (!B) return;
  setTimeout(() => {
    popup(
      `<div class="center" style="font-size:3rem">${B.ic}</div><h2 class="center">🤐 ${esc(B.n)} n’a pas craqué…</h2><p class="center">${esc(String(why || '').replace(/<[^>]+>/g, ''))}</p><p class="center muted">Tu peux le retenter tout de suite, c’est gratuit !</p><button onclick="closePop();launchBoss(${d},${test ? 1 : 0})">🔁 Recommencer l’audition</button><button class="alt" onclick="closePop()">Quitter</button>`
    );
  }, 500);
}
