/* ---------- Musique de fond (thèmes originaux d’enquête, synthétisés) ---------- */
const MUS = (() => {
  let A = null,
    M = null,
    iv = null,
    cur = null,
    isBg = false;
  const SONGS = {
    noir: {
      bpm: 96,
      w: 'triangle',
      n: 'A3:.75 C4:.25 E4:.5 D#4:.5 D4:1 R:.5 A3:.5 C4:.75 E4:.25 G4:.5 F4:.5 E4:2 R:.5 E4:.5 F4:.75 E4:.25 D4:.5 C4:.5 B3:1 G#3:1 A3:.75 C4:.25 E4:.5 A4:.5 G#4:1.5 R:.5 F4:.5 E4:.5 D4:.5 B3:.5 C4:.5 B3:.5 A3:2 R:1'
    },
    enquete: {
      bpm: 118,
      w: 'square',
      n: 'D4:.5 F4:.5 A4:.5 F4:.5 D4:.5 F4:.5 Bb4:.5 A4:.5 D4:.5 F4:.5 A4:.5 C5:.5 Bb4:1 A4:1 G4:.5 Bb4:.5 D5:.5 Bb4:.5 G4:.5 A4:.5 F4:.5 E4:.5 D4:.5 E4:.5 F4:.5 G4:.5 A4:1.5 R:.5 D5:.75 C5:.25 A4:.5 F4:.5 G4:.75 F4:.25 E4:.5 C#4:.5 D4:2 R:1'
    },
    lyon: {
      bpm: 84,
      w: 'sine',
      n: 'C4:1 F4:1 A4:1 G4:1.5 F4:.5 E4:1 F4:1 A4:1 C5:1 Bb4:2 A4:1 G4:1 Bb4:1 D5:1 C5:1.5 A4:.5 F4:1 G4:1 A4:1 G4:1 F4:3 R:1'
    },
    pluie: {
      bpm: 100,
      w: 'triangle',
      n: 'E5:.5 B4:.5 G4:.5 B4:.5 E5:.5 D5:.5 B4:1 C5:.5 G4:.5 E4:.5 G4:.5 C5:.5 B4:.5 A4:1 A4:.5 E4:.5 C4:.5 E4:.5 A4:.5 B4:.5 C5:.5 D5:.5 B4:2 R:.5 G4:.5 F#4:.5 E4:.5 D#4:.5 E4:2 R:1'
    },
    filature: {
      bpm: 108,
      w: 'square',
      n: 'G3:.5 R:.5 G3:.5 Bb3:.5 R:.5 D4:.5 C#4:.5 R:.5 C4:.5 R:.5 C4:.5 Eb4:.5 R:.5 G4:.5 F#4:1 R:.5 D4:.5 Eb4:.5 D4:.5 C4:.5 Bb3:.5 A3:.5 Bb3:.5 C4:.5 D4:1.5 R:.5 G3:.5 Bb3:.5 D4:.5 G4:.5 F#4:.5 D4:.5 G4:2 R:1'
    },
    coeur: {
      bpm: 92,
      w: 'sine',
      n: 'E4:1 G4:.5 C5:1.5 B4:.5 A4:.5 G4:1 E4:1 F4:.5 A4:1.5 G4:.5 F4:.5 E4:2 D4:1 E4:.5 F4:1.5 A4:.5 G4:.5 E4:1 C4:1 D4:.5 E4:.5 F4:.5 D4:.5 C4:3 R:1'
    },
    tannen: {
      bpm: 110,
      w: 'sine',
      n: 'D4:1 G4:.75 G4:.25 G4:1.5 A4:.5 B4:.75 B4:.25 B4:1.5 B4:.5 A4:.5 B4:.5 C5:1 F#4:1 A4:1 G4:2 R:1 D5:.5 D5:.5 B4:.5 E5:1.5 D5:.5 D5:.5 C5:.5 C5:1.5 C5:.5 C5:.5 A4:.5 D5:1.5 C5:.5 C5:.5 B4:.5 B4:1.5 D4:1 G4:.75 G4:.25 G4:1.5 A4:.5 B4:.75 B4:.25 B4:1.5 B4:.5 A4:.5 B4:.5 C5:1 F#4:1 A4:1 G4:3 R:1'
    },
    noel: {
      bpm: 120,
      w: 'triangle',
      n: 'E4:.5 D4:.5 C4:1.5 D4:.5 E4:.5 F4:.5 G4:2 A4:.5 B4:.5 C5:1 B4:1 A4:1 G4:2 A4:.5 B4:.5 C5:1 B4:1 A4:1 G4:1 A4:1 B4:1 C5:1 G4:1 F4:1 E4:2 E4:.5 D4:.5 C4:1.5 D4:.5 E4:.5 F4:.5 G4:2 C5:.5 B4:.5 A4:2 A4:1 G4:3 C5:1 B4:1 A4:1 G4:1 A4:1 B4:1 C5:1 G4:1 F4:1 E4:3 R:1'
    },
    anges: {
      bpm: 126,
      w: 'triangle',
      n: 'A4:1 A4:1 A4:1 C5:1 C5:1.5 Bb4:.5 A4:2 A4:1 G4:1 A4:1 C5:1 A4:1.5 G4:.5 F4:2 A4:1 A4:1 A4:1 C5:1 C5:1.5 Bb4:.5 A4:2 A4:1 G4:1 A4:1 C5:1 A4:1.5 G4:.5 F4:2 C5:1.5 D5:.5 C5:.5 Bb4:.5 A4:.5 Bb4:.5 C5:1.5 Bb4:.5 A4:.5 G4:.5 A4:.5 Bb4:.5 A4:1.5 G4:.5 F4:.5 E4:.5 F4:.5 G4:.5 F4:1 C4:1 F4:1 G4:1 A4:3 R:1'
    },
    adeste: {
      bpm: 112,
      w: 'sine',
      n: 'G4:1 G4:2 D4:1 G4:1 A4:2 D4:2 B4:1 A4:1 B4:1 C5:1 B4:2 A4:1 G4:1 G4:2 F#4:1 E4:1 F#4:1 G4:1 A4:1 B4:1 F#4:2 E4:1.5 D4:.5 D4:3 R:1'
    },
    wences: {
      bpm: 132,
      w: 'square',
      n: 'G4:1 G4:1 G4:1 A4:1 G4:1 G4:1 D4:2 E4:1 D4:1 E4:1 F#4:1 G4:2 G4:2 G4:1 G4:1 G4:1 A4:1 G4:1 G4:1 D4:2 E4:1 D4:1 E4:1 F#4:1 G4:2 G4:2 D5:1 C5:1 B4:1 A4:1 B4:1 A4:1 G4:2 E4:1 D4:1 E4:1 F#4:1 G4:2 G4:2 D4:1 D4:1 E4:1 F#4:1 G4:1 G4:1 A4:2 D5:1 C5:1 B4:1 A4:1 G4:2 C5:2 G4:3 R:1'
    },
    house: {
      bpm: 150,
      w: 'square',
      n: 'G4:1 G4:.5 A4:.5 G4:1 E4:1 C4:1 E4:1 G4:2 A4:1 A4:.5 C5:.5 A4:1 G4:1 E4:1 G4:1 D4:2 G4:1 G4:.5 A4:.5 G4:1 E4:1 C4:1 E4:1 G4:2 A4:1 G4:1 D4:1 E4:.5 D4:.5 C4:3 R:1'
    },
    jolly: {
      bpm: 140,
      w: 'triangle',
      n: 'E4:.5 E4:.5 E4:.5 E4:.5 D4:.5 D4:.5 D4:1 C4:.5 C4:.5 C4:.5 C4:.5 E4:2 G4:.5 G4:.5 G4:.5 G4:.5 F4:.5 F4:.5 F4:1 E4:.5 E4:.5 D4:.5 D4:.5 G4:2 E4:.5 E4:.5 E4:.5 E4:.5 D4:.5 D4:.5 D4:1 C4:.5 C4:.5 C4:.5 C4:.5 E4:2 G4:.5 G4:.5 G4:.5 G4:.5 F4:.5 E4:.5 D4:.5 E4:.5 C4:3 R:1'
    },
    manger: {
      bpm: 104,
      w: 'sine',
      n: 'D4:1 G4:1 G4:1 A4:.5 B4:.5 G4:1 G4:1 B4:.5 C5:.5 D5:1 D5:1 E5:1 C5:2 A4:1 B4:1 B4:1 A4:.5 G4:.5 G4:1 F#4:1 E4:.5 D4:.5 D4:2 D4:1 G4:1 G4:1 A4:.5 B4:.5 G4:1 G4:1 B4:.5 C5:.5 D5:1 E5:1 C5:1 B4:2 G4:1 A4:1 C5:1 B4:1 A4:1 B4:1 A4:1 G4:3 R:1'
    },
    ilestne: {
      bpm: 130,
      w: 'triangle',
      n: 'G4:1 G4:.5 G4:.5 E4:1 D4:1 G4:1 G4:.5 A4:.5 B4:2 G4:1 G4:.5 G4:.5 E4:1 D4:1 G4:1 G4:.5 A4:.5 B4:2 B4:1 B4:.5 C5:.5 D5:1 B4:1 C5:1 B4:.5 A4:.5 G4:2 B4:1 B4:.5 C5:.5 D5:1 B4:1 A4:1 B4:.5 A4:.5 G4:3 R:1'
    },
    elise: {
      bpm: 150,
      w: 'sine',
      n: 'E5:.5 D#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 A4:1.5 C4:.5 E4:.5 A4:.5 B4:1.5 E4:.5 G#4:.5 B4:.5 C5:1.5 E4:.5 E5:.5 D#5:.5 E5:.5 D#5:.5 E5:.5 B4:.5 D5:.5 C5:.5 A4:1.5 C4:.5 E4:.5 A4:.5 B4:1.5 E4:.5 C5:.5 B4:.5 A4:3 R:1'
    },
    canon: {
      bpm: 96,
      w: 'sine',
      n: 'F#5:1 E5:1 D5:1 C#5:1 B4:1 A4:1 B4:1 C#5:1 D5:1 C#5:1 B4:1 A4:1 G4:1 F#4:1 G4:1 E4:1 D4:.5 F#4:.5 A4:.5 G4:.5 F#4:.5 D4:.5 F#4:.5 E4:.5 D4:.5 B3:.5 D4:.5 A4:.5 G4:.5 B4:.5 A4:.5 G4:.5 F#4:.5 D4:.5 E4:.5 C#5:.5 D5:.5 F#5:.5 A5:.5 A4:.5 B4:.5 G4:.5 A4:.5 F#4:.5 D4:.5 D5:1.5 R:1'
    },
    ruisseau: {
      bpm: 116,
      w: 'triangle',
      n: 'C5:.5 B4:.5 A4:.5 G4:.5 F4:.5 E4:.5 D4:.5 C4:.5 D4:1 G4:1 E4:2 C5:.5 B4:.5 A4:.5 G4:.5 A4:.5 B4:.5 C5:.5 D5:.5 E5:2 C5:2 A4:.5 B4:.5 C5:.5 A4:.5 G4:.5 E4:.5 F4:.5 D4:.5 E4:1 C4:1 G4:2 F4:.5 E4:.5 D4:.5 C4:.5 D4:1 B3:1 C4:3 R:1'
    },
    tetris: {
      bpm: 150,
      w: 'square',
      n: 'E5:1 B4:.5 C5:.5 D5:1 C5:.5 B4:.5 A4:1 A4:.5 C5:.5 E5:1 D5:.5 C5:.5 B4:1.5 C5:.5 D5:1 E5:1 C5:1 A4:1 A4:2 R:.5 D5:1 F5:.5 A5:1 G5:.5 F5:.5 E5:1.5 C5:.5 E5:1 D5:.5 C5:.5 B4:1 B4:.5 C5:.5 D5:1 E5:1 C5:1 A4:1 A4:2'
    },
    jingle: {
      bpm: 180,
      w: 'triangle',
      n: 'E5:1 E5:1 E5:2 E5:1 E5:1 E5:2 E5:1 G5:1 C5:1.5 D5:.5 E5:4 F5:1 F5:1 F5:1.5 F5:.5 F5:1 E5:1 E5:1 E5:.5 E5:.5 E5:1 D5:1 D5:1 E5:1 D5:2 G5:2 E5:1 E5:1 E5:2 E5:1 E5:1 E5:2 E5:1 G5:1 C5:1.5 D5:.5 E5:4 F5:1 F5:1 F5:1.5 F5:.5 F5:1 E5:1 E5:1 E5:.5 E5:.5 G5:1 G5:1 F5:1 D5:1 C5:4'
    },
    wish: {
      bpm: 150,
      w: 'triangle',
      n: 'D4:1 G4:1 G4:.5 A4:.5 G4:.5 F#4:.5 E4:1 E4:1 E4:1 A4:1 A4:.5 B4:.5 A4:.5 G4:.5 F#4:1 D4:1 D4:1 B4:1 B4:.5 C5:.5 B4:.5 A4:.5 G4:1 E4:1 D4:.5 D4:.5 E4:1 A4:1 F#4:1 G4:2 R:1'
    },
    deck: {
      bpm: 140,
      w: 'triangle',
      n: 'G4:1.5 F4:.5 E4:1 D4:1 C4:1 D4:1 E4:1 C4:1 D4:.5 E4:.5 F4:.5 D4:.5 E4:1.5 D4:.5 C4:1 B3:1 C4:2 G4:1.5 F4:.5 E4:1 D4:1 C4:1 D4:1 E4:1 C4:1 D4:.5 E4:.5 F4:.5 D4:.5 E4:1.5 D4:.5 C4:1 B3:1 C4:2 D4:1.5 E4:.5 F4:1 D4:1 E4:1.5 F4:.5 G4:1 D4:1 E4:.5 F#4:.5 G4:1 A4:.5 B4:.5 C5:1 B4:1 A4:1 G4:2'
    },
    carol: {
      bpm: 170,
      w: 'triangle',
      n: 'Bb4:1 A4:.5 Bb4:.5 G4:1 Bb4:1 A4:.5 Bb4:.5 G4:1 Bb4:1 A4:.5 Bb4:.5 G4:1 Bb4:1 A4:.5 Bb4:.5 G4:1 D5:1 C5:.5 D5:.5 Bb4:1 D5:1 C5:.5 D5:.5 Bb4:1 D5:1 C5:.5 D5:.5 Bb4:1 D5:1 C5:.5 D5:.5 Bb4:1 G5:1 G5:.5 G5:.5 F5:.5 Eb5:.5 D5:1 D5:.5 D5:.5 C5:.5 Bb4:.5 C5:1 C5:.5 C5:.5 D5:.5 C5:.5 G4:1 G4:1 G4:1'
    },
    silent: {
      bpm: 96,
      w: 'sine',
      n: 'G4:1.5 A4:.5 G4:1 E4:3 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 B4:3 C5:2 C5:1 G4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 A4:2 A4:1 C5:1.5 B4:.5 A4:1 G4:1.5 A4:.5 G4:1 E4:3 D5:2 D5:1 F5:1.5 D5:.5 B4:1 C5:3 E5:3 C5:1 G4:1 E4:1 G4:1.5 F4:.5 D4:1 C4:4 R:2'
    },
    joy: {
      bpm: 120,
      w: 'triangle',
      n: 'C5:2 B4:1.5 A4:.5 G4:3 F4:1 E4:2 D4:2 C4:3 G4:1 A4:3 A4:1 B4:3 B4:1 C5:6 R:1 C5:1 C5:1 B4:1 A4:1 G4:1 G4:1.5 F4:.5 E4:1 C5:1 C5:1 B4:1 A4:1 G4:1 G4:1.5 F4:.5 E4:1 E4:1 E4:1 E4:1 E4:.5 F4:.5 G4:3 F4:.5 E4:.5 D4:1 D4:1 D4:1 D4:.5 E4:.5 F4:3 E4:.5 D4:.5 C4:1 C5:2 A4:1 G4:1.5 F4:.5 E4:1 F4:1 E4:2 D4:2 C4:4'
    },
    rest: {
      bpm: 132,
      w: 'triangle',
      n: 'E4:1 E4:1 B4:1 B4:1 A4:1 G4:1 F#4:1 E4:1 D4:1 E4:1 F#4:1 G4:1 A4:1 B4:3 E4:1 E4:1 B4:1 B4:1 A4:1 G4:1 F#4:1 E4:1 D4:1 E4:1 F#4:1 G4:1 A4:1 B4:3 B4:1 C5:1 A4:1 B4:1 C5:1 D5:1 E5:1 B4:1 A4:1 G4:1 E4:1 F#4:1 G4:2 A4:1 G4:1 F#4:1 E4:1 D4:1 E4:2 R:1'
    }
  };
  const BY = {
    1: 'enquete',
    2: 'filature',
    3: 'pluie',
    4: 'noir',
    5: 'lyon',
    6: 'coeur',
    7: 'enquete',
    8: 'filature',
    9: 'pluie',
    10: 'noir',
    11: 'lyon',
    12: 'coeur',
    13: 'enquete',
    14: 'filature',
    15: 'pluie',
    16: 'noir',
    17: 'lyon',
    18: 'coeur',
    19: 'enquete',
    20: 'filature',
    21: 'pluie',
    22: 'noir',
    23: 'lyon',
    24: 'coeur'
  };
  const fq = s => {
    const m = /^([A-G])(#|b)?(\d)$/.exec(s);
    const k = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] == '#' ? 1 : m[2] == 'b' ? -1 : 0);
    return 440 * 2 ** ((k + 12 * (+m[3] + 1) - 69) / 12);
  };
  const stop = () => {
    if (iv) {
      clearInterval(iv);
      iv = null;
    }
    if (M && A) {
      try {
        const g = M;
        g.gain.setTargetAtTime(0, A.currentTime, 0.08);
        setTimeout(() => {
          try {
            g.disconnect();
          } catch (_) {}
        }, 400);
      } catch (_) {}
    }
    M = null;
    cur = null;
  };
  const play = (name, vol, bg) => {
    stop();
    isBg = !!bg;
    if (typeof S != 'undefined' && (S.sound === false || S.music === false)) return;
    const sg = SONGS[name];
    if (!sg) return;
    try {
      if (!A) A = new (window.AudioContext || window.webkitAudioContext)();
      if (A.state == 'suspended') A.resume();
    } catch (_) {
      return;
    }
    M = A.createGain();
    M.gain.value = vol || 0.05;
    M.connect(A.destination);
    const out = M;
    cur = name;
    const notes = sg.n.split(' ').map(x => {
        const [a, b] = x.split(':');
        return [a, +b];
      }),
      bt = 60 / sg.bpm;
    let i = 0,
      tt = A.currentTime + 0.15,
      beat = 0;
    const tick = () => {
      if (M !== out) return;
      while (tt < A.currentTime + 0.4) {
        const [n, d] = notes[i];
        if (n != 'R') {
          const f = fq(n),
            dur = d * bt;
          const o = A.createOscillator(),
            g = A.createGain();
          o.type = sg.w;
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, tt);
          g.gain.exponentialRampToValueAtTime(0.5, tt + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, tt + Math.max(0.08, dur * 0.92));
          o.connect(g).connect(out);
          o.start(tt);
          o.stop(tt + dur + 0.05);
          if (Math.abs(beat - Math.round(beat)) < 0.01 && Math.round(beat) % 2 == 0) {
            const b = A.createOscillator(),
              h = A.createGain();
            b.type = 'sine';
            b.frequency.value = f / 4;
            h.gain.setValueAtTime(0.0001, tt);
            h.gain.exponentialRampToValueAtTime(0.35, tt + 0.02);
            h.gain.exponentialRampToValueAtTime(0.0001, tt + Math.min(1.6, bt * 2));
            b.connect(h).connect(out);
            b.start(tt);
            b.stop(tt + bt * 2 + 0.05);
          }
        }
        tt += d * bt;
        beat += d;
        i++;
        if (i >= notes.length) {
          i = 0;
          beat = 0;
          tt += bt;
        }
      }
    };
    tick();
    iv = setInterval(tick, 90);
  };
  return {
    play,
    stop,
    day: d => play(BY[d] || 'enquete'),
    get cur() {
      return cur;
    },
    get bg() {
      return isBg && !!cur;
    }
  };
})();
document.addEventListener(
  'pointerdown',
  () => {
    try {
      bgm();
    } catch (_) {}
  },
  { once: true }
);
