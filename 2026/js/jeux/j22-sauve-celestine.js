GAMES.pins = function (p, el, win, fail) {
  const id = RUN,
    W = PIN.W,
    H = PIN.H,
    pr = !!document.querySelector('#gwin .gwh small'),
    day = cur,
    NL = PIN.LV.length;
  let sens = 0,
    sensB = 0,
    sensOn = false,
    btn = 0,
    tiltOK = !!window.__tiltOK,
    lastTa = null;
  let L = pr ? 0 : Math.min(NL - 1, (S.days[day] && S.days[day].pinL) || 0),
    w = null,
    over = false,
    raf = 0,
    banner = null,
    bannerT = 0,
    tt = 0;
  el.innerHTML = `<div class="pgtop"><span class="pglv" id="pglv"></span><button class="alt sm pgu" id="pgu" aria-label="Mourir et recommencer le niveau">💀 Mourir</button></div><div class="pgwrap"><canvas class="pcv" id="pcv"></canvas><div class="pintro" id="pintro" hidden><div><p id="pintx"></p><button id="pigo">C'est parti !</button></div></div><div class="prot" id="prot" hidden><b>↻</b>Remets le téléphone droit<small>Astuce : verrouille la rotation de l'écran (centre de contrôle sur iPhone, « Rotation auto » sur Android)</small></div></div><div class="ptilt" id="ptilt" hidden><button class="tb" id="tbl" aria-label="Pencher à gauche">◀</button><span class="tg"><i id="tga">⬇</i><small id="tgt">Penche le téléphone<br>ou maintiens une flèche</small></span><button class="tb" id="tbr" aria-label="Pencher à droite">▶</button></div><div class="center"><button class="sm" id="tperm" hidden>📱 Activer l'inclinaison du téléphone</button></div>
  <div class="pleg"><span><i class="h"></i>Célestine</span><span><i class="l"></i>Lave</span><span><i class="w"></i>Eau</span><span><i class="s"></i>Pierre</span><span><i class="g"></i>Cambrioleur</span><span><i class="b"></i>Cadeau</span></div>`;
  const cv = $('#pcv'),
    x = cv.getContext('2d'),
    dpr = Math.min(3, window.devicePixelRatio || 1);
  cv.width = W * dpr;
  cv.height = H * dpr;
  x.scale(dpr, dpr);
  const face = new Image();
  face.src = (CONTENU.photos || [])[0] || '';
  // calque des liquides (métaballes basse résolution)
  const LR = 2,
    lw = W / LR,
    lh = H / LR,
    oc = document.createElement('canvas');
  oc.width = lw;
  oc.height = lh;
  const ox = oc.getContext('2d', { willReadFrequently: true });
  const blob = (() => {
    const c = document.createElement('canvas'),
      R = 6;
    c.width = c.height = R * 2;
    const g = c.getContext('2d'),
      gr = g.createRadialGradient(R, R, 0, R, R, R);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.55, 'rgba(255,255,255,.55)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, R * 2, R * 2);
    return c;
  })();

  let bg = null,
    bub = [],
    intro = false;
  const KC = { or: '#ffd24a', rouge: '#ff4d6a', bleu: '#4ab3ff' },
    KN = { or: "d'or", rouge: 'rouge', bleu: 'bleue' };
  const snow = Array.from({ length: 38 }, (_, k) => ({
    x: (k * 83) % W,
    y: (k * 131) % H,
    r: 0.8 + (k % 3) * 0.5,
    v: 0.25 + (k % 4) * 0.12,
    p: k
  }));
  let left = p.time;
  const hearts = () => {
    const sd = S.days[day] || {},
      mx = 3 + (sd.extra || 0),
      f = Math.min(sd.fails || 0, mx),
      e = $('#lives');
    if (e && !pr) e.textContent = 'Essais : ' + '❤️'.repeat(mx - f) + '🖤'.repeat(f);
  };
  function loseTry() {
    if (pr) return true;
    const sd = (S.days[day] = S.days[day] || {}),
      mx = 3 + (sd.extra || 0);
    sd.fails = (sd.fails || 0) + 1;
    save();
    hearts();
    if (sd.fails >= mx) {
      sd.fails = mx - 1;
      save();
      return true;
    }
    return false;
  }
  const tmr = () => {
    const e = $('#tmr');
    if (e) {
      e.textContent = '⏱️ ' + Math.max(0, left) + ' s';
      e.style.color = left <= 10 ? '#ff9a9a' : '';
    }
  };
  tmr();
  const tick = setInterval(() => {
    if (id != RUN || over) {
      clearInterval(tick);
      return;
    }
    if (intro || document.hidden) return;
    left--;
    tmr();
    if (left <= 0) {
      if (loseTry()) {
        end(false, 'le temps est écoulé ⏱️');
        return;
      }
      left = 15;
      tmr();
      toast(pr ? '⏱️ Temps écoulé : +15 secondes' : '⏱️ Temps écoulé : −1 essai, +15 secondes');
    }
  }, 1000);
  function end(ok, why) {
    if (over) return;
    over = true;
    cancelAnimationFrame(raf);
    ok ? win() : fail(why);
  }
  function load(i) {
    L = i;
    w = pinWorld(i);
    banner = { info: 1, t: `Niveau ${i + 1}`, s: PIN.LV[i].t };
    bannerT = tt;
    intro = !!PIN.LV[i].i;
    $('#pintro').hidden = !intro;
    if (intro) $('#pintx').innerHTML = `<b>Niveau ${i + 1} · ${esc(PIN.LV[i].t)}</b><br>${esc(PIN.LV[i].i)}`;
    bg = paintBg(i);
    const T = !!PIN.LV[i].tilt;
    $('#pglv').innerHTML = `Niveau <b>${i + 1}</b>/${NL} · ${T ? '📱 ' : ''}${PIN.LV[i].t}`;
    $('#ptilt').hidden = !T;
    const needP =
      T && !tiltOK && typeof DeviceOrientationEvent != 'undefined' && typeof DeviceOrientationEvent.requestPermission == 'function';
    $('#tperm').hidden = !needP;
    if (T && !needP) toast('📱 Niveau à inclinaison : penche le téléphone !');
    if (T)
      setTimeout(() => {
        if (id != RUN || over || sensOn) return;
        const tx = $('#tgt');
        if (tx)
          tx.innerHTML =
            needP && !tiltOK
              ? 'Touche « Activer » en dessous<br>ou maintiens une flèche'
              : 'Capteur non détecté ici :<br>maintiens les flèches ◀ ▶';
      }, 1800);
  }
  function tiltTarget() {
    if (btn) return btn;
    if (!sensOn) return 0;
    const o = ((((screen.orientation && screen.orientation.angle) || window.orientation || 0) % 360) + 360) % 360,
      cr = document.documentElement.classList,
      fix = cr.contains('rotL') || cr.contains('rotR');
    let gm = fix ? sens : o == 90 ? sensB : o == 270 ? -sensB : o == 180 ? -sens : sens;
    if (Math.abs(gm) < 4) return 0;
    return Math.max(-32, Math.min(32, gm * 1.7));
  }
  const land = () => matchMedia('(orientation: landscape)').matches && Math.min(innerWidth, innerHeight) < 560;
  let lockTry = false;
  function tryLock() {
    if (lockTry) return;
    lockTry = true;
    try {
      const d = document.documentElement,
        so = screen.orientation;
      if (so && so.lock) {
        const go = () => so.lock('portrait').catch(() => {});
        if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen({ navigationUI: 'hide' }).then(go).catch(go);
        else go();
      }
    } catch (_) {}
  }
  function wall(g, a) {
    const [x1, y1, x2, y2] = a,
      dx = x2 - x1,
      dy = y2 - y1,
      l = Math.hypot(dx, dy) || 1,
      hor = Math.abs(dy) < Math.abs(dx) * 0.7;
    g.lineCap = 'round';
    g.strokeStyle = '#08131d66';
    g.lineWidth = 14;
    g.beginPath();
    g.moveTo(x1, y1 + 4);
    g.lineTo(x2, y2 + 4);
    g.stroke();
    const nx = -dy / l,
      ny = dx / l,
      gr = g.createLinearGradient(x1 - nx * 6, y1 - ny * 6, x1 + nx * 6, y1 + ny * 6);
    gr.addColorStop(0, '#2e4253');
    gr.addColorStop(0.45, '#5f7b90');
    gr.addColorStop(1, '#25384a');
    g.strokeStyle = gr;
    g.lineWidth = 12;
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke();
    g.strokeStyle = '#9fb6c788';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(x1, y1 - 3);
    g.lineTo(x2, y2 - 3);
    g.stroke();
    if (hor) {
      g.fillStyle = '#fbfdff';
      const n = Math.max(2, Math.round(l / 9));
      for (let k = 0; k <= n; k++) {
        const t = k / n,
          px = x1 + dx * t,
          py = y1 + dy * t,
          r = 3.2 + ((k * 37) % 5) * 0.55;
        g.beginPath();
        g.arc(px, py - 6, r, 0, 7);
        g.fill();
      }
      g.fillStyle = '#e9f3fb';
      g.beginPath();
      g.moveTo(x1, y1 - 5);
      g.lineTo(x2, y2 - 5);
      g.lineTo(x2, y2 - 8);
      g.lineTo(x1, y1 - 8);
      g.fill();
      g.fillStyle = '#cfe8f7';
      for (let k = 1; k < l / 13; k++) {
        const t = (k * 13) / l,
          px = x1 + dx * t,
          py = y1 + dy * t + 6,
          h = 4 + ((k * 53) % 7);
        g.beginPath();
        g.moveTo(px - 2.2, py);
        g.lineTo(px + 2.2, py);
        g.lineTo(px, py + h);
        g.closePath();
        g.fill();
      }
    } else {
      const tx = y1 < y2 ? x1 : x2,
        ty = Math.min(y1, y2);
      g.fillStyle = '#fbfdff';
      g.beginPath();
      g.arc(tx, ty - 4, 6.5, Math.PI, 0);
      g.fill();
    }
  }
  function paintBg(i) {
    const c = document.createElement('canvas');
    c.width = W * dpr;
    c.height = H * dpr;
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    const b = g.createLinearGradient(0, 0, 0, H);
    b.addColorStop(0, '#0a1730');
    b.addColorStop(0.6, '#15335a');
    b.addColorStop(1, '#1d4a6e');
    g.fillStyle = b;
    g.fillRect(0, 0, W, H);
    for (let k = 0; k < 70; k++) {
      g.fillStyle = `rgba(255,255,255,${0.15 + (k % 5) * 0.08})`;
      g.beginPath();
      g.arc((k * 97 + 13) % W, (k * 53 + 7) % (H * 0.9), 0.6 + (k % 3) * 0.5, 0, 7);
      g.fill();
    }
    g.fillStyle = '#0d2238';
    [
      [0, 520, 26, 430],
      [22, 520, 48, 450],
      [252, 520, 276, 440],
      [272, 520, 300, 455]
    ].forEach(([x0, y0, xm, ym]) => {
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(xm, ym);
      g.lineTo(x0 + (xm - x0) * 2, y0);
      g.closePath();
      g.fill();
    });
    g.fillStyle = '#e8f2f9';
    g.beginPath();
    g.moveTo(0, H);
    g.quadraticCurveTo(80, 498, 150, 506);
    g.quadraticCurveTo(230, 498, 300, H);
    g.closePath();
    g.fill();
    g.save();
    g.beginPath();
    PIN.SHAPE.forEach(([a, b], j) => (j ? g.lineTo(a, b) : g.moveTo(a, b)));
    g.closePath();
    g.clip();
    const ib = g.createLinearGradient(0, 16, 0, 402);
    ib.addColorStop(0, '#f2f9fd');
    ib.addColorStop(1, '#c6dcec');
    g.fillStyle = ib;
    g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(255,255,255,.35)';
    for (let k = 0; k < 4; k++) {
      g.beginPath();
      g.moveTo(40 + k * 70, 16);
      g.lineTo(70 + k * 70, 16);
      g.lineTo(-30 + k * 70, 402);
      g.lineTo(-60 + k * 70, 402);
      g.fill();
    }
    g.fillStyle = '#9fbcd022';
    for (let yy = 26; yy < 402; yy += 14)
      for (let xx = 26; xx < 284; xx += 14) {
        g.beginPath();
        g.arc(xx, yy, 1, 0, 7);
        g.fill();
      }
    const v = g.createRadialGradient(150, 200, 90, 150, 200, 260);
    v.addColorStop(0, 'rgba(20,40,70,0)');
    v.addColorStop(1, 'rgba(20,40,70,.28)');
    g.fillStyle = v;
    g.fillRect(0, 0, W, H);
    g.restore();
    // hotte
    g.save();
    g.shadowColor = '#0009';
    g.shadowBlur = 16;
    g.shadowOffsetY = 6;
    const sk = g.createLinearGradient(60, 440, 240, 512);
    sk.addColorStop(0, '#d81f3a');
    sk.addColorStop(1, '#7a0b1d');
    g.fillStyle = sk;
    g.beginPath();
    g.moveTo(62, 444);
    g.bezierCurveTo(30, 526, 270, 526, 238, 444);
    g.closePath();
    g.fill();
    g.restore();
    g.strokeStyle = '#ffffff18';
    g.lineWidth = 2;
    for (let k = 0; k < 5; k++) {
      g.beginPath();
      g.moveTo(80 + k * 30, 452);
      g.quadraticCurveTo(84 + k * 30, 486, 96 + k * 28, 506);
      g.stroke();
    }
    [
      [96, 428, '#2e7d32', '#ffd24a'],
      [184, 426, '#1565c0', '#ff5a7a']
    ].forEach(([x0, y0, c1, c2]) => {
      g.fillStyle = c1;
      g.fillRect(x0, y0, 22, 18);
      g.fillStyle = c2;
      g.fillRect(x0 + 9, y0, 4, 18);
      g.fillRect(x0, y0 + 7, 22, 4);
    });
    g.fillStyle = '#fff';
    g.beginPath();
    g.roundRect ? g.roundRect(54, 436, 192, 14, 7) : g.rect(54, 436, 192, 14);
    g.fill();
    g.fillStyle = '#e3edf3';
    for (let k = 0; k < 11; k++) {
      g.beginPath();
      g.arc(60 + k * 18, 443, 6.5, 0, 7);
      g.fill();
    }
    g.strokeStyle = '#d9a43a';
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(150, 452);
    g.quadraticCurveTo(140, 470, 128, 476);
    g.moveTo(150, 452);
    g.quadraticCurveTo(162, 470, 174, 476);
    g.stroke();
    g.fillStyle = '#ffd24a';
    g.beginPath();
    g.arc(150, 454, 4, 0, 7);
    g.fill();
    PIN.BOX.slice(0, 5)
      .concat(PIN.LV[i].w)
      .forEach(a => wall(g, a));
    return c;
  }
  function rod(s) {
    const [x1, y1, x2, y2] = s.a,
      dx = x2 - x1,
      dy = y2 - y1,
      l = Math.hypot(dx, dy),
      ux = dx / l,
      uy = dy / l,
      sg = s.side == 'a' ? -1 : 1,
      e = s.on ? 0 : 1 - Math.pow(1 - s.out, 3),
      sh = sg * e * (l + 60);
    const sk = s.shk && tt - s.shk < 0.4 ? Math.sin((tt - s.shk) * 60) * 3 * (1 - (tt - s.shk) / 0.4) : 0,
      ax = x1 + ux * sh + uy * sk,
      ay = y1 + uy * sh - ux * sk,
      bx = x2 + ux * sh + uy * sk,
      by = y2 + uy * sh - ux * sk,
      RR = 10.5,
      ex = sg < 0 ? ax : bx,
      ey = sg < 0 ? ay : by,
      hx = ex + sg * ux * (RR + 2),
      hy = ey + sg * uy * (RR + 2),
      nx = -uy,
      ny = ux;
    x.save();
    x.globalAlpha = s.on ? 1 : Math.max(0, 1 - s.out * 1.15);
    x.lineCap = 'round';
    if (s.on) {
      const pu = 0.5 + 0.5 * Math.sin(tt * 4),
        gl = x.createRadialGradient(hx, hy, 4, hx, hy, 22 + pu * 4);
      gl.addColorStop(0, 'rgba(255,220,110,.55)');
      gl.addColorStop(1, 'rgba(255,220,110,0)');
      x.fillStyle = gl;
      x.beginPath();
      x.arc(hx, hy, 26, 0, 7);
      x.fill();
    }
    x.strokeStyle = 'rgba(0,0,0,.3)';
    x.lineWidth = 11;
    x.beginPath();
    x.moveTo(ax, ay + 4);
    x.lineTo(bx, by + 4);
    x.stroke();
    x.lineWidth = 7;
    x.beginPath();
    x.arc(hx, hy + 4, RR, 0, 7);
    x.stroke();
    x.strokeStyle = '#5c3500';
    x.lineWidth = 11;
    x.beginPath();
    x.moveTo(ax, ay);
    x.lineTo(bx, by);
    x.stroke();
    const gr = x.createLinearGradient(ax - nx * 5, ay - ny * 5, ax + nx * 5, ay + ny * 5);
    gr.addColorStop(0, '#8a5200');
    gr.addColorStop(0.28, '#f2b52c');
    gr.addColorStop(0.48, '#fff4bf');
    gr.addColorStop(0.7, '#e5a11a');
    gr.addColorStop(1, '#7a4600');
    x.strokeStyle = gr;
    x.lineWidth = 8.5;
    x.beginPath();
    x.moveTo(ax, ay);
    x.lineTo(bx, by);
    x.stroke();
    x.strokeStyle = 'rgba(255,255,235,.9)';
    x.lineWidth = 1.8;
    x.beginPath();
    x.moveTo(ax - nx * 1.6 + ux * 2, ay - ny * 1.6 + uy * 2);
    x.lineTo(bx - nx * 1.6 - ux * 2, by - ny * 1.6 - uy * 2);
    x.stroke();
    x.strokeStyle = '#5c3500';
    x.lineWidth = 9.5;
    x.beginPath();
    x.arc(hx, hy, RR, 0, 7);
    x.stroke();
    const rg = x.createLinearGradient(hx - RR, hy - RR, hx + RR, hy + RR);
    rg.addColorStop(0, '#fff4bf');
    rg.addColorStop(0.35, '#f5c542');
    rg.addColorStop(0.75, '#d48a10');
    rg.addColorStop(1, '#8a5200');
    x.strokeStyle = rg;
    x.lineWidth = 7;
    x.beginPath();
    x.arc(hx, hy, RR, 0, 7);
    x.stroke();
    x.strokeStyle = 'rgba(255,255,240,.95)';
    x.lineWidth = 1.8;
    x.beginPath();
    x.arc(hx, hy, RR + 1.2, Math.PI * 1.05, Math.PI * 1.55);
    x.stroke();
    x.beginPath();
    x.arc(hx, hy, RR - 2, Math.PI * 0.15, Math.PI * 0.45);
    x.strokeStyle = 'rgba(120,70,0,.5)';
    x.stroke();
    if (s.on && pinLocked(w, s)) {
      x.globalAlpha = 1;
      x.fillStyle = KC[s.key] || '#3a3f44';
      x.strokeStyle = KC[s.key] || '#3a3f44';
      x.shadowColor = '#000a';
      x.shadowBlur = 3;
      x.lineWidth = 2.4;
      x.beginPath();
      x.arc(hx, hy - 3, 4, Math.PI, 0);
      x.stroke();
      x.beginPath();
      x.roundRect ? x.roundRect(hx - 6, hy - 3, 12, 10, 2) : x.rect(hx - 6, hy - 3, 12, 10);
      x.fill();
      x.fillStyle = '#ffd24a';
      x.beginPath();
      x.arc(hx, hy + 1.5, 1.6, 0, 7);
      x.fill();
      x.fillRect(hx - 0.7, hy + 1.5, 1.4, 3);
    }
    x.restore();
    s.hx = hx;
    s.hy = hy;
  }
  function liquid(k) {
    ox.clearRect(0, 0, lw, lh);
    ox.globalCompositeOperation = 'lighter';
    let n = 0;
    for (const q of w.P)
      if (q.k == k) {
        ox.drawImage(blob, q.x / LR - 6, q.y / LR - 6);
        n++;
      }
    ox.globalCompositeOperation = 'source-over';
    if (!n) return;
    const im = ox.getImageData(0, 0, lw, lh),
      d = im.data,
      al = k == 'w' ? 228 : 255,
      T = tt;
    for (let y = 0; y < lh; y++) {
      for (let xx = 0; xx < lw; xx++) {
        const i = (y * lw + xx) * 4,
          a = d[i + 3];
        if (a <= 110) {
          d[i + 3] = 0;
          continue;
        }
        const up = y > 0 ? d[i + 3 - lw * 4] : 0,
          rim = a < 150 || up <= 110;
        let r, gg, bb;
        if (k == 'l') {
          const v = (Math.sin(xx * 0.33 + T * 2.6) + Math.sin(y * 0.29 - T * 1.9) + Math.sin((xx + y) * 0.17 + T * 1.2)) / 3;
          if (rim) {
            r = 255;
            gg = 230;
            bb = 120;
          } else {
            r = 255;
            gg = Math.max(40, Math.min(210, 120 + v * 80));
            bb = Math.max(0, 20 + v * 20);
          }
        } else if (k == 'w') {
          const v = Math.sin(xx * 0.25 + T * 1.6) * Math.sin(y * 0.2 - T);
          if (rim) {
            r = 225;
            gg = 247;
            bb = 255;
          } else {
            r = 70 + v * 14;
            gg = 170 + v * 16;
            bb = 245;
          }
        } else {
          const s =
            (((xx * 73856093) ^ (y * 19349663)) >>> 0) % 7 == 0 ? -30 : (((xx * 2654435761) ^ (y * 40503)) >>> 0) % 13 == 0 ? 18 : 0;
          if (rim) {
            r = 190 + s;
            gg = 200 + s;
            bb = 208 + s;
          } else {
            r = 106 + s;
            gg = 118 + s;
            bb = 128 + s;
          }
        }
        d[i] = r;
        d[i + 1] = gg;
        d[i + 2] = bb;
        d[i + 3] = al;
      }
    }
    ox.putImageData(im, 0, 0);
    x.save();
    x.imageSmoothingEnabled = true;
    if (k == 'l') {
      x.shadowColor = '#ff6a00';
      x.shadowBlur = 16;
    }
    x.drawImage(oc, 0, 0, W, H);
    x.restore();
    if (k == 'l') {
      if (Math.random() < 0.35) {
        const L2 = w.P.filter(q => q.k == 'l');
        if (L2.length) {
          const q = L2[(Math.random() * L2.length) | 0];
          bub.push({ x: q.x, y: q.y - 3, t: 0 });
        }
      }
      bub = bub.filter(b => b.t < 1);
      bub.forEach(b => {
        b.t += 0.04;
        x.strokeStyle = `rgba(255,240,170,${1 - b.t})`;
        x.lineWidth = 1.2;
        x.beginPath();
        x.arc(b.x, b.y - b.t * 4, 1.5 + b.t * 3, 0, 7);
        x.stroke();
      });
    }
  }
  function gift(q) {
    x.save();
    x.translate(q.x, q.y);
    x.rotate(Math.max(-0.3, Math.min(0.3, (q.x - q.px) * 1.5)));
    const s = q.r * 1.25;
    x.shadowColor = '#0007';
    x.shadowBlur = 6;
    x.shadowOffsetY = 3;
    const gr = x.createLinearGradient(-s, -s, s, s);
    gr.addColorStop(0, '#ff4f6a');
    gr.addColorStop(1, '#a30d26');
    x.fillStyle = gr;
    x.beginPath();
    x.roundRect ? x.roundRect(-s, -s, s * 2, s * 2, 4) : x.rect(-s, -s, s * 2, s * 2);
    x.fill();
    x.shadowColor = 'transparent';
    x.fillStyle = '#ffd24a';
    x.fillRect(-3, -s, 6, s * 2);
    x.fillRect(-s, -3, s * 2, 6);
    x.beginPath();
    x.ellipse(-6, -s - 2, 6, 4, -0.5, 0, 7);
    x.ellipse(6, -s - 2, 6, 4, 0.5, 0, 7);
    x.fill();
    x.fillStyle = '#ffffff40';
    x.fillRect(-s + 2, -s + 2, s * 0.7, s * 0.4);
    x.restore();
  }
  function eggP(q) {
    x.save();
    x.translate(q.x, q.y);
    x.rotate(Math.max(-0.6, Math.min(0.6, (q.x - q.px) * 0.8)));
    eggDraw(x, 0, -1, q.r * 2.5, 22);
    x.restore();
  }
  function hero(q) {
    const vx = (q.x - q.px) * 180,
      vy = (q.y - q.py) * 180,
      sp = Math.hypot(vx, vy),
      fall = vy > 140,
      dead = w.st == 'burn' || w.st == 'grinch';
    let near = false;
    for (const o of w.P)
      if (o.k == 'l' && Math.abs(o.x - q.x) < 46 && Math.abs(o.y - q.y) < 46) {
        near = true;
        break;
      }
    const lean = Math.max(-0.45, Math.min(0.45, vx / 420)) + (((w.tilt || 0) * Math.PI) / 180) * 0.4,
      bob = Math.sin(tt * 3) * 0.8,
      wv = near ? Math.sin(tt * 30) : Math.sin(tt * 2.2);
    x.save();
    x.translate(q.x, q.y + bob);
    x.rotate(lean);
    x.fillStyle = '#0003';
    x.beginPath();
    x.ellipse(0, 19, 10, 2.5, 0, 0, 7);
    x.fill();
    const legA = fall ? 0.5 : Math.sin(tt * (sp > 40 ? 12 : 0)) * 0.35;
    x.lineCap = 'round';
    [-1, 1].forEach((s, i) => {
      const a = s * (fall ? 0.45 : 0.12) + (i ? legA : -legA) * (sp > 40 ? 1 : 0);
      x.strokeStyle = '#1f6b3a';
      x.lineWidth = 4;
      x.beginPath();
      x.moveTo(s * 3.5, 11);
      x.lineTo(s * 3.5 + Math.sin(a) * 8, 11 + Math.cos(a) * 8);
      x.stroke();
      x.fillStyle = '#2b1d16';
      x.beginPath();
      x.ellipse(s * 3.5 + Math.sin(a) * 8 + s * 1.5, 11 + Math.cos(a) * 8 + 1, 3.2, 2.2, 0, 0, 7);
      x.fill();
    });
    const ag = fall ? -2.4 : near ? -1.9 + wv * 0.5 : 0.45 + wv * 0.15;
    [-1, 1].forEach(s => {
      const a = s * ag,
        ex = s * 7 + Math.sin(a) * 9 * s * s,
        ey = 4 + Math.cos(a) * 9;
      x.strokeStyle = '#c8102e';
      x.lineWidth = 4;
      x.beginPath();
      x.moveTo(s * 6, 4);
      x.lineTo(s * 6 + s * Math.abs(Math.sin(ag)) * 8, 4 + Math.cos(ag) * 8);
      x.stroke();
      x.fillStyle = '#fff';
      x.beginPath();
      x.arc(s * 6 + s * Math.abs(Math.sin(ag)) * 8, 4 + Math.cos(ag) * 8, 2.4, 0, 7);
      x.fill();
    });
    const bd = x.createLinearGradient(0, 2, 0, 15);
    bd.addColorStop(0, '#ff3b52');
    bd.addColorStop(1, '#a30d26');
    x.fillStyle = bd;
    x.beginPath();
    x.moveTo(-6.5, 2);
    x.lineTo(6.5, 2);
    x.lineTo(8.5, 14);
    x.quadraticCurveTo(0, 16.5, -8.5, 14);
    x.closePath();
    x.fill();
    x.fillStyle = '#fff';
    x.fillRect(-8.6, 12.2, 17.2, 2.6);
    x.fillRect(-1.2, 2, 2.4, 10.5);
    x.fillStyle = '#2b1d16';
    x.fillRect(-7.2, 7.6, 14.4, 2.2);
    x.fillStyle = '#ffd24a';
    x.fillRect(-1.8, 7.2, 3.6, 3);
    const r = 11.5,
      hy = -8;
    x.save();
    x.shadowColor = '#0006';
    x.shadowBlur = 5;
    x.shadowOffsetY = 2;
    x.fillStyle = '#fff';
    x.beginPath();
    x.arc(0, hy, r + 2, 0, 7);
    x.fill();
    x.restore();
    x.save();
    x.beginPath();
    x.arc(0, hy, r, 0, 7);
    x.clip();
    if (face.complete && face.naturalWidth) {
      const s = Math.min(face.naturalWidth, face.naturalHeight);
      x.drawImage(face, (face.naturalWidth - s) / 2, (face.naturalHeight - s) / 2, s, s, -r, hy - r, r * 2, r * 2);
    } else {
      x.fillStyle = '#f4c7a1';
      x.fill();
    }
    if (dead) {
      x.fillStyle = '#000a';
      x.fillRect(-r, hy - r, r * 2, r * 2);
    }
    x.restore();
    x.fillStyle = '#e0243b';
    x.beginPath();
    x.moveTo(-r * 0.95, hy - r * 0.5);
    x.quadraticCurveTo(0, hy - r * 2.3, r * 1.2, hy - r * 1.45);
    x.lineTo(r * 0.9, hy - r * 0.55);
    x.closePath();
    x.fill();
    x.fillStyle = '#fff';
    x.beginPath();
    x.ellipse(0, hy - r * 0.6, r * 1.02, r * 0.25, 0, 0, 7);
    x.fill();
    x.beginPath();
    x.arc(r * 1.22, hy - r * 1.45, r * 0.25, 0, 7);
    x.fill();
    if (near && !dead) {
      x.font = '10px serif';
      x.fillText('💦', r * 0.9, hy - r * 0.2);
    }
    if (dead) {
      x.font = '14px serif';
      x.textAlign = 'center';
      x.fillText('😵', 0, hy + 5);
    }
    x.restore();
  }
  function grinch(q) {
    const r = q.r,
      walk = q.pat || q.chase ? Math.sin(tt * (q.chase ? 16 : 10)) : 0,
      dir = q.dir || 1,
      h = w.P.find(o => o.k == 'h');
    x.save();
    x.translate(q.x, q.y + Math.abs(walk) * -1.2);
    x.fillStyle = '#0004';
    x.beginPath();
    x.ellipse(0, r + 1, r * 0.9, 2.4, 0, 0, 7);
    x.fill();
    x.strokeStyle = '#1a1d2a';
    x.lineWidth = 3;
    x.lineCap = 'round';
    [-1, 1].forEach((s, k) => {
      x.beginPath();
      x.moveTo(s * 4, r * 0.6);
      x.lineTo(s * 5 + (k ? walk : -walk) * 3, r + 1);
      x.stroke();
    });
    const g = x.createRadialGradient(-4, -5, 2, 0, 0, r * 1.2);
    g.addColorStop(0, '#5a6078');
    g.addColorStop(1, '#1a1d2a');
    x.fillStyle = g;
    x.beginPath();
    for (let k = 0; k < 18; k++) {
      const a = (k / 18) * Math.PI * 2,
        rr = r;
      x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    x.closePath();
    x.fill();
    x.strokeStyle = '#1a1d2a';
    x.lineWidth = 3;
    [-1, 1].forEach(s => {
      x.beginPath();
      x.moveTo(s * r * 0.9, 0);
      x.lineTo(s * (r + 5), -3 + Math.sin(tt * 8 + s) * 2);
      x.stroke();
    });
    let ex = 0,
      ey = 0;
    if (h) {
      const a = Math.atan2(h.y - q.y, h.x - q.x);
      ex = Math.cos(a) * 1.3;
      ey = Math.sin(a) * 1.3;
    }
    x.fillStyle = '#111';
    x.fillRect(-r * 0.95, -5.5, r * 1.9, 6.5);
    x.fillStyle = '#fff';
    [-1, 1].forEach(s => {
      x.beginPath();
      x.ellipse(s * 4.5, -2, 3.6, 2.8, 0, 0, 7);
      x.fill();
    });
    x.fillStyle = '#111';
    [-1, 1].forEach(s => {
      x.beginPath();
      x.arc(s * 4.5 + ex, -2 + ey, 1.5, 0, 7);
      x.fill();
    });
    x.strokeStyle = '#e8d8c8';
    x.lineWidth = 1.8;
    x.beginPath();
    x.moveTo(-8.5, -7.5);
    x.lineTo(-2, -4.5);
    x.moveTo(8.5, -7.5);
    x.lineTo(2, -4.5);
    x.stroke();
    x.beginPath();
    x.moveTo(-6, 3);
    x.quadraticCurveTo(0, 8.5, 6, 3);
    x.stroke();
    x.fillStyle = '#fff';
    x.beginPath();
    x.moveTo(-3, 4.6);
    x.lineTo(-1.5, 6.6);
    x.lineTo(0, 4.9);
    x.lineTo(1.5, 6.6);
    x.lineTo(3, 4.6);
    x.fill();
    x.fillStyle = '#111';
    x.beginPath();
    x.ellipse(0, -r * 0.7, r * 0.95, r * 0.6, 0, Math.PI, 0);
    x.fill();
    x.fillStyle = '#2a2d3a';
    x.fillRect(-r * 0.95, -r * 0.78, r * 1.9, r * 0.22);
    x.fillStyle = '#fff';
    x.font = '700 9px system-ui';
    x.textAlign = 'center';
    x.fillText('💰', dir * r * 1.2, r * 0.4);
    x.restore();
  }
  function keyShape(cx, cy, c, s) {
    x.save();
    x.translate(cx, cy);
    x.rotate(-0.6);
    x.scale(s, s);
    x.strokeStyle = '#5c3500';
    x.lineWidth = 5;
    x.lineCap = 'round';
    x.beginPath();
    x.arc(-6, 0, 5, 0, 7);
    x.moveTo(-1, 0);
    x.lineTo(11, 0);
    x.moveTo(7, 0);
    x.lineTo(7, 4.5);
    x.moveTo(11, 0);
    x.lineTo(11, 5);
    x.stroke();
    x.strokeStyle = c;
    x.lineWidth = 3;
    x.beginPath();
    x.arc(-6, 0, 5, 0, 7);
    x.moveTo(-1, 0);
    x.lineTo(11, 0);
    x.moveTo(7, 0);
    x.lineTo(7, 4.5);
    x.moveTo(11, 0);
    x.lineTo(11, 5);
    x.stroke();
    x.strokeStyle = '#ffffffaa';
    x.lineWidth = 1;
    x.beginPath();
    x.arc(-6, 0, 5, Math.PI * 1.1, Math.PI * 1.6);
    x.stroke();
    x.restore();
  }
  function keys() {
    for (const k of w.K) {
      if (k.got) continue;
      const y = k.y + Math.sin(tt * 3 + k.x) * 2.5,
        c = KC[k.c] || '#ffd24a',
        gl = x.createRadialGradient(k.x, y, 2, k.x, y, 20);
      gl.addColorStop(0, c + 'aa');
      gl.addColorStop(1, c + '00');
      x.fillStyle = gl;
      x.beginPath();
      x.arc(k.x, y, 20, 0, 7);
      x.fill();
      keyShape(k.x, y, c, 1.05);
    }
    let n = 0;
    for (const c in w.keys) {
      x.fillStyle = '#0b1f2acc';
      x.beginPath();
      x.arc(34 + n * 26, 34, 11, 0, 7);
      x.fill();
      keyShape(34 + n * 26, 34, KC[c], 0.7);
      n++;
    }
  }
  const HF = [];
  let HB = -9,
    HBA = 0,
    HFL = -9,
    HFC = '';
  function hotFx() {
    for (const q of w.P) {
      if (q.inS || q.y < 434 || q.x < 58 || q.x > 242) continue;
      q.inS = 1;
      const k = q.k;
      if (k == 'h') {
        HB = tt;
        HBA = 0.16;
        HFL = tt;
        HFC = '#ffd24a';
        for (let n = 0; n < 46; n++) {
          const a = -Math.PI * Math.random(),
            v = 90 + Math.random() * 230;
          HF.push({
            x: q.x,
            y: 448,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v - 60,
            t: 0,
            l: 1.1 + Math.random() * 0.7,
            c: ['#ffd24a', '#fff3b0', '#ff6fa8', '#ffffff'][n % 4],
            s: n % 3 == 0 ? '♥' : n % 3 == 1 ? '★' : '',
            r: 2 + Math.random() * 3
          });
        }
        try {
          SFX('win');
        } catch (_) {}
      } else if (k == 'w' || k == 's') {
        if (Math.random() < 0.5) {
          HB = Math.max(HB, tt - 0.05);
          HBA = Math.max(HBA * (HB == tt ? 1 : 0.6), 0.03);
        }
        for (let n = 0; n < 3; n++) {
          const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
          HF.push({
            x: q.x,
            y: 446,
            vx: Math.cos(a) * 90,
            vy: Math.sin(a) * (70 + Math.random() * 80),
            t: 0,
            l: 0.5,
            c: k == 'w' ? '#9fd8ff' : '#9aa3ab',
            r: 1.6 + Math.random() * 1.6
          });
        }
      } else if (k == 'l') {
        HB = tt;
        HBA = Math.max(0.06, HBA);
        HFL = tt;
        HFC = '#ff5a1f';
        for (let n = 0; n < 10; n++) {
          HF.push({
            x: q.x + (Math.random() - 0.5) * 30,
            y: 450,
            vx: (Math.random() - 0.5) * 50,
            vy: -80 - Math.random() * 120,
            t: 0,
            l: 0.9,
            c: ['#ff3b1f', '#ff9a1f', '#ffd24a'][n % 3],
            r: 3 + Math.random() * 4,
            fl: 1
          });
        }
      } else if (k == 'g') {
        HB = tt;
        HBA = 0.12;
        HFL = tt;
        HFC = '#3fcf5a';
        for (let n = 0; n < 22; n++) {
          const a = Math.random() * Math.PI * 2;
          HF.push({
            x: q.x,
            y: 450,
            vx: Math.cos(a) * 120,
            vy: Math.sin(a) * 90 - 50,
            t: 0,
            l: 0.9,
            c: '#5fe07a',
            r: 4 + Math.random() * 5,
            puff: 1
          });
        }
        HF.push({ x: 150, y: 440, vx: 0, vy: -55, t: 0, l: 1.6, c: '#fff', s: '🦹', r: 22 });
      } else if (k == 'b') {
        HB = tt;
        HBA = 0.08;
      }
    }
  }
  function hotDraw(ph) {
    if (!ph) {
      const d = tt - HB;
      if (d < 1.2) {
        const k = HBA * Math.abs(Math.sin(d * 16)) * Math.exp(-d * 4.5);
        if (k > 0.002) {
          const sx = 40,
            sy = 428,
            sw = 220,
            sh = 92,
            dw = sw * (1 + k),
            dh = sh * (1 + k * 1.4);
          x.drawImage(bg, sx * dpr, sy * dpr, sw * dpr, sh * dpr, 150 - dw / 2, 520 - dh, dw, dh);
        }
      }
      return;
    }
    const f = tt - HFL;
    if (f < 0.9) {
      x.save();
      x.globalAlpha = (1 - f / 0.9) * 0.55;
      const gr = x.createRadialGradient(150, 470, 6, 150, 470, 130);
      gr.addColorStop(0, HFC);
      gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gr;
      x.fillRect(20, 380, 260, 140);
      x.restore();
    }
    for (let n = HF.length - 1; n >= 0; n--) {
      const p = HF[n];
      p.t += 1 / 60;
      if (p.t > p.l) {
        HF.splice(n, 1);
        continue;
      }
      p.x += p.vx / 60;
      p.y += p.vy / 60;
      if (!p.fl && !p.puff) p.vy += (p.s ? 260 : 420) / 60;
      if (p.puff) {
        p.vx *= 0.95;
        p.vy *= 0.95;
      }
      const a = 1 - p.t / p.l;
      x.save();
      x.globalAlpha = Math.max(0, a);
      if (p.s) {
        x.font = `${p.s == '🦹' ? p.r : 10 + p.r * 2}px serif`;
        x.textAlign = 'center';
        x.fillStyle = p.c;
        x.fillText(p.s, p.x, p.y);
      } else {
        x.fillStyle = p.c;
        if (p.fl) {
          x.shadowColor = '#ff7a1f';
          x.shadowBlur = 10;
        }
        x.beginPath();
        x.arc(p.x, p.y, p.r * (p.puff ? 1 + p.t : p.fl ? a : 1), 0, 7);
        x.fill();
      }
      x.restore();
    }
  }
  function draw() {
    x.drawImage(bg, 0, 0, W, H);
    hotFx();
    hotDraw(0);
    liquid('w');
    liquid('l');
    liquid('s');
    w.pins.forEach(s => {
      if (s.on || s.out < 1) rod(s);
    });
    w.pins.forEach(s => {
      if (s.on && s.hl && tt < s.hl) {
        const a = 0.5 + 0.5 * Math.sin(tt * 10),
          hx = s.hx != null ? s.hx : (s.a[0] + s.a[2]) / 2,
          hy = s.hy != null ? s.hy : (s.a[1] + s.a[3]) / 2;
        x.save();
        x.strokeStyle = '#ffe08a';
        x.shadowColor = '#ffd24a';
        x.shadowBlur = 14;
        x.lineWidth = 5;
        x.globalAlpha = 0.45 + 0.55 * a;
        x.beginPath();
        x.arc(hx, hy, 20 + 7 * a, 0, 7);
        x.stroke();
        x.restore();
      }
    });
    keys();
    for (const q of w.P) {
      const cl = q.inS && (q.k == 'h' || q.k == 'b' || q.k == 'g' || q.k == 'e');
      if (cl) {
        if (q.y > 470) continue;
        x.save();
        x.beginPath();
        x.rect(0, 0, W, 446);
        x.clip();
        x.globalAlpha = Math.max(0, Math.min(1, (470 - q.y) / 26));
      }
      if (q.k == 'g') grinch(q);
      else if (q.k == 'b') gift(q);
      else if (q.k == 'e') eggP(q);
      else if (q.k == 'h') hero(q);
      if (cl) x.restore();
    }
    hotDraw(1);
    w.fx = w.fx.filter(f => f.t < 1);
    w.fx.forEach(f => {
      f.t += f.big ? 0.03 : 0.06;
      x.globalAlpha = Math.max(0, 1 - f.t);
      x.fillStyle = f.c;
      x.beginPath();
      x.arc(f.x, f.y - f.t * (f.big ? 24 : 16), (f.big ? 8 : 3) + f.t * (f.big ? 16 : 7), 0, 7);
      x.fill();
      if (f.big) {
        x.font = '16px serif';
        x.textAlign = 'center';
        x.fillText('💥', f.x, f.y - f.t * 10);
      }
      x.globalAlpha = 1;
    });
    x.fillStyle = 'rgba(255,255,255,.75)';
    for (const s of snow) {
      s.y += s.v;
      s.x += Math.sin(tt * 1.5 + s.p) * 0.3;
      if (s.y > H) {
        s.y = -4;
        s.x = Math.random() * W;
      }
      x.beginPath();
      x.arc(s.x, s.y, s.r, 0, 7);
      x.fill();
    }
    if (banner) {
      const a = Math.min(1, (tt - bannerT) * 4);
      x.save();
      x.globalAlpha = a;
      x.fillStyle = banner.ok ? '#1f8a4cdd' : banner.info ? '#14324fe6' : '#a30d26e6';
      x.shadowColor = '#0008';
      x.shadowBlur = 14;
      x.beginPath();
      x.roundRect ? x.roundRect(26, 180, 248, 84, 20) : x.rect(26, 180, 248, 84);
      x.fill();
      x.shadowColor = 'transparent';
      x.fillStyle = '#fff';
      x.textAlign = 'center';
      x.font = '800 21px system-ui';
      x.fillText(banner.t, 150, 214);
      x.font = '13px system-ui';
      x.fillText(banner.s, 150, 238);
      x.restore();
      if (banner.info && tt - bannerT > 1.6) banner = null;
    }
  }
  function check() {
    if (!w.st || (banner && !banner.info)) return;
    bannerT = tt;
    if (w.st == 'win') {
      confetti();
      SFX('ok');
      banner = {
        ok: 1,
        t: L + 1 < NL ? 'Bien joué !' : 'Célestine est sauvée !',
        s: L + 1 < NL ? 'Niveau suivant…' : '🎅 Direction la hotte'
      };
      if (!pr) {
        const sd = (S.days[day] = S.days[day] || {});
        sd.pinL = Math.max(sd.pinL || 0, Math.min(NL - 1, L + 1));
        save();
      }
      setTimeout(() => {
        if (over || id != RUN) return;
        if (L + 1 < NL) load(L + 1);
        else end(true);
      }, 1400);
      return;
    }
    SFX(w.st == 'burn' ? 'burn' : 'bad');
    const why = {
      burn: "Célestine s'est brûlée dans la lave 🔥",
      grinch: 'le cambrioleur a attrapé Célestine 🦹',
      sack: 'la lave a fait brûler la hotte 🔥',
      grinchsack: "le cambrioleur s'est caché dans la hotte 🦹",
      lost: 'Célestine est tombée hors du niveau',
      giveup: 'Célestine a abandonné ce niveau 💀'
    }[w.st];
    const last = loseTry();
    banner = { ok: 0, t: 'Oh non !', s: why.replace(/^./, c => c.toUpperCase()) + (pr || last ? '' : ' · −1 essai') };
    setTimeout(() => {
      if (over || id != RUN) return;
      if (last) end(false, why);
      else load(L);
    }, 1700);
  }
  $('#pgu').onclick = () => {
    if (intro || over || !w || w.st) return;
    w.st = 'giveup';
    try {
      SFX('bad');
    } catch (_) {}
  };
  $('#pigo').onclick = () => {
    intro = false;
    $('#pintro').hidden = true;
    banner = null;
    last = performance.now();
  };
  cv.addEventListener('pointerdown', e => {
    if (intro) return;
    if (over || !w || w.st) return;
    if (banner && banner.info) banner = null;
    if (PIN.LV[L].tilt) tryLock();
    const mx = (e.offsetX * W) / cv.clientWidth,
      my = (e.offsetY * H) / cv.clientHeight;
    let best = null,
      bd = 24;
    w.pins.forEach(s => {
      if (!s.on) return;
      const [x1, y1, x2, y2] = s.a,
        dx = x2 - x1,
        dy = y2 - y1,
        l = dx * dx + dy * dy;
      let t = ((mx - x1) * dx + (my - y1) * dy) / l;
      t = Math.max(0, Math.min(1, t));
      const hd = Math.hypot(mx - (s.hx || -99), my - (s.hy || -99)),
        d = hd < 20 ? hd - 30 : Math.hypot(mx - x1 - t * dx, my - y1 - t * dy);
      if (d < bd) {
        bd = d;
        best = s;
      }
    });
    if (best && pinLocked(w, best)) {
      best.shk = tt;
      SFX('bad');
      toast(`🔒 Il faut d'abord ramasser la clé ${KN[best.key] || ''} avec Célestine`);
      try {
        navigator.vibrate && navigator.vibrate([30, 40, 30]);
      } catch (_) {}
      return;
    }
    if (best) {
      best.on = false;
      SFX('pin');
      e.preventDefault();
      try {
        navigator.vibrate && navigator.vibrate(15);
      } catch (_) {}
    }
  });
  addEventListener('deviceorientation', e => {
    if (id != RUN || over) return;
    if (e.gamma != null) {
      sens = e.gamma;
      sensB = e.beta || 0;
      if (!sensOn) {
        sensOn = true;
        const tp = $('#tperm');
        if (tp) tp.hidden = true;
        const tx = $('#tgt');
        if (tx) tx.innerHTML = '📱 Capteur actif<br>Penche le téléphone';
      }
    }
  });
  const hold = (b, v) => {
    const on = e => {
        e.preventDefault();
        btn = v;
        b.classList.add('on');
      },
      off = () => {
        if (btn == v) btn = 0;
        b.classList.remove('on');
      };
    b.addEventListener('pointerdown', on);
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => b.addEventListener(t, off));
  };
  $('#tbl').addEventListener('pointerdown', tryLock);
  $('#tbr').addEventListener('pointerdown', tryLock);
  hold($('#tbl'), -30);
  hold($('#tbr'), 30);
  addEventListener('keydown', e => {
    if (id != RUN || over || !PIN.LV[L].tilt) return;
    if (e.key == 'ArrowLeft') {
      btn = -30;
      e.preventDefault();
    }
    if (e.key == 'ArrowRight') {
      btn = 30;
      e.preventDefault();
    }
  });
  addEventListener('keyup', e => {
    if (e.key == 'ArrowLeft' || e.key == 'ArrowRight') btn = 0;
  });
  $('#tperm').onclick = () => {
    tryLock();
    try {
      DeviceOrientationEvent.requestPermission()
        .then(r => {
          if (r == 'granted') {
            tiltOK = window.__tiltOK = true;
            $('#tperm').hidden = true;
            toast('Inclinaison activée 📱');
          } else toast('Inclinaison refusée : utilise les flèches ◀ ▶');
        })
        .catch(() => toast('Inclinaison indisponible : utilise les flèches ◀ ▶'));
    } catch (_) {
      toast('Utilise les flèches ◀ ▶');
    }
  };
  let last = performance.now();
  function loop(now) {
    if (id != RUN || over) return;
    const dt = Math.min(1 / 30, (now - last) / 1000);
    last = now;
    tt += dt;
    if (intro) {
      draw();
      raf = requestAnimationFrame(loop);
      return;
    }
    const paused =
      !!PIN.LV[L].tilt &&
      land() &&
      !document.documentElement.classList.contains('rotL') &&
      !document.documentElement.classList.contains('rotR');
    {
      const pe = $('#prot');
      if (pe && pe.hidden == paused) pe.hidden = !paused;
    }
    if (paused) {
      draw();
      raf = requestAnimationFrame(loop);
      return;
    }
    if (PIN.LV[L].tilt) {
      const tg = tiltTarget();
      w.tilt += (tg - w.tilt) * Math.min(1, dt * 7);
      const ta = Math.round(w.tilt);
      if (ta !== lastTa) {
        lastTa = ta;
        const a = $('#tga');
        if (a) a.style.transform = `rotate(${-ta}deg)`;
      }
    } else w.tilt = 0;
    if (!banner || banner.ok || banner.info) for (let k = 0; k < 3; k++) pinStep(w, dt / 3);
    w.pins.forEach(s => {
      if (!s.on && s.out < 1) s.out = Math.min(1, s.out + dt * 3);
    });
    {
      const eg = w.P.find(q => q.k == 'e');
      if (eg && !w.eg && eg.y > 440 && eg.x > 66 && eg.x < 234) {
        w.eg = 1;
        EGG(22);
      }
    }
    {
      const nk = Object.keys(w.keys).length;
      if (nk > (w._nk || 0)) {
        w._nk = nk;
        SFX('key');
      }
    }
    draw();
    check();
    raf = requestAnimationFrame(loop);
  }
  G = {
    save: () => ({}),
    pins: {
      get w() {
        return w;
      },
      get L() {
        return L;
      },
      load
    }
  };
  load(L);
  if (L > 0 && !pr) toast(`Tu reprends au niveau ${L + 1} 💪`);
  raf = requestAnimationFrame(loop);
  G.hint = () => {
    if (id != RUN || !w || w.st) return 'Attends le niveau suivant';
    const HO = [
        [2, 0, 3, 1],
        [1, 3, 2, 0],
        [0, 2, 1, 4, 3],
        [1, 0, 2, 3, 4],
        [1, 2, 0, 3],
        [0],
        [0, 1, 2, 3, 4],
        [0, 1, 2],
        [1, 2, 0],
        [0, 2, 3, 4, 1, 5]
      ],
      ord = (HO[L] || []).concat(w.pins.map((_, k) => k));
    const k = ord.find(q => w.pins[q] && w.pins[q].on);
    if (k == null) return "Plus d'épingle à tirer : laisse faire la gravité !";
    const pn = w.pins[k];
    pn.hl = tt + 5;
    if (pinLocked(w, pn)) toast("🔑 Cette épingle a un cadenas : récupère d'abord la clé de la même couleur");
    else if (PIN.LV[L].tilt) toast("💡 Tire l'épingle qui brille… et penche le téléphone au bon moment");
    else toast("💡 Tire l'épingle qui brille");
    return true;
  };
};
