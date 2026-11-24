/* ---------- Effets sonores (synthétisés, discrets) ---------- */
const SFX = (() => {
  let A = null,
    M = null;
  const ctx = () => {
    if (!A) {
      try {
        A = new (window.AudioContext || window.webkitAudioContext)();
        M = A.createGain();
        M.gain.value = 0.55;
        M.connect(A.destination);
      } catch (_) {
        A = null;
      }
    }
    if (A && A.state == 'suspended') A.resume();
    return A;
  };
  const tone = (f, t0, d, v, type = 'sine', f2) => {
    const a = ctx();
    if (!a) return;
    const t = a.currentTime + t0,
      o = a.createOscillator(),
      g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(M);
    o.start(t);
    o.stop(t + d + 0.02);
  };
  const noise = (t0, d, v, fq, q = 1) => {
    const a = ctx();
    if (!a) return;
    const n = a.createBuffer(1, Math.ceil(a.sampleRate * d), a.sampleRate),
      c = n.getChannelData(0);
    for (let i = 0; i < c.length; i++) c[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(),
      f = a.createBiquadFilter(),
      g = a.createGain(),
      t = a.currentTime + t0;
    s.buffer = n;
    f.type = 'bandpass';
    f.frequency.value = fq;
    f.Q.value = q;
    g.gain.setValueAtTime(v, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(f).connect(g).connect(M);
    s.start(t);
  };
  const P = {
    tap: () => tone(1050, 0, 0.045, 0.035),
    ok: () => {
      tone(784, 0, 0.12, 0.07);
      tone(1175, 0.07, 0.18, 0.07);
    },
    bad: () => {
      tone(220, 0, 0.16, 0.06, 'triangle', 150);
    },
    win: () => {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.35, 0.07, 'triangle'));
      tone(1568, 0.36, 0.5, 0.04);
    },
    lose: () => {
      [392, 330, 262].forEach((f, i) => tone(f, i * 0.13, 0.3, 0.06, 'triangle'));
    },
    drop: () => {
      tone(150, 0, 0.12, 0.09, 'sine', 80);
      noise(0, 0.05, 0.04, 900, 0.8);
    },
    perfect: () => {
      tone(1319, 0, 0.12, 0.06);
      tone(1760, 0.06, 0.2, 0.06);
      tone(2637, 0.12, 0.25, 0.025);
    },
    pin: () => {
      noise(0, 0.09, 0.05, 3200, 2);
      tone(1400, 0, 0.12, 0.035, 'triangle', 1900);
    },
    key: () => {
      tone(988, 0, 0.08, 0.07, 'square');
      tone(1319, 0.08, 0.22, 0.06, 'square');
    },
    burn: () => {
      noise(0, 0.45, 0.07, 1400, 0.7);
      tone(180, 0, 0.3, 0.04, 'sawtooth', 90);
    },
    splash: () => noise(0, 0.15, 0.03, 1800, 0.9),
    open: () => {
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.06, 0.3, 0.05, 'triangle'));
      noise(0.05, 0.35, 0.015, 6000, 0.7);
    },
    tab: () => tone(620, 0, 0.07, 0.03, 'sine', 880)
  };
  return n => {
    if (S.sound === false) return;
    try {
      P[n] && P[n]();
    } catch (_) {}
  };
})();
document.addEventListener(
  'pointerdown',
  e => {
    const t = e.target;
    if (!t.closest) return;
    if (!t.closest('#gwin')) {
      if (t.closest('#tabs button')) SFX('tab');
      else if (t.closest('.day')) return;
      else if (t.closest('button,label,.item,.mc,[role=button]')) SFX('tap');
      return;
    }
    if (t.closest('.simon,canvas,.gwx')) return;
    if (t.closest('button,[role=button],.c,.cell,td,.k,.tile')) SFX('tap');
  },
  true
);
