/* ---------- Les 24 jours : un casse-tête par jour, de plus en plus dur ---------- */
const LVD = {
  'rush': [
    {
      'cars': [
        [2, 0, 2, true],
        [3, 1, 2, false],
        [0, 3, 3, false],
        [0, 0, 2, true],
        [4, 4, 2, false],
        [1, 4, 2, true],
        [0, 2, 3, false],
        [3, 3, 2, true],
        [3, 5, 2, false],
        [4, 2, 2, true],
        [5, 2, 2, true],
        [5, 0, 2, true]
      ],
      'min': 21,
      'sol': [
        [7, 2],
        [4, 2],
        [8, 2],
        [9, 4],
        [10, 4],
        [11, 2],
        [1, 4],
        [7, 0],
        [2, 2],
        [6, 2],
        [5, 0],
        [2, 0],
        [4, 0],
        [6, 0],
        [8, 0],
        [7, 4],
        [1, 3],
        [11, 0],
        [2, 3],
        [6, 3],
        [0, 4]
      ]
    },
    {
      'cars': [
        [2, 1, 2, true],
        [0, 4, 3, false],
        [2, 5, 2, false],
        [0, 0, 2, true],
        [2, 0, 3, false],
        [3, 3, 2, false],
        [4, 2, 2, false],
        [5, 0, 2, true],
        [0, 5, 2, false],
        [1, 3, 2, false],
        [4, 4, 2, true],
        [3, 1, 2, true],
        [5, 3, 2, true]
      ],
      'min': 20,
      'sol': [
        [9, 0],
        [12, 4],
        [5, 4],
        [11, 3],
        [6, 3],
        [7, 1],
        [4, 3],
        [0, 0],
        [6, 0],
        [0, 1],
        [4, 2],
        [7, 0],
        [11, 1],
        [5, 2],
        [10, 1],
        [2, 3],
        [5, 3],
        [12, 2],
        [1, 3],
        [0, 4]
      ]
    },
    {
      'cars': [
        [2, 2, 2, true],
        [3, 2, 2, false],
        [1, 1, 2, true],
        [1, 5, 2, false],
        [5, 0, 2, true],
        [5, 3, 2, true],
        [3, 3, 3, true],
        [1, 4, 2, false],
        [0, 3, 3, true],
        [4, 3, 2, true],
        [2, 1, 2, false],
        [0, 1, 2, true],
        [1, 0, 2, false],
        [4, 5, 2, false]
      ],
      'min': 19,
      'sol': [
        [10, 3],
        [11, 0],
        [12, 3],
        [0, 0],
        [2, 0],
        [1, 0],
        [6, 2],
        [9, 2],
        [13, 3],
        [5, 4],
        [4, 2],
        [10, 4],
        [6, 1],
        [7, 3],
        [0, 3],
        [1, 1],
        [8, 2],
        [3, 0],
        [0, 4]
      ]
    },
    {
      'cars': [
        [2, 0, 2, true],
        [3, 1, 2, true],
        [0, 0, 3, true],
        [4, 3, 3, true],
        [4, 2, 2, false],
        [1, 3, 3, false],
        [0, 4, 3, false],
        [5, 3, 2, true],
        [4, 0, 2, false],
        [1, 0, 2, true],
        [0, 5, 2, false],
        [2, 5, 2, false]
      ],
      'min': 19,
      'sol': [
        [1, 0],
        [4, 2],
        [3, 1],
        [7, 1],
        [6, 3],
        [11, 3],
        [10, 1],
        [2, 3],
        [4, 0],
        [0, 1],
        [1, 1],
        [8, 2],
        [3, 0],
        [5, 3],
        [0, 3],
        [4, 1],
        [2, 2],
        [10, 0],
        [0, 4]
      ]
    }
  ],
  'tango': [
    {
      'sol': [
        [0, 0, 1, 0, 1, 1],
        [0, 1, 0, 0, 1, 1],
        [1, 0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0, 1],
        [1, 1, 0, 0, 1, 0],
        [1, 1, 0, 1, 0, 0]
      ],
      'giv': [
        [2, 5, 0],
        [0, 4, 1],
        [1, 4, 1]
      ],
      'cons': [
        [2, 2, 3, 2, '='],
        [0, 0, 0, 1, '='],
        [3, 1, 4, 1, 'x'],
        [0, 1, 1, 1, 'x'],
        [5, 2, 5, 3, 'x'],
        [4, 2, 4, 3, '='],
        [4, 0, 5, 0, '=']
      ]
    },
    {
      'sol': [
        [0, 0, 1, 1, 0, 1],
        [0, 0, 1, 0, 1, 1],
        [1, 1, 0, 0, 1, 0],
        [1, 1, 0, 1, 0, 0],
        [0, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 0, 0]
      ],
      'giv': [
        [2, 3, 0],
        [0, 2, 1],
        [1, 4, 1],
        [2, 1, 1]
      ],
      'cons': [
        [3, 0, 3, 1, '='],
        [3, 4, 4, 4, 'x'],
        [3, 3, 3, 4, 'x'],
        [4, 4, 4, 5, '='],
        [5, 0, 5, 1, '='],
        [2, 1, 2, 2, 'x'],
        [2, 0, 3, 0, '=']
      ]
    },
    {
      'sol': [
        [0, 0, 1, 0, 1, 1],
        [0, 0, 1, 0, 1, 1],
        [1, 1, 0, 1, 0, 0],
        [0, 1, 0, 1, 1, 0],
        [1, 0, 1, 0, 0, 1],
        [1, 1, 0, 1, 0, 0]
      ],
      'giv': [
        [2, 0, 1],
        [0, 1, 0],
        [5, 4, 0],
        [2, 3, 1],
        [1, 1, 0]
      ],
      'cons': [
        [3, 1, 3, 2, 'x'],
        [0, 3, 0, 4, 'x'],
        [4, 3, 4, 4, '='],
        [3, 0, 4, 0, 'x'],
        [5, 0, 5, 1, '='],
        [2, 2, 3, 2, '='],
        [4, 0, 4, 1, 'x']
      ]
    },
    {
      'sol': [
        [0, 0, 1, 0, 1, 1],
        [0, 1, 0, 1, 0, 1],
        [1, 0, 0, 1, 1, 0],
        [0, 1, 1, 0, 0, 1],
        [1, 0, 1, 0, 1, 0],
        [1, 1, 0, 1, 0, 0]
      ],
      'giv': [
        [5, 1, 1],
        [0, 3, 0],
        [3, 2, 1],
        [3, 1, 1],
        [4, 4, 1]
      ],
      'cons': [
        [2, 4, 3, 4, 'x'],
        [0, 0, 1, 0, '='],
        [3, 3, 4, 3, '='],
        [1, 1, 1, 2, 'x'],
        [1, 1, 2, 1, 'x'],
        [2, 5, 3, 5, 'x'],
        [4, 2, 5, 2, 'x']
      ]
    }
  ],
  'pics': {
    'loupe': [
      '...............',
      '.....####......',
      '...########....',
      '..##########...',
      '..###....###...',
      '.###......###..',
      '.###......###..',
      '.###......###..',
      '.###......###..',
      '..###....###...',
      '..##########...',
      '...##########..',
      '.....####..###.',
      '............###',
      '.............##'
    ],
    'menottes': [
      '...............',
      '..#####........',
      '.##...##.......',
      '.#.....#.......',
      '.#.....#.......',
      '.#.....#.......',
      '.##...##.......',
      '..###########..',
      '.......###..##.',
      '.......#.....#.',
      '.......#.....#.',
      '.......#.....#.',
      '.......##...##.',
      '........#####..',
      '...............'
    ],
    'badge': [
      '.......#.......',
      '......###......',
      '.#...#####...#.',
      '.##.#######.##.',
      '.#############.',
      '..###.....###..',
      '..##..###..##..',
      '.###.#####.###.',
      '###..#####..###',
      '.###.#####.###.',
      '..##..###..##..',
      '..###.....###..',
      '.#############.',
      '.##.#######.##.',
      '.#...#####...#.'
    ],
    'renne': [
      '..#.......#....',
      '..#..#.#..#....',
      '.###.#.#.###...',
      '..#.##.##.#....',
      '...##...##.....',
      '....#####......',
      '...#######.....',
      '..##.#.#.##....',
      '..#########....',
      '...#######.....',
      '....#####......',
      '....##.##......',
      '.....###.......',
      '......#........',
      '...............'
    ],
    'chalet': [
      '.......#.......',
      '......###......',
      '.....#####.....',
      '....#######....',
      '...#########...',
      '..###########..',
      '.#############.',
      '...#########...',
      '...#..###..#...',
      '...#..###..#...',
      '...#########...',
      '...####.####...',
      '...####.####...',
      '...####.####...',
      '...#########...'
    ],
    'bonnet': [
      '...........###.',
      '..........#####',
      '........#..###.',
      '......####.....',
      '.....######....',
      '....########...',
      '...##########..',
      '..############.',
      '..############.',
      '.##############',
      '###############',
      '#######.#######',
      '###############',
      '###############',
      '...............'
    ],
    'sapin': [
      '....##....',
      '...####...',
      '....##....',
      '...####...',
      '..######..',
      '...####...',
      '..######..',
      '.########.',
      '....##....',
      '...####...'
    ],
    'coeur': [
      '.###....###.',
      '#####..#####',
      '############',
      '############',
      '###.####.###',
      '############',
      '.##########.',
      '..########..',
      '...######...',
      '....####....',
      '.....##.....',
      '............'
    ],
    'cloche': [
      '.....##.....',
      '....####....',
      '...######...',
      '..########..',
      '..###..###..',
      '..##....##..',
      '..##....##..',
      '.###....###.',
      '.##########.',
      '############',
      '.....##.....',
      '....####....'
    ],
    'cadeau': [
      '..##..##..',
      '...#..#...',
      '....##....',
      '##########',
      '#...##...#',
      '##########',
      '#...##...#',
      '#...##...#',
      '#...##...#',
      '##########'
    ],
    'bonhomme': [
      '....####....',
      '...######...',
      '....####....',
      '...#.##.#...',
      '...######...',
      '....####....',
      '..########..',
      '.####..####.',
      '.##########.',
      '.####..####.',
      '..########..',
      '...######...'
    ],
    'etoile': [
      '.....##.....',
      '.....##.....',
      '....####....',
      '############',
      '.##########.',
      '..########..',
      '...######...',
      '...######...',
      '..###..###..',
      '..##....##..',
      '.##......##.',
      '............'
    ]
  }
};
window.IMG_BAR = IMG_BAR;
window.IMG_BAR2 = IMG_BAR2;
window.IMG_CANYON = IMG_CANYON;
if (!CanvasRenderingContext2D.prototype.roundRect)
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) {
    this.rect(x, y, w, h);
  };
