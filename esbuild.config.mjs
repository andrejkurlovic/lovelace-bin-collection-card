// Bundles src/index.ts into a single file at the repo root, preserving the
// filename HACS already points at (hacs.json: filename + content_in_root).
import { build, context } from 'esbuild';
import { readFileSync } from 'node:fs';

const watch = process.argv.includes('--watch');
const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

const options = {
  entryPoints: ['src/index.ts'],
  outfile: 'lovelace-bin-collection-card.js',
  bundle: true,
  format: 'esm',
  target: 'es2021',
  minify: !watch,
  sourcemap: watch ? 'inline' : false,
  legalComments: 'none',
  banner: {
    js: `/* lovelace-bin-collection-card v${version} — https://github.com/andrejkurlovic/lovelace-bin-collection-card */`,
  },
};

if (watch) {
  const ctx = await context(options);
  await ctx.watch();
  console.log('esbuild watching for changes...');
} else {
  await build(options);
  console.log('Built lovelace-bin-collection-card.js');
}
