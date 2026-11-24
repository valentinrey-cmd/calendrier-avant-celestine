GAMES.jigsaw = function (p, el, win, fail) {
  const id = RUN,
    n = p.n,
    img = COUPLE;
  el.innerHTML = `<p class="center" id="jgl"></p><div class="jg" id="jg"></div><p class="center muted">Glisse les pièces dans les cadres, touche-les pour les tourner.</p>`;
  const A = $('#jg'),
    Wd = A.clientWidth,
    bs = Math.max(220, Math.min(Wd, 360, (innerHeight - 330) / 1.75)),
    cs = bs / n,
    bx = (Wd - bs) / 2,
    ty = bs + 12,
    th = Math.round(Math.min(Wd * 0.95, bs * 0.75));
  A.style.height = ty + th + 'px';
  A.innerHTML = `<div class="jgb" style="left:${bx}px;width:${bs}px;height:${bs}px;background-size:${cs}px ${cs}px"></div>`;
  const P = [],
    slot = Array(n * n).fill(-1);
  let z = 10,
    jt = 0,
    jg = 0;
  const EP = Math.floor((n * n) / 2);
  for (let i = 0; i < n * n; i++) {
    const r = Math.floor(i / n),
      c = i % n,
      d = document.createElement('div');
    d.className = 'pz';
    const o = {
      i,
      s: -1,
      x: Math.random() * (Wd - cs),
      y: ty + Math.random() * (th - cs),
      rot: p.rot ? 1 + Math.floor(Math.random() * 3) : 0,
      d
    };
    o.ang = o.rot * 90;
    d.style.cssText = `width:${cs}px;height:${cs}px;background-image:url(${img});background-size:${bs}px ${bs}px;background-position:${-c * cs}px ${-r * cs}px`;
    P.push(o);
    A.appendChild(d);
  }
  if (p.rot && P.every(o => !o.rot)) P[0].rot = 1;
  const RSj = vTake('jigsaw');
  if (RSj && RSj.p && RSj.p.length == P.length)
    RSj.p.forEach((q, i) => {
      const o = P[i];
      o.rot = q.rot;
      o.ang = q.rot * 90;
      o.s = q.s;
      if (q.s >= 0) slot[q.s] = i;
      else {
        o.x = q.fx * (Wd - cs);
        o.y = ty + q.fy * (th - cs);
      }
    });
  const put = (o, an) => {
    if (o.s >= 0) {
      o.x = bx + (o.s % n) * cs;
      o.y = Math.floor(o.s / n) * cs;
    }
    o.d.classList.toggle('in', o.s >= 0);
    o.d.style.transition = an ? 'left .18s ease,top .18s ease,transform .15s' : 'transform .15s';
    o.d.style.left = o.x + 'px';
    o.d.style.top = o.y + 'px';
    o.d.style.transform = `rotate(${o.ang}deg)`;
  };
  P.forEach(o => put(o));
  const good = () => P.filter(o => o.s == o.i && o.rot == 0).length,
    inb = () => slot.filter(x => x >= 0).length;
  const lab = () => ($('#jgl').textContent = `Pièces posées : ${inb()} / ${n * n}`);
  lab();
  const check = () => {
    lab();
    if (inb() == n * n) {
      if (good() == n * n) {
        A.classList.add('done');
        P.forEach(o => o.d.classList.add('ok'));
        return setTimeout(() => {
          if (id == RUN) win();
        }, 900);
      }
      toast('Toutes les pièces sont posées… mais certaines sont mal placées ou mal tournées !');
    }
  };
  const T = timer(RSj && RSj.left > 3 ? RSj.left : p.time, () => fail(`${good()} pièces bien placées sur ${n * n}`), id);
  G = {
    save: () => ({
      p: P.map(o => ({
        s: o.s,
        rot: o.rot,
        fx: Math.max(0, Math.min(1, o.x / Math.max(1, Wd - cs))),
        fy: Math.max(0, Math.min(1, (o.y - ty) / Math.max(1, th - cs)))
      })),
      left: Math.round(T.left())
    }),
    P,
    cs,
    slot,
    move: (k, s, rot) => {
      const o = P[k];
      if (rot != null) {
        o.rot = rot;
        o.ang = rot * 90;
      }
      drop(o, s, -1, 0, 0);
      put(o, 1);
      check();
    }
  };
  const drop = (o, s, ps, ox, oy) => {
    if (s >= 0) {
      const other = slot[s];
      if (other >= 0 && other != o.i) {
        const q = P[other];
        if (ps >= 0) {
          q.s = ps;
          slot[ps] = q.i;
        } else {
          q.s = -1;
          slot[s] = -1;
          q.x = Math.max(0, Math.min(Wd - cs, ox));
          q.y = Math.max(ty, Math.min(ty + th - cs, oy));
          if (q.y < ty) q.y = ty;
        }
        put(q, 1);
      }
      if (ps >= 0 && slot[ps] == o.i) slot[ps] = -1;
      o.s = s;
      slot[s] = o.i;
    } else {
      if (ps >= 0 && slot[ps] == o.i) slot[ps] = -1;
      o.s = -1;
    }
  };
  P.forEach(o => {
    const d = o.d;
    d.onpointerdown = e => {
      if (id != RUN || A.classList.contains('done')) return;
      e.preventDefault();
      try {
        d.setPointerCapture(e.pointerId);
      } catch (_) {}
      d.style.zIndex = ++z;
      d.style.transition = 'transform .15s';
      const sx = e.clientX,
        sy = e.clientY,
        ox = o.x,
        oy = o.y,
        ps = o.s;
      let mv = false;
      d.onpointermove = ev => {
        const dx = (ev.clientX - sx) / TKX(),
          dy = (ev.clientY - sy) / TKX();
        if (Math.abs(dx) + Math.abs(dy) > 6) mv = true;
        if (!mv) return;
        d.classList.remove('in');
        o.x = Math.max(0, Math.min(Wd - cs, ox + dx));
        o.y = Math.max(0, Math.min(ty + th - cs, oy + dy));
        d.style.left = o.x + 'px';
        d.style.top = o.y + 'px';
      };
      d.onpointerup = d.onpointercancel = () => {
        d.onpointermove = d.onpointerup = null;
        if (!mv) {
          o.rot = (o.rot + 1) % 4;
          o.ang += 90;
          put(o);
          try {
            SFX('tap');
          } catch (_) {}
          if (o.i == EP) {
            if (++jt >= 4 && !jg) {
              jg = 1;
              const sp = document.createElement('span');
              sp.className = 'jgegg';
              sp.innerHTML = eggH(24);
              d.appendChild(sp);
              setTimeout(() => sp.remove(), 1800);
              EGG(24);
            }
          } else jt = 0;
          return check();
        }
        jt = 0;
        const cx = o.x + cs / 2,
          cy = o.y + cs / 2,
          c = Math.floor((cx - bx) / cs),
          r = Math.floor(cy / cs),
          s = c >= 0 && c < n && r >= 0 && r < n && cy < bs ? r * n + c : -1;
        if (s < 0 && o.y < ty) o.y = ty;
        drop(o, s, ps, ox, oy);
        if (s < 0 && ps >= 0) {
        }
        put(o, 1);
        d.style.zIndex = o.s >= 0 ? 5 : ++z;
        check();
      };
    };
  });
  G.hint = () => {
    if (id != RUN || A.classList.contains('done')) return false;
    const c = P.filter(o => !(o.s == o.i && o.rot == 0));
    if (!c.length) return false;
    const o = c[Math.floor(Math.random() * c.length)];
    drop(o, o.i, o.s, Math.random() * (Wd - cs), ty + Math.random() * (th - cs));
    o.rot = 0;
    o.ang = Math.ceil(o.ang / 360) * 360;
    o.d.style.zIndex = 5;
    put(o, 1);
    o.d.animate([{ filter: 'brightness(1.8)' }, { filter: 'none' }], { duration: 700 });
    check();
    return true;
  };
};
