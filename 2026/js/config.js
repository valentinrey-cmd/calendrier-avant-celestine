// Réglages qui changent entre la vraie version (2026/) et la version de test.
// La version de test s'ouvre avec /test/ (qui redirige vers 2026/?test).
const VERSION_TEST = /[?&]test(?:[=&]|$)/.test(location.search);
// Sauvegarde dans le navigateur (localStorage) : séparée pour ne pas mélanger les tests et la vraie partie.
const CLE_SAUVEGARDE = VERSION_TEST ? 'avent_test' : 'avent_v5';
// Remise à zéro générale : changer cette date efface, une seule fois sur chaque appareil (au prochain lancement),
// toute la progression : les 3 sauvegardes, la vraie partie et la version de test, la signature des CGU, la photo et les musiques importées.
const REMISE_A_ZERO = '2026-11-26';
try {
  if (localStorage.getItem('avent_raz') !== REMISE_A_ZERO) {
    Object.keys(localStorage)
      .filter(k => k.startsWith('avent'))
      .forEach(k => localStorage.removeItem(k));
    sessionStorage.clear();
    try {
      indexedDB.deleteDatabase('avent_music');
    } catch (_) {}
    localStorage.setItem('avent_raz', REMISE_A_ZERO);
  }
} catch (_) {}
if (VERSION_TEST) document.write('<meta name="robots" content="noindex">');
