// Réglages qui changent entre la vraie version (2026/) et la version de test.
// La version de test s'ouvre avec /test/ (qui redirige vers 2026/?test).
const VERSION_TEST = /[?&]test(?:[=&]|$)/.test(location.search);
// Sauvegarde dans le navigateur (localStorage) : séparée pour ne pas mélanger les tests et la vraie partie.
const CLE_SAUVEGARDE = VERSION_TEST ? 'avent_test' : 'avent_v5';
if (VERSION_TEST) document.write('<meta name="robots" content="noindex">');
