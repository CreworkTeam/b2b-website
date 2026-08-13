import fs from 'fs';
import path from 'path';

const PUBLIC_DIR = './public';
const PNG_DEST_DIR = './public/png';
const EXTS_TO_MOVE = ['.png', '.jpg', '.jpeg', '.svg'];

if (!fs.existsSync(PNG_DEST_DIR)) {
  fs.mkdirSync(PNG_DEST_DIR, { recursive: true });
}

function getFilesToMove(dir, arrayOfFiles = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (path.resolve(fullPath).startsWith(path.resolve(PNG_DEST_DIR))) {
      return;
    }

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getFilesToMove(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (EXTS_TO_MOVE.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const filesToMove = getFilesToMove(PUBLIC_DIR);
console.log(`Found ${filesToMove.length} non-webp image files to relocate to ${PNG_DEST_DIR}...`);

const movedMap = [];

for (const sourcePath of filesToMove) {
  const relativePath = path.relative(PUBLIC_DIR, sourcePath);
  const destPath = path.join(PNG_DEST_DIR, relativePath);

  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.renameSync(sourcePath, destPath);

  const oldUrl = '/' + relativePath.replace(/\\/g, '/');
  const newUrl = '/png' + oldUrl;
  movedMap.push({ oldUrl, newUrl });
  console.log(`Moved: ${oldUrl} -> ${newUrl}`);
}

console.log(`\nRelocated ${movedMap.length} files into public/png/. Now updating code references...`);

const SRC_DIR = './src';

function getSourceFiles(dir, arrayOfFiles = []) {
  if (!fs.existsSync(dir)) return arrayOfFiles;
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getSourceFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.astro', '.tsx', '.ts', '.jsx', '.js', '.md'].includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

const sourceFiles = getSourceFiles(SRC_DIR);
let updatedFilesCount = 0;

for (const srcFile of sourceFiles) {
  let content = fs.readFileSync(srcFile, 'utf-8');
  let originalContent = content;

  for (const { oldUrl, newUrl } of movedMap) {
    if (content.includes(oldUrl)) {
      content = content.replaceAll(oldUrl, newUrl);
    }
  }

  if (content !== originalContent) {
    fs.writeFileSync(srcFile, content, 'utf-8');
    console.log(`Updated refs in: ${srcFile}`);
    updatedFilesCount++;
  }
}

console.log(`\n🎉 Completed relocation and updated references in ${updatedFilesCount} source files!`);
