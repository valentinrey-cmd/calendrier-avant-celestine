/* ================= 🧊 Le toit du fichier mystère : Célestine et Valentin en vraies figurines 3D ================= */
// Les figurines ont été faites avec Meshy à partir de leurs photos, avec un squelette et des animations
// (fichiers 3d/toit-celestine.glb et 3d/toit-valentin.glb, une animation par geste : voir GESTES3D).
// Elles sont dessinées par un petit moteur 3D (3d/moteur-3d.min.js = three.js), chargé seulement à l'ouverture du toit.
// Chaque personnage est rendu à part, dans un petit cadre autour de lui, avec exactement la caméra du jeu
// (même position, même direction, même focale), puis collé dans l'image du jeu à sa place dans l'ordre de profondeur.
// Tant que la 3D n'est pas prête (ou si elle ne peut pas se charger), le jeu garde ses personnages dessinés.
//
// Le jeu (mysLancer, js/musiques-jeux.js) appelle :
//   FIG3D.charge()                         au début ;
//   FIG3D.pret(qui)                        vrai quand la figurine 'celestine' ou 'valentin' est prête ;
//   FIG3D.dessine(c, qui, P, cam, g)       pour la dessiner, et récupérer la position de sa main droite (pour le fichier) ;
//      P = { x, y, z, phi, taille, pench, objet } : sa place dans le monde (y = ses pieds), son orientation, sa taille,
//          et le fichier qu'il tient (voir objet) ;
//      cam = { x, y, z, yaw, p, f, cx, cy, W, H, dpr } : la caméra du jeu ;
//      g = { a: nom de l'animation, k: avancement de 0 à 1 (geste réglé par le jeu) ou absent (en boucle), v: vitesse }.
const FIG3D = (() => {
  const FIC = { celestine: '3d/toit-celestine.glb', valentin: '3d/toit-valentin.glb' },
    BUF = 1024, // taille maximale (en pixels) du cadre de rendu d'un personnage
    HAUT = 1.62; // hauteur d'un personnage du jeu (taille 1), en mètres
  let etat = 'rien',
    T,
    ren,
    scene,
    camera;
  const fig = {};
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
        cv.width = cv.height = BUF;
        ren = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: false });
        ren.setPixelRatio(1);
        ren.setSize(BUF, BUF, false);
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
      .then(
        () => {
          etat = 'pret';
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
  const pret = qui => etat == 'pret' && !!fig[qui];

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

  // le personnage, rendu dans un cadre autour de lui puis collé dans l'image du jeu.
  // Monde du jeu (x à droite, y en haut, z) → monde 3D (x, y, -z).
  const tmp = { v: null };
  const dessine = (c, qui, P, cam, g) => {
    const F = fig[qui];
    if (!F) return null;
    anime(F, g || {});
    const o = F.o,
      s = P.taille || 1,
      e3 = (HAUT * s) / F.h;
    o.visible = true;
    o.position.set(P.x, P.y - F.y0 * e3, -P.z);
    o.rotation.set(0, Math.PI - P.phi, 0);
    o.scale.setScalar(e3);
    if (P.pench) o.rotateX(P.pench);
    o.updateMatrixWorld(true);
    F.e3n = F.e3n || e3;
    objet(F, P.objet, e3);
    // la caméra du jeu : droite (cos, 0, sin), haut (sin·sp, cp, -cos·sp), elle regarde vers (sin·cp, -sp, -cos·cp)
    const co = Math.cos(cam.yaw),
      si = Math.sin(cam.yaw),
      cp = Math.cos(cam.p),
      sp = Math.sin(cam.p);
    camera.matrixWorld.set(co, si * sp, -si * cp, cam.x, 0, cp, sp, cam.y, si, -co * sp, co * cp, -cam.z, 0, 0, 0, 1);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    // le cadre à l'écran : autour du milieu du corps, 1,15 m de rayon
    const dx = P.x - cam.x,
      dz = P.z - cam.z,
      dy = P.y + 0.85 * s - cam.y,
      zr = dx * si + dz * co,
      d = zr * cp - dy * sp;
    if (d < 0.35) return null;
    const xr = dx * co - dz * si,
      u = dy * cp + zr * sp,
      ex = cam.cx + (xr * cam.f) / d,
      ey = cam.cy - (u * cam.f) / d,
      r = (1.15 * s * cam.f) / d;
    let x0 = Math.max(0, ex - r),
      y0 = Math.max(0, ey - r),
      x1 = Math.min(cam.W, ex + r),
      y1 = Math.min(cam.H, ey + r);
    if (x1 - x0 < 2 || y1 - y0 < 2) return null;
    const w = x1 - x0,
      h = y1 - y0,
      k = Math.min(cam.dpr, BUF / w, BUF / h),
      pw = Math.max(1, Math.round(w * k)),
      ph = Math.max(1, Math.round(h * k));
    // projection pour ce cadre seulement (même focale et même centre d'image que le jeu)
    const n = 0.05,
      fa = 200,
      e = camera.projectionMatrix.elements;
    e.fill(0);
    e[0] = (2 * cam.f) / w;
    e[8] = -((2 * (cam.cx - x0)) / w - 1);
    e[5] = (2 * cam.f) / h;
    e[9] = (2 * (cam.cy - y0)) / h - 1;
    e[10] = -(fa + n) / (fa - n);
    e[11] = -1;
    e[14] = (-2 * fa * n) / (fa - n);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    for (const q in fig) if (fig[q] !== F) ((fig[q].o.visible = false), fig[q].obj && (fig[q].obj.visible = false));
    ren.setViewport(0, 0, pw, ph);
    ren.setScissor(0, 0, pw, ph);
    ren.setScissorTest(true);
    ren.clear();
    ren.render(scene, camera);
    c.drawImage(ren.domElement, 0, BUF - ph, pw, ph, x0, y0, w, h);
    o.visible = false;
    if (F.obj) F.obj.visible = false;
    // la main droite, dans le monde du jeu
    if (!F.main) return null;
    o.updateMatrixWorld(true);
    tmp.v = tmp.v || new T.Vector3();
    F.main.getWorldPosition(tmp.v);
    return { x: tmp.v.x, y: tmp.v.y, z: -tmp.v.z };
  };
  return { charge, pret, dessine };
})();
