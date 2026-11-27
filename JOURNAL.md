# Journal des modifications

> **Règle :** toute IA (Claude ou autre) qui modifie le site **ajoute une entrée tout en haut** de ce journal à chaque demande de Valentin : la date, ce qui a changé en français simple, le numéro de version et les fichiers touchés. Elle supprime aussi l'ancienne version de ce qui est modifié et range le code au bon endroit (voir les 3 règles d'or dans `CLAUDE.md`). Lis d'abord `CLAUDE.md`, qui contient la carte du code.

---
## 2026-11-27 · Fichier mystère : les musiques restent sur l'appareil, même après avoir fermé l'appli
- **Problème** : après avoir ouvert le fichier mystère, les musiques marchaient. Mais une fois l'appli fermée puis rouverte, le jeu ne redemandait pas le fichier et les musiques ne se lançaient plus. Cause : sur iPad et iPhone, Safari n'arrive plus à relire un fichier audio rangé tel quel dans le stockage de l'appareil (IndexedDB) après une relance (bug connu de WebKit).
- **Correction du rangement** (`MDB`, `js/musiques-jeux.js`) : les musiques sont maintenant rangées en données brutes et redeviennent des fichiers audio à chaque lancement. Les musiques déjà rangées à l'ancienne sont converties automatiquement si elles se lisent encore, sinon elles sont retirées.
- **Correction de la demande du fichier** (`mysGate`, `js/menu-demarrer.js`) : au lieu d'une marque « déjà ouvert », le jeu vérifie à chaque lancement que les musiques sont vraiment sur l'appareil. Le fichier n'est donc demandé qu'une fois, au premier lancement sur un nouvel appareil, et redemandé seulement si l'appareil a perdu les musiques. L'ancienne marque (`…_mys` dans le localStorage) n'est plus utilisée et son code est supprimé.
- Sur un iPad ou un iPhone où le fichier avait déjà été ouvert avec l'ancienne version, il sera sans doute redemandé une dernière fois. Ensuite, il ne le sera plus.
- Version : 1795786846
- Fichiers : `2026/js/musiques-jeux.js`, `2026/js/menu-demarrer.js`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Fichier mystère demandé une seule fois, boîtes à pizza plus faciles
- **Fichier mystère** : il n'est plus demandé qu'une seule fois par appareil. Dès qu'il est ouvert, une marque est gardée (`avent_v5_mys`, ou `avent_test_mys` pour la version de test). Ensuite on peut relancer l'appli ou commencer une nouvelle partie sans lui, même si l'iPad a vidé la mémoire des chansons. Avant, le jeu ne savait qu'il avait été ouvert qu'en retrouvant ses chansons. Une remise à zéro générale (`REMISE_A_ZERO`) le redemande, comme le reste.
- **Boss final, les boîtes à pizza** plus faciles : 3 bonnes boîtes à trouver au lieu de 5, jamais plus de 4 boîtes (au lieu de 5), moins de mélanges (4 à 7 au lieu de 5 à 13), plus lents, et plus jamais deux échanges en même temps.
- Version : 1795775384
- Fichiers : `2026/js/menu-demarrer.js`, `2026/js/musiques-jeux.js`, `2026/js/boss/boss-final.js`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Animations 3D : film de la gravure, souvenirs qui tombent du ciel, figurines qui dansent
- **Boss final, la gravure en film** : dans la carte de la gravure, le bracelet 3D arrive de côté, la caméra en fait le tour au ralenti, plonge sur l'endroit gravé (flash, paillettes dorées, étiquette « ✨ gravé ici »), puis recule. Si Célestine touche le bracelet, le film s'arrête et elle le tourne elle-même. Le toucher ne fait toujours pas avancer la scène.
- **Vitrine des Trésors, nouveaux souvenirs** : un souvenir débloqué mais pas encore ouvert saute et brille dans la vitrine (« ✨ Nouveau ! »). À l'ouverture, il tombe du ciel en tournant, rebondit, puis un halo doré, des paillettes et la bannière « ✨ Nouveau souvenir ! » apparaissent. Les souvenirs déjà vus sont gardés dans `S.v3Vus`.
- **Figurines animées** de Célestine et de Valentin, faites avec Meshy à partir de leurs photos (doudoune rose et lunettes écaille pour elle, doudoune verte pour lui), avec un squelette :
  - Valentin arrive dans la vitrine après 2 boss vaincus : il danse le hip-hop, ou fait coucou ;
  - Célestine arrive après le boss final : elle danse, saute de joie, ou fait coucou.
  - Des boutons sous la figurine changent d'animation.