const DAYS = {
  1: { t: 'Memorizotto', g: 'memory', p: { pairs: 8, time: 45 }, tier: 1, ev: '🎉', bonus: 50, unlock: 'La boutique est ouverte' },
  2: { t: 'Colony Flow', g: 'colony', p: { slots: 3, rows: 4, show: 3, gap: 170, speed: 90, time: 240 }, tier: 1 },
  3: {
    t: 'Mots mêlés pimentés 🌶️',
    g: 'melee',
    p: {
      n: 13,
      theme: 'Sexe 🔥',
      words: [
        'PENETRATION',
        'CUNNILINGUS',
        'LEVRETTE',
        'FELLATION',
        'ORGASME',
        'PRELIMINAIRES',
        'MISSIONNAIRE',
        'KAMASUTRA',
        'CAPOTE',
        'LUBRIFIANT',
        'EXTASE',
        'CLITORIS'
      ],
      time: 360,
      egg: 1
    },
    tier: 1,
    ev: '🧪'
  },
  4: {
    t: 'Flappy Célestine',
    g: 'flappy',
    p: {
      goal: 15,
      gap: 142,
      gapMin: 112,
      shrink: 1.2,
      moveAt: 6,
      ampMax: 55,
      wob: 1.7,
      pw: 62,
      every: 1.38,
      speed: 165,
      acc: 3.2,
      grav: 1600,
      jump: 460
    },
    tier: 1,
    ev: '🔧'
  },
  5: { t: 'La hutte de Panoramix', g: 'balls', p: { colors: 7, empty: 1, slack: 8, time: 180 }, tier: 1, ev: '🔄' },
  6: { t: 'Air hockey contre Valentin', g: 'hockey', p: { goal: 5, ai: 370, max: 820 }, tier: 2, ev: '✨', x2: true },
  7: { t: 'Zip', g: 'zip', p: { n: 7, k: 9, time: 60 }, tier: 2, ev: '🎡', unlock: 'La roue de la chance est ouverte' },
  8: { t: 'Bulles d’indices', g: 'bubble', p: { colors: 4, rows: 6, clues: 6, drop: 8, time: 210 }, tier: 2, ev: '🎨' },
  9: {
    t: 'Flèches en fuite',
    g: 'arrows',
    p: { n: 11, min: 2, max: 5, time: 80, err: 1, rot: 0.12, bombs: 3, slack: 2, spin: 12 },
    tier: 2
  },
  10: { t: 'Picross', g: 'picross', p: { pics: ['loupe', 'menottes', 'badge'] }, tier: 2 },
  11: { t: 'Simontagne', g: 'simon', p: { goal: 10, time: 300 }, tier: 2, ev: '🎟️' },
  12: { t: 'Le sudokunnilingus', g: 'sudoku', p: { n: 9, bh: 3, bw: 3, blanks: 60, digits: 1 }, tier: 2, ev: '🎁', bonus: 100 },
  13: {
    t: 'Œil de lynx',
    g: 'photo',
    p: {
      img: 'IMG_CANYON',
      show: 20,
      q: 7,
      need: 6,
      qs: [
        { 't': 'Combien de personnes y avait-il sur la photo ?', 'a': '7', 'ch': ['5', '6', '7', '8'] },
        { 't': 'Combien de personnes portaient un casque rouge ?', 'a': '6', 'ch': ['4', '5', '6', '7'] },
        {
          't': 'De quelle couleur était le t-shirt de la 2e personne en partant de la gauche ?',
          'a': 'Vert fluo',
          'ch': ['Bleu', 'Vert fluo', 'Noir', 'Orange']
        },
        {
          't': 'Où se trouvait la personne au casque blanc ?',
          'a': 'Tout à droite',
          'ch': ['Tout à gauche', 'Au milieu', '2e en partant de la gauche', 'Tout à droite']
        },
        { 't': 'Combien de personnes étaient en short ?', 'a': '3', 'ch': ['1', '2', '3', '4'] },
        {
          't': "Qu'y avait-il juste au-dessus du groupe ?",
          'a': 'Une arche de roche',
          'ch': ['Une cascade', 'Une arche de roche', 'Un pont en bois', 'Un tunnel éclairé']
        },
        {
          't': 'Que portait la personne tout à droite ?',
          'a': 'Un haut à rayures',
          'ch': ['Un haut à rayures', 'Un t-shirt bleu', 'Un pull rouge', 'Une veste noire']
        },
        { 't': 'De quelle couleur était le t-shirt de la personne tout à gauche ?', 'a': 'Bleu', 'ch': ['Bleu', 'Blanc', 'Vert', 'Rouge'] },
        {
          't': 'Que portaient-ils tous autour de la taille ?',
          'a': 'Un baudrier',
          'ch': ['Une banane', 'Un baudrier', 'Une corde enroulée', 'Une ceinture rouge']
        },
        { 't': 'De quelle couleur étaient la plupart des casques ?', 'a': 'Rouge', 'ch': ['Jaune', 'Bleu', 'Rouge', 'Blanc'] },
        { 't': 'Combien de personnes étaient assises ?', 'a': 'Aucune', 'ch': ['Aucune', '1', '2', '3'] },
        {
          't': 'Quelle était la position de la personne en t-shirt vert fluo ?',
          'a': '2e en partant de la gauche',
          'ch': ['Tout à gauche', '2e en partant de la gauche', 'Au milieu', '2e en partant de la droite']
        },
        {
          't': 'De quelle couleur était le haut de la personne au milieu du groupe (4e) ?',
          'a': 'Gris',
          'ch': ['Gris', 'Blanc', 'Vert', 'Rouge']
        },
        {
          't': 'Qui était le plus grand du groupe ?',
          'a': 'Le 2e en partant de la droite',
          'ch': ['Tout à gauche', 'Le 3e en partant de la gauche', 'Au milieu', 'Le 2e en partant de la droite']
        },
        { 't': 'Combien de personnes portaient un pantalon long ?', 'a': '4', 'ch': ['2', '3', '4', '5'] },
        { 't': "Qu'y avait-il par terre ?", 'a': 'Des cailloux', 'ch': ["De l'eau", 'De la neige', 'Des cailloux', "De l'herbe"] },
        {
          't': 'Où voyait-on un bout de ciel ?',
          'a': 'En haut à gauche',
          'ch': ['En haut à gauche', 'En haut à droite', 'Au milieu', 'On ne voyait pas le ciel']
        },
        {
          't': 'De quelle couleur étaient les chaussures de la personne tout à droite ?',
          'a': 'Blanches',
          'ch': ['Noires', 'Blanches', 'Rouges', 'Marron']
        },
        {
          't': 'Quelle était la couleur dominante de la roche ?',
          'a': 'Ocre / beige',
          'ch': ['Grise et noire', 'Ocre / beige', 'Rouge vif', 'Blanche']
        },
        { 't': 'Est-ce que certaines personnes portaient des gants ?', 'a': 'Oui', 'ch': ['Oui', 'Non'] },
        {
          't': 'La photo était-elle prise…',
          'a': 'En hauteur (portrait)',
          'ch': ['En hauteur (portrait)', 'En largeur (paysage)', 'En carré', 'En panoramique']
        },
        {
          't': 'De quelle couleur était le haut de la 5e personne en partant de la gauche ?',
          'a': 'Bleu marine',
          'ch': ['Bleu marine', 'Jaune', 'Blanc', 'Rose']
        },
        {
          't': 'Où se trouvait le groupe ?',
          'a': "Sous l'arche, au fond du canyon",
          'ch': ["Sur l'arche", "Sous l'arche, au fond du canyon", "Au bord d'un lac", 'Sur un sentier en forêt']
        }
      ]
    },
    tier: 2
  },
  14: { t: 'La tour de cadeaux', g: 'stack', p: { goal: 20, time: 180 }, tier: 2, ev: '🎰', unlock: 'Le casino est ouvert' },
  15: { t: 'Block blaster', g: 'blocks', p: { goal: 1500 }, tier: 2 },
  16: { t: 'Notre mot fléché 💕', g: 'fleche', p: { time: 480 }, tier: 2 },
  17: { t: 'Libère la voiture', g: 'rush', p: { time: 120 }, tier: 3 },
  18: { t: 'Candy Noël', g: 'candy', p: { moves: 22, target: 14000 }, tier: 3 },
  19: { t: '2048', g: 'g2048', p: { goal: 256 }, tier: 3 },
  20: {
    t: 'Les 7 différences',
    g: 'spot',
    p: {
      a: 'IMG_BAR',
      b: 'IMG_BAR2',
      d: [
        [0.5156, 0.7678, 0.0244],
        [0.4133, 0.0729, 0.0222],
        [0.5633, 0.5758, 0.0178],
        [0.4533, 0.5336, 0.0156],
        [0.74, 0.6065, 0.0167],
        [0.9667, 0.215, 0.02],
        [0.3289, 0.0384, 0.0144]
      ],
      time: 120
    },
    tier: 3
  },
  21: { t: 'Relier les points', g: 'relier', p: { n: 9, k: 8, time: 60 }, tier: 3, ev: '✨', x2: true },
  22: { t: 'Sauve Célestine', g: 'pins', p: { time: 300 }, tier: 3 },
  23: { t: 'Tu me connais par cœur ?', g: 'quiz', p: { need: 4 }, tier: 3 },
  24: { t: 'Puzzle final', g: 'jigsaw', p: { n: 6, rot: 1, time: 240 }, tier: 3, ev: '🎄', bonus: 200 }
};
const FLECHE = {
  'h': 13,
  'w': 12,
  'words': [
    { 'w': 'CELESTINE', 'r': 6, 'c': 3, 'd': 'A', 'q': "La plus belle, c'est toi" },
    { 'w': 'JUILLET', 'r': 1, 'c': 11, 'd': 'D', 'q': 'Le mois de notre début' },
    { 'w': 'MESSAGES', 'r': 5, 'c': 6, 'd': 'D', 'q': "Tu l'as fait en premier" },
    { 'w': 'SOLEIL', 'r': 12, 'c': 6, 'd': 'A', 'q': 'Il était siiii moche, pourtant il fait partie de notre histoire' },
    { 'w': 'ECOSSE', 'r': 1, 'c': 4, 'd': 'D', 'q': 'Là où je vais pécho Maud' },
    { 'w': 'MAMOUR', 'r': 3, 'c': 1, 'd': 'A', 'q': 'Notre petit nom' },
    { 'w': 'SOIREE', 'r': 11, 'c': 1, 'd': 'A', 'q': 'Notre 1re rencontre… sans un mot' },
    { 'w': 'CANYON', 'r': 7, 'c': 2, 'd': 'D', 'q': 'Meilleure expérience de Tenerife (selon moi)' },
    { 'w': 'FLEURS', 'r': 1, 'c': 2, 'd': 'A', 'q': 'Grâce à elles, tu es tombée sous mon charme' },
    { 'w': 'TROIS', 'r': 6, 'c': 8, 'd': 'D', 'q': "Le jour de l'officialisation" },
    { 'w': 'CALIN', 'r': 9, 'c': 5, 'd': 'A', 'q': 'Ce que tu ADORES faire avec moi' },
    { 'w': 'AMOUR', 'r': 2, 'c': 1, 'd': 'D', 'q': "Ce qu'on a trouvé depuis" },
    { 'w': 'TAXI', 'r': 3, 'c': 9, 'd': 'D', 'q': 'Ton rôle à la fin de la soirée' },
    { 'w': 'BAR', 'r': 8, 'c': 1, 'd': 'A', 'q': "Là où on s'est vraiment parlé" }
  ]
};
const PTS = { open: 10 },
  BASE = { 1: 30, 2: 30, 3: 30 };
