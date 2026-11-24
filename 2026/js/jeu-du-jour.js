/* ---------- Jeu du jour : 3 essais, chrono, possibilité d'échouer ---------- */
let RUN = 0;
function timer(sec, onEnd, id) {
  let end = performance.now() + sec * 1000,
    h;
  const el = $('#tmr');
  const tk = () => {
    if (id != RUN) {
      clearInterval(h);
      return;
    }
    const l = Math.max(0, Math.ceil((end - performance.now()) / 1000));
    el.textContent = '⏱️ ' + l + ' s';
    el.style.color = l <= 5 ? '#ff9a9a' : '';
    if (l <= 0) {
      clearInterval(h);
      onEnd();
    }
  };
  window.TFORCE = () => {
    end = performance.now();
  };
  h = setInterval(tk, 200);
  tk();
  return {
    add: s => {
      end += s * 1000;
      tk();
    },
    left: () => Math.max(0, (end - performance.now()) / 1000)
  };
}
function dayView() {
  closeGame();
  const d = cur,
    D = DAYS[d];
  RUN++;
  app.innerHTML = `<button class="alt sm" onclick="go('cal')">← Calendrier</button><h1>Jour ${d} · ${esc(D.t)}</h1>
 <div class="center">${D.bonus ? `<span class="ribbon">${D.ev || '🎁'} +${D.bonus} ⭐ en cadeau</span> ` : ''}${D.x2 ? `<span class="ribbon">✨ Points ×2</span> ` : ''}${D.unlock ? `<span class="ribbon">${D.bonus || !D.ev ? '🔓' : D.ev} ${esc(D.unlock)}</span> ` : ''}${d == 3 ? '<span class="ribbon">🧪 Le laboratoire ouvre</span> ' : ''}${MACH.filter(
   M => M.day == d
 )
   .map(M => `<span class="ribbon">${M.ic} Nouvelle machine : ${esc(M.id == 'secret' ? 'le fax du procureur' : M.n)}</span> `)
   .join('')}</div>
 <div class="panel"><p class="center">${eggRules(d, RULES[D.g](D.p))}</p>${recLine(D.g)}<div class="hud"><span id="lives"></span><span id="tmr"></span></div><div id="game"></div><div id="gmsg" class="center"></div></div>`;
  startBox(d);
}
function startBox(d, msg) {
  document.body.classList.remove('playing');
  if (!$('#game') || !$('#lives')) return;
  try {
    $('#lives').style.display = '';
  } catch (_) {}
  const hk = document.getElementById('hk');
  if (hk) hk.remove();
  const st = S.days[d] || {},
    max = 3 + (st.extra || 0),
    f = Math.min(st.fails || 0, max);
  $('#game').innerHTML = '';
  $('#tmr').textContent = '';
  $('#lives').textContent = st.done && !st.lost ? '' : 'Essais : ' + '❤️'.repeat(max - f) + '🖤'.repeat(f);
  let h = msg ? `<p style="font-size:1.1rem">${msg}</p>` : '';
  if (st.done && !st.lost)
    h += `<p><span class="ribbon">✅ Réussi : ${st.score} ⭐</span></p>${bossBtn(d)}<button class="alt" onclick="launch(${d},1)">${vLoad(d, 1) ? '▶ Reprendre ma partie (entraînement)' : 'Rejouer pour le plaisir'}</button>`;
  else if (st.lost)
    h += `<p>Plus d'essais pour ce jeu… 😢</p>${S.inv.joker > 0 ? `<button onclick="useJoker(${d})">🃏 Utiliser un joker : un essai de plus (${S.inv.joker})</button>` : '<p class="muted">Un 🃏 Joker (fabriqué au labo) donne un essai de plus.</p>'}<button class="alt" onclick="launch(${d},1)">${st.lost && !st.late ? 'Retenter (+5 ⭐ si tu réussis)' : "S'entraîner"}</button>`;
  else {
    h += `<button onclick="launch(${d})">${vLoad(d, 0) ? '▶ Reprendre ma partie sauvegardée' : f ? `Réessayer (essai ${f + 1}/${max})` : '▶ Commencer le mini-jeu'}</button>`;
    if (S.inv.dbl > 0)
      h +=
        S.dblOn == d
          ? `<p class="center"><span class="ribbon">✨ Points doublés activés pour ce jeu</span> <button class="alt sm" onclick="S.dblOn=0;save();startBox(${d})">Annuler</button></p>`
          : `<button class="alt" onclick="S.dblOn=${d};save();SFX('ok');startBox(${d})">✨ Utiliser Points doublés sur ce jeu (${S.inv.dbl})</button>`;
  }
  $('#gmsg').innerHTML = h + bossDev(d);
}
let lockY = 0;
function useHint() {
  if (!$('#gwin') || $('#game').classList.contains('solv')) return;
  if (!(S.inv.hint > 0)) {
    toast(pick(JK.hint));
    setTimeout(() => toast("Plus d'indice 💡 : fabrique-en au labo ou gagne-en à la roue"), 2300);
    return;
  }
  if (!G || typeof G.hint != 'function') {
    toast("Pas d'indice pour ce jeu");
    return;
  }
  let r;
  try {
    r = G.hint();
  } catch (e) {
    console.error(e);
    r = 'Indice impossible pour le moment';
  }
  if (r !== true) {
    toast(typeof r == 'string' ? r : 'Indice impossible pour le moment');
    return;
  }
  S.inv.hint--;
  window.__hint = 1;
  save();
  const b = $('#hintn');
  if (b) b.textContent = S.inv.hint;
  try {
    SFX('key');
  } catch (_) {}
  toast('💡 Indice utilisé');
}
function openGame(d, pr, quit, ttl) {
  closeGame(true);
  const D = DAYS[d],
    ov = document.createElement('div');
  ov.id = 'gwin';
  ov.innerHTML = `<div class="gwbox${ttl ? ' boss' : ''}" role="dialog" aria-modal="true" aria-label="${esc(ttl || D.t)}"><div class="gwh">${ttl ? `<b>${esc(ttl)}</b>` : `<b>Jour ${d} · ${D.g == 'master' ? [...D.t].map((ch, i) => (i < 5 ? `<span style="color:${['#e0283f', '#ffffff', '#9b4fd1', '#ff7ab6', '#21a35a'][i]}">${esc(ch)}</span>` : esc(ch))).join('') : esc(D.t)}${pr ? ' <small class="muted">(entraînement)</small>' : ''}</b>`}<span class="gwhr"><button class="gwi" aria-label="Utiliser un indice" onclick="useHint()">💡 <b id="hintn">${S.inv.hint || 0}</b></button><button class="gwx" aria-label="Fermer le jeu">✕</button></span></div><div id="gwq"></div><div id="gwhud"></div><div id="gwbody"></div></div>`;
  document.body.appendChild(ov);
  $('#gwhud').appendChild($('.panel .hud'));
  $('#gwbody').appendChild($('#game'));
  lockY = scrollY;
  document.documentElement.classList.add('gl');
  document.body.style.top = -lockY + 'px';
  ov.addEventListener(
    'touchmove',
    e => {
      const b = ov.querySelector('.gwbox');
      if (!b || b.scrollHeight <= b.clientHeight + 1 || !b.contains(e.target)) e.preventDefault();
    },
    { passive: false }
  );
  ov.querySelector('.gwx').onclick = () => {
    const q = $('#gwq');
    if (!ttl && window.__vq && G && G.save) {
      const vg = VG.includes(D.g);
      q.innerHTML = `<div class="gwc"><span>${vg || pr ? 'Quitter la partie ? Ça ne te coûte <b>aucun essai</b>.<br>Veux-tu sauvegarder ta progression pour reprendre plus tard ?' : 'Quitter la partie ?<br>💾 Si tu sauvegardes, tu ne perds <b>pas d’essai</b> et tu reprendras ici.<br>Sinon, cet essai compte comme <b>raté</b>.'}</span><span><button class="sm" id="gws1">💾 Sauvegarder et quitter</button><button class="alt sm" id="gws0">${vg || pr ? 'Quitter sans sauvegarder' : 'Quitter sans sauvegarder (essai raté)'}</button><button class="alt sm" id="gwn">Continuer</button></span></div>`;
      $('#gws1').onclick = () => window.__vq(1);
      $('#gws0').onclick = () => window.__vq(0);
      $('#gwn').onclick = () => (q.innerHTML = '');
      return;
    }
    if (pr) return quit('partie quittée');
    q.innerHTML = `<div class="gwc"><span>Quitter ? Cet essai comptera comme raté.<br><small>(Ce jeu se joue d’une traite : il ne peut pas être sauvegardé.)</small></span><span><button class="sm" id="gwy">Quitter</button><button class="alt sm" id="gwn">Continuer</button></span></div>`;
    $('#gwy').onclick = () => quit('tu as abandonné la partie');
    $('#gwn').onclick = () => (q.innerHTML = '');
  };
}
function closeGame(silent) {
  try {
    MUS.stop();
  } catch (_) {}
  try {
    if (window.__lg) {
      window.__lg = null;
      syncLive(null);
    }
  } catch (_) {}
  setTimeout(() => {
    try {
      bgm();
    } catch (_) {}
  }, 400);
  const ov = $('#gwin');
  if (!ov) return;
  const P = $('.panel'),
    hud = $('#gwhud .hud'),
    g = $('#game'),
    m = $('#gmsg');
  if (P && m) {
    if (hud) P.insertBefore(hud, m);
    if (g) P.insertBefore(g, m);
  }
  ov.remove();
  const hk = document.getElementById('hk');
  if (hk) hk.remove();
  document.documentElement.classList.remove('gl');
  document.body.style.top = '';
  window.scrollTo(0, lockY);
  lastY = lockY;
  allowScroll();
}
function hit() {
  const d = window.CURD;
  if (window.CURPR) return 0;
  if (!d) return -1;
  const sd = (S.days[d] = S.days[d] || {}),
    mx = 3 + (sd.extra || 0);
  sd.fails = (sd.fails || 0) + 1;
  if (sd.fails >= mx) {
    sd.fails = mx - 1;
    save();
    return 0;
  }
  save();
  const e = $('#lives');
  if (e) e.textContent = 'Essais : ' + '❤️'.repeat(mx - sd.fails) + '🖤'.repeat(sd.fails);
  return mx - sd.fails;
}
const VG = ['picross', 'sudoku', 'fleche', 'quiz'];
function vHearts(err, n) {
  n = n || 3;
  if (window.CURPR || !window.CURD) return '❤️'.repeat(Math.max(0, n - err)) + '🖤'.repeat(Math.max(0, Math.min(n, err)));
  const sd = S.days[window.CURD] || {},
    mx = 3 + (sd.extra || 0),
    f = Math.min(sd.fails || 0, mx);
  return '❤️'.repeat(mx - f) + '🖤'.repeat(f);
}
const vKey = (d, pr) => d + (pr ? 'p' : '');
function vLoad(d, pr) {
  return (S.vsave || {})[vKey(d, pr)] || null;
}
function vDel(d, pr) {
  if (S.vsave && S.vsave[vKey(d, pr)]) {
    delete S.vsave[vKey(d, pr)];
    save();
  }
}
function vTake(g) {
  const R = window.__VRES;
  window.__VRES = null;
  return R && R.g == g ? R.v : null;
}
const hitT = r => (r > 0 ? ` · −1 vie (il t'en reste ${r})` : '');
function launch(d, pr) {
  window.CURD = d;
  window.CURPR = !!pr;
  try {
    if (!pr) slog('🎮', `Lance le jour ${d} · ${DAYS[d].t} (essai ${((S.days[d] || {}).fails || 0) + 1})`);
  } catch (_) {}
  if (new Date().getHours() < 5) ACH('night');
  allowScroll();
  lastY = scrollY;
  RUN++;
  G = {};
  $('#gmsg').innerHTML = '';
  document.body.classList.add('playing');
  const D = DAYS[d],
    id = RUN;
  let over = false;
  const end = (ok, why, keep) => {
    if (over || id != RUN) return;
    over = true;
    window.__vq = null;
    vDel(d, pr);
    try {
      recEnd(ok);
    } catch (e) {
      console.error(e);
    }
    RUN++;
    const fin = () => {
      closeGame();
      const y0 = lockY;
      result(d, pr, ok, why);
      allowScroll();
      window.scrollTo(0, y0);
      lastY = y0;
    };
    if (!ok && keep && $('#gwin')) {
      const hk = document.getElementById('hk');
      if (hk) hk.remove();
      try {
        document.activeElement.blur();
      } catch (_) {}
      SFX('lose');
      $('#tmr').textContent = '';
      $('#gwq').innerHTML =
        `<div class="gwc solb"><span>❌ Raté : ${esc(why)}.<br><b>Voici la solution 👇</b></span><button class="sm" id="gws">Fermer ✕</button></div>`;
      $('#gwin .gwx').onclick = fin;
      $('#gws').onclick = fin;
      el0.classList.add('solv');
      return;
    }
    fin();
  };
  const el0 = $('#game');
  el0.classList.remove('solv');
  el0.onpointerdown = el0.onpointermove = el0.onpointerup = el0.onpointercancel = null;
  openGame(d, pr, w => end(false, w));
  try {
    if (!YTM.start(d)) MUS.day(d);
  } catch (_) {}
  {
    if (VG.includes(D.g))
      try {
        $('#lives').style.display = 'none';
      } catch (_) {}
    const sv = vLoad(d, pr);
    window.__VRES = sv ? { g: D.g, v: sv } : null;
    if (sv) setTimeout(() => toast('▶ Reprise de ta partie sauvegardée'), 300);
    window.__vq = sav => {
      if (over || id != RUN) return;
      if (sav) {
        try {
          S.vsave = S.vsave || {};
          S.vsave[vKey(d, pr)] = G.save();
          save();
          slog('💾', `Sauvegarde le jour ${d} · ${D.t}`);
        } catch (e) {
          console.error(e);
        }
      } else {
        vDel(d, pr);
        if (!VG.includes(D.g) && !pr) {
          window.__vq = null;
          return end(false, 'tu as abandonné la partie');
        }
      }
      over = true;
      window.__vq = null;
      RUN++;
      const y0 = lockY;
      closeGame();
      startBox(d, sav ? '💾 Progression sauvegardée : tu reprendras là où tu en étais.' : 'Partie quittée (aucun essai perdu).');
      allowScroll();
      window.scrollTo(0, y0);
      lastY = y0;
    };
  }
  try {
    recStart(d, pr);
  } catch (e) {
    console.error(e);
  }
  try {
    syncLive({ d, t: D.t, pr: pr ? 1 : 0, at: Date.now() });
  } catch (_) {}
  GAMES[D.g](
    D.p,
    $('#game'),
    () => end(true),
    (w, k) => end(false, w, k)
  );
}
function result(d, pr, ok, why) {
  const D = DAYS[d];
  SFX(ok ? 'win' : 'lose');
  try {
    const s0 = S.days[d] || {};
    if (pr)
      slog(
        ok ? '🏋️' : '🏋️',
        `Entraînement jour ${d} · ${D.t} : ${ok ? 'réussi' : 'raté'}${ok ? '' : ' (' + String(why || '').replace(/<[^>]+>/g, '') + ')'}`
      );
    else if (ok) slog('✅', `Jour ${d} · ${D.t} réussi ${s0.fails ? 'au ' + (s0.fails + 1) + 'e essai' : 'du premier coup'}`);
    else
      slog(
        '❌',
        `Jour ${d} · ${D.t} raté : ${String(why || '').replace(/<[^>]+>/g, '')}${(s0.fails || 0) + 1 >= 3 + (s0.extra || 0) ? ' · défi perdu 💔' : ''}`
      );
  } catch (_) {}
  if (pr) {
    const s0 = S.days[d] || {};
    if (ok && s0.lost && !s0.late) {
      const n = 0;
      Object.assign(s0, { late: true, lost: false, score: s0.score || 10 });
      S.days[d] = s0;
      S.scr += 5;
      save();
      toast('✅ Réussi après coup · +5 🔩');
      ding();
      confetti();
      splash(true);
      save();
      return startBox(d, `Bravo, tu l'as enfin eu ! 🎉 Le défi est validé (+5 🔩)`);
    }
    if (ok) {
      splash(true);
      ding();
    }
    return startBox(
      d,
      ok ? 'Bravo ! 🎉 (entraînement, sans points)' : `Raté : ${esc(why)}.<br><small class="muted"><i>${esc(pick(JK.lose))}</i></small>`
    );
  }
  const st = (S.days[d] = S.days[d] || {});
  if (ok) {
    const f = st.fails || 0;
    let n = [40, 30, 20][f] || 10,
      m = D.x2 ? 2 : 1;
    if (S.dblOn == d && S.inv.dbl > 0) {
      S.inv.dbl--;
      S.dblOn = 0;
      m *= 2;
      toast('✨ Points doublés !');
    }
    n *= m;
    Object.assign(st, { done: true, lost: false, score: n });
    S.scr += 25;
    award(n, 'jeu réussi · +25 🔩');
    flameWin(d);
    ding();
    confetti();
    splash(true);
    if (bossCfg(d) && !(S.boss || {})[d]) setTimeout(() => bossOffer(d), 1400);
    startBox(d, `Bravo, réussi ${f ? `au ${f + 1}e essai` : 'du premier coup'} ! 🎉`);
  } else {
    st.fails = (st.fails || 0) + 1;
    const max = 3 + (st.extra || 0);
    if (st.fails >= max) {
      st.done = true;
      st.lost = true;
      flameLost(d);
      splash(false);
    }
    save();
    if (!(S.story || {}).lose1) {
      const tl = n => {
        if ((S.story || {}).lose1 || n > 40) return;
        if (storyBusy() || document.getElementById('spl')) return setTimeout(() => tl(n + 1), 700);
        story('lose1');
      };
      setTimeout(() => tl(0), 900);
    }
    startBox(
      d,
      `Raté : ${esc(why)}.${st.lost ? '' : ` Il te reste ${max - st.fails} essai${max - st.fails > 1 ? 's' : ''}.`}<br><small class="muted"><i>${esc(pick(JK.lose))}</i></small>`
    );
  }
  save();
}
function splash(win) {
  const PH = CONTENU.photos || [];
  if (!PH.length) return;
  const old = $('#spl');
  if (old) old.remove();
  const u = PH[Math.floor(Math.random() * PH.length)],
    d = document.createElement('div');
  d.id = 'spl';
  d.className = 'spl ' + (win ? 'w' : 'l');
  d.setAttribute('role', 'dialog');
  d.setAttribute('aria-label', win ? 'You win' : 'You lose');
  d.innerHTML = `<div class="spl-rays"></div>${win ? '' : `<div class="spl-rain">${Array.from({ length: 40 }, (_, i) => `<i style="left:${Math.random() * 100}%;animation-delay:${-Math.random()}s;animation-duration:${0.6 + Math.random() * 0.5}s"></i>`).join('')}</div>`}<div class="splc"><div class="splp" style="background-image:url(${u})"></div><div class="splt" aria-label="${win ? 'YOU WIN' : 'YOU LOSE'}">${[...(win ? 'YOU WIN' : 'YOU LOSE')].map((c, i) => `<i style="--i:${i}">${c == ' ' ? '&nbsp;' : c}</i>`).join('')}</div>${win ? '<div class="splr">✨</div>' : ''}</div><p class="splh">Touche pour continuer</p>`;
  const close = () => {
    if (!d.isConnected) return;
    d.classList.add('out');
    setTimeout(() => d.remove(), 260);
  };
  d.onclick = close;
  document.body.appendChild(d);
  try {
    CINE.sfx(win ? 'fanfare' : 'sad', 0.35);
    if (win) setTimeout(confetti, 500);
  } catch (_) {}
  setTimeout(close, 5000);
}
