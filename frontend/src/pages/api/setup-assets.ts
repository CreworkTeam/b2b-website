import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { Buffer } from 'node:buffer';

function fetchUrl(url: string, headers: Record<string, string> = {}): Promise<{ buffer: Buffer; text: string }> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks: any[] = [];
      res.on('data', (chunk: any) => chunks.push(chunk));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), text: Buffer.concat(chunks).toString('utf8') }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

interface FontConfig {
  family: string;
  weights: string;
  dir: string;
  prefix: string;
}

export const GET: APIRoute = async () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const results: string[] = [];
  const baseDir = path.resolve(process.cwd(), 'public/fonts');

  // All font families needed across the entire site
  const fonts: FontConfig[] = [
    { family: 'Chakra+Petch', weights: 'wght@300;400;500;600;700', dir: 'chakra-petch', prefix: 'chakra-petch' },
    { family: 'Inter', weights: 'wght@100..900', dir: 'inter', prefix: 'inter' },
    { family: 'Instrument+Serif', weights: 'ital@0;1', dir: 'instrument-serif', prefix: 'instrument-serif' },
    { family: 'DM+Mono', weights: 'ital,wght@0,300;0,400;0,500;1,300;1,400;1,500', dir: 'dm-mono', prefix: 'dm-mono' },
    { family: 'Manrope', weights: 'wght@200..800', dir: 'manrope', prefix: 'manrope' },
    { family: 'Space+Grotesk', weights: 'wght@300..700', dir: 'space-grotesk', prefix: 'space-grotesk' },
  ];

  try {
    for (const font of fonts) {
      const fontDir = path.join(baseDir, font.dir);
      if (!fs.existsSync(fontDir)) {
        fs.mkdirSync(fontDir, { recursive: true });
      }

      const cssUrl = `https://fonts.googleapis.com/css2?family=${font.family}:${font.weights}&display=swap`;
      const { text: css } = await fetchUrl(cssUrl, { 'User-Agent': userAgent });

      // Parse every @font-face block
      const fontBlockRegex = /@font-face\s*\{([^}]+)\}/g;
      let match;
      let fileIndex = 0;

      while ((match = fontBlockRegex.exec(css)) !== null) {
        const block = match[1];
        const urlMatch = block.match(/src:\s*url\((https:\/\/[^)]+\.woff2)\)/);
        const weightMatch = block.match(/font-weight:\s*(\d+)/);
        const styleMatch = block.match(/font-style:\s*(\w+)/);
        const rangeMatch = block.match(/unicode-range:\s*([^;]+)/);

        if (urlMatch) {
          const fontUrl = urlMatch[1];
          const weight = weightMatch ? weightMatch[1] : 'var';
          const style = styleMatch ? styleMatch[1] : 'normal';
          const subset = rangeMatch ? rangeMatch[1].trim() : '';

          // Create descriptive filename
          const fileName = `${font.prefix}-${weight}-${style}-${fileIndex}.woff2`;
          const filePath = path.join(fontDir, fileName);

          const { buffer } = await fetchUrl(fontUrl);
          fs.writeFileSync(filePath, buffer as any);
          results.push(`${font.dir}/${fileName} (${buffer.length} bytes, range: ${subset.substring(0, 30)}...)`);
          fileIndex++;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, count: results.length, results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message, partial: results }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
