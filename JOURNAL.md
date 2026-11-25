# Journal des modifications

> **Règle :** toute IA (Claude ou autre) qui modifie le site **ajoute une entrée tout en haut** de ce journal à chaque demande de Valentin : la date, ce qui a changé en français simple, le numéro de version et les fichiers touchés. Elle supprime aussi l'ancienne version de ce qui est modifié et range le code au bon endroit (voir les 3 règles d'or dans `CLAUDE.md`). Lis d'abord `CLAUDE.md`, qui contient la carte du code.

---

## 25 novembre 2026 (16 h 30) : histoire plus naturelle, moins d'indices trop directs (version 1795615188)

- **Prologue :** Pépin prend une déposition normale (« Je prends votre déclaration. Vous l'avez depuis quand ? ») au lieu de « Je ne sais rien de vous, rien de ce bracelet… ». Célestine cite elle-même Valentin parmi les gens vus dans la semaine : Pépin ne demande plus « quelqu'un qui a les clés de chez vous ? ». « Noté quand même… c'est ce qui m'intrigue » devient « Je note tout le monde, c'est la procédure. »
- **Retiré parce que ça désignait trop Valentin :**
  - sa fiche ne dit plus « Il vit avec elle, donc forcément… » ;
  - jour 17 : « J'ai demandé à Gérald qui pouvait entrer chez vous » ;
  - la veille : « Êtes-vous vraiment sûre de l'avoir mis dans votre trousse ? » et « quelqu'un regarde l'heure… et sourit » ;
  - le fax du 24 : la silhouette « Elle ne va quand même pas… » et « Si. » ;
  - la scène du SMS masqué du jour 13 (« Il est entre de bonnes mains ») ;
  - jour 22 : « Il me regarde à peine… » et « Un truc pour moi. Je note. » ;
  - l'accusation d'Eya : « quelqu'un soupire de soulagement… ».
- **Retiré parce que trop « too much » :** les répliques de Pépin au casino (« je ne suis pas là, en civil et en pause ») et « Surtout ce qui a l'air bête ».
- Gardé à la demande de Valentin : « Votre mère aussi, donc », « Officieusement… je m'ennuie », la pause pub du prologue et « Gardez-le en tête » au labo.
- Fichiers : `2026/js/histoire.js`, `2026/js/menu-demarrer.js` (scène `mid` retirée de `storyCheck`), `2026/js/enquete/suspects-pieces.js`, `2026/js/langue-anglais.js`.

## 25 novembre 2026 (16 h 15) : fausses mises à jour réalistes au lancement (version 1795614665)

- Nouvelle **fausse mise à jour**, sérieuse cette fois (pas de blague). Elle doit faire croire que Valentin travaille toujours sur l'appli.
- **Quand :** seulement quand Célestine reprend une partie en cours depuis le menu (« Continuer »), jamais pendant le jeu ni pour une nouvelle partie. Une chance sur trois environ, et au plus une fois toutes les 18 h.
- **Ce qu'elle montre :** une fenêtre façon iPhone avec l'icône de l'appli, « Mise à jour disponible », « Dossier n°24 · version 2.4.x · 2 à 5 Mo », 3 nouveautés crédibles tirées au hasard, une barre de téléchargement en Mo, puis « Installation… » et « Redémarrage… ». Ensuite la partie s'ouvre normalement. Le numéro de version augmente à chaque fois.
- **Suivi :** chaque fausse mise à jour est notée dans le suivi (🎭).
- Nouveaux champs de sauvegarde : `S.majT` (date de la dernière) et `S.majV` (compteur de versions).
- Fichiers : `2026/js/gags.js` (`majFausse`, liste `MAJN`), `2026/js/menu-demarrer.js` (branchement au lancement), `2026/css/12-gags.css`, `2026/js/langue-anglais.js`.

## 25 novembre 2026 (16 h) : 4 gags supprimés (version 1795614413)

- Supprimés complètement, à la demande de Valentin :
  - la **fausse mise à jour** « Célestine 2.0 » ;
  - les **commentaires** de Pépin pendant les mini-jeux ;
  - le **mode pitié** avec le lutin au pansement 🩹 après 3 échecs ;
  - le **lutin qui tombe** quand on secoue le téléphone pendant un jeu.
- Leur code (`js/gags.js`), leurs styles (`css/12-gags.css`, 31 règles) et leurs 28 traductions anglaises (`js/langue-anglais.js`) sont retirés. Les gags restants sont renumérotés de 1 à 8. Le champ `S.funD` de la sauvegarde est gardé.
- Fichiers : `2026/js/gags.js`, `2026/css/12-gags.css`, `2026/js/langue-anglais.js`, `CLAUDE.md`.

## 25 novembre 2026 (15 h 45) : main des « ongles finis » retouchée (version 1795614008)

- Main de Célestine : la bosse à gauche de l'index est enlevée, les doigts sont moins écartés (ils se rejoignent à la base, plus de vide entre eux) et environ 15 % plus courts.
- Fichiers : `2026/js/enquete/suspects-pieces.js`.

## 25 novembre 2026 (15 h 30) : jonction main-doigts refaite (version 1795613874)

- Main des « ongles finis » : les doigts sont dessinés d'abord, puis la paume par-dessus. Elle remonte entre les doigts avec des creux arrondis et marque les jointures, au lieu de doigts posés sur une paume plate. Le pouce part aussi de l'intérieur de la paume.
- Fichiers : `2026/js/enquete/suspects-pieces.js`.

## 25 novembre 2026 (15 h 15) : main des « ongles finis » redessinée (version 1795613762)

- La main de Célestine sur la photo « Les ongles finis » est refaite avec des proportions naturelles : doigts longs et fins qui s'affinent vers le bout, légèrement écartés, phalanges, pouce bien attaché, paume plus étroite. Le poignet et le bracelet ne changent pas.
- Fichiers : `2026/js/enquete/suspects-pieces.js`.

## 25 novembre 2026 (15 h) : vraies têtes sur les photos-indices, nouvelle main au bracelet (version 1795613672)

- Les personnes des photos-indices (BU, resto, Emma au resto, TP, selfie de 7 h 51) ont maintenant leur **vraie tête**, au lieu d'un visage dessiné. Les têtes sont détourées (fond retiré), redressées (Emma, Nora, Erika et Eya penchaient), les yeux sont alignés au même endroit, et le cou dessiné prend la couleur de leur vraie peau. Le fondu ne reste que sous le menton.
- Les 6 têtes détourées sont de nouveaux fichiers : `media/persos/detoures/<prénom>.webp` (chemins dans `PHTETE`, `js/medias.js`). Elles ont été faites à partir des photos de `media/persos/` avec l'outil de détourage `rembg`, puis nettoyées à la main (zone autour de la tête, redressement selon les yeux).
- La main de la photo « Les ongles finis » est redessinée : poignet fin, main séparée du poignet, pouce, phalanges, ongles baby pink brillants, et le bracelet qui fait le tour du poignet.
- L'ancien code des visages dessinés (coiffures, yeux, lunettes…) est supprimé. `phPerso` ne dessine plus que le corps et pose la vraie tête.
- Fichiers : `2026/js/enquete/suspects-pieces.js`, `2026/js/medias.js`, `2026/js/fichiers.js`, `2026/media/persos/detoures/` (6 fichiers).

## 25 novembre 2026 (14 h 30) : nouveaux dessins pour toutes les photos-indices (version 1795612358)

- Les 11 dessins des pièces du dossier sont refaits, plus détaillés et plus jolis : lumière, ombres, vrais visages dessinés (yeux, cheveux, vêtements), décors complets (bibliothèque de la BU, resto en briques avec guirlande, labo de TP, salle de bain carrelée), interface façon Instagram ou Snapchat, horodatages.
- Concernés : le bracelet dans son écrin, le sac vidé, le vide-poche, la story de Noémie, les ongles finis, le selfie de la BU, le resto, Emma avec le sac, la photo de TP, le selfie de 7 h 51 et l'agrandissement du Dr Rodolphe (qui montre maintenant aussi la trace de colle du cœur recollé par Noémie).
- Les anciens dessins (`HEARTS`, `CHAIN` et l'ancien `PH`) sont supprimés. Les nouvelles petites fonctions de dessin s'appellent `phPerso`, `phBracelet`, `phCoeur`…
- Fichiers : `2026/js/enquete/suspects-pieces.js`.

## 25 novembre 2026 (11 h 20) : les 3 règles d'or dans CLAUDE.md (version 1795601827)

- `CLAUDE.md` : ajout en tête des règles des « 3 règles d'or » à appliquer à chaque demande : supprimer l'ancienne version, noter la modification en haut de ce journal avec le numéro de version, ranger le code au bon endroit.
- En-tête de ce journal mis à jour dans le même sens. Rien ne change dans le calendrier.
- Fichiers : `CLAUDE.md`, `JOURNAL.md`.

## 25 novembre 2026 (fin de matinée) : ménage des anciennes vidéos

- Supprimé des sources : l'ancienne version « illustrée » de Tenerife (`outils/videos/4-tenerife/tenerife.html`) et le dossier `versions/` (deux copies .mp4). Seule la version BD, celle de l'album, reste. Rien ne change dans le calendrier.
- Vérifié : plus aucune trace des vidéos « boules de neige » et « bouquet » dans le site.
- `CLAUDE.md` : nouvelle règle n°9, « quand une vidéo est remplacée, supprimer l'ancienne partout ».
- Fichiers : `outils/videos/4-tenerife/` (render.py, decors.js, LISEZMOI.md), `CLAUDE.md`.

## 25 novembre 2026 (après-midi) : tout se débloque dans l'ordre chronologique

- **Vidéos :** elles ne sont plus liées à un boss précis. Le 1er boss vaincu, quel qu'il soit (boss final compris), débloque la 1re vidéo, le 2e boss la 2e, et ainsi de suite. Liste remise dans l'ordre chronologique : Tenerife, crêpe, ski, slow, tour du monde, papy. Le boss final compte comme un boss et affiche la nouvelle vidéo s'il en débloque une.
- **Photos :** rien à changer, elles se révélaient déjà dans l'ordre de l'album (chaque jour réussi révèle la photo suivante).
- Fichiers : `js/contenu.js`, `js/album.js`, `js/boss/boss-final.js`, `CLAUDE.md`.

## 25 novembre 2026 (matin) : Tenerife dans l'album, en version BD, au 29 août

- Valentin a choisi la **version « comme les autres vidéos »** (vos visages en photo, des bulles). Elle remplace la version illustrée dans `2026/videos/4-tenerife.mp4`, avec une nouvelle miniature `.jpg` (le coucher de soleil). La version illustrée est gardée dans `outils/videos/4-tenerife/versions/4-tenerife-style-illustre.mp4`.
- Date de la vidéo : **29 août 2026** (`2026/js/contenu.js`), avec sa traduction anglaise.
- Pour rappel, déjà en place : la vidéo du ski remplace la bataille de boules de neige, et le lancer du bouquet n'est plus dans l'album.

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
