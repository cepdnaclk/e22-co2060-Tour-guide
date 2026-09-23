import fs from 'fs';
import path from 'path';

const imgDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

// Download direct high quality images from Wikimedia via Wikipedia API
async function main() {
  const targets = [
    { title: 'Colombo_Lotus_Tower', filename: 'lotus-tower.jpg' },
    { title: 'Gangaramaya_Temple', filename: 'gangaramaya.jpg' },
    { title: 'Galle_Face_Green', filename: 'galle-face.jpg' },
    { title: 'Independence_Memorial_Hall', filename: 'independence-memorial.jpg' }
  ];

  for (const t of targets) {
    try {
      const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${t.title}&prop=pageimages&pithumbsize=1000&format=json`;
      console.log(`Fetching API for ${t.title}...`);
      const res = await fetch(apiUrl, {
        headers: {
          'User-Agent': 'TourGuideApp/1.0 (contact@example.com)'
        }
      });
      const data = await res.json();
      const pages = data.query.pages;
      const firstPageKey = Object.keys(pages)[0];
      const page = pages[firstPageKey];

      if (page && page.thumbnail && page.thumbnail.source) {
        const imgUrl = page.thumbnail.source;
        console.log(`Downloading image for ${t.title} from ${imgUrl}...`);
        const imgRes = await fetch(imgUrl, {
          headers: {
            'User-Agent': 'TourGuideApp/1.0 (contact@example.com)'
          }
        });
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const dest = path.join(imgDir, t.filename);
          fs.writeFileSync(dest, buffer);
          console.log(`✓ SUCCESS: Saved ${t.filename} (${buffer.length} bytes)`);
        } else {
          console.error(`Failed to download image HTTP ${imgRes.status}`);
        }
      } else {
        console.error(`No thumbnail found for ${t.title}`);
      }
    } catch (err) {
      console.error(`Error downloading ${t.title}:`, err.message);
    }
  }
}

main();
