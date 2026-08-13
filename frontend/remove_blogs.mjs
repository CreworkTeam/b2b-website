import fs from 'fs';
import path from 'path';

const BLOGS_DIR = './src/content/blogs';
const filesToRemove = [
  'How to Validate Your Startup Idea Before Spending Money.md',
  'No-Code MVP vs Custom Development.md',
  'How to Get Your First Users in 2025.md',
  'How to Build an MVP in 2025 That Launches in Weeks and Not Months.md',
  'Subreddits for aspiring and full-time founders.md',
  'Decoding MVP and how to build it.md',
  'How To Ace Marketing On Reddit.md'
];

for (const file of filesToRemove) {
  const filePath = path.join(BLOGS_DIR, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${file}`);
  } else {
    console.log(`Not found: ${file}`);
  }
}

console.log('Finished removing specified articles.');
