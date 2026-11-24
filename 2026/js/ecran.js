// Adapte l’affichage à la taille de l’écran (téléphone / tablette en portrait).
(function () {
  const R = document.documentElement;
  let mode = null,
    vk = 1,
    pend = 0,
    tw = 0;
  const M = () => document.querySelector('meta[name=viewport]');
  const DEF = 'width=device-width, initial-scale=1, viewport-fit=cover';
  if (!M()) {
    const m = document.createElement('meta');
    m.name = 'viewport';
    m.content = DEF;
    document.head.appendChild(m);
  }
  const setM = c => {
    const m = M();
    if (m && m.getAttribute('content') != c) m.setAttribute('content', c);
  };
  const vars = (tk, tab, tabp) => {
    R.style.setProperty('--W', innerWidth + 'px');
    R.style.setProperty('--H', innerHeight + 'px');
    R.style.setProperty('--tk', tk);
    R.classList.toggle('tab', tab);
    R.classList.toggle('tabp', tabp);
    R.classList.toggle('vp', mode == 'vp');
    try {
      window.calFit && calFit();
    } catch (_) {}
  };
  const f = () => {
    if (pend) return;
    const cur = mode == 'vp' ? vk : 1,
      W = innerWidth * cur,
      H = innerHeight * cur,
      k = Math.min(W / 440, H / 860),
      big = Math.min(W, H) >= 600 && k > 1.06,
      port = H > W;
    if (big && port && mode != 'sc' && M()) {
      if (mode == 'vp' && Math.abs(W / vk - innerWidth) < 3) {
        vars('1', false, true);
        return;
      }
      vk = k;
      tw = Math.round(W / k);
      pend = 1;
      setM(
        `width=${tw}, initial-scale=${k.toFixed(4)}, minimum-scale=${k.toFixed(4)}, maximum-scale=${k.toFixed(4)}, user-scalable=no, viewport-fit=cover`
      );
      setTimeout(() => {
        pend = 0;
        if (Math.abs(innerWidth - tw) <= 3) {
          mode = 'vp';
          vars('1', false, true);
        } else {
          mode = 'sc';
          vk = 1;
          setM(DEF);
          setTimeout(f, 300);
        }
      }, 350);
      return;
    }
    if (mode == 'vp' && !(big && port)) {
      mode = null;
      vk = 1;
      setM(DEF);
      pend = 1;
      setTimeout(() => {
        pend = 0;
        f();
      }, 350);
      return;
    }
    vars(big ? k.toFixed(3) : '1', big, big && port);
  };
  f();
  addEventListener('resize', f);
  addEventListener('orientationchange', () => setTimeout(f, 300));
})();
