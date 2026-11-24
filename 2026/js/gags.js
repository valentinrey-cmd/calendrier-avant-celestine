/* ================= 🎭 GAGS (surprises drôles) ================= */
const FUNT = () => {
  const [y, m, d] = today();
  return y + '-' + m + '-' + d;
};
function funD(k) {
  S.funD = S.funD || {};
  return S.funD[k] == FUNT();
}
function funMark(k) {
  S.funD = S.funD || {};
  S.funD[k] = FUNT();
  save();
}
function funBip(f, d) {
  try {
    bkT(f || 700, d || 0.08, 'triangle', 0.05, (f || 700) * 1.4);
  } catch (_) {}
}
function funOv(cls, html) {
  const o = document.createElement('div');
  o.className = 'fun-ov ' + cls;
  o.innerHTML = html;
  document.body.appendChild(o);
  o.__close = cb => {
    if (!o.isConnected) return;
    o.classList.add('out');
    setTimeout(() => {
      o.remove();
      cb && cb();
    }, 350);
  };
  return o;
}
const funIdle = () => typeof view != 'undefined' && view == 'cal' && !storyBusy() && !document.querySelector('.fun-ov,.fun-cat');
const funSig = () => {
  try {
    return localStorage.getItem('avent_cgusig');
  } catch (_) {
    return null;
  }
};
const funLog = t => {
  try {
    slog('🎭', t);
  } catch (_) {}
};
/* 1) Fausse mise à jour */
function funUpd() {
  funMark('upd');
  funLog('Fausse mise à jour');
  const o = funOv(
    'fun-upd',
    `<div class="fu-box"><div class="fu-ic">⬇️</div><b class="fu-t">Mise à jour disponible</b><p class="fu-v">Célestine 2.0</p><ul class="fu-n"><li>✨ Rire encore plus contagieux</li><li>💖 Capacité câlins : +30 %</li><li>🛠️ Correctif : « J’ai froid » dit 14 fois par jour</li><li>🧦 Pieds gelés : problème connu, pas de solution</li><li>🐛 Défauts supprimés : 0 (aucun trouvé)</li></ul><div class="fu-bar"><i></i></div><p class="fu-p">Installation… 0 %</p><button class="fu-ok" style="visibility:hidden">OK 😌</button></div>`
  );
  const I = o.querySelector('.fu-bar i'),
    P = o.querySelector('.fu-p'),
    B = o.querySelector('.fu-ok');
  let p = 0;
  const st = () => {
    if (!o.isConnected) return;
    if (p < 99) {
      p = Math.min(99, p + 3 + Math.random() * 12);
      I.style.width = p + '%';
      P.textContent = 'Installation… ' + Math.floor(p) + ' %';
      return setTimeout(st, 180 + Math.random() * 250);
    }
    P.textContent = 'Installation… 99 %';
    setTimeout(() => {
      P.textContent = 'Installation… 99 % 😬';
      setTimeout(() => {
        o.querySelector('.fu-box').classList.add('fail');
        o.querySelector('.fu-ic').textContent = '❌';
        o.querySelector('.fu-t').textContent = 'Mise à jour annulée';
        P.innerHTML = 'Raison : impossible d’améliorer la perfection. ❤️';
        funBip(300, 0.2);
        B.style.visibility = 'visible';
      }, 1500);
    }, 1200);
  };
  setTimeout(st, 700);
  B.onclick = () => o.__close();
}
/* 2) Le chat qui passe */
const CATI = [
  'Indice : le coupable a deux yeux. 👀',
  'Indice : le coupable aime Noël. Comme tout le monde.',
  'Indice : le coupable n’est pas un poisson. 🐟',
  'Indice : le coupable a déjà mangé au moins une fois dans sa vie.',
  'Indice : miaou. (Il refuse d’en dire plus.)',
  'Indice : le coupable respire. C’est louche.',
  'Indice : ce n’est pas moi. D’ailleurs, je n’existe pas.',
  'Indice : le coupable a des cheveux. Ou pas. 🤷'
];
function funCat() {
  funLog('Le chat traverse l’écran');
  const c = document.createElement('div');
  c.className = 'fun-cat';
  c.innerHTML = '<span class="fct-c">🐈</span><span class="fct-b"></span>';
  document.body.appendChild(c);
  let tapped = 0;
  c.onclick = () => {
    if (tapped) return;
    tapped = 1;
    c.classList.add('stop');
    const b = c.querySelector('.fct-b');
    S.funCatN = (S.funCatN || 0) + 1;
    save();
    b.textContent = CATI[(S.funCatN - 1) % CATI.length];
    b.classList.add('on');
    funBip(1300, 0.05);
    funLog('A attrapé le chat (indice bidon)');
    setTimeout(() => {
      b.classList.remove('on');
      c.classList.remove('stop');
      c.classList.add('run');
    }, 3200);
  };
  setTimeout(() => c.remove(), 16000);
}
/* 3) Pépin dort la nuit */
function funSleep() {
  const h = new Date().getHours();
  const old = document.getElementById('fslp');
  if (!(h >= 23 || h < 6)) {
    if (old) old.remove();
    return;
  }
  if (old || view != 'cal') return;
  const e = document.createElement('div');
  e.id = 'fslp';
  e.innerHTML = `<span class="fs-e">${CINE.elf()}</span><span class="fs-cap">🌙</span><span class="fs-z">Z</span><span class="fs-z z2">z</span><span class="fs-z z3">z</span><span class="fs-b"></span>`;
  document.body.appendChild(e);
  e.onclick = () => {
    if (e.classList.contains('awake')) return;
    e.classList.add('awake');
    const t = new Date(),
      hh = String(t.getHours()).padStart(2, '0') + ' h ' + String(t.getMinutes()).padStart(2, '0');
    const B = e.querySelector('.fs-b');
    B.textContent = [
      'Hein ?! Quoi ?! Il est ' + hh + ' ! Même le brigadier de garde dort, à cette heure-ci. 😴',
      'Chuuut… je rêve de tacos. 🌯',
      'Encore toi ?! Va dormir, Célestine. Moi, j’y retourne. 😤'
    ][(S.funSlp = (S.funSlp || 0) + 1) % 3];
    save();
    funBip(500, 0.1);
    funLog('A réveillé Pépin la nuit');
    setTimeout(() => e.classList.remove('awake'), 3600);
  };
}
setInterval(() => {
  try {
    if (typeof view != 'undefined' && view != 'cal') {
      const o = document.getElementById('fslp');
      if (o) o.remove();
    }
  } catch (_) {}
}, 1500);
/* 4) Lettre recommandée */
function funLetter(days) {
  funLog('Lettre recommandée (' + days + ' jours sans ouvrir)');
  const sig = funSig();
  const o = funOv(
    'fun-let',
    `<div class="fl-env"><div class="fl-flap"></div><span class="fl-st">RECOMMANDÉ</span></div><div class="fl-doc"><p class="fl-h">📨 Commissariat du 8e · Service des enquêtes</p><p class="fl-o"><b>Objet : MISE EN DEMEURE</b></p><p>Madame Célestine,</p><p>Nous constatons que vous n’avez pas ouvert l’application depuis <b>${days} jours</b>.</p><p>Conformément à l’article 3 des conditions générales (« tacitement reconduit pour toujours »), nous vous rappelons que l’enquête n’attend pas. Le bracelet non plus.</p><p>Tout nouveau retard sera puni d’un regard très déçu de Pépin. 😔</p>${sig ? `<div class="fl-sg"><small>Vous avez signé ici le ${sigD()} :</small><img src="${sig}" alt=""></div>` : ''}<p class="fl-sig">Lieutenant Pépin, commissariat du 8e</p><span class="fl-tp">URGENT</span><button class="fl-ok">Pardon 🥺</button></div>`
  );
  setTimeout(() => o.classList.add('open'), 900);
  setTimeout(() => funBip(220, 0.25), 300);
  o.querySelector('.fl-ok').onclick = () => o.__close();
}
/* 5) Commentateur Pépin pendant les mini-jeux */
const COM = [
  'ET C’EST PARTI ! 🎙️',
  'Quelle concentration… on entendrait un flocon tomber. ❄️',
  'Oh, joli geste technique ! 👏',
  'Le public est en délire ! (le public, c’est moi.)',
  'Elle respire, elle se concentre… magnifique.',
  'Attention… ATTENTION… ah non, rien. Fausse alerte.',
  'On n’avait pas vu ça depuis… hier. 😮',
  'Tout le commissariat retient son souffle ! 😤',
  'Si elle gagne, je mange mon bonnet. 🎩',
  'Un style inimitable. Les juges notent : 10, 10 et… 9 (le juge est jaloux).',
  'Oh non… on va dire que c’était voulu. 😅',
  'Calme, sang-froid, élégance. Une vraie pro.',
  'Je rappelle que ce jeu a été testé par Gérald. Il a pleuré.',
  'Pub : ce commentaire vous est offert par Tacos Pépin®.',
  'Et là, elle a clairement un plan. Je ne sais pas lequel, mais elle en a un.',
  'Edgar aurait déjà abandonné. Pas elle !',
  'Incroyable ! Enfin… crédible. Enfin… pas mal !',
  'Silence dans les tribunes… ❄️',
  'Respirez, Célestine, respirez. (moi, j’ai arrêté.)'
];
let comT = 0,
  comNext = 0,
  comWas = 0;
