# Dossier n°24 · Le bracelet au cœur rose

Calendrier de l'Avent 2026 fait par Valentin pour sa copine Célestine : une enquête policière à Lyon. Il y a 24 cases, avec un mini-jeu par jour, 6 boss (des auditions de suspects), un boss final contre Valentin, un album photo, des œufs cachés, une boutique, un casino et un labo.

- **Site :** https://valentinrey-cmd.github.io/calendrier-avant-celestine/2026/
- **Version de test :** https://valentinrey-cmd.github.io/calendrier-avant-celestine/test/. Elle utilise **les mêmes fichiers** que le site, avec `?test` : les 24 cases sont ouvertes, le bouton 🧪 est là, la sauvegarde est séparée et le suivi passe par le salon « t ».
- **Pour qui :** Célestine, sur sa tablette Apple, son téléphone et un PC (iPad/iPhone via un raccourci sur l'écran d'accueil, Android via l'APK).
- **Valentin ne code pas :** il décrit les changements en français, et l'IA fait tout.

## ⚠️ Règles pour toute IA qui travaille sur ce projet (Claude ou une autre)

> **Les 3 règles d'or de Valentin, à appliquer à CHAQUE nouvelle demande, même petite :**
> 1. **Supprimer l'ancienne version.** Quand quelque chose est modifié ou remplacé (vidéo, photo, jeu, texte, fonction, style…), l'ancienne version disparaît complètement du projet : fichiers, lignes de code, traductions, sources dans `outils/`. On ne garde ni copie, ni code mort, ni dossier « versions ».
> 2. **Noter la modification tout en haut de `JOURNAL.md`**, juste sous la règle, avant les entrées plus anciennes : la date, ce qui a changé en français simple, le numéro de la nouvelle version et les fichiers touchés. Une entrée par demande.
> 3. **Ranger le code au bon endroit**, en suivant le tableau « Où mettre le code » et la carte plus bas. Pas de nouveau fichier si un fichier existant correspond, et tout nouveau fichier est ajouté dans `2026/js/fichiers.js`.

1. **Commence par lire ce fichier et les dernières entrées de [`JOURNAL.md`](JOURNAL.md).** Ne relis pas tout le code : la carte ci-dessous dit où se trouve chaque chose. Ouvre seulement les fichiers concernés (`grep -rn` est ton ami).
2. **Après CHAQUE modification, ajoute une entrée en haut de `JOURNAL.md`** : la date, ce qui a changé (en français simple), le numéro de version et les fichiers touchés. C'est obligatoire, même pour une petite correction, et que tu sois Claude ou une autre IA. C'est ce qui permet à la prochaine session de reprendre vite.
3. **Change le numéro de version à chaque modification**, avec le même nombre dans `2026/index.html` (`const APPV='…'`) et dans `2026/version.json`. La commande la plus simple est `python3 outils/verifier.py --nouvelle-version`. Sans ça, les applis de Célestine ne se mettent pas à jour toutes seules.
4. **Lance `python3 outils/verifier.py` avant de pousser.** Il vérifie la version, la liste des fichiers, les noms en double et la syntaxe.
5. **Nouveau fichier JS, CSS ou média ? Ajoute-le dans `2026/js/fichiers.js`**, au bon endroit, car l'ordre compte. `index.html` et le mode hors-ligne (`sw.js`) lisent cette liste.
6. **Ne change rien de ce que Célestine voit sans que Valentin l'ait demandé.**
7. **Ne touche pas à `2026/avent.apk` ni à `suivi/suivi.apk`.** Ils sont refaits automatiquement par GitHub Actions à chaque push (commits « APK Android mis à jour [skip ci] »).
8. Écris les messages de commit en français, courts, dans le style de l'historique, par exemple `Air hockey : 5 buts gagnants`.
9. **Quand une vidéo (ou une photo, un jeu…) est remplacée, supprime l'ancienne partout** : ses fichiers dans `2026/videos/` ou `2026/media/`, sa ligne dans `js/contenu.js` ou `js/medias.js`, sa traduction dans `js/langue-anglais.js`, et ses sources dans `outils/videos/`. Ne garde aucune ancienne version dans le projet.
10. Pousse directement sur `main`, sauf si Valentin demande autre chose. Le site se met à jour tout seul sur GitHub Pages.

## Comment le code est fait (à savoir avant de modifier)

- **Pas de framework ni de compilation :** c'est du HTML, du CSS et du JavaScript « classique ». Les fichiers sont chargés dans l'ordre de `2026/js/fichiers.js`. Tous partagent les **mêmes variables globales** : une fonction de `calendrier.js` peut appeler une fonction de `labo.js`.
- **L'ordre de chargement compte :** du code qui s'exécute *au chargement*, en dehors d'une fonction, ne peut utiliser que ce qui a été chargé avant lui. Dans une fonction appelée plus tard, tout est disponible.
- **Deux fichiers ne peuvent pas déclarer le même nom global** (`const`, `let`, `function`). `outils/verifier.py` le vérifie.
- **Style :** le code est formaté avec Prettier (`printWidth 140`, guillemets simples). Les noms de variables sont courts et datent de l'écriture d'origine. Garde-les et ne renomme pas pour le plaisir.
- **Textes :** tout est en français dans le code. La langue anglaise (Paramètres → Langue) traduit les textes à l'affichage grâce au dictionnaire `js/langue-anglais.js`, où la clé est le texte français exact. Si tu changes un texte, tu peux ajouter sa traduction. La « langue » Braille est une blague qui convertit tout.
- **Sauvegarde :** l'état de la partie est l'objet global **`S`**, enregistré dans `localStorage` par `save()` (voir `js/etat.js`). La vraie partie utilise la clé `avent_v5`, la version de test `avent_test`, et il y a 3 emplacements de sauvegarde. **N'efface jamais un champ de `S`** : Célestine a peut-être déjà une partie en cours. Pour tout remettre à zéro sur tous les appareils (seulement si Valentin le demande), change la date `REMISE_A_ZERO` dans `js/config.js`.
- **Suivi en direct :** `syncLive()` et `slog()` envoient l'avancement de Célestine sur Firebase. Valentin le regarde avec l'appli « Suivi Célestine » (`suivi/`). Depuis le suivi, il peut aussi lancer des attaques du pickpocket et envoyer des cadeaux (`js/pickpocket.js`).
- **Le bracelet :** c'est le vrai bracelet offert par Valentin (Histoire d'Or, « Carpantus », plaqué or, maille forçat, **un seul cœur rose** taillé et serti griffes, fermoir mousqueton). Toute l'enquête s'appuie sur ce bracelet à un cœur : le faux de Vinted a un cœur plat qui pend à un gros anneau, et Noémie a recollé le cœur sorti de ses griffes (trace de colle). Ne parle plus de « 5 cœurs ».
- **Fichier mystère et musiques :** le fichier mystère n'est demandé qu'une fois par appareil (marque `avent_mysok` dans le localStorage, posée par `mysLire` ; `mysGate` dans `js/menu-demarrer.js` ne bloque plus jamais après). Les musiques sont gardées par `MDB` (`js/musiques-jeux.js`) : dans l'appli Android, dans les fichiers privés de l'appli (pont `AventAndroid.musBegin/musChunk/musEnd/musList/musDel`, lues par l'adresse `…/2026/__mus/<clé>` servie par `shouldInterceptRequest` dans `MainActivity.java`), car le stockage de la page se vidait aux mises à jour ; ailleurs, dans IndexedDB. Si elles ont disparu malgré tout, le suivi reçoit « ⚠️ Musiques du fichier mystère disparues… » avec le détail du stockage.
- **Médias :** les photos, images et voix sont de vrais fichiers dans `2026/media/`. Leurs chemins sont regroupés dans `js/medias.js`, et dans `js/contenu.js` pour les photos du mémo et les voix. Les vidéos sont dans `2026/videos/`.

## Où mettre le code pour chaque type de modification (recettes)

Avant d'écrire du code, choisis l'endroit selon ce tableau. **Ne crée pas de nouveau fichier si un fichier existant correspond.**

| Modification demandée | Où et comment |
|---|---|
| Changer un texte, une réplique, un dialogue | Le texte est dans le fichier de la fonctionnalité (voir la carte). Pour le trouver : `grep -rn "début du texte" 2026/js`. Ajoute aussi la traduction dans `js/langue-anglais.js`. |
| Ajouter ou modifier une scène de l'histoire (Pépin, rapports, accusations…) | `js/histoire.js`, dans l'objet `STORY`. Une scène = `{ t: titre, sc: décor, p: suspect affiché, l: [répliques] }`. Une réplique = `[qui, texte, { fx: effet }]`, où `qui` vaut `n` (narration), `c` (Célestine), `v` (Valentin), `e` (Pépin) ou `b` (le suspect de `p`). Les décors (`sc`) sont `pole`, `audit`, `fac`, `night`, `ecully`, `pharma`, `salon`. Les effets (`fx`) sont `cin`, `vin`, `ein`, `bin` (faire entrer quelqu'un), `shake`, `clue`, `glow`, `pop:🎁` (un objet en gros plan), `sus:id` et `out:id` (fiche du suspect, « INNOCENT·E »), `shadow`, `peek` et `run:🚗`. Pour qu'une scène se déclenche toute seule, ajoute sa clé dans `STORD` et la condition dans `storyCheck()` (`js/menu-demarrer.js`). |
| Les scènes quand on accuse la mauvaise personne | `js/histoire.js`, clés `acc_noemie`, `acc_emma`… (une par suspect). `acc_valentin` est la bonne accusation. Le lancement est dans `accuseGo()` (`js/enquete/dossier-accusation.js`). |
| Régler un mini-jeu (temps, difficulté, objectif) | La ligne du jour dans `DAYS` (`js/jours.js`), champ `p`. Pour les règles affichées : `RULES` dans le même fichier. |
| Changer le fonctionnement d'un mini-jeu | `js/jeux/jXX-….js` (XX = jour). Chaque fichier définit `GAMES.nom = function (p, el, win, fail) {…}`. |
| Remplacer un mini-jeu par un nouveau | Crée `js/jeux/jXX-nouveau-nom.js` avec `GAMES.nouveaunom = function…`, change `g:` (et `t:`, `p:`) du jour dans `DAYS`, retire l'ancien fichier, puis mets à jour la liste dans `js/fichiers.js`. |
| Régler un boss d'audition | Réglages (PV, vies, temps) : `bossCfg()` dans `js/boss/boss.js`. Règles affichées : `BRULES` dans le même fichier. Le jeu lui-même : `js/boss/jXX-….js`. Les aveux obtenus : `AUD` et `PIECES` (aveux `a4`, `a8`…) dans `js/enquete/suspects-pieces.js`. |
| Le boss final | `js/boss/boss-final.js`. Les scènes entre les parties sont dans `LORE`, les 4 parties dans `PARTS`. |
| Ajouter une pièce au dossier d’enquête | `PIECES` dans `js/enquete/suspects-pieces.js` (`d:` = jour où elle arrive ; `k:` = type : `photo`, `sms`, `doc`, `tab`, `agd` pour un agenda de semaine, `lettre`…). Les dessins des photos sont dans `PH`, dans le même fichier (fonctions `phPerso` pour un personnage avec sa vraie tête détourée de `media/persos/detoures/`, `phBracelet` pour le bracelet, `phStory` pour un en-tête de story). |
| Un détail à repérer en touchant une photo du dossier | `PHZ` dans `js/enquete/suspects-pieces.js` : `[x, y, rayon, ce que Célestine remarque]`, en pixels du dessin (320 × 220). Les détails trouvés sont dans `S.det`. Règle : une légende ou une réplique de Pépin ne donne jamais la conclusion, Célestine doit la trouver. |
| Photos de l'album, légendes, chapitres | `CONTENU.album` dans `js/contenu.js`. Les fichiers photo vont dans `media/album/` et leur chemin dans `ALIMG` (`js/medias.js`). |
| Vidéos de l'album | Les fichiers `.mp4` et `.jpg` (miniature) vont dans `2026/videos/`. Leur liste (titre, date, chapitre) est dans `CONTENU.videos` (`js/contenu.js`), dans l'ordre chronologique : n'importe quel boss vaincu (boss final compris) débloque la vidéo suivante de la liste (`vidN()` dans `js/album.js`). Les photos se révèlent de la même façon : chaque jour réussi révèle la photo suivante de l'album (`alRev()`). Les vidéos sont des dessins animés fabriqués par programme : leur source est dans `outils/videos/` (voir le `LISEZMOI.md` de chaque dossier). |
| Ajouter une image, une photo ou un son | Mets le fichier dans `2026/media/…`, son chemin dans `js/medias.js` (ou `js/contenu.js`), **et** dans la liste `medias` de `js/fichiers.js`. |
| Musique d'un écran, bruitage | Musique synthétisée : `js/musique.js`. Chansons du jour et lecteur : `js/musiques-jeux.js`. Petits bruits d'interface : `SFX` dans `js/sons.js`. Bruits des cinématiques : `CINE.sfx` dans `js/cinematiques.js`. |
| Le fichier mystère : la scène « Lancer » sur le toit | Tout est dans `mysLancer()` (`js/musiques-jeux.js`), ses styles `.mysl-…` dans `css/06-boss-playlist.css`. **Célestine et Valentin y sont des figurines 3D** faites avec Meshy (`3d/toit-celestine.glb`, `3d/toit-valentin.glb`, une animation par geste : repos, marche, course, lancer, ramasse, envol, allongee, releve, chute, boude, glisse, danse, joie, salut, equilibre, vide ; Valentin : repos, marche, course, ramasse, lancer, charge, rire, tombe, danse, salut), dessinées par `FIG3D` (`js/toit-figurines-3d.js`, moteur three.js `3d/moteur-3d.min.js` chargé à l'ouverture du toit) avec exactement la caméra du jeu ; `geste3D()` choisit le geste et son avancement selon l'état du personnage (chute du toit : `equilibre` au bord, `vide` en l'air, `allongee` en bas), `figurine3D()` les dessine. Le fichier tenu en main est un vrai objet 3D (`objet()` dans `FIG3D` : une boîte avec le dessin du fichier sur ses faces, fait par `texFichier()`/`faceF()` dans `mysLancer`, serrée dans la moufle droite, face en biais vers la caméra), et la position de la main sert au lancer (`C.main3`, utilisé par `main()`). Caméra « à la Fortnite » : derrière elle à hauteur d'épaule, décalée sur sa droite (`cible.d`, `cible.ep`, plus près quand elle vise), et elle se replace toute seule derrière elle quand elle avance (dans `marche()`, sauf si on tourne la vue au doigt). Si la 3D ne se charge pas, les personnages dessinés ci-dessous reviennent tout seuls. Pour ajouter un geste : Meshy `animate` sur la tâche de squelette, puis l'ajouter au .glb avec les autres (animations « sur place », bassin fixe). Version de test : `window.__toit` donne accès aux personnages pour tester les gestes. Repères : caméra `V` (+ `h` hauteur, `p` inclinaison) et projection `P()`/`poly()` ; personnage dessiné (de secours) `celestine()` avec ses couleurs dans `TENUE` ; bras articulés `bA()` (angles) et `resout()` (coude calculé, bras hors du corps) ; toutes les poses dans `poses()` ; déplacement `marche()`, saut-tir `saut()`, chute du toit `chute()` ; danse de victoire `danse()` ; obstacles `OBS`, traîneau `traineau3D`, vent `VENT`, étoile `ETOILE`, Valentin `VAL` sur `toitVoisin()` (son toit est solide pour le fichier : `surVoisin()` ; il court le chercher, ou l'attrape au vol, charge sa « patate » (aura `aura()`) et la tire sur Célestine : `valRelance()` ; touchée, elle s'envole et s'écrase façon manga : `renverse()`/`ko()` (phases stop → vol → glisse → sol → releve → secoue, zone libre `libre()`), effets `mangaFx()`, étoiles `etoilesKO()`, traînée de feu `trainee()`), ville du bas `VILLE`/`villeBas()` ; secrets `SECRETS` ; boîte aux lettres (choisir un fichier sur le téléphone) `choisir()`/`apparence()` (`vis.ok` = vrai fichier mystère, sinon `recrache()` et `suie()` le noircissent) ; records `REC`/`record()` (dans `S.mysRec`) ; chat de la cheminée `CHAT`/`chatMaj()`/`chatDessin()` ; pigeons `PIG`/`pigeons()` ; pigeons en vol en vraie 3D `pigeonVol()` ; replay du tir gagnant `HIST`/`replayPrepare()`/`replay()` (plans `camPlan()`, ralenti `vitesse()`), habillage `habillage()`/`volet()`, puis `fete()`. Le menu ouvre le toit les mains vides avec `mysToit()`. Rendu de la neige au sol : `neigeToit()` → `neigeSol()` (dégradé, reflet de lune `luneCap()`, congères `DERIVES`, tuiles, ombres portées, flaques de lumière `flaque()`, paillettes `PAILLETTES`) et `corniche()` (bourrelet + stalactites `GLACONS`) ; traces `empreintes()` (relief `creux()`, `chemin()`, ange en `eventail()`) ; neige qui tombe `neige()` (+ flocons flous `flou`) ; ciel `ciel()` (lueur de la ville, `LAMPADAIRES` dans le vide, halo, `NUAGES`) ; halos en cache `haloEn()` ; `brume()` et `ambiance()` (vignette) ; buée, neige soufflée et braises dans la boucle. |
| Les objets en 3D (bracelet, pièces à conviction, vitrine des Trésors) | Modèles faits avec Meshy, allégés (moins de polygones, textures WebP 1024 px), dans `2026/3d/` et listés dans `FICHIERS.modeles3d` (`js/fichiers.js`, le 1er fichier reste l'afficheur `model-viewer.min.js`). Tout le reste est dans `js/vue-3d.js` : la liste des objets `OBJ3D` (fichier, titre, angle de caméra, détails à trouver `[x, y, z, texte]`, gravure `grav`), le chargement de l'afficheur à la demande `v3Charge()`, la fenêtre `vue3d(id, {retour, grav, s2})`, le toucher des détails `v3Toucher()` (gardés dans `S.det` avec la clé `v3_…`) et la carte de la gravure du boss final `v3Gravure()` avec son plan de cinéma `v3Film()` (caméra qui tourne puis plonge sur la plaque gravée). Le bracelet a deux fichiers : `bracelet.glb` (pendant l'enquête, sans plaque) et `bracelet-grave.glb` (après le boss final, `fg` dans `OBJ3D` : la même chose + une petite plaque « ♥ 03.07.2025 ♥ » fabriquée par programme dans `outils/3d-plaque/`, voir son `LISEZMOI.md`). Animations : paillettes et flash `v3Eclat()`, arrivée d'un nouveau souvenir `v3Arrivee()` (il tombe en rebondissant ; c'est la caméra qui tourne, ne pas changer `orientation` du modèle, model-viewer plante). Figurines animées de Célestine et Valentin (`figCelestine`, `figValentin`) : personnages faits avec Meshy à partir de leur photo, avec squelette ; plusieurs animations dans un seul fichier (`anim` = [nom, bouton], changées par `v3Anim()`). Pour ajouter une animation : Meshy `animate` sur la tâche de squelette, puis réunir les animations dans un seul .glb. Bouton « Voir en 3D » sous une photo du dossier : `PH3D` (`js/enquete/suspects-pieces.js`). Vitrine : `VITRINE` / `vitrineHTML()` (`js/tresors.js`) : `[objet, emoji, boss vaincus qu'il faut ou 'fin']` ; un souvenir pas encore ouvert est « nouveau » (absent de `S.v3Vus`). Styles `.v3-…` dans `css/08-dossier.css`. Pour trouver la position `[x, y, z]` d'un détail, il faut ouvrir le modèle et toucher l'endroit (`positionAndNormalFromPoint` de model-viewer). |
| Boutique, roue, casino, labo, succès | Le fichier du même nom (voir la carte). Les articles de la boutique sont dans `SHOP` (`js/jours.js`). |
| Un nouveau gag | `js/gags.js` (ses styles dans `css/12-gags.css`). |
| Un nouvel écran ou onglet | La vue va dans un nouveau fichier `js/nom.js` (ajouté dans `fichiers.js` **avant** `js/demarrage.js`). Inscris-la dans `render()` (`js/interface.js`) et ajoute le bouton d'onglet dans `index.html` si besoin. |
| Un style (couleur, taille, animation) | Cherche la classe avec `grep -rn "classe" 2026/css` et modifie la règle existante. Un nouveau style se met dans le fichier CSS du même thème. |
| Une nouvelle donnée à sauvegarder | Ajoute un champ à `S` (par exemple `S.monChamp = …; save();`). Ne renomme ni n'efface les champs existants. |

## Carte : où trouver quoi (dossier `2026/`)

| Je veux changer… | Fichier |
|---|---|
| La version (à chaque modif) | `index.html` (APPV) + `version.json` |
| La liste et l'ordre des fichiers | `js/fichiers.js` |
| Les réglages vraie version / version de test | `js/config.js` |
| L'album photo (chapitres, légendes), les vidéos, la playlist, le code secret | `js/contenu.js` |
| Les chemins des images et des photos | `js/medias.js` |
| Les 24 cases : nom du jeu, réglages, difficulté, règles, boutique, roue | `js/jours.js` (`DAYS`, `RULES`, `SHOP`…) |
| Un mini-jeu précis | `js/jeux/jXX-nom.js` (XX = numéro du jour) |
| Le moteur des niveaux de « Sauve Célestine » (jour 22) | `js/jeux/j22-sauve-celestine-moteur.js` |
| Le déroulement d'un jeu (essais, chrono, victoire, échec, indices, sauvegarde de partie) | `js/jeu-du-jour.js` |
| Les boss (liste, règles, PV, lancement, K.O.) | `js/boss/boss.js`, `js/boss/lancement.js` |
| Un boss précis | `js/boss/j04-noemie-combat.js`, `j08-emma-test-de-vue.js`, `j11-edgar-tacos.js`, `j15-nora-fiches.js`, `j19-sandrine-comptoir.js`, `j22-valentin-metro.js` |
| Le boss final contre Valentin (4 parties, scènes, générique) | `js/boss/boss-final.js` |
| L'histoire : scènes du lieutenant Pépin, prologue, rapports, épilogue | `js/histoire.js` (`STORY`, ordre dans `STORD`) |
| Le moteur des cinématiques (décors, personnages, voix « charabia », ouverture des cases) | `js/cinematiques.js` |
| L'enquête : suspects, pièces du dossier, auditions et aveux | `js/enquete/suspects-pieces.js` (`SUSP`, `PIECES`, `AUD`) |
| Le plan de Lyon, le tableau en liège, les notes | `js/enquete/plan-liege-notes.js` |
| L'affichage du dossier, le carnet, l'accusation | `js/enquete/dossier-accusation.js` |
| Le bilan de fin d'aventure | `js/enquete/bilan.js` |
| Le menu de démarrer (écran titre, CGU, sauvegardes, difficulté, options) | `js/menu-demarrer.js` |
| Le calendrier (grille des cases, ouverture d'une case) | `js/calendrier.js`, aide : `js/aide-calendrier.js` |
| Le puzzle (formulaire d'accusation en 24 morceaux) | `js/puzzle.js` |
| Les points, la navigation entre onglets, les popups, les toasts | `js/interface.js` |
| La date, la sauvegarde, la synchro du suivi | `js/etat.js` |
| La boutique / la roue et le casino / le labo | `js/boutique.js` / `js/roue-casino.js` / `js/labo.js` |
| Les succès | `js/succes.js` |
| Les œufs cachés (indices, dessins, panier) / le niveau secret | `js/oeufs-indices.js`, `js/oeufs.js` / `js/niveau-secret.js` |
| Les records, missions, coffres, tutos, transfert de progression | `js/records-missions-transfert.js` |
| L'album photo (livre, pages, zoom) / les vidéos de l'album | `js/album.js` / `js/album-videos.js` |
| La musique d'ambiance (synthétisée) / les chansons du jour, le fichier mystère, le lecteur | `js/musique.js` / `js/musiques-jeux.js` |
| Les bruitages / la playlist et le pack de voix | `js/sons.js` / `js/playlist-voix.js` |
| Les gags (chat, pubs, carte de détective, arrêt maladie de Pépin…) | `js/gags.js` |
| Les Trésors (onglet 🎁) / les Paramètres | `js/tresors.js` / `js/parametres.js` |
| Le mode admin (toucher 7 fois la photo en haut à gauche, puis code 2412) | `js/admin.js` |
| L'écran d'installation de l'appli | `js/installation.js` (+ page `app.html`, qui propose aussi de télécharger le fichier mystère : elle lit le lien `mysLien` dans `js/contenu.js`) |
| La neige, les confettis | `js/neige-confettis.js` |
| L'adaptation téléphone / tablette | `js/ecran.js` |
| La mise à jour automatique de l'appli | `js/mise-a-jour.js` |
| Le lancement final (dernière ligne exécutée) | `js/demarrage.js` |
| Les petites fonctions communes (`$`, `esc`, `shuffle`) | `js/outils.js`, `js/jeux/_aides.js`, `js/boss/_aides-dessin.js` |
| Les styles | `css/01-base.css` … `css/13-tablettes.css`, dans l'ordre d'origine. Pour trouver une classe : `grep -rn "nom-de-classe" 2026/css` |

**Jeux par jour :**
- 1 Memorizotto
- 2 Colony Flow
- 3 Mots mêlés pimentés
- 4 Flappy Célestine (boss : Noémie)
- 5 La hutte de Panoramix
- 6 Air hockey contre Valentin
- 7 Zip
- 8 Bulles d'indices (boss : Emma)
- 9 Flèches en fuite
- 10 Picross
- 11 Simontagne (boss : Edgar)
- 12 Le sudokunnilingus
- 13 Œil de lynx
- 14 La tour de cadeaux
- 15 Block blaster (boss : Nora)
- 16 Notre mot fléché
- 17 Libère la voiture
- 18 Candy Noël
- 19 2048 (boss : Sandrine)
- 20 Les 7 différences
- 21 Relier les points
- 22 Sauve Célestine (boss : Valentin)
- 23 Tu me connais par cœur ?
- 24 Puzzle final, puis l'accusation et le boss final

## Autres dossiers

- `test/index.html` : une simple redirection vers `2026/?test`.
- `suivi/` : le site et l'appli de suivi de Valentin. `suivi/installer/` sert à installer l'APK du suivi.
- `android/` : l'appli Android du calendrier, une WebView qui ouvre le site. Hors connexion, elle affiche la copie de `2026/` intégrée à l'APK.
- `android-suivi/` : l'appli Android du suivi.
- `.github/workflows/` : la construction automatique des deux APK.
- `index.html` (à la racine) : **l'ancien calendrier de 2025**. On le garde, n'y touche pas.
- `2026/3d/` : les objets 3D et l'afficheur model-viewer (voir la ligne « objets en 3D » du tableau). Ils ne sont pas chargés au démarrage.
- `outils/3d-plaque/` : le script qui fabrique la plaque gravée du bracelet 3D.
- `outils/verifier.py` : les vérifications avant commit.
