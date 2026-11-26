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
    // « aïe ! » (Valentin touché)
    aie: () => {
      const t = now(),
        o2 = A.createOscillator(),
        f2 = A.createBiquadFilter(),
        g = A.createGain();
      o2.type = 'sawtooth';
      o2.frequency.setValueAtTime(420, t);
      o2.frequency.linearRampToValueAtTime(620, t + 0.08);
      o2.frequency.exponentialRampToValueAtTime(260, t + 0.35);
      f2.type = 'bandpass';
      f2.frequency.value = 900;
      f2.Q.value = 3;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
      o2.connect(f2).connect(g).connect(M);
      o2.start(t);
      o2.stop(t + 0.4);
      souffle(t + 0.1, 0.25, 0.15, 'lowpass', 700, 200, 0.8);
    },
    // un vœu, un ange : une cascade de clochettes
    voeu: () => {
      const t = now();
      [1319, 1568, 2093, 2637, 3136].forEach((f, i) => cloche(t + i * 0.07, f, 0.045));
    },
    // elle ramasse le fichier
    ramasse: () => {
      const t = now();
      souffle(t, 0.12, 0.08, 'bandpass', 2400, 1200, 1.2, 0.005);
      ton(t + 0.05, 880, 0.18, 0.05, 'triangle', 1320);
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
    // la danse de la victoire : un petit rythme de breakdance (la boîte à musique se tait)
    beat: () => {
      musique = false;
      const t = now() + 0.05,
        q = 60 / 104 / 4; // une double-croche à 104 battements par minute
      for (let i = 0; i < 56; i++) {
        const tt = t + i * q,
          j = i % 16;
        if (j == 0 || j == 10 || j == 7) ton(tt, 150, 0.16, 0.32, 'sine', 42);
        if (j == 4 || j == 12) (souffle(tt, 0.14, 0.18, 'bandpass', 1900, 0, 0.8, 0.002), ton(tt, 210, 0.08, 0.08, 'triangle', 140));
        if (j % 2 == 0) souffle(tt, 0.035, j % 4 == 2 ? 0.05 : 0.03, 'highpass', 8000, 0, 1, 0.002);
        if (j == 14 && i > 32) souffle(tt, 0.06, 0.12, 'bandpass', 2300, 0, 1, 0.002);
      }
      [523, 659, 784, 1047].forEach((f, i) => ton(t + 56 * q + i * 0.08, f, 0.5, 0.05, 'triangle'));
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
  o.innerHTML = `<canvas></canvas><div class="mysl-h"><b>Livraison spéciale</b><small>Joystick pour marcher, glisse le doigt pour tourner la vue. Maintiens « Lancer » et relâche au bon moment !</small><span class="mysl-n">Livré <i>0</i></span><span class="mysl-vent"><i></i><em></em></span></div><p class="mysl-tip"></p><p class="mysl-sec"></p><div class="mysl-joy"><i></i></div><button class="mysl-lance"><b><i></i></b><span>Lancer</span><u></u></button><div class="mysl-emo"><button class="mysl-emo-b">😊</button><div><button data-e="salut">👋</button><button data-e="bisou">😘</button><button data-e="danse">💃</button><button data-e="boude">😤</button></div></div>`;
  try {
    if (S.mysTrophee) o.querySelector('.mysl-n').classList.add('trophee');
  } catch (_) {}
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
    VMIN = 2.6, // force du lancer : jauge vide…
    VMAX = 9.5, // … et pleine
    REMPLI = 2.4; // secondes pour remplir la jauge
  let W, H, dpr, f, hy, hc, F, rate, fin, raf, t0, fumees, flocons, etoiles, ville, voisins, eclats;
  // Célestine (le personnage qu'on dirige) : elle tient le fichier tant qu'elle ne l'a pas lancé
  let C = { x: 0, z: 2.6, y: 0, vy: 0, ph: 0, v: 0, amp: 0, pen: 0, tient: 1, phi: 0, charge: 0, tir: -9, pTir: null, pose: -9 };
  // obstacles posés sur le toit : le fichier bute contre eux (cylindres : x, z, rayon, hauteur)
  // les surprises cachées quand on rate : chaque élément touché fait quelque chose de drôle, puis se remet en place
  const OE = {},
    T = () => performance.now() / 1000,
    age = k => (OE[k] == null ? 99 : T() - OE[k]),
    DUREE = { bonhomme: 7, cadeaux: 6, sapin: 4.5, antenne: 7.5, traineau: 16, valentin: 3, boule: 2, etoile: 2, ange: 5, glissade: 3 },
    SECRETS = {
      bonhomme: 'Le bonhomme de neige s’écroule ! ⛄',
      sapin: 'Le sapin perd ses aiguilles ! 🎄',
      cadeaux: 'Il y avait un chat dans le cadeau ! 🐱',
      antenne: 'Plus de télé chez le voisin ! 📺',
      traineau: 'Tu as fait tomber le Père Noël ! 🎅💥',
      valentin: 'En plein sur Valentin ! 😵',
      boule: 'Valentin t’a eue avec sa boule de neige ! ☃️',
      etoile: 'Tu as attrapé une étoile filante : fais un vœu ✨',
      ange: 'Un ange dans la neige 👼',
      glissade: 'Quelle glissade ! ⛸️'
    },
    NSEC = 10,
    secEl = o.querySelector('.mysl-sec');
  let crash = null;
  // tous les secrets trouvés : un trophée doré
  const trophee = () => {
    try {
      S.mysTrophee = 1;
      save();
      slog('🏆', 'Fichier mystère : les 10 secrets sont trouvés !');
    } catch (_) {}
    o.querySelector('.mysl-n').classList.add('trophee');
    const d = document.createElement('div');
    d.className = 'mysl-trophee';
    d.innerHTML = '<i>🏆</i><b>Tous les secrets !</b><small>Les 10 surprises du toit sont trouvées.</small>';
    o.appendChild(d);
    bruit('voeu');
    try {
      confetti();
    } catch (_) {}
    setTimeout(() => d.remove(), 4200);
  };
  const surprise = (k, tp) => {
    if (age(k) < DUREE[k]) return;
    OE[k] = T();
    bruit(
      {
        bonhomme: 'eboule',
        sapin: 'aiguilles',
        cadeaux: 'miaou',
        antenne: 'gresille',
        traineau: 'crash',
        valentin: 'aie',
        etoile: 'voeu',
        ange: 'voeu',
        glissade: 'lance'
      }[k]
    );
    let neuf = 0,
      n = 0;
    try {
      S.mysSec = S.mysSec || {};
      neuf = !S.mysSec[k];
      S.mysSec[k] = 1;
      n = Object.keys(S.mysSec).filter(q => SECRETS[q]).length; // seuls les secrets qui existent encore comptent
      if (neuf) {
        save();
        slog('🥚', `Fichier mystère : surprise « ${k} » trouvée (${n}/${NSEC})`);
        if (n == NSEC) setTimeout(trophee, 1800);
      }
    } catch (_) {}
    secEl.innerHTML = (neuf ? '<i>🥚 Nouveau secret !</i>' : '') + `<b>${SECRETS[k]}</b>` + (n ? `<u>${n}/${NSEC}</u>` : '');
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
    if (k == 'traineau')
      crash = { x: tp.x, y: tp.y, z: tp.z, fx: tp.fx, fz: tp.fz, vx: tp.fx * 1.5, vy: 1.4, vz: tp.fz * 1.5, spin: 0, roll: 0, fume: [] };
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
    hc = hy = H * 0.3; // hc : centre de l'image ; hy : la ligne d'horizon (elle remonte quand la caméra regarde vers le bas)
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
  const V = { x: 0, z: 0, yaw: 0, h: 0, p: 0 }, // h : la caméra monte (en m) ; p : elle regarde vers le bas (en radians)
    Vt = { x: 0, z: 0, yaw: 0 };
  const cam = (x, z) => {
    const dx = x - V.x,
      dz = z - V.z,
      co = Math.cos(V.yaw),
      si = Math.sin(V.yaw);
    return [dx * co - dz * si, dx * si + dz * co]; // [à droite, devant]
  };
  // un point vu par la caméra : [à droite, profondeur, en haut], en tenant compte de sa hauteur et de son inclinaison
  const vue = (x, y, z) => {
    const [xr, zr] = cam(x, z),
      yr = y - CAM - V.h,
      cp = Math.cos(V.p),
      sp = Math.sin(V.p);
    return [xr, zr * cp - yr * sp, yr * cp + zr * sp];
  };
  const P = (x, y, z) => {
    const [xr, d, u] = vue(x, y, z),
      zz = Math.max(0.05, d);
    return [W / 2 + (xr * f) / zz, hc - (u * f) / zz, f / zz, d]; // projection : [x écran, y écran, échelle, profondeur]
  };
  const prof = (x, z) => cam(x, z)[1];
  // polygone du monde (points [x, y, z]) coupé au ras de la caméra, puis dessiné
  const poly = pts => {
    const q = pts.map(([x, y, z]) => vue(x, y, z)),
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
    out.forEach(([xr, zr, u], i) => {
      const px = W / 2 + (xr * f) / zr,
        py = hc - (u * f) / zr;
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
      p.x += Math.sin(p.y * 3) * dt * 0.05 + VENT.x * dt * 0.5;
      p.z += VENT.z * dt * 0.5;
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
      s.x += dt * (VENT.x * Math.cos(V.yaw) - VENT.z * Math.sin(V.yaw)) * 0.03 * s.d;
      s.x = (s.x + 1) % 1;
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
  // le traîneau du Père Noël : un vrai modèle en 3D. Il arrive de loin derrière le toit, plonge vers nous en rasant le toit
  // (on peut le toucher avec un lancer fort au bon moment), puis remonte et repart au loin. Un passage dure 11 s, toutes les 17 s (sauf juste après un crash).
  const BZ = [
    [16, 10, 40],
    [8, -0.6, -4],
    [-8, -0.6, -4],
    [-16, 10, 40]
  ];
  const traineauPos = t => {
    if (age('traineau') < DUREE.traineau) return null;
    const k = (t % 17) / 11;
    if (k > 1) return null;
    const u = 1 - k,
      w = [u * u * u, 3 * u * u * k, 3 * u * k * k, k * k * k],
      dw = [-3 * u * u, 3 * u * u - 6 * u * k, 6 * u * k - 3 * k * k, 3 * k * k],
      at = i => w.reduce((s0, wi, j) => s0 + wi * BZ[j][i], 0),
      dt0 = i => dw.reduce((s0, wi, j) => s0 + wi * BZ[j][i], 0),
      dx = dt0(0),
      dz = dt0(2),
      n = Math.hypot(dx, dz);
    return { x: at(0), y: at(1), z: at(2), fx: dx / n, fz: dz / n, pente: Math.atan2(dt0(1), n) };
  };
  // le modèle : (a vers l'avant, b sur le côté, h en hauteur) en mètres, autour du Père Noël
  const traineau3D = (o, t, roll = 0, spin = 0) => {
    const co = Math.cos(spin),
      si = Math.sin(spin),
      fx = o.fx * co - o.fz * si,
      fz = o.fx * si + o.fz * co,
      rx = fz,
      rz = -fx,
      cr = Math.cos(roll),
      sr = Math.sin(roll),
      cp = Math.cos(o.pente || 0),
      sp = Math.sin(o.pente || 0),
      W = (a, b, h) => {
        const bb = b * cr - h * sr,
          hh = b * sr + h * cr,
          aa = a * cp - hh * sp,
          h2 = a * sp + hh * cp;
        return [o.x + fx * aa + rx * bb, o.y + h2, o.z + fz * aa + rz * bb];
      },
      Pw = (a, b, h) => P(...W(a, b, h)),
      D = (a, b, h) => {
        const [x, , z] = W(a, b, h);
        return prof(x, z);
      },
      parts = [],
      ligne = (pts, col, lw) => {
        const q = pts.map(p => Pw(...p));
        c.strokeStyle = col;
        c.lineWidth = Math.max(0.8, q[0][2] * lw);
        c.beginPath();
        q.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.stroke();
      },
      // un « ballon » allongé le long de l'axe avant/arrière (corps des rennes, sac…)
      ovoide = (a, b, h, L, r, col) => {
        const A = Pw(a - L / 2, b, h),
          B = Pw(a + L / 2, b, h),
          M = Pw(a, b, h),
          ang = Math.atan2(B[1] - A[1], B[0] - A[0]),
          rr = r * M[2];
        c.fillStyle = col;
        c.beginPath();
        c.ellipse(M[0], M[1], Math.max(rr, Math.hypot(B[0] - A[0], B[1] - A[1]) / 2 + rr * 0.3), rr, ang, 0, 7);
        c.fill();
      },
      boule = (a, b, h, r, c1, c2) => {
        const [x, y, s] = Pw(a, b, h),
          rr = r * s,
          g = c.createRadialGradient(x - rr * 0.3, y - rr * 0.35, rr * 0.1, x, y, rr);
        g.addColorStop(0, c1);
        g.addColorStop(1, c2);
        c.fillStyle = g;
        c.beginPath();
        c.arc(x, y, rr, 0, 7);
        c.fill();
      },
      face = (pts, col) => {
        poly(pts.map(p => W(...p)));
        c.fillStyle = col;
        c.fill();
      };
    // --- les rennes (deux paires) et leurs rênes
    [
      [1.5, -0.3],
      [1.5, 0.3],
      [2.5, -0.3],
      [2.5, 0.3]
    ].forEach(([a, b], i) => {
      const g = Math.sin(t * 9 + i * 1.3),
        h = 0.55 + Math.sin(t * 9 + i * 1.3 + 1) * 0.04;
      parts.push([
        D(a, b, h),
        () => {
          // pattes au galop
          [
            [0.22, 1],
            [0.22, -1],
            [-0.22, 1],
            [-0.22, -1]
          ].forEach(([da, sb], j) => {
            const sw = Math.sin(t * 9 + i * 1.3 + j * 1.6) * 0.18;
            ligne(
              [
                [a + da, b + sb * 0.07, h - 0.1],
                [a + da + sw, b + sb * 0.07, h - 0.32],
                [a + da + sw * 1.6, b + sb * 0.07, h - 0.5]
              ],
              '#5a3a22',
              0.028
            );
          });
          ovoide(a, b, h, 0.62, 0.17, '#8a5a34');
          ovoide(a + 0.05, b, h + 0.06, 0.4, 0.08, '#a3703f');
          // cou, tête, bois, queue
          ligne(
            [
              [a + 0.28, b, h + 0.05],
              [a + 0.4, b, h + 0.3]
            ],
            '#7a4e2c',
            0.07
          );
          ovoide(a + 0.48, b, h + 0.36, 0.2, 0.075, '#7a4e2c');
          [-1, 1].forEach(q =>
            ligne(
              [
                [a + 0.42, b + q * 0.04, h + 0.42],
                [a + 0.36, b + q * 0.12, h + 0.62],
                [a + 0.3, b + q * 0.18, h + 0.7]
              ],
              '#d9b98a',
              0.018
            )
          );
          if (i == 3) {
            // Rudolph et son nez rouge qui brille
            const [nx, ny, ns] = Pw(a + 0.6, b, h + 0.35),
              gl = c.createRadialGradient(nx, ny, 0, nx, ny, ns * 0.12);
            gl.addColorStop(0, '#ff5a5aee');
            gl.addColorStop(1, '#ff5a5a00');
            c.fillStyle = gl;
            c.beginPath();
            c.arc(nx, ny, ns * 0.12, 0, 7);
            c.fill();
          }
          ligne(
            [
              [a - 0.3, b, h + 0.08],
              [a - 0.38, b, h + 0.14]
            ],
            '#efe6d8',
            0.04
          );
          // grelot et harnais
          ligne(
            [
              [a + 0.2, b - 0.17, h + 0.05],
              [a + 0.2, b + 0.17, h + 0.05]
            ],
            '#c0233a',
            0.025
          );
        }
      ]);
      parts.push([
        D(a - 0.6, b * 0.5, 0.65) + 0.01,
        () =>
          ligne(
            [
              [-0.1, b * 0.4, 0.72],
              [a - 0.3, b, h + 0.12]
            ],
            '#e0b84a',
            0.012
          )
      ]);
    });
    // --- le traîneau : deux flancs, le fond, la caisse, les patins dorés
    const flanc = b => [
      [-0.8, b, 0.08],
      [0.3, b, 0.08],
      [0.48, b, 0.25],
      [0.42, b, 0.5],
      [0.2, b, 0.42],
      [-0.55, b, 0.42],
      [-0.82, b, 0.62]
    ];
    [-0.38, 0.38].forEach(b => {
      parts.push([
        D(-0.15, b, 0.3),
        () => {
          ligne(
            [
              [-0.95, b * 0.8, -0.1],
              [0.45, b * 0.8, -0.1],
              [0.65, b * 0.8, 0.02],
              [0.6, b * 0.8, 0.14]
            ],
            '#e0b84a',
            0.022
          );
          ligne(
            [
              [-0.5, b * 0.8, -0.1],
              [-0.5, b, 0.08]
            ],
            '#e0b84a',
            0.015
          );
          ligne(
            [
              [0.15, b * 0.8, -0.1],
              [0.15, b, 0.08]
            ],
            '#e0b84a',
            0.015
          );
          face(flanc(b), '#b3122a');
          ligne(
            flanc(b)
              .slice(2)
              .concat([flanc(b)[0]])
              .slice(0, 5),
            '#e0b84a',
            0.014
          );
        }
      ]);
    });
    parts.push([
      D(-0.2, 0, 0.3) + 0.02,
      () => {
        face(
          [
            [-0.8, -0.38, 0.1],
            [0.3, -0.38, 0.1],
            [0.3, 0.38, 0.1],
            [-0.8, 0.38, 0.1]
          ],
          '#7a0c1c'
        );
        face(
          [
            [-0.82, -0.38, 0.08],
            [-0.82, 0.38, 0.08],
            [-0.82, 0.38, 0.62],
            [-0.82, -0.38, 0.62]
          ],
          '#9c0f24'
        );
        face(
          [
            [0.42, -0.38, 0.1],
            [0.42, 0.38, 0.1],
            [0.42, 0.38, 0.5],
            [0.42, -0.38, 0.5]
          ],
          '#9c0f24'
        );
      }
    ]);
    // --- la hotte de cadeaux et le Père Noël
    parts.push([
      D(-0.62, 0, 0.55) + 0.03,
      () => (boule(-0.62, 0.05, 0.6, 0.24, '#b98a5a', '#6e4a2b'), boule(-0.7, -0.12, 0.84, 0.09, '#5fbf7a', '#2f8f5b'))
    ]);
    parts.push([
      D(-0.3, 0, 0.6) + 0.04,
      () => {
        boule(-0.3, 0, 0.55, 0.25, '#ff4d5e', '#a3122a');
        ligne(
          [
            [-0.3, -0.25, 0.47],
            [-0.3, 0.25, 0.47]
          ],
          '#1b1b22',
          0.05
        );
        boule(-0.28, 0, 0.92, 0.12, '#f7d0b5', '#d9a585');
        // barbe (côté visage)
        const [bx, by, bs] = Pw(-0.18, 0, 0.84);
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.ellipse(bx, by, bs * 0.1, bs * 0.12, 0, 0, 7);
        c.fill();
        // bonnet rouge et pompon
        const B0 = Pw(-0.28, 0, 1.0),
          B1 = Pw(-0.45, 0, 1.18);
        c.fillStyle = '#d61f3a';
        c.beginPath();
        c.moveTo(B0[0] - B0[2] * 0.12, B0[1]);
        c.lineTo(B0[0] + B0[2] * 0.12, B0[1]);
        c.lineTo(B1[0], B1[1]);
        c.closePath();
        c.fill();
        c.fillStyle = '#ffffff';
        c.fillRect(B0[0] - B0[2] * 0.13, B0[1] - B0[2] * 0.025, B0[2] * 0.26, B0[2] * 0.05);
        c.beginPath();
        c.arc(B1[0], B1[1], B1[2] * 0.045, 0, 7);
        c.fill();
      }
    ]);
    parts.sort((p, q) => q[0] - p[0]).forEach(e => e[1]());
  };
  const traineau = (t, dt) => {
    const tp = traineauPos(t);
    if (tp) {
      if (prof(tp.x, tp.z) > 1.2) traineau3D(tp, t);
      return;
    }
    if (!crash) return;
    // touché : il tournoie et s'écrase sur le toit dans un nuage de neige
    if (!crash.boum) {
      crash.vy -= G * dt;
      crash.x += crash.vx * dt;
      crash.y += crash.vy * dt;
      crash.z += crash.vz * dt;
      crash.spin += dt * 6;
      crash.roll += dt * 3;
      if (Math.random() < 0.6) crash.fume.push({ x: crash.x, y: crash.y, z: crash.z, r: 0.08, a: 0.6 });
      if (crash.y <= 0.3) {
        crash.y = 0.3;
        crash.boum = T();
        bruit('boum');
        for (let i = 0; i < 16; i++)
          crash.fume.push({
            x: crash.x + (Math.random() - 0.5) * 1.6,
            y: Math.random() * 0.3,
            z: crash.z + (Math.random() - 0.5) * 1.6,
            r: 0.18 + Math.random() * 0.2,
            a: 0.8
          });
      }
    }
    crash.fume = crash.fume.filter(f => (f.a -= dt * 0.35) > 0);
    crash.fume.forEach(f => {
      f.r += dt * 0.25;
      f.y += dt * 0.3;
      const [x, y, s, d] = P(f.x, f.y, f.z);
      if (d < 0.4) return;
      c.fillStyle = `rgba(220,228,245,${f.a})`;
      c.beginPath();
      c.arc(x, y, f.r * s, 0, 7);
      c.fill();
    });
    if (prof(crash.x, crash.z) < 0.8) return;
    if (!crash.boum) traineau3D({ ...crash, pente: 0 }, t, crash.roll, crash.spin);
    else if (T() - crash.boum < 3.5) {
      // les jambes du Père Noël dépassent de la neige (et gigotent)
      const [x, y, s] = P(crash.x, 0, crash.z);
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
      vu = (nx, ny, nz, cx = 0, cy = 0, cz = 0) => nx * (V.x - ob.x - cx) + ny * (CAM + V.h - cy) + nz * (V.z - ob.z - cz) > 0,
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
      // girouette au sommet : la flèche montre d'où vient le vent
      {
        const top = ob.h + 0.12,
          [a0x, a0y] = Q(-Math.sin(VENT.a) * 0.28, top, -Math.cos(VENT.a) * 0.28),
          [a1x, a1y] = Q(Math.sin(VENT.a) * 0.28, top, Math.cos(VENT.a) * 0.28);
        c.strokeStyle = '#d9b44a';
        c.lineWidth = Math.max(1.2, s * 0.02);
        c.beginPath();
        c.moveTo(a0x, a0y);
        c.lineTo(a1x, a1y);
        c.stroke();
        c.fillStyle = '#d9b44a';
        c.beginPath();
        c.arc(a1x, a1y, Math.max(1.5, s * 0.03), 0, 7);
        c.fill();
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
    if (!F.in && !F.sol && F.y > 0.05) {
      // le vent pousse le fichier, et l'effet le fait tourner en courbe
      F.vx += VENT.x * h;
      F.vz += VENT.z * h;
      if (F.spin) {
        const n = Math.hypot(F.vx, F.vz) || 1;
        F.vx += (F.vz / n) * F.spin * 2.6 * h;
        F.vz += (-F.vx / n) * F.spin * 2.6 * h;
      }
    }
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
    if (tp) {
      // position du fichier dans le repère du traîneau : devant (rennes), sur le côté, en hauteur
      const ex = F.x - tp.x,
        ez = F.z - tp.z,
        av = ex * tp.fx + ez * tp.fz,
        co = ex * tp.fz - ez * tp.fx,
        ht = F.y - tp.y;
      if (av > -1 && av < 3.1 && Math.abs(co) < 0.55 && ht > -0.35 && ht < 1.2) {
        surprise('traineau', tp);
        F.vx = -F.vx * 0.35 + tp.fx * 1.5;
        F.vz = -F.vz * 0.35 + tp.fz * 1.5;
        F.vy = Math.min(F.vy, 0) * 0.5;
        F.va += (Math.random() - 0.5) * 10;
        choc(0.6);
      }
    }
    // Valentin, sur le toit d'à côté : touché par le fichier, il tombe sur les fesses
    if (F.y > VAL.base && F.y < VAL.base + 1.9 && Math.hypot(F.x - VAL.x, F.z - VAL.z) < 0.36) {
      surprise('valentin');
      geste(VAL, 'aie', 2.2);
      parle(VAL, 'Aïe ! 😵', 2);
      const ex = F.x - VAL.x,
        ez = F.z - VAL.z,
        n = Math.hypot(ex, ez) || 1;
      F.x = VAL.x + (ex / n) * 0.37;
      F.z = VAL.z + (ez / n) * 0.37;
      F.vx = (ex / n) * 1.2;
      F.vz = (ez / n) * 1.2;
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
    // Célestine fête ça : une chorégraphie de breakdance (voir danse), puis on ouvre le fichier
    C.danse = T() + 0.5;
    setTimeout(() => bruit('beat'), 500);
    setTimeout(fermer, (DANSE + 0.9) * 1000);
  };
  // le fichier sorti du toit retombe du ciel, à un endroit libre du toit
  // flèche rose qui rebondit au-dessus du fichier à ramasser
  const fleche = t => {
    const [x, y, s, d] = P(F.x, F.y + 0.5 + Math.abs(Math.sin(t * 4)) * 0.12, F.z);
    if (d < 0.4) return;
    const k = Math.max(8, s * 0.09);
    c.fillStyle = '#ff6fa3';
    c.strokeStyle = '#ffffff';
    c.lineWidth = Math.max(1.5, k * 0.18);
    c.beginPath();
    c.moveTo(x - k, y - k * 0.9);
    c.lineTo(x + k, y - k * 0.9);
    c.lineTo(x, y + k * 0.5);
    c.closePath();
    c.fill();
    c.stroke();
  };
  const retombe = () => {
    let x = 0,
      z = 3;
    for (let i = 0; i < 40; i++) {
      x = (Math.random() - 0.5) * 9;
      z = 1.6 + Math.random() * 6.2;
      const libre =
        !(Math.abs(x) < CX + 0.5 && Math.abs(z - CZ) < CD + 0.5) && OBS.every(ob => Math.hypot(x - ob.x, z - ob.z) > ob.r + 0.6);
      if (libre && Math.hypot(x - C.x, z - C.z) > 1.2) break;
    }
    F = { x, y: 7, z, vx: 0, vy: -1, vz: 0, a: Math.random() * 6, va: 4, vol: 1, in: 0, sol: 0, t: 0, arret: 0, al: 1, ent: 1, tombe: 0 };
    tip.textContent = 'Il est tombé du toit… le revoilà ! ⬇️';
  };
  const aide = () => {
    rate++;
    tip.textContent = rate >= 3 ? 'Va le ramasser, puis vise pile la cheminée 🎯' : 'Raté ! Va ramasser le fichier 😉';
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
  // la chorégraphie de victoire (en secondes depuis le début) :
  // toprock (pas croisés) → moonwalk → descente → windmill (elle tourne sur le dos, jambes en V) → headspin qui accélère
  // → baby freeze (pose figée penchée) → saut périlleux pour se relever → bras en l'air avec des cœurs
  const DANSE = 8;
  const danse = () => {
    if (C.ange) {
      // l'ange dans la neige : elle se laisse tomber sur le dos, bat des bras et des jambes, puis se relève
      const d = T() - C.ange,
        L = (a, b, k) => a + (b - a) * k * k * (3 - 2 * k);
      if (d < 0.5) return { e: 'ange', d, rot: L(0, Math.PI / 2, d / 0.5), ecart: 0, mx: 0 };
      if (d < 3.6) return { e: 'ange', d, rot: Math.PI / 2, ecart: 12 + 12 * Math.sin((d - 0.5) * 5), mx: 0, bat: Math.sin((d - 0.5) * 5) };
      if (d < 4.2) return { e: 'ange', d, rot: L(Math.PI / 2, 0, (d - 3.6) / 0.6), ecart: 0, mx: 0 };
      C.ange = 0;
    }
    if (!C.danse) return null;
    const d = T() - C.danse,
      L = (a, b, k) => a + (b - a) * k * k * (3 - 2 * k),
      K = (a, b) => Math.max(0, Math.min(1, (d - a) / (b - a)));
    if (d < 0) return null;
    const mx = d < 1.4 ? 0 : d < 2.5 ? -60 * K(1.4, 2.4) : -60 * (1 - K(2.9, 4.2)); // le moonwalk la décale, elle revient en tournant
    if (d < 1.4) return { e: 'toprock', d, rot: 0, ecart: -11 * Math.max(0, Math.sin(d * 6.5)), mx };
    if (d < 2.5) return { e: 'moonwalk', d, rot: 0, ecart: 0, mx };
    if (d < 2.9) return { e: 'descend', d, rot: L(0, Math.PI / 2, K(2.5, 2.9)), ecart: 24 * K(2.5, 2.9), mx };
    if (d < 4.2) return { e: 'windmill', d, rot: Math.PI / 2 + Math.sin(d * 9) * 0.12, ecart: 26, mx };
    if (d < 4.5) return { e: 'bascule', d, rot: L(Math.PI / 2, Math.PI, K(4.2, 4.5)), ecart: 26 - 4 * K(4.2, 4.5), mx };
    if (d < 5.9) return { e: 'headspin', d, rot: Math.PI, ecart: 22, mx };
    if (d < 6.5) return { e: 'freeze', d, rot: L(Math.PI, 2.25, K(5.9, 6.1)), ecart: 18, mx };
    if (d < 7)
      return {
        e: 'saut',
        d,
        rot: L(2.25, 2 * Math.PI, K(6.5, 7)),
        ecart: 8 * (1 - K(6.5, 7)),
        mx,
        saut: Math.sin(K(6.5, 7) * Math.PI) * 55
      };
    return { e: 'bravo', d, rot: 0, ecart: 0, mx };
  };
  const poses = () => {
    const sw = Math.sin(C.ph),
      a = C.amp,
      dz = danse();
    if (C.chute) {
      if (C.chute.sol) return { d: [44, 150, 0], de: [30, 140, 0], g: [-44, 150, 0], ge: [-30, 140, 0] }; // étalée dans la neige
      // elle mouline des bras pour garder l'équilibre (deux cercles en opposition)
      const w = T() * (C.chute.vy ? 17 : 13),
        bras = (q, ph) => ({
          h: [q * 25, 133 + 30 * Math.sin(w + ph), 30 * Math.cos(w + ph)],
          c: [q * 25, 133 + 15 * Math.sin(w + ph), 15 * Math.cos(w + ph)]
        }),
        D = bras(1, 0),
        Gq = bras(-1, Math.PI);
      return { d: D.h, de: D.c, g: Gq.h, ge: Gq.c, acc: 0.3 };
    }
    if (dz) {
      const w = Math.sin(dz.d * 7);
      if (dz.e == 'ange') {
        const k = ((dz.bat || 0) + 1) / 2; // les bras balaient de la hanche jusqu'au-dessus de la tête
        return { d: [34 - k * 12, 128 + k * 52, 4], g: [-34 + k * 12, 128 + k * 52, 4] };
      }
      switch (dz.e) {
        case 'toprock': // les bras balancent et croisent devant elle
          return { d: [12 + w * 8, 118 + w * 22, 26], g: [-12 + w * 8, 118 - w * 22, 26] };
        case 'moonwalk':
          return { d: [22, 96 - w * 6, -8 + w * 10], g: [-22, 96 + w * 6, -8 - w * 10] };
        case 'windmill':
        case 'descend':
          return { d: [36, 128, 4], g: [-36, 128, 4] }; // bras écartés au sol
        case 'freeze':
          return { d: [26, 166, 4], g: [-12, 112, 16] }; // une main au sol, l'autre sur la hanche
        case 'saut':
          return { d: [18, 152, 12], g: [-18, 152, 12] }; // bras repliés
        case 'bravo':
          return { d: [19, 196 + w * 4, 4], g: [-19, 196 - w * 4, 4] };
        default:
          return { d: [26, 166, 4], g: [-26, 166, 4] }; // mains au sol, près de la tête
      }
    }
    // emotes (Célestine) et gestes de Valentin
    const em = C.emote && T() - C.emote.t < C.emote.d ? C.emote : null;
    if (em) {
      const k = T() - em.t,
        w = Math.sin(k * 9),
        G0 = [-24, 85, 0],
        D0 = [25, 87, 0];
      switch (em.k) {
        case 'salut': {
          // l'avant-bras se balance autour du coude, la main ouverte
          const th = Math.sin(k * 11) * 0.55;
          return { d: [31 + Math.sin(th) * 24, 150 + Math.cos(th) * 30, 10], de: [31, 150, 6], g: G0 };
        }
        case 'bisou':
          // la main sur les lèvres, puis elle l'envoie (bras qui s'ouvre vers l'avant)
          return k < 0.5
            ? { d: [4, 151, 14], de: [17, 129, 16], g: G0 }
            : {
                d: [14 + Math.min(1, (k - 0.5) * 4) * 6, 160, 18 + Math.min(1, (k - 0.5) * 4) * 30],
                de: [20, 142, 14 + Math.min(1, (k - 0.5) * 4) * 12],
                g: G0
              };
        case 'danse': {
          // « disco » : un bras pointe en l'air, l'autre en bas, en alternance, les hanches balancent
          const h = Math.sin(k * 6.5) > 0;
          return h
            ? { d: [30, 192, 10], de: [27, 160, 6], g: [-10, 100, 22], ge: [-24, 118, 10], acc: Math.abs(w) * 4 }
            : { d: [10, 100, 22], de: [24, 118, 10], g: [-30, 192, 10], ge: [-27, 160, 6], acc: Math.abs(w) * 4 };
        }
        case 'boude': // bras croisés, elle tape du pied
          return { d: [-9, 118, 15], de: [15, 120, 11], g: [9, 115, 17], ge: [-15, 121, 11], acc: 0.6 };
        case 'lance': // Valentin lance une boule de neige
          return k < 0.4
            ? { d: [20, 172, -22], de: [27, 150, -8], g: [-22, 128, 22] }
            : { d: [10, 160, 42], de: [16, 146, 24], g: [-24, 110, 8] };
        case 'aie': // assis dans la neige, bras en l'air
          return { d: [30, 150, 12], g: [-30, 150, 12], acc: 42 };
        case 'touche': // elle sursaute
          return { d: [22, 142, 22], g: [-22, 142, 22], acc: 6 };
        default:
          return { d: D0, g: G0 };
      }
    }
    // tir façon basket : le fichier tenu à deux mains au-dessus du front, coudes pliés, genoux fléchis…
    const SET = { d: [7, 176, 15], de: [21, 152, 12], g: [-5, 170, 17], ge: [-22, 148, 9] },
      lt = T() - C.tir,
      mix3 = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
    if (C.charge) return { ...SET, acc: 9 };
    if (C.glisse) return { d: [36, 126, 12], de: [32, 128, 4], g: [-36, 126, 12], ge: [-32, 128, 4], acc: 16 }; // bras écartés, genoux fléchis
    const rm = T() - (C.ramasse || -9);
    if (rm < 0.4) {
      // elle se baisse pour ramasser le fichier
      const k = Math.sin((rm / 0.4) * Math.PI);
      return { d: [22, 87 - k * 40, k * 22], g: [-24, 85 - k * 10, 0], acc: k * 26 };
    }
    if (lt < 0.75) {
      // … puis elle saute, tend le bras vers le haut et l'avant (coup de poignet), l'autre main se retire
      const k = Math.min(1, lt / 0.22),
        r = Math.max(0, Math.min(1, (lt - 0.5) / 0.25)), // retour au repos
        TIR = { d: [6, 184, 36], de: [12, 164, 20], g: [-26, 150, 12], ge: [-27, 140, 8] },
        REPOS = { d: [25, 87, 0], de: [25, 111, -2], g: [-24, 85, 0], ge: [-25, 110, -2] },
        pp = {};
      for (const q of ['d', 'de', 'g', 'ge']) pp[q] = mix3(mix3(SET[q], TIR[q], k), REPOS[q], r);
      return { ...pp, acc: C.y > 0.01 ? 0 : 9 * (1 - k) + Math.max(0, 8 - (T() - C.pose) * 50) };
    }
    // marche : les bras balancent, coudes un peu pliés ; course : bras pliés qui pompent ; à l'arrêt : elle respire
    const r = Math.max(0, Math.min(1, ((C.v || 0) - 1.8) / 1.4)),
      aw = Math.min(1, a),
      mx = (p, q) => p.map((v, i) => v + (q[i] - v) * r),
      souffle = Math.sin(T() * 2.2) * 0.6;
    return {
      d: mx([24, 86 + 4 * aw * Math.abs(sw), sw * 15 * aw], [19, 116 + 8 * sw, sw * 22 + 8]),
      de: mx([25.5, 110, sw * 5 * aw - 2], [25, 106, sw * 6 - 12]),
      g: mx([-24, 86 + 4 * aw * Math.abs(sw), -sw * 15 * aw], [-19, 116 - 8 * sw, -sw * 22 + 8]),
      ge: mx([-25.5, 110, -sw * 5 * aw - 2], [-25, 106, -sw * 6 - 12]),
      acc: a < 0.05 ? 0.6 + souffle : 0
    };
  };
  // pose complète (coudes par défaut si besoin) puis lissée d'une image à l'autre : les gestes s'enchaînent sans à-coups
  const complet = pp => {
    const coude = (q, H) => [q * 23 + (H[0] - q * 18.5) * 0.4, (133 + H[1]) / 2, H[2] * 0.5 - 4],
      d = pp.d || [25, 87, 0],
      g = pp.g || [-24, 85, 0];
    return { d, g, de: pp.de || coude(1, d), ge: pp.ge || coude(-1, g), acc: pp.acc || 0 };
  };
  const posesLisses = () => {
    const cible = complet(poses()),
      now = T();
    if (!C.ps) C.ps = cible;
    const k = 1 - Math.exp(-Math.min(0.05, now - (C.psT || now)) * 16);
    C.psT = now;
    for (const q of ['d', 'de', 'g', 'ge']) C.ps[q] = C.ps[q].map((v, i) => v + (cible[q][i] - v) * k);
    C.ps.acc += (cible.acc - C.ps.acc) * k;
    return C.ps;
  };
  const main = () => {
    // le fichier suit sa main droite (même calcul que le dessin)
    // (proj donne un décalage à droite de la caméra et une profondeur vers elle : on les remet dans le monde)
    const [X, Y, Z] = posesLisses().d,
      [px, , pd] = proj(X, Y, Z),
      bob = Math.abs(Math.cos(C.ph)) * 0.022 * C.amp,
      co = Math.cos(V.yaw),
      si = Math.sin(V.yaw);
    return {
      x: C.x + (co * px - si * pd) / 100,
      y: C.y + bob + Y / 100 + (Y > 150 ? 0.09 : -0.11),
      z: C.z + (-si * px - co * pd) / 100,
      a: 0.1 * Math.cos(C.phi - V.yaw) + Math.sin(C.ph) * 0.1 * C.amp
    };
  };
  // les commandes : joystick (jx, jy de -1 à 1), clavier, rotation de la vue
  const ctl = { jx: 0, jy: 0, kx: 0, ky: 0, yaw: 0 };
  // la chute du toit : elle vacille au bord en moulinant des bras, bascule, tombe dans la rue (ou la ruelle)
  // et s'écrase dans la neige ; la caméra monte pour la regarder tomber, puis elle réapparaît au milieu du toit
  const SOL = -9.6; // le sol de la rue, 9,6 m sous le toit
  const chute = dt => {
    const K = C.chute,
      d = T() - K.t,
      [nx, nz] = K.n;
    C.v = 0;
    C.vy = 0;
    C.amp += (0 - C.amp) * Math.min(1, dt * 8);
    if (d < 1.1) {
      // au bord : elle se tourne vers le vide, se penche, mouline des bras
      const vise = Math.atan2(nx, nz);
      C.phi += Math.atan2(Math.sin(vise - C.phi), Math.cos(vise - C.phi)) * Math.min(1, dt * 10);
      C.lean = 0.3 + 0.16 * Math.sin(d * 11) + d * 0.2;
      C.x = K.x0 + nx * 0.05 * Math.sin(d * 11);
      C.z = K.z0 + nz * 0.05 * Math.sin(d * 11);
      if (!K.cri && d > 0.12) {
        K.cri = 1;
        parle(C, 'Oh oh… 😱', 1.1);
        bruit('aie', 0.8);
      }
    } else if (!K.sol) {
      // la chute : elle bascule en avant et tombe en tournoyant un peu
      if (!K.vy) K.vy = 1.6;
      K.vy -= G * dt;
      C.y += K.vy * dt;
      const sort = Math.min(0.8, (d - 1.1) * 1.4);
      C.x = K.x0 + nx * sort;
      C.z = K.z0 + nz * sort;
      C.rot = (C.rot || 0) + dt * 2.6;
      C.lean = 0.5;
      bruit('glisse', 1);
      if (C.y <= SOL) {
        // badaboum dans la neige de la rue
        C.y = SOL;
        K.sol = T();
        C.rot = Math.PI / 2;
        C.lean = 0;
        bruit('glisse', 0);
        bruit('boum');
        bruit('neige', 1);
        const [x, y] = P(C.x, SOL, C.z);
        for (let j = 0; j < 40; j++)
          eclats.push({ x, y, vx: (Math.random() - 0.5) * 260, vy: -Math.random() * 220, t: 0.9, c: j % 4 ? '#ffffff' : '#cfe0ff' });
        parle(C, 'Aïe aïe aïe… 😵‍💫', 1.4);
      }
    } else if (T() - K.sol > 1.9) {
      // elle réapparaît au milieu du toit et la caméra se remet derrière elle
      Object.assign(C, { x: 0, z: 2.6, y: 0, vy: 0, rot: 0, lean: 0, phi: 0, chute: null, ps: null, idle: 0 });
      ctl.yaw = 0;
      Object.assign(V, { x: 0, z: 0, yaw: 0, h: 0, p: 0 });
      Object.assign(Vt, { x: 0, z: 0, yaw: 0 });
      C.revient = T();
      parle(C, 'Plus de peur que de mal ! 😅', 1.8);
    }
    if (C.tient) Object.assign(F, main(), { vol: 0, al: 1, ent: 1, in: 0 });
  };
  const marche = dt => {
    if (C.chute) return chute(dt);
    saut(dt);
    const dz = danse();
    if (dz) {
      // pendant la danse, on ne la dirige plus
      C.v = 0;
      C.lean = (C.lean || 0) * 0.9;
      C.pen *= 0.9;
      const vers = cible => (C.phi += Math.atan2(Math.sin(cible - C.phi), Math.cos(cible - C.phi)) * Math.min(1, dt * 9)),
        e = dz.e;
      if (e == 'ange' && dz.d > 0.5 && !C.angeFait) {
        // l'empreinte de l'ange reste dans la neige
        C.angeFait = 1;
        traces.push({ x: C.x, z: C.z, t: T(), ange: C.angeAxe });
      }
      if (e == 'ange' && dz.d > 3.5) surprise('ange');
      if (e == 'toprock' || e == 'bravo' || e == 'ange') vers(V.yaw + Math.PI);
      else if (e == 'moonwalk')
        vers(V.yaw + Math.PI / 2); // de profil : elle « marche » vers la droite mais glisse vers la gauche
      else if (e == 'windmill' || e == 'descend') C.phi += dt * 11;
      else if (e == 'headspin' || e == 'bascule') C.phi += dt * (9 + 12 * Math.min(1, Math.max(0, (dz.d - 4.5) / 1.2)));
      else if (e == 'saut') vers(V.yaw + Math.PI);
      C.amp = e == 'moonwalk' ? 0.9 : e == 'toprock' ? 0.5 : e == 'bravo' ? 0.3 : 0;
      C.ph += dt * (e == 'moonwalk' ? 7 : e == 'toprock' ? 9 : 6);
      return;
    }
    // vitesse voulue, par rapport à la vue : vers le haut du joystick = droit devant
    const ix = Math.max(-1, Math.min(1, ctl.jx + ctl.kx)),
      iy = Math.max(-1, Math.min(1, ctl.jy + ctl.ky)),
      m = Math.min(1, Math.hypot(ix, iy)),
      co = Math.cos(ctl.yaw),
      si = Math.sin(ctl.yaw),
      em = C.emote && T() - C.emote.t < C.emote.d ? C.emote.k : null,
      bloque = C.charge || (em && em != 'touche');
    let vx = 0,
      vz = 0;
    // l'ange dans la neige : si on ne touche à rien pendant 6 s, elle s'allonge
    C.idle = m > 0.12 || C.charge || em || C.glisse || fin ? 0 : (C.idle || 0) + dt;
    if (C.idle > 6 && C.y <= 0) {
      C.idle = 0;
      C.ange = T();
      C.angeFait = 0;
      C.angeAxe = [Math.cos(V.yaw), -Math.sin(V.yaw)];
    }
    // la glissade : elle a couru et on lâche le joystick d'un coup
    if (C.glisse) {
      const g = C.glisse,
        sp = Math.hypot(g.vx, g.vz),
        ns = Math.max(0, sp - 2.4 * dt);
      g.vx *= ns / (sp || 1);
      g.vz *= ns / (sp || 1);
      vx = g.vx;
      vz = g.vz;
      g.d += ns * dt;
      g.trace = (g.trace || 0) + dt;
      if (g.trace > 0.05) {
        g.trace = 0;
        [-1, 1].forEach(q =>
          traces.push({ x: C.x + q * 0.09 * Math.cos(C.phi), z: C.z - q * 0.09 * Math.sin(C.phi), a: C.phi, t: T(), g: 1 })
        );
        const [x, y] = P(C.x, 0, C.z);
        for (let j = 0; j < 3; j++) eclats.push({ x, y, vx: (Math.random() - 0.5) * 80, vy: -Math.random() * 70, t: 0.4, c: '#ffffff' });
      }
      if (ns < 0.15 || m > 0.12) {
        if (g.d > 2.5) surprise('glissade');
        C.glisse = null;
      }
      C.v = 0;
    } else if (m > 0.12 && !bloque) {
      // tout au bout du joystick (ou Maj sur le clavier) pendant un moment : elle court
      C.vite = m > 0.95 ? (C.vite || 0) + dt : 0;
      const court = C.vite > 0.45 || touches.Shift,
        sp = court ? 3.3 : 1.7 * m;
      C.v = Math.min(sp, C.v + dt * (court ? 4 : 5));
      const dx = co * ix + si * -iy,
        dz = -si * ix + co * -iy,
        n = Math.hypot(dx, dz);
      vx = (dx / n) * C.v;
      vz = (dz / n) * C.v;
      C.dir = [dx / n, dz / n];
    } else {
      // elle lâche le joystick en pleine course : glissade !
      if (C.v > 2.6 && C.dir && !bloque) {
        C.glisse = { vx: C.dir[0] * C.v, vz: C.dir[1] * C.v, d: 0 };
        bruit('lance', 0.5);
      }
      C.v = Math.max(0, C.v - dt * 7);
      C.vite = 0;
    }
    // elle pivote vers là où elle va ; en armant le lancer, elle se tourne dans le sens de la vue ; elle boude dos à nous
    const vise = C.charge ? ctl.yaw : em == 'boude' ? V.yaw : vx || vz ? Math.atan2(vx, vz) : null;
    if (vise != null) C.phi += Math.atan2(Math.sin(vise - C.phi), Math.cos(vise - C.phi)) * Math.min(1, dt * 10);
    C.x += vx * dt;
    C.z += vz * dt;
    C.amp += ((C.v > 0.05 ? Math.min(1.3, C.v / 1.2) : em == 'danse' ? 0.5 : em == 'boude' ? 0.12 : 0) - C.amp) * Math.min(1, dt * 8);
    C.pen += ((C.v > 0.05 ? (vx * Math.cos(V.yaw) - vz * Math.sin(V.yaw)) / 1.5 : 0) - C.pen) * Math.min(1, dt * 6);
    if (em == 'danse') C.pen = Math.sin(T() * 6.5) * 0.8; // les hanches qui balancent
    // buste penché : en avant quand elle court, en arrière quand elle glisse
    const penche = C.glisse ? -0.2 : Math.max(0, Math.min(1, (C.v - 1.8) / 1.4)) * 0.16;
    C.lean = (C.lean || 0) + (penche - (C.lean || 0)) * Math.min(1, dt * 8);
    const ph0 = C.ph;
    C.ph += dt * (C.v > 0.05 ? 3 + C.v * 3.2 : em == 'danse' ? 9 : em == 'boude' ? 12 : 0);
    if (Math.floor(ph0 / Math.PI) != Math.floor(C.ph / Math.PI) && C.v > 0.05) {
      // un pas : son, et une empreinte de botte dans la neige (pied gauche, pied droit)
      bruit('pas', C.amp);
      const q = Math.floor(C.ph / Math.PI) % 2 ? 1 : -1;
      traces.push({ x: C.x + q * 0.1 * Math.cos(C.phi), z: C.z - q * 0.1 * Math.sin(C.phi), a: C.phi, t: T() });
      if (traces.length > 220) traces.splice(0, traces.length - 220);
    }
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
    C.z = Math.min(RIDGE - 0.3, C.z);
    // pas de barrière invisible : au bord de la gouttière ou d'un côté du toit, elle perd l'équilibre et tombe
    if (!fin && C.y <= 0 && (C.z < BORD + 0.12 || Math.abs(C.x) > 8.88)) {
      const n = C.z < BORD + 0.12 ? [0, -1] : [Math.sign(C.x), 0];
      if (n[1]) C.z = BORD + 0.12;
      else C.x = n[0] * 8.88;
      C.chute = { t: T(), n, vy: 0, x0: C.x, z0: C.z };
      C.charge = 0;
      C.glisse = 0;
      C.emote = null;
      C.ange = 0;
      btn.classList.remove('on');
      btn.style.setProperty('--p', 0);
    }
    // elle ramasse le fichier en passant dessus
    if (!C.tient && F.vol && F.pose && !F.in && F.y < 1 && Math.hypot(F.x - C.x, F.z - C.z) < 0.5) {
      C.tient = 1;
      C.ramasse = T();
      F.vol = 0;
      F.pose = 0;
      bruit('ramasse');
      tip.textContent = '';
    }
    btn.classList.toggle('vide', !C.tient); // pas de fichier en main : bouton grisé
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
    if (fin || C.chute || !C.tient || C.charge || C.y > 0 || C.pTir != null) return;
    C.charge = T();
    C.p = 0;
    btn.classList.add('on');
  };
  const lancer = () => {
    if (!C.charge) return;
    C.pTir = C.p || 0;
    C.charge = 0;
    btn.classList.remove('on');
    btn.style.setProperty('--p', 0);
    // elle saute ; le fichier part en haut du saut (voir saut)
    C.tir = T();
    C.vy = 2.6;
  };
  const lacheFichier = () => {
    // le fichier part de sa main tendue, droit devant elle (dans le sens de la vue), en cloche ; la jauge règle la force
    const p = C.pTir,
      m = main(),
      v = VMIN + (VMAX - VMIN) * p,
      dir = C.phi;
    C.pTir = null;
    C.tient = 0;
    F = {
      spin: C.spin || 0,
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
  const saut = dt => {
    if (!C.vy && C.y <= 0) return;
    C.vy -= G * dt;
    C.y += C.vy * dt;
    if (C.pTir != null && C.tient && T() - C.tir > 0.2) lacheFichier(); // en haut du saut, bras tendu
    if (C.y <= 0) {
      C.y = 0;
      C.vy = 0;
      C.pose = T(); // elle amortit en retombant
      bruit('pas', 1);
    }
  };
  // les tenues : Célestine (doudoune rose, queue-de-cheval, lunettes, taches de rousseur) et Valentin (doudoune verte, cheveux courts)
  const TENUE = {
    celestine: {
      m1: '#f59bb6',
      m2: '#ec7598',
      m3: '#bf4970',
      b1: '#e0668b',
      b2: '#a33f62',
      h1: '#f493b0',
      h2: '#c65780',
      cap: '#cf5a7e',
      couture: '#b8466a',
      zip: '#a83d62',
      queue: 1,
      lunettes: 1,
      rousseur: 1,
      taille: 1
    },
    valentin: {
      m1: '#7cc4a4',
      m2: '#3f8f6f',
      m3: '#24553f',
      b1: '#3f8f6f',
      b2: '#22513c',
      h1: '#6fc3a0',
      h2: '#3a7a5e',
      cap: '#367f62',
      couture: '#2c6a50',
      zip: '#22513c',
      queue: 0,
      lunettes: 0,
      rousseur: 0,
      taille: 1.08
    }
  };
  const celestine = (t, LK = TENUE.celestine) => {
    if (P(C.x, C.y, C.z)[3] < 0.5) return;
    const [x, yb, s] = P(C.x, C.y, C.z),
      [sx, sy, ss] = P(C.x, C.base || 0, C.z),
      u = s / 100, // 1 unité = 1 cm
      a = C.amp,
      sw = Math.sin(C.ph),
      cw = Math.cos(C.ph),
      bob = -Math.abs(cw) * 2.2 * a,
      cs = Math.cos(C.phi - V.yaw), // sa direction par rapport à la caméra (comme proj)
      sn = Math.sin(C.phi - V.yaw),
      po = posesLisses(),
      dz = danse(),
      EC = dz ? dz.ecart : 0, // écart des jambes (danse)
      ACC = po.acc || 0, // flexion des genoux (tir)
      TRAIT = 'rgba(70,25,45,0.38)';
    if (dz) {
      // un projecteur sur la piste de danse
      const g = c.createRadialGradient(sx, sy, 2, sx, sy, ss * 1.1);
      g.addColorStop(0, 'rgba(255,240,200,0.55)');
      g.addColorStop(1, 'rgba(255,240,200,0)');
      c.fillStyle = g;
      c.beginPath();
      c.ellipse(sx, sy, ss * 1.1, ss * 0.32, 0, 0, 7);
      c.fill();
    }
    // ombre au sol
    c.fillStyle = `rgba(60,75,110,${0.3 / (1 + C.y - (C.base || 0))})`;
    c.beginPath();
    c.ellipse(sx + (dz ? dz.mx * u : 0), sy, ss * 0.26, ss * 0.08, 0, 0, 7);
    c.fill();
    c.save();
    c.translate(x, yb);
    c.scale(u * LK.taille, u * LK.taille);
    // penchée en avant quand elle court, en arrière quand elle glisse : tout le corps bascule autour des pieds
    // (visible surtout de profil), pour que la tête, le buste et les bras restent bien ensemble
    c.rotate(C.pen * 0.05 + Math.atan(C.lean || 0) * sn + (C.rot || 0));
    c.translate(0, bob);
    if (dz) {
      // décalage du moonwalk, petit saut, balancement du toprock
      c.translate(dz.mx, -(dz.saut || 0));
      if (dz.e == 'toprock') c.rotate(Math.sin(dz.d * 6.5) * 0.08);
      if (dz.rot) {
        // au sol : on la fait pivoter autour des hanches, posée sur le dos (windmill) ou sur la tête (headspin)
        const r = dz.rot;
        c.translate(0, 66 * Math.abs(Math.sin(r)) - 8 * Math.max(0, -Math.cos(r))); // pour qu'elle touche toujours la neige
        c.translate(0, -81);
        c.rotate(r);
        c.translate(0, 81);
      }
    }
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
        Xe = cote * (8.5 + EC),
        H = proj(X, 80 - ACC, 0),
        K = proj((X + Xe) / 2, 43 + lev * 0.4 - ACC * 0.5, zf * 0.5 + plie + ACC * 1.1),
        A = proj(Xe, 9 + lev, zf),
        T2 = proj(Xe, 3 + lev, zf + 12),
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
    const brasP = (cote, H3, tient, E3) => {
      const S = proj(cote * 18.5, 133, 0),
        H = proj(...H3),
        E = E3 ? proj(...E3) : proj(cote * 23 + (H3[0] - cote * 18.5) * 0.4, (133 + H3[1]) / 2, H3[2] * 0.5 - 4), // coude
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
            mix(LK.b1, LK.b2, k),
            9.5
          );
          c.strokeStyle = mix(LK.h1, LK.h2, k);
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
      g.addColorStop(0, LK.m1);
      g.addColorStop(0.45, LK.m2);
      g.addColorStop(1, LK.m3);
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
      c.strokeStyle = LK.couture;
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
        c.strokeStyle = LK.zip;
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
        c.fillStyle = LK.cap;
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
          if (!LK.lunettes) return;
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
        if (Bg[2] > 3 && LK.lunettes) {
          c.strokeStyle = '#7a4a2a';
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(Bg[0] - 1, Bg[1]);
          c.quadraticCurveTo(Bg[0], Bg[1] - 0.9, Bg[0] + 1, Bg[1]);
          c.stroke();
        }
        // taches de rousseur, joues, sourire
        c.fillStyle = LK.rousseur ? '#c98a6a99' : '#00000000';
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
          mw = (LK.queue ? 3.6 : 4.6) * Math.max(0.35, M[2] / R); // Valentin : grand sourire
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
            devant = Math.cos(ang - (C.phi - V.yaw) + Math.PI) > 0;
          c.lineTo(i, -160.6 - (devant ? (LK.queue ? 1.4 * Math.cos(i / 5 + 1) : -1.2 + (i % 4 ? 0 : 2.2)) : 6));
        }
        c.closePath();
        c.fill();
        c.restore();
      }
      // reflets et mèches tirées vers l'élastique (ou cheveux courts en bataille)
      if (!LK.queue) {
        c.fillStyle = '#2e1c12';
        for (let i = -5; i <= 5; i++) {
          const [hx, hy2] = proj(Math.sin(i * 0.28) * R * 0.9, 166.5 - Math.abs(i) * 0.3, Math.cos(i * 0.28) * R * 0.3);
          c.beginPath();
          c.ellipse(hx, hy2, 2.4, 1.6, i * 0.3, 0, 7);
          c.fill();
        }
      }
      c.strokeStyle = '#8a6040';
      c.lineWidth = 0.65;
      const Q0 = proj(0, 157, -11);
      for (let i = -4; i <= 4; i++) {
        const S0 = proj(Math.sin(i * 0.3) * R, 166 - Math.abs(i) * 0.5, Math.cos(i * 0.3) * R * 0.2);
        if (!LK.queue || cs < -0.15 || (S0[2] < -2 && Q0[2] < 0)) continue; // les mèches ne passent jamais sur le visage
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
    const bg = brasP(-1, po.g, false, po.ge),
      bd = brasP(1, po.d, true, po.de);
    L.sort((p, q) => p.d - q.d).forEach(e => e.f());
    c.translate(0, ACC); // genoux fléchis : tout le haut du corps descend
    [bg, bd].filter(b => b.d < -7).forEach(b => b.f());
    torse();
    if (pq.d > 0) echarpe();
    if (pq.d < 0 && LK.queue) pq.f();
    if (pq.d <= 0) echarpe();
    tete();
    if (pq.d >= 0 && LK.queue) pq.f();
    [bg, bd]
      .filter(b => b.d >= -7)
      .sort((p, q) => p.d - q.d)
      .forEach(b => b.f());
    c.restore();
    if (dz && dz.e == 'bravo') {
      // des cœurs qui s'envolent
      const k = dz.d - 7;
      c.textAlign = 'center';
      for (let i = 0; i < 6; i++) {
        const kk = k * 1.2 - i * 0.18;
        if (kk < 0 || kk > 1) continue;
        c.globalAlpha = 1 - kk;
        c.font = `${Math.round(u * (14 + i * 2))}px system-ui`;
        c.fillText('💖', x + Math.sin(i * 2.3 + kk * 4) * u * 30, yb - u * (190 + kk * 90));
      }
      c.globalAlpha = 1;
    }
    // bulle au-dessus de la tête (emote, réplique)
    if (C.bulle && T() - C.bulle.t < C.bulle.d) {
      const [bx, by, bs] = P(C.x, C.y + 2.05 * LK.taille, C.z),
        fs = Math.max(12, Math.min(22, bs * 0.16)),
        k = Math.min(1, (T() - C.bulle.t) * 6, (C.bulle.d - (T() - C.bulle.t)) * 4);
      c.save();
      c.globalAlpha = k;
      c.font = `700 ${fs}px system-ui`;
      const w = c.measureText(C.bulle.txt).width + fs;
      c.fillStyle = '#ffffff';
      c.strokeStyle = '#0003';
      c.lineWidth = 1;
      c.beginPath();
      c.roundRect(bx - w / 2, by - fs * 1.9, w, fs * 1.5, fs * 0.7);
      c.moveTo(bx - fs * 0.3, by - fs * 0.42);
      c.lineTo(bx, by);
      c.lineTo(bx + fs * 0.3, by - fs * 0.42);
      c.fill();
      c.stroke();
      c.fillStyle = '#2a2140';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText(C.bulle.txt, bx, by - fs * 1.15);
      c.textBaseline = 'alphabetic';
      c.restore();
    }
  };

  /* ===================== Valentin, sur le toit d'à côté ===================== */
  // Il se tient sur le toit voisin (à droite, de l'autre côté du vide), regarde Célestine, lui fait coucou
  // et lui lance de temps en temps une boule de neige. Si le fichier le touche, il tombe sur les fesses.
  // le vent : il change de sens et de force toutes les 9 à 14 s, et dévie le fichier en vol (et la neige, la fumée)
  const VENT = { a: Math.random() * 6.28, f: 0.15, ca: 0, cf: 0.15, change: 0, x: 0, z: 0 };
  const vent = dt => {
    if (T() > VENT.change) {
      VENT.ca = Math.random() * Math.PI * 2;
      VENT.cf = Math.random() < 0.25 ? 0.05 : 0.3 + Math.random() * 1.1;
      VENT.change = T() + 9 + Math.random() * 5;
    }
    VENT.a += Math.atan2(Math.sin(VENT.ca - VENT.a), Math.cos(VENT.ca - VENT.a)) * Math.min(1, dt * 0.6);
    VENT.f += (VENT.cf - VENT.f) * Math.min(1, dt * 0.6);
    VENT.x = Math.sin(VENT.a) * VENT.f;
    VENT.z = Math.cos(VENT.a) * VENT.f;
    // la flèche du vent, tournée selon la vue (vers le haut = le vent souffle droit devant)
    ventEl.style.setProperty('--r', VENT.a - V.yaw + 'rad');
    ventEl.querySelector('em').textContent = Math.round(VENT.f * 14) + ' km/h';
  };
  const ventEl = o.querySelector('.mysl-vent');
  // les empreintes de pas, les traces de glissade et l'ange dans la neige
  const traces = [];
  const empreintes = () => {
    const now = T();
    traces.forEach(q => {
      const age = now - q.t,
        al = q.ange ? 0.55 : Math.max(0, 1 - age / 14) * 0.45;
      if (al <= 0) return;
      if (q.ange) {
        // la silhouette de l'ange : la tête, deux ailes balayées par les bras, la robe balayée par les jambes
        const [ax, az] = q.ange,
          px = -az,
          pz = ax,
          pt = (u, v) => [q.x + ax * u + px * v, 0.01, q.z + az * u + pz * v],
          ovale = (u0, v0, ru, rv) =>
            Array.from({ length: 24 }, (_, i) => pt(u0 + Math.cos((i / 24) * 6.283) * ru, v0 + Math.sin((i / 24) * 6.283) * rv)),
          formes = [
            ovale(0.62, 0.42, 0.42, 0.34), // aile
            ovale(0.62, -0.42, 0.42, 0.34), // aile
            [pt(0.55, 0.16), pt(0.55, -0.16), pt(-0.85, -0.5), pt(-0.95, 0), pt(-0.85, 0.5)], // robe
            ovale(1.02, 0, 0.16, 0.15) // tête
          ];
        formes.forEach(f => {
          if (poly(f)) {
            c.fillStyle = `rgba(140,160,205,${al * 0.75})`;
            c.fill();
            c.strokeStyle = '#ffffffb0';
            c.lineWidth = 1.4;
            c.stroke();
          }
        });
        return;
      }
      const [x, y, s, d] = P(q.x, 0, q.z);
      if (d < 0.3) return;
      const [x2, y2] = P(q.x + Math.sin(q.a) * 0.1, 0, q.z + Math.cos(q.a) * 0.1),
        an = Math.atan2(y2 - y, x2 - x);
      c.fillStyle = `rgba(110,130,175,${al})`;
      c.beginPath();
      if (q.g) c.ellipse(x, y, s * 0.06, s * 0.012, an, 0, 7);
      else c.ellipse(x, y, s * 0.055, s * 0.024, an, 0, 7);
      c.fill();
    });
  };
  // l'étoile filante : elle traverse le ciel de temps en temps ; on la touche du doigt pour faire un vœu
  const ETOILE = { t0: 0, prochaine: 0 };
  const etoileFilante = () => {
    const now = T();
    if (!ETOILE.prochaine) ETOILE.prochaine = now + 12 + Math.random() * 10;
    if (now > ETOILE.prochaine) {
      Object.assign(ETOILE, { t0: now, x0: W * (0.35 + Math.random() * 0.6), y0: H * (0.05 + Math.random() * 0.12), prise: 0 });
      ETOILE.prochaine = now + 22 + Math.random() * 14;
    }
    const k = now - ETOILE.t0;
    if (!ETOILE.t0 || k > 1.4 || ETOILE.prise) return;
    const x = ETOILE.x0 - k * W * 0.5,
      y = ETOILE.y0 + k * H * 0.16,
      g = c.createLinearGradient(x, y, x + 120, y - 38);
    ETOILE.x = x;
    ETOILE.y = y;
    g.addColorStop(0, '#fff8d6');
    g.addColorStop(1, '#fff8d600');
    c.strokeStyle = g;
    c.lineWidth = 3;
    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + 120, y - 38);
    c.stroke();
    const h = c.createRadialGradient(x, y, 0, x, y, 14);
    h.addColorStop(0, '#ffffff');
    h.addColorStop(1, '#fff4b000');
    c.fillStyle = h;
    c.beginPath();
    c.arc(x, y, 14, 0, 7);
    c.fill();
  };
  const VOISIN = { x0: 10.4, x1: 19, z0: 0.6, z1: 8.5, h: 0 }; // même hauteur que notre toit, de l'autre côté d'une ruelle
  const VAL = {
    x: 11.05,
    z: 5.2,
    y: VOISIN.h,
    base: VOISIN.h,
    vy: 0,
    ph: 0,
    v: 0,
    amp: 0,
    pen: 0,
    tient: 0,
    phi: -Math.PI / 2,
    charge: 0,
    tir: -9,
    pose: -9,
    coucou: 0,
    boule: 0
  };
  const boules = [];
  const parle = (Q, txt, d = 1.8) => (Q.bulle = { txt, t: T(), d });
  const geste = (Q, k, d) => (Q.emote = { k, t: T(), d });
  const valentin = dt => {
    const vise = Math.atan2(C.x - VAL.x, C.z - VAL.z);
    VAL.phi += Math.atan2(Math.sin(vise - VAL.phi), Math.cos(vise - VAL.phi)) * Math.min(1, dt * 4);
    VAL.amp = 0; // il se tient debout (il respire, c'est tout)
    if (!VAL.coucou) ((VAL.coucou = T() + 4), (VAL.boule = T() + 10));
    const occupe = VAL.emote && T() - VAL.emote.t < VAL.emote.d;
    if (!occupe && !fin && T() > VAL.coucou) {
      geste(VAL, 'salut', 1.6);
      parle(VAL, ['Coucou ! 👋', 'Hé Célestine !', 'Tu y arrives ? 😏', 'Allez, vise ! 🎯'][Math.floor(Math.random() * 4)]);
      VAL.coucou = T() + 9 + Math.random() * 6;
    } else if (!occupe && !fin && T() > VAL.boule && Math.hypot(C.x - VAL.x, C.z - VAL.z) < 16) {
      geste(VAL, 'lance', 0.9);
      VAL.lancer = T() + 0.4;
      VAL.boule = T() + 13 + Math.random() * 7;
    }
    if (VAL.lancer && T() > VAL.lancer) {
      // la boule part de sa main vers Célestine (un peu au hasard : elle ne touche pas à chaque fois)
      VAL.lancer = 0;
      const x0 = VAL.x - 0.15,
        y0 = VAL.base + 1.75,
        z0 = VAL.z,
        tx = C.x + (Math.random() - 0.5) * 1.1,
        tz = C.z + (Math.random() - 0.5) * 1.1,
        TT = 1.1;
      boules.push({ x: x0, y: y0, z: z0, vx: (tx - x0) / TT, vy: (1 - y0 + 0.5 * G * TT * TT) / TT, vz: (tz - z0) / TT });
      bruit('lance', 0.3);
    }
    // les boules de neige
    for (let i = boules.length - 1; i >= 0; i--) {
      const b = boules[i];
      b.vy -= G * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.z += b.vz * dt;
      const surNous =
        (Math.abs(b.x) < 9 && b.z > BORD && b.z < RIDGE) || (b.x > VOISIN.x0 && b.x < VOISIN.x1 && b.z > VOISIN.z0 && b.z < VOISIN.z1);
      if (b.y > C.y && b.y < C.y + 1.75 && Math.hypot(b.x - C.x, b.z - C.z) < 0.38) {
        // en plein sur Célestine !
        boules.splice(i, 1);
        geste(C, 'touche', 0.5);
        parle(C, 'Hé ! 😆', 1.4);
        bruit('neige', 0.9);
        surprise('boule');
        const [x, y] = P(b.x, b.y, b.z);
        for (let j = 0; j < 18; j++) eclats.push({ x, y, vx: (Math.random() - 0.5) * 200, vy: -Math.random() * 160, t: 0.6, c: '#ffffff' });
      } else if ((surNous && b.y <= 0.05) || b.y < -4) {
        boules.splice(i, 1);
        if (surNous) {
          bruit('neige', 0.4);
          const [x, y] = P(b.x, 0, b.z);
          for (let j = 0; j < 10; j++)
            eclats.push({ x, y, vx: (Math.random() - 0.5) * 120, vy: -Math.random() * 90, t: 0.5, c: '#ffffff' });
        }
      }
    }
  };
  const dessinBoule = b => {
    const [x, y, s, d] = P(b.x, b.y, b.z);
    if (d < 0.3) return;
    const r = Math.max(2, s * 0.06),
      g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#c8d4ea');
    c.fillStyle = g;
    c.beginPath();
    c.arc(x, y, r, 0, 7);
    c.fill();
  };
  // une façade d'immeuble qui plonge dans la nuit depuis le bord d'un toit, avec ses fenêtres allumées
  const facade = (ax, az, bx, bz, vue, h = 0) => {
    if (!vue) return;
    const tons = ['#3a4677', '#334070', '#2d3967', '#28335e', '#222c52', '#1c2546', '#161e3b', '#111830'];
    tons.forEach((ton, k) => {
      if (
        poly([
          [ax, h - k * 1.2, az],
          [bx, h - k * 1.2, bz],
          [bx, h - (k + 1) * 1.2 - 0.02, bz],
          [ax, h - (k + 1) * 1.2 - 0.02, az]
        ])
      ) {
        c.fillStyle = ton;
        c.fill();
      }
    });
    const L = Math.hypot(bx - ax, bz - az),
      n = Math.max(2, Math.round(L / 1.6)),
      nx = (bz - az) / L,
      nz = -(bx - ax) / L;
    for (let i = 0; i < n; i++)
      for (let j = 0; j < 4; j++) {
        const u = (i + 0.5) / n,
          mx = ax + (bx - ax) * u - nx * 0.01,
          mz = az + (bz - az) * u - nz * 0.01,
          dx = ((bx - ax) / L) * 0.3,
          dz = ((bz - az) / L) * 0.3,
          yc = h - 1.1 - j * 1.5,
          allume = (i * 7 + j * 3) % 5 < 3;
        if (
          poly([
            [mx - dx, yc + 0.4, mz - dz],
            [mx + dx, yc + 0.4, mz + dz],
            [mx + dx, yc - 0.4, mz + dz],
            [mx - dx, yc - 0.4, mz - dz]
          ])
        ) {
          c.fillStyle = allume ? ['#ffcf73', '#ffc062', '#e9b866', '#c79f5c'][j] : '#2a3463';
          c.fill();
        }
      }
  };
  // la rue enneigée en bas de l'immeuble (on ne la voit que quand la caméra monte, pendant une chute)
  const rue = () => {
    if (
      poly([
        [-40, SOL, -40],
        [40, SOL, -40],
        [40, SOL, 40],
        [-40, SOL, 40]
      ])
    ) {
      c.fillStyle = '#a4b0cc';
      c.fill();
    }
    // le trottoir et les traces de pneus dans la neige, le long de la façade
    [
      [-40, -2.2, 40, -1.6, '#8492b4'],
      [-40, -4.6, 40, -4.1, '#8492b4'],
      [-40, 0.6, 40, -0.6, '#e8eefa']
    ].forEach(([a, z0, b, z1, col]) => {
      if (
        poly([
          [a, SOL + 0.01, z0],
          [b, SOL + 0.01, z0],
          [b, SOL + 0.01, z1],
          [a, SOL + 0.01, z1]
        ])
      ) {
        c.fillStyle = col;
        c.fill();
      }
    });
  };
  // notre immeuble : ses façades sous le bord du toit, et le fond sombre de la ruelle
  const facadesNous = () => {
    if (
      poly([
        [9, -9.6, -6],
        [VOISIN.x0, -9.6, -6],
        [VOISIN.x0, -9.6, 16],
        [9, -9.6, 16]
      ])
    ) {
      c.fillStyle = '#7d89aa'; // la neige au fond de la ruelle, dans l'ombre
      c.fill();
    }
    facade(-9, 0.6, 9, 0.6, V.z < 0.6);
    facade(9, 0.6, 9, RIDGE, V.x > 9);
    facade(-9, RIDGE, -9, 0.6, V.x < -9);
  };
  // le toit voisin : le même genre de toit que le nôtre (neige, tuiles, faîtage), séparé par une ruelle
  const toitVoisin = () => {
    const { x0, x1, z0, z1, h } = VOISIN;
    facade(x0, z1, x0, z0, V.x < x0); // côté ruelle, face à notre toit
    facade(x0, z0, x1, z0, V.z < z0); // côté rue
    // le pan de toit enneigé
    if (
      poly([
        [x0, h, z0],
        [x1, h, z0],
        [x1, h, z1],
        [x0, h, z1]
      ])
    ) {
      const g = c.createLinearGradient(0, hy + 20, 0, H);
      g.addColorStop(0, '#c4d1ea');
      g.addColorStop(1, '#eef3fc');
      c.fillStyle = g;
      c.fill();
    }
    // rangées de tuiles
    c.strokeStyle = '#9fb0cf';
    c.lineWidth = 1;
    c.globalAlpha = 0.5;
    for (let z = 1; z < z1; z *= 1.16) {
      c.beginPath();
      let on = 0;
      for (let x = x0; x <= x1; x += 0.3) {
        const [px, py, , d] = P(x, h, z);
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
    // bords enneigés : le long de la ruelle, le faîtage et la gouttière
    [
      [x0, z0, x0, z1],
      [x0, z1, x1, z1],
      [x0, z0, x1, z0]
    ].forEach(([ax, az, bx, bz]) => {
      if (
        poly([
          [ax, h, az],
          [bx, h, bz],
          [bx, h + 0.07, bz],
          [ax, h + 0.07, az]
        ])
      ) {
        c.fillStyle = '#f2f6fd';
        c.fill();
      }
    });
    // un petit conduit de cheminée en briques
    const cx = 15,
      cz = 6,
      e = 0.28,
      ht = 0.9;
    [
      [
        [cx - e, cz - e],
        [cx + e, cz - e],
        [0, -1]
      ],
      [
        [cx - e, cz + e],
        [cx - e, cz - e],
        [-1, 0]
      ],
      [
        [cx + e, cz - e],
        [cx + e, cz + e],
        [1, 0]
      ],
      [
        [cx + e, cz + e],
        [cx - e, cz + e],
        [0, 1]
      ]
    ].forEach(([pa, pb, [nx, nz]]) => {
      if (nx * (V.x - (pa[0] + pb[0]) / 2) + nz * (V.z - (pa[1] + pb[1]) / 2) <= 0) return;
      if (
        poly([
          [pa[0], h, pa[1]],
          [pb[0], h, pb[1]],
          [pb[0], h + ht, pb[1]],
          [pa[0], h + ht, pa[1]]
        ])
      ) {
        c.fillStyle = nx ? '#8e3626' : '#a8432d';
        c.fill();
      }
    });
    if (
      poly([
        [cx - e - 0.04, h + ht, cz - e - 0.04],
        [cx + e + 0.04, h + ht, cz - e - 0.04],
        [cx + e + 0.04, h + ht, cz + e + 0.04],
        [cx - e - 0.04, h + ht, cz + e + 0.04]
      ])
    ) {
      c.fillStyle = '#f4f7fd';
      c.fill();
    }
  };
  const dessineValentin = t => {
    const moi = C;
    C = VAL; // on réutilise le même personnage en volume, avec la tenue de Valentin
    try {
      celestine(t, TENUE.valentin);
    } finally {
      C = moi;
    }
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
      if (!F.in && !fin) {
        // raté : il reste là où il s'est arrêté (il faut aller le ramasser) ;
        // tombé du toit : il disparaît puis retombe du ciel sur le toit
        const repos = F.t > 0.3 && Math.hypot(F.vx, F.vz) < 0.03 && Math.abs(F.vy) < 0.05 && !F.tombe;
        if (repos && !F.pose) {
          F.pose = 1;
          aide();
        }
        if (F.tombe) {
          F.al -= dt * 3;
          if (F.al <= 0) retombe();
        }
      }
    }
    // la caméra suit Célestine ; pendant une chute, elle monte au-dessus du vide et regarde vers le bas
    const K = C.chute,
      enChute = K && T() - K.t > 0.8;
    if (enChute) {
      // au-dessus du vide, tournée vers l'immeuble : on la voit basculer, longer la façade et s'écraser en bas
      // (côté ruelle, il n'y a pas la place de reculer : la caméra reste au-dessus de la ruelle et regarde presque à pic)
      const [nx, nz] = K.n,
        recul = nx > 0 ? 0.85 : 2.6;
      Vt.yaw = Math.atan2(-nx, -nz);
      Vt.x = K.x0 + nx * recul;
      Vt.z = K.z0 + nz * recul;
    } else {
      Vt.yaw = ctl.yaw;
      Vt.x = C.x - Math.sin(Vt.yaw) * 2.6;
      Vt.z = C.z - Math.cos(Vt.yaw) * 2.6;
    }
    const kc = Math.min(1, dt * (enChute ? 3.2 : 6)),
      kh = Math.min(1, dt * 3.2);
    V.yaw += Math.atan2(Math.sin(Vt.yaw - V.yaw), Math.cos(Vt.yaw - V.yaw)) * Math.min(1, dt * (enChute ? 3.2 : 14));
    V.x += (Vt.x - V.x) * kc;
    V.z += (Vt.z - V.z) * kc;
    V.h += ((enChute ? 3.2 : 0) - V.h) * kh;
    V.p += ((enChute ? (K.n[0] > 0 ? 1.3 : 0.95) : 0) - V.p) * kh;
    hy = hc - f * Math.tan(V.p);
    marche(dt);
    valentin(dt);
    vent(dt);
    ciel(t);
    etoileFilante();
    lyon();
    voisinsDessin(t);
    neige(dt, false);
    if (V.h > 0.05) rue();
    // le toit d'en face est plus loin : on le dessine d'abord, notre toit passe devant
    if (V.x < VOISIN.x0) (toitVoisin(), facadesNous(), toit());
    else (facadesNous(), toit(), toitVoisin());
    empreintes();
    // tout ce qui est sur le toit, dessiné du plus loin au plus proche
    const L = OBS.map(ob => [prof(ob.x, ob.z), () => obstacle(ob, t)]);
    {
      const tp = traineauPos(t);
      L.push([tp ? prof(tp.x, tp.z) : crash ? prof(crash.x, crash.z) : 0, () => traineau(t, dt)]);
    }
    L.push([prof(0, CZ), () => cheminee(t, F.in && (() => (c.save(), ouverture(), c.clip(), fichier(), c.restore())))]);
    if (!F.in && !C.tient)
      L.push([
        prof(F.x, F.z),
        () => {
          if (F.z <= RIDGE || V.z > RIDGE) return (ombre(), fichier(), F.pose && fleche(t));
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
    L.push([prof(VAL.x, VAL.z), () => dessineValentin(t)]);
    boules.forEach(b => L.push([prof(b.x, b.z), () => dessinBoule(b)]));
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
    C.idle = 0;
    // toucher l'étoile filante pour faire un vœu
    if (ETOILE.t0 && !ETOILE.prise && T() - ETOILE.t0 < 1.4 && Math.hypot(e.clientX - ETOILE.x, e.clientY - ETOILE.y) < 50) {
      ETOILE.prise = 1;
      surprise('etoile');
      for (let j = 0; j < 30; j++)
        eclats.push({
          x: ETOILE.x,
          y: ETOILE.y,
          vx: (Math.random() - 0.5) * 260,
          vy: (Math.random() - 0.7) * 200,
          t: 1,
          c: ['#fff8d6', '#ffd76a', '#ffffff'][j % 3]
        });
      return;
    }
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
  // emotes : un bouton 😊 ouvre quatre gestes
  const emo = o.querySelector('.mysl-emo');
  const emote = k => {
    if (fin || C.charge || C.glisse || C.ange) return;
    const d = { salut: 1.8, bisou: 1.5, danse: 3, boude: 2.6 }[k];
    geste(C, k, d);
    parle(C, { salut: '👋', bisou: '😘', danse: '🎶', boude: '😤' }[k], d);
    C.idle = 0;
    if (k == 'bisou')
      setTimeout(() => {
        const [x, y] = P(C.x, C.y + 1.5, C.z);
        for (let j = 0; j < 8; j++)
          eclats.push({ x, y, vx: (Math.random() - 0.5) * 60, vy: -60 - Math.random() * 80, t: 1.2, c: '#ff6fa3' });
      }, 550);
    emo.classList.remove('ouvert');
  };
  emo.querySelector('.mysl-emo-b').onclick = () => emo.classList.toggle('ouvert');
  emo.querySelectorAll('[data-e]').forEach(b => (b.onclick = () => emote(b.dataset.e)));
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
  // tir à effet : en relâchant, on glisse le doigt sur le côté (le fichier part en courbe de ce côté)
  let effet0 = 0;
  const effet = e => Math.max(-1, Math.min(1, (e.clientX - effet0) / 70));
  btn.addEventListener('pointerdown', e => {
    btn.setPointerCapture(e.pointerId);
    effet0 = e.clientX;
    C.idle = 0;
    armer();
  });
  btn.addEventListener('pointermove', e => {
    if (!C.charge) return;
    const k = effet(e);
    btn.querySelector('u').textContent = k < -0.25 ? '↶' : k > 0.25 ? '↷' : '';
  });
  btn.addEventListener('pointerup', e => ((C.spin = effet(e)), (btn.querySelector('u').textContent = ''), lancer()));
  btn.addEventListener('pointercancel', e => ((C.spin = 0), lancer()));
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
    if ('1234'.includes(e.key) && e.key) return emote(['salut', 'bisou', 'danse', 'boude'][+e.key - 1]);
    touches[e.key.length == 1 ? e.key.toLowerCase() : e.key] = 1;
    C.idle = 0;
    clavier();
  };
  const haut = e => {
    if (e.key == ' ') return ((C.spin = ctl.kx * 0.8), lancer());
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
