# Vidéo n°4 de l'album : « Notre voyage à Tenerife » (août 2026)

Film souvenir illustré (52 s, 960×640, 30 images/s), dans un style « carnet de voyage » : paysages en couches avec lumière et brume, petites silhouettes du couple, fondus enchaînés, carte de lieu pour chaque étape. La musique est nostalgique, au piano, aux cordes et au violoncelle. Elle est jouée avec de vrais sons d'instruments par `../musique-nostalgique.py`.

Ordre du voyage (celui donné par Valentin) :

1. Carte de l'île avec l'itinéraire.
2. La plage, puis le snorkeling avec une tortue.
3. Le coucher de soleil sur le Teide, au-dessus de la mer de nuages, avec l'ombre du Teide.
4. Les étoiles : Voie lactée, Triangle d'été, laser vert du guide, pins des Canaries.
5. Siam Park : le temple thaï, la Tower of Power et la Wave Palace.
6. La descente en rappel, entre les parois de cendres volcaniques.
7. La forêt de lauriers d'Anaga.
8. Le parapente depuis les pentes du Teide.
9. Santiago del Teide : l'église San Fernando Rey, blanche, avec ses coupoles.
10. Masca : le village sur son éperon dans le Teno, la route en lacets, La Gomera à l'horizon.
11. Fin : la vraie photo « stargazing » en polaroïd, avec « Notre plus beau voyage ».

Pour la refaire :

```bash
cd outils/videos/4-tenerife
python3 render.py frames     # dessine les images de tenerife.html
python3 ../musique-nostalgique.py 52 son.wav   # la musique (télécharge les sons d'instruments la 1re fois)
ffmpeg -y -framerate 30 -i frames/f%04d.png -i son.wav -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ac 1 -ar 44100 -shortest -movflags +faststart ../../../2026/videos/4-tenerife.mp4
ffmpeg -y -ss 12.6 -i ../../../2026/videos/4-tenerife.mp4 -frames:v 1 -vf scale=640:427 -q:v 3 ../../../2026/videos/4-tenerife.jpg
```

- Chaque étape est une fonction de `tenerife.html` (`sPlage`, `sCoucher`, `sEtoiles`, `sSiam`, `sRappel`, `sAnaga`, `sParapente`, `sSantiago`, `sMasca`). L'ordre, les durées et les textes sont dans `SC`.
- Les polices utilisées sont Crimson Text (titres) et Inter (petits textes). Elles doivent être installées sur la machine qui fait le rendu.
- Si la durée totale change, passe la nouvelle durée à `musique-nostalgique.py`.
- Les décors communs sont dans `decors.js`.
- **Deuxième version, « comme les autres vidéos »** (vos visages en photo sur des corps entiers, avec des bulles) : `tenerife-bd.html`, rendue avec `PAGE=tenerife-bd.html python3 render.py frames`. Le résultat est gardé dans `versions/4-tenerife-style-bd.mp4`, en attendant que Valentin choisisse la version à mettre dans l'album.
