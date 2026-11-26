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
/* ---------- Fichier mystère : avant de l'ouvrir, on le lance dans la cheminée du Père Noël ---------- */
// Lancer « en profondeur » (façon paper toss) : on glisse le doigt vers le haut, le fichier part vers la cheminée.
// Monde en mètres : x = gauche/droite, y = hauteur, z = profondeur. cb est appelé quand le fichier est tombé dedans.
function mysLancer(cb) {
  const o = document.createElement('div');
  o.className = 'mysl';
  o.innerHTML = `<canvas></canvas><div class="mysl-h"><b>Livraison spéciale</b><small>Glisse le doigt vers le haut pour lancer le fichier dans la cheminée.</small><span class="mysl-n">Livré <i>0</i></span></div><p class="mysl-tip"></p><button class="mysl-pass">Le déposer à la main</button>`;
  document.body.appendChild(o);
  const cv = o.querySelector('canvas'),
    c = cv.getContext('2d'),
    tip = o.querySelector('.mysl-tip'),
    pass = o.querySelector('.mysl-pass');
  // --- monde ---
  const CAM = 2.9, // hauteur de la caméra
    CZ = 6, // profondeur de la cheminée
    CX = 0.62, // demi-largeur de la cheminée
    CD = 0.42, // demi-profondeur
    TOP = 1.5, // hauteur du haut de la cheminée
    OX = 0.47, // demi-ouverture (x)
    OZ = 0.32, // demi-ouverture (z)
    G = 9,
    Z0 = 0.85,
    Y0 = 2.15,
    ANG = (52 * Math.PI) / 180; // angle du lancer
  let W, H, dpr, f, hy, F, drag, hist, rate, fin, raf, t0, idle, fumees, flocons, etoiles, ville, voisins, eclats;
  // obstacles posés sur le toit : le fichier bute contre eux (cylindres : x, z, rayon, hauteur)
  const OBS = [
    { t: 'bonhomme', x: -1.55, z: 3.7, r: 0.3, h: 1.05 },
    { t: 'cadeaux', x: 1.55, z: 3.1, r: 0.34, h: 0.55 },
    { t: 'sapin', x: 2.25, z: 7.2, r: 0.45, h: 1.7 },
    { t: 'antenne', x: -2.3, z: 7.6, r: 0.1, h: 1.9 }
  ];
  const RIDGE = 8.5, // faîtage : au-delà, le fichier tombe de l'autre côté
    BORD = 0.75; // bord du toit côté caméra (la gouttière)
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
    voisins = Array.from({ length: Math.ceil(W / 70) + 2 }, (_, i) => ({
      x: i * 70 - 30 + ((i * 23) % 17),
      w: 60 + ((i * 31) % 30),
      h: 16 + ((i * 17) % 14)
    }));
    ville = Array.from({ length: Math.ceil(W / 14) + 2 }, (_, i) => ({
      x: i * 14 - 7,
      h: 10 + ((i * 37) % 23) + (i % 5 == 0 ? 14 : 0),
      w: (i * 13) % 4
    }));
  };
  const P = (x, y, z) => [W / 2 + (x * f) / z, hy - ((y - CAM) * f) / z, f / z]; // projection : [x écran, y écran, échelle]
  // nouveau fichier : il remonte en douceur depuis le bas de l'écran
  const depart = () =>
    (F = { x: 0, y: Y0, z: Z0, vx: 0, vy: 0, vz: 0, a: -0.08, va: 0, vol: 0, in: 0, sol: 0, t: 0, arret: 0, al: 1, ent: 1, tombe: 0 });
  taille();
  depart();
  rate = fin = 0;
  idle = 0;
  fumees = [];
  eclats = [];
  etoiles = Array.from({ length: 90 }, () => ({
    x: Math.random(),
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
      c.globalAlpha = 0.45 + 0.4 * Math.sin(t * 2 + s.p);
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(s.x * W, s.y * H, s.r, 0, 7);
      c.fill();
    });
    c.globalAlpha = 1;
    const mx = W * 0.8,
      my = H * 0.13;
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
    // colline de Fourvière et sa basilique, puis les toits de la ville
    const base = hy + 6;
    c.fillStyle = '#121d3f';
    c.beginPath();
    c.moveTo(0, base);
    c.quadraticCurveTo(W * 0.12, base - 52, W * 0.3, base - 30);
    c.lineTo(W * 0.3, base);
    c.fill();
    const bx = W * 0.15,
      by = base - 50;
    c.fillRect(bx - 18, by - 12, 36, 14);
    c.fillRect(bx - 18, by - 22, 6, 12);
    c.fillRect(bx + 12, by - 22, 6, 12);
    c.fillRect(bx - 4, by - 18, 8, 8);
    c.fillStyle = '#ffd27a';
    c.fillRect(bx - 1, by - 8, 2, 3);
    c.fillStyle = '#18264f';
    ville.forEach(b => {
      c.fillRect(b.x, base - b.h, 13, b.h + 4);
      if (b.w == 1) c.fillRect(b.x + 3, base - b.h - 5, 3, 5);
    });
    c.fillStyle = '#ffcf6e';
    ville.forEach((b, i) => {
      if (i % 3 == 0) c.fillRect(b.x + 3, base - b.h + 4, 2.5, 2.5);
      if (i % 4 == 1) c.fillRect(b.x + 8, base - b.h + 9, 2.5, 2.5);
    });
  };
  const toit = () => {
    // pan de toit enneigé qui part au loin
    const pts = [P(-9, 0, 0.6), P(9, 0, 0.6), P(9, 0, 8.5), P(-9, 0, 8.5)];
    let g = c.createLinearGradient(0, pts[2][1], 0, H);
    g.addColorStop(0, '#c9d6ee');
    g.addColorStop(1, '#f4f8ff');
    c.fillStyle = g;
    c.beginPath();
    pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
    c.closePath();
    c.fill();
    // rangées de tuiles qui dépassent de la neige
    c.strokeStyle = '#9fb0cf';
    for (let z = 1; z < 8.5; z *= 1.16) {
      const [a, ay] = P(-9, 0, z),
        [b] = P(9, 0, z),
        s = f / z;
      c.lineWidth = Math.max(0.5, s * 0.012);
      c.globalAlpha = 0.55;
      c.beginPath();
      for (let x = Math.max(a, -20); x < Math.min(b, W + 20); x += Math.max(6, s * 0.18)) {
        c.moveTo(x, ay);
        c.quadraticCurveTo(x + s * 0.045, ay + s * 0.02, x + s * 0.09, ay);
      }
      c.stroke();
    }
    c.globalAlpha = 1;
    // faîtage au loin
    const [rx1, ry1] = P(-9, 0, 8.5),
      [rx2] = P(9, 0, 8.5);
    c.fillStyle = '#e9eff9';
    c.fillRect(rx1, ry1 - 3, rx2 - rx1, 5);
    guirlandeFaite(performance.now() / 1000);
  };
  const quad = (a, b, d, e, col) => {
    c.fillStyle = col;
    c.beginPath();
    c.moveTo(a[0], a[1]);
    c.lineTo(b[0], b[1]);
    c.lineTo(d[0], d[1]);
    c.lineTo(e[0], e[1]);
    c.closePath();
    c.fill();
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
  const chemineeFond = t => {
    // côtés et dessus (derrière le fichier quand il est loin)
    const fl = [P(-CX, 0, CZ - CD), P(CX, 0, CZ - CD), P(CX, TOP, CZ - CD), P(-CX, TOP, CZ - CD)],
      bl = [P(-CX, 0, CZ + CD), P(CX, 0, CZ + CD), P(CX, TOP, CZ + CD), P(-CX, TOP, CZ + CD)];
    // ombre au sol
    c.fillStyle = '#8796b833';
    const [sx, sy, ss] = P(0.35, 0, CZ + 0.6);
    c.beginPath();
    c.ellipse(sx, sy, ss * 0.9, ss * 0.18, 0, 0, 7);
    c.fill();
    quad(fl[1], bl[1], bl[2], fl[2], '#7d2f22'); // côté droit
    quad(fl[0], bl[0], bl[3], fl[3], '#8e3626'); // côté gauche
    // dessus : couronne de pierre + neige
    quad(fl[3], fl[2], bl[2], bl[3], '#cfd8e6');
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
    // petite fumée tranquille
    if (Math.random() < 0.12) fumees.push({ x: (Math.random() - 0.5) * 0.3, y: TOP + 0.05, z: CZ, r: 0.08, a: 0.35, v: 0.35 });
  };
  const briques = (x0, x1, y0, y1, z) => {
    const a = P(x0, y0, z),
      b = P(x1, y1, z),
      s = f / z;
    let g = c.createLinearGradient(a[0], 0, b[0], 0);
    g.addColorStop(0, '#b4462f');
    g.addColorStop(1, '#9a3b28');
    c.fillStyle = g;
    c.fillRect(a[0], b[1], b[0] - a[0], a[1] - b[1]);
    const rh = 0.11 * s,
      bw = 0.26 * s;
    c.strokeStyle = '#6e2619';
    c.lineWidth = Math.max(0.6, s * 0.012);
    for (let r = 0, yy = a[1]; yy > b[1]; r++, yy -= rh) {
      c.beginPath();
      c.moveTo(a[0], yy);
      c.lineTo(b[0], yy);
      c.stroke();
      for (let xx = a[0] + (r % 2) * bw * 0.5; xx < b[0]; xx += bw) {
        c.beginPath();
        c.moveTo(xx, yy);
        c.lineTo(xx, Math.max(b[1], yy - rh));
        c.stroke();
      }
    }
    // reflets de lune
    c.fillStyle = '#ffffff10';
    c.fillRect(a[0], b[1], (b[0] - a[0]) * 0.18, a[1] - b[1]);
  };
  const chemineeDevant = () => {
    briques(-CX, CX, 0, TOP, CZ - CD);
    // rebord de pierre et neige
    const a = P(-CX - 0.06, TOP, CZ - CD),
      b = P(CX + 0.06, TOP, CZ - CD),
      s = f / (CZ - CD);
    c.fillStyle = '#d8dee8';
    c.fillRect(a[0], a[1] - s * 0.02, b[0] - a[0], s * 0.07);
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(a[0], a[1]);
    for (let i = 0; i <= 10; i++) {
      const xx = a[0] + ((b[0] - a[0]) * i) / 10;
      c.quadraticCurveTo(xx - s * 0.03, a[1] - s * (0.05 + (i % 3) * 0.015), xx, a[1] - s * 0.01);
    }
    c.lineTo(b[0], a[1] + s * 0.03);
    c.quadraticCurveTo((a[0] + b[0]) / 2, a[1] + s * 0.09, a[0], a[1] + s * 0.03);
    c.fill();
    // neige accumulée au pied
    const p1 = P(-CX - 0.15, 0, CZ - CD - 0.05),
      p2 = P(CX + 0.15, 0, CZ - CD - 0.05);
    c.beginPath();
    c.moveTo(p1[0], p1[1]);
    c.quadraticCurveTo((p1[0] + p2[0]) / 2, p1[1] - s * 0.16, p2[0], p2[1]);
    c.fill();
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
    const [x, y, s] = P(F.x, 0, Math.max(0.6, F.z));
    if (y > H + 20) return;
    if (F.tombe || F.al <= 0) return;
    const k = Math.max(0.15, 1 - F.y / 4) * Math.min(1, F.al);
    c.fillStyle = `rgba(60,75,110,${0.28 * k})`;
    c.beginPath();
    c.ellipse(x, y, s * 0.17 * k + 2, s * 0.045 * k + 1, 0, 0, 7);
    c.fill();
  };
  const fichier = () => {
    const [x, y, s] = P(F.x, F.y, F.z),
      k = s * 0.0042; // le fichier mesure ~ 50 × 64 « unités » à 1 m
    if (F.al <= 0) return;
    c.save();
    c.globalAlpha = Math.max(0, Math.min(1, F.al));
    c.translate(x, y);
    c.rotate(F.a);
    c.scale(k, k);
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
      const [x, y, s] = P(p.x, p.y, p.z);
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
  const guide = t => {
    // main qui montre le geste, tant qu'on n'a pas lancé
    if (F.vol || drag || fin) return;
    idle += 1;
    if (idle < 70) return;
    const [x, y, s] = P(0, Y0, Z0),
      k = ((t * 0.9) % 1.4) / 1.4,
      yy = y + s * 0.05 - k * s * 0.55;
    c.globalAlpha = Math.sin(Math.min(1, k * 1.4) * Math.PI) * 0.9;
    c.font = `${Math.round(s * 0.13)}px system-ui`;
    c.textAlign = 'center';
    c.fillText('👆', x + s * 0.12, yy + s * 0.2);
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
    voisins.forEach((v, i) => {
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
        const on = (i * 7 + k * 3) % 5 != 0;
        c.fillStyle = on ? '#ffcf73' : '#33447a';
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
  const traineau = t => {
    // le traîneau du Père Noël passe devant la lune toutes les 14 s
    const k = (t % 14) / 6;
    if (k > 1) return;
    const x = W * 1.1 - k * W * 1.25,
      y = H * 0.14 + Math.sin(k * 6) * 8;
    c.save();
    c.translate(x, y);
    c.fillStyle = '#0a1230';
    for (let r = 0; r < 4; r++) {
      const rx = -20 - r * 22,
        ry = Math.sin(t * 8 + r) * 2;
      c.beginPath();
      c.ellipse(rx, ry, 8, 3.5, 0, 0, 7);
      c.fill();
      c.fillRect(rx - 6, ry, 1.6, 6);
      c.fillRect(rx + 4, ry, 1.6, 6);
      c.fillRect(rx - 8, ry - 7, 2, 6);
      c.beginPath();
      c.moveTo(rx - 9, ry - 7);
      c.lineTo(rx - 13, ry - 11);
      c.lineTo(rx - 7, ry - 9);
      c.fill();
    }
    c.strokeStyle = '#0a1230';
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(-16, 0);
    c.lineTo(6, 2);
    c.stroke();
    c.beginPath();
    c.moveTo(4, 6);
    c.quadraticCurveTo(6, -4, 22, -2);
    c.lineTo(24, 6);
    c.closePath();
    c.fill();
    c.beginPath();
    c.arc(18, -6, 4, 0, 7);
    c.fill();
    c.fillStyle = '#c0233a';
    c.beginPath();
    c.arc(18, -6, 2, 0, 7);
    c.fill();
    c.restore();
  };
  const guirlandeFaite = t => {
    // guirlande d'ampoules le long du faîtage
    for (let x = -8.6; x <= 8.6; x += 0.45) {
      const [px, py, s] = P(x, 0.02 + Math.abs(Math.sin(x * 3.5)) * 0.05, RIDGE);
      if (px < -10 || px > W + 10) continue;
      const i = Math.round(x / 0.45);
      ampoule(px, py - s * 0.02, Math.max(1.3, s * 0.03), COUL[(i + 50) % 5], Math.sin(t * 2.5 + i) > -0.4);
    }
  };
  const obstacle = (ob, t) => {
    const [x, y, s] = P(ob.x, 0, ob.z);
    // ombre
    c.fillStyle = '#7d8db033';
    c.beginPath();
    c.ellipse(x + s * 0.12, y, s * ob.r * 1.3, s * ob.r * 0.3, 0, 0, 7);
    c.fill();
    if (ob.t == 'bonhomme') {
      const boule = (yy, r) => {
        const g = c.createRadialGradient(x - r * 0.35, yy - r * 0.35, r * 0.1, x, yy, r);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(1, '#c6d3ea');
        c.fillStyle = g;
        c.beginPath();
        c.arc(x, yy, r, 0, 7);
        c.fill();
      };
      boule(y - s * 0.28, s * 0.3);
      boule(y - s * 0.7, s * 0.21);
      boule(y - s * 0.98, s * 0.14);
      c.fillStyle = '#c0233a';
      c.fillRect(x - s * 0.15, y - s * 0.86, s * 0.3, s * 0.06);
      c.fillRect(x + s * 0.05, y - s * 0.86, s * 0.06, s * 0.2);
      c.fillStyle = '#1b1b22';
      c.fillRect(x - s * 0.13, y - s * 1.14, s * 0.26, s * 0.04);
      c.fillRect(x - s * 0.08, y - s * 1.28, s * 0.16, s * 0.15);
      [
        [-0.05, -1.01],
        [0.05, -1.01],
        [0, -0.75],
        [0, -0.66],
        [0, -0.42]
      ].forEach(([a, b]) => {
        c.beginPath();
        c.arc(x + a * s, y + b * s, s * 0.018, 0, 7);
        c.fill();
      });
      c.fillStyle = '#f28c28';
      c.beginPath();
      c.moveTo(x, y - s * 0.97);
      c.lineTo(x + s * 0.13, y - s * 0.95);
      c.lineTo(x, y - s * 0.94);
      c.fill();
      c.strokeStyle = '#6b4a2b';
      c.lineWidth = Math.max(1, s * 0.015);
      c.beginPath();
      c.moveTo(x - s * 0.18, y - s * 0.72);
      c.lineTo(x - s * 0.42, y - s * 0.88);
      c.moveTo(x + s * 0.18, y - s * 0.72);
      c.lineTo(x + s * 0.4, y - s * 0.84);
      c.stroke();
    } else if (ob.t == 'cadeaux') {
      const boite = (dx, w, hh, col, rub) => {
        const bx = x + dx * s,
          bw = w * s,
          bh = hh * s;
        c.fillStyle = col;
        c.fillRect(bx - bw / 2, y - bh, bw, bh);
        c.fillStyle = '#00000022';
        c.fillRect(bx + bw * 0.2, y - bh, bw * 0.3, bh);
        c.fillStyle = rub;
        c.fillRect(bx - bw * 0.06, y - bh, bw * 0.12, bh);
        c.fillRect(bx - bw / 2, y - bh * 0.55, bw, bh * 0.1);
        c.fillStyle = '#ffffff';
        c.fillRect(bx - bw / 2, y - bh - s * 0.02, bw, s * 0.035);
      };
      boite(-0.17, 0.34, 0.32, '#2f8f5b', '#ffd166');
      boite(0.18, 0.3, 0.42, '#c0233a', '#ffffff');
      boite(0.0, 0.24, 0.22, '#3a5ab8', '#ff8fb8');
    } else if (ob.t == 'sapin') {
      for (let k = 0; k < 4; k++) {
        const w = (0.5 - k * 0.1) * s,
          yy = y - s * (0.2 + k * 0.33);
        c.fillStyle = k % 2 ? '#1f6b45' : '#22784d';
        c.beginPath();
        c.moveTo(x - w, yy);
        c.lineTo(x, yy - s * 0.55);
        c.lineTo(x + w, yy);
        c.closePath();
        c.fill();
        c.fillStyle = '#eef4ff';
        c.fillRect(x - w * 0.9, yy - s * 0.015, w * 1.8, s * 0.03);
      }
      c.fillStyle = '#5b3a22';
      c.fillRect(x - s * 0.06, y - s * 0.2, s * 0.12, s * 0.2);
      for (let k = 0; k < 14; k++) {
        const yy = y - s * (0.25 + (k % 7) * 0.2),
          xx = x + Math.sin(k * 2.3) * s * (0.4 - (k % 7) * 0.05);
        ampoule(xx, yy, Math.max(1.2, s * 0.025), COUL[k % 5], Math.sin(t * 3 + k) > -0.3);
      }
      c.fillStyle = '#ffd76a';
      c.font = `${Math.round(s * 0.22)}px system-ui`;
      c.textAlign = 'center';
      c.fillText('★', x, y - s * 1.6);
    } else {
      c.strokeStyle = '#3c4660';
      c.lineWidth = Math.max(1.2, s * 0.03);
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x, y - s * ob.h);
      for (let k = 0; k < 4; k++) {
        const yy = y - s * (ob.h - 0.1 - k * 0.22),
          w = s * (0.45 - k * 0.08);
        c.moveTo(x - w, yy);
        c.lineTo(x + w, yy);
      }
      c.stroke();
      c.fillStyle = '#ffffff';
      for (let k = 0; k < 4; k++)
        c.fillRect(x - s * (0.45 - k * 0.08), y - s * (ob.h - 0.1 - k * 0.22) - s * 0.03, s * (0.9 - k * 0.16), s * 0.03);
      c.fillStyle = '#ff5a5f';
      c.beginPath();
      c.arc(x, y - s * ob.h, s * 0.04, 0, 7);
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
      }
      // mur de derrière (si on arrive par l'arrière)
      if (p.z >= CZ + CD && F.z < CZ + CD && Math.abs(F.x) < CX) {
        F.z = CZ + CD + 0.001;
        F.vz = Math.abs(F.vz) * 0.28;
        choc(0.6);
      }
      // côtés
      if (Math.abs(F.z - CZ) < CD && Math.abs(p.x) >= CX && Math.abs(F.x) < CX) {
        F.x = Math.sign(p.x) * (CX + 0.001);
        F.vx = -F.vx * 0.3;
        choc(0.6);
      }
    }
    // obstacles du toit
    OBS.forEach(ob => {
      const dx = F.x - ob.x,
        dz = F.z - ob.z,
        d = Math.hypot(dx, dz),
        m = ob.r + 0.12;
      if (F.y < ob.h && d < m && d > 0) {
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
        }
      }
      // atterrir sur le dessus d'un obstacle bas (les cadeaux)
      if (ob.t == 'cadeaux' && p.y >= ob.h && F.y < ob.h && d < ob.r) {
        F.y = ob.h;
        F.vy = Math.abs(F.vy) * 0.25;
      }
    });
    if (F.tombe) return;
    // bord du toit côté caméra : il ne revient pas vers nous
    if (F.z < BORD && F.y < 0.5) {
      F.z = BORD;
      F.vz = Math.abs(F.vz) * 0.25;
    }
    // il passe le faîtage ou le bord : il tombe de l'autre côté
    if (F.z > RIDGE || Math.abs(F.x) > 4.2) {
      if (F.y < 0.05) F.tombe = 1;
      return;
    }
    // le toit : rebonds, puis glissade sur la neige avec frottement
    if (F.y <= 0.03) {
      F.y = 0.03;
      if (F.vy < -1.4) {
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
    try {
      SFX('tap');
    } catch (_) {}
    const [x, y] = P(F.x, F.y, F.z);
    for (let i = 0; i < 10 * k; i++) eclats.push({ x, y, vx: (Math.random() - 0.5) * 160, vy: -Math.random() * 140, t: 0.6, c: '#ffffff' });
  };
  const entre = () => {
    F.in = 1;
    F.vy = Math.min(F.vy, -1);
    F.vx *= 0.2;
    F.vz *= 0.2;
    if (fin) return;
    fin = 1;
    o.querySelector('.mysl-n i').textContent = '1';
    o.querySelector('.mysl-n').classList.add('ok');
    try {
      SFX('ok');
    } catch (_) {}
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
    tip.textContent = rate >= 3 ? 'Un geste franc vers le haut, droit sur la cheminée ⬆️' : rate == 1 ? 'Presque ! Réessaie 😉' : '';
    if (rate >= 6) pass.classList.add('on');
  };
  const fermer = () => {
    cancelAnimationFrame(raf);
    removeEventListener('resize', taille);
    o.classList.add('out');
    setTimeout(() => {
      o.remove();
      cb();
    }, 450);
  };
  pass.onclick = () => {
    if (fin) return;
    F = { x: 0, y: TOP + 0.4, z: CZ, vx: 0, vy: -1, vz: 0, a: 0, va: 0, vol: 1, in: 0, sol: 0, t: 0 };
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
      if (!F.in) {
        const arrete = F.sol && Math.hypot(F.vx, F.vz) < 0.02;
        F.arret = arrete || F.tombe || F.z > 14 ? F.arret + dt : 0;
        // il s'efface doucement, puis un nouveau fichier arrive
        if (F.arret > (F.tombe ? 0.05 : 0.7)) F.al -= dt * (F.tombe ? 3 : 2.2);
        if (F.al <= 0 && !F.fin) {
          F.fin = 1;
          if (!fin) {
            aide();
            depart();
            F.ent = 0;
          }
        }
      }
    } else if (!drag && !fin) {
      F.ent = Math.min(1, F.ent + dt * 2.5);
      F.y = Y0 - (1 - F.ent) ** 2 * 0.6 + Math.sin(t * 2.2) * 0.015;
      F.al = F.ent;
    }
    ciel(t);
    traineau(t);
    lyon();
    voisinsDessin(t);
    neige(dt, false);
    toit();
    // tout ce qui est sur le toit, dessiné du plus loin au plus proche
    const L = OBS.map(ob => [ob.z, () => obstacle(ob, t)]);
    L.push([CZ, () => (chemineeFond(t), F.in && (c.save(), ouverture(), c.clip(), fichier(), c.restore()), chemineeDevant())]);
    if (!F.in) L.push([F.z - (F.z > CZ - CD && F.z < CZ + CD && Math.abs(F.x) < CX ? 1 : 0) * 0, () => (ombre(), fichier())]);
    L.sort((p, q) => q[0] - p[0]).forEach(e => e[1]());
    particules(dt);
    neige(dt, true);
    devant(t);
    guide(t);
    raf = requestAnimationFrame(boucle);
  };

  /* ===================== toucher ===================== */
  cv.addEventListener('pointerdown', e => {
    if (F.vol || fin || F.ent < 1 || e.clientY < H * 0.45) return;
    drag = 1;
    idle = 0;
    hist = [[e.clientX, e.clientY, performance.now()]];
    cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    hist.push([e.clientX, e.clientY, performance.now()]);
    if (hist.length > 12) hist.shift();
    const a = hist[0];
    F.x = ((e.clientX - a[0]) / f) * Z0 * 0.4;
    F.y = Y0 - ((e.clientY - a[1]) / f) * Z0 * 0.4;
  });
  const lacher = () => {
    if (!drag) return;
    drag = 0;
    const now = performance.now(),
      r = hist.filter(h => now - h[2] < 140),
      a = r[0] || hist[0],
      b = hist[hist.length - 1],
      dt = Math.max(0.03, (b[2] - a[2]) / 1000),
      vsy = (a[1] - b[1]) / dt, // vitesse vers le haut (px/s)
      vsx = (b[0] - a[0]) / dt;
    if (vsy < 250) {
      depart();
      return;
    }
    // lancer en cloche à angle fixe : la force du geste règle la distance
    const D = CZ - Z0,
      vopt = Math.sqrt((G * D * D) / (2 * Math.cos(ANG) ** 2 * (Y0 + D * Math.tan(ANG) - TOP))),
      tt = D / (vopt * Math.cos(ANG));
    let v = vopt * (vsy / (H * 1.7)),
      vx = (vsx / W) * 2.4;
    // aide discrète : un geste à peu près juste est guidé vers le centre
    if (Math.abs(v - vopt) < vopt * 0.4) v = vopt + (v - vopt) * 0.12;
    if (Math.abs(vx * tt) < 1.2) vx *= 0.1;
    const vy = v * Math.sin(ANG),
      vz = v * Math.cos(ANG);
    Object.assign(F, { vx, vy, vz, va: vx * 2.5 + (Math.random() - 0.5) * 3, vol: 1, t: 0 });
    tip.textContent = '';
  };
  cv.addEventListener('pointerup', lacher);
  cv.addEventListener('pointercancel', lacher);
  raf = requestAnimationFrame(boucle);
}

// le fichier choisi : d'abord le lancer dans la cheminée, puis on l'ouvre
function mysOpen(input) {
  const f = input.files[0];
  input.value = '';
  if (!f) return;
  mysLancer(() => mysLire(f));
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
