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
/* Les fichiers audio (venus du fichier mystère, ou importés par Valentin en mode admin) sont gardés sur cet appareil (IndexedDB).
   Ils y sont rangés en données brutes (ArrayBuffer) et redeviennent des fichiers audio (Blob) à la lecture : sur iPad et
   iPhone, Safari n'arrive plus à lire un Blob rangé tel quel une fois l'appli fermée puis rouverte (bug de WebKit).
   Les musiques rangées à l'ancienne (en Blob) sont converties au premier chargement si elles sont encore lisibles,
   sinon elles sont retirées : le fichier mystère sera alors redemandé (voir mysGate, js/menu-demarrer.js). */
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
  // le type du son, lu dans ses premiers octets (sinon d'après le nom) : sans type, Safari refuse de lancer la musique
  const mime = (buf, type, nom) => {
    try {
      const u = new Uint8Array(buf, 0, Math.min(12, buf.byteLength)),
        txt = (i, n) => String.fromCharCode(...u.slice(i, i + n));
      if (txt(0, 3) == 'ID3' || (u[0] == 0xff && (u[1] & 0xe0) == 0xe0 && (u[1] & 0x06) != 0)) return 'audio/mpeg';
      if (u[0] == 0xff && (u[1] & 0xf6) == 0xf0) return 'audio/aac';
      if (txt(4, 4) == 'ftyp') return 'audio/mp4';
      if (txt(0, 4) == 'RIFF') return 'audio/wav';
      if (txt(0, 4) == 'OggS') return 'audio/ogg';
      if (txt(0, 4) == 'fLaC') return 'audio/flac';
    } catch (_) {}
    if (/^audio\//.test(type || '')) return type;
    const x = (String(nom || '').match(/\.(\w+)$/) || [])[1];
    return { mp3: 'audio/mpeg', m4a: 'audio/mp4', mp4: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac' }[
      String(x).toLowerCase()
    ] || 'audio/mpeg';
  };
  const brut = async v => {
    if (!v || !v.blob) return v;
    const { blob, ...reste } = v;
    const buf = await blob.arrayBuffer();
    return { ...reste, buf, type: mime(buf, blob.type, v.name) };
  };
  const fichier = v => {
    const { buf, type, ...reste } = v;
    return { ...reste, blob: new Blob([buf], { type: mime(buf, type, v.name) }) };
  };
  let cache = null; // une seule lecture de toutes les musiques à la fois (sinon elles sont en double dans la mémoire)
  // Dans l'appli Android (assez récente), les musiques sont gardées par l'appli elle-même, dans ses fichiers :
  // le stockage de la page se vidait à certaines mises à jour (fichier mystère redemandé). Ailleurs : IndexedDB.
  const NAT = (() => {
    try {
      return window.AventAndroid && AventAndroid.musList ? AventAndroid : null;
    } catch (_) {
      return null;
    }
  })();
  const NURL = 'https://valentinrey-cmd.github.io/calendrier-avant-celestine/2026/__mus/';
  const natListe = () => {
    try {
      return JSON.parse(NAT.musList() || '[]');
    } catch (_) {
      return [];
    }
  };
  const natPut = async (k, blob, name) => {
    if (!NAT.musBegin(String(k), name || '', mime(await blob.slice(0, 12).arrayBuffer(), blob.type, name))) throw Error('musBegin');
    const CH = 786432;
    for (let o = 0; o < blob.size; o += CH) if (!NAT.musChunk(await b64(blob.slice(o, o + CH)))) throw Error('musChunk');
    if (!NAT.musEnd()) throw Error('musEnd');
  };
  const put = async (k, v) => {
    cache = null;
    if (NAT && v && v.blob) return natPut(k, v.blob, v.name);
    const b = await brut(v);
    return tx('readwrite', st => st.put(b, String(k)));
  };
  const del = k => {
    cache = null;
    if (NAT)
      try {
        NAT.musDel(String(k));
      } catch (_) {}
    return tx('readwrite', st => st.delete(String(k)));
  };
  // appli Android : les musiques encore dans IndexedDB (rangées avant) passent dans les fichiers de l'appli
  const natLire = async () => {
    let L = natListe();
    if (!L.length) {
      const o = await lireIdb().catch(() => ({}));
      for (const k in o)
        try {
          await natPut(k, o[k].blob, o[k].name);
        } catch (_) {}
      L = natListe();
      if (L.length) slog('🎵', `Musiques passées dans les fichiers de l’appli Android (${L.length})`);
    }
    const o = {};
    for (const it of L)
      try {
        const r = await fetch(NURL + encodeURIComponent(it.d), { cache: 'no-store' });
        if (!r.ok) continue;
        const buf = await r.arrayBuffer();
        o[it.d] = { blob: new Blob([buf], { type: mime(buf, it.type, it.name) }), name: it.name, at: it.at };
      } catch (_) {}
    return o;
  };
  const lireIdb = async () => {
    const o = await tx('readonly', (st, set) => {
      const r = {};
      const c = st.openCursor();
      c.onsuccess = () => {
        const x = c.result;
        if (x) {
          r[x.key] = x.value;
          x.continue();
        } else set(r);
      };
    });
    for (const k in o) {
      const v = o[k];
      if (!v) continue;
      if (v.buf) o[k] = fichier(v);
      else if (v.blob) {
        // rangée à l'ancienne : on la convertit si elle se lit encore, sinon on la retire
        try {
          const b = await brut(v);
          await tx('readwrite', st => st.put(b, String(k)));
          o[k] = fichier(b);
        } catch (_) {
          delete o[k];
          try {
            await tx('readwrite', st => st.delete(String(k)));
          } catch (_) {}
        }
      } else delete o[k];
    }
    return o;
  };
  const lire = () => (NAT ? natLire() : lireIdb());
  return {
    natif: !!NAT,
    put,
    del,
    all: () => {
      const c = cache || (cache = lire());
      c.catch(() => cache === c && (cache = null));
      return c;
    },
    // combien de musiques sont rangées, sans les charger
    count: async () => {
      const n = await tx('readonly', (st, set) => {
        const r = st.count();
        r.onsuccess = () => set(r.result || 0);
      }).catch(() => 0);
      return NAT ? Math.max(n, natListe().length) : n;
    }
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
   <div class="ytbtn">${ctrl ? `<button class="ytc ytsh ${S.shuf !== false ? 'on' : ''}" data-a="s" aria-label="Ordre aléatoire">🔀</button>` : ''}<button class="ytc" data-a="${ctrl ? '-1' : '-10'}">${ctrl ? '⏮' : '↺10'}</button><button class="ytc ytpp" data-a="p">${au.paused ? '▶' : '⏸'}</button><button class="ytc" data-a="${ctrl ? '1' : '10'}">${ctrl ? '⏭' : '10↻'}</button>${ctrl ? `<button class="ytc ytrp ${mrep() ? 'on' : ''}" data-a="r" aria-label="Répéter">${mrep() == 2 ? '🔂' : '🔁'}</button>` : ''}</div>${ctrl ? `<div class="ytx"><button class="ytc ytfv" data-a="f" aria-label="Favori">${isFav(k) ? '❤️' : '🤍'}</button><button class="ytc ytzb" data-a="z" aria-label="Minuteur de sommeil">🌙<small class="ytzz">${slpTxt()}</small></button><button class="ytc" data-a="q" aria-label="File d’attente">📃</button><button class="ytc" data-a="l" aria-label="Bibliothèque">📚</button><label class="ytvl">🔊<input type="range" class="ytvo" min="0" max="100" value="${Math.round(S.mvol == null ? 85 : S.mvol)}" aria-label="Volume"></label></div><div class="ytq" hidden></div>` : ''}</div>
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
            if (au.paused) lance();
            else {
              pz = 'bouton';
              au.pause();
            }
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
        pz = 'jeu';
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
    // coupée par l'appareil juste après le lancement (focus audio du téléphone…) : on note pourquoi et on relance une fois
    if (!pz && mode && au.getAttribute('src') && !au.ended && Date.now() - t0 < 4000) {
      slog('🎵', `Musique coupée juste après le lancement (état ${au.readyState}/${au.networkState}${rejoue ? ', après relance' : ''})`);
      if (!rejoue) {
        rejoue = 1;
        const p = au.play();
        if (p && p.catch) p.catch(() => {});
      }
    }
    pz = '';
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
    lance();
  }
  // lancer la lecture ; si l'appareil refuse, le bouton repasse sur ▶ (un nouveau toucher relance) et Valentin le voit dans le suivi
  let t0 = 0, // moment du dernier lancement
    rejoue = 0, // déjà relancée une fois après une coupure inexpliquée ?
    pz = ''; // qui a mis en pause (vide = l'appareil, sans qu'on le demande)
  function lance() {
    t0 = Date.now();
    rejoue = 0;
    pz = '';
    const p = au.play();
    if (p && p.catch)
      p.catch(e => {
        if (!box) return;
        box.classList.add('tap');
        box.querySelectorAll('[data-a="p"]').forEach(b => (b.textContent = '▶'));
        slog('🎵', `Musique refusée par l'appareil (${(e && e.name) || '?'}, état ${au.readyState}/${au.networkState})`);
      });
  }
  au.onerror = () => {
    if (!au.getAttribute('src')) return;
    if (box) box.querySelectorAll('[data-a="p"]').forEach(b => (b.textContent = '▶'));
    const c = au.error ? au.error.code : '?';
    toast('🎵 Cette musique ne se lit pas sur cet appareil');
    slog('🎵', `Musique illisible (erreur ${c}, ${NM[key] || key || '?'})`);
  };
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
      pz = 'jeu';
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
          pz = 'jeu';
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
        pz = 'jeu';
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
        // l'ancienne appli Android (sans « AventFocus/0 ») vole le focus audio à la page quand on lui dit « ça joue » : la musique
        // se coupe aussitôt. Avec elle, on ne lui dit jamais « ça joue » (la musique s'arrête alors quand on quitte l'appli).
        const send = c =>
          AventAndroid.mediaUpdate(
            sg.t,
            sg.a || '',
            !au.paused && /AventFocus\/0/.test(navigator.userAgent),
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
      if (!mode) return;
      // le téléphone demande une pause juste après un lancement : c'est le lecteur du téléphone qui se bat avec la page, on ignore
      if (Date.now() - t0 < 3000) {
        slog('🎵', 'Pause du téléphone ignorée (juste après le lancement)');
        return;
      }
      pz = 'appareil';
      au.pause();
      return;
    }
    if (c == 'toggle') {
      if (au.paused) window.__mediaCmd('play');
      else window.__mediaCmd('pause');
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
        pz = 'jeu';
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
  const sons = {
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
    // le chat dans le cadeau : un miaulement et le « boing » du ressort
    miaou: () => {
      sons.chat(0.15);
      ton(now(), 300, 0.25, 0.08, 'sine', 900); // le « boing » du ressort
    },
    // un miaulement (le chat de la cheminée)
    chat: (dl = 0) => {
      const t = now() + dl,
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
    },
    // un mauvais fichier dans la cheminée : le feu s'étouffe, crépite, et le recrache (« pfoouf »)
    recrache: () => {
      const t = now();
      souffle(t, 0.45, 0.1, 'lowpass', 1400, 250, 0.9, 0.02);
      for (let i = 0; i < 12; i++) souffle(t + 0.2 + Math.random() * 0.5, 0.05, 0.05, 'highpass', 4000, 0, 1, 0.003);
      souffle(t + 0.55, 0.5, 0.28, 'lowpass', 200, 2200, 0.8, 0.03);
      ton(t + 0.55, 90, 0.35, 0.2, 'sine', 220);
    },
    // Valentin charge sa patate : un grondement qui monte
    charge: () => {
      const t = now();
      ton(t, 70, 1.1, 0.07, 'sawtooth', 420);
      ton(t, 140, 1.1, 0.03, 'square', 840);
      souffle(t, 1.1, 0.08, 'bandpass', 300, 2400, 2, 0.4);
    },
    // la patate touche Célestine : gros coup sourd, claquement et souffle
    patate: () => {
      const t = now();
      ton(t, 120, 0.45, 0.35, 'sine', 35);
      souffle(t, 0.12, 0.4, 'highpass', 1800, 0, 0.7, 0.002);
      souffle(t + 0.02, 0.6, 0.25, 'lowpass', 900, 120, 0.8, 0.01);
    },
    // le volet du replay : un « whoosh » qui balaie
    replay: () => {
      const t = now();
      souffle(t, 0.45, 0.14, 'bandpass', 400, 3200, 1.2, 0.05);
      ton(t, 220, 0.4, 0.04, 'sine', 660);
    },
    // des pigeons qui s'envolent : battements d'ailes et petits roucoulements
    pigeons: () => {
      const t = now();
      for (let i = 0; i < 14; i++) souffle(t + i * 0.055 + Math.random() * 0.02, 0.06, 0.06, 'bandpass', 900 + Math.random() * 500, 0, 1.2, 0.004);
      ton(t, 330, 0.18, 0.035, 'sine', 260);
      ton(t + 0.2, 300, 0.2, 0.03, 'sine', 240);
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
  return sons;
}

/* ---------- Fichier mystère : avant de l'ouvrir, on le lance dans la cheminée du Père Noël ---------- */
// Lancer « en profondeur » (façon paper toss) : on glisse le doigt vers le haut, le fichier part vers la cheminée.
// Monde en mètres : x = gauche/droite, y = hauteur, z = profondeur. cb est appelé quand le fichier est tombé dedans.
function mysLancer(cb, fic) {
  // l'apparence du fichier lancé dépend du fichier choisi : une photo s'affiche, un document prend l'icône de son type.
  // La boîte aux lettres du toit permet d'en choisir un autre sur le téléphone (apparence() refait tout).
  // vis.ok : c'est bien le fichier mystère (lui seul s'ouvre dans la cheminée) ; vis.noir : recraché, noirci par le feu
  const vis = {};
  const apparence = fic => {
    for (const q in vis) delete vis[q];
    const nom = (fic && fic.name) || 'fichier.avent',
      ty = (fic && fic.type) || '',
      ext = (nom.includes('.') ? nom.split('.').pop() : '?').slice(0, 5).toUpperCase();
    Object.assign(vis, { k: ext == 'AVENT' ? 'avent' : 'doc', ext, nom, ok: !!fic && ext == 'AVENT' });
    if (fic)
      fic
        .slice(0, 9)
        .arrayBuffer()
        .then(b => vis.nom == nom && (vis.ok = new TextDecoder().decode(b) == 'AVENTMUS1'))
        .catch(() => {});
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
      imgDe(u).then(im => im && vis.nom == nom && Object.assign(vis, { k: 'photo', im }));
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
          if (vis.nom == nom) Object.assign(vis, { k: 'photo', im: k, video: 1 });
        } catch (_) {}
      };
      v.src = u;
    }
  };
  apparence(fic);
  let fc = fic; // le fichier en main (celui qu'on ouvrira s'il entre dans la cheminée)
  const o = document.createElement('div');
  o.className = 'mysl';
  o.innerHTML = `<canvas></canvas><div class="mysl-h"><b>Livraison spéciale</b><small>${
      matchMedia('(pointer: fine)').matches
        ? 'Clique sur le jeu : la souris tourne la vue (Échap pour la libérer). ZQSD pour marcher, Maj pour courir, Espace pour sauter (en courant, jusque chez Valentin !). Maintiens E et relâche au bon moment !'
        : 'Joystick pour marcher, glisse le doigt pour tourner la vue, « Sauter » pour sauter (en courant, jusque chez Valentin !). Maintiens « Lancer » et relâche au bon moment !'
    }</small><span class="mysl-n">Livré <i>0</i></span><span class="mysl-vent"><i></i><em></em></span><button class="mysl-rec-b" aria-label="Records">🏆</button></div><div class="mysl-rec"></div><p class="mysl-tip"></p><p class="mysl-sec"></p><div class="mysl-joy"><i></i></div><label class="mysl-boite">📮 Choisir un fichier<input type="file"></label><button class="mysl-lance"><b><i></i></b><span>Lancer</span><u></u></button><button class="mysl-saut"><b></b><span>Sauter</span></button><div class="mysl-emo"><button class="mysl-emo-b">😊</button><div><button data-e="salut">👋</button><button data-e="bisou">😘</button><button data-e="danse">💃</button><button data-e="boude">😤</button></div></div>`;
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
    tip = o.querySelector('.mysl-tip'),
    joy = o.querySelector('.mysl-joy'),
    btn = o.querySelector('.mysl-lance'),
    btnSaut = o.querySelector('.mysl-saut');
  let c = cv.getContext('2d'); // « let » : le dessin du fichier sert aussi d'image au fichier 3D tenu en main (texFichier)
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
  let W, H, dpr, f, hy, hc, F, rate, fin, raf, t0, fumees, flocons, flou, etoiles, ville, voisins, eclats;
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
      ACH('toit10'); // le succès « Reine des toits »
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
  // une annonce en haut de l'écran (secrets, records) : petit titre doré, texte, compteur facultatif
  const annonce = (titre, txt, bas = '') => {
    secEl.innerHTML = (titre ? `<i>${titre}</i>` : '') + `<b>${txt}</b>` + (bas ? `<u>${bas}</u>` : '');
    secEl.classList.remove('on');
    void secEl.offsetWidth;
    secEl.classList.add('on');
    clearTimeout(annonce.to);
    annonce.to = setTimeout(() => secEl.classList.remove('on'), 3200);
  };
  const surprise = (k, tp) => {
    if (!SECRETS[k] || age(k) < DUREE[k]) return; // la boîte aux lettres, par exemple, n'a pas de surprise
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
    annonce(neuf ? '🥚 Nouveau secret !' : '', SECRETS[k], n ? `${n}/${NSEC}` : '');
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
    { t: 'antenne', x: -1.8, z: 7.4, r: 0.14, h: 1.9 },
    { t: 'boite', x: -3, z: 3.1, r: 0.22, h: 1.2 } // la boîte aux lettres : on y choisit un autre fichier sur le téléphone
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
  // caméra « à la Fortnite » : derrière Célestine, à hauteur d'épaule, décalée sur sa droite, dans l'angle choisi au doigt,
  // et qui se replace derrière elle quand elle avance (V = où elle est, Vt = où elle va, en douceur ; réglages dans la boucle)
  const V = { x: 0, z: 0, yaw: 0, h: 0, p: 0, sx: 0, sy: 0 }, // h : la caméra monte (en m) ; p : elle regarde vers le bas (en radians)
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
    return [W / 2 + V.sx + (xr * f) / zz, hc + V.sy - (u * f) / zz, f / zz, d]; // projection : [x écran, y écran, échelle, profondeur]
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
      const px = W / 2 + V.sx + (xr * f) / zr,
        py = hc + V.sy - (u * f) / zr;
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
  FIG3D.charge(); // les figurines 3D de Célestine et Valentin (js/toit-figurines-3d.js)
  // version de test seulement : accès aux personnages pour vérifier les gestes (outil de test automatique)
  if (VERSION_TEST) window.__toit = { C: () => C, VAL: () => VAL, T: () => T(), V: () => V, ctl: () => ctl, renverse: () => renverse(), fete: () => fete() };
  // les mains vides : le fichier est dans la boîte aux lettres
  if (!fic) ((C.tient = 0), (F.al = 0), (tip.textContent = '📮 Va prendre le fichier dans la boîte aux lettres !'));
  rate = fin = 0;
  fumees = [];
  eclats = [];
  etoiles = Array.from({ length: 560 }, () => ({
    x: Math.random() * 7, // en « largeurs d'écran » autour du panorama
    y: Math.random() * 0.33,
    r: Math.random() * 1.3 + 0.3,
    p: Math.random() * 6
  }));
  flocons = Array.from({ length: 150 }, () => ({ x: Math.random(), y: Math.random(), d: Math.pow(Math.random(), 0.7), p: Math.random() * 6 }));
  // quelques gros flocons tout près de l'objectif, flous (comme hors mise au point)
  flou = Array.from({ length: 9 }, () => ({ x: Math.random(), y: Math.random(), r: 8 + Math.random() * 16, p: Math.random() * 6, v: 0.025 + Math.random() * 0.03 }));
  addEventListener('resize', taille);

  /* ===================== dessin ===================== */
  // les nuages fins qui passent devant la lune, très lentement (positions dans le panorama, en largeurs d'écran)
  // les lampadaires de la rue, loin en contrebas (des halos dans le panorama, sous l'horizon)
  const LAMPADAIRES = Array.from({ length: 46 }, (_, i) => ({ x: Math.random() * 7, y: 0.12 + Math.random() * 0.5, r: 14 + Math.random() * 22, c: ['255,200,120', '255,222,150', '255,180,110'][i % 3] }));
  const NUAGES = Array.from({ length: 7 }, (_, i) => ({ x: i + Math.random() * 0.6, y: 0.05 + Math.random() * 0.16, l: 0.5 + Math.random() * 0.6, e: 10 + Math.random() * 16, v: 0.004 + Math.random() * 0.006 }));
  const ciel = t => {
    let g = c.createLinearGradient(0, 0, 0, hy + 40);
    g.addColorStop(0, '#050a1d');
    g.addColorStop(0.55, '#142553');
    g.addColorStop(0.88, '#33497f');
    g.addColorStop(1, '#4c5a8c');
    c.fillStyle = g;
    c.fillRect(0, 0, W, hy + 1); // sous l'horizon, voir plus bas
    // la lueur orangée de la ville, juste au-dessus de l'horizon
    g = c.createLinearGradient(0, hy - 90, 0, hy + 10);
    g.addColorStop(0, 'rgba(255,170,110,0)');
    g.addColorStop(1, 'rgba(255,160,110,0.22)');
    c.fillStyle = g;
    c.fillRect(0, hy - 90, W, 100);
    // sous l'horizon : le vide entre les immeubles, de plus en plus sombre, et tout en bas les halos des lampadaires de la rue
    g = c.createLinearGradient(0, hy, 0, H);
    g.addColorStop(0, '#3a4a82');
    g.addColorStop(0.35, '#1d2a57');
    g.addColorStop(1, '#0a1130');
    c.fillStyle = g;
    c.fillRect(0, hy, W, H - hy);
    LAMPADAIRES.forEach(l => {
      const x = pano((l.x / 7) * 2 * Math.PI * f, 60);
      if (x == null) return;
      const y = hy + l.y * (H - hy),
        r = l.r * (0.6 + l.y);
      haloEn(x, y, r, r, l.c, 0.35 + 0.1 * Math.sin(t * 1.3 + l.x * 9), 0.3);
    });
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
    // le halo de glace autour de la lune (un anneau très pâle)
    c.strokeStyle = 'rgba(214,226,255,0.07)';
    c.lineWidth = 10;
    c.beginPath();
    c.arc(mx, my, 78, 0, 7);
    c.stroke();
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
    nuagesDessin(t);
  };
  const nuagesDessin = t => {
    NUAGES.forEach(n => {
      const x = pano((((n.x + t * n.v) % 7) * W * 2 * Math.PI * f) / (7 * W), W);
      if (x == null) return;
      const y = n.y * H,
        L = n.l * W * 0.5;
      c.save();
      c.translate(x, y);
      c.scale(1, n.e / L);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, L);
      g.addColorStop(0, 'rgba(150,168,220,0.2)');
      g.addColorStop(0.6, 'rgba(120,140,200,0.08)');
      g.addColorStop(1, 'rgba(120,140,200,0)');
      c.fillStyle = g;
      c.fillRect(-L, -L, 2 * L, 2 * L);
      c.restore();
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
  // notre toit : la neige (voir neigeToit), ses bords enneigés avec leurs stalactites, et la guirlande du faîtage
  const toit = () => {
    neigeToit(-9, 9, BORD, RIDGE, 0, 0, [
      [-9, RIDGE, 9, RIDGE, 0, 1, -1],
      [-9, BORD, 9, BORD, 0, -1, 0],
      [-9, BORD, -9, RIDGE, -1, 0, 1],
      [9, BORD, 9, RIDGE, 1, 0, 2]
    ]);
    guirlandeFaite(T());
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
    faceF(true);
    c.restore();
  };
  // la taille du fichier, en « unités » (0,0042 m chacune) : celle de la photo, sinon 50 × 64
  const tailleF = () => {
    if (vis.k != 'photo') return [50, 64];
    const im = vis.im,
      r = (im.naturalWidth || im.width) / (im.naturalHeight || im.height);
    return [(r >= 1 ? 62 : 62 * r) + 8, (r >= 1 ? 62 / r : 62) + 8 + (vis.video ? 0 : 6)];
  };
  // l'image du fichier 3D tenu en main (FIG3D) : le même dessin, dans une toile à part (bords d'image = bords du fichier)
  const texFichier = () => {
    const [w, h] = tailleF(),
      e = 5,
      t = document.createElement('canvas');
    t.width = Math.round(w * e);
    t.height = Math.round(h * e);
    const moi = c;
    c = t.getContext('2d');
    try {
      c.setTransform(e, 0, 0, e, (w * e) / 2, (h * e) / 2 + (vis.k == 'photo' && !vis.video ? -3 * e : 0));
      faceF(false);
    } finally {
      c = moi;
    }
    return { cv: t, w: w * 0.0042, h: h * 0.0042, ep: vis.k == 'photo' ? 0.004 : vis.k == 'doc' ? 0.008 : 0.055, cle: vis.k + (vis.nom || '') + (vis.noir ? '#' : '') };
  };
  // le dessin du fichier (centré, en « unités ») ; ombre = son ombre portée quand il est dessiné à plat dans la scène
  const faceF = ombre => {
    if (vis.k == 'photo') {
      photoDessin();
      suie();
      return;
    }
    if (vis.k == 'doc') {
      docDessin();
      suie();
      return;
    }
    if (ombre) c.shadowColor = '#0005';
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
    suie();
  };
  // le fichier recraché par la cheminée : noirci de suie, les bords brûlés qui rougeoient encore
  const suie = () => {
    if (!vis.noir) return;
    let w = 50,
      h = 64,
      oy = 0;
    if (vis.k == 'photo') {
      const im = vis.im,
        r = (im.naturalWidth || im.width) / (im.naturalHeight || im.height);
      w = (r >= 1 ? 62 : 62 * r) + 8;
      h = (r >= 1 ? 62 / r : 62) + 8 + (vis.video ? 0 : 6);
      oy = vis.video ? 0 : 3;
    }
    c.shadowColor = 'transparent';
    // contour déchiqueté, un peu rongé vers l'intérieur
    c.beginPath();
    const n = 44;
    for (let i = 0; i <= n; i++) {
      const u = (i / n) * 4,
        cote = Math.floor(u) % 4,
        v = u - Math.floor(u),
        j = 1.4 + 1.3 * Math.sin(i * 2.3) + 0.9 * Math.sin(i * 5.7),
        X = [-w / 2 + v * w, w / 2, w / 2 - v * w, -w / 2][cote],
        Y = [-h / 2, -h / 2 + v * h, h / 2, h / 2 - v * h][cote],
        nx = [0, -1, 0, 1][cote],
        ny = [1, 0, -1, 0][cote];
      const px = X + nx * j,
        py = Y + ny * j + oy;
      i ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.closePath();
    c.fillStyle = 'rgba(32,22,16,0.66)';
    c.fill();
    const t = T();
    c.strokeStyle = `rgba(255,${120 + Math.round(40 * Math.sin(t * 7))},40,${0.55 + 0.25 * Math.sin(t * 5)})`;
    c.lineWidth = 2.4;
    c.stroke();
    // taches de suie plus sombres et quelques braises
    c.fillStyle = 'rgba(12,8,6,0.55)';
    [
      [-0.25, -0.3, 0.22],
      [0.28, 0.1, 0.18],
      [-0.1, 0.32, 0.2]
    ].forEach(([a, b, r]) => {
      c.beginPath();
      c.ellipse(a * w, b * h + oy, r * w, r * w * 0.7, a * 3, 0, 7);
      c.fill();
    });
    c.fillStyle = '#ffb35c';
    for (let i = 0; i < 4; i++) {
      if (Math.sin(t * 6 + i * 2.1) < 0.2) continue;
      c.beginPath();
      c.arc(Math.sin(i * 3.7) * w * 0.4, Math.cos(i * 2.9) * h * 0.4 + oy, 1.3, 0, 7);
      c.fill();
    }
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
      if (p.souffle) {
        // la neige soulevée par une rafale : elle file au ras du toit dans le sens du vent
        p.x += VENT.x * dt * 2.4;
        p.z += VENT.z * dt * 2.4;
        if (Math.abs(p.x) > 8.9 || p.z < BORD + 0.05 || p.z > RIDGE - 0.05) return (p.a = 0); // elle s'envole au bord du toit
        p.y = 0.03 + Math.abs(Math.sin(p.y0 + p.a * 6)) * 0.12;
        p.r = Math.min(p.r, 0.11);
        c.fillStyle = `rgba(255,255,255,${p.a * 0.55})`;
        c.beginPath();
        c.ellipse(x, y, Math.max(1.5, p.r * s * 2), Math.max(0.8, p.r * s * 0.6), 0, 0, 7);
        c.fill();
        return;
      }
      if (p.braise) {
        // une braise qui monte du feu en tremblotant
        p.a -= dt * 0.45;
        p.r = 0.012;
        c.fillStyle = `rgba(255,${140 + Math.round(90 * p.a)},60,${Math.max(0, p.a)})`;
        c.beginPath();
        c.arc(x, y, Math.max(1, s * 0.012), 0, 7);
        c.fill();
        return;
      }
      c.fillStyle = p.noir ? `rgba(48,40,38,${p.a})` : `rgba(225,232,245,${p.a})`;
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
  // la neige qui tombe, en trois profondeurs : au loin (petits points lents), au milieu, et tout près (flocons
  // lumineux, plus quelques gros flocons flous). Elle suit le vent, et glisse sur le côté quand on tourne la vue (parallaxe).
  const neige = (dt, avant) => {
    if (!avant) {
      const d = neige.yaw == null ? 0 : V.yaw - neige.yaw;
      neige.dy = Math.atan2(Math.sin(d), Math.cos(d));
      neige.yaw = V.yaw;
    }
    const vx = (VENT.x * Math.cos(V.yaw) - VENT.z * Math.sin(V.yaw)) * 0.03;
    flocons.forEach(s => {
      if (avant != s.d > 0.72) return;
      s.y += dt * (0.025 + s.d * 0.07);
      s.x += dt * vx * (0.3 + s.d) - (neige.dy || 0) * (0.12 + s.d * 0.45);
      s.x = ((s.x % 1) + 1) % 1;
      s.p += dt * (1 + s.d);
      if (s.y > 1.02) ((s.y = -0.02), (s.x = Math.random()));
      const x = s.x * W + Math.sin(s.p) * 10 * s.d,
        y = s.y * H,
        r = 0.5 + s.d * s.d * 2.8;
      c.globalAlpha = 0.25 + s.d * 0.6;
      c.fillStyle = s.d > 0.72 ? '#ffffff' : '#e6edff';
      c.beginPath();
      c.arc(x, y, r, 0, 7);
      c.fill();
      if (s.d > 0.85) {
        // un petit halo autour des flocons tout proches
        c.globalAlpha = 0.18;
        c.beginPath();
        c.arc(x, y, r * 2.2, 0, 7);
        c.fill();
      }
    });
    if (avant)
      flou.forEach(b => {
        b.y += dt * b.v;
        b.x += dt * vx * 1.6 - (neige.dy || 0) * 0.9;
        b.x = ((b.x % 1) + 1) % 1;
        b.p += dt;
        if (b.y > 1.1) ((b.y = -0.1), (b.x = Math.random()));
        haloEn(b.x * W + Math.sin(b.p * 0.7) * 18, b.y * H, b.r, b.r, '240,245,255', 0.32, 0.45);
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
    } else if (ob.t == 'boite') {
      // la boîte aux lettres : un poteau en bois, une boîte jaune avec sa fente et son petit drapeau rouge.
      // Quand Célestine est tout près, un anneau brille dans la neige (le bouton « Choisir un fichier » apparaît)
      const pave = (x0, x1, y0, y1, z0, z1, col) => {
        const F6 = [
          [1, 0, 0, [x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]],
          [-1, 0, 0, [x0, y0, z1], [x0, y0, z0], [x0, y1, z0], [x0, y1, z1]],
          [0, 0, 1, [x1, y0, z1], [x0, y0, z1], [x0, y1, z1], [x1, y1, z1]],
          [0, 0, -1, [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]],
          [0, 1, 0, [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]
        ];
        F6.forEach(([nx, ny, nz, ...pts]) => {
          const mx = nx ? (nx > 0 ? x1 : x0) : (x0 + x1) / 2,
            my = ny ? y1 : (y0 + y1) / 2,
            mz = nz ? (nz > 0 ? z1 : z0) : (z0 + z1) / 2;
          if (!vu(nx, ny, nz, mx, my, mz)) return;
          if (!poly(pts.map(([a, b, cc]) => [ob.x + a, b, ob.z + cc]))) return;
          c.fillStyle = col;
          c.fill();
          const lum = ny ? 0.12 : 0.22 + 0.18 * (nx * 0.6 + nz * 0.8);
          c.fillStyle = ny ? `rgba(255,255,255,${lum})` : `rgba(0,0,0,${Math.max(0, lum)})`;
          c.fill();
        });
      };
      const pres = Math.hypot(C.x - ob.x, C.z - ob.z) < BOITE_PRES && !fin;
      if (pres) {
        c.strokeStyle = `rgba(255,215,106,${0.55 + 0.3 * Math.sin(t * 5)})`;
        c.lineWidth = 3;
        cercle(0, 0.01, 0, 0.5 + 0.04 * Math.sin(t * 5));
        c.stroke();
      }
      pave(-0.045, 0.045, 0, 0.86, -0.045, 0.045, '#6b4428'); // poteau
      pave(-0.17, 0.17, 0.86, 1.14, -0.22, 0.22, '#f2c230'); // la boîte
      pave(-0.18, 0.18, 1.14, 1.18, -0.23, 0.23, '#f4f7fd'); // la neige dessus
      // la fente et une petite enveloppe, sur la face avant (tournée vers le bas du toit)
      if (vu(0, 0, -1, 0, 1, -0.22)) {
        if (poly([[ob.x - 0.1, 1.06, ob.z - 0.222], [ob.x + 0.1, 1.06, ob.z - 0.222], [ob.x + 0.1, 1.08, ob.z - 0.222], [ob.x - 0.1, 1.08, ob.z - 0.222]])) {
          c.fillStyle = '#3b2a12';
          c.fill();
        }
        if (poly([[ob.x - 0.07, 0.92, ob.z - 0.222], [ob.x + 0.07, 0.92, ob.z - 0.222], [ob.x + 0.07, 1.01, ob.z - 0.222], [ob.x - 0.07, 1.01, ob.z - 0.222]])) {
          c.fillStyle = '#ffffff';
          c.fill();
          c.strokeStyle = '#c99a1c';
          c.lineWidth = 1;
          c.stroke();
          const [ax, ay] = P(ob.x - 0.07, 1.01, ob.z - 0.222),
            [bx, by] = P(ob.x, 0.96, ob.z - 0.222),
            [cx2, cy2] = P(ob.x + 0.07, 1.01, ob.z - 0.222);
          c.beginPath();
          c.moveTo(ax, ay);
          c.lineTo(bx, by);
          c.lineTo(cx2, cy2);
          c.stroke();
        }
      }
      // le drapeau, levé quand Célestine est tout près
      const lev = pres ? 1 : 0;
      pave(0.17, 0.19, 0.95, 1.2 + lev * 0.12, 0.1, 0.13, '#8a8f99');
      pave(0.17, 0.19, 1.12 + lev * 0.12, 1.2 + lev * 0.12, 0.13, 0.27, '#d63a3a');
      if (!fc) fleche(t, ob.x, 1.05, ob.z); // tant qu'elle n'a pas pris de fichier, une flèche montre la boîte
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
    if (!F.in && !F.sol && !F.deVal && F.y > 0.05) {
      // le vent pousse le fichier, et l'effet le fait tourner en courbe (pas quand c'est Valentin qui le renvoie)
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
    // le chat assis sur l'ouverture la bouche : le fichier rebondit sur lui, et il file
    if (CHAT.y > TOP - 0.05 && F.y > TOP - 0.05 && F.y < TOP + 0.5 && Math.abs(F.x - CHAT.x) < OX + 0.05 && Math.abs(F.z - CZ) < OZ + 0.06) {
      F.y = Math.max(F.y, TOP + 0.02);
      F.vy = Math.abs(F.vy) * 0.35 + 1.2;
      F.vz = -Math.abs(F.vz) * 0.4 - 0.7;
      F.vx = F.vx * 0.4 + (Math.random() - 0.5);
      F.va += (Math.random() - 0.5) * 8;
      choc(0.5);
      chatFile();
      return;
    }
    // passage du haut de la cheminée en descendant
    if (p.y >= TOP && F.y < TOP && F.vy < 0) {
      const t = (p.y - TOP) / (p.y - F.y),
        x = p.x + (F.x - p.x) * t,
        z = p.z + (F.z - p.z) * t;
      if (!F.deVal && (x / OX) ** 2 + ((z - CZ) / OZ) ** 2 <= 1) return entre(); // Valentin ne le met pas dedans à sa place
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
    // le tir canon de Valentin touche Célestine : elle tombe à la renverse
    if (F.deVal && !F.sol && !C.ko && !C.chute && F.y > C.y + 0.15 && F.y < C.y + 1.85 && Math.hypot(F.x - C.x, F.z - C.z) < 0.42) return renverse();
    // Valentin, sur le toit d'à côté : un fichier qui arrive à hauteur de ses mains, il l'attrape au vol et le renvoie
    // aussitôt, en tir canon sur Célestine (voir valRelance) ; en pleine tête ou dans les jambes, il tombe sur les fesses
    const dv = Math.hypot(F.x - VAL.x, F.z - VAL.z),
      dispo = !VAL.tient && !VAL.renvoi && !(VAL.emote && VAL.emote.k == 'aie' && T() - VAL.emote.t < VAL.emote.d);
    if (!F.sol && !F.deVal && !fin && dispo && dv < 0.65 && F.y > VAL.base + 0.45 && F.y < VAL.base + 1.5) {
      VAL.tient = 1;
      VAL.renvoi = { e: 'vise', t: T() - 0.25 };
      F.vol = 0;
      F.vx = F.vy = F.vz = 0;
      bruit('ramasse');
      parle(VAL, ['Attrapé ! 😎', 'Je l’ai ! 😏', 'Merci ! 😈'][Math.floor(Math.random() * 3)], 1.3);
      return;
    }
    if (!F.sol && !F.deVal && F.y > VAL.base + 0.1 && F.y < VAL.base + 1.9 && Math.hypot(F.x - VAL.x, F.z - VAL.z) < 0.36) {
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
    // il passe le faîtage (ou sort tout à fait sur le côté) : il tombe de l'autre côté, caché derrière le faîtage.
    // Le toit de Valentin, lui, est solide : le fichier y atterrit et y glisse comme sur le nôtre
    const chezVal = surVoisin(F.x, F.z);
    if (!chezVal && (F.z > RIDGE || F.z < BORD || Math.abs(F.x) > 9)) {
      if (F.y < 0.05 && !F.tombe) {
        F.tombe = 1;
        bruit('tombe');
      }
      return;
    }
    if (chezVal) {
      // le petit conduit de cheminée de Valentin : le fichier rebondit dessus
      const { cx, cz, ce, h: hv } = VOISIN,
        ch = hv + VOISIN.ch,
        ex = F.x - cx,
        ez = F.z - cz;
      if (F.y < ch && Math.abs(ex) < ce + 0.08 && Math.abs(ez) < ce + 0.08) {
        if (p.y >= ch) ((F.y = ch), (F.vy = Math.abs(F.vy) * 0.3));
        else if (Math.abs(ex) > Math.abs(ez)) ((F.x = cx + Math.sign(ex) * (ce + 0.081)), (F.vx = -F.vx * 0.3));
        else ((F.z = cz + Math.sign(ez) * (ce + 0.081)), (F.vz = -F.vz * 0.3));
        if (Math.abs(F.vx) + Math.abs(F.vz) > 0.5) (bruit('brique', 0.5), choc(0.4));
      }
    }
    // le toit : rebonds, puis glissade sur la neige avec frottement
    const sy = (chezVal ? VOISIN.h : 0) + 0.03;
    if (F.y <= sy) {
      F.y = sy;
      // il touche la neige : longueur du lancer de Célestine
      if (F.moi && !F.touche) ((F.touche = 1), record('dist', Math.hypot(F.x - F.x0, F.z - F.z0)));
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
  // La « patate » de Valentin, façon manga : Célestine la prend en pleine poitrine.
  // 1. arrêt sur image (0,2 s) : image en négatif, lignes de vitesse vers elle, « DOOM !! » ;
  // 2. elle s'envole en arrière, bras et jambes qui moulinent, en tournant sur elle-même ;
  // 3. elle s'écrase sur le dos (gerbe de neige, « CRAAASH ! », secousse), puis glisse sur la neige en laissant un sillon ;
  // 4. elle reste sonnée (étoiles au-dessus de la tête), se relève et s'époussette.
  // La distance du vol et de la glissade est calculée pour qu'elle reste sur le toit sans traverser d'obstacle.
  const KO_SOL = 1.4, // sonnée par terre
    KO_REL = 0.5, // elle se relève
    KO_SEC = 0.45, // elle s'époussette
    KO_VY = 4.3, // vitesse de départ vers le haut (m/s)
    KO_FR = 5; // freinage de la glissade (m/s²)
  // on peut aller de (px, pz) à (x, z) : sur le toit, pas dans la cheminée, et sans se rapprocher d'un obstacle déjà tout près
  const libre = (x, z, px = C.x, pz = C.z) =>
    Math.abs(x) < 8.4 &&
    z > BORD + 0.4 &&
    z < RIDGE - 0.4 &&
    !(Math.abs(x) < CX + 0.35 && Math.abs(z - CZ) < CD + 0.35) &&
    !OBS.some(ob => {
      const dn = Math.hypot(x - ob.x, z - ob.z);
      return dn < rayon(ob, 0.3) + 0.35 && dn < Math.hypot(px - ob.x, pz - ob.z);
    });
  const renverse = () => {
    const sp = Math.hypot(F.vx, F.vz) || 1,
      nx = F.vx / sp,
      nz = F.vz / sp;
    // jusqu'où elle peut partir sans quitter le toit ni rentrer dans un obstacle
    let dl = 0;
    while (dl < 6 && libre(C.x + nx * (dl + 0.1), C.z + nz * (dl + 0.1), C.x + nx * dl, C.z + nz * dl)) dl += 0.1;
    const air = Math.min(3.8, dl * 0.65),
      glisse = Math.max(0, Math.min(1.8, dl - air - 0.15)),
      tv = (2 * KO_VY) / G;
    // la caméra se mettra de côté : du côté où l'on est déjà, sauf si elle sortirait du toit
    const mil = (air + glisse) / 2,
      surToit = q => {
        const x = C.x + nx * mil - nz * q * 3.2,
          z = C.z + nz * mil + nx * q * 3.2;
        return Math.abs(x) < 9 && z > BORD && z < RIDGE;
      },
      q0 = (V.x - C.x) * -nz + (V.z - C.z) * nx >= 0 ? 1 : -1;
    C.ko = {
      t: T(),
      n: [nx, nz],
      cote: surToit(q0) || !surToit(-q0) ? q0 : -q0,
      e: 'stop',
      te: T(),
      tv,
      vh: air / tv,
      vs: Math.sqrt(2 * KO_FR * glisse)
    };
    Object.assign(C, { charge: 0, pTir: null, glisse: 0, emote: null, ange: 0, idle: 0, phi: Math.atan2(-nx, -nz), vy: 0 });
    btn.classList.remove('on');
    btn.style.setProperty('--p', 0);
    // le fichier reste figé pendant l'arrêt sur image, puis rebondit sur elle
    Object.assign(F, { deVal: 0, ko: 1, vol: 0, vx: -nx * 1.2, vz: -nz * 1.2, vy: 3.2, va: 18 });
    bruit('patate');
    bruit('aie');
    tip.textContent = '';
    manga.push({ k: 'impact', t: T(), txt: ['DOOM !!', 'BAAAM !!', 'PAF !!!'][Math.floor(Math.random() * 3)] });
    parle(VAL, ['HAHAHA ! 😂', 'STRIKE ! 🎳', 'Oups… trop fort ? 😇'][Math.floor(Math.random() * 3)], 2.6);
  };
  const ko = dt => {
    const K = C.ko,
      d = T() - K.te,
      [nx, nz] = K.n,
      avance = v => {
        const x = C.x + nx * v * dt,
          z = C.z + nz * v * dt;
        if (libre(x, z)) ((C.x = x), (C.z = z));
        else return true; // bloquée
      };
    C.v = 0;
    C.amp = 0;
    C.lean = 0;
    C.pen *= 0.9;
    C.idle = 0;
    if (K.e == 'stop') {
      if (d < 0.2) return; // arrêt sur image
      Object.assign(K, { e: 'vol', te: T() });
      C.vy = KO_VY;
      F.vol = 1;
      parle(C, 'AAAAH !! 😱', 1);
      bruit('lance', 1);
    } else if (K.e == 'vol') {
      // elle s'envole en arrière
      avance(K.vh);
      C.vy -= G * dt;
      C.y = Math.max(0, C.y + C.vy * dt);
      if (Math.random() < 0.5) {
        const [x, y] = P(C.x, C.y + 0.8, C.z);
        eclats.push({ x, y, vx: -nx * 40 + (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 40, t: 0.4, c: '#ffffffaa' });
      }
      if (C.y <= 0 && d > 0.1) {
        // elle s'écrase sur le dos
        C.y = 0;
        C.vy = 0;
        Object.assign(K, { e: 'glisse', te: T(), v: K.vs, sillon: null });
        bruit('boum');
        bruit('neige', 1);
        bruit('brique', 1);
        manga.push({ k: 'crash', t: T(), txt: 'CRAAASH !' });
        traces.push({ x: C.x + nx * 0.5, z: C.z + nz * 0.5, t: T(), cratere: 1 });
        const [x, y] = P(C.x + nx * 0.5, 0.2, C.z + nz * 0.5);
        for (let j = 0; j < 70; j++)
          eclats.push({ x, y, vx: (Math.random() - 0.5) * 520, vy: -Math.random() * 420, t: 1.1, c: j % 3 ? '#ffffff' : '#cfe0ff' });
      }
    } else if (K.e == 'glisse') {
      // elle glisse sur le dos en laissant un sillon dans la neige
      K.v = Math.max(0, K.v - KO_FR * dt);
      if (avance(K.v)) K.v = 0;
      bruit('glisse', Math.min(1, K.v / 3));
      // le sillon suit son dos : une seule trace qui s'allonge
      if (!K.sillon) traces.push((K.sillon = { x: C.x + nx * 0.45, z: C.z + nz * 0.45, x2: C.x + nx * 0.45, z2: C.z + nz * 0.45, t: T(), sillon: [nx, nz] }));
      Object.assign(K.sillon, { x2: C.x + nx * 0.45, z2: C.z + nz * 0.45 });
      if (K.v > 0.2 && Math.random() < 0.5) {
        const [x, y] = P(C.x - nx * 0.1, 0.1, C.z - nz * 0.1);
        for (let j = 0; j < 3; j++) eclats.push({ x, y, vx: (Math.random() - 0.5) * 120, vy: -Math.random() * 90, t: 0.5, c: '#ffffff' });
      }
      if (K.v <= 0) {
        Object.assign(K, { e: 'sol', te: T() });
        bruit('glisse', 0);
        parle(C, ['Aïe… 😵‍💫', 'Ouille ouille ouille… 🤕', 'J’ai vu des étoiles… ✨'][Math.floor(Math.random() * 3)], 1.4);
      }
    } else if (K.e == 'sol') {
      if (d > KO_SOL) Object.assign(K, { e: 'releve', te: T() });
    } else if (K.e == 'releve') {
      if (d > KO_REL) {
        Object.assign(K, { e: 'secoue', te: T() });
        parle(C, ['Tu vas me le payer ! 😤', 'Même pas mal ! 😝', 'REVANCHE ! 💪'][Math.floor(Math.random() * 3)], 1.8);
      }
    } else if (d > KO_SEC) C.ko = 0;
  };
  // la « patate » de Valentin : une traînée de feu et d'énergie derrière le fichier
  const trainee = () => {
    if (!F.deVal || F.sol) return;
    const [x, y, s, d] = P(F.x, F.y, F.z);
    if (d < 0.3) return;
    c.save();
    c.lineCap = 'round';
    c.shadowColor = '#ff9a3c';
    c.shadowBlur = 18;
    [
      ['#ff5a1f', 0.22, 0.2],
      ['#ffb347', 0.16, 0.13],
      ['#fff6c8', 0.09, 0.07]
    ].forEach(([col, larg, long]) => {
      const [x2, y2] = P(F.x - F.vx * long, F.y - F.vy * long, F.z - F.vz * long),
        g = c.createLinearGradient(x, y, x2, y2);
      g.addColorStop(0, col);
      g.addColorStop(1, col + '00');
      c.strokeStyle = g;
      c.lineWidth = Math.max(3, s * larg);
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x2, y2);
      c.stroke();
    });
    c.restore();
  };
  // les étoiles qui tournent au-dessus de sa tête pendant qu'elle est sonnée
  const etoilesKO = t => {
    const K = C.ko;
    if (K.e != 'sol') return;
    const d = T() - K.te,
      [nx, nz] = K.n,
      [x0, y0, sc, dd] = P(C.x, C.y + 0.2, C.z),
      [x1] = P(C.x + nx, C.y + 1, C.z + nz),
      [x2] = P(C.x, C.y + 1, C.z),
      s = x1 >= x2 ? 1 : -1,
      hx = x0 + s * 0.78 * sc, // sa tête, à l'écran (elle est tombée dans le sens du tir)
      hy = y0 - 0.08 * sc,
      al = Math.min(1, d / 0.2, (KO_SOL - d) / 0.2);
    if (dd < 0.3 || al <= 0) return;
    c.globalAlpha = al;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.font = `${Math.max(14, sc * 0.16)}px system-ui,sans-serif`;
    for (let i = 0; i < 5; i++) {
      const a = t * 4 + (i * Math.PI * 2) / 5;
      c.fillText(i % 2 ? '💫' : '⭐', hx + Math.cos(a) * sc * 0.22, hy - sc * 0.14 + Math.sin(a) * sc * 0.07);
    }
    c.globalAlpha = 1;
  };
  // Valentin charge sa patate : une aura orange qui pulse autour de lui, et des étincelles qui montent
  const aura = t => {
    const R = VAL.renvoi;
    if (!R || R.e != 'charge') return;
    const k = Math.min(1, (T() - R.t) / KO_CHARGE),
      [x, y, s, d] = P(VAL.x, VAL.base + 0.95, VAL.z);
    if (d < 0.3) return;
    const r = s * (0.55 + 0.2 * k + 0.05 * Math.sin(t * 30)),
      g = c.createRadialGradient(x, y, r * 0.2, x, y, r);
    g.addColorStop(0, `rgba(255,240,170,${0.55 * k})`);
    g.addColorStop(0.5, `rgba(255,150,40,${0.35 * k})`);
    g.addColorStop(1, 'rgba(255,90,20,0)');
    c.fillStyle = g;
    c.beginPath();
    c.ellipse(x, y, r * 0.7, r, 0, 0, 7);
    c.fill();
    c.strokeStyle = `rgba(255,220,120,${0.8 * k})`;
    c.lineWidth = 2;
    for (let i = 0; i < 9; i++) {
      const a = i * 0.7 + t * 2,
        u = (t * 2.2 + i * 0.37) % 1,
        px = x + Math.cos(a) * r * 0.55,
        py = y + r * 0.8 - u * r * 1.9;
      c.beginPath();
      c.moveTo(px, py);
      c.lineTo(px, py - s * 0.12);
      c.stroke();
    }
  };
  // les effets manga par-dessus tout : image en négatif, lignes de vitesse vers elle, onomatopées géantes
  const manga = [];
  const mangaFx = t => {
    const now = T();
    for (let i = manga.length - 1; i >= 0; i--) {
      const m = manga[i],
        d = now - m.t;
      if (d > 1.1) {
        manga.splice(i, 1);
        continue;
      }
      const [cx, cy] = P(C.x, C.y + 0.9, C.z);
      if (m.k == 'impact') {
        // arrêt sur image : image en négatif sur les toutes premières images, puis lignes de vitesse
        if (d < 0.09) {
          c.save();
          c.globalCompositeOperation = 'difference';
          c.fillStyle = '#ffffff';
          c.fillRect(0, 0, W, H);
          c.restore();
        }
        if (d < 0.5) {
          const al = d < 0.2 ? 1 : 1 - (d - 0.2) / 0.3,
            R = Math.hypot(W, H);
          c.fillStyle = `rgba(10,10,18,${0.85 * al})`;
          for (let j = 0; j < 46; j++) {
            const a = (j / 46) * Math.PI * 2 + Math.sin(j * 12.9) * 0.05,
              r0 = Math.min(W, H) * (0.16 + 0.1 * Math.abs(Math.sin(j * 7.3))),
              w = 0.012 + 0.012 * Math.abs(Math.sin(j * 3.1));
            c.beginPath();
            c.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
            c.lineTo(cx + Math.cos(a - w) * R, cy + Math.sin(a - w) * R);
            c.lineTo(cx + Math.cos(a + w) * R, cy + Math.sin(a + w) * R);
            c.closePath();
            c.fill();
          }
        }
      }
      // l'onomatopée : elle jaillit, tremble, puis s'efface
      const pop = Math.min(1, d / 0.08),
        al = d < 0.75 ? 1 : 1 - (d - 0.75) / 0.35,
        taille = Math.min(W, H) * (m.k == 'impact' ? 0.16 : 0.12) * (0.6 + 0.5 * pop),
        tx = (m.k == 'impact' ? cx + W * 0.08 : cx) + (Math.random() - 0.5) * 6 * (1 - d),
        ty = (m.k == 'impact' ? cy - H * 0.16 : cy - H * 0.06) + (Math.random() - 0.5) * 6 * (1 - d);
      c.save();
      c.globalAlpha = Math.max(0, al);
      c.translate(tx, ty);
      c.rotate(m.k == 'impact' ? -0.2 : 0.12);
      c.font = `italic 900 ${Math.round(taille)}px Impact, 'Arial Black', system-ui, sans-serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.lineJoin = 'round';
      c.lineWidth = taille * 0.16;
      c.strokeStyle = '#111';
      c.strokeText(m.txt, 0, 0);
      const g = c.createLinearGradient(0, -taille / 2, 0, taille / 2);
      g.addColorStop(0, m.k == 'impact' ? '#fff27a' : '#ffffff');
      g.addColorStop(1, m.k == 'impact' ? '#ff6a1f' : '#9fd0ff');
      c.fillStyle = g;
      c.fillText(m.txt, 0, 0);
      c.restore();
    }
    // lignes de vitesse horizontales pendant qu'elle vole
    if (C.ko && C.ko.e == 'vol') {
      const [x1, y1] = P(C.x, C.y + 0.8, C.z),
        [x2, y2] = P(C.x + C.ko.n[0], C.y + 0.8, C.z + C.ko.n[1]),
        a = Math.atan2(y2 - y1, x2 - x1);
      c.strokeStyle = '#ffffffb0';
      c.lineWidth = 2;
      for (let j = 0; j < 14; j++) {
        const o = (Math.sin(j * 91.7 + Math.floor(t * 20)) * 0.5 + 0.5) * H * 0.5 - H * 0.25,
          l = 60 + 80 * Math.abs(Math.sin(j * 5.1)),
          px = x1 - Math.cos(a) * (40 + j * 12) - Math.sin(a) * o,
          py = y1 - Math.sin(a) * (40 + j * 12) + Math.cos(a) * o;
        c.beginPath();
        c.moveTo(px, py);
        c.lineTo(px - Math.cos(a) * l, py - Math.sin(a) * l);
        c.stroke();
      }
    }
  };
  const entre = () => {
    if (!vis.ok) return recrache(); // ce n'est pas le fichier mystère : la cheminée n'en veut pas
    if (!F.in) bruit('entre');
    F.in = 1;
    F.vy = Math.min(F.vy, -1);
    F.vx *= 0.2;
    F.vz *= 0.2;
    if (fin) return;
    fin = 1;
    // les records sont annoncés après le replay (voir fete)
    const distFin = F.moi ? Math.hypot(F.x - F.x0, F.z - F.z0) : 0;
    fete.recs = () => {
      if (distFin) (record('dist', distFin), record('reussi', distFin));
      if (lancers) record('lancers', lancers);
    };
    // le tir gagnant est rejoué au ralenti (voir replay) ; la fête et la danse viennent après
    replayPrepare(distFin);
  };
  // après le replay (ou tout de suite s'il n'y en a pas) : fumée, étincelles, confettis, puis la danse et l'ouverture
  const fete = () => {
    o.classList.remove('replay');
    if (fete.recs) setTimeout(fete.recs, 900);
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
  // un mauvais fichier (pas le fichier mystère) : le feu s'étouffe et le recrache, noirci et fumant, vers Célestine
  const recrache = () => {
    vis.noir = 1;
    const dx = C.x,
      dz = C.z - CZ,
      n = Math.hypot(dx, dz) || 1,
      v = Math.min(3.2, n * 0.55);
    Object.assign(F, { x: 0, y: TOP + 0.12, z: CZ, vx: (dx / n) * v, vy: 6, vz: (dz / n) * v, va: 10, sol: 0, deVal: 0, noirT: T() });
    bruit('recrache');
    for (let i = 0; i < 24; i++)
      fumees.push({
        x: (Math.random() - 0.5) * 0.5,
        y: TOP + Math.random() * 0.3,
        z: CZ,
        r: 0.1 + Math.random() * 0.12,
        a: 0.85,
        v: 0.5 + Math.random() * 0.9,
        noir: 1
      });
    const [x, y] = P(0, TOP, CZ);
    for (let i = 0; i < 30; i++)
      eclats.push({ x, y, vx: (Math.random() - 0.5) * 260, vy: -60 - Math.random() * 220, t: 0.9, c: ['#ffb35c', '#ff7a2f', '#ffd76a'][i % 3] });
    tip.textContent = 'Ho ho… ce n’est pas le bon fichier ! 🎅 Choisis-en un autre dans la boîte aux lettres 📮';
  };
  // le fichier sorti du toit retombe du ciel, à un endroit libre du toit
  // flèche rose qui rebondit au-dessus du fichier à ramasser
  const fleche = (t, fx = F.x, fy = F.y, fz = F.z) => {
    const [x, y, s, d] = P(fx, fy + 0.5 + Math.abs(Math.sin(t * 4)) * 0.12, fz);
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
    document.removeEventListener('mousemove', souris);
    if (document.pointerLockElement === cv) document.exitPointerLock();
    o.classList.add('out');
    setTimeout(() => {
      o.remove();
      cb(fc);
    }, 450);
  };
  /* ===================== Célestine (commandes de jeu) ===================== */
  // Joystick (ou ZQSD) pour la faire marcher, glisser le doigt (ou la souris, ou les flèches) pour tourner la vue : elle tourne
  // avec, on voit toujours son dos ; « Sauter » (ou Espace) pour sauter ; bouton « Lancer » (ou touche E) maintenu : la jauge de force monte et descend, on relâche pour lancer droit devant.
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
    if (C.ko) {
      // la patate (voir renverse) : elle bascule dans le sens du tir, tourne en l'air, s'écrase sur le dos, glisse, se relève
      const K = C.ko,
        d = T() - K.te,
        [nx, nz] = K.n,
        L = (a, b, k) => a + (b - a) * k * k * (3 - 2 * k),
        [x1] = P(C.x + nx, C.y + 1, C.z + nz),
        [x0] = P(C.x, C.y + 1, C.z),
        s = x1 >= x0 ? 1 : -1, // de quel côté de l'écran elle part
        H2 = Math.PI / 2;
      if (K.e == 'stop') return { e: 'envol', d: T() - K.t, rot: s * 0.25, ecart: 6, mx: 0 };
      if (K.e == 'vol') {
        // une vrille en arrière qui retombe pile sur le dos
        const u = Math.min(1, d / K.tv);
        return { e: 'envol', d: T() - K.t, rot: s * (0.25 + (H2 - 0.25) * u + 1.1 * Math.sin(u * Math.PI)), ecart: 14 + 12 * Math.sin(d * 19), mx: 0 };
      }
      if (K.e == 'glisse') return { e: 'glisse', d: T() - K.t, rot: s * H2, ecart: 8, mx: 0, saut: d < 0.15 ? Math.sin((d / 0.15) * Math.PI) * 9 : 0 };
      if (K.e == 'sol') return { e: 'ko', d: T() - K.t, rot: s * H2, ecart: 14 + 3 * Math.sin(d * 3), mx: 0 };
      if (K.e == 'releve') {
        const k = Math.min(1, d / KO_REL);
        return { e: 'releve', d, rot: s * L(H2, 0, k), ecart: 14 * (1 - k), mx: 0, saut: Math.sin(k * Math.PI) * 10 };
      }
      return { e: 'secoue', d, rot: Math.sin(d * 22) * 0.06 * Math.max(0, KO_SEC - d) * 2, ecart: 0, mx: 0 };
    }
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
  /* ---- le squelette des bras : l'épaule est fixe, le bras et l'avant-bras ont une longueur fixe (en cm) ----
     Chaque pose donne où va la main (et vers où pointe le coude) ; le coude est ensuite calculé (cinématique inverse),
     et la main et le coude sont repoussés hors du buste et de la tête : les bras ne traversent plus jamais le corps. */
  const EPA = 133, // hauteur des épaules
    EPX = 18.5, // écart des épaules
    LBR = 27, // bras (épaule → coude)
    LAV = 25, // avant-bras (coude → main)
    TRONC = [
      [146, 16, 10],
      [141, 17.5, 11],
      [128, 20.5, 13.5],
      [110, 21.5, 14.5],
      [90, 23, 15],
      [75, 24, 15.5]
    ];
  // demi-largeur et demi-épaisseur du buste à la hauteur Y (null au-dessus ou en dessous)
  const tronc = Y => {
    if (Y > 146 || Y < 70) return null;
    for (let i = 0; i < TRONC.length - 1; i++) {
      const [ya, wa, da] = TRONC[i],
        [yb, wb, db] = TRONC[i + 1];
      if (Y <= ya && Y >= yb) {
        const k = (ya - Y) / (ya - yb);
        return [wa + (wb - wa) * k, da + (db - da) * k];
      }
    }
    return [24, 15.5];
  };
  // un bras par ses angles : a = vers l'avant (0 : le long du corps), o = écarté sur le côté (π : tendu vers le haut),
  // b = pli du coude vers l'avant. Renvoie la main (h) et le coude (e).
  const bA = (q, a, o, b = 0) => {
    const so = Math.sin(o),
      co = Math.cos(o),
      E = [q * EPX + q * so * LBR, EPA - co * Math.cos(a) * LBR, co * Math.sin(a) * LBR],
      H = [E[0] + q * so * LAV, E[1] - co * Math.cos(a + b) * LAV, E[2] + co * Math.sin(a + b) * LAV];
    return { h: H, e: E };
  };
  const pose2 = (D, G, acc = 0) => ({ d: D.h, de: D.e, g: G.h, ge: G.e, acc });
  // repousse un point (main, coude) hors du buste et de la tête, r = son épaisseur
  const horsCorps = (P, q, r) => {
    let [x, y, z] = P;
    const T = tronc(y);
    if (T) {
      const ex = x / (T[0] + r),
        ez = z / (T[1] + r),
        e = Math.hypot(ex, ez);
      if (e < 1) {
        if (e < 0.05) x = q * (T[0] + r);
        else {
          x /= e;
          z /= e;
        }
      }
    }
    const hx = x,
      hy2 = y - 155,
      hz = z,
      dh = Math.hypot(hx, hy2, hz),
      R = 12 + r;
    if (dh < R) {
      const k = dh < 0.1 ? 1 : R / dh;
      if (dh < 0.1) z = R;
      else {
        x = hx * k;
        y = 155 + hy2 * k;
        z = hz * k;
      }
    }
    return [x, y, z];
  };
  // cinématique inverse : à partir de la main voulue (et d'un indice pour le coude), le vrai coude et la vraie main
  const resout = (q, H, Eh) => {
    const S = [q * EPX, EPA, 0],
      sub = (u, v) => u.map((w, i) => w - v[i]),
      dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2],
      nrm = u => {
        const l = Math.hypot(...u) || 1;
        return u.map(w => w / l);
      };
    let h = horsCorps(H, q, 5.5),
      v = sub(h, S),
      d = Math.hypot(...v);
    const max = LBR + LAV - 0.4;
    if (d > max) {
      v = v.map(w => (w * max) / d);
      d = max;
    }
    if (d < 6) {
      v = [q * 6, 0, 0];
      d = 6;
    }
    h = S.map((w, i) => w + v[i]);
    const u = nrm(v);
    let pole = Eh ? sub(Eh, S) : [q * 0.45, -0.3, -0.85]; // par défaut, le coude part sur le côté et vers l'arrière
    pole = sub(
      pole,
      u.map(w => w * dot(pole, u))
    );
    if (Math.hypot(...pole) < 0.01)
      pole = sub(
        [q, 0, -0.3],
        u.map(w => w * dot([q, 0, -0.3], u))
      );
    const w2 = nrm(pole),
      ap = (LBR * LBR - LAV * LAV + d * d) / (2 * d),
      hp = Math.sqrt(Math.max(0, LBR * LBR - ap * ap));
    const e = horsCorps(
      S.map((s0, i) => s0 + u[i] * ap + w2[i] * hp),
      q,
      4.5
    );
    return { h, e };
  };
  const poses = () => {
    const sw = Math.sin(C.ph),
      a = C.amp,
      dz = danse(),
      tt = T();
    if (C.chute) {
      // au sol : étalée bras en croix ; en l'air ou au bord : elle mouline des bras (deux cercles en opposition)
      if (C.chute.sol) return pose2(bA(1, 0.1, 1.3, 0.3), bA(-1, -0.1, 1.4, 0.2));
      const w = tt * (C.chute.vy ? 14 : 11);
      return pose2(bA(1, w, 0.5, 0.35), bA(-1, w + Math.PI, 0.5, 0.35), 2);
    }
    if (dz) {
      const w = Math.sin(dz.d * 7);
      switch (dz.e) {
        case 'envol': {
          // projetée en arrière : les bras moulinent dans tous les sens
          const m = tt * 16;
          return pose2(bA(1, m, 0.9 + 0.5 * Math.sin(m * 0.7), 0.35), bA(-1, m + Math.PI * 0.8, 0.9 + 0.5 * Math.cos(m * 0.6), 0.35), 2);
        }
        case 'glisse': // elle glisse sur le dos, les bras traînent au-dessus de la tête
          return pose2(bA(1, -0.15, 2.5 + 0.1 * w, -0.2), bA(-1, -0.15, 2.5 - 0.1 * w, -0.2));
        case 'ko': // étalée en croix dans la neige
          return pose2(bA(1, 0.1, 1.5 + 0.1 * w, 0.1), bA(-1, 0.1, 1.5 - 0.1 * w, 0.1));
        case 'releve': // elle pousse sur ses mains pour se relever
          return pose2(bA(1, -0.4, 0.5, 0.6), bA(-1, -0.4, 0.5, 0.6));
        case 'secoue': // elle s'époussette
          return pose2(bA(1, 0.6 + 0.3 * w, 0.3, 1.2), bA(-1, 0.6 - 0.3 * w, 0.3, 1.2));
        case 'ange': {
          // allongée dans la neige : les bras balaient de la hanche jusqu'au-dessus de la tête
          const k = ((dz.bat || 0) + 1) / 2;
          return pose2(bA(1, 0, 0.45 + k * 2.2, 0.1), bA(-1, 0, 0.45 + k * 2.2, 0.1));
        }
        case 'toprock': // poings devant, les bras s'ouvrent et se croisent en rythme
          return pose2(bA(1, 1.05, 0.2 + 0.42 * w, 1.15), bA(-1, 1.05, 0.2 - 0.42 * w, 1.15));
        case 'moonwalk': // bras souples qui suivent le glissé
          return pose2(bA(1, 0.35 * w, 0.22, 0.55), bA(-1, -0.35 * w, 0.22, 0.55));
        case 'windmill':
        case 'descend': // sur le dos, bras en croix
          return pose2(bA(1, 0.1, 1.45, 0.1), bA(-1, 0.1, 1.45, 0.1));
        case 'freeze': {
          // une main au sol près de la tête, l'autre sur la hanche
          const D = bA(1, -0.25, 2.7, -0.35);
          return { d: D.h, de: D.e, g: [-22, 100, 3], ge: [-38, 116, -6] };
        }
        case 'saut': // salto : bras repliés contre le buste
          return pose2(bA(1, 1.25, 0.2, 1.75), bA(-1, 1.25, 0.2, 1.75));
        case 'bravo': // bras levés en V
          return pose2(bA(1, -0.15, 2.5 + 0.1 * w, -0.2), bA(-1, -0.15, 2.5 - 0.1 * w, -0.2));
        default: // tête en bas (headspin) : les mains posées au sol de part et d'autre de la tête
          return pose2(bA(1, -0.25, 2.75, -0.4), bA(-1, -0.25, 2.75, -0.4));
      }
    }
    // emotes (Célestine) et gestes de Valentin
    const em = C.emote && tt - C.emote.t < C.emote.d ? C.emote : null,
      REPOS = q => bA(q, 0.05, 0.17, 0.25);
    if (em) {
      const k = tt - em.t,
        w = Math.sin(k * 9);
      switch (em.k) {
        case 'salut': {
          // le bras levé sur le côté, l'avant-bras se balance autour du coude
          const th = 0.15 + Math.sin(k * 11) * 0.38,
            E = [EPX + 26.5, EPA + 5, 4],
            Gb = REPOS(-1);
          return { d: [E[0] + Math.sin(th) * LAV, E[1] + Math.cos(th) * LAV, 7], de: E, g: Gb.h, ge: Gb.e };
        }
        case 'bisou': {
          // la main sur les lèvres, puis elle l'envoie vers l'avant
          const Gb = REPOS(-1);
          if (k < 0.55) return { d: [2, 150, 18], de: [24, 124, 14], g: Gb.h, ge: Gb.e };
          const D = bA(1, 1.35, 0.25, 0.15);
          return { d: D.h, de: D.e, g: Gb.h, ge: Gb.e };
        }
        case 'danse': {
          // « disco » : un bras pointé vers le ciel, l'autre en travers devant le corps, en alternance
          const h = Math.sin(k * 6.5) > 0 ? 1 : -1,
            HAUT = bA(h, -0.1, 2.6, 0);
          return h > 0
            ? { d: HAUT.h, de: HAUT.e, g: [10, 96, 27], ge: [-28, 112, 12], acc: Math.abs(w) * 4 }
            : { d: [-10, 96, 27], de: [28, 112, 12], g: HAUT.h, ge: HAUT.e, acc: Math.abs(w) * 4 };
        }
        case 'boude': // bras croisés devant la poitrine, elle tape du pied
          return { d: [-11, 119, 23], de: [25, 112, 9], g: [11, 115, 26], ge: [-25, 109, 9], acc: 0.6 };
        case 'lance': {
          // Valentin lance une boule de neige : armé derrière la tête, puis bras qui fouette vers l'avant
          const Gv = bA(-1, 1.0, 0.3, 0.4);
          if (k < 0.4) return { d: [22, 168, -20], de: [36, 148, -6], g: Gv.h, ge: Gv.e };
          return pose2(bA(1, 1.55, 0.2, 0.1), bA(-1, -0.3, 0.3, 0.4));
        }
        case 'aie': // assis dans la neige, bras en l'air
          return pose2(bA(1, 0.3, 2.3, 0.4), bA(-1, 0.3, 2.3, 0.4), 42);
        case 'touche': // elle sursaute, mains ouvertes
          return pose2(bA(1, 0.9, 0.75, 1.1), bA(-1, 0.9, 0.75, 1.1), 6);
        default:
          return pose2(REPOS(1), REPOS(-1));
      }
    }
    // tir façon basket : le fichier tenu à deux mains au-dessus du front, coudes vers l'avant, genoux fléchis…
    const SET = { d: [7, 176, 15], de: [27, 148, 16], g: [-5, 170, 17], ge: [-27, 145, 14] },
      lt = tt - C.tir,
      mix3 = (p, q, k) => p.map((v, i) => v + (q[i] - v) * k);
    if (C.charge) return { ...SET, acc: 9 };
    if (C.glisse) return pose2(bA(1, 0.3, 1.25, 0.35), bA(-1, 0.3, 1.25, 0.35), 16); // bras écartés pour l'équilibre
    const rm = tt - (C.ramasse || -9);
    if (rm < 0.4) {
      // elle se baisse et tend la main vers le fichier
      const k = Math.sin((rm / 0.4) * Math.PI),
        R0 = REPOS(1),
        Gb = REPOS(-1);
      return { d: mix3(R0.h, [18, 50, 30], k), de: mix3(R0.e, [30, 112, 12], k), g: Gb.h, ge: Gb.e, acc: k * 26 };
    }
    if (lt < 0.75) {
      // … puis elle saute, le bras se tend vers le haut et l'avant (coup de poignet), l'autre main se retire
      const k = Math.min(1, lt / 0.22),
        r = Math.max(0, Math.min(1, (lt - 0.5) / 0.25)), // retour au repos
        G1 = bA(-1, 0.55, 0.35, 0.9),
        TIR = { d: [8, 192, 34], de: [14, 166, 20], g: G1.h, ge: G1.e },
        RD = REPOS(1),
        RG = REPOS(-1),
        RE = { d: RD.h, de: RD.e, g: RG.h, ge: RG.e },
        pp = {};
      for (const q of ['d', 'de', 'g', 'ge']) pp[q] = mix3(mix3(SET[q], TIR[q], k), RE[q], r);
      return { ...pp, acc: C.y > 0.01 ? 0 : 9 * (1 - k) + Math.max(0, 8 - (tt - C.pose) * 50) };
    }
    // marche : les bras balancent, coude à peine plié ; course : coude plié à angle droit, grand balancier épaule ;
    // à l'arrêt : elle respire. Chaque bras va à l'opposé de la jambe du même côté.
    const r = Math.max(0, Math.min(1, ((C.v || 0) - 1.8) / 1.4)),
      aw = Math.min(1, a),
      souffle = Math.sin(tt * 2.2) * 0.6,
      bras = q => {
        const sA = q * sw,
          aW = sA * 0.42 * aw,
          bW = 0.25 + 0.25 * Math.max(0, sA) * aw,
          aR = sA * 0.9 - 0.1,
          bR = 1.2 + 0.3 * Math.max(0, sA); // le coude se plie davantage quand le bras passe devant
        return bA(q, aW + (aR - aW) * r, 0.17 + (0.12 - 0.17) * r, bW + (bR - bW) * r);
      };
    return pose2(bras(1), bras(-1), a < 0.05 ? 0.6 + souffle : 0);
  };
  // la pose voulue est lissée d'une image à l'autre (les gestes s'enchaînent sans à-coups),
  // puis les coudes sont recalculés : les bras gardent toujours leur longueur
  const complet = pp => {
    const coude = (q, H) => [q * 23 + (H[0] - q * EPX) * 0.4, (EPA + H[1]) / 2, H[2] * 0.5 - 6],
      d = pp.d || [27, 83, 6],
      g = pp.g || [-27, 83, 6];
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
    const D = resout(1, C.ps.d, C.ps.de),
      G = resout(-1, C.ps.g, C.ps.ge);
    return { d: D.h, de: D.e, g: G.h, ge: G.e, acc: C.ps.acc };
  };
  const main = () => {
    // en 3D : la vraie main droite de la figurine (position notée à la dernière image)
    const m3 = C.main3;
    if (m3 && FIG3D.pret('celestine') && T() - m3.t < 0.25)
      return { x: m3.x, y: m3.y + 0.03, z: m3.z, a: 0.1 * Math.cos(C.phi - V.yaw) + Math.sin(C.ph) * 0.1 * C.amp };
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
  const ctl = { jx: 0, jy: 0, kx: 0, ky: 0, kt: 0, yaw: 0 };
  // la chute du toit, en vraie 3D :
  // 1. au bord, elle vacille en moulinant des bras (la caméra passe sur le côté pour bien voir le vide) ;
  // 2. elle bascule et tombe en battant des bras et des jambes, la caméra la suit dans sa chute, entre les immeubles ;
  // 3. elle s'écrase dans la neige de la rue (secousse, gerbe de neige, empreinte) ;
  // 4. fondu au noir, elle réapparaît au milieu du toit, la caméra remise derrière elle.
  const SOL = -9.6; // le sol de la rue, 9,6 m sous le toit
  const chute = dt => {
    const K = C.chute,
      d = T() - K.t,
      [nx, nz] = K.n;
    C.v = 0;
    C.vy = 0;
    if (K.m == 'bord' && d < 1.15) {
      // au bord : elle se tourne vers le vide, se penche de plus en plus, se rattrape, mouline des bras
      const vise = Math.atan2(nx, nz),
        osc = Math.sin(d * 10);
      C.phi += Math.atan2(Math.sin(vise - C.phi), Math.cos(vise - C.phi)) * Math.min(1, dt * 10);
      C.lean = 0.22 + 0.14 * osc + d * 0.28;
      C.x = K.x0 + nx * 0.04 * osc;
      C.z = K.z0 + nz * 0.04 * osc;
      C.amp += (0 - C.amp) * Math.min(1, dt * 8);
      if (!K.cri && d > 0.12) {
        K.cri = 1;
        parle(C, 'Oh oh… 😱', 1.1);
        bruit('aie', 0.8);
      }
    } else if (!K.sol) {
      // la chute (un peu ralentie, pour bien la voir) : elle bat des bras et des jambes
      if (!K.vol) {
        K.vol = 1;
        K.vy = 1.4;
        C.base = SOL; // son ombre est désormais sur le trottoir
      }
      K.vy -= G * 0.62 * dt;
      C.y += K.vy * dt;
      if (K.m == 'bord') {
        const sort = Math.min(0.85, (d - 1.15) * 1.5);
        C.x = K.x0 + nx * sort;
        C.z = K.z0 + nz * sort;
      } else {
        // avec son élan, qui s'essouffle un peu ; dans la ruelle, elle ne traverse pas le mur d'en face
        C.x += K.vx * dt;
        C.z += K.vz * dt;
        K.vx *= 1 - Math.min(1, dt * 0.5);
        K.vz *= 1 - Math.min(1, dt * 0.5);
        if (K.rue) C.x = Math.max(9.0, Math.min(10.28, C.x));
        if (Math.hypot(K.vx, K.vz) > 0.3) {
          const vise = Math.atan2(K.vx, K.vz);
          C.phi += Math.atan2(Math.sin(vise - C.phi), Math.cos(vise - C.phi)) * Math.min(1, dt * 6);
        }
      }
      C.lean += (0.12 - C.lean) * Math.min(1, dt * 4);
      C.amp = 1.1; // les jambes pédalent dans le vide
      C.ph += dt * 13;
      bruit('glisse', Math.min(1, -K.vy / 6));
      if (C.y <= SOL) {
        // badaboum dans la neige de la rue
        C.y = SOL;
        K.sol = T();
        K.impact = { x: C.x, z: C.z };
        C.rot = Math.PI / 2;
        C.lean = 0;
        C.amp = 0;
        C.phi = V.yaw + Math.PI; // sur le dos, tournée vers nous
        bruit('glisse', 0);
        bruit('boum');
        bruit('neige', 1);
        const [x, y] = P(C.x, SOL + 0.3, C.z);
        for (let j = 0; j < 46; j++)
          eclats.push({ x, y, vx: (Math.random() - 0.5) * 300, vy: -Math.random() * 260, t: 1, c: j % 4 ? '#ffffff' : '#cfe0ff' });
        parle(C, 'Aïe aïe aïe… 😵', 1.4);
      }
    } else {
      // elle reste un moment étalée, puis fondu au noir et retour sur le toit
      const ds = T() - K.sol;
      if (ds > 1.7 && !K.noir) K.noir = T();
      if (K.noir && T() - K.noir > 0.35) {
        Object.assign(C, { x: 0, z: 2.6, y: 0, base: 0, vy: 0, rot: 0, lean: 0, phi: 0, amp: 0, chute: null, ps: null, idle: 0 });
        ctl.yaw = 0;
        Object.assign(V, { x: 0, z: 0, yaw: 0, h: 0, p: 0 });
        Object.assign(Vt, { x: 0, z: 0, yaw: 0 });
        hy = hc;
        C.revient = T();
        parle(C, 'Plus de peur que de mal ! 😅', 1.8);
      }
    }
    if (C.tient) Object.assign(F, main(), { vol: 0, al: 1, ent: 1, in: 0 });
  };
  const marche = dt => {
    if (C.chute) return chute(dt);
    if (C.ko) return ko(dt);
    saut(dt);
    if (C.chute) return; // elle vient de sauter dans le vide
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
    // en l'air, elle garde son élan (on peut juste l'infléchir un peu au joystick)
    if (C.saute && C.air) {
      if (m > 0.12) {
        const dx = co * ix + si * -iy,
          dz = -si * ix + co * -iy,
          n = Math.hypot(dx, dz);
        C.air.vx += (dx / n) * dt * 2.5;
        C.air.vz += (dz / n) * dt * 2.5;
        const sp = Math.hypot(C.air.vx, C.air.vz),
          mx = Math.max(1.7, C.air.v0);
        if (sp > mx) ((C.air.vx *= mx / sp), (C.air.vz *= mx / sp));
      }
      vx = C.air.vx;
      vz = C.air.vz;
    } else if (C.glisse) {
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
    // caméra « à la Fortnite » : elle regarde toujours dans le sens de la vue, on voit toujours son dos ;
    // tourner la vue la fait tourner, et le joystick la fait avancer, reculer ou faire des pas de côté
    if (ctl.kt) ctl.yaw += ctl.kt * dt * 2.4;
    // (comme dans Fortnite : en courant, elle se tourne vers là où elle court ; en l'air, elle garde son cap)
    const vise =
      em == 'boude' ? V.yaw : C.glisse || C.saute ? null : C.v > 2.3 && !C.charge && (vx || vz) ? Math.atan2(vx, vz) : ctl.yaw;
    if (vise != null) C.phi += Math.atan2(Math.sin(vise - C.phi), Math.cos(vise - C.phi)) * Math.min(1, dt * 14);
    // elle recule (joystick vers le bas) : l'animation de marche passe à l'envers
    const sp = Math.hypot(vx, vz);
    C.recul = sp > 0.05 && (vx * Math.sin(C.phi) + vz * Math.cos(C.phi)) / sp < -0.3;
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
    // chez Valentin : on ne lui passe pas à travers, ni à travers son petit conduit de cheminée
    if (chezValentin()) {
      const dv = Math.hypot(C.x - VAL.x, C.z - VAL.z);
      if (dv < 0.5 && dv > 0) ((C.x = VAL.x + ((C.x - VAL.x) / dv) * 0.5), (C.z = VAL.z + ((C.z - VAL.z) / dv) * 0.5));
      const e2 = VOISIN.ce + 0.22;
      if (Math.abs(C.x - VOISIN.cx) < e2 && Math.abs(C.z - VOISIN.cz) < e2) {
        const px = e2 - Math.abs(C.x - VOISIN.cx),
          pz = e2 - Math.abs(C.z - VOISIN.cz);
        if (px < pz) C.x = VOISIN.cx + Math.sign(C.x - VOISIN.cx || 1) * e2;
        else C.z = VOISIN.cz + Math.sign(C.z - VOISIN.cz || 1) * e2;
      }
    }
    // pas de barrière invisible : au bord de la gouttière ou d'un côté d'un des deux toits, elle perd l'équilibre et tombe
    // Lentement, elle mouline des bras au bord avant de tomber ; en courant (ou en glissade), elle trébuche et part
    // dans le vide avec son élan
    const nBord = !fin && !C.chute && C.y <= 0 ? horsToit() : null;
    if (nBord) {
      const n = nBord,
        chezV = C.x > MILIEU;
      if (Math.hypot(vx, vz) > 2.2) return tombe('course', n, vx, vz, 0);
      if (n[1]) C.z = (chezV ? VOISIN.z0 : BORD) + 0.12;
      else C.x = n[0] < 0 ? (chezV ? VOISIN.x0 + 0.12 : -8.88) : chezV ? VOISIN.x1 - 0.12 : 8.88;
      C.chute = { m: 'bord', t: T(), n, vy: 0, x0: C.x, z0: C.z };
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
    lancers++;
    tLache = T();
    F = {
      moi: 1,
      x0: m.x,
      z0: m.z,
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
      // elle a sauté dans le vide (hors des toits, même à 45 cm près) : elle continue sa course et tombe, sans atterrir
      const n = !fin && horsToit(0.45);
      if (n) {
        const a = C.air || { vx: 0, vz: 0 };
        C.saute = 0;
        C.air = null;
        return tombe('saut', n, a.vx, a.vz, C.vy);
      }
      C.y = 0;
      C.vy = 0;
      if (C.saute) C.v = Math.min(C.v, 2.4); // elle amortit : pas de glissade en retombant
      C.saute = 0;
      C.air = null;
      // tout près d'un toit (moins de 45 cm), elle se rattrape dessus
      if (horsToit()) {
        const chezV = C.x > MILIEU;
        C.x = Math.max(chezV ? VOISIN.x0 + 0.15 : -8.73, Math.min(chezV ? VOISIN.x1 - 0.15 : 8.73, C.x));
        C.z = Math.max((chezV ? VOISIN.z0 : BORD) + 0.15, C.z);
      }
      C.pose = T(); // elle amortit en retombant
      bruit('pas', 1);
    }
  };
  // Les deux toits (le nôtre : |x| < 8,88, z > gouttière ; celui de Valentin : VOISIN). Hors des deux, au sol : elle tombe.
  // Renvoie le sens du vide le plus proche, ou null si elle est bien sur un toit.
  const MILIEU = (8.88 + 10.4) / 2; // le milieu de la ruelle
  const horsToit = (marge = 0) => {
    const chezV = C.x > MILIEU,
      xa = (chezV ? VOISIN.x0 + 0.12 : -8.88) - marge,
      xb = (chezV ? VOISIN.x1 - 0.12 : 8.88) + marge,
      za = (chezV ? VOISIN.z0 + 0.12 : BORD + 0.12) - marge;
    if (C.x >= xa && C.x <= xb && C.z >= za) return null;
    if (C.z < za) return [0, -1];
    return C.x < xa ? [-1, 0] : [1, 0];
  };
  const chezValentin = () => surVoisin(C.x, C.z);
  // elle tombe avec son élan (« course » : elle trébuche au bord ; « saut » : elle a sauté dans le vide)
  const tombe = (m, n, vx, vz, vy) => {
    const rue = n[0] != 0 && C.x > 0 && (n[0] > 0 ? C.x < MILIEU : C.x > MILIEU); // la ruelle entre les deux toits
    C.chute = { m, t: T(), n, vx, vz, vy, vol: 1, rue, x0: C.x, z0: C.z };
    C.base = SOL; // son ombre est désormais sur le trottoir
    C.vy = 0;
    C.charge = 0;
    C.glisse = 0;
    C.emote = null;
    C.ange = 0;
    btn.classList.remove('on');
    btn.style.setProperty('--p', 0);
    parle(C, m == 'saut' ? 'Aaaaah ! 😱' : 'Oups… AAAH ! 😱', 1.3);
    bruit('aie', 0.8);
  };
  // sauter (barre d'espace, bouton « Sauter ») : plus loin en courant, assez pour franchir la ruelle (1,5 m)
  const sauter = () => {
    if (fin || C.chute || C.ko || C.y > 0 || C.vy || C.charge || C.danse || C.ange || C.pTir != null) return;
    C.vy = C.v > 2.3 ? 3.9 : 3.3;
    C.saute = T();
    const d = C.v > 0.05 && C.dir ? C.dir : [0, 0];
    C.air = { vx: d[0] * C.v, vz: d[1] * C.v, v0: C.v };
    C.emote = null;
    C.glisse = null;
    C.idle = 0;
    bruit('pas', 1);
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
  /* --- Célestine et Valentin en vraies figurines 3D (FIG3D, js/toit-figurines-3d.js) ---
     Tant qu'elles ne sont pas chargées, ou si elles ne peuvent pas l'être, les personnages dessinés plus bas restent.
     geste3D choisit l'animation selon ce que fait le personnage ; k = où en est le geste (de 0 à 1), réglé sur le jeu. */
  const geste3D = (qui, dz) => {
    const tt = T(),
      v = Math.abs(C.v || 0),
      em = C.emote && tt - C.emote.t < C.emote.d ? C.emote : null,
      cl = x => Math.max(0, Math.min(1, x)),
      sens = qui != 'valentin' && C.recul ? -1 : 1, // à reculons : l'animation à l'envers
      pas = () =>
        v > 2.3 ? { a: 'course', v: sens * Math.max(0.7, v / 3.4) } : v > 0.12 ? { a: 'marche', v: sens * Math.max(0.5, v / 1.25) } : { a: 'repos' };
    if (qui == 'valentin') {
      const R = C.renvoi;
      if (em && em.k == 'aie') return { a: 'tombe', k: Math.min(0.95, ((tt - em.t) / em.d) * 1.3) }; // sur les fesses
      if (em && em.k == 'lance') return { a: 'lancer', k: 0.25 + 0.25 * cl((tt - em.t) / em.d) }; // boule de neige
      if (em && em.k == 'salut') return { a: 'salut' };
      if (em && em.k == 'danse') return { a: 'danse' }; // il danse avec elle, chez lui
      if (tt - (C.ramasse || -9) < 0.7) return { a: 'ramasse', k: 0.05 + 0.3 * cl((tt - C.ramasse) / 0.7) };
      if (R && R.e == 'charge') return { a: 'charge' }; // il charge sa patate
      if (R && R.e == 'vise') return { a: 'lancer', k: 0.3 };
      if (R && R.e == 'lance') return { a: 'lancer', k: 0.37 + 0.2 * cl((tt - R.t) / 0.5) };
      if (C.rit && v < 0.12) return { a: 'rire' }; // Célestine est K.O. : il rigole
      return pas();
    }
    // la chute du toit : au bord, elle mouline des bras pour garder l'équilibre ; dans le vide, elle bat des bras
    // et des jambes ; en bas, étalée dans la neige
    // en courant, elle trébuche d'abord ; en sautant, elle bat tout de suite des bras dans le vide
    if (C.chute) {
      const K = C.chute,
        d = tt - K.t;
      if (K.sol) return { a: 'allongee' };
      if (K.m == 'course' && d < 0.45) return { a: 'chute', k: 0.04 + 0.3 * cl(d / 0.45) };
      return K.vol ? { a: 'vide', v: 1.3 } : { a: 'equilibre', v: 1.5 };
    }
    if (dz)
      switch (dz.e) {
        case 'envol': // la patate : projetée en arrière
          return { a: 'envol', k: C.ko && C.ko.e == 'stop' ? 0.03 : 0.05 + 0.35 * cl(C.ko && C.ko.tv ? (tt - C.ko.te) / C.ko.tv : 1) };
        case 'glisse':
        case 'ko':
        case 'ange':
          return { a: 'allongee' };
        case 'releve':
          return { a: 'releve', k: 0.5 + 0.21 * cl(dz.d / KO_REL) };
        case 'secoue':
          return { a: 'repos' };
        case 'bravo':
          return { a: 'joie' };
        default: // la danse de la victoire
          return { a: 'danse' };
      }
    if (em) return { a: { salut: 'salut', bisou: 'salut', danse: 'danse', boude: 'boude' }[em.k] || 'repos' };
    if (tt - (C.ramasse || -9) < 0.5) return { a: 'ramasse', k: 0.03 + 0.45 * cl((tt - C.ramasse) / 0.5) };
    if (C.charge) return { a: 'lancer', k: 0.33 }; // bras armé, elle vise
    if (tt - (C.tir || -9) < 0.6) return { a: 'lancer', k: 0.33 + 0.25 * cl((tt - C.tir) / 0.6) };
    if (C.saute) return { a: 'saut', k: 0.15 + 0.3 * cl((tt - C.saute) / 0.75) }; // elle pousse sur ses jambes, puis vole
    if (C.glisse) return { a: 'glisse', k: 0.35 };
    return pas();
  };
  const figurine3D = (t, LK, qui) => {
    if (P(C.x, C.y, C.z)[3] < 0.5) return;
    const [sx, sy, ss] = P(C.x, C.base || 0, C.z),
      dz = qui == 'celestine' ? danse() : null;
    if (dz && C.danse) {
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
    c.ellipse(sx, sy, ss * 0.26, ss * 0.08, 0, 0, 7);
    c.fill();
    const m = FIG3D.dessine(
      c,
      qui,
      {
        x: C.x,
        y: C.y,
        z: C.z,
        phi: C.phi,
        taille: LK.taille,
        objet: C.tient && F.al > 0 ? { cle: vis.k + (vis.nom || '') + (vis.noir ? '#' : ''), faire: texFichier, vit: vis.noir } : null
      },
      { x: V.x, y: CAM + V.h, z: V.z, yaw: V.yaw, p: V.p, f, cx: W / 2 + V.sx, cy: hc + V.sy, W, H, dpr },
      geste3D(qui, dz)
    );
    if (m) C.main3 = { ...m, t: T() }; // le fichier suit sa vraie main (main()) ; il est dessiné en 3D, dans sa moufle
  };
  const celestine = (t, LK = TENUE.celestine) => {
    const qui3 = LK === TENUE.valentin ? 'valentin' : 'celestine';
    if (FIG3D.pret(qui3)) return figurine3D(t, LK, qui3);
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
    c.rotate(C.pen * 0.05 + Math.atan(C.lean || 0) * sn);
    c.translate(0, bob);
    if (C.rot) {
      // allongée dans la neige après la chute : on la fait pivoter autour des hanches pour qu'elle repose au sol
      c.translate(0, 66 * Math.abs(Math.sin(C.rot)));
      c.translate(0, -81);
      c.rotate(C.rot);
      c.translate(0, 81);
    }
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
    /* --- bras (et la main qui tient le fichier) ---
       Trois morceaux, chacun à sa propre profondeur : le haut du bras, l'avant-bras, la main. Ceux qui sont derrière
       le buste sont dessinés avant lui (cachés par le corps), ceux qui sont devant après la tête. */
    const brasP = (cote, H3, tient, E3) => {
      const S = proj(cote * EPX, EPA, 0),
        E = proj(...E3),
        H = proj(...H3),
        manche = (A, B, larg, d) => ({
          d,
          f: () => {
            const k = ombre(d);
            trait(
              [
                [A[0], A[1]],
                [B[0], B[1]]
              ],
              mix(LK.b1, LK.b2, k),
              larg
            );
            // reflet du tissu matelassé
            c.strokeStyle = mix(LK.h1, LK.h2, k);
            c.lineWidth = larg * 0.34;
            c.beginPath();
            c.moveTo(A[0] - 1, A[1] + 1);
            c.lineTo(B[0] - 1, B[1]);
            c.stroke();
          }
        });
      return [
        manche(S, E, 10, (S[2] + E[2]) / 2),
        manche(E, H, 9, (E[2] + H[2]) / 2),
        {
          d: H[2] + 0.5,
          f: () => {
            const k = ombre(H[2]);
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
        }
      ];
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
    const morceaux = [...brasP(-1, po.g, false, po.ge), ...brasP(1, po.d, true, po.de)].sort((p, q) => p.d - q.d);
    L.sort((p, q) => p.d - q.d).forEach(e => e.f());
    c.translate(0, ACC); // genoux fléchis : tout le haut du corps descend
    morceaux.filter(b => b.d < 0).forEach(b => b.f());
    torse();
    if (pq.d > 0) echarpe();
    if (pq.d < 0 && LK.queue) pq.f();
    if (pq.d <= 0) echarpe();
    tete();
    if (pq.d >= 0 && LK.queue) pq.f();
    morceaux.filter(b => b.d >= 0).forEach(b => b.f());
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
  // même hauteur que notre toit, de l'autre côté d'une ruelle ; (cx, cz) : son petit conduit de cheminée (demi-largeur ce, hauteur ch)
  const VOISIN = { x0: 10.4, x1: 19, z0: 0.6, z1: 8.5, h: 0, cx: 15, cz: 6, ce: 0.28, ch: 0.9 };
  const surVoisin = (x, z) => x > VOISIN.x0 && x < VOISIN.x1 && z > VOISIN.z0 && z < VOISIN.z1;
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
  // Valentin et le fichier tombé sur son toit : il court le chercher, revient au bord de son toit et le relance à Célestine
  const VAL0 = { x: 11.05, z: 5.2 }; // sa place, au bord de son toit, face à notre toit
  const KO_CHARGE = 1.1; // il charge sa patate pendant 1,1 s
  const valCourt = (dt, x, z, vmax) => {
    // il court vers (x, z) en contournant son petit conduit de cheminée ; renvoie vrai quand il y est
    const dx = x - VAL.x,
      dz = z - VAL.z,
      d = Math.hypot(dx, dz);
    if (d < 0.08) return ((VAL.v = Math.max(0, VAL.v - dt * 8)), true);
    VAL.v = Math.min(vmax, VAL.v + dt * 6, d * 3 + 0.4);
    VAL.x += (dx / d) * VAL.v * dt;
    VAL.z += (dz / d) * VAL.v * dt;
    const ox = VAL.x - VOISIN.cx,
      oz = VAL.z - VOISIN.cz,
      od = Math.hypot(ox, oz),
      m = VOISIN.ce + 0.42;
    if (od < m && od > 0) ((VAL.x = VOISIN.cx + (ox / od) * m), (VAL.z = VOISIN.cz + (oz / od) * m));
    VAL.x = Math.max(VOISIN.x0 + 0.35, Math.min(VOISIN.x1 - 0.35, VAL.x));
    VAL.z = Math.max(VOISIN.z0 + 0.35, Math.min(VOISIN.z1 - 0.35, VAL.z));
    const vise = Math.atan2(dx, dz);
    VAL.phi += Math.atan2(Math.sin(vise - VAL.phi), Math.cos(vise - VAL.phi)) * Math.min(1, dt * 10);
    return false;
  };
  const valRelance = (dt, occupe) => {
    const R = VAL.renvoi;
    // le fichier vient de s'arrêter (ou glisse encore) sur son toit : il part le chercher
    if (!R && !occupe && !fin && F.vol && F.sol && !F.in && !F.tombe && surVoisin(F.x, F.z)) {
      VAL.renvoi = { e: 'cherche', t: T() };
      parle(VAL, ['Oh ! Pour moi ? 😏', 'Raté ! Je te le renvoie 😆', 'Attends, je l’ai ! 🏃'][Math.floor(Math.random() * 3)], 1.6);
      tip.textContent = '😈 Valentin prépare une patate… esquive !';
      return true;
    }
    if (!R) return false;
    if (fin) return ((VAL.renvoi = null), false);
    if (R.e == 'cherche') {
      // le fichier n'est plus sur son toit (il a glissé dans la ruelle…) : il laisse tomber et retourne à sa place
      if (!F.vol || F.tombe || !surVoisin(F.x, F.z)) return (Object.assign(R, { e: 'retour', t: T() }), true);
      // il le rattrape même s'il glisse encore
      if (valCourt(dt, F.x, F.z, 3.4) || Math.hypot(F.x - VAL.x, F.z - VAL.z) < 0.4) {
        VAL.tient = 1;
        VAL.ramasse = T(); // il se baisse pour le ramasser
        F.vol = 0;
        F.pose = 0;
        bruit('ramasse');
        Object.assign(R, { e: 'retour', t: T() });
      }
    } else if (R.e == 'retour') {
      if (T() - R.t > 0.35 && valCourt(dt, VAL0.x, VAL0.z, 3)) {
        if (!VAL.tient) return ((VAL.renvoi = null), false);
        Object.assign(R, { e: 'vise', t: T() });
      }
    } else if (R.e == 'vise' && chezValentin() && !C.chute && !C.ko) {
      // elle est chez lui : pas de patate, il va lui rendre le fichier en main
      const dx = C.x - VAL.x,
        dz = C.z - VAL.z,
        d = Math.hypot(dx, dz) || 1;
      if (d < 0.95 || valCourt(dt, C.x - (dx / d) * 0.75, C.z - (dz / d) * 0.75, 2.2)) {
        VAL.tient = 0;
        VAL.renvoi = null;
        VAL.v = 0;
        C.tient = 1;
        bruit('ramasse');
        parle(VAL, ['Tiens, c’est le tien 😘', 'Je te le rends… pour cette fois 😏'][Math.floor(Math.random() * 2)], 1.8);
        tip.textContent = '';
      }
    } else if (R.e == 'vise') {
      VAL.v = 0;
      const vise = Math.atan2(C.x - VAL.x, C.z - VAL.z);
      VAL.phi += Math.atan2(Math.sin(vise - VAL.phi), Math.cos(vise - VAL.phi)) * Math.min(1, dt * 6);
      // il attend que Célestine soit bien sur ses pieds, sur le toit
      if (T() - R.t > 0.6 && !C.chute && !C.danse && !C.ange && !C.ko && C.y <= 0.01) {
        // il charge sa patate : aura orange, bruit qui monte
        parle(VAL, ['Attention… 😈', 'Ça va chauffer… 🔥', 'Prépare-toi… 😏'][Math.floor(Math.random() * 3)], KO_CHARGE);
        bruit('charge');
        Object.assign(R, { e: 'charge', t: T() });
      }
    } else if (R.e == 'charge') {
      VAL.v = 0;
      const vise = Math.atan2(C.x - VAL.x, C.z - VAL.z);
      VAL.phi += Math.atan2(Math.sin(vise - VAL.phi), Math.cos(vise - VAL.phi)) * Math.min(1, dt * 6);
      if (T() - R.t > KO_CHARGE) {
        geste(VAL, 'lance', 0.9);
        parle(VAL, ['PATAAATE !!! 💥', 'PRENDS ÇA !!! ☄️', 'TIR DE LA MORT !!! 💥'][Math.floor(Math.random() * 3)], 1.4);
        Object.assign(R, { e: 'lance', t: T() });
      }
    } else if (R.e == 'lance' && T() - R.t > 0.4) {
      // il le lâche en fin de geste : une patate presque à plat (28 m/s), droit sur la poitrine de Célestine
      VAL.tient = 0;
      VAL.renvoi = null;
      const x0 = F.x,
        y0 = F.y,
        z0 = F.z,
        tx = C.x,
        ty = C.y + 1.1,
        tz = C.z,
        TT = Math.max(0.2, Math.hypot(tx - x0, tz - z0) / 28);
      F = {
        deVal: 1,
        x: x0,
        y: y0,
        z: z0,
        vx: (tx - x0) / TT,
        vy: (ty - y0 + 0.5 * G * TT * TT) / TT,
        vz: (tz - z0) / TT,
        a: F.a || 0,
        va: (Math.random() < 0.5 ? -1 : 1) * 26, // il tourne sur lui-même à toute vitesse
        vol: 1,
        in: 0,
        sol: 0,
        t: 0,
        arret: 0,
        al: 1,
        ent: 1,
        tombe: 0
      };
      bruit('lance', 1);
      return false;
    }
    return true;
  };
  const valentin = dt => {
    const occupe = VAL.emote && T() - VAL.emote.t < VAL.emote.d;
    VAL.amp += ((VAL.v > 0.05 ? Math.min(1.3, VAL.v / 1.2) : 0) - VAL.amp) * Math.min(1, dt * 8);
    VAL.ph += dt * (VAL.v > 0.05 ? 3 + VAL.v * 3.2 : 0);
    // le fichier suit sa main tant qu'il le tient
    if (VAL.tient) {
      const moi = C;
      C = VAL;
      try {
        Object.assign(F, main(), { vol: 0, al: 1, ent: 1, in: 0 });
      } finally {
        C = moi;
      }
    }
    if (valRelance(dt, occupe)) return valBoules(dt);
    VAL.v = 0;
    const vise = Math.atan2(C.x - VAL.x, C.z - VAL.z);
    VAL.phi += Math.atan2(Math.sin(vise - VAL.phi), Math.cos(vise - VAL.phi)) * Math.min(1, dt * 4);
    // Célestine vient lui rendre visite sur son toit : il l'accueille, ne lui lance plus de boules de neige,
    // et si elle lui fait un bisou ou danse à côté de lui, il danse avec elle
    if (chezValentin() && !C.chute) {
      if (!VAL.visite) {
        VAL.visite = 1;
        if (!occupe) geste(VAL, 'salut', 1.6);
        parle(VAL, ['Oh ! Tu es venue me voir ? 😍', 'Bienvenue chez moi ! 🏠', 'Tu as sauté ?! T’es folle 😂'][Math.floor(Math.random() * 3)], 2);
        slog('🏠', 'Toit : rend visite à Valentin sur son toit');
      }
      VAL.boule = Math.max(VAL.boule, T() + 5);
      VAL.coucou = Math.max(VAL.coucou, T() + 7);
      const ce = C.emote && T() - C.emote.t < C.emote.d ? C.emote.k : null;
      if ((ce == 'bisou' || ce == 'danse') && Math.hypot(C.x - VAL.x, C.z - VAL.z) < 2 && !occupe && T() > (VAL.danseAvec || 0)) {
        VAL.danseAvec = T() + 6;
        geste(VAL, 'danse', 3);
        parle(VAL, ce == 'bisou' ? 'Moi aussi ! 😘💕' : 'On danse ?! 🕺💃', 1.8);
      }
    } else VAL.visite = 0;
    if (!VAL.coucou) ((VAL.coucou = T() + 4), (VAL.boule = T() + 10));
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
    valBoules(dt);
  };
  // les boules de neige
  const valBoules = dt => {
    for (let i = boules.length - 1; i >= 0; i--) {
      const b = boules[i];
      b.vy -= G * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.z += b.vz * dt;
      const surNous = (Math.abs(b.x) < 9 && b.z > BORD && b.z < RIDGE) || surVoisin(b.x, b.z);
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
  /* ===================== boîte aux lettres, records, chat de la cheminée, pigeons, replay ===================== */
  // --- la boîte aux lettres : tout près, un bouton ouvre le sélecteur de fichiers du téléphone (photos, fichiers, appareil photo…)
  const BOITE = OBS.find(ob => ob.t == 'boite'),
    BOITE_PRES = 1.15,
    boiteEl = o.querySelector('.mysl-boite');
  const choisir = g => {
    if (!g || fin || C.chute) return;
    fc = g;
    apparence(g);
    // Valentin lâche l'ancien fichier s'il l'avait (il retourne à sa place)
    if (VAL.tient || VAL.renvoi) ((VAL.tient = 0), (VAL.renvoi = { e: 'retour', t: T() }));
    nouveau();
    C.ramasse = T(); // elle le sort de la boîte
    bruit('ramasse');
    tip.textContent = `📮 ${g.name}`;
  };
  boiteEl.querySelector('input').onchange = e => {
    const g = e.target.files[0];
    e.target.value = '';
    choisir(g);
  };
  const boiteMaj = () =>
    boiteEl.classList.toggle('on', !fin && !RP && !C.chute && Math.hypot(C.x - BOITE.x, C.z - BOITE.z) < BOITE_PRES);

  let lancers = 0; // nombre de lancers de Célestine (pour le record « livré en le moins de lancers »)
  // --- les records (gardés dans S.mysRec) : moins de lancers pour livrer, plus long lancer, plus long lancer réussi
  const REC = {
    lancers: { t: 'Livré en le moins de lancers', u: n => `${n} lancer${n > 1 ? 's' : ''}`, mieux: (a, b) => a < b },
    dist: { t: 'Plus long lancer', u: n => `${n.toFixed(1).replace('.', ',')} m`, mieux: (a, b) => a > b + 0.05 },
    reussi: { t: 'Plus long lancer réussi', u: n => `${n.toFixed(1).replace('.', ',')} m`, mieux: (a, b) => a > b + 0.05 },
  };
  const recs = () => {
    try {
      return (S.mysRec = S.mysRec || {});
    } catch (_) {
      return {};
    }
  };
  const recEl = o.querySelector('.mysl-rec');
  const majRec = () => {
    const R = recs();
    recEl.innerHTML =
      '<b>🏆 Records</b>' +
      Object.keys(REC)
        .map(k => `<p><span>${REC[k].t}</span><em>${R[k] != null ? REC[k].u(R[k]) : '—'}</em></p>`)
        .join('') +
      '<small>Touche pour fermer</small>';
  };
  const record = (k, v) => {
    const R = recs(),
      old = R[k];
    if (old != null && !REC[k].mieux(v, old)) return;
    R[k] = k == 'dist' || k == 'reussi' ? Math.round(v * 10) / 10 : v;
    try {
      save();
      slog('🏆', `Fichier mystère : record « ${REC[k].t} » : ${REC[k].u(R[k])}`);
    } catch (_) {}
    majRec();
    if (old == null && k == 'dist') return; // le tout premier lancer n'est pas annoncé
    // plusieurs records d'un coup : ils s'affichent l'un après l'autre
    const att = Math.max(0, (record.suite || 0) - T());
    record.suite = T() + att + 2;
    setTimeout(() => (annonce('🏆 Nouveau record !', `${REC[k].t} : ${REC[k].u(R[k])}`), bruit('voeu')), att * 1000);
  };
  majRec();
  o.querySelector('.mysl-rec-b').onclick = () => (majRec(), recEl.classList.toggle('on'));
  recEl.onclick = () => recEl.classList.remove('on');

  // --- le chat de la cheminée : de temps en temps, il traverse le toit, saute sur la cheminée et s'assoit sur l'ouverture
  // (elle est bouchée !), puis repart. Un fichier qui le touche rebondit sur lui, et il file.
  const CHAT = { e: 0, t: T() + 16 + Math.random() * 10, x: 0, y: -9, z: 0, vx: 0, sens: 1, vite: 1, ph: 0 };
  const chatSuite = (e, vite = 1) => Object.assign(CHAT, { e, t0: T(), vite });
  const chatFile = () => {
    if (CHAT.e != 'assis' && CHAT.e != 'arrive') return;
    bruit('chat');
    chatSuite('part', 1.8);
    tip.textContent = 'Mraaou ! 🐱 Le chat bouchait la cheminée.';
  };
  const chatMaj = dt => {
    if (!CHAT.e) {
      if (T() > CHAT.t && !fin && !RP) (chatSuite('arrive'), (CHAT.sens = Math.random() < 0.5 ? 1 : -1));
      return;
    }
    const s = CHAT.sens,
      k = (T() - CHAT.t0) * CHAT.vite,
      L = (a, b, u) => a + (b - a) * u,
      lisse = u => u * u * (3 - 2 * u),
      px = CHAT.x,
      pz = CHAT.z,
      // trajet : il arrive d'un côté le long du faîtage, passe derrière la cheminée, saute dessus, puis repart de l'autre côté
      A = [-4.8 * s, 7.9],
      B = [-0.8 * s, CZ + 0.62],
      Cc = [0.8 * s, CZ + 0.62],
      D = [5 * s, 7.9],
      saute = (a, b, ya, yb, u) => {
        CHAT.x = L(a[0], b[0], u);
        CHAT.z = L(a[1], b[1], u);
        CHAT.y = L(ya, yb, u) + Math.sin(u * Math.PI) * 0.45;
        CHAT.anim = 'saut';
      };
    if (CHAT.e == 'arrive') {
      if (k < 2.6) {
        const u = k / 2.6;
        CHAT.x = L(A[0], B[0], u);
        CHAT.z = L(A[1], B[1], u);
        CHAT.y = 0;
        CHAT.anim = 'marche';
      } else if (k < 3.1) saute(B, [0, CZ], 0, TOP, lisse((k - 2.6) / 0.5));
      else {
        chatSuite('assis');
        CHAT.x = 0;
        CHAT.z = CZ;
        CHAT.y = TOP;
        bruit('chat');
        if (!tip.textContent) tip.textContent = '🐱 Un chat s’est assis sur la cheminée… attends qu’il parte !';
      }
    } else if (CHAT.e == 'assis') {
      CHAT.anim = 'assis';
      if (k > 7) {
        if (tip.textContent.startsWith('🐱')) tip.textContent = '';
        chatSuite('part');
      }
    } else if (CHAT.e == 'part') {
      if (k < 0.5) saute([0, CZ], Cc, TOP, 0, lisse(k / 0.5));
      else if (k < 3.1) {
        const u = (k - 0.5) / 2.6;
        CHAT.x = L(Cc[0], D[0], u);
        CHAT.z = L(Cc[1], D[1], u);
        CHAT.y = 0;
        CHAT.anim = 'marche';
      } else Object.assign(CHAT, { e: 0, y: -9, t: T() + 24 + Math.random() * 16 });
    }
    CHAT.vx = (CHAT.x - px) / (dt || 1);
    CHAT.vz = (CHAT.z - pz) / (dt || 1);
    CHAT.ph += dt * 11 * CHAT.vite;
  };
  // le chat dessiné de face quand il est assis, de profil quand il marche ou saute (1 unité = 1 cm)
  const chatDessin = t => {
    const [x, y, s, d] = P(CHAT.x, CHAT.y, CHAT.z);
    if (d < 0.4) return;
    const [x2] = P(CHAT.x + CHAT.vx * 0.05, CHAT.y, CHAT.z + CHAT.vz * 0.05),
      face = x2 < x ? -1 : 1,
      k = s * 0.013, // un peu plus grand que nature, pour bien le voir de loin
      ROUX = '#e3893b',
      RAYE = '#b45f26';
    // ombre
    c.fillStyle = '#0000002a';
    c.beginPath();
    c.ellipse(x, y, 18 * k, 4 * k, 0, 0, 7);
    c.fill();
    c.save();
    c.translate(x, y);
    c.lineCap = 'round';
    if (CHAT.anim == 'assis') {
      c.scale(k, k);
      const q = Math.sin(t * 2.4);
      // la queue qui balaie
      c.strokeStyle = ROUX;
      c.lineWidth = 4.5;
      c.beginPath();
      c.moveTo(6, -3);
      c.quadraticCurveTo(22 + q * 4, -2, 20 + q * 7, -18 + q * 3);
      c.stroke();
      // corps en poire, ventre clair
      c.fillStyle = ROUX;
      c.beginPath();
      c.ellipse(0, -12, 10.5, 13, 0, 0, 7);
      c.fill();
      c.fillStyle = '#f6e2c8';
      c.beginPath();
      c.ellipse(0, -9, 5.5, 9, 0, 0, 7);
      c.fill();
      // pattes avant (il se lèche une patte de temps en temps)
      const leche = Math.sin(t * 0.9) > 0.6;
      c.fillStyle = ROUX;
      c.beginPath();
      c.ellipse(-4, -2, 3, 2.4, 0, 0, 7);
      c.fill();
      c.beginPath();
      leche ? c.ellipse(3, -24, 2.6, 3.2, 0.4, 0, 7) : c.ellipse(4, -2, 3, 2.4, 0, 0, 7);
      c.fill();
      // tête, oreilles, rayures
      c.beginPath();
      c.arc(0, -30, 8.5, 0, 7);
      c.fill();
      [-1, 1].forEach(q2 => {
        c.beginPath();
        c.moveTo(q2 * 3, -37);
        c.lineTo(q2 * 8, -42);
        c.lineTo(q2 * 8.4, -32);
        c.closePath();
        c.fill();
        c.fillStyle = '#f2a7a7';
        c.beginPath();
        c.moveTo(q2 * 4.5, -36);
        c.lineTo(q2 * 7.3, -39.6);
        c.lineTo(q2 * 7.5, -34);
        c.closePath();
        c.fill();
        c.fillStyle = ROUX;
      });
      c.strokeStyle = RAYE;
      c.lineWidth = 1.4;
      [-2.5, 0, 2.5].forEach(dx => {
        c.beginPath();
        c.moveTo(dx, -38);
        c.lineTo(dx * 0.8, -34.5);
        c.stroke();
      });
      // yeux (il cligne), nez, moustaches
      const cligne = Math.sin(t * 1.3) > 0.97 || leche;
      c.fillStyle = '#ffd84a';
      [-1, 1].forEach(q2 => {
        c.beginPath();
        cligne ? c.rect(q2 * 3.3 - 2, -31, 4, 0.8) : c.ellipse(q2 * 3.3, -31, 2, 2.3, 0, 0, 7);
        c.fill();
        if (!cligne) {
          c.fillStyle = '#1b1b1b';
          c.fillRect(q2 * 3.3 - 0.45, -32.8, 0.9, 3.6);
          c.fillStyle = '#ffd84a';
        }
      });
      c.fillStyle = '#e27a8a';
      c.beginPath();
      c.moveTo(-1.2, -27.5);
      c.lineTo(1.2, -27.5);
      c.lineTo(0, -26.2);
      c.fill();
      c.strokeStyle = '#ffffffaa';
      c.lineWidth = 0.5;
      [-1, 1].forEach(q2 =>
        [-0.6, 0.5].forEach(dy => {
          c.beginPath();
          c.moveTo(q2 * 2.5, -26.5);
          c.lineTo(q2 * 10, -27 + dy * 3);
          c.stroke();
        })
      );
    } else {
      // de profil : il trotte (pattes qui alternent) ou il saute (tout étiré)
      c.scale(k * face, k);
      const sa = CHAT.anim == 'saut',
        w = Math.sin(CHAT.ph);
      c.strokeStyle = ROUX;
      c.lineWidth = 3.4;
      [
        [10, 1],
        [6, -1],
        [-9, -1],
        [-13, 1]
      ].forEach(([px, q2]) => {
        const a = sa ? (px > 0 ? 0.9 : -0.9) : q2 * w * 0.5;
        c.beginPath();
        c.moveTo(px, -12);
        c.lineTo(px + Math.sin(a) * 11, -12 + Math.cos(a) * 11);
        c.stroke();
      });
      c.lineWidth = 4;
      c.beginPath();
      c.moveTo(-15, -15);
      c.quadraticCurveTo(-26, -20, -24 + w * 2, -32);
      c.stroke();
      c.fillStyle = ROUX;
      c.beginPath();
      c.ellipse(0, -15, 17, sa ? 6.5 : 7.5, sa ? -0.15 : 0, 0, 7);
      c.fill();
      c.strokeStyle = RAYE;
      c.lineWidth = 1.6;
      [-8, -2, 4].forEach(px => {
        c.beginPath();
        c.moveTo(px, -22);
        c.lineTo(px + 1.5, -15);
        c.stroke();
      });
      c.fillStyle = ROUX;
      c.beginPath();
      c.arc(17, -23, 7, 0, 7);
      c.fill();
      c.beginPath();
      c.moveTo(13, -28);
      c.lineTo(15, -35);
      c.lineTo(19, -29);
      c.fill();
      c.beginPath();
      c.moveTo(18, -29);
      c.lineTo(22, -34);
      c.lineTo(23, -26);
      c.fill();
      c.fillStyle = '#ffd84a';
      c.beginPath();
      c.ellipse(20, -24, 1.6, 1.9, 0, 0, 7);
      c.fill();
      c.fillStyle = '#e27a8a';
      c.beginPath();
      c.arc(23.6, -21.5, 1, 0, 7);
      c.fill();
    }
    c.restore();
  };

  // --- les pigeons : posés sur le faîtage et la gouttière, ils picorent, marchent en hochant la tête et se retournent.
  // Si le fichier, Célestine ou une boule de neige passe trop près, la bande s'envole d'un coup, tourne en cercle au-dessus
  // des toits, puis chacun revient se poser à sa place en planant (ailes ouvertes, freinage au dernier moment).
  const PIG = [
    [-5.4, RIDGE - 0.1],
    [-4.85, RIDGE - 0.1],
    [-4.3, RIDGE - 0.1],
    [3.6, RIDGE - 0.1],
    [4.25, RIDGE - 0.1],
    [-3.6, BORD + 0.1],
    [-3.05, BORD + 0.1],
    [4.4, BORD + 0.1]
  ].map(([x, z], i) => ({
    hx: x,
    hz: z,
    x,
    y: 0,
    z,
    e: 'pose',
    cap: Math.random() < 0.5 ? Math.PI / 2 : -Math.PI / 2, // le sens où il regarde (0 = vers le faîtage)
    capV: 0,
    ail: 0, // battement d'ailes
    pas: Math.random() * 6, // marche (hochement de tête)
    pic: 0, // il picore
    tilt: 0, // tangage (cabré à l'atterrissage)
    plan: 0, // ailes ouvertes en planant
    i,
    prochain: T() + 1 + Math.random() * 4
  }));
  let pigBruit = 0;
  const envol = (fx, fz, p0) => {
    // toute la bande autour de lui part ensemble, sur un même cercle
    const bande = PIG.filter(q => q.e == 'pose' && Math.hypot(q.x - p0.x, q.z - p0.z) < 2.6),
      a = Math.atan2(p0.x - fx, p0.z - fz),
      G = {
        cx: p0.x + Math.sin(a) * 4.5,
        cz: p0.z + Math.cos(a) * 4.5,
        r: 4 + Math.random() * 2,
        alt: 4 + Math.random() * 2,
        w: (Math.random() < 0.5 ? 1 : -1) * (0.55 + Math.random() * 0.2),
        t: T(),
        d: 6 + Math.random() * 3
      };
    bande.forEach((q, j) => {
      const th = Math.atan2(q.z - G.cz, q.x - G.cx);
      Object.assign(q, { e: 'decolle', t: T() + j * 0.07, G, th0: th, dec: j * 0.35, x0: q.x, y0: q.y, z0: q.z });
    });
    if (T() - pigBruit > 0.6) ((pigBruit = T()), bruit('pigeons'));
  };
  const pigeons = dt => {
    const vers = (p, cible, k) => (p.cap += Math.atan2(Math.sin(cible - p.cap), Math.cos(cible - p.cap)) * Math.min(1, dt * k));
    PIG.forEach(p => {
      const px = p.x,
        py = p.y,
        pz = p.z;
      if (p.e == 'pose' || p.e == 'marche') {
        const pres = (a, b, cc, r) => Math.hypot(a - p.x, b - p.y, cc - p.z) < r;
        if (F.vol && !F.sol && !F.in && F.al > 0 && pres(F.x, F.y, F.z, 1.5)) return envol(F.x, F.z, p);
        if (Math.hypot(C.x - p.x, C.z - p.z) < 1.3) return envol(C.x, C.z, p);
        const b = boules.find(q => pres(q.x, q.y, q.z, 1.4));
        if (b) return envol(b.x, b.z, p);
        p.ail = 0;
        p.tilt *= 0.9;
        if (p.e == 'marche') {
          // quelques pas le long du toit : la tête avance et recule à chaque pas
          const dx = p.cible - p.x;
          vers(p, dx > 0 ? Math.PI / 2 : -Math.PI / 2, 8);
          p.x += Math.sign(dx) * Math.min(Math.abs(dx), dt * 0.32);
          p.pas += dt * 13;
          if (Math.abs(dx) < 0.01) ((p.e = 'pose'), (p.prochain = T() + 1.5 + Math.random() * 4));
        } else if (T() > p.prochain) {
          // il choisit : picorer, se retourner ou faire quelques pas
          const r = Math.random();
          if (r < 0.4) p.pic = T();
          else if (r < 0.65) p.capV = p.cap + Math.PI;
          else ((p.e = 'marche'), (p.cible = p.hx + (Math.random() - 0.5) * 1.1));
          p.prochain = T() + 1.2 + Math.random() * 3.5;
        }
        if (p.capV) (vers(p, p.capV, 6), Math.abs(Math.sin((p.capV - p.cap) / 2)) < 0.02 && (p.capV = 0));
        return;
      }
      const G = p.G,
        tt = T() - p.t;
      if (p.e == 'decolle') {
        // décollage : un bond, puis des battements rapides en montant
        if (tt < 0) return;
        const u = Math.min(1, tt / 0.9),
          th = p.th0 + G.w * Math.max(0, T() - G.t),
          tx = G.cx + Math.cos(th) * G.r,
          tz = G.cz + Math.sin(th) * G.r;
        p.x = p.x0 + (tx - p.x0) * u * u;
        p.z = p.z0 + (tz - p.z0) * u * u;
        p.y = p.y0 + (G.alt + Math.sin(p.dec) * 0.5) * (1 - (1 - u) * (1 - u));
        p.ail += dt * 30;
        p.tilt = -0.5 * (1 - u);
        if (u >= 1) p.e = 'vol';
      } else if (p.e == 'vol') {
        // la ronde au-dessus des toits : battements, puis ailes ouvertes en plané, et ainsi de suite
        const th = p.th0 + G.w * (T() - G.t),
          tx = G.cx + Math.cos(th) * G.r,
          tz = G.cz + Math.sin(th) * G.r,
          ty = G.alt + Math.sin(p.dec + T() * 1.3) * 0.4,
          k = Math.min(1, dt * 3);
        p.x += (tx - p.x) * k;
        p.y += (ty - p.y) * k;
        p.z += (tz - p.z) * k;
        p.plan = Math.sin(T() * 1.1 + p.dec * 3) > 0.35 ? Math.min(1, p.plan + dt * 3) : Math.max(0, p.plan - dt * 3);
        p.ail += dt * 24 * (1 - p.plan);
        p.tilt *= 0.9;
        if (T() - G.t > G.d + p.dec) Object.assign(p, { e: 'atterrit', t: T(), x0: p.x, y0: p.y, z0: p.z });
      } else if (p.e == 'atterrit') {
        // retour en plané (une courbe qui descend), puis freinage, cabré, ailes qui battent fort, et il se pose
        const u = Math.min(1, tt / 2.6),
          e = u * u * (3 - 2 * u),
          mx = (p.x0 + p.hx) / 2,
          mz = (p.z0 + p.hz) / 2,
          L = (a, b, cc) => (1 - e) * (1 - e) * a + 2 * (1 - e) * e * b + e * e * cc;
        p.x = L(p.x0, mx, p.hx);
        p.z = L(p.z0, mz, p.hz);
        p.y = L(p.y0, p.y0 * 0.55 + 0.8, 0);
        const fin2 = u > 0.78;
        p.plan = fin2 ? 0 : 1;
        p.ail += dt * (fin2 ? 34 : 0);
        p.tilt = fin2 ? -0.7 : 0.12;
        if (u >= 1) Object.assign(p, { e: 'pose', y: 0, x: p.hx, z: p.hz, tilt: 0, plan: 0, prochain: T() + 2 + Math.random() * 3 });
      }
      // en vol, il regarde là où il va
      const vx = p.x - px,
        vz = p.z - pz;
      if (Math.hypot(vx, vz) > 1e-4) vers(p, Math.atan2(vx, vz), 8);
      p.vy = (p.y - py) / (dt || 1);
    });
  };
  // un pigeon posé, vu de profil, de face ou de dos selon l'angle de la caméra (1 unité = 1 cm environ)
  const pigeonDessin = p => {
    if (p.e != 'pose' && p.e != 'marche') return pigeonVol(p);
    const [x, y, s, d] = P(p.x, p.y, p.z);
    if (d < 0.3) return;
    const [x2] = P(p.x + Math.sin(p.cap) * 0.3, p.y, p.z + Math.cos(p.cap) * 0.3),
      cote = Math.max(-1, Math.min(1, (x2 - x) / (s * 0.3))), // > 0 : il regarde vers la droite de l'écran
      face = Math.sin(p.cap) * (V.x - p.x) + Math.cos(p.cap) * (V.z - p.z) > 0, // il nous regarde
      k = s * 0.011,
      tt = T();
    const GRIS = '#9ba3b4',
      GRIS2 = '#7f889b',
      BARRE = '#353a46';
    c.fillStyle = '#1e283c33';
    c.beginPath();
    c.ellipse(x, y, 9 * k, 2.2 * k, 0, 0, 7);
    c.fill();
    c.save();
    c.translate(x, y);
    c.scale(k, k);
    c.lineCap = 'round';
    c.lineJoin = 'round';
    const corpsDegrade = (y0, y1) => {
      const g = c.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, '#8a93a7');
      g.addColorStop(1, '#c2c8d4');
      return g;
    };
    const oeil = (ex, ey) => {
      c.fillStyle = '#ff8a24';
      c.beginPath();
      c.arc(ex, ey, 0.95, 0, 7);
      c.fill();
      c.fillStyle = '#111';
      c.beginPath();
      c.arc(ex, ey, 0.45, 0, 7);
      c.fill();
    };
    const irise = (cx, cy, rx, ry) => {
      const g = c.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry);
      g.addColorStop(0, '#4fa27e');
      g.addColorStop(0.55, '#6d7fa8');
      g.addColorStop(1, '#9a5fa6');
      c.fillStyle = g;
      c.globalAlpha = 0.85;
      c.beginPath();
      c.ellipse(cx, cy, rx, ry, 0, 0, 7);
      c.fill();
      c.globalAlpha = 1;
    };
    if (Math.abs(cote) > 0.45) {
      // ---- de profil (il regarde vers +x) ----
      c.scale(Math.sign(cote) * Math.max(0.6, Math.abs(cote)), 1);
      const marche = p.e == 'marche',
        pk = p.pic && tt - p.pic < 0.9 ? Math.sin(((tt - p.pic) / 0.9) * Math.PI) : 0,
        bob = marche ? Math.sin(p.pas) * 1.6 : 0, // la tête avance et recule à chaque pas
        hx = 8.6 + bob + pk * 3.5,
        hy = -17.5 + pk * 11;
      // pattes roses
      c.strokeStyle = '#e48b8b';
      c.lineWidth = 1.2;
      const pa = marche ? Math.sin(p.pas) * 1.8 : 0;
      [
        [-0.5 + pa, 0],
        [2.5 - pa, 0]
      ].forEach(([fx]) => {
        c.beginPath();
        c.moveTo(fx * 0.6, -4);
        c.lineTo(fx, 0);
        c.lineTo(fx + 2.2, 0.2);
        c.stroke();
      });
      // queue
      c.fillStyle = GRIS2;
      c.beginPath();
      c.moveTo(-7, -10.5);
      c.lineTo(-18.5, -8.2);
      c.lineTo(-18.5, -5.8);
      c.lineTo(-7, -6.5);
      c.fill();
      c.fillStyle = BARRE;
      c.beginPath();
      c.moveTo(-15.5, -8.7);
      c.lineTo(-18.5, -8.2);
      c.lineTo(-18.5, -5.8);
      c.lineTo(-15.5, -6.1);
      c.fill();
      // corps dodu : dos, poitrail bombé, ventre
      c.fillStyle = corpsDegrade(-15, -3);
      c.beginPath();
      c.moveTo(-9, -10.5);
      c.bezierCurveTo(-4, -15, 3, -15.5, 6.5, -13.5);
      c.bezierCurveTo(10.5, -11, 9.5, -4.5, 3.5, -3.6);
      c.bezierCurveTo(-2, -3, -6.5, -5.5, -9, -8);
      c.closePath();
      c.fill();
      // aile repliée avec ses deux barres noires
      c.fillStyle = GRIS;
      c.beginPath();
      c.moveTo(4, -12.5);
      c.bezierCurveTo(0, -14, -7, -12.5, -13, -9.5);
      c.bezierCurveTo(-7, -7.5, -1, -7.5, 4, -9);
      c.closePath();
      c.fill();
      c.strokeStyle = BARRE;
      c.lineWidth = 1.1;
      [-2.5, -5.5].forEach(bx => {
        c.beginPath();
        c.moveTo(bx, -12.6);
        c.lineTo(bx - 1.6, -8.6);
        c.stroke();
      });
      // cou irisé, puis tête
      c.strokeStyle = GRIS2;
      c.lineWidth = 5.5;
      c.beginPath();
      c.moveTo(5.5, -12.5);
      c.lineTo(hx - 0.8, hy + 1.5);
      c.stroke();
      irise((5.5 + hx) / 2, (-12.5 + hy) / 2 + 1, 3.4, 3.6);
      c.fillStyle = GRIS2;
      c.beginPath();
      c.arc(hx, hy, 3.3, 0, 7);
      c.fill();
      c.fillStyle = '#2d2d2d';
      c.beginPath();
      c.moveTo(hx + 2.7, hy - 0.3);
      c.lineTo(hx + 5.4, hy + 0.6);
      c.lineTo(hx + 2.7, hy + 1.1);
      c.fill();
      c.fillStyle = '#eef0f4';
      c.beginPath();
      c.ellipse(hx + 2.8, hy - 0.5, 0.9, 0.55, 0, 0, 7);
      c.fill();
      oeil(hx + 1, hy - 0.8);
    } else {
      // ---- de face ou de dos ----
      const pk = p.pic && tt - p.pic < 0.9 ? Math.sin(((tt - p.pic) / 0.9) * Math.PI) : 0;
      c.strokeStyle = '#e48b8b';
      c.lineWidth = 1.2;
      [-2, 2].forEach(fx => {
        c.beginPath();
        c.moveTo(fx, -4);
        c.lineTo(fx, 0);
        c.stroke();
      });
      if (!face) {
        c.fillStyle = GRIS2;
        c.beginPath();
        c.moveTo(-2.6, -7);
        c.lineTo(-3.4, -1.5);
        c.lineTo(3.4, -1.5);
        c.lineTo(2.6, -7);
        c.fill();
        c.fillStyle = BARRE;
        c.fillRect(-3.4, -3, 6.8, 1.5);
      }
      c.fillStyle = corpsDegrade(-16, -3);
      c.beginPath();
      c.ellipse(0, -9.5, 6.6, 7.2, 0, 0, 7);
      c.fill();
      // ailes repliées sur les côtés (avec leurs barres, vues de dos)
      c.fillStyle = GRIS;
      [-1, 1].forEach(q => {
        c.beginPath();
        c.ellipse(q * 4.6, -9.5, 2.6, 5.5, q * 0.15, 0, 7);
        c.fill();
      });
      if (!face) {
        c.strokeStyle = BARRE;
        c.lineWidth = 1;
        [-1, 1].forEach(q =>
          [-10, -7.5].forEach(by => {
            c.beginPath();
            c.moveTo(q * 3, by);
            c.lineTo(q * 6, by + 0.8);
            c.stroke();
          })
        );
      }
      const hy = -18 + pk * 7;
      irise(0, -15 + pk * 3, 4.6, 2.6);
      c.fillStyle = GRIS2;
      c.beginPath();
      c.arc(0, hy, 3.4, 0, 7);
      c.fill();
      if (face) {
        oeil(-1.7, hy - 0.6);
        oeil(1.7, hy - 0.6);
        c.fillStyle = '#eef0f4';
        c.beginPath();
        c.ellipse(0, hy + 0.9, 0.9, 0.5, 0, 0, 7);
        c.fill();
        c.fillStyle = '#2d2d2d';
        c.beginPath();
        c.moveTo(-0.7, hy + 1.3);
        c.lineTo(0.7, hy + 1.3);
        c.lineTo(0, hy + 3);
        c.fill();
      }
    }
    c.restore();
  };

  // un pigeon en vol, en vraie 3D : chaque point (corps, tête, queue, bouts des ailes) est placé autour de lui selon son cap,
  // son tangage et le battement des ailes, puis projeté. Il est donc juste sous tous les angles (dessous, dessus, de face…)
  const pigeonVol = p => {
    const [bx, by, s, d] = P(p.x, p.y, p.z);
    if (d < 0.3) return;
    const t = p.tilt,
      fx = Math.sin(p.cap) * Math.cos(t),
      fy = -Math.sin(t),
      fz = Math.cos(p.cap) * Math.cos(t),
      rx = Math.cos(p.cap),
      rz = -Math.sin(p.cap),
      pt = (a, b, h) => P(p.x + fx * a + rx * b, p.y + fy * a + h, p.z + fz * a + rz * b),
      aile = p.plan ? 0.12 + Math.sin(T() * 3 + p.i) * 0.05 : Math.sin(p.ail), // -1 (en bas) … 1 (en haut)
      w = aile * 0.95,
      versNous = q => rx * q * (V.x - p.x) + rz * q * (V.z - p.z) > 0, // cette aile est de notre côté
      chemin = pts => {
        c.beginPath();
        pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.closePath();
      };
    const aileDessin = q => {
      const cw = Math.cos(w),
        sw = Math.sin(w),
        A = (a, e) => pt(a, q * e * cw, e * sw + 0.02),
        plumes = [];
      for (let f = 0; f <= 4; f++) plumes.push(A(-0.07 - f * 0.012 - (f % 2) * 0.012, 0.32 - f * 0.035));
      chemin([pt(0.04, q * 0.03, 0.02), A(0.06, 0.15), A(0.02, 0.28), A(-0.04, 0.33), ...plumes, A(-0.1, 0.12), pt(-0.07, q * 0.04, 0.01)]);
      c.fillStyle = versNous(q) ? '#9ea6b7' : '#7c8497';
      c.fill();
      // bouts des ailes plus sombres, et les deux barres noires
      chemin([A(-0.04, 0.33), A(0.02, 0.28), A(-0.02, 0.24), A(-0.09, 0.24)]);
      c.fillStyle = '#4a505e';
      c.fill();
      c.strokeStyle = '#353a46';
      c.lineWidth = Math.max(0.8, s * 0.006);
      c.beginPath();
      const [x1, y1] = A(-0.01, 0.08),
        [x2, y2] = A(-0.05, 0.16);
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    };
    const proche = versNous(1) ? 1 : -1;
    aileDessin(-proche); // l'aile du fond d'abord
    // queue en éventail, bout noir
    chemin([pt(-0.1, 0.025, 0), pt(-0.21, 0.06, -0.005), pt(-0.22, -0.06, -0.005), pt(-0.1, -0.025, 0)]);
    c.fillStyle = '#7f889b';
    c.fill();
    chemin([pt(-0.19, 0.055, -0.004), pt(-0.22, 0.06, -0.005), pt(-0.22, -0.06, -0.005), pt(-0.19, -0.055, -0.004)]);
    c.fillStyle = '#353a46';
    c.fill();
    // pattes repliées vers l'avant à l'atterrissage
    if (p.e == 'atterrit' && t < -0.3) {
      c.strokeStyle = '#e48b8b';
      c.lineWidth = Math.max(1, s * 0.008);
      [-1, 1].forEach(q => {
        const [ax, ay] = pt(0, q * 0.02, -0.035),
          [bx2, by2] = pt(0.06, q * 0.025, -0.1);
        c.beginPath();
        c.moveTo(ax, ay);
        c.lineTo(bx2, by2);
        c.stroke();
      });
    }
    // le corps : un fuseau allongé dans le sens du vol (jamais plus mince que sa vraie épaisseur)
    const [hx, hy] = pt(0.12, 0, 0.01),
      [qx, qy] = pt(-0.11, 0, 0),
      L = Math.max(Math.hypot(hx - qx, hy - qy) / 2, s * 0.05),
      g = c.createLinearGradient(bx, by - s * 0.05, bx, by + s * 0.05);
    g.addColorStop(0, '#8a93a7');
    g.addColorStop(1, '#c2c8d4');
    c.fillStyle = g;
    c.beginPath();
    c.ellipse((hx + qx) / 2, (hy + qy) / 2, L, s * 0.048, Math.atan2(hy - qy, hx - qx), 0, 7);
    c.fill();
    // cou irisé et tête
    const [nx, ny] = pt(0.1, 0, 0.02),
      gi = c.createRadialGradient(nx, ny, 0, nx, ny, s * 0.035);
    gi.addColorStop(0, '#4fa27e');
    gi.addColorStop(0.6, '#7d6fab');
    gi.addColorStop(1, '#7f889b00');
    c.fillStyle = gi;
    c.beginPath();
    c.arc(nx, ny, s * 0.035, 0, 7);
    c.fill();
    const [tx, ty, , td] = pt(0.15, 0, 0.035),
      [kx, ky] = pt(0.2, 0, 0.03);
    c.strokeStyle = '#2d2d2d';
    c.lineWidth = Math.max(1, s * 0.012);
    c.beginPath();
    c.moveTo(tx, ty);
    c.lineTo(kx, ky);
    c.stroke();
    c.fillStyle = '#7f889b';
    c.beginPath();
    c.arc(tx, ty, s * 0.032, 0, 7);
    c.fill();
    // l'œil orange, du côté qu'on voit
    if (td > 0.3) {
      const [ex, ey] = pt(0.16, proche * 0.022, 0.045);
      c.fillStyle = '#ff8a24';
      c.beginPath();
      c.arc(ex, ey, Math.max(0.8, s * 0.008), 0, 7);
      c.fill();
    }
    aileDessin(proche);
  };
  // --- le replay du tir gagnant, façon retransmission sportive. Un volet balaie l'écran, puis l'action est rejouée en
  // trois plans, avec un ralenti qui varie (plus lent au lâcher et à l'arrivée) :
  // 1. Célestine qui arme et lâche le fichier, en contre-plongée, de trois quarts face ;
  // 2. le fichier en vol, suivi de près par une caméra qui le poursuit (traînée lumineuse, bandeau « Célestine ») ;
  // 3. gros plan au ras de la cheminée quand il tombe dedans : flash, secousse, gerbe d'étincelles.
  // Puis un volet de sortie, et la fête reprend (fete). Célestine et le fichier sont rejoués d'après l'enregistrement HIST.
  const HIST = [];
  let RP = null,
    tLache = 0;
  const hist = () => {
    if (RP || fin) return;
    HIST.push({
      t: T(),
      f: [F.x, F.y, F.z, F.a, F.al],
      c: [C.x, C.y, C.z, C.phi, C.charge ? 1 : 0, T() - C.tir, T() - (C.pose || -9)],
      tient: C.tient
    });
    while (HIST.length && T() - HIST[0].t > 3) HIST.shift();
  };
  // le tir gagnant vient d'entrer : on prépare le replay (sinon, la fête tout de suite)
  const replayPrepare = dist => {
    const tE = T(),
      lanceur = F.moi && tLache && tE - tLache < 2.6,
      t0 = Math.max(HIST.length ? HIST[0].t : tE, lanceur ? tLache - 0.65 : tE - 1.8),
      h = HIST.filter(q => q.t >= t0);
    if (h.length < 8) return fete();
    h.push({ ...h[h.length - 1], t: tE, f: [0, TOP - 0.25, CZ, F.a, 1], tient: 0 });
    RP = { h, tE, tL: lanceur ? tLache : 0, tau: h[0].t, t0: tE + 0.35, etat: 'attente', plan: 0, dist, sauve: { x: C.x, y: C.y, z: C.z, phi: C.phi } };
    F.vol = 0;
  };
  const DEBUT3 = 0.38; // le plan sur la cheminée commence 0,38 s (enregistrées) avant l'arrivée
  const vitesse = tau => (tau > RP.tE - DEBUT3 ? 0.17 : RP.tL && Math.abs(tau - RP.tL) < 0.2 ? 0.2 : RP.tL && tau < RP.tL ? 0.42 : 0.5);
  const etatA = tau => {
    const h = RP.h;
    let i = 0;
    while (i < h.length - 2 && h[i + 1].t < tau) i++;
    const a = h[i],
      b = h[i + 1],
      u = Math.max(0, Math.min(1, (tau - a.t) / (b.t - a.t || 1))),
      m = (p, q) => p.map((v, j) => v + (q[j] - v) * u);
    return { f: m(a.f, b.f), c: u < 0.5 ? a.c : b.c, cp: m(a.c.slice(0, 4), b.c.slice(0, 4)), tient: a.tient };
  };
  const planA = tau => (tau > RP.tE - DEBUT3 ? 3 : RP.tL && tau < RP.tL + 0.25 ? 1 : 2);
  const visee = (cx, cy, cz, tx, ty, tz) => {
    const dh = Math.hypot(tx - cx, tz - cz) || 1e-3;
    return { x: cx, z: cz, yaw: Math.atan2(tx - cx, tz - cz), h: cy - CAM, p: Math.atan2(cy - ty, dh) };
  };
  const camPlan = (pl, e, k) => {
    const [fx, fy, fz] = e.f;
    if (pl == 1) {
      // contre-plongée de trois quarts face, qui se rapproche doucement
      const [cx, cy, cz, phi] = e.cp,
        a = phi + 0.95,
        dd = 2.35 - 0.4 * k;
      return visee(cx + Math.sin(a) * dd, 0.95, cz + Math.cos(a) * dd, cx, cy + 1.35, cz);
    }
    // sens du vol (d'après l'enregistrement juste avant)
    const av = etatA(Math.max(RP.h[0].t, RP.tau - 0.12)).f,
      dx0 = fx - av[0],
      dz0 = fz - av[2],
      n0 = Math.hypot(dx0, dz0),
      dx = n0 > 0.02 ? dx0 / n0 : -fx / (Math.hypot(fx, CZ - fz) || 1),
      dz = n0 > 0.02 ? dz0 / n0 : (CZ - fz) / (Math.hypot(fx, CZ - fz) || 1);
    if (pl == 2) {
      // caméra de poursuite : derrière le fichier, un peu sur le côté et au-dessus, elle regarde un peu devant lui
      const cx = fx - dx * 1.7 + dz * 0.7,
        cz = fz - dz * 1.7 - dx * 0.7;
      return visee(cx, Math.max(0.6, fy + 0.35), cz, fx + dx * 0.5, fy, fz + dz * 0.5);
    }
    // au ras de la cheminée, de côté par rapport à l'arrivée du fichier, qui se rapproche
    const a = Math.atan2(dx, dz) + (RP.cote || (RP.cote = Math.random() < 0.5 ? 1.75 : -1.75)),
      r = 1.45 - 0.3 * k;
    return visee(Math.sin(a) * r, TOP + 0.3, CZ + Math.cos(a) * r, (fx + 0) / 2, Math.max(TOP - 0.05, (fy + TOP) / 2), (fz + CZ) / 2);
  };
  // le choc de l'arrivée : flash, étincelles dorées, bouffée de fumée
  const impact = () => {
    bruit('entre');
    const [x, y] = P(0, TOP, CZ);
    for (let i = 0; i < 60; i++)
      eclats.push({ x, y, vx: (Math.random() - 0.5) * 520, vy: -120 - Math.random() * 380, t: 1, c: ['#ffd76a', '#fff3b0', '#ff9a3c', '#ffffff'][i % 4] });
    for (let i = 0; i < 14; i++)
      fumees.push({ x: (Math.random() - 0.5) * 0.4, y: TOP + 0.1, z: CZ, r: 0.08 + Math.random() * 0.08, a: 0.8, v: 0.8 + Math.random() });
  };
  const replay = dt => {
    const R = RP;
    if (!R) return null;
    const now = T();
    if (R.etat == 'attente') {
      if (now < R.t0) return null;
      Object.assign(R, { etat: 'volet', tv: now });
      bruit('replay');
      o.classList.add('replay');
    }
    if (R.etat == 'volet') {
      if (now - R.tv < 0.22) return null; // le volet couvre l'écran : on coupe au milieu
      R.etat = 'joue';
    }
    if (R.etat == 'joue') {
      R.tau = Math.min(R.tE, R.tau + dt * vitesse(R.tau));
      if (R.tau >= R.tE) (Object.assign(R, { etat: 'impact', ti: now }), impact());
    }
    if (R.etat == 'impact' && now - R.ti > 1) (Object.assign(R, { etat: 'sortie', ts: now }), bruit('replay'));
    if (R.etat == 'sortie' && now - R.ts > 0.22) {
      // fin du replay : tout reprend sa place, puis la fête
      RP = null;
      R.fini = now;
      volet.dernier = R;
      Object.assign(C, R.sauve, { tient: 0, charge: 0, tir: -9, pose: -9 });
      Object.assign(F, { in: 1, vol: 1, x: 0, y: TOP - 0.3, z: CZ, vx: 0, vy: -1, vz: 0, al: 1 });
      fete();
      return null;
    }
    // Célestine et le fichier, tels qu'ils étaient à cet instant
    const e = etatA(R.tau),
      [, , , , ch, ta, pa] = e.c;
    // l'âge du tir et de l'atterrissage enregistrés : la pose de lancer est rejouée telle quelle
    Object.assign(C, { x: e.cp[0], y: e.cp[1], z: e.cp[2], phi: e.cp[3], charge: ch, tir: now - ta, pose: now - pa, tient: 0, ange: 0, emote: null });
    const [fx, fy, fz, fa] = e.f;
    Object.assign(F, { x: fx, y: fy, z: fz, a: fa, al: 1, in: fy < TOP && Math.abs(fx) < OX && Math.abs(fz - CZ) < OZ ? 1 : 0 });
    // la caméra du plan en cours (coupe franche à chaque changement de plan)
    const pl = planA(R.tau);
    if (pl != R.plan) Object.assign(R, { plan: pl, cut: now, debutPlan: R.tau, cam: null });
    const finPlan = pl == 1 ? (R.tL || R.tau) + 0.25 : pl == 2 ? R.tE - DEBUT3 : R.tE,
      k = Math.max(0, Math.min(1, (R.tau - R.debutPlan) / Math.max(0.05, finPlan - R.debutPlan))),
      cible = camPlan(pl, e, k);
    if (!R.cam) R.cam = cible;
    else {
      const q = Math.min(1, dt * (pl == 2 ? 7 : 4)),
        ang = (a, b) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * q;
      R.cam = { x: R.cam.x + (cible.x - R.cam.x) * q, z: R.cam.z + (cible.z - R.cam.z) * q, h: R.cam.h + (cible.h - R.cam.h) * q, yaw: ang(R.cam.yaw, cible.yaw), p: ang(R.cam.p, cible.p) };
    }
    return R.cam;
  };
  // les volets d'entrée et de sortie : trois bandes en biais (rose, or, nuit) qui balaient l'écran
  const volet = u => {
    if (u <= 0 || u >= 1) return;
    const sk = H * 0.45,
      L = W + sk * 2;
    [
      ['#ff6fa3', 0],
      ['#ffd76a', 0.08],
      ['#0b1430', 0.16]
    ].forEach(([col, dl]) => {
      const v = Math.max(0, Math.min(1, (u - dl) / (1 - 0.16))),
        x0 = -L + v * (L * 2 + W * 0.2),
        w = W * 0.55;
      c.fillStyle = col;
      c.beginPath();
      c.moveTo(x0, H);
      c.lineTo(x0 + sk, 0);
      c.lineTo(x0 + sk + w, 0);
      c.lineTo(x0 + w, H);
      c.closePath();
      c.fill();
    });
    if (u > 0.3 && u < 0.7) {
      c.fillStyle = '#ffffff';
      c.font = `italic 900 ${Math.round(Math.min(W, H) * 0.09)}px Georgia,serif`;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('REPLAY', W / 2, H / 2);
    }
  };
  // l'habillage du replay : bandes noires, vignette, traînée derrière le fichier, logo « REPLAY », bandeau, flashs
  const habillage = t => {
    const R = RP || volet.dernier,
      now = T();
    if (!R) return;
    if (R.fini) {
      // le volet de sortie finit de passer, par-dessus la fête
      volet(0.5 + (now - R.fini) / 0.45);
      if (now - R.fini > 0.25) volet.dernier = null;
      return;
    }
    if (R.etat == 'attente') return;
    const dedans = R.etat != 'volet';
    if (dedans) {
      // vignette sombre sur les bords
      const vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      vg.addColorStop(0, '#00000000');
      vg.addColorStop(1, '#000000a0');
      c.fillStyle = vg;
      c.fillRect(0, 0, W, H);
      // traînée lumineuse derrière le fichier en vol
      const e = etatA(R.tau);
      if (!e.tient && R.plan > 1) {
        const pts = [];
        for (let i = 0; i <= 12; i++) {
          const q = etatA(Math.max(R.h[0].t, R.tau - 0.28 * (i / 12)));
          if (q.tient) break;
          const [x, y, , d] = P(q.f[0], q.f[1], q.f[2]);
          if (d > 0.2) pts.push([x, y]);
        }
        for (let i = 1; i < pts.length; i++) {
          const k = 1 - i / pts.length;
          c.strokeStyle = `rgba(255,${200 + Math.round(40 * k)},${220},${0.65 * k})`;
          c.lineWidth = 2 + 10 * k;
          c.lineCap = 'round';
          c.beginPath();
          c.moveTo(pts[i - 1][0], pts[i - 1][1]);
          c.lineTo(pts[i][0], pts[i][1]);
          c.stroke();
        }
      }
      // flash blanc à chaque coupe, et grand flash à l'arrivée
      const fl = Math.max(R.cut ? 0.5 * Math.max(0, 1 - (now - R.cut) / 0.12) : 0, R.ti ? 0.85 * Math.max(0, 1 - (now - R.ti) / 0.35) : 0);
      if (fl > 0) {
        c.fillStyle = `rgba(255,252,240,${fl})`;
        c.fillRect(0, 0, W, H);
      }
      // bandes noires
      const b = H * 0.085;
      c.fillStyle = '#05070f';
      c.fillRect(0, 0, W, b);
      c.fillRect(0, H - b, W, b);
      // logo « REPLAY » en haut à gauche, et la vitesse du ralenti
      c.textBaseline = 'middle';
      c.textAlign = 'left';
      c.font = '900 14px system-ui,sans-serif';
      const lx = 18,
        ly = b / 2;
      c.fillStyle = '#e0234e';
      c.beginPath();
      c.roundRect ? c.roundRect(lx, ly - 13, 104, 26, 6) : c.rect(lx, ly - 13, 104, 26);
      c.fill();
      c.fillStyle = '#ffffff';
      c.fillText('⏪ REPLAY', lx + 10, ly + 1);
      c.fillStyle = Math.sin(t * 7) > 0 ? '#ffffff' : '#ffffff55';
      c.beginPath();
      c.arc(lx + 118, ly, 4.5, 0, 7);
      c.fill();
      c.fillStyle = '#ffd76a';
      c.font = '800 13px system-ui,sans-serif';
      c.fillText(R.etat == 'impact' ? 'LIVRÉ !' : `RALENTI ×${String(vitesse(R.tau).toFixed(2)).replace('.', ',')}`, lx + 132, ly + 1);
      // bandeau « Célestine » pendant le vol (il glisse depuis la gauche)
      if (R.plan == 2 || R.plan == 3) {
        const u = Math.min(1, (now - (R.bandeauT || (R.bandeauT = now))) / 0.35),
          ez = 1 - (1 - u) * (1 - u),
          bx = -260 + ez * 278,
          by = H - b - 62;
        c.fillStyle = '#0b1430e6';
        c.fillRect(bx, by, 250, 46);
        c.fillStyle = '#ff6fa3';
        c.fillRect(bx, by, 6, 46);
        c.fillStyle = '#ffffff';
        c.font = '900 16px system-ui,sans-serif';
        c.fillText('CÉLESTINE', bx + 16, by + 15);
        c.fillStyle = '#ffd76a';
        c.font = '700 13px system-ui,sans-serif';
        c.fillText(R.dist ? `Livraison spéciale · ${R.dist.toFixed(1).replace('.', ',')} m` : 'Livraison spéciale', bx + 16, by + 33);
      }
    }
    if (R.tv && now - R.tv < 0.45) volet((now - R.tv) / 0.45);
    if (R.ts) volet((now - R.ts) / 0.45);
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
  /* ---- la ville en bas de l'immeuble (en vraie 3D) : on la voit pendant une chute ----
     Notre immeuble fait l'angle : devant lui une rue (le long de la gouttière), à gauche une autre rue,
     à droite la ruelle et l'immeuble de Valentin. En face : des immeubles avec leurs fenêtres, des réverbères,
     des voitures garées sous la neige. Les coordonnées sont en mètres, le toit est à y = 0, la rue à SOL. */
  const VILLE = (() => {
    const B = [],
      cols = ['#4b5a92', '#5a4f8c', '#3f5c86', '#665890', '#45658f', '#55608f', '#4a4f80'],
      hauts = [1.6, -0.8, 2.8, 0.4, 3.4, -1.4, 1.1, 2.2, -0.2, 3, 0.8, -1, 2.4, 1.8];
    let i = 0,
      x = -40;
    // en face, de l'autre côté de la rue de devant
    for (const w of [6, 5, 7, 5.5, 6.5, 6, 5, 7.5, 6, 5.5, 6.5, 7]) {
      B.push({ x0: x, x1: x + w - 0.05, z0: -16, z1: -9, top: hauts[i % 14], col: cols[i % 7], id: i });
      x += w;
      i++;
    }
    // en face, de l'autre côté de la rue de gauche
    let z = -9;
    for (const w of [6, 7, 5.5, 6.5, 6, 7]) {
      B.push({ x0: -26, x1: -18, z0: z, z1: z + w - 0.05, top: hauts[(i * 3) % 14], col: cols[i % 7], id: i });
      z += w;
      i++;
    }
    // à droite de l'immeuble de Valentin, dans l'alignement
    B.push({ x0: 19.05, x1: 26, z0: 0.6, z1: 9, top: 1.2, col: cols[2], id: i++ });
    B.push({ x0: 26.05, x1: 34, z0: 0.6, z1: 9, top: -0.9, col: cols[5], id: i++ });
    // des voitures garées, couvertes de neige (le long de la rue de devant, puis de la rue de gauche)
    const V0 = [];
    [
      [-14, -2.4, 0, '#b8323e'],
      [3.5, -2.4, 0, '#2f5d9c'],
      [16, -2.4, 0, '#e8e2d6'],
      [-5, -6.2, 0, '#3d7a56'],
      [11, -6.2, 0, '#7a3e8e'],
      [-11.9, 5, 1, '#c9a23a'],
      [-15.3, 14, 1, '#b8323e']
    ].forEach(([cx, cz, long, col]) => V0.push({ cx, cz, long, col }));
    // les réverbères
    const L0 = [];
    for (let xx = -32; xx <= 32; xx += 8) L0.push([xx, -1.2], [xx + 4, -8.3]);
    for (let zz = -4; zz <= 24; zz += 8) L0.push([-10.5, zz], [-17.3, zz + 4]);
    return { B, V0, L0 };
  })();
  // une boîte (immeuble, voiture) : on ne dessine que les faces tournées vers la caméra
  const boite = (b, fen) => {
    const { x0, x1, z0, z1, top } = b,
      bas = b.bas != null ? b.bas : SOL,
      faces = [
        [x0, z0, x1, z0, V.z < z0, 0.86],
        [x1, z1, x0, z1, V.z > z1, 0.86],
        [x0, z1, x0, z0, V.x < x0, 0.7],
        [x1, z0, x1, z1, V.x > x1, 0.7]
      ],
      teinte = (col, k) => {
        const h = [1, 3, 5].map(j => parseInt(col.slice(j, j + 2), 16) * k);
        return `rgb(${h.map(v => Math.round(Math.min(255, v))).join(',')})`;
      };
    faces.forEach(([ax, az, bx, bz, vu, k]) => {
      if (!vu) return;
      if (
        poly([
          [ax, top, az],
          [bx, top, bz],
          [bx, bas, bz],
          [ax, bas, az]
        ])
      ) {
        c.fillStyle = teinte(b.col, k);
        c.fill();
      }
      if (!fen) return;
      // les fenêtres (allumées ou non, toujours les mêmes) et la vitrine du rez-de-chaussée
      const Lg = Math.hypot(bx - ax, bz - az),
        ux = (bx - ax) / Lg,
        uz = (bz - az) / Lg,
        n = Math.max(1, Math.floor(Lg / 1.6)),
        nx = uz,
        nz = -ux,
        dec = 0.02;
      for (let r = 0; top - 1 - r * 1.55 > bas + 3; r++) {
        const yc = top - 1 - r * 1.55;
        for (let j = 0; j < n; j++) {
          const m = ((j + 0.5) / n) * Lg,
            cx = ax + ux * m + nx * dec,
            cz = az + uz * m + nz * dec,
            allume = (b.id * 13 + r * 7 + j * 11) % 9 < 4;
          if (
            poly([
              [cx - ux * 0.34, yc + 0.45, cz - uz * 0.34],
              [cx + ux * 0.34, yc + 0.45, cz + uz * 0.34],
              [cx + ux * 0.34, yc - 0.45, cz + uz * 0.34],
              [cx - ux * 0.34, yc - 0.45, cz - uz * 0.34]
            ])
          ) {
            c.fillStyle = allume ? ((b.id + r + j) % 3 ? '#ffd27a' : '#ffbf6a') : '#283260';
            c.fill();
          }
        }
      }
      if (b.id % 3 != 1)
        if (
          poly([
            [ax + ux * 0.6 + nx * dec, bas + 2.3, az + uz * 0.6 + nz * dec],
            [bx - ux * 0.6 + nx * dec, bas + 2.3, bz - uz * 0.6 + nz * dec],
            [bx - ux * 0.6 + nx * dec, bas + 0.5, bz - uz * 0.6 + nz * dec],
            [ax + ux * 0.6 + nx * dec, bas + 0.5, az + uz * 0.6 + nz * dec]
          ])
        ) {
          c.fillStyle = b.id % 2 ? '#ffe2a8' : '#f7c98a'; // vitrine éclairée
          c.fill();
        }
    });
    // le dessus, enneigé (si on le voit d'en haut)
    if (CAM + V.h > top)
      if (
        poly([
          [x0, top, z0],
          [x1, top, z0],
          [x1, top, z1],
          [x0, top, z1]
        ])
      ) {
        c.fillStyle = '#eaf0fa';
        c.fill();
      }
  };
  const villeBas = t => {
    const K = C.chute;
    c.save();
    c.globalAlpha = Math.min(1, (T() - K.t - 0.9) / 0.4);
    // le sol : neige, chaussées (avec les traces des pneus) et trottoirs
    const sol = (pts, col) => {
      if (poly(pts.map(([x, z]) => [x, SOL, z]))) {
        c.fillStyle = col;
        c.fill();
      }
    };
    sol(
      [
        [-60, -60],
        [60, -60],
        [60, 60],
        [-60, 60]
      ],
      '#d7dff0'
    );
    sol(
      [
        [-60, -1.6],
        [60, -1.6],
        [60, -7.2],
        [-60, -7.2]
      ],
      '#9ba7c5'
    );
    sol(
      [
        [-11.6, -60],
        [-15.8, -60],
        [-15.8, 60],
        [-11.6, 60]
      ],
      '#9ba7c5'
    );
    [-2.6, -3.4, -5.4, -6.2].forEach(zz =>
      sol(
        [
          [-60, zz],
          [60, zz],
          [60, zz - 0.25],
          [-60, zz - 0.25]
        ],
        '#8793b3'
      )
    );
    [
      [-60, 0.6, 60, -1.45],
      [-60, -7.35, 60, -9]
    ].forEach(([a, z0, b, z1]) =>
      sol(
        [
          [a, z0],
          [b, z0],
          [b, z1],
          [a, z1]
        ],
        '#eef2fb'
      )
    );
    // l'empreinte de sa chute dans la neige
    if (K.impact) {
      const { x, z } = K.impact,
        k = Math.min(1, (T() - K.sol) * 4);
      if (poly(Array.from({ length: 18 }, (_, j) => [x + Math.cos(j / 2.865) * 1.1 * k, SOL + 0.01, z + Math.sin(j / 2.865) * 0.7 * k]))) {
        c.fillStyle = '#b7c3de';
        c.fill();
      }
    }
    // immeubles, voitures et réverbères, du plus loin au plus proche
    const L = [];
    VILLE.B.forEach(b => L.push([Math.hypot((b.x0 + b.x1) / 2 - V.x, (b.z0 + b.z1) / 2 - V.z) + 6, () => boite(b, true)]));
    VILLE.V0.forEach(v => {
      const lx = v.long ? 0.85 : 1.9,
        lz = v.long ? 1.9 : 0.85,
        cab = v.long ? [0.75, 0.9] : [0.9, 0.75];
      L.push([
        Math.hypot(v.cx - V.x, v.cz - V.z),
        () => {
          boite({ x0: v.cx - lx, x1: v.cx + lx, z0: v.cz - lz, z1: v.cz + lz, bas: SOL + 0.2, top: SOL + 0.95, col: v.col, id: 0 }, false);
          boite(
            {
              x0: v.cx - cab[0],
              x1: v.cx + cab[0],
              z0: v.cz - cab[1],
              z1: v.cz + cab[1],
              bas: SOL + 0.95,
              top: SOL + 1.5,
              col: '#2a3150',
              id: 0
            },
            false
          );
          // la neige sur le toit de la voiture
          if (
            poly([
              [v.cx - cab[0] - 0.05, SOL + 1.56, v.cz - cab[1] - 0.05],
              [v.cx + cab[0] + 0.05, SOL + 1.56, v.cz - cab[1] - 0.05],
              [v.cx + cab[0] + 0.05, SOL + 1.56, v.cz + cab[1] + 0.05],
              [v.cx - cab[0] - 0.05, SOL + 1.56, v.cz + cab[1] + 0.05]
            ])
          ) {
            c.fillStyle = '#f4f7fd';
            c.fill();
          }
        }
      ]);
    });
    VILLE.L0.forEach(([lx, lz]) =>
      L.push([
        Math.hypot(lx - V.x, lz - V.z),
        () => {
          const A = P(lx, SOL, lz),
            Bp = P(lx, SOL + 4.3, lz);
          if (A[3] < 0.3 || Bp[3] < 0.3) return;
          c.strokeStyle = '#1d2440';
          c.lineWidth = Math.max(1, A[2] * 0.12);
          c.beginPath();
          c.moveTo(A[0], A[1]);
          c.lineTo(Bp[0], Bp[1]);
          c.stroke();
          const r = Bp[2] * 1.6,
            g = c.createRadialGradient(Bp[0], Bp[1], 0, Bp[0], Bp[1], r);
          g.addColorStop(0, 'rgba(255,236,180,0.95)');
          g.addColorStop(0.25, 'rgba(255,210,130,0.45)');
          g.addColorStop(1, 'rgba(255,210,130,0)');
          c.fillStyle = g;
          c.beginPath();
          c.arc(Bp[0], Bp[1], r, 0, 7);
          c.fill();
        }
      ])
    );
    L.sort((p, q) => q[0] - p[0]).forEach(e => e[1]());
    c.restore();
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
  /* ===================== la neige au sol : le rendu des deux toits ===================== */
  // La lune est à un cap fixe du panorama (dessinée à 80 % de la largeur dans ciel) : la lumière vient de là.
  // Elle donne le reflet clair sur la neige, le côté éclairé des congères et des traces, et le sens des ombres portées.
  const luneCap = () => (W * 0.3) / f;
  const alea = (i, k = 1) => {
    const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const rvb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(','); // '#ff5a5f' → '255,90,95'
  // les congères (grandes bosses douces) et les paillettes (cristaux qui scintillent selon l'angle) de chaque toit
  const DERIVES = [],
    PAILLETTES = [],
    GLACONS = [];
  const semer = (x0, x1, z0, z1, nD, nP, v) => {
    for (let i = 0; i < nD; i++)
      DERIVES.push({
        v,
        x: x0 + 0.6 + alea(i, 1 + v) * (x1 - x0 - 1.2),
        z: z0 + 0.5 + alea(i, 2 + v) * (z1 - z0 - 1),
        rx: 0.6 + alea(i, 3 + v) * 1.4,
        rz: 0.3 + alea(i, 4 + v) * 0.6,
        a: alea(i, 5 + v) * 3.14
      });
    for (let i = 0; i < nP; i++) PAILLETTES.push({ v, x: x0 + alea(i, 6 + v) * (x1 - x0), z: z0 + alea(i, 7 + v) * (z1 - z0), p: alea(i, 8 + v) * 60 });
  };
  semer(-9, 9, BORD, RIDGE, 26, 360, 0);
  semer(VOISIN.x0, VOISIN.x1, VOISIN.z0, VOISIN.z1, 10, 140, 1);
  // les stalactites de glace sous les bords qui donnent sur le vide (x, z : le point du bord ; [nx, nz] : vers l'extérieur)
  const bordsGlace = [
    [-9, BORD, 9, BORD, 0, -1, 0],
    [-9, BORD, -9, RIDGE, -1, 0, 0],
    [9, BORD, 9, RIDGE, 1, 0, 0],
    [VOISIN.x0, VOISIN.z0, VOISIN.x1, VOISIN.z0, 0, -1, VOISIN.h],
    [VOISIN.x0, VOISIN.z0, VOISIN.x0, VOISIN.z1, -1, 0, VOISIN.h]
  ];
  bordsGlace.forEach(([x1, z1, x2, z2, nx, nz, h], b) => {
    const L = Math.hypot(x2 - x1, z2 - z1);
    for (let s = 0.15, i = 0; s < L - 0.1; s += 0.17 + alea(i, 30 + b) * 0.12, i++) {
      if (alea(i, 40 + b) < 0.28) continue;
      const u = s / L;
      GLACONS.push({ b, x: x1 + (x2 - x1) * u + nx * 0.07, z: z1 + (z2 - z1) * u + nz * 0.07, h, L: 0.05 + Math.pow(alea(i, 50 + b), 2) * 0.34, w: 0.02 + alea(i, 60 + b) * 0.025, nx, nz });
    }
  });
  // la direction de la lumière à l'écran, sur le sol (recalculée à chaque image, pour le relief des traces)
  const LUM = [0.6, -0.3];
  const lumiereEcran = () => {
    const A = luneCap(),
      [x1, y1, , d1] = P(C.x, 0, C.z),
      [x2, y2, , d2] = P(C.x + Math.sin(A), 0, C.z + Math.cos(A)),
      n = Math.hypot(x2 - x1, y2 - y1);
    if (d1 > 0.3 && d2 > 0.3 && n > 1) ((LUM[0] = (x2 - x1) / n), (LUM[1] = (y2 - y1) / n));
  };
  // un halo rond (dégradé de rayon 1, centré sur 0) d'une couleur donnée : créé une seule fois, puis réutilisé à chaque image
  // en le déplaçant et en l'étirant (bien plus rapide que de recréer un dégradé pour chaque lumière)
  const HALOS = {};
  const halo = (rvb, milieu = 0.45) => {
    const k = rvb + milieu;
    if (!HALOS[k]) {
      const g = c.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, `rgba(${rvb},1)`);
      g.addColorStop(0.45, `rgba(${rvb},${milieu})`);
      g.addColorStop(1, `rgba(${rvb},0)`);
      HALOS[k] = g;
    }
    return HALOS[k];
  };
  const haloEn = (x, y, rx, ry, rvb, al, milieu) => {
    c.save();
    c.globalAlpha = Math.max(0, Math.min(1, al));
    c.translate(x, y);
    c.scale(rx, ry);
    c.fillStyle = halo(rvb, milieu);
    c.fillRect(-1, -1, 2, 2);
    c.restore();
  };
  // une flaque de lumière posée sur la neige (feu de la cheminée, ampoules) : un halo aplati par la perspective
  const flaque = (x, h, z, R, rvb, al) => {
    const [px, py, s, d] = P(x, h, z);
    if (d < 0.3 || px < -s * R || px > W + s * R) return;
    const [, py2, , d2] = P(x, h, z + R),
      rx = s * R,
      ry = d2 > 0.3 ? Math.max(2, Math.abs(py2 - py)) : rx * 0.3;
    haloEn(px, py, rx, ry, rvb, al);
  };
  // une ellipse posée au sol, orientée (pour les congères et les ombres)
  const ellipseSol = (x, h, z, ra, rb, a, n = 16) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * 6.283,
        u = Math.cos(t) * ra,
        w = Math.sin(t) * rb;
      return [x + u * Math.cos(a) - w * Math.sin(a), h, z + u * Math.sin(a) + w * Math.cos(a)];
    });
  // le sol enneigé d'un toit (v = 0 : le nôtre, 1 : celui de Valentin)
  const neigeSol = (x0, x1, z0, z1, h, v, t) => {
    if (
      !poly([
        [x0, h, z0],
        [x1, h, z0],
        [x1, h, z1],
        [x0, h, z1]
      ])
    )
      return;
    c.save();
    c.clip();
    // 1. le fond : bleuté et voilé au loin, d'un blanc presque chaud tout près
    const g = c.createLinearGradient(0, hy, 0, H);
    g.addColorStop(0, '#9aadd8');
    g.addColorStop(0.16, '#bfcdec');
    g.addColorStop(0.5, '#e2e9f8');
    g.addColorStop(1, '#fbfcff');
    c.fillStyle = g;
    c.fillRect(0, hy - 2, W, H - hy + 2); // le sol est toujours sous l'horizon
    const A = luneCap(),
      lx = Math.sin(A),
      lz = Math.cos(A);
    // 2. le reflet de la lune : une grande traînée claire sur la neige, dans sa direction
    const [mx, my, , md] = P(V.x + lx * 9, h, V.z + lz * 9);
    if (md > 0.5) {
      const r = W * 0.5;
      c.save();
      c.translate(mx, my);
      c.scale(1, 0.3);
      const gm = c.createRadialGradient(0, 0, 0, 0, 0, r);
      gm.addColorStop(0, 'rgba(255,248,228,0.6)');
      gm.addColorStop(0.35, 'rgba(240,244,255,0.25)');
      gm.addColorStop(1, 'rgba(240,244,255,0)');
      c.fillStyle = gm;
      c.fillRect(-r, -r, 2 * r, 2 * r);
      c.restore();
    }
    // 3. les congères : de grandes bosses douces, claires côté lune, ombrées bleu de l'autre côté
    DERIVES.forEach(dv => {
      if (dv.v != v) return;
      const [ax, ay, , ad] = P(dv.x + lx * dv.rx * 0.7, h, dv.z + lz * dv.rx * 0.7),
        [bx, by, , bd] = P(dv.x - lx * dv.rx * 0.7, h, dv.z - lz * dv.rx * 0.7);
      if (ad < 0.4 || bd < 0.4 || !poly(ellipseSol(dv.x, h, dv.z, dv.rx, dv.rz, dv.a))) return;
      const gd = c.createLinearGradient(ax, ay, bx, by);
      gd.addColorStop(0, 'rgba(255,255,255,0.6)');
      gd.addColorStop(0.45, 'rgba(255,255,255,0.08)');
      gd.addColorStop(1, 'rgba(112,134,196,0.22)');
      c.fillStyle = gd;
      c.fill();
    });
    // 4. les tuiles sous la neige : des rangées de petites bosses en écailles (un trait d'ombre, et un trait de lumière juste
    // au-dessus pour les rangées proches). Toutes les rangées sont tracées d'un coup (deux traits en tout, pour la vitesse).
    const rangees = proche => {
      c.beginPath();
      for (let z = z0 + 0.32; z < z1 - 0.1; z += 0.38) {
        const dz = Math.abs(z - V.z);
        if (dz < 1.2 || dz > (proche ? 9 : 15)) continue;
        let on = 0;
        for (let x = x0; x <= x1 + 0.01; x += 0.24) {
          const [px, py, , d] = P(x, h + 0.016 * Math.abs(Math.sin((x * Math.PI) / 0.32)), z);
          if (d < 0.3) {
            on = 0;
            continue;
          }
          on ? c.lineTo(px, py) : c.moveTo(px, py);
          on = 1;
        }
      }
    };
    rangees(false);
    c.strokeStyle = 'rgba(126,146,196,0.2)';
    c.lineWidth = 1.2;
    c.stroke();
    c.save();
    c.translate(0, -1.2);
    rangees(true);
    c.strokeStyle = 'rgba(255,255,255,0.45)';
    c.lineWidth = 1;
    c.stroke();
    c.restore();
    // 5. les ombres portées des objets, du côté opposé à la lune (deux couches pour des bords doux)
    const ombreP = (ox, oz, r, hh) => {
      const L = 0.25 + hh * 0.85,
        a = Math.atan2(-lz, -lx);
      [
        [1.25, 0.1],
        [0.9, 0.14]
      ].forEach(([k, al]) => {
        if (poly(ellipseSol(ox - lx * L * 0.5, h, oz - lz * L * 0.5, (L * 0.5 + r) * k, r * k, a))) {
          c.fillStyle = `rgba(82,100,165,${al})`;
          c.fill();
        }
      });
    };
    if (v == 0) {
      ombreP(0, CZ, CX, TOP);
      OBS.forEach(ob => ombreP(ob.x, ob.z, ob.r, ob.h));
    } else ombreP(VOISIN.cx, VOISIN.cz, VOISIN.ce, VOISIN.ch);
    // 6. les lumières chaudes : le feu de la cheminée qui vacille, et chaque ampoule de la guirlande sur le faîtage
    if (v == 0) {
      flaque(0, h, CZ - CD - 0.2, 2, '255,150,70', 0.2 + 0.05 * Math.sin(t * 9) + 0.03 * Math.sin(t * 23));
      for (let x = -8.6, i = 0; x <= 8.6; x += 0.45, i++) {
        const k = Math.round(x / 0.45);
        if (Math.sin(t * 2.5 + k) > -0.4) flaque(x, h, RIDGE - 0.12, 0.42, rvb(COUL[(k + 50) % 5]), 0.3);
      }
    }
    // 7. les paillettes : de minuscules cristaux qui s'allument quand on bouge ou qu'on tourne la vue
    const tw = t * 1.6 + V.yaw * 11 + V.x * 1.7 + V.z * 1.3;
    c.fillStyle = '#ffffff';
    PAILLETTES.forEach(pp => {
      if (pp.v != v) return;
      const k = Math.sin(tw + pp.p);
      if (k < 0.8) return;
      const [px, py, s, d] = P(pp.x, h, pp.z);
      if (d < 0.4 || d > 16) return;
      const r = Math.max(1, s * 0.014) * ((k - 0.8) / 0.2) * 2.4;
      c.globalAlpha = 0.95;
      c.fillRect(px - r, py - 0.5, r * 2, 1);
      c.fillRect(px - 0.5, py - r * 0.8, 1, r * 1.6);
      c.globalAlpha = 0.5;
      c.fillRect(px - 1, py - 1, 2, 2);
    });
    c.globalAlpha = 1;
    c.restore();
  };
  // le bord d'un toit : un bourrelet de neige arrondi qui déborde un peu, et des stalactites de glace en dessous
  const corniche = (x1, z1, x2, z2, nx, nz, h, b) => {
    const vers = nx * (V.x - x1) + nz * (V.z - z1) > 0, // on voit la face extérieure
      o = 0.07;
    // le dessus (une bande claire)
    if (
      poly([
        [x1, h, z1],
        [x2, h, z2],
        [x2 + nx * o, h + 0.07, z2 + nz * o],
        [x1 + nx * o, h + 0.07, z1 + nz * o]
      ])
    ) {
      c.fillStyle = '#f7f9fe';
      c.fill();
    }
    if (vers) {
      // la face qui déborde : blanche en haut, bleutée dessous (elle est arrondie)
      const [ax, ay] = P((x1 + x2) / 2 + nx * o, h + 0.08, (z1 + z2) / 2 + nz * o),
        [bx, by] = P((x1 + x2) / 2 + nx * o, h - 0.07, (z1 + z2) / 2 + nz * o);
      if (
        poly([
          [x1 + nx * o, h + 0.08, z1 + nz * o],
          [x2 + nx * o, h + 0.08, z2 + nz * o],
          [x2 + nx * o, h - 0.07, z2 + nz * o],
          [x1 + nx * o, h - 0.07, z1 + nz * o]
        ])
      ) {
        const g = c.createLinearGradient(ax, ay, bx, by);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(0.55, '#dfe7f7');
        g.addColorStop(1, '#9fb0d8');
        c.fillStyle = g;
        c.fill();
      }
      // les stalactites
      GLACONS.forEach(q => {
        if (q.b != b) return;
        const tx = -nz,
          tz = nx,
          [p1x, p1y, s, d] = P(q.x - tx * q.w, q.h - 0.06, q.z - tz * q.w),
          [p2x, p2y] = P(q.x + tx * q.w, q.h - 0.06, q.z + tz * q.w),
          [p3x, p3y] = P(q.x, q.h - 0.06 - q.L, q.z);
        if (d < 0.3 || d > 20 || p1x < -20 || p1x > W + 20) return;
        const g = c.createLinearGradient(p1x, p1y, p3x, p3y);
        g.addColorStop(0, 'rgba(240,248,255,0.95)');
        g.addColorStop(0.6, 'rgba(196,226,255,0.7)');
        g.addColorStop(1, 'rgba(170,215,255,0.1)');
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(p1x, p1y);
        c.lineTo(p2x, p2y);
        c.lineTo(p3x, p3y);
        c.closePath();
        c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.8)';
        c.lineWidth = Math.max(0.6, s * 0.006);
        c.beginPath();
        c.moveTo(p1x * 0.65 + p2x * 0.35, p1y * 0.65 + p2y * 0.35);
        c.lineTo(p3x, p3y);
        c.stroke();
      });
    }
  };
  // la neige d'un toit et tous ses bords enneigés
  const neigeToit = (x0, x1, z0, z1, h, v, bords) => {
    const t = T();
    neigeSol(x0, x1, z0, z1, h, v, t);
    bords.forEach(([a, b, cc, d, nx, nz, i]) => corniche(a, b, cc, d, nx, nz, h, i));
  };

  /* ===================== les traces dans la neige ===================== */
  // un creux dans la neige : fond bleuté, ombre intérieure du côté de la lumière, liseré clair sur le bord d'en face
  const creux = (trace, al, fond) => {
    trace();
    c.fillStyle = fond || `rgba(104,124,182,${al * 0.45})`;
    c.fill();
    c.save();
    trace();
    c.clip();
    c.translate(-LUM[0] * 2.2, -LUM[1] * 2.2);
    trace();
    c.lineWidth = 4;
    c.strokeStyle = `rgba(58,76,140,${al * 0.5})`;
    c.stroke();
    c.restore();
    c.save();
    c.translate(-LUM[0] * 1.1, -LUM[1] * 1.1);
    trace();
    c.lineWidth = 1.3;
    c.strokeStyle = `rgba(255,255,255,${al * 0.9})`;
    c.stroke();
    c.restore();
  };
  // un chemin fait de plusieurs formes au sol (points [x, y, z]), projetées ; null si une forme passe derrière la caméra
  const chemin = formes => {
    const pr = formes.map(f => f.map(([x, y, z]) => P(x, y, z)));
    if (pr.some(f => f.some(p => p[3] < 0.25))) return null;
    return () => {
      c.beginPath();
      pr.forEach(f => {
        f.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
        c.closePath();
      });
    };
  };
  // un éventail (ce qu'un bras ou les jambes balaient), au sol : centre (cu, cv), rayon R, angles a0 → a1 (repère u/v)
  // (r0 : rayon intérieur, pour que l'éventail parte en douceur près de l'épaule ou des hanches, sans pointe)
  const eventail = (pt, cu, cv, R, a0, a1, cote = 1, r0 = 0) => {
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const a = a0 + ((a1 - a0) * i) / 14,
        rr = R * (0.97 + 0.03 * Math.sin(i * 1.7)); // un bord pas tout à fait régulier, comme dans la vraie neige
      pts.push(pt(cu + Math.cos(a) * rr, cv + Math.sin(a) * rr * cote));
    }
    for (let i = 14; i >= 0; i -= 2) {
      const a = a0 + ((a1 - a0) * i) / 14;
      pts.push(pt(cu + Math.cos(a) * r0, cv + Math.sin(a) * r0 * cote));
    }
    return pts;
  };
  const empreintes = () => {
    const now = T();
    lumiereEcran();
    // les vieilles empreintes de pas disparaissent (l'ange, le sillon et le cratère restent)
    for (let i = traces.length - 1; i >= 0; i--) if (!traces[i].ange && !traces[i].sillon && !traces[i].cratere && now - traces[i].t > 24) traces.splice(i, 1);
    traces.forEach(q => {
      const age = now - q.t,
        [, , , dq] = P(q.x, 0, q.z);
      if (dq < 0.3 || dq > 22) return;
      if (q.ange) {
        // l'ange : deux ailes balayées par les bras (avec les stries du balayage), la robe des jambes, le corps et la tête
        const [ax, az] = q.ange,
          px = -az,
          pz = ax,
          pt = (u, w) => [q.x + ax * u + px * w, 0.012, q.z + az * u + pz * w],
          ailes = [1, -1].map(s => eventail(pt, 0.55, 0.16 * s, 0.72, 0.35, 2.75, s, 0.14)),
          robe = eventail(pt, 0.05, 0, 1, Math.PI - 0.62, Math.PI + 0.62, 1, 0.2),
          corps = Array.from({ length: 16 }, (_, i) => pt(0.32 + Math.cos((i / 16) * 6.283) * 0.4, Math.sin((i / 16) * 6.283) * 0.2)),
          tete = Array.from({ length: 14 }, (_, i) => pt(0.98 + Math.cos((i / 14) * 6.283) * 0.14, Math.sin((i / 14) * 6.283) * 0.13)),
          tr = chemin([...ailes, robe, corps, tete]);
        if (!tr) return;
        const [cx, cy, s] = P(...pt(0.3, 0)),
          g = c.createRadialGradient(cx, cy, 0, cx, cy, s * 1.2);
        g.addColorStop(0, 'rgba(92,114,178,0.5)');
        g.addColorStop(1, 'rgba(150,170,218,0.3)');
        creux(tr, 0.85, g);
        // les stries laissées par les bras et les jambes
        c.lineWidth = 1;
        const arc = (cu, cv, R, a0, a1, s2) => {
          const pts = [];
          for (let i = 0; i <= 14; i++) {
            const a = a0 + ((a1 - a0) * i) / 14;
            pts.push(pt(cu + Math.cos(a) * R, cv + Math.sin(a) * R * s2));
          }
          const pr = pts.map(q2 => P(...q2));
          if (pr.some(q2 => q2[3] < 0.25)) return;
          c.beginPath();
          pr.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
          c.stroke();
        };
        c.save();
        tr();
        c.clip();
        [1, -1].forEach(s2 =>
          [0.42, 0.54, 0.64].forEach(R => {
            c.strokeStyle = 'rgba(255,255,255,0.4)';
            arc(0.55, 0.16 * s2, R, 0.45, 2.65, s2);
          })
        );
        [0.7, 0.85].forEach(R => {
          c.strokeStyle = 'rgba(255,255,255,0.35)';
          arc(0.05, 0, R, Math.PI - 0.55, Math.PI + 0.55, 1);
        });
        c.restore();
        return;
      }
      if (q.cratere) {
        // le cratère : un bourrelet de neige soulevé tout autour, des mottes, et un creux profond au milieu
        const rebord = chemin([ellipseSol(q.x, 0.015, q.z, 0.78, 0.6, 0.3, 22)]),
          trou = chemin([ellipseSol(q.x, 0.012, q.z, 0.6, 0.45, 0.3, 22)]);
        if (!rebord || !trou) return;
        rebord();
        c.fillStyle = 'rgba(255,255,255,0.85)';
        c.fill();
        c.strokeStyle = 'rgba(140,160,210,0.35)';
        c.lineWidth = 1.5;
        c.stroke();
        creux(trou, 1, 'rgba(98,118,178,0.42)');
        for (let i = 0; i < 7; i++) {
          const a = alea(i, 70) * 6.283,
            [mx, my, s] = P(q.x + Math.cos(a) * 0.95, 0.04, q.z + Math.sin(a) * 0.75);
          c.fillStyle = '#ffffff';
          c.beginPath();
          c.ellipse(mx, my, s * 0.05, s * 0.03, 0, 0, 7);
          c.fill();
          c.fillStyle = 'rgba(140,160,210,0.4)';
          c.beginPath();
          c.ellipse(mx, my + s * 0.012, s * 0.05, s * 0.018, 0, 0, Math.PI);
          c.fill();
        }
        return;
      }
      if (q.sillon) {
        // le sillon de la glissade : une longue rigole aux bouts arrondis, la neige repoussée sur les côtés
        const [ax, az] = q.sillon,
          px = -az,
          pz = ax,
          L = Math.hypot(q.x2 - q.x, q.z2 - q.z),
          mx = (q.x + q.x2) / 2,
          mz = (q.z + q.z2) / 2,
          capsule = (w, y) => {
            const pts = [];
            // les deux bouts arrondis, et des bords un peu irréguliers le long de la rigole
            for (let i = 0; i <= 8; i++) {
              const a = -Math.PI / 2 + (Math.PI * i) / 8;
              pts.push([mx + ax * (L / 2 + Math.cos(a) * w) + px * Math.sin(a) * w, y, mz + az * (L / 2 + Math.cos(a) * w) + pz * Math.sin(a) * w]);
            }
            for (let u = L / 2 - 0.15; u > -L / 2; u -= 0.15) {
              const ww = -w * (1 + 0.1 * Math.sin(u * 13 + w * 40));
              pts.push([mx + ax * u + px * ww, y, mz + az * u + pz * ww]);
            }
            for (let i = 0; i <= 8; i++) {
              const a = Math.PI / 2 + (Math.PI * i) / 8;
              pts.push([mx + ax * (-L / 2 + Math.cos(a) * w) + px * Math.sin(a) * w, y, mz + az * (-L / 2 + Math.cos(a) * w) + pz * Math.sin(a) * w]);
            }
            for (let u = -L / 2 + 0.15; u < L / 2; u += 0.15) {
              const ww = w * (1 + 0.1 * Math.sin(u * 11 + w * 30));
              pts.push([mx + ax * u + px * ww, y, mz + az * u + pz * ww]);
            }
            return pts;
          },
          bord = chemin([capsule(0.3, 0.016)]),
          rig = chemin([capsule(0.22, 0.012)]);
        if (!bord || !rig) return;
        bord();
        c.fillStyle = 'rgba(255,255,255,0.6)';
        c.fill();
        creux(rig, 0.8, 'rgba(104,124,182,0.3)');
        return;
      }
      // une empreinte de botte (semelle + talon) ou la trace allongée d'une glissade ; elle s'efface avec le temps
      const al = Math.max(0, 1 - age / 24);
      if (al <= 0) return;
      const fx = Math.sin(q.a),
        fz = Math.cos(q.a),
        forme = (cx, cz, a, b) =>
          Array.from({ length: 12 }, (_, i) => {
            const t = (i / 12) * 6.283,
              u = Math.cos(t) * a,
              w = Math.sin(t) * b;
            return [cx + fx * u + fz * w, 0.012, cz + fz * u - fx * w];
          }),
        tr = q.g ? chemin([forme(q.x, q.z, 0.3, 0.05)]) : chemin([forme(q.x + fx * 0.045, q.z + fz * 0.045, 0.085, 0.046), forme(q.x - fx * 0.085, q.z - fz * 0.085, 0.04, 0.04)]);
      if (!tr) return;
      if (q.g) {
        // la glissade : beaucoup de traces qui se chevauchent, donc juste un léger voile bleuté, sans relief
        tr();
        c.fillStyle = `rgba(112,132,188,${al * 0.09})`;
        c.fill();
        return;
      }
      creux(tr, al * 0.85);
      // les crans de la semelle, quand on est assez près pour les voir
      const [, , s] = P(q.x, 0, q.z);
      if (!q.g && s > 70) {
        c.strokeStyle = `rgba(72,92,150,${al * 0.35})`;
        c.lineWidth = 1;
        for (let k = -1; k <= 2; k++) {
          const u = 0.045 + k * 0.035,
            [x1, y1] = P(q.x + fx * u + fz * 0.03, 0.012, q.z + fz * u - fx * 0.03),
            [x2, y2] = P(q.x + fx * u - fz * 0.03, 0.012, q.z + fz * u + fx * 0.03);
          c.beginPath();
          c.moveTo(x1, y1);
          c.lineTo(x2, y2);
          c.stroke();
        }
      }
    });
  };
  const toitVoisin = (sous = false) => {
    const { x0, x1, z0, z1, h } = VOISIN;
    facade(x0, z1, x0, z0, V.x < x0); // côté ruelle, face à notre toit
    facade(x0, z0, x1, z0, V.z < z0); // côté rue
    if (sous) return; // caméra sous le niveau des toits : on ne voit que les façades
    // le pan de toit enneigé (le même rendu que le nôtre) et ses bords : la ruelle, le faîtage, la rue
    neigeToit(x0, x1, z0, z1, h, 1, [
      [x0, z0, x0, z1, -1, 0, 4],
      [x0, z1, x1, z1, 0, 1, -1],
      [x0, z0, x1, z0, 0, -1, 3]
    ]);
    // un petit conduit de cheminée en briques
    const { cx, cz, ce: e, ch: ht } = VOISIN;
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
    aura(t);
    const moi = C;
    VAL.rit = !!moi.ko; // Célestine est K.O. : la figurine 3D de Valentin rigole
    C = VAL; // on réutilise le même personnage en volume, avec la tenue de Valentin
    try {
      celestine(t, TENUE.valentin);
    } finally {
      C = moi;
    }
  };

  // l'ambiance de toute l'image : les bords assombris, comme sur une photo de nuit
  // une brume légère qui adoucit l'horizon (dessinée sur le décor et le sol, sous les personnages et les objets)
  const brume = () => {
    const b = c.createLinearGradient(0, hy - 30, 0, hy + 60);
    b.addColorStop(0, 'rgba(170,186,230,0)');
    b.addColorStop(0.45, 'rgba(170,186,230,0.16)');
    b.addColorStop(1, 'rgba(170,186,230,0)');
    c.fillStyle = b;
    c.fillRect(0, hy - 30, W, 90);
  };
  const ambiance = () => {
    const g = c.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.42, W / 2, H * 0.55, Math.hypot(W, H) * 0.62);
    g.addColorStop(0, 'rgba(6,10,30,0)');
    g.addColorStop(1, 'rgba(6,10,30,0.42)');
    c.fillStyle = g;
    c.fillRect(0, 0, W, H);
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
        const repos = F.vol && F.t > 0.3 && Math.hypot(F.vx, F.vz) < 0.03 && Math.abs(F.vy) < 0.05 && !F.tombe;
        if (repos && !F.pose) {
          F.pose = 1;
          // sur le toit de Valentin, c'est lui qui va le chercher ; renvoyé par lui et pas attrapé : pas un raté
          if (surVoisin(F.x, F.z)) F.deVal = 0;
          else if (F.deVal) ((F.deVal = 0), (tip.textContent = 'Esquivé ! 😎 Va ramasser le fichier'));
          else if (!F.noirT && !F.ko) aide(); // recraché par la cheminée ou renvoyé par Valentin : ce n’est pas un raté
        }
        if (F.tombe) {
          F.al -= dt * 3;
          if (F.al <= 0) retombe();
        }
      }
    }
    // la caméra « à la Fortnite » : derrière Célestine (d m), à hauteur d'épaule, décalée sur sa droite (ep m),
    // dans l'angle choisi au doigt (et qui se replace derrière elle quand elle avance, voir marche) ;
    // en visant, elle se rapproche de l'épaule ; pendant une chute, elle devient une caméra de cinéma
    const K = C.chute,
      dc = K ? T() - K.t : 0,
      vis3 = C.charge && !fin;
    let cible = { yaw: ctl.yaw, h: vis3 ? -1.2 : -1.0, p: vis3 ? 0.1 : 0.15, kx: 7, kh: 5, d: vis3 ? 1.65 : 2.3, ep: vis3 ? 0.55 : 0.4 };
    const rp = replay(dt), // le replay du tir gagnant prend la main sur la caméra
      KOc = C.ko && C.ko.e != 'secoue';
    if (KOc) {
      // la patate : la caméra se met de côté et la suit pendant qu'elle vole et glisse (coup de zoom à l'impact)
      const [nx, nz] = C.ko.n,
        q = C.ko.cote,
        zoom = C.ko.e == 'stop' ? 2.2 : 3.2,
        mx = C.x + nx * 0.6,
        mz = C.z + nz * 0.6,
        cx = mx - nz * q * zoom,
        cz = mz + nx * q * zoom;
      cible = { x: cx, z: cz, yaw: Math.atan2(mx - cx, mz - cz), h: -1.4 + C.y * 0.5, p: 0.1, kx: C.ko.e == 'stop' ? 12 : 5, kh: 5 };
    } else if (K && dc < 1.15) {
      // elle vacille : la caméra passe sur le côté, un peu plus bas, pour voir à la fois Célestine et le vide
      const [nx, nz] = K.n,
        q = (V.x - C.x) * -nz + (V.z - C.z) * nx >= 0 ? 1 : -1,
        cx = C.x - nz * q * 2.5 - nx * 0.7,
        cz = C.z + nx * q * 2.5 - nz * 0.7;
      cible = { x: cx, z: cz, yaw: Math.atan2(C.x + nx * 0.6 - cx, C.z + nz * 0.6 - cz), h: -0.5, p: 0.18, kx: 3.5, kh: 3.5 };
    } else if (K) {
      // elle tombe : la caméra la suit, un peu au-dessus et en arrière, et regarde vers le bas, entre les immeubles
      const [nx, nz] = K.n;
      cible = {
        x: C.x - nx * 1.8,
        z: C.z - nz * 1.8,
        yaw: Math.atan2(nx, nz),
        h: Math.max(SOL + 2.4, C.y + 2.4) - CAM,
        p: 0.62,
        kx: 6,
        kh: 9
      };
    }
    Vt.yaw = cible.yaw;
    Vt.x = cible.x != null ? cible.x : C.x - Math.sin(Vt.yaw) * cible.d + Math.cos(Vt.yaw) * cible.ep;
    Vt.z = cible.z != null ? cible.z : C.z - Math.cos(Vt.yaw) * cible.d - Math.sin(Vt.yaw) * cible.ep;
    const kc = Math.min(1, dt * cible.kx),
      kh = Math.min(1, dt * cible.kh);
    V.yaw += Math.atan2(Math.sin(Vt.yaw - V.yaw), Math.cos(Vt.yaw - V.yaw)) * Math.min(1, dt * (K || KOc ? 4 : 14));
    V.x += (Vt.x - V.x) * kc;
    V.z += (Vt.z - V.z) * kc;
    V.h += (cible.h - V.h) * kh;
    V.p += (cible.p - V.p) * kh;
    if (rp) Object.assign(V, rp);
    hy = hc - f * Math.tan(V.p);
    // la secousse au moment où elle touche le sol (ou à l'arrivée du fichier, pendant le replay)
    const sec = Math.max(
      K && K.sol ? Math.max(0, 0.4 - (T() - K.sol)) : 0,
      RP && RP.ti ? Math.max(0, 0.35 - (T() - RP.ti)) : 0,
      ...manga.map(m => Math.max(0, (m.k == 'impact' ? 0.9 : 0.7) - (T() - m.t) * 1.6)) // la patate et le crash
    );
    V.sx = sec * (Math.random() - 0.5) * 30;
    V.sy = sec * (Math.random() - 0.5) * 30;
    hist();
    if (!RP || RP.etat == 'attente') marche(dt); // pendant le replay, Célestine est rejouée (voir replay)
    valentin(dt);
    chatMaj(dt);
    pigeons(dt);
    boiteMaj();
    // la buée de la respiration, dans le froid : une petite bouffée devant la bouche toutes les 2 à 3 secondes
    [C, VAL].forEach(Q => {
      if (!Q.souffleT || T() > Q.souffleT) {
        Q.souffleT = T() + 2.2 + Math.random() * 0.9;
        if (Q.chute || (Q == C && C.ko) || CAM + V.h < 0.15) return;
        const fx = Math.sin(Q.phi),
          fz = Math.cos(Q.phi),
          b = Q == VAL ? VAL.base : C.y;
        for (let i = 0; i < 3; i++)
          fumees.push({ x: Q.x + fx * (0.16 + i * 0.03), y: b + 1.52 - i * 0.01, z: Q.z + fz * (0.16 + i * 0.03), r: 0.025 + i * 0.012, a: 0.32 - i * 0.06, v: 0.06 });
      }
    });
    // quand le vent souffle fort, de la neige poudreuse file au ras du toit
    if (CAM + V.h > 0.15 && Math.random() < dt * Math.max(0, VENT.f - 0.4) * 22) {
      const a = Math.random() * 6.283,
        r = 1 + Math.random() * 6;
      fumees.push({ x: Math.max(-8.5, Math.min(8.5, C.x + Math.cos(a) * r)), y: 0.05, z: Math.max(BORD + 0.2, Math.min(RIDGE - 0.2, C.z + Math.sin(a) * r)), r: 0.05 + Math.random() * 0.05, a: 0.9, v: 0, souffle: 1, y0: Math.random() * 6 });
    }
    // des braises s'échappent du feu de la cheminée
    if (Math.random() < dt * 2.2)
      fumees.push({ x: (Math.random() - 0.5) * 0.6, y: TOP + 0.05, z: CZ + (Math.random() - 0.5) * 0.4, r: 0.012, a: 1, v: 0.7 + Math.random() * 0.9, braise: 1 });
    // le fichier recraché fume encore un moment
    if (vis.noir && F.noirT && T() - F.noirT < 3 && Math.random() < 0.2)
      fumees.push({ x: F.x, y: F.y + 0.05, z: F.z, r: 0.03, a: 0.28, v: 0.4, noir: 1 });
    vent(dt);
    ciel(t);
    etoileFilante();
    lyon();
    voisinsDessin(t);
    neige(dt, false);
    if (C.chute && T() - C.chute.t > 0.9) villeBas(t);
    // pendant la chute, quand la caméra passe sous le niveau des toits, on ne dessine plus rien de ce qui est sur les toits
    const sous = CAM + V.h < 0.15;
    // le toit d'en face est plus loin : on le dessine d'abord, notre toit passe devant
    if (sous) (toitVoisin(true), facadesNous());
    else if (V.x < VOISIN.x0) (toitVoisin(), facadesNous(), toit());
    else (facadesNous(), toit(), toitVoisin());
    if (!sous) empreintes();
    brume();
    // tout ce qui est sur le toit, dessiné du plus loin au plus proche
    const L = sous ? [] : OBS.map(ob => [prof(ob.x, ob.z), () => obstacle(ob, t)]);
    if (!sous) {
      const tp = traineauPos(t);
      L.push([tp ? prof(tp.x, tp.z) : crash ? prof(crash.x, crash.z) : 0, () => traineau(t, dt)]);
      L.push([prof(0, CZ), () => cheminee(t, F.in && (() => (c.save(), ouverture(), c.clip(), fichier(), c.restore())))]);
    }
    if (!F.in && !C.tient && !VAL.tient && !sous)
      L.push([
        prof(F.x, F.z),
        () => {
          if (F.z <= RIDGE || V.z > RIDGE) return (ombre(), trainee(), fichier(), F.pose && !VAL.renvoi && fleche(t));
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
    if (C.ko) L.push([prof(C.x, C.z) - 0.02, () => etoilesKO(t)]);
    if (!sous) {
      L.push([prof(VAL.x, VAL.z), () => dessineValentin(t)]);
      boules.forEach(b => L.push([prof(b.x, b.z), () => dessinBoule(b)]));
      // le chat : sur la cheminée, il passe devant elle
      if (CHAT.e) L.push([prof(CHAT.x, CHAT.z) - (CHAT.y > TOP - 0.3 ? 0.05 : 0), () => chatDessin(t)]);
      PIG.forEach(p => L.push([prof(p.x, p.z), () => pigeonDessin(p)]));
    }
    L.sort((p, q) => q[0] - p[0]).forEach(e => e[1]());
    particules(dt);
    neige(dt, true);
    devant(t);
    ambiance();
    mangaFx(t);
    habillage(t);
    // fondu au noir avant de réapparaître sur le toit, puis retour de l'image
    const nr =
      C.chute && C.chute.noir ? Math.min(1, (T() - C.chute.noir) / 0.35) : C.revient ? Math.max(0, 1 - (T() - C.revient) / 0.5) : 0;
    if (nr > 0) {
      c.fillStyle = `rgba(6,10,26,${nr})`;
      c.fillRect(0, 0, W, H);
    }
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
    // sur ordinateur, comme dans Fortnite : un clic bloque la souris dans le jeu, la bouger tourne la vue (Échap la libère)
    if (e.pointerType == 'mouse' && cv.requestPointerLock) {
      if (document.pointerLockElement !== cv)
        try {
          const r = cv.requestPointerLock();
          if (r && r.catch) r.catch(() => {});
        } catch (_) {}
      return;
    }
    if (regard) return;
    regard = { id: e.pointerId, x: e.clientX };
    cv.setPointerCapture(e.pointerId);
  });
  const souris = e => document.pointerLockElement === cv && (ctl.yaw += e.movementX * 0.0042);
  document.addEventListener('mousemove', souris);
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
  btnSaut.addEventListener('pointerdown', e => (e.preventDefault(), e.stopPropagation(), sauter()));
  btnSaut.addEventListener('contextmenu', e => e.preventDefault());
  // clavier (sur ordinateur) : ZQSD / WASD (et flèches haut / bas) pour marcher, flèches gauche / droite pour tourner, espace pour sauter, E (maintenue) pour lancer
  const touches = {};
  const clavier = () => {
    const k = n => (touches[n] ? 1 : 0);
    ctl.kx = k('d') - k('q') - k('a'); // Q / D : pas de côté
    ctl.kt = k('ArrowRight') - k('ArrowLeft'); // flèches gauche / droite : tourner la vue (et elle avec)
    ctl.ky = k('ArrowDown') + k('s') - k('ArrowUp') - k('z') - k('w');
  };
  const bas = e => {
    if (e.key == ' ') {
      e.preventDefault();
      if (!e.repeat) sauter();
      return;
    }
    if (e.key == 'e' || e.key == 'E') {
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
    if (e.key == ' ') return;
    if (e.key == 'e' || e.key == 'E') return ((C.spin = (ctl.kx || ctl.kt) * 0.8), lancer());
    touches[e.key.length == 1 ? e.key.toLowerCase() : e.key] = 0;
    clavier();
  };
  addEventListener('keydown', bas);
  addEventListener('keyup', haut);
  raf = requestAnimationFrame(boucle);
}

// le fichier choisi : d'abord le lancer dans la cheminée, puis on l'ouvre
// on monte directement sur le toit, les mains vides : Célestine prend le fichier dans la boîte aux lettres (voir mysLancer)
function mysToit() {
  mysLancer(g => mysLire(g));
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
    // il ne sera plus jamais redemandé sur cet appareil (mysGate, js/menu-demarrer.js)
    try {
      localStorage.setItem('avent_mysok', '1');
    } catch (_) {}
    slog('🎁', `Ouvre le fichier mystère (${n} chansons${MDB.natif ? ', gardées par l’appli Android' : ''})`);
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
});
function mysBtn() {
  return `<label class="btn mysb" onclick="mysToit()">🎁 Ouvrir le fichier mystère de Valentin</label>`;
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
