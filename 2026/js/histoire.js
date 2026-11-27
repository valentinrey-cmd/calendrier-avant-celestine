/* ---------- 📖 L'histoire du calendrier ---------- */
const STORY = {};
Object.assign(STORY, {
  pro: {
    t: 'Prologue · La main courante',
    sc: 'pole',
    l: [
      ['n', 'Lyon, mardi 1er décembre. Commissariat du 8e arrondissement, 8 h 40.', { fx: 'ein' }],
      ['e', 'Lieutenant Pépin. Vingt-deux ans de maison, quatre cafés par matinée. Je vous écoute, madame ? ☕'],
      [
        'c',
        'Bonjour… je viens déclarer la disparition d’un bracelet. Une chaîne fine en or, avec un petit cœur rose serti. 😢',
        { fx: 'cin' }
      ],
      ['e', 'D’accord. Je prends votre déclaration. Vous l’avez depuis quand ? 📝', { fx: 'pop:📝' }],
      ['c', 'C’est Valentin, mon copain, qui me l’a offert à Noël dernier. Je l’enlève seulement pour les TP et pour la douche.'],
      ['e', 'Et la dernière fois que vous l’avez vu ?'],
      ['c', 'Vendredi matin, je crois. Je pensais l’avoir rangé dans ma trousse pour mon TP. Et dimanche soir, en rentrant… plus rien.'],
      ['e', 'Un vol ou une perte ?'],
      ['c', 'Je ne sais pas. Cette semaine, j’ai vu plein de monde.'],
      ['e', 'Alors donnez-moi des noms. Tous. Même ceux qui vous paraissent impossibles. 🖊️', { fx: 'pop:🖊️' }],
      ['c', 'Noémie. Mardi soir, elle m’a fait les ongles chez elle. 💅', { fx: 'sus:noemie' }],
      ['c', 'Emma. Jeudi soir, on était au resto avec Noémie. 🍝', { fx: 'sus:emma' }],
      ['c', 'Et mes copines de fac. On était ensemble au TP vendredi matin : Nora…', { fx: 'sus:nora' }],
      ['c', '…Erika…', { fx: 'sus:erika' }],
      ['c', '…et Eya. 🧪', { fx: 'sus:eya' }],
      ['e', 'Je note. Et le week-end ?'],
      ['c', 'Chez mes parents, à Reyrieux. Edgar, mon grand frère, était là aussi.', { fx: 'sus:edgar' }],
      ['e', 'Votre mère aussi, donc.', { fx: 'sus:parents' }],
      ['c', 'Ma MÈRE ?! Vous êtes sérieux ? 😳', { fx: 'shake' }],
      ['e', 'Je suis toujours sérieux avant mon cinquième café.'],
      ['c', 'Samedi, je travaillais à la pharmacie, avec Sandrine. 💊', { fx: 'sus:sandrine' }],
      [
        'c',
        'Et Valentin, mon copain : on vit ensemble la semaine. Vendredi, il travaillait, puis il est parti à Écully pour le week-end.',
        { fx: 'sus:valentin' }
      ],
      ['e', 'Je note tout le monde, c’est la procédure. 🗂️'],
      [
        'e',
        'Officiellement, une main courante, ce n’est pas une enquête. Officieusement… je m’ennuie. Alors je vais enquêter. 🕵️',
        { fx: 'pop:🔎' }
      ],
      ['e', 'Avant d’aller plus loin… une courte pause pub. Le commissariat a des factures. 📺'],
      ['x', 'pub'],
      [
        'e',
        'Nous revoilà. Voilà comment on va faire : moi, je cherche. Chaque jour, je vous transmets ce que je trouve : photos, messages, tickets, auditions.'
      ],
      ['e', 'Vous lisez, vous croisez. Je ne conclus jamais à votre place.'],
      ['c', 'Et à la fin ?'],
      ['e', 'Le 24, vous écrivez le nom du coupable sur un formulaire. ✍️'],
      ['e', 'Dossier n°24 : ouvert.', { fx: 'pop:📂' }]
    ]
  },
  fiche: {
    t: 'Le formulaire broyé',
    sc: 'pole',
    l: [
      ['e', 'Célestine, on a un problème. Un gros. 😰', { fx: ['ein', 'shake'] }],
      ['e', 'Pour accuser quelqu’un officiellement, il faut un formulaire d’accusation signé par le commissaire.'],
      ['c', 'Et donc ?'],
      [
        'e',
        'Et donc mon collègue Gérald, le brigadier, l’a rangé avec les vieux papiers. Et les vieux papiers, le vendredi… partent au broyeur.',
        { fx: 'pop:🗑️' }
      ],
      ['n', 'Dans le couloir, le brigadier Gérald regarde ses chaussures.', { fx: 'shake' }],
      ['e', '24 morceaux. Pile 24. 🧩'],
      ['c', 'Comme les cases de mon calendrier…'],
      [
        'e',
        'Gérald en a glissé un dans chacune de vos cases, pour se faire pardonner. Recollez-les dans l’onglet 🧩 Puzzle. Le 24, le formulaire sera complet.'
      ],
      ['e', 'En attendant, vos premières pièces sont dans le dossier : votre main courante, et les photos du bracelet. 📁', { fx: 'clue' }]
    ]
  },
  lab: {
    t: 'Le labo de la scientifique',
    sc: 'pole',
    l: [
      ['e', 'Voici le labo de la police scientifique. Le domaine du Dr Rodolphe. 🧪', { fx: ['ein', 'pop:🧪'] }],
      ['e', 'Il fabrique des bonus avec des pièces détachées 🔩. Ne lui demandez pas d’où elles viennent.'],
      ['n', 'Au fond du labo, un fax du procureur dort sous une housse en plastique.', { fx: 'pop:📠' }],
      ['e', 'Ce fax enverra votre formulaire d’accusation. Le 24, pas avant.'],
      ['c', 'Et le Dr Rodolphe, il peut analyser mes photos ?', { fx: 'cin' }],
      ['e', 'Il peut agrandir un grain de poussière jusqu’à en lire la date de naissance. Gardez-le en tête. 🔬']
    ]
  },
  b4: {
    t: 'Audition · Noémie',
    sc: 'audit',
    p: 'noemie',
    l: [
      ['n', 'Commissariat du 8e. Pépin punaise une story Instagram au tableau.', { fx: 'ein' }],
      [
        'e',
        'Mardi soir, chez Noémie, vous avez enlevé votre bracelet pour la pose d’ongles. Pendant une heure, il était posé sur SA table.'
      ],
      ['c', 'Noémie ? C’est ma meilleure amie…', { fx: 'cin' }],
      ['e', 'Raison de plus pour commencer par elle. Je l’ai convoquée. Elle vient… avec ses vernis. 💅'],
      ['n', 'Salle d’audition n°2. Noémie s’assoit, ses ongles impeccables tapotent la table : tac, tac, tac.', { fx: 'bin' }],
      ['b', 'Je viens de faire une pose complète, j’ai vingt minutes avant que ça sèche mal. On peut faire vite ?'],
      ['e', 'Madame, mardi, le bracelet était chez vous.', { fx: 'ein' }],
      ['b', 'Et alors ? C’est moi qui te le cherche, ton bracelet, ou c’est toi ? 💅'],
      ['b', 'Encore une question et je te lance mes flacons de vernis. Je te préviens.'],
      ['e', 'Elle esquive et vous envoie tout ce qui lui tombe sous la main. Esquivez, et placez vos questions.', { fx: 'shake' }]
    ]
  },
  w4: {
    t: 'Aveux · Noémie',
    sc: 'audit',
    p: 'noemie',
    l: [
      ['n', 'Noémie souffle sur ses ongles.', { fx: 'bin' }],
      [
        'b',
        'Bon… je t’ai fait l’enlever pour le gel. Et je l’ai fait tomber. Le cœur est sorti de ses griffes, je l’ai recollé à la colle à ongles. Pardon ! Mais je te l’ai remis au poignet à 19 h 40, juré.'
      ],
      ['e', 'Je note sa déposition. À vous de voir ce qu’elle vaut. 🗂️', { fx: 'ein' }]
    ]
  },
  b8: {
    t: 'Audition · Emma',
    sc: 'audit',
    p: 'emma',
    l: [
      ['n', 'Commissariat, jour 8. Pépin pose une photo sur le bureau.', { fx: 'ein' }],
      [
        'e',
        'Jeudi, au resto. Pendant que vous étiez aux toilettes, Emma avait votre sac sur les genoux. Et un étui à lunettes ouvert devant elle.'
      ],
      ['c', 'Emma ? Elle ne porte même pas de lunettes…', { fx: 'cin' }],
      ['e', 'Justement. Je l’ai convoquée. Elle arrive directement de son cabinet.'],
      ['n', 'Emma entre en blouse blanche, entre deux patients.', { fx: 'bin' }],
      ['b', 'Lisez la dernière ligne du tableau, lieutenant. …Non, je plaisante. Quoique. 👁️'],
      ['e', 'Jeudi, au resto, vous avez eu le sac de Célestine sur les genoux.', { fx: 'ein' }],
      ['b', 'Et vous, vous avez eu un café sur votre cravate ce matin. On a tous nos secrets.'],
      ['b', 'Je vous propose un marché : vous passez mon test de vue. Si vous le réussissez, je parle. 👓'],
      ['e', 'Célestine… c’est à vous. Je n’ai pas mes lunettes.', { fx: 'shake' }]
    ]
  },
  w8: {
    t: 'Aveux · Emma',
    sc: 'audit',
    p: 'emma',
    l: [
      ['n', 'Emma croise les bras.', { fx: 'bin' }],
      [
        'b',
        'Ok, j’ai pris ton sac. J’ai sorti tes lunettes pour tester tes verres avec mon appli : je voulais t’en offrir des nouvelles pour Noël. Ta correction a bougé, d’ailleurs. Et ton bracelet, tu l’avais au poignet, en face de moi.'
      ],
      ['e', 'Je note sa déposition. À vous de voir ce qu’elle vaut. 🗂️', { fx: 'ein' }]
    ]
  },
  b11: {
    t: 'Audition · Edgar',
    sc: 'audit',
    p: 'edgar',
    l: [
      ['n', 'Jour 11. Pépin relit un SMS de Valérie, la maman de Célestine.', { fx: 'ein' }],
      ['e', 'Vendredi soir, Edgar a pris 20 € dans votre porte-monnaie. Et votre sac a passé la nuit dans l’entrée, à Reyrieux.'],
      ['c', 'Mon frère ?! …Bon, les 20 €, ça lui ressemble. 🙄', { fx: 'cin' }],
      ['e', 'Je l’ai convoqué à 19 h. Il est arrivé à 20 h 15. Affamé.'],
      ['n', 'Edgar arrive avec un tacos à moitié mangé.', { fx: 'bin' }],
      ['b', 'J’ai pas eu le temps de dîner, ça vous dérange pas ? 🌯'],
      ['e', 'Le sac de votre sœur est resté tout le week-end dans votre entrée.', { fx: 'ein' }],
      ['b', 'Et moi j’étais dans ma chambre. Comme un ange.'],
      [
        'n',
        'En bas du commissariat, il y a un snack à tacos. Le patron est parti en pause… la plancha chauffe toute seule.',
        { fx: 'pop:🌯' }
      ],
      ['b', 'Je parle le ventre plein, pas avant. Descends, et fais-m’en un. Sans erreur.'],
      ['e', 'Célestine… derrière la broche. Il ne lâchera rien sinon.', { fx: 'shake' }]
    ]
  },
  w11: {
    t: 'Aveux · Edgar',
    sc: 'audit',
    p: 'edgar',
    l: [
      ['n', 'Edgar repose son tacos.', { fx: 'bin' }],
      [
        'b',
        'J’avoue : 20 balles pour un tacos. Mais j’ai retourné TOUT ton sac pour trouver le porte-monnaie. La trousse, les poches, tout. Il n’y avait aucun bracelet, j’en suis sûr.'
      ],
      ['e', 'Je note sa déposition. À vous de voir ce qu’elle vaut. 🗂️', { fx: 'ein' }]
    ]
  },
  b15: {
    t: 'Audition · Nora',
    sc: 'audit',
    p: 'nora',
    l: [
      ['n', 'Jour 15. Une photo Snapchat d’Erika est punaisée au tableau.', { fx: 'ein' }],
      ['e', 'Vendredi, 8 h 50, en TP. Nora tient votre trousse rose dans ses mains. Celle où vous pensiez avoir rangé le bracelet.'],
      ['c', 'Nora ? Elle a toujours le nez dans ses fiches…', { fx: 'cin' }],
      ['e', 'Elle passe entre deux sessions de BU. Avec ses fiches, évidemment.'],
      ['n', 'Nora entre avec ses fiches de révision sous le bras.', { fx: 'bin' }],
      ['b', 'J’ai un partiel dans trois jours, je n’ai vraiment pas le temps… 📚'],
      ['e', 'Vendredi, au TP, vous étiez juste à côté de Célestine.', { fx: 'ein' }],
      ['b', 'Comme toute la promo. On est quarante, lieutenant.'],
      ['b', 'Je réponds si vous tenez le rythme de mes révisions. Vrai ou faux, sans réfléchir.'],
      ['e', 'Des fiches de pharma… C’est votre rayon, Célestine. 📚', { fx: 'shake' }]
    ]
  },
  w15: {
    t: 'Aveux · Nora',
    sc: 'audit',
    p: 'nora',
    l: [
      ['n', 'Nora range ses fiches.', { fx: 'bin' }],
      [
        'b',
        'Oui, j’ai pris ta trousse à 8 h 45 pour ton correcteur… et j’ai copié tes résultats, pardon. Mais je te jure, il n’y avait pas de bracelet dedans. Juste des stylos et ton surligneur rose.'
      ],
      ['e', 'Je note sa déposition. À vous de voir ce qu’elle vaut. 🗂️', { fx: 'ein' }]
    ]
  },
  b19: {
    t: 'Audition · Sandrine',
    sc: 'pharma',
    p: 'sandrine',
    l: [
      ['n', 'Jour 19. Pépin relit un message de samedi sur le téléphone de Célestine.', { fx: 'ein' }],
      ['e', '« J’ai pris un peu de ta crème pour les mains. » Samedi à 14 h, Sandrine a ouvert votre casier. Votre sac était dedans.'],
      ['c', 'Sandrine ? Elle m’a tout appris à la pharmacie…', { fx: 'cin' }],
      ['e', 'Elle refuse de venir au commissariat : « le samedi, c’est le rush ». Alors on va chez elle.'],
      ['n', 'Pharmacie de Reyrieux. Sandrine file entre les rayons, un carton de crèmes dans les bras.', { fx: 'bin' }],
      ['b', 'Pas maintenant, j’ai six clients et une livraison ! 📦'],
      ['e', 'Madame, juste deux minutes…', { fx: 'ein' }],
      ['b', 'Aidez-moi au comptoir, et je vous parle. Célestine, tu connais la boutique !'],
      ['e', 'Célestine, passez derrière le comptoir !', { fx: 'shake' }]
    ]
  },
  w19: {
    t: 'Aveux · Sandrine',
    sc: 'pharma',
    p: 'sandrine',
    l: [
      ['n', 'Le dernier client sort. Sandrine souffle enfin.', { fx: 'bin' }],
      ['b', 'D’accord, j’ai ouvert ton casier pour ta crème. Mais il n’y avait que ton sac et ton manteau. Pas de bijou, rien qui brille.'],
      ['e', 'Je note sa déposition. À vous de voir ce qu’elle vaut. 🗂️', { fx: 'ein' }]
    ]
  },
  b22: {
    t: 'Audition · Valentin',
    sc: 'audit',
    l: [
      ['n', 'Jour 22. Dernière convocation sur le bureau de Pépin.', { fx: 'ein' }],
      ['e', 'Dernière audition de la liste. Votre copain.'],
      ['c', 'Valentin ? Il vit avec moi, il n’a aucune raison de…', { fx: 'cin' }],
      ['e', 'Simple vérification. Tout le monde passe en audition. Lui aussi.'],
      ['n', 'Dernière audition. Valentin s’assoit en souriant.', { fx: 'vin' }],
      ['v', 'C’est pour la forme, hein ? Je vis avec elle, j’allais forcément y passer. 😅'],
      ['e', 'Exactement. Pour la forme.', { fx: 'ein' }],
      ['v', 'Bon… je peux y aller ? J’ai mon métro. 🚇', { fx: 'vout' }],
      ['e', 'Il… il est parti ?! Célestine, suivez-le !', { fx: 'shake' }]
    ]
  },
  w22: {
    t: 'Déposition · Valentin',
    sc: 'audit',
    l: [
      ['n', 'Quai de la ligne D. Valentin s’arrête, essoufflé.', { fx: 'vin' }],
      ['v', 'Mon vendredi ? Boulot, métro, Écully. Rien de spécial.'],
      ['e', 'Rien du tout ? Même pas à Bellecour ?', { fx: 'ein' }],
      ['v', 'Ah… si, je suis passé récupérer un truc à Bellecour. Un truc pour moi. Rien à voir.']
    ]
  },
  s5: {
    t: 'Rapport · La BU',
    sc: 'fac',
    l: [
      ['n', 'Fac de pharma, site Rockefeller. Pépin arrive en imperméable au milieu des étudiants en blouse.', { fx: 'ein' }],
      ['e', 'Mademoiselle Erika m’a envoyé une photo. Elle prend des photos de tout, apparemment.'],
      ['c', 'Tout. Même ses pâtes.', { fx: 'cin' }],
      ['e', 'Excellent. Les gens qui photographient leurs pâtes ont résolu plus d’enquêtes que moi. 📸'],
      ['e', 'Pièce au dossier.', { fx: 'clue' }]
    ]
  },
  egg1: {
    t: 'Les œufs du brigadier',
    sc: 'pole',
    l: [
      ['e', 'Bravo, vous avez trouvé un œuf caché ! 🥚', { fx: ['ein', 'pop:🥚'] }],
      ['e', 'C’est Gérald. Il s’ennuie pendant ses gardes de nuit, alors il cache des œufs dans les jeux. Il y en a 24.'],
      ['e', 'Lisez bien les textes des jeux… et ne lui dites pas que je vous l’ai dit. 🤫']
    ]
  },
  lose1: {
    t: 'Le café de consolation',
    sc: 'pole',
    l: [
      ['n', 'Un défi raté… Pépin pose un café fumant devant Célestine. ☕', { fx: ['ein', 'pop:☕'] }],
      ['e', 'Ça arrive aux meilleurs. Moi, j’ai raté mon permis trois fois.'],
      ['c', 'Rira bien qui rira le dernier. 😤', { fx: 'cin' }]
    ]
  },
  s9: {
    t: 'Rapport · Reyrieux',
    sc: 'ecully',
    l: [
      ['n', 'Reyrieux, la maison de Valérie.', { fx: 'ein' }],
      ['e', 'Votre mère m’a transféré un message. Elle a été très claire. Et très fâchée contre votre frère.'],
      ['c', 'Qu’est-ce qu’il a encore fait ?', { fx: 'cin' }],
      ['e', 'Lisez. Puis demandez-vous ce qu’il a vu dans ce sac. 🧐', { fx: 'clue' }]
    ]
  },
  casino: {
    t: 'Le casino clandestin',
    sc: 'night',
    l: [['n', 'Derrière une porte sans nom, rue de la Charité, un casino clandestin ouvre ses portes. 🎰', { fx: 'pop:🎰' }]]
  },
  s17: {
    t: 'Rapport · Le selfie',
    sc: 'pole',
    l: [
      ['e', 'Célestine. Vos souvenirs Snapchat. Vendredi, 7 h 51.', { fx: 'ein' }],
      ['c', 'Je suis horrible dessus, j’étais en retard…', { fx: 'cin' }],
      ['e', 'Je ne conclus rien. Tout est au dossier.', { fx: 'clue' }]
    ]
  },
  s20: {
    t: 'Rapport · Bellecour',
    sc: 'night',
    l: [
      ['n', 'Un message arrive sur le téléphone de Célestine, tard le soir.', { fx: 'pop:💬' }],
      ['c', 'C’est Eya… Elle a séché vendredi après-midi ?', { fx: 'cin' }],
      ['e', 'Lisez.', { fx: ['ein', 'clue'] }]
    ]
  },
  s21: {
    t: 'Rapport · Le sac rangé',
    sc: 'ecully',
    l: [
      ['n', 'Une lettre arrive au commissariat. Écriture soignée, papier à en-tête de Reyrieux.', { fx: 'pop:✉️' }],
      ['e', 'Votre mère. Elle range votre sac depuis que vous avez 12 ans, dit-elle.', { fx: 'ein' }],
      ['c', 'C’est vrai. 😅', { fx: 'cin' }],
      ['e', 'Alors son témoignage vaut de l’or. Au dossier.', { fx: 'clue' }]
    ]
  },
  eggs24: {
    t: 'Le cadeau de Gérald',
    sc: 'pole',
    l: [
      ['e', 'Les 24 œufs ! Tous ! 🥚✨', { fx: ['ein', 'glow'] }],
      ['n', 'Le brigadier Gérald sort de derrière la machine à café, très ému.', { fx: 'pop:☕' }],
      ['e', 'Il a préparé un cadeau pour vous. Il a mis trois jours à faire le paquet. 🎁', { fx: 'pop:🎁' }],
      ['c', 'Merci, Gérald ! 💖', { fx: 'cin' }]
    ]
  },
  eve: {
    t: 'La veille',
    sc: 'pole',
    l: [
      ['e', 'Célestine, le dossier est complet. Il n’y aura plus aucune pièce.', { fx: 'ein' }],
      ['e', 'Demain, vous recollez le formulaire, vous le faxez… et vous écrivez un nom.'],
      ['e', 'Un seul. Si vous vous trompez, l’affaire est classée pour de bon.'],
      ['c', 'Pas de pression, donc. 😅', { fx: 'cin' }]
    ]
  },
  fichok: {
    t: 'Le formulaire recollé',
    sc: 'pole',
    l: [
      ['e', 'Les 24 morceaux sont recollés ! Le formulaire d’accusation est complet ! 📜', { fx: ['ein', 'pop:📜'] }],
      ['c', 'Il y a quelque chose d’écrit au dos… 🔎', { fx: 'cin' }],
      ['e', 'L’écriture de Gérald. Il s’excuse. Encore.'],
      ['e', 'Allez au labo 🧪 : glissez le formulaire dans le fax du procureur.']
    ]
  },
  mach: {
    t: 'Le fax du procureur',
    sc: 'pole',
    l: [
      ['n', 'Célestine glisse le formulaire dans le fax…', { fx: ['cin', 'pop:📜'] }],
      ['n', 'Bip… crrrr… crrrrrr… Le fax hurle comme en 1998. 📠', { fx: ['shake', 'pop:📠'] }],
      ['e', 'Il passe ! Il faut attendre le feu vert du procureur. Ensuite : un nom.', { fx: ['ein', 'pop:🎉'] }]
    ]
  },
  acc_valentin: {
    t: 'Accusation · Valentin',
    sc: 'salon',
    l: [
      ['n', 'Le soir du 24. Célestine rentre à l’appart. Valentin est là… beaucoup trop sage.', { fx: ['cin', 'vin'] }],
      ['c', 'Valentin. C’est toi qui as pris mon bracelet. 😤'],
      ['v', 'Moi ?! 😇 Je n’ai jamais touché à ton sac !'],
      [
        'c',
        'Justement : il n’a jamais été dans mon sac. Sur mon selfie de 7 h 51, il est dans le vide-poche de la salle de bain.',
        { fx: 'pop:🤳' }
      ],
      ['c', 'Je pars à 7 h 55. Toi, à 8 h 05. Et après toi, personne n’entre jusqu’à dimanche.'],
      ['c', 'Et à midi, Eya t’a vu sortir d’une boutique à Bellecour. Toi qui « ne t’es arrêté nulle part ».'],
      ['n', 'Le fax du labo crépite : ACCUSATION VALIDÉE. ✅', { fx: 'clue' }],
      ['v', '…Bon. D’accord. C’était moi. 😇'],
      ['c', 'Rends-le-moi. TOUT DE SUITE. 😤', { fx: 'shake' }]
    ]
  },

  acc_noemie: {
    t: 'Accusation · Noémie',
    sc: 'audit',
    p: 'noemie',
    l: [
      ['n', 'Salle d’audition. Noémie entre, un flacon de vernis dans chaque main.', { fx: 'bin' }],
      ['b', 'Attends… tu m’accuses MOI ? Ta manucure attitrée ? Celle qui t’a fait un baby pink PARFAIT ? 😱', { fx: 'shake' }],
      ['c', 'Mardi soir, mon bracelet était sur ta table. Je l’ai vu sur ta story.', { fx: ['cin', 'pop:📸'] }],
      ['b', 'Évidemment ! Tu l’avais ENLEVÉ pour le gel. Je ne vernis pas les bijoux, moi.'],
      [
        'b',
        '…Bon. Il est tombé. Le cœur est sorti de ses griffes. Je l’ai recollé à la colle à ongles. Personne ne voit rien, c’est du travail de pro. 💅',
        { fx: 'pop:💅' }
      ],
      ['e', 'Colle à ongles sur un bijou en or. Je note : « dégradation, mais avec talent ». 📝', { fx: 'ein' }],
      ['b', 'Et regarde ma photo de 19 h 40 : mes ongles finis… et le bracelet À TON POIGNET.', { fx: 'pop:📸' }],
      [
        'e',
        'Mercredi à la BU, il est encore à votre poignet. Jeudi au resto aussi. Ça fait beaucoup de poignet pour un vol, madame.',
        { fx: 'clue' }
      ],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:noemie' }],
      ['b', 'Pour me faire pardonner… de MON innocence, je t’offre une pose gratuite. Attends. C’est toi qui devrais t’excuser !'],
      ['c', '…Pardon Noémie. Je prends quand même la pose gratuite. 😳', { fx: 'cin' }],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  acc_emma: {
    t: 'Accusation · Emma',
    sc: 'audit',
    p: 'emma',
    l: [
      ['n', 'Emma entre en salle d’audition, lunettes sur le nez, regard d’ophtalmo qui a déjà tout vu.', { fx: 'bin' }],
      ['b', 'Laisse-moi deviner. C’est Valentin qui t’a soufflé mon nom ? 🙄'],
      [
        'c',
        'Jeudi au resto, pendant que j’étais aux toilettes, tu avais mon sac sur les genoux. Noémie a une photo.',
        { fx: ['cin', 'pop:📸'] }
      ],
      ['b', 'Bien sûr que j’avais ton sac. J’y cherchais… ça.', { fx: 'pop:👓' }],
      ['n', 'Elle pose sur la table un étui à lunettes… et un petit paquet cadeau.', { fx: 'pop:🎁' }],
      [
        'b',
        'J’ai testé tes verres avec mon appli. Ta correction a bougé, au fait. Je voulais t’offrir de nouvelles lunettes pour Noël. Surprise. Ratée. Merci.'
      ],
      ['e', 'Et le bracelet, pendant ce temps ? 🧐', { fx: 'ein' }],
      [
        'b',
        'À son poignet, en face de moi. Photo de 21 h 12 : chaîne dorée, petit cœur rose. Même Valentin l’aurait vu. Enfin… peut-être.',
        { fx: 'pop:🍕' }
      ],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:emma' }],
      ['c', 'Emma… je suis la pire. 😳', { fx: 'cin' }],
      ['b', 'Je sais. Avec tes nouvelles lunettes, tu liras mieux ton prochain suspect. 😌'],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  acc_nora: {
    t: 'Accusation · Nora',
    sc: 'fac',
    p: 'nora',
    l: [
      ['n', 'À la BU, Nora révise derrière une forteresse de fiches. Célestine s’avance.', { fx: 'bin' }],
      ['b', 'Chut ! Je suis au chapitre des anti-inflammatoires. Tu as dix secondes. 📚'],
      [
        'c',
        'Vendredi au TP, tu tenais ma trousse. Erika a une photo. Et c’est là que j’avais rangé mon bracelet.',
        { fx: ['cin', 'pop:🧪'] }
      ],
      ['b', '…Je peux tout expliquer.', { fx: 'shake' }],
      ['b', 'J’ai pris ta trousse à 8 h 45 pour ton correcteur. Et… j’ai un peu copié tes résultats de dosage. Beaucoup. Tout, en fait.'],
      ['c', 'NORA ! 😤', { fx: 'shake' }],
      [
        'b',
        'Mais il n’y avait PAS de bracelet ! Des stylos, ton surligneur rose et un vieux chewing-gum. Rien qui brille !',
        { fx: 'pop:🖊️' }
      ],
      ['e', 'Si la trousse était déjà vide à 8 h 45… peut-être que le bracelet n’y a jamais été. 🧐', { fx: ['ein', 'clue'] }],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:nora' }],
      ['b', 'Par contre… tu peux ne pas parler des résultats copiés au prof ?'],
      ['c', 'Tes 18 fiches de révision contre mon silence. 😏', { fx: 'cin' }],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  acc_erika: {
    t: 'Accusation · Erika',
    sc: 'fac',
    p: 'erika',
    l: [
      ['n', 'Erika arrive, téléphone déjà dégainé. Évidemment.', { fx: 'bin' }],
      ['b', 'Tu m’accuses ? Parfait. J’ai des preuves. BEAUCOUP de preuves. 🤳'],
      ['n', 'Elle fait défiler sa galerie. Ça dure. Longtemps. Très longtemps.', { fx: 'pop:📱' }],
      ['b', 'Lundi, mon café. Mardi, mon café. Mercredi, toi à la BU, le bracelet au poignet. Jeudi, mon café.'],
      ['c', 'Erika… tu prends tout en photo, mais toi, on ne te voit jamais dessus. C’est louche.', { fx: 'cin' }],
      ['b', 'C’est MOI qui tiens le téléphone !! 😤', { fx: 'shake' }],
      ['b', 'Vendredi au TP : 47 photos. Sur aucune je ne m’approche de ton sac. Et sur la 23e, Nora tient ta trousse. De rien.'],
      ['e', 'Un téléphone ne vole pas de bracelet, madame. Il vole juste beaucoup de mémoire. 📸', { fx: 'ein' }],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:erika' }],
      ['b', 'Je peux faire un selfie avec toi pour fêter mon innocence ?'],
      ['c', '…Une seule. 😳', { fx: 'cin' }],
      ['n', 'CLIC. CLIC. CLIC. CLIC. Elle en a fait 34.', { fx: 'pop:🤳' }],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  acc_eya: {
    t: 'Accusation · Eya',
    sc: 'night',
    p: 'eya',
    l: [
      ['n', 'Bellecour, la nuit. Eya sort d’une boutique, les bras chargés de sacs.', { fx: 'bin' }],
      ['c', 'Eya. Vendredi, tu es partie du TP à 11 h 30. Avant tout le monde. Pile quand…', { fx: 'cin' }],
      ['b', '…quand je suis allée faire du shopping à Bellecour, oui. 🛍️'],
      ['b', 'Attends. ATTENDS. Tu m’accuses, moi ?! C’est MOI qui t’ai envoyé le message !', { fx: ['shake', 'pop:💬'] }],
      ['c', 'Quel message ?'],
      [
        'b',
        '« J’ai vu Valentin sortir d’une petite boutique vers 12 h 35. Il avait l’air de cacher un truc. » Tu l’as lu jusqu’au bout, au moins ?'
      ],
      ['c', '…Je l’ai lu en diagonale. 😳'],
      ['e', 'Accuser son seul témoin. Audacieux. J’ai vu ça une fois, en 2009. Ça s’est mal fini pour tout le monde. ☕', { fx: 'ein' }],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:eya' }],
      ['b', 'Je retourne à mon shopping. Et toi, relis tes messages. LENTEMENT. 💅'],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  acc_edgar: {
    t: 'Accusation · Edgar',
    sc: 'ecully',
    p: 'edgar',
    l: [
      ['n', 'Reyrieux. Edgar ouvre la porte, un tacos XL à la main.', { fx: 'bin' }],
      ['b', 'Petite sœur ! Tu viens manger ? Il reste de la sauce fromagère. 🌯'],
      ['c', 'Edgar. Vendredi soir, tu as pris de l’argent dans mon porte-monnaie. Maman me l’a dit.', { fx: ['cin', 'pop:💬'] }],
      ['b', '20 balles. Un prêt. Un prêt d’urgence alimentaire.', { fx: 'shake' }],
      ['c', 'Et pour trouver mon porte-monnaie, tu as fouillé TOUT mon sac. Là où devait être mon bracelet.'],
      [
        'b',
        'Justement ! J’ai tout retourné : la trousse, les poches, la doublure. J’ai même trouvé un ticket de 2023. Mais de bracelet : zéro.'
      ],
      [
        'e',
        'Le ticket de caisse dit 23 h 04 : un tacos XL poulet, frites, sauce fromagère. Payé avec un billet de 20 €. Pas avec un bijou en or. 🧾',
        { fx: ['ein', 'clue'] }
      ],
      ['b', 'Tu vois ! Je suis un voleur… honnête.'],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:edgar' }],
      ['c', 'Tu me dois quand même 20 €. 😒', { fx: 'cin' }],
      ['b', 'Je te rembourse avec un toast à Noël. Le roi des toasts paie toujours ses dettes. 🥂'],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  acc_parents: {
    t: 'Accusation · Valérie',
    sc: 'ecully',
    p: 'parents',
    l: [
      ['n', 'Reyrieux, dans la cuisine. Valérie essuie un verre en chantonnant.', { fx: 'bin' }],
      ['c', 'Maman… Je suis obligée. Le dossier, c’est le dossier.', { fx: 'cin' }],
      ['n', 'Valérie pose lentement son verre.', { fx: 'pop:📰' }],
      ['b', 'Tu… accuses… ta MÈRE ? 😱', { fx: 'shake' }],
      ['c', 'Samedi matin, tu as rangé mon sac. Tu l’as eu entre les mains. Seule.'],
      ['b', 'Ma chérie, je range ton sac depuis que tu as 12 ans. Je connais chaque miette qu’il y a dedans.'],
      [
        'b',
        'Samedi : ta trousse rose, ton porte-monnaie (moins 20 €, merci Edgar), tes clés et un paquet de mouchoirs. AUCUN bijou. Sinon, je l’aurais mis de côté, comme d’habitude.'
      ],
      ['e', 'J’ai lu sa lettre. Elle a même noté l’état des mouchoirs. C’est plus précis que nos rapports. 📝', { fx: 'ein' }],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:parents' }],
      ['b', 'La prochaine fois que tu accuses ta mère, préviens-moi : je ferai un gâteau pour la garde à vue.'],
      ['c', '…Pardon maman. 😳', { fx: 'cin' }],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  acc_sandrine: {
    t: 'Accusation · Sandrine',
    sc: 'pharma',
    p: 'sandrine',
    l: [
      ['n', 'Pharmacie de Reyrieux, samedi, en plein rush. Sandrine range un carton de crèmes.', { fx: 'bin' }],
      ['c', 'Sandrine. Samedi, tu as ouvert mon casier. Tu me l’as écrit toi-même.', { fx: ['cin', 'pop:💬'] }],
      ['b', 'Pour ta crème pour les mains ! J’avais les mains plus sèches qu’un comprimé effervescent sans eau ! 🧴', { fx: 'shake' }],
      ['c', 'Et mon bracelet était peut-être dans mon sac, dans ce casier…'],
      ['b', 'Il y avait ton sac et ton manteau. J’ai pris UNE noisette de crème. Je n’ai pas ouvert ton sac. Je ne suis pas un monstre.'],
      [
        'e',
        'Et samedi matin, avant la pharmacie, sa mère avait déjà rangé ce sac. Aucun bijou dedans. Ce casier n’a rien pu cacher. 🧐',
        { fx: ['ein', 'clue'] }
      ],
      ['b', 'Tu vois ! Je suis préparatrice, pas cambrioleuse. Je prépare des gélules, pas des casses.'],
      ['n', 'Le procureur tamponne le dossier.', { fx: 'out:sandrine' }],
      ['b', 'Tiens, pour la peine : un tube de crème neuf. Le tien est presque vide… à cause de moi.'],
      ['c', '…Garde la crème. 😳', { fx: 'cin' }],
      ['n', 'Le vrai coupable court toujours… Retour au dossier. 🗂️', { fx: 'shake' }]
    ]
  },
  epi: {
    t: 'Épilogue · Affaire résolue',
    sc: 'pole',
    l: [
      ['n', 'Le lendemain matin, au commissariat du 8e.', { fx: 'ein' }],
      ['e', 'Alors, Célestine ? Ce bracelet ?'],
      ['c', 'Retrouvé. Et gravé. 💖', { fx: ['cin', 'pop:💖'] }],
      ['e', 'Affaire résolue. Dossier n°24 : classé. Et pour une fois, j’en suis content. 🕵️'],
      ['n', 'Le brigadier Gérald essuie une larme.', { fx: 'pop:🥲' }],
      ['e', 'Joyeux Noël, Célestine. 🎄']
    ]
  }
});
const STORD = [
  'pro',
  'fiche',
  'lab',
  'b4',
  'w4',
  's5',
  'egg1',
  'lose1',
  'b8',
  'w8',
  's9',
  'b11',
  'w11',
  'casino',
  'b15',
  'w15',
  's17',
  'b19',
  'w19',
  's20',
  's21',
  'b22',
  'w22',
  'eggs24',
  'eve',
  'fichok',
  'mach',
  'acc_valentin',
  'epi'
];
Object.assign(STORY, {
  mode_facile: {
    t: 'Mode Facile',
    sc: 'pole',
    l: [
      ['n', 'Lyon, commissariat du 8e, mardi 1er décembre, 8 h 40.', { fx: 'ein' }],
      ['e', 'Un bracelet disparu. Personne ne sait ni où, ni quand. Une simple main courante.'],
      ['e', 'Célestine, j’ai besoin de vous. 🕵️'],
      ['c', 'Une enquête ? J’adore. 🔎', { fx: 'cin' }],
      ['e', 'Mais avant de vous présenter les suspects… une courte pause pub ! 📺'],
      ['x', 'pub'],
      ['e', 'Nous revoilà. Mode Facile activé ! 🍼 Pour simplifier, Gérald n’a gardé que 2 suspects.', { fx: 'pop:🍼' }],
      ['n', 'Suspect n°1 : Célestine.', { fx: 'cin' }],
      ['c', 'Moi ?! 😳', { fx: 'shake' }],
      ['n', 'Suspect n°2 : le chat. 🐈', { fx: 'pop:🐈' }],
      ['c', 'On n’a pas de chat.'],
      ['e', 'C’est justement ce qu’il voudrait nous faire croire. 🤨'],
      ['e', 'Il faut un formulaire d’accusation signé. Je cours le chercher ! 🏃', { fx: 'run:💨' }],
      ['n', 'Pépin revient trois secondes plus tard, tout essoufflé, le formulaire à la main. 📜💨', { fx: 'pop:📜' }],
      ['e', 'Formulaire prêt ! ✍️ À vous de jouer : qui voulez-vous accuser ?', { fx: 'ein' }]
    ]
  },
  mode_facile_moi: {
    t: 'Mode Facile · Célestine accuse… Célestine',
    sc: 'audit',
    l: [
      ['n', 'Célestine se lève, très solennelle.', { fx: 'cin' }],
      ['c', 'Monsieur le lieutenant… j’ai une confession à faire. 😔'],
      ['c', 'C’est moi. J’ai volé mon propre bracelet. Arrêtez-moi. 🙇‍♀️', { fx: 'shake' }],
      ['e', '…QUOI ?! 😱', { fx: ['ein', 'shake'] }],
      ['c', 'Je l’ai peut-être fait sans m’en rendre compte. Je suis tête en l’air depuis trois minutes.'],
      ['c', 'Et j’ai des preuves : j’adore ce bracelet. Et j’ai des poignets. 🖐️'],
      ['n', 'Elle tend les poignets pour qu’on lui passe les menottes. 🔗', { fx: 'pop:🔗' }],
      ['n', 'Gérald sort les menottes… en guimauve. 🍡', { fx: 'pop:🍡' }],
      ['n', 'Le fax du procureur crépite. Un papier en sort.', { fx: ['shake', 'clue'] }],
      ['n', '« Non. Vendredi matin, vous étiez en TP devant 40 témoins. Et vous ronfliez sur la paillasse. » 📝', { fx: 'pop:📝' }],
      ['c', 'JE NE RONFLE PAS ! 😤', { fx: 'shake' }],
      ['n', 'Gérald mange les menottes en guimauve.', { fx: 'pop:🍡' }],
      ['e', 'Le procureur a parlé : vous êtes innocente. 😌 Il ne reste donc… qu’un seul suspect. 🐈', { fx: 'ein' }]
    ]
  },
  mode_facile_chat: {
    t: 'Mode Facile · Le chat',
    sc: 'audit',
    l: [
      ['c', 'J’accuse… le chat ! 🐈', { fx: 'cin' }],
      ['n', 'Le fax du procureur crépite : ACCUSATION VALIDÉE. ✅', { fx: ['glow', 'clue'] }],
      ['n', 'La silhouette retire sa capuche… c’est bien le chat. Il porte le bracelet en collier. 🐈💖', { fx: ['shadow', 'pop:🐈'] }],
      ['e', 'Enquête résolue en 12 secondes ! Bravo Célestine ! 🏆', { fx: ['ein', 'pop:🏆'] }],
      ['c', 'Mais… je n’ai rien fait.'],
      ['e', 'C’est tout le principe du mode Facile. 😌'],
      ['n', 'Le chat rend le bracelet… plein de poils. 🐈', { fx: 'pop:🐈' }],
      ['c', '…Garde-le. 🤢'],
      ['e', 'Affaire classée ! 📁 Dossier n°1 : « Le chat l’a fait ».', { fx: ['ein', 'pop:📁'] }],
      ['n', 'Mais à Lyon, une nouvelle silhouette rôde déjà autour… de la galette des rois. 👑', { fx: 'shadow' }],
      ['e', '…En mode Facile, on vous dira tout de suite que c’est encore le chat. 😏'],
      ['e', 'Pour une vraie enquête… essayez peut-être le mode Normal. 😉', { fx: 'pop:🎄' }]
    ]
  },
  mode_experte: {
    t: 'Mode Experte',
    sc: 'pole',
    l: [
      ['n', 'Lyon, commissariat du 8e, mardi 1er décembre, 8 h 40.', { fx: 'ein' }],
      ['e', 'Un bracelet a disparu. Célestine, j’ai besoin de vous. 🕵️'],
      ['c', 'Une enquête ? J’adore. 🔎', { fx: 'cin' }],
      ['e', 'Mais avant de vous présenter les suspects… une courte pause pub ! 📺'],
      ['x', 'pub'],
      ['e', 'Nous revoilà. Mode Experte activé. 🔥 Ici, tout est plus difficile.', { fx: ['ein', 'pop:🔥'] }],
      ['e', 'Les 9 suspects ont chacun un jumeau maléfique. Ça fait 18 suspects. 👯'],
      ['e', 'Toutes les pièces sont rédigées en latin. À l’envers. Dans le noir. 🌑'],
      ['e', 'Et le dossier fait 4 000 pages. 📚', { fx: ['shake', 'pop:📚'] }],
      ['c', 'Pas de problème. Donnez. 😎'],
      ['n', 'Célestine lit les 4 000 pages en un week-end. Avec 11 cafés du commissariat. ☕', { fx: 'pop:☕' }],
      ['n', 'Lundi matin, elle relève la tête, les yeux rouges.', { fx: 'pop:👀' }],
      ['c', 'J’ai trouvé. Je sais qui a pris le bracelet. 😤', { fx: 'shake' }],
      ['e', 'QUI ?! 😱', { fx: 'shake' }],
      [
        'n',
        'Mais en mode Experte, le voleur aussi est expert. Pendant qu’elle lisait… il a fait fondre le bracelet pour en faire une bague. 💍',
        { fx: ['shadow', 'pop:💍'] }
      ],
      ['n', 'Il ne reste que l’emballage, avec un petit mot : « Merci pour le bracelet. Bisous. La silhouette. » 📝', { fx: 'pop:📝' }],
      ['c', '…Je DÉTESTE le mode Experte. 😤', { fx: 'shake' }],
      ['e', 'Affaire classée. 📁 Le bracelet aussi : il est classé au doigt de quelqu’un.', { fx: ['ein', 'pop:📁'] }],
      ['e', 'Pour une enquête où vous avez une chance… essayez peut-être le mode Normal. 😅']
    ]
  },
  mode_celestine: {
    t: 'Mode Célestine',
    sc: 'pole',
    l: [
      ['n', 'Lyon, commissariat du 8e, mardi 1er décembre, 8 h 40.', { fx: 'ein' }],
      ['e', 'Un bracelet a disparu. Célestine, j’ai besoin de vous. 🕵️'],
      ['c', 'Une enquête ? J’adore. 🔎', { fx: 'cin' }],
      ['e', 'Mais avant de vous présenter les suspects… une courte pause pub ! 📺'],
      ['x', 'pub'],
      ['e', 'Nous revoilà. Mode Célestine activé ! 💀 Gérald a relevé… 30 suspects.', { fx: ['ein', 'pop:💀'] }],
      ['c', 'Trente ?! 😳', { fx: 'shake' }],
      ['n', 'Suspect n°1 : Gérard, le boulanger d’en bas. 🥖', { fx: 'pop:🥖' }],
      ['n', 'Suspect n°2 : Mamie Josette, qui a toujours des bonbons dans son sac. 🍬', { fx: 'pop:🍬' }],
      ['n', 'Suspect n°3 : Le livreur qui se trompe toujours d’étage. 🛵', { fx: 'pop:🛵' }],
      ['n', 'Suspect n°4 : Un pigeon de la place Bellecour. 🐦', { fx: 'pop:🐦' }],
      ['n', 'Suspect n°5 : Le prof de chimie de 3e. 🧪', { fx: 'pop:🧪' }],
      ['c', '…Il en reste beaucoup ?'],
      ['n', 'Suspect n°6 : Justine, la sœur de Valentin. Elle danse trop bien pour être honnête. 💃', { fx: 'pop:💃' }],
      ['n', 'Suspect n°7 : La voisine du dessus qui fait du step à 23 h. 👟', { fx: 'pop:👟' }],
      ['n', 'Suspect n°8 : Un raton laveur en vacances. 🦝', { fx: 'pop:🦝' }],
      ['n', 'Suspect n°9 : Le contrôleur du tram T1. 🚋', { fx: 'pop:🚋' }],
      ['n', 'Suspect n°10 : Bernard, 84 ans, champion de belote. 🃏', { fx: 'pop:🃏' }],
      ['e', 'On en est à 10 ! Plus que 20. 😊'],
      ['n', 'Suspect n°11 : Le bonhomme de neige du square (il a fondu depuis). ⛄', { fx: 'pop:⛄' }],
      ['n', 'Suspect n°12 : Maud, depuis l’Irlande. Alibi : 1 200 km. ☘️', { fx: 'pop:☘️' }],
      ['n', 'Suspect n°13 : Le père Noël d’un centre commercial. 🎅', { fx: 'pop:🎅' }],
      ['n', 'Suspect n°14 : Jean-Michel, influenceur crêpes. 🥞', { fx: 'pop:🥞' }],
      ['n', 'Suspect n°15 : Le hamster de la classe de CE1. 🐹', { fx: 'pop:🐹' }],
      ['c', 'C’est long, là. 😑'],
      ['n', 'Suspect n°16 : Côme, depuis le Vietnam. Il mangeait un phở. 🍜', { fx: 'pop:🍜' }],
      ['n', 'Suspect n°17 : La caissière du Carrefour City. 🛒', { fx: 'pop:🛒' }],
      ['n', 'Suspect n°18 : Le fantôme de l’opéra (non confirmé). 🎭', { fx: 'pop:🎭' }],
      ['n', 'Suspect n°19 : Le chien du voisin, Biscotte. 🐕', { fx: 'pop:🐕' }],
      ['n', 'Suspect n°20 : Une trottinette électrique abandonnée. 🛴', { fx: 'pop:🛴' }],
      ['n', 'Célestine bâille très fort. 🥱', { fx: 'pop:🥱' }],
      ['n', 'Suspect n°21 : Victor, que Valentin trouve très beau. Célestine, beaucoup moins. 😏', { fx: 'pop:😏' }],
      ['n', 'Suspect n°22 : La dame de la météo. 🌦️', { fx: 'pop:🌦️' }],
      ['n', 'Suspect n°23 : Un stagiaire de la police municipale. 👮', { fx: 'pop:👮' }],
      ['n', 'Suspect n°24 : Le canard du parc de la Tête d’Or. 🦆', { fx: 'pop:🦆' }],
      ['n', 'Suspect n°25 : Un DJ de mariage. 🎧', { fx: 'pop:🎧' }],
      ['c', 'Je commence à avoir la flemme. 😴'],
      ['n', 'Suspect n°26 : Le gardien de l’immeuble, Monsieur Robert. 🔑', { fx: 'pop:🔑' }],
      ['n', 'Suspect n°27 : Une boule à neige qui a l’air louche. 🔮', { fx: 'pop:🔮' }],
      ['n', 'Suspect n°28 : Un écureuil très musclé. 🐿️', { fx: 'pop:🐿️' }],
      ['n', 'Suspect n°29 : Le Wi-Fi de la voisine. 📶', { fx: 'pop:📶' }],
      ['n', 'Et le 30e… un sapin. Juste un sapin. 🎄', { fx: 'pop:🎄' }],
      ['e', 'Voilà ! Vous pouvez commencer l’enquête. 🕵️'],
      ['c', 'Non.'],
      ['e', '…Pardon ?'],
      ['c', 'J’ai la flemme. Je vais faire une sieste. 😴'],
      ['n', 'Célestine éteint son téléphone et se roule dans son plaid. 🛋️', { fx: 'pop:🛋️' }],
      ['e', 'Célestine ? … CÉLESTINE ?! 😱', { fx: ['ein', 'shake'] }],
      ['n', 'Le bracelet ne fut jamais retrouvé. Le sapin, lui, nie toujours. 🎄', { fx: 'pop:🎄' }],
      ['e', 'Mode Célestine terminé : vous avez été parfaitement vous-même. Bravo. 😌', { fx: 'pop:🏆' }],
      ['e', 'Pour vraiment jouer… essayez peut-être le mode Normal. 😉']
    ]
  }
});
