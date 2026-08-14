import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import './generate_favicons.mjs';

const logoSvg = fs.readFileSync('./public/logo.svg', 'utf-8');

// Convert all fills in logoSvg to white (#FFFFFF)
const whiteLogoSvg = logoSvg
  .replace(/fill="black"/g, 'fill="#FFFFFF"')
  .replace(/fill="url\(#paint[0-9]_linear_[0-9_]+\)"/g, 'fill="#FFFFFF"');

// Extract the path content inside <svg ...> ... </svg>
const innerContent = whiteLogoSvg
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>/, '');

// Create full 1200x630 SVG with dark background (#09090B) and centered logo
const ogSvg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#18181B" />
      <stop offset="100%" stop-color="#09090B" />
    </radialGradient>
  </defs>
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGlow)"/>
  
  <!-- Subtle border line around edge for high contrast in dark mode previewers -->
  <rect x="1" y="1" width="1198" height="628" fill="none" stroke="#27272A" stroke-width="2" rx="0"/>
  
  <!-- Centered Logo -->
  <g transform="translate(307.4, 284.2) scale(2.2)">
    ${innerContent}
  </g>
</svg>
`;

const buffer = Buffer.from(ogSvg);

// Generate Primary PNG OG Image (1200x630)
await sharp(buffer).png().toFile(path.resolve('./public/og-image.png'));

// Generate Optional WebP OG Image
await sharp(buffer).webp().toFile(path.resolve('./public/og-image.webp'));

console.log('Saved og-image.png (primary) & og-image.webp (optional) successfully');
