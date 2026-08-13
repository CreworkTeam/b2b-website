import fs from 'fs';
import path from 'path';

const SRC_DIR = './src';
const PUBLIC_DIR = './public';

function getFiles(dir, exts, arrayOfFiles = []) {
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

const sourceFiles = getFiles(SRC_DIR, ['.md', '.astro', '.tsx', '.ts', '.jsx', '.js']);
let updatedCount = 0;

for (const filePath of sourceFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Match local image paths ending in .png, .jpg, .jpeg, .svg
  content = content.replace(/(['"(/]\S+?)\.(png|jpg|jpeg|svg)(['")\s\?])/gi, (match, prefix, ext, suffix) => {
    // Exclude favicon or external logo svgs if no webp exists
    const cleanPath = prefix.replace(/^https?:\/\/[^\/]+/, '');
    const relativePublicPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
    const webpPathInPublic = path.join(PUBLIC_DIR, `${relativePublicPath}.webp`);

    if (fs.existsSync(webpPathInPublic)) {
      return `${prefix}.webp${suffix}`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated WebP image refs in: ${filePath}`);
    updatedCount++;
  }
}

console.log(`\n🎉 Updated WebP references in ${updatedCount} source files!`);
