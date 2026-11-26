/* ---------- Musiques YouTube des mini-jeux (une chanson par jour) ---------- */
const SONGS = {
  1: { t: 'Babydoll', a: 'Dominic Fike' },
  2: { t: 'Loser', a: 'Tame Impala' },
  3: { t: 'Stolen Dance', a: 'Milky Chance' },
  4: { t: 'The Fate of Ophelia', a: 'Taylor Swift' },
  5: { t: 'Lush Life', a: 'Zara Larsson' },
  6: { t: 'DtMF', a: 'Bad Bunny' },
  7: { t: "Gigi l'amoroso", a: 'Dalida' },
  8: { t: 'Le passé', a: 'TAL' },
  9: { t: "Dine N'Dash", a: 'The Strokes' },
  10: { t: 'Zoo (Zootopie 2)', a: 'Shakira' },
  11: { t: 'Dracula (ft. JENNIE)', a: 'Tame Impala' },
  12: { t: 'White Keys', a: 'Dominic Fike' },
  13: { t: 'Out of My League', a: 'Fitz and The Tantrums' },
  14: { t: 'Last Nite', a: 'The Strokes' },
  15: { t: 'Opalite', a: 'Taylor Swift' },
  16: { t: 'I Just Might', a: 'Bruno Mars' },
  17: { t: 'Self Aware', a: 'Temper City' },
  18: { t: 'Nothing Breaks Like a Heart', a: 'Mark Ronson ft. Miley Cyrus' },
  19: { t: 'I Feel It Coming', a: 'The Weeknd ft. Daft Punk' },
  20: { t: 'Diana', a: 'GIMS' },
  21: { t: 'Black Madonna', a: 'Cage The Elephant' },
  22: { t: "À l'international", a: 'TAL' },
  23: { t: 'Dance, Dance', a: 'Fall Out Boy' },
  24: { t: "I Was Made for Lovin' You", a: 'KISS' },
  b11: { t: 'Audition · Edgar', a: 'Musique au choix' },
  b4: { t: 'Audition · Noémie', a: 'Musique au choix' },
  b8: { t: 'Audition · Emma', a: 'Musique au choix' },
  b15: { t: 'Audition · Nora', a: 'Musique au choix' },
  b19: { t: 'Audition · Sandrine', a: 'Musique au choix' },
  b22: { t: 'Audition · Valentin', a: 'Musique au choix' },
  b24: { t: 'Combat final', a: 'Musique au choix' },
  b25: { t: 'Générique de fin', a: 'Musique au choix' },
  b26: { t: 'Album photo', a: 'Musique au choix' },
  b27: { t: 'Combat final · partie 2', a: 'Musique au choix' },
  b28: { t: 'Combat final · partie 3', a: 'Musique au choix' },
  b29: { t: 'Combat final · partie 4', a: 'Musique au choix' },
  b30: { t: 'Combat final · dialogues', a: 'Musique au choix' },
  b31: { t: 'Combat final · scène de fin', a: 'Musique au choix' }
};
/* Les fichiers audio sont importés par Valentin (mode admin) et gardés uniquement sur cet appareil (IndexedDB) */
const MDB = (() => {
  let dbp = null;
  const db = () =>
    dbp ||
    (dbp = new Promise((res, rej) => {
      try {
        const r = indexedDB.open('avent_music', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('songs');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      } catch (e) {
        rej(e);
      }
    }));
  const tx = (m, f) =>
    db().then(
      d =>
        new Promise((res, rej) => {
          const t = d.transaction('songs', m),
            st = t.objectStore('songs');
          let out;
          Promise.resolve(f(st, v => (out = v))).catch(rej);
          t.oncomplete = () => res(out);
          t.onerror = () => rej(t.error);
        })
    );
  return {
    put: (k, v) => tx('readwrite', st => st.put(v, String(k))),
    del: k => tx('readwrite', st => st.delete(String(k))),
    all: () =>
      tx('readonly', (st, set) => {
        const o = {};
        const c = st.openCursor();
        c.onsuccess = () => {
          const x = c.result;
          if (x) {
            o[x.key] = x.value;
            x.continue();
          } else set(o);
        };
      })
  };
})();
async function id3Cover(blob) {
  try {
    const b = new Uint8Array(await blob.slice(0, 3e6).arrayBuffer());
    if (b[0] != 73 || b[1] != 68 || b[2] != 51) return null;
    const v = b[3],
      end = 10 + (((b[6] & 127) << 21) | ((b[7] & 127) << 14) | ((b[8] & 127) << 7) | (b[9] & 127));
    let p = 10;
    if (b[5] & 64)
      p +=
        v == 4
          ? ((b[10] & 127) << 21) | ((b[11] & 127) << 14) | ((b[12] & 127) << 7) | (b[13] & 127)
          : ((b[10] << 24) | (b[11] << 16) | (b[12] << 8) | b[13]) + 4;
    while (p + 10 < end && p + 10 < b.length) {
      const id = String.fromCharCode(b[p], b[p + 1], b[p + 2], b[p + 3]);
      if (!/^[A-Z0-9]{4}$/.test(id)) break;
      const sz =
        v == 4
          ? ((b[p + 4] & 127) << 21) | ((b[p + 5] & 127) << 14) | ((b[p + 6] & 127) << 7) | (b[p + 7] & 127)
          : (b[p + 4] << 24) | (b[p + 5] << 16) | (b[p + 6] << 8) | b[p + 7];
      if (id == 'APIC') {
        let q = p + 10;
        const enc = b[q++];
        let m = '';
        while (b[q]) m += String.fromCharCode(b[q++]);
        q++;
        q++;
        if (enc == 1 || enc == 2) {
          while (q + 1 < b.length && !(b[q] == 0 && b[q + 1] == 0)) q += 2;
          q += 2;
        } else {
          while (b[q]) q++;
          q++;
        }
        const data = b.slice(q, p + 10 + sz);
        return URL.createObjectURL(new Blob([data], { type: m && m.includes('/') ? m : 'image/jpeg' }));
      }
      p += 10 + sz;
    }
  } catch (_) {}
  return null;
}
const YTM = (() => {
  const au = new Audio();
  au.preload = 'auto';
  let URLS = {},
    BL = {},
    COV = {},
    mode = '',
    li = 0,
    box = null,
    ready = false,
    key = '';
  let NM = {};
  function name(k) {
    return NM[String(k)] || '';
  }
  function refresh() {
    return MDB.all()
      .then(o => {
        for (const k in URLS) URL.revokeObjectURL(URLS[k]);
        URLS = {};
        BL = {};
        NM = {};
        for (const k in o)
          if (o[k] && o[k].blob) {
            URLS[k] = URL.createObjectURL(o[k].blob);
            BL[k] = o[k].blob;
            NM[k] = o[k].name || '';
          }
        ready = true;
      })
      .catch(() => {
        ready = true;
      });
  }
  refresh();
  try {
    navigator.storage && navigator.storage.persist && navigator.storage.persist();
  } catch (_) {}
  const fmt2 = t => (isFinite(t) ? Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') : '0:00');
  function ui(sg, ctrl, k) {
    const big = !!(box && box.classList.contains('big'));
    if (box) box.remove();
    key = String(k || '');
    box = document.createElement('div');
    box.id = 'ytm';
    if (big) box.classList.add('big');
    box.innerHTML = `<div class="ytbig"><div class="ytcov"><span>🎵</span></div><div class="ytt"><b>${esc(sg.t)}</b><small>${esc(sg.a || '')}</small></div><input type="range" class="ytsk" min="0" max="1000" value="0" aria-label="Avancer dans la musique"><div class="yttm"><span class="ytcu">0:00</span><span class="ytdu">0:00</span></div>
   <div class="ytbtn">${ctrl ? `<button class="ytc ytsh ${S.shuf !== false ? 'on' : ''}" data-a="s" aria-label="Ordre aléatoire">🔀</button>` : ''}<button class="ytc" data-a="${ctrl ? '-1' : '-10'}">${ctrl ? '⏮' : '↺10'}</button><button class="ytc ytpp" data-a="p">⏸</button><button class="ytc" data-a="${ctrl ? '1' : '10'}">${ctrl ? '⏭' : '10↻'}</button>${ctrl ? `<button class="ytc ytrp ${mrep() ? 'on' : ''}" data-a="r" aria-label="Répéter">${mrep() == 2 ? '🔂' : '🔁'}</button>` : ''}</div>${ctrl ? `<div class="ytx"><button class="ytc ytfv" data-a="f" aria-label="Favori">${isFav(k) ? '❤️' : '🤍'}</button><button class="ytc ytzb" data-a="z" aria-label="Minuteur de sommeil">🌙<small class="ytzz">${slpTxt()}</small></button><button class="ytc" data-a="q" aria-label="File d’attente">📃</button><button class="ytc" data-a="l" aria-label="Bibliothèque">📚</button><label class="ytvl">🔊<input type="range" class="ytvo" min="0" max="100" value="${Math.round(S.mvol == null ? 85 : S.mvol)}" aria-label="Volume"></label></div><div class="ytq" hidden></div>` : ''}</div>
   <div class="ytb"><button class="ytc" data-a="p">⏸</button><button class="ytl" title="Agrandir">🎵 ${esc(sg.t)} · ${esc(sg.a || '')}</button>${ctrl ? '<button class="ytc" data-a="-1">⏮</button><button class="ytc" data-a="1">⏭</button>' : ''}<button class="ytc" data-a="x">✕</button></div>`;
    document.body.appendChild(box);
    const tg = () => box.classList.toggle('big');
    box.querySelector('.ytl').onclick = tg;
    box.querySelector('.ytcov').onclick = tg;
    box.querySelector('.ytt').onclick = tg;
    box.querySelectorAll('.ytc').forEach(
      b =>
        (b.onclick = e => {
          e.stopPropagation();
          const a = b.dataset.a;
          if (a == 'x') {
            const m = mode;
            stop();
            if (m == 'list')
              try {
                bgm();
              } catch (_) {}
          } else if (a == 'p') {
            if (au.paused) au.play().catch(() => {});
            else au.pause();
          } else if (a == 's') {
            S.shuf = S.shuf === false;
            save();
            ORD = [];
            b.classList.toggle('on', S.shuf !== false);
            toast(
              S.shuf !== false ? '🔀 Lecture aléatoire : jamais deux fois la même avant d’avoir tout écouté' : "➡️ Lecture dans l'ordre"
            );
            qPaint();
          } else if (a == 'r') {
            S.mrep = (mrep() + 1) % 3;
            save();
            b.classList.toggle('on', !!S.mrep);
            b.textContent = S.mrep == 2 ? '🔂' : '🔁';
            toast(['➡️ Pas de répétition', '🔁 Répéter toute la playlist', '🔂 Répéter ce titre'][S.mrep]);
          } else if (a == 'f') {
            favTog(key);
            b.textContent = isFav(key) ? '❤️' : '🤍';
            try {
              plRefresh();
            } catch (_) {}
          } else if (a == 'z') {
            slpNext();
            const z = box.querySelector('.ytzz');
            if (z) z.textContent = slpTxt();
          } else if (a == 'q') {
            const q = box.querySelector('.ytq');
            q.hidden = !q.hidden;
            qPaint();
          } else if (a == 'l') {
            box.classList.remove('big');
            popup(plHTML());
          } else if (a == '10' || a == '-10') {
            try {
              au.currentTime = Math.max(0, Math.min((au.duration || 0) - 0.5, au.currentTime + +a));
            } catch (_) {}
          } else next(+a);
        })
    );
    const sk = box.querySelector('.ytsk');
    let drag = false;
    sk.oninput = () => {
      drag = true;
      const d = au.duration || 0;
      box.querySelector('.ytcu').textContent = fmt2((sk.value / 1000) * d);
    };
    sk.onchange = () => {
      const d = au.duration || 0;
      if (d) au.currentTime = (sk.value / 1000) * d;
      drag = false;
    };
    sk._drag = () => drag;
    const pb = box.querySelector('[data-a="p"]');
    if (pb && au.paused === false) pb.textContent = '⏸';
    const vo = box.querySelector('.ytvo');
    if (vo)
      vo.oninput = e => {
        e.stopPropagation();
        S.mvol = +vo.value;
        BV = S.mvol / 100;
        setV();
      };
    if (vo) vo.onchange = () => save();
    const setCov = u => {
      const c = box && box.querySelector('.ytcov');
      if (c && u) {
        c.style.backgroundImage = `url(${u})`;
        c.classList.add('img');
      }
    };
    if (COV[key] !== undefined) setCov(COV[key]);
    else if (BL[key])
      id3Cover(BL[key]).then(u => {
        COV[key] = u;
        setCov(u);
      });
  }
  au.ontimeupdate = () => {
    if (mode == 'list') {
      if (Date.now() - lastSync > 15000) msync();
      if (slp && slp !== 'end' && Date.now() >= slp) {
        slp = 0;
        au.pause();
        toast('🌙 Bonne nuit !');
      }
      if (box && slp) {
        const z = box.querySelector('.ytzz');
        if (z) z.textContent = slpTxt();
      }
    }
    if (!box) return;
    const sk = box.querySelector('.ytsk');
    if (!sk || (sk._drag && sk._drag())) return;
    const d = au.duration || 0;
    sk.value = d ? (au.currentTime / d) * 1000 : 0;
    box.querySelector('.ytcu').textContent = fmt2(au.currentTime);
    box.querySelector('.ytdu').textContent = fmt2(d);
  };
  au.onplay = () => {
    if (box) {
      box.querySelectorAll('[data-a="p"]').forEach(b => (b.textContent = '⏸'));
      box.classList.remove('tap');
    }
    msync();
  };
  au.onseeked = () => msync();
  au.onpause = () => {
    if (box) box.querySelectorAll('[data-a="p"]').forEach(b => (b.textContent = '▶'));
    msync();
    try {
      if (mode == 'list') {
        S.mlast = { j: (L_()[li] || {}).jour, p: au.currentTime || 0 };
        save();
      }
    } catch (_) {}
  };
  au.onended = () => {
    if (mode == 'list') next(1, 1);
  };
  let G = null,
    BV = 1,
    DK = 1;
  function route() {
    if (G) return;
    try {
      const C = window.__eggAC || (window.__eggAC = new (window.AudioContext || window.webkitAudioContext)());
      if (C.state === 'suspended') C.resume();
      const src = C.createMediaElementSource(au);
      G = C.createGain();
      src.connect(G);
      G.connect(C.destination);
    } catch (_) {
      G = null;
    }
  }
  function setV() {
    const v = Math.max(0, Math.min(1, BV * DK));
    if (G) {
      au.volume = 1;
      try {
        G.gain.value = v;
      } catch (_) {}
    } else au.volume = v;
  }
  function go(url, vol, loop) {
    try {
      MUS.stop();
      MUS._bg = 0;
    } catch (_) {}
    try {
      if (ALBM.on) ALBM.stop(0.3);
    } catch (_) {}
    au.src = url;
    au.loop = !!loop;
    BV = vol;
    route();
    setV();
    au.currentTime = 0;
    const p = au.play();
    if (p && p.catch)
      p.catch(() => {
        if (box) box.classList.add('tap');
      });
  }
  function stop() {
    if (mode == 'list') {
      try {
        S.mlast = { j: (L_()[li] || {}).jour, p: au.currentTime || 0 };
        save();
      } catch (_) {}
      mstop();
    }
    if (!document.getElementById('storyo')) DK = 1;
    try {
      au.pause();
      au.removeAttribute('src');
      au.load();
    } catch (_) {}
    if (box) {
      box.remove();
      box = null;
    }
    const was = mode;
    mode = '';
    if (was == 'list') {
      try {
        plMark();
      } catch (_) {}
    }
  }
  const has = d => !!URLS[String(d)];
  function start(d) {
    if (mode == 'game' && key === String(d) && box) return true;
    if (mode == 'game') stop();
    if (S.music === false || !S.own.includes('playlist') || !has(d)) return false;
    if (mode == 'list') stop();
    mode = 'game';
    try {
      MUS.stop();
    } catch (_) {}
    const sg = songOf(d, SONGS[d] || { t: 'Musique', a: '' });
    ui(sg, 0, d);
    go(URLS[String(d)], DAYS[d] && DAYS[d].g == 'simon' ? 0.25 : 0.85, 1);
    return true;
  }
  function stopGame() {
    if (mode == 'game') stop();
  }
  function list(i, keep, back) {
    if (!keep) {
      ctx = 'all';
      HIST.push(li);
      ORD = ORD.filter(j => j !== i);
    }
    const L = CONTENU.playlist || [],
      x = L[i];
    if (!x || (x.jour && x.jour > unl())) return;
    if (!has(x.jour)) {
      toast("🎵 Cette chanson n'est pas encore sur cet appareil");
      return;
    }
    li = i;
    try {
      MUS.stop();
      MUS._bg = 0;
    } catch (_) {}
    if (HIST.length > 60) HIST.splice(0, HIST.length - 60);
    mode = 'list';
    ui(songOf(x.jour, { t: x.titre, a: x.artiste }), 1, x.jour);
    go(URLS[String(x.jour)], S.mvol == null ? 0.85 : S.mvol / 100, 0);
    S.mplays = S.mplays || {};
    S.mplays[x.jour] = (S.mplays[x.jour] || 0) + 1;
    S.mlast = { j: x.jour, p: 0 };
    ORD = ORD.filter(j => j !== i);
    S.mord = ORD.slice();
    save();
    try {
      plMark();
    } catch (_) {}
    setTimeout(msync, 300);
    qPaint();
  }
  let ORD = [],
    Q = [],
    HIST = [],
    slp = 0,
    ctx = 'all';
  const mrep = () => (S.mrep == null ? 1 : S.mrep);
  const L_ = () => CONTENU.playlist || [];
  const okI = j => {
    const x = L_()[j];
    return x && has(x.jour) && x.jour <= unl() && (ctx != 'fav' || isFav(x.jour));
  };
  const avail = () => [...L_().keys()].filter(okI);
  const shuf = a => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function ordFill() {
    const A = avail();
    if (!ORD.length && Array.isArray(S.mord)) ORD = S.mord.filter(j => A.includes(j));
    ORD = ORD.filter(j => A.includes(j) && j !== li);
    if (!ORD.length) {
      ORD = shuf(A.filter(j => j !== li));
    }
    S.mord = ORD.slice();
    return ORD;
  }
  function upcoming(n) {
    const A = avail(),
      out = [...Q];
    if (S.shuf !== false) {
      out.push(...ordFill());
    } else {
      const k = A.indexOf(li);
      for (let i = 1; i <= A.length && out.length < n; i++) {
        const j = A[(k + i) % A.length];
        if (j !== li) out.push(j);
      }
    }
    return out.slice(0, n);
  }
  function next(dir, auto) {
    const A = avail();
    if (!A.length) return;
    if (auto && mrep() == 2) return list(li, 1, 1);
    if (auto && slp === 'end') {
      slp = 0;
      au.pause();
      toast('🌙 Bonne nuit !');
      return;
    }
    if (dir < 0) {
      if (au.currentTime > 4) {
        au.currentTime = 0;
        return;
      }
      if (HIST.length) return list(HIST.pop(), 1, 1);
      if (S.shuf === false) {
        const k = A.indexOf(li);
        return list(A[(k - 1 + A.length) % A.length], 1, 1);
      }
      au.currentTime = 0;
      return;
    }
    if (Q.length) {
      HIST.push(li);
      return list(Q.shift(), 1);
    }
    if (S.shuf !== false) {
      if (!ORD.length && Array.isArray(S.mord)) ORD = S.mord.slice();
      let O = ORD.filter(j => A.includes(j) && j !== li);
      if (!O.length) {
        if (auto && mrep() == 0) {
          au.pause();
          toast('🎵 Tout a été écouté !');
          return;
        }
        O = shuf(A.slice());
        if (O[0] === li && O.length > 1) [O[0], O[1]] = [O[1], O[0]];
      }
      const j = O.shift();
      ORD = O;
      S.mord = O.slice();
      HIST.push(li);
      return list(j, 1);
    }
    const k = A.indexOf(li);
    let p = k + 1;
    if (p >= A.length) {
      if (auto && mrep() == 0) {
        au.pause();
        toast('🎵 Fin de la playlist');
        return;
      }
      p = 0;
    }
    HIST.push(li);
    return list(A[p], 1);
  }
  function playCtx(c, first) {
    ctx = c || 'all';
    const A = avail();
    if (!A.length) {
      toast(ctx == 'fav' ? '🤍 Aucun favori pour l’instant' : '🎵 Aucune chanson disponible');
      return;
    }
    ORD = [];
    S.mord = null;
    Q = [];
    HIST = [];
    if (first == null) {
      if (S.shuf === false) first = A[0];
      else first = A[Math.floor(Math.random() * A.length)];
    }
    li = first;
    ORD = shuf(A.filter(j => j !== first));
    S.mord = ORD.slice();
    list(first, 1);
  }
  function qAdd(i) {
    if (!okI(i) && !has((L_()[i] || {}).jour)) return;
    Q.push(i);
    toast('➕ Ajouté à la file : ' + ((songOf(L_()[i].jour, { t: L_()[i].titre }) || {}).t || ''));
    qPaint();
  }
  function qPaint() {
    const q = box && box.querySelector('.ytq');
    if (!q || q.hidden) return;
    const U = upcoming(12);
    q.innerHTML = `<b>📃 À suivre${S.shuf !== false ? ' · 🔀' : ''}</b>${
      U.length
        ? U.map((j, n) => {
            const x = L_()[j],
              sg = songOf(x.jour, { t: x.titre, a: x.artiste || '' });
            return `<button class="ytqi" data-j="${j}"><span>${n < Q.length ? '➕' : n + 1}</span><b>${esc(sg.t)}</b><small>${esc(sg.a)}</small></button>`;
          }).join('')
        : '<small>Rien à suivre</small>'
    }`;
    q.querySelectorAll('.ytqi').forEach(
      e =>
        (e.onclick = ev => {
          ev.stopPropagation();
          const j = +e.dataset.j;
          Q = Q.filter(z => z !== j);
          ORD = ORD.filter(z => z !== j);
          HIST.push(li);
          list(j, 1);
        })
    );
  }
  const SLP = [0, 15, 30, 45, 60, 'end'];
  function slpNext() {
    const i = SLP.indexOf(slp === 0 ? 0 : slp === 'end' ? 'end' : slp._m);
    const nx = SLP[(i + 1) % SLP.length];
    if (nx === 0) {
      slp = 0;
      toast('🌙 Minuteur désactivé');
    } else if (nx === 'end') {
      slp = 'end';
      toast('🌙 Arrêt à la fin de ce titre');
    } else {
      slp = new Number(Date.now() + nx * 60000);
      slp._m = nx;
      toast(`🌙 Arrêt dans ${nx} min`);
    }
  }
  function slpTxt() {
    if (!slp) return '';
    if (slp === 'end') return ' fin';
    return ' ' + Math.max(1, Math.ceil((slp - Date.now()) / 60000)) + '′';
  }
  function isFav(j) {
    return !!(S.mfav || {})[String(j)];
  }
  function favTog(j) {
    S.mfav = S.mfav || {};
    j = String(j);
    if (S.mfav[j]) delete S.mfav[j];
    else S.mfav[j] = Date.now();
    save();
    toast(S.mfav[j] ? '❤️ Ajouté aux favoris' : '🤍 Retiré des favoris');
  }
  /* --- notification, écran verrouillé, casque --- */
  const CB64 = {};
  function cover64(k) {
    if (CB64[k] !== undefined) return Promise.resolve(CB64[k]);
    const u = COV[k];
    if (!u) {
      if (COV[k] === null) CB64[k] = '';
      return Promise.resolve('');
    }
    return new Promise(res => {
      const im = new Image();
      im.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = c.height = 256;
          const g = c.getContext('2d');
          const m = Math.min(im.width, im.height);
          g.drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, 256, 256);
          CB64[k] = c.toDataURL('image/jpeg', 0.82).split(',')[1];
        } catch (_) {
          CB64[k] = '';
        }
        res(CB64[k]);
      };
      im.onerror = () => {
        CB64[k] = '';
        res('');
      };
      im.src = u;
    });
  }
  let lastSync = 0;
  function msync() {
    if (mode != 'list') return;
    lastSync = Date.now();
    const x = L_()[li];
    if (!x) return;
    const sg = songOf(x.jour, { t: x.titre, a: x.artiste || '' }),
      k = String(x.jour);
    try {
      if ('mediaSession' in navigator) {
        const art = COV[k] ? [{ src: COV[k], sizes: '512x512' }] : [{ src: 'icon-512.png', sizes: '512x512', type: 'image/png' }];
        navigator.mediaSession.metadata = new MediaMetadata({ title: sg.t, artist: sg.a || '', album: 'Dossier n°24', artwork: art });
        navigator.mediaSession.playbackState = au.paused ? 'paused' : 'playing';
        if (au.duration && isFinite(au.duration))
          navigator.mediaSession.setPositionState({
            duration: au.duration,
            position: Math.min(au.currentTime, au.duration),
            playbackRate: 1
          });
      }
    } catch (_) {}
    try {
      if (window.AventAndroid && AventAndroid.mediaUpdate) {
        const send = c =>
          AventAndroid.mediaUpdate(
            sg.t,
            sg.a || '',
            !au.paused,
            (au.currentTime || 0) * 1000,
            (isFinite(au.duration) ? au.duration : 0) * 1000,
            c
          );
        if (CB64[k] !== undefined) send(CB64[k]);
        else {
          send('');
          cover64(k).then(c => {
            if (c && mode == 'list' && String((L_()[li] || {}).jour) == k) send(c);
          });
        }
      }
    } catch (_) {}
  }
  function mstop() {
    try {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'none';
      }
    } catch (_) {}
    try {
      window.AventAndroid && AventAndroid.mediaStop && AventAndroid.mediaStop();
    } catch (_) {}
  }
  try {
    if ('mediaSession' in navigator) {
      const H = (a, f) => {
        try {
          navigator.mediaSession.setActionHandler(a, f);
        } catch (_) {}
      };
      H('play', () => window.__mediaCmd('play'));
      H('pause', () => window.__mediaCmd('pause'));
      H('nexttrack', () => window.__mediaCmd('next'));
      H('previoustrack', () => window.__mediaCmd('prev'));
      H('seekto', d => window.__mediaCmd('seek:' + Math.round((d.seekTime || 0) * 1000)));
      H('stop', () => window.__mediaCmd('pause'));
    }
  } catch (_) {}
  window.__mediaCmd = c => {
    c = String(c);
    if (c.startsWith('seek:')) {
      try {
        au.currentTime = +c.slice(5) / 1000;
        msync();
      } catch (_) {}
      return;
    }
    if (c == 'play') {
      if (mode) {
        const p = au.play();
        if (p && p.catch) p.catch(() => {});
      } else if (S.mlast) resume();
      return;
    }
    if (c == 'pause') {
      if (mode) au.pause();
      return;
    }
    if (c == 'toggle') {
      if (au.paused) window.__mediaCmd('play');
      else au.pause();
      return;
    }
    if (c == 'next') {
      if (mode == 'list') next(1);
      return;
    }
    if (c == 'prev') {
      if (mode == 'list') next(-1);
      return;
    }
    if (c == 'stop') {
      if (mode == 'list') {
        stop();
        try {
          bgm();
        } catch (_) {}
      }
      return;
    }
  };
  function resume() {
    const m = S.mlast;
    if (!m) return;
    const L = L_();
    const i = L.findIndex(x => String(x.jour) == String(m.j));
    if (i < 0 || !okI(i)) return;
    list(i, 1);
    try {
      au.currentTime = m.p || 0;
    } catch (_) {}
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (mode == 'game') {
        stop();
        window.__ytmResume = key;
      } else if (mode == 'list') {
        msync();
        try {
          S.mlast = { j: (L_()[li] || {}).jour, p: au.currentTime || 0 };
          save();
        } catch (_) {}
      }
    } else if (window.__ytmResume) {
      const d = window.__ytmResume;
      window.__ytmResume = 0;
      if (view == 'day' && String(cur) == String(d)) start(d);
    }
  });
  addEventListener('pagehide', () => {
    if (mode == 'game') stop();
    else if (mode == 'list') {
      try {
        S.mlast = { j: (L_()[li] || {}).jour, p: au.currentTime || 0 };
        save();
      } catch (_) {}
    }
  });
  return {
    playCtx,
    qAdd,
    isFav,
    favTog,
    resume,
    upcoming,
    refreshUI() {
      if (box && mode == 'list') {
        const f = box.querySelector('.ytfv');
        if (f) f.textContent = isFav(key) ? '❤️' : '🤍';
      }
      qPaint();
    },
    boss(k) {
      k = String(k);
      if (S.music === false || !has(k)) return false;
      if (mode) stop();
      mode = 'game';
      key = k;
      try {
        MUS.stop();
      } catch (_) {}
      const sg = songOf(k, SONGS[k] || { t: 'Boss', a: '' });
      ui(sg, 0, k);
      go(URLS[k], 0.85, 1);
      return true;
    },
    duck(f) {
      DK = f;
      setV();
    },
    hold() {
      if (mode && !au.paused) {
        au.pause();
        return 1;
      }
      return 0;
    },
    unhold() {
      if (mode) {
        const p = au.play();
        if (p && p.catch) p.catch(() => {});
      }
    },
    get gday() {
      return mode == 'game' ? key : null;
    },
    start,
    stop,
    stopGame,
    list,
    has,
    refresh,
    count: () => Object.keys(URLS).length,
    name,
    on: () => !!mode,
    get li() {
      return mode == 'list' ? li : -1;
    }
  };
})();
/* ---------- Fichier mystère : un seul fichier qui contient toutes les musiques ---------- */
function musMatch(name) {
  const n = nrm(name.replace(/\.[^.]+$/, ''));
  let best = null,
    bl = 0;
  for (const k in SONGS) {
    const t = nrm(SONGS[k].t.replace(/\(.*?\)/g, ''));
    if (t && (n.includes(t) || n.replace(/ /g, '').includes(t.replace(/ /g, ''))) && t.length > bl) {
      best = k;
      bl = t.length;
    }
  }
  return best;
}
async function mysBuild(items) {
  const head = JSON.stringify(items.map(x => ({ d: x.d, name: x.name, type: x.blob.type || 'audio/mpeg', size: x.blob.size }))),
    hb = new TextEncoder().encode(head);
  return new Blob([new TextEncoder().encode('AVENTMUS1' + String(hb.length).padStart(10, '0')), hb, ...items.map(x => x.blob)], {
    type: 'application/octet-stream'
  });
}
const b64 = bl =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result).split(',')[1] || '');
    r.onerror = rej;
    r.readAsDataURL(bl);
  });
