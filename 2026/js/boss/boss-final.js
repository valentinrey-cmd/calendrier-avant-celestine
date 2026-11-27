document.addEventListener(
  'pointerdown',
  () => {
    try {
      const C = window.__eggAC;
      if (C && C.state !== 'running') C.resume();
    } catch (_) {}
    try {
      const V = window.__voxAC;
      if (V && V.state !== 'running') V.resume();
    } catch (_) {}
  },
  true
);
const VMPOS = {};
// calme = musique de fond sous des dialogues (repli : un fond d'espion discret plutôt que la musique de l'album)
function vMusic(keys, pk, VOL, calme) {
  keys = keys || ['b24', 'b11'];
  VOL = VOL || 0.75;
  let a = null,
    u = null,
    dead = 0,
    fb = 0,
    hold = 0,
    tok = 0,
    g = null;
  const gv = () => (g ? g.gain.value : a ? a.volume : 0),
    sv = x => {
      x = Math.max(0, Math.min(1, x));
      if (g) {
        try {
          g.gain.value = x;
        } catch (_) {}
      } else if (a) a.volume = x;
    };
  const was = { ytm: 0 };
  try {
    was.ytm = YTM.hold();
  } catch (_) {}
  if (was.ytm) window.__vmYtm = 1;
  const me = {};
  const VS = window.__vmSet || (window.__vmSet = new Set());
  VS.add(me);
  window.__vidOn = 1;
  try {
    ALBM.stop(0.2);
  } catch (_) {}
  try {
    MUS.stop();
    MUS._bg = 0;
  } catch (_) {}
  (async () => {
    try {
      if (S.sound === false || S.music === false) return;
      const o = await MDB.all();
      let it = null;
      for (const k of keys)
        if (o && o[k] && o[k].blob) {
          it = o[k];
          break;
        }
      if (dead) return;
      if (!it || !it.blob) {
        // pas de musique dans le fichier mystère : musique de l'album, ou (calme) un fond d'espion discret
        fb = calme ? 2 : 1;
        window.__vidOn = 0;
        try {
          fb == 2 ? MUS.play('filature', 0.045) : ALBM.start();
        } catch (_) {}
        return;
      }
      u = URL.createObjectURL(it.blob);
      a = new Audio(u);
      a.loop = true;
      a.volume = 0;
      try {
        const C = window.__eggAC || (window.__eggAC = new (window.AudioContext || window.webkitAudioContext)());
        if (C.state === 'suspended') C.resume();
        const src = C.createMediaElementSource(a);
        g = C.createGain();
        g.gain.value = 0;
        src.connect(g);
        g.connect(C.destination);
        a.volume = 1;
      } catch (_) {
        g = null;
        a.volume = 0;
      }
      if (pk) {
        const p0 = VMPOS[pk] || 0;
        if (p0 > 0) {
          await new Promise(r => {
            if (a.readyState >= 1) return r();
            a.addEventListener('loadedmetadata', r, { once: true });
            setTimeout(r, 1500);
          });
          try {
            a.currentTime = a.duration ? p0 % a.duration : p0;
          } catch (_) {}
        }
        a.addEventListener('timeupdate', () => {
          if (!dead || hold) VMPOS[pk] = a.currentTime;
        });
      }
      if (dead) return;
      if (hold) return;
      await a.play();
      let v = 0;
      const my = ++tok;
      const f = setInterval(() => {
        if (dead || !a || tok !== my) {
          clearInterval(f);
          return;
        }
        v = Math.min(VOL, v + 0.04);
        sv(v);
        if (v >= VOL) clearInterval(f);
      }, 120);
    } catch (_) {}
  })();
  return (me.api = {
    get vol() {
      return gv();
    },
    alive() {
      return !dead;
    },
    pause() {
      if (dead) return;
      hold = 1;
      VS.delete(me);
      const my = ++tok;
      if (fb) {
        try {
          fb == 2 ? MUS.stop() : ALBM.stop(0.4);
        } catch (_) {}
        return;
      }
      if (!a) return;
      const A = a;
      let v = gv();
      const f = setInterval(() => {
        if (tok !== my) return clearInterval(f);
        v -= Math.max(0.01, VOL / 8);
        if (v <= 0) {
          clearInterval(f);
          sv(0);
          try {
            A.pause();
          } catch (_) {}
        } else sv(v);
      }, 70);
    },
    resume() {
      if (dead) return;
      hold = 0;
      VS.add(me);
      window.__vidOn = 1;
      try {
        MUS.stop();
        MUS._bg = 0;
      } catch (_) {}
      const my = ++tok;
      if (fb) {
        try {
          fb == 2 ? MUS.play('filature', 0.045) : ALBM.start();
        } catch (_) {}
        return;
      }
      if (!a) return;
      try {
        a.play().catch(() => {});
      } catch (_) {}
      let v = gv();
      const f = setInterval(() => {
        if (tok !== my || dead || !a) return clearInterval(f);
        v = Math.min(VOL, v + Math.max(0.01, VOL / 10));
        sv(v);
        if (v >= VOL) clearInterval(f);
      }, 90);
    },
    setVol(nv, ms) {
      VOL = nv;
      if (dead || fb || !a || hold) return;
      const my = ++tok,
        v0 = gv(),
        t0 = performance.now();
      ms = ms || 900;
      const f = setInterval(() => {
        if (tok !== my || dead) return clearInterval(f);
        const k = Math.min(1, (performance.now() - t0) / ms);
        sv(v0 + (nv - v0) * k);
        if (k >= 1) clearInterval(f);
      }, 50);
    },
    stop() {
      if (dead) return;
      dead = 1;
      window.__vidOn = 0;
      if (fb) {
        try {
          fb == 2 ? MUS.stop() : ALBM.stop(0.6);
        } catch (_) {}
      }
      if (a) {
        const A = a;
        let v = gv();
        const f = setInterval(() => {
          v -= Math.max(0.01, v / 6 + 0.01);
          if (v <= 0) {
            clearInterval(f);
            sv(0);
            try {
              A.pause();
            } catch (_) {}
            try {
              g && g.disconnect();
            } catch (_) {}
            if (u) URL.revokeObjectURL(u);
          } else sv(v);
        }, 90);
      }
      VS.delete(me);
      if (VS.size) window.__vidOn = 1;
      else if (window.__vmYtm) {
        window.__vmYtm = 0;
        try {
          YTM.unhold();
        } catch (_) {}
      } else
        setTimeout(() => {
          if (!VS.size)
            try {
              bgm();
            } catch (_) {}
        }, 1200);
    }
  });
}
function vMiss() {
  if (S.demOn) return [];
  const m = [],
    n = Array.from({ length: 24 }, (_, i) => i + 1).filter(d => !S.opened.includes(d));
  if (n.length)
    m.push(`📅 Ouvrir les 24 cases du calendrier (il en manque ${n.length} : ${n.slice(0, 8).join(', ')}${n.length > 8 ? '…' : ''})`);
  if (!Object.values(S.puzWon || {}).some(Boolean)) m.push('🧩 Recoller le formulaire d’accusation (onglet Puzzle)');
  return m;
}
function vTry(b) {
  const m = vMiss();
  if (!m.length) {
    const bl = [4, 8, 11, 15, 19, 22].filter(d => bossCfg(d) && !(S.boss || {})[d]);
    if (bl.length && !b.dataset.ok && !S.demOn) {
      b.dataset.ok = 1;
      b.textContent = '⚔️ Y aller quand même';
      const c = b.closest('.card') || b.parentNode,
        e = c.querySelector('#vgm');
      if (e)
        e.innerHTML = `<b>💡 Petit conseil avant de démasquer le coupable…</b><br>Il te manque peut-être des indices ! Tu serais mieux préparée en battant d’abord tous les autres boss. Il t’en reste ${bl.length} :<br>${bl.map(d => `• ${esc(bossCfg(d).n)} (jour ${d})`).join('<br>')}`;
      return;
    }
    closePop();
    if (!(S.story || {}).rev) return accuse(() => vBoss());
    return vBoss();
  }
  const c = b.closest('.card') || b.parentNode;
  c.classList.remove('vshk');
  void c.offsetWidth;
  c.classList.add('vshk');
  try {
    SFX('lose');
  } catch (_) {}
  try {
    navigator.vibrate && navigator.vibrate([80, 40, 80]);
  } catch (_) {}
  const e = c.querySelector('#vgm');
  if (e)
    e.innerHTML = `<b>😈 La silhouette ricane : « Tu n’es pas prête ! »</b><br>Avant de la démasquer, il te reste à :<br>${m.map(x => '• ' + esc(x)).join('<br>')}`;
}
/* boîtes de dialogue internes (les boîtes du navigateur ne s'affichent pas dans l'appli Android) */
function askBox(t, sub, ok, no) {
  return new Promise(res => {
    const o = document.createElement('div');
    o.className = 'askb';
    o.innerHTML = `<div class="askc" role="dialog" aria-modal="true"><p class="askt">${esc(t)}</p>${sub ? `<p class="asks">${esc(sub)}</p>` : ''}<div class="askr">${no !== null ? `<button class="alt" data-v="0">${esc(no || 'Annuler')}</button>` : ''}<button data-v="1">${esc(ok || 'OK')}</button></div></div>`;
    const end = v => {
      o.classList.add('out');
      setTimeout(() => o.remove(), 200);
      res(v);
    };
    o.onclick = e => {
      const b = e.target.closest('button');
      if (b) return end(b.dataset.v == '1');
      if (e.target == o && no !== null) end(false);
    };
    document.body.appendChild(o);
    try {
      SFX('tap');
    } catch (_) {}
  });
}
function appAlert(t) {
  return askBox(String(t).split('\n')[0], String(t).split('\n').slice(1).join(' · '), 'OK', null);
}
function vbPic(kind) {
  return new Promise(res => {
    const root = document.getElementById('vbo') || document.body;
    const o = document.createElement('div');
    o.className = 'vbph ' + kind;
    if (kind == 'gene') {
      o.innerHTML = `<div class="vbph-ph"><div class="vbph-hd"><span>‹</span><b>👨‍👩‍👧‍👦 Famille ❤️</b><small>14 membres</small></div><div class="vbph-ms"><div class="vbph-bu me"><img src="${VBPH.gene}" alt=""><p>Regardez Valentin 😂😂</p><i>08:12 ✓✓</i></div></div></div>`;
      const R = [
          ['Tata Sophie', '❤️❤️❤️'],
          ['Mamie', 'Qu’il est mignon 😍'],
          ['Tonton Gérard', '😂😂😂 on l’imprime ?'],
          ['Valentin', 'SUPPRIME ÇA 😭😭']
        ],
        ms = o.querySelector('.vbph-ms');
      R.forEach(([n, t], k) =>
        setTimeout(
          () => {
            if (!o.isConnected) return;
            const d = document.createElement('div');
            d.className = 'vbph-bu' + (n == 'Valentin' ? ' val' : '');
            d.innerHTML = `<b>${n}</b><p>${t}</p>`;
            ms.appendChild(d);
            ms.scrollTop = 1e4;
            try {
              bkT(n == 'Valentin' ? 300 : 900, 0.06, 'sine', 0.05, n == 'Valentin' ? 200 : 1200);
            } catch (_) {}
          },
          900 + k * 750
        )
      );
    } else {
      o.innerHTML = `<div class="vbph-pol"><img src="${VBPH.bebe}" alt=""><p>Bébé Valentin 🍼</p></div><span class="vbph-sp">✨</span><span class="vbph-sp s2">💕</span><span class="vbph-sp s3">🍼</span><div class="vbph-gz">Gouzi gouzi !</div>`;
      try {
        bkT(1200, 0.15, 'sine', 0.05, 1600);
      } catch (_) {}
    }
    root.appendChild(o);
    let ok = 0;
    setTimeout(() => (ok = 1), 1200);
    const end = () => {
      if (!o.isConnected) return;
      o.classList.add('out');
      setTimeout(() => {
        o.remove();
        res();
      }, 350);
    };
    o.addEventListener('click', e => {
      e.stopPropagation();
      if (ok) end();
    });
    setTimeout(end, kind == 'gene' ? 5600 : 4200);
  });
}
function vBoss(test, sp, so) {
  if (document.getElementById('vbo')) return;
  sp = Math.max(1, Math.min(4, +sp || 1));
  let mu = { stop() {} };
  try {
    slog('😈', `Lance le boss final${test ? ' (test)' : ''}`);
  } catch (_) {}
  const o = document.createElement('div');
  o.id = 'vbo';
  o.innerHTML = `<div class="vb-in"><div class="vb-ar">
  <div class="vb-card e"><b>VALENTIN</b> <small>Nv.99 ♂</small><div class="vb-hp"><i id="vbE"></i><em class="vb-q" style="left:25%"></em><em class="vb-q" style="left:50%"></em><em class="vb-q" style="left:75%"></em></div><span id="vbEt"></span></div>
  <div class="vb-spr e" id="vbSE"><div class="vb-pl"></div><img class="vv" src="${VIMG.v}" alt=""></div>
  <div class="vb-spr c" id="vbSC"><div class="vb-pl"></div><img src="${VIMG.c}" alt=""></div>
  <div class="vb-card c"><b>CÉLESTINE</b> <small>Nv.24 ♀</small><div class="vb-hp"><i id="vbC"></i></div><span id="vbCt"></span></div></div>
  <div class="vb-box" id="vbB"><p id="vbT"></p><div id="vbM"></div></div><button class="vb-x" id="vbX" aria-label="Quitter">✕</button><div class="vb-cover on"></div></div>`;
  document.body.appendChild(o);
  document.documentElement.classList.add('gl');
  cnArena(o);
  const $$ = q => o.querySelector(q),
    T = $$('#vbT'),
    M = $$('#vbM'),
    B = $$('#vbB'),
    wait = ms => new Promise(r => setTimeout(r, ms));
  let alive = true;
  const st = (window.__vbst = {
    so: !!so,
    e: 800,
    eM: 800,
    floor: 600,
    c: 100,
    cM: 100,
    part: sp,
    mk: 0,
    it: { choco: 2, photo: 1, chaus: 1 },
    stun: 0,
    charm: 0,
    pout: 0,
    ult: 0,
    heal: 0,
    msg: 1,
    turn: 0
  });
  const hp = () => {
    const pe = Math.max(0, st.e) / st.eM,
      pc = Math.max(0, st.c) / st.cM;
    $$('#vbE').style.width = pe * 100 + '%';
    $$('#vbC').style.width = pc * 100 + '%';
    $$('#vbE').style.background = pe > 0.5 ? '#3ddc84' : pe > 0.2 ? '#f3c623' : '#ff3d6e';
    $$('#vbC').style.background = pc > 0.5 ? '#3ddc84' : pc > 0.2 ? '#f3c623' : '#ff3d6e';
    $$('#vbEt').textContent = Math.max(0, Math.ceil(st.e)) + ' / ' + st.eM;
    $$('#vbCt').textContent = Math.max(0, Math.ceil(st.c)) + ' / ' + st.cM;
  };
  hp();
  {
    let vt = 0;
    const ve = $$('#vbSE img');
    ve.style.cursor = 'pointer';
    ve.addEventListener('pointerdown', e => {
      if (!alive) return;
      e.stopPropagation();
      vt++;
      pop('e', pick(JK.vtap), '#fff');
      try {
        bkT(700 + Math.random() * 300, 0.08, 'sine', 0.04);
      } catch (_) {}
      if (vt == 10)
        try {
          ACH('touchV');
        } catch (_) {}
    });
  }
  const quit = () => {
    if (!alive) return;
    alive = false;
    try {
      syncLive(null);
      slog('🚪', `Quitte le boss final (partie ${st.part}/4)`);
    } catch (_) {}
    mu.stop();
    try {
      st.dmu && st.dmu.stop();
    } catch (_) {}
    try {
      st.djm && st.djm.stop();
    } catch (_) {}
    o.remove();
    document.documentElement.classList.remove('gl');
    try {
      render();
    } catch (_) {}
  };
  $$('#vbX').onclick = e => {
    e.stopPropagation();
    askBox('Quitter le combat final ?', 'Tu pourras le recommencer depuis le fax du procureur.', 'Quitter', 'Continuer').then(y => {
      if (y) quit();
    });
  };
  const say = t =>
    new Promise(res => {
      if (!alive) return;
      M.innerHTML = '';
      const s = String(t);
      let i = 0,
        done = false;
      const iv = setInterval(() => {
        if (!alive) {
          clearInterval(iv);
          return;
        }
        i++;
        T.textContent = s.slice(0, i);
        try {
          CINE.blip(/^VALENTIN/.test(s) ? 'v' : /^CÉLESTINE/.test(s) ? 'c' : 'x', i, s[i - 1], null);
        } catch (_) {}
        if (i >= s.length) fin();
      }, 17);
      const fin = () => {
        if (done) return;
        done = true;
        clearInterval(iv);
        T.innerHTML = esc(s) + '<span class="vb-nx">▼</span>';
        B.onclick = () => {
          B.onclick = null;
          res();
        };
      };
      B.onclick = () => fin();
    });
  const choose = (q, opts) =>
    new Promise(res => {
      B.onclick = null;
      T.textContent = q;
      M.innerHTML = `<div class="vb-g">${opts.map((x, k) => `<button data-k="${k}" ${x.dis ? 'disabled' : ''}>${x.t}${x.n != null ? ` <small>×${x.n}</small>` : ''}</button>`).join('')}</div>`;
      M.querySelectorAll('button').forEach(
        b =>
          (b.onclick = e => {
            e.stopPropagation();
            try {
              SFX('tap');
            } catch (_) {}
            res(+b.dataset.k);
          })
      );
    });
  const timing = () =>
    new Promise(res => {
      B.onclick = null;
      T.textContent = 'Touche l’écran quand le curseur est dans le rose foncé 💗 !';
      M.innerHTML = '<div class="vb-tm"><div class="vb-z"></div><div class="vb-z2"></div><i id="vbK"></i></div>';
      const K = $$('#vbK'),
        t0 = performance.now();
      let done = false,
        raf;
      const sp = 1.75 + Math.min(0.5, st.turn * 0.04);
      const pos = () => {
        const t = (performance.now() - t0) / 1000;
        const ph = (t * sp) % 2;
        return ph < 1 ? ph : 2 - ph;
      };
      const loop = () => {
        if (done || !alive) return;
        K.style.left = pos() * 100 + '%';
        raf = requestAnimationFrame(loop);
      };
      loop();
      const hit = () => {
        if (done) return;
        done = true;
        cancelAnimationFrame(raf);
        o.removeEventListener('pointerdown', pd, true);
        const d = Math.abs(pos() - 0.5);
        const m = d < 0.045 ? 1.6 : d < 0.12 ? 1 : 0.55;
        M.querySelector('.vb-tm').classList.add(m > 1.5 ? 'pf' : m >= 1 ? 'ok' : 'ko');
        try {
          SFX(m > 1.5 ? 'perfect' : m >= 1 ? 'ok' : 'bad');
        } catch (_) {}
        setTimeout(() => res(m), 450);
      };
      const pd = e => {
        if (e.target.closest && e.target.closest('#vbX')) return;
        e.preventDefault();
        e.stopPropagation();
        hit();
      };
      o.addEventListener('pointerdown', pd, true);
      setTimeout(hit, 4200);
    });
  const pop = (who, txt, col) => {
    const sp = $$(who == 'e' ? '#vbSE' : '#vbSC'),
      n = document.createElement('span');
    n.className = 'vb-dn';
    n.style.color = col || '#fff';
    n.textContent = txt;
    sp.appendChild(n);
    setTimeout(() => n.remove(), 1100);
  };
  const hurt = (who, dmg) => {
    const sp = $$(who == 'e' ? '#vbSE' : '#vbSC');
    sp.classList.remove('hit');
    void sp.offsetWidth;
    sp.classList.add('hit');
    if (who == 'e') st.e -= dmg;
    else st.c -= dmg;
    pop(who, '-' + Math.round(dmg), '#ff4f7b');
    hp();
    try {
      bkT(who == 'e' ? 220 : 160, 0.18, 'square', 0.05, 90);
    } catch (_) {}
  };
  const heal = (who, n) => {
    if (who == 'e') st.e = Math.min(st.eM, st.e + n);
    else st.c = Math.min(st.cM, st.c + n);
    pop(who, '+' + n, '#3ddc84');
    hp();
    try {
      bkT(660, 0.25, 'sine', 0.05, 990);
    } catch (_) {}
  };
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuf = a => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const ATKP = [
    { k: 'regard', t: '👀 Regard noir', b: 30, l: ['CÉLESTINE utilise REGARD NOIR !', 'Valentin se sent soudain tout petit.'] },
    { k: 'chat', t: '🤭 Chatouilles', b: 24, l: ['CÉLESTINE utilise CHATOUILLES !', 'Valentin se tord de rire par terre.'], stun: 0.5 },
    { k: 'pout', t: '😤 Bouderie', b: 20, l: ['CÉLESTINE utilise BOUDERIE !', 'Valentin panique et prépare des excuses…'], pout: 1 },
    {
      k: 'msg',
      t: '📱 Ses messages de 2025',
      b: 40,
      l: ['CÉLESTINE lit à voix haute ses premiers messages de 2025…', 'Valentin devient rouge tomate 😳']
    },
    {
      k: 'sock',
      t: '🧦 Chaussettes sales',
      b: 28,
      l: ['CÉLESTINE lui rend ses chaussettes trouvées sous le lit !', 'L’odeur est super efficace 🤢']
    },
    { k: 'pizza', t: '🍕 Dernière part', b: 30, l: ['CÉLESTINE mange la dernière part de pizza… devant lui.', 'Valentin est dévasté 😭'] },
    {
      k: 'pic',
      t: '📸 Photo gênante',
      b: 34,
      l: ['CÉLESTINE poste sa pire photo dans le groupe famille !', 'Les tantes commentent déjà ❤️❤️❤️']
    },
    { k: 'feet', t: '🧊 Pieds gelés', b: 26, l: ['CÉLESTINE colle ses pieds gelés sur Valentin !', 'Il hurle comme une sirène 🚨'] },
    { k: 'spoil', t: '📺 Spoiler', b: 32, l: ['CÉLESTINE spoile la fin de sa série !', '« NOOOON ! » 😱'] },
    {
      k: 'cmm',
      t: '🙄 « Comme tu veux »',
      b: 36,
      l: ['CÉLESTINE dit : « Fais comme tu veux. »', 'Valentin sait qu’il ne faut SURTOUT PAS faire comme il veut 😨']
    },
    {
      k: 'clean',
      t: '🧹 Ménage surprise',
      b: 30,
      l: ['CÉLESTINE range sa console « pour faire de la place ».', 'Il ne la retrouvera jamais 🎮💀']
    },
    {
      k: 'yell',
      t: '📣 Son nom complet',
      b: 33,
      l: ['CÉLESTINE l’appelle par son prénom ET son nom de famille !', 'Valentin sait qu’il a fait une bêtise 😰']
    }
  ];
  let ATKQ = shuf(ATKP);
  const usedA = new Set();
  let fuite = 0,
    bisou = 0,
    stunI = 0,
    pfI = 0,
    bofI = 0;
  const STUN = [
    'VALENTIN est encore sous le choc… il passe son tour !',
    'VALENTIN fixe le plafond, perdu… il ne fait rien.',
    'VALENTIN cherche ses mots… tour perdu !',
    'VALENTIN rit encore… impossible d’attaquer 🤣'
  ];
  const PF = [
    '✨ PARFAIT ! Dégâts bonus !',
    '✨ Pile au bon moment !',
    '✨ Coup de maître !',
    '✨ Timing de championne !',
    '✨ Impeccable !',
    '✨ Magnifique !'
  ];
  const BOF = [
    'Bof… le timing était pas terrible.',
    'Un peu tôt… ou un peu tard.',
    'Ça a à peine chatouillé.',
    'Valentin a esquivé à moitié.',
    'Presque… mais non.',
    'Raté de peu !'
  ];
  const turnC = async () => {
    for (;;) {
      if (!alive) return;
      const c = await choose('Que doit faire CÉLESTINE ?', [
        { t: '⚔️ Attaque' },
        { t: '💋 Bisou', dis: bisou },
        { t: '🎒 Sac' },
        { t: '🏃 Fuite', dis: fuite >= 2 }
      ]);
      if (c == 0) {
        const avail = ATKQ.filter(a => !usedA.has(a.k)).slice(0, 4);
        if (!avail.length) {
          ATKQ = shuf(ATKP);
          usedA.clear();
          continue;
        }
        const k = await choose('Quelle attaque ?', avail.map(a => ({ t: a.t })).concat([{ t: '↩️ Retour' }]));
        if (k == avail.length) continue;
        const A = avail[k];
        usedA.add(A.k);
        const m = await timing();
        if (A.k == 'pic') {
          await say(A.l[0]);
          await vbPic('gene');
          for (const x of A.l.slice(1)) await say(x);
        } else for (const x of A.l) await say(x);
        let d = A.b * m * (st.charm ? 0.6 : 1) * (0.9 + Math.random() * 0.2);
        st.charm = 0;
        hurt('e', d);
        await wait(300);
        if (m > 1.5) await say(PF[pfI++ % PF.length]);
        else if (m < 1) await say(BOF[bofI++ % BOF.length]);
        if (A.stun && Math.random() < A.stun) {
          st.stun = 1;
          await say('Il en perd son prochain tour !');
        }
        if (A.pout) st.pout = 1;
        return;
      }
      if (c == 1) {
        bisou = 1;
        await say('CÉLESTINE fait un BISOU à VALENTIN 💋');
        heal('e', 12);
        await say('C’est super efficace… sur son cœur. +12 PV pour lui 😍');
        st.stun = 1;
        await say('Il est sur un petit nuage ☁️ et oublie d’attaquer.');
        return;
      }
      if (c == 2) {
        const IT = [
          { k: 'choco', t: '🍕 Part de pizza Mario' },
          { k: 'photo', t: '📸 Photo de lui bébé' },
          { k: 'chaus', t: '🧦 Chaussettes de Noël' }
        ];
        const k = await choose('Quel objet ?', IT.map(x => ({ t: x.t, n: st.it[x.k], dis: !st.it[x.k] })).concat([{ t: '↩️ Retour' }]));
        if (k == 3) continue;
        const x = IT[k];
        st.it[x.k]--;
        if (x.k == 'choco') {
          if (st.it.choco > 0) {
            await say('CÉLESTINE mange une part de PIZZA MARIO 🍕');
            heal('c', 30);
            await say('+30 PV. Comme à Trévoux.');
          } else {
            await say('CÉLESTINE mange une DEUXIÈME part de pizza 🍕');
            heal('c', 30);
            await say('Zéro culpabilité. +30 PV.');
          }
        } else if (x.k == 'photo') {
          await say('CÉLESTINE montre une PHOTO DE LUI BÉBÉ 📸');
          await vbPic('bebe');
          hurt('e', 22);
          st.stun = 1;
          await say('Valentin est trop gêné pour attaquer au prochain tour !');
        } else {
          await say('CÉLESTINE sort des CHAUSSETTES DE NOËL 🧦');
          await say('…Elles sont jolies. C’est tout. Ça ne sert à rien.');
        }
        return;
      }
      if (c == 3) {
        fuite++;
        if (fuite == 1) {
          await say('CÉLESTINE essaie de fuir…');
          await say('Impossible : vous êtes en couple 💍');
        } else {
          await say('CÉLESTINE essaie ENCORE de fuir…');
          await say('Valentin a fermé la porte à clé. 🔐');
        }
        return;
      }
    }
  };
  const VMP = [
    {
      l: ['VALENTIN utilise BLAGUE NULLE !', '« Que fait une fraise sur un cheval ? Tagada, tagada. »', 'C’est très efficace… de nullité.'],
      d: [9, 12]
    },
    { l: ['VALENTIN utilise MAUVAISE FOI !', '« C’est pas moi, c’est le chat ! »', 'Vous n’avez pas de chat.'], d: [10, 13] },
    { l: ['VALENTIN utilise VOL DE COUETTE !', 'Brrr… Célestine a froid.'], d: [12, 15] },
    { l: ['VALENTIN demande : « On mange quoi ce soir ? »', 'Pour la 5ᵉ fois aujourd’hui.'], d: [7, 9] },
    { l: ['VALENTIN utilise RONFLEMENT SONIQUE !', 'Les murs tremblent.'], d: [11, 14] },
    { l: ['VALENTIN joue à la console : « Encore 5 minutes… »', 'Deux heures plus tard… il ne s’est rien passé.'], d: [0, 0] },
    { l: ['VALENTIN utilise REGARD DE CHIEN BATTU 🥺', 'Célestine fond… sa prochaine attaque sera moins forte.'], d: [0, 0], charm: 1 },
    { l: ['VALENTIN utilise MANSPLAINING !', 'Il explique à Célestine ce qu’elle sait déjà.'], d: [10, 12] },
    { l: ['VALENTIN chante faux sous la douche 🎤', 'C’est une attaque sonore. Ça pique.'], d: [9, 13] },
    { l: ['VALENTIN utilise PIEDS FROIDS !', 'Il les glisse sous la couette. Traîtrise.'], d: [10, 13] },
    { l: ['VALENTIN dit : « Je suis pas fâché. »', 'Il est fâché.'], d: [8, 11] },
    { l: ['VALENTIN utilise CÂLIN ÉTOUFFANT !', 'Célestine ne respire plus… mais c’est mignon.'], d: [9, 12] },
    { l: ['VALENTIN laisse traîner une chaussette…', 'Célestine marche dessus. Elle est mouillée. 🤢'], d: [10, 13] },
    { l: ['VALENTIN répond « Hmm » à un long message.', 'Dégâts émotionnels critiques.'], d: [11, 14] },
    { l: ['VALENTIN finit le pot de Nutella…', '…et remet le pot VIDE dans le placard.'], d: [12, 15] },
    { l: ['VALENTIN raconte son rêve en détail.', 'Pendant 20 minutes. Sans pause.'], d: [9, 12] },
    { l: ['VALENTIN met le chauffage à 16 °C.', 'Célestine gèle sur place. 🥶'], d: [10, 12] },
    { l: ['VALENTIN utilise « J’arrive dans 5 min » !', 'Il arrive 45 minutes plus tard.'], d: [11, 13] }
  ];
  let VMQ = shuf(VMP);
  const turnV = async () => {
    if (!alive) return;
    if (st.stun) {
      st.stun = 0;
      await say(STUN[stunI++ % STUN.length]);
      return;
    }
    if (!st.heal && st.e <= st.eM - 120) {
      st.heal = 1;
      await say('VALENTIN se cache sous un plaid et regarde une série…');
      heal('e', 15);
      await say('Il récupère 15 PV.');
      return;
    }
    if (!VMQ.length) VMQ = shuf(VMP);
    const v = VMQ.pop();
    for (const x of v.l) await say(x);
    if (v.charm) st.charm = 1;
    let d = rnd(v.d[0], v.d[1]);
    if (st.pout && d) {
      d = Math.round(d * 0.5);
      await say('Il s’excuse à moitié… dégâts réduits.');
    }
    st.pout = 0;
    if (d) hurt('c', d);
  };
  const PARTS = [
    null,
    { t: '⚔️ Le combat', s: 'Choisis tes attaques et touche au bon moment 💗', m: ['b24', 'b11'] },
    {
      t: '🕺 Duel de rock',
      s: 'Refais ses pas en glissant le doigt · 🙃 = ne bouge pas · INVERSE = glisse dans l’autre sens',
      m: ['b27', 'b24', 'b11']
    },
    { t: '🍕 Les boîtes à pizza', s: 'Suis la boîte qui cache le bracelet pendant le mélange, puis touche-la', m: ['b28', 'b24', 'b11'] },
    { t: '🔒 Le cadenas', s: 'Touche quand le bon chiffre passe sous ▼', m: ['b29', 'b24', 'b11'] }
  ];
  const partStart = async k => {
    try {
      $$('.vb-cover').classList.remove('on');
    } catch (_) {}
    o.dataset.part = k;
    try {
      syncLive({ d: 24, t: '😈 Boss final · Partie ' + k + ' ' + PARTS[k].t, at: Date.now(), boss: 1 });
      slog('😈', `Boss final : partie ${k}/4 (${PARTS[k].t})${test ? ' (test)' : ''}`);
    } catch (_) {}
    if (st.djm && k == 2) {
      const dj = st.djm;
      st.djm = null;
      if (st.djk < 2) {
        try {
          dj.stop();
        } catch (_) {}
        mu = vMusic(PARTS[k].m);
      } else {
        mu = dj;
        if (st.djk < 3)
          try {
            dj.setVol(0.75, 700);
          } catch (_) {}
      }
      st.mk = k;
    }
    if (st.mk !== k) {
      try {
        st.mk === 'd' && mu.pause ? mu.pause() : mu.stop();
      } catch (_) {}
      mu = vMusic(PARTS[k].m);
      st.mk = k;
    }
    st.e = st.eM - 200 * (k - 1);
    st.floor = st.eM - 200 * k;
    hp();
    if (k > 1) {
      const fl = document.createElement('div');
      fl.className = 'vb-flash';
      o.appendChild(fl);
      setTimeout(() => fl.remove(), 900);
      try {
        bkT(90, 0.8, 'sawtooth', 0.07, 300);
      } catch (_) {}
    }
    if (k > 1 && st.c < 70) {
      st.c = 70;
      hp();
    }
    const b = document.createElement('div');
    b.className = 'vb-pban';
    b.innerHTML = `<small>PARTIE ${k} / 4</small><b>${PARTS[k].t}</b><span>${PARTS[k].s}</span>`;
    o.appendChild(b);
    try {
      bkT(520, 0.25, 'triangle', 0.05, 780);
    } catch (_) {}
    await wait(2600);
    b.classList.add('out');
    await wait(350);
    b.remove();
  };
  const pokemon = async () => {
    B.style.display = '';
    for (;;) {
      if (!alive) return;
      st.turn++;
      const r = await turnC();
      if (!alive) return;
      if (st.e <= st.floor) {
        st.e = st.floor;
        hp();
        return 'ok';
      }
      await wait(250);
      await turnV();
      if (!alive) return;
      if (st.c <= 0) return 'lose';
    }
  };
  // volume de la musique pendant les dialogues (emplacement « Combat final · dialogues », b30) : bien audible, mais sous les voix
  const DLGV = 0.11;
  const DJK = () => {
    const a = Array.from({ length: 24 }, (_, i) => String(i + 1));
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a.concat(['b24', 'b11']);
  };
  const LORE = {
    0: {
      sc: 'salon',
      l: [
        ['n', 'Le salon. Le sapin clignote.', { fx: ['cin', 'vin'] }],
        ['v', 'Il est dans ma poche. Il y a un an pile, je te l’offrais… alors ce soir, tu vas le mériter. 😏'],
        ['v', 'Quatre épreuves, rien que nous deux. Gagne-les, et il est à toi.'],
        ['c', 'Tu m’as fait mener une enquête d’un mois… pour un jeu ?!', { fx: 'shake' }],
        ['v', 'Première épreuve : un duel. Ici. Maintenant. 😈', { fx: ['horns', 'shake'] }]
      ]
    },
    2: {
      sc: 'salon',
      l: [
        ['n', 'Valentin est à terre… mais il n’a pas lâché le bracelet.', { fx: ['both', 'down', 'hold'] }],
        ['v', 'Première épreuve pour toi. Mais la suivante, c’est MON terrain…', { fx: 'getup' }],
        ['v', 'On a dansé tellement de rocks, tous les deux… Ce soir, on va enfin savoir qui est le meilleur.'],
        ['n', 'Il attrape la télécommande… clic. 📺', { fx: 'remote' }],
        ['n', 'Les lumières s’éteignent…', { fx: 'dark' }],
        ['n', 'Une boule disco descend du plafond !', { fx: 'ball' }],
        ['n', 'Le salon devient une piste de rock. 🪩', { sc: 'disco', fx: ['both', 'hold'] }],
        ['c', 'Tu me fais tourner, d’accord… mais le style, c’est moi qui l’ai.', { fx: ['dance', 'eyeroll'] }],
        ['v', 'Ce soir, je vais te faire tourner jusqu’à ce que tu demandes grâce. 😎', { fx: ['shades', 'shake'] }],
        ['v', 'Vas-y DJ, lance la musique ! 🎧', { fx: 'dj1' }],
        ['v', 'Non, pas ça ! DJ, mets-nous un rock ! 🙅', { fx: 'dj2' }],
        ['v', 'Vas-y DJ, monte le volume ! 🔊', { fx: 'dj3' }],
        ['n', 'BOUM BOUM BOUM ! Tout l’appartement se met à vibrer. 🪩', { fx: ['shake', 'djnotes', 'dance'] }]
      ]
    },
    3: {
      sc: 'disco',
      l: [
        ['n', 'Valentin s’écroule sur la piste, à bout de souffle.', { fx: ['both', 'down', 'hold'] }],
        ['v', 'Ok… c’est toi la reine du rock. Ça, je le savais déjà.', { fx: 'getup' }],
        ['n', 'DRING ! On sonne à la porte. 🔔', { fx: 'bell' }],
        ['v', 'Pile à l’heure. Tu te souviens des quais de Trévoux ? Le bord de la Saône, nos pizzas…'],
        [
          'n',
          'Les lumières se rallument. Il a tout recréé : une bougie, une nappe à carreaux… et des boîtes de pizza. 🍕',
          { sc: 'pizza', fx: ['both', 'boxes'] }
        ],
        ['c', 'Des pizzas… comme à Trévoux. 🥹', { fx: 'cin' }],
        ['v', 'Sauf que ce soir, le bracelet est caché sous l’une d’elles.', { fx: 'hold' }],
        ['v', 'Je mélange, tu choisis. Et je te préviens : je mélange VITE. 😏', { fx: 'shake' }]
      ]
    },
    4: {
      sc: 'pizza',
      l: [
        ['n', 'Le dernier couvercle se soulève : le bracelet brille sur la nappe ! 💖', { fx: ['both', 'boxes', 'hold'] }],
        ['v', 'Hop ! Pas si vite. 😇', { fx: 'halo' }],
        ['n', 'Il le glisse dans un écrin en velours… et le ferme avec un cadenas à code. 🔒', { fx: ['unhalo', 'ecrin'] }],
        ['v', 'Dernière épreuve. Le code, c’est le jour où tout a commencé entre nous.'],
        ['c', 'Tu crois vraiment que j’ai oublié ? 😤', { fx: 'cin' }],
        ['v', 'Alors prouve-le. Mais attention : le cadran tourne tout seul… et de plus en plus vite. 😏', { fx: 'shake' }]
      ]
    },
    5: {
      sc: 'pizza',
      l: [
        ['n', 'CLIC ! Le cadenas s’ouvre.', { fx: ['both', 'unlock'] }],
        ['v', 'Tu as gagné. Les quatre.'],
        ['v', 'Je ne l’ai pas volé, ton bracelet : je l’ai fait graver. C’était ça, la boutique de Bellecour.'],
        ['v', 'Regarde à l’intérieur. 💖', { fx: 'engrave' }],
        ['n', 'Gravé en lettres fines : « 03.07.2025 ». Le jour où tout a commencé.'],
        ['v', 'Joyeux Noël, Célestine. Je t’aime. 💘', { fx: 'hearts' }]
      ]
    }
  };
  const cut = k =>
    new Promise(res => {
      if (!alive) return res();
      try {
        $$('.vb-cover').classList.add('on');
      } catch (_) {}
      const D = LORE[k];
      {
        const mk = k == 5 ? 'f' : 'd';
        if (st.mk !== mk) {
          try {
            st.mk === 'd' && mu.pause ? mu.pause() : mu.stop();
          } catch (_) {}
          try {
            st.djm && st.djm.stop();
            st.djm = null;
          } catch (_) {}
          for (const x of [...(window.__vmSet || [])])
            if (x.api && x.api !== st.dmu)
              try {
                x.api.stop();
              } catch (_) {}
          if (mk === 'd' && st.dmu && st.dmu.alive()) {
            mu = st.dmu;
            mu.resume();
          } else {
            mu = vMusic(k == 5 ? ['b31', 'b30', 'b26'] : ['b30', 'b26'], k == 5 ? 0 : 'vbd', DLGV, true);
            if (mk === 'd') st.dmu = mu;
          }
          st.mk = mk;
        }
      }
      const c = document.createElement('div');
      c.className = 'vb-cut sc-' + D.sc;
      c.innerHTML = `<div class="vb-cdeco"></div><div class="vb-cfx"></div><img class="vb-cc" src="${VIMG.c}" alt=""><img class="vb-cv vv" src="${VIMG.v}" alt=""><div class="vb-att"></div><span class="vb-choc">💖</span><div class="vb-cfx2"></div><div class="vb-nar"></div><div class="vb-bub"></div><div class="vb-wipe"></div><button class="vb-skip">Passer ⏭</button><div class="vb-tap">👆</div>`;
      o.appendChild(c);
      try {
        CINE.stage(c, D.sc, {});
      } catch (_) {}
      const N = c.querySelector('.vb-nar'),
        BU = c.querySelector('.vb-bub'),
        CC = c.querySelector('.vb-cc'),
        CV = c.querySelector('.vb-cv'),
        FX = c.querySelector('.vb-cfx'),
        FX2 = c.querySelector('.vb-cfx2'),
        AT = c.querySelector('.vb-att'),
        CH = c.querySelector('.vb-choc'),
        WP = c.querySelector('.vb-wipe');
      let i = -1,
        iv = 0,
        typing = false,
        full = '',
        busy = false;
      if (k === 0) {
        CC.classList.add('off-l');
        CV.classList.add('off-r');
      }
      let fin = 0;
      const done = () => {
        if (fin) return;
        fin = 1;
        clearInterval(iv);
        c.classList.add('out');
        setTimeout(() => {
          c.remove();
          res();
        }, 400);
      };
      c.querySelector('.vb-skip').onclick = e => {
        e.stopPropagation();
        done();
      };
      const emo = (t, n, cls) => {
        for (let q = 0; q < n; q++) {
          const e = document.createElement('span');
          e.className = 'vb-cfe ' + (cls || '');
          e.textContent = t;
          e.style.left = 10 + Math.random() * 80 + '%';
          e.style.animationDelay = Math.random() * 0.6 + 's';
          FX2.appendChild(e);
          setTimeout(() => e.remove(), 2600);
        }
      };
      const vr = () => {
        const a = CV.getBoundingClientRect(),
          b = c.getBoundingClientRect();
        return { x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height };
      };
      const atV = (html, cls, fx, fy) => {
        const r = vr(),
          e = document.createElement('span');
        e.className = 'vb-at ' + cls;
        e.innerHTML = html;
        e.style.left = r.x + r.w * fx + 'px';
        e.style.top = r.y + r.h * fy + 'px';
        AT.appendChild(e);
        return e;
      };
      const word = (t, x, y) => {
        const w = document.createElement('span');
        w.className = 'vb-cword';
        w.textContent = t;
        w.style.left = x;
        w.style.top = y;
        FX2.appendChild(w);
        setTimeout(() => w.remove(), 1200);
      };
      const chTo = (x, y, ms) => {
        const b = c.getBoundingClientRect(),
          a = CH.getBoundingClientRect();
        CH.style.transition = `transform ${ms || 600}ms ease-in-out,opacity .3s`;
        CH.style.transform = `translate(${x - (a.left - b.left)}px,${y - (a.top - b.top)}px) rotate(-360deg)`;
      };
      const doFx = f => {
        if (!f) return;
        if (Array.isArray(f)) return f.forEach(doFx);
        try {
          CINE.fx(c, f);
        } catch (_) {}
        const R2 = x => {
          c.classList.remove(x);
          void c.offsetWidth;
          c.classList.add(x);
        };
        const clr = () => {
          AT.innerHTML = '';
        };
        if (f == 'cin') CC.classList.remove('off-l');
        if (f == 'vin') CV.classList.remove('off-r');
        if (f == 'both') {
          CC.classList.remove('off-l', 'gone', 'door');
          CV.classList.remove('off-r', 'gone', 'up', 'fallen', 'hid', 'peek', 'duck');
          c.querySelectorAll('.vb-cfort,.vb-cdoor,.vb-cdj').forEach(e => e.remove());
        }
        if (f == 'hold') {
          CH.classList.remove('gone', 'half');
          CH.style.transform = '';
          CH.classList.add('on');
        }
        if (f == 'shake') R2('shk');
        if (f == 'halo') atV('😇', 'halo', 0.5, -0.12);
        if (f == 'unhalo') AT.querySelectorAll('.halo').forEach(e => e.remove());
        if (f == 'teeth') atV('<i></i><i></i><i></i>', 'teeth', 0.5, 0.74);
        if (f == 'horns') atV('😈', 'horns', 0.5, -0.08);
        if (f == 'down') CV.classList.add('down');
        if (f == 'getup') {
          CV.classList.remove('down');
          CV.classList.add('hop');
          setTimeout(() => CV.classList.remove('hop'), 700);
        }
        if (f == 'remote') {
          const r = vr(),
            e = document.createElement('span');
          e.className = 'vb-remote';
          e.textContent = '📱';
          e.style.left = r.x - 10 + 'px';
          e.style.top = r.y + r.h * 0.55 + 'px';
          FX2.appendChild(e);
          word('CLIC !', r.x - 20 + 'px', r.y + r.h * 0.35 + 'px');
          setTimeout(() => e.remove(), 1400);
        }
        if (f == 'dark') c.classList.add('dark');
        if (f == 'ball') {
          const b = document.createElement('span');
          b.className = 'vb-cball';
          b.textContent = '🪩';
          FX.appendChild(b);
        }
        if (f == 'dance') {
          CV.classList.add('wig');
          setTimeout(() => CV.classList.remove('wig'), 2400);
        }
        if (f == 'eyeroll') {
          CC.classList.add('roll');
          setTimeout(() => CC.classList.remove('roll'), 900);
          const r = CC.getBoundingClientRect(),
            b = c.getBoundingClientRect();
          word('🙄', r.left - b.left + r.width * 0.6 + 'px', r.top - b.top - 10 + 'px');
        }
        if (f == 'shades') atV('🕶️', 'shades', 0.5, 0.38);
        if (f == 'slip') CV.classList.add('slip');
        if (f == 'drop') {
          CH.classList.add('on', 'drop');
          setTimeout(() => CH.classList.remove('drop'), 900);
        }
        if (f == 'panic') atV('💦', 'sweat', 0.9, 0.1);
        if (f == 'vrun') {
          clr();
          CV.classList.add('gone');
          CH.classList.add('gone');
          word('💨', '60%', '55%');
        }
        if (f == 'crun') {
          CC.classList.add('gone');
          word('💨', '20%', '55%');
        }
        if (f == 'behind') {
          clr();
          CV.classList.add('behind');
          CH.classList.remove('on');
          const s = document.createElement('div');
          s.className = 'vb-csofa';
          s.innerHTML = '<i></i><i></i><i></i>';
          FX2.appendChild(s);
        }
        if (f == 'fort') {
          clr();
          CH.classList.remove('on');
          CC.classList.remove('gone', 'off-l');
          CC.classList.add('off-l', 'door');
          CV.classList.remove('off-r', 'gone', 'up', 'fallen', 'behind', 'peek');
          CV.classList.add('hid');
          if (!c.querySelector('.vb-cfort')) {
            const s = document.createElement('div');
            s.className = 'vb-cfort';
            s.innerHTML = '<i></i><i></i><i></i><u></u><u></u>';
            c.appendChild(s);
            const d = document.createElement('div');
            d.className = 'vb-cdoor';
            d.innerHTML = '<i></i>';
            c.insertBefore(d, c.firstChild.nextSibling);
          }
        }
        if (f == 'cdoor') {
          CC.classList.remove('off-l', 'gone');
          CC.classList.add('door');
        }
        if (f == 'peek') {
          CV.classList.remove('duck');
          CV.classList.add('hid', 'peek');
        }
        if (f == 'duck') {
          CV.classList.remove('peek');
          CV.classList.add('duck');
          word('😏', '62%', '46%');
        }
        if (f == 'arsenal') {
          const r = vr();
          ['🧸', '🧦', '🦆', '🥐', '🩴'].forEach((t, q) => {
            const e = document.createElement('span');
            e.className = 'vb-carsn';
            e.textContent = t;
            e.style.left = r.x + r.w * (-0.25 + q * 0.38) + 'px';
            e.style.top = r.y - 30 - (q % 2) * 22 + 'px';
            e.style.animationDelay = q * 0.12 + 's';
            c.appendChild(e);
            setTimeout(() => e.remove(), 5200);
          });
        }
        if (f == 'dj1' || f == 'dj2' || f == 'dj3' || f == 'djnotes') {
          if (!c.querySelector('.vb-cdj')) {
            const d = document.createElement('div');
            d.className = 'vb-cdj';
            d.innerHTML =
              '<span class="dj">🎧</span><span class="desk"><i></i><i></i></span><span class="vol"><i></i><i></i><i></i><i></i><i></i></span>';
            c.appendChild(d);
          }
          const DJ = c.querySelector('.vb-cdj');
          const notes = n => {
            for (let q = 0; q < n; q++) {
              const e = document.createElement('span');
              e.className = 'vb-cnote';
              e.textContent = ['🎵', '🎶', '♪', '♫'][q % 4];
              e.style.left = 18 + Math.random() * 64 + '%';
              e.style.animationDelay = Math.random() * 0.8 + 's';
              c.appendChild(e);
              setTimeout(() => e.remove(), 2800);
            }
          };
          if (f == 'dj1') {
            DJ.classList.add('on');
            DJ.dataset.v = '1';
            try {
              if (st.dmu) st.dmu.pause();
            } catch (_) {}
            try {
              st.djm && st.djm.stop();
            } catch (_) {}
            st.djm = vMusic(DJK(), 0, 0.075);
            st.djk = 1;
            st.mk = 'dj';
            notes(4);
          }
          if (f == 'dj2') {
            DJ.classList.add('on', 'scr');
            setTimeout(() => DJ.classList.remove('scr'), 900);
            DJ.dataset.v = '1';
            word('SCRATCH !', '30%', '40%');
            try {
              bkT(900, 0.35, 'sawtooth', 0.06, 120);
            } catch (_) {}
            try {
              st.djm && st.djm.stop();
            } catch (_) {}
            try {
              if (st.dmu) st.dmu.pause();
            } catch (_) {}
            st.djm = vMusic(PARTS[2].m, 0, 0.075);
            st.djk = 2;
            st.mk = 'dj';
            notes(5);
          }
          if (f == 'dj3') {
            DJ.classList.add('on');
            DJ.dataset.v = '5';
            word('🔊 VOLUME !', '28%', '38%');
            try {
              st.djm && st.djm.setVol(0.75, 1200);
            } catch (_) {}
            st.djk = 3;
            notes(12);
            R2('shk');
          }
          if (f == 'djnotes') notes(DJ.dataset.v == '5' ? 12 : 5);
        }
        if (f == 'pillows') {
          if (c.querySelector('.vb-cfort')) {
            for (let q = 0; q < 5; q++) {
              const p = document.createElement('span');
              p.className = 'vb-cpil fp';
              p.style.left = 40 + q * 12.5 + '%';
              p.style.animationDelay = q * 0.12 + 's';
              c.appendChild(p);
            }
          } else
            for (let q = 0; q < 5; q++) {
              const p = document.createElement('span');
              p.className = 'vb-cpil';
              p.style.left = 18 + q * 14 + '%';
              p.style.animationDelay = q * 0.12 + 's';
              FX2.appendChild(p);
            }
        }
        if (f == 'collapse') {
          c.querySelectorAll('.vb-cpil').forEach((p, q) => {
            p.style.animation = 'none';
            p.classList.add('fall');
            p.style.transform = `translate(${(q - 2) * 40}px,220px) rotate(${(q - 2) * 70}deg)`;
          });
          emo('🪶', 18);
          R2('shk');
        }
        if (f == 'sneeze') {
          CV.classList.add('snz');
          setTimeout(() => CV.classList.remove('snz'), 700);
          atV('💨', 'snz2', 0.1, 0.6);
        }
        if (f == 'vjump') {
          clr();
          c.querySelectorAll('.vb-csofa,.vb-cfort').forEach(e => e.remove());
          CV.classList.remove('behind', 'hid', 'peek', 'duck');
          CV.classList.add('up');
          CH.classList.add('gone');
        }
        if (f == 'pot') {
          if (!FX.querySelector('.vb-cpot')) {
            const p = document.createElement('span');
            p.className = 'vb-cpot';
            p.innerHTML = '<i></i><b>♨️</b>';
            FX.appendChild(p);
          }
        }
        if (f == 'melt') {
          CH.classList.add('on');
          setTimeout(() => {
            const pr = FX.querySelector('.vb-cpot').getBoundingClientRect(),
              b = c.getBoundingClientRect();
            chTo(pr.left - b.left + pr.width * 0.4, pr.top - b.top - 10, 700);
            setTimeout(() => {
              CH.style.opacity = 0;
              word('blop 🫠', pr.left - b.left + pr.width * 0.3 + 'px', pr.top - b.top - 50 + 'px');
            }, 700);
          }, 300);
        }
        if (f == 'rope') {
          if (!FX.querySelector('.vb-crope')) {
            const r = document.createElement('span');
            r.className = 'vb-crope';
            FX.appendChild(r);
          }
        }
        if (f == 'vfall') {
          clr();
          CH.classList.remove('on');
          CV.classList.add('fallen');
          R2('shk');
          emo('💖', 10, 'up');
          word('PLOUF !', '40%', '58%');
        }
        if (f == 'drip') {
          FX.innerHTML = '';
          atV('<i></i><i></i><i></i><i></i>', 'drip', 0.5, 0.95);
        }
        if (f == 'half') {
          CH.classList.add('on', 'half');
          CH.style.opacity = '';
          CH.style.transform = '';
        }
        if (f == 'bell') {
          word('DRING ! 🔔', '30%', '30%');
          R2('shk');
          try {
            CINE.sfx('ding');
            CINE.sfx('ding', 0.25);
          } catch (_) {}
        }
        if (f == 'boxes') {
          FX.querySelectorAll('.vb-cbox').forEach(e => e.remove());
          const bx = document.createElement('span');
          bx.className = 'vb-cbox';
          bx.innerHTML = '<i></i><i></i><i></i>';
          FX.appendChild(bx);
        }
        if (f == 'ecrin') {
          FX.querySelectorAll('.vb-cecr').forEach(e => e.remove());
          const e = document.createElement('span');
          e.className = 'vb-cecr';
          e.innerHTML = '<i></i><b>🔒</b>';
          FX.appendChild(e);
          try {
            bkT(220, 0.12, 'square', 0.05);
          } catch (_) {}
        }
        if (f == 'unlock') {
          if (!FX.querySelector('.vb-cecr')) doFx('ecrin');
          const e = FX.querySelector('.vb-cecr b');
          if (e) e.textContent = '🔓';
          FX.querySelector('.vb-cecr').classList.add('op');
          emo('✨', 12, 'up');
          try {
            bkT(1200, 0.06, 'square', 0.05);
            setTimeout(() => bkT(800, 0.08, 'square', 0.04), 70);
          } catch (_) {}
        }
        if (f == 'candles') {
          if (!FX.querySelector('.vb-ccand')) {
            const cd = document.createElement('span');
            cd.className = 'vb-ccand';
            cd.innerHTML = ['#ff7aa8', '#ffcf4a', '#7fd3ff', '#8ef08a', '#b78bff', '#ff9a5a']
              .map((col, q) => `<i style="--c:${col};animation-delay:${q * 0.35}s"></i>`)
              .join('');
            FX.appendChild(cd);
          }
        }
        if (f == 'lights') {
          c.classList.remove('dark');
          c.classList.add('lit');
          emo('✨', 16, 'up');
        }
        if (f == 'engrave') {
          CH.classList.remove('on');
          const g = document.createElement('div');
          g.className = 'vb-cengr';
          g.innerHTML = BRSVG + '<b>03.07.2025</b><small>gravé à Bellecour</small>';
          FX2.appendChild(g);
          // le vrai bracelet en 3D remplace le dessin dès qu'il est chargé (js/vue-3d.js)
          try {
            v3Gravure(g);
          } catch (_) {}
          emo('✨', 10, 'up');
          try {
            CINE.sfx('magic');
          } catch (_) {}
        }
        if (f == 'hearts') emo('💖', 14, 'up');
        try {
          bkT(f == 'dark' ? 90 : f == 'ball' ? 880 : f == 'remote' ? 1200 : 200, 0.15, 'triangle', 0.04, f == 'ball' ? 440 : 300);
        } catch (_) {}
      };
      const scene = sc =>
        new Promise(r => {
          busy = true;
          WP.className = 'vb-wipe go';
          try {
            bkT(300, 0.35, 'sine', 0.04, 900);
          } catch (_) {}
          setTimeout(() => {
            c.className = c.className.replace(/sc-\w+/, 'sc-' + sc).replace(/\bdark\b/, '');
            FX.innerHTML = '';
            FX2.innerHTML = '';
            AT.innerHTML = '';
            CV.classList.remove('down', 'slip', 'behind', 'wig');
            CH.style.opacity = '';
            CH.style.transform = '';
          }, 380);
          setTimeout(() => {
            WP.className = 'vb-wipe';
            busy = false;
            r();
          }, 800);
        });
      const show = async () => {
        i++;
        if (i >= D.l.length) return done();
        const [w, t, op] = D.l[i];
        full = t;
        N.classList.remove('on');
        BU.classList.remove('on');
        if (op && op.sc) await scene(op.sc);
        if (op) doFx(op.fx);
        CC.classList.toggle('talk', w == 'c');
        CV.classList.toggle('talk', w == 'v' && !CV.classList.contains('down'));
        CC.classList.toggle('dim', w == 'v');
        CV.classList.toggle('dim', w == 'c');
        try {
          CINE.line(c, w, full);
        } catch (_) {}
        const tgt = w == 'n' ? N : BU;
        N.classList.toggle('on', w == 'n');
        BU.className = 'vb-bub' + (w != 'n' ? ' on ' + w : '');
        tgt.textContent = '';
        typing = true;
        let j = 0;
        clearInterval(iv);

        iv = setInterval(() => {
          j++;
          tgt.textContent = full.slice(0, j);
          try {
            CINE.blip(w, j, full[j - 1], c);
          } catch (_) {}
          if (j >= full.length) {
            clearInterval(iv);
            typing = false;
          }
        }, 22);
      };
      c.onclick = () => {
        if (busy) return;
        if (typing) {
          clearInterval(iv);
          typing = false;
          (D.l[i][0] == 'n' ? N : BU).textContent = full;
          return;
        }
        show();
      };
      setTimeout(show, 500);
    });
  window.__vbcut = cut;
  const BRSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" class="vb-brsvg" aria-hidden="true"><defs>\n<linearGradient id="fgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b8"/><stop offset=".45" stop-color="#ffcf4a"/><stop offset="1" stop-color="#b07a12"/></linearGradient>\n<radialGradient id="fpink" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ffd1e2"/><stop offset=".55" stop-color="#ff7aa8"/><stop offset="1" stop-color="#e0457b"/></radialGradient>\n<linearGradient id="fnight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1226"/><stop offset=".65" stop-color="#16233f"/><stop offset="1" stop-color="#2a1830"/></linearGradient>\n<linearGradient id="fkraft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d9a2"/><stop offset="1" stop-color="#d2ad68"/></linearGradient>\n<radialGradient id="flamp" cx="50%" cy="45%" r="50%"><stop offset="0" stop-color="#ffd98a" stop-opacity=".22"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>\n<radialGradient id="flens" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#cfe6ff" stop-opacity=".12"/><stop offset="1" stop-color="#cfe6ff" stop-opacity=".05"/></radialGradient>\n<filter id="fsh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".55"/></filter>\n</defs><g transform="rotate(-4 200 105)"><ellipse cx="350.0" cy="105.0" rx="8.2" ry="4.6" transform="rotate(90.0 350.0 105.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="348.9" cy="112.5" rx="4.6" ry="6.6" transform="rotate(106.4 348.9 112.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="345.6" cy="119.8" rx="8.2" ry="4.6" transform="rotate(120.8 345.6 119.8)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="340.3" cy="127.0" rx="4.6" ry="6.6" transform="rotate(132.5 340.3 127.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="332.8" cy="133.8" rx="8.2" ry="4.6" transform="rotate(141.8 332.8 133.8)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="323.4" cy="140.2" rx="4.6" ry="6.6" transform="rotate(149.1 323.4 140.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="312.3" cy="146.1" rx="8.2" ry="4.6" transform="rotate(155.0 312.3 146.1)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="299.5" cy="151.4" rx="4.6" ry="6.6" transform="rotate(159.9 299.5 151.4)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="285.2" cy="156.0" rx="8.2" ry="4.6" transform="rotate(164.1 285.2 156.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="269.7" cy="159.9" rx="4.6" ry="6.6" transform="rotate(167.8 269.7 159.9)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="253.2" cy="163.0" rx="8.2" ry="4.6" transform="rotate(171.1 253.2 163.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="235.9" cy="165.2" rx="4.6" ry="6.6" transform="rotate(174.2 235.9 165.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="218.1" cy="166.5" rx="8.2" ry="4.6" transform="rotate(177.1 218.1 166.5)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="200.0" cy="167.0" rx="4.6" ry="6.6" transform="rotate(-180.0 200.0 167.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="181.9" cy="166.5" rx="8.2" ry="4.6" transform="rotate(-177.1 181.9 166.5)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="164.1" cy="165.2" rx="4.6" ry="6.6" transform="rotate(-174.2 164.1 165.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="146.8" cy="163.0" rx="8.2" ry="4.6" transform="rotate(-171.1 146.8 163.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="130.3" cy="159.9" rx="4.6" ry="6.6" transform="rotate(-167.8 130.3 159.9)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="114.8" cy="156.0" rx="8.2" ry="4.6" transform="rotate(-164.1 114.8 156.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="100.5" cy="151.4" rx="4.6" ry="6.6" transform="rotate(-159.9 100.5 151.4)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="87.7" cy="146.1" rx="8.2" ry="4.6" transform="rotate(-155.0 87.7 146.1)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="76.6" cy="140.2" rx="4.6" ry="6.6" transform="rotate(-149.1 76.6 140.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="67.2" cy="133.8" rx="8.2" ry="4.6" transform="rotate(-141.8 67.2 133.8)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="59.7" cy="127.0" rx="4.6" ry="6.6" transform="rotate(-132.5 59.7 127.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="54.4" cy="119.8" rx="8.2" ry="4.6" transform="rotate(-120.8 54.4 119.8)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="51.1" cy="112.5" rx="4.6" ry="6.6" transform="rotate(-106.4 51.1 112.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="50.0" cy="105.0" rx="8.2" ry="4.6" transform="rotate(-90.0 50.0 105.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="51.1" cy="97.5" rx="4.6" ry="6.6" transform="rotate(-73.6 51.1 97.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="54.4" cy="90.2" rx="8.2" ry="4.6" transform="rotate(-59.2 54.4 90.2)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="59.7" cy="83.0" rx="4.6" ry="6.6" transform="rotate(-47.5 59.7 83.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="67.2" cy="76.2" rx="8.2" ry="4.6" transform="rotate(-38.2 67.2 76.2)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="76.6" cy="69.8" rx="4.6" ry="6.6" transform="rotate(-30.9 76.6 69.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="87.7" cy="63.9" rx="8.2" ry="4.6" transform="rotate(-25.0 87.7 63.9)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="100.5" cy="58.6" rx="4.6" ry="6.6" transform="rotate(-20.1 100.5 58.6)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="114.8" cy="54.0" rx="8.2" ry="4.6" transform="rotate(-15.9 114.8 54.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="130.3" cy="50.1" rx="4.6" ry="6.6" transform="rotate(-12.2 130.3 50.1)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="146.8" cy="47.0" rx="8.2" ry="4.6" transform="rotate(-8.9 146.8 47.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="164.1" cy="44.8" rx="4.6" ry="6.6" transform="rotate(-5.8 164.1 44.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="181.9" cy="43.5" rx="8.2" ry="4.6" transform="rotate(-2.9 181.9 43.5)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="200.0" cy="43.0" rx="4.6" ry="6.6" transform="rotate(-0.0 200.0 43.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="218.1" cy="43.5" rx="8.2" ry="4.6" transform="rotate(2.9 218.1 43.5)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="235.9" cy="44.8" rx="4.6" ry="6.6" transform="rotate(5.8 235.9 44.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="253.2" cy="47.0" rx="8.2" ry="4.6" transform="rotate(8.9 253.2 47.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="269.7" cy="50.1" rx="4.6" ry="6.6" transform="rotate(12.2 269.7 50.1)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="285.2" cy="54.0" rx="8.2" ry="4.6" transform="rotate(15.9 285.2 54.0)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="299.5" cy="58.6" rx="4.6" ry="6.6" transform="rotate(20.1 299.5 58.6)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="312.3" cy="63.9" rx="8.2" ry="4.6" transform="rotate(25.0 312.3 63.9)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="323.4" cy="69.8" rx="4.6" ry="6.6" transform="rotate(30.9 323.4 69.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="332.8" cy="76.2" rx="8.2" ry="4.6" transform="rotate(38.2 332.8 76.2)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="340.3" cy="83.0" rx="4.6" ry="6.6" transform="rotate(47.5 340.3 83.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="345.6" cy="90.2" rx="8.2" ry="4.6" transform="rotate(59.2 345.6 90.2)" fill="none" stroke="url(#fgold)" stroke-width="3.1"/><ellipse cx="348.9" cy="97.5" rx="4.6" ry="6.6" transform="rotate(73.6 348.9 97.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><circle cx="50.0" cy="105.0" r="8.8" fill="none" stroke="url(#fgold)" stroke-width="3.8"/><g transform="translate(200.0,168.5) rotate(0)"><path d="M0,10.01 C-1.4300000000000002,8.58 -15.730000000000002,-0.5720000000000001 -14.3,-9.152000000000001 C-13.156,-16.588 -3.432,-17.732 0,-9.724000000000002 C3.432,-17.732 13.156,-16.588 14.3,-9.152000000000001 C15.730000000000002,-0.5720000000000001 1.4300000000000002,8.58 0,10.01Z" fill="url(#fpink)" stroke="#b8326a" stroke-width="2.0" stroke-linejoin="round"/><ellipse cx="-5.7" cy="-8.0" rx="2.9" ry="1.7" fill="#fff" opacity=".75" transform="rotate(-30 -5.7 -8.0)"/></g></g></svg>';
  const koFx = async () => {
    const f = document.createElement('div');
    f.className = 'vb-ko';
    f.innerHTML = '<b>K.O.</b>';
    o.appendChild(f);
    try {
      bkT(110, 0.7, 'sawtooth', 0.07, 40);
    } catch (_) {}
    await wait(1300);
    f.classList.add('out');
    await wait(300);
    f.remove();
  };
  const run = async () => {
    await wait(300);
    st.cs = st.cs || {};
    if (st.so) {
      B.style.display = 'none';
      for (const k of [0, 2, 3, 4, 5]) {
        if (!alive) return;
        if (k > 2) await koFx();
        if (k == 5) o.dataset.part = '5';
        else o.dataset.part = String(Math.max(1, k));
        await cut(k);
      }
      if (!alive) return;
      B.style.display = '';
      try {
        $$('.vb-cover').classList.remove('on');
      } catch (_) {}
      M.innerHTML = '<div class="vb-g"><button id="vbL" class="vb-love">💖 Je t’aime aussi</button></div>';
      B.onclick = null;
      T.textContent = 'VALENTIN attend ta réponse…';
      await new Promise(r => {
        $$('#vbL').onclick = e => {
          e.stopPropagation();
          r();
        };
      });
      return win();
    }
    if (!st.intro) {
      st.intro = 1;
      if (st.part == 1) {
        if (window.__vbNoIntro) {
          window.__vbNoIntro = 0;
          st.cs[0] = 1;
        } else {
          B.style.display = 'none';
          await cut(0);
          B.style.display = '';
        }
      }
    }
    while (st.part <= 4) {
      if (!alive) return;
      if (st.part > 1 && !st.cs[st.part]) {
        st.cs[st.part] = 1;
        B.style.display = 'none';
        await cut(st.part);
        if (!alive) return;
      }
      await partStart(st.part);
      if (!alive) return;
      const r = st.part == 1 ? await pokemon() : await phase2(st.part == 2 ? 0 : st.part == 3 ? 1 : 3);
      if (!alive) return;
      if (r == 'lose') {
        B.style.display = '';
        return lose();
      }
      B.style.display = 'none';
      await koFx();
      st.part++;
    }
    if (!alive) return;
    o.dataset.part = '5';
    await cut(5);
    if (!alive) return;
    B.style.display = '';
    try {
      $$('.vb-cover').classList.remove('on');
    } catch (_) {}
    M.innerHTML = '<div class="vb-g"><button id="vbL" class="vb-love">💖 Je t’aime aussi</button></div>';
    B.onclick = null;
    T.textContent = 'VALENTIN attend ta réponse…';
    await new Promise(r => {
      $$('#vbL').onclick = e => {
        e.stopPropagation();
        r();
      };
    });
    return win();
  };
  const phase2 = IDX =>
    new Promise(async RES => {
      const A = $$('.vb-ar'),
        SE = $$('#vbSE'),
        SC = $$('#vbSC');
      SE.style.visibility = 'hidden';
      SC.style.visibility = 'hidden';
      B.style.display = 'none';
      let L = null;
      const fin = v => {
        try {
          L && L.remove();
        } catch (_) {}
        SE.style.visibility = '';
        SC.style.visibility = '';
        SE.classList.remove('vb-rage');
        RES(v);
      };
      const R = () => A.getBoundingClientRect();
      const el = (tag, cls, html, par) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html != null) e.innerHTML = html;
        (par || L).appendChild(e);
        return e;
      };
      const im = (src, cls, par) => {
        const e = el('img', cls, null, par);
        e.src = src;
        e.draggable = false;
        return e;
      };
      const newL = () => {
        try {
          L && L.remove();
        } catch (_) {}
        L = document.createElement('div');
        L.className = 'vb-p2';
        A.appendChild(L);
        return L;
      };
      const bonk = e => {
        e.classList.remove('hit');
        void e.offsetWidth;
        e.classList.add('hit');
      };
      const ouch = (n, av) => {
        st.c -= n;
        hp();
        if (av) bonk(av);
        {
          const v = document.createElement('div');
          v.className = 'vb-vig';
          o.appendChild(v);
          setTimeout(() => v.remove(), 450);
        }
        try {
          bkT(160, 0.18, 'square', 0.05, 90);
        } catch (_) {}
        try {
          navigator.vibrate && navigator.vibrate(60);
        } catch (_) {}
        return st.c <= 0;
      };
      const dmgV = (n, hd) => {
        st.e = Math.max(st.floor, st.e - n);
        hp();
        if (hd) bonk(hd);
        try {
          bkT(300 + Math.random() * 200, 0.1, 'square', 0.05, 140);
        } catch (_) {}
      };

      const PER = 200;
      const dancer = (src, body, cls) => {
        const d = el('div', cls + ' vb-dn2');
        const h = im(src, 'vb-dh', d);
        el('span', 'vb-db', body, d);
        return d;
      };

      const word = (t, cls) => {
        const w = el('div', 'vb-word ' + (cls || ''), t);
        setTimeout(() => w.remove(), 700);
      };
      const rounds = [
        /* 1 — DUEL DE DANSE */
        async () => {
          if (!alive) return;
          newL();
          L.classList.add('p2disco');
          const r = R();
          el('div', 'vb-ball', '🪩');
          el('div', 'vb-spot s1');
          el('div', 'vb-spot s2');
          el('div', 'vb-floor');
          const V = dancer(VIMG.v, '🕺', 'vb-dv vv'),
            C = dancer(VIMG.c, '💃', 'vb-dc'),
            AR = el('div', 'vb-arw'),
            TB = el('div', 'vb-tb', '<i></i>'),
            TI = TB.firstChild,
            CB = el('div', 'vb-combo', '');
          const N = 30,
            per = PER / N;
          let i = 0,
            cur = null,
            sx = 0,
            sy = 0,
            tm = 0,
            combo = 0;
          const OPP = { u: 'd', d: 'u', l: 'r', r: 'l' };
          const DI = [
            ['↑', 'u'],
            ['↓', 'd'],
            ['←', 'l'],
            ['→', 'r']
          ];
          return await new Promise(done => {
            const next = () => {
              if (!alive) return;
              if (i >= N) {
                cur = null;
                return setTimeout(() => done('ok'), 500);
              }
              i++;
              const k = DI[Math.floor(Math.random() * 4)],
                rr = Math.random(),
                fake = i > 2 && rr < 0.2,
                rev = !fake && i > 5 && rr < 0.45,
                win = Math.max(0.72, 1.05 - i * 0.016);
              cur = { dir: rev ? OPP[k[1]] : k[1], fake, rev, t0: performance.now(), win };
              AR.className = 'vb-arw in' + (fake ? ' fk' : rev ? ' rv' : '');
              AR.innerHTML = fake ? '🙃' : rev ? k[0] + '<small>INVERSE</small>' : k[0];
              V.className = 'vb-dv vv vb-dn2 m' + k[1];
              TI.style.transition = 'none';
              TI.style.width = '100%';
              void TI.offsetWidth;
              TI.style.transition = `width ${win}s linear`;
              TI.style.width = '0%';
              try {
                bkT(fake ? 330 : 660, 0.08, 'square', 0.05);
              } catch (_) {}
              clearTimeout(tm);
              tm = setTimeout(() => {
                if (cur && cur.t0) res(null);
              }, win * 1000);
            };
            const res = d => {
              if (!cur || !alive) return;
              const c = cur;
              cur = null;
              clearTimeout(tm);
              const ok = c.fake ? d == null : d == c.dir;
              AR.className = 'vb-arw ' + (ok ? 'ok' : 'ko');
              if (ok) {
                combo++;
                dmgV(per, V);
                C.className = 'vb-dc vb-dn2 m' + (d || 'u');
                word(c.fake ? 'Bien vu 😎' : ['Joli ✨', 'Stylé 💅', 'Wow 🔥', 'Diva 👑'][combo % 4], 'g');
                CB.textContent = combo > 1 ? '×' + combo + ' 🔥' : '';
                try {
                  SFX('ok');
                } catch (_) {}
              } else {
                combo = 0;
                CB.textContent = '';
                word(c.fake ? 'Piégée 😝' : 'Raté 😝', 'b');
                if (ouch(8, C)) {
                  return done('lose');
                }
                try {
                  SFX('bad');
                } catch (_) {}
              }
              setTimeout(next, 420);
            };
            L.addEventListener('pointerdown', e => {
              e.preventDefault();
              sx = e.clientX;
              sy = e.clientY;
            });
            L.addEventListener('pointerup', e => {
              const dx = e.clientX - sx,
                dy = e.clientY - sy;
              if (Math.hypot(dx, dy) < 28) return;
              res(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : dy > 0 ? 'd' : 'u');
            });
            const kd = e => {
              const m = { ArrowUp: 'u', ArrowDown: 'd', ArrowLeft: 'l', ArrowRight: 'r' }[e.key];
              if (m && document.body.contains(L)) {
                e.preventDefault();
                res(m);
              }
            };
            document.addEventListener('keydown', kd);
            const _d = done;
            done = v => {
              document.removeEventListener('keydown', kd);
              clearTimeout(tm);
              _d(v);
            };
            setTimeout(next, 700);
          });
        },
        /* 3 — LES BOÎTES À PIZZA (souvenir : la première pizza) */
        async () => {
          if (!alive) return;
          newL();
          L.classList.add('p2pizza');
          const r = R(),
            W = r.width,
            H = r.height,
            y0 = H * 0.64,
            need = 3;
          const V = im(VIMG.v, 'vb-pzv vv'),
            SP = el('div', 'vb-pzsay', ''),
            MSG = el('div', 'vb-pzmsg', ''),
            BR = el('div', 'vb-pzbr', BRSVG),
            SH = el('div', 'vb-pzsh');
          const say = t => {
            SP.textContent = t;
            SP.classList.remove('on');
            void SP.offsetWidth;
            SP.classList.add('on');
          };
          const msg = t => {
            MSG.innerHTML = t;
            MSG.classList.remove('on');
            void MSG.offsetWidth;
            MSG.classList.add('on');
          };
          const sleep = ms => new Promise(q => setTimeout(q, ms));
          const spark = (x, y, n, t) => {
            for (let q = 0; q < (n || 12); q++) {
              const e = el('span', 'vb-spk', t || ['✨', '💖', '⭐'][q % 3]);
              e.style.left = x + 'px';
              e.style.top = y + 'px';
              const a = Math.random() * 6.28,
                d = 40 + Math.random() * 60;
              e.style.setProperty('--x', Math.cos(a) * d + 'px');
              e.style.setProperty('--y', Math.sin(a) * d + 'px');
              setTimeout(() => e.remove(), 1000);
            }
          };
          const JUNK = [
            ['🫒', 'Une olive. Juste une olive.'],
            ['🍄', 'Un champignon !'],
            ['🧀', 'Du fromage… et rien d’autre.'],
            ['🌶️', 'Un piment ! 🔥'],
            ['🍕', 'Une part toute froide…']
          ];
          let hits = 0,
            round = 0,
            stop = false;
          return await new Promise(async done => {
            const end = v => {
              if (stop) return;
              stop = true;
              setTimeout(() => done(v), v == 'ok' ? 900 : 300);
            };
            while (!stop && alive) {
              const n = round < 2 ? 3 : 4,
                bw = Math.min(W * (n == 3 ? 0.25 : 0.2), 100),
                gp = (W - bw * n) / (n + 1),
                sx = q => gp + q * (bw + gp);
              L.querySelectorAll('.vb-pzb,.vb-pzjunk').forEach(e => e.remove());
              BR.classList.remove('on');
              const B = [];
              for (let q = 0; q < n; q++) {
                const bx = el('div', 'vb-pzb in', '<u></u><i class="lg">PIZZA<small>MARIO</small></i>');
                bx.style.width = bx.style.height = bw + 'px';
                bx.style.left = sx(q) + 'px';
                bx.style.top = y0 - bw / 2 + 'px';
                bx.style.animationDelay = q * 0.08 + 's';
                bx.style.setProperty('--dur', '.4s');
                B.push(bx);
              }
              SH.style.top = y0 + bw * 0.38 + 'px';
              const prize = Math.floor(Math.random() * n),
                slot = B.map((_, q) => q);
              const putBr = bx => {
                BR.style.width = bw * 0.92 + 'px';
                BR.style.left = parseFloat(bx.style.left) + bw * 0.04 + 'px';
                BR.style.top = y0 - bw * 0.22 + 'px';
              };
              msg(`🍕 Boîte ${hits + 1}/${need} · Regarde bien… 👀`);
              say(
                [
                  'Le bracelet est ici. Regarde bien…',
                  'Facile, celle-là. 😇',
                  'Une boîte de plus. 😏',
                  'Ça se corse…',
                  'Quatre boîtes. Bonne chance !',
                  'Dernière chance…'
                ][Math.min(5, round)]
              );
              await sleep(700);
              if (stop || !alive) return;
              putBr(B[prize]);
              BR.classList.add('on');
              B[prize].classList.add('open');
              spark(parseFloat(B[prize].style.left) + bw / 2, y0, 6, '✨');
              await sleep(1200);
              B[prize].classList.remove('open');
              await sleep(420);
              BR.classList.remove('on');
              const sw = Math.min(7, 4 + round),
                dur = Math.max(0.42, 0.62 - round * 0.04);
              B.forEach(q => q.style.setProperty('--dur', dur + 's'));
              V.classList.add('mix');
              for (let k = 0; k < sw && !stop && alive; k++) {
                const ix = [...Array(n).keys()].sort(() => Math.random() - 0.5),
                  pairs = [[ix[0], ix[1]]];
                for (const [a, c] of pairs) {
                  const ba = B[a],
                    bc = B[c],
                    sa = slot[a],
                    sc = slot[c];
                  slot[a] = sc;
                  slot[c] = sa;
                  ba.style.left = sx(sc) + 'px';
                  bc.style.left = sx(sa) + 'px';
                  ba.classList.add('up');
                  bc.classList.add('dn');
                  setTimeout(() => {
                    ba.classList.remove('up');
                    bc.classList.remove('dn');
                  }, dur * 1000);
                }
                try {
                  bkT(260 + Math.random() * 160, 0.05, 'triangle', 0.03);
                } catch (_) {}
                if (k == Math.floor(sw / 2) && round >= 1)
                  say(
                    ['Je mélange comme un pro 🃏', 'Tu suis toujours ?', 'Plus vite ! 🌀', 'Hop, hop, hop !', 'Tu as cligné des yeux ? 😏'][
                      round % 5
                    ]
                  );
                await sleep(dur * 1000 + 70);
              }
              V.classList.remove('mix');
              if (stop || !alive) return;
              msg('Où est le bracelet ? Touche une boîte 👆');
              say('Alors ? Laquelle ? 😇');
              B.forEach(q => q.classList.add('pick'));
              const pick = await new Promise(res => {
                B.forEach(
                  (bx, q) =>
                    (bx.onpointerdown = e => {
                      e.preventDefault();
                      e.stopPropagation();
                      B.forEach(z => {
                        z.onpointerdown = null;
                        z.classList.remove('pick');
                      });
                      res(q);
                    })
                );
              });
              if (stop || !alive) return;
              const pb = B[pick],
                px = parseFloat(pb.style.left) + bw / 2;
              if (pick == prize) {
                putBr(pb);
                BR.classList.add('on');
                pb.classList.add('open');
                hits++;
                dmgV(PER / need, V);
                spark(px, y0, 16);
                word(['TROUVÉ !', 'BIEN VU !', 'EXACT !', 'BINGO !', 'IMPARABLE !'][hits % 5], 'g');
                say(
                  ['Pfff… coup de chance.', 'Ok. Pas mal. 😒', 'Tu triches, c’est ça ?', 'Mais comment ?!', 'Bon… tu m’as eu. 🥲'][
                    Math.min(4, hits - 1)
                  ]
                );
                try {
                  bkT(660, 0.12, 'triangle', 0.06);
                  setTimeout(() => bkT(990, 0.2, 'triangle', 0.06), 110);
                } catch (_) {}
              } else {
                const j = JUNK[Math.floor(Math.random() * JUNK.length)],
                  ju = el('span', 'vb-pzjunk', j[0]);
                ju.style.left = px + 'px';
                ju.style.top = y0 + 'px';
                pb.classList.add('open');
                word(j[1], 'b');
                say('Raté ! 😈');
                await sleep(650);
                putBr(B[prize]);
                BR.classList.add('on');
                B[prize].classList.add('open');
                if (ouch(22, null)) return end('lose');
              }
              await sleep(1500);
              if (stop || !alive) return;
              B.forEach(q => q.classList.remove('open'));
              BR.classList.remove('on');
              round++;
              if (hits >= need) {
                msg('💖 Le bracelet est à toi… pour l’instant !');
                return end('ok');
              }
              await sleep(350);
            }
          });
        },
        null,
        /* 4 — LE CADENAS DU 3 JUILLET (le code = la date où tout a commencé) */
        async () => {
          if (!alive) return;
          newL();
          L.classList.add('p2lock');
          const r = R(),
            W = r.width,
            H = r.height,
            CODE = '03072025',
            need = CODE.length,
            DPR = Math.min(2, window.devicePixelRatio || 1);
          const V = im(VIMG.v, 'vb-pzv vv'),
            SP = el('div', 'vb-pzsay', ''),
            MSG = el('div', 'vb-pzmsg', ''),
            PL = el('div', 'vb-lkplate', ''),
            BR = el('div', 'vb-pzbr vb-lkbr', BRSVG);
          const cv = el('canvas', 'vb-lkcv');
          cv.width = W * DPR;
          cv.height = H * DPR;
          cv.style.width = W + 'px';
          cv.style.height = H + 'px';
          const x = cv.getContext('2d');
          x.scale(DPR, DPR);
          const say = t => {
            SP.textContent = t;
            SP.classList.remove('on');
            void SP.offsetWidth;
            SP.classList.add('on');
          };
          const msg = t => {
            MSG.innerHTML = t;
            MSG.classList.remove('on');
            void MSG.offsetWidth;
            MSG.classList.add('on');
          };
          const spark = (px, py, n, t) => {
            for (let q = 0; q < (n || 12); q++) {
              const e = el('span', 'vb-spk', t || ['✨', '💖', '⭐'][q % 3]);
              e.style.left = px + 'px';
              e.style.top = py + 'px';
              const a = Math.random() * 6.28,
                d = 40 + Math.random() * 70;
              e.style.setProperty('--x', Math.cos(a) * d + 'px');
              e.style.setProperty('--y', Math.sin(a) * d + 'px');
              setTimeout(() => e.remove(), 1000);
            }
          };
          const RID = [
            'Le jour où tout a commencé… Premier chiffre ?',
            'Le jour… deuxième chiffre ?',
            'Le mois, maintenant. ☀️',
            'Le mois… celui de l’été.',
            'L’année. Premier chiffre.',
            'L’année…',
            'L’année… presque !',
            'Dernier chiffre. Pour nous. 💖'
          ];
          const cx = W / 2,
            cy = H * 0.63,
            RD = Math.min(W * 0.28, 100);
          let k = 0,
            rot = Math.random() * 360,
            tl = 0,
            hint = {},
            stop = false,
            open = 0,
            flash = 0,
            flashOk = 0,
            last = performance.now(),
            busy = 0;
          const plate = () => {
            PL.innerHTML = [...CODE]
              .map(
                (d, i) =>
                  `${i == 2 || i == 4 ? '<em>.</em>' : ''}<b class="${i < k ? 'ok' : i == k ? 'cur' : ''}">${i < k ? d : hint[i] ? `<s>${d}</s>` : i == k ? '?' : '•'}</b>`
              )
              .join('');
          };
          // (simplifié : le cadran tourne doucement, toujours à la même allure, et la zone du bon chiffre est large)
          const spd = () => (62 + k * 5) * (k % 2 ? -1 : 1);
          const tol = () => 15;

          plate();
          msg(`🔒 Chiffre 1/${need} · touche sous ▼`);
          say(RID[0]);
          return await new Promise(done => {
            const end = v => {
              if (stop) return;
              stop = true;
              setTimeout(() => done(v), v == 'ok' ? 1600 : 300);
            };
            const hit = () => {
              if (stop || busy || !alive) return;
              const tg = +CODE[k],
                d = ((((tg * 36 + rot) % 360) + 540) % 360) - 180;
              if (Math.abs(d) < tol()) {
                rot -= d;
                k++;
                flash = 1;
                flashOk = 1;
                tl = 0;
                dmgV(PER / need, V);
                try {
                  bkT(1200, 0.05, 'square', 0.05);
                  setTimeout(() => bkT(800, 0.06, 'square', 0.04), 60);
                } catch (_) {}
                spark(cx, cy - RD - 6, 6, '✨');
                plate();
                if (k >= need) {
                  busy = 1;
                  msg('🔓 CLIC ! Le cadenas s’ouvre…');
                  say('…Tu t’en souvenais. 🥹');
                  const t0 = performance.now();
                  const up = () => {
                    open = Math.min(1, (performance.now() - t0) / 700);
                    if (open < 1) requestAnimationFrame(up);
                    else {
                      BR.style.width = RD * 1.6 + 'px';
                      BR.style.left = cx - RD * 0.8 + 'px';
                      BR.style.top = cy - RD * 2.35 + 'px';
                      BR.classList.add('on');
                      spark(cx, cy - RD * 1.8, 24);
                      word('03.07.2025 💖', 'g');
                    }
                  };
                  up();
                  try {
                    bkT(523, 0.15, 'triangle', 0.06);
                    setTimeout(() => bkT(659, 0.15, 'triangle', 0.06), 130);
                    setTimeout(() => bkT(784, 0.35, 'triangle', 0.06), 260);
                  } catch (_) {}
                  return end('ok');
                }
                msg(`🔒 Chiffre ${k + 1}/${need} ${k % 2 ? '↺' : '↻'}`);
                say(RID[k]);
                if (k == 4)
                  setTimeout(() => {
                    if (!stop) say('Je souffle un peu sur le cadran… 😗');
                  }, 1600);
              } else {
                flash = 1;
                flashOk = 0;
                hint[k] = 1;
                plate();
                word(['Clac ! Mauvais chiffre', 'Non, pas celui-là !', 'Raté ! 🔒'][Math.floor(Math.random() * 3)], 'b');
                say(
                  ['Tu as oublié notre date ?! 😱', 'Hmm… réfléchis bien. 😏', 'Je t’ai mis un indice sur la plaque.'][
                    Math.floor(Math.random() * 3)
                  ]
                );
                busy = 1;
                setTimeout(() => (busy = 0), 450);
                tl = 0;
                if (ouch(10, null)) return end('lose');
              }
            };
            cv.onpointerdown = e => {
              e.preventDefault();
              e.stopPropagation();
              hit();
            };
            window.__lk = () => ({ rot, k, tol: tol() });
            const draw = () => {
              x.clearRect(0, 0, W, H);
              // écrin en velours (couvercle ouvert derrière)
              const ew = RD * 2.9,
                eh = RD * 1.35,
                ex = cx - ew / 2,
                ey = cy + RD * 0.35;
              let g = x.createLinearGradient(0, ey - eh * 1.15, 0, ey);
              g.addColorStop(0, '#7a1426');
              g.addColorStop(1, '#4a0a16');
              x.fillStyle = g;
              x.beginPath();
              x.roundRect(ex + ew * 0.04, ey - eh * 1.1, ew * 0.92, eh * 1.1, [18, 18, 4, 4]);
              x.fill();
              x.strokeStyle = '#e8c46a';
              x.lineWidth = 2;
              x.beginPath();
              x.roundRect(ex + ew * 0.08, ey - eh * 1.04, ew * 0.84, eh * 0.98, [14, 14, 2, 2]);
              x.stroke();
              g = x.createRadialGradient(cx, ey - eh * 0.55, 10, cx, ey - eh * 0.55, ew * 0.5);
              g.addColorStop(0, '#c22a48');
              g.addColorStop(1, '#6a0e20');
              x.fillStyle = g;
              x.beginPath();
              x.roundRect(ex + ew * 0.1, ey - eh, ew * 0.8, eh * 0.9, 12);
              x.fill();
              g = x.createLinearGradient(0, ey, 0, ey + eh);
              g.addColorStop(0, '#8e1a30');
              g.addColorStop(1, '#3e0812');
              x.fillStyle = g;
              x.beginPath();
              x.roundRect(ex, ey, ew, eh, [6, 6, 16, 16]);
              x.fill();
              x.fillStyle = '#e8c46a';
              x.fillRect(ex, ey + 4, ew, 3);
              x.fillStyle = '#0004';
              x.beginPath();
              x.ellipse(cx, ey + eh + 8, ew * 0.52, 10, 0, 0, 7);
              x.fill();
              // anse du cadenas
              const sh = open * RD * 0.55,
                aw = RD * 0.62,
                ay = cy - RD * 1.05 - sh;
              x.save();
              x.lineCap = 'round';
              x.lineWidth = RD * 0.2;
              g = x.createLinearGradient(cx - aw, 0, cx + aw, 0);
              g.addColorStop(0, '#8a8f99');
              g.addColorStop(0.5, '#eef1f6');
              g.addColorStop(1, '#7a7f89');
              x.strokeStyle = g;
              x.beginPath();
              x.moveTo(cx - aw, cy - RD * 0.55 - sh * (open > 0 ? 1 : 0));
              x.lineTo(cx - aw, ay);
              x.arc(cx, ay, aw, Math.PI, 0);
              x.lineTo(cx + aw, cy - RD * 0.55);
              x.stroke();
              x.restore();
              // corps en laiton
              const bw = RD * 2.25,
                bh = RD * 2.05,
                bx = cx - bw / 2,
                by = cy - RD * 0.95;
              x.save();
              x.shadowColor = '#000a';
              x.shadowBlur = 22;
              x.shadowOffsetY = 10;
              g = x.createLinearGradient(bx, by, bx + bw, by + bh);
              g.addColorStop(0, '#fff0b0');
              g.addColorStop(0.35, '#e8b63e');
              g.addColorStop(0.7, '#b07a18');
              g.addColorStop(1, '#7a5210');
              x.fillStyle = g;
              x.beginPath();
              x.roundRect(bx, by, bw, bh, RD * 0.28);
              x.fill();
              x.restore();
              x.strokeStyle = '#fff4c055';
              x.lineWidth = 3;
              x.beginPath();
              x.roundRect(bx + 5, by + 5, bw - 10, bh - 10, RD * 0.24);
              x.stroke();
              for (const [px, py] of [
                [bx + 14, by + 14],
                [bx + bw - 14, by + 14],
                [bx + 14, by + bh - 14],
                [bx + bw - 14, by + bh - 14]
              ]) {
                x.fillStyle = '#7a5210';
                x.beginPath();
                x.arc(px, py, 4, 0, 7);
                x.fill();
                x.fillStyle = '#fff0b0';
                x.beginPath();
                x.arc(px - 1, py - 1, 1.6, 0, 7);
                x.fill();
              }
              // cadran
              g = x.createRadialGradient(cx - RD * 0.2, cy - RD * 0.25, 4, cx, cy, RD * 0.88);
              g.addColorStop(0, '#3a3f4c');
              g.addColorStop(1, '#101218');
              x.fillStyle = g;
              x.beginPath();
              x.arc(cx, cy, RD * 0.86, 0, 7);
              x.fill();
              x.lineWidth = 5;
              g = x.createLinearGradient(cx - RD, cy - RD, cx + RD, cy + RD);
              g.addColorStop(0, '#fff0b0');
              g.addColorStop(1, '#8a5e14');
              x.strokeStyle = g;
              x.beginPath();
              x.arc(cx, cy, RD * 0.86, 0, 7);
              x.stroke();
              const hk = hint[k] && k < need ? +CODE[k] : -1;
              for (let t2 = 0; t2 < 50; t2++) {
                const a = ((t2 * 7.2 + rot) * Math.PI) / 180,
                  r1 = RD * 0.8,
                  r2 = t2 % 5 ? RD * 0.74 : RD * 0.69;
                x.strokeStyle = t2 % 5 ? '#8a90a0' : '#e8ecf4';
                x.lineWidth = t2 % 5 ? 1 : 2;
                x.beginPath();
                x.moveTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1);
                x.lineTo(cx + Math.sin(a) * r2, cy - Math.cos(a) * r2);
                x.stroke();
              }
              for (let n = 0; n < 10; n++) {
                const a = ((n * 36 + rot) * Math.PI) / 180,
                  rr = RD * 0.53;
                x.save();
                x.translate(cx + Math.sin(a) * rr, cy - Math.cos(a) * rr);
                x.rotate(a);
                if (n == hk) {
                  x.fillStyle = '#ffd76a44';
                  x.beginPath();
                  x.arc(0, 0, RD * 0.15, 0, 7);
                  x.fill();
                }
                x.font = `900 ${Math.round(RD * 0.2)}px system-ui`;
                x.textAlign = 'center';
                x.textBaseline = 'middle';
                x.fillStyle = n == hk ? '#ffd76a' : '#f4f6fb';
                x.fillText(String(n), 0, 1);
                x.restore();
              }
              g = x.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, RD * 0.26);
              g.addColorStop(0, '#fff0b0');
              g.addColorStop(1, '#9a6a14');
              x.fillStyle = g;
              x.beginPath();
              x.arc(cx, cy, RD * 0.24, 0, 7);
              x.fill();
              x.font = `${Math.round(RD * 0.22)}px system-ui`;
              x.textAlign = 'center';
              x.textBaseline = 'middle';
              x.fillStyle = '#000';
              x.fillText('💗', cx, cy + 1);
              // repère + fenêtre de tolérance
              const tw = (tol() * Math.PI) / 180;
              x.strokeStyle = flash ? (flashOk ? '#53e08a' : '#ff4d6d') : '#ffd76a99';
              x.lineWidth = 6;
              x.lineCap = 'round';
              x.beginPath();
              x.arc(cx, cy, RD * 0.92, -Math.PI / 2 - tw, -Math.PI / 2 + tw);
              x.stroke();
              x.fillStyle = flash ? (flashOk ? '#53e08a' : '#ff4d6d') : '#ff4d6d';
              x.beginPath();
              x.moveTo(cx, cy - RD * 0.88);
              x.lineTo(cx - 11, cy - RD * 1.06);
              x.lineTo(cx + 11, cy - RD * 1.06);
              x.fill();
              // chrono du chiffre
              if (k < need && !busy) {
                const f = Math.max(0, 1 - tl / 15);
                x.fillStyle = '#0006';
                x.beginPath();
                x.roundRect(cx - RD, cy + RD * 1.25, RD * 2, 8, 4);
                x.fill();
                x.fillStyle = f < 0.3 ? '#ff4d6d' : '#ffd76a';
                x.beginPath();
                x.roundRect(cx - RD, cy + RD * 1.25, RD * 2 * f, 8, 4);
                x.fill();
              }
            };
            const loop = now => {
              if (stop && open >= 1) {
                draw();
                return;
              }
              if (!alive) return;
              const dt = Math.min(0.05, (now - last) / 1000);
              last = now;
              flash = Math.max(0, flash - dt * 3);
              if (k < need && !busy) {
                rot += spd() * dt;
                tl += dt;
                if (tl > 15) {
                  tl = 0;
                  hint[k] = 1;
                  plate();
                  word('⏱️ Trop lent !', 'b');
                  say('Tic-tac… 😏');
                  if (ouch(8, null)) {
                    end('lose');
                    return;
                  }
                }
              }
              draw();
              if (!stop || open < 1) requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
          });
        }
      ];
      const v = await rounds[IDX]();
      if (!alive) return;
      fin(v == 'lose' ? 'lose' : 'ok');
    });
  const lose = async () => {
    try {
      slog('💀', `Perd la partie ${st.part}/4 du boss final`);
    } catch (_) {}
    B.style.display = 'none';
    {
      const TA =
        [
          '',
          'Valentin garde le bracelet… et fait la danse de la victoire.',
          'Valentin est sacré roi du dancefloor. 👑',
          'Le bracelet était sous l’autre boîte… Valentin mange ta part de pizza. 🍕',
          'Le cadenas reste fermé… Valentin garde le code et le bracelet. 🔒'
        ][st.part] || '';
      const f = document.createElement('div');
      f.className = 'vb-lose';
      f.innerHTML = `<div class="vb-lconf"></div><img class="vb-lc" src="${VIMG.c}" alt=""><div class="vb-ldn"><img class="vv" src="${VIMG.v}" alt=""><span>🕺</span></div><b class="vb-lt">PERDU…</b><p>${esc(TA)}</p><button class="vb-lgo">Continuer</button>`;
      o.appendChild(f);
      const cf = f.querySelector('.vb-lconf');
      for (let i = 0; i < 18; i++) {
        const e = document.createElement('span');
        e.textContent = ['😜', '💖', '🎉', '😈'][i % 4];
        e.style.left = Math.random() * 100 + '%';
        e.style.animationDelay = Math.random() * 1.5 + 's';
        cf.appendChild(e);
      }
      try {
        bkT(392, 0.18, 'square', 0.05);
        setTimeout(() => bkT(330, 0.18, 'square', 0.05), 200);
        setTimeout(() => bkT(262, 0.5, 'square', 0.05), 400);
      } catch (_) {}
      await new Promise(r => {
        f.querySelector('.vb-lgo').onclick = e => {
          e.stopPropagation();
          r();
        };
      });
      f.remove();
      B.style.display = '';
    }
    await say('Elle va bouder 5 minutes… puis revenir plus forte. 😤');
    try {
      slog('😈', 'Perd contre le boss final');
    } catch (_) {}
    M.innerHTML = `<div class="vb-g"><button id="vbR">🔁 Recommencer</button><button class="alt" id="vbQ">Quitter</button></div>`;
    B.onclick = null;
    $$('#vbR').textContent = '🔁 Recommencer la partie ' + st.part;
    $$('#vbR').onclick = e => {
      e.stopPropagation();
      B.style.display = '';
      Object.assign(st, {
        e: st.eM - 200 * (st.part - 1),
        c: 100,
        it: { choco: 2, photo: 1, chaus: 1 },
        stun: 0,
        charm: 0,
        pout: 0,
        ult: 0,
        heal: 0,
        msg: 1
      });
      hp();
      run();
    };
    $$('#vbQ').onclick = e => {
      e.stopPropagation();
      quit();
    };
  };
  const win = async () => {
    hurt('e', st.e + 5);
    await say("C'EST SUPER EFFICACE !!!");
    await say('VALENTIN est vaincu… par amour 💘');
    const sp = $$('#vbSE'),
      im = sp.querySelector('img'),
      r = im.getBoundingClientRect(),
      sr = sp.getBoundingClientRect(),
      N = 5;
    im.style.visibility = 'hidden';
    try {
      bkT(120, 1, 'sawtooth', 0.06, 40);
      setTimeout(() => bkT(180, 0.6, 'square', 0.07, 40), 300);
    } catch (_) {}
    for (let i = 0; i < N * N; i++) {
      const p = document.createElement('i');
      p.className = 'vb-sh';
      const w = r.width / N,
        h = r.height / N,
        x = i % N,
        y = Math.floor(i / N);
      p.style.cssText = `left:${r.left - sr.left + x * w}px;top:${r.top - sr.top + y * h}px;width:${w}px;height:${h}px;background-image:url(${VIMG.v});background-size:${r.width}px ${r.height}px;background-position:${-x * w}px ${-y * h}px`;
      sp.appendChild(p);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          p.style.transform = `translate(${(x - N / 2 + 0.5) * 70 + (Math.random() - 0.5) * 90}px,${(y - N / 2 + 0.5) * 70 + (Math.random() - 0.5) * 90 - 40}px) rotate(${(Math.random() - 0.5) * 720}deg) scale(.4)`;
          p.style.opacity = 0;
        })
      );
    }
    try {
      confetti();
    } catch (_) {}
    if (!st.so) {
      if (!S.vbDone) window.__vbVid = vidN(); // pour savoir si le boss final débloque une nouvelle vidéo
      S.vbDone = Date.now();
      save();
      try {
        snowCount();
      } catch (_) {}
      try {
        syncLive(null);
        syncState();
      } catch (_) {}
      try {
        ACH('bossV');
      } catch (_) {}
      try {
        slog('💘', 'A battu le boss final Valentin !');
      } catch (_) {}
    }
    await wait(1800);
    if (!alive) return;
    alive = false;
    o.classList.add('out');
    mu.stop();
    try {
      st.dmu && st.dmu.stop();
    } catch (_) {}
    setTimeout(() => {
      o.remove();
      document.documentElement.classList.remove('gl');
      vCredits();
    }, 700);
  };
  run();
}
function vcMus() {
  const out = [];
  const ks = [
    ...Array.from({ length: 24 }, (_, i) => String(i + 1)),
    'b30',
    'b26',
    'b27',
    'b28',
    'b29',
    'b31',
    'b25',
    'b24',
    'b11',
    'b10',
    'b12',
    'b13',
    'b14',
    'b15',
    'b16',
    'b17',
    'b18',
    'b19',
    'b20',
    'b21',
    'b22',
    'b23'
  ];
  const seen = new Set();
  for (const k of ks) {
    let f = '';
    try {
      f = YTM.name(k);
    } catch (_) {}
    if (!f) continue;
    let r;
    try {
      r = songName(f);
    } catch (_) {
      r = { t: f, a: '' };
    }
    const line = (r.t || f) + (r.a ? ' — ' + r.a : '');
    if (seen.has(line)) continue;
    seen.add(line);
    out.push(['p', (/^\d+$/.test(k) ? 'Jour ' + k + ' · ' : '') + line]);
  }
  if (!out.length) out.push(['p', 'Les 24 chansons du calendrier'], ['p', 'et les musiques originales de l’enquête']);
  return out;
}
function vcCard(t) {
  const [id, n, r] = t.split('|');
  let pic = '';
  try {
    const x = id == 'celestine' ? { img: 'c' } : SUSP.find(z => z.id == id);
    if (x) {
      const u = x.img == 'c' ? VIMG.c : susSrc(x);
      if (u) pic = `<img src="${u}" alt="">`;
    }
  } catch (_) {}
  if (!pic) pic = `<i>${esc(/^[a-z]+$/.test(id) ? n[0] : id)}</i>`;
  return `<div class="vc-c"><div class="vc-cp">${pic}</div><b>${esc(n)}</b><small>${esc(r)}</small></div>`;
}
function vCredits() {
  if (document.getElementById('vcr')) return;
  const mu = vMusic(['b25', 'b11', 'b24']);
  const D = Object.values(S.days || {}),
    won = D.filter(x => x && x.done && !x.lost).length,
    eggs = (() => {
      try {
        return achEggs();
      } catch (_) {
        return 0;
      }
    })(),
    bo = Object.keys(S.boss || {}).length,
    ach = Object.keys(
      (() => {
        try {
          return achS();
        } catch (_) {
          return {};
        }
      })()
    ).length;
  const L = [
    ['h', 'Merci d’avoir joué,'],
    ['h', 'mon amour 💖'],
    ['', ''],
    ['p', '24 jours. 24 mini-jeux. 6 boss.'],
    ['p', 'Et un Valentin vaincu… par amour.'],
    ['', ''],
    ['s', '📅 Défis réussis : ' + won + ' / 24'],
    ['s', '🥚 Œufs trouvés : ' + eggs + ' / 24'],
    ['s', '⚔️ Boss vaincus : ' + (bo + 1) + ' / 7'],
    ['s', '⭐ Étoiles gagnées : ' + (S.earned || 0)],
    ['s', '🏆 Succès débloqués : ' + ach],
    ['', ''],
    ['p', 'Merci d’avoir supporté mes blagues nulles.'],
    ['p', 'Merci de m’aimer et de me soutenir au quotidien.'],
    ['p', 'Merci pour les fous rires, les voyages,'],
    ['p', 'la colocation et de faire la vaisselle quand j’oublie.'],
    ['p', 'Merci d’être toi, tout simplement.'],
    ['', ''],
    ['t', 'RÉALISATION'],
    ['p', 'Valentin'],
    ['t', 'IDÉE ORIGINALE'],
    ['p', 'Valentin'],
    ['t', 'ACTRICE PRINCIPALE'],
    ['p', 'Célestine, la plus belle'],
    ['t', 'SCÉNARIO'],
    ['p', 'Notre histoire, écrite par Valentin'],
    ['t', 'SCÉNARIO DE L’ENQUÊTE'],
    ['p', 'Valentin & Claude'],
    ['t', 'INDICES, DÉPOSITIONS ET FAUSSES PISTES'],
    ['p', 'Valentin & Claude'],
    ['t', 'DIRECTION ARTISTIQUE'],
    ['p', 'Valentin'],
    ['t', 'DESIGN DE L’INTERFACE'],
    ['p', 'Claude'],
    ['t', 'DESIGN DES PERSONNAGES ET DES DÉCORS'],
    ['p', 'Claude'],
    ['t', 'CINÉMATIQUES ET ANIMATIONS'],
    ['p', 'Claude'],
    ['t', 'CONCEPTION DES MINI-JEUX'],
    ['p', 'Valentin & Claude'],
    ['t', 'PROGRAMMATION DES MINI-JEUX'],
    ['p', 'Claude'],
    ['t', 'CONCEPTION DES BOSS'],
    ['p', 'Valentin'],
    ['t', 'PROGRAMMATION DES BOSS'],
    ['p', 'Claude'],
    ['t', 'COMBAT FINAL'],
    ['p', 'Valentin & Claude'],
    ['t', 'MENU, SAUVEGARDES ET CONDITIONS GÉNÉRALES'],
    ['p', 'Valentin & Claude'],
    ['t', 'DÉVELOPPEMENT DU SITE'],
    ['p', 'Claude'],
    ['t', 'APPLICATION ANDROID'],
    ['p', 'Claude'],
    ['t', 'APPLICATION DE SUIVI'],
    ['p', 'Claude'],
    ['t', 'BRUITAGES ET VOIX DES PERSONNAGES'],
    ['p', 'Claude'],
    ['t', 'CHOIX DES MUSIQUES'],
    ['p', 'Valentin'],
    ['t', 'PHOTOS ET VIDÉOS'],
    ['p', 'Valentin'],
    ['t', 'MONTAGE DES SOUVENIRS'],
    ['p', 'Valentin'],
    ['t', 'TEXTES ET BLAGUES NULLES'],
    ['p', 'Valentin'],
    ['t', 'TRADUCTION ANGLAISE'],
    ['p', 'Claude'],
    ['t', 'TESTS ET CHASSE AUX BUGS'],
    ['p', 'Valentin'],
    ['t', 'TESTEURS DU SITE'],
    ['p', 'Gaspard, Alexandre et Victor'],
    ['t', 'MISE EN LIGNE'],
    ['p', 'Claude'],
    ['t', 'PRODUCTION'],
    ['p', 'Valentin (avec beaucoup trop de nuits blanches)'],
    ['', ''],
    ['t', 'DANS LE RÔLE DE LA DÉTECTIVE'],
    ['c', 'celestine|Célestine|la détective, la victime… et la plus belle'],
    ['t', 'LA POLICE'],
    ['c', '🕵️|Lieutenant Pépin|commissariat du 8e, quatre cafés par matinée'],
    ['c', '👮|Brigadier Gérald|le roi du broyeur (et des œufs cachés)'],
    ['c', '🔬|Dr Rodolphe|police scientifique'],
    ['t', 'LES 9 SUSPECTS'],
    ['c', 'noemie|Noémie|Suspect n°1 · la pote des ongles 💅'],
    ['c', 'emma|Emma|Suspect n°2 · la pote ophtalmo 👁️'],
    ['c', 'nora|Nora|Suspect n°3 · la reine des fiches 📚'],
    ['c', 'erika|Erika|Suspect n°4 · la photographe de la promo 🤳'],
    ['c', 'eya|Eya|Suspect n°5 · le témoin de Bellecour 🛍️'],
    ['c', 'edgar|Edgar|Suspect n°6 · le grand frère (et ses 20 €) 🌯'],
    ['c', 'parents|Valérie|Suspect n°7 · la mère 🏡'],
    ['c', 'sandrine|Sandrine|Suspect n°8 · la collègue de la pharmacie 💊'],
    ['c', 'valentin|Valentin|Suspect n°9 · le vrai coupable 😈'],
    ['t', 'APPARITIONS SPÉCIALES'],
    ['p', 'Justine, Maud, Côme et Victor — suspects du mode Célestine'],
    ['p', 'Jean-Baptiste — cité dans le dossier'],
    ['p', 'Le chat — qui n’existe pas'],
    ['', ''],
    ['t', 'MUSIQUES'],
    ...vcMus(),
    ['', ''],
    ['t', 'REMERCIEMENTS'],
    ['p', 'Philippe Merle et l’équipe de Berthier Equipements'],
    ['p', 'pour m’avoir laissé du temps pour coder le site'],
    ['p', '(sans qu’ils ne le sachent)'],
    ['', ''],
    ['p', 'Et maintenant, la suite de l’histoire'],
    ['p', 's’écrit à deux… pour toujours.'],
    ['', ''],
    ['b', 'Je t’aime ❤️'],
    ['p', 'Joyeux Noël 🎄'],
    ['p', '— Valentin']
  ];
  const o = document.createElement('div');
  o.id = 'vcr';
  o.innerHTML = `<div class="vc-h">${Array.from({ length: 26 }, (_, i) => `<span style="left:${(i * 37) % 100}%;--d:${((i * 0.61) % 7).toFixed(2)}s;--s:${(7 + (i % 5) * 1.4).toFixed(1)}s;font-size:${1 + (i % 4) * 0.45}rem">${['💖', '💗', '💕', '❤️', '💘'][i % 5]}</span>`).join('')}</div><div class="vc-sc"><div class="vc-tx">${L.map(([k, t]) => (k == 'c' ? vcCard(t) : `<p class="vc-${k || 'e'}">${esc(t) || '&nbsp;'}</p>`)).join('')}</div></div><button class="vc-x alt sm">✕ Fermer</button>`;
  document.body.appendChild(o);
  let gone = 0;
  const close = () => {
    if (gone) return;
    gone = 1;
    o.classList.add('out');
    mu.stop();
    setTimeout(() => {
      o.remove();
      try {
        go('cal');
      } catch (_) {
        try {
          render();
        } catch (_) {}
      }
      if (window.__afterCredits) {
        const f = window.__afterCredits;
        window.__afterCredits = null;
        setTimeout(f, 900);
      }
      if (S.vbDone && !S.finSeen) {
        S.finSeen = 1;
        try {
          save();
        } catch (_) {}
        setTimeout(() => toast('👑 Jeu terminé : le calendrier a mis sa tenue de fête !'), 900);
      }
      if (window.__vbVid != null && vidN() > window.__vbVid) setTimeout(vidNew, 2600);
      window.__vbVid = null;
    }, 600);
  };
  o.querySelector('.vc-x').onclick = close;
  try {
    o.querySelector('.vc-tx').style.animationDuration =
      Math.max(80, Math.round(L.length * 0.62 + L.filter(x => x[0] == 'c').length * 2.6)) + 's';
  } catch (_) {}
  try {
    slog('🎬', 'Regarde le générique de fin');
  } catch (_) {}
  o.querySelector('.vc-tx').addEventListener('animationend', e => {
    if (e.animationName != 'vcs' || gone) return;
    const f = document.createElement('div');
    f.className = 'vc-fin';
    const vs = (((CONTENU.videos || [])[0] || {}).src || 'videos/x').replace(/[^/]*$/, '') + 'fin-bisou.mp4';
    f.innerHTML = `<div class="vc-fw"><video src="${vs}" poster="${VFIN}" muted playsinline webkit-playsinline autoplay preload="auto"></video></div>`;
    o.appendChild(f);
    requestAnimationFrame(() => requestAnimationFrame(() => f.classList.add('on')));
    const v = f.querySelector('video');
    try {
      const pp = v.play();
      if (pp && pp.catch) pp.catch(() => {});
    } catch (_) {}
    let ir = 0;
    const iris = () => {
      if (ir || gone) return;
      ir = 1;
      f.classList.add('iris');
      const fe = document.createElement('div');
      fe.className = 'vc-end';
      fe.innerHTML = '<span class="vc-eh l">💖</span><b>Fin</b><span class="vc-eh r">💖</span>';
      f.appendChild(fe);
      setTimeout(() => {
        if (gone) return;
        mu.stop();
        setTimeout(close, 900);
      }, 6000);
    };
    v.onended = () => setTimeout(iris, 700);
    v.onerror = () => setTimeout(iris, 4000);
    setTimeout(iris, 12000);
  });
}
