/* ---------- Points, sons, notifications ---------- */
function toast(m) {
  const T = $('#toast');
  while (T.children.length >= 2) T.firstChild.remove();
  const e = document.createElement('div');
  if (/^<img class="eggi/.test(m)) e.innerHTML = m;
  else e.textContent = m;
  T.appendChild(e);
  const L = (e.textContent || '').length;
  setTimeout(
    () => {
      e.style.transition = 'opacity .4s';
      e.style.opacity = 0;
      setTimeout(() => e.remove(), 400);
    },
    L > 28 ? Math.min(9000, 2600 + L * 75) : 2300
  );
}
function ding() {
  if (S.voix !== false && S.own.includes('voix') && (CONTENU.voix || []).length) voixPlay();
}
function lvl() {
  let i = 0;
  LEVELS.forEach((l, k) => {
    if (S.earned >= l[0]) i = k;
  });
  return i;
}
function award(n, why) {
  if (n <= 0) return;
  S.pts += n;
  S.earned += n;
  try {
    EV('stars', n);
  } catch (_) {}
  const L = lvl();
  toast(`+${n} ⭐ ${why || ''}`);
  if (L > S.lvl) {
    slog('⬆️', `Passe niveau ${L + 1} · ${LEVELS[L][1]}`);
    S.gem = (S.gem || 0) + 2 * (L - S.lvl);
    S.lvl = L;
    S.inv.hint++;
    setTimeout(() => {
      toast(`Niveau ${L + 1} : ${LEVELS[L][1]} ! (+1 💡 +2 💎)`);
      if (!$('#pop').innerHTML.trim())
        popup(
          `<h2>Niveau ${L + 1} !</h2><span class="lvpic big" style="background-image:url(${lvlPic(L)})"></span><p style="font-size:1.3rem;margin:.4em 0"><b>${LEVELS[L][1]}</b></p><p class="muted">Tu gagnes un 💡 indice et 2 💎 gemmes en cadeau.</p><button onclick="closePop()">Trop bien !</button>`
        );
    }, 600);
    confetti();
  }
  save();
  hdr();
}
function hdr() {
  $('#pts').textContent = '⭐ ' + S.pts;
  document.body.classList.toggle('fini', !!S.vbDone);
  eggBadge();
  achCheck();
  try {
    alTick();
  } catch (_) {}
  {
    const lg = $('#logo'),
      u = lvlPic(lvl());
    if (lg && lg.dataset.u !== u) {
      lg.dataset.u = u;
      lg.style.backgroundImage = u ? `url(${u})` : '';
      lg.textContent = u ? '' : '🎄';
      lg.style.fontSize = u ? '0' : '1.5rem';
    }
  }
  {
    const t = $('#ttl');
    t.textContent = (S.vbDone ? '👑 ' : '') + LEVELS[lvl()][1];
    t.style.fontSize = '';
    let f = parseFloat(getComputedStyle(t).fontSize);
    while (t.scrollWidth > t.clientWidth + 1 && f > 11) {
      f -= 0.5;
      t.style.fontSize = f + 'px';
    }
  }
  $('#banner').innerHTML = S.sim ? `Mode test : jour ${S.sim} simulé` : CONTENU.modeTest ? '🧪 Mode test : les 24 jours sont ouverts' : '';
  {
    const R = document.documentElement;
    R.dataset.theme = 'sapin';
    R.dataset.bg = S.own.includes('fondrose') && S.fondrose !== false ? 'rose' : '';
    R.dataset.txt = S.own.includes('ordore') && S.ordore !== false ? 'or' : '';
  }
  document
    .querySelectorAll('#tabs button')
    .forEach(b => b.classList.toggle('on', b.dataset.v == view || (view == 'day' && b.dataset.v == 'cal')));
}
/* ---------- Navigation ---------- */
const SCR = {},
  skey = () => (view == 'day' ? 'day' + cur : view);
function go(v, d) {
  if (cBusy && view == 'casino' && v != 'casino') return toast('Attends la fin du tirage 😉');
  setTimeout(() => syncLive(), 50);
  closeGame();
  allowScroll();
  RUN++;
  document.body.classList.remove('playing');
  if (typeof view != 'undefined' && view) SCR[skey()] = scrollY;
  try {
    if (!(v == 'day' && String(d || cur) === YTM.gday)) YTM.stopGame();
  } catch (_) {}
  view = v;
  if (d) cur = d;
  closePop();
  render();
  try {
    if (v == 'day') YTM.start(cur);
  } catch (_) {}
  const y = SCR[skey()] || 0;
  window.scrollTo(0, y);
  lastY = y;
  requestAnimationFrame(() => {
    allowScroll();
    window.scrollTo(0, y);
    lastY = y;
  });
}
function render() {
  window.__prevView = window.__curView;
  window.__curView = view;
  if (view != 'book' && window.__prevView == 'book') {
    try {
      ALBM.stop(0.3);
    } catch (_) {}
  }
  hdr();
  ({
    set: setView,
    book: bookView,
    cal: calView,
    day: dayView,
    puz: puzView,
    shop: shopView,
    lab: labView,
    casino: casinoView,
    me: meView
  })[view]();
  if (typeof updBadge == 'function') updBadge();
  clearTimeout(window.__stT);
  window.__stT = setTimeout(storyCheck, 1200);
}
document.querySelectorAll('#tabs button').forEach(b => (b.onclick = () => go(b.dataset.v)));
function popup(h) {
  $('#pop').innerHTML = `<div class="modal" role="dialog" aria-modal="true"><div class="card">${h}</div></div>`;
}
function closePop() {
  $('#pop').innerHTML = '';
}
