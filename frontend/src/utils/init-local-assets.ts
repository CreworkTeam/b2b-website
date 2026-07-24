import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';

function fetchUrl(url: string, headers = {}): Promise<{ buffer: Buffer; text: string }> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks: Buffer[] = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), text: Buffer.concat(chunks).toString('utf8') }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

export async function ensureLocalAssets() {
  try {
    const cwd = process.cwd();
    const fontDir = path.resolve(cwd, 'public/fonts/chakra-petch');
    if (!fs.existsSync(fontDir)) {
      fs.mkdirSync(fontDir, { recursive: true });
    }

    const targetWeights = ['400', '500', '600', '700'];
    const missingWeights = targetWeights.filter(w => !fs.existsSync(path.join(fontDir, `chakra-petch-v1-${w}.woff2`)));

    if (missingWeights.length > 0) {
      console.log('[Assets Init] Downloading missing Chakra Petch font files:', missingWeights);
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
      const cssUrl = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap';

      const { text: css } = await fetchUrl(cssUrl, { 'User-Agent': userAgent });
      const fontBlockRegex = /@font-face\s*\{([^}]+)\}/g;
      let match;

      while ((match = fontBlockRegex.exec(css)) !== null) {
        const block = match[1];
        const weightMatch = block.match(/font-weight:\s*(\d+)/);
        const urlMatch = block.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/);

        if (weightMatch && urlMatch) {
          const weight = weightMatch[1];
          const fontUrl = urlMatch[1];
          const fileName = `chakra-petch-v1-${weight}.woff2`;
          const filePath = path.join(fontDir, fileName);

          if (!fs.existsSync(filePath)) {
            const { buffer } = await fetchUrl(fontUrl);
            fs.writeFileSync(filePath, buffer);
            console.log(`[Assets Init] Saved ${fileName}`);
          }
        }
      }
    }

    // WebP image conversion for target large public images
    const publicDir = path.resolve(cwd, 'public');
    const imagesToOptimize = [
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

    for (const file of imagesToOptimize) {
      const inputPath = path.join(publicDir, file);
      if (fs.existsSync(inputPath)) {
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const webpPath = path.join(publicDir, `${baseName}.webp`);

        if (!fs.existsSync(webpPath)) {
          console.log(`[Assets Init] Converting ${file} to WebP...`);
          await sharp(inputPath).webp({ quality: 80 }).toFile(webpPath);
          console.log(`[Assets Init] Generated ${baseName}.webp`);
        }
      }
    }
  } catch (err) {
    console.error('[Assets Init Error]', err);
  }
}
