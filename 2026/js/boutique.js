/* ---------- Boutique ---------- */
function shopView() {
  if (!feat(1)) {
    app.innerHTML = `<h1>Boutique</h1><div class="panel center"><p style="font-size:2.5rem;margin:0">🔒</p><p>La boutique ouvre avec la case du 1er décembre.</p></div>`;
    return;
  }
  const it = x => {
    if (x.id == 'voix' && !(CONTENU.voix || []).length)
      return `<div class="item"><div class="ic">${x.ic}</div><div class="tx"><b>${esc(x.n)}</b><small>Bientôt disponible…</small></div><button class="alt sm" disabled>Bientôt</button></div>`;
    const lk = x.day && !feat(x.day),
      own = x.k == 'own' && S.own.includes(x.id),
      cnt = x.k == 'inv' ? S.inv[x.id] : 0;
    return `<div class="item"><div class="ic">${x.ic}</div><div class="tx"><b>${esc(x.n)}</b><small>${esc(x.d || 'Bon à échanger avec moi')}${cnt ? ` · tu en as ${cnt}` : ''}</small></div>${lk ? `<button class="alt sm" disabled>🔒 Jour ${x.day}</button>` : own ? `<button class="sm deco ${S[x.id] !== false ? '' : 'alt'}" onclick="togDeco('${x.id}')" aria-pressed="${S[x.id] !== false}">${S[x.id] !== false ? '✓ Activé' : 'Désactivé'}</button>` : `<button class="sm" ${S.pts < x.p ? 'disabled' : ''} onclick="buy('${x.id}')">${x.p} ⭐</button>`}</div>`;
  };
  app.innerHTML = `<h1>Boutique</h1><p class="center">Tu as <b>${S.pts} ⭐</b> à dépenser.</p>
 <h2>💌 Bons à échanger avec moi</h2><div class="shop">${CONTENU.bons.map(b => it({ ...b, k: 'bon' })).join('')}</div>
 <h2>🛒 Articles spéciaux</h2><div class="shop"><div class="item"><div class="ic">🏴󠁧󠁢󠁳󠁣󠁴󠁿</div><div class="tx"><b>Bon pour : Valentin ne part pas en Écosse</b><small>Offre exceptionnelle · paiement par carte</small></div><button class="sm" onclick="payEco()">9 999 €</button></div><div class="item"><div class="ic">🧦</div><div class="tx"><b>Valentin qui ne laisse pas traîner ses vêtements sales par terre</b><small>999 999 ⭐ · épuisé depuis 2025</small></div><button class="alt sm" disabled>Épuisé</button></div>${unl() >= 1 ? `<div class="item"><div class="ic">🌙</div><div class="tx"><b>Une nuit sans que Valentin ne te demande de te mettre toute nue</b><small>Article introuvable</small></div><button class="alt sm" disabled>Introuvable</button></div>` : ''}<div class="item"><div class="ic">🕳️</div><div class="tx"><b>Rien</b><small>Vraiment rien. Garanti.</small></div><button class="sm" onclick="buyNothing()">0 ⭐</button></div></div>`;
}
function payEco() {
  try {
    slog('💳', 'Regarde le bon Écosse');
  } catch (_) {}
  popup(`<div class="payx"><h2 style="margin:.1em 0">💳 Paiement sécurisé</h2><p class="muted" style="margin:0 0 6px;font-size:.85rem">Banque du 8e arrondissement 🏦 · Bon « Valentin ne part pas en Écosse »</p>
 <div class="payam">9 999,00 €</div>
 <form id="payf" autocomplete="off" onsubmit="event.preventDefault();payGo()">
 <label>Nom sur la carte<input name="x1" autocomplete="off" placeholder="CÉLESTINE …" spellcheck="false"></label>
 <label>Numéro de carte<input name="x2" autocomplete="off" inputmode="numeric" placeholder="1234 5678 9012 3456" maxlength="23" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,19).replace(/(.{4})(?=.)/g,'$1 ')"></label>
 <div class="payrow"><label>Expiration<input name="x3" autocomplete="off" inputmode="numeric" placeholder="MM/AA" maxlength="5" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,4).replace(/^(\\d\\d)(?=.)/,'$1/')"></label><label>CVC<input name="x4" autocomplete="off" inputmode="numeric" placeholder="123" maxlength="3" oninput="this.value=this.value.replace(/\\D/g,'').slice(0,3)"></label></div>
 <p id="payerr" class="payerr" hidden></p>
 <button type="submit" id="payb" class="big">🔒 Payer 9 999,00 €</button></form>
 <button class="alt" onclick="closePop()">Annuler</button></div>`);
}
function payGo() {
  const f = document.getElementById('payf'),
    b = document.getElementById('payb'),
    e = document.getElementById('payerr');
  if (!f || !b) return;
  const v = n => (f.elements[n].value || '').trim(),
    dg = n => v(n).replace(/\D/g, ''),
    bad = [];
  f.querySelectorAll('input').forEach(i => i.classList.remove('payko'));
  if (v('x1').length < 2) bad.push(['x1', 'le nom sur la carte']);
  if (dg('x2').length != 16) bad.push(['x2', 'le numéro de carte (16 chiffres)']);
  {
    const x = dg('x3'),
      m = +x.slice(0, 2);
    if (x.length != 4 || m < 1 || m > 12) bad.push(['x3', 'la date d’expiration (MM/AA)']);
  }
  if (dg('x4').length != 3) bad.push(['x4', 'le cryptogramme (3 chiffres)']);
  if (bad.length) {
    bad.forEach(([n]) => f.elements[n].classList.add('payko'));
    e.hidden = false;
    e.innerHTML = '⚠️ <b>Informations incomplètes.</b><br><small>Vérifie ' + bad.map(x => x[1]).join(', ') + '.</small>';
    try {
      SFX('bad');
    } catch (_) {}
    return;
  }
  b.disabled = true;
  b.textContent = '⏳ Traitement en cours…';
  e.hidden = true;
  setTimeout(() => {
    f.querySelectorAll('input').forEach(i => (i.value = ''));
    b.disabled = false;
    b.textContent = '🔒 Payer 9 999,00 €';
    e.hidden = false;
    e.innerHTML = '❌ <b>Paiement refusé : fonds insuffisants.</b><br><small>Valentin part donc bien en Écosse 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Désolé.</small>';
    try {
      SFX('bad');
    } catch (_) {}
    try {
      navigator.vibrate && navigator.vibrate([90, 50, 90]);
    } catch (_) {}
  }, 2200);
}
function buyNothing() {
  try {
    SFX('ok');
    slog('🕳️', 'Achète… rien');
  } catch (_) {}
  popup(
    `<h2>🕳️ Rien</h2><p>Félicitations, tu possèdes maintenant… <b>rien</b>.</p><p class="muted">Valentin aussi offre souvent ça.</p><button onclick="closePop()">Merci ?</button>`
  );
}
function togDeco(id) {
  S[id] = S[id] === false;
  save();
  snowCount();
  toast(S[id] ? 'Décoration activée ✨' : 'Décoration désactivée');
  if (id == 'voix' && S[id]) ding();
  render();
}
function buy(id) {
  const x = SHOP.find(s => s.id == id) || { ...CONTENU.bons.find(b => b.id == id), k: 'bon' };
  if (!x || S.pts < x.p) return;
  if (x.k == 'bon')
    return popup(
      `<h2>${x.ic} ${esc(x.n)}</h2><p>Échanger <b>${x.p} ⭐</b> contre ce bon ?</p><button onclick="buyOk('${id}')">Oui, je le veux !</button><button class="alt" onclick="closePop()">Annuler</button>`
    );
  buyOk(id);
}
function buyOk(id) {
  const x = SHOP.find(s => s.id == id) || { ...CONTENU.bons.find(b => b.id == id), k: 'bon' };
  if (S.pts < x.p) return;
  slog('🛍️', `Achète ${x.ic} ${x.n} (${x.p} ⭐)`);
  S.pts -= x.p;
  ACH('shop');
  EV('buy');
  if (x.k == 'inv') S.inv[id]++;
  else if (x.k == 'own') {
    S.own.push(id);
    S[id] = true;
    snowCount();
  } else {
    S.bons.push({ id, ic: x.ic, n: x.n, used: false, at: Date.now() });
    confetti();
  }
  save();
  ding();
  closePop();
  toast(x.k == 'bon' ? 'Bon ajouté dans tes Trésors 💌' : `${x.ic} ${x.n} acheté !`);
  render();
}
