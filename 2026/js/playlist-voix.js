/* ---------- Pack de voix ---------- */
let VA = null,
  vLast = -1;
function voixPlay() {
  const V = (CONTENU.voix || []).slice(0, vCount());
  if (!V.length) return;
  if (!Array.isArray(S.vbag) || !S.vbag.length || S.vbag.some(i => i >= V.length)) {
    S.vbag = shuffle([...V.keys()]);
    if (V.length > 1 && S.vbag[0] == vLast) S.vbag.push(S.vbag.shift());
  }
  const k = S.vbag.shift();
  vLast = k;
  save();
  try {
    if (VA) {
      VA.pause();
    }
    VA = new Audio(V[k]);
    VA.play().catch(() => {});
    for (let i = 0; i < 7; i++) {
      const h = document.createElement('i');
      h.className = 'vheart';
      h.textContent = ['❤️', '💖', '💕'][i % 3];
      h.style.left = innerWidth / 2 + (Math.random() - 0.5) * 120 + 'px';
      h.style.top = innerHeight * 0.45 + 'px';
      h.style.animationDelay = i * 0.12 + 's';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 2200);
    }
  } catch (e) {}
}
function songName(f) {
  let n = String(f || '')
    .replace(/^.*[\\/]/, '')
    .replace(/\.[a-z0-9]{2,4}$/i, '')
    .replace(/_/g, ' ');
  n = n
    .replace(/[\(\[][^\)\]]*(official|audio|video|lyric|clip|visuali[sz]er|hq|hd|remaster|explicit|paroles|music)[^\)\]]*[\)\]]/gi, '')
    .replace(/^\s*\d{1,3}\s*[-.)_ ]\s*/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const m = n.match(/^(.+?)\s+[-–—]\s+(.+)$/);
  return m ? { t: m[2].trim(), a: m[1].trim() } : { t: n, a: '' };
}
function songOf(d, def) {
  def = def || { t: 'Musique', a: '' };
  try {
    const f = YTM.name(d);
    if (f) {
      const r = songName(f);
      if (r.t) return r;
    }
  } catch (_) {}
  return def;
}
function plHTML() {
  if (!S.own.includes('playlist')) return '';
  const L = CONTENU.playlist || [],
    u = unl(),
    n = L.filter(x => !x.jour || x.jour <= u).length;
  return `<h2>🎵 Notre musique <small class="muted" style="font-size:.8rem">${n}/${L.length}</small></h2><div class="panel pl" id="plbox">${plInner()}</div>`;
}
function plInner() {
  const L = CONTENU.playlist || [],
    u = unl(),
    tab = window.__plTab || 'all',
    q = (window.__plQ || '').toLowerCase().trim(),
    P = S.mplays || {},
    F = S.mfav || {};
  let I = [...L.keys()].filter(i => !L[i].jour || L[i].jour <= u);
  const nAll = I.length,
    nFav = I.filter(i => F[L[i].jour]).length;
  const sg = i => songOf(L[i].jour, { t: L[i].titre, a: L[i].artiste || '' });
  if (tab == 'fav') I = I.filter(i => F[L[i].jour]);
  if (tab == 'top') I = I.filter(i => P[L[i].jour]).sort((a, b) => (P[L[b].jour] || 0) - (P[L[a].jour] || 0));
  if (q)
    I = I.filter(i => {
      const g = sg(i);
      return (g.t + ' ' + (g.a || '') + ' ' + (L[i].mot || '')).toLowerCase().includes(q);
    });
  const last = S.mlast && !YTM.on() ? L.find(x => String(x.jour) == String(S.mlast.j)) : null;
  return `${
    nAll
      ? `<div class="plhd"><button onclick="YTM.playCtx(window.__plTab=='fav'?'fav':'all')">🔀 Aléatoire</button><button class="alt" onclick="S.shuf=false;save();YTM.playCtx(window.__plTab=='fav'?'fav':'all')">▶ Tout lire</button></div>${last ? `<button class="plres" onclick="YTM.resume()">⏯ Reprendre <b>${esc(songOf(last.jour, { t: last.titre }).t)}</b> à ${Math.floor((S.mlast.p || 0) / 60)}:${String(Math.floor((S.mlast.p || 0) % 60)).padStart(2, '0')}</button>` : ''}
 <div class="pltb">${[
   ['all', 'Tout', nAll],
   ['fav', '❤️ Favoris', nFav],
   ['top', '🔥 Les plus écoutées', '']
 ]
   .map(
     ([k, l, c]) =>
       `<button class="${tab == k ? 'on' : ''}" onclick="window.__plTab='${k}';plRefresh()">${l}${c !== '' ? ` <small>${c}</small>` : ''}</button>`
   )
   .join('')}</div>
 <input class="plq" type="search" placeholder="🔎 Rechercher un titre, un artiste…" value="${esc(window.__plQ || '')}" oninput="window.__plQ=this.value;plRefresh(1)">`
      : '<p class="muted center" style="margin:0">Les chansons arrivent avec les cases du calendrier 🎁</p>'
  }
 <div class="pll">${
   I.length
     ? I.map(i => {
         const x = L[i],
           g = sg(i),
           f = !!F[x.jour],
           pl = P[x.jour] || 0;
         return `<div class="plr"><span class="pln">${tab == 'top' ? '🔥' : i + 1}</span><div class="plt" onclick="plTap(${i})"><b>${esc(g.t)}</b><small>${esc(g.a)}${pl ? ` · ${pl} écoute${pl > 1 ? 's' : ''}` : ''}</small>${x.mot ? `<em>${esc(x.mot)}</em>` : ''}</div><button class="plf" onclick="YTM.favTog(${JSON.stringify(String(x.jour))});plRefresh();YTM.refreshUI()" aria-label="Favori">${f ? '❤️' : '🤍'}</button><button class="plf" onclick="YTM.qAdd(${i})" aria-label="Lire ensuite">➕</button><button class="plp" onclick="plTap(${i})" aria-label="Écouter">${YTM.li == i ? '⏸' : '▶'}</button></div>`;
       }).join('')
     : nAll
       ? `<p class="muted center" style="margin:8px 0">${tab == 'fav' ? 'Touche 🤍 sur une chanson pour l’ajouter à tes favoris.' : tab == 'top' ? 'Écoute des chansons : les préférées apparaîtront ici.' : 'Aucun résultat.'}</p>`
       : ''
 }</div>`;
}
function plRefresh(keepFocus) {
  const b = document.getElementById('plbox');
  if (!b) return;
  if (keepFocus) {
    const l = b.querySelector('.pll');
    if (l) {
      const t = document.createElement('div');
      t.innerHTML = plInner();
      l.replaceWith(t.querySelector('.pll'));
      return;
    }
  }
  b.innerHTML = plInner();
}
