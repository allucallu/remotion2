import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';

async function main() {
  console.log('1. Bundling code once...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve('src/index.ts'),
    webpackOverride: (config) => config,
  });
  console.log('Bundled at:', bundleLocation);

  console.log('2. Selecting MV composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'MV',
  });

  const targets = [
    { frame: 915, output: 'out/preview/still-2-grup-2-baris.png', label: 'Grup 2 baris (right-block)' },
    { frame: 2505, output: 'out/preview/still-3-baris-terpanjang-split.png', label: 'Baris terpanjang (split + emphasis)' },
    { frame: 360, output: 'out/preview/still-4-emphasis-leftblock.png', label: 'Baris dengan emphasis (left-block)' },
  ];

  for (const t of targets) {
    console.log(`Rendering frame ${t.frame} (${t.label})...`);
    await renderStill({
      composition,
      serveUrl: bundleLocation,
      output: path.resolve(t.output),
      frame: t.frame,
    });
    console.log(`+ ${t.output}`);
  }

  console.log('Semua still preview berhasil dirender!');
}

main().catch((err) => {
  console.error('Error rendering preview stills:', err);
  process.exit(1);
});

