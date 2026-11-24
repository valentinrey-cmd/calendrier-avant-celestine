#!/usr/bin/env python3
"""Vérifications rapides du site (à lancer avant chaque commit) :

    python3 outils/verifier.py                    # vérifie tout
    python3 outils/verifier.py --nouvelle-version # met un nouveau numéro de version (index.html + version.json) puis vérifie

Ce qui est vérifié :
  1. le numéro de version est le même dans 2026/index.html (APPV) et 2026/version.json ;
  2. chaque fichier listé dans 2026/js/fichiers.js existe, et chaque fichier de js/, css/, media/ y est listé ;
  3. aucun nom global (const / let / function en début de ligne) n'est déclaré dans deux fichiers ;
  4. la syntaxe de chaque fichier JS (si node est installé).
"""
import json, os, re, subprocess, sys, time, shutil

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(RACINE, '2026')
erreurs = []


def lire(rel):
    with open(os.path.join(SITE, rel), encoding='utf-8') as f:
        return f.read()


def ecrire(rel, txt):
    with open(os.path.join(SITE, rel), 'w', encoding='utf-8') as f:
        f.write(txt)


if '--nouvelle-version' in sys.argv:
    v = str(int(time.time()))
    idx = lire('index.html')
    idx, n = re.subn(r"const APPV='[^']*';", f"const APPV='{v}';", idx)
    if n != 1:
        sys.exit('APPV introuvable dans 2026/index.html')
    ecrire('index.html', idx)
    ecrire('version.json', json.dumps({'v': v}))
    print('Nouvelle version :', v)

# 1. version
appv = re.search(r"const APPV='([^']*)';", lire('index.html'))
vj = json.loads(lire('version.json')).get('v')
if not appv or appv.group(1) != vj:
    erreurs.append(f"version différente : index.html={appv and appv.group(1)} / version.json={vj}")

# 2. liste des fichiers
fich = lire('js/fichiers.js')
listes = {}
for nom in ('tete', 'corps', 'medias'):
    m = re.search(nom + r':\s*\[(.*?)\]', fich, re.S)
    listes[nom] = re.findall(r"'([^']+)'", m.group(1)) if m else []
tous = listes['tete'] + listes['corps'] + listes['medias']
for f in tous:
    if not os.path.isfile(os.path.join(SITE, f)):
        erreurs.append(f'listé dans fichiers.js mais absent : {f}')
if len(set(tous)) != len(tous):
    erreurs.append('un fichier est listé deux fois dans fichiers.js')
for dossier in ('js', 'css', 'media'):
    for base, _, noms in os.walk(os.path.join(SITE, dossier)):
        for n in noms:
            rel = os.path.relpath(os.path.join(base, n), SITE).replace(os.sep, '/')
            if rel != 'js/fichiers.js' and rel not in tous:
                erreurs.append(f'fichier présent mais pas listé dans js/fichiers.js : {rel}')

# 3. noms globaux en double
vus = {}
for f in [x for x in tous if x.endswith('.js')] + ['js/fichiers.js']:
    for m in re.finditer(r'^(?:const|let|var|function|async function|class)\s+([A-Za-z_$][\w$]*)', lire(f), re.M):
        nm = m.group(1)
        if nm in vus and vus[nm] != f:
            erreurs.append(f'« {nm} » est déclaré dans {vus[nm]} et dans {f}')
        vus.setdefault(nm, f)

# 4. syntaxe
node = shutil.which('node')
if node:
    for f in [x for x in tous if x.endswith('.js')] + ['js/fichiers.js', 'sw.js']:
        r = subprocess.run([node, '--check', os.path.join(SITE, f)], capture_output=True, text=True)
        if r.returncode:
            erreurs.append(f'erreur de syntaxe dans {f} :\n' + r.stderr.strip()[:600])
else:
    print('(node absent : syntaxe JS non vérifiée)')

if erreurs:
    print('❌ Problèmes trouvés :')
    for e in erreurs:
        print('  -', e)
    sys.exit(1)
print(f"✅ Tout est bon : version {vj}, {len(listes['tete']) + len(listes['corps'])} fichiers de code, {len(listes['medias'])} médias.")
