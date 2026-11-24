# Musique de la vidéo de Tenerife : piano + cordes, douce et émouvante (synthétisée) -> son.wav
# Durée calée sur DUR de tenerife.html (52 s). Grille : La m – Fa – Do – Sol (vi–IV–I–V), 66 bpm.
import numpy as np, wave
from scipy.signal import lfilter, fftconvolve

SR = 44100; DUR = 52.0; N = int(SR * DUR)
out = np.zeros(N); pad = np.zeros(N)
rng = np.random.default_rng(12)
T = lambda d: np.arange(int(SR * d)) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def add(buf, t0, sig, vol=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if j > i: buf[i:j] += sig[:j - i] * vol

def piano(m, d=3.2, vel=1.0):
    f = hz(m); t = T(d); s = np.zeros_like(t)
    for n in range(1, 9):
        fn = n * f * np.sqrt(1 + 0.0004 * n * n)
        if fn > SR / 2: break
        s += np.sin(2 * np.pi * fn * t) / n ** 1.4 * np.exp(-t * (0.9 + n * 0.55))
    s *= np.minimum(1, t / 0.004)
    s[:400] += rng.uniform(-1, 1, 400) * np.linspace(0.08, 0, 400)  # petit bruit de marteau
    return s * vel

def strings(m, d, att=1.4, rel=1.8):
    f = hz(m); t = T(d); s = np.zeros_like(t)
    for det in (-0.006, 0, 0.0055):
        ph = 2 * np.pi * f * (1 + det) * t + 0.004 * np.sin(2 * np.pi * 5.2 * t) * f / 5.2
        s += 2 * ((ph / (2 * np.pi)) % 1) - 1
    k = 1 - np.exp(-2 * np.pi * min(2400, f * 3) / SR)
    s = lfilter([k], [1, k - 1], s); s = lfilter([k], [1, k - 1], s)
    e = np.minimum(1, t / att) * np.minimum(1, (d - t) / rel); return s * np.clip(e, 0, 1) / 3

beat = 60 / 66; bar = 4 * beat
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # La m, Fa, Do, Sol
MEL = [[76, None, 72, None], [69, 72, 77, None], [76, None, 79, None], [74, None, 71, None],
       [72, None, 76, 81], [77, None, 76, 72], [79, None, 76, 72], [74, 76, 74, None]]

nbar = int(DUR / bar) + 1
for b in range(nbar):
    t0 = 0.3 + b * bar
    if b >= 13: break
    ch = CHORDS[b % 4]
    # arpèges de piano (main gauche)
    root = ch[0] - 12
    arp = [root, ch[0], ch[1], ch[2], ch[1] + 12 if b % 2 else ch[2] + 12, ch[1], ch[0], ch[2]]
    for i, m in enumerate(arp):
        add(out, t0 + i * beat / 2, piano(m, 3.0, 0.45 if i else 0.6), 0.5)
    # mélodie (main droite) à partir de la 3e mesure, plus présente au coucher de soleil et aux étoiles
    if b >= 2:
        for i, m in enumerate(MEL[(b - 2) % len(MEL)]):
            if m: add(out, t0 + i * beat, piano(m, 3.4, 0.9), 0.55)
    # cordes : entrent doucement après l'intro, s'ouvrent au coucher de soleil et à la fin
    if t0 > 3.0:
        swell = 1.0 if (9 < t0 < 21 or t0 > 40) else 0.6
        for m in ch: add(pad, t0, strings(m, bar + 1.6), 0.10 * swell)
        add(pad, t0, strings(ch[0] - 12, bar + 1.6), 0.08 * swell)
        if 12 < t0 < 21 or t0 > 40: add(pad, t0, strings(ch[2] + 12, bar + 1.6, att=2.0), 0.05)

# accord final de Do qui résonne
tf = 0.3 + 13 * bar + 0.0
for m in (48, 55, 60, 64, 67, 72): add(out, min(tf, DUR - 4.5), piano(m, 4.5, 0.7), 0.45)
for m in (48, 60, 64, 67): add(pad, min(tf, DUR - 4.5), strings(m, 4.4, att=0.8, rel=3.0), 0.09)

mix = out + pad
# très léger bruit des vagues sur la plage (3,7 s → 10 s)
v = rng.uniform(-1, 1, int(SR * 6.4)); k = 1 - np.exp(-2 * np.pi * 500 / SR); v = lfilter([k], [1, k - 1], v)
v *= (0.5 + 0.5 * np.sin(2 * np.pi * 0.16 * T(6.4))) * np.minimum(1, np.minimum(T(6.4), 6.4 - T(6.4)) / 1.5)
add(mix, 3.7, v, 0.5)

# réverbération (salle douce)
ir_t = T(2.6); ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.4); ir[0] = 0
wet = fftconvolve(mix, ir)[:N]; wet /= np.abs(wet).max() + 1e-9
mix = mix / (np.abs(mix).max() + 1e-9) * 0.75 + wet * 0.32
fade = np.ones(N); fade[-int(SR * 3):] = np.linspace(1, 0, int(SR * 3)); fade[:int(SR * 0.6)] = np.linspace(0, 1, int(SR * 0.6))
mix *= fade; mix /= np.abs(mix).max() / 0.85
w = wave.open('son.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((mix * 32767).astype(np.int16).tobytes()); w.close()
print('ok', DUR)
