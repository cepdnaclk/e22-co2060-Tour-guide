import fs from 'fs';
import path from 'path';

const pagePath = path.join(process.cwd(), 'src', 'pages', 'ColomboPage.jsx');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Convert any existing /images/ filename.jpg -> /images/colombo images/filename.jpg
content = content.replaceAll('/images/', '/images/colombo images/');
// Fix double replacements if any
content = content.replaceAll('/images/colombo images/colombo images/', '/images/colombo images/');

// 2. Set explicit paths for top Tourism attractions
content = content.replace(
  /id:\s*"colombo-t1",[\s\S]*?imageUrl:\s*".*?"/,
  `id: "colombo-t1",\n      name: "Colombo Lotus Tower",\n      district: "Colombo",\n      placeType: "Attraction",\n      description: "Standing at 350 meters, the Lotus Tower is South Asia's tallest self-supported tower featuring a 360-degree observation deck.",\n      imageUrl: "/images/colombo images/lotus-tower.jpg"`
);

content = content.replace(
  /id:\s*"colombo-t2",[\s\S]*?imageUrl:\s*".*?"/,
  `id: "colombo-t2",\n      name: "Gangaramaya Temple",\n      district: "Colombo",\n      placeType: "Temple",\n      description: "Iconic Buddhist temple near Beira Lake featuring museum relics, sacred Bodhi tree, and lotus shrine architecture.",\n      imageUrl: "/images/colombo images/gangaramaya.jpg"`
);

content = content.replace(
  /id:\s*"colombo-t3",[\s\S]*?imageUrl:\s*".*?"/,
  `id: "colombo-t3",\n      name: "Galle Face Green Promenade",\n      district: "Colombo",\n      placeType: "Attraction",\n      description: "A 500-meter oceanfront urban park along the Indian Ocean, famous for evening sunsets and street food.",\n      imageUrl: "/images/colombo images/galle-face.jpg"`
);

content = content.replace(
  /id:\s*"colombo-t4",[\s\S]*?imageUrl:\s*".*?"/,
  `id: "colombo-t4",\n      name: "Independence Memorial Hall",\n      district: "Colombo",\n      placeType: "Monument",\n      description: "National monument celebrating Sri Lankan independence from British rule, surrounded by manicured lawns.",\n      imageUrl: "/images/colombo images/independence-memorial.jpg"`
);

content = content.replace(
  /id:\s*"colombo-t6",[\s\S]*?imageUrl:\s*".*?"/,
  `id: "colombo-t6",\n      name: "Jami Ul-Alfar Mosque (Red Mosque)",\n      district: "Colombo",\n      placeType: "Mosque",\n      description: "Famous candy-striped red-and-white brick mosque built in 1908 in the heart of Pettah bazaar.",\n      imageUrl: "/images/colombo images/red-mosque.jpg"`
);

fs.writeFileSync(pagePath, content, 'utf8');
console.log('✓ Successfully updated all ColomboPage image paths to /images/colombo images/');
