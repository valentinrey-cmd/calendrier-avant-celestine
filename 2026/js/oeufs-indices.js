/* ---------- Œufs cachés : un par jour ---------- */
const EGGCLUE = {
  1: 'Les meilleures mémoires ne regardent jamais deux fois en vain.',
  2: 'Les fourmis les plus malignes se contentent souvent de deux places.',
  3: "Attention aux coquilles, il s'en glisse toujours une.",
  4: "Certains sucres d'orge sont plus creux qu'ils n'en ont l'air.",
  5: "On raconte que Panoramix a inventé la recette de la potion magique un jour d'arc-en-ciel.",
  6: 'Les plus beaux buts savent rebondir des deux côtés.',
  7: 'Comme en amour, la fin peut aussi être un début.',
  8: "Tout en haut, une bulle dorée attend qu'on vienne la toucher.",
  9: 'La flèche du milieu est souvent la plus patiente.',
  10: "Au crayon, on finit toujours par dessiner ce qu'on cherche.",
  11: 'Là-haut, même le silence a sa mélodie.',
  12: "Une case pleine d'hésitations peut cacher quelque chose.",
  13: "Tout n'est pas forcément d'origine.",
  14: 'La perfection, quand elle se répète, finit toujours par éclore.',
  16: "On dit qu'écrire ce qu'on cherche suffit parfois à le trouver.",
  17: 'Quelques petits coups de klaxon ne font jamais de mal.',
  19: 'Les vrais joueurs connaissent le code Konami par cœur.',
  21: 'Chaque couleur rêve de couver son propre œuf.',
  22: "Au tout premier niveau, quelqu'un d'autre rêve aussi de la hotte.",
  23: "Une vieille question n'a toujours pas de réponse : la poule ou… ?",
  24: 'La pièce du cœur aime faire un tour de plus que les autres.',
  18: "Comme dans une cheminée, ce qui est tout en haut ne demande qu'à descendre."
};
function eggRules(d, t) {
  const c = EGGCLUE[d];
  if (!c) return t;
  const m = /[.!?…] (?=[A-ZÀ-ÖÉÈÊ«<])/.exec(t);
  if (!m) return t + ' ' + c;
  const i = m.index + 1;
  return t.slice(0, i) + ' ' + c + t.slice(i);
}
