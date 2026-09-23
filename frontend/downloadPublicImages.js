import fs from 'fs';
import path from 'path';

const imgDir = path.join(process.cwd(), 'public', 'images');

async function run() {
  const apiUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=National_Museum_of_Colombo&prop=pageimages&pithumbsize=1280&format=json';
  const res = await fetch(apiUrl, { headers: { 'User-Agent': 'TourGuideApp/1.0 (dev@example.com)' } });
  const data = await res.json();
  const pages = data.query.pages;
  const pageKey = Object.keys(pages)[0];
  const page = pages[pageKey];
  if (page && page.thumbnail) {
    console.log('Downloading national-museum.jpg from', page.thumbnail.source);
    const imgRes = await fetch(page.thumbnail.source, { headers: { 'User-Agent': 'TourGuideApp/1.0 (dev@example.com)' } });
    if (imgRes.ok) {
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(path.join(imgDir, 'national-museum.jpg'), buf);
      console.log('✓ Saved national-museum.jpg', buf.length, 'bytes');
    }
  }
}

run();