const EMO = ['🎄', '🎁', '⛄', '🦌', '🔔', '🍪', '🧦', '⭐', '🕯️', '🎅', '❄️', '🍬', '🧸', '🎀', '☕', '🌟'];
const RULES = {
  memory: p => `Retrouve les ${p.pairs} paires de têtes en moins de ${p.time} secondes.`,
  colony: p => `Un dessin en pixels 🐜 : envoie les boîtes sur les ${p.slots} emplacements pour que les fourmis emportent tous les blocs.`,
  melee: p => `Mots mêlés sur le thème <b>${p.theme}</b> : trouve les ${p.words.length} mots en ${p.time / 60} minutes.`,
  flappy: p =>
    `Fais voler Célestine entre les sucres d'orge en touchant l'écran. Passe-en ${p.goal} sans rien toucher : au moindre choc, c'est raté ! Attention, ça accélère, les passages rétrécissent et les sucres d'orge finissent par bouger…`,
  balls: p =>
    `Verse les liquides d'une fiole à l'autre : à la fin, chaque fiole doit contenir un seul liquide. On ne peut verser que sur la même couleur ou dans une fiole vide, et les coups sont comptés ! ${p.time / 60} minutes.`,
  hockey: p =>
    `Match d’air hockey contre Valentin : le premier à ${p.goal} buts gagne. Glisse le doigt pour bouger ta palette, et tape fort dans le palet !`,
  bubble: p =>
    `Vise et tire des bulles : 3 bulles de la même couleur éclatent. Libère les ${p.clues} indices 🔎 coincés avant que les bulles touchent la ligne rouge. Le plafond descend tous les ${p.drop} tirs. ${Math.round(p.time / 60)} minutes.`,
  zip: p => `Trace un seul chemin qui passe par toutes les cases en reliant les numéros de 1 à ${p.k} dans l'ordre. ${p.time} secondes.`,
  arrows: p => `Libère toutes les flèches !`,
  picross: p => `Retrouve le dessin caché grâce aux nombres, puis valide ta grille. Chaque validation fausse te coûte un essai.`,
  simon: p => `Répète la mélodie des clochettes jusqu'à la manche ${p.goal}. Monte le son 🔔`,
  stack: p =>
    `Empile ${p.goal} cadeaux jusqu'à la ligne rouge ! Touche l'écran pour lâcher le cadeau qui glisse : la partie qui dépasse de la tour tombe et le cadeau suivant est plus petit. Pose-le pile dessus pour faire un parfait : le cadeau grandit un peu, et encore plus si tu les enchaînes ! Ça accélère à chaque étage. ${p.time / 60} minutes.`,
  sudoku: p => `Un sudoku expert : remplis la grille puis valide-la. Chaque validation fausse te coûte un essai.`,
  blocks: p => `Place les pièces et complète des lignes pour atteindre ${p.goal} points.`,
  photo: p =>
    `Une photo va s'afficher pendant ${p.show} secondes. Observe-la bien : ensuite elle disparaît et tu auras ${p.q} questions dessus. Il faut ${p.need} bonnes réponses.`,
  spot: p =>
    `Deux photos presque identiques : trouve les ${p.d.length} différences en ${p.time} secondes. Attention, chaque erreur coûte 10 secondes !`,
  fleche: p => `Un mot fléché rien que sur nous deux. Valide chaque mot : un mot faux te coûte un essai. ${p.time / 60} minutes.`,
  rush: p => `Fais sortir la voiture rouge 🚗 par la droite en déplaçant les bus et métros TCL qui bloquent. ${p.time / 60} minutes.`,
  candy: p =>
    `Fais des combinaisons de bonbons pour atteindre <b>${p.target}</b> points en ${p.moves} coups. Aligne-en 4, 5, en L, en T ou en carré pour créer des bonbons spéciaux… puis échange deux spéciaux entre eux !`,
  g2048: p => `Fais glisser les tuiles : deux têtes identiques fusionnent. Atteins la tuile ${p.goal} avant d'être bloquée !`,
  relier: p =>
    `Relie les points de la même couleur en glissant le doigt, sans croiser les chemins. Toutes les cases doivent être remplies ! ${p.time} secondes.`,
  quiz: p => {
    const n = CONTENU.quiz.filter(x => x.a && x.a.length).length;
    return `Réponds aux questions sur nous : ${Math.min(p.need, Math.max(1, n - 1))} bonnes réponses pour gagner. Chaque réponse fausse te coûte un essai.`;
  },
  pins: p =>
    `Sauve Célestine : retire les épingles pour l'amener dans la hotte, loin de la lave et du cambrioleur. ${PIN.LV.length} niveaux, ${p.time / 60} minutes.`,
  jigsaw: p =>
    `Reconstitue la photo : ${p.n * p.n} pièces mélangées et tournées. Pose-les dans les cadres, touche-les pour les tourner. ${p.time / 60} minutes.`
};
const LEVELS = [
  [0, 'Célesteenager', 14],
  [110, 'Célestinhaler', 2],
  [270, 'Célestinégalable', 16],
  [460, 'Célestinestimable', 5],
  [680, 'Célestinattendue', 18],
  [940, 'Célestinachevable', 8],
  [1230, 'Célestinoubliable', 20],
  [1540, 'Célestinévitable', 11],
  [1900, 'Célestinouïe', 26],
  [2300, 'Célestinarrêtable', 30]
];
const lvlPic = L => {
  const P = CONTENU.photos || [];
  return P.length ? P[LEVELS[L][2] % P.length] : '';
};
const SHOP = [
  {
    id: 'hint',
    ic: '💡',
    n: 'Indice',
    d: 'Une aide pendant un mini-jeu : touche 💡 en haut de la fenêtre du jeu quand tu es bloquée',
    p: 30,
    k: 'inv'
  },
  { id: 'joker', ic: '🃏', n: 'Joker', d: 'Un essai de plus sur un jeu raté.', p: 40, k: 'inv' },
  {
    id: 'dbl',
    ic: '✨',
    n: 'Points doublés',
    d: "À activer sur la page d'un jeu, avant de le commencer : si tu le réussis, ses points sont doublés.",
    p: 60,
    k: 'inv'
  },
  { id: 'early', ic: '🔓', n: 'Case en avance', d: "Ouvre la case de demain dès aujourd'hui (pas la 24).", p: 150, k: 'inv' },
  { id: 'coeurs', ic: '💗', n: 'Tempête de cœurs', d: "Des petits cœurs tombent sur l'écran à la place des flocons.", p: 60, k: 'own' },
  { id: 'fondrose', ic: '🌸', n: 'Fond rose', d: "Tout le fond de l'appli passe en rose.", p: 80, k: 'own' },
  { id: 'ordore', ic: '✨', n: 'Écriture dorée', d: "Tous les textes s'écrivent en doré.", p: 80, k: 'own' },
  {
    id: 'voix',
    ic: '🎙️',
    n: 'Pack de voix',
    d: 'Tu entends ma voix te dire un petit mot (au hasard) quand tu ouvres une case, réussis un jeu ou achètes un objet.',
    p: 200,
    k: 'own'
  },
  { id: 'jeton', ic: '🎟️', n: 'Jeton de casino', d: 'Une mise gratuite de 10 ⭐ au casino.', p: 0, k: 'inv' }
];
const WHEEL = [2, 5, 8, 10, 15, 25, 'hint', 'joker', 's15', 's30', 'gem'];
const wLab = w => (typeof w == 'number' ? w + '⭐' : { hint: '💡', joker: '🃏', s15: '15🔩', s30: '30🔩', gem: '💎' }[w]);
