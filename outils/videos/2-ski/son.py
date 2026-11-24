# Bande son de la vidéo du ski (synthétisée) -> son.wav
import numpy as np, wave
SR = 44100; DUR = 13.5; N = int(SR * DUR)
out = np.zeros(N)
rng = np.random.default_rng(3)
T = lambda d: np.arange(int(SR * d)) / SR

def add(t0, sig, vol=1.0):
    i = int(t0 * SR); j = min(N, i + len(sig))
    if j > i: out[i:j] += sig[:j - i] * vol

def env(n, a=0.005, r=0.08):
    e = np.ones(n); A = max(1, int(a * SR)); R = max(1, int(r * SR))
    e[:A] = np.linspace(0, 1, A); e[-R:] *= np.linspace(1, 0, R); return e

def tri(f, d):
    t = T(d); return 2 * np.abs(2 * ((t * f) % 1) - 1) - 1

def sq(f, d):
    t = T(d); return np.sign(np.sin(2 * np.pi * f * t))

def noise(d):
    return rng.uniform(-1, 1, int(SR * d))

def lp(x, k):  # passe-bas simple
    y = np.zeros_like(x); a = 0.0
    for i in range(len(x)): a += k * (x[i] - a); y[i] = a
    return y

# --- musique : petite ritournelle de montagne (132 bpm)
beat = 60 / 132
mel = [72, 76, 79, 76, 74, 77, 81, 77, 72, 76, 79, 84, 83, 79, 76, 74]
bass = [48, 48, 53, 53, 48, 48, 55, 55]
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
t = 0.3; k = 0
while t < DUR - 0.6:
    n = mel[k % len(mel)]
    d = beat * 0.9
    add(t, tri(hz(n), d) * env(int(SR * d), 0.004, 0.12), 0.07)
    if k % 2 == 0:
        b = bass[(k // 2) % len(bass)]; add(t, sq(hz(b), beat * 1.6) * env(int(SR * beat * 1.6), 0.005, 0.2), 0.025)
    if k % 2 == 1:
        add(t, lp(noise(0.05), 0.5) * env(int(SR * 0.05), 0.001, 0.04), 0.05)  # charleston
    t += beat; k += 1

# --- voix « charabia » quand une bulle apparaît
def blabla(t0, base, n):
    for i in range(n):
        f = base * (1 + rng.uniform(-0.25, 0.35)); d = 0.07
        s = (np.sin(2 * np.pi * f * T(d)) + 0.4 * np.sin(4 * np.pi * f * T(d))) * env(int(SR * d), 0.005, 0.03)
        add(t0 + i * 0.09, s, 0.13)
for t0, who, n in [(0.3, 'v', 10), (1.7, 'c', 9), (3.4, 'c', 10), (4.6, 'v', 11), (7.65, 'v', 10), (9.1, 'c', 9), (10.3, 'v', 9), (11.9, 'c', 6)]:
    blabla(t0, 170 if who == 'v' else 330, n)

# --- les skis qui glissent sur la pente
d = 3.2; sw = lp(noise(d), 0.08) * np.linspace(0.2, 1, int(SR * d)) * (0.7 + 0.3 * np.sin(2 * np.pi * 3 * T(d))) * env(int(SR * d), 0.3, 0.3)
add(3.0, sw, 0.35)
# --- le « wouaaah » de Célestine en l'air
d = 0.9; f = np.linspace(500, 900, int(SR * d)) * (1 + 0.04 * np.sin(2 * np.pi * 9 * T(d)))
ph = 2 * np.pi * np.cumsum(f) / SR; add(6.1, (np.sin(ph) + 0.3 * np.sin(2 * ph)) * env(int(SR * d), 0.03, 0.2), 0.12)
# --- POUF dans la neige
d = 0.7; add(7.0, lp(noise(d), 0.06) * np.exp(-T(d) * 7), 0.9)
add(7.0, np.sin(2 * np.pi * 70 * T(d) * np.exp(-T(d) * 1.5)) * np.exp(-T(d) * 6), 0.5)
# --- dérapage de Valentin
d = 0.6; add(7.3, (noise(d) - lp(noise(d), 0.2)) * env(int(SR * d), 0.02, 0.3), 0.2)
# --- fou rire « ha ha ha »
def ha(t0, f0):
    d = 0.13; t_ = T(d); f = f0 * (1 - 0.15 * t_ / d)
    ph = 2 * np.pi * np.cumsum(f) / SR
    v = sum(np.sin(h * ph) / h * (1.6 if 3 <= h <= 6 else 0.6) for h in range(1, 12))
    add(t0, v * env(len(t_), 0.01, 0.05), 0.09)
t0 = 7.7
while t0 < 11.35:
    for i in range(5):
        ha(t0 + i * 0.19, 230 - i * 12)
    t0 += 1.25
# --- boule de neige + PAF !
d = 0.4; add(11.15, lp(noise(d), 0.15) * np.linspace(0.2, 1, int(SR * d)) * env(int(SR * d), 0.05, 0.1), 0.25)
d = 0.4; add(11.55, lp(noise(d), 0.3) * np.exp(-T(d) * 14), 0.8)
add(11.55, np.sin(2 * np.pi * 110 * T(d)) * np.exp(-T(d) * 12), 0.4)
# --- petit carillon de fin
for i, m in enumerate([84, 88, 91, 96]):
    d = 0.8; add(11.9 + i * 0.09, np.sin(2 * np.pi * hz(m) * T(d)) * np.exp(-T(d) * 4), 0.08)

out *= np.r_[np.ones(N - int(0.5 * SR)), np.linspace(1, 0, int(0.5 * SR))]
out /= max(1e-9, np.abs(out).max()) / 0.85
w = wave.open('son.wav', 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
print('ok')
