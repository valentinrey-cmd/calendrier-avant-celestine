/* ================= 🎮 MENU DÉMARRER (première ouverture seulement) ================= */
function smOpen(force, at) {
  if (document.getElementById('smo')) return;
  try {
    smBk(0);
  } catch (_) {}
  try {
    const pr = document.getElementById('pre');
    if (pr) requestAnimationFrame(() => pr.remove());
  } catch (_) {}
  if (!force && window.__smSeen) return;
  window.__smSeen = 1;
  let go0 = null;
  try {
    go0 = sessionStorage.getItem('smGo');
    sessionStorage.removeItem('smGo');
  } catch (_) {}
  if (go0 && !at) at = go0;
  const sData = n => {
      if (n == SVSL) return S;
      try {
        return JSON.parse(localStorage.getItem(slotKey(n)) || '{}');
      } catch (_) {
        return {};
      }
    },
    sUsed = n => {
      const d = sData(n);
      return !!(d && (d.startDone || (d.opened || []).length));
    },
    anySave = [1, 2, 3].some(sUsed);
  const swap = (n, g) => {
    window.__noSave = 1;
    try {
      localStorage.setItem('avent_slot', String(n));
      sessionStorage.setItem('smGo', g);
    } catch (_) {}
    location.reload();
  };
  const o = document.createElement('div');
  o.id = 'smo';
  if (!document.getElementById('app') || !document.getElementById('app').innerHTML || !force) o.className = 'now';
  o.innerHTML = `<div class="sm-bg sm-pol"><i class="sm-glow"></i><div class="sm-garl"><i style="left:4.0%;top:14px;--c:#ff5a7a;animation-delay:0.00s"></i><i style="left:12.4%;top:21px;--c:#ffd34d;animation-delay:0.23s"></i><i style="left:20.8%;top:26px;--c:#7fe0ff;animation-delay:0.46s"></i><i style="left:29.2%;top:30px;--c:#9cff8a;animation-delay:0.69s"></i><i style="left:37.6%;top:33px;--c:#ff5a7a;animation-delay:0.92s"></i><i style="left:46.0%;top:34px;--c:#ffd34d;animation-delay:1.15s"></i><i style="left:54.4%;top:34px;--c:#7fe0ff;animation-delay:1.38s"></i><i style="left:62.8%;top:33px;--c:#9cff8a;animation-delay:1.61s"></i><i style="left:71.2%;top:30px;--c:#ff5a7a;animation-delay:1.84s"></i><i style="left:79.6%;top:26px;--c:#ffd34d;animation-delay:2.07s"></i><i style="left:88.0%;top:21px;--c:#7fe0ff;animation-delay:2.30s"></i><i style="left:96.4%;top:14px;--c:#9cff8a;animation-delay:2.53s"></i></div><svg class="sm-lyon" viewBox="0 0 400 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="M-5,150 C30,96 70,74 118,80 C150,84 175,104 200,128 L200,180 L-5,180Z" fill="#0b1427"/><g fill="#24345a" stroke="#ffd98a55" stroke-width=".6"><rect x="62" y="62" width="44" height="20"/><rect x="58" y="52" width="9" height="30"/><rect x="101" y="52" width="9" height="30"/><rect x="72" y="56" width="7" height="8"/><rect x="89" y="56" width="7" height="8"/><path d="M78,62 L84,44 L90,62Z"/><rect x="83" y="36" width="2" height="9"/></g><ellipse cx="84" cy="60" rx="30" ry="16" fill="#ffd98a" opacity=".12"/><g fill="#ffd98a" opacity=".85"><rect x="66" y="68" width="3" height="5"/><rect x="74" y="68" width="3" height="5"/><rect x="91" y="68" width="3" height="5"/><rect x="99" y="68" width="3" height="5"/><rect x="61" y="58" width="2" height="4"/><rect x="104" y="58" width="2" height="4"/></g><path d="M150,90 L145,40 L149,40 L148,22 L151,22 L150,40 L154,40 Z" fill="#24345a"/><circle cx="149.5" cy="21" r="1.4" fill="#ff4d6d"/><rect x="0" y="134" width="9" height="42" fill="#0f1a31"/><rect x="2" y="146" width="2" height="3" fill="#ffd98a" opacity="0.52"/><rect x="5" y="146" width="2" height="3" fill="#ffd98a" opacity="0.91"/><rect x="2" y="160" width="2" height="3" fill="#ffd98a" opacity="0.74"/><rect x="9" y="142" width="9" height="34" fill="#0f1a31"/><rect x="11" y="147" width="2" height="3" fill="#ffd98a" opacity="0.62"/><rect x="14" y="147" width="2" height="3" fill="#ffd98a" opacity="0.63"/><rect x="14" y="161" width="2" height="3" fill="#ffd98a" opacity="0.63"/><rect x="14" y="168" width="2" height="3" fill="#ffd98a" opacity="0.81"/><rect x="18" y="142" width="9" height="34" fill="#0f1a31"/><rect x="20" y="147" width="2" height="3" fill="#ffd98a" opacity="0.53"/><rect x="23" y="147" width="2" height="3" fill="#ffd98a" opacity="0.54"/><rect x="20" y="161" width="2" height="3" fill="#ffd98a" opacity="0.90"/><rect x="23" y="168" width="2" height="3" fill="#ffd98a" opacity="0.85"/><rect x="27" y="134" width="9" height="42" fill="#0f1a31"/><rect x="29" y="153" width="2" height="3" fill="#ffd98a" opacity="0.68"/><rect x="29" y="160" width="2" height="3" fill="#ffd98a" opacity="0.88"/><rect x="32" y="160" width="2" height="3" fill="#ffd98a" opacity="0.85"/><rect x="36" y="142" width="9" height="34" fill="#0f1a31"/><rect x="41" y="147" width="2" height="3" fill="#ffd98a" opacity="0.58"/><rect x="38" y="161" width="2" height="3" fill="#ffd98a" opacity="0.95"/><rect x="41" y="168" width="2" height="3" fill="#ffd98a" opacity="0.62"/><rect x="45" y="128" width="9" height="48" fill="#0f1a31"/><rect x="47" y="133" width="2" height="3" fill="#ffd98a" opacity="0.61"/><rect x="50" y="133" width="2" height="3" fill="#ffd98a" opacity="0.63"/><rect x="47" y="140" width="2" height="3" fill="#ffd98a" opacity="0.85"/><rect x="50" y="147" width="2" height="3" fill="#ffd98a" opacity="0.97"/><rect x="50" y="154" width="2" height="3" fill="#ffd98a" opacity="0.99"/><rect x="47" y="161" width="2" height="3" fill="#ffd98a" opacity="0.56"/><rect x="54" y="146" width="9" height="30" fill="#0f1a31"/><rect x="59" y="151" width="2" height="3" fill="#ffd98a" opacity="0.71"/><rect x="59" y="165" width="2" height="3" fill="#ffd98a" opacity="0.55"/><rect x="63" y="128" width="9" height="48" fill="#0f1a31"/><rect x="68" y="140" width="2" height="3" fill="#ffd98a" opacity="0.97"/><rect x="68" y="147" width="2" height="3" fill="#ffd98a" opacity="0.80"/><rect x="65" y="154" width="2" height="3" fill="#ffd98a" opacity="0.96"/><rect x="68" y="161" width="2" height="3" fill="#ffd98a" opacity="0.65"/><rect x="72" y="142" width="9" height="34" fill="#0f1a31"/><rect x="74" y="147" width="2" height="3" fill="#ffd98a" opacity="0.94"/><rect x="77" y="147" width="2" height="3" fill="#ffd98a" opacity="0.98"/><rect x="77" y="161" width="2" height="3" fill="#ffd98a" opacity="0.98"/><rect x="77" y="168" width="2" height="3" fill="#ffd98a" opacity="0.80"/><rect x="81" y="142" width="9" height="34" fill="#0f1a31"/><rect x="86" y="154" width="2" height="3" fill="#ffd98a" opacity="0.86"/><rect x="86" y="168" width="2" height="3" fill="#ffd98a" opacity="0.96"/><rect x="90" y="146" width="9" height="30" fill="#0f1a31"/><rect x="92" y="158" width="2" height="3" fill="#ffd98a" opacity="0.60"/><rect x="92" y="165" width="2" height="3" fill="#ffd98a" opacity="0.86"/><rect x="99" y="146" width="9" height="30" fill="#0f1a31"/><rect x="108" y="146" width="9" height="30" fill="#0f1a31"/><rect x="110" y="158" width="2" height="3" fill="#ffd98a" opacity="0.61"/><rect x="117" y="128" width="9" height="48" fill="#0f1a31"/><rect x="119" y="133" width="2" height="3" fill="#ffd98a" opacity="0.65"/><rect x="122" y="133" width="2" height="3" fill="#ffd98a" opacity="0.66"/><rect x="122" y="147" width="2" height="3" fill="#ffd98a" opacity="0.71"/><rect x="119" y="168" width="2" height="3" fill="#ffd98a" opacity="0.92"/><rect x="126" y="138" width="9" height="38" fill="#0f1a31"/><rect x="131" y="143" width="2" height="3" fill="#ffd98a" opacity="0.74"/><rect x="131" y="157" width="2" height="3" fill="#ffd98a" opacity="0.70"/><rect x="135" y="146" width="9" height="30" fill="#0f1a31"/><rect x="144" y="142" width="9" height="34" fill="#0f1a31"/><rect x="146" y="154" width="2" height="3" fill="#ffd98a" opacity="0.58"/><rect x="153" y="138" width="9" height="38" fill="#0f1a31"/><rect x="158" y="143" width="2" height="3" fill="#ffd98a" opacity="0.91"/><rect x="155" y="150" width="2" height="3" fill="#ffd98a" opacity="1.00"/><rect x="155" y="157" width="2" height="3" fill="#ffd98a" opacity="0.62"/><rect x="158" y="157" width="2" height="3" fill="#ffd98a" opacity="0.75"/><rect x="158" y="164" width="2" height="3" fill="#ffd98a" opacity="0.91"/><rect x="162" y="146" width="9" height="30" fill="#0f1a31"/><rect x="171" y="146" width="9" height="30" fill="#0f1a31"/><rect x="176" y="158" width="2" height="3" fill="#ffd98a" opacity="0.81"/><rect x="176" y="165" width="2" height="3" fill="#ffd98a" opacity="0.73"/><rect x="180" y="138" width="9" height="38" fill="#0f1a31"/><rect x="185" y="143" width="2" height="3" fill="#ffd98a" opacity="0.80"/><rect x="182" y="157" width="2" height="3" fill="#ffd98a" opacity="0.52"/><rect x="189" y="138" width="9" height="38" fill="#0f1a31"/><rect x="194" y="143" width="2" height="3" fill="#ffd98a" opacity="0.62"/><rect x="191" y="150" width="2" height="3" fill="#ffd98a" opacity="0.90"/><rect x="194" y="150" width="2" height="3" fill="#ffd98a" opacity="0.87"/><rect x="194" y="157" width="2" height="3" fill="#ffd98a" opacity="0.95"/><rect x="198" y="142" width="9" height="34" fill="#0f1a31"/><rect x="200" y="147" width="2" height="3" fill="#ffd98a" opacity="0.63"/><rect x="200" y="161" width="2" height="3" fill="#ffd98a" opacity="0.61"/><rect x="203" y="161" width="2" height="3" fill="#ffd98a" opacity="0.59"/><rect x="203" y="168" width="2" height="3" fill="#ffd98a" opacity="0.53"/><rect x="207" y="146" width="9" height="30" fill="#0f1a31"/><rect x="212" y="151" width="2" height="3" fill="#ffd98a" opacity="0.59"/><rect x="212" y="158" width="2" height="3" fill="#ffd98a" opacity="0.62"/><rect x="212" y="165" width="2" height="3" fill="#ffd98a" opacity="0.86"/><rect x="216" y="128" width="9" height="48" fill="#0f1a31"/><rect x="218" y="140" width="2" height="3" fill="#ffd98a" opacity="0.66"/><rect x="218" y="147" width="2" height="3" fill="#ffd98a" opacity="0.88"/><rect x="221" y="147" width="2" height="3" fill="#ffd98a" opacity="0.94"/><rect x="225" y="138" width="9" height="38" fill="#0f1a31"/><rect x="227" y="164" width="2" height="3" fill="#ffd98a" opacity="0.84"/><rect x="234" y="134" width="9" height="42" fill="#0f1a31"/><rect x="239" y="139" width="2" height="3" fill="#ffd98a" opacity="0.82"/><rect x="236" y="167" width="2" height="3" fill="#ffd98a" opacity="0.74"/><rect x="243" y="138" width="9" height="38" fill="#0f1a31"/><rect x="248" y="143" width="2" height="3" fill="#ffd98a" opacity="0.69"/><rect x="245" y="164" width="2" height="3" fill="#ffd98a" opacity="0.84"/><rect x="248" y="164" width="2" height="3" fill="#ffd98a" opacity="0.59"/><rect x="252" y="146" width="9" height="30" fill="#0f1a31"/><rect x="261" y="138" width="9" height="38" fill="#0f1a31"/><rect x="266" y="143" width="2" height="3" fill="#ffd98a" opacity="0.80"/><rect x="270" y="134" width="9" height="42" fill="#0f1a31"/><rect x="279" y="138" width="9" height="38" fill="#0f1a31"/><rect x="281" y="143" width="2" height="3" fill="#ffd98a" opacity="0.98"/><rect x="281" y="157" width="2" height="3" fill="#ffd98a" opacity="0.57"/><rect x="284" y="157" width="2" height="3" fill="#ffd98a" opacity="0.51"/><rect x="284" y="164" width="2" height="3" fill="#ffd98a" opacity="0.84"/><rect x="288" y="142" width="9" height="34" fill="#0f1a31"/><rect x="293" y="147" width="2" height="3" fill="#ffd98a" opacity="0.93"/><rect x="297" y="128" width="9" height="48" fill="#0f1a31"/><rect x="302" y="154" width="2" height="3" fill="#ffd98a" opacity="0.57"/><rect x="302" y="161" width="2" height="3" fill="#ffd98a" opacity="0.90"/><rect x="302" y="168" width="2" height="3" fill="#ffd98a" opacity="0.82"/><rect x="360" y="138" width="9" height="38" fill="#0f1a31"/><rect x="365" y="150" width="2" height="3" fill="#ffd98a" opacity="0.72"/><rect x="365" y="157" width="2" height="3" fill="#ffd98a" opacity="0.51"/><rect x="362" y="164" width="2" height="3" fill="#ffd98a" opacity="0.51"/><rect x="365" y="164" width="2" height="3" fill="#ffd98a" opacity="0.65"/><rect x="369" y="138" width="9" height="38" fill="#0f1a31"/><rect x="371" y="143" width="2" height="3" fill="#ffd98a" opacity="0.91"/><rect x="374" y="157" width="2" height="3" fill="#ffd98a" opacity="0.99"/><rect x="371" y="164" width="2" height="3" fill="#ffd98a" opacity="0.76"/><rect x="378" y="142" width="9" height="34" fill="#0f1a31"/><rect x="380" y="154" width="2" height="3" fill="#ffd98a" opacity="0.57"/><rect x="387" y="128" width="9" height="48" fill="#0f1a31"/><rect x="389" y="133" width="2" height="3" fill="#ffd98a" opacity="0.85"/><rect x="392" y="133" width="2" height="3" fill="#ffd98a" opacity="0.51"/><rect x="389" y="140" width="2" height="3" fill="#ffd98a" opacity="0.74"/><rect x="389" y="147" width="2" height="3" fill="#ffd98a" opacity="0.70"/><rect x="389" y="154" width="2" height="3" fill="#ffd98a" opacity="0.76"/><rect x="392" y="161" width="2" height="3" fill="#ffd98a" opacity="0.85"/><rect x="392" y="168" width="2" height="3" fill="#ffd98a" opacity="0.90"/><rect x="396" y="142" width="9" height="34" fill="#0f1a31"/><rect x="398" y="147" width="2" height="3" fill="#ffd98a" opacity="0.91"/><rect x="401" y="147" width="2" height="3" fill="#ffd98a" opacity="0.95"/><path d="M318,176 L318,62 Q318,40 330,30 Q342,40 342,62 L342,176Z" fill="#1c2b4e"/><rect x="322" y="66" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="322" y="75" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="322" y="84" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="322" y="93" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="322" y="102" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="322" y="111" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="322" y="165" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="327" y="84" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="327" y="102" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="327" y="120" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="327" y="138" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="327" y="165" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="332" y="75" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="332" y="93" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="332" y="102" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="332" y="120" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="332" y="138" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="332" y="147" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="337" y="75" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="337" y="93" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="337" y="102" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="337" y="129" width="2" height="3" fill="#ffd98a" opacity=".8"/><rect x="337" y="165" width="2" height="3" fill="#ffd98a" opacity=".8"/><circle cx="330" cy="30" r="2" fill="#ff4d6d" class="sm-blink"/><rect x="-5" y="176" width="410" height="50" fill="#0a1224"/><rect x="239" y="194" width="8" height="1.4" fill="#ffd98a" opacity="0.20"/><rect x="38" y="199" width="11" height="1.4" fill="#ffd98a" opacity="0.43"/><rect x="217" y="213" width="13" height="1.4" fill="#ffd98a" opacity="0.35"/><rect x="359" y="193" width="8" height="1.4" fill="#ffd98a" opacity="0.38"/><rect x="28" y="193" width="15" height="1.4" fill="#ffd98a" opacity="0.35"/><rect x="281" y="195" width="6" height="1.4" fill="#ffd98a" opacity="0.24"/><rect x="139" y="192" width="8" height="1.4" fill="#ffd98a" opacity="0.35"/><rect x="361" y="210" width="13" height="1.4" fill="#ffd98a" opacity="0.15"/><rect x="132" y="206" width="20" height="1.4" fill="#ffd98a" opacity="0.42"/><rect x="6" y="183" width="17" height="1.4" fill="#ffd98a" opacity="0.36"/><rect x="124" y="205" width="20" height="1.4" fill="#ffd98a" opacity="0.18"/><rect x="68" y="184" width="13" height="1.4" fill="#ffd98a" opacity="0.17"/><rect x="11" y="190" width="21" height="1.4" fill="#ffd98a" opacity="0.17"/><rect x="134" y="205" width="21" height="1.4" fill="#ffd98a" opacity="0.33"/><rect x="376" y="206" width="10" height="1.4" fill="#ffd98a" opacity="0.43"/><rect x="348" y="184" width="19" height="1.4" fill="#ffd98a" opacity="0.33"/><rect x="96" y="209" width="22" height="1.4" fill="#ffd98a" opacity="0.38"/><rect x="23" y="207" width="16" height="1.4" fill="#ffd98a" opacity="0.43"/><rect x="204" y="211" width="17" height="1.4" fill="#ffd98a" opacity="0.45"/><rect x="224" y="202" width="19" height="1.4" fill="#ffd98a" opacity="0.20"/><rect x="129" y="192" width="15" height="1.4" fill="#ffd98a" opacity="0.27"/><rect x="45" y="200" width="11" height="1.4" fill="#ffd98a" opacity="0.37"/><rect x="345" y="214" width="12" height="1.4" fill="#ffd98a" opacity="0.17"/><rect x="156" y="214" width="7" height="1.4" fill="#ffd98a" opacity="0.22"/><rect x="325" y="214" width="14" height="1.4" fill="#ffd98a" opacity="0.24"/><rect x="368" y="198" width="7" height="1.4" fill="#ffd98a" opacity="0.17"/><rect x="331" y="184" width="12" height="1.4" fill="#ffd98a" opacity="0.31"/><rect x="71" y="206" width="11" height="1.4" fill="#ffd98a" opacity="0.22"/><rect x="75" y="190" width="12" height="1.4" fill="#ffd98a" opacity="0.31"/><rect x="119" y="199" width="14" height="1.4" fill="#ffd98a" opacity="0.16"/><rect x="37" y="206" width="10" height="1.4" fill="#ffd98a" opacity="0.42"/><rect x="41" y="211" width="13" height="1.4" fill="#ffd98a" opacity="0.29"/><rect x="269" y="186" width="12" height="1.4" fill="#ffd98a" opacity="0.27"/><rect x="350" y="204" width="21" height="1.4" fill="#ffd98a" opacity="0.28"/><rect x="43" y="195" width="21" height="1.4" fill="#ffd98a" opacity="0.34"/><rect x="325" y="208" width="18" height="1.4" fill="#ffd98a" opacity="0.22"/><rect x="78" y="202" width="19" height="1.4" fill="#ffd98a" opacity="0.40"/><rect x="356" y="189" width="14" height="1.4" fill="#ffd98a" opacity="0.39"/><rect x="130" y="212" width="7" height="1.4" fill="#ffd98a" opacity="0.20"/><rect x="125" y="209" width="13" height="1.4" fill="#ffd98a" opacity="0.37"/></svg></div><div class="sm-fall"></div>
 <div class="sm-scr sm-title on" data-s="title"><div class="sm-logo"><span class="sm-tag">DOSSIER N°24</span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" class="sm-brac" aria-hidden="true"><defs>
<linearGradient id="egold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3b8"/><stop offset=".45" stop-color="#ffcf4a"/><stop offset="1" stop-color="#b07a12"/></linearGradient>
<radialGradient id="epink" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#ffd1e2"/><stop offset=".55" stop-color="#ff7aa8"/><stop offset="1" stop-color="#e0457b"/></radialGradient>
<linearGradient id="enight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1226"/><stop offset=".65" stop-color="#16233f"/><stop offset="1" stop-color="#2a1830"/></linearGradient>
<linearGradient id="ekraft" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1d9a2"/><stop offset="1" stop-color="#d2ad68"/></linearGradient>
<radialGradient id="elamp" cx="50%" cy="45%" r="50%"><stop offset="0" stop-color="#ffd98a" stop-opacity=".22"/><stop offset="1" stop-color="#ffd98a" stop-opacity="0"/></radialGradient>
<radialGradient id="elens" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#cfe6ff" stop-opacity=".12"/><stop offset="1" stop-color="#cfe6ff" stop-opacity=".05"/></radialGradient>
<filter id="esh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#000" flood-opacity=".55"/></filter>
</defs><g transform="rotate(-4 200 105)"><ellipse cx="350.0" cy="105.0" rx="8.2" ry="4.6" transform="rotate(90.0 350.0 105.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="348.9" cy="112.5" rx="4.6" ry="6.6" transform="rotate(106.4 348.9 112.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="345.6" cy="119.8" rx="8.2" ry="4.6" transform="rotate(120.8 345.6 119.8)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="340.3" cy="127.0" rx="4.6" ry="6.6" transform="rotate(132.5 340.3 127.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="332.8" cy="133.8" rx="8.2" ry="4.6" transform="rotate(141.8 332.8 133.8)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="323.4" cy="140.2" rx="4.6" ry="6.6" transform="rotate(149.1 323.4 140.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="312.3" cy="146.1" rx="8.2" ry="4.6" transform="rotate(155.0 312.3 146.1)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="299.5" cy="151.4" rx="4.6" ry="6.6" transform="rotate(159.9 299.5 151.4)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="285.2" cy="156.0" rx="8.2" ry="4.6" transform="rotate(164.1 285.2 156.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="269.7" cy="159.9" rx="4.6" ry="6.6" transform="rotate(167.8 269.7 159.9)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="253.2" cy="163.0" rx="8.2" ry="4.6" transform="rotate(171.1 253.2 163.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="235.9" cy="165.2" rx="4.6" ry="6.6" transform="rotate(174.2 235.9 165.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="218.1" cy="166.5" rx="8.2" ry="4.6" transform="rotate(177.1 218.1 166.5)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="200.0" cy="167.0" rx="4.6" ry="6.6" transform="rotate(-180.0 200.0 167.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="181.9" cy="166.5" rx="8.2" ry="4.6" transform="rotate(-177.1 181.9 166.5)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="164.1" cy="165.2" rx="4.6" ry="6.6" transform="rotate(-174.2 164.1 165.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="146.8" cy="163.0" rx="8.2" ry="4.6" transform="rotate(-171.1 146.8 163.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="130.3" cy="159.9" rx="4.6" ry="6.6" transform="rotate(-167.8 130.3 159.9)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="114.8" cy="156.0" rx="8.2" ry="4.6" transform="rotate(-164.1 114.8 156.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="100.5" cy="151.4" rx="4.6" ry="6.6" transform="rotate(-159.9 100.5 151.4)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="87.7" cy="146.1" rx="8.2" ry="4.6" transform="rotate(-155.0 87.7 146.1)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="76.6" cy="140.2" rx="4.6" ry="6.6" transform="rotate(-149.1 76.6 140.2)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="67.2" cy="133.8" rx="8.2" ry="4.6" transform="rotate(-141.8 67.2 133.8)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="59.7" cy="127.0" rx="4.6" ry="6.6" transform="rotate(-132.5 59.7 127.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="54.4" cy="119.8" rx="8.2" ry="4.6" transform="rotate(-120.8 54.4 119.8)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="51.1" cy="112.5" rx="4.6" ry="6.6" transform="rotate(-106.4 51.1 112.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="50.0" cy="105.0" rx="8.2" ry="4.6" transform="rotate(-90.0 50.0 105.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="51.1" cy="97.5" rx="4.6" ry="6.6" transform="rotate(-73.6 51.1 97.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="54.4" cy="90.2" rx="8.2" ry="4.6" transform="rotate(-59.2 54.4 90.2)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="59.7" cy="83.0" rx="4.6" ry="6.6" transform="rotate(-47.5 59.7 83.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="67.2" cy="76.2" rx="8.2" ry="4.6" transform="rotate(-38.2 67.2 76.2)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="76.6" cy="69.8" rx="4.6" ry="6.6" transform="rotate(-30.9 76.6 69.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="87.7" cy="63.9" rx="8.2" ry="4.6" transform="rotate(-25.0 87.7 63.9)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="100.5" cy="58.6" rx="4.6" ry="6.6" transform="rotate(-20.1 100.5 58.6)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="114.8" cy="54.0" rx="8.2" ry="4.6" transform="rotate(-15.9 114.8 54.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="130.3" cy="50.1" rx="4.6" ry="6.6" transform="rotate(-12.2 130.3 50.1)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="146.8" cy="47.0" rx="8.2" ry="4.6" transform="rotate(-8.9 146.8 47.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="164.1" cy="44.8" rx="4.6" ry="6.6" transform="rotate(-5.8 164.1 44.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="181.9" cy="43.5" rx="8.2" ry="4.6" transform="rotate(-2.9 181.9 43.5)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="200.0" cy="43.0" rx="4.6" ry="6.6" transform="rotate(-0.0 200.0 43.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="218.1" cy="43.5" rx="8.2" ry="4.6" transform="rotate(2.9 218.1 43.5)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="235.9" cy="44.8" rx="4.6" ry="6.6" transform="rotate(5.8 235.9 44.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="253.2" cy="47.0" rx="8.2" ry="4.6" transform="rotate(8.9 253.2 47.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="269.7" cy="50.1" rx="4.6" ry="6.6" transform="rotate(12.2 269.7 50.1)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="285.2" cy="54.0" rx="8.2" ry="4.6" transform="rotate(15.9 285.2 54.0)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="299.5" cy="58.6" rx="4.6" ry="6.6" transform="rotate(20.1 299.5 58.6)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="312.3" cy="63.9" rx="8.2" ry="4.6" transform="rotate(25.0 312.3 63.9)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="323.4" cy="69.8" rx="4.6" ry="6.6" transform="rotate(30.9 323.4 69.8)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="332.8" cy="76.2" rx="8.2" ry="4.6" transform="rotate(38.2 332.8 76.2)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="340.3" cy="83.0" rx="4.6" ry="6.6" transform="rotate(47.5 340.3 83.0)" fill="none" stroke="#c8901c" stroke-width="2.6"/><ellipse cx="345.6" cy="90.2" rx="8.2" ry="4.6" transform="rotate(59.2 345.6 90.2)" fill="none" stroke="url(#egold)" stroke-width="3.1"/><ellipse cx="348.9" cy="97.5" rx="4.6" ry="6.6" transform="rotate(73.6 348.9 97.5)" fill="none" stroke="#c8901c" stroke-width="2.6"/><circle cx="50.0" cy="105.0" r="8.8" fill="none" stroke="url(#egold)" stroke-width="3.8"/><line x1="326.6" y1="138.2" x2="326.6" y2="150.3" stroke="#d9a52a" stroke-width="2.4"/><g transform="translate(326.6,161.3) rotate(36.7)"><path d="M0,10.01 C-1.4300000000000002,8.58 -15.730000000000002,-0.5720000000000001 -14.3,-9.152000000000001 C-13.156,-16.588 -3.432,-17.732 0,-9.724000000000002 C3.432,-17.732 13.156,-16.588 14.3,-9.152000000000001 C15.730000000000002,-0.5720000000000001 1.4300000000000002,8.58 0,10.01Z" fill="url(#epink)" stroke="#b8326a" stroke-width="2.0" stroke-linejoin="round"/><ellipse cx="-5.7" cy="-8.0" rx="2.9" ry="1.7" fill="#fff" opacity=".75" transform="rotate(-30 -5.7 -8.0)"/></g><line x1="272.3" y1="159.3" x2="272.3" y2="171.4" stroke="#d9a52a" stroke-width="2.4"/><g transform="translate(272.3,182.4) rotate(41.8)"><path d="M0,10.01 C-1.4300000000000002,8.58 -15.730000000000002,-0.5720000000000001 -14.3,-9.152000000000001 C-13.156,-16.588 -3.432,-17.732 0,-9.724000000000002 C3.432,-17.732 13.156,-16.588 14.3,-9.152000000000001 C15.730000000000002,-0.5720000000000001 1.4300000000000002,8.58 0,10.01Z" fill="url(#epink)" stroke="#b8326a" stroke-width="2.0" stroke-linejoin="round"/><ellipse cx="-5.7" cy="-8.0" rx="2.9" ry="1.7" fill="#fff" opacity=".75" transform="rotate(-30 -5.7 -8.0)"/></g><line x1="200.0" y1="167.0" x2="200.0" y2="179.1" stroke="#d9a52a" stroke-width="2.4"/><g transform="translate(200.0,190.1) rotate(45.0)"><path d="M0,10.01 C-1.4300000000000002,8.58 -15.730000000000002,-0.5720000000000001 -14.3,-9.152000000000001 C-13.156,-16.588 -3.432,-17.732 0,-9.724000000000002 C3.432,-17.732 13.156,-16.588 14.3,-9.152000000000001 C15.730000000000002,-0.5720000000000001 1.4300000000000002,8.58 0,10.01Z" fill="url(#epink)" stroke="#b8326a" stroke-width="2.0" stroke-linejoin="round"/><ellipse cx="-5.7" cy="-8.0" rx="2.9" ry="1.7" fill="#fff" opacity=".75" transform="rotate(-30 -5.7 -8.0)"/></g><line x1="127.7" y1="159.3" x2="127.7" y2="171.4" stroke="#d9a52a" stroke-width="2.4"/><g transform="translate(127.7,182.4) rotate(-41.8)"><path d="M0,10.01 C-1.4300000000000002,8.58 -15.730000000000002,-0.5720000000000001 -14.3,-9.152000000000001 C-13.156,-16.588 -3.432,-17.732 0,-9.724000000000002 C3.432,-17.732 13.156,-16.588 14.3,-9.152000000000001 C15.730000000000002,-0.5720000000000001 1.4300000000000002,8.58 0,10.01Z" fill="url(#epink)" stroke="#b8326a" stroke-width="2.0" stroke-linejoin="round"/><ellipse cx="-5.7" cy="-8.0" rx="2.9" ry="1.7" fill="#fff" opacity=".75" transform="rotate(-30 -5.7 -8.0)"/></g><line x1="73.4" y1="138.2" x2="73.4" y2="150.3" stroke="#d9a52a" stroke-width="2.4"/><g transform="translate(73.4,161.3) rotate(-36.7)"><path d="M0,10.01 C-1.4300000000000002,8.58 -15.730000000000002,-0.5720000000000001 -14.3,-9.152000000000001 C-13.156,-16.588 -3.432,-17.732 0,-9.724000000000002 C3.432,-17.732 13.156,-16.588 14.3,-9.152000000000001 C15.730000000000002,-0.5720000000000001 1.4300000000000002,8.58 0,10.01Z" fill="url(#epink)" stroke="#b8326a" stroke-width="2.0" stroke-linejoin="round"/><ellipse cx="-5.7" cy="-8.0" rx="2.9" ry="1.7" fill="#fff" opacity=".75" transform="rotate(-30 -5.7 -8.0)"/></g></g></svg><h1><span>Le bracelet</span><b>aux cœurs roses</b></h1><p class="sm-sub">Une enquête de Noël à Lyon</p></div><p class="sm-press">Touche l’écran pour commencer</p><p class="sm-foot">© 2026 Studios du 8e · v24.12</p></div>
 <div class="sm-scr" data-s="menu"><div class="sm-logo mini"><span class="sm-tag">DOSSIER N°24</span><h1><span>Le bracelet</span><b>aux cœurs roses</b></h1></div><div class="sm-list">
  <button data-go="new">▶️ Nouvelle partie</button><button data-go="load">💾 Continuer</button><button data-go="opt">⚙️ Options</button><button data-go="cgu">📜 Conditions générales</button><button data-go="quit">❌ Quitter</button></div><p class="sm-foot">© 2026 Studios du 8e · v24.12</p></div>
 <div class="sm-scr" data-s="panel"><div class="sm-box"><div class="sm-pt"></div><div class="sm-pc"></div><div class="sm-pb"></div></div></div>
 <div class="sm-scr" data-s="load"><div class="sm-ld"><div class="sm-ldi">🔎</div><b class="sm-ldt">Chargement…</b><div class="sm-bar"><i></i></div><p class="sm-pct">0 %</p><p class="sm-tip"></p></div></div>
 <div class="sm-toast"></div>`;
  if (anySave) o.classList.add('has');
  document.body.appendChild(o);
  try {
    document.documentElement.classList.add('sm-lock');
  } catch (_) {}
  const Q = x => o.querySelector(x),
    scr = n => {
      o.querySelectorAll('.sm-scr').forEach(e => e.classList.toggle('on', e.dataset.s == n));
      o.dataset.s = n;
    };
  const snd = k => {
      try {
        CINE.sfx(k);
      } catch (_) {}
    },
    bip = f => {
      try {
        bkT(f || 660, 0.06, 'triangle', 0.04, (f || 660) * 1.5);
      } catch (_) {}
    };
  const toastM = t => {
    const e = Q('.sm-toast');
    e.textContent = t;
    e.classList.remove('on');
    void e.offsetWidth;
    e.classList.add('on');
    clearTimeout(e.__t);
    e.__t = setTimeout(() => e.classList.remove('on'), 2600);
  };
  const log = t => {
    try {
      slog('🎮', 'Menu démarrer : ' + t);
    } catch (_) {}
  };
  /* pluie de décembre sur Lyon + reflets dorés */
  {
    const F = Q('.sm-fall');
    for (let i = 0; i < 34; i++) {
      const e = document.createElement('i');
      if (i % 6 == 0) {
        e.className = 'bk';
        e.textContent = '';
      } else {
        e.className = 'rn';
        e.textContent = '';
      }
      e.style.left = Math.random() * 100 + '%';
      e.style.fontSize = 10 + Math.random() * 16 + 'px';
      e.style.animationDuration = 6 + Math.random() * 8 + 's';
      e.style.animationDelay = -Math.random() * 12 + 's';
      e.style.opacity = 0.4 + Math.random() * 0.6;
      F.appendChild(e);
    }
  }
  try {
    MUS.play('enquete', 0.035);
  } catch (_) {}
  let cgu = !!S.cguOk,
    cguNext = null;
  try {
    cgu = cgu || !!localStorage.getItem('avent_cgusig');
  } catch (_) {}
  try {
    cgu = cgu || !!localStorage.getItem('avent_cgu');
  } catch (_) {}
  let diff = null;
  /* écran titre */
  Q('.sm-title').addEventListener('click', () => {
    snd('swish');
    bip(880);
    scr('menu');
    log('écran titre passé');
  });
  /* panneaux */
  const panel = (t, html, btns) => {
    Q('.sm-pt').textContent = t;
    Q('.sm-pc').innerHTML = html;
    Q('.sm-pc').scrollTop = 0;
    const B = Q('.sm-pb');
    B.innerHTML = '';
    (btns || [['← Retour', () => scr('menu')]]).forEach(([l, f, c]) => {
      const b = document.createElement('button');
      b.textContent = l;
      if (c) b.className = c;
      b.onclick = e => {
        e.stopPropagation();
        bip(520);
        f(b);
      };
      B.appendChild(b);
    });
    scr('panel');
  };
  const A = {
    load() {
      if (!anySave) {
        bip(300);
        toastM('💾 Aucune sauvegarde trouvée… normal, c’est ta première fois. 😏');
        return;
      }
      const fd = t => {
        try {
          const d = new Date(t),
            z = { timeZone: 'Europe/Paris' };
          return (
            d.toLocaleDateString('fr-FR', { ...z, day: 'numeric', month: 'long' }) +
            ' à ' +
            d.toLocaleTimeString('fr-FR', { ...z, hour: '2-digit', minute: '2-digit' })
          );
        } catch (_) {
          return '';
        }
      };
      const card = n => {
        if (!sUsed(n))
          return `<div class="sm-slot empty"><span class="ic">📁</span><span><b>Emplacement ${n}</b><small>Vide</small></span></div>`;
        const d = sData(n),
          op = (d.opened || []).length,
          D = d.days || {},
          won = Object.keys(D).filter(k => D[k] && D[k].done && !D[k].lost).length,
          bs = Object.keys(d.boss || {}).filter(k => d.boss[k]).length,
          lc = op ? Math.max(...d.opened) : 0,
          fin = d.vbDone ? '🏆 Enquête résolue' : (d.story || {}).acc_valentin ? '⚔️ Combat final en cours' : '🕵️‍♀️ Enquête en cours';
        return `<div class="sm-slotw"><button class="sm-slot" data-slot="${n}"><span class="ic">📁</span><span style="flex:1"><b>Emplacement ${n}${n == SVSL ? ' · en cours' : ''}</b><small>📅 Cases ouvertes : ${op} / 24${lc ? ' (dernière : case ' + lc + ')' : ''}</small><small>🎮 Mini-jeux réussis : ${won} · 👹 Boss battus : ${bs}</small><small>${fin}</small>${d.startDone > 1 ? `<small>🗓️ Commencée le ${fd(d.startDone)}</small>` : ''}${d.lastPlay ? `<small>⏱️ Dernière session : ${fd(d.lastPlay)}</small>` : ''}<span class="sm-prog"><i style="width:${Math.round((op / 24) * 100)}%"></i></span></span></button><button class="sm-del" data-del="${n}" aria-label="Effacer">🗑️</button></div>`;
      };
      panel('💾 Choisis ta sauvegarde', [1, 2, 3].map(card).join(''), [['← Retour', () => scr('menu'), 'alt']]);
      Q('.sm-pc')
        .querySelectorAll('[data-slot]')
        .forEach(
          b =>
            (b.onclick = e => {
              e.stopPropagation();
              const n = +b.dataset.slot;
              snd('ding');
              mysGate(() => {
                log('continue la partie (emplacement ' + n + ')');
                if (n == SVSL) loadGo(1);
                else swap(n, 'load');
              });
            })
        );
      Q('.sm-pc')
        .querySelectorAll('[data-del]')
        .forEach(
          b =>
            (b.onclick = e => {
              e.stopPropagation();
              const n = +b.dataset.del;
              bip(300);
              panel(
                '🗑️ Effacer l’emplacement ' + n,
                `<p class="sm-c big">Tout effacer ? 😱</p><p class="sm-c">Toute la progression de cet emplacement sera supprimée. Impossible de revenir en arrière.</p>`,
                [
                  ['Non, garder', () => A.load(), 'alt'],
                  [
                    'Oui, tout effacer',
                    () => {
                      log('sauvegarde effacée (emplacement ' + n + ')');
                      try {
                        localStorage.removeItem(slotKey(n));
                      } catch (_) {}
                      if (n == SVSL) {
                        window.__noSave = 1;
                        try {
                          sessionStorage.setItem('smGo', 'slots');
                          sessionStorage.setItem('smToast', '🗑️ Emplacement ' + n + ' effacé.');
                        } catch (_) {}
                        location.reload();
                        return;
                      }
                      toastM('🗑️ Emplacement ' + n + ' effacé.');
                      if ([1, 2, 3].some(sUsed)) A.load();
                      else {
                        o.classList.remove('has');
                        scr('menu');
                      }
                    }
                  ]
                ]
              );
            })
        );
    },
    quit() {
      panel('❌ Quitter', `<p class="sm-c">Tu veux vraiment quitter ? 🥺</p>`, [
        [
          'Oui',
          () =>
            panel('❌ Quitter', `<p class="sm-c">Vraiment vraiment ? Il y a un bracelet en jeu. 💖</p>`, [
              [
                'Oui, sûre',
                () => {
                  log('a essayé de quitter');
                  panel(
                    '🔒 Quitter',
                    `<p class="sm-c">Désolé, la porte du commissariat est fermée à clé.</p><p class="sm-c">Il va falloir finir l’enquête. 🕵️‍♀️</p>`,
                    [['D’accord… 😤', () => scr('menu')]]
                  );
                },
                'alt'
              ],
              ['Non, je reste', () => scr('menu')]
            ])
        ],
        ['Non', () => scr('menu'), 'alt']
      ]);
    },
    opt() {
      const L = S.lang || 'fr',
        on = k => S[k] !== false,
        lum = S.lum == null ? 100 : S.lum,
        deco = SHOP.filter(x => x.k == 'own' && (S.own || []).includes(x.id));
      const tg = (k, lbl, def) => {
        const v = def ? S[k] !== false : !!S[k];
        return `<div class="sm-row"><span>${lbl}</span><button class="sm-tg ${v ? 'on' : ''}" data-t="${k}" data-def="${def ? 1 : 0}">${v ? 'ON' : 'OFF'}</button></div>`;
      };
      const vd = (() => {
        try {
          const d = new Date(APPV * 1000),
            z = { timeZone: 'Europe/Paris' };
          return isFinite(+APPV)
            ? d.toLocaleDateString('fr-FR', z) +
                ' à ' +
                d.toLocaleTimeString('fr-FR', { ...z, hour: '2-digit', minute: '2-digit', second: '2-digit' })
            : '';
        } catch (_) {
          return '';
        }
      })();
      panel(
        '⚙️ Options',
        `
   <h3 class="sm-h">🌍 Langue</h3><div class="sm-row"><span data-notr><button class="sm-tg ${L == 'fr' ? 'on' : ''}" data-l="fr">🇫🇷 FR</button> <button class="sm-tg ${L == 'en' ? 'on' : ''}" data-l="en">🇬🇧 EN</button> <button class="sm-tg ${L == 'br' ? 'on' : ''}" data-l="br">⠃ Braille</button></span></div>
   <h3 class="sm-h">🔊 Son et vibrations</h3>${tg('sound', '🔊 Sons des mini-jeux', 1)}${tg('music', '🎵 Musique des mini-jeux', 1)}${tg('bgm', '🎶 Musique d’ambiance', 1)}${tg('vib', '📳 Vibrations', 1)}
   <h3 class="sm-h">☀️ Affichage</h3><div class="sm-row col"><span>☀️ Luminosité</span><input type="range" class="sm-rg sm-lum" min="35" max="100" step="5" value="${lum}"><small class="sm-rv sm-lumv">${lum} %</small></div>
   <div class="sm-row"><span>🔠 Taille du texte</span><span>${[
     ['s', 'Petit'],
     ['n', 'Normal'],
     ['l', 'Grand']
   ]
     .map(([k, n]) => `<button class="sm-tg ${(S.fsz || 'n') == k ? 'on' : ''}" data-fs="${k}">${n}</button>`)
     .join(' ')}</span></div>
   ${tg('warm', '🌅 Lumière douce', 0)}${tg('fxbg', '✨ Animations de fond', 1)}${tg('wake', '🔆 Écran toujours allumé', 0)}
   <h3 class="sm-h">🎄 Décorations</h3>${deco.map(x => `<div class="sm-row"><span>${x.ic} ${esc(x.n)}</span><button class="sm-tg ${S[x.id] !== false ? 'on' : ''}" data-dc="${x.id}">${S[x.id] !== false ? 'ON' : 'OFF'}</button></div>`).join('') || '<p class="sm-small">Fabrique des décorations au 🧪 labo pour les activer ici.</p>'}
   <h3 class="sm-h">💘 Amour</h3><div class="sm-row col"><span>💘 Niveau d’amour</span><input type="range" class="sm-rg sm-love" min="0" max="100" value="100"><small class="sm-rv sm-lovev">100 %</small></div>
   <h3 class="sm-h">📲 Sauvegarde</h3><div class="sm-row"><span>📤 Copier mon code</span><button class="sm-tg on" data-a="exp">Copier</button></div><div class="sm-row"><span>📥 Coller un code</span><button class="sm-tg on" data-a="imp">Coller</button></div>
   <div class="sm-row"><span>🎁 Fichier mystère</span><label class="sm-tg on sm-mys">Ouvrir<input type="file" class="fpick mysop"></label></div>
   ${(() => {
     try {
       return APP.web() && !APP.standalone()
         ? '<div class="sm-row"><span>📲 Installer l’appli</span><button class="sm-tg on" data-a="inst">Installer</button></div>'
         : '';
     } catch (_) {
       return '';
     }
   })()}
   <p class="sm-small center">🔎 Dossier n°24 · Le bracelet aux cœurs roses · fait avec ❤️ par Valentin<br>${vd ? 'Version du ' + vd : ''}</p>`,
        [['← Retour', () => scr('menu')]]
      );
      const P = Q('.sm-pc');
      P.querySelectorAll('[data-t]').forEach(
        b =>
          (b.onclick = e => {
            e.stopPropagation();
            const k = b.dataset.t,
              def = b.dataset.def == '1',
              cur = def ? S[k] !== false : !!S[k],
              v = !cur;
            S[k] = v;
            save();
            b.classList.toggle('on', v);
            b.textContent = v ? 'ON' : 'OFF';
            bip(700);
            try {
              if (k == 'sound' && v) SFX('ok');
              if (k == 'vib' && v) navigator.vibrate(60);
              if (['warm', 'fxbg', 'wake'].includes(k)) {
                applyDisp();
                if (k == 'fxbg') snowCount();
              }
              if (k == 'music') {
                v ? MUS.play('noir', 0.035) : MUS.stop();
              }
            } catch (_) {}
          })
      );
      P.querySelectorAll('[data-l]').forEach(
        b =>
          (b.onclick = e => {
            e.stopPropagation();
            if ((S.lang || 'fr') == b.dataset.l) return;
            try {
              setLang(b.dataset.l);
            } catch (_) {}
          })
      );
      P.querySelectorAll('[data-fs]').forEach(
        b =>
          (b.onclick = e => {
            e.stopPropagation();
            try {
              setOpt('fsz', b.dataset.fs);
            } catch (_) {}
            P.querySelectorAll('[data-fs]').forEach(x => x.classList.toggle('on', x == b));
            bip(600);
          })
      );
      P.querySelectorAll('[data-dc]').forEach(
        b =>
          (b.onclick = e => {
            e.stopPropagation();
            const k = b.dataset.dc,
              v = S[k] === false;
            S[k] = v;
            save();
            try {
              snowCount();
              if (k == 'voix' && v) ding();
            } catch (_) {}
            b.classList.toggle('on', v);
            b.textContent = v ? 'ON' : 'OFF';
            bip(700);
          })
      );
      const lm = P.querySelector('.sm-lum');
      lm.oninput = () => {
        S.lum = +lm.value;
        P.querySelector('.sm-lumv').textContent = lm.value + ' %';
        try {
          applyDisp();
        } catch (_) {}
      };
      lm.onchange = () => save();
      const lv = P.querySelector('.sm-love'),
        lvv = P.querySelector('.sm-lovev');
      lv.oninput = () => {
        lvv.textContent = lv.value + ' %';
      };
      lv.onchange = () => {
        if (+lv.value < 100) {
          toastM('💘 Impossible de descendre en dessous de 100 %.');
          let v = +lv.value;
          const f = setInterval(() => {
            v = Math.min(100, v + 6);
            lv.value = v;
            lvv.textContent = v + ' %';
            if (v >= 100) clearInterval(f);
          }, 30);
        } else {
          toastM('💘 Toujours au maximum. 🥰');
        }
      };
      P.querySelectorAll('[data-a]').forEach(
        b =>
          (b.onclick = e => {
            e.stopPropagation();
            bip(600);
            try {
              ({ exp: syncExport, imp: syncImport, inst: () => installScreen(true) })[b.dataset.a]();
            } catch (_) {}
          })
      );
    },
    cgu() {
      const SIG = (() => {
        try {
          return localStorage.getItem('avent_cgusig');
        } catch (_) {
          return null;
        }
      })();
      let sigInk = 0;
      panel(
        '📜 Conditions générales d’utilisation',
        `<div class="sm-cgu">
   <p><b>Article 1 — Objet.</b> Le présent calendrier a pour objet de retrouver le bracelet aux cœurs roses. Toute tentative de deviner le coupable avant le 24 reste formellement encouragée.</p>
   <p><b>Article 2 — Utilisatrice.</b> L’application est réservée à une seule personne au monde. Si tu n’es pas Célestine, ferme cette appli et va t’acheter ton propre calendrier.</p>
   <p><b>Article 3 — Durée.</b> Le contrat est valable du 1er au 24 décembre, et tacitement reconduit pour toujours.</p>
   <p><b>Article 4 — Bijoux.</b> Le commissariat du 8e décline toute responsabilité en cas de bracelet perdu, volé ou « emprunté sans prévenir ».</p>
   <p><b>Article 5 — Données personnelles.</b> L’application collecte tes sourires, tes fous rires et tes « oh non ! ». Ces données ne seront jamais revendues, même contre un tacos.</p>
   <p><b>Article 6 — Triche.</b> Ouvrir une case en avance est puni de 3 secondes de honte. Le brigadier Gérald surveille.</p>
   <p><b>Article 7 — Le chat.</b> Le chat n’est soumis à aucune règle. Il ne l’a jamais été.</p>
   <p><b>Article 8 — Litiges.</b> En cas de désaccord, le litige sera réglé par un duel de danse.</p>
   <p><b>Article 9 — Résiliation.</b> Il est impossible de résilier. Voir l’article 3.</p>
   <p class="sm-small">En acceptant, tu reconnais avoir lu ces conditions (personne ne les lit, on sait).</p></div>
   <label class="sm-ck"><input type="checkbox" class="sm-ckb" ${SIG ? 'checked disabled' : ''}> J’ai tout lu (c’est faux, mais on te croit)</label>
   <div class="sm-sigw"><p class="sm-sigl">✍️ Signature :</p>${SIG ? `<img class="sm-sigi" src="${SIG}" alt=""><p class="sm-small">Lu et approuvé le ${sigD()}</p>` : '<canvas class="sm-sig" width="600" height="220"></canvas><button class="sm-tg sm-sigc">Effacer</button>'}</div>`,
        SIG
          ? [
              [
                '✅ Déjà signé',
                () => {
                  cgu = true;
                  try {
                    localStorage.setItem('avent_cgu', '1');
                  } catch (_) {}
                  const nx = cguNext;
                  cguNext = null;
                  nx ? nx() : scr('menu');
                }
              ]
            ]
          : [
              [
                '✅ J’accepte',
                b => {
                  if (!Q('.sm-ckb').checked) {
                    toastM('☝️ Coche d’abord la case. On sait que tu n’as pas lu.');
                    return;
                  }
                  if (!sigInk) {
                    toastM('✍️ Il faut signer en bas du document.');
                    Q('.sm-sig').scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                  }
                  try {
                    const u = Q('.sm-sig').toDataURL('image/png');
                    localStorage.setItem('avent_cgusig', u);
                    localStorage.setItem('avent_cgudate', String(Date.now()));
                  } catch (_) {}
                  cgu = true;
                  S.cguOk = Date.now();
                  save();
                  try {
                    localStorage.setItem('avent_cgu', '1');
                  } catch (_) {}
                  log('CGU acceptées');
                  snd('ding');
                  toastM('📜 Merci ! Tu viens de signer pour 24 jours d’enquête.');
                  {
                    const nx = cguNext;
                    cguNext = null;
                    nx ? setTimeout(nx, 600) : scr('menu');
                  }
                }
              ],
              [
                '🙅 Je refuse',
                b => {
                  toastM('🙅 Refus refusé. 😇');
                },
                'alt sm-run'
              ]
            ]
      );
      if (!SIG) {
        const cv = Q('.sm-sig'),
          x = cv.getContext('2d');
        x.lineWidth = 5;
        x.lineCap = 'round';
        x.lineJoin = 'round';
        x.strokeStyle = '#1d2a6b';
        let dn = 0,
          lp = null;
        const pt = e => {
          const r = cv.getBoundingClientRect();
          return [((e.clientX - r.left) * cv.width) / r.width, ((e.clientY - r.top) * cv.height) / r.height];
        };
        cv.style.touchAction = 'none';
        cv.addEventListener('pointerdown', e => {
          e.preventDefault();
          e.stopPropagation();
          dn = 1;
          lp = pt(e);
          try {
            cv.setPointerCapture(e.pointerId);
          } catch (_) {}
        });
        cv.addEventListener('pointermove', e => {
          if (!dn) return;
          e.preventDefault();
          const q = pt(e);
          x.beginPath();
          x.moveTo(lp[0], lp[1]);
          x.lineTo(q[0], q[1]);
          x.stroke();
          lp = q;
          sigInk++;
        });
        const up = () => {
          dn = 0;
        };
        cv.addEventListener('pointerup', up);
        cv.addEventListener('pointercancel', up);
        Q('.sm-sigc').onclick = e => {
          e.stopPropagation();
          x.clearRect(0, 0, cv.width, cv.height);
          sigInk = 0;
        };
      }
      const R = Q('.sm-run');
      if (R) {
        const flee = e => {
          e.preventDefault();
          e.stopPropagation();
          R.style.transform = `translate(${(Math.random() * 2 - 1) * 110}px,${-30 - Math.random() * 110}px) rotate(${(Math.random() * 2 - 1) * 25}deg)`;
          bip(900 + Math.random() * 600);
        };
        R.addEventListener('pointerdown', flee, true);
        R.addEventListener('pointerenter', flee, true);
        R.addEventListener(
          'click',
          e => {
            e.stopImmediatePropagation();
            e.preventDefault();
          },
          true
        );
      }
    },
    cred() {
      panel(
        '🎬 Crédits',
        `<div class="sm-cred"><div class="sm-crs">
   <p><small>Une production</small><b>Studios du 8e</b></p>
   <p><small>Idée, scénario, code et beaucoup trop de café</small><b>Valentin</b></p>
   <p><small>Rôle principal</small><b>Célestine</b></p>
   <p><small>Lieutenant de police</small><b>Pépin</b></p>
   <p><small>Brigadier (et roi du broyeur)</small><b>Gérald</b></p>
   <p><small>Police scientifique</small><b>Dr Rodolphe</b></p>
   <p class="sm-crh"><small>Les 9 suspects</small></p>
   <p><small>Suspect n°1 · la pote des ongles</small><b>Noémie</b></p>
   <p><small>Suspect n°2 · la pote ophtalmo</small><b>Emma</b></p>
   <p><small>Suspect n°3 · la reine des fiches</small><b>Nora</b></p>
   <p><small>Suspect n°4 · la photographe de la promo</small><b>Erika</b></p>
   <p><small>Suspect n°5 · la fan de Bellecour</small><b>Eya</b></p>
   <p><small>Suspect n°6 · le grand frère</small><b>Edgar</b></p>
   <p><small>Suspect n°7 · la mère</small><b>Valérie</b></p>
   <p><small>Suspect n°8 · la collègue de la pharmacie</small><b>Sandrine</b></p>
   <p><small>Suspect n°9 · le copain (forcément)</small><b>Valentin</b></p>
   <p><small>Cascades</small><b>Le chat (il a refusé)</b></p>
   <p><small>Musique</small><b>La fanfare de la police (sous-payée)</b></p>
   <p><small>Budget</small><b>3 tacos</b></p>
   <p><small>Remerciements</small><b>Le commissariat du 8e, la pluie lyonnaise, et toi</b></p>
   <p><small>Aucun brigadier n’a été maltraité pendant le développement.</small><b>(Enfin… presque.)</b></p></div></div>`
      );
    },
    new() {
      if (anySave) {
        bip(500);
        panel(
          '▶️ Nouvelle partie',
          `<p class="sm-c">Choisis un emplacement libre :</p>${[1, 2, 3].map(n => (sUsed(n) ? `<div class="sm-slot empty"><span class="ic">📁</span><span><b>Emplacement ${n}</b><small>Occupé${n == SVSL ? ' · en cours' : ''}</small></span></div>` : `<button class="sm-slot" data-new="${n}"><span class="ic">✨</span><span><b>Emplacement ${n}</b><small>Vide · commencer une nouvelle partie ici</small></span></button>`)).join('')}${[1, 2, 3].every(sUsed) ? '<p class="sm-small center">Les 3 emplacements sont pris. Efface une sauvegarde dans 💾 Continuer pour faire de la place.</p>' : ''}`,
          [['← Retour', () => scr('menu'), 'alt']]
        );
        Q('.sm-pc')
          .querySelectorAll('[data-new]')
          .forEach(
            b =>
              (b.onclick = e => {
                e.stopPropagation();
                const n = +b.dataset.new;
                snd('ding');
                log('nouvelle partie (emplacement ' + n + ')');
                if (n == SVSL) A.new0();
                else swap(n, 'new0');
              })
          );
        return;
      }
      A.new0();
    },
    new0() {
      if (!window.__mysOk) return mysGate(() => A.new0());
      if (!cgu) {
        bip(220);
        toastM('📜 Tu dois d’abord accepter les conditions générales.');
        cguNext = () => A.new0();
        setTimeout(() => A.cgu(), 700);
        return;
      }
      panel(
        '🎯 Choisis la difficulté',
        `<div class="sm-dif">${[
          ['🍼', 'Facile', 'Pour les débutantes'],
          ['🎄', 'Normal', 'Comme prévu'],
          ['🔥', 'Experte', 'Pour les vraies détectives'],
          ['💀', 'Célestine', 'Le mode ultime']
        ]
          .map(([i, t, d]) => `<button data-d="${t}"><span>${i}</span><b>${t}</b><small>${d}</small></button>`)
          .join('')}</div>`,
        [['← Retour', () => scr('menu'), 'alt']]
      );
      Q('.sm-pc')
        .querySelectorAll('[data-d]')
        .forEach(
          b =>
            (b.onclick = e => {
              e.stopPropagation();
              diff = b.dataset.d;
              snd('ding');
              log('difficulté choisie : ' + diff);
              panel(
                '🎯 ' + diff,
                `<p class="sm-c big">Bon choix ! 👌</p><p class="sm-c">${diff == 'Normal' ? 'L’enquête t’attend. 🕵️‍♀️' : 'Tu es sûre ? 😏'}</p>`,
                [
                  [
                    '↩️ Non, je change',
                    () => {
                      log('change de difficulté');
                      A.new0();
                    },
                    'alt'
                  ],
                  ['✅ Oui, c’est parti !', () => loadGo()]
                ]
              );
            })
        );
    }
  };
  o.querySelectorAll('[data-go]').forEach(b =>
    b.addEventListener('click', e => {
      e.stopPropagation();
      bip(600);
      cguNext = null;
      A[b.dataset.go]();
    })
  );
  if (at) {
    if (at == 'load') scr('load');
    else scr('menu');
    setTimeout(() => {
      if (at == 'new') {
        A.new0();
        setTimeout(() => toastM('Peut-être essayer le mode Normal ? 😅'), 500);
      } else if (at == 'new0') A.new0();
      else if (at == 'load') loadGo(1);
      else if (at == 'slots') {
        if (anySave) A.load();
        else {
          o.classList.remove('has');
          scr('menu');
        }
      }
      try {
        const t = sessionStorage.getItem('smToast');
        if (t) {
          sessionStorage.removeItem('smToast');
          setTimeout(() => toastM(t), 300);
        }
      } catch (_) {}
    }, 0);
  }
  /* faux chargement */
  const TIPS = [
    'Astuce : un bracelet ne s’envole pas tout seul.',
    'Astuce : un alibi, ça se vérifie.',
    'Astuce : tout le monde ment un peu. Même le chat.',
    'Astuce : note tout ce que tu trouves sur ton tableau.',
    'Astuce : le brigadier Gérald ne sait pas garder un secret.',
    'Astuce : ne fais confiance à personne… sauf à Pépin.'
  ];
  const mysGate = go => {
    if (window.__mysOk || window.__mysSkip) return go();
    MDB.all()
      .then(o => {
        const n = Object.keys(o || {}).filter(k => o[k] && o[k].blob).length;
        if (n) {
          window.__mysOk = 1;
          return go();
        }
        log('fichier mystère demandé');
        panel(
          '🎁 Fichier mystère',
          `<div class="sm-c" style="font-size:64px;line-height:1">🎁🔒</div><p class="sm-c big">Avant de commencer…</p><p class="sm-c">Valentin t’a préparé un <b>fichier mystère</b>. Il faut l’ouvrir pour pouvoir lancer le jeu.</p><p class="sm-small center"><b>1.</b> Télécharge-le avec le premier bouton (il est un peu lourd : attends bien la fin du téléchargement).<br><b>2.</b> Reviens ici, touche le second bouton et choisis-le dans tes téléchargements.</p><p class="center"><a class="sm-tg sm-mysdl" href="${CONTENU.mysLien}" target="_blank" rel="noopener">📥 Télécharger le fichier mystère</a></p><p class="center"><label class="sm-tg on sm-mys sm-mysbig">🎁 Ouvrir le fichier mystère<input type="file" class="fpick mysop"></label></p>`,
          [
            ['← Retour', () => scr('menu'), 'alt'],
            ['😢 Je ne l’ai pas', () => toastM('📩 Demande-le à Valentin : sans lui, l’enquête ne peut pas commencer !'), 'alt']
          ]
        );
        const ok = () => {
          removeEventListener('mysdone', ok);
          window.__mysOk = 1;
          setTimeout(() => {
            try {
              closePop();
            } catch (_) {}
            go();
          }, 2200);
        };
        addEventListener('mysdone', ok);
      })
      .catch(() => go());
  };
  const loadGo = quick => {
    scr('load');
    snd('swish');
    const I = Q('.sm-bar i'),
      P = Q('.sm-pct'),
      T = Q('.sm-tip'),
      LT = Q('.sm-ldt');
    let p = 0,
      ti = 0;
    T.textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
    const tt = setInterval(() => {
      ti++;
      T.classList.remove('in');
      void T.offsetWidth;
      T.textContent = TIPS[(ti + 3) % TIPS.length];
      T.classList.add('in');
    }, 1700);
    const step = () => {
      if (!document.body.contains(o)) return clearInterval(tt);
      if (quick && p < 99) {
        p = Math.min(99, p + 12 + Math.random() * 14);
      } else if (p < 99) {
        p = Math.min(99, p + 2 + Math.random() * 9);
      }
      if (p < 99) {
        I.style.width = p + '%';
        P.textContent = Math.floor(p) + ' %';
        if (Math.random() < 0.3)
          LT.textContent = [
            'Chargement…',
            'Réveil du brigadier de garde…',
            'Emballage des indices…',
            'Polissage du bracelet…',
            'Interrogatoire du chat…'
          ][Math.floor(Math.random() * 5)];
        return setTimeout(step, 160 + Math.random() * 220);
      }
      if (quick) {
        p = 100;
        I.style.width = '100%';
        P.textContent = '100 % ✨';
        LT.textContent = 'Prête !';
        snd('ding');
        clearInterval(tt);
        return setTimeout(finish, 500);
      }
      LT.textContent = 'Chargement de l’amour…';
      P.textContent = '99 %';
      setTimeout(() => {
        P.textContent = '99 % 😬';
        setTimeout(() => {
          p = 100;
          I.style.width = '100%';
          P.textContent = '100 % ✨';
          LT.textContent = 'Prête !';
          snd('ding');
          clearInterval(tt);
          setTimeout(finish, 900);
        }, 1400);
      }, 1300);
    };
    step();
  };
  const MODE = { Facile: 'mode_facile', Experte: 'mode_experte', Célestine: 'mode_celestine' };
  const finish = () => {
    if (diff && MODE[diff]) {
      const id = MODE[diff];
      log('mode ' + diff + ' (fin rigolote)');
      try {
        MUS.stop();
      } catch (_) {}
      o.classList.add('out');
      try {
        document.documentElement.classList.remove('sm-lock');
      } catch (_) {}
      smBk(1);
      setTimeout(() => {
        o.remove();
        try {
          story(
            id,
            () => {
              if (id == 'mode_facile') facChoose();
              else smOpen(1, 'new');
            },
            1
          );
        } catch (e) {
          console.error(e);
          smOpen(1, 'new');
        }
      }, 650);
      return;
    }
    // partie en cours reprise : parfois une (fausse) mise à jour avant d'entrer (js/gags.js)
    if (!finish.maj) {
      finish.maj = 1;
      try {
        if (majFausse(finish)) return;
      } catch (_) {}
    }
    const pv = S.lastPlay;
    S.startDone = S.startDone || Date.now();
    S.lastPlay = Date.now();
    save();
    if (pv && Date.now() - pv > 172800000)
      setTimeout(() => {
        try {
          funLetter(Math.floor((Date.now() - pv) / 86400000));
        } catch (_) {}
      }, 2600);
    try {
      const b = document.querySelector('.sm-back');
      b && b.remove();
    } catch (_) {}
    log('partie lancée' + (diff ? ' (' + diff + ')' : ''));
    try {
      MUS.stop();
    } catch (_) {}
    o.classList.add('out');
    try {
      document.documentElement.classList.remove('sm-lock');
    } catch (_) {}
    setTimeout(() => {
      o.remove();
      try {
        bgm();
      } catch (_) {}
      try {
        storyCheck();
      } catch (_) {}
    }, 650);
  };
}
function smBk(on) {
  let b = document.getElementById('smbk');
  if (on) {
    if (!b) {
      b = document.createElement('div');
      b.id = 'smbk';
      document.body.appendChild(b);
    }
  } else if (b) b.remove();
}
function smHome() {
  if (storyBusy()) return;
  try {
    SFX('tap');
  } catch (_) {}
  try {
    slog('🏠', 'Retour à l’écran d’accueil');
  } catch (_) {}
  smOpen(1);
}
function facChoose(moiDone) {
  smBk(1);
  const o = document.createElement('div');
  o.id = 'facch';
  o.innerHTML = `<div class="fc-in"><p class="fc-t">🔦 Qui veux-tu accuser ?</p><div class="fc-r"><button class="fc-b ${moiDone ? 'off' : ''}" data-w="moi"><img src="${VIMG.c}" alt=""><b>Célestine</b><small>${moiDone ? '❌ Innocente (c’est officiel)' : 'Suspect n°1'}</small></button><button class="fc-b" data-w="chat"><span class="fc-cat">🐈</span><b>Le chat</b><small>Suspect n°2</small></button></div></div>`;
  document.body.appendChild(o);
  o.querySelectorAll('.fc-b').forEach(
    b =>
      (b.onclick = () => {
        if (b.classList.contains('off')) {
          try {
            bkT(200, 0.1, 'square', 0.04, 150);
          } catch (_) {}
          b.classList.add('no');
          setTimeout(() => b.classList.remove('no'), 400);
          return;
        }
        try {
          CINE.sfx('ding');
        } catch (_) {}
        o.classList.add('out');
        const w = b.dataset.w;
        try {
          slog('🎮', 'Mode Facile : accuse ' + (w == 'moi' ? 'elle-même' : 'le chat'));
        } catch (_) {}
        setTimeout(() => {
          o.remove();
          if (w == 'moi') story('mode_facile_moi', () => facChoose(1), 1);
          else story('mode_facile_chat', () => smOpen(1, 'new'), 1);
        }, 350);
      })
  );
}
function sigD() {
  try {
    const t = +localStorage.getItem('avent_cgudate') || Date.now(),
      d = new Date(t),
      z = { timeZone: 'Europe/Paris' };
    return (
      d.toLocaleDateString('fr-FR', { ...z, day: 'numeric', month: 'long', year: 'numeric' }) +
      ' à ' +
      d.toLocaleTimeString('fr-FR', { ...z, hour: '2-digit', minute: '2-digit' })
    );
  } catch (_) {
    return '';
  }
}
function cguShame(d) {
  const sig = (() => {
    try {
      return localStorage.getItem('avent_cgusig');
    } catch (_) {
      return null;
    }
  })();
  if (!sig || document.getElementById('cgsh')) return false;
  window.__cguSh = 1;
  try {
    slog('📜', 'Rappel des CGU (case ' + d + ' en avance)');
  } catch (_) {}
  const o = document.createElement('div');
  o.id = 'cgsh';
  o.innerHTML = `<div class="cg-elf">${CINE.elf()}</div><div class="cg-bub"></div><div class="cg-doc"><h3>📜 Conditions générales d’utilisation</h3><p class="dim"><b>Article 5 — Données personnelles.</b> L’application collecte tes sourires…</p><p class="hl"><b>Article 6 — Triche.</b> Ouvrir une case en avance est puni de 3 secondes de honte. Le brigadier Gérald surveille.</p><p class="dim"><b>Article 7 — Le chat.</b> Le chat n’est soumis à aucune règle…</p><div class="cg-sg"><span>Lu et approuvé le ${sigD()}</span><img src="${sig}" alt=""></div></div><div class="cg-cd"></div>`;
  document.body.appendChild(o);
  const B = o.querySelector('.cg-bub'),
    E = o.querySelector('.cg-elf'),
    DOC = o.querySelector('.cg-doc'),
    CD = o.querySelector('.cg-cd');
  let k = 0;
  const lines = [
    ['Halte-là ! ✋ Tu essaies d’ouvrir la case ' + d + ' en avance ?!', 0],
    ['Impossible. Tu as signé les conditions générales, souviens-toi…', 1],
    ['Article 6 : « Ouvrir une case en avance est puni de 3 secondes de honte. » Et ça, c’est TA signature. 😏', 2],
    ['Les règles sont les règles. Début de la honte…', 3]
  ];
  const say = () => {
    const [t, st] = lines[k];
    B.textContent = t;
    B.classList.remove('on');
    void B.offsetWidth;
    B.classList.add('on');
    try {
      CINE.blip && CINE.blip(t, 'e');
    } catch (_) {}
    E.classList.toggle('talk', 1);
    if (st >= 1) DOC.classList.add('on');
    if (st >= 2) DOC.classList.add('zoom');
    if (st == 3) {
      o.classList.add('shame');
      let n = 3;
      CD.textContent = '😳 3';
      CD.classList.add('on');
      const iv = setInterval(() => {
        n--;
        if (n > 0) {
          CD.textContent = '😳 ' + n;
          try {
            bkT(300, 0.1, 'square', 0.04, 200);
          } catch (_) {}
        } else {
          clearInterval(iv);
          CD.textContent = '✅ Honte terminée.';
          setTimeout(() => {
            o.classList.add('out');
            setTimeout(() => o.remove(), 400);
          }, 900);
        }
      }, 1000);
    }
  };
  o.onclick = () => {
    if (k >= lines.length - 1) return;
    k++;
    say();
  };
  say();
  return true;
}
function storyCheck() {
  try {
    if (storyBusy()) return;
    if (!window.__smSeen && !instPend()) {
      smOpen();
      return;
    }
    S.story = S.story || {};
    const sd = S.story,
      op = S.opened || [];
    let id = null;
    let ne = 0;
    try {
      ne = eggs().length;
    } catch (_) {}
    const lost = Object.values(S.days || {}).some(x => x && (x.fails > 0 || x.lost));
    try {
      if (sd.pro) pcNews();
    } catch (_) {}
    const C = [
      ['pro', true],
      ['fiche', op.includes(1)],
      ['lab', op.includes(3)],
      ['s5', op.includes(5)],
      ['egg1', ne >= 1],
      ['lose1', lost],
      ['s9', op.includes(9)],
      ['casino', op.includes(14)],
      ['s17', op.includes(17)],
      ['s20', op.includes(20)],
      ['s21', op.includes(21)],
      ['eggs24', ne >= 24],
      ['eve', op.includes(23)],
      ['fichok', puzOk()],
      ['epi', !!(S.vbDone && S.finSeen)]
    ];
    if (S.storyQ && !sd[S.storyQ]) id = S.storyQ;
    else {
      const f = C.find(([k, ok]) => ok && !sd[k]);
      if (f) id = f[0];
    }
    if (S.storyQ && sd[S.storyQ]) S.storyQ = null;
    if (id) {
      if (id == S.storyQ) S.storyQ = null;
      story(id, () => {
        try {
          render();
        } catch (_) {}
        if (id == 'epi') setTimeout(bilanOpen, 800);
        if (/^w\d+$/.test(id)) audGrant(+id.slice(1));
        setTimeout(pcNews, 600);
      });
    }
  } catch (_) {}
}
