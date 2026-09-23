import fs from 'fs';
import path from 'path';

const parentDir = path.join(process.cwd(), 'public', 'images');
const targetDir = path.join(parentDir, 'colombo images');

// If 'colombo images' exists and is a file, remove it first
if (fs.existsSync(targetDir)) {
  const stat = fs.statSync(targetDir);
  if (!stat.isDirectory()) {
    fs.unlinkSync(targetDir);
    fs.mkdirSync(targetDir, { recursive: true });
  }
} else {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = fs.readdirSync(parentDir);

for (const file of files) {
  if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
    const srcPath = path.join(parentDir, file);
    const destPath = path.join(targetDir, file);
    fs.copyFileSync(srcPath, destPath);
    fs.unlinkSync(srcPath);
    console.log(`✓ Moved ${file} -> public/images/colombo images/${file}`);
  }
}

console.log('🎉 Successfully moved all images into public/images/colombo images/');
