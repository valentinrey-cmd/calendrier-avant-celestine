# Journal des modifications

> **Règle :** toute IA (Claude ou autre) qui modifie le site **ajoute une entrée tout en haut** de ce journal : la date, ce qui a changé en français simple et les fichiers touchés. Lis d'abord `CLAUDE.md`, qui contient la carte du code.

---

## 25 novembre 2026 : Tenerife, nouvelle musique et 2ᵉ version « comme les autres vidéos »

- **Nouvelle musique** (dans les deux versions) : une composition nostalgique originale au piano, aux cordes et au violoncelle, jouée avec de vrais sons d'instruments enregistrés (banque MusyngKite). Le script `outils/videos/musique-nostalgique.py` est réutilisable pour d'autres vidéos.
- La vidéo de l'album (`2026/videos/4-tenerife.mp4`, version illustrée) a maintenant cette musique.
- **2ᵉ version** dans le style des autres vidéos de l'album : vos visages en photo sur des corps entiers, des bulles de dialogue et un titre en italique en haut. Elle utilise les mêmes décors et le même ordre. Elle est gardée dans `outils/videos/4-tenerife/versions/4-tenerife-style-bd.mp4` et **n'est pas encore dans l'album** : Valentin doit choisir.
- Les décors communs aux deux versions sont dans `outils/videos/4-tenerife/decors.js`.

---

## 24 novembre 2026 (nuit) : vidéo de Tenerife entièrement refaite

- **Nouvel ordre**, celui du vrai voyage :
  1. la plage (avec le snorkeling et la tortue) ;
  2. le coucher de soleil sur le Teide ;
  3. les étoiles ;
  4. Siam Park ;
  5. la descente en rappel ;
  6. Anaga ;
  7. le parapente ;
  8. **Santiago del Teide** (nouveau) ;
  9. **Masca** (nouveau).
- **Nouveau style graphique**, façon carnet de voyage illustré :
  - de vrais paysages en couches, avec lumière, brume et reflets ;
  - le couple en petites silhouettes dessinées, au lieu des têtes en photo ;
  - des fondus enchaînés et une carte de lieu élégante pour chaque étape ;
  - une carte de l'itinéraire au début ;
  - la vraie photo « stargazing » en polaroïd à la fin.
- **Nouvelle musique** : piano et cordes, lente et émouvante.
- Durée : 52 s. Fichiers : `2026/videos/4-tenerife.mp4` et `.jpg`, source dans `outils/videos/4-tenerife/` (`tenerife.html`, `son.py`, `LISEZMOI.md`).

---

## 24 novembre 2026 (nuit) : vidéo « Notre voyage à Tenerife » à la place du bouquet

- **Album, vidéo n°4** (débloquée par le boss de Nora) : « Le lancer du bouquet » est remplacée par **« Notre voyage à Tenerife »** (août 2026, 47 s). Elle se range maintenant dans le chapitre « Nos voyages », juste après la photo « Tenerife ».
- C'est un timelapse du voyage, avec une carte de l'île entre chaque étape :
  1. la plage ;
  2. le snorkeling avec les tortues ;
  3. Siam Park et la Tower of Power ;
  4. le canyoning en rappel ;
  5. le parapente depuis le Teide (2 200 m, mer de nuages) ;
  6. la forêt d'Anaga ;
  7. le coucher de soleil sur le Teide (ombre en triangle), puis la Voie lactée et les constellations.
- Fichiers : `2026/videos/4-tenerife.mp4` et `.jpg` (les fichiers `4-bouquet.*` sont supprimés), `2026/js/contenu.js`, `2026/js/langue-anglais.js`.
- Source de l'animation : `outils/videos/4-tenerife/` (avec `LISEZMOI.md`). Ajout de `outils/videos/.gitignore` (images de travail).

---

## 24 novembre 2026 (nuit) : le suspect n°7 devient seulement Valérie

- Le suspect « Fabien et Valérie » devient **« Valérie », la mère de Célestine**. Fabien n'apparaît plus nulle part : fiche, prologue (« Votre mère aussi, donc. »), agenda, main courante, plan, générique, menu, scène d'accusation réécrite.
- **Nouvelle photo :** seulement Valérie, découpée de l'ancienne photo des parents (`media/persos/valerie.webp`, `parents.webp` supprimé). L'identifiant interne reste `parents`, pour ne pas casser les sauvegardes.
- Sa voix « charabia » est maintenant une voix de femme.
- Fichiers : `js/enquete/suspects-pieces.js`, `js/enquete/plan-liege-notes.js`, `js/histoire.js`, `js/menu-demarrer.js`, `js/boss/boss-final.js`, `js/cinematiques.js`, `js/medias.js`, `js/fichiers.js`, `js/langue-anglais.js`.

---

## 24 novembre 2026 (nuit) : vidéo du ski et vraies scènes de mauvaises accusations

