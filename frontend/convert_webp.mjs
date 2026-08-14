import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = './public';
const ALLOWED_EXTS = ['.png', '.jpg', '.jpeg', '.svg'];

if (fs.existsSync('./public/favicon.webp')) {
  if (!fs.existsSync('./public/favicon.ico')) fs.copyFileSync('./public/favicon.webp', './public/favicon.ico');
  if (!fs.existsSync('./public/favicon-32x32.png')) fs.copyFileSync('./public/favicon.webp', './public/favicon-32x32.png');
  if (!fs.existsSync('./public/favicon-16x16.png')) fs.copyFileSync('./public/favicon.webp', './public/favicon-16x16.png');
  if (!fs.existsSync('./public/apple-touch-icon.png')) fs.copyFileSync('./public/favicon.webp', './public/apple-touch-icon.png');
}

if (fs.existsSync('./public/og-image.webp') && !fs.existsSync('./public/og-image.png')) {
  fs.copyFileSync('./public/og-image.webp', './public/og-image.png');
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ALLOWED_EXTS.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

async function convertImages() {
  console.log('Starting recursive WebP conversion in public directory...');
  const allImages = getAllFiles(PUBLIC_DIR);
  let totalSavedBytes = 0;
  let convertedCount = 0;

  for (const inputPath of allImages) {
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const baseName = path.basename(inputPath, ext);
    const outputPath = path.join(dir, `${baseName}.webp`);

    // Skip if output file already exists and is newer than input file
    if (fs.existsSync(outputPath)) {
      const inputStat = fs.statSync(inputPath);
      const outputStat = fs.statSync(outputPath);
      if (outputStat.mtimeMs >= inputStat.mtimeMs) {
        continue;
      }
    }

    try {
      const oldSize = fs.statSync(inputPath).size;
      // Skip tiny files under 5KB
      if (oldSize < 5000) continue;

      console.log(`Converting: ${inputPath} -> ${baseName}.webp...`);

      await sharp(inputPath)
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      const saved = oldSize - newSize;
      if (saved > 0) {
        totalSavedBytes += saved;
      }
      convertedCount++;
      const reduction = (((oldSize - newSize) / oldSize) * 100).toFixed(1);
      console.log(`✅ ${baseName}.webp (${(oldSize / 1024 / 1024).toFixed(2)}MB -> ${(newSize / 1024).toFixed(1)}KB, ${reduction}% smaller)`);
    } catch (err) {
      console.error(`⚠️ Could not convert ${inputPath}:`, err.message);
    }
  }

  console.log(`\n🎉 WebP conversion complete!`);
  console.log(`Converted ${convertedCount} images.`);
  console.log(`Total storage saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB!`);
}

convertImages().catch((err) => {
  console.error('Error during WebP conversion:', err);
  process.exit(1);
});