async function mysOut(blob, n, miss) {
  const name = 'fichier-mystere.avent',
    mo = (blob.size / 1048576).toFixed(0);
  if (window.AventAndroid && AventAndroid.fileBegin) {
    popup(`<h2>📦 Création…</h2><p id="mysq">0 %</p>`);
    if (!AventAndroid.fileBegin(name)) {
      popup('<h2>Oups</h2><p>Impossible de créer le fichier.</p><button onclick="admin()">OK</button>');
      return;
    }
    const CH = 786432;
    for (let o = 0; o < blob.size; o += CH) {
      if (!AventAndroid.fileChunk(await b64(blob.slice(o, o + CH)))) {
        popup('<h2>Oups</h2><p>Pas assez de place sur le téléphone ?</p><button onclick="admin()">OK</button>');
        return;
      }
      const q = $('#mysq');
      if (q) q.textContent = Math.round(Math.min(100, ((o + CH) / blob.size) * 100)) + ' %';
    }
    const r = AventAndroid.fileEnd();
    if (r.startsWith('err')) {
      popup(`<h2>Oups</h2><p>${esc(r)}</p><button onclick="admin()">OK</button>`);
      return;
    }
    popup(
      `<h2>📦 Fichier mystère prêt</h2><p>${n} chanson${n > 1 ? 's' : ''} dedans (${mo} Mo).${miss}</p><p>${r == 'ok' ? 'Il est enregistré dans <b>Téléchargements</b> sous le nom <b>fichier-mystere.avent</b>.' : 'Enregistré ici : <small>' + esc(r.slice(5)) + '</small>'}</p>${r == 'ok' ? '<button onclick="AventAndroid.fileShare()">📤 L\'envoyer maintenant</button>' : ''}<button class="alt" onclick="admin()">← Retour</button>`
    );
    return;
  }
  const file = new File([blob], name, { type: 'application/octet-stream' });
  popup(`<h2>📦 Fichier mystère prêt</h2><p>${n} chanson${n > 1 ? 's' : ''} dedans (${mo} Mo).${miss}</p><p>Envoie-le-lui (AirDrop, Messages, WhatsApp en « document », Drive…). Elle l'ouvrira dans l'appli avec le bouton 🎁 de ses Trésors.</p>
  ${navigator.canShare && navigator.canShare({ files: [file] }) ? '<button id="mysh">📤 Partager</button>' : ''}<button id="mydl" class="alt">💾 Enregistrer</button><button class="alt" onclick="admin()">← Retour</button>`);
  const sh = $('#mysh');
  if (sh) sh.onclick = () => navigator.share({ files: [file], title: 'Fichier mystère' }).catch(() => {});
  $('#mydl').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 4000);
  };
}
async function mysFromDevice() {
  let o = {};
  try {
    o = await MDB.all();
  } catch (_) {}
  const items = Object.keys(o)
    .filter(k => o[k] && o[k].blob)
    .sort((a, b) => a - b)
    .map(k => ({ d: k, name: o[k].name || 'jour' + k, blob: o[k].blob }));
  if (!items.length) {
    toast('Aucune musique sur cet appareil');
    return;
  }
  toast('📦 Création du fichier mystère…');
  await mysOut(await mysBuild(items), items.length, '');
}
async function mysMake(input) {
  const files = [...input.files];
  input.value = '';
  if (!files.length) return;
  const items = [],
    miss = [];
  for (const f of files) {
    const d = musMatch(f.name);
    if (d && !items.some(x => x.d == d)) items.push({ d, name: f.name, blob: f });
    else miss.push(f.name);
  }
  if (!items.length) {
    appAlert('Aucun fichier reconnu.');
    return;
  }
  toast('📦 Création du fichier mystère…');
  await mysOut(
    await mysBuild(items),
    items.length,
    miss.length ? `<br><small class="muted">Pas reconnus : ${miss.map(esc).join(', ')}</small>` : ''
  );
}
/* ---------- Fichier mystère : les bruitages et la petite musique du lancer ----------
   Tout est synthétisé. A est un AudioContext (ou un OfflineAudioContext pour fabriquer un extrait). */
