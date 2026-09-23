import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'pages', 'ColomboPage.jsx');
let code = fs.readFileSync(file, 'utf8');

// Fix any syntax error like iymageUrl
code = code.replaceAll('iymageUrl:', 'imageUrl:');

// Replace specific place image URLs with /images/colombo images/<filename>
const replacements = [
  { id: 'colombo-t1', url: '/images/colombo images/lotus-tower.jpg' },
  { id: 'colombo-t2', url: '/images/colombo images/gangaramaya.jpg' },
  { id: 'colombo-t3', url: '/images/colombo images/galle-face.jpg' },
  { id: 'colombo-t4', url: '/images/colombo images/independence-memorial.jpg' },
  { id: 'colombo-t6', url: '/images/colombo images/red-mosque.jpg' },
  { id: 'colombo-f1', url: '/images/colombo images/ministry-of-crab.jpg' },
  { id: 'colombo-f2', url: '/images/colombo images/upalis.jpg' },
  { id: 'colombo-f3', url: '/images/colombo images/dbu-lamprais.jpg' },
  { id: 'colombo-s1', url: '/images/colombo images/nuga-gama.jpg' },
  { id: 'colombo-s2', url: '/images/colombo images/shangri-la.jpg' },
  { id: 'colombo-tr2', url: '/images/colombo images/pettah-bus-stand.jpg' },
  { id: 'colombo-tr4', url: '/images/colombo images/makumbura-center.jpg' },
  { id: 'colombo-r1', url: '/images/colombo images/toyota-lanka.jpg' }
];

for (const r of replacements) {
  const reg = new RegExp(`(id:\\s*"${r.id}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  code = code.replace(reg, `$1${r.url}$2`);
}

// Fuel stations (colombo-u1 through colombo-u25)
const fuelImgs = [
  '/images/colombo images/ceypetco-fuel.jpg',
  '/images/colombo images/lioc-fuel.jpg',
  '/images/colombo images/fuel-station-1.jpg',
  '/images/colombo images/fuel-station-2.jpg'
];

for (let i = 1; i <= 25; i++) {
  const fuelImg = fuelImgs[(i - 1) % fuelImgs.length];
  const reg = new RegExp(`(id:\\s*"colombo-u${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  code = code.replace(reg, `$1${fuelImg}$2`);
}

fs.writeFileSync(file, code, 'utf8');
console.log('✓ Successfully applied all /images/colombo images/ paths in ColomboPage.jsx');
