/* ---------- Attaques du pickpocket & cadeaux à distance (depuis le site de suivi) ---------- */
const RCI = {
  pts: ['⭐', 'étoile', 'étoiles'],
  scr: ['🔩', 'clé à molette', 'clés à molette'],
  gem: ['💎', 'gemme', 'gemmes'],
  hint: ['💡', 'indice', 'indices'],
  joker: ['🃏', 'joker', 'jokers'],
  dbl: ['✨', 'points doublés', 'points doublés'],
  jeton: ['🎟️', 'jeton', 'jetons']
};
let RCQ = [],
  RCbusy = false,
  RClast = Date.now();
['pointerdown', 'keydown', 'touchstart'].forEach(e => addEventListener(e, () => (RClast = Date.now()), { passive: true }));
function rcHave(k) {
  return k == 'pts' ? S.pts : k == 'scr' ? S.scr || 0 : k == 'gem' ? S.gem || 0 : S.inv[k] || 0;
}
function rcAdd(k, n) {
  if (k == 'pts') S.pts = Math.max(0, S.pts + n);
  else if (k == 'scr') S.scr = Math.max(0, (S.scr || 0) + n);
  else if (k == 'gem') S.gem = Math.max(0, (S.gem || 0) + n);
  else S.inv[k] = Math.max(0, (S.inv[k] || 0) + n);
}
function rcPoll() {
  if (!/^https?:/.test(location.protocol) || instPend()) return;
  fetch(SYNCU + '/cmd.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(o => {
      if (!o) return;
      S.rcDone = S.rcDone || [];
      for (const k in o) {
        const c = o[k];
        if (!c || c.done || S.rcDone.includes(k) || RCQ.some(x => x.k == k)) continue;
        RCQ.push({ k, ...c });
      }
      RCQ.sort((a, b) => a.at - b.at);
    })
    .catch(() => {});
}
function rcStart() {
  if (!/^https?:/.test(location.protocol)) return;
  try {
    const es = new EventSource(SYNCU + '/cmd.json');
    const f = () => rcPoll();
    es.addEventListener('put', f);
    es.addEventListener('patch', f);
  } catch (_) {}
  rcPoll();
  setInterval(rcPoll, 45000);
  setInterval(() => {
    if (
      RCbusy ||
      !RCQ.length ||
      document.hidden ||
      instPend() ||
      $('#gwin') ||
      $('#inst') ||
      $('#pop').innerHTML.trim() ||
      (typeof cBusy != 'undefined' && cBusy) ||
      Date.now() - RClast < 4000
    )
      return;
    rcRun(RCQ.shift());
  }, 1500);
}
function rcList(L) {
  return L.map(x => `<div class="rcit"><span>${x[0]}</span><b>${x[1]}</b></div>`).join('');
}
function rcRun(c) {
  RCbusy = true;
  S.rcDone = S.rcDone || [];
  S.rcDone.push(c.k);
  if (S.rcDone.length > 200) S.rcDone = S.rcDone.slice(-200);
  save();
  const items = c.items || {},
    msg = c.msg ? `<p class="rcmsg">💌 « ${esc(c.msg)} »</p>` : '';
  const fin = (res, taps) => {
    save();
    hdr();
    try {
      if (view == 'me') meView();
      else if (view == 'lab') labView();
      else if (view == 'shop') shopView();
    } catch (_) {}
    syncReq('cmd/' + c.k + '/done', 'PUT', { at: Date.now(), res, taps: taps || 0 });
    RCbusy = false;
  };
  const ov = document.createElement('div');
  ov.id = 'rcov';
  ov.className = 'rcov ' + (c.type == 'attack' ? 'atk' : 'gift');
  document.body.appendChild(ov);
  if (c.type == 'attack') {
    const took = [];
    for (const k in RCI) {
      const w = +items[k] || 0;
      if (w <= 0) continue;
      const n = Math.min(w, rcHave(k));
      if (n > 0) {
        rcAdd(k, -n);
        took.push([RCI[k][0], `${n} ${n > 1 ? RCI[k][2] : RCI[k][1]}`]);
      }
    }
    for (const b of c.bons || []) {
      let i = S.bons.findIndex(x => !x.used && b.at && x.at == b.at);
      if (i < 0) i = S.bons.findIndex(x => !x.used && x.n == b.n);
      if (i >= 0) {
        const x = S.bons.splice(i, 1)[0];
        took.push([x.ic, 'Bon : ' + esc(x.n)]);
      }
    }
    slog(
      '🦹',
      `Attaque du pickpocket : ${took.length ? took.map(t => t[0] + ' ' + t[1].replace(/<[^>]+>/g, '')).join(', ') : 'rien à voler'}`
    );
    let taps = 0,
      left = 10,
      mv = 0,
      tick = 0;
    ov.innerHTML = `<div class="rcbox"><div class="rcg0">🦹<span>💰</span></div><h2>Le pickpocket attaque !</h2><p>Bonsoir… <b>pas un geste</b>. Je viens piller <b>tout ton trésor</b> ! 💰</p><p>Tape sur moi le plus vite possible pendant 10 secondes pour me ralentir !</p><button id="rcgo">Je suis prête 😤</button></div>`;
    try {
      SFX('bad');
    } catch (_) {}
    $('#rcgo').onclick = () => {
      ov.innerHTML = `<div class="rchud"><span>⏱️ <b id="rct">10</b></span><span>👊 <b id="rcn">0</b></span></div><button class="rcg" id="rcg" aria-label="Le pickpocket">🦹<span>💰</span></button>`;
      const g = $('#rcg');
      const jump = () => {
        const W = innerWidth - 110,
          H = innerHeight - 170;
        g.style.left = 10 + Math.random() * W + 'px';
        g.style.top = 70 + Math.random() * H + 'px';
      };
      jump();
      g.onpointerdown = e => {
        e.preventDefault();
        taps++;
        $('#rcn').textContent = taps;
        g.classList.remove('hit');
        void g.offsetWidth;
        g.classList.add('hit');
        try {
          SFX('tap');
        } catch (_) {}
        const p = document.createElement('i');
        p.className = 'rcpow';
        p.textContent = ['💥', '👊', '⭐', '💢'][taps % 4];
        p.style.left = e.clientX + 'px';
        p.style.top = e.clientY + 'px';
        ov.appendChild(p);
        setTimeout(() => p.remove(), 600);
        if (taps % 3 == 0) jump();
      };
      mv = setInterval(jump, 850);
      tick = setInterval(() => {
        left--;
        $('#rct').textContent = left;
        if (left <= 0) {
          clearInterval(tick);
          clearInterval(mv);
          end();
        }
      }, 1000);
    };
    const end = () => {
      try {
        SFX('lose');
      } catch (_) {}
      ov.innerHTML = `<div class="rcbox"><div class="rcg0 laugh">🦹<span>💰</span></div><h2>Hahaha !</h2><p>Tu m'as frappé <b>${taps} fois</b>… mais trop tard ! ${took.length ? "Je t'ai volé :" : 'Ton trésor était vide… quelle déception !'}</p>${rcList(took)}${msg}<button id="rcok">Grrr… 😤</button></div>`;
      $('#rcok').onclick = () => {
        ov.remove();
        fin(took.map(t => t[0] + ' ' + t[1].replace(/<[^>]+>/g, '')).join(', '), taps);
      };
    };
  } else {
    const got = [];
    ov.innerHTML = `<div class="rcbox"><h2>🎁 Un cadeau est arrivé !</h2><p>Quelqu'un a pensé à toi… Touche le paquet pour l'ouvrir !</p><button class="rcgift" id="rcgf" aria-label="Ouvrir le cadeau">🎁</button></div>`;
    let n = 0;
    $('#rcgf').onclick = () => {
      n++;
      const b = $('#rcgf');
      b.classList.remove('shk');
      void b.offsetWidth;
      b.classList.add('shk');
      try {
        SFX('tap');
      } catch (_) {}
      if (n < 3) return;
      for (const k in RCI) {
        const w = +items[k] || 0;
        if (w <= 0) continue;
        if (k == 'pts') {
          S.pts += w;
          S.earned += w;
        } else rcAdd(k, w);
        got.push([RCI[k][0], `${w} ${w > 1 ? RCI[k][2] : RCI[k][1]}`]);
      }
      for (const b of c.bons || []) {
        S.bons.push({ id: b.id || 'cadeau', ic: b.ic || '💌', n: b.n, used: false, at: Date.now() });
        got.push([b.ic || '💌', 'Bon : ' + esc(b.n)]);
      }
      slog('🎁', `Ouvre un cadeau : ${got.map(t => t[0] + ' ' + t[1].replace(/<[^>]+>/g, '')).join(', ') || 'un mot doux'}`);
      try {
        confetti();
        ding();
      } catch (_) {}
      ov.innerHTML = `<div class="rcbox"><div class="rcopen">🎉</div><h2>Surprise !</h2>${got.length ? '<p>Tu reçois :</p>' + rcList(got) : ''}${msg}<button id="rcok">Merci ❤️</button></div>`;
      $('#rcok').onclick = () => {
        ov.remove();
        try {
          achCheck();
        } catch (_) {}
        const L = lvl();
        if (L > S.lvl) {
          S.gem = (S.gem || 0) + 2 * (L - S.lvl);
          S.lvl = L;
          S.inv.hint++;
          toast(`Niveau ${L + 1} : ${LEVELS[L][1]} ! (+1 💡 +2 💎)`);
        }
        fin(got.map(t => t[0] + ' ' + t[1].replace(/<[^>]+>/g, '')).join(', '));
      };
    };
  }
}
setTimeout(rcStart, 2500);
