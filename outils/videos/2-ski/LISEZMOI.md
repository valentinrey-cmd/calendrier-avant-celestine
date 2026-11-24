# Vidéo n°2 de l'album : « Leçon de ski sur la piste rouge »

Dessin animé fabriqué par programme (13,5 s, 960×640, 30 images/s). Pour la refaire après une modification :

```bash
cd outils/videos/2-ski
python3 render.py frames          # dessine les 405 images de ski.html (Chrome + Playwright)
python3 son.py                    # fabrique la bande son son.wav
ffmpeg -y -framerate 30 -i frames/f%04d.png -i son.wav -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p \
  -c:a aac -b:a 80k -ac 1 -ar 44100 -shortest -movflags +faststart ../../../2026/videos/2-ski.mp4
ffmpeg -y -ss 8.3 -i ../../../2026/videos/2-ski.mp4 -frames:v 1 -vf scale=640:427 -q:v 4 ../../../2026/videos/2-ski.jpg
```

- `ski.html` : le scénario et les dessins. Les bulles et les temps sont à la fin de `draw()`.
- `son.py` : la musique et les bruitages (synthétisés).
