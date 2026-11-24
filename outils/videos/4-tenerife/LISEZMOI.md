# Vidéo n°4 de l'album : « Notre voyage à Tenerife » (août 2026)

Timelapse animé du voyage (47 s, 960×640, 30 images/s). Une carte de Tenerife fait le lien entre les étapes :

1. La plage (Valentin enterré dans le sable).
2. Le snorkeling avec les tortues.
3. Siam Park et la Tower of Power (toboggan de 28 m presque vertical dans un temple thaï).
4. Le canyoning en rappel (parois de cendres volcaniques orange).
5. Le parapente en tandem depuis le Teide (décollage à 2 200 m, au-dessus de la mer de nuages, jusqu'à la côte).
6. La balade dans la forêt de lauriers d'Anaga (brume, mousse, fougères).
7. Le coucher de soleil sur le Teide, avec l'ombre de la montagne en triangle, puis la nuit, la Voie lactée et les constellations d'août (Triangle d'été, Scorpion avec Antarès). Les tenues reprennent la photo « stargazing » : sweat gris pour Valentin, sweat noir pour Célestine.

Pour la refaire :

```bash
cd outils/videos/4-tenerife
python3 render.py frames     # dessine les images de tenerife.html
python3 son.py               # bande son (même découpage que PLAN dans tenerife.html)
ffmpeg -y -framerate 30 -i frames/f%04d.png -i son.wav -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p \
  -c:a aac -b:a 80k -ac 1 -ar 44100 -shortest -movflags +faststart ../../../2026/videos/4-tenerife.mp4
ffmpeg -y -ss 43.2 -i ../../../2026/videos/4-tenerife.mp4 -frames:v 1 -vf scale=640:427 -q:v 4 ../../../2026/videos/4-tenerife.jpg
```

- Les scènes sont les fonctions `sPlage`, `sSnorkel`, `sSiam`, `sCanyon`, `sParapente`, `sAnaga` et `sTeide`. L'ordre et les durées sont dans `SC`.
- Si tu changes les durées, mets aussi à jour `SCENES` dans `son.py`.
