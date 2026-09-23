import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'pages', 'ColomboPage.jsx');
let content = fs.readFileSync(file, 'utf8');

// Fix any syntax error like iymageUrl
content = content.replaceAll('iymageUrl:', 'imageUrl:');

// Replace all unsplash and wikimedia URLs with local /images/colombo images/ paths
const categoryPools = {
  tourism: [
    '/images/colombo images/lotus-tower.jpg',
    '/images/colombo images/gangaramaya.jpg',
    '/images/colombo images/galle-face.jpg',
    '/images/colombo images/independence-memorial.jpg',
    '/images/colombo images/red-mosque.jpg'
  ],
  food: [
    '/images/colombo images/ministry-of-crab.jpg',
    '/images/colombo images/upalis.jpg',
    '/images/colombo images/dbu-lamprais.jpg'
  ],
  stay: [
    '/images/colombo images/shangri-la.jpg',
    '/images/colombo images/nuga-gama.jpg'
  ],
  fuel: [
    '/images/colombo images/ceypetco-fuel.jpg',
    '/images/colombo images/lioc-fuel.jpg',
    '/images/colombo images/fuel-station-1.jpg',
    '/images/colombo images/fuel-station-2.jpg'
  ],
  transport: [
    '/images/colombo images/pettah-bus-stand.jpg',
    '/images/colombo images/makumbura-center.jpg'
  ],
  repairs: [
    '/images/colombo images/toyota-lanka.jpg'
  ],
  emergency: [
    '/images/colombo images/independence-memorial.jpg',
    '/images/colombo images/toyota-lanka.jpg',
    '/images/colombo images/pettah-bus-stand.jpg'
  ]
};

// Replace tourism items (colombo-t1 to colombo-t30)
for (let i = 1; i <= 30; i++) {
  const localImg = categoryPools.tourism[(i - 1) % categoryPools.tourism.length];
  const reg = new RegExp(`(id:\\s*"colombo-t${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${localImg}$2`);
}

// Replace food items (colombo-f1 to colombo-f30)
for (let i = 1; i <= 30; i++) {
  const localImg = categoryPools.food[(i - 1) % categoryPools.food.length];
  const reg = new RegExp(`(id:\\s*"colombo-f${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${localImg}$2`);
}

// Replace stay items (colombo-s1 to colombo-s30)
for (let i = 1; i <= 30; i++) {
  const localImg = categoryPools.stay[(i - 1) % categoryPools.stay.length];
  const reg = new RegExp(`(id:\\s*"colombo-s${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${localImg}$2`);
}

// Replace fuel items (colombo-u1 to colombo-u30)
for (let i = 1; i <= 30; i++) {
  const localImg = categoryPools.fuel[(i - 1) % categoryPools.fuel.length];
  const reg = new RegExp(`(id:\\s*"colombo-u${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${localImg}$2`);
}

// Replace transport items (colombo-tr1 to colombo-tr30)
for (let i = 1; i <= 30; i++) {
  const localImg = categoryPools.transport[(i - 1) % categoryPools.transport.length];
  const reg = new RegExp(`(id:\\s*"colombo-tr${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${localImg}$2`);
}

// Replace repair items (colombo-r1 to colombo-r30)
for (let i = 1; i <= 30; i++) {
  const localImg = categoryPools.repairs[(i - 1) % categoryPools.repairs.length];
  const reg = new RegExp(`(id:\\s*"colombo-r${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${localImg}$2`);
}

// Replace emergency items (colombo-e1 to colombo-e30)
for (let i = 1; i <= 30; i++) {
  const localImg = categoryPools.emergency[(i - 1) % categoryPools.emergency.length];
  const reg = new RegExp(`(id:\\s*"colombo-e${i}"[\\s\\S]*?imageUrl:\\s*")[^"]+(")`, 'g');
  content = content.replace(reg, `$1${localImg}$2`);
}

// Global backup replace for any remaining https:// unsplash links in imageUrl
content = content.replace(/imageUrl:\s*"https:\/\/[^"]+"/g, 'imageUrl: "/images/colombo images/lotus-tower.jpg"');

fs.writeFileSync(file, content, 'utf8');
console.log('🎉 Successfully replaced 100% of imageUrls in ColomboPage.jsx with local paths from /images/colombo images/');
