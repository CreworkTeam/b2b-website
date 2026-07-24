import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = './public';
const filesToConvert = [
  'Nail-Found-Admin.png',
  'Nail-Found-Artist-Profiles.png',
  'Nail-Found-Main-Logo.png',
  'Nail-Found-Onboarding.png',
  'Nail-Found-Project-Outcomes.png',
  'Nail-Found-Save-Revisit.png',
  'Nail-Found-VDG.png',
  'Walmart.png',
  'hero.jpg',
  'opengraph.png'
];

async function convertImages() {
  console.log('Starting WebP conversion...');
  for (const file of filesToConvert) {
    const inputPath = path.join(PUBLIC_DIR, file);
    if (!fs.existsSync(inputPath)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const outputPath = path.join(PUBLIC_DIR, `${baseName}.webp`);

    console.log(`Converting ${file} -> ${baseName}.webp...`);
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);

    const oldSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const reduction = (((oldSize - newSize) / oldSize) * 100).toFixed(1);
    console.log(`Converted ${baseName}.webp (${oldSize} bytes -> ${newSize} bytes, ${reduction}% smaller)`);
  }
  console.log('WebP conversion completed successfully!');
}

convertImages().catch(err => {
  console.error('Error during WebP conversion:', err);
  process.exit(1);
});
