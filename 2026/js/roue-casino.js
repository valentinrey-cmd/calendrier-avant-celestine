/* ---------- Roue de la chance ---------- */
function wheel() {
  if (!feat(7) || wheelEnd() || S.wheel == dayKey()) return;
  const n = WHEEL.length,
    cols = ['#7a1f33', '#d9b45f', '#1c5240', '#b0456e'];
  const bg = `conic-gradient(${WHEEL.map((_, i) => `${cols[i % 4]} ${(i * 360) / n}deg ${((i + 1) * 360) / n}deg`).join(',')})`;
  popup(
    `<h2>Roue de la chance</h2><div class="pin"></div><div class="wheel" id="wh" style="background:${bg}">${WHEEL.map((w, i) => `<span style="transform:rotate(${(i * 360) / n + 360 / n / 2 - 90}deg) translate(70px,-.6em)">${wLab(w)}</span>`).join('')}</div><button id="spin" onclick="spin()">Tourner !</button>`
  );
}
function spin() {
  const n = WHEEL.length,
    k = Math.floor(Math.random() * n),
    w = $('#wh');
  S.wheel = dayKey();
  save();
  EV('wheel');
  $('#spin').disabled = true;
  w.style.transform = `rotate(${360 * 6 - ((k * 360) / n + 360 / n / 2)}deg)`;
  const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  setTimeout(
    () => {
      const r = WHEEL[k];
      if (r === Math.min(...WHEEL.filter(v => typeof v == 'number')))
        setTimeout(() => toast('La roue a été truquée par Valentin. Toutes nos excuses. (Non.)'), 1800);
      if (typeof r == 'number') award(r, 'roue de la chance');
      else if (r == 's15' || r == 's30') {
        S.scr += +r.slice(1);
        save();
        toast(`+${r.slice(1)} 🔩`);
      } else if (r == 'gem') {
        S.gem++;
        save();
        confetti();
        toast('+1 💎 Gemme !');
      } else {
        S.inv[r]++;
        save();
        toast(r == 'hint' ? '+1 💡 Indice' : '+1 🃏 Joker');
      }
      $('#spin').outerHTML =
        `<p><b>${typeof r == 'number' ? '+' + r + ' ⭐' : r == 'hint' ? 'Un indice 💡' : r == 'joker' ? 'Un joker 🃏' : r == 'gem' ? 'Une gemme 💎 !' : '+' + r.slice(1) + ' 🔩'}</b></p><button onclick="go('cal')">Super !</button>`;
    },
    rm ? 300 : 3400
  );
}
/* ---------- Casino ---------- */
const RL = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ],
  RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
const rCol = n => (n == 0 ? 'vert' : RED.has(n) ? 'rouge' : 'noir'),
  RPAY = { rouge: 2, noir: 2, vert: 36 },
  RHEX = { rouge: '#c8102e', noir: '#151515', vert: '#0f8a3c' };
const SLOT = [
  [1 / 4, 1.5, '#9aa3ad'],
  [1 / 10, 2.5, '#3ddc84'],
  [1 / 25, 4, '#3d8bff'],
  [1 / 80, 8, '#b77bff'],
  [1 / 400, 15, '#ff6fc8'],
  [1 / 5000, 100, '#ffd24a']
];
let cJet = false,
  cJetUsed = false,
  cBet = 10,
  cGame = 'roue',
  cBusy = false,
  cRot = 0,
  cCol = 'rouge',
  SF = null,
  cLastR = [0, 2, 4],
  cLastW = null;
function sFaces() {
  if (!SF) {
    const P = shuffle([...(CONTENU.photos || [])]);
    SF = SLOT.map((_, k) => P[k % Math.max(1, P.length)]);
  }
  return SF;
}
function cSym(k) {
  const u = sFaces()[k];
  return `<span class="sym fc" style="--t:${SLOT[k][2]}"><i style="background-image:url(${u})"></i><b>×${String(SLOT[k][1]).replace('.', ',')}</b></span>`;
}
function cPick() {
  return Math.floor(Math.random() * SLOT.length);
}
function cDraw() {
  let r = Math.random();
  for (let k = 0; k < SLOT.length; k++) {
    if ((r -= SLOT[k][0]) < 0) return [k, k, k];
  }
  let R;
  do {
    R = [cPick(), cPick(), cPick()];
  } while (R[0] == R[1] && R[1] == R[2]);
  return R;
}
function cPhoto() {
  const P = CONTENU.photos || [];
  if (!P.length) return '';
  const k = [5, 10, 25, 50, 100].indexOf(cBet);
  return P[((k < 0 ? 5 : k) * 7 + 2) % P.length];
}
function cSet(n) {
  if (cBusy) return;
  if (n != S.pts && n > S.pts) return;
  cBet = Math.max(1, Math.round(n));
  casinoView();
}
function cLog(t) {
  S.clog = [t, ...(S.clog || [])].slice(0, 6);
  save();
}
const _casinoFoot =
  '<p class="muted center" style="font-size:.72rem;margin-top:18px;opacity:.8">Jouer comporte des risques : endettement, isolement et dépendance aux bisous. Appelez le 09-BISOUS.</p>';