function mysSons(A, musique = true) {
  const M = A.createGain();
  M.gain.value = 0.0001;
  M.connect(A.destination);
  M.gain.exponentialRampToValueAtTime(1.4, A.currentTime + 1.2);
  const now = () => A.currentTime;
  const bruit = (() => {
    const b = A.createBuffer(1, A.sampleRate * 2, A.sampleRate),
      d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  })();
  // un souffle de bruit filtré (type : lowpass, bandpass, highpass), avec un balayage de fréquence possible
  const souffle = (t, d, v, type, f1, f2, q = 1, att = 0.01) => {
    const s = A.createBufferSource(),
      f = A.createBiquadFilter(),
      g = A.createGain();
    s.buffer = bruit;
    s.loop = true;
    f.type = type;
    f.Q.value = q;
    f.frequency.setValueAtTime(f1, t);
    if (f2) f.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f).connect(g).connect(M);
    s.start(t, Math.random());
    s.stop(t + d + 0.05);
  };
  const ton = (t, fq, d, v, type = 'sine', f2) => {
    const o = A.createOscillator(),
      g = A.createGain();
    o.type = type;
    o.frequency.setValueAtTime(fq, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(M);
    o.start(t);
    o.stop(t + d + 0.05);
  };
  // fond continu : le grondement du feu dans la cheminée et le vent sur les toits
  const continu = (type, fq, v) => {
    const s = A.createBufferSource(),
      f = A.createBiquadFilter(),
      g = A.createGain();
    s.buffer = bruit;
    s.loop = true;
    f.type = type;
    f.frequency.value = fq;
    g.gain.value = v;
    s.connect(f).connect(g).connect(M);
    s.start();
    return { s, f, g };
  };
  const feu = continu('lowpass', 380, 0.07),
    vent = continu('bandpass', 520, 0.018),
    glis = continu('bandpass', 1500, 0);
  vent.f.Q.value = 0.7;
  glis.f.Q.value = 0.6;
  glis.g.gain.value = 0;
  // la boîte à musique : « Douce nuit » (Franz Gruber, 1818), lente et douce, avec des grelots
  const DN =
      'G4:1.5 A4:.5 G4:1 E4:3 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 B4:3 C5:2 C5:1 G4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 F5:1.5 D5:.5 B4:1 C5:3 E5:3 C5:1.5 G4:.5 E4:1 G4:1.5 F4:.5 D4:1 C4:6 R:3'
        .split(' ')
        .map(x => x.split(':')),
    BAS = {
      0: 'C3',
      6: 'C3',
      12: 'G2',
      18: 'C3',
      24: 'F2',
      30: 'C3',
      36: 'F2',
      42: 'C3',
      48: 'G2',
      54: 'C3',
      60: 'C3',
      66: 'C3',
      72: 'G2',
      78: 'C3'
    },
    hz = n => {
      const i = 'C C# D D# E F F# G G# A A# B'.split(' ').indexOf(n.slice(0, -1));
      return 440 * 2 ** ((i - 9) / 12 + (+n.slice(-1) - 4));
    },
    BT = 0.34;
  const cloche = (t, fq, v) => {
    ton(t, fq, 1.6, v);
    ton(t, fq * 2, 0.7, v * 0.35);
    ton(t, fq * 3.01, 0.35, v * 0.12);
  };
  let mi = 0,
    mt = now() + 0.8,
    mb = 0,
    ct = now();
  const prevoir = h => {
    // musique
    while (musique && mt < now() + h) {
      const [n, d] = DN[mi];
      if (BAS[mb] != null) ton(mt, hz(BAS[mb]), BT * 5, 0.05, 'triangle');
      if (n != 'R') cloche(mt, hz(n), 0.06);
      if (mb % 3 == 0) souffle(mt, 0.09, 0.012, 'highpass', 7000);
      mt += +d * BT;
      mb += +d;
      if (++mi >= DN.length) ((mi = 0), (mb = 0));
    }
    // crépitements du feu : petits craquements au hasard
    while (ct < now() + h) {
      ct += 0.03 + Math.random() * 0.16;
      const v = Math.random() < 0.15 ? 0.09 : 0.03 * Math.random() + 0.008;
      souffle(ct, 0.012 + Math.random() * 0.03, v, 'bandpass', 1500 + Math.random() * 3500, 0, 1.4, 0.002);
    }
  };
  const iv = A instanceof (window.OfflineAudioContext || Object) ? 0 : setInterval(() => prevoir(0.6), 200);
  prevoir(0.6);
  return {
    prevoir,
    // le geste : un « ffuit » qui monte avec la force
    lance: k => {
      const t = now();
      souffle(t, 0.4, 0.09 * k, 'bandpass', 500, 1800, 1.2, 0.05);
    },
    // la neige : un « crouch » feutré
    neige: k => {
      const t = now();
      souffle(t, 0.16, 0.14 * k, 'lowpass', 1100, 300, 0.8);
      for (let i = 0; i < 4; i++) souffle(t + i * 0.025, 0.03, 0.05 * k, 'bandpass', 2200 + Math.random() * 1500, 0, 2, 0.002);
    },
    // les briques de la cheminée : un « toc » sourd
    brique: k => {
      const t = now();
      ton(t, 160, 0.14, 0.22 * k, 'sine', 70);
      souffle(t, 0.07, 0.12 * k, 'bandpass', 700, 0, 1.5, 0.002);
    },
    // les obstacles : chacun son bruit
    obstacle: (ty, k) => {
      const t = now();
      if (ty == 'antenne') {
        ton(t, 1760, 0.6, 0.06 * k, 'triangle');
        ton(t, 2637, 0.4, 0.035 * k, 'triangle');
      } else if (ty == 'cadeaux') {
        ton(t, 210, 0.1, 0.16 * k, 'sine', 120);
        souffle(t, 0.12, 0.08 * k, 'bandpass', 1800, 900, 1);
      } else if (ty == 'sapin') {
        souffle(t, 0.35, 0.07 * k, 'highpass', 2500, 0, 0.7, 0.03);
        [2637, 3136, 3520].forEach((f, i) => ton(t + 0.05 + i * 0.06, f, 0.3, 0.02 * k));
      } else souffle(t, 0.2, 0.15 * k, 'lowpass', 900, 250, 0.8);
    },
    // la glissade : un frottement continu qui suit la vitesse
    glisse: v => {
      glis.g.gain.setTargetAtTime(Math.min(0.06, v * 0.025), now(), 0.05);
    },
    // il tombe du toit : un petit sifflement qui descend, puis un « plouf » lointain
    tombe: () => {
      const t = now();
      ton(t, 900, 0.7, 0.03, 'sine', 280);
      souffle(t + 0.75, 0.25, 0.05, 'lowpass', 600, 200, 0.8);
    },
    // dans la cheminée : il dégringole, le feu s'emballe, et une petite cascade de clochettes
    entre: () => {
      const t = now();
      souffle(t, 0.5, 0.12, 'lowpass', 1600, 200, 0.9, 0.02);
      souffle(t + 0.35, 1.2, 0.2, 'lowpass', 300, 1400, 0.7, 0.15);
      feu.g.gain.setTargetAtTime(0.16, t + 0.35, 0.1);
      feu.g.gain.setTargetAtTime(0.07, t + 1.4, 0.4);
      [1047, 1319, 1568, 2093, 2637].forEach((f, i) => cloche(t + 0.45 + i * 0.09, f, 0.05));
    },
    // Célestine à pied : ses pas dans la neige
    pas: k => {
      const t = now();
      souffle(t, 0.09, 0.06 * (0.4 + k), 'lowpass', 1500, 450, 0.8, 0.005);
      souffle(t + 0.02, 0.03, 0.02, 'bandpass', 2600 + Math.random() * 900, 0, 2, 0.002);
    },
    // les surprises
    eboule: () => {
      const t = now();
      souffle(t, 0.8, 0.22, 'lowpass', 800, 140, 0.8, 0.02);
      [0.05, 0.22, 0.4].forEach((d, i) => ton(t + d, 150 - i * 25, 0.16, 0.16, 'sine', 60));
    },
    aiguilles: () => {
      const t = now();
      souffle(t, 0.9, 0.09, 'highpass', 2800, 0, 0.7, 0.05);
      for (let i = 0; i < 7; i++) ton(t + 0.05 + i * 0.07, [2637, 3136, 3520, 2794][i % 4], 0.35, 0.025);
    },
    miaou: () => {
      const t = now() + 0.15,
        o = A.createOscillator(),
        f = A.createBiquadFilter(),
        g = A.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(520, t);
      o.frequency.linearRampToValueAtTime(880, t + 0.18);
      o.frequency.linearRampToValueAtTime(600, t + 0.55);
      f.type = 'bandpass';
      f.frequency.value = 1300;
      f.Q.value = 2;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.06);
      g.gain.setValueAtTime(0.09, t + 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      o.connect(f).connect(g).connect(M);
      o.start(t);
      o.stop(t + 0.65);
      ton(now(), 300, 0.25, 0.08, 'sine', 900); // le « boing » du ressort
    },
    gresille: () => {
      const t = now();
      souffle(t, 1.3, 0.05, 'highpass', 3000, 0, 0.7, 0.01);
      ton(t, 120, 1.1, 0.025, 'square');
      ton(t, 1400, 0.08, 0.05, 'square', 400);
    },
    // le traîneau touché : un choc, les grelots qui s'affolent, un sifflement qui descend
    crash: () => {
      const t = now();
      ton(t, 180, 0.18, 0.2, 'sine', 70);
      souffle(t, 0.1, 0.12, 'bandpass', 900, 0, 1.5, 0.002);
      for (let i = 0; i < 10; i++) souffle(t + i * 0.07, 0.07, 0.03, 'highpass', 6500, 0, 1, 0.003);
      ton(t + 0.1, 1300, 0.8, 0.04, 'sine', 260);
    },
    // … et il s'écrase dans la neige du toit
    boum: () => {
      const t = now();
      souffle(t, 0.9, 0.3, 'lowpass', 900, 90, 0.7, 0.01);
      ton(t, 110, 0.4, 0.25, 'sine', 45);
      for (let i = 0; i < 9; i++) ton(t + 0.05 + Math.random() * 0.5, 2000 + Math.random() * 2500, 0.25, 0.025);
    },
    fin: () => {
      clearInterval(iv);
      try {
        M.gain.setTargetAtTime(0.0001, now(), 0.15);
      } catch (_) {}
      setTimeout(() => {
        try {
          A.close();
        } catch (_) {}
      }, 700);
    }
  };
}