function funCom(t) {
  let b = document.getElementById('fcom');
  if (!b) {
    b = document.createElement('div');
    b.id = 'fcom';
    b.innerHTML = '<span class="fco-m">🎙️</span><span class="fco-e">👮</span><span class="fco-t"></span>';
    document.body.appendChild(b);
  }
  b.querySelector('.fco-t').textContent = t;
  b.classList.remove('on');
  void b.offsetWidth;
  b.classList.add('on');
  clearTimeout(comT);
  comT = setTimeout(() => b.classList.remove('on'), 4200);
}
setInterval(() => {
  try {
    const pl = document.body.classList.contains('playing') && document.getElementById('gwin');
    const now = Date.now();
    if (!pl) {
      comWas = 0;
      const b = document.getElementById('fcom');
      if (b) b.classList.remove('on');
      return;
    }
    if (!comWas) {
      comWas = 1;
      comNext = now + 3500;
      return;
    }
    if (now >= comNext) {
      funCom(comNext && comWas == 1 ? COM[0] : COM[1 + Math.floor(Math.random() * (COM.length - 1))]);
      comWas = 2;
      comNext = now + 15000 + Math.random() * 9000;
    }
  } catch (_) {}
}, 800);
/* 6) Fausses pubs (parodies de pubs connues) */
const MGB =
  '<p class="fp-mb">Pour votre santé, mangez au moins 5 fruits et légumes par jour. Les tacos ne comptent pas. <u>www.mangerbouger.fr</u></p>';