function casinoView() {
  setTimeout(() => {
    if (view == 'casino' && !document.getElementById('cfoot')) {
      const p = document.createElement('div');
      p.id = 'cfoot';
      p.innerHTML = _casinoFoot;
      $('#app').appendChild(p);
    }
  }, 0);
  if (!feat(14)) {
    app.innerHTML = `<h1>Casino</h1><div class="panel center"><p style="font-size:2.5rem;margin:0">🔒</p><p>Le casino ouvre avec la case du 14 décembre.</p></div>`;
    return;
  }
  if (cBet > S.pts) {
    const ch = [100, 50, 25, 10, 5].find(v => v <= S.pts);
    cBet = ch || S.pts;
  }
  if (!(S.inv.jeton > 0)) cJet = false;
  const can = S.pts >= 5 || cJet;
  app.innerHTML = `<h1>🎰 Casino</h1>
 <div class="panel center csn"><div class="csolde">Ton solde <b>⭐ ${S.pts}</b></div>
  <div class="cgames"><button class="${cGame == 'roue' ? '' : 'alt'} sm" onclick="if(!cBusy){cGame='roue';casinoView()}">🎡 Roulette</button><button class="${cGame == 'slot' ? '' : 'alt'} sm" onclick="if(!cBusy){cGame='slot';casinoView()}">🎰 Machine à sous</button></div>
  <div class="cbet"><span>Ta mise</span><div class="cchips">${[5, 10, 25, 50, 100].map(v => `<button class="chip ${cBet == v ? 'on' : ''}" ${S.pts < v ? 'disabled' : ''} onclick="cSet(${v})">${v}</button>`).join('')}<button class="chip allin ${cBet == S.pts && S.pts > 100 ? 'on' : ''}" ${S.pts < 5 ? 'disabled' : ''} onclick="cSet(S.pts)">Tapis</button></div>
   <div class="cadj"><b id="cbet">⭐ ${can ? cBet : 0}</b></div></div>
  ${S.inv.jeton > 0 ? `<div class="row"><button class="${cJet ? '' : 'alt'} sm" onclick="if(!cBusy){cJet=!cJet;casinoView()}" aria-pressed="${cJet}">🎟️ ${cJet ? `Jeton activé : mise gratuite de ${jetVal()} ⭐` : 'Utiliser un jeton'} (${S.inv.jeton})</button></div>` : ''}
  <div id="cgame"></div>
  ${can ? '' : '<p class="muted">Il te faut au moins 5 ⭐ pour jouer. Va gagner des points dans le calendrier !</p>'}
  ${(S.clog || []).length ? `<div class="clog"><small>Derniers coups</small>${S.clog.map(t => `<div>${t}</div>`).join('')}</div>` : ''}
  <p class="muted" style="font-size:.8rem;margin-bottom:0">Les points gagnés au casino s'ajoutent à ton solde mais ne font pas monter ton niveau.</p></div>`;
  const G2 = $('#cgame');
  if (cGame == 'roue') {
    const n = RL.length,
      a = 360 / n,
      bg = `conic-gradient(${RL.map((v, i) => `${RHEX[rCol(v)]} ${i * a}deg ${(i + 1) * a}deg`).join(',')})`;
    G2.innerHTML = `<div class="cwrap"><div class="rball"></div><div class="cwheel rw" id="cwh" style="background:${bg};transform:rotate(${cRot}deg)">${RL.map((v, i) => `<span style="transform:rotate(${i * a + a / 2}deg)"><i>${v}</i></span>`).join('')}<div class="rin"></div><div class="chub rface" style="background-image:url(${cPhoto()})"></div></div></div>
  <div class="rbets">${['rouge', 'noir', 'vert'].map(c => `<button class="rb ${c} ${cCol == c ? 'on' : ''}" onclick="if(!cBusy){cCol='${c}';casinoView()}"><b>${c[0].toUpperCase() + c.slice(1)}</b><small>×${RPAY[c]}</small></button>`).join('')}</div>
  <button class="cgo" id="cgo" ${can ? '' : 'disabled'} onclick="cSpin()">Lancer la bille (${cJet ? '🎟️ jeton' : '−' + cBet + ' ⭐'})</button><p class="muted" style="font-size:.85rem">18 rouges, 18 noires et 1 verte (le 0). Rouge ou noir = ×2 · vert = ×36.</p>`;
  } else {
    G2.innerHTML = `<div class="slot"><div class="sltop">✨ 3 têtes pareilles = le multiplicateur ✨</div><div class="reels">${[0, 1, 2].map(i => `<div class="reel ${cLastW && cLastW[i] ? 'win' : ''}"><div class="strip" id="st${i}">${cSym(cLastR[i])}</div></div>`).join('')}</div><div class="sline"></div></div>
  <button class="cgo" id="cgo" ${can ? '' : 'disabled'} onclick="cPull()">🎰 Lancer (${cJet ? '🎟️ jeton' : '−' + cBet + ' ⭐'})</button>
  <div class="ptab">${SLOT.map((_, k) => k)
    .reverse()
    .map(k => `<span>${cSym(k).replace('sym fc', 'sym fc mini')}×3 = ×${String(SLOT[k][1]).replace('.', ',')}</span>`)
    .join('')}<span>Seules 3 têtes pareilles rapportent</span></div>`;
  }
}
function cTake() {
  if (cBusy) return false;
  if (cJet && S.inv.jeton > 0) {
    S.inv.jeton--;
    save();
    cJetUsed = true;
    cBusy = true;
    return jetVal();
  }
  cJetUsed = false;
  if (S.pts < 5) return false;
  const b = Math.min(cBet, S.pts);
  cBet = b;
  S.pts -= b;
  save();
  hdr();
  $('.csolde b').textContent = '⭐ ' + S.pts;
  cBusy = true;
  return b;
}
function cWin(b, m, label) {
  const g = Math.round(b * m);
  cBusy = false;
  if (g > 0) {
    S.pts += g;
    save();
    hdr();
  }
  const net = g - (cJetUsed ? 0 : b);
  cLog(
    `${cJetUsed ? '🎟️ ' : ''}${label} · mise ${b} → ${g ? '+' + g : '0'} ⭐ <b class="${net > 0 ? 'cw' : net < 0 ? 'cl' : ''}">(${net > 0 ? '+' : ''}${net})</b>`
  );
  if (m >= 8) {
    confetti();
    toast(`🤑 JACKPOT ! +${g} ⭐`);
  } else if (net > 0) {
    toast(`🎉 Gagné ! +${g} ⭐`);
    if (m >= 3) confetti();
  } else if (g > 0) toast(`Tu récupères ${g} ⭐`);
  else {
    toast('Perdu… 😬');
    if (b >= 20)
      setTimeout(() => toast('Peut-être que si tu fais les yeux doux à Valentin, il trouvera un moyen de te rendre ton argent 🥺'), 1300);
  }
  setTimeout(casinoView, m >= 10 ? 1400 : 900);
}
function cSpin() {
  const b = cTake();
  if (!b) return;
  const n = RL.length,
    a = 360 / n,
    k = Math.floor(Math.random() * n),
    w = $('#cwh'),
    pick = cCol;
  $('#cgo').disabled = true;
  const target = 360 - (k * a + a / 2),
    cur = ((cRot % 360) + 360) % 360;
  cRot += 360 * 6 + ((target - cur + 360) % 360);
  const rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  w.style.transition = rm ? 'none' : 'transform 5s cubic-bezier(.1,.7,.12,1)';
  w.style.transform = `rotate(${cRot}deg)`;
  const bl = $('.rball');
  if (bl && !rm)
    bl.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(-1440deg)' }], { duration: 4200, easing: 'cubic-bezier(.2,.6,.3,1)' });
  G = { casino: RL[k] };
  setTimeout(
    () => {
      const v = RL[k],
        c = rCol(v),
        m = c == pick ? RPAY[c] : 0;
      w.querySelectorAll('span')[k].classList.add('hit');
      toast(`La bille tombe sur le ${v} ${c == 'rouge' ? '🔴' : c == 'noir' ? '⚫' : '🟢'}`);
      setTimeout(() => cWin(b, m, `🎡 ${v} ${c} (misé ${pick})`), 700);
    },
    rm ? 200 : 5100
  );
}
function cPull() {
  const b = cTake();
  if (!b) return;
  $('#cgo').disabled = true;
  cLastW = null;
  document.querySelectorAll('.reel').forEach(e => e.classList.remove('win'));
  const R = cDraw(),
    rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  G = { casino: R };
  const H = $('.reel').getBoundingClientRect().height;
  let done = 0;
  R.forEach((r, i) => {
    const st = $('#st' + i),
      N = 18 + i * 6,
      seq = [];
    for (let j = 0; j < N; j++) seq.push(Math.floor(Math.random() * 6));
    seq.push(r);
    st.innerHTML = seq.map(k => cSym(k)).join('');
    st.style.transform = 'translateY(0)';
    const a = st.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-N * H}px)` }], {
      duration: rm ? 50 : 1100 + i * 450,
      easing: 'cubic-bezier(.2,.6,.25,1.06)',
      fill: 'forwards'
    });
    a.onfinish = () => {
      st.parentNode.classList.add('stop');
      setTimeout(() => st.parentNode.classList.remove('stop'), 250);
      if (++done < 3) return;
      const c = {};
      R.forEach(x => (c[x] = (c[x] || 0) + 1));
      const tri = Object.keys(c).find(x => c[x] == 3),
        pair = Object.keys(c).find(x => c[x] == 2);
      const m = tri != null ? SLOT[tri][1] : 0;
      cLastR = R;
      cLastW = R.map(() => m > 0);
      if (m) document.querySelectorAll('.reel').forEach(e => e.classList.add('win'));
      cWin(b, m, `🎰 ${tri != null ? '3 têtes ×' + String(SLOT[tri][1]).replace('.', ',') : 'rien'}`);
    };
  });
}
