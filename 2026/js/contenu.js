const CONTENU = {
  prenom: 'mon amour', // ✏️ son prénom ou un surnom (affiché en haut)
  ...(VERSION_TEST && { syncRoom: 't' }), // version de test : suivi en direct dans le salon « t »
  modeTest: VERSION_TEST, // version de test (/test/) : les 24 jours sont ouverts + bouton 🧪
  mysLien: 'https://www.swisstransfer.com/dl/01a21812-c930-74dd-bbb2-76e266e8477c', // lien pour télécharger le fichier mystère (SwissTransfer, expire au bout de 15 jours)
  codeSecret: '2412', // code du mode test caché (toucher 7 fois la photo en haut à gauche)
  finale: "Je t'aime ❤",
  album: {
    // ✏️ L'ALBUM PHOTO — notre vie, chapitre par chapitre (2 photos par page)
    titre: 'Notre Histoire',
    sousTitre: 'Célestine & Valentin',
    // ✏️ pour chaque photo : titre (affiché sous la photo) et src = "data:image/jpeg;base64,…" (vide = cadre en pointillés)
    // o:"p" = photo verticale (2 verticales sur une page = côte à côte) · pos = cadrage ("center 30%" = remonte vers le haut)
    chapitres: [
      {
        titre: 'Le début de nous',
        date: '2025',
        photos: [
          {
            titre: "La première fois qu'on s'est vus",
            date: '10 mars 2025',
            txt: "Le fameux anniversaire d'Emma et Antoine, où j'ai un peu trop bu.",
            src: ALIMG.soiree,
            o: 'l',
            pos: 'center'
          },
          {
            titre: 'Mon premier message',
            date: '1er avril 2025',
            txt: 'Grâce à cette plante, tu es tombée sous mon charme.',
            src: ALIMG.message,
            o: 'p',
            pos: 'center 4%'
          },
          {
            titre: 'Le fameux bar',
            date: '1er mai 2025',
            txt: 'Le soir où on a enfin commencé à se parler.',
            src: ALIMG.bar,
            o: 'l',
            pos: 'center'
          },
          { titre: 'Notre premier vrai date', date: 'Printemps 2025', txt: 'Pire photo ever.', src: ALIMG.voiture, o: 'l', pos: 'center' }
        ]
      },
      {
        titre: 'Nos premières fois',
        date: '2025',
        photos: [
          {
            titre: 'Notre premier double date',
            date: '11 juin 2025',
            txt: "Mamama l'escape game",
            src: ALIMG.sombreros,
            o: 'l',
            pos: 'center 28%'
          },
          {
            titre: 'Notre tout premier voyage',
            date: '13 août 2025',
            txt: 'À la capitale avec « Mario ».',
            src: ALIMG.eiffel,
            o: 'p',
            pos: 'center 55%'
          },
          {
            titre: 'Le début de mon squattage',
            date: '18 septembre 2025',
            txt: "Au moins t'avais un superbe cuistot.",
            src: ALIMG.bisou,
            o: 'p',
            pos: 'center 45%'
          },
          {
            titre: 'Notre premier gala de pharmacie',
            date: 'Automne 2025',
            txt: 'Et sûrement le dernier.',
            src: ALIMG.gala,
            o: 'p',
            pos: 'center 42%'
          },
          {
            titre: 'Notre premier Halloween',
            date: '31 octobre 2025',
            txt: 'Où on était bien bourrés.',
            src: ALIMG.halloween,
            o: 'l',
            pos: 'center'
          }
        ]
      },
      {
        titre: 'Nos grands moments',
        date: '2025 – 2026',
        photos: [
          {
            titre: 'Nos 6 mois',
            date: '3 décembre 2025',
            txt: 'Chez Antonio et Marco, déjà six mois.',
            src: ALIMG.resto,
            o: 'p',
            pos: 'center 22%'
          },
          {
            titre: 'Notre première Saint-Valentin',
            date: '15 février 2026',
            txt: 'La Clusaz, un igloo et nous deux.',
            src: ALIMG.neige,
            o: 'p',
            pos: 'center 50%'
          },
          {
            titre: 'Notre première cousinade',
            date: '24 mai 2026',
            txt: "Avec Gigi l'Amoroso.",
            src: ALIMG.costume,
            o: 'p',
            pos: 'center 32%'
          },
          {
            titre: 'Nos 1 an',
            date: '6 juin 2026',
            txt: 'Un an déjà… et nos propres pizzas !',
            src: ALIMG.pizza,
            o: 'p',
            pos: 'center 22%'
          }
        ]
      },
      {
        titre: 'Nos voyages',
        date: '',
        photos: [
          {
            titre: 'Tenerife',
            date: 'Août 2026',
            txt: 'Notre plus beau voyage, avec le mont Teide.',
            src: ALIMG.tenerife,
            o: 'l',
            pos: 'center 60%'
          }
        ]
      },
      {
        titre: 'Nos grandes étapes',
        date: '',
        photos: [
          { titre: "L'obtention de ton diplôme", date: 'Juin 2029', src: ALIMG.f_diplome, o: 'l', pos: 'center' },
          { titre: 'La création de ton officine', date: 'Janvier 2030', src: ALIMG.f_officine, o: 'l', pos: 'center' },
          { titre: 'La demande en mariage', date: 'Décembre 2032', src: ALIMG.f_demande, o: 'l', pos: 'center' }
        ]
      },
      {
        titre: 'Le grand oui',
        date: '',
        photos: [
          { titre: 'Notre mariage', date: 'Juillet 2034', src: ALIMG.f_mariage, o: 'l', pos: 'center' },
          { titre: 'Notre lune de miel à La Réunion', date: 'Août 2034', src: ALIMG.f_reunion, o: 'l', pos: 'center' }
        ]
      },
      {
        titre: 'Notre famille',
        date: '',
        photos: [
          { titre: 'Tu tombes enceinte', date: 'Juillet 2035', src: ALIMG.f_enceinte, o: 'l', pos: 'center' },
          { titre: 'La naissance de Jade', date: 'Mars 2036', src: ALIMG.f_jade, o: 'l', pos: 'center' },
          { titre: 'Notre première maison', date: 'Juillet 2036', src: ALIMG.f_maison, o: 'l', pos: 'center' },
          { titre: "La naissance d'Axel", date: 'Avril 2038', src: ALIMG.f_axel, o: 'l', pos: 'center' }
        ]
      },
      {
        titre: 'Le temps passe',
        date: '',
        photos: [
          { titre: 'Les 18 ans de Jade', date: 'Mars 2054', src: ALIMG.f_jade18, o: 'l', pos: 'center' },
          { titre: 'Papi et mamie', date: '2071', src: ALIMG.f_papi, o: 'l', pos: 'center' },
          { titre: 'Vieux mais toujours amoureux', date: '2080', src: ALIMG.f_vieux, o: 'l', pos: 'center' }
        ]
      },
      {
        titre: 'Pour toujours',
        date: '',
        photos: [{ titre: 'Côte à côte, pour toujours', date: 'Dans très, très longtemps…', src: ALIMG.f_tombes, o: 'l', pos: 'center' }]
      }
    ]
  },
  videos: [
    // 🎬 VIDÉOS DE L'ALBUM (débloquées en battant les boss, dans l'ordre) · ch = chapitre, apres = titre de la photo d'avant (vide = début du chapitre)
    {
      titre: 'Notre voyage à Tenerife',
      date: '29 août 2026',
      src: 'videos/4-tenerife.mp4',
      poster: 'videos/4-tenerife.jpg',
      ch: 'Nos voyages',
      apres: 'Tenerife'
    },
    {
      titre: 'Chef Valentin et la crêpe volante',
      date: 'Février 2027 · la Chandeleur',
      src: 'videos/1-crepe.mp4',
      poster: 'videos/1-crepe.jpg',
      ch: 'Nos grandes étapes',
      apres: ''
    },
    {
      titre: 'Leçon de ski sur la piste rouge',
      date: 'Hiver 2028',
      src: 'videos/2-ski.mp4',
      poster: 'videos/2-ski.jpg',
      ch: 'Nos grandes étapes',
      apres: ''
    },
    {
      titre: 'Notre slow sous les étoiles',
      date: 'Décembre 2032',
      src: 'videos/3-slow.mp4',
      poster: 'videos/3-slow.jpg',
      ch: 'Nos grandes étapes',
      apres: 'La demande en mariage'
    },
    {
      titre: 'Notre tour du monde',
      date: '2035 · nos 30 ans',
      src: 'videos/5-tour-du-monde.mp4',
      poster: 'videos/5-tour-du-monde.jpg',
      ch: 'Le grand oui',
      apres: 'Notre lune de miel à La Réunion'
    },
    {
      titre: 'Papy fait le show',
      date: '2072',
      src: 'videos/6-papy-mamie.mp4',
      poster: 'videos/6-papy-mamie.jpg',
      ch: 'Le temps passe',
      apres: 'Papi et mamie'
    }
  ],
  bossSong: { k: '', start: 0, dur: 70 },
  playlist: [
    // NOTRE PLAYLIST (coffre à souvenirs) : débloque aussi la musique de chaque mini-jeu
    { titre: 'Babydoll', artiste: 'Dominic Fike', mot: 'La chanson du jour 1', jour: 1 },
    { titre: 'Loser', artiste: 'Tame Impala', mot: 'La chanson du jour 2', jour: 2 },
    { titre: 'Stolen Dance', artiste: 'Milky Chance', mot: 'La chanson du jour 3', jour: 3 },
    { titre: 'The Fate of Ophelia', artiste: 'Taylor Swift', mot: 'La chanson du jour 4', jour: 4 },
    { titre: 'Lush Life', artiste: 'Zara Larsson', mot: 'La chanson du jour 5', jour: 5 },
    { titre: 'DtMF', artiste: 'Bad Bunny', mot: 'La chanson du jour 6', jour: 6 },
    { titre: "Gigi l'amoroso", artiste: 'Dalida', mot: 'La chanson du jour 7', jour: 7 },
    { titre: 'Le passé', artiste: 'TAL', mot: 'La chanson du jour 8', jour: 8 },
    { titre: "Dine N'Dash", artiste: 'The Strokes', mot: 'La chanson du jour 9', jour: 9 },
    { titre: 'Zoo (Zootopie 2)', artiste: 'Shakira', mot: 'La chanson du jour 10', jour: 10 },
    { titre: 'Dracula (ft. JENNIE)', artiste: 'Tame Impala', mot: 'La chanson du jour 11', jour: 11 },
    { titre: 'White Keys', artiste: 'Dominic Fike', mot: 'La chanson du jour 12', jour: 12 },
    { titre: 'Out of My League', artiste: 'Fitz and The Tantrums', mot: 'La chanson du jour 13', jour: 13 },
    { titre: 'Last Nite', artiste: 'The Strokes', mot: 'La chanson du jour 14', jour: 14 },
    { titre: 'Opalite', artiste: 'Taylor Swift', mot: 'La chanson du jour 15', jour: 15 },
    { titre: 'I Just Might', artiste: 'Bruno Mars', mot: 'La chanson du jour 16', jour: 16 },
    { titre: 'Self Aware', artiste: 'Temper City', mot: 'La chanson du jour 17', jour: 17 },
    { titre: 'Nothing Breaks Like a Heart', artiste: 'Mark Ronson ft. Miley Cyrus', mot: 'La chanson du jour 18', jour: 18 },
    { titre: 'I Feel It Coming', artiste: 'The Weeknd ft. Daft Punk', mot: 'La chanson du jour 19', jour: 19 },
    { titre: 'Diana', artiste: 'GIMS', mot: 'La chanson du jour 20', jour: 20 },
    { titre: 'Black Madonna', artiste: 'Cage The Elephant', mot: 'La chanson du jour 21', jour: 21 },
    { titre: "À l'international", artiste: 'TAL', mot: 'La chanson du jour 22', jour: 22 },
    { titre: 'Dance, Dance', artiste: 'Fall Out Boy', mot: 'La chanson du jour 23', jour: 23 },
    { titre: "I Was Made for Lovin' You", artiste: 'KISS', mot: 'La chanson du jour 24', jour: 24 }
  ],
  coffre3: null, // ✏️ 3e surprise du coffre à souvenirs (à décider)
  recordsValentin: {}, // ✏️ tes records à battre, ex. {candy:{s:18400},flappy:{s:15,t:42}} (s = score, t = temps en secondes)
  voix: [
    'media/voix/voix-1.m4a',
    'media/voix/voix-2.m4a',
    'media/voix/voix-3.m4a',
    'media/voix/voix-4.m4a',
    'media/voix/voix-5.m4a',
    'media/voix/voix-6.m4a'
  ], // 🎙️ messages vocaux (remplis par Claude à partir de tes enregistrements)          // message au dos du puzzle et à la victoire
  // Photos d'elle pour les cartes du memory (ajoutées par Claude à partir des photos que tu envoies).
  // S'il y a moins de photos que de paires, les cartes restantes sont des émojis de Noël.
  photos: [
    'media/photos/photo-01.jpg',
    'media/photos/photo-02.jpg',
    'media/photos/photo-03.jpg',
    'media/photos/photo-04.jpg',
    'media/photos/photo-05.jpg',
    'media/photos/photo-06.jpg',
    'media/photos/photo-07.jpg',
    'media/photos/photo-08.jpg',
    'media/photos/photo-09.jpg',
    'media/photos/photo-10.jpg',
    'media/photos/photo-11.jpg',
    'media/photos/photo-12.jpg',
    'media/photos/photo-13.jpg',
    'media/photos/photo-14.jpg',
    'media/photos/photo-15.jpg',
    'media/photos/photo-16.jpg',
    'media/photos/photo-17.jpg',
    'media/photos/photo-18.jpg',
    'media/photos/photo-19.jpg',
    'media/photos/photo-20.jpg',
    'media/photos/photo-21.jpg',
    'media/photos/photo-22.jpg',
    'media/photos/photo-23.jpg',
    'media/photos/photo-24.jpg',
    'media/photos/photo-25.jpg',
    'media/photos/photo-26.jpg',
    'media/photos/photo-27.jpg',
    'media/photos/photo-28.jpg',
    'media/photos/photo-29.jpg',
    'media/photos/photo-30.jpg',
    'media/photos/photo-31.jpg',
    'media/photos/photo-32.jpg',
    'media/photos/photo-33.jpg',
    'media/photos/photo-34.jpg'
  ],
  // Le grand quiz du jour 23 : la 1re réponse de chaque liste est la bonne (l'ordre est mélangé à l'écran).
  quiz: [
    { q: 'Quel est le nom de jeune fille de ma maman ?', a: ['Charbotel'] },
    { q: 'Quel est mon troisième prénom ?', a: ['Alexis'] },
    {
      q: "Quel était le 2ᵉ cadeau du calendrier de l'Avent de l'année dernière ?",
      a: ['Chocolat aphrodisiaque', 'Chocolat à étaler', 'aphrodisiaque', 'chocolat a tartiner']
    },
    { q: 'Quel est mon légume préféré ?', a: ['Aubergine'] },
    { q: "Pierre qui roule n'amasse pas…", a: ['Mousse'] }
  ],
  // Bons de la boutique (prix en points) — modifiables
  bons: [
    { id: 'gouter', ic: '🧁', n: 'Un goûter surprise', p: 120 },
    { id: 'vaisselle', ic: '🧽', n: 'Je fais la vaisselle (une semaine)', p: 150 },
    { id: 'massage', ic: '💆', n: 'Un massage', p: 150 },
    { id: 'serie', ic: '📺', n: 'Soirée série : tu choisis, je ne râle pas', p: 150 },
    { id: 'repas', ic: '🍝', n: 'Un repas maison préparé par moi', p: 250 },
    { id: 'cine', ic: '🎬', n: 'Un ciné de ton choix', p: 250 },
    { id: 'lego', ic: '🎁', n: 'Un Lego mystère', p: 350 },
    { id: 'escape', ic: '🔐', n: 'Un escape game', p: 450 },
    { id: 'resto', ic: '🍽️', n: 'Un resto de ton choix', p: 450 },
    { id: 'ecosse', ic: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', n: 'Une activité en Écosse', p: 500 }
  ],
  // Ce que fabrique la machine secrète du labo (le 24) : devient un bon dans ses Trésors
  secret: { ic: '🎁', n: '✏️ Ta surprise (à remplir)', msg: '✏️ Ton petit message pour elle' }
};
