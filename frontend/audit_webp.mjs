import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const PUBLIC_DIR = './public';

function getFiles(dir, exts, arrayOfFiles = []) {
  if (!fs.existsSync(dir)) return arrayOfFiles;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getFiles(fullPath, exts, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (exts.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const sourceFiles = getFiles(SRC_DIR, ['.astro', '.tsx', '.ts', '.jsx', '.js', '.md']);

const imgRegex = /(['"`(/])(\/?[^'"\`()\s,]+\.(webp|png|jpg|jpeg|svg))(['"`)\s,])/gi;

let totalRefsFound = 0;
let webpRefsFound = 0;
let missingWebpFiles = [];
let nonWebpLocalRefs = [];
let fixedFilesCount = 0;

for (const filePath of sourceFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  let matches;

  while ((matches = imgRegex.exec(content)) !== null) {
    const rawPath = matches[2];
    // Skip external http/https/cloudinary URLs
    if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
      continue;
    }

    totalRefsFound++;
    const ext = path.extname(rawPath).toLowerCase();
    const cleanPath = rawPath.startsWith('/') ? rawPath.slice(1) : rawPath;
    const publicPath = path.join(PUBLIC_DIR, cleanPath);

    if (ext === '.webp') {
      webpRefsFound++;
      if (!fs.existsSync(publicPath)) {
        missingWebpFiles.push({ file: filePath, ref: rawPath, expected: publicPath });
      }
    } else {
      // Check if a webp version exists in public/ for this non-webp ref
      const baseName = path.basename(cleanPath, ext);
      const dirName = path.dirname(cleanPath);
      const webpPathInPublic = path.join(PUBLIC_DIR, dirName, `${baseName}.webp`);
      const webpUrl = `${dirName === '.' ? '' : '/' + dirName.replace(/\\/g, '/')}/${baseName}.webp`;

      if (fs.existsSync(webpPathInPublic)) {
        // We can fix this reference to webp!
        content = content.replace(rawPath, webpUrl);
        nonWebpLocalRefs.push({ file: filePath, ref: rawPath, fixedTo: webpUrl });
      } else {
        nonWebpLocalRefs.push({ file: filePath, ref: rawPath, fixedTo: null });
      }
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixedFilesCount++;
  }
}

console.log('=== WEBP & IMAGE AUDIT REPORT ===');
console.log(`Total Source Files Scanned: ${sourceFiles.length}`);
console.log(`Total Image References Found: ${totalRefsFound}`);
console.log(`WebP References Found: ${webpRefsFound}`);
console.log(`Missing WebP Files: ${missingWebpFiles.length}`);
console.log(`Files Auto-Fixed to WebP: ${fixedFilesCount}`);

if (missingWebpFiles.length > 0) {
  console.log('\n⚠️ MISSING WEBP FILES:');
  missingWebpFiles.forEach(m => console.log(`  - In ${m.file}: ${m.ref} (not found at ${m.expected})`));
}

if (nonWebpLocalRefs.length > 0) {
  console.log('\nℹ️ NON-WEBP LOCAL REFERENCES:');
  nonWebpLocalRefs.forEach(n => console.log(`  - In ${n.file}: ${n.ref} ${n.fixedTo ? '-> fixed to ' + n.fixedTo : '(no webp file in public)'}`));
}