/* ---------- Fichier mystère : avant de l'ouvrir, on le lance dans la cheminée du Père Noël ---------- */
// Lancer « en profondeur » (façon paper toss) : on glisse le doigt vers le haut, le fichier part vers la cheminée.
// Monde en mètres : x = gauche/droite, y = hauteur, z = profondeur. cb est appelé quand le fichier est tombé dedans.
function mysLancer(cb, fic) {
  // l'apparence du fichier lancé dépend du fichier choisi : une photo s'affiche, un document prend l'icône de son type
  const nom = (fic && fic.name) || 'fichier.avent',
    ty = (fic && fic.type) || '',
    ext = (nom.includes('.') ? nom.split('.').pop() : '?').slice(0, 5).toUpperCase(),
    vis = { k: ext == 'AVENT' ? 'avent' : 'doc', ext, nom };
  if (ty.startsWith('audio')) Object.assign(vis, { ico: '♪', col: '#7b4fd6' });
  else if (ty.startsWith('video')) Object.assign(vis, { ico: '▶', col: '#d65a2f' });
  else if (ty == 'application/pdf' || ext == 'PDF') Object.assign(vis, { ico: 'PDF', col: '#d0312d' });
  else if (/^(DOCX?|ODT|RTF|TXT|PAGES)$/.test(ext)) Object.assign(vis, { ico: '¶', col: '#2b63c9' });
  else if (/^(XLSX?|CSV|ODS|NUMBERS)$/.test(ext)) Object.assign(vis, { ico: '▦', col: '#1f8a4c' });
  else if (/^(ZIP|RAR|7Z)$/.test(ext)) Object.assign(vis, { ico: '🗜', col: '#8a6a2b' });
  else Object.assign(vis, { ico: '?', col: '#6b7487' });
  const imgDe = src =>
    new Promise(ok => {
      const im = new Image();
      im.onload = () => ok(im);
      im.onerror = () => ok(null);
      im.src = src;
    });
  if (fic && ty.startsWith('image')) {
    const u = URL.createObjectURL(fic);
    imgDe(u).then(im => im && Object.assign(vis, { k: 'photo', im }));
  } else if (fic && ty.startsWith('video')) {
    // une image de la vidéo sert de miniature
    const u = URL.createObjectURL(fic),
      v = document.createElement('video');
    v.muted = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.onloadeddata = () => (v.currentTime = Math.min(1, (v.duration || 2) / 3));
    v.onseeked = () => {
      try {
        const k = document.createElement('canvas');
        k.width = v.videoWidth;
        k.height = v.videoHeight;
        k.getContext('2d').drawImage(v, 0, 0);
        Object.assign(vis, { k: 'photo', im: k, video: 1 });
      } catch (_) {}
    };
    v.src = u;
  }
  const o = document.createElement('div');
  o.className = 'mysl';
  o.innerHTML = `<canvas></canvas><div class="mysl-h"><b>Livraison spéciale</b><small>Joystick pour marcher, glisse le doigt pour tourner la vue. Maintiens « Lancer » et relâche au bon moment !</small><span class="mysl-n">Livré <i>0</i></span></div><p class="mysl-tip"></p><p class="mysl-sec"></p><div class="mysl-joy"><i></i></div><button class="mysl-lance"><b><i></i></b><span>Lancer</span></button>`;
  document.body.appendChild(o);
  // les bruitages et la musique (sauf si le son est coupé dans les paramètres)
  let son = null;
  const musAvant = typeof MUS != 'undefined' && MUS.cur;
  if (typeof S == 'undefined' || S.sound !== false) {
    try {
      if (musAvant) MUS.stop();
      let yt = 0;
      try {
        yt = YTM.on();
      } catch (_) {}
      son = mysSons(new (window.AudioContext || window.webkitAudioContext)(), !yt && (typeof S == 'undefined' || S.music !== false));
    } catch (_) {
      son = null;
    }
  }
  const bruit = (n, ...a) => {
    try {
      son && son[n](...a);
    } catch (_) {}
  };
  const cv = o.querySelector('canvas'),
    c = cv.getContext('2d'),
    tip = o.querySelector('.mysl-tip'),
    joy = o.querySelector('.mysl-joy'),
    btn = o.querySelector('.mysl-lance');
  // --- monde ---
  const CAM = 2.9, // hauteur de la caméra
    CZ = 6, // profondeur de la cheminée
    CX = 0.62, // demi-largeur de la cheminée
    CD = 0.42, // demi-profondeur
    TOP = 1.5, // hauteur du haut de la cheminée
    OX = 0.47, // demi-ouverture (x)
    OZ = 0.32, // demi-ouverture (z)
    G = 9,
    ANG = (48 * Math.PI) / 180, // angle du lancer
    VMIN = 3.6, // force du lancer : jauge vide…
    VMAX = 8, // … et pleine
    REMPLI = 2.4; // secondes pour remplir la jauge
  let W, H, dpr, f, hy, F, rate, fin, raf, t0, fumees, flocons, etoiles, ville, voisins, eclats;
  // Célestine (le personnage qu'on dirige) : elle tient le fichier tant qu'elle ne l'a pas lancé
  let C = { x: 0, z: 2.6, y: 0, vy: 0, ph: 0, v: 0, amp: 0, pen: 0, tient: 1, phi: 0, charge: 0, lanceT: -9 };
  // obstacles posés sur le toit : le fichier bute contre eux (cylindres : x, z, rayon, hauteur)
  // les surprises cachées quand on rate : chaque élément touché fait quelque chose de drôle, puis se remet en place
  const OE = {},
    T = () => performance.now() / 1000,
    age = k => (OE[k] == null ? 99 : T() - OE[k]),
    DUREE = { bonhomme: 7, cadeaux: 6, sapin: 4.5, antenne: 7.5, traineau: 16 },
    SECRETS = {
      bonhomme: 'Le bonhomme de neige s’écroule ! ⛄',
      sapin: 'Le sapin perd ses aiguilles ! 🎄',
      cadeaux: 'Il y avait un chat dans le cadeau ! 🐱',
      antenne: 'Plus de télé chez le voisin ! 📺',
      traineau: 'Tu as fait tomber le Père Noël ! 🎅💥'
    },
    secEl = o.querySelector('.mysl-sec');
  let crash = null;
  const surprise = (k, tp) => {
    if (age(k) < DUREE[k]) return;
    OE[k] = T();
    bruit({ bonhomme: 'eboule', sapin: 'aiguilles', cadeaux: 'miaou', antenne: 'gresille', traineau: 'crash' }[k]);
    let neuf = 0,
      n = 0;
    try {
      S.mysSec = S.mysSec || {};
      neuf = !S.mysSec[k];
      S.mysSec[k] = 1;
      n = Object.keys(S.mysSec).filter(q => SECRETS[q]).length; // seuls les secrets qui existent encore comptent
      if (neuf) {
        save();
        slog('🥚', `Fichier mystère : surprise « ${k} » trouvée (${n}/5)`);
      }
    } catch (_) {}
    secEl.innerHTML = (neuf ? '<i>🥚 Nouveau secret !</i>' : '') + `<b>${SECRETS[k]}</b>` + (n ? `<u>${n}/5</u>` : '');
    secEl.classList.remove('on');
    void secEl.offsetWidth;
    secEl.classList.add('on');
    clearTimeout(surprise.to);
    surprise.to = setTimeout(() => secEl.classList.remove('on'), 3200);
    // des éclats à l'endroit touché
    const ob = OBS.find(q => q.t == k);
    if (ob) {
      const [x, y, sc] = P(ob.x, ob.h * 0.6, ob.z),
        col = {
          bonhomme: ['#ffffff', '#e6eefb'],
          sapin: ['#1f6b45', '#2b7a4f', '#3c9a62', '#ffffff'],
          cadeaux: ['#ffd166', '#ff8fb8', '#ffffff'],
          antenne: ['#ffe066', '#fff3b0', '#ffffff']
        }[k];
      for (let i = 0; i < 46; i++)
        eclats.push({
          x: x + (Math.random() - 0.5) * sc * ob.r * 2,
          y: y + (Math.random() - 0.5) * sc * ob.h * 0.8,
          vx: (Math.random() - 0.5) * 220,
          vy: -40 - Math.random() * 200,
          t: 0.8 + Math.random() * 0.8,
          c: col[i % col.length]
        });
    }
    if (k == 'traineau') crash = { x: tp.x, y: TY, vx: -1.6, vy: 1.4, r: 0, fume: [] };
  };
  const OBS = [
    { t: 'bonhomme', x: -1.3, z: 3.7, r: 0.3, h: 1.05 },
    { t: 'cadeaux', x: 1.2, z: 3.1, r: 0.34, h: 0.55 },
    { t: 'sapin', x: 2.0, z: 7.2, r: 0.45, h: 1.7 },
    { t: 'antenne', x: -1.8, z: 7.4, r: 0.14, h: 1.9 }
  ];
  // rayon réel de chaque élément à une hauteur donnée (le sapin est un cône, le bonhomme trois boules, l'antenne a des barres en haut)
  const rayon = (ob, y) =>
    ob.t == 'sapin'
      ? Math.max(0.06, ob.r * (1 - y / ob.h) + 0.05)
      : ob.t == 'bonhomme'
        ? y < 0.55
          ? 0.3
          : y < 0.88
            ? 0.21
            : 0.14
        : ob.t == 'antenne'
          ? y > ob.h - 0.8
            ? 0.45
            : 0.05
          : ob.r;
  const RIDGE = 8.5, // faîtage : au-delà, le fichier tombe de l'autre côté
    BORD = 0.6; // gouttière (le bas du toit) : au-delà, le fichier tombe du toit
  const taille = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = innerWidth;
    H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    f = Math.min(W * 0.95, H * 0.55);
    hy = H * 0.3;
    voisins = Array.from({ length: Math.ceil((2 * Math.PI * f) / 70) }, (_, i) => ({
      x: i * 70 - 30 + ((i * 23) % 17),
      w: 60 + ((i * 31) % 30),
      h: 16 + ((i * 17) % 14)
    }));
    ville = Array.from({ length: Math.ceil((2 * Math.PI * f) / 14) }, (_, i) => ({
      x: i * 14 - 7,
      h: 10 + ((i * 37) % 23) + (i % 5 == 0 ? 14 : 0),
      w: (i * 13) % 4
    }));
  };
  // caméra : elle suit Célestine, 2,6 m derrière elle, dans l'angle choisi au doigt (V = où elle est, Vt = où elle va, en douceur)
  const V = { x: 0, z: 0, yaw: 0 },
    Vt = { x: 0, z: 0, yaw: 0 };
  const cam = (x, z) => {
    const dx = x - V.x,
      dz = z - V.z,
      co = Math.cos(V.yaw),
      si = Math.sin(V.yaw);
    return [dx * co - dz * si, dx * si + dz * co]; // [à droite, devant]
  };
  const P = (x, y, z) => {
    const [xr, zr] = cam(x, z),
      zz = Math.max(0.05, zr);
    return [W / 2 + (xr * f) / zz, hy - ((y - CAM) * f) / zz, f / zz, zr]; // projection : [x écran, y écran, échelle, profondeur]
  };
  const prof = (x, z) => cam(x, z)[1];
  // polygone du monde (points [x, y, z]) coupé au ras de la caméra, puis dessiné
  const poly = pts => {
    const q = pts.map(([x, y, z]) => [...cam(x, z), y]),
      out = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[i],
        b = q[(i + 1) % q.length],
        ia = a[1] >= 0.12,
        ib = b[1] >= 0.12;
      if (ia) out.push(a);
      if (ia != ib) {
        const k = (0.12 - a[1]) / (b[1] - a[1]);
        out.push([a[0] + (b[0] - a[0]) * k, 0.12, a[2] + (b[2] - a[2]) * k]);
      }
    }
    c.beginPath();
    out.forEach(([xr, zr, y], i) => {
      const px = W / 2 + (xr * f) / zr,
        py = hy - ((y - CAM) * f) / zr;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    });
    c.closePath();
    return out.length > 2;
  };
  // le ciel et la ville au loin forment un panorama tout autour (PW = un tour complet, en pixels)
  const pano = (px, marge = 120) => {
    const PW = 2 * Math.PI * f;
    let x = (((px - V.yaw * f) % PW) + PW) % PW;
    if (x > PW - marge) x -= PW;
    return x < W + marge ? x : null;
  };
  // nouveau fichier : il apparaît dans la main de Célestine
  const nouveau = () => (
    bruit('glisse', 0),
    (F = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, a: 0, va: 0, vol: 0, in: 0, sol: 0, t: 0, arret: 0, al: 1, ent: 1, tombe: 0 }),
    (C.tient = 1)
  );
  taille();
  nouveau();
  rate = fin = 0;
  fumees = [];
  eclats = [];
  etoiles = Array.from({ length: 560 }, () => ({
    x: Math.random() * 7, // en « largeurs d'écran » autour du panorama
    y: Math.random() * 0.33,
    r: Math.random() * 1.3 + 0.3,
    p: Math.random() * 6
  }));
  flocons = Array.from({ length: 110 }, () => ({ x: Math.random(), y: Math.random(), d: 0.3 + Math.random() * 0.7, p: Math.random() * 6 }));
  addEventListener('resize', taille);

  /* ===================== dessin ===================== */
  const ciel = t => {
    let g = c.createLinearGradient(0, 0, 0, hy + 40);
    g.addColorStop(0, '#070d22');
    g.addColorStop(0.6, '#172a58');
    g.addColorStop(1, '#3b4f8c');
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
    etoiles.forEach(s => {
      const sx = pano((s.x / 7) * 2 * Math.PI * f, 4);
      if (sx == null) return;
      c.globalAlpha = 0.45 + 0.4 * Math.sin(t * 2 + s.p);
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(sx, s.y * H, s.r, 0, 7);
      c.fill();
    });
    c.globalAlpha = 1;
    const mx = pano(W * 0.8),
      my = H * 0.13;
    if (mx == null) return;
    g = c.createRadialGradient(mx, my, 10, mx, my, 90);
    g.addColorStop(0, '#fff6d655');
    g.addColorStop(1, '#fff6d600');
    c.fillStyle = g;
    c.fillRect(mx - 90, my - 90, 180, 180);
    c.fillStyle = '#fbf3d6';
    c.beginPath();
    c.arc(mx, my, 22, 0, 7);
    c.fill();
    c.fillStyle = '#e9dfbd';
    [
      [-6, -4, 5],
      [7, 5, 4],
      [-2, 9, 3]
    ].forEach(([a, b, r]) => {
      c.beginPath();
      c.arc(mx + a, my + b, r, 0, 7);
      c.fill();
    });
  };
  const lyon = () => {
    // colline de Fourvière et sa basilique, puis les toits de la ville, tout autour
    const base = hy + 6,
      fx = pano(0, W * 0.35);
    c.fillStyle = '#121d3f';
    if (fx != null) {
      c.beginPath();
      c.moveTo(fx, base);
      c.quadraticCurveTo(fx + W * 0.12, base - 52, fx + W * 0.3, base - 30);
      c.lineTo(fx + W * 0.3, base);
      c.fill();
      const bx = fx + W * 0.15,
        by = base - 50;
      c.fillRect(bx - 18, by - 12, 36, 14);
      c.fillRect(bx - 18, by - 22, 6, 12);
      c.fillRect(bx + 12, by - 22, 6, 12);
      c.fillRect(bx - 4, by - 18, 8, 8);
      c.fillStyle = '#ffd27a';
      c.fillRect(bx - 1, by - 8, 2, 3);
    }
    ville.forEach((b, i) => {
      const x = pano(b.x, 20);
      if (x == null) return;
      c.fillStyle = '#18264f';
      c.fillRect(x, base - b.h, 13, b.h + 4);
      if (b.w == 1) c.fillRect(x + 3, base - b.h - 5, 3, 5);
      c.fillStyle = '#ffcf6e';
      if (i % 3 == 0) c.fillRect(x + 3, base - b.h + 4, 2.5, 2.5);
      if (i % 4 == 1) c.fillRect(x + 8, base - b.h + 9, 2.5, 2.5);
    });
  };
  const toit = () => {
    // le bas des maisons voisines (on le voit quand on regarde le long du toit)
    c.fillStyle = '#1a2850';
    c.fillRect(0, hy + 30, W, H);
    // l'autre pan du toit, qui redescend derrière le faîtage (on le voit quand la caméra est tout en haut)
    if (
      V.z > RIDGE - 3 &&
      poly([
        [-9, 0, RIDGE],
        [9, 0, RIDGE],
        [9, -5, RIDGE + 9],
        [-9, -5, RIDGE + 9]
      ])
    ) {
      c.fillStyle = '#b9c7e2';
      c.fill();
    }
    // pan de toit enneigé
    if (
      poly([
        [-9, 0, 0.6],
        [9, 0, 0.6],
        [9, 0, RIDGE],
        [-9, 0, RIDGE]
      ])
    ) {
      const g = c.createLinearGradient(0, hy + 20, 0, H);
      g.addColorStop(0, '#c9d6ee');
      g.addColorStop(1, '#f4f8ff');
      c.fillStyle = g;
      c.fill();
    }
    // rangées de tuiles qui dépassent de la neige
    c.strokeStyle = '#9fb0cf';
    c.lineWidth = 1;
    c.globalAlpha = 0.5;
    for (let z = 1; z < RIDGE; z *= 1.16) {
      c.beginPath();
      let on = 0;
      for (let x = -9; x <= 9; x += 0.3) {
        const [px, py, sc, d] = P(x, 0, z);
        if (d < 0.3) {
          on = 0;
          continue;
        }
        on ? c.lineTo(px, py) : c.moveTo(px, py);
        on = 1;
      }
      c.stroke();
    }
    c.globalAlpha = 1;
    // bords du toit enneigés : faîtage, gouttière, côtés
    c.strokeStyle = '#e9eff9';
    c.lineWidth = 5;
    [
      [-9, RIDGE, 9, RIDGE],
      [-9, 0.6, 9, 0.6],
      [-9, 0.6, -9, RIDGE],
      [9, 0.6, 9, RIDGE]
    ].forEach(([x1, z1, x2, z2]) => {
      if (
        poly([
          [x1, 0, z1],
          [x2, 0, z2],
          [x2, 0.06, z2],
          [x1, 0.06, z1]
        ])
      ) {
        c.fillStyle = '#e9eff9';
        c.fill();
      }
    });
    guirlandeFaite(performance.now() / 1000);
  };
  const ouverture = () => {
    c.beginPath();
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI * 2,
        [x, y] = P(Math.cos(t) * OX, TOP, CZ + Math.sin(t) * OZ);
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.closePath();
  };
  // les 4 côtés de la cheminée : coins du bas (x, z) et sens vers l'extérieur
  const FACES = [
    [
      [-CX, CZ - CD],
      [CX, CZ - CD],
      [0, -1]
    ],
    [
      [CX, CZ - CD],
      [CX, CZ + CD],
      [1, 0]
    ],
    [
      [CX, CZ + CD],
      [-CX, CZ + CD],
      [0, 1]
    ],
    [
      [-CX, CZ + CD],
      [-CX, CZ - CD],
      [-1, 0]
    ]
  ];
  const faceVue = ([a, b, [nx, nz]]) => nx * (V.x - (a[0] + b[0]) / 2) + nz * (V.z - (a[1] + b[1]) / 2) > 0;
  const briques = ([a, b, [nx]]) => {
    // un côté en briques, vu sous n'importe quel angle
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]),
      at = (u, y) => P(a[0] + (b[0] - a[0]) * u, y, a[1] + (b[1] - a[1]) * u);
    poly([
      [a[0], 0, a[1]],
      [b[0], 0, b[1]],
      [b[0], TOP, b[1]],
      [a[0], TOP, a[1]]
    ]);
    const [x0] = at(0, 0),
      [x1] = at(1, 0),
      g = c.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, nx ? '#94382a' : '#b4462f');
    g.addColorStop(1, nx ? '#7d2f22' : '#9a3b28');
    c.fillStyle = g;
    c.fill();
    const sc = at(0.5, 0)[2];
    c.strokeStyle = '#6e2619';
    c.lineWidth = Math.max(0.6, sc * 0.012);
    for (let r = 0, y = 0; y < TOP - 0.01; r++, y += 0.11) {
      const p = at(0, y),
        q = at(1, y);
      c.beginPath();
      c.moveTo(p[0], p[1]);
      c.lineTo(q[0], q[1]);
      for (let u = ((r % 2) * 0.13) / L; u < 1; u += 0.26 / L) {
        const m = at(u, y),
          n = at(u, Math.min(TOP, y + 0.11));
        c.moveTo(m[0], m[1]);
        c.lineTo(n[0], n[1]);
      }
      c.stroke();
    }
    // neige accumulée au pied
    const p1 = P(a[0] + (a[0] - b[0]) * 0.12, 0, a[1] + (a[1] - b[1]) * 0.12),
      p2 = P(b[0] + (b[0] - a[0]) * 0.12, 0, b[1] + (b[1] - a[1]) * 0.12);
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(p1[0], p1[1]);
    c.quadraticCurveTo((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 - sc * 0.16, p2[0], p2[1]);
    c.fill();
  };
  // la cheminée entière : dessus, braise au fond, fichier qui tombe dedans, puis les côtés visibles
  const cheminee = (t, dedans) => {
    c.fillStyle = '#8796b833';
    const [sx, sy, ss] = P(0.35, 0, CZ + 0.6);
    c.beginPath();
    c.ellipse(sx, sy, ss * 0.9, ss * 0.18, 0, 0, 7);
    c.fill();
    // couronne de pierre et neige
    const E = 0.06;
    poly([
      [-CX - E, TOP, CZ - CD - E],
      [CX + E, TOP, CZ - CD - E],
      [CX + E, TOP, CZ + CD + E],
      [-CX - E, TOP, CZ + CD + E]
    ]);
    c.fillStyle = '#e4eaf3';
    c.fill();
    ouverture();
    const [ox, oy, os] = P(0, TOP, CZ),
      g = c.createRadialGradient(ox, oy + os * 0.05, 2, ox, oy, os * 0.5);
    g.addColorStop(0, '#ff9a3c');
    g.addColorStop(0.35, '#5a1a0c');
    g.addColorStop(1, '#120606');
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = '#6a6f7c';
    c.lineWidth = Math.max(1, os * 0.03);
    c.stroke();
    if (dedans) dedans();
    FACES.filter(faceVue).forEach(fa => {
      briques(fa);
      // rebord de pierre au-dessus du côté
      const [a, b, [nx, nz]] = fa;
      poly([
        [a[0] + nx * E - nz * E, TOP - 0.02, a[1] + nz * E + nx * E],
        [b[0] + nx * E + nz * E, TOP - 0.02, b[1] + nz * E - nx * E],
        [b[0] + nx * E + nz * E, TOP + 0.05, b[1] + nz * E - nx * E],
        [a[0] + nx * E - nz * E, TOP + 0.05, a[1] + nz * E + nx * E]
      ]);
      c.fillStyle = '#d8dee8';
      c.fill();
      // neige en festons sur le rebord
      const p = P(a[0] + nx * E, TOP + 0.05, a[1] + nz * E),
        q = P(b[0] + nx * E, TOP + 0.05, b[1] + nz * E),
        sc = (p[2] + q[2]) / 2;
      c.fillStyle = '#ffffff';
      c.beginPath();
      c.moveTo(p[0], p[1]);
      for (let i = 1; i <= 10; i++) {
        const xx = p[0] + ((q[0] - p[0]) * i) / 10,
          yy = p[1] + ((q[1] - p[1]) * i) / 10;
        c.quadraticCurveTo(xx - (q[0] - p[0]) / 20, yy - sc * (0.05 + (i % 3) * 0.015), xx, yy - sc * 0.01);
      }
      c.lineTo(q[0], q[1] + sc * 0.03);
      c.lineTo(p[0], p[1] + sc * 0.03);
      c.fill();
    });
    // petite fumée tranquille
    if (Math.random() < 0.12) fumees.push({ x: (Math.random() - 0.5) * 0.3, y: TOP + 0.05, z: CZ, r: 0.08, a: 0.35, v: 0.35 });
  };
  const rr = (x, y, w, h, r) => {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  };
  const ombre = () => {
    if (F.in) return;
    const [x, y, s, d] = P(F.x, 0, F.z);
    if (d < 0.3 || y > H + 20) return;
    if (F.tombe || F.al <= 0) return;
    const k = Math.max(0.15, 1 - F.y / 4) * Math.min(1, F.al);
    c.fillStyle = `rgba(60,75,110,${0.28 * k})`;
    c.beginPath();
    c.ellipse(x, y, s * 0.17 * k + 2, s * 0.045 * k + 1, 0, 0, 7);
    c.fill();
  };
  const photoDessin = () => {
    // la vraie photo, en tirage avec un bord blanc (format conservé)
    const im = vis.im,
      iw = im.naturalWidth || im.width,
      ih = im.naturalHeight || im.height,
      r = iw / ih,
      M = 62,
      pw = r >= 1 ? M : M * r,
      ph = r >= 1 ? M / r : M,
      b = 4;
    c.shadowColor = '#0006';
    c.shadowBlur = 16;
    c.shadowOffsetY = 8;
    c.fillStyle = '#fbfaf6';
    c.fillRect(-pw / 2 - b, -ph / 2 - b, pw + 2 * b, ph + 2 * b + (vis.video ? 0 : 6));
    c.shadowColor = 'transparent';
    c.drawImage(im, -pw / 2, -ph / 2, pw, ph);
    c.strokeStyle = '#0002';
    c.lineWidth = 0.6;
    c.strokeRect(-pw / 2, -ph / 2, pw, ph);
    if (vis.video) {
      c.fillStyle = '#000a';
      c.beginPath();
      c.arc(0, 0, 9, 0, 7);
      c.fill();
      c.fillStyle = '#fff';
      c.beginPath();
      c.moveTo(-3, -5);
      c.lineTo(6, 0);
      c.lineTo(-3, 5);
      c.fill();
    }
  };
  const docDessin = () => {
    // document générique : coin plié, bandeau de couleur du type, icône, extension et nom
    c.shadowColor = '#0005';
    c.shadowBlur = 16;
    c.shadowOffsetY = 8;
    c.fillStyle = '#fdfdfb';
    c.beginPath();
    c.moveTo(-25, -32);
    c.lineTo(11, -32);
    c.lineTo(25, -18);
    c.lineTo(25, 32);
    c.lineTo(-25, 32);
    c.closePath();
    c.fill();
    c.shadowColor = 'transparent';
    c.fillStyle = '#d6dbe3';
    c.beginPath();
    c.moveTo(11, -32);
    c.lineTo(11, -18);
    c.lineTo(25, -18);
    c.closePath();
    c.fill();
    c.fillStyle = vis.col;
    c.font = `800 ${vis.ico.length > 1 ? 11 : 20}px system-ui,sans-serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(vis.ico, 0, -10);
    c.fillStyle = '#d3d8e0';
    [4, 9].forEach((l, i) => rr(-17, l, i ? 22 : 34, 2.4, 1.2) || c.fill());
    c.fillStyle = vis.col;
    rr(-19, 16, 38, 11, 2);
    c.fill();
    c.fillStyle = '#fff';
    c.font = '800 7px system-ui,sans-serif';
    c.fillText('.' + vis.ext, 0, 21.8);
    c.textBaseline = 'alphabetic';
  };
  const fichier = () => {
    const [x, y, s, d] = P(F.x, F.y, F.z),
      k = s * 0.0042; // le fichier mesure ~ 50 × 64 « unités » à 1 m
    if (F.al <= 0 || d < 0.15) return;
    c.save();
    c.globalAlpha = Math.max(0, Math.min(1, F.al));
    c.translate(x, y);
    c.rotate(F.a);
    c.scale(k, k);
    if (vis.k == 'photo') {
      photoDessin();
      c.restore();
      return;
    }
    if (vis.k == 'doc') {
      docDessin();
      c.restore();
      return;
    }
    c.shadowColor = '#0005';
    c.shadowBlur = 16;
    c.shadowOffsetY = 8;
    c.fillStyle = '#fdfdfb';
    c.beginPath();
    c.moveTo(-25, -32);
    c.lineTo(11, -32);
    c.lineTo(25, -18);
    c.lineTo(25, 32);
    c.lineTo(-25, 32);
    c.closePath();
    c.fill();
    c.shadowColor = 'transparent';
    let g = c.createLinearGradient(-25, -32, 25, 32);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#e8ebf0');
    c.fillStyle = g;
    c.fill();
    c.fillStyle = '#d6dbe3';
    c.beginPath();
    c.moveTo(11, -32);
    c.lineTo(11, -18);
    c.lineTo(25, -18);
    c.closePath();
    c.fill();
    c.fillStyle = '#d3d8e0';
    [-20, -13, -6].forEach((l, i) => rr(-17, l, i == 2 ? 20 : 30, 3, 1.5) || c.fill());
    // ruban rouge et nœud
    c.fillStyle = '#c8243b';
    c.fillRect(-25, 3, 50, 7);
    c.fillRect(-4, -32, 8, 64);
    c.fillStyle = '#e23b52';
    c.beginPath();
    c.ellipse(-7, 2, 8, 5, -0.5, 0, 7);
    c.ellipse(7, 2, 8, 5, 0.5, 0, 7);
    c.fill();
    c.fillStyle = '#a81b30';
    c.beginPath();
    c.arc(0, 4, 3.5, 0, 7);
    c.fill();
    c.fillStyle = '#2f8f5b';
    rr(-17, 17, 34, 10, 2);
    c.fill();
    c.fillStyle = '#fff';
    c.font = '800 7px system-ui,sans-serif';
    c.textAlign = 'center';
    c.fillText('.AVENT', 0, 24.5);
    c.restore();
  };
  const particules = dt => {
    fumees = fumees.filter(p => (p.a -= dt * 0.25) > 0);
    fumees.forEach(p => {
      p.y += p.v * dt;
      p.r += dt * 0.12;
      p.x += Math.sin(p.y * 3) * dt * 0.05;
      const [x, y, s, d] = P(p.x, p.y, p.z);
      if (d < 0.3) return;
      c.fillStyle = `rgba(225,232,245,${p.a})`;
      c.beginPath();
      c.arc(x, y, p.r * s, 0, 7);
      c.fill();
    });
    eclats = eclats.filter(e => (e.t -= dt) > 0);
    eclats.forEach(e => {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      e.vy += 300 * dt;
      c.fillStyle = e.c;
      c.globalAlpha = Math.min(1, e.t * 2);
      c.fillRect(e.x, e.y, 3, 3);
    });
    c.globalAlpha = 1;
  };
  const neige = (dt, avant) => {
    c.fillStyle = '#fff';
    flocons.forEach(s => {
      if (avant != s.d > 0.75) return;
      s.y += dt * (0.03 + s.d * 0.06);
      s.p += dt;
      if (s.y > 1.02) ((s.y = -0.02), (s.x = Math.random()));
      c.globalAlpha = 0.35 + s.d * 0.5;
      c.beginPath();
      c.arc(s.x * W + Math.sin(s.p) * 8 * s.d, s.y * H, 0.6 + s.d * 2.2, 0, 7);
      c.fill();
    });
    c.globalAlpha = 1;
  };

  /* ---------- décors ajoutés : toits voisins, traîneau, guirlandes, obstacles, premier plan ---------- */
  const COUL = ['#ff5a5f', '#ffd166', '#06d6a0', '#4cc9f0', '#f78cff'];
  const ampoule = (x, y, r, col, on) => {
    if (on) {
      const g = c.createRadialGradient(x, y, 0, x, y, r * 4);
      g.addColorStop(0, col + 'aa');
      g.addColorStop(1, col + '00');
      c.fillStyle = g;
      c.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
    }
    c.fillStyle = on ? col : '#55607a';
    c.beginPath();
    c.ellipse(x, y + r * 0.3, r * 0.7, r, 0, 0, 7);
    c.fill();
    c.fillStyle = '#2a2f3a';
    c.fillRect(x - r * 0.4, y - r * 0.9, r * 0.8, r * 0.5);
  };
  const voisinsDessin = t => {
    // une rangée de toits voisins enneigés, avec leurs fenêtres allumées
    const base = hy + 30;
    voisins.forEach((v0, i) => {
      const x = pano(v0.x, v0.w + 10);
      if (x == null) return;
      const v = { ...v0, x };
      c.fillStyle = '#1d2c5a';
      c.fillRect(v.x, base - v.h, v.w, v.h + 40);
      c.beginPath();
      c.moveTo(v.x - 4, base - v.h);
      c.lineTo(v.x + v.w / 2, base - v.h - 16);
      c.lineTo(v.x + v.w + 4, base - v.h);
      c.closePath();
      c.fillStyle = '#263a70';
      c.fill();
      c.strokeStyle = '#dfe8f8';
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(v.x - 4, base - v.h);
      c.lineTo(v.x + v.w / 2, base - v.h - 16);
      c.lineTo(v.x + v.w + 4, base - v.h);
      c.stroke();
      for (let k = 0; k < 3; k++) {
        const on = (i * 7 + k * 3) % 5 != 0,
          tele = i == 1 && k == 1 && age('antenne') < DUREE.antenne;
        c.fillStyle = tele ? ['#e8f0ff', '#8fb0ff', '#ffffff', '#4a5f9a'][Math.floor(Math.random() * 4)] : on ? '#ffcf73' : '#33447a';
        c.fillRect(v.x + 8 + k * (v.w / 3.2), base - v.h + 8, 7, 9);
      }
      if (i % 3 == 1) {
        c.fillStyle = '#1d2c5a';
        c.fillRect(v.x + v.w * 0.7, base - v.h - 18, 7, 12);
        c.fillStyle = '#dfe8f8';
        c.fillRect(v.x + v.w * 0.7 - 1, base - v.h - 19, 9, 2.5);
      }
    });
  };
  // le traîneau du Père Noël survole le toit toutes les 13 s, lentement, juste devant les maisons (sauf s'il vient de s'écraser)
  const TY = 1.75, // son altitude
    TZ = 7.6, // sa profondeur
    TL = 110; // sa longueur dans le dessin
  const traineauPos = t => {
    if (age('traineau') < DUREE.traineau) return null;
    const k = (t % 13) / 10;
    if (k > 1) return null;
    return { x: 6.5 - k * 13, y: TY + Math.sin(k * 6) * 0.12 };
  };
  const traineauDessin = (x, y, rot, t, sc, ex = 1) => {
    // ex : il vole vers -x ; vu de face ou de dos il paraît plus court, et retourné vu de l'autre côté
    c.save();
    c.translate(x, y);
    c.scale(sc * ex, sc);
    c.rotate(rot);
    for (let r = 0; r < 4; r++) {
      c.fillStyle = '#7a4e2c';
      const rx = -20 - r * 22,
        ry = Math.sin(t * 8 + r) * 2;
      c.beginPath();
      c.ellipse(rx, ry, 8, 3.5, 0, 0, 7);
      c.fill();
      c.fillRect(rx - 6, ry, 1.6, 6);
      c.fillRect(rx + 4, ry, 1.6, 6);
      c.fillRect(rx - 8, ry - 7, 2, 6);
      c.beginPath();
      c.ellipse(rx - 10, ry - 7.5, 3.2, 2, -0.2, 0, 7);
      c.fill();
      c.fillStyle = '#d9b98a';
      c.beginPath();
      c.moveTo(rx - 9, ry - 7);
      c.lineTo(rx - 13, ry - 11);
      c.lineTo(rx - 7, ry - 9);
      c.fill();
      if (r == 3) {
        // Rudolph et son nez rouge
        c.fillStyle = '#ff3b3b';
        c.beginPath();
        c.arc(rx - 13, ry - 7, 1.4, 0, 7);
        c.fill();
      }
    }
    c.strokeStyle = '#e0b84a';
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(-16, 0);
    c.lineTo(6, 2);
    c.stroke();
    c.fillStyle = '#7a1424';
    c.beginPath();
    c.moveTo(4, 6);
    c.quadraticCurveTo(6, -4, 22, -2);
    c.lineTo(24, 6);
    c.closePath();
    c.fill();
    c.fillStyle = '#c0233a';
    c.beginPath();
    c.arc(18, -6, 4, 0, 7);
    c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.arc(18, -10, 2, 0, 7);
    c.fill();
    c.restore();
  };
  // longueur du traîneau en mètres (rennes compris) : 4,6 m, dont 0,8 m de traîneau à droite
  const traineauEchelle = s => (s * 4.6) / TL;
  // sens et raccourci du traîneau vu depuis la caméra (1 = de profil vers la gauche, comme dans la vue de départ)
  const sens = (tx, ty, s) => {
    const k = (P(tx, ty, TZ)[0] - P(tx - 1, ty, TZ)[0]) / s;
    return Math.sign(k || 1) * Math.max(0.22, Math.abs(k));
  };
  const traineau = (t, dt) => {
    const tp = traineauPos(t);
    if (tp) {
      const [x, y, s, d] = P(tp.x, tp.y, TZ);
      if (d < 6) return; // trop près de la caméra : il passe au-dessus de nous
      return traineauDessin(x, y, 0, t, traineauEchelle(s), sens(tp.x, tp.y, s));
    }
    if (!crash || prof(crash.x, TZ) < 1) return;
    // touché : il tournoie et s'écrase sur le toit
    if (!crash.boum) {
      crash.vy -= G * dt;
      crash.x += crash.vx * dt;
      crash.y += crash.vy * dt;
      crash.r += dt * 5;
      if (Math.random() < 0.6) crash.fume.push({ x: crash.x, y: crash.y, r: 0.08, a: 0.6 });
      if (crash.y <= 0.1) {
        crash.y = 0.1;
        crash.boum = T();
        bruit('boum');
        for (let i = 0; i < 16; i++)
          crash.fume.push({ x: crash.x + (Math.random() - 0.5) * 1.6, y: Math.random() * 0.3, r: 0.18 + Math.random() * 0.2, a: 0.8 });
      }
    }
    crash.fume = crash.fume.filter(f => (f.a -= dt * 0.35) > 0);
    crash.fume.forEach(f => {
      f.r += dt * 0.25;
      f.y += dt * 0.3;
      const [x, y, s] = P(f.x, f.y, TZ);
      c.fillStyle = `rgba(220,228,245,${f.a})`;
      c.beginPath();
      c.arc(x, y, f.r * s, 0, 7);
      c.fill();
    });
    const [x, y, s] = P(crash.x, crash.y, TZ);
    if (!crash.boum) traineauDessin(x, y, crash.r, t, traineauEchelle(s), sens(crash.x, crash.y, s));
    else if (T() - crash.boum < 3.5) {
      // les jambes du Père Noël dépassent de la neige (et gigotent)
      c.globalAlpha = Math.min(1, (3.5 - (T() - crash.boum)) * 2);
      const k = s * 0.0042,
        g = Math.sin(T() * 12) * 2;
      c.save();
      c.translate(x, y);
      c.scale(k, k);
      c.fillStyle = '#c0233a';
      c.fillRect(-9, -40, 7, 38);
      c.fillRect(3 + g * 0.3, -36, 7, 34);
      c.fillStyle = '#ffffff';
      c.fillRect(-10, -44, 9, 6);
      c.fillRect(2 + g * 0.3, -40, 9, 6);
      c.fillStyle = '#1b1b22';
      c.fillRect(-12 + g, -54, 12, 10);
      c.fillRect(1 + g, -50, 12, 10);
      c.restore();
      c.globalAlpha = 1;
    }
  };
  const guirlandeFaite = t => {
    // guirlande d'ampoules le long du faîtage
    for (let x = -8.6; x <= 8.6; x += 0.45) {
      const [px, py, s, d] = P(x, 0.02 + Math.abs(Math.sin(x * 3.5)) * 0.05, RIDGE);
      if (d < 0.3 || px < -10 || px > W + 10) continue;
      const i = Math.round(x / 0.45);
      ampoule(px, py - s * 0.02, Math.max(1.3, s * 0.03), COUL[(i + 50) % 5], Math.sin(t * 2.5 + i) > -0.4);
    }
  };
  // avancement d'une surprise : 0 = normal, 1 = chamboulé (vite), puis retour en place à la fin
  const chambou = (k, monte = 0.45, retour = 1.3) => {
    const a = age(k),
      d = DUREE[k];
    if (a >= d) return 0;
    if (a < monte) {
      const u = a / monte;
      return 1 - (1 - u) * (1 - u);
    }
    if (a > d - retour) {
      const u = (a - (d - retour)) / retour;
      return 1 - u * u * (3 - 2 * u);
    }
    return 1;
  };
  const obstacle = (ob, t) => {
    const [x, y, s, d] = P(ob.x, 0, ob.z);
    if (d < 0.4) return; // derrière la caméra
    // outils 3D autour de l'objet : point (dx, y, dz) → écran, et « ce côté est-il tourné vers nous ? »
    const Q = (dx, yy, dz) => P(ob.x + dx, yy, ob.z + dz),
      vu = (nx, ny, nz, cx = 0, cy = 0, cz = 0) => nx * (V.x - ob.x - cx) + ny * (CAM - cy) + nz * (V.z - ob.z - cz) > 0,
      cercle = (cx, yy, cz, r, n = 20) => {
        c.beginPath();
        for (let i = 0; i <= n; i++) {
          const a = (i / n) * Math.PI * 2,
            [px, py] = Q(cx + Math.cos(a) * r, yy, cz + Math.sin(a) * r);
          i ? c.lineTo(px, py) : c.moveTo(px, py);
        }
        c.closePath();
      };
    // ombre
    c.fillStyle = '#7d8db033';
    cercle(0.1, 0, 0.1, ob.r * 1.25);
    c.fill();
    if (ob.t == 'bonhomme') {
      // trois boules de neige ; son visage regarde vers le bas du toit (vers la vue de départ).
      // Il s'écroule : les boules roulent, le chapeau tombe, puis il se reconstruit.
      const p = chambou('bonhomme'),
        L = (a, b) => a + (b - a) * p,
        B = [
          [L(0, -0.02), L(0.28, 0.22), 0.3],
          [L(0, 0.42), L(0.7, 0.21), 0.21],
          [L(0, -0.58), L(0.98, 0.14), 0.14]
        ],
        rot = -p * 2.4, // la tête qui roule
        tourne = ([a, b, cc]) => [a * Math.cos(rot) - b * Math.sin(rot), a * Math.sin(rot) + b * Math.cos(rot), cc],
        boule = ([bx, by, r], ec = 0) => {
          const [px, py, sc] = Q(bx, by, 0),
            rr = r * sc,
            g = c.createRadialGradient(px - rr * 0.35, py - rr * 0.4, rr * 0.1, px, py, rr);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(1, '#c3d0e8');
          c.fillStyle = g;
          c.beginPath();
          c.ellipse(px, py, rr * (1 + ec), rr * (1 - ec), 0, 0, 7);
          c.fill();
        },
        // un détail posé sur une boule (direction depuis son centre), dessiné seulement s'il est de notre côté
        sur = ([bx, by, r], [nx, ny, nz], dessin) => {
          if (!vu(nx, ny, nz, bx + nx * r, by + ny * r, nz * r)) return;
          const [px, py, sc] = Q(bx + nx * r, by + ny * r, nz * r);
          dessin(px, py, sc);
        },
        point = (px, py, sc) => {
          c.fillStyle = '#1b1b22';
          c.beginPath();
          c.arc(px, py, Math.max(0.8, sc * 0.018), 0, 7);
          c.fill();
        },
        bras = (q, derriere) => {
          const a0 = [L(q * 0.18, q * 0.95), L(0.72, 0.03), 0],
            a1 = [L(q * 0.42, q * 1.22), L(0.88, 0.06), 0],
            dd = prof(ob.x + a1[0], ob.z) - prof(ob.x, ob.z);
          if (derriere != dd > 0) return;
          const [ax, ay, sc] = Q(...a0),
            [bx, by] = Q(...a1);
          c.strokeStyle = '#6b4a2b';
          c.lineWidth = Math.max(1, sc * 0.016);
          c.beginPath();
          c.moveTo(ax, ay);
          c.lineTo(bx, by);
          c.lineTo(bx + (q * sc * 0.04 * (bx > ax ? 1 : -1)) / 2, by - sc * 0.05);
          c.stroke();
        };
      bras(-1, true);
      bras(1, true);
      boule(B[0], p * 0.16);
      sur(B[0], [0, 0.45, -0.89], point);
      boule(B[1]);
      sur(B[1], [0, 0.25, -0.97], point);
      sur(B[1], [0, -0.2, -0.98], point);
      // écharpe : un anneau autour du cou et un pan qui pend
      if (p < 0.5) {
        const [, , sc] = Q(0, 0.86, 0);
        c.strokeStyle = '#c0233a';
        c.lineWidth = Math.max(1.5, sc * 0.055);
        cercle(B[1][0], B[1][1] + 0.16, 0, 0.155, 18);
        c.stroke();
        const [tx, ty] = Q(B[1][0] + 0.09, B[1][1] + 0.14, -0.12),
          [ux, uy] = Q(B[1][0] + 0.12, B[1][1] - 0.04, -0.17);
        if (vu(0.5, 0, -0.85)) {
          c.lineWidth = Math.max(1.5, sc * 0.05);
          c.beginPath();
          c.moveTo(tx, ty);
          c.lineTo(ux, uy);
          c.stroke();
        }
      }
      boule(B[2]);
      const yeux = [
        [-0.38, 0.25, -0.89],
        [0.38, 0.25, -0.89]
      ].map(tourne);
      yeux.forEach(n => sur(B[2], n, point));
      // nez en carotte, qui pointe vers l'avant
      const nb = tourne([0, 0, -1]),
        nt = tourne([0, -0.12, -1.9]);
      if (vu(nb[0] + 0.0001, nb[1], nb[2] + 0.35)) {
        const [bx0, by0, sc] = Q(B[2][0] + nb[0] * B[2][2], B[2][1] + nb[1] * B[2][2], nb[2] * B[2][2]),
          [tx0, ty0] = Q(B[2][0] + nt[0] * B[2][2], B[2][1] + nt[1] * B[2][2], nt[2] * B[2][2]);
        c.fillStyle = '#f28c28';
        c.beginPath();
        c.moveTo(bx0, by0 - sc * 0.02);
        c.lineTo(tx0, ty0);
        c.lineTo(bx0, by0 + sc * 0.02);
        c.closePath();
        c.fill();
      }
      // chapeau haut-de-forme (un vrai cylindre)
      const hx = L(0, 0.8),
        hy0 = L(1.1, 0.04),
        [hpx, hpy, hs] = Q(hx, hy0, 0),
        [, hpt] = Q(hx, hy0 + 0.16, 0);
      c.save();
      c.translate(hpx, hpy);
      c.rotate(p * 1.9);
      c.translate(-hpx, -hpy);
      c.fillStyle = '#1b1b22';
      cercle(hx, hy0, 0, 0.14, 18);
      c.fill();
      c.fillRect(hpx - hs * 0.085, hpt, hs * 0.17, hpy - hpt);
      cercle(hx, hy0 + 0.16, 0, 0.085, 14);
      c.fillStyle = '#2e2e38';
      c.fill();
      c.fillStyle = '#c0233a';
      c.fillRect(hpx - hs * 0.085, hpy - hs * 0.045, hs * 0.17, hs * 0.03);
      c.restore();
      bras(-1, false);
      bras(1, false);
    } else if (ob.t == 'cadeaux') {
      // de vraies boîtes : on voit le dessus et les côtés tournés vers nous, rubans et nœuds compris
      const boite = (cx, cz, w, dd, h, an, col, rub, y0 = 0, couv = 0) => {
        const co = Math.cos(an),
          si = Math.sin(an),
          pt = (u, v, yy) => [cx + u * co - v * si, yy, cz + u * si + v * co],
          coins = [
            [-w / 2, -dd / 2],
            [w / 2, -dd / 2],
            [w / 2, dd / 2],
            [-w / 2, dd / 2]
          ];
        // côtés visibles, avec leur ruban vertical et horizontal
        for (let i = 0; i < 4; i++) {
          const a = coins[i],
            b = coins[(i + 1) % 4],
            mu = (a[0] + b[0]) / 2,
            mv = (a[1] + b[1]) / 2,
            nl = Math.hypot(mu, mv),
            nx = (mu * co - mv * si) / nl,
            nz = (mu * si + mv * co) / nl;
          if (!vu(nx, 0, nz, cx + nx * 0.1, y0 + h / 2, cz + nz * 0.1)) continue;
          const lum = 0.78 + 0.22 * (-nx * 0.5 - nz * 0.86);
          poly(
            [pt(a[0], a[1], y0), pt(b[0], b[1], y0), pt(b[0], b[1], y0 + h), pt(a[0], a[1], y0 + h)].map(([px, py, pz]) => [
              ob.x + px,
              py,
              ob.z + pz
            ])
          );
          c.fillStyle = col;
          c.fill();
          c.fillStyle = `rgba(0,0,0,${(1 - lum) * 0.9})`;
          c.fill();
          const at = (k, yy) => pt(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, yy),
            bande = (k0, k1, ya, yb) =>
              poly([at(k0, ya), at(k1, ya), at(k1, yb), at(k0, yb)].map(([px, py, pz]) => [ob.x + px, py, ob.z + pz]));
          c.fillStyle = rub;
          bande(0.44, 0.56, y0, y0 + h);
          c.fill();
          bande(0, 1, y0 + h * 0.5, y0 + h * 0.6);
          c.fill();
        }
        // dessus (un peu de neige) et croix du ruban
        const haut = coins.map(([u, v]) => pt(u, v, y0 + h)).map(([px, py, pz]) => [ob.x + px, py, ob.z + pz]);
        poly(haut);
        c.fillStyle = col;
        c.fill();
        c.fillStyle = '#ffffff66';
        c.fill();
        c.fillStyle = rub;
        [
          [
            [-0.06 * w, -dd / 2],
            [0.06 * w, -dd / 2],
            [0.06 * w, dd / 2],
            [-0.06 * w, dd / 2]
          ],
          [
            [-w / 2, -0.06 * dd],
            [w / 2, -0.06 * dd],
            [w / 2, 0.06 * dd],
            [-w / 2, 0.06 * dd]
          ]
        ].forEach(bd => {
          poly(bd.map(([u, v]) => pt(u, v, y0 + h + 0.002)).map(([px, py, pz]) => [ob.x + px, py, ob.z + pz]));
          c.fill();
        });
        // nœud
        if (!couv) {
          const [nx0, ny0, sc] = Q(cx, y0 + h, cz);
          c.fillStyle = rub;
          [-1, 1].forEach(q => {
            c.beginPath();
            c.ellipse(nx0 + q * sc * 0.035, ny0 - sc * 0.025, sc * 0.04, sc * 0.025, q * 0.5, 0, 7);
            c.fill();
          });
        }
      };
      // surprise : la petite boîte valdingue et un chat sort du gros cadeau rouge, monté sur ressort
      const p = chambou('cadeaux', 0.35, 0.8),
        a = age('cadeaux'),
        L3 = [
          [prof(ob.x - 0.17, ob.z + 0.05), () => boite(-0.17, 0.05, 0.34, 0.3, 0.32, 0.2, '#2f8f5b', '#ffd166')],
          [prof(ob.x + 0.18, ob.z - 0.02), () => boite(0.18, -0.02, 0.3, 0.28, 0.42, -0.15, '#c0233a', '#ffffff', 0, p > 0)],
          [
            prof(ob.x + 0.55 * p, ob.z - 0.2),
            () => boite(0.55 * p, -0.2, 0.24, 0.22, 0.22, 0.5 + p * 1.57, '#3a5ab8', '#ff8fb8', 0.3 * Math.sin(p * Math.PI))
          ]
        ];
      L3.sort((u, v) => v[0] - u[0]).forEach(e => e[1]());
      if (p > 0) {
        const [bx, by, sc] = Q(0.18, 0.42, -0.02),
          hh = sc * 0.42 * p * (a < 4.5 ? 1 - Math.exp(-5 * a) * Math.cos(16 * a) : 1);
        c.strokeStyle = '#9aa3b5';
        c.lineWidth = Math.max(1, sc * 0.012);
        c.beginPath();
        c.moveTo(bx, by);
        for (let i = 1; i <= 8; i++) c.lineTo(bx + (i % 2 ? -1 : 1) * sc * 0.05, by - (hh * i) / 8);
        c.stroke();
        c.font = `${Math.round(sc * 0.3)}px system-ui`;
        c.textAlign = 'center';
        c.textBaseline = 'middle';
        c.fillText('🐱', bx, by - hh - sc * 0.1);
        c.textBaseline = 'alphabetic';
        if (a > 0.3 && a < 2.4) {
          c.fillStyle = '#ffffff';
          c.font = `800 ${Math.round(Math.max(10, sc * 0.11))}px system-ui`;
          c.fillText('Miaou !', bx + sc * 0.38, by - hh - sc * 0.28);
        }
      }
    } else if (ob.t == 'sapin') {
      // surprise : il tremble, perd ses aiguilles (voir les éclats) et son étoile tombe, puis elle remonte
      const as = age('sapin'),
        sw = as < DUREE.sapin ? 0.28 * Math.exp(-2.2 * as) * Math.sin(as * 15) : 0,
        pe = chambou('sapin', 0.6, 0.7);
      c.save();
      c.translate(x, y);
      c.rotate(sw);
      c.translate(-x, -y);
      c.fillStyle = '#5b3a22';
      c.fillRect(x - s * 0.06, y - s * 0.2, s * 0.12, s * 0.2);
      // étages de branches (un cône : pareil de tous les côtés)
      for (let k = 0; k < 4; k++) {
        const w = (0.5 - k * 0.1) * s,
          yy = y - s * (0.2 + k * 0.33),
          g = c.createLinearGradient(x - w, 0, x + w, 0);
        g.addColorStop(0, '#2c8a59');
        g.addColorStop(1, '#17573a');
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(x - w, yy);
        c.lineTo(x, yy - s * 0.55);
        c.lineTo(x + w, yy);
        c.quadraticCurveTo(x, yy + s * 0.07, x - w, yy);
        c.fill();
        c.fillStyle = '#eef4ff';
        c.beginPath();
        c.moveTo(x - w * 0.9, yy - s * 0.01);
        c.quadraticCurveTo(x, yy + s * 0.05, x + w * 0.9, yy - s * 0.01);
        c.quadraticCurveTo(x, yy + s * 0.02, x - w * 0.9, yy - s * 0.01);
        c.fill();
      }
      // guirlande et ampoules posées sur le cône : celles de derrière sont cachées, elles tournent avec la vue
      const surCone = (an, hh) => {
        const r = Math.max(0.03, 0.46 * (1 - (hh - 0.2) / 1.5)) * 0.95;
        return [Math.sin(an) * r, hh, Math.cos(an) * r, vu(Math.sin(an), 0.3, Math.cos(an), 0, hh, 0)];
      };
      c.strokeStyle = '#e9c45a';
      c.lineWidth = Math.max(0.8, s * 0.012);
      for (let g = 0; g < 2; g++) {
        c.beginPath();
        let on = 0;
        for (let i = 0; i <= 60; i++) {
          const hh = 0.3 + g * 0.08 + (i / 60) * 1.15,
            [dx, yy, dz, v] = surCone(i * 0.42 + g * 3, hh);
          if (!v) {
            on = 0;
            continue;
          }
          const [px, py] = Q(dx, yy, dz);
          on ? c.lineTo(px, py) : c.moveTo(px, py);
          on = 1;
        }
        c.stroke();
      }
      for (let k = 0; k < 22; k++) {
        const [dx, yy, dz, v] = surCone(k * 2.39996, 0.28 + (k % 8) * 0.17);
        if (!v) continue;
        const [px, py] = Q(dx, yy, dz);
        ampoule(px, py, Math.max(1.2, s * 0.025), COUL[k % 5], Math.sin(t * 3 + k) > -0.3);
      }
      c.restore();
      c.fillStyle = '#ffd76a';
      c.font = `${Math.round(s * 0.22)}px system-ui`;
      c.textAlign = 'center';
      c.save();
      c.translate(x + pe * s * 0.62, y - s * 1.6 + pe * s * (1.6 - 0.05) - Math.sin(pe * Math.PI) * s * 0.3);
      c.rotate(pe * 2.8);
      c.fillText('★', 0, s * 0.07);
      c.restore();
    } else {
      // l'antenne : le mât et ses barres (alignées dans le sens du toit, donc vues de biais quand on tourne).
      // Touchée, elle se tord et fait des étincelles (et la télé du voisin grésille).
      const pa = chambou('antenne', 0.25, 1),
        piv = ob.h * 0.45,
        ang = pa * 0.75,
        plie = (dx, yy) =>
          yy <= piv ? [dx, yy] : [dx * Math.cos(ang) + (yy - piv) * Math.sin(ang), piv - dx * Math.sin(ang) + (yy - piv) * Math.cos(ang)],
        A = (dx, yy) => {
          const [u, v] = plie(dx, yy);
          return Q(u, v, 0);
        };
      c.strokeStyle = '#3c4660';
      c.lineWidth = Math.max(1.2, s * 0.03);
      c.beginPath();
      const m0 = A(0, 0),
        m1 = A(0, piv),
        m2 = A(0, ob.h);
      c.moveTo(m0[0], m0[1]);
      c.lineTo(m1[0], m1[1]);
      c.lineTo(m2[0], m2[1]);
      c.stroke();
      for (let k = 0; k < 4; k++) {
        const yy = ob.h - 0.1 - k * 0.22,
          w = 0.45 - k * 0.08,
          a0 = A(-w, yy),
          a1 = A(w, yy),
          n0 = A(-w, yy + 0.035),
          n1 = A(w, yy + 0.035);
        c.strokeStyle = '#3c4660';
        c.lineWidth = Math.max(1, s * 0.022);
        c.beginPath();
        c.moveTo(a0[0], a0[1]);
        c.lineTo(a1[0], a1[1]);
        c.stroke();
        c.strokeStyle = '#ffffff';
        c.lineWidth = Math.max(1, s * 0.02);
        c.beginPath();
        c.moveTo(n0[0], n0[1]);
        c.lineTo(n1[0], n1[1]);
        c.stroke();
      }
      c.fillStyle = pa > 0 && Math.sin(t * 30) > 0 ? '#ffe066' : '#ff5a5f';
      c.beginPath();
      c.arc(m2[0], m2[1], s * 0.04, 0, 7);
      c.fill();
    }
  };
  const branche = (x, y, sens, sc, t) => {
    // branche de sapin au premier plan, avec une boule
    c.save();
    c.translate(x, y);
    c.scale(sens * sc, sc);
    c.strokeStyle = '#4a3020';
    c.lineWidth = 5;
    c.beginPath();
    c.moveTo(-10, 0);
    c.quadraticCurveTo(60, -20, 150, -6);
    c.stroke();
    for (let k = 0; k < 34; k++) {
      const u = k / 34,
        bx = -10 + u * 160,
        by = -20 * Math.sin(u * 2.6) - 4;
      [-1, 1].forEach(sg => {
        c.strokeStyle = sg > 0 ? '#1d5a3a' : '#2b7a4f';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(bx, by);
        c.lineTo(bx + 16, by + sg * 22);
        c.stroke();
      });
    }
    c.fillStyle = '#ffffffcc';
    for (let k = 0; k < 9; k++) {
      c.beginPath();
      c.ellipse(10 + k * 16, -18 * Math.sin((k / 9) * 2.6) - 12, 9, 4, -0.2, 0, 7);
      c.fill();
    }
    const bx = 95,
      by = 34 + Math.sin(t * 1.6) * 2;
    c.strokeStyle = '#c9a24a';
    c.lineWidth = 1.2;
    c.beginPath();
    c.moveTo(bx, -8);
    c.lineTo(bx, by - 14);
    c.stroke();
    const g = c.createRadialGradient(bx - 5, by - 5, 2, bx, by, 15);
    g.addColorStop(0, '#ff8c9a');
    g.addColorStop(1, '#a3122a');
    c.fillStyle = g;
    c.beginPath();
    c.arc(bx, by, 14, 0, 7);
    c.fill();
    c.fillStyle = '#d9b44a';
    c.fillRect(bx - 4, by - 17, 8, 5);
    c.fillStyle = '#ffffffaa';
    c.beginPath();
    c.ellipse(bx - 5, by - 5, 4, 2.5, -0.6, 0, 7);
    c.fill();
    c.restore();
  };
  const devant = t => {
    // grosse guirlande au bord du toit, floue de près, et branches de sapin dans les coins
    const y0 = H * 0.955;
    c.strokeStyle = '#1b2436';
    c.lineWidth = 2;
    c.beginPath();
    for (let i = 0; i <= 3; i++) {
      const xa = (i - 0.5) * (W / 2.6),
        xb = (i + 0.5) * (W / 2.6);
      c.moveTo(xa, y0);
      c.quadraticCurveTo((xa + xb) / 2, y0 + 26, xb, y0);
    }
    c.stroke();
    for (let i = 0; i < 12; i++) {
      const u = (i + 0.5) / 12,
        xx = u * W,
        seg = (xx + W / 5.2) % (W / 2.6),
        yy = y0 + 4 + 26 * 4 * (seg / (W / 2.6)) * (1 - seg / (W / 2.6)) * 0.5;
      ampoule(xx, yy, 6, COUL[i % 5], Math.sin(t * 2 + i * 1.3) > -0.5);
    }
    branche(-14, H * 0.93, 1, Math.min(1, W / 420), t);
    branche(W + 14, H * 0.9, -1, Math.min(0.85, W / 480), t + 1);
  };

  /* ===================== physique ===================== */
  const pas = h => {
    const p = { x: F.x, y: F.y, z: F.z };
    F.vy -= G * h;
    F.x += F.vx * h;
    F.y += F.vy * h;
    F.z += F.vz * h;
    F.a += F.va * h;
    if (F.in) {
      F.x += (0 - F.x) * 0.1;
      F.z += (CZ - F.z) * 0.1;
      return;
    }
    const dansBoite = (x, z) => Math.abs(x) < CX && Math.abs(z - CZ) < CD;
    // passage du haut de la cheminée en descendant
    if (p.y >= TOP && F.y < TOP && F.vy < 0) {
      const t = (p.y - TOP) / (p.y - F.y),
        x = p.x + (F.x - p.x) * t,
        z = p.z + (F.z - p.z) * t;
      if ((x / OX) ** 2 + ((z - CZ) / OZ) ** 2 <= 1) return entre();
      if (dansBoite(x, z)) {
        // rebond sur le rebord
        F.y = TOP + 0.001;
        F.vy = Math.abs(F.vy) * 0.38;
        F.vx = F.vx * 0.5 + Math.sign(x || 1) * 0.7;
        F.vz = F.vz * 0.4 + Math.sign(z - CZ || -1) * 0.7;
        F.va += (Math.random() - 0.5) * 8;
        choc(0.5);
        bruit('brique', 0.8);
        return;
      }
    }
    if (F.y < TOP) {
      // mur de devant
      if (p.z <= CZ - CD && F.z > CZ - CD && Math.abs(F.x) < CX) {
        F.z = CZ - CD - 0.001;
        F.vz = -Math.abs(F.vz) * 0.28;
        F.vx *= 0.6;
        F.va += (Math.random() - 0.5) * 10;
        choc(1);
        bruit('brique', Math.min(1, 0.4 + Math.abs(F.vz)));
      }
      // mur de derrière (si on arrive par l'arrière)
      if (p.z >= CZ + CD && F.z < CZ + CD && Math.abs(F.x) < CX) {
        F.z = CZ + CD + 0.001;
        F.vz = Math.abs(F.vz) * 0.28;
        choc(0.6);
        bruit('brique', 0.6);
      }
      // côtés
      if (Math.abs(F.z - CZ) < CD && Math.abs(p.x) >= CX && Math.abs(F.x) < CX) {
        F.x = Math.sign(p.x) * (CX + 0.001);
        F.vx = -F.vx * 0.3;
        choc(0.6);
        bruit('brique', 0.6);
      }
    }
    // obstacles du toit
    OBS.forEach(ob => {
      const dx = F.x - ob.x,
        dz = F.z - ob.z,
        d = Math.hypot(dx, dz),
        m = rayon(ob, F.y) + 0.12;
      if (F.y < ob.h && d < m && d > 0) {
        surprise(ob.t); // il l'a vraiment touché
        const nx = dx / d,
          nz = dz / d,
          v = F.vx * nx + F.vz * nz;
        F.x = ob.x + nx * m;
        F.z = ob.z + nz * m;
        if (v < 0) {
          F.vx -= 1.35 * v * nx;
          F.vz -= 1.35 * v * nz;
          F.va = -F.va * 0.5 + v * 2;
          if (v < -0.8) choc(0.5);
          if (v < -0.3) bruit('obstacle', ob.t, Math.min(1, -v / 3));
        }
      }
      // atterrir sur le dessus d'un obstacle bas (les cadeaux)
      if (ob.t == 'cadeaux' && p.y >= ob.h && F.y < ob.h && d < ob.r) {
        F.y = ob.h;
        surprise('cadeaux');
        if (F.vy < -1) bruit('obstacle', 'cadeaux', Math.min(1, -F.vy / 6));
        F.vy = Math.abs(F.vy) * 0.25;
      }
    });
    // le traîneau : il faut vraiment le toucher (boîte autour des rennes et du traîneau)
    const tp = traineauPos(T());
    if (tp && Math.abs(F.z - TZ) < 0.6 && F.y > tp.y - 0.4 && F.y < tp.y + 0.55 && F.x > tp.x - 4 && F.x < tp.x + 0.8) {
      surprise('traineau', tp);
      F.vz = -Math.abs(F.vz) * 0.35;
      F.vy = Math.min(F.vy, 0) * 0.5;
      F.va += (Math.random() - 0.5) * 10;
      choc(0.6);
    }
    if (F.tombe) return;
    // bord du toit côté caméra : il ne revient pas vers nous
    // il passe le faîtage (ou sort tout à fait sur le côté) : il tombe de l'autre côté, caché derrière le faîtage
    if (F.z > RIDGE || F.z < BORD || Math.abs(F.x) > 9) {
      if (F.y < 0.05 && !F.tombe) {
        F.tombe = 1;
        bruit('tombe');
      }
      return;
    }
    // le toit : rebonds, puis glissade sur la neige avec frottement
    if (F.y <= 0.03) {
      F.y = 0.03;
      if (F.vy < -1.4) {
        bruit('neige', Math.min(1, -F.vy / 7));
        F.vy = -F.vy * 0.24;
        F.vx *= 0.75;
        F.vz *= 0.75;
        F.va *= 0.6;
        if (F.vy > 0.6) choc(0.35);
      } else {
        F.vy = 0;
        F.sol = 1;
        const sp = Math.hypot(F.vx, F.vz),
          dec = 3.2 * h; // frottement de la neige
        if (sp <= dec) ((F.vx = 0), (F.vz = 0));
        else ((F.vx *= 1 - dec / sp), (F.vz *= 1 - dec / sp));
        F.va *= 1 - 6 * h;
        F.a += (Math.round(F.a / Math.PI) * Math.PI - F.a) * 4 * h; // il se pose à plat
      }
    }
  };
  const choc = k => {
    const [x, y] = P(F.x, F.y, F.z);
    for (let i = 0; i < 10 * k; i++) eclats.push({ x, y, vx: (Math.random() - 0.5) * 160, vy: -Math.random() * 140, t: 0.6, c: '#ffffff' });
  };
  const entre = () => {
    if (!F.in) bruit('entre');
    F.in = 1;
    F.vy = Math.min(F.vy, -1);
    F.vx *= 0.2;
    F.vz *= 0.2;
    if (fin) return;
    fin = 1;
    o.querySelector('.mysl-n i').textContent = '1';
    o.querySelector('.mysl-n').classList.add('ok');
    tip.textContent = 'Ho ho ho ! 🎅 Bien reçu !';
    tip.classList.add('ok');
    for (let i = 0; i < 26; i++)
      fumees.push({
        x: (Math.random() - 0.5) * 0.5,
        y: TOP + Math.random() * 0.2,
        z: CZ,
        r: 0.1 + Math.random() * 0.1,
        a: 0.9,
        v: 0.6 + Math.random() * 0.8
      });
    const [x, y] = P(0, TOP, CZ);
    for (let i = 0; i < 40; i++)
      eclats.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 320,
        vy: -80 - Math.random() * 260,
        t: 1.2,
        c: ['#ffd76a', '#ff6b8a', '#8be0a8', '#fff'][i % 4]
      });
    setTimeout(() => {
      try {
        confetti();
      } catch (_) {}
    }, 400);
    setTimeout(fermer, 2000);
  };
  const aide = () => {
    rate++;
    tip.textContent =
      rate >= 3 ? 'Tourne la vue pile vers la cheminée et relâche au bon moment 🎯' : rate == 1 ? 'Presque ! Réessaie 😉' : '';
  };
  const fermer = () => {
    cancelAnimationFrame(raf);
    bruit('fin');
    if (musAvant)
      setTimeout(() => {
        try {
          bgm();
        } catch (_) {}
      }, 600);
    removeEventListener('resize', taille);
    removeEventListener('keydown', bas);
    removeEventListener('keyup', haut);
    o.classList.add('out');
    setTimeout(() => {
      o.remove();
      cb();
    }, 450);
  };
  /* ===================== Célestine (commandes de jeu) ===================== */
  // Joystick (ou flèches / ZQSD) pour la faire marcher, glisser le doigt (ou la souris) pour tourner la vue autour d'elle,
  // bouton « Lancer » (ou barre d'espace) maintenu : la jauge de force monte et descend, on relâche pour lancer droit devant.
  // Célestine est un petit personnage « en volume » : chaque partie a sa place autour d'elle (en cm, X = sa droite,
  // Y = hauteur, Z = devant elle). C.phi = le sens où elle regarde : 0 = de dos (elle s'éloigne), π/2 = vers la droite,
  // π = vers nous. Elle pivote vraiment : toutes les positions entre de dos, de profil et de face existent.
  const proj = (X, Y, Z) => {
    const cs = Math.cos(C.phi - V.yaw),
      sn = Math.sin(C.phi - V.yaw);
    return [X * cs + Z * sn, -Y, X * sn - Z * cs]; // [x écran, y écran, profondeur vers nous]
  };
  const poses = () => {
    const sw = Math.sin(C.ph),
      a = C.amp,
      lt = T() - C.lanceT;
    if (C.charge) return { d: [17, 172, -16], g: [-22, 130, 24] }; // bras armé derrière la tête, l'autre bras vise
    if (lt < 0.35) {
      const k = lt / 0.35; // le bras part vers l'avant
      return { d: [15, 160 - k * 50, -16 + k * 46], g: [-22, 130 - k * 30, 24 - k * 20] };
    }
    return { d: [25, 87 + sw * 1.5 * a, sw * 10 * a], g: [-24 + Math.abs(sw) * 1.5 * a, 85 - Math.abs(sw) * 2 * a, -sw * 18 * a] };
  };
  const main = () => {
    // le fichier suit sa main droite (même calcul que le dessin)
    // (proj donne un décalage à droite de la caméra et une profondeur vers elle : on les remet dans le monde)
    const [X, Y, Z] = poses().d,
      [px, , pd] = proj(X, Y, Z),
      bob = Math.abs(Math.cos(C.ph)) * 0.022 * C.amp,
      co = Math.cos(V.yaw),
      si = Math.sin(V.yaw);
    return {
      x: C.x + (co * px - si * pd) / 100,
      y: C.y + bob + Y / 100 + (Y > 150 ? 0.09 : -0.11),
      z: C.z + (-si * px - co * pd) / 100,
      a: 0.1 * Math.cos(C.phi) + Math.sin(C.ph) * 0.1 * C.amp
    };
  };
  // les commandes : joystick (jx, jy de -1 à 1), clavier, rotation de la vue
  const ctl = { jx: 0, jy: 0, kx: 0, ky: 0, yaw: 0 };
  const marche = dt => {
    // vitesse voulue, par rapport à la vue : vers le haut du joystick = droit devant
    const ix = Math.max(-1, Math.min(1, ctl.jx + ctl.kx)),
      iy = Math.max(-1, Math.min(1, ctl.jy + ctl.ky)),
      m = Math.min(1, Math.hypot(ix, iy)),
      co = Math.cos(ctl.yaw),
      si = Math.sin(ctl.yaw);
    let vx = 0,
      vz = 0;
    if (m > 0.12 && !C.charge) {
      const sp = 1.7 * m;
      C.v = Math.min(sp, C.v + dt * 5);
      const dx = co * ix + si * -iy,
        dz = -si * ix + co * -iy,
        n = Math.hypot(dx, dz);
      vx = (dx / n) * C.v;
      vz = (dz / n) * C.v;
    } else C.v = Math.max(0, C.v - dt * 7);
    // elle pivote vers là où elle va ; en armant le lancer, elle se tourne dans le sens de la vue
    const vise = C.charge ? ctl.yaw : vx || vz ? Math.atan2(vx, vz) : null;
    if (vise != null) C.phi += Math.atan2(Math.sin(vise - C.phi), Math.cos(vise - C.phi)) * Math.min(1, dt * 10);
    C.x += vx * dt;
    C.z += vz * dt;
    C.amp += ((C.v > 0.05 ? Math.min(1, C.v / 1.2) : 0) - C.amp) * Math.min(1, dt * 8);
    C.pen += ((C.v > 0.05 ? (vx * Math.cos(V.yaw) - vz * Math.sin(V.yaw)) / 1.5 : 0) - C.pen) * Math.min(1, dt * 6);
    const ph0 = C.ph;
    C.ph += dt * (C.v > 0.05 ? 3 + C.v * 3.2 : 0);
    if (Math.floor(ph0 / Math.PI) != Math.floor(C.ph / Math.PI)) bruit('pas', C.amp);
    // la cheminée et les obstacles l'arrêtent (et elle déclenche les surprises en les touchant)
    const ex = CX + 0.24,
      ez = CD + 0.22;
    if (Math.abs(C.x) < ex && Math.abs(C.z - CZ) < ez) {
      const px = ex - Math.abs(C.x),
        pz = ez - Math.abs(C.z - CZ);
      if (px < pz) C.x = Math.sign(C.x || 1) * ex;
      else C.z = CZ + Math.sign(C.z - CZ || -1) * ez;
    }
    OBS.forEach(ob => {
      const d = Math.hypot(C.x - ob.x, C.z - ob.z),
        mm = rayon(ob, 0.5) + 0.22;
      if (d < mm && d > 0) {
        C.x = ob.x + ((C.x - ob.x) / d) * mm;
        C.z = ob.z + ((C.z - ob.z) / d) * mm;
        surprise(ob.t);
      }
    });
    C.x = Math.max(-8.4, Math.min(8.4, C.x));
    C.z = Math.max(0.9, Math.min(RIDGE - 0.3, C.z));
    // la jauge de force monte et redescend tant qu'on maintient « Lancer »
    if (C.charge) {
      const k = (T() - C.charge) / REMPLI;
      C.p = 1 - Math.abs((k % 2) - 1);
      btn.style.setProperty('--p', C.p.toFixed(3));
    }
    // le fichier suit sa main
    if (C.tient) Object.assign(F, main(), { vol: 0, al: 1, ent: 1, in: 0 });
  };
  const armer = () => {
    if (fin || !C.tient || C.charge) return;
    C.charge = T();
    C.p = 0;
    btn.classList.add('on');
  };
  const lancer = () => {
    if (!C.charge) return;
    const p = C.p || 0,
      m = main(); // la main armée, au-dessus de l'épaule (avant de relâcher la pose)
    C.charge = 0;
    btn.classList.remove('on');
    btn.style.setProperty('--p', 0);
    if (!C.tient) return;
    // elle lance droit devant elle (dans le sens de la vue), en cloche ; la jauge règle la force
    const v = VMIN + (VMAX - VMIN) * p,
      dir = C.phi;
    C.lanceT = T();
    C.tient = 0;
    F = {
      x: m.x,
      y: m.y,
      z: m.z,
      vx: Math.sin(dir) * v * Math.cos(ANG),
      vy: v * Math.sin(ANG),
      vz: Math.cos(dir) * v * Math.cos(ANG),
      a: m.a,
      va: (Math.random() - 0.5) * 3,
      vol: 1,
      in: 0,
      sol: 0,
      t: 0,
      arret: 0,
      al: 1,
      ent: 1,
      tombe: 0
    };
    bruit('lance', 0.4 + p * 0.6);
    tip.textContent = '';
  };
  const celestine = t => {
    if (prof(C.x, C.z) < 0.5) return;
    const [x, yb, s] = P(C.x, C.y, C.z),
      [sx, sy, ss] = P(C.x, 0, C.z),
      u = s / 100, // 1 unité = 1 cm
      a = C.amp,
      sw = Math.sin(C.ph),
      cw = Math.cos(C.ph),
      bob = -Math.abs(cw) * 2.2 * a,
      cs = Math.cos(C.phi),
      sn = Math.sin(C.phi),
      po = poses(),
      TRAIT = 'rgba(70,25,45,0.38)';
    // ombre au sol
    c.fillStyle = `rgba(60,75,110,${0.3 / (1 + C.y)})`;
    c.beginPath();
    c.ellipse(sx, sy, ss * 0.26, ss * 0.08, 0, 0, 7);
    c.fill();
    c.save();
    c.translate(x, yb);
    c.scale(u, u);
    c.rotate(C.pen * 0.05);
    c.translate(0, bob);
    c.lineJoin = c.lineCap = 'round';
    const ombre = d => Math.max(0, Math.min(1, 0.5 - d / 40)); // plus c'est loin de nous, plus c'est dans l'ombre
    const mix = (c1, c2, k) => {
      const h = q => [1, 3, 5].map(i => parseInt(q.slice(i, i + 2), 16)),
        A = h(c1),
        B = h(c2);
      return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`;
    };
    const trait = (pts, col, larg) => {
      // un membre : un trait épais avec un fin contour
      c.strokeStyle = TRAIT;
      c.lineWidth = larg + 1.4;
      c.beginPath();
      pts.forEach(([px, py], i) => (i ? c.lineTo(px, py) : c.moveTo(px, py)));
      c.stroke();
      c.strokeStyle = col;
      c.lineWidth = larg;
      c.stroke();
    };
    /* --- jambes --- */
    const jambe = cote => {
      const lev = Math.max(0, cote * -sw) * 9 * a,
        zf = -cote * sw * 16 * a, // le pied avance et recule
        plie = Math.max(0, -cote * cw) * 7 * a,
        X = cote * 8.5,
        H = proj(X, 80, 0),
        K = proj(X, 43 + lev * 0.4, zf * 0.5 + plie),
        A = proj(X, 9 + lev, zf),
        T2 = proj(X, 3 + lev, zf + 12),
        d = (H[2] + A[2]) / 2,
        k = ombre(d);
      return {
        d: d - 30,
        f: () => {
          trait(
            [
              [H[0], H[1]],
              [K[0], K[1]]
            ],
            mix('#41558a', '#26304f', k),
            13
          );
          trait(
            [
              [K[0], K[1]],
              [A[0], A[1]]
            ],
            mix('#3b4e80', '#232c49', k),
            11
          );
          // botte fourrée : la tige, puis le pied qui pointe vers l'avant
          trait(
            [
              [A[0], A[1] - 4],
              [A[0], A[1] + 4]
            ],
            mix('#7a5233', '#4a2f1c', k),
            12
          );
          trait(
            [
              [A[0], A[1] + 4],
              [T2[0], T2[1] + 2]
            ],
            mix('#7a5233', '#4a2f1c', k),
            10
          );
          c.fillStyle = mix('#f4ebdd', '#cfc3b0', k);
          c.beginPath();
          c.ellipse(A[0], A[1] - 6, 7.4, 2.8, 0, 0, 7);
          c.fill();
        }
      };
    };
    /* --- bras (et la main qui tient le fichier) --- */
    const brasP = (cote, H3, tient) => {
      const S = proj(cote * 18.5, 133, 0),
        H = proj(...H3),
        E = proj(cote * 23 + (H3[0] - cote * 18.5) * 0.4, (133 + H3[1]) / 2, H3[2] * 0.5 - 4),
        d = (S[2] + H[2]) / 2,
        k = ombre(d);
      return {
        d,
        f: () => {
          trait(
            [
              [S[0], S[1]],
              [E[0], E[1]],
              [H[0], H[1]]
            ],
            mix('#e0668b', '#a33f62', k),
            9.5
          );
          c.strokeStyle = mix('#f493b0', '#c65780', k);
          c.lineWidth = 3.5;
          c.beginPath();
          c.moveTo(S[0], S[1] + 1.5);
          c.lineTo(E[0], E[1]);
          c.lineTo(H[0], H[1] - 2);
          c.stroke();
          if (tient && C.tient) {
            c.save();
            c.setTransform(dpr, 0, 0, dpr, 0, 0);
            fichier();
            c.restore();
          }
          // moufle crème au revers rouge
          c.fillStyle = '#c0233a';
          c.beginPath();
          c.ellipse(H[0], H[1] - 1, 5.6, 2.6, 0, 0, 7);
          c.fill();
          c.fillStyle = mix('#f6ecdd', '#cdbfa8', k);
          c.strokeStyle = TRAIT;
          c.lineWidth = 0.8;
          c.beginPath();
          c.ellipse(H[0], H[1] + 4.2, 5, 6.2, 0, 0, 7);
          c.fill();
          c.stroke();
        }
      };
    };
    /* --- buste : doudoune matelassée, capuche fourrée, fermeture éclair --- */
    const torse = () => {
      const lvl = [
          [141, 17.5, 11],
          [128, 20.5, 13.5],
          [110, 21.5, 14.5],
          [90, 23, 15],
          [75, 24, 15.5]
        ],
        larg = (hf, hd) => Math.sqrt((hf * cs) ** 2 + (hd * sn) ** 2),
        D = lvl.map(([Y, hf, hd]) => [-Y, larg(hf, hd), hd]),
        g = c.createLinearGradient(-26, -140, 26, -80);
      g.addColorStop(0, '#f59bb6');
      g.addColorStop(0.45, '#ec7598');
      g.addColorStop(1, '#bf4970');
      c.fillStyle = g;
      c.strokeStyle = TRAIT;
      c.lineWidth = 1.1;
      c.beginPath();
      D.forEach(([y, w], i) => (i ? c.lineTo(w, y) : c.moveTo(w, y)));
      c.quadraticCurveTo(0, -71, -D[4][1], D[4][0]);
      for (let i = 3; i >= 0; i--) c.lineTo(-D[i][1], D[i][0]);
      c.quadraticCurveTo(0, -144, D[0][1], D[0][0]);
      c.fill();
      c.stroke();
      // coutures du matelassage, qui suivent la forme
      c.strokeStyle = '#b8466a';
      c.lineWidth = 1;
      [-124, -108, -93, -82].forEach((yq, i) => {
        const w = D[Math.min(4, i + 1)][1] - 0.6;
        c.beginPath();
        c.moveTo(-w, yq);
        c.quadraticCurveTo(0, yq + 3 * Math.abs(cs) + 1, w, yq);
        c.stroke();
      });
      // devant : fermeture éclair et poches (visibles quand elle se tourne vers nous)
      if (cs < 0.25) {
        const k = Math.min(1, (0.25 - cs) * 2);
        c.globalAlpha = k;
        c.strokeStyle = '#a83d62';
        c.lineWidth = 1.2;
        c.beginPath();
        c.moveTo(14 * sn, -139);
        c.lineTo(15.5 * sn, -73);
        c.stroke();
        c.fillStyle = '#e0b84a';
        c.beginPath();
        c.roundRect(14.4 * sn - 1.6, -118, 3.2, 6, 1);
        c.fill();
        [-1, 1].forEach(q => {
          const px = q * 12 * cs * -1 + 15 * sn * 0.9;
          if (q * sn * -1 > 0.6) return;
          c.beginPath();
          c.moveTo(px - q * 2, -99);
          c.lineTo(px + q * 3 * Math.abs(cs), -86);
          c.stroke();
        });
        c.globalAlpha = 1;
      }
      // dos : la capuche fourrée posée dans le dos
      if (cs > -0.2) {
        const k = Math.min(1, (cs + 0.2) * 2),
          hx = -12 * sn,
          hw = 14 * Math.abs(cs) + 4 * Math.abs(sn);
        c.globalAlpha = k;
        c.fillStyle = '#cf5a7e';
        c.beginPath();
        c.ellipse(hx, -133, hw, 10, 0, 0, 7);
        c.fill();
        c.strokeStyle = '#f6efe6';
        c.lineWidth = 3.2;
        c.beginPath();
        c.ellipse(hx, -133, hw - 1.5, 8.5, 0, Math.PI * 1.05, Math.PI * 1.95, true);
        c.stroke();
        c.globalAlpha = 1;
      }
    };
    /* --- écharpe crème à rayures --- */
    const echarpe = () => {
      c.fillStyle = '#f4ead8';
      c.strokeStyle = TRAIT;
      c.lineWidth = 0.8;
      c.beginPath();
      c.roundRect(-11.5 * Math.max(0.65, Math.abs(cs)) - 1, -148, 23 * Math.max(0.65, Math.abs(cs)) + 2, 9, 4.5);
      c.fill();
      c.stroke();
      // le pan dans le dos (il vole quand elle marche) ou le nœud devant
      const pan = sw * 2.5 * a,
        B = proj(-2, 142, -10),
        E = proj(-2 + pan, 116 + a * 4, -12 - a * 10);
      if (B[2] > -6) {
        c.fillStyle = '#efe3cf';
        c.beginPath();
        c.moveTo(B[0] - 3.5, B[1]);
        c.lineTo(B[0] + 3.5, B[1]);
        c.lineTo(E[0] + 3.5, E[1]);
        c.lineTo(E[0] - 3.5, E[1]);
        c.closePath();
        c.fill();
        c.fillStyle = '#c0233a';
        [0.3, 0.6].forEach(k => c.fillRect(B[0] + (E[0] - B[0]) * k - 3.5, B[1] + (E[1] - B[1]) * k, 7, 2));
      }
      const N = proj(3, 141, 11);
      if (N[2] > 0) {
        c.fillStyle = '#efe3cf';
        [
          [2, 113],
          [-3, 117]
        ].forEach(([dx, yy], i) => {
          const Q = proj(3 + dx, yy, 13 + i);
          c.beginPath();
          c.moveTo(N[0] - 3, N[1]);
          c.lineTo(N[0] + 3, N[1]);
          c.lineTo(Q[0] + 3, Q[1]);
          c.lineTo(Q[0] - 3, Q[1]);
          c.fill();
          c.fillStyle = '#c0233a';
          c.fillRect(N[0] + (Q[0] - N[0]) * 0.5 - 3, N[1] + (Q[1] - N[1]) * 0.5, 6, 2);
          c.fillStyle = '#efe3cf';
        });
        c.fillStyle = '#e3d5bd';
        c.beginPath();
        c.arc(N[0], N[1], 3.4, 0, 7);
        c.fill();
      }
    };
    /* --- queue-de-cheval --- */
    const queueP = () => {
      const B = proj(0, 157, -11),
        E = proj(sw * 3 * a + C.pen * 4, 131, -14 - a * 6),
        M = proj(sw * 1.5 * a, 145, -15 - a * 3);
      return {
        d: B[2],
        f: () => {
          const gq = c.createLinearGradient(0, B[1], 0, E[1]);
          gq.addColorStop(0, '#4a2e1d');
          gq.addColorStop(1, '#2a190f');
          c.fillStyle = gq;
          c.strokeStyle = TRAIT;
          c.lineWidth = 0.7;
          c.beginPath();
          c.moveTo(B[0] - 3.4, B[1]);
          c.quadraticCurveTo(M[0] - 4.5, M[1], E[0] - 1.5, E[1]);
          c.quadraticCurveTo(E[0] + 1, E[1] + 3, E[0] + 2, E[1] - 1);
          c.quadraticCurveTo(M[0] + 4, M[1], B[0] + 3.4, B[1]);
          c.closePath();
          c.fill();
          c.stroke();
          c.strokeStyle = '#6a4329';
          c.lineWidth = 0.6;
          c.beginPath();
          c.moveTo(B[0], B[1] + 1);
          c.quadraticCurveTo(M[0], M[1], E[0], E[1]);
          c.stroke();
          c.fillStyle = '#ff8fb8';
          c.beginPath();
          c.ellipse(B[0], B[1], 4.2, 2.5, 0, 0, 7);
          c.fill();
          c.fillStyle = '#ffc2d8';
          c.beginPath();
          c.ellipse(B[0] - 1, B[1] - 0.8, 1.8, 0.9, 0, 0, 7);
          c.fill();
        }
      };
    };
    /* --- tête : cheveux, visage, grandes lunettes écaille, taches de rousseur --- */
    const R = 11.2,
      HY = -155;
    const tete = () => {
      const pt = (ang, Y, rr = R) => proj(Math.sin(ang) * rr, Y, Math.cos(ang) * rr), // point sur la tête (ang = 0 : devant)
        vis = -cs; // 1 : le visage face à nous ; -1 : de dos
      // cou
      c.fillStyle = '#e3ad8c';
      c.fillRect(-4, -151, 8, 7);
      // oreilles (côté visible)
      const oreille = q => {
        const O = proj(q * 10.7, 153, 0);
        if (O[2] < 4) return; // on ne voit l'oreille que du côté tourné vers nous
        c.fillStyle = '#e9b394';
        c.strokeStyle = TRAIT;
        c.lineWidth = 0.6;
        c.beginPath();
        c.ellipse(O[0], O[1], 0.6 + 1.9 * Math.abs(sn), 3.3, 0, 0, 7);
        c.fill();
        c.stroke();
      };
      // fond de cheveux
      const gh = c.createRadialGradient(-3, -163, 2, 0, HY, R + 3);
      gh.addColorStop(0, '#6e462b');
      gh.addColorStop(1, '#2b1a11');
      c.fillStyle = gh;
      c.strokeStyle = TRAIT;
      c.lineWidth = 0.9;
      c.beginPath();
      c.ellipse(0, HY, R + 0.4, R + 1.6, 0, 0, 7);
      c.fill();
      c.stroke();
      oreille(-1);
      oreille(1);
      if (vis > -0.45) {
        // le visage : un ovale de peau posé sur l'avant de la tête
        const k = Math.min(1, (vis + 0.45) * 2.5),
          fx = R * sn * 0.58,
          fw = R * (0.82 * Math.max(0, vis) + 0.34 * Math.abs(sn)) + 0.5;
        c.save();
        c.globalAlpha = k;
        const gp = c.createRadialGradient(fx - 2, HY - 1, 1, fx, HY + 1.5, 12);
        gp.addColorStop(0, '#f8d4ba');
        gp.addColorStop(1, '#e2aa88');
        c.fillStyle = gp;
        c.beginPath();
        c.ellipse(fx, HY + 1.6, fw, R - 0.4, 0, 0, 7);
        c.fill();
        // nez (bien visible de profil)
        const N = pt(0, 152.6, R + 2.3),
          N0 = pt(0, 156.5, R - 0.3);
        if (Math.abs(sn) > 0.25) {
          c.fillStyle = '#ecbc9e';
          c.beginPath();
          c.moveTo(N0[0], N0[1]);
          c.quadraticCurveTo(N[0] + sn * 0.6, N[1] - 1, N[0], N[1]);
          c.lineTo(N0[0] + sn * 0.2, N[1] + 1.2);
          c.closePath();
          c.fill();
        }
        c.strokeStyle = '#c98a6a';
        c.lineWidth = 0.7;
        c.beginPath();
        c.moveTo(N0[0], N0[1] + 1.5);
        c.quadraticCurveTo(N[0], N[1] + 0.4, N[0] - sn * 1.4, N[1] + 1.2);
        c.stroke();
        // yeux, sourcils et lunettes
        const cligne = t % 4.2 < 0.13;
        [-1, 1].forEach(q => {
          const E = pt(q * 0.44, 155.4),
            fs = E[2] / R; // raccourci (vu de biais)
          if (fs < 0.12) return;
          const Br = pt(q * 0.44, 159.6);
          c.strokeStyle = '#4a2e1d';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(Br[0] - 2.6 * fs, Br[1] + 0.3);
          c.quadraticCurveTo(Br[0], Br[1] - 1.2, Br[0] + 2.6 * fs, Br[1] + 0.3);
          c.stroke();
          if (cligne) {
            c.strokeStyle = '#3a2418';
            c.lineWidth = 0.8;
            c.beginPath();
            c.moveTo(E[0] - 1.8 * fs, E[1]);
            c.quadraticCurveTo(E[0], E[1] + 0.8, E[0] + 1.8 * fs, E[1]);
            c.stroke();
          } else {
            c.fillStyle = '#ffffff';
            c.beginPath();
            c.ellipse(E[0], E[1], 2.1 * fs, 1.4, 0, 0, 7);
            c.fill();
            c.fillStyle = '#5a3a22';
            c.beginPath();
            c.ellipse(E[0] + sn * 0.5, E[1], 1.15 * Math.max(0.5, fs), 1.15, 0, 0, 7);
            c.fill();
            c.fillStyle = '#ffffff';
            c.beginPath();
            c.arc(E[0] + 0.4, E[1] - 0.4, 0.35, 0, 7);
            c.fill();
          }
          c.fillStyle = '#ffffff22';
          c.strokeStyle = '#7a4a2a';
          c.lineWidth = 1.15;
          c.beginPath();
          c.roundRect(E[0] - 3.8 * fs, E[1] - 3.6, 7.6 * fs, 6.8, Math.min(2, 3.8 * fs));
          c.fill();
          c.stroke();
          c.strokeStyle = '#a8703f';
          c.lineWidth = 0.5;
          c.beginPath();
          c.moveTo(E[0] - 3 * fs, E[1] - 3);
          c.lineTo(E[0] + 1 * fs, E[1] - 3);
          c.stroke();
          // branche jusqu'à l'oreille
          const Ob = proj(q * 10.6, 156, 0),
            L = pt(q * 0.85, 156.2);
          if (L[2] > -2) {
            c.strokeStyle = '#7a4a2a';
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(E[0] + q * 3.8 * fs * Math.sign(cs || 1) * -1, E[1] - 2);
            c.lineTo(Ob[0], Ob[1]);
            c.stroke();
          }
        });
        const Bg = pt(0, 156.4, R + 0.6);
        if (Bg[2] > 3) {
          c.strokeStyle = '#7a4a2a';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(Bg[0] - 1, Bg[1]);
          c.quadraticCurveTo(Bg[0], Bg[1] - 0.9, Bg[0] + 1, Bg[1]);
          c.stroke();
        }
        // taches de rousseur, joues, sourire
        c.fillStyle = '#c98a6a99';
        [
          [-0.3, 151.6],
          [-0.22, 150.6],
          [-0.4, 150.4],
          [0.3, 151.6],
          [0.22, 150.5],
          [0.4, 150.6],
          [-0.1, 152.6],
          [0.12, 152.6]
        ].forEach(([an, yy]) => {
          const Q = pt(an, yy);
          if (Q[2] < 2) return;
          c.beginPath();
          c.arc(Q[0], Q[1], 0.32, 0, 7);
          c.fill();
        });
        c.fillStyle = '#f2a0a055';
        [-1, 1].forEach(q => {
          const Q = pt(q * 0.62, 150.2);
          if (Q[2] < 1) return;
          c.beginPath();
          c.ellipse(Q[0], Q[1], 2.2 * (Q[2] / R), 1.3, 0, 0, 7);
          c.fill();
        });
        const M = pt(0, 147.9, R - 0.4),
          mw = 3.6 * Math.max(0.35, M[2] / R);
        if (M[2] > 2) {
          c.fillStyle = '#ffffff';
          c.strokeStyle = '#b0505a';
          c.lineWidth = 0.7;
          c.beginPath();
          c.moveTo(M[0] - mw, M[1] - 0.4);
          c.quadraticCurveTo(M[0], M[1] + 3.5, M[0] + mw, M[1] - 0.4);
          c.quadraticCurveTo(M[0], M[1] + 1, M[0] - mw, M[1] - 0.4);
          c.fill();
          c.stroke();
        }
        c.restore();
        // les cheveux par-dessus le front, raie sur le côté
        c.save();
        c.beginPath();
        c.ellipse(0, HY, R + 0.4, R + 1.6, 0, 0, 7);
        c.clip();
        const gh2 = c.createLinearGradient(0, -170, 0, -155);
        gh2.addColorStop(0, '#5f3c27');
        gh2.addColorStop(1, '#2e1c12');
        c.fillStyle = gh2;
        c.beginPath();
        c.moveTo(-20, -175);
        c.lineTo(20, -175);
        c.lineTo(20, -158);
        for (let i = 20; i >= -20; i -= 2) {
          const ang = Math.asin(Math.max(-1, Math.min(1, i / (R + 0.4)))),
            devant = Math.cos(ang - C.phi + Math.PI) > 0;
          c.lineTo(i, -160.6 - (devant ? 1.4 * Math.cos(i / 5 + 1) : 6));
        }
        c.closePath();
        c.fill();
        c.restore();
      }
      // reflets et mèches tirées vers l'élastique
      c.strokeStyle = '#8a6040';
      c.lineWidth = 0.65;
      const Q0 = proj(0, 157, -11);
      for (let i = -4; i <= 4; i++) {
        const S0 = proj(Math.sin(i * 0.3) * R, 166 - Math.abs(i) * 0.5, Math.cos(i * 0.3) * R * 0.2);
        if (cs < -0.15 || (S0[2] < -2 && Q0[2] < 0)) continue; // les mèches ne passent jamais sur le visage
        c.beginPath();
        c.moveTo(S0[0], S0[1]);
        c.quadraticCurveTo((S0[0] + Q0[0]) / 2, (S0[1] + Q0[1]) / 2 - 2, Q0[0], Q0[1]);
        c.stroke();
      }
      c.fillStyle = '#ffffff1f';
      c.beginPath();
      c.ellipse(-3 - sn * 2, -163, 4.5, 1.8, -0.3, 0, 7);
      c.fill();
    };

    // tout, du plus loin au plus près de nous
    const pq = queueP(),
      L = [jambe(-1), jambe(1)];
    const bg = brasP(-1, po.g, false),
      bd = brasP(1, po.d, true);
    L.sort((p, q) => p.d - q.d).forEach(e => e.f());
    [bg, bd].filter(b => b.d < -7).forEach(b => b.f());
    torse();
    if (pq.d > 0) echarpe();
    if (pq.d < 0) pq.f();
    if (pq.d <= 0) echarpe();
    tete();
    if (pq.d >= 0) pq.f();
    [bg, bd]
      .filter(b => b.d >= -7)
      .sort((p, q) => p.d - q.d)
      .forEach(b => b.f());
    c.restore();
  };

  /* ===================== boucle ===================== */
  t0 = performance.now();
  const boucle = now => {
    const dt = Math.min(0.033, (now - t0) / 1000),
      t = now / 1000;
    t0 = now;
    if (F.vol) {
      for (let i = 0; i < 8; i++) pas(dt / 8);
      F.t += dt;
      bruit('glisse', F.sol && !F.in && !F.tombe ? Math.hypot(F.vx, F.vz) : 0);
      if (!F.in) {
        const arrete = F.sol && Math.hypot(F.vx, F.vz) < 0.02;
        F.arret = arrete || F.tombe || prof(F.x, F.z) > 14 ? F.arret + dt : 0;
        // il s'efface doucement, puis un nouveau fichier arrive
        if (F.arret > (F.tombe ? 0.05 : 0.7)) F.al -= dt * (F.tombe ? 3 : 2.2);
        if (F.al <= 0 && !F.fin) {
          F.fin = 1;
          if (!fin) {
            aide();
            nouveau(); // un nouveau fichier revient dans sa main
          }
        }
      }
    }
    // la caméra suit Célestine à 2,6 m, dans l'angle choisi au doigt
    Vt.yaw = ctl.yaw;
    Vt.x = C.x - Math.sin(Vt.yaw) * 2.6;
    Vt.z = C.z - Math.cos(Vt.yaw) * 2.6;
    const kc = Math.min(1, dt * 6);
    V.yaw += Math.atan2(Math.sin(Vt.yaw - V.yaw), Math.cos(Vt.yaw - V.yaw)) * Math.min(1, dt * 14);
    V.x += (Vt.x - V.x) * kc;
    V.z += (Vt.z - V.z) * kc;
    marche(dt);
    ciel(t);
    lyon();
    voisinsDessin(t);
    neige(dt, false);
    toit();
    // tout ce qui est sur le toit, dessiné du plus loin au plus proche
    const L = OBS.map(ob => [prof(ob.x, ob.z), () => obstacle(ob, t)]);
    L.push([prof(0, TZ), () => traineau(t, dt)]);
    L.push([prof(0, CZ), () => cheminee(t, F.in && (() => (c.save(), ouverture(), c.clip(), fichier(), c.restore())))]);
    if (!F.in && !C.tient)
      L.push([
        prof(F.x, F.z),
        () => {
          if (F.z <= RIDGE || V.z > RIDGE) return (ombre(), fichier());
          // derrière le faîtage : on ne voit que ce qui dépasse au-dessus de la ligne du toit
          c.save();
          poly([
            [-40, 0, RIDGE],
            [40, 0, RIDGE],
            [40, 60, RIDGE],
            [-40, 60, RIDGE]
          ]);
          c.clip();
          fichier();
          c.restore();
        }
      ]);
    L.push([prof(C.x, C.z), () => celestine(t)]);
    L.sort((p, q) => q[0] - p[0]).forEach(e => e[1]());
    particules(dt);
    neige(dt, true);
    devant(t);
    raf = requestAnimationFrame(boucle);
  };

  /* ===================== commandes ===================== */
  // glisser le doigt (ou la souris) sur la scène : la vue tourne autour de Célestine
  let regard = null;
  cv.addEventListener('pointerdown', e => {
    if (regard) return;
    regard = { id: e.pointerId, x: e.clientX };
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (!regard || e.pointerId != regard.id) return;
    ctl.yaw += (e.clientX - regard.x) * 0.0075;
    regard.x = e.clientX;
  });
  const finRegard = e => regard && e.pointerId == regard.id && (regard = null);
  cv.addEventListener('pointerup', finRegard);
  cv.addEventListener('pointercancel', finRegard);
  // joystick
  const bouton = joy.querySelector('i');
  let joyId = null;
  const joyBouge = e => {
    const r = joy.getBoundingClientRect(),
      R0 = r.width / 2,
      dx = e.clientX - (r.left + R0),
      dy = e.clientY - (r.top + R0),
      d = Math.hypot(dx, dy),
      k = d > R0 * 0.75 ? (R0 * 0.75) / d : 1;
    ctl.jx = (dx * k) / (R0 * 0.75);
    ctl.jy = (dy * k) / (R0 * 0.75);
    bouton.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
  };
  joy.addEventListener('pointerdown', e => {
    joyId = e.pointerId;
    joy.setPointerCapture(e.pointerId);
    joy.classList.add('on');
    joyBouge(e);
  });
  joy.addEventListener('pointermove', e => e.pointerId == joyId && joyBouge(e));
  const joyFin = e => {
    if (e.pointerId != joyId) return;
    joyId = null;
    ctl.jx = ctl.jy = 0;
    bouton.style.transform = '';
    joy.classList.remove('on');
  };
  joy.addEventListener('pointerup', joyFin);
  joy.addEventListener('pointercancel', joyFin);
  // bouton « Lancer » : on maintient, puis on relâche
  btn.addEventListener('pointerdown', e => {
    btn.setPointerCapture(e.pointerId);
    armer();
  });
  btn.addEventListener('pointerup', lancer);
  btn.addEventListener('pointercancel', lancer);
  btn.addEventListener('contextmenu', e => e.preventDefault());
  // clavier (sur ordinateur) : flèches ou ZQSD / WASD pour marcher, espace pour lancer
  const touches = {};
  const clavier = () => {
    const k = n => (touches[n] ? 1 : 0);
    ctl.kx = k('ArrowRight') + k('d') - k('ArrowLeft') - k('q') - k('a');
    ctl.ky = k('ArrowDown') + k('s') - k('ArrowUp') - k('z') - k('w');
  };
  const bas = e => {
    if (e.key == ' ') {
      e.preventDefault();
      if (!e.repeat) armer();
      return;
    }
    touches[e.key.length == 1 ? e.key.toLowerCase() : e.key] = 1;
    clavier();
  };
  const haut = e => {
    if (e.key == ' ') return lancer();
    touches[e.key.length == 1 ? e.key.toLowerCase() : e.key] = 0;
    clavier();
  };
  addEventListener('keydown', bas);
  addEventListener('keyup', haut);
  raf = requestAnimationFrame(boucle);
}