const PUBS = [
  [
    'vvc',
    `<div class="fp-in"><p class="fp-k">VENDEZ VOTRE BIJOU</p><b class="fp-url">vendezvotrebijou.fr</b><div class="fp-row"><span>⏱️<br>Estimation<br>en 2 min</span><span>💶<br>Paiement<br>immédiat*</span><span>✅<br>Sans<br>engagement</span></div><p class="fp-q">« Vous avez un bijou ? On vous l’achète. Même un peu rayé. »</p><p class="fp-big">vendezvotrebijou.fr… C’EST FAIT ! 👍</p><p class="fp-sm">*Paiement en câlins. Offre réservée aux bijoux non volés.</p>${MGB}</div>`
  ],
  [
    'cgl',
    `<div class="fp-in"><div class="fp-choc">📱💥</div><p class="fp-q">« Oh non… ma tablette est fêlée ! »</p><p class="fp-q">« Pas de panique, madame. »</p><b class="fp-b">Chocglass® répare,<br>Chocglass® remplace.</b><p class="fp-s">Intervention en 30 minutes, même à Écully. 🚐</p><p class="fp-sm">Franchise : 1 bisou. Les petits cœurs roses ébréchés ne sont pas couverts.</p>${MGB}</div>`
  ],
  [
    'orl',
    `<div class="fp-in"><div class="fp-choc fp-hair">💁‍♀️✨</div><p class="fp-s">Nouveau soin <b>Paillettes Intense Repair</b>, à l’extrait de cœurs roses.</p><p class="fp-st">✨ 98 % des femmes trouvent qu’il sent le gâteau*</p><p class="fp-st">✨ 100 % des brigadiers en ont léché un peu</p><b class="fp-b">Cœuréal Paris</b><p class="fp-big">Parce que tu le vaux bien. 💛</p><p class="fp-sm">*Test réalisé sur 3 brigadiers et 1 commissaire.</p>${MGB}</div>`
  ],
  [
    'fdj',
    `<div class="fp-in"><div class="fp-choc">🎟️💖</div><b class="fp-b">BRACELOTO</b><p class="fp-s">Ce vendredi, <b>24 cases</b> en jeu… et un bracelet à gagner ! 🤩</p><div class="fp-balls"><i>1</i><i>7</i><i>12</i><i>19</i><i>24</i></div><p class="fp-big">100 % des détectives ont ouvert leur case.</p><p class="fp-sm">Jouer comporte des risques : addiction aux cases, isolement sur le canapé. Appelez Pépin au 0 800 BRACELET… pour demander un câlin.</p>${MGB}</div>`
  ]
];
function funPub(go, ad) {
  let P;
  if (ad) P = PUBS[Math.floor(Math.random() * PUBS.length)];
  else {
    funMark('pub');
    S.funPubI = ((S.funPubI || 0) + 1) % PUBS.length;
    save();
    P = PUBS[S.funPubI];
  }
  funLog('Fausse pub : ' + P[0]);
  const o = funOv('fun-pub fp-' + P[0], `<div class="fp-tag">PUBLICITÉ</div>${P[1]}<button class="fp-skip">Passer dans 5</button>`);
  const B = o.querySelector('.fp-skip');
  let n = 5,
    ok = 0,
    runs = 0;
  const iv = setInterval(() => {
    n--;
    if (n > 0) B.textContent = 'Passer dans ' + n;
    else {
      clearInterval(iv);
      ok = 1;
      B.textContent = 'Passer ⏭';
      B.classList.add('ok');
    }
  }, 1000);
  B.onclick = e => {
    e.stopPropagation();
    if (!ok) {
      runs++;
      B.style.transform = `translate(${(Math.random() * 2 - 1) * 80}px,${-20 - Math.random() * 60}px)`;
      funBip(1100, 0.04);
      if (runs == 3) {
        n = Math.min(9, n + 2);
        B.textContent = 'Passer dans ' + n + ' 😈';
      }
      return;
    }
    clearInterval(iv);
    o.__close(go);
  };
}
{
  const L0 = launch;
  launch = function (d, pr) {
    if (!pr && !funD('pub') && Math.random() < 0.22 && !document.querySelector('.fun-ov')) return funPub(() => L0(d, pr));
    return L0(d, pr);
  };
}
/* 7) Mode pitié après 3 échecs */
const PRF = {};
function funPity() {
  funLog('Mode pitié');
  const o = funOv(
    'fun-pity',
    `<div class="fy-in"><div class="fy-elf">${CINE.elf()}<span class="fy-band">🩹</span></div><b class="fy-t">MODE PITIÉ ACTIVÉ 🩹</b><p>Bon. Je ne peux pas changer le jeu…</p><p>…mais je te fais un câlin très fort, et je dirai à tout le monde que c’était un bug. 🤗</p><p class="fy-s">(Le brigadier Gérald a mis un pansement géant sur ton écran, par solidarité.)</p><button class="fy-ok">Merci Pépin 🥲</button></div>`
  );
  funBip(400, 0.2);
  o.querySelector('.fy-ok').onclick = () => o.__close();
}
{
  const R0 = result;
  result = function (d, pr, ok, why) {
    const r = R0.apply(this, arguments);
    try {
      if (!ok) {
        let f;
        if (pr) {
          PRF[d] = (PRF[d] || 0) + 1;
          f = PRF[d];
        } else f = (S.days[d] || {}).fails || 0;
        if (f > 0 && f % 3 == 0) setTimeout(funPity, 1100);
      } else if (pr) PRF[d] = 0;
    } catch (_) {}
    return r;
  };
}
/* 8) Secouer le téléphone pendant un jeu */
let shkT = 0,
  shkL = null;
