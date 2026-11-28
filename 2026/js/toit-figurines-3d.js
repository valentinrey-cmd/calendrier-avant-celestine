/* ================= 🧊 Le toit du fichier mystère : personnages et objets en vraie 3D ================= */
// Les figurines ont été faites avec Meshy à partir de leurs photos, avec un squelette et des animations
// (fichiers 3d/toit-celestine.glb et 3d/toit-valentin.glb, une animation par geste : voir GESTES3D).
// Les objets du toit aussi (cheminée, bonhomme de neige et ses boules, cadeaux, sapin, antenne, boîte aux lettres :
// 3d/toit-….glb, voir OBJ).
// Tout est dessiné par un petit moteur 3D (3d/moteur-3d.min.js = three.js), chargé seulement à l'ouverture du toit.
// Chaque personnage ou objet est rendu dans un petit cadre autour de lui, avec exactement la caméra du jeu (même
// position, même direction, même focale), puis collé dans l'image du jeu à sa place dans l'ordre de profondeur.
// Pour aller vite : tout ce qui est visible est rendu au début de l'image, chacun dans sa case d'une seule image de
// travail (rangée « en étagères »), AVANT d'être collé : la recopie de l'image 3D vers l'image du jeu (le plus
// coûteux) ne se fait qu'une fois par image.
// Tant que la 3D n'est pas prête (ou si elle ne peut pas se charger), le jeu garde ses dessins.
//
// Le jeu (mysLancer, js/musiques-jeux.js) appelle :
//   FIG3D.charge()                 au début ;
//   FIG3D.pret(nom)                vrai quand la figurine 'celestine' / 'valentin' (ou l'objet 'cheminee'…) est prête ;
//   FIG3D.rendreTout(liste, cam)   au début de chaque image : calcule tout ce qui est dans la liste ; renvoie, pour
//                                  chaque personnage, la position de sa main droite (pour le fichier) ;
//   FIG3D.calcule(cle)             vrai si cet élément a été calculé pour cette image ;
//   FIG3D.colle(c, cle)            pour le coller dans l'image du jeu, à son tour dans l'ordre de profondeur.
//   Dans la liste :
//      un personnage : { cle, qui, P, g } avec P = { x, y, z, phi, taille, pench, objet } (y = ses pieds) et
//          g = { a: nom de l'animation, k: avancement de 0 à 1 (geste réglé par le jeu) ou absent (en boucle), v: vitesse } ;
//      un objet : { cle, mod, x, y, z, dim: [largeur, hauteur, profondeur] (en m ; null = proportionnel à la hauteur),
//          rot (tour sur lui-même), pen: [inclinaison x, z] (quand il vacille), q: [x, y, z, w] (une boule qui roule),
//          centre: vrai si (x, y, z) est son centre (une boule) et pas le milieu de sa base } ;
//      cam = { x, y, z, yaw, p, f, cx, cy, W, H, dpr } : la caméra du jeu.
const FIG3D = (() => {
  const FIC = { celestine: '3d/toit-celestine.glb', valentin: '3d/toit-valentin.glb' },
    OBJ = ['cheminee', 'bonhomme', 'boule', 'tete', 'cadeaux', 'sapin', 'antenne', 'boite'], // → 3d/toit-<nom>.glb
    BUF = 640, // taille maximale (en pixels) d'un cadre de rendu
    NET = 1.5, // netteté maximale : 1,5 pixel de rendu par pixel d'écran (au-delà, ça ne se voit pas et ça coûte cher)
    PAS = 128, // l'image de travail grandit ou rétrécit par paliers (la redimensionner coûte cher)
    LARG = 2048, // largeur maximale de l'image de travail
    HAUT = 1.62; // hauteur d'un personnage du jeu (taille 1), en mètres
  let etat = 'rien',
    T,
    ren,
    cw = PAS, // taille actuelle de l'image de travail
    ch = PAS,
    nb = 0, // images depuis le dernier redimensionnement
    scene,
    camera;
  const fig = {}, // les personnages
    mods = {}, // les modèles des objets (chargés)
    inst = {}; // les objets posés sur le toit (une copie d'un modèle chacun)
  const script = src =>
    new Promise((ok, ko) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = ok;
      s.onerror = ko;
      document.head.appendChild(s);
    });
  const charge = () => {
    if (etat != 'rien') return;
    etat = 'charge';
    (window.T3 ? Promise.resolve() : script(FICHIERS.modeles3d.find(x => /moteur-3d/.test(x))))
      .then(() => {
        T = window.T3;
        const cv = document.createElement('canvas');
        cv.width = cw;
        cv.height = ch;
        // (l'image est recopiée tout de suite après chaque rendu : pas besoin de la garder en mémoire ; pas d'anticrénelage
        // matériel non plus : elle est calculée 1,5 fois plus fine que l'écran puis réduite, ce qui lisse déjà les bords)
        ren = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: false, preserveDrawingBuffer: false, premultipliedAlpha: false });
        ren.setPixelRatio(1);
        ren.setSize(cw, ch, false);
        ren.outputColorSpace = T.SRGBColorSpace;
        ren.toneMapping = T.ACESFilmicToneMapping;
        ren.toneMappingExposure = 1.05;
        ren.setClearColor(0x000000, 0);
        scene = new T.Scene();
        // la nuit : un ciel bleuté, la lune qui éclaire de haut, la lueur chaude du feu de la cheminée
        scene.add(new T.HemisphereLight(0xc6d4ff, 0x39405c, 1.35));
        const lune = new T.DirectionalLight(0xe4ecff, 1.6);
        lune.position.set(-4, 9, -6);
        scene.add(lune, lune.target);
        const face = new T.DirectionalLight(0xfff1e0, 0.9);
        face.position.set(2, 3, 8);
        scene.add(face, face.target);
        camera = new T.PerspectiveCamera(40, 1, 0.05, 200);
        camera.matrixAutoUpdate = false;
        const L = new T.GLTFLoader();
        return Promise.all(
          Object.keys(FIC).map(
            qui =>
              new Promise((ok, ko) =>
                L.load(
                  FIC[qui],
                  g => {
                    const o = g.scene;
                    o.traverse(m => m.isMesh && ((m.frustumCulled = false), m.material && (m.material.envMapIntensity = 0.6)));
                    o.visible = false;
                    scene.add(o);
                    const mix = new T.AnimationMixer(o),
                      clips = {};
                    g.animations.forEach(a => (clips[a.name] = mix.clipAction(a)));
                    let main = null,
                      avb = null;
                    o.traverse(n => (/^RightHand$/.test(n.name) && (main = n), /^RightForeArm$/.test(n.name) && (avb = n)));
                    // sa taille réelle dans le fichier, pour la mettre à la hauteur du personnage du jeu (HAUT)
                    const b = new T.Box3().setFromObject(o);
                    fig[qui] = { o, mix, clips, main, avb, cur: null, t: performance.now(), h: b.max.y - b.min.y || 1, y0: b.min.y };
                    ok();
                  },
                  undefined,
                  ko
                )
              )
          )
        );
      })
      .then(() => {
        // les personnages sont prêts ; les objets arrivent ensuite, chacun dès qu'il est chargé
        etat = 'pret';
        const L = new T.GLTFLoader();
        OBJ.forEach(nom =>
          L.load(
            '3d/toit-' + nom + '.glb',
            g => {
              const o = g.scene;
              o.traverse(m => m.isMesh && ((m.frustumCulled = false), m.material && (m.material.envMapIntensity = 0.6)));
              const b = new T.Box3().setFromObject(o),
                t = new T.Vector3(),
                c = new T.Vector3();
              b.getSize(t);
              b.getCenter(c);
              mods[nom] = { o, t: [t.x || 1, t.y || 1, t.z || 1], c: [c.x, c.y, c.z], y0: b.min.y };
            },
            undefined,
            () => {}
          )
        );
      })
      .then(
        () => {
          try {
            slog('🧊', 'Toit : figurines 3D prêtes');
          } catch (_) {}
        },
        e => {
          etat = 'echec';
          try {
            slog('🧊', 'Toit : figurines 3D impossibles à charger, personnages dessinés gardés');
          } catch (_) {}
        }
      );
  };
  const pret = qui => etat == 'pret' && !!(fig[qui] || mods[qui]);

  // choisir l'animation : en boucle (fondu de 0,25 s entre deux gestes), ou réglée image par image par le jeu (g.k)
  const anime = (F, g) => {
    const A = F.clips[g.a] || F.clips.repos;
    if (!A) return;
    const now = performance.now(),
      dt = Math.min(0.1, (now - F.t) / 1000);
    F.t = now;
    if (F.cur !== A) {
      A.reset();
      A.enabled = true;
      A.setEffectiveWeight(1);
      A.play();
      if (F.cur) A.crossFadeFrom(F.cur, 0.25, false);
      F.cur = A;
    }
    A.setEffectiveTimeScale(g.v || 1);
    if (g.k != null) {
      A.paused = true;
      A.time = Math.max(0, Math.min(0.999, g.k)) * A.getClip().duration;
      F.mix.update(0);
      F.mix.update(dt); // les fondus continuent
      A.time = Math.max(0, Math.min(0.999, g.k)) * A.getClip().duration;
      F.mix.update(0);
    } else {
      A.paused = false;
      F.mix.update(dt);
    }
  };

  // Le fichier tenu en main : un vrai objet 3D (paquet cadeau, tirage photo ou document), avec l'image du fichier du jeu
  // sur ses faces. Il est serré dans la moufle droite : il pend dans le prolongement de l'avant-bras, son bord du haut
  // dans la main, sa face tournée en biais vers l'arrière (on la voit de dos, caméra à la Fortnite). ob = { cle, faire() → { cv, w, h, ep }, vit : image qui bouge }.
  const v1 = {},
    PRISE = 1, // le fichier, à la même taille que dans le jeu
    DANS = 0.03; // ce qui rentre dans la moufle (en m)
  const objet = (F, ob, e3) => {
    if (!ob || !F.main || !F.avb) return F.obj && (F.obj.visible = false);
    const now = performance.now();
    if (!F.obj || F.objCle !== ob.cle || (ob.vit && now - F.objT > 350)) {
      const t = ob.faire(),
        tex = new T.CanvasTexture(t.cv);
      tex.colorSpace = T.SRGBColorSpace;
      tex.anisotropy = 4;
      const face = new T.MeshStandardMaterial({ map: tex, roughness: 0.5, metalness: 0 }),
        bord = new T.MeshStandardMaterial({ color: 0xeee9df, roughness: 0.75 }),
        dos = t.ep > 0.006 ? face : new T.MeshStandardMaterial({ color: 0xf6f3ec, roughness: 0.8 });
      if (F.obj) {
        scene.remove(F.obj);
        F.obj.geometry.dispose();
        new Set(F.obj.material).forEach(m => (m.map && m.map.dispose(), m.dispose()));
      }
      F.obj = new T.Mesh(new T.BoxGeometry(t.w * PRISE, t.h * PRISE, t.ep), [bord, bord, bord, bord, face, dos]);
      F.obj.frustumCulled = false;
      F.objH = t.h * PRISE;
      F.objCle = ob.cle;
      F.objT = now;
      scene.add(F.obj);
    }
    const V = v1.V || (v1.V = T.Vector3),
      pH = (v1.a = v1.a || new V()),
      pA = (v1.b = v1.b || new V()),
      dir = (v1.c = v1.c || new V()),
      n = (v1.d = v1.d || new V()),
      X = (v1.e = v1.e || new V()),
      Y = (v1.f = v1.f || new V()),
      m = (v1.m = v1.m || new T.Matrix4());
    F.main.getWorldPosition(pH);
    F.avb.getWorldPosition(pA);
    dir.subVectors(pH, pA).normalize(); // vers le bout des doigts
    n.set(-0.55, 0, -0.85).applyQuaternion(F.o.quaternion); // en biais : vers sa droite et vers l'arrière (la caméra la suit de dos)
    n.addScaledVector(dir, -n.dot(dir)).normalize(); // la face du fichier, perpendiculaire à l'avant-bras
    Y.copy(dir).negate(); // le haut de l'image vers la main
    X.crossVectors(Y, n);
    m.makeBasis(X, Y, n);
    F.obj.quaternion.setFromRotationMatrix(m);
    const main = 0.075 * (e3 / (F.e3n || e3)); // longueur de la moufle (poignet → bout), à la taille du personnage
    F.obj.position.copy(pH).addScaledVector(dir, main - DANS + F.objH / 2);
    F.obj.visible = true;
  };

  // Monde du jeu (x à droite, y en haut, z) → monde 3D (x, y, -z).
  const tmp = {};
  let image = 0; // le numéro de l'image du jeu
  const cadres = {}; // cle → où le trouver dans l'image de travail (et où le coller dans l'image du jeu)
  // un objet posé sur le toit : sa copie du modèle, dans un « support » qui le place, le tourne et le met à la bonne taille
  const instance = (cle, mod) => {
    const M = mods[mod];
    if (!M) return null;
    let I = inst[cle];
    if (!I || I.mod !== mod) {
      if (I) scene.remove(I.g);
      const g = new T.Group(),
        o = M.o.clone(true);
      g.add(o);
      g.visible = false;
      scene.add(g);
      I = inst[cle] = { g, o, mod };
    }
    return I;
  };
  // placer un objet de la liste (et dire où est son centre et quel rayon il occupe, pour son cadre)
  const placer = R => {
    const M = mods[R.mod],
      I = instance(R.cle, R.mod);
    if (!M || !I) return null;
    // (une dimension absente suit les autres : même échelle partout, l'objet garde ses proportions)
    const [tx, ty, tz] = M.t,
      d = R.dim || [null, ty, null],
      e = d[1] ? d[1] / ty : d[0] ? d[0] / tx : d[2] ? d[2] / tz : 1,
      sy = d[1] ? d[1] / ty : e,
      sx = d[0] ? d[0] / tx : e,
      sz = d[2] ? d[2] / tz : e;
    // le modèle : centré sur son milieu (une boule) ou posé sur le milieu de sa base
    I.o.position.set(-M.c[0], R.centre ? -M.c[1] : -M.y0, -M.c[2]);
    I.g.scale.set(sx, sy, sz);
    I.g.position.set(R.x, R.y || 0, -R.z);
    if (R.q) I.g.quaternion.set(R.q[0], R.q[1], R.q[2], R.q[3]);
    else {
      I.g.rotation.set(0, 0, 0);
      I.g.rotateY(R.rot || 0);
      if (R.pen) (I.g.rotateX(R.pen[0]), I.g.rotateZ(R.pen[1]));
    }
    const H = ty * sy,
      ray = 0.6 * Math.hypot(tx * sx, H, tz * sz);
    return { cx: R.x, cy: (R.y || 0) + (R.centre ? 0 : H / 2), cz: R.z, r: ray, g: I.g };
  };
  // le cadre à l'écran autour d'un point (X, Y, Z) du monde du jeu, de rayon rr (en m)
  // (la caméra du jeu : droite (cos, 0, sin), haut (sin·sp, cp, -cos·sp), elle regarde vers (sin·cp, -sp, -cos·cp))
  const cadreDe = (cam, X, Y, Z, rr, net = NET) => {
    const co = Math.cos(cam.yaw),
      si = Math.sin(cam.yaw),
      cp = Math.cos(cam.p),
      sp = Math.sin(cam.p),
      dx = X - cam.x,
      dz = Z - cam.z,
      dy = Y - cam.y,
      zr = dx * si + dz * co,
      d = zr * cp - dy * sp;
    if (d < 0.35) return null;
    const xr = dx * co - dz * si,
      u = dy * cp + zr * sp,
      ex = cam.cx + (xr * cam.f) / d,
      ey = cam.cy - (u * cam.f) / d,
      r = (rr * cam.f) / d,
      x0 = Math.max(0, ex - r),
      y0 = Math.max(0, ey - r),
      x1 = Math.min(cam.W, ex + r),
      y1 = Math.min(cam.H, ey + r);
    if (x1 - x0 < 2 || y1 - y0 < 2 || r < 6) return null; // (trop petit pour se voir)
    const w = x1 - x0,
      h = y1 - y0,
      k = Math.min(cam.dpr, net, BUF / w, BUF / h);
    return { x0, y0, w, h, pw: Math.max(1, Math.round(w * k)), ph: Math.max(1, Math.round(h * k)) };
  };
  const rendreTout = (liste, cam) => {
    image++;
    const mains = {};
    if (etat != 'pret') return mains;
    // 1) placer chaque personnage et chaque objet, et calculer son cadre à l'écran
    const A = [];
    for (const R of liste) {
      if (R.qui) {
        const F = fig[R.qui];
        if (!F) continue;
        anime(F, R.g || {});
        const P = R.P,
          o = F.o,
          s = P.taille || 1,
          e3 = (HAUT * s) / F.h;
        o.position.set(P.x, P.y - F.y0 * e3, -P.z);
        o.rotation.set(0, Math.PI - P.phi, 0);
        o.scale.setScalar(e3);
        if (P.pench) o.rotateX(P.pench);
        o.updateMatrixWorld(true);
        F.e3n = F.e3n || e3;
        objet(F, P.objet, e3);
        // la main droite, dans le monde du jeu
        if (F.main) {
          tmp.v = tmp.v || new T.Vector3();
          F.main.getWorldPosition(tmp.v);
          mains[R.qui] = { x: tmp.v.x, y: tmp.v.y, z: -tmp.v.z };
        }
        const K = cadreDe(cam, P.x, P.y + 0.85 * s, P.z, 1.15 * s);
        if (K) A.push({ K, cle: R.cle, montre: [o, F.obj].filter(Boolean) });
      } else {
        const p = placer(R);
        if (!p) continue;
        const K = cadreDe(cam, p.cx, p.cy, p.cz, p.r, 1); // (les objets : à la finesse de l'écran, ça suffit)
        if (K) A.push({ K, cle: R.cle, montre: [p.g] });
      }
    }
    // 2) ranger les cadres en étagères dans l'image de travail (les plus hauts d'abord)
    A.sort((a, b) => b.K.ph - a.K.ph);
    let x = 0,
      y = 0,
      hEt = 0,
      wMax = 0;
    for (const e of A) {
      if (x + e.K.pw > LARG) ((x = 0), (y += hEt), (hEt = 0));
      e.px = x;
      e.py = y;
      x += e.K.pw;
      hEt = Math.max(hEt, e.K.ph);
      wMax = Math.max(wMax, x);
    }
    const vw = Math.max(PAS, Math.ceil(wMax / PAS) * PAS),
      vh = Math.max(PAS, Math.ceil((y + hEt) / PAS) * PAS);
    // l'image de travail juste assez grande : elle grandit tout de suite, et ne rétrécit qu'après un moment
    // (la redimensionner coûte cher)
    nb++;
    if (vw > cw || vh > ch || (nb > 90 && (vw < cw || vh < ch))) {
      cw = vw > cw || nb > 90 ? vw : cw;
      ch = vh > ch || nb > 90 ? vh : ch;
      ren.setSize(cw, ch, false);
      nb = 0;
    } else if (nb > 90) nb = 0;
    // 3) les rendre, chacun seul dans sa case
    const tous = [...Object.values(fig).flatMap(F => [F.o, F.obj]), ...Object.values(inst).map(I => I.g)].filter(Boolean),
      co = Math.cos(cam.yaw),
      si = Math.sin(cam.yaw),
      cp = Math.cos(cam.p),
      sp = Math.sin(cam.p);
    camera.matrixWorld.set(co, si * sp, -si * cp, cam.x, 0, cp, sp, cam.y, si, -co * sp, co * cp, -cam.z, 0, 0, 0, 1);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    const n = 0.05,
      fa = 200,
      el = camera.projectionMatrix.elements;
    ren.setScissorTest(true);
    for (const e of A) {
      const K = e.K;
      tous.forEach(o => (o.visible = false));
      e.montre.forEach(o => (o.visible = true));
      // projection pour ce cadre seulement (même focale et même centre d'image que le jeu)
      el.fill(0);
      el[0] = (2 * cam.f) / K.w;
      el[8] = -((2 * (cam.cx - K.x0)) / K.w - 1);
      el[5] = (2 * cam.f) / K.h;
      el[9] = (2 * (cam.cy - K.y0)) / K.h - 1;
      el[10] = -(fa + n) / (fa - n);
      el[11] = -1;
      el[14] = (-2 * fa * n) / (fa - n);
      camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      const vy = ch - e.py - K.ph; // (la 3D compte les lignes depuis le bas)
      ren.setViewport(e.px, vy, K.pw, K.ph);
      ren.setScissor(e.px, vy, K.pw, K.ph);
      ren.clear();
      ren.render(scene, camera);
      cadres[e.cle] = { sx: e.px, sy: e.py, ...K, image };
    }
    tous.forEach(o => (o.visible = false));
    return mains;
  };
  // vrai si l'élément a été calculé pour cette image
  const calcule = cle => !!(cadres[cle] && cadres[cle].image == image);
  const colle = (c, cle) => {
    const K = cadres[cle];
    if (K && K.image == image) c.drawImage(ren.domElement, K.sx, K.sy, K.pw, K.ph, K.x0, K.y0, K.w, K.h);
  };
  return { charge, pret, rendreTout, calcule, colle };
})();
