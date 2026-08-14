import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const SVG_PATH = './public/favicon.svg';

async function generateFavicons() {
  console.log('Generating PNG & ICO favicons from favicon.svg...');
  
  if (!fs.existsSync(SVG_PATH)) {
    console.error('favicon.svg not found!');
    return;
  }

  try {
    // Generate 32x32 PNG for favicon-32x32.png
    await sharp(SVG_PATH)
      .resize(32, 32)
      .toFormat('png')
      .toFile('./public/favicon-32x32.png');

    // Generate 16x16 PNG for favicon-16x16.png
    await sharp(SVG_PATH)
      .resize(16, 16)
      .toFormat('png')
      .toFile('./public/favicon-16x16.png');

    // Generate 180x180 PNG for apple-touch-icon.png
    await sharp(SVG_PATH)
      .resize(180, 180)
      .toFormat('png')
      .toFile('./public/apple-touch-icon.png');

    // Generate 32x32 PNG as ./public/favicon.ico
    await sharp(SVG_PATH)
      .resize(32, 32)
      .toFormat('png')
      .toFile('./public/favicon.ico');

    console.log('Successfully generated all favicons: favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png');
  } catch (err) {
    console.error('Error generating favicons with sharp, creating fallback copies:', err);
    if (fs.existsSync('./public/favicon.webp')) {
      fs.copyFileSync('./public/favicon.webp', './public/favicon.ico');
      fs.copyFileSync('./public/favicon.webp', './public/favicon-32x32.png');
      fs.copyFileSync('./public/favicon.webp', './public/favicon-16x16.png');
      fs.copyFileSync('./public/favicon.webp', './public/apple-touch-icon.png');
      console.log('Created fallback favicon.ico and PNG copies');
    }
  }
}

generateFavicons();
