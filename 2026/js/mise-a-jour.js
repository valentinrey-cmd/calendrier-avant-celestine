(function () {
  try {
    if (APPV == 'dev') return;
    const loc = location.protocol == 'file:',
      base = loc ? 'https://valentinrey-cmd.github.io/calendrier-avant-celestine/2026/' : '';
    fetch(base + 'version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => {
        if (!j || !j.v || +j.v <= +APPV) return;
        let k = '';
        try {
          k = sessionStorage.getItem('vchk');
        } catch (_) {}
        if (k == j.v) return;
        try {
          sessionStorage.setItem('vchk', j.v);
        } catch (_) {}
        if (loc) {
          location.replace(base + '?app=android&v=' + j.v);
          return;
        }
        const u = new URL(location.href);
        u.searchParams.set('v', j.v);
        location.replace(u.href);
      })
      .catch(() => {});
  } catch (_) {}
})();