// le fichier choisi : d'abord le lancer dans la cheminée, puis on l'ouvre
function mysOpen(input) {
  const f = input.files[0];
  input.value = '';
  if (!f) return;
  mysLancer(() => mysLire(f), f);
}
async function mysLire(f) {
  try {
    const magic = new TextDecoder().decode(await f.slice(0, 19).arrayBuffer());
    if (!magic.startsWith('AVENTMUS1')) throw 0;
    const hl = +magic.slice(9),
      head = JSON.parse(new TextDecoder().decode(await f.slice(19, 19 + hl).arrayBuffer()));
    let off = 19 + hl,
      n = 0;
    popup(`<h2>🎁 Ouverture…</h2><p id="mysp">0 %</p>`);
    for (const it of head) {
      const b = f.slice(off, off + it.size, it.type);
      off += it.size;
      await MDB.put(it.d, { blob: new Blob([await b.arrayBuffer()], { type: it.type }), name: it.name, at: Date.now() });
      n++;
      const p = $('#mysp');
      if (p) p.textContent = Math.round((n / head.length) * 100) + ' %';
    }
    await YTM.refresh();
    try {
      confetti();
      ding();
    } catch (_) {}
    slog('🎁', `Ouvre le fichier mystère (${n} chansons)`);
    try {
      dispatchEvent(new Event('mysdone'));
    } catch (_) {}
    popup(
      `<div style="font-size:3rem">🎁</div><h2>C'est ouvert !</h2><p>Le fichier mystère est bien rangé dans ton calendrier.</p><p class="muted">Ce qu'il cache se dévoilera plus tard… 😉</p><button onclick="closePop();render()">J'ai hâte ❤️</button>`
    );
  } catch (e) {
    popup(
      `<h2>Oups</h2><p>Ce n'est pas le bon fichier, ou il est abîmé. Demande à Valentin de te le renvoyer.</p><button onclick="closePop()">OK</button>`
    );
  }
}
addEventListener('change', e => {
  const t = e.target;
  if (!t.classList) return;
  if (t.classList.contains('mysmk')) mysMake(t);
  else if (t.classList.contains('mysop')) mysOpen(t);
});
function mysBtn() {
  return `<label class="btn mysb">🎁 Ouvrir le fichier mystère de Valentin<input type="file" class="fpick mysop"></label>`;
}
/* ---------- Mode admin : importer les MP3 ---------- */
const nrm = t =>
  String(t || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
const MUSFOR = {
  b4: '👹 Combat mini-boss · Noémie (jour 4) · les ongles',
  b8: '👹 Combat mini-boss · Emma (jour 8) · le test de vue',
  b11: '👹 Combat mini-boss · Edgar (jour 11) · tacos express',
  b15: '👹 Combat mini-boss · Nora (jour 15) · les fiches de révision',
  b19: '👹 Combat mini-boss · Sandrine (jour 19) · le comptoir',
  b22: '👹 Combat mini-boss · Valentin (jour 22) · le métro Bellecour',
  b24: '😈 Combat final · partie 1 contre Valentin · le combat',
  b27: '😈 Combat final · partie 2 · le duel de rock',
  b28: '😈 Combat final · partie 3 · Pizza Mario',
  b29: '😈 Combat final · partie 4 · le cadenas',
  b30: '😈 Combat final · dialogues (intro et scènes entre les parties)',
  b31: '💖 Combat final · scène de fin (la gravure, « Je t’aime »)',
  b25: '🎬 Générique de fin',
  b26: '📖 Album photo (quand il est ouvert)'
};
const musFor = d => MUSFOR[d] || (DAYS[+d] ? `📅 Jour ${d} du calendrier · ${DAYS[+d].t}` : '');
function musAdmin() {
  const rows = Object.keys(SONGS)
    .sort((a, b) => /^b/.test(a) - /^b/.test(b) || parseInt(a.replace('b', '')) - parseInt(b.replace('b', '')))
    .map(d => {
      const sg = songOf(d, SONGS[d]);
      return `<div class="mrow"><span class="mday">${/^b/.test(d) ? '👹' : d}</span><span class="mtt"><b>${esc(sg.t)}</b><em class="mfor">${esc(musFor(d))}</em>${sg.a ? `<small>${esc(sg.a)}</small>` : ''}</span>${YTM.has(d) ? '<span title="Fichier présent">✅</span>' : '<span class="muted">—</span>'}<label class="btn sm mbt">📂<input type="file" accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg" class="fpick mpick" data-d="${d}"></label>${YTM.has(d) ? `<button class="sm alt mbt" onclick="musDel('${d}')">🗑</button>` : ''}</div>`;
    })
    .join('');
  popup(`<h2>🎵 Musiques des mini-jeux</h2><p class="muted" style="margin:0 0 8px">${YTM.count()}/${Object.keys(SONGS).length} fichiers sur cet appareil (👹 = combat final, générique de fin et album photo). Les fichiers restent uniquement sur cet appareil : importe-les directement sur sa tablette.</p>
 <p><button onclick="mysFromDevice()">📦 Créer le fichier mystère avec les ${YTM.count()} musiques de cet appareil</button></p>
 <p><label class="btn">📦 Fichier mystère à partir d'autres fichiers<input type="file" multiple accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg" class="fpick mysmk"></label></p><p>${mysBtn()}</p>
 <p><label class="btn">📂 Importer plusieurs fichiers d'un coup<input type="file" multiple accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg" class="fpick mpick" data-d="multi"></label></p><p class="muted" style="font-size:.8rem;margin:0 0 8px">Chaque fichier est rangé tout seul si son nom contient le titre de la chanson (ex. « Last Nite.mp3 »).</p><div class="mlist">${rows}</div><button class="alt" onclick="admin()">← Retour</button>`);
}
async function musImport(input) {
  const files = [...input.files];
  input.value = '';
  if (!files.length) return;
  let ok = 0,
    miss = [];
  toast('🎵 Import en cours…');
  for (const f of files) {
    let d = input.dataset.d;
    if (d == 'multi') d = musMatch(f.name);
    if (!d) {
      miss.push(f.name);
      continue;
    }
    try {
      await MDB.put(d, { blob: f, name: f.name, at: Date.now() });
      ok++;
    } catch (e) {
      miss.push(f.name + ' (trop gros ?)');
    }
  }
  await YTM.refresh();
  toast(`🎵 ${ok} fichier${ok > 1 ? 's' : ''} importé${ok > 1 ? 's' : ''}`);
  musAdmin();
  if (miss.length) setTimeout(() => appAlert('Pas reconnus (utilise le bouton 📂 de la bonne ligne) :\n' + miss.join('\n')), 300);
}
async function musDel(d) {
  try {
    await MDB.del(d);
  } catch (_) {}
  await YTM.refresh();
  musAdmin();
}
addEventListener('change', e => {
  if (e.target.classList && e.target.classList.contains('mpick')) musImport(e.target);
});
function plMark() {
  try {
    if (document.getElementById('plbox') && !document.activeElement?.classList?.contains('plq')) plRefresh();
  } catch (_) {}
  document.querySelectorAll('.plr').forEach((r, i) => {
    const on = YTM.li == i;
    r.classList.toggle('play', on);
    const b = r.querySelector('.plp');
    if (b) b.textContent = on ? '⏸' : '▶';
  });
}
function plTap(i) {
  if (YTM.li == i) {
    YTM.stop();
    try {
      bgm();
    } catch (_) {}
  } else YTM.list(i);
}
