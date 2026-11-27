# La plaque gravée du bracelet 3D

`2026/3d/bracelet-grave.glb` = le bracelet fait avec Meshy (`2026/3d/bracelet.glb`) + une petite plaque dorée
accrochée à la chaîne par un anneau, près du fermoir, avec « ♥ 03.07.2025 ♥ » gravé en creux.
Meshy ne sait pas graver un texte lisible : la plaque est fabriquée ici, par programme.

1. `python3 plaque.py` : dessine la gravure (textures `couleur.png`, `normal.png`, `metal.png`) et calcule la forme
   de la plaque et de l'anneau (`geo.json`), à leur place sur le bracelet (angle 205°, près du fermoir).
2. `node ajoute-plaque.mjs ../../2026/3d/bracelet.glb ../../2026/3d/bracelet-grave.glb` : ajoute la plaque au modèle.
   Il faut `@gltf-transform/core`, `@gltf-transform/extensions`, `@gltf-transform/functions` et `sharp` (npm).

Pour changer la date ou le texte : la ligne `t='03.07.2025'` dans `plaque.py`.
Si la plaque bouge, mettre à jour `grav` (centre affiché par `plaque.py`) et `grt` (angle de caméra) dans `OBJ3D.bracelet` (`2026/js/vue-3d.js`).
Les fichiers créés (`*.png`, `geo.json`) ne sont pas gardés : voir `.gitignore`.
