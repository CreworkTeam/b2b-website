import fs from 'fs';
import path from 'path';
import https from 'https';

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks = [];
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
            fs.writeFileSync(filePath, new Uint8Array(buffer));
            console.log(`[Assets Init] Saved ${fileName}`);
          }
        }
      }
    }

    // Ensure favicon.ico and PNG favicons exist for Google Docs, Notion, & legacy crawlers
    const publicDir = path.resolve(cwd, 'public');
    const faviconIco = path.join(publicDir, 'favicon.ico');
    const favicon32 = path.join(publicDir, 'favicon-32x32.png');
    const favicon16 = path.join(publicDir, 'favicon-16x16.png');
    const appleIcon = path.join(publicDir, 'apple-touch-icon.png');
    const sourceWebp = path.join(publicDir, 'favicon.webp');

    if (fs.existsSync(sourceWebp)) {
      if (!fs.existsSync(faviconIco)) fs.copyFileSync(sourceWebp, faviconIco);
      if (!fs.existsSync(favicon32)) fs.copyFileSync(sourceWebp, favicon32);
      if (!fs.existsSync(favicon16)) fs.copyFileSync(sourceWebp, favicon16);
      if (!fs.existsSync(appleIcon)) fs.copyFileSync(sourceWebp, appleIcon);
    }

    // Ensure og-image.png and opengraph.png exist for social crawlers requiring PNG format
    const ogPng = path.join(publicDir, 'og-image.png');
    const ogWebp = path.join(publicDir, 'og-image.webp');
    const openGraphPng = path.join(publicDir, 'opengraph.png');
    const openGraphWebp = path.join(publicDir, 'opengraph.webp');

    if (fs.existsSync(ogWebp) && !fs.existsSync(ogPng)) {
      fs.copyFileSync(ogWebp, ogPng);
    }
    if (fs.existsSync(openGraphWebp) && !fs.existsSync(openGraphPng)) {
      fs.copyFileSync(openGraphWebp, openGraphPng);
    }
  } catch (err) {
    console.error('[Assets Init Error]', err);
  }
}

// Execute immediately when imported by astro.config.mjs or dev server
ensureLocalAssets().catch(err => console.error(err));
