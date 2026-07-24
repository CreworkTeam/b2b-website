import fs from 'fs';
import path from 'path';
import https from 'https';

const FONT_DIR = './public/fonts/chakra-petch';

if (!fs.existsSync(FONT_DIR)) {
  fs.mkdirSync(FONT_DIR, { recursive: true });
}

const cssUrl = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&display=swap';

function fetchUrl(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), text: Buffer.concat(chunks).toString('utf8'), headers: res.headers }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching Google Fonts CSS...');
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
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
      const filePath = path.join(FONT_DIR, fileName);
      console.log(`Downloading weight ${weight} from ${fontUrl} -> ${filePath}`);
      const { buffer } = await fetchUrl(fontUrl);
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved ${fileName} (${buffer.length} bytes)`);
    }
  }
  console.log('Font download complete!');
}

run().catch(err => {
  console.error('Error downloading fonts:', err);
  process.exit(1);
});
