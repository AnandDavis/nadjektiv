/**
 * Generates the PWA icons in public/icons from scripts/icon.svg.
 * Run with `npm run icons` after changing the SVG; the PNGs are committed.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const svg = await readFile(new URL('./icon.svg', import.meta.url));
const out = new URL('../public/icons/', import.meta.url);
await mkdir(out, { recursive: true });

const sizes = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];
for (const { name, size } of sizes) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(fileURLToPath(new URL(name, out)));
}

// Maskable: full-bleed background with the glyph inside the 80% safe zone.
const maskable = await sharp(svg).resize(400, 400).png().toBuffer();
await sharp({ create: { width: 512, height: 512, channels: 4, background: '#e8a317' } })
  .composite([{ input: maskable, top: 56, left: 56 }])
  .png()
  .toFile(fileURLToPath(new URL('icon-maskable-512.png', out)));

await writeFile(new URL('../src/app/icon.svg', import.meta.url), svg);
console.log('Icons written to public/icons and src/app/icon.svg');