- **Album, vidéo n°2 :** « Notre bataille de boules de neige » est remplacée par **« Leçon de ski sur la piste rouge »** (13,5 s). Valentin explique la « pizza » à Célestine. Elle part trop vite, s'envole sur une bosse et finit tête la première dans la neige (« POUF ! »). Valentin est mort de rire (« C'était une calzone ça ! 😂 »), puis elle se venge avec une boule de neige.
  - Fichiers : `2026/videos/2-ski.mp4` et `2-ski.jpg` (les fichiers `2-neige.*` sont supprimés), `2026/js/contenu.js` (titre et chemins).
  - Source de l'animation : `outils/videos/2-ski/` (`ski.html`, `son.py`, `render.py`, `LISEZMOI.md`).
- **Mauvaises accusations :** les 8 scènes (Noémie, Emma, Nora, Erika, Eya, Edgar, Fabien et Valérie, Sandrine) sont maintenant de vraies petites scènes drôles d'une douzaine de répliques. Le suspect se défend, avoue sa petite bêtise, Pépin vérifie avec une pièce du dossier, puis vient le tampon « INNOCENT·E » et une chute. Fichier : `2026/js/histoire.js` (clés `acc_…`).
- Traductions anglaises ajoutées pour ces scènes et le titre de la vidéo : `2026/js/langue-anglais.js`.
- `CLAUDE.md` : nouvelle section « Où mettre le code pour chaque type de modification (recettes) ».

---

## 24 novembre 2026 (soir) : grand rangement du code (rien ne change à l'écran)

Le site tenait dans un seul fichier de 5,3 Mo, copié en double pour la version de test. Il a été réorganisé pour que chaque modification future soit rapide.

- **Découpé en ~95 fichiers rangés par thème** : `2026/js/` (un fichier par partie du site), `2026/js/jeux/` (un fichier par mini-jeu, nommé par jour), `2026/js/boss/`, `2026/js/enquete/` et `2026/css/`. La carte complète est dans `CLAUDE.md`.
- **Photos, images et voix sorties du code** : 85 vrais fichiers dans `2026/media/`, au lieu de texte « base64 » collé dans le code.
- **Une seule source pour la vraie version et le test** : `test/` redirige vers `2026/?test`. Les seules différences (cases ouvertes, bouton 🧪, sauvegarde `avent_test`, salon de suivi « t ») sont dans `js/config.js`. `test/version.json` est supprimé.
- **Code formaté** avec Prettier, pour qu'il soit lisible ligne par ligne.
- **Code mort supprimé** :
  - 223 règles CSS qui ne servaient plus (anciens boss : polochons, tir à la corde, cache-cache, lumignons…).
  - 478 traductions anglaises de textes qui n'existent plus.
  - Les listes de mots de l'ancien Wordle.
  - Le niveau « tango » et les images de Picross inutilisées.
  - Une trentaine de variables et petites fonctions jamais appelées.
- **Nouveau `js/fichiers.js`** : la liste et l'ordre des fichiers. `index.html` les charge avec `?v=version`, pour toujours avoir la dernière version.
- **`sw.js`** (hors-ligne) lit cette liste : le code est pris sur le réseau d'abord, les médias dans le cache d'abord.
- **Android** : la construction de l'APK copie tout le dossier `2026/` (sauf les vidéos et l'APK). L'appli autorise les fichiers locaux entre eux, pour que tout marche aussi hors connexion.
- **Nouveaux fichiers** : `outils/verifier.py` (vérifications avant commit, `--nouvelle-version` pour changer de version), `CLAUDE.md` (carte du code et règles), `AGENTS.md` et ce journal.
- **Vérifié** avec un banc de test automatique (navigateur sans écran, hasard et horloge figés). Sur 108 scénarios (les 24 cases, chaque jeu, chaque boss, le boss final, le générique, toute l'histoire, chaque accusation, chaque onglet, les gags, l'anglais et le braille), la page affichée est identique avant et après le rangement.

---

## Historique d'avant le rangement (résumé de l'historique Git)

### 24 novembre 2026
- Boss final retravaillé autour de 4 souvenirs :
  - un combat ;
  - un duel de rock, où c'est Valentin qui la fait tourner ;
  - les boîtes de Pizza Mario (souvenir de Trévoux) ;
  - le cadenas, avec le code 03.07.2025.
  
  Fin simplifiée : la révélation de la gravure du bracelet, et le départ de Valentin à 8 h 05 rendu cohérent.
