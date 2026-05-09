import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const workspaceRoot = process.cwd();
const candidateRoots = [
  path.join(workspaceRoot, 'dist', 'demo', 'browser'),
  path.join(workspaceRoot, 'dist', 'demo'),
];

const pagesRoot = path.join(workspaceRoot, 'dist', 'github-pages');

const sourceRoot = await findSourceRoot();
const indexHtml = await readFile(path.join(sourceRoot, 'index.html'), 'utf8');

await rm(pagesRoot, { force: true, recursive: true });
await mkdir(pagesRoot, { recursive: true });
await cp(sourceRoot, pagesRoot, { recursive: true });
await writeFile(path.join(pagesRoot, '.nojekyll'), '');
await writeFile(path.join(pagesRoot, '404.html'), indexHtml);

console.log(`Prepared GitHub Pages artifact at ${path.relative(workspaceRoot, pagesRoot)}`);

async function findSourceRoot() {
  for (const candidate of candidateRoots) {
    try {
      await readFile(path.join(candidate, 'index.html'), 'utf8');
      return candidate;
    } catch {
      // try the next output folder
    }
  }

  throw new Error('Unable to locate demo build output. Run "ng build demo" before preparing Pages assets.');
}
