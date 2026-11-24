/* ✏️ Jour 8 : Relie les points (niveau adulte : 500+ points, on tire chaque trait au doigt) */

/* ===== 🎨 Boss d'audition · aides de dessin communes ===== */
const NBX = {
  wrap(x, t, w) {
    const ws = String(t).split(' '),
      L = [];
    let l = '';
    for (const z of ws) {
      const tt = l ? l + ' ' + z : z;
      if (x.measureText(tt).width > w && l) {
        L.push(l);
        l = z;
      } else l = tt;
    }
    if (l) L.push(l);
    return L;
  },
  bub(x, X, Y, W, t, o) {
    o = o || {};
    x.save();
    x.font = o.f || 'italic 600 12.5px system-ui';
    const L = NBX.wrap(x, t, W - 20).slice(0, 2),
      H = 14 + L.length * 16;
    x.shadowColor = '#0005';
    x.shadowBlur = 8;
    x.shadowOffsetY = 2;
    x.fillStyle = o.bg || '#fff';
    x.beginPath();
    x.roundRect(X, Y, W, H, 12);
    x.fill();
    x.shadowBlur = 0;
    x.shadowOffsetY = 0;
    if (o.tail != null) {
      x.beginPath();
      x.moveTo(o.tail - 7, Y + (o.up ? 0 : H));
      x.lineTo(o.tail - 14, Y + (o.up ? -10 : H + 10));
      x.lineTo(o.tail + 5, Y + (o.up ? 0 : H));
      x.fill();
    }
    x.fillStyle = o.c || '#2b2b33';
    x.textAlign = 'left';
    x.textBaseline = 'alphabetic';
    L.forEach((l, i) => x.fillText(l, X + 10, Y + 20 + i * 16));
    x.restore();
  },
  hearts(x, l, m, X, Y, al) {
    x.save();
    x.font = '16px system-ui';
    x.textAlign = al || 'left';
    x.textBaseline = 'alphabetic';
    x.shadowColor = '#0008';
    x.shadowBlur = 4;
    x.fillText('❤️'.repeat(Math.max(0, l)) + '🖤'.repeat(Math.max(0, m - l)), X, Y);
    x.restore();
  },
  bar(x, X, Y, W, f, c1, c2, lab, lc) {
    x.save();
    x.fillStyle = '#0006';
    x.beginPath();
    x.roundRect(X, Y, W, 14, 7);
    x.fill();
    const g = x.createLinearGradient(X, 0, X + W, 0);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    x.fillStyle = g;
    x.beginPath();
    x.roundRect(X + 2, Y + 2, Math.max(0, (W - 4) * Math.min(1, f)), 10, 5);
    x.fill();
    x.fillStyle = '#ffffff55';
    x.fillRect(X + 6, Y + 3, Math.max(0, (W - 12) * Math.min(1, f)), 2);
    if (lab) {
      x.font = '800 11.5px system-ui';
      x.textAlign = 'center';
      x.fillStyle = lc || '#fff';
      x.fillText(lab, X + W / 2, Y + 29);
    }
    x.restore();
  },
  flash(x, now, bad) {
    if (now - bad < 260) {
      x.fillStyle = `rgba(255,40,70,${0.28 * (1 - (now - bad) / 260)})`;
      x.fillRect(0, 0, 360, 540);
    }
  },
  end(x, st) {
    if (st == 'ready') bready(x);
    if (st == 'dead') {
      x.fillStyle = '#3a0612aa';
      x.fillRect(0, 0, 360, 540);
    }
  },
  vign(x, a) {
    const g = x.createRadialGradient(180, 270, 160, 180, 270, 380);
    g.addColorStop(0, '#0000');
    g.addColorStop(1, `rgba(0,0,0,${a})`);
    x.fillStyle = g;
    x.fillRect(0, 0, 360, 540);
  },
  tag(x, X, Y, t, bg, c) {
    x.save();
    x.font = '800 10.5px system-ui';
    const w = x.measureText(t).width + 16;
    x.fillStyle = bg;
    x.beginPath();
    x.roundRect(X - w / 2, Y - 11, w, 18, 9);
    x.fill();
    x.fillStyle = c || '#fff';
    x.textAlign = 'center';
    x.fillText(t, X, Y + 2);
    x.restore();
  }
};
