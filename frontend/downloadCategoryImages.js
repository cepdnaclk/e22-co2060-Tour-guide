import fs from 'fs';
import path from 'path';

const imgDir = path.join(process.cwd(), 'public', 'images');

const downloads = [
  {
    filename: 'ministry-of-crab.jpg',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80' // Gourmet crab / seafood dish
  },
  {
    filename: 'toyota-lanka.jpg',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80' // Auto service centre & cars
  },
  {
    filename: 'ceypetco-fuel.jpg',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80' // Petrol filling station pump
  }
];

async function main() {
  for (const item of downloads) {
    try {
      console.log(`Downloading ${item.filename}...`);
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(imgDir, item.filename), buffer);
        console.log(`✓ Saved ${item.filename} (${buffer.length} bytes)`);
      } else {
        console.error(`HTTP ${res.status} for ${item.filename}`);
      }
    } catch (err) {
      console.error(`Error downloading ${item.filename}:`, err.message);
    }
  }
}

main();
