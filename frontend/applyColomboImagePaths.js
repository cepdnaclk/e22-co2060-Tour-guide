import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'pages', 'ColomboPage.jsx');
let code = fs.readFileSync(file, 'utf8');

// Fix typo if present
code = code.replace('iymageUrl:', 'imageUrl:');

// Map of place IDs or names to local images in /images/colombo images/
const mappings = [
  { id: 'colombo-t1', image: '/images/colombo images/lotus-tower.jpg' },
  { id: 'colombo-t2', image: '/images/colombo images/gangaramaya.jpg' },
  { id: 'colombo-t3', image: '/images/colombo images/galle-face.jpg' },
  { id: 'colombo-t4', image: '/images/colombo images/independence-memorial.jpg' },
  { id: 'colombo-t6', image: '/images/colombo images/red-mosque.jpg' },
  { id: 'colombo-f1', image: '/images/colombo images/ministry-of-crab.jpg' },
  { id: 'colombo-f2', image: '/images/colombo images/upalis.jpg' },
  { id: 'colombo-f3', image: '/images/colombo images/dbu-lamprais.jpg' },
  { id: 'colombo-s1', image: '/images/colombo images/nuga-gama.jpg' },
  { id: 'colombo-s2', image: '/images/colombo images/shangri-la.jpg' },
  { id: 'colombo-tr2', image: '/images/colombo images/pettah-bus-stand.jpg' },
  { id: 'colombo-tr4', image: '/images/colombo images/makumbura-center.jpg' },
  { id: 'colombo-r1', image: '/images/colombo images/toyota-lanka.jpg' }
];

for (const m of mappings) {
  const reg = new RegExp(`(id:\\s*"${m.id}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  code = code.replace(reg, `$1${m.image}$2`);
}

// Fuel stations mapping
const fuelImages = [
  '/images/colombo images/ceypetco-fuel.jpg',
  '/images/colombo images/lioc-fuel.jpg',
  '/images/colombo images/fuel-station-1.jpg',
  '/images/colombo images/fuel-station-2.jpg'
];

for (let i = 1; i <= 25; i++) {
  const img = fuelImages[(i - 1) % fuelImages.length];
  const reg = new RegExp(`(id:\\s*"colombo-u${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  code = code.replace(reg, `$1${img}$2`);
}

fs.writeFileSync(file, code, 'utf8');
console.log('✓ Successfully applied all local image paths to ColomboPage.jsx');
