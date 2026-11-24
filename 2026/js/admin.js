let taps = [];
$('#logo').onclick = () => {
  const n = Date.now();
  taps = taps.filter(x => n - x < 3000);
  taps.push(n);
  if (taps.length >= 7) {
    taps = [];
    popup(
      `<h2>🔐 Accès secret</h2><input type="text" id="pin" inputmode="numeric" placeholder="Code"><p><button onclick="if($('#pin').value==CONTENU.codeSecret)admin();else toast('Code faux')">Entrer</button><button class="alt" onclick="closePop()">Annuler</button></p>`
    );
  }
};
function askWipe() {
  popup(
    '<h2>Tout effacer ?</h2><p>Toute la progression de cet appareil sera supprimée.</p><button onclick="wipe()">Oui, tout effacer</button><button class="alt" onclick="admin()">Annuler</button>'
  );
}
function wipe() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem('avent_img');
  } catch (e) {}
  location.reload();
}
function demToggle() {
  S.demOn = !S.demOn;
  save();
  toast(S.demOn ? '⚖️ Accusation débloquée : possible tout de suite' : '🔒 Accusation rebloquée');
  try {
    slog('⚖️', 'Accusation (test) ' + (S.demOn ? 'ON' : 'OFF'));
  } catch (_) {}
  admin();
}
function demGo() {
  closePop();
  go('lab');
  setTimeout(() => {
    try {
      mOpen('secret');
    } catch (e) {
      console.error(e);
    }
  }, 350);
}
function bossTest(d) {
  closePop();
  go('day', d);
  setTimeout(() => {
    try {
      launchBoss(d, 1);
    } catch (e) {
      console.error(e);
      toast('Impossible de lancer ce boss');
    }
  }, 350);
}
function admin() {
  try {
    if (!S.tst) {
      const [y, m] = today();
      if (y == YEAR && m < 12) {
        S.tst = 1;
        save();
      }
    }
  } catch (_) {}
  popup(`<h2>Mode test</h2><p>Jour simulé : <select id="sim" style="font:inherit;padding:6px">${Array.from({ length: 26 }, (_, i) => `<option value="${i}" ${S.sim == i ? 'selected' : ''}>${i ? 'Jour ' + i : CONTENU.modeTest ? 'Tous les jours' : 'Date réelle'}</option>`).join('')}</select></p>
 <button onclick="S.sim=+$('#sim').value;save();go('cal')">Appliquer</button><button onclick="award(100,'test');admin()">+100 ⭐</button><button onclick="S.scr+=100;S.gem+=5;save();admin();hdr()">+100 🔩 +5 💎</button>
 <p><button class="${S.eggTroll ? '' : 'alt'}" onclick="eggTroll()">🥚 Tous les œufs (troll) : <b>${S.eggTroll ? 'ON' : 'OFF'}</b></button></p>
 <p><button class="${S.arrowFolle ? '' : 'alt'}" onclick="arrowFolle()">🌀 Flèches en folie (troll) : <b>${S.arrowFolle ? 'ON' : 'OFF'}</b></button></p>
 <p><button class="alt" onclick="vrecExport()">⚔️ Code de mes records (à lui envoyer)</button></p>
 <p><button class="alt" onclick="achReset()">🏆 Réinitialiser les succès</button></p>
 <p><button class="${S.demOn ? '' : 'alt'}" onclick="demToggle()">⚖️ Accusation débloquée (test) : <b>${S.demOn ? 'ON' : 'OFF'}</b></button>${S.demOn ? `<button class="alt" onclick="demGo()">⚖️ Aller au fax du procureur</button>` : ''}</p>
 <p><span class="vbpk">👹 Tester un boss :</span>${BOSSD.map(d => {
   const B = bossCfg(d);
   return `<button class="alt sm" onclick="bossTest(${d})">${B.ic} Jour ${d}</button>`;
 }).join('')}</p>
 <p><span class="vbpk">😈 Tester le boss final :</span>${[1, 2, 3, 4].map(k => `<button class="alt sm" onclick="closePop();vBoss(1,${k})">Partie ${k}</button>`).join('')}<button class="alt" onclick="closePop();vCredits()">🎬 Voir le générique de fin</button><button class="alt" onclick="closePop();storyAll()">📖 Jouer toute l’histoire</button><button class="alt" onclick="closePop();smOpen(1)">🎮 Revoir le menu démarrer</button></p>
 <p><span class="vbpk">🎭 Revoir les fausses pistes :</span>${['noemie', 'emma', 'nora', 'erika', 'eya', 'edgar', 'parents', 'sandrine']
   .filter(k => STORY['acc_' + k])
   .map(
     k =>
       `<button class="alt sm" onclick="closePop();story('acc_${k}',()=>{try{render()}catch(_){}},1)">${esc(STORY['acc_' + k].t.replace('Fausse piste · ', ''))}</button>`
   )
   .join('')}</p>
 <p><button class="alt" onclick="bossReset()">👹 Réinitialiser les boss et les vidéos${Object.keys(S.boss || {}).length ? ' (' + Object.keys(S.boss || {}).length + ' vaincu' + (Object.keys(S.boss || {}).length > 1 ? 's' : '') + ')' : ''}</button></p>
 <p><button class="alt" onclick="secReset()">🌟 Réinitialiser le niveau secret${S.secret && S.secret.done ? ' (score ' + (S.secret.score || 0) + ')' : ''}</button></p>
 <p><button class="alt" onclick="musAdmin()">🎵 Musiques MP3 (${YTM.count()}/24)</button></p>
 <p><button class="${S.own.includes('playlist') ? '' : 'alt'}" onclick="if(S.own.includes('playlist'))S.own=S.own.filter(x=>x!='playlist');else S.own.push('playlist');save();admin()">🎵 Playlist débloquée (test) : <b>${S.own.includes('playlist') ? 'ON' : 'OFF'}</b></button></p>
 <p><span class="btn">📷 Changer l'image du puzzle<input type="file" accept="image/*" class="fpick" aria-label="Changer l'image du puzzle"></span></p>
 <p><button class="alt" onclick="resetPuz()">🧩 Réinitialiser le puzzle${S.diffLock ? ' (' + LV[S.diffLock].n + ')' : ''}</button></p>
 <p><button class="alt" onclick="askWipe()">🗑️ Tout réinitialiser</button></p><p class="muted">Pense à remettre « Date réelle » (ou à tout réinitialiser) avant de lui laisser l'appareil.</p><button class="alt" onclick="closePop()">Fermer</button>`);
}
