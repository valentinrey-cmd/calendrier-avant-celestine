/* ---------- 👹 Les boss (ils gardent les vidéos de l'album) ---------- */

const BRULES = {
  4: [
    '🎙️ Noémie n’a pas le temps : ses ongles sèchent. Pour placer tes questions, esquive tout ce qu’elle t’envoie.',
    '👆 Glisse le doigt pour déplacer Célestine en bas de l’écran. Tes questions ❓ partent toutes seules vers le haut : vise Noémie.',
    '💅 Esquive ses reproches, ses gouttes de vernis, ses flacons et sa lime… Tu as <b>6 vies</b>.',
    '😤 À la moitié, elle accélère… puis elle se vexe et sort le pot de gel géant. La ligne rouge ⚠️ annonce la lime.',
    '⏱️ Tu as 2 min 40. 💡 L’indice donne une vie en plus. Ensuite : elle passe aux aveux.'
  ],
  8: [
    '👁️ Emma te fait passer un test de vue. Sur chaque planche, une lettre est différente des autres : touche-la !',
    '⏱️ Chaque planche a son chrono. Trop lent ou mauvaise lettre = 1 ❤️ en moins (<b>3 vies</b>).',
    '😎 Plus ça avance, plus les lettres sont petites et floues. Et parfois Emma enlève ses lunettes : tout devient TRÈS flou.',
    '👓 Quand ses lunettes apparaissent sur la planche, attrape-les : vision nette pendant 5 secondes.',
    '🎯 Lis <b>18 planches</b> pour la faire craquer. 💡 L’indice donne une vie et une vision nette. Ensuite : elle passe aux aveux.'
  ],
  11: [
    '🌯 Edgar a faim. Il ne parlera qu’avec un tacos dans la main… fait EXACTEMENT comme il l’aime.',
    '👆 Glisse le doigt pour déplacer la galette. La commande est en haut : attrape les ingrédients <b>dans l’ordre</b>.',
    '🙅 Un ingrédient qu’il n’a pas demandé, ou dans le mauvais ordre = 1 ❤️ en moins (<b>3 vies</b>). Esquive-les !',
    '🫕 La sauce fromagère remplace n’importe quel ingrédient.',
    '🎯 Sers-lui <b>6 tacos</b> (de plus en plus garnis, et certains ingrédients zigzaguent !). 💡 L’indice donne une vie et nettoie le ciel. Ensuite : il passe aux aveux.'
  ],
  15: [
    '📚 Nora révise son partiel… et te met au défi : ses fiches, à toute vitesse.',
    '👉 Glisse la fiche à <b>droite si c’est VRAI</b>, à <b>gauche si c’est FAUX</b> (ou touche les boutons en bas).',
    '⏱️ Chaque fiche a son chrono, de plus en plus court. Mauvaise réponse ou trop lent = 1 ❤️ en moins (<b>3 vies</b>).',
    '🔄 Attention au <b>MODE PIÈGE</b> : pendant quelques secondes, il faut répondre l’INVERSE. Et certaines fiches arrivent à l’envers 🙃.',
    '🎯 <b>18 fiches</b> pour la faire craquer. 💡 L’indice donne une vie et annule le mode piège. Ensuite : elle passe aux aveux.'
  ],
  19: [
    '💊 Samedi, la pharmacie déborde. Sandrine veut bien parler… si tu l’aides au comptoir.',
    '👆 Lis ce que veut chaque client (fièvre, rhume, gorge…) et touche le bon produit sur l’étagère.',
    '⏳ Sous chaque client, sa patience. S’il part sans rien, ou si tu donnes un produit que personne n’a demandé = 1 ❤️ en moins (<b>3 vies</b>).',
    '🙋 Certains viennent juste discuter : ne leur donne rien, ils repartiront tout seuls. Et Sandrine range parfois la livraison… l’étagère change de place !',
    '🎯 Sers <b>20 clients</b>. 💡 L’indice donne une vie et calme tout le monde. Ensuite : elle passe aux aveux.'
  ],
  22: [
    '🚇 « J’ai mon métro ! » Valentin file en pleine audition. Suis-le dans les couloirs de Bellecour !',
    '👆 Touche à gauche ou à droite de l’écran (ou glisse) pour changer de couloir.',
    '🧳🎸🚧 Évite les valises, les musiciens et les travaux. Aux portillons ⛔, passe par celui qui est ouvert 🟢.',
    '☕ = coup de boost, 🎫 = raccourci. Chaque choc = 1 ❤️ en moins et il reprend de l’avance (<b>4 vies</b>).',
    '🎯 Remplis la barre pour le rattraper avant son métro. 💡 L’indice te rapproche et donne une vie. Ensuite : sa déposition.'
  ]
};
const BOSSD = [4, 8, 11, 15, 19, 22];
function bossCfg(d) {
  const C = {
    4: {
      n: 'Noémie',
      ic: '💅',
      who: 'noemie',
      g: 'bossfight',
      p: { hp: 72, time: 160, lives: 6, sp: 0.62, atk: 1.7, ic: '💅', who: 'noemie', n: 'Noémie' }
    },
    8: { n: 'Emma', ic: '👁️', who: 'emma', g: 'bvue', p: { hp: 18, lives: 3, time: 120 } },
    11: { n: 'Edgar', ic: '🌯', who: 'edgar', g: 'bkebab', p: { hp: 6, lives: 3, time: 140 } },
    15: { n: 'Nora', ic: '📚', who: 'nora', g: 'bfiches', p: { hp: 18, lives: 3, time: 100 } },
    19: { n: 'Sandrine', ic: '💊', who: 'sandrine', g: 'bcomptoir', p: { hp: 20, lives: 3, time: 120 } },
    22: { n: 'Valentin', ic: '🚇', who: 'valentin', g: 'bmetro', p: { lives: 4, time: 110, v: 265, rate: 0.0155 } }
  };
  return C[d] || null;
}
function bossBtn(d) {
  const B = bossCfg(d);
  if (!B) return '';
  if ((S.boss || {})[d])
    return `<p><span class="ribbon">🎙️ Audition faite · 🎬 vidéo débloquée</span></p>${AUD[d] ? `<p><button class="alt" onclick="audGo(${d})">🗣️ Relire ${d == 22 ? 'sa déposition' : 'ses aveux'}</button></p>` : ''}`;
  return `<button class="bossb" onclick="launchBoss(${d})">🎙️ Auditionner : ${esc(B.n)} <small>(gratuit, autant de fois que tu veux)</small></button><p class="muted" style="font-size:.85rem;margin-top:0">Son audition débloque une 🎬 vidéo mystère de votre album.</p>`;
}
function bossDev(d) {
  if (CONTENU.syncRoom != 't' || !bossCfg(d)) return '';
  const B = bossCfg(d);
  return `<div class="bossdev"><b>🧪 Mode test</b> · boss de cette case : ${B.ic} ${B.n}<br><button class="alt sm" onclick="launchBoss(${d},1)">▶ Tester le boss (gratuit, débloque la vidéo)</button>${(S.boss || {})[d] || (S.bossTry || {})[d] ? `<button class="alt sm" onclick="bossReset(${d})">↺ Remettre ce boss à zéro</button>` : ''}</div>`;
}
function bossKO(B, cb) {
  const box = document.getElementById('gwin');
  if (!box) {
    cb();
    return;
  }
  try {
    YTM.stopGame();
  } catch (_) {}
  try {
    MUS.stop();
  } catch (_) {}
  const o = document.createElement('div');
  o.className = 'bko';
  const PT = ['✨', '⭐', '💥', '🎉', '❄️', '💫', '🎊', '💖'];
  o.innerHTML = `<div class="bko-fl"></div><div class="bko-b">${B.who ? `<img src="${bpicSrc(B.who)}" alt="" style="width:1.6em;height:1.6em;border-radius:50%;object-fit:cover;border:4px solid #ffd34d">` : B.ic}</div>${Array.from(
    { length: 28 },
    (_, i) => {
      const a = (i / 28) * Math.PI * 2 + Math.random() * 0.2,
        r = 110 + Math.random() * 140;
      return `<span class="bko-p" style="--x:${(Math.cos(a) * r).toFixed(0)}px;--y:${(Math.sin(a) * r).toFixed(0)}px;--d:${(Math.random() * 0.25).toFixed(2)}s">${PT[i % PT.length]}</span>`;
    }
  ).join(
    ''
  )}<div class="bko-t">ÇA CRAQUE !</div><div class="bko-v">🎙️ ${esc(B.n)} est prêt${/^(Noémie|Emma|Nora|Sandrine)/.test(B.n) ? 'e' : ''} à parler !<small>Touche pour continuer</small></div>`;
  box.appendChild(o);
  try {
    bkT(110, 1, 'sawtooth', 0.05, 45);
    setTimeout(() => {
      bkT(160, 0.6, 'square', 0.07, 40);
      bkT(900, 0.5, 'sawtooth', 0.03, 90);
    }, 850);
    [523, 659, 784, 1046, 1318].forEach((f, i) => setTimeout(() => bkT(f, i == 4 ? 0.9 : 0.22, 'triangle', 0.07), 1150 + i * 130));
  } catch (_) {}
  setTimeout(() => {
    try {
      confetti();
    } catch (_) {}
  }, 1150);
  const t0 = performance.now();
  let done = 0;
  const go = () => {
    if (done) return;
    done = 1;
    o.remove();
    cb();
  };
  o.onclick = () => {
    if (performance.now() - t0 > 1800) go();
  };
  setTimeout(go, 4200);
}
const BTAUNT = {
  4: '« Mes ongles sèchent, là. »',
  8: '« Tu devrais prendre rendez-vous, toi. »',
  11: '« Je vais me commander un KEBAB, tiens. »',
  15: '« Tu vas te planter au partiel, toi. »',
  19: '« Laisse, je vais servir moi-même. »',
  22: '« Bon, je l’ai raté, mon métro ! »'
};
function bossLose(B, d, cb) {
  const box = document.getElementById('gwin');
  if (!box) {
    cb();
    return;
  }
  try {
    YTM.stopGame();
  } catch (_) {}
  try {
    MUS.stop();
  } catch (_) {}
  const o = document.createElement('div');
  o.className = 'bko blo';
  o.innerHTML = `<div class="blo-b">${B.ic}</div><div class="blo-ha">HA</div><div class="blo-ha h2">HA</div><div class="blo-ha h3">HA !</div>${Array.from({ length: 14 }, (_, i) => `<span class="blo-h" style="left:${(4 + i * 7) % 96}%;--d:${((i * 0.17) % 1.2).toFixed(2)}s;--r:${(i % 2 ? 1 : -1) * (20 + i * 9)}deg">💔</span>`).join('')}<div class="blo-t">PERDU…</div><div class="bko-v">${esc(B.n)} t’a battue !<em>${BTAUNT[d] || ''}</em><small>Touche pour continuer</small></div>`;
  box.appendChild(o);
  try {
    [392, 370, 349, 330].forEach((f, i) => setTimeout(() => bkT(f, i == 3 ? 1.1 : 0.42, 'sawtooth', 0.045, i == 3 ? f * 0.8 : 0), i * 430));
    [0, 180, 360].forEach(t => setTimeout(() => bkT(260, 0.12, 'square', 0.04, 200), 600 + t));
  } catch (_) {}
  const t0 = performance.now();
  let done = 0;
  const go = () => {
    if (done) return;
    done = 1;
    o.remove();
    cb();
  };
  o.onclick = () => {
    if (performance.now() - t0 > 1500) go();
  };
  setTimeout(go, 4300);
}