- Nouvel ordre de la vitrine : bracelet (dès le début), bonhomme de neige (1 boss), Valentin (2), traîneau (3), pizzas (4), cadenas (5), Célestine (après le boss final). Les cases fermées disent ce qu'il faut faire.
- Coût Meshy : 116 crédits (dessins des figurines, passage en 3D, simplification, squelettes, 6 animations). Reste : 774.
- Version : 1795775067
- Fichiers : `2026/3d/fig-valentin.glb` et `2026/3d/fig-celestine.glb` (nouveaux), `2026/js/vue-3d.js`, `2026/js/tresors.js`, `2026/js/fichiers.js`, `2026/js/langue-anglais.js`, `2026/css/08-dossier.css`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Objets 3D : on les fait tourner du doigt sans à-coups
- Glisser le doigt vers le haut ou le bas ne faisait pas basculer l'objet (sur iPad, la fenêtre défilait à la place), et un petit glissement faisait faire un tiers de tour. Maintenant l'objet suit le doigt dans tous les sens, deux fois plus doucement, sans pouvoir passer complètement dessous.
- L'objet arrête de tourner tout seul dès qu'on le touche (avant, la rotation automatique repartait et « luttait » contre le doigt).
- Les cœurs et cadeaux qui tombent en fond se mettent en pause tant qu'un objet 3D est ouvert, pour que la tablette reste fluide.
- Version : 1795773809
- Fichiers : `2026/js/vue-3d.js`, `2026/js/neige-confettis.js`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Objets en 3D (Meshy) et le vrai bracelet à un seul cœur
- **Le bracelet est maintenant le vrai** (Histoire d'Or, « Carpantus ») : plaqué or, maille forçat, **un seul cœur rose** taillé et serti griffes. L'histoire est adaptée partout :
  - le titre devient « Dossier n°24 · Le bracelet au cœur rose » (écran de démarrage, logo, onglet du navigateur, appli installée, CGU, Paramètres, dossier) ;
  - les logos et tous les dessins du dossier n'ont plus qu'un cœur, serti dans la chaîne ;
  - la main courante, le prologue et Pépin parlent d'« un petit cœur rose serti » ;
  - le faux bracelet Vinted se trahit autrement : un cœur plat et lisse (pas taillé) qui pend à un gros anneau. L'annonce dit « cœur rose » ;
  - Noémie avoue que le cœur est sorti de ses griffes et qu'elle l'a recollé ; l'agrandissement du Dr Rodolphe montre une trace de colle sur les griffes ;
  - les détails à repérer sur les photos (bracelet, Vinted, agrandissement) sont réécrits. Traductions anglaises mises à jour.
- **Objets en vraie 3D**, faits avec Meshy (à partir des photos du vrai bracelet et de descriptions), à faire tourner du doigt et à zoomer :
  - **Dossier** : sous les photos du bracelet, de l'annonce Vinted et de l'agrandissement, un bouton « 🧊 Voir l'objet en 3D ». On y trouve des détails en touchant le modèle (le cœur taillé, le fermoir ; le cœur plat, le gros anneau ; la trace de colle sur une griffe). Ils sont entourés, notés et gardés dans `S.det` (clés `v3_…`).
  - **Trésors** : nouvelle « 🧊 Ma vitrine 3D ». Le bracelet est là dès le début, puis un souvenir de plus à chaque boss vaincu : bonhomme de neige, traîneau, boîtes de Pizza Mario, cadenas à code. Après le boss final, le bracelet montre où il est gravé (« ✨ 03.07.2025 ») et le cadenas donne son code.
  - **Boss final** : dans la carte de la gravure, le dessin du bracelet est remplacé par le vrai bracelet en 3D qui tourne (« ✨ gravé ici »). Le toucher ne fait pas avancer la scène. Sans connexion la première fois, le dessin reste.
- Les modèles (7 fichiers, 12,7 Mo en tout) et l'afficheur model-viewer (1 Mo) sont dans `2026/3d/` et ne sont chargés qu'à la première ouverture d'un objet, puis gardés en cache. `outils/verifier.py` vérifie aussi ce dossier.
- Coût Meshy : 210 crédits.
- Version : 1795773331
- Fichiers : `2026/3d/` (8 nouveaux fichiers), `2026/js/vue-3d.js` (nouveau), `2026/js/fichiers.js`, `2026/js/tresors.js`, `2026/js/enquete/suspects-pieces.js`, `2026/js/enquete/dossier-accusation.js`, `2026/js/boss/boss-final.js`, `2026/js/histoire.js`, `2026/js/menu-demarrer.js`, `2026/js/parametres.js`, `2026/js/gags.js`, `2026/js/langue-anglais.js`, `2026/css/08-dossier.css`, `2026/manifest.webmanifest`, `outils/verifier.py`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Page d'installation : bouton pour télécharger le fichier mystère
- La page de téléchargement de l'appli (`2026/app.html`, celle du QR code) affiche maintenant, sous les instructions, un encadré « 🎁 Le fichier mystère ». Il explique qu'il faut aussi le télécharger pour la boîte aux lettres du toit, avec un bouton doré « 📥 Télécharger le fichier mystère » (lien SwissTransfer, ouvert dans un nouvel onglet). C'est pareil sur iPhone, iPad, Android et ordinateur.
- Le lien n'est pas recopié : la page le lit dans `CONTENU.mysLien` (`js/contenu.js`), le même que dans le jeu. Quand le lien SwissTransfer change (il expire au bout de 15 jours), il suffit de le changer à cet endroit.
- Version : 1795771072
- Fichiers : `2026/app.html`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Fichier mystère : tout le toit refait graphiquement (neige, traces, ciel, lumière, ambiance)
- **La neige au sol**, sur notre toit et sur celui de Valentin. L'ancienne couche blanche unie avec ses lignes de tuiles est supprimée et remplacée par :
  - un dégradé de profondeur : bleuté et voilé au loin, blanc presque chaud tout près ;
  - un grand reflet de lune sur la neige, dans la direction de la lune ;
  - des congères sculptées par le vent, claires côté lune et ombrées bleu de l'autre côté ;
  - des tuiles qu'on devine sous la neige (petites écailles, discrètes de près et de loin) ;
  - les ombres portées de la cheminée, du bonhomme, du sapin, des cadeaux, de l'antenne et de la boîte aux lettres, toutes du côté opposé à la lune ;
  - la lueur orange du feu qui vacille sur la neige autour de la cheminée, et une flaque de couleur sous chaque ampoule de la guirlande ;
  - des paillettes de glace qui scintillent quand on marche ou qu'on tourne la vue.
- **Les bords du toit** : un bourrelet de neige arrondi qui déborde, et des stalactites de glace sous la gouttière, les côtés et les bords du toit de Valentin.
- **Les traces dans la neige**, toutes refaites en creux, avec une ombre intérieure du côté de la lune et un liseré clair sur le bord :
  - de vraies empreintes de bottes (semelle et talon, crans visibles de près), qui s'effacent en 24 s ;
  - les glissades, en léger voile ;
  - un vrai ange dans la neige : deux ailes en éventail avec les stries laissées par les bras, la robe des jambes, le corps et la tête ;
  - après la patate, un cratère avec son bourrelet et des mottes de neige, et une seule rigole de glissade aux bords irréguliers (au lieu de dizaines de rectangles superposés).
- **La neige qui tombe** : trois profondeurs (petits points lents au loin, flocons lumineux tout près, avec un halo), quelques gros flocons flous comme hors mise au point, et la neige qui glisse sur le côté quand on tourne la vue.
- **Le ciel** : dégradé plus profond, lueur orangée de la ville à l'horizon, halo de glace autour de la lune et nuages fins qui passent lentement. Sous l'horizon, le vide entre les immeubles s'assombrit vers le bas, avec les halos des lampadaires de la rue tout en bas.
- **L'ambiance** : brume légère sur l'horizon, bords de l'image assombris comme une photo de nuit, braises qui montent du feu, buée de la respiration de Célestine et de Valentin toutes les 2 à 3 s, et neige poudreuse qui file au ras du toit quand le vent souffle fort.
- Optimisation : les halos de lumière sont créés une fois puis réutilisés, et toutes les rangées de tuiles sont tracées en deux traits.
- Version : 1795737260
- Fichiers : `2026/js/musiques-jeux.js`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Fichier mystère : la « patate » de Valentin, Célestine s'envole et s'écrase façon manga
- **Valentin charge sa patate** pendant 1,1 s : une aura orange pulse autour de lui, des étincelles montent, un grondement monte, et il dit « Attention… 😈 » ou « Ça va chauffer… 🔥 ». Puis il crie « PATAAATE !!! 💥 » (ou « PRENDS ÇA !!! ☄️ », « TIR DE LA MORT !!! 💥 ») et tire à 28 m/s. Le fichier laisse une traînée de feu orange et jaune. Le message en haut dit « 😈 Valentin prépare une patate… esquive ! ».
- **Si elle est touchée, c'est fait façon manga** :
  1. Arrêt sur image : l'image passe en négatif, des lignes de vitesse noires convergent vers elle, une onomatopée géante apparaît (« DOOM !! », « BAAAM !! » ou « PAF !!! »), il y a une grosse secousse et un coup de zoom.
  2. Elle s'envole en arrière (« AAAAH !! 😱 »), bras et jambes qui moulinent, en vrillant, avec des lignes de vitesse.
  3. Elle s'écrase sur le dos : « CRAAASH ! », énorme gerbe de neige, secousse, cratère dans la neige.
  4. Elle glisse sur le dos, bras traînant au-dessus de la tête, en creusant un sillon.
  5. Elle reste sonnée avec des étoiles ⭐💫 (« J’ai vu des étoiles… ✨ »), se relève, s'époussette et lance « Tu vas me le payer ! 😤 » pendant que Valentin rigole (« HAHAHA ! 😂 », « STRIKE ! 🎳 »).
- La distance du vol (jusqu'à 3,8 m) et de la glissade (jusqu'à 1,8 m) est calculée pour qu'elle ne tombe jamais du toit et ne traverse ni la cheminée ni un obstacle. La caméra la suit de côté en restant au-dessus du toit.
- L'ancienne version (chute sur place en 2,9 s, tir à 17 m/s) est remplacée. Nouveaux bruitages : charge et impact de la patate.
- Version : 1795736130
- Fichiers : `2026/js/musiques-jeux.js`, `2026/js/langue-anglais.js`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-27 · Fichier mystère : tir canon de Valentin, Célestine tombe à la renverse, succès « Reine des toits »
- **Nouveau succès** « 🏠 Reine des toits » (difficile, catégorie Secrets) : trouver les 10 secrets du toit dans la scène du fichier mystère. Il se débloque au moment où le 10e secret est trouvé (ou au prochain contrôle des succès si le trophée était déjà gagné). Fichier : `succes.js`.
- **Plus de passes** : le compteur « 🤝 passes », son record et Célestine qui attrape le fichier au vol sont supprimés (code, style, traduction). L'ancien record des passes reste dans la sauvegarde mais n'est plus affiché.
- **Tir canon de Valentin** :
  - Quand le fichier arrive chez lui (attrapé au vol ou ramassé sur son toit), Valentin ne fait plus de passe. Il le renvoie presque à plat, à 17 m/s, droit sur la poitrine de Célestine, en le faisant tourner à toute vitesse, avec des traits de vitesse derrière.
  - Il prévient : « Attention ! 😈 », « Tir canon ! 💥 » ou « Prends ça ! 😆 ». Le message en haut dit « 😈 Valentin prépare un tir canon… esquive ! ». Si elle s'est écartée : « Esquivé ! 😎 Va ramasser le fichier ».
- **Célestine tombe à la renverse** si elle est touchée :
  - « Ouf ! 😵 » et Valentin rigole (« Hahaha ! 😂 », « Strike ! 🎳 »…). Elle bascule en arrière en reculant sur la neige, rebondit (bruit, gerbe de neige), puis reste étalée bras en croix avec des étoiles ⭐💫 qui tournent au-dessus de sa tête (« Aïe… 😵‍💫 »).
  - Elle se relève en poussant sur ses mains, s'époussette et lance « Tu vas voir ! 😤 » (ou « Même pas mal ! 😝 », « Revanche ! 💪 »).
  - Pendant ces 2,9 s, la caméra se met de côté pour bien la voir tomber, et on ne la dirige plus. Le fichier rebondit sur elle et retombe à ses pieds, et ça ne compte pas comme un raté.
- Version : 1795735686
- Fichiers : `2026/js/musiques-jeux.js`, `2026/js/succes.js`, `2026/js/langue-anglais.js`, `2026/css/06-boss-playlist.css`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-26 · Fichier mystère : on monte sur le toit les mains vides, pigeons et replay refaits, record du plus long lancer réussi
- **Ouvrir le fichier mystère** (menu de démarrage, Paramètres, Trésors) n'ouvre plus le sélecteur de fichiers : on arrive directement sur le toit, les mains vides. Un message dit « 📮 Va prendre le fichier dans la boîte aux lettres ! » et une flèche rose rebondit au-dessus de la boîte jusqu'à ce qu'un fichier soit pris. Le texte de l'écran « Avant de commencer… » l'explique aussi. L'ancien `mysOpen()` et les champs de fichier cachés sont supprimés.
- **Pigeons refaits** :
  - Posés, ce sont de vrais pigeons vus de profil, de face ou de dos selon la caméra : corps dodu, cou irisé vert-violet, deux barres noires sur l'aile, queue à bout noir, œil orange, pattes roses.
  - Ils picorent, se retournent et marchent en hochant la tête.
  - Quand on les dérange, toute la bande décolle d'un coup (bond et battements rapides). Elle tourne en rond au-dessus des toits en alternant battements et vol plané, puis chacun revient en planant et se cabre pour se poser.
  - En vol, ils sont dessinés en vraie 3D : ailes déployées qui battent, bouts d'ailes sombres. Ils sont justes sous tous les angles.
- **Replay refait, façon retransmission sportive** :
  - Un volet rose, or et nuit balaie l'écran avec « REPLAY », puis l'action est rejouée en trois plans :
    1. Célestine qui arme et lâche le fichier (contre-plongée de trois quarts face, elle est rejouée avec ses vrais gestes) ;
    2. une caméra qui poursuit le fichier en vol, avec une traînée lumineuse et un bandeau « CÉLESTINE · Livraison spéciale · 4,4 m » ;
    3. un gros plan au ras de la cheminée quand il tombe dedans.
  - Le ralenti varie : plus lent au lâcher et à l'arrivée.
  - Flash blanc à chaque coupe, logo « ⏪ REPLAY » et « RALENTI ×0,17 » en haut, vignette et bandes noires.
  - À l'arrivée : grand flash, secousse et gerbe d'étincelles dorées, puis un volet de sortie, la fête et la danse.
  - Les boutons et les messages sont cachés pendant le replay. Nouveau bruitage « whoosh » pour les volets.
- **Records** : nouveau record « Plus long lancer réussi », la plus longue distance d'un lancer qui entre dans la cheminée. Quand plusieurs records tombent en même temps, ils s'annoncent l'un après l'autre.
- Version : 1795722628
- Fichiers : `2026/js/musiques-jeux.js`, `2026/js/menu-demarrer.js`, `2026/js/puzzle.js`, `2026/js/langue-anglais.js`, `2026/css/06-boss-playlist.css`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-26 · Fichier mystère : boîte aux lettres, fichier noirci, passes, chat, pigeons, records, replay
- **Boîte aux lettres 📮** : une boîte jaune sur un poteau, à gauche sur le toit. Quand Célestine s'en approche, un anneau brille dans la neige, le drapeau se lève et un bouton « 📮 Choisir un fichier » apparaît. Il ouvre le sélecteur du téléphone (Photos, Fichiers, Téléchargements, appareil photo…). Le fichier choisi apparaît dans sa main avec son vrai aspect.
- **Mauvais fichier recraché** : seul le vrai fichier mystère (vérifié par son contenu, pas seulement son nom) s'ouvre dans la cheminée. Un autre fichier est recraché vers Célestine, noirci de suie, avec des bords qui rougeoient et une fumée noire (« Ho ho… ce n’est pas le bon fichier ! 🎅 Choisis-en un autre dans la boîte aux lettres 📮 »). Ça ne compte pas comme un raté. Avant, un mauvais fichier finissait en erreur après le lancer.
- **Passes avec Valentin** : si le fichier arrive à hauteur de ses mains, Valentin l'attrape au vol et le renvoie tout de suite. Un compteur « 🤝 3 passes » s'affiche en haut et repart à zéro dès que le fichier touche la neige. Pas de secret ni de récompense, juste un record. En pleine tête ou dans les jambes, il tombe toujours sur les fesses.
- **Chat sur la cheminée** : de temps en temps (toutes les 24 à 40 s environ), un chat roux traverse le toit, saute sur la cheminée et s'assoit sur l'ouverture pendant 7 s (il remue la queue, se lèche la patte, cligne des yeux). La cheminée est alors bouchée : un fichier rebondit sur lui et il s'enfuit (« Mraaou ! »).
- **Pigeons** : 5 pigeons sur le faîtage et 3 sur la gouttière. Ils picorent et se retournent. Quand le fichier, Célestine ou une boule de neige passe trop près, ils s'envolent (avec leurs voisins), puis reviennent se poser en planant 10 à 18 s plus tard.
- **Records 🏆** : un bouton 🏆 sous « Livré » ouvre le tableau des records : livré en le moins de lancers, plus long lancer (en mètres), plus de passes avec Valentin. Un nouveau record est annoncé en haut (« 🏆 Nouveau record ! »). Les records sont gardés dans `S.mysRec` et envoyés au suivi.
- **Replay du tir gagnant** : quand le fichier entre dans la cheminée, les 1,6 dernières secondes du vol sont rejouées au ralenti (× 0,3). La caméra est sur le côté, avec des bandes noires et un badge « ● REPLAY », et les boutons sont cachés. Ensuite viennent la fête, les records, la danse puis l'ouverture du fichier.
- Nouveaux bruitages synthétisés : miaulement seul, cheminée qui recrache, envol de pigeons. Traductions anglaises ajoutées.
- Version : 1795721045
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-26 · Fichier mystère : le toit de Valentin est solide, il renvoie le fichier
- **Toit de Valentin solide** : un fichier lancé sur son toit y atterrit, rebondit et glisse sur la neige comme sur le nôtre (avant, il passait à travers et retombait du ciel). Son petit conduit de cheminée bloque aussi le fichier. S'il glisse jusqu'au bord (ruelle, faîtage, côté), il tombe comme avant.
- **Valentin renvoie le fichier** : dès que le fichier touche son toit, il dit « Oh ! Pour moi ? 😏 » (ou une autre réplique), court le chercher (en contournant sa cheminée), se baisse pour le ramasser, revient au bord de son toit, se tourne vers Célestine et le lui relance en cloche (« Attrape ! 😘 »). Le message en haut dit « Valentin va te le renvoyer… attrape-le ! 🙌 ».
- **Célestine l'attrape au vol** s'il arrive sur elle (« Attrapé ! 🙌 »). Si elle s'est déplacée, il tombe sur notre toit et elle va le ramasser (« Raté la réception ! Va le ramasser 😉 »). Valentin attend qu'elle soit debout (pas pendant une chute ou un ange dans la neige). Le renvoi de Valentin n'est pas poussé par le vent, ne le fait pas tomber sur les fesses et ne peut pas entrer dans la cheminée à la place de Célestine. Un fichier sur son toit ne compte pas comme un raté. Traductions anglaises des deux nouveaux messages ajoutées.
- Version : 1795719914
- Fichiers : `2026/js/musiques-jeux.js`, `2026/js/langue-anglais.js`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-26 · CLAUDE.md : repères de la scène « Lancer » du fichier mystère
- Ajout d'une ligne dans le tableau « Où mettre le code » qui indique où se trouve chaque partie de la scène (caméra, personnage, bras, poses, chute, ville, Valentin, secrets…). Rien ne change pour Célestine.
- Version : 1795719354
- Fichiers : `CLAUDE.md`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-26 · Fichier mystère : vrais bras articulés, poses refaites, chute en vraie 3D dans la rue
- **Bras articulés** : chaque bras a maintenant une épaule fixe, un bras et un avant-bras de longueur fixe. Le coude est calculé automatiquement (comme dans les jeux vidéo), et la main et le coude sont repoussés hors du buste et de la tête. Les bras ne traversent plus le corps. Le haut du bras, l'avant-bras et la main sont dessinés chacun à sa profondeur : un bras derrière le dos est caché par le corps, un bras devant passe par-dessus.
- **Poses refaites avec ce squelette** : marche (balancier opposé aux jambes), course (coude plié, grand balancier de l'épaule, plus de « T-rex »), respiration à l'arrêt, tir façon basket (fichier au-dessus du front, bras qui se tend), ramassage, glissade bras écartés, emotes (salut de l'avant-bras, bisou, disco, bras croisés), danse de victoire (toprock, moonwalk, bras en croix au sol, mains au sol tête en bas, freeze main sur la hanche, salto bras repliés, bras en V), ange dans la neige, et les gestes de Valentin.
- **Chute en vraie 3D** : au bord, la caméra passe sur le côté pendant que Célestine vacille. Quand elle tombe, la caméra la suit dans sa chute, entre les immeubles. En bas, il y a une vraie ville en 3D : immeubles en face avec fenêtres allumées et vitrines, réverbères qui éclairent, voitures garées sous la neige, chaussées avec traces de pneus, trottoirs, et la rue de gauche. Elle bat des bras et des jambes, s'écrase dans la neige (secousse, gerbe de neige, empreinte) et reste étalée. Puis fondu au noir et retour au milieu du toit. Quand la caméra passe sous les toits, ce qui est sur les toits n'est plus dessiné.
- Version : 1795714607
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-26 · Fichier mystère : animations plus fluides, toit de Valentin refait, chute du toit
- **Animations** : les gestes de Célestine passent en douceur d'une pose à l'autre (plus de bras qui « sautent »). Marche et course plus détaillées (coudes, balancement des bras, respiration à l'arrêt). Quand elle court, tout son corps se penche en avant (et en arrière quand elle glisse) : la tête, les lunettes et le buste restent bien ensemble. Emotes refaites : salut de l'avant-bras, bisou envoyé de la main, danse disco, bouderie bras croisés en tapant du pied.
- **Toit de Valentin** : c'est maintenant un vrai toit enneigé à la même hauteur que le nôtre (tuiles, bords enneigés, petite cheminée en briques), de l'autre côté d'une ruelle. Les façades des deux immeubles descendent dans la nuit avec des fenêtres allumées. Valentin ne fait plus de « marche sur place » : il reste debout, bien posé sur son toit. Les boules de neige s'écrasent aussi sur son toit.
- **Chute du toit** : il n'y a plus de barrière invisible sur la gouttière et les côtés (le faîtage reste bloquant). Au bord, Célestine se penche en moulinant des bras (« Oh oh… 😱 »), bascule et tombe. La caméra monte au-dessus du vide et regarde vers le bas : on la voit longer la façade et s'écraser dans la neige de la rue ou de la ruelle (« Aïe aïe aïe… »). Puis elle réapparaît au milieu du toit, caméra remise derrière elle (« Plus de peur que de mal ! 😅 »).
- Version : 1795713488
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`, `JOURNAL.md`

## 2026-11-26 · Fichier mystère : vent, tir à effet, course et glissade, emotes, ange, Valentin, étoile filante, 10 secrets
- **Vent** : il change de sens et de force toutes les 9 à 14 s (parfois presque calme). Il dévie le fichier en vol et pousse la neige et la fumée. Une flèche avec la vitesse en km/h s'affiche sous le titre (tournée selon la vue), et une girouette dorée tourne en haut de l'antenne.
- **Tir à effet** : en relâchant « Lancer », glisser le doigt sur le côté fait partir le fichier en courbe de ce côté (↶ / ↷ s'affichent sur le bouton). Au clavier, on garde une flèche gauche/droite en relâchant l'espace.
- **Course et glissade** : le joystick poussé à fond un moment (ou Maj) la fait courir. Si on lâche en pleine course, elle glisse sur la neige, bras écartés, avec des traces. À chaque pas, une empreinte de botte reste dans la neige un moment.
- **Emotes** : un bouton 😊 ouvre 👋 salut, 😘 bisou (cœurs), 💃 danse, 😤 bouder (dos tourné, bras croisés), avec une bulle. Au clavier : touches 1 à 4.
- **Ange dans la neige** : si on ne touche à rien pendant 6 s, elle s'allonge et fait l'ange. La silhouette (tête, ailes, robe) reste dessinée sur le toit.
- **Valentin sur le toit voisin** : un bâtiment voisin à droite, de l'autre côté du vide. Valentin (même personnage en volume, doudoune verte, cheveux courts, sans lunettes) la regarde, lui fait coucou avec une bulle (« Coucou ! 👋 »…) et lui lance parfois une boule de neige (« Hé ! 😆 » si elle est touchée). Si le fichier le touche, il tombe sur les fesses (« Aïe ! 😵 »).
- **Étoile filante** : elle traverse le ciel de temps en temps. La toucher du doigt fait un vœu.
- **10 secrets et trophée** : en plus des 5 anciens, il y a Valentin touché, la boule de neige reçue, l'étoile filante, l'ange et une grande glissade. Le compteur passe à /10. Quand les 10 sont trouvés, un trophée doré s'affiche (enregistré dans `S.mysTrophee`, envoyé au suivi) et 🏆 reste à côté de « Livré ».
- Les couleurs et la coiffure du personnage sont maintenant réglables (`TENUE` : Célestine, Valentin).
- Version 1795712424
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : traîneau du Père Noël refait en vraie 3D
- L'ancien traîneau (un dessin plat aplati selon l'angle) est supprimé. Le nouveau est un vrai modèle 3D, vu correctement sous tous les angles : traîneau rouge à deux flancs et liserés dorés, patins dorés recourbés, hotte de cadeaux, Père Noël (barbe, ceinture, bonnet à pompon), quatre rennes en deux paires (corps, pattes au galop, cou, tête, bois, queue, harnais), Rudolph au nez rouge qui brille, et rênes dorées.
- Nouvelle trajectoire : il arrive de loin derrière le toit (on le voit petit dans le ciel), plonge vers nous en rasant le toit en suivant la pente, puis remonte et repart au loin. Un passage dure 11 s, toutes les 17 s.
- Le contact se fait dans le repère du traîneau (des rennes jusqu'à l'arrière du traîneau). Un lancer fort au bon moment le touche. Il tournoie, tombe vraiment là où il était et s'écrase sur le toit.
- Version 1795711744
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : on ramasse le fichier raté, il retombe du ciel s'il sort du toit
- Après un lancer raté, le fichier ne revient plus tout seul dans sa main : il reste là où il s'est arrêté, avec une flèche rose qui rebondit au-dessus. Célestine doit marcher dessus pour le ramasser (elle se baisse, petit bruit). Le bouton « Lancer » est grisé tant qu'elle n'a pas de fichier en main.
- S'il sort du toit (derrière le faîtage ou sur les côtés), il disparaît puis retombe du ciel à un endroit libre du toit (loin de la cheminée, des obstacles et de Célestine).
- Bords du toit : la surface grisâtre (l'autre pan du toit) et le fond sombre sous les maisons sont supprimés. Au bord, on ne voit plus que le ciel.
- Version 1795711313
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : vraie chorégraphie de breakdance et tir façon basket
- Danse de la victoire refaite (8 s) : toprock (pas croisés, bras qui balancent, buste qui se balance), moonwalk (de profil, elle « marche » mais glisse en arrière), descente au sol, windmill (elle tourne sur le dos, jambes en V, bras écartés), headspin qui accélère, baby freeze (pose figée penchée, une main au sol), saut périlleux pour se relever, puis bras en l'air avec des cœurs qui s'envolent. Un projecteur éclaire la piste, le rythme dure toute la danse, et le fichier s'ouvre juste après.
- Tir façon basket : en maintenant « Lancer », elle fléchit les genoux et tient le fichier à deux mains au-dessus du front, coudes pliés. En relâchant, elle saute, tend le bras vers le haut et l'avant (coup de poignet) et lâche le fichier en haut du saut. L'autre main se retire, et elle amortit en retombant. Les coudes sont maintenant placés en 3D.
- Force recalibrée pour ce nouveau tir (de 2,6 à 9,5 m/s) : depuis le départ, la bonne force tient toujours sur environ 0,3 s de la jauge.
- Version 1795710079
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Ménage : capture d'écran de test retirée
- Suppression de `integ0.png` à la racine du projet : une capture d'écran de test ajoutée par erreur. Rien ne change pour Célestine.
- Version 1795709747
- Fichiers : `integ0.png` (supprimé), `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : Célestine fait du breakdance quand elle réussit
- Quand le fichier tombe dans la cheminée, Célestine se tourne vers nous et danse, sur un petit rythme de breakdance (la boîte à musique se tait). La chorégraphie : pas de danse debout avec les poings qui alternent, descente au sol, rotation sur la tête jambes écartées en V et mains au sol, pose figée, puis elle se relève d'un saut et lève les bras.
- Le fichier s'ouvre après la danse (5,6 s au lieu de 2 s). Pendant la danse, on ne la dirige plus.
- Version 1795709542
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : Célestine ne se « dédouble » plus quand on tourne la vue
- Quand on tournait la vue, la tête (queue-de-cheval) suivait la caméra, alors que le buste, le visage et la frange restaient calés sur le monde. On voyait par exemple le devant de la doudoune avec l'arrière de la tête. Toutes les parties utilisent maintenant sa direction par rapport à la caméra.
- Version 1795709269
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : commandes de jeu (joystick, vue au doigt, jauge de lancer)
- Un seul mode, avec des commandes de jeu classiques. Les boutons « Y aller à pied » / « Revenir au lancer », le geste de glisser vers le haut, la marche au toucher (et son calcul de chemin), la marque dans la neige et la main qui montrait le geste sont supprimés.
  - Célestine est toujours là, le fichier à la main, et la caméra la suit 2,6 m derrière elle.
  - Joystick en bas à gauche pour la faire marcher : vers le haut = droit devant, par rapport à la vue.
  - Glisser le doigt (ou la souris) ailleurs sur l'écran fait tourner la vue autour d'elle.
  - Bouton rond « Lancer » en bas à droite : on le maintient, elle arme le bras au-dessus de l'épaule en se tournant dans le sens de la vue, et la jauge de force (anneau vert → jaune → rouge) monte puis redescend. On relâche pour lancer droit devant.
  - Sur ordinateur : flèches ou ZQSD / WASD pour marcher, souris pour la vue, barre d'espace maintenue pour lancer.
- Réglages : jauge remplie en 2,4 s, force de 3,6 à 8 m/s, lancer à 48°. Depuis le départ, la bonne force tient sur environ 0,3 s de la jauge.
- Après un lancer raté, un nouveau fichier revient dans sa main.
- Version 1795708892
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : objets en vrai volume, la caméra garde l'angle à pied
- Les objets du toit ne se tournent plus vers la caméra :
  - le bonhomme de neige a un devant et un dos (yeux, nez en carotte, boutons et pan d'écharpe seulement du côté visage ; chapeau haut-de-forme en vrai cylindre ; bras orientés) ;
  - les cadeaux sont de vraies boîtes (dessus et côtés visibles, rubans sur chaque face, nœuds) ;
  - la guirlande dorée et les ampoules du sapin sont posées autour du cône (celles de derrière sont cachées) ;
  - les barres de l'antenne ont un vrai sens (vues de biais quand on tourne) ;
  - le traîneau paraît plus court vu de face, et il est retourné vu de l'autre côté. Il est caché quand il passe trop près de la caméra.
  Les surprises (bonhomme qui s'écroule, chat dans le cadeau, étoile du sapin, antenne tordue) fonctionnent toujours.
- À pied, la caméra ne revient plus à la vue de départ : elle garde l'angle actuel (par exemple depuis derrière la cheminée) et suit Célestine à 2,6 m.
- Ajout de l'autre pan du toit derrière le faîtage, pour ne plus voir de vide quand la caméra est tout en haut. Rangées de tuiles plus fines.
- Version 1795708385
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : on lance depuis l'endroit où Célestine a marché
- Le saut et le bouton « Sauter » sont supprimés (code, styles, bruit, traductions). À pied, on ne fait que marcher.
- « 🎯 Revenir au lancer » place la caméra un peu derrière Célestine, à l'endroit où elle s'est arrêtée, et dans la direction où elle regarde. On lance droit devant soi : si elle ne regarde pas la cheminée, on ne peut pas la mettre dedans. On peut aussi aller derrière la cheminée et lancer de là, ou lancer dans n'importe quelle autre direction.
- Toute la scène s'affiche maintenant depuis n'importe quel point du toit et dans n'importe quelle direction : le ciel, la lune, la ville et les maisons voisines forment un panorama sur 360°, le toit (tuiles, faîtage, gouttière, côtés) et la cheminée sont dessinés en vrai volume (on voit les côtés tournés vers nous), et les objets derrière la caméra sont cachés. La caméra se déplace en douceur entre la vue d'ensemble (à pied) et la vue derrière Célestine.
- La précision demandée s'adapte à la distance (plus on est près, plus il faut être précis), pour que la difficulté reste la même partout.
- Le fichier qui sort par la gouttière (en bas du toit) tombe du toit au lieu de rebondir.
- Version 1795707790
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Célestine à pied : vrai personnage en volume, elle pivote sans effet « feuille de papier »
- Les trois dessins séparés (dos, face, profil) et leur demi-tour « aplati » sont supprimés. Célestine est maintenant un personnage en volume : chaque partie (tête, visage, lunettes, nez, oreilles, queue-de-cheval, écharpe, bras, moufles, jambes, bottes, doudoune, capuche, fermeture éclair) a sa vraie place autour d'elle. Elle pivote en continu vers l'endroit où elle va, avec toutes les positions intermédiaires (trois-quarts dos, profil, trois-quarts face).
- Style revu : fins contours, ombres sur le côté loin de nous, reflet dans les cheveux, bottes qui pointent vers l'avant. Elle marche avec de vraies enjambées sous tous les angles, et elle se tourne vers nous pour fêter la réussite.
- Le fichier suit toujours sa main droite (même calcul pour le dessin et pour le fichier).
- Version 1795704866
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Célestine à pied : elle se tourne dans le bon sens et contourne les obstacles
- Elle a maintenant trois vues et se tourne vers l'endroit où elle va :
  - de dos quand elle s'éloigne ;
  - de face quand elle revient : son visage avec ses grandes lunettes écaille, ses yeux qui clignent, ses taches de rousseur, ses joues roses, son sourire, l'écharpe nouée devant et la fermeture éclair de la doudoune ;
  - de profil quand elle va à gauche ou à droite : vraies enjambées (genoux qui plient, bottes vues de côté), bras qui balancent, écharpe et queue-de-cheval qui volent derrière elle.
- Quand elle change de direction, elle pivote (petit demi-tour animé) au lieu de marcher en arrière.
- Elle calcule un chemin (grille de 20 cm) pour contourner la cheminée, le bonhomme, les cadeaux, le sapin et l'antenne, et va tout droit quand rien ne gêne. Si on touche un obstacle, elle s'arrête à l'endroit libre le plus proche.
- La main qui tient le fichier est la même pour le dessin et pour le fichier dans les trois vues.
- Version 1795703422
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : Célestine y va à pied
- Le bouton « Le déposer à la main » (qui n'apparaissait qu'après 6 ratés et déposait directement le fichier) est remplacé par « 🚶 Y aller à pied », toujours visible.
- À pied, une petite Célestine dessinée apparaît, vue de dos : cheveux châtains en queue-de-cheval avec un chouchou rose, branches des lunettes, doudoune rose matelassée avec capuche fourrée, écharpe crème à rayures, jean, bottes fourrées, moufles. Elle tient le fichier choisi à la main (la photo, le document…).
- On touche le toit pour la faire marcher jusque-là (une petite marque apparaît dans la neige). Elle marche avec les bras, la queue-de-cheval, l'écharpe et le fichier qui se balancent, et on entend ses pas. Toucher la cheminée l'emmène juste devant. Elle s'arrête contre la cheminée et les obstacles, et les touche (le bonhomme s'écroule, etc.).
- Le bouton rond « Sauter » brille quand elle est bien en face de la cheminée. En haut du saut, elle lâche le fichier : bien en face, il tombe dedans et elle lève les bras ; mal placée, il tape le bord ou passe à côté, puis un nouveau fichier revient dans sa main. Loin de la cheminée, elle fait juste un petit saut.
- « 🎯 Revenir au lancer » permet de retrouver le lancer au doigt.
- Version 1795702772
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Lien pour télécharger le fichier mystère, le toit ne se traverse plus
- Dans la fenêtre « Avant de commencer… » de l'écran de démarrage, un bouton « 📥 Télécharger le fichier mystère » ouvre le lien SwissTransfer de Valentin (dans le navigateur, aussi depuis l'appli Android). Les explications disent de télécharger d'abord, puis d'ouvrir le fichier. Le lien est dans `CONTENU.mysLien` (`js/contenu.js`). Attention : un lien SwissTransfer expire au bout de 15 jours.
- Lancer du fichier dans la cheminée : le sol couvre maintenant toute la largeur du toit dessiné (avant, il s'arrêtait à 4,2 m du centre et le fichier traversait la neige sur les côtés). Partout sur le toit, le fichier atterrit et glisse. S'il passe le faîtage, il tombe de l'autre côté et disparaît derrière la ligne du toit, au lieu de passer à travers la neige.
- Version 1795701078
- Fichiers : `2026/js/contenu.js`, `2026/js/menu-demarrer.js`, `2026/css/12-gags.css`, `2026/js/langue-anglais.js`, `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Remise à zéro de la progression sur tous les appareils
- Au prochain lancement, chaque appareil (téléphone, tablette, PC, appli Android, vraie version et version de test) efface une seule fois toute la progression : les 3 sauvegardes, la signature des CGU (à refaire), la photo, les musiques importées et les secrets trouvés. Ensuite, plus rien n'est effacé.
- Pour refaire une remise à zéro plus tard, il suffit de changer la date `REMISE_A_ZERO` dans `js/config.js` (noté dans CLAUDE.md).
- Version 1795699892
- Fichiers : `2026/js/config.js`, `CLAUDE.md`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : traîneau plus facile à toucher, compteur de secrets corrigé
- Le compteur de secrets ne compte plus que les secrets qui existent encore (il affichait « 6/5 » à cause de l'ancienne surprise de la lune, gardée dans la sauvegarde de test).
- Le traîneau était presque impossible à toucher : il demandait la même précision que la cheminée en plus du bon moment. Il vole maintenant plus bas, plus lentement (toutes les 13 s) et il est plus grand. Sa zone de contact correspond à sa vraie taille, rennes compris. Un lancer fort au bon moment le touche, mais un lancer trop fort passe au-dessus.
- Les rennes sont marron (ils se perdaient dans la nuit), avec une tête, et le premier a un nez rouge.
- Version 1795693145
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : les surprises demandent un vrai contact
- Avant, une surprise se déclenchait si le fichier passait seulement « devant » un élément à l'écran ou à côté. Maintenant il faut vraiment le toucher en 3D, avec sa vraie forme : le sapin est un cône, le bonhomme trois boules, l'antenne a ses barres en haut.
- Le traîneau ne passe plus dans le ciel devant la lune : il survole le toit (toutes les 11 s), juste devant les maisons, à une vraie position dans la scène. Il faut un lancer très fort au bon moment pour le toucher. Le fichier rebondit dessus, le traîneau tournoie et s'écrase sur le toit dans un nuage de neige, et les jambes du Père Noël gigotent dans la neige.
- La surprise de la lune est supprimée, car on ne peut pas vraiment la toucher : il reste 5 secrets.
- Version 1795692698
- Fichiers : `2026/js/musiques-jeux.js`, `2026/js/langue-anglais.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : 6 surprises cachées quand on rate
- Quand on rate le lancer, toucher certains éléments déclenche une surprise drôle, avec son bruit, puis tout se remet en place :
  - le bonhomme de neige s'écroule (les boules roulent, la tête tourne, le chapeau s'envole) puis se reconstruit ;
  - le sapin tremble, perd ses aiguilles et son étoile tombe, puis elle remonte ;
  - la petite boîte de la pile de cadeaux valdingue et un chat monté sur ressort sort du gros cadeau rouge (« Miaou ! ») ;
  - l'antenne se tord avec des étincelles et la télé du voisin grésille ;
  - en lançant très haut quand le traîneau passe (toutes les 10 s), le Père Noël tombe en tournoyant derrière les toits, et seules ses jambes dépassent de la neige ;
  - en lançant très haut à droite, la lune fait un clin d'œil.
- Un petit message s'affiche en haut (« 🥚 Nouveau secret ! », avec un compteur sur 6). Les secrets trouvés sont gardés dans `S.mysSec` et envoyés au suivi.
- Le bonhomme, les cadeaux, le sapin et l'antenne ont été un peu rapprochés du centre pour que les surprises soient faciles à découvrir.
- Version 1795692165
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : bruitages et petite musique
- Le lancer du fichier dans la cheminée a maintenant du son, entièrement synthétisé : le feu qui crépite et le vent en fond, un « ffuit » au lancer, un bruit feutré quand le fichier tombe dans la neige, un frottement quand il glisse, un « toc » sur les briques, un bruit différent pour chaque obstacle (bonhomme, cadeaux, sapin avec grelots, antenne qui tinte), un sifflement quand il tombe du toit, et quand il entre dans la cheminée, une dégringolade, le feu qui s'emballe et des clochettes.
- Une petite musique de fond en boîte à musique (« Douce nuit », avec des grelots) joue pendant le lancer. La musique d'ambiance du site s'arrête pendant le lancer puis reprend après.
- Le son respecte les paramètres : rien si les sons sont coupés, pas de musique si la musique est coupée ou si une chanson du lecteur joue.
- Version 1795691359
- Fichiers : `2026/js/musiques-jeux.js` (nouvelle fonction `mysSons`), `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : le fichier lancé ressemble au vrai fichier, lancer plus dur
- Le fichier qu'on lance prend l'apparence du fichier choisi : une photo s'affiche en vrai tirage, une vidéo montre une image de la vidéo, et un PDF, une musique, un document Word ou Excel, une archive ou un autre fichier prennent une icône et une couleur selon leur type, avec leur extension. Le fichier .avent garde son paquet cadeau.
- Le lancer est plus dur : l'aide qui ramenait le tir vers la cheminée est supprimée. Il faut doser la force (environ ±6 %) : un peu trop faible, le fichier tape contre la cheminée et retombe ; un peu trop fort, il passe derrière. Il faut aussi viser plus droit.
- Version 1795691001
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`

## 2026-11-26 · Fichier mystère : vraie physique quand on rate, décors en plus
- Quand le fichier rate la cheminée, il atterrit, glisse sur la neige avec du frottement, bute contre les obstacles (bonhomme de neige, pile de cadeaux, sapin, antenne) et s'arrête, sans saccade ni téléportation. S'il passe le faîtage ou le bord du toit, il tombe. Ensuite il s'efface doucement et un nouveau fichier glisse à sa place.
- Décors ajoutés : au fond, des toits voisins enneigés avec des fenêtres allumées, une guirlande sur le faîtage et le traîneau du Père Noël qui passe devant la lune ; au premier plan, une guirlande lumineuse qui clignote et des branches de sapin avec des boules.
- Version 1795690044
- Fichiers : `2026/js/musiques-jeux.js`, `2026/index.html`, `2026/version.json`


## 26 novembre 2026 (11 h 45) : lancer du fichier mystère entièrement refait (version 1795687876)

- La première version (lancer de côté, collisions sur deux points, dessin plat) est remplacée.
- **Nouveau lancer en profondeur, façon « paper toss » :** on glisse le doigt vers le haut et le fichier part au loin vers la cheminée, en 3D, avec une perspective et une ombre sur le toit. Le lancer est en cloche, à angle fixe : la force du geste règle la distance, le côté du geste règle la direction. Un geste à peu près juste est guidé discrètement vers le centre. Trop faible, trop fort ou trop de travers, ça rate pour de vrai.
- **Vraies collisions,** calculées en 8 petits pas par image : mur de devant (le fichier rebondit et retombe), mur de derrière, côtés, rebord de la cheminée (rebond), toit (rebonds puis glissade). On entre seulement en passant par l'ouverture.
- **Nouveaux décors :** ciel de nuit avec étoiles qui scintillent, lune et halo, colline de Fourvière avec la basilique, toits de Lyon avec des fenêtres allumées, pan de toit enneigé en perspective avec ses tuiles, cheminée en briques en volume avec la neige sur le rebord et une lueur de feu dans l'ouverture, fumée, neige à deux profondeurs. Le fichier est emballé comme un cadeau (ruban rouge, nœud, étiquette « .AVENT »). Au départ, une petite main montre le geste.
- Réussite : fumée, étincelles, « Ho ho ho ! 🎅 Bien reçu ! », confettis, puis le fichier s'ouvre. Les aides après 1, 3 et 6 ratés sont conservées, avec le bouton « Le déposer à la main ».
- Fichiers : `2026/js/musiques-jeux.js` (`mysLancer`), `2026/css/06-boss-playlist.css` (`.mysl*`), `2026/js/langue-anglais.js`.

## 26 novembre 2026 (11 h 30) : le fichier mystère se lance dans la cheminée (version 1795687162)

- Quand Célestine choisit le fichier mystère, il ne s'ouvre plus tout de suite. Un écran « Livraison spéciale » apparaît : un toit enneigé la nuit, la lune, la neige qui tombe et une cheminée en briques. Elle attrape le fichier (emballé d'un ruban vert) et le lance d'une pichenette dans la cheminée.
- S'il tombe dedans : fumée, « Ho ho ho ! 🎅 », confettis, le compteur « Livré » passe à 1, puis le fichier s'ouvre comme avant.
- S'il rate, le fichier revient. Après 3 ratés, une aide s'affiche (« Lance plus fort, vers le haut… »). Après 6, un bouton « Le déposer à la main » apparaît.
- Une version « panier de basket » a aussi été faite pour comparer. Valentin a choisi la cheminée, donc la version basket n'est pas gardée.
- Code : `mysLancer()` dans `js/musiques-jeux.js`. `mysOpen()` lance le jeu, puis `mysLire()` ouvre le fichier (c'est l'ancien contenu de `mysOpen`). Styles `.mysl*` dans `css/06-boss-playlist.css`. Traductions anglaises ajoutées.
- Fichiers : `2026/js/musiques-jeux.js`, `2026/css/06-boss-playlist.css`, `2026/js/langue-anglais.js`.

## 26 novembre 2026 (11 h 15) : une enquête où il faut réfléchir (version 1795682360)

Le scénario ne change pas. C'est la façon de découvrir les choses qui change : Célestine doit déduire elle-même.

- **Pièces brutes :**
  - les légendes des photos ne disent plus ce qu'il faut voir (« le bracelet au poignet »), seulement l'heure, le lieu et qui a pris la photo ;
  - la frise chronologique ne conclut plus (« Photo au resto » au lieu de « Bracelet au poignet au resto ») ;
  - le zoom du Dr Rodolphe n'affiche plus « FERMOIR » ni « 5 CŒURS ROSES », et sa légende ne dit plus « C'est le bracelet ». L'éclat dans le vide-poche du selfie de 7 h 51 est beaucoup plus discret ;
  - les résumés `sum` de toutes les pièces (jamais affichés) sont supprimés.
- **Pépin ne conclut plus :**
  - après chaque aveu, « Noté : le bracelet était… » devient « Je note sa déposition. À vous de voir ce qu'elle vaut. » ;
  - au jour 17, il ne dit plus « Regardez derrière vous. Sur l'étagère » ;
  - au jour 20, il dit seulement « Lisez. » ;
  - au jour 22, il ne dit plus « Dix minutes seul dans l'appartement ».
- **Détails à repérer soi-même :** sur les photos du dossier, Célestine touche l'endroit qui l'intrigue. Si c'est un vrai détail, il est entouré en pointillés jaunes et noté sous la photo (« Je compte les cœurs : 5 », « Sur ses genoux : mon sac »…). Sinon, un petit rond s'efface. Les zones sont dans `PHZ` (`js/enquete/suspects-pieces.js`) et le toucher dans `phFig()` / `phTap()` (`js/enquete/dossier-accusation.js`). Les détails trouvés sont gardés dans `S.det` et envoyés au suivi (🔎).
- **Fausse piste (jour 15) :** une annonce Vinted d'« erika_lyo » (Lyon 7e, samedi 16 h 12) pour un « bracelet doré cœurs roses » à 12 €. En comptant les cœurs (4 au lieu de 5) et en regardant le gros anneau, on voit que ce n'est pas le sien.
- **Recoupement (jour 19) :** le relevé des badges de la BU du vendredi, avec beaucoup d'étudiants inconnus. Eya n'y apparaît jamais, alors que sa première déclaration dit maintenant « Je suis partie un peu plus tôt pour réviser à la BU ». Elle a menti, et le jour 20 explique pourquoi (Bellecour).
- Traductions anglaises ajoutées pour tous les nouveaux textes, et les anciennes inutiles supprimées.
- Fichiers : `2026/js/enquete/suspects-pieces.js` (`PHZ`, `PH.vinted`, `p_vinted`, `p_badges`, légendes, frise, Eya), `2026/js/enquete/dossier-accusation.js`, `2026/js/histoire.js`, `2026/css/08-dossier.css`, `2026/js/langue-anglais.js`, `CLAUDE.md`.

## 26 novembre 2026 (10 h 50) : agenda du jour 2, semaine de cours bien remplie (version 1795681818)

- Du lundi au vendredi, Célestine a **cours de 8 h à 18 h** (pharmacologie, biochimie, physiologie, chimie analytique, immunologie, microbiologie, pharmacie clinique, galénique, statistiques, toxicologie, TP), et **la BU** dans tous les trous. Nouvelle couleur grise « BU » dans la légende.
- Les moments utiles à l'enquête gardent leur horaire : ongles mardi 18 h, pause à la BU mercredi 13 h, resto jeudi 20 h, TP vendredi 8 h 30, Reyrieux, pharmacie samedi.
- Retirés (plus de place en journée) : « Révisions à l'appart », « Lessive et ménage », « Sieste ». L'appel à maman passe le mercredi à 18 h 15, la poste le jeudi à 18 h 15.
- Fichiers : `2026/js/enquete/suspects-pieces.js` (`p_agenda.ag`), `2026/js/enquete/dossier-accusation.js` (légende), `2026/css/08-dossier.css` (`.ag-bu`), `2026/js/langue-anglais.js`.

## 26 novembre 2026 (10 h 40) : l'agenda du jour 2 devient un vrai agenda de semaine (version 1795681686)

- L'indice du jour 2 n'est plus un tableau en liste : c'est un **agenda de semaine**, avec les 7 jours en colonnes (lun. 23 → dim. 29) et les heures sur le côté (7 h → minuit).
- Chaque créneau est un bloc coloré à sa place et à sa durée : bleu cours, rose amis, orange famille, violet travail, vert perso. Le week-end à Reyrieux est en fond hachuré. Toucher un créneau affiche son détail (heures, avec qui).
- Le contenu reste le même : toute la semaine, avec beaucoup d'infos inutiles. Les créneaux « Route pour Reyrieux » et « Route pour Lyon » sont ajoutés.
- Nouveau type de pièce `agd` : les données sont dans `p_agenda.ag` (`js/enquete/suspects-pieces.js`), l'affichage dans `agdHTML()` et `agTap()` (`js/enquete/dossier-accusation.js`), les styles `.ag-*` dans `css/08-dossier.css`. L'ancien tableau (`cols`, `rows`) et ses traductions inutilisées sont supprimés.
- Fichiers : `2026/js/enquete/suspects-pieces.js`, `2026/js/enquete/dossier-accusation.js`, `2026/css/08-dossier.css`, `2026/js/langue-anglais.js`.

## 26 novembre 2026 (10 h 20) : agenda du jour 2 détaillé, avec des infos inutiles (version 1795681438)

- L'indice du jour 2 (« Agenda de Célestine · Sa semaine ») montre maintenant **toute sa semaine**, du lundi 23 au dimanche 29, en 27 lignes : cours, resto U, courses, lessive, pilates, soirées série et film, poste, sieste, raclette, balade…
- Les moments importants (ongles, BU, resto, TP, Reyrieux, pharmacie) sont mélangés au reste : c'est à Célestine de trier.
- La phrase de résumé ne dit plus « les moments où quelqu'un a pu approcher le bracelet ». Elle dit seulement « Toute sa semaine, du lundi au dimanche. »
- La frise chronologique (`ev`) ne change pas.
- Traductions anglaises des nouvelles lignes ajoutées.
- Fichiers : `2026/js/enquete/suspects-pieces.js` (`p_agenda`), `2026/js/langue-anglais.js`.

## 26 novembre 2026 (10 h) : carte de l'enquête refaite, façon appli de cartes (version 1795681318)

- **Problème :** les 6 lieux de Lyon (appart, fac, commissariat, Bellecour, resto, chez Noémie) sont à moins de 3 km les uns des autres alors que la carte va jusqu'à Reyrieux (25 km). Ils étaient empilés et illisibles.
- **Épingles à taille fixe :** elles gardent la même taille quand on zoome, donc elles s'écartent au lieu de grossir. Elles sont dessinées hors du zoom et placées par `mapLay()`.
- **Bulle « Lyon · 6 lieux » :** de loin, les lieux de Lyon sont regroupés en une bulle rouge. En la touchant, on zoome en douceur sur Lyon, et les 6 épingles apparaissent (à partir du zoom `MPZL` = 5). Sur la petite carte du dossier, la bulle ouvre directement la carte en plein écran zoomée sur Lyon.
- **Zoom beaucoup plus profond :** jusqu'à ×30 au lieu de ×6. Nouveau bouton 🏙️ pour aller sur Lyon.
- **Détails qui apparaissent au zoom :** rues principales, ponts, place Bellecour, et noms de quartiers (Presqu'île, Vieux Lyon, Croix-Rousse, Part-Dieu, Guillotière, Lyon 8e, Gerland, Confluence, parc de la Tête d'Or). Les rivières et autoroutes prennent leur vraie largeur, et les textes gardent une taille lisible.
- **Plein écran :** l'échelle (5 km → 500 m → 100 m…) et le nord sont fixés à l'écran, et la vue de départ est centrée sur les lieux de l'enquête.
- Supprimé : l'ancien tracé de trajet désactivé (code mort), et les épingles dessinées en coordonnées absolues.
- Fichiers : `2026/js/enquete/plan-liege-notes.js` (`mapSVG`, `mpPin`, `mapLay`, `mapBig`, `mapLyon`), `2026/css/10-arene-plan-bilan.css`, `2026/js/langue-anglais.js`.

## 26 novembre 2026 (9 h 30) : fiches des suspects cohérentes, plus de « témoin » (version 1795680570)

- **« Témoin » retiré** partout pour Valentin (liste des auditions, nom du boss du jour 22, titre de la scène, source de la pièce). Il est traité comme les autres suspects.
- **Photo de Valérie :** le cadre rond blanc sur fond doré est enlevé. C'est maintenant une photo pleine avec un fond flou, comme les autres (`media/persos/valerie.webp` remplacée).
- **Fiches des suspects :** la description ne dit plus d'avance ce qu'on découvrira (« Mardi, le bracelet est resté une heure sur sa table », « Elle a ouvert le casier »…). Elle dit seulement qui est la personne et quand Célestine l'a vue.
- **Premières déclarations :** tout le monde ne ment plus.
  - Seul Edgar ment franchement (« Ton sac ? Je n'y ai pas touché »).
  - Noémie, Emma, Nora, Eya et Sandrine disent des choses vraies mais incomplètes : elles taisent ce qu'elles avoueront plus tard.
  - Erika, Valérie et Valentin disent la vérité.
- **Liste des auditions :** le prénom est sur sa propre ligne (il était collé au texte « Pas encore convoqué·e »).
- Traductions anglaises des nouveaux textes ajoutées, et l'ancienne de Valérie retirée.
- Fichiers : `2026/js/enquete/suspects-pieces.js`, `2026/js/enquete/dossier-accusation.js`, `2026/js/boss/boss.js`, `2026/js/histoire.js`, `2026/js/langue-anglais.js`, `2026/css/08-dossier.css`, `2026/media/persos/valerie.webp`, `CLAUDE.md`.

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
