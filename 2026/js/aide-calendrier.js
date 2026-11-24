function calHelp() {
  const C = a => `<div class="chips">${a.map(([l, v]) => `<span><small>${l}</small><b>${v}</b></span>`).join('')}</div>`;
  const R = (ic, t, txt, ch) =>
    `<div class="rl"><div class="rlh"><span class="rli">${ic}</span><b>${t}</b></div><p>${txt}</p>${ch ? C(ch) : ''}</div>`;
  popup(`<h2>ℹ️ Comment ça marche</h2><div class="rls">
 ${R('📅', 'Une case par jour', "Chaque jour de décembre, une case s'ouvre à minuit. Certaines cachent un cadeau.", [
   ['Ouvrir', '10 ⭐'],
   ['Jour 1', '+50 ⭐'],
   ['Jour 12', '+100 ⭐'],
   ['Jour 24', '+200 ⭐']
 ])}
 ${R(
   '🎯',
   'Le défi du jour',
   "Tu as 3 essais. Un 🃏 joker t'en donne un de plus, un 💡 indice t'aide pendant le jeu. Les jours ✨×2 rapportent le double.",
   [
     ['1er essai', '40 ⭐'],
     ['2e essai', '30 ⭐'],
     ['3e essai', '20 ⭐'],
     ['4e et +', '10 ⭐']
   ]
 )}
 ${R('🔥', 'Les flammes', "Réussis les défis plusieurs jours d'affilée. Un défi raté éteint la flamme.", [
   ['3 jours', '10 ⭐'],
   ['7 jours', '25 ⭐'],
   ['14 jours', '50 ⭐'],
   ['24 jours', '100 ⭐']
 ])}
 ${R('🔁', 'Entraînement', "Après le défi, rejoue autant que tu veux pour t'entraîner.")}
 ${R('👹', 'Les boss', "Les cases avec 👹 cachent un boss. Réussis le défi du jour pour l'affronter : chaque boss vaincu débloque une 🎬 vidéo mystère dans l'album. Tu peux le retenter gratuitement autant de fois que tu veux.")}
 ${R('🥚', 'Les œufs cachés', 'Chaque jeu cache un œuf… Relis bien les textes. Les 24 œufs ouvrent un niveau secret.', [['Niveau secret', '1 ⭐ / 10 pts']])}
 ${R(
   '🧩',
   'Le puzzle final',
   'Gérald a passé le formulaire d’accusation au broyeur : chaque case ouverte te rend un des 24 morceaux. Recolle-le à la fin pour l’envoyer au procureur.',
   [
     ['Facile', '100 ⭐'],
     ['Moyen', '200 ⭐'],
     ['Difficile', '300 ⭐']
   ]
 )}
 </div><button onclick="closePop()">Compris !</button>`);
}
