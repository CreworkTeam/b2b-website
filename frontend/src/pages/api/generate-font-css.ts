import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { Buffer } from 'node:buffer';

function fetchUrl(url: string, headers: Record<string, string> = {}): Promise<{ text: string }> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, headers).then(resolve).catch(reject);
      }
      const chunks: any[] = [];
      res.on('data', (chunk: any) => chunks.push(chunk));
      res.on('end', () => resolve({ text: Buffer.concat(chunks).toString('utf8') }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

export const GET: APIRoute = async () => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  // Fetch the CSS that Google serves, then rewrite URLs to local paths
  const families = [
    { query: 'Chakra+Petch:wght@300;400;500;600;700', dir: 'chakra-petch', prefix: 'chakra-petch' },
    { query: 'Inter:wght@100..900', dir: 'inter', prefix: 'inter' },
    { query: 'Instrument+Serif:ital@0;1', dir: 'instrument-serif', prefix: 'instrument-serif' },
  ];

  const founderFamilies = [
    ...families,
    { query: 'DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500', dir: 'dm-mono', prefix: 'dm-mono' },
    { query: 'Manrope:wght@200..800', dir: 'manrope', prefix: 'manrope' },
    { query: 'Space+Grotesk:wght@300..700', dir: 'space-grotesk', prefix: 'space-grotesk' },
  ];

  async function buildFontFaces(fontList: typeof families): Promise<string> {
    let allFontFaces = '';

    for (const font of fontList) {
      const cssUrl = `https://fonts.googleapis.com/css2?family=${font.query}&display=swap`;
      const { text: css } = await fetchUrl(cssUrl, { 'User-Agent': userAgent });

      // Parse @font-face blocks and rewrite URLs
      const fontBlockRegex = /@font-face\s*\{[^}]+\}/g;
      let match;
      let fileIndex = 0;

      while ((match = fontBlockRegex.exec(css)) !== null) {
        let block = match[0];
        // Extract weight and style for filename matching
        const weightMatch = block.match(/font-weight:\s*(\d+)/);
        const styleMatch = block.match(/font-style:\s*(\w+)/);
        const weight = weightMatch ? weightMatch[1] : 'var';
        const style = styleMatch ? styleMatch[1] : 'normal';

        // Replace the Google CDN URL with a local path
        const localFile = `${font.prefix}-${weight}-${style}-${fileIndex}.woff2`;
        block = block.replace(
          /src:\s*url\(https:\/\/[^)]+\.woff2\)\s*format\('woff2'\)/,
          `src: url('/fonts/${font.dir}/${localFile}') format('woff2')`
        );

        allFontFaces += block + '\n\n';
        fileIndex++;
      }
    }

    return allFontFaces;
  }

  try {
    const mainFontFaces = await buildFontFaces(families);
    const founderFontFaces = await buildFontFaces(founderFamilies);

    return new Response(JSON.stringify({
      success: true,
      main: mainFontFaces,
      founder: founderFontFaces,
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
