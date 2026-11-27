/* ---------- ⚙️ Paramètres ---------- */
function applyDisp() {
  try {
    let d = document.getElementById('dimz');
    if (!d) {
      d = document.createElement('div');
      d.id = 'dimz';
      document.body.appendChild(d);
    }
    const b = S.lum == null ? 100 : S.lum;
    d.style.opacity = (1 - b / 100).toFixed(2);
    let w = document.getElementById('warmz');
    if (!w) {
      w = document.createElement('div');
      w.id = 'warmz';
      document.body.appendChild(w);
    }
    w.style.display = S.warm ? 'block' : 'none';
    document.body.style.fontSize = { s: '14.5px', l: '18px' }[S.fsz] || '';
    wakeUpd();
  } catch (_) {}
}
let WL = null;
function wakeUpd() {
  try {
    const want = S.wake && document.visibilityState == 'visible';
    if (want && !WL && navigator.wakeLock)
      navigator.wakeLock
        .request('screen')
        .then(l => {
          WL = l;
          l.addEventListener('release', () => {
            WL = null;
          });
        })
        .catch(() => {});
    else if (!want && WL) {
      WL.release();
      WL = null;
    }
  } catch (_) {}
}
document.addEventListener('visibilitychange', wakeUpd);
try {
  const _vib = navigator.vibrate && navigator.vibrate.bind(navigator);
  if (_vib)
    navigator.vibrate = function (p) {
      return S && S.vib === false ? false : _vib(p);
    };
} catch (_) {}
function setLang(l) {
  if ((S.lang || 'fr') == l) return;
  S.lang = l;
  save();
  toast(l == 'en' ? 'Language: English 🇬🇧' : l == 'br' ? '⠠⠃⠕⠝⠝⠑ ⠇⠑⠉⠞⠥⠗⠑ 🤓' : 'Langue : Français 🇫🇷');
  setTimeout(() => location.reload(), 500);
}
function setOpt(k, v) {
  S[k] = v;
  save();
  applyDisp();
  if (k == 'fxbg') snowCount();
}
function setView() {
  const ck = (k, lbl, extra) =>
      `<p><label><input type="checkbox" ${S[k] !== false && (S[k] !== undefined || !extra) ? 'checked' : ''} onchange="${extra || `setOpt('${k}',this.checked)`}"> ${lbl}</label></p>`,
    L = S.lang || 'fr',
    b = S.lum == null ? 100 : S.lum,
    deco = SHOP.filter(x => x.k == 'own' && S.own.includes(x.id));
  app.innerHTML = `<h1>⚙️ Paramètres</h1>
 <h2>🌍 Langue</h2><div class="panel"><div class="row setl" data-notr><button class="${L == 'fr' ? '' : 'alt'}" onclick="setLang('fr')">🇫🇷 Français</button><button class="${L == 'en' ? '' : 'alt'}" onclick="setLang('en')">🇬🇧 English</button><button class="${L == 'br' ? '' : 'alt'}" onclick="setLang('br')">⠃⠗⠁⠊⠇⠇⠑ Braille</button></div><p class="muted" style="margin:6px 0 0;font-size:.85rem">La langue change tout le calendrier. L'application va se recharger.</p></div>
 <h2>🔊 Son et vibrations</h2><div class="panel">
  <p><label><input type="checkbox" ${S.sound !== false ? 'checked' : ''} onchange="S.sound=this.checked;save();if(this.checked)SFX('ok')"> 🔊 Sons des mini-jeux</label></p>
  <p><label><input type="checkbox" ${S.music !== false ? 'checked' : ''} onchange="S.music=this.checked;save()"> 🎵 Musique pendant les mini-jeux</label></p>
  <p><label><input type="checkbox" ${S.bgm !== false ? 'checked' : ''} onchange="S.bgm=this.checked;save();if(this.checked)bgm();else MUS.stop()"> 🎶 Musique d'ambiance dans le calendrier</label></p>
  <p><label><input type="checkbox" ${S.vib !== false ? 'checked' : ''} onchange="S.vib=this.checked;save();if(this.checked)try{navigator.vibrate(60)}catch(_){}"> 📳 Vibrations</label></p></div>
 <h2>☀️ Affichage</h2><div class="panel">
  <p style="margin:0 0 4px">Luminosité : <b id="lumv">${b} %</b></p><input type="range" class="setr" min="35" max="100" step="5" value="${b}" oninput="S.lum=+this.value;$('#lumv').textContent=this.value+' %';applyDisp()" onchange="save()">
  <p style="margin:10px 0 4px">Taille du texte</p><div class="row setl">${[
    ['s', 'Petit'],
    ['n', 'Normal'],
    ['l', 'Grand']
  ]
    .map(([k, n]) => `<button class="sm ${(S.fsz || 'n') == k ? '' : 'alt'}" onclick="setOpt('fsz','${k}');setView()">${n}</button>`)
    .join('')}</div>
  <p><label><input type="checkbox" ${S.warm ? 'checked' : ''} onchange="setOpt('warm',this.checked)"> 🌅 Lumière douce (moins de bleu le soir)</label></p>
  <p><label><input type="checkbox" ${S.fxbg !== false ? 'checked' : ''} onchange="setOpt('fxbg',this.checked)"> ✨ Animations de fond (neige, cœurs, cadeaux)</label></p>
  <p><label><input type="checkbox" ${S.wake ? 'checked' : ''} onchange="setOpt('wake',this.checked)"> 🔆 Garder l'écran allumé pendant les jeux</label></p>
  <p style="margin:8px 0 0"><button class="sm alt" onclick="S.lum=100;S.fsz='n';S.warm=false;save();applyDisp();setView()">↺ Remettre l'affichage par défaut</button></p></div>
 <h2>🎄 Décorations</h2><div class="panel">${deco.map(x => `<p><label><input type="checkbox" ${S[x.id] !== false ? 'checked' : ''} onchange="S['${x.id}']=this.checked;save();snowCount();${x.id == 'voix' ? 'ding()' : ''}"> ${x.ic} ${esc(x.n)}</label></p>`).join('') || '<p class="muted" style="margin:0">Fabrique des décorations au 🧪 labo pour les activer ici.</p>'}</div>
 <h2>😜 Options spéciales</h2><div class="panel"><p><label><input type="checkbox" onchange="if(this.checked){const c=this;setTimeout(()=>{c.checked=false},600);toast('Impossible : fonctionnalité intégrée au produit 🤷')}"> 🔇 Couper les blagues nulles de Valentin</label></p><p><label><input type="checkbox" onchange="if(this.checked){const c=this;toast('Mode adulte responsable : activé…');setTimeout(()=>{c.checked=false;toast('On a essayé. Ça n’a pas tenu.')},2000)}"> 🧑‍💼 Mode adulte responsable</label></p></div>
 <h2>📲 Appli et sauvegarde</h2>${APP.web() && !APP.standalone() ? '<div class="panel"><button class="alt" onclick="installScreen(true)">📲 Installer l’appli sur cet appareil</button></div>' : ''}${syncHTML()}
 <h2>ℹ️ À propos</h2><div class="panel center"><p style="margin:0">🔎 Dossier n°24 · Le bracelet au cœur rose</p><p class="muted" style="margin:4px 0 0;font-size:.85rem">Fait avec ❤️ par Valentin, pour Célestine.<br>${
   isFinite(+APPV)
     ? (() => {
         const d = new Date(APPV * 1000),
           z = { timeZone: 'Europe/Paris' };
         let a, b;
         try {
           a = d.toLocaleDateString(L == 'en' ? 'en-GB' : 'fr-FR', z);
           b = d.toLocaleTimeString('fr-FR', { ...z, hour: '2-digit', minute: '2-digit', second: '2-digit' });
         } catch (_) {
           a = d.toLocaleDateString();
           b = d.toLocaleTimeString();
         }
         return (L == 'en' ? 'Version from ' : 'Version du ') + a + (L == 'en' ? ' at ' : ' à ') + b;
       })()
     : ''
 }</p></div>
 <p class="center"><button onclick="go('cal')">← Calendrier</button></p>`;
}
try {
  applyDisp();
} catch (_) {}