function funShake() {
  if (Date.now() - shkT < 6000) return;
  shkT = Date.now();
  funLog('A secoué le téléphone');
  const o = document.createElement('div');
  o.className = 'fun-shk';
  let h = '';
  for (let i = 0; i < 34; i++)
    h += `<i style="left:${Math.random() * 100}%;animation-delay:${Math.random() * 0.8}s;font-size:${12 + Math.random() * 18}px">❄</i>`;
  o.innerHTML = h + `<span class="fk-elf">${CINE.elf()}</span><b class="fk-t">AAAAAH ! 😱</b>`;
  document.body.appendChild(o);
  funBip(900, 0.4);
  setTimeout(() => {
    const t = o.querySelector('.fk-t');
    if (t) t.textContent = '…Aïe. 🤕';
  }, 1500);
  setTimeout(() => o.remove(), 3300);
}
window.addEventListener('devicemotion', e => {
  try {
    if (!document.body.classList.contains('playing')) return;
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null) return;
    if (shkL) {
      const d = Math.abs(a.x - shkL.x) + Math.abs(a.y - shkL.y) + Math.abs(a.z - shkL.z);
      if (d > 32) funShake();
    }
    shkL = { x: a.x, y: a.y, z: a.z };
  } catch (_) {}
});
/* 9) Carte de détective */
function funCard() {
  if (S.detCard || document.querySelector('.fun-ov')) return;
  funLog('Carte de détective proposée');
  const o = funOv(
    'fun-card',
    `<div class="fd-in"><div class="fd-elf">${CINE.elf()}</div><p class="fd-bub">Une vraie détective a besoin d’une carte officielle ! Signe-la, elle pourra servir… 😏</p><div class="fd-card"><div class="fd-h">🪪 POLICE NATIONALE · LYON 8e</div><div class="fd-r"><img src="${VIMG.c}" alt=""><div><p><small>Nom</small><b>Célestine</b></p><p><small>Grade</small><b>Détective de 1re classe</b></p><p><small>Matricule</small><b>PN-2412</b></p><p><small>Valable</small><b>du 1er au 24 décembre</b></p></div></div><div class="fd-sg"><small>Signature</small><canvas width="500" height="150"></canvas></div></div><div class="fd-btn"><button class="alt fd-clr">Effacer</button><button class="fd-ok">✍️ Signer ma carte</button></div></div>`
  );
  const cv = o.querySelector('canvas'),
    x = cv.getContext('2d');
  x.lineWidth = 5;
  x.lineCap = 'round';
  x.strokeStyle = '#1d2a6b';
  let dn = 0,
    lp = null,
    ink = 0;
  const pt = e => {
    const r = cv.getBoundingClientRect();
    return [((e.clientX - r.left) * cv.width) / r.width, ((e.clientY - r.top) * cv.height) / r.height];
  };
  cv.addEventListener('pointerdown', e => {
    e.preventDefault();
    dn = 1;
    lp = pt(e);
    try {
      cv.setPointerCapture(e.pointerId);
    } catch (_) {}
  });
  cv.addEventListener('pointermove', e => {
    if (!dn) return;
    const q = pt(e);
    x.beginPath();
    x.moveTo(lp[0], lp[1]);
    x.lineTo(q[0], q[1]);
    x.stroke();
    lp = q;
    ink++;
  });
  ['pointerup', 'pointercancel'].forEach(k => cv.addEventListener(k, () => (dn = 0)));
  o.querySelector('.fd-clr').onclick = () => {
    x.clearRect(0, 0, cv.width, cv.height);
    ink = 0;
  };
  o.querySelector('.fd-ok').onclick = () => {
    if (ink < 3) {
      toast('✍️ Signe d’abord ta carte');
      return;
    }
    S.detCard = { sig: cv.toDataURL('image/png'), t: Date.now() };
    save();
    funLog('Carte de détective signée');
    try {
      CINE.sfx('ding');
    } catch (_) {}
    o.querySelector('.fd-card').classList.add('stamp');
    o.querySelector('.fd-bub').textContent = 'Parfait ! Garde-la bien. On en aura peut-être besoin… 🕵️‍♀️';
    setTimeout(() => o.__close(), 2200);
  };
}
function funBrand(x, go) {
  S.funBr = Array.isArray(S.funBr) ? S.funBr : [];
  S.funBr.push(x.id);
  save();
  funLog('Brandit la carte de détective devant ' + x.n);
  const C = S.detCard;
  const o = funOv(
    'fun-brand',
    `<div class="fb-sus">${susPic(x)}<b>${esc(x.n)}</b></div><div class="fb-bub"></div><div class="fb-card"><div class="fd-h">🪪 POLICE NATIONALE · LYON 8e</div><div class="fd-r"><img src="${VIMG.c}" alt=""><div><p><small>Nom</small><b>Célestine</b></p><p><small>Grade</small><b>Détective de 1re classe</b></p></div></div><img class="fb-sig" src="${C.sig}" alt=""></div><div class="fb-elf">${CINE.elf()}</div><p class="fb-tap">👆</p>`
  );
  const B = o.querySelector('.fb-bub'),
    L = [
      ['s', x.id == 'chat' ? '« Miaou. » (traduction : je n’ai rien à dire.) 🙄' : '« Je n’ai rien à dire. » 🙄'],
      ['e', 'POLICE NATIONALE ! 🪪 Détective Célestine, carte officielle, signée et tout !'],
      ['s', x.id == 'chat' ? '« …Miaou. » (traduction : bon, d’accord.)' : '« …Bon, d’accord, d’accord. Voici ma déposition. » 😳']
    ];
  let k = -1;
  const nx = () => {
    k++;
    if (k >= L.length) return o.__close(go);
    const [w, t] = L[k];
    B.textContent = t;
    B.className = 'fb-bub on ' + w;
    if (w == 'e') {
      o.classList.add('brand');
      funBip(1000, 0.15);
    }
    try {
      CINE.blip && CINE.blip(w == 'e' ? 'e' : 'x', 1, 'a', null);
    } catch (_) {}
  };
  o.onclick = nx;
  nx();
}
{
  const SO = susOpen;
  susOpen = function (id) {
    try {
      const x = SUSP.find(z => z.id == id),
        B = Array.isArray(S.funBr) ? S.funBr : [];
      if (x && S.detCard && B.length < 2 && !B.includes(id) && id != 'valentin' && !document.querySelector('.fun-ov'))
        return funBrand(x, () => SO(id));
    } catch (_) {}
    return SO(id);
  };
}
/* 10) Arrêt maladie de Pépin */
function funSickDay() {
  if (!S.sickDay) {
    S.sickDay = 7 + Math.floor(Math.random() * 10);
    save();
  }
  return S.sickDay;
}
function funSickNote(go) {
  S.sickShown = 1;
  save();
  funLog('Pépin en arrêt maladie');
  const o = funOv(
    'fun-sick',
    `<div class="fk-doc"><p class="fk-h">🤒 CERTIFICAT MÉDICAL</p><p>Je soussigné, <b>Dr Rodolphe</b> (médecin de la police), certifie que le lieutenant <b>Pépin</b> est atteint d’un <b>rhume</b> carabiné. 🤧</p><p>Repos obligatoire : <b>1 jour</b>, sous un plaid, avec un thé bien chaud.</p><p>Remplaçant pour la journée : <b>Gérald</b>, brigadier stagiaire (c’est son 2e jour).</p><p class="fk-s">Dr Rodolphe 🩺</p><span class="fk-tp">ARRÊT MALADIE</span><button class="fk-ok">Bon courage Pépin 🤧</button></div>`
  );
  o.querySelector('.fk-ok').onclick = () => o.__close(go);
}
const FLUB = [
  t => 'Euh… ' + t,
  t => t + ' …je crois ? 😅',
  t => '*ATCHOUM* 🤧 Pardon. ' + t,
  t => t + ' (Gérald lit sa fiche à l’envers.)',
  t => t.replace(/Célestine/g, 'Céles… Célestinne… Célestine'),
  t => 'Alors, c’est écrit que… ' + t
];
{
  const ST = story;
  story = function (id, cb, tst) {
    try {
      window.__sickOn = !tst && STORY[id] && !/^mode_|^acc_/.test(id) && unl() == funSickDay();
      if (window.__sickOn && !S.sickShown) return funSickNote(() => ST(id, cb, tst));
    } catch (_) {
      window.__sickOn = 0;
    }
    return ST(id, cb, tst);
  };
}
/* 11) Avis de recherche du chat */
function funWanted() {
  funLog('Regarde l’avis de recherche du chat');
  const o = funOv(
    'fun-want',
    `<div class="fw-p"><p class="fw-h">AVIS DE RECHERCHE</p><p class="fw-w">WANTED</p><div class="fw-img">🐈</div><p class="fw-n">LE CHAT</p><p><b>Signalement :</b> n’existe pas (officiellement).</p><p><b>Dernière apparition :</b> sur ton calendrier, il y a 5 minutes.</p><p><b>Dangerosité :</b> extrêmement mignon.</p><p class="fw-r">RÉCOMPENSE<br><b>3 croquettes et un câlin</b></p><p class="fw-s">— Commissariat du 8e 👮</p></div>`
  );
  o.onclick = () => o.__close();
}
/* 12) Photobomb de Pépin dans l’album */
{
  const AZ = alZoom;
  alZoom = function (i) {
    const r = AZ.apply(this, arguments);
    try {
      if (Math.random() < 0.28) {
        const o = document.getElementById('alz'),
          im = o && o.querySelector('.alz-in img');
        if (im) {
          const w = im.parentElement;
          w.classList.add('fpb-w');
          const p = document.createElement('span');
          p.className = 'fpb';
          p.innerHTML = CINE.elf();
          w.appendChild(p);
          p.onclick = e => {
            e.stopPropagation();
            if (p.classList.contains('hid')) return;
            p.classList.add('talk');
            const b = document.createElement('span');
            b.className = 'fpb-b';
            b.textContent = 'Oups ! Je passais par là. 🙈';
            w.appendChild(b);
            funBip(1400, 0.05);
            funLog('A trouvé Pépin caché dans une photo');
            setTimeout(() => {
              p.classList.add('hid');
              b.remove();
            }, 1800);
          };
        }
      }
    } catch (_) {}
    return r;
  };
}
/* Calendrier : surprises */
{
  const CV = calView;
  calView = function () {
    const r = CV.apply(this, arguments);
    try {
      const a = document.getElementById('app');
      if (a && !a.querySelector('.fw-mini')) {
        const m = document.createElement('button');
        m.className = 'fw-mini';
        m.type = 'button';
        m.innerHTML = '<b>WANTED</b><span>🐈</span><small>Récompense : 3 croquettes</small>';
        m.onclick = funWanted;
        a.appendChild(m);
      }
      setTimeout(() => {
        try {
          funSleep();
        } catch (_) {}
      }, 400);
    } catch (_) {}
    return r;
  };
}
let funCardW = 0;
setInterval(() => {
  try {
    if (!funIdle()) {
      funCardW = 0;
      return;
    }
    if ((S.story || {}).pro && !S.detCard) {
      if (++funCardW >= 2) {
        funCardW = 0;
        funCard();
      }
      return;
    }
    funCardW = 0;
    if (window.__funCalDone) return;
    window.__funCalDone = 1;
    setTimeout(() => {
      try {
        if (!funIdle()) {
          window.__funCalDone = 0;
          return;
        }
        if (!funD('upd') && Math.random() < 0.14) funUpd();
      } catch (_) {}
    }, 2500);
  } catch (_) {}
}, 2000);
setInterval(() => {
  try {
    if (funIdle() && !document.hidden && Math.random() < 0.07) funCat();
  } catch (_) {}
}, 20000);
if (!instPend()) {
  try {
    smOpen();
  } catch (e) {
    console.error(e);
  }
}
try {
  const pr = document.getElementById('pre');
  if (pr) {
    const bb = pr.querySelector('.sm-brac');
    if (bb) window.__brac = bb.outerHTML;
  }
  if (pr && !document.getElementById('smo')) pr.remove();
} catch (_) {}
if (document.getElementById('smo')) {
} else {
  const b = document.createElement('div');
  b.id = 'boot';
  b.innerHTML = `<div class="bt-in"><span class="bt-tag">DOSSIER N°24</span><div class="bt-ic">${window.__brac || (document.querySelector('.sm-brac') || {}).outerHTML || '💖'}</div><p>${pick(JK.boot)}</p><div class="bt-bar"><i></i></div></div>`;
  document.body.appendChild(b);
  const rm = () => {
    b.classList.add('out');
    setTimeout(() => b.remove(), 400);
  };
  b.onclick = rm;
  setTimeout(rm, 1500);
  setTimeout(() => {
    const r = Math.random();
    if (r < 1 / 30) toast('💌 Rappel : Valentin t’aime. Fin du message.');
    else if (r < 2 / 30) toast('🔔 Valentin a faim. Ce n’est pas une nouvelle, c’est juste un rappel.');
  }, 2600);
}
