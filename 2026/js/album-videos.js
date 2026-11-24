function vidNew() {
  if (document.getElementById('spl')) {
    setTimeout(vidNew, 1200);
    return;
  }
  const k = vidN() - 1,
    V = (CONTENU.videos || [])[k];
  if (!V) return;
  const ok = alOk();
  popup(
    `<h2>🎬 Nouvelle vidéo débloquée !</h2><p class="center" style="font-size:3rem;margin:.2em 0">🎞️</p><p class="center">Un nouveau souvenir… <b>en vidéo</b> t'attend dans l'album 📖</p>${ok ? '' : `<p class="muted center">Pour la regarder, fabrique l'album dans le 💝 coffre à souvenirs du labo 🧪</p>`}<button onclick="closePop();${ok ? `vidGo(${k})` : "go('lab')"}">${ok ? "📖 La voir dans l'album" : '🧪 Aller au labo'}</button><button class="alt" onclick="closePop()">Plus tard</button>`
  );
}
function vidGo(k) {
  const P = alPages(),
    pg = P.findIndex(p => p.items && p.items.some(it => it.vid == k));
  alS().goto = Math.max(0, pg);
  go('book');
}
function vidPlay(k) {
  const V = (CONTENU.videos || [])[k];
  if (!V || !vidOk(k)) return;
  const was = { alb: 0, ytm: 0 };
  try {
    was.alb = ALBM.on;
  } catch (_) {}
  try {
    was.ytm = YTM.hold();
  } catch (_) {}
  window.__vidOn = 1;
  try {
    ALBM.stop(0.15, 1);
  } catch (_) {}
  try {
    MUS.stop();
    MUS._bg = 0;
  } catch (_) {}
  const o = document.createElement('div');
  o.id = 'vidov';
  o.innerHTML = `<div class="vid-in"><video src="${V.src}" poster="${V.poster || ''}" controls autoplay playsinline webkit-playsinline></video><p class="vid-t">🎬 ${esc(V.titre)}${V.date ? ` <small>· ${esc(V.date)}</small>` : ''}</p><button class="alt sm vid-x">✕ Fermer</button></div>`;
  document.body.appendChild(o);
  const v = o.querySelector('video');
  try {
    slog('🎬', `Regarde la vidéo « ${V.titre} »`);
  } catch (_) {}
  const close = () => {
    if (!o.isConnected) return;
    try {
      v.pause();
    } catch (_) {}
    o.remove();
    window.__vidOn = 0;
    if (was.ytm) {
      try {
        YTM.unhold();
      } catch (_) {}
    } else if (was.alb && view == 'book') {
      try {
        ALBM.start();
      } catch (_) {}
    } else {
      try {
        bgm();
      } catch (_) {}
    }
  };
  v.onended = close;
  o.querySelector('.vid-x').onclick = close;
  o.onclick = e => {
    if (e.target == o) close();
  };
  const pp = v.play();
  if (pp && pp.catch) pp.catch(() => {});
}
function useJoker(d) {
  if (S.inv.joker < 1) return;
  S.inv.joker--;
  const st = S.days[d];
  st.extra = (st.extra || 0) + 1;
  st.done = false;
  st.lost = false;
  save();
  toast('🃏 Un essai de plus !');
  startBox(d);
}