- Aveux affichés directement après chaque boss. Accusation sans verrou : un mauvais nom renvoie au dossier.
- Jour 6 : air hockey contre Valentin (5 buts gagnants, nouvelle physique, bruitages). Jour 8 : bulles d'indices, avec leurs œufs.
- Boss de Nora : 18 fiches. Métro : plus doux et plus fluide (Célestine aux cheveux longs et bruns). Edgar : le kebab devient un tacos, et il est plus dur.
- Musiques d'enquête originales à la place des chants de Noël. Sous chaque musique, une ligne dit à quoi elle sert.
- Nouvelle image du puzzle : le formulaire d'accusation du dossier n°24.
- Cohérence de toute l'histoire : plus de « cette nuit-là », modes, pubs, carte, générique (9 suspects, apparitions spéciales allégées).
- Photos de Nora, Eya, Erika, Fabien et Valérie, et visage de Sandrine.
- Grand nettoyage : suppression de l'ancienne version et nouveaux noms partout (appli de suivi, installation iOS/Android).
- Appli Android : charge toujours la dernière version, avec un écran de chargement au nouveau style.

### 23 novembre 2026
- **Refonte polar complète.** Nouvelle enquête « Dossier n°24 · Le bracelet aux cœurs roses » :
  - un dossier de vraies pièces (photos, SMS, tickets) ;
  - des auditions-boss et une accusation unique le 24 ;
  - des décors et personnages réalistes, sans plus rien de féerique.
- Prologue réécrit : Célestine raconte au commissariat, le lieutenant Pépin enquête. Écran d'accueil de Lyon sous la pluie, nouveau logo (le bracelet).
- Nouveaux boss : test de vue (Emma), tacos express (Edgar), fiches de révision (Nora), comptoir de pharmacie (Sandrine), métro Bellecour (Valentin).

### 21 novembre 2026
- Ancienne enquête « la Veillée du Grand Chocolat », remplacée depuis.
- Vraie appli de musique : aléatoire sans répétition, file d'attente, favoris, recherche, minuteur, notification. Sur Android, lecteur système (écran verrouillé, casque).

### 20 novembre 2026
- Adaptation complète des tablettes en portrait (plein écran, cases plus grandes).
- Jour 8 « Relie les points » au niveau adulte, puis renommé.
- Les boss se retentent gratuitement à l'infini. Les voix des dialogues ont leur propre canal audio. Générique avec les vrais rôles.
- Gags :
  - fausse mise à jour ;
  - chat ;
  - Pépin qui dort ;
  - lettre recommandée ;
  - commentateur ;
  - parodies de pubs ;
  - mode pitié ;
  - carte de détective ;
  - arrêt maladie ;
  - avis de recherche ;
  - photobomb.
- Fichier mystère obligatoire pour lancer le jeu. Nom de l'appli de l'époque : « Opération Chocolat ».

### 19 novembre 2026
- Menu démarrer :
  - CGU troll, avec le bouton « Je refuse » qui fuit ;
  - 3 emplacements de sauvegarde ;
  - options ;
  - difficulté : Facile, Experte, Célestine, chacune avec sa fin rigolote.
- Cinématiques façon film d'animation (décors en profondeur, personnages animés, sous-titres) et voix « charabia » façon Animal Crossing.
- Carnet d'enquête : plan de Lyon (vraie géographie, zoom), tableau en liège, notes. Bilan de fin d'aventure.
- Mode admin : tester chaque boss et débloquer l'accusation.

### 18 novembre 2026
- Première histoire globale et carnet d'enquête avec 9 suspects.
- Onglet Paramètres : luminosité, taille du texte, vibrations, langue FR/EN, et la blague du Braille.
- Boutique : bon « Valentin ne part pas en Écosse », avec faux paiement.
- Boss final en 4 parties, chacune avec sa musique.

### 17 novembre 2026
- 6 boss (jours 4, 8, 11, 15, 19, 22) qui gardent les 6 vidéos de l'album.
- Boss final contre Valentin (la machine secrète du 24), générique de fin, mode « jeu terminé » (menus dorés).
- Sauvegarde des parties en cours. Mise à jour forcée de l'appli quand une nouvelle version est en ligne.
- Appli Android du suivi (« Suivi Célestine ») et pages d'installation.

### 16 novembre 2026
- Nouvelle version du calendrier : points revus, bons, règles ⓘ, essais, puzzle, suivi en direct.
- Une chanson par mini-jeu (24 titres). Musiques importées sur l'appareil grâce au « fichier mystère » créé par Valentin.
- Coffre à souvenirs : musiques, album, pack de voix. Attaques et cadeaux à distance depuis le site de suivi.

### 14 novembre 2026
- Appli installable :
  - icônes et mode hors-ligne ;
  - écran d'installation et lien unique ;
  - raccourci iPad (profil web clip) ;
  - APK Android construit par GitHub Actions.

### 10 → 13 novembre 2026
- Création du calendrier 2026 (dossier `2026/`) avec ses 24 mini-jeux et leurs indices 💡 personnalisés.
- Gros travail sur « Sauve Célestine » (niveaux, hotte, lave), la tour de cadeaux, les flèches en fuite, le quiz et Colony Flow (qui a remplacé Wordle au jour 2).
- Ajout de Candy Noël, des succès, des missions, des coffres, de l'album, des records et du transfert de progression.

### Novembre 2025
- Premier calendrier (2025), le fichier `index.html` à la racine. Gardé tel quel.
