import { readdir, stat } from 'node:fs/promises';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const assetsDirectory = join(process.cwd(), 'src', 'assets');
const files = (await readdir(assetsDirectory))
  .filter((file) => file.toLowerCase().endsWith('.png'));

for (const file of files) {
  const input = join(assetsDirectory, file);
  const output = join(assetsDirectory, `${parse(file).name}.webp`);
  const before = (await stat(input)).size;

  await sharp(input)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  const after = (await stat(output)).size;
  console.log(`${file} -> ${parse(file).name}.webp (${before} bytes -> ${after} bytes)`);
}
