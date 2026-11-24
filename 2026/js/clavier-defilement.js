function hiddenKeyboard(el, onChar, onDel, onEnter) {
  const old = document.getElementById('hk');
  if (old) old.remove();
  const K = document.createElement('div');
  K.id = 'hk';
  K.className = 'okb';
  const R = ['AZERTYUIOP', 'QSDFGHJKLM', (onEnter ? '⏎' : '') + 'WXCVBN⌫'];
  K.innerHTML = R.map(
    r =>
      `<div class="okr">${[...r].map(c => `<button type="button" class="okk${c == '⏎' || c == '⌫' ? ' wide' : ''}" data-k="${c}" aria-label="${c == '⏎' ? 'Valider' : c == '⌫' ? 'Effacer' : c}">${c == '⏎' ? 'OK' : c}</button>`).join('')}</div>`
  ).join('');
  K.addEventListener('pointerdown', e => {
    const b = e.target.closest('.okk');
    if (!b) return;
    e.preventDefault();
    const c = b.dataset.k;
    b.classList.add('prs');
    setTimeout(() => b.classList.remove('prs'), 120);
    if (c == '⌫') onDel();
    else if (c == '⏎') {
      if (onEnter) onEnter();
    } else onChar(c);
  });
  const kd = e => {
    if (!document.body.contains(K)) {
      removeEventListener('keydown', kd);
      return;
    }
    if (G && G.key) return;
    if (e.target && e.target.closest && e.target.closest('input,textarea')) return;
    if (e.key == 'Backspace') {
      onDel();
      e.preventDefault();
    } else if (e.key == 'Enter') {
      if (onEnter) onEnter();
      e.preventDefault();
    } else if (/^[a-zA-ZÀ-ÿ]$/.test(e.key))
      onChar(
        e.key
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
      );
  };
  addEventListener('keydown', kd);
  el.parentNode.appendChild(K);
  return {
    focus() {},
    blur() {},
    paint(m) {
      K.querySelectorAll('.okk').forEach(b => {
        b.classList.remove('g', 'y', 'a');
        const s = m[b.dataset.k];
        if (s) b.classList.add(s);
      });
    }
  };
}
/* Pendant une partie : on annule tout saut de page que la joueuse n'a pas provoqué */
let lastY = 0,
  userAct = 0,
  touching = false,
  moved = false,
  moveEnd = 0;
const allowScroll = () => (userAct = Date.now());
['wheel', 'keydown'].forEach(t => addEventListener(t, allowScroll, { passive: true }));
addEventListener(
  'touchstart',
  () => {
    touching = true;
    moved = false;
  },
  { passive: true }
);
addEventListener(
  'touchmove',
  () => {
    moved = true;
  },
  { passive: true }
);
addEventListener(
  'touchend',
  () => {
    touching = false;
    if (moved) moveEnd = Date.now();
  },
  { passive: true }
);
addEventListener(
  'scroll',
  () => {
    const playing = document.body.classList.contains('playing'),
      typing = document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName),
      now = Date.now();
    if (!playing || typing || (touching && moved) || now - moveEnd < 1800 || now - userAct < 700) {
      lastY = scrollY;
      return;
    }
    if (Math.abs(scrollY - lastY) > 30) scrollTo(0, lastY);
    else lastY = scrollY;
  },
  { passive: true }
);
