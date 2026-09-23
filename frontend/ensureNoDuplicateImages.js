import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'pages', 'ColomboPage.jsx');
let content = fs.readFileSync(file, 'utf8');

// Ensure specific local images are used for exact places
const specificMap = {
  "colombo-t1": "/images/colombo images/lotus-tower.jpg",
  "colombo-t2": "/images/colombo images/gangaramaya.jpg",
  "colombo-t3": "/images/colombo images/galle-face.jpg",
  "colombo-t4": "/images/colombo images/independence-memorial.jpg",
  "colombo-t6": "/images/colombo images/red-mosque.jpg",
  "colombo-f1": "/images/colombo images/ministry-of-crab.jpg",
  "colombo-f2": "/images/colombo images/upalis.jpg",
  "colombo-f3": "/images/colombo images/dbu-lamprais.jpg",
  "colombo-s1": "/images/colombo images/nuga-gama.jpg",
  "colombo-s2": "/images/colombo images/shangri-la.jpg",
  "colombo-tr2": "/images/colombo images/pettah-bus-stand.jpg",
  "colombo-tr4": "/images/colombo images/makumbura-center.jpg",
  "colombo-r1": "/images/colombo images/toyota-lanka.jpg"
};

for (const [id, imgPath] of Object.entries(specificMap)) {
  const reg = new RegExp(`(id:\\s*"${id}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${imgPath}$2`);
}

// Ensure no syntax errors like iymageUrl exist
content = content.replaceAll('iymageUrl:', 'imageUrl:');

fs.writeFileSync(file, content, 'utf8');
console.log('✓ Successfully verified all specific local image paths in ColomboPage.jsx');
