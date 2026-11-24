# Musique nostalgique (piano, cordes, violoncelle) pour les vidéos de l'album.
# Composition originale, jouée avec de vrais sons d'instruments échantillonnés
# (banque « MusyngKite » de gleitz/midi-js-soundfonts sur GitHub, téléchargée la 1re fois dans outils/videos/_sons/).
# Usage : python3 musique-nostalgique.py <durée_en_secondes> <sortie.wav>
import sys, os, re, base64, subprocess, urllib.request, wave
import numpy as np
from scipy.signal import fftconvolve

DUR = float(sys.argv[1]); OUT = sys.argv[2]
SR = 44100; N = int(SR * DUR)
ICI = os.path.dirname(os.path.abspath(__file__)); SONS = os.path.join(ICI, '_sons')
URL = 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/{}-mp3.js'
NOMS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
rng = np.random.default_rng(2026)

def instrument(nom):
    d = os.path.join(SONS, nom); os.makedirs(d, exist_ok=True)
    if not os.listdir(d):
        js = urllib.request.urlopen(URL.format(nom), timeout=120).read().decode()
        for k, b in re.findall(r'"([A-G]b?\d)":\s*"data:audio/mp3;base64,([A-Za-z0-9+/=]+)"', js):
            open(os.path.join(d, k + '.mp3'), 'wb').write(base64.b64decode(b))
    cache = {}
    def note(m):
        if m not in cache:
            f = os.path.join(d, f'{NOMS[m % 12]}{m // 12 - 1}.mp3')
            raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
            cache[m] = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
        return cache[m]
    return note

piano, cordes, cello = instrument('acoustic_grand_piano'), instrument('string_ensemble_1'), instrument('cello')
out = {k: np.zeros(N + SR * 6) for k in ('p', 's', 'c')}

def jouer(piste, inst, m, t, dur, vel=0.8):
    s = inst(m); i = int(max(0, t) * SR)
    if dur + 0.6 > len(s) / SR and piste != 'p':  # notes tenues longues : on relance la note en fondu
        n = 0
        while n * 2.2 < dur:
            seg = s[:int(SR * 2.9)].copy(); seg[:int(SR * 0.35)] *= np.linspace(0, 1, int(SR * 0.35)) if n else 1
            r = min(len(seg), int(SR * (dur - n * 2.2 + 0.7))); seg = seg[:r]; seg[-int(SR * 0.5):] *= np.linspace(1, 0, int(SR * 0.5))
            j = i + int(n * 2.2 * SR); out[piste][j:j + len(seg)] += seg * vel; n += 1
        return
    k = min(len(s), int(SR * (dur + 0.9)))
    seg = s[:k].copy(); rel = int(SR * 0.6)
    if k > rel: seg[-rel:] *= np.linspace(1, 0, rel)
    out[piste][i:i + k] += seg * vel

# ---------- la composition (sol majeur, mélancolique : Mi m – Do – Sol – Ré) ----------
G = lambda n, o=4: NOMS.index(n) + 12 * (o + 1)
ACC = [('E', [52, 55, 59], 40), ('C', [48, 52, 55], 36), ('G', [43, 47, 50], 43), ('D', [50, 54, 57], 38)]  # (nom, accord, basse)
PHRASES = [  # (note, durée en temps) pour 4 mesures
    [(71, 1.5), (69, .5), (67, 1), (64, 1), (64, 1), (67, 1), (72, 1.5), (71, .5), (71, 1), (74, 1), (67, 1.5), (69, .5), (69, 2), (66, 1), (62, 1)],
    [(71, 1), (76, 1.5), (74, .5), (71, 1), (72, 1), (76, 1), (79, 1), (76, 1), (74, 1.5), (71, .5), (67, 1), (71, 1), (69, 3), (None, 1)],
    [(79, 1.5), (78, .5), (76, 1), (71, 1), (72, 1), (76, 1), (79, 1.5), (81, .5), (83, 1.5), (81, .5), (79, 1), (74, 1), (78, 2), (76, 1), (74, 1)],
    [(71, 1.5), (72, .5), (71, 1), (67, 1), (72, 1), (71, 1), (69, 1), (67, 1), (74, 1.5), (71, .5), (67, 2), (66, 3), (None, 1)],
]
mes = int(round(DUR / 3.3))                      # nombre de mesures pour remplir la durée
beat = (DUR - 3.0) / (mes * 4 + 2)                # tempo calé pour finir pile avec l'accord final
t0 = 0.25
plan = []                                         # (mesure, phrase ou None, cordes, intensité)
for b in range(mes):
    if b < 2: plan.append((None, 0, 0.55))
    else:
        ph = (b - 2) // 4
        plan.append((ph % 4, 1 if b >= 6 else 0.5 if b >= 4 else 0, 0.7 if b < 6 else 0.9 if b < mes - 3 else 0.7))
for b, (ph, st, inten) in enumerate(plan):
    T0 = t0 + b * 4 * beat; nom, acc, basse = ACC[b % 4]
    # piano main gauche : arpège « une, deux, trois » qui roule
    arp = [basse, acc[0] + 12, acc[1] + 12, acc[2] + 12, acc[1] + 24 - 12, acc[2] + 12, acc[0] + 12, acc[1] + 12]
    for i, m in enumerate(arp):
        jouer('p', piano, m, T0 + i * beat / 2 + rng.normal(0, 0.008), beat * (4 - i / 2), (0.55 if i == 0 else 0.33) * inten * (0.92 + rng.random() * 0.12))
    # mélodie
    if ph is not None:
        notes = PHRASES[ph]; mi = (b - 2) % 4; acc_t = 0; t = 0
        for m, d in notes:
            if int(acc_t // 4) == mi and m: jouer('p', piano, m, T0 + (acc_t - mi * 4) * beat + rng.normal(0, 0.01), d * beat, 0.62 * (0.95 + rng.random() * 0.1))
            acc_t += d
    # cordes et violoncelle
    if st:
        for m in acc: jouer('s', cordes, m + 12, T0, 4 * beat + 0.3, 0.22 * st)
        jouer('c', cello, basse, T0, 4 * beat + 0.2, 0.42 * st)
# accord final de Sol qui résonne
TF = t0 + mes * 4 * beat
for m in (43, 55, 59, 62, 67, 71): jouer('p', piano, m, TF + (m - 43) * 0.012, 3.0, 0.45)
for m in (55, 59, 62): jouer('s', cordes, m + 12, TF, 3.0, 0.16)
jouer('c', cello, 43, TF, 3.0, 0.35)

mix = (out['p'] * 1.0 + out['s'] * 0.9 + out['c'] * 0.8)[:N]
ir_t = np.arange(int(SR * 2.8)) / SR; ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.2); ir[:int(SR * 0.02)] = 0
wet = fftconvolve(mix, ir)[:N]; wet *= np.abs(mix).max() / (np.abs(wet).max() + 1e-9)
mix = mix + wet * 0.35
f = np.ones(N); f[-int(SR * 2.5):] = np.linspace(1, 0, int(SR * 2.5)); mix *= f
mix /= np.abs(mix).max() / 0.85
w = wave.open(OUT, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes()); w.close()
print('ok', round(beat, 3), 's par temps,', mes, 'mesures')
