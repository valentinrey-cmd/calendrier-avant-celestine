/* ---------- Appli installable ---------- */
const APP = {
  native: () => /AventApp/.test(navigator.userAgent),
  standalone: () =>
    /AventApp/.test(navigator.userAgent) ||
    matchMedia('(display-mode: standalone)').matches ||
    matchMedia('(display-mode: fullscreen)').matches ||
    navigator.standalone === true,
  web: () => /github\.io$/.test(location.hostname),
  ios: () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1),
  prompt: null
};
addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  APP.prompt = e;
  const b = document.getElementById('iand');
  if (b) b.hidden = false;
});
if ('serviceWorker' in navigator && APP.web()) addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
const SHARE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
function instEnv() {
  const u = navigator.userAgent;
  if (/FBAN|FBAV|FB_IAB|Instagram|Snapchat|Messenger|Line\/|MicroMessenger|TikTok|musical_ly|Twitter|LinkedInApp|GSA\//.test(u))
    return 'inapp';
  if (APP.ios()) return /CriOS|FxiOS|EdgiOS/.test(u) ? 'iosother' : 'ios';
  const mob = /Android/.test(u);
  if (/SamsungBrowser/.test(u)) return 'samsung';
  if (/Firefox/.test(u)) return mob ? 'ffa' : 'ffd';
  if (/Edg\//.test(u)) return mob ? 'chromea' : 'edge';
  if (/Safari/.test(u) && !/Chrome|Chromium/.test(u)) return 'macsafari';
  return mob ? 'chromea' : 'chromed';
}
function instSteps(env) {
  const K = t => `<span class="k">${t}</span>`;
  switch (env) {
    case 'inapp':
      return [
        `Tu as ouvert le lien dans une autre appli (Messenger, Instagram…) : l’installation n’y est pas possible.`,
        `Touche ${K('Copier le lien')} ci-dessous`,
        `Ouvre <b>${APP.ios() ? 'Safari' : 'Chrome'}</b>, colle le lien dans la barre d’adresse et suis les étapes.`
      ];
    case 'ios':
      return [
        `Touche ${K(SHARE + ' Partager')} en haut de Safari <small style="opacity:.7">(ou le bouton <b>•••</b> puis Partager)</small>`,
        `Choisis ${K('➕ Sur l’écran d’accueil')}`,
        `Laisse <b>« Ouvrir comme app web »</b> activé, puis touche ${K('Ajouter')}`,
        `Ferme Safari et ouvre l’appli <b>Dossier n°24</b> depuis ton écran d’accueil !`
      ];
    case 'iosother':
      return [
        `Touche ${K(SHARE + ' Partager')} dans la barre d’adresse`,
        `Choisis ${K('➕ Sur l’écran d’accueil')} puis ${K('Ajouter')}`,
        `Ouvre l’appli <b>Dossier n°24</b> depuis ton écran d’accueil ! <small style="opacity:.7">(si l’option n’apparaît pas, ouvre le lien dans Safari)</small>`
      ];
    case 'samsung':
      return [
        `Touche le menu ${K('≡')} en bas à droite`,
        `Choisis ${K('Ajouter la page à')} puis ${K('Écran d’accueil')}`,
        `Ouvre l’appli <b>Dossier n°24</b> depuis ton écran d’accueil !`
      ];
    case 'ffa':
      return [
        `Touche le menu ${K('⋮')}`,
        `Choisis ${K('Installer')} <small style="opacity:.7">(ou « Ajouter à l’écran d’accueil »)</small>`,
        `Ouvre l’appli <b>Dossier n°24</b> depuis ton écran d’accueil !`
      ];
    case 'chromea':
      return [
        `Touche ${K('📲 Installer')} ci-dessous, ou le menu ${K('⋮')} en haut à droite`,
        `Choisis ${K('Ajouter à l’écran d’accueil')} puis ${K('Installer')}`,
        `Ouvre l’appli <b>Dossier n°24</b> depuis ton écran d’accueil !`
      ];
    case 'edge':
      return [
        `Clique ${K('📲 Installer')} ci-dessous, ou le menu ${K('…')} en haut à droite`,
        `Choisis ${K('Applications')} puis ${K('Installer ce site en tant qu’application')}`,
        `L’appli <b>Dossier n°24</b> s’ouvre dans sa propre fenêtre !`
      ];
    case 'macsafari':
      return [
        `Dans la barre de menus, clique ${K('Fichier')}`,
        `Choisis ${K('Ajouter au Dock')} puis ${K('Ajouter')}`,
        `L’appli <b>Dossier n°24</b> est dans ton Dock !`
      ];
    case 'ffd':
      return [
        `Firefox sur ordinateur ne sait pas installer d’appli web.`,
        `Ouvre ce lien dans <b>Chrome</b> ou <b>Edge</b>`,
        `Puis clique ${K('📲 Installer')}`
      ];
    default:
      return [
        `Clique ${K('📲 Installer')} ci-dessous, ou l’icône ${K('⊕')} à droite de la barre d’adresse`,
        `Sinon : menu ${K('⋮')} → ${K('Caster, enregistrer et partager')} → ${K('Installer la page en tant qu’appli')}`,
        `L’appli <b>Dossier n°24</b> s’ouvre dans sa propre fenêtre !`
      ];
  }
}
function installScreen(force) {
  if (!force && (!APP.web() || APP.standalone() || sessionStorage.getItem('instSkip'))) return;
  if (document.getElementById('inst')) return;
  const env = instEnv(),
    ios = env == 'ios' || env == 'iosother',
    canBtn = /chrome|edge/.test(env),
    prog = (S.opened || []).length > 0 || (S.pts || 0) > 0,
    o = document.createElement('div');
  o.id = 'inst';
  const steps = instSteps(env);
  o.innerHTML = `${env == 'ios' ? '<div class="ipt">👆</div>' : ''}<img src="icon-anim.svg" alt=""><h1>Installe ton appli 🎁</h1><p class="sub">Ton calendrier de l’Avent devient une vraie appli : une icône rien qu’à toi, en plein écran, sans le navigateur.</p>${/chromea|samsung|ffa/.test(env) ? `<a class="ibig" href="avent.apk" download="Avent.apk" style="display:inline-block;margin:0 0 6px;color:#fff;text-decoration:none;border-radius:999px">📥 Télécharger l’appli Android</a><p class="sub" style="font-size:.85rem">Ouvre le fichier <b>Avent.apk</b> téléchargé, autorise l’installation si Android le demande, puis touche <b>Installer</b>.</p><p class="sub" style="opacity:.6;font-size:.8rem;margin:4px 0 8px">— ou version web —</p>` : ''}
 <div class="ist">${steps.map((t, i) => `<div><b class="n">${i + 1}</b><span>${t}</span></div>`).join('')}</div>
 ${canBtn ? `<button class="ibig" id="iand">📲 Installer</button>` : ''}${env == 'inapp' ? `<button class="ibig" id="ilink">🔗 Copier le lien</button>` : ''}
 <p class="sub" id="imsg" style="font-size:.85rem;margin-top:10px"></p>
 ${prog ? `<button class="ibig" style="background:linear-gradient(145deg,#ffe27a,#ff9f1a);color:#3a1a00;box-shadow:0 5px 0 #a85a00" id="icode">📤 J’ai déjà joué ici : copier ma progression</button><p class="sub" style="font-size:.8rem;margin-top:6px">Dans l’appli, ouvre le menu de démarrage → ⚙️ Options → 📥 Coller un code pour la retrouver.</p>` : ''}
 <button class="ilow" id="iskip">Continuer dans le navigateur</button>`;
  document.body.appendChild(o);
  const msg = t => {
    o.querySelector('#imsg').innerHTML = t;
  };
  const a = o.querySelector('#iand');
  if (a)
    a.onclick = async () => {
      if (!APP.prompt) {
        msg(
          'Le bouton direct n’est pas disponible ici (l’appli est peut-être <b>déjà installée</b> : regarde sur ton écran d’accueil). Sinon, suis les étapes 1 et 2 avec le menu du navigateur 👆'
        );
        o.querySelectorAll('.ist div').forEach(d => {
          d.style.animation = 'none';
          d.offsetWidth;
          d.style.animation = 'istin .5s forwards';
        });
        return;
      }
      try {
        APP.prompt.prompt();
        const r = await APP.prompt.userChoice;
        APP.prompt = null;
        if (r.outcome == 'accepted') {
          msg('🎉 Appli installée ! Ouvre <b>Dossier n°24</b> depuis ton écran d’accueil.');
          a.hidden = true;
        } else msg('Installation annulée. Retouche le bouton quand tu veux, ou passe par le menu du navigateur.');
      } catch (e) {
        msg('Passe par le menu du navigateur (étapes 1 et 2) 👆');
      }
    };
  const l = o.querySelector('#ilink');
  if (l)
    l.onclick = async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        msg('✅ Lien copié ! Colle-le dans ' + (APP.ios() ? 'Safari' : 'Chrome') + '.');
      } catch (_) {
        msg('Copie ce lien : <b style="user-select:all">' + location.href + '</b>');
      }
    };
  const c = o.querySelector('#icode');
  if (c) c.onclick = () => syncExport();
  o.querySelector('#iskip').onclick = () => {
    sessionStorage.setItem('instSkip', 1);
    o.remove();
  };
}
addEventListener('appinstalled', () => {
  APP.prompt = null;
  const m = document.getElementById('imsg');
  if (m) m.innerHTML = '🎉 Appli installée ! Ouvre <b>Dossier n°24</b> depuis ton écran d’accueil.';
});
addEventListener('load', () =>
  setTimeout(() => {
    try {
      installScreen();
    } catch (e) {
      console.error(e);
    }
  }, 300)
);
