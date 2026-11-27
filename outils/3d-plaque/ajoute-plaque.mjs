import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'fs';
const [,, inp, out] = process.argv;
const G = JSON.parse(fs.readFileSync('geo.json'));
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const d = await io.read(inp);
const buf = d.getRoot().listBuffers()[0];
const tex = (f, nom) => d.createTexture(nom).setImage(fs.readFileSync(f)).setMimeType('image/png');
const mat = d.createMaterial('plaque-or').setBaseColorFactor([1, 1, 1, 1]).setMetallicFactor(1).setRoughnessFactor(1)
  .setBaseColorTexture(tex('couleur.png', 'plaque-couleur')).setNormalTexture(tex('normal.png', 'plaque-normal'))
  .setMetallicRoughnessTexture(tex('metal.png', 'plaque-metal'));
const matA = d.createMaterial('anneau-or').setBaseColorFactor([0.93, 0.74, 0.47, 1]).setMetallicFactor(1).setRoughnessFactor(0.32);
const prim = (g, m = mat) => d.createPrimitive().setMaterial(m)
  .setAttribute('POSITION', d.createAccessor().setType('VEC3').setArray(new Float32Array(g.pos.flat())).setBuffer(buf))
  .setAttribute('NORMAL', d.createAccessor().setType('VEC3').setArray(new Float32Array(g.nor.flat())).setBuffer(buf))
  .setAttribute('TEXCOORD_0', d.createAccessor().setType('VEC2').setArray(new Float32Array(g.uv.flat())).setBuffer(buf))
  .setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint16Array(g.idx)).setBuffer(buf));
const mesh = d.createMesh('plaque-gravee').addPrimitive(prim(G.plaque)).addPrimitive(prim(G.anneau, matA));
const node = d.createNode('plaque-gravee').setMesh(mesh);
d.getRoot().listScenes()[0].addChild(node);
await d.transform(textureCompress({ encoder: sharp, targetFormat: 'webp', slots: /plaque/, quality: 90 }));
await io.write(out, d);
console.log('écrit', out, fs.statSync(out).size);
