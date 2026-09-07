import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { importedWorks } from '../lib/work-images.ts';
import { workCovers } from '../lib/work-covers.ts';
import { compareWorks } from '../lib/work-order.ts';
import exclusions from './work-exclusions.json' with { type: 'json' };

for (const work of importedWorks) {
  assert(existsSync(new URL('../public' + work.src, import.meta.url)), `Missing preview: ${work.id}`);
  assert(work.width > 0 && work.height > 0);
  assert(!('originalSrc' in work) && !('originalWidth' in work) && !('originalHeight' in work), `Unused original data: ${work.id}`);
  assert(!/\.(png|webp|jpe?g)$/i.test(work.title), `Raw filename visible: ${work.id}`);
}
for (const [category, names] of Object.entries(exclusions)) {
  for (const name of names) assert(!importedWorks.some(work => work.category === category && work.sourceName === name), `Excluded work returned: ${name}`);
}
assert(!importedWorks.some(work => work.id === 'campaign-design-030'), 'The selected vertical social visual must remain removed');
assert(!existsSync(new URL('../public/work-original', import.meta.url)), 'Original copies must not be included in public assets');
const gallerySource = readFileSync(new URL('../components/portfolio-works.tsx', import.meta.url), 'utf8');
assert(!/originalSrc|openImage|image-dialog|ZoomIn|ZoomOut|<Dialog/.test(gallerySource), 'Original-image interaction must remain removed');
assert(gallerySource.includes('work-art gallery-image'), 'Artwork must use a non-interactive image container');
const galleryCss = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
assert.match(galleryCss, /\.section-social \.gallery-image\.ratio-16-9\s*\{[^}]*aspect-ratio:1\/1!important/);
assert.match(galleryCss, /\.section-social \.gallery-image\.ratio-16-9 img\s*\{[^}]*object-fit:contain/);
assert.doesNotMatch(galleryCss, /\.section-social \.gallery-image\.ratio-1-1\s*\{/);
for (const cover of workCovers) for (const src of cover.images) assert(existsSync(new URL('../public' + src, import.meta.url)));
const achino = workCovers.find(c => c.id === 'campaign-design-02');
assert.equal(achino?.title, '鳴潮x阿奇儂');
assert(achino.images.length >= 2, '阿奇儂 cover must include multiple frames for hover switching');
assert.equal(new Set(achino.images).size, achino.images.length, 'Carousel frames must use distinct image paths');
assert.deepEqual(workCovers.filter(c => c.category === 'advertising-banners').map(c => c.title), ['以閃亮之名', '運命逆転', '갈락티코', 'ワルキューレの試練']);
const summary = {};
for (const category of ['advertising-banners', 'social-campaign']) {
  const works = importedWorks.filter(w => w.category === category).sort(compareWorks);
  const years = works.map(w => Number(w.year) || -1);
  assert(years.every((year, i) => i === 0 || years[i - 1] >= year));
  const examples = [{year:'2024',sourceName:'detail_10'}, {year:'—',sourceName:'detail_1'}, {year:'2026',sourceName:'detail_1'}, {year:'2024',sourceName:'detail_2'}].map(w => ({...w,category}));
  assert.deepEqual(examples.sort(compareWorks).map(w => w.sourceName + ':' + w.year), ['detail_1:2026','detail_2:2024','detail_10:2024','detail_1:—']);
  summary[category] = {count:works.length,years:[...new Set(works.map(w => w.year))]};
}
console.log(JSON.stringify({total:importedWorks.length,covers:workCovers.length,summary},null,2));
