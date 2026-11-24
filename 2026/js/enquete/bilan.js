/* ================= 📊 Bilan de fin d'aventure ================= */
function bilanData() {
  const D = S.days || {},
    V = Object.entries(D).filter(([d, x]) => x),
    done = V.filter(([d, x]) => x.done),
    fails = V.reduce((a, [d, x]) => a + (x.fails || 0), 0);
  const hard = V.slice().sort((a, b) => (b[1].fails || 0) - (a[1].fails || 0))[0];
  let eg = 0;
  try {
    eg = eggs().length;
  } catch (_) {}
  let ach = 0;
  try {
    ach = Object.keys(achS()).length;
  } catch (_) {}
  let lv = '';
  try {
    lv = LEVELS[lvl()][1];
  } catch (_) {}
  return {
    done: done.length,
    first: done.filter(([d, x]) => !x.fails).length,
    fails,
    hard: hard && hard[1].fails ? { d: hard[0], t: (DAYS[hard[0]] || {}).t, f: hard[1].fails } : null,
    boss: Object.keys(S.boss || {}).length,
    btry: Object.values(S.bossTry || {}).reduce((a, b) => a + b, 0),
    acc: S.accTry || 0,
    x: Object.keys(S.enqX || {}).length,
    l: (S.enqL || []).length,
    n: Object.values(S.enqN || {}).filter(v => v && v.trim()).length,
    rev: (S.story || {}).rev || 0,
    eggs: eg,
    ach,
    achT: ACHS.length,
    earned: S.earned || S.pts || 0,
    lv
  };
}
function bilanHTML() {
  const B = bilanData(),
    T = (i, v, l) => `<div class="bl-t"><b>${i} ${v}</b><small>${l}</small></div>`;
  return `<div class="bl"><p class="bl-k">📁 Affaire classée · Dossier n°24</p><h2 style="margin:.2em 0 .4em">📊 Ton bilan</h2>
 <div class="bl-g">${T('📅', B.done + '/24', 'jeux réussis')}${T('🎯', B.first, 'du premier coup')}${T('💔', B.fails, 'essais ratés')}${T('👹', B.boss + '/6', 'boss vaincus')}${T('⚔️', B.btry, 'combats de boss')}${T('⚖️', B.acc, 'erreurs avant le démasquage')}${T('❌', B.x, 'suspects barrés')}${T('🧵', B.l, 'fils rouges tirés')}${T('📝', B.n, 'notes d’enquête')}${T('🥚', B.eggs + '/24', 'œufs trouvés')}${T('🏆', B.ach + '/' + B.achT, 'succès')}${T('⭐', B.earned, 'étoiles gagnées')}</div>
 ${B.hard ? `<p class="bl-m">😤 Le jour le plus coriace : <b>jour ${B.hard.d} · ${esc(B.hard.t || '')}</b> (${B.hard.f} échec${B.hard.f > 1 ? 's' : ''})</p>` : '<p class="bl-m">😎 Aucun échec de tout le mois !</p>'}
 ${B.rev ? `<p class="bl-m">🔦 Valentin démasqué le <b>${new Date(B.rev).toLocaleDateString(S.lang == 'en' ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'long' })}</b> à ${new Date(B.rev).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>` : ''}
 ${B.lv ? `<p class="bl-m">🎖️ Rang final : <b>${esc(B.lv)}</b></p>` : ''}
 <p class="bl-q">${B.acc == 0 ? '🕵️ Accusation parfaite, du premier coup. Détective de légende.' : B.acc < 3 ? '🕵️ Quelques hésitations… mais la vérité a triomphé.' : '🕵️ La silhouette t’a donné du fil à retordre, mais tu l’as eue !'}</p></div>`;
}
function bilanOpen() {
  popup(
    `${bilanHTML()}<button onclick="bilanShare()">📤 Partager mon bilan</button><button class="alt" onclick="closePop()">Fermer</button>`
  );
  try {
    confetti();
  } catch (_) {}
  try {
    slog('📊', 'Regarde son bilan de fin');
  } catch (_) {}
}
async function bilanShare() {
  const B = bilanData(),
    t = `🎄 Dossier n°24 · mon bilan\n📅 ${B.done}/24 jeux réussis (${B.first} du premier coup)\n👹 ${B.boss}/6 boss vaincus\n⚖️ ${B.acc} erreur(s) avant de démasquer le voleur\n🥚 ${B.eggs}/24 œufs · 🏆 ${B.ach} succès · ⭐ ${B.earned} étoiles`;
  try {
    if (navigator.share) {
      await navigator.share({ text: t });
      return;
    }
  } catch (_) {}
  try {
    await navigator.clipboard.writeText(t);
    toast('Bilan copié 📋');
  } catch (_) {
    appAlert(t);
  }
}
