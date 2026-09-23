import fs from 'fs';
import path from 'path';

const targetDir = path.join(process.cwd(), 'public', 'images', 'colombo images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const items = [
  {
    name: 'lotus-tower.jpg',
    url: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'gangaramaya.jpg',
    url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'galle-face.jpg',
    url: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'independence-memorial.jpg',
    url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'red-mosque.jpg',
    url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/SL_Colombo_asv2020-01_img22_Jami_Ul-Alfar_Mosque.jpg/1280px-SL_Colombo_asv2020-01_img22_Jami_Ul-Alfar_Mosque.jpg'
  },
  {
    name: 'ministry-of-crab.jpg',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'upalis.jpg',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'dbu-lamprais.jpg',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'nuga-gama.jpg',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'shangri-la.jpg',
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'pettah-bus-stand.jpg',
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'makumbura-center.jpg',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'toyota-lanka.jpg',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'ceypetco-fuel.jpg',
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'lioc-fuel.jpg',
    url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'fuel-station-1.jpg',
    url: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'fuel-station-2.jpg',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80'
  }
];

async function run() {
  for (const item of items) {
    try {
      console.log(`Downloading ${item.name}...`);
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        const filePath = path.join(targetDir, item.name);
        fs.writeFileSync(filePath, buf);
        console.log(`✓ Saved ${item.name} (${buf.length} bytes)`);
      } else {
        console.error(`HTTP ${res.status} for ${item.name}`);
      }
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
}

run();
