/* ---------- Niveau secret : la pluie d'étoiles ---------- */
const SEC_T = 25;
function secState() {
  if (!S.secret || typeof S.secret != 'object') S.secret = {};
  return S.secret;
}
function eggSecret() {
  if (eggs().length < 24) return eggBasket();
  const st = secState();
  if (st.started && !st.done) {
    st.done = true;
    save();
  }
  if (st.done)
    return popup(
      `<h2>🌟 Niveau secret</h2><p style="font-size:3rem;margin:.1em 0">🏆</p><p>Tu as déjà fait ta tentative unique.</p><p style="font-size:1.6rem;margin:.2em 0"><b>${st.score || 0}</b> points</p><p class="muted">Ce score est inscrit pour toujours au registre du commissariat ✨</p><button onclick="closePop()">Fermer</button>`
    );
  secOpen();
}
function secOpen() {
  closePop();
  let ov = document.getElementById('sec');
  if (ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'sec';
  ov.innerHTML = `<canvas id="secc"></canvas><div class="seccard" id="secin"><div class="sectt">✨ La pluie d'étoiles ✨</div><p class="secsub">Le niveau secret du commissariat</p>
 <p>Déplace le sac à scellés avec ton doigt et attrape un maximum de points en <b>${SEC_T} secondes</b>.</p>
 <div class="seclg"><span><i class="lg st"></i>+10</span><span><i class="lg gf"></i>+20</span><span><i class="lg rb"></i>+40</span><span><i class="lg lgx2">×2</i>points ×2</span><span><i class="lg lgmg">🧲</i>aimant</span><span><i class="lg bb"></i>−40</span><span><i class="lg cl"></i>−15</span><span><i class="lg ic"></i>glace</span></div>
 <p class="secone">⚠️ Une seule tentative. Après, plus rien !</p><button id="secgo">Je suis prête 🕵️‍♀️</button><button class="alt" id="secno">Plus tard</button></div>`;
  document.body.appendChild(ov);
  secRun(ov);
}
function secRun(ov) {
  const cv = ov.querySelector('#secc'),
    x = cv.getContext('2d');
  let W = 0,
    H = 0,
    DPR = 1,
    K = 1;
  const rs = () => {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth;
    H = innerHeight;
    cv.width = W * DPR;
    cv.height = H * DPR;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    x.setTransform(DPR, 0, 0, DPR, 0, 0);
    K = Math.min(1.25, Math.max(0.75, Math.min(W / 420, H / 820)));
  };
  rs();
  addEventListener('resize', rs);
  const R = Math.random,
    TAU = Math.PI * 2;
  const BG = Array.from({ length: 120 }, () => ({ x: R(), y: R() * 0.75, r: R() * 1.6 + 0.3, p: R() * TAU, s: 0.5 + R() * 2 })),
    SN = Array.from({ length: 70 }, () => ({ x: R(), y: R(), r: R() * 2.2 + 0.6, v: 0.02 + R() * 0.05, d: R() * TAU }));
  let st = 'intro',
    t0 = 0,
    el = 0,
    score = 0,
    mult = 1,
    mT = 0,
    mgT = 0,
    icT = 0,
    stun = 0,
    combo = 0,
    best = 0,
    shake = 0,
    flash = 0,
    flashC = '#fff',
    hx = 0.5,
    tx = 0.5,
    items = [],
    parts = [],
    pops = [],
    spawnAcc = 0,
    last = performance.now(),
    cnt = { st: 0, gf: 0, rb: 0, bb: 0 },
    ended = false,
    saveT = 0;
  const groundH = () => H * 0.13,
    hutW = () => 118 * K,
    hutH = () => 78 * K,
    hutY = () => H - groundH() - hutH() * 0.15;
  // --- audio
  const AC = eggAC(),
    snd = (f, d, tp, v, sl) => {
      if (!AC || S.sound === false) return;
      const t = AC.currentTime,
        o = AC.createOscillator(),
        g = AC.createGain();
      o.type = tp || 'sine';
      o.frequency.setValueAtTime(f, t);
      if (sl) o.frequency.exponentialRampToValueAtTime(sl, t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v || 0.08, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(AC.destination);
      o.start(t);
      o.stop(t + d + 0.02);
    };
  const boom = () => {
    if (!AC || S.sound === false) return;
    const t = AC.currentTime,
      n = AC.createBufferSource(),
      b = AC.createBuffer(1, AC.sampleRate * 0.5, AC.sampleRate),
      d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (R() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
    n.buffer = b;
    const f = AC.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 900;
    const g = AC.createGain();
    g.gain.value = 0.35;
    n.connect(f).connect(g).connect(AC.destination);
    n.start(t);
    snd(110, 0.4, 'sine', 0.2, 40);
  };
  // --- items
  const TY = {
    st: { w: 40, pts: 10, good: 1 },
    gf: { w: 15, pts: 20, good: 1 },
    rb: { w: 5, pts: 40, good: 1 },
    x2: { w: 4.5, good: 1, pw: 1 },
    mg: { w: 3.5, good: 1, pw: 1 },
    bb: { w: 15, pts: -40 },
    cl: { w: 11, pts: -15 },
    ic: { w: 5 }
  };
  const GC = ['#ff3b6b', '#2ed47a', '#3d8bff', '#ffb020', '#b25bff', '#19d3e0'];
  const pick = () => {
    const w = { ...Object.fromEntries(Object.entries(TY).map(([k, v]) => [k, v.w])) };
    w.bb += el * 0.45;
    w.cl += el * 0.15;
    if (mT > 0) w.x2 = 0;
    if (mgT > 0) w.mg = 0;
    const tot = Object.values(w).reduce((a, b) => a + b, 0);
    let r = R() * tot;
    for (const k in w) {
      r -= w[k];
      if (r <= 0) return k;
    }
    return 'st';
  };
  const spawn = () => {
    const k = pick(),
      sz = (k == 'rb' ? 30 : k == 'bb' ? 27 : k == 'st' ? 22 : k == 'gf' ? 24 : k == 'cl' ? 20 : k == 'ic' ? 21 : 25) * K,
      sp = (240 + el * 13) * K * (0.85 + R() * 0.35);
    items.push({
      k,
      x: sz + R() * (W - 2 * sz),
      y: -sz * 2,
      vx: (R() - 0.5) * (k == 'rb' ? 120 : k == 'bb' ? 50 : 30) * K,
      vy: sp,
      sz,
      a: R() * TAU,
      va: (R() - 0.5) * 4,
      c: GC[Math.floor(R() * GC.length)],
      ph: R() * TAU
    });
  };
  const burst = (px, py, cols, n, sp) => {
    for (let i = 0; i < n; i++) {
      const a = R() * TAU,
        v = (sp || 220) * (0.3 + R()) * K;
      parts.push({
        x: px,
        y: py,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v - 80 * K,
        l: 0,
        L: 0.5 + R() * 0.6,
        c: cols[i % cols.length],
        r: (2 + R() * 3.5) * K,
        st: R() < 0.4
      });
    }
  };
  const pop = (px, py, txt, c, big) => pops.push({ x: px, y: py, txt, c, l: 0, big });
  // --- drawing helpers
  const star = (cx, cy, r, a, fill, glow) => {
    x.save();
    x.translate(cx, cy);
    x.rotate(a);
    if (glow) {
      x.shadowColor = glow;
      x.shadowBlur = 18 * K;
    }
    x.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r,
        an = (i * Math.PI) / 5 - Math.PI / 2;
      x.lineTo(Math.cos(an) * rr, Math.sin(an) * rr);
    }
    x.closePath();
    x.fillStyle = fill;
    x.fill();
    x.restore();
  };
  const rr = (px, py, w, h, r) => {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  };
  const drawItem = (o, now) => {
    const s = o.sz;
    x.save();
    x.translate(o.x, o.y);
    if (o.k == 'st') {
      const g = x.createRadialGradient(-s * 0.2, -s * 0.3, 1, 0, 0, s);
      g.addColorStop(0, '#fffbd0');
      g.addColorStop(0.5, '#ffd84a');
      g.addColorStop(1, '#ff9f1a');
      star(0, 0, s, o.a, g, '#ffd84a');
    } else if (o.k == 'rb') {
      const h = (now / 6 + o.ph * 60) % 360,
        g = x.createLinearGradient(-s, -s, s, s);
      for (let i = 0; i < 6; i++) g.addColorStop(i / 5, `hsl(${(h + i * 60) % 360},95%,62%)`);
      star(0, 0, s, o.a, g, `hsl(${h},100%,70%)`);
      star(0, 0, s * 0.38, -o.a * 2, '#fff');
      for (let i = 0; i < 3; i++) {
        const an = now / 300 + i * 2.1;
        star(Math.cos(an) * s * 1.25, Math.sin(an) * s * 1.25, s * 0.18, 0, '#fff', '#fff');
      }
    } else if (o.k == 'gf') {
      x.rotate(Math.sin(now / 250 + o.ph) * 0.18);
      x.shadowColor = '#0006';
      x.shadowBlur = 8 * K;
      const g = x.createLinearGradient(0, -s, 0, s);
      g.addColorStop(0, o.c);
      g.addColorStop(1, '#0003');
      rr(-s * 0.8, -s * 0.6, s * 1.6, s * 1.3, 4 * K);
      x.fillStyle = o.c;
      x.fill();
      x.fillStyle = g;
      x.fill();
      x.shadowBlur = 0;
      x.fillStyle = '#fff3c4';
      x.fillRect(-s * 0.13, -s * 0.6, s * 0.26, s * 1.3);
      x.fillRect(-s * 0.8, -s * 0.08, s * 1.6, s * 0.22);
      x.fillStyle = '#ffe27a';
      x.beginPath();
      x.ellipse(-s * 0.3, -s * 0.72, s * 0.32, s * 0.16, -0.5, 0, TAU);
      x.ellipse(s * 0.3, -s * 0.72, s * 0.32, s * 0.16, 0.5, 0, TAU);
      x.fill();
    } else if (o.k == 'x2') {
      const p = 1 + Math.sin(now / 120) * 0.07;
      x.scale(p, p);
      const g = x.createRadialGradient(-s * 0.3, -s * 0.3, 1, 0, 0, s);
      g.addColorStop(0, '#fff');
      g.addColorStop(0.25, '#ff9be0');
      g.addColorStop(1, '#ff2f92');
      x.shadowColor = '#ff5fb8';
      x.shadowBlur = 22 * K;
      x.fillStyle = g;
      x.beginPath();
      x.arc(0, 0, s, 0, TAU);
      x.fill();
      x.shadowBlur = 0;
      x.strokeStyle = '#fff9';
      x.lineWidth = 2.5 * K;
      x.stroke();
      x.fillStyle = '#fff';
      x.font = `900 ${s * 0.95}px system-ui,sans-serif`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText('×2', 0, 2 * K);
    } else if (o.k == 'mg') {
      const g = x.createRadialGradient(-s * 0.3, -s * 0.3, 1, 0, 0, s);
      g.addColorStop(0, '#fff');
      g.addColorStop(0.3, '#c9a6ff');
      g.addColorStop(1, '#7b3dff');
      x.shadowColor = '#a77bff';
      x.shadowBlur = 20 * K;
      x.fillStyle = g;
      x.beginPath();
      x.arc(0, 0, s, 0, TAU);
      x.fill();
      x.shadowBlur = 0;
      x.font = `${s * 1.05}px serif`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.rotate(Math.sin(now / 200) * 0.3);
      x.fillText('🧲', 0, 2 * K);
    } else if (o.k == 'bb') {
      x.rotate(o.a * 0.3);
      x.shadowColor = '#ff3d00';
      x.shadowBlur = 14 * K;
      const g = x.createRadialGradient(-s * 0.35, -s * 0.35, 1, 0, 0, s);
      g.addColorStop(0, '#6b6b7a');
      g.addColorStop(0.5, '#26232e');
      g.addColorStop(1, '#0b0a10');
      x.fillStyle = g;
      x.beginPath();
      x.arc(0, s * 0.1, s * 0.85, 0, TAU);
      x.fill();
      x.shadowBlur = 0;
      x.fillStyle = '#3b3846';
      x.fillRect(-s * 0.22, -s * 0.88, s * 0.44, s * 0.3);
      x.strokeStyle = '#c9a36b';
      x.lineWidth = 3 * K;
      x.beginPath();
      x.moveTo(0, -s * 0.88);
      x.quadraticCurveTo(s * 0.35, -s * 1.25, s * 0.5, -s * 1.05);
      x.stroke();
      const fl = 0.6 + R() * 0.6;
      star(s * 0.52, -s * 1.08, s * 0.28 * fl, R() * TAU, '#ffe14a', '#ff7a00');
      x.fillStyle = '#ffffff55';
      x.beginPath();
      x.ellipse(-s * 0.35, -s * 0.2, s * 0.18, s * 0.12, -0.6, 0, TAU);
      x.fill();
    } else if (o.k == 'cl') {
      x.rotate(o.a * 0.5);
      x.shadowColor = '#ff4a1a';
      x.shadowBlur = 10 * K;
      x.fillStyle = '#1d1a1f';
      x.beginPath();
      for (let i = 0; i < 7; i++) {
        const an = (i / 7) * TAU,
          r2 = s * (0.75 + ((i * 37) % 5) / 14);
        x.lineTo(Math.cos(an) * r2, Math.sin(an) * r2);
      }
      x.closePath();
      x.fill();
      x.shadowBlur = 0;
      x.fillStyle = '#ff6a2a';
      x.globalAlpha = 0.55 + Math.sin(now / 90 + o.ph) * 0.35;
      x.beginPath();
      x.arc(s * 0.15, s * 0.1, s * 0.16, 0, TAU);
      x.arc(-s * 0.3, -s * 0.15, s * 0.1, 0, TAU);
      x.fill();
    } else if (o.k == 'ic') {
      x.rotate(o.a * 0.4);
      x.shadowColor = '#8fe9ff';
      x.shadowBlur = 16 * K;
      const g = x.createLinearGradient(-s, -s, s, s);
      g.addColorStop(0, '#eafcffee');
      g.addColorStop(1, '#5cc8ffbb');
      rr(-s * 0.8, -s * 0.8, s * 1.6, s * 1.6, 6 * K);
      x.fillStyle = g;
      x.fill();
      x.shadowBlur = 0;
      x.strokeStyle = '#ffffffcc';
      x.lineWidth = 2 * K;
      x.stroke();
      x.strokeStyle = '#ffffff99';
      x.beginPath();
      x.moveTo(-s * 0.45, -s * 0.45);
      x.lineTo(-s * 0.05, -s * 0.45);
      x.moveTo(-s * 0.45, -s * 0.45);
      x.lineTo(-s * 0.45, -s * 0.05);
      x.stroke();
    }
    x.restore();
  };
  const drawBG = now => {
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#14062e');
    g.addColorStop(0.35, '#3a1466');
    g.addColorStop(0.65, '#8a2c86');
    g.addColorStop(0.88, '#ff7a8a');
    g.addColorStop(1, '#ffc38a');
    x.fillStyle = g;
    x.fillRect(0, 0, W, H);
    x.save();
    x.globalCompositeOperation = 'lighter';
    for (let b = 0; b < 3; b++) {
      x.beginPath();
      const yb = H * (0.16 + b * 0.09),
        amp = H * 0.035;
      x.moveTo(0, yb);
      for (let i = 0; i <= 24; i++) {
        const px = (i / 24) * W;
        x.lineTo(px, yb + Math.sin(i * 0.6 + now / 1400 + b * 2) * amp);
      }
      for (let i = 24; i >= 0; i--) {
        const px = (i / 24) * W;
        x.lineTo(px, yb + H * 0.07 + Math.sin(i * 0.5 + now / 1700 + b) * amp);
      }
      x.closePath();
      const a = x.createLinearGradient(0, yb - amp, 0, yb + H * 0.1);
      a.addColorStop(0, 'rgba(0,0,0,0)');
      a.addColorStop(0.5, ['rgba(60,255,170,.16)', 'rgba(80,200,255,.13)', 'rgba(255,90,220,.12)'][b]);
      a.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = a;
      x.fill();
    }
    x.restore();
    BG.forEach(s => {
      x.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin((now / 1000) * s.s + s.p));
      x.fillStyle = '#fff';
      x.beginPath();
      x.arc(s.x * W, s.y * H, s.r, 0, TAU);
      x.fill();
    });
    x.globalAlpha = 1;
    const mx = W * 0.82,
      my = H * 0.11,
      mr = 30 * K;
    x.save();
    x.shadowColor = '#fff6c8';
    x.shadowBlur = 40 * K;
    x.fillStyle = '#fff6d8';
    x.beginPath();
    x.arc(mx, my, mr, 0, TAU);
    x.fill();
    x.restore();
    x.fillStyle = '#3a1466';
    x.beginPath();
    x.arc(mx + mr * 0.42, my - mr * 0.2, mr * 0.9, 0, TAU);
    x.fill();
    const hill = (yb, col, f, a) => {
      x.fillStyle = col;
      x.beginPath();
      x.moveTo(0, H);
      for (let i = 0; i <= 30; i++) {
        const px = (i / 30) * W;
        x.lineTo(px, yb + Math.sin(i * f + a) * H * 0.03 + Math.sin(i * f * 2.3 + a) * H * 0.012);
      }
      x.lineTo(W, H);
      x.fill();
    };
    hill(H * 0.8, '#5b3a8f', 0.45, 1);
    hill(H * 0.84, '#8e66c4', 0.38, 3);
    for (let i = 0; i < 9; i++) {
      const tx2 = (((i * 137) % 100) / 100) * W,
        ty = H * 0.84 + Math.sin(i * 1.7) * H * 0.02,
        ts = (16 + ((i * 7) % 10)) * K;
      x.fillStyle = '#2f6b4f';
      for (let j = 0; j < 3; j++) {
        x.beginPath();
        x.moveTo(tx2, ty - ts * (1.6 - j * 0.45));
        x.lineTo(tx2 - ts * (0.5 + j * 0.18), ty - ts * (0.7 - j * 0.45));
        x.lineTo(tx2 + ts * (0.5 + j * 0.18), ty - ts * (0.7 - j * 0.45));
        x.fill();
      }
      x.fillStyle = '#fff';
      x.beginPath();
      x.arc(tx2, ty - ts * 1.6, 2 * K, 0, TAU);
      x.fill();
    }
    const gy = H - groundH(),
      gg = x.createLinearGradient(0, gy, 0, H);
    gg.addColorStop(0, '#ffffff');
    gg.addColorStop(1, '#cfe3ff');
    x.fillStyle = gg;
    x.beginPath();
    x.moveTo(0, gy + 8 * K);
    for (let i = 0; i <= 20; i++) x.lineTo((i / 20) * W, gy + Math.sin(i * 1.3) * 5 * K);
    x.lineTo(W, H);
    x.lineTo(0, H);
    x.fill();
    SN.forEach(f => {
      f.y += f.v * 0.016;
      f.x += Math.sin(now / 1500 + f.d) * 0.0006;
      if (f.y > 1) f.y = 0;
      x.globalAlpha = 0.75;
      x.fillStyle = '#fff';
      x.beginPath();
      x.arc(f.x * W, f.y * H, f.r * K, 0, TAU);
      x.fill();
    });
    x.globalAlpha = 1;
  };
  const drawHut = now => {
    const w = hutW(),
      h = hutH(),
      cx = hx * W + (stun > 0 ? Math.sin(now / 25) * 5 * K : 0),
      by = hutY() + h,
      top = by - h * 1.15,
      sw = Math.sin(now / 260) * 0.04;
    x.save();
    if (mT > 0) {
      x.save();
      x.globalCompositeOperation = 'lighter';
      const gr = x.createRadialGradient(cx, by - h * 0.6, 4, cx, by - h * 0.6, w * 1.15);
      gr.addColorStop(0, 'rgba(255,200,60,.55)');
      gr.addColorStop(1, 'rgba(255,120,0,0)');
      x.fillStyle = gr;
      x.beginPath();
      x.arc(cx, by - h * 0.6, w * 1.15, 0, TAU);
      x.fill();
      x.restore();
    }
    if (mgT > 0) {
      x.strokeStyle = `rgba(180,130,255,${0.4 + Math.sin(now / 90) * 0.25})`;
      x.lineWidth = 3 * K;
      for (let i = 0; i < 2; i++) {
        x.beginPath();
        x.arc(cx, by - h * 0.6, w * (0.8 + ((now / 600 + i * 0.5) % 1) * 0.9), 0, TAU);
        x.stroke();
      }
    }
    x.fillStyle = '#0003';
    x.beginPath();
    x.ellipse(cx, by + 3 * K, w * 0.6, 9 * K, 0, 0, TAU);
    x.fill();
    x.translate(cx, by);
    x.rotate(sw);
    const neck = -h * 0.78,
      ow = w * 0.46,
      oy = -h * 1.02;
    // gifts peeking out (behind the front)
    [
      [-0.24, '#2ed47a', -0.25],
      [0.02, '#3d8bff', 0.1],
      [0.22, '#ffb020', 0.3]
    ].forEach(([dx, c, r], i) => {
      x.save();
      x.translate(dx * w, oy - h * 0.1 - (i == 1 ? h * 0.08 : 0));
      x.rotate(r + Math.sin(now / 400 + i) * 0.05);
      x.fillStyle = c;
      rr(-w * 0.11, -h * 0.13, w * 0.22, h * 0.24, 3 * K);
      x.fill();
      x.fillStyle = '#fff3c4';
      x.fillRect(-w * 0.025, -h * 0.13, w * 0.05, h * 0.24);
      x.restore();
    });
    x.save();
    x.translate(w * 0.33, oy - h * 0.18);
    x.rotate(0.35);
    x.lineWidth = 5 * K;
    x.lineCap = 'round';
    x.strokeStyle = '#fff';
    x.beginPath();
    x.moveTo(0, h * 0.25);
    x.lineTo(0, 0);
    x.arc(-w * 0.05, 0, w * 0.05, 0, Math.PI, true);
    x.stroke();
    x.strokeStyle = '#e0283f';
    x.setLineDash([4 * K, 4 * K]);
    x.stroke();
    x.restore();
    // inside of the opening
    x.fillStyle = '#4a0716';
    x.beginPath();
    x.ellipse(0, oy, ow, h * 0.13, 0, 0, TAU);
    x.fill();
    // sack body
    const g = x.createRadialGradient(-w * 0.18, -h * 0.55, 4, 0, -h * 0.4, w * 0.75);
    g.addColorStop(0, icT > 0 ? '#cdeeff' : '#ff5b6e');
    g.addColorStop(0.55, icT > 0 ? '#7fb8d9' : '#d61f3c');
    g.addColorStop(1, icT > 0 ? '#3d7fa8' : '#7d0a22');
    x.fillStyle = g;
    x.beginPath();
    x.moveTo(-ow, oy);
    x.bezierCurveTo(-ow * 0.7, neck, -w * 0.32, neck + h * 0.05, -w * 0.5, -h * 0.5);
    x.bezierCurveTo(-w * 0.66, -h * 0.22, -w * 0.58, 0, -w * 0.3, 0);
    x.lineTo(w * 0.3, 0);
    x.bezierCurveTo(w * 0.58, 0, w * 0.66, -h * 0.22, w * 0.5, -h * 0.5);
    x.bezierCurveTo(w * 0.32, neck + h * 0.05, ow * 0.7, neck, ow, oy);
    x.closePath();
    x.fill();
    // folds + sheen
    x.strokeStyle = '#00000030';
    x.lineWidth = 2 * K;
    [
      [-0.18, -0.62, -0.28, -0.12],
      [0.15, -0.64, 0.24, -0.1],
      [0, -0.7, -0.02, -0.2]
    ].forEach(([a, b2, c, d]) => {
      x.beginPath();
      x.moveTo(a * w, b2 * h);
      x.quadraticCurveTo(((a + c) / 2) * w + 6 * K, ((b2 + d) / 2) * h, c * w, d * h);
      x.stroke();
    });
    x.fillStyle = '#ffffff38';
    x.beginPath();
    x.ellipse(-w * 0.27, -h * 0.42, w * 0.07, h * 0.2, -0.25, 0, TAU);
    x.fill();
    // golden star emblem
    star(w * 0.06, -h * 0.33, h * 0.17, 0.1, '#ffd84a', '#ffcf4a');
    star(w * 0.06, -h * 0.33, h * 0.07, 0.1, '#fff6c8');
    // rope at the neck
    x.strokeStyle = '#e8b23c';
    x.lineWidth = 6 * K;
    x.beginPath();
    x.moveTo(-w * 0.3, neck + h * 0.02);
    x.quadraticCurveTo(0, neck + h * 0.1, w * 0.3, neck + h * 0.02);
    x.stroke();
    x.strokeStyle = '#a8741c';
    x.lineWidth = 1.5 * K;
    x.setLineDash([3 * K, 4 * K]);
    x.stroke();
    x.setLineDash([]);
    x.strokeStyle = '#e8b23c';
    x.lineWidth = 4 * K;
    x.lineCap = 'round';
    x.beginPath();
    x.moveTo(w * 0.12, neck + h * 0.08);
    x.quadraticCurveTo(w * 0.2, neck + h * 0.3 + Math.sin(now / 300) * 3 * K, w * 0.14, neck + h * 0.42);
    x.moveTo(w * 0.15, neck + h * 0.08);
    x.quadraticCurveTo(w * 0.3, neck + h * 0.25, w * 0.3, neck + h * 0.36 + Math.cos(now / 300) * 3 * K);
    x.stroke();
    x.fillStyle = '#ffd84a';
    x.beginPath();
    x.arc(w * 0.14, neck + h * 0.44, 3.5 * K, 0, TAU);
    x.arc(w * 0.3, neck + h * 0.38, 3.5 * K, 0, TAU);
    x.fill();
    // white fur rim
    x.fillStyle = '#fff';
    for (let i = 0; i <= 12; i++) {
      const an = Math.PI + (i / 12) * Math.PI,
        px = Math.cos(an) * ow,
        py = oy + Math.sin(an) * h * 0.13 * (i % 2 ? 0.9 : 1);
      x.beginPath();
      x.arc(px, py, h * 0.09, 0, TAU);
      x.fill();
    }
    for (let i = 0; i <= 12; i++) {
      const an = (i / 12) * Math.PI,
        px = Math.cos(an) * ow,
        py = oy + Math.sin(an) * h * 0.13;
      x.beginPath();
      x.arc(px, py, h * 0.095, 0, TAU);
      x.fill();
    }
    x.fillStyle = '#e6eefc';
    for (let i = 0; i <= 12; i += 2) {
      const an = (i / 12) * Math.PI;
      x.beginPath();
      x.arc(Math.cos(an) * ow, oy + Math.sin(an) * h * 0.13 + h * 0.04, h * 0.05, 0, TAU);
      x.fill();
    }
    if (icT > 0) {
      x.fillStyle = '#e9fbff';
      for (let i = 0; i < 5; i++) {
        x.beginPath();
        x.moveTo(-w * 0.4 + i * w * 0.2, oy + h * 0.12);
        x.lineTo(-w * 0.37 + i * w * 0.2, oy + h * 0.28);
        x.lineTo(-w * 0.34 + i * w * 0.2, oy + h * 0.12);
        x.fill();
      }
    }
    x.restore();
    if (stun > 0) {
      for (let i = 0; i < 3; i++) {
        const an = now / 150 + i * 2.1;
        star(cx + Math.cos(an) * w * 0.45, top - 8 * K + Math.sin(an) * 8 * K, 6 * K, 0, '#ffe14a');
      }
    }
  };
  const smoke = [];
  const drawHUD = now => {
    const left = Math.max(0, SEC_T - el),
      pad = 14 * K;
    x.save();
    x.fillStyle = '#ffffff';
    x.shadowColor = '#0008';
    x.shadowBlur = 8;
    x.font = `900 ${34 * K}px system-ui,sans-serif`;
    x.textAlign = 'left';
    x.textBaseline = 'top';
    x.fillText(score, pad, pad + env());
    x.font = `700 ${13 * K}px system-ui,sans-serif`;
    x.fillStyle = '#ffe9a8';
    x.fillText('POINTS', pad + 2, pad + env() + 36 * K);
    x.textAlign = 'right';
    x.font = `900 ${30 * K}px system-ui,sans-serif`;
    x.fillStyle = left < 6 ? `hsl(${(now / 3) % 360},100%,70%)` : '#fff';
    x.fillText(left.toFixed(1) + 's', W - pad, pad + env());
    x.restore();
    const bw = W - 2 * pad,
      by = pad + env() + 56 * K;
    x.fillStyle = '#ffffff30';
    rr(pad, by, bw, 9 * K, 5 * K);
    x.fill();
    const gb = x.createLinearGradient(pad, 0, pad + bw, 0);
    ['#ff3b6b', '#ffb020', '#ffe14a', '#2ed47a', '#3d8bff', '#b25bff'].forEach((c, i) => gb.addColorStop(i / 5, c));
    x.fillStyle = gb;
    rr(pad, by, Math.max(9 * K, (bw * left) / SEC_T), 9 * K, 5 * K);
    x.fill();
    let bx = pad,
      yy = by + 18 * K;
    x.font = `800 ${14 * K}px system-ui,sans-serif`;
    x.textBaseline = 'middle';
    x.textAlign = 'left';
    const badge = (txt, c, fr) => {
      const tw = x.measureText(txt).width + 18 * K;
      x.fillStyle = c;
      rr(bx, yy, tw, 24 * K, 12 * K);
      x.fill();
      if (fr != null) {
        x.fillStyle = '#fff6';
        rr(bx, yy + 20 * K, tw * fr, 4 * K, 2 * K);
        x.fill();
      }
      x.fillStyle = '#fff';
      x.fillText(txt, bx + 9 * K, yy + 12 * K);
      bx += tw + 6 * K;
    };
    if (mT > 0) badge('×2 POINTS', '#ff2f92', mT / 5);
    if (mgT > 0) badge('🧲 AIMANT', '#7b3dff', mgT / 4);
    if (icT > 0) badge('🧊 GELÉE', '#2a9fd6', icT / 2.5);
    if (combo >= 5) badge(`🔥 COMBO ${combo}`, '#ff7a00');
  };
  const envV = (() => {
      const d = document.createElement('div');
      d.style.cssText = 'position:fixed;top:env(safe-area-inset-top,0px);height:0';
      document.body.appendChild(d);
      const v = d.getBoundingClientRect().top;
      d.remove();
      return v;
    })(),
    env = () => envV;
  const catchIt = (o, now) => {
    const cx = o.x,
      cy = o.y,
      T = TY[o.k];
    if (o.k == 'x2') {
      mT = 5;
      mult = 2;
      snd(660, 0.12, 'triangle', 0.1, 1320);
      snd(990, 0.25, 'sine', 0.08, 1980);
      pop(cx, cy, '×2 !', '#ff5fb8', 1);
      burst(cx, cy, ['#ff5fb8', '#fff', '#ffd84a'], 26);
      combo++;
      return;
    }
    if (o.k == 'mg') {
      mgT = 4;
      snd(440, 0.3, 'sawtooth', 0.05, 880);
      pop(cx, cy, 'AIMANT !', '#c9a6ff', 1);
      burst(cx, cy, ['#a77bff', '#fff'], 22);
      combo++;
      return;
    }
    if (o.k == 'ic') {
      icT = 2.5;
      snd(1800, 0.25, 'sine', 0.05, 900);
      pop(cx, cy, 'Brrr !', '#bff1ff', 1);
      burst(cx, cy, ['#bff1ff', '#fff', '#5cc8ff'], 18);
      combo = 0;
      return;
    }
    if (o.k == 'bb') {
      score = Math.max(0, score + T.pts);
      stun = 0.9;
      shake = 0.45;
      flash = 0.35;
      flashC = '#ff3d00';
      boom();
      burst(cx, cy, ['#ff3d00', '#ffb020', '#ffe14a', '#444'], 44, 380);
      pop(cx, cy, '−40', '#ff6a3d', 1);
      combo = 0;
      cnt.bb++;
      try {
        navigator.vibrate && navigator.vibrate(180);
      } catch (_) {}
      return;
    }
    if (o.k == 'cl') {
      score = Math.max(0, score + T.pts);
      snd(140, 0.2, 'square', 0.06, 70);
      burst(cx, cy, ['#333', '#ff6a2a'], 14);
      pop(cx, cy, '−15', '#ff8a5c');
      combo = 0;
      return;
    }
    combo++;
    best = Math.max(best, combo);
    const bonus = Math.floor(combo / 5) * 2,
      g = (T.pts + bonus) * mult;
    score += g;
    cnt[o.k] = (cnt[o.k] || 0) + 1;
    snd(o.k == 'rb' ? 880 : 520 + Math.min(combo, 20) * 30, o.k == 'rb' ? 0.35 : 0.12, 'triangle', 0.08, o.k == 'rb' ? 1760 : null);
    if (o.k == 'rb') snd(1320, 0.3, 'sine', 0.05, 2640);
    burst(
      cx,
      cy,
      o.k == 'rb'
        ? ['#ff3b6b', '#ffb020', '#ffe14a', '#2ed47a', '#3d8bff', '#b25bff']
        : o.k == 'gf'
          ? [o.c, '#fff3c4', '#ffe27a']
          : ['#ffe14a', '#fff', '#ffb020'],
      o.k == 'rb' ? 34 : 16
    );
    pop(cx, cy, '+' + g, o.k == 'rb' ? '#fff' : mult > 1 ? '#ff9be0' : '#ffe9a8', o.k == 'rb');
  };
  const finish = () => {
    if (ended) return;
    ended = true;
    st = 'end';
    if ((cnt.rb || 0) >= 3) ACH('secRB');
    if (!cnt.bb) ACH('secSafe');
    const s2 = secState();
    s2.done = true;
    s2.score = score;
    s2.best = best;
    s2.when = Date.now();
    save();
    const gain = Math.round(score / 10);
    if (gain > 0) award(gain, 'Niveau secret');
    setTimeout(() => {
      try {
        confetti();
      } catch (_) {}
      snd(523, 0.2, 'triangle', 0.08);
      setTimeout(() => snd(659, 0.2, 'triangle', 0.08), 150);
      setTimeout(() => snd(784, 0.2, 'triangle', 0.08), 300);
      setTimeout(() => snd(1046, 0.5, 'triangle', 0.09), 450);
      const c = document.createElement('div');
      c.className = 'seccard secend';
      c.innerHTML = `<div class="sectt">Temps écoulé !</div><p class="secsub">Ta tentative unique est terminée</p><div class="secscore">${score}</div><p style="margin:.1em 0 .6em">points</p>
   <div class="secstats"><span>⭐ ${cnt.st || 0}</span><span>🎁 ${cnt.gf || 0}</span><span>🌈 ${cnt.rb || 0}</span><span>💥 ${cnt.bb || 0}</span><span>🔥 ${best}</span></div>
   <p class="muted" style="margin:.8em 0">Ce score est inscrit pour toujours au registre du commissariat ✨${gain > 0 ? `<br>+${gain} ⭐ pour toi !` : ''}</p><button id="secok">Fermer</button>`;
      ov.appendChild(c);
      c.querySelector('#secok').onclick = close;
    }, 1300);
  };
  const close = () => {
    st = 'closed';
    removeEventListener('resize', rs);
    removeEventListener('keydown', kd);
    removeEventListener('keyup', ku);
    ov.remove();
    try {
      hdr();
    } catch (_) {}
  };
  // --- input
  const setT = e => {
    tx = Math.min(0.95, Math.max(0.05, e.clientX / W));
  };
  let keys = {};
  cv.addEventListener('pointerdown', e => {
    if (st == 'play') {
      e.preventDefault();
      setT(e);
    }
  });
  cv.addEventListener('pointermove', e => {
    if (st == 'play' && (e.pointerType != 'mouse' || e.buttons || true)) setT(e);
  });
  const kd = e => {
      keys[e.key] = 1;
    },
    ku = e => {
      keys[e.key] = 0;
    };
  addEventListener('keydown', kd);
  addEventListener('keyup', ku);
  ov.querySelector('#secno').onclick = close;
  ov.querySelector('#secgo').onclick = () => {
    ov.querySelector('#secin').remove();
    const s2 = secState();
    s2.started = true;
    s2.score = 0;
    save();
    st = 'count';
    t0 = performance.now();
    try {
      AC && AC.resume();
    } catch (_) {}
  };
  // --- loop
  const loop = now => {
    if (st == 'closed') return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    x.save();
    if (shake > 0) {
      shake -= dt;
      x.translate(((R() - 0.5) * 16 * K * shake) / 0.45, ((R() - 0.5) * 16 * K * shake) / 0.45);
    }
    drawBG(now);
    if (st == 'count') {
      const c = 3 - Math.floor((now - t0) / 800);
      if (c <= 0) {
        st = 'play';
        t0 = now;
        snd(1046, 0.3, 'triangle', 0.1);
      } else {
        if (c != loop.lc) {
          loop.lc = c;
          snd(523, 0.15, 'triangle', 0.08);
        }
        const ph = ((now - t0) % 800) / 800;
        x.save();
        x.globalAlpha = 1 - ph * 0.6;
        x.fillStyle = '#fff';
        x.shadowColor = '#ff5fb8';
        x.shadowBlur = 30;
        x.font = `900 ${(110 + ph * 60) * K}px system-ui,sans-serif`;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(c, W / 2, H * 0.42);
        x.restore();
      }
    }
    if (st == 'play') {
      el = (now - t0) / 1000;
      if (el >= SEC_T) {
        el = SEC_T;
        finish();
      }
      spawnAcc += dt * (3 + el * 0.17);
      while (spawnAcc >= 1) {
        spawnAcc--;
        spawn();
      }
      if (mT > 0) {
        mT -= dt;
        if (mT <= 0) {
          mT = 0;
          mult = 1;
        }
      }
      if (mgT > 0) mgT = Math.max(0, mgT - dt);
      if (icT > 0) icT = Math.max(0, icT - dt);
      if (stun > 0) stun = Math.max(0, stun - dt);
      if (keys.ArrowLeft || keys.a || keys.q) tx = Math.max(0.05, tx - dt * 1.4);
      if (keys.ArrowRight || keys.d) tx = Math.min(0.95, tx + dt * 1.4);
      if (stun <= 0) {
        const rate = icT > 0 ? 3 : 16;
        hx += (tx - hx) * Math.min(1, dt * rate);
      }
      saveT += dt;
      if (saveT > 1) {
        saveT = 0;
        secState().score = score;
        save();
      }
    }
    if (st == 'play' || st == 'end') {
      const w = hutW(),
        h = hutH(),
        cx = hx * W,
        top = hutY() - h * 0.15,
        bot = hutY() + h;
      items.forEach(o => {
        if (mgT > 0 && TY[o.k].good) {
          o.vx += (cx - o.x) * dt * 6;
          o.vx *= 0.94;
        }
        o.x += o.vx * dt;
        o.y += o.vy * dt;
        o.a += o.va * dt;
        if (o.x < o.sz || o.x > W - o.sz) {
          o.vx *= -1;
          o.x = Math.min(W - o.sz, Math.max(o.sz, o.x));
        }
        if (st == 'play' && !o.dead && o.y + o.sz * 0.6 > top && o.y - o.sz * 0.6 < bot && Math.abs(o.x - cx) < w * 0.55 + o.sz * 0.4) {
          o.dead = 1;
          catchIt(o, now);
        }
        if (o.y > H + 60) o.dead = 1;
      });
      items = items.filter(o => !o.dead);
      items.forEach(o => drawItem(o, now));
    }
    smoke.forEach(s => {
      s.l += dt;
      s.y -= 24 * K * dt;
      s.x += 10 * K * dt;
      s.r += 7 * K * dt;
    });
    for (let i = smoke.length - 1; i >= 0; i--) if (smoke[i].l > 1.6) smoke.splice(i, 1);
    smoke.forEach(s => {
      x.fillStyle = `rgba(255,255,255,${0.35 * (1 - s.l / 1.6)})`;
      x.beginPath();
      x.arc(s.x, s.y, s.r, 0, TAU);
      x.fill();
    });
    drawHut(now);
    parts.forEach(p => {
      p.l += dt;
      p.vy += 500 * K * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const a = 1 - p.l / p.L;
      if (a <= 0) return;
      x.globalAlpha = a;
      if (p.st) star(p.x, p.y, p.r * 1.6, p.l * 6, p.c);
      else {
        x.fillStyle = p.c;
        x.beginPath();
        x.arc(p.x, p.y, p.r, 0, TAU);
        x.fill();
      }
    });
    x.globalAlpha = 1;
    parts = parts.filter(p => p.l < p.L);
    pops.forEach(p => {
      p.l += dt;
      const a = Math.max(0, 1 - p.l / 1.1);
      x.save();
      x.globalAlpha = a;
      x.fillStyle = p.c;
      x.strokeStyle = '#0007';
      x.lineWidth = 4 * K;
      x.font = `900 ${(p.big ? 30 : 22) * K * (1 + Math.max(0, 0.25 - p.l) * 1.6)}px system-ui,sans-serif`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      const yy = p.y - p.l * 70 * K;
      x.strokeText(p.txt, p.x, yy);
      x.fillText(p.txt, p.x, yy);
      x.restore();
    });
    pops = pops.filter(p => p.l < 1.1);
    if (st == 'play' || st == 'end') drawHUD(now);
    if (flash > 0) {
      flash -= dt;
      x.fillStyle = flashC;
      x.globalAlpha = Math.max(0, flash) * 1.2;
      x.fillRect(-20, -20, W + 40, H + 40);
      x.globalAlpha = 1;
    }
    if (st == 'end' && !loop.tu) {
      loop.tu = now;
    }
    if (st == 'end' && now - loop.tu < 1300) {
      x.save();
      x.fillStyle = '#fff';
      x.shadowColor = '#ff2f92';
      x.shadowBlur = 30;
      x.font = `900 ${46 * K}px system-ui,sans-serif`;
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.globalAlpha = Math.min(1, (1300 - (now - loop.tu)) / 400);
      x.fillText('TEMPS !', W / 2, H * 0.42);
      x.restore();
    }
    x.restore();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
function secReset() {
  S.secret = {};
  save();
  toast('🌟 Niveau secret réinitialisé');
  admin();
}
