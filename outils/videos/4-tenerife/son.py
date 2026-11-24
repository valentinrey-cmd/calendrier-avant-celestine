# Bande son de la vidéo de Tenerife (synthétisée) -> son.wav
# Le plan doit suivre celui de tenerife.html (PLAN) : carte 2,4 s puis, pour chaque scène, 1 s de carte + la scène.
import numpy as np, wave
SR = 44100
SCENES = [('plage', 4.2), ('snorkel', 4.2), ('siam', 4.8), ('canyon', 4.4), ('parapente', 4.6), ('anaga', 4.4), ('teide', 7.8)]
START = {}; t = 2.4
HOPS = []
for k, d in SCENES:
    HOPS.append(t); t += 1.0; START[k] = (t, d); t += d
OUTRO = t; DUR = t + 3.2
N = int(SR * DUR); out = np.zeros(N); rng = np.random.default_rng(5)
T = lambda d: np.arange(int(SR * d)) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)

def add(t0, sig, vol=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if j > i: out[i:j] += sig[:j - i] * vol
def env(n, a=0.005, r=0.08):
    e = np.ones(n); A = max(1, int(a * SR)); R = max(1, int(r * SR)); e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e
def noise(d): return rng.uniform(-1, 1, int(SR * d))
def lp(sig, k):
    y = np.zeros_like(sig); a = 0.0
    for i in range(len(sig)): a += k * (sig[i] - a); y[i] = a
    return y
def pluck(f, d):  # petite corde pincée (style ukulélé)
    n = int(SR * d); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); y = np.zeros(n)
    for i in range(n): y[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return y

# --- musique de vacances (110 bpm) : accords pincés + basse, plus douce pour le coucher de soleil
beat = 60 / 110
prog = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # Do Sol Lam Fa
mel = [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 84, 83, 81, 79, 76, 79]
tt = 0.2; k = 0
calm0 = START['teide'][0]
while tt < DUR - 0.5:
    calm = tt > calm0
    ch = prog[(k // 4) % 4]
    vol = 0.5 if calm else 1.0
    if k % 2 == 0:
        for j, m in enumerate(ch): add(tt + j * 0.012, pluck(hz(m), 0.6), 0.10 * vol)
        add(tt, np.sin(2 * np.pi * hz(ch[0] - 12) * T(beat * 1.8)) * env(int(SR * beat * 1.8), 0.01, 0.3), 0.10 * vol)
    if not calm: add(tt, pluck(hz(mel[k % 16]), 0.4), 0.07)
    else: add(tt, np.sin(2 * np.pi * hz(mel[k % 16]) * T(1.2)) * np.exp(-T(1.2) * 2.5), 0.03)
    if not calm and k % 2 == 1: add(tt, lp(noise(0.04), 0.6) * env(int(SR * 0.04), 0.001, 0.03), 0.05)
    tt += beat; k += 1

# --- voix « charabia » des bulles (temps relatifs à chaque scène)
BUBBLES = [('plage', 0.8, 'c'), ('plage', 2.9, 'v'), ('snorkel', 0.8, 'c'), ('siam', 0.0, 'v'), ('siam', 3.4, 'v'),
           ('canyon', 0.4, 'c'), ('canyon', 2.4, 'v'), ('parapente', 0.7, 'v'), ('parapente', 2.6, 'c'), ('anaga', 0.6, 'c'), ('anaga', 2.8, 'v'),
           ('teide', 0.8, 'c'), ('teide', 5.0, 'v')]
for sc, rel, who in BUBBLES:
    t0 = START[sc][0] + rel
    for i in range(9):
        f = (170 if who == 'v' else 330) * (1 + rng.uniform(-0.25, 0.35)); d = 0.07
        add(t0 + i * 0.09, (np.sin(2 * np.pi * f * T(d)) + 0.4 * np.sin(4 * np.pi * f * T(d))) * env(int(SR * d), 0.005, 0.03), 0.12)

# --- carte : « whoosh » de l'avion + petit ding quand l'épingle arrive
for h in HOPS:
    d = 0.8; add(h, lp(noise(d), 0.12) * np.sin(np.linspace(0, np.pi, int(SR * d))), 0.25)
    add(h + 0.85, np.sin(2 * np.pi * 1318 * T(0.4)) * np.exp(-T(0.4) * 8), 0.08)
d = 1.6; add(0.3, lp(noise(d), 0.06) * np.sin(np.linspace(0, np.pi, int(SR * d))), 0.35)  # l'avion qui arrive

# --- ambiances
s0, d = START['plage']; v = lp(noise(d), 0.05) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.35 * T(d))) * env(int(SR * d), 0.3, 0.3); add(s0, v, 0.4)
s0, d = START['snorkel']
for i in range(14): add(s0 + i * 0.28, np.sin(2 * np.pi * np.linspace(500, 1100, int(SR * 0.08)) * T(0.08)) * env(int(SR * 0.08), 0.005, 0.04), 0.06)
add(s0, lp(noise(d), 0.02) * env(int(SR * d), 0.3, 0.3), 0.3)
s0, d = START['siam']
d2 = 0.9; f = np.linspace(400, 1200, int(SR * d2)); add(s0 + 1.6, np.sin(2 * np.pi * np.cumsum(f) / SR) * env(int(SR * d2), 0.02, 0.2), 0.08)  # le « wouaaah » de Valentin
add(s0 + 2.5, lp(noise(0.7), 0.25) * np.exp(-T(0.7) * 5), 0.8)  # SPLASH
s0, d = START['canyon']
for i in range(6): add(s0 + 0.3 + i * 0.6, lp(noise(0.05), 0.5) * env(int(SR * 0.05), 0.001, 0.04), 0.25)  # la corde qui file
s0, d = START['parapente']; add(s0, lp(noise(d), 0.03) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.5 * T(d))) * env(int(SR * d), 0.4, 0.4), 0.45)  # le vent
s0, d = START['anaga']
for i in range(7):
    t0 = s0 + 0.3 + i * 0.55 + rng.uniform(0, 0.2); dd = 0.18; f = 2600 + 600 * np.sin(2 * np.pi * 18 * T(dd))
    add(t0, np.sin(2 * np.pi * np.cumsum(f) / SR) * env(int(SR * dd), 0.01, 0.05), 0.04)  # oiseaux
s0, d = START['teide']
for i in range(10): add(s0 + 4.2 + i * 0.35, np.sin(2 * np.pi * hz(88 + (i * 5) % 12) * T(0.6)) * np.exp(-T(0.6) * 6), 0.03)  # étoiles qui scintillent
for i, m in enumerate([72, 76, 79, 84]): add(OUTRO + 0.3 + i * 0.12, np.sin(2 * np.pi * hz(m) * T(1.5)) * np.exp(-T(1.5) * 2), 0.06)

out *= np.r_[np.ones(N - int(0.6 * SR)), np.linspace(1, 0, int(0.6 * SR))]
out /= max(1e-9, np.abs(out).max()) / 0.85
w = wave.open('son.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
print('ok', round(DUR, 2))
