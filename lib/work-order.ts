import type { Work } from './works';

const filenameOrder = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
const newestFirstCategories = new Set(['advertising-banners', 'social-campaign']);

export function compareWorks(a: Work, b: Work): number {
  if (a.category === b.category && newestFirstCategories.has(a.category)) {
    const year = (value: string) => /^\d{4}$/.test(value) ? Number(value) : -1;
    const difference = year(b.year) - year(a.year);
    if (difference) return difference;
  }
  return filenameOrder.compare(a.sourceName ?? a.title, b.sourceName ?? b.title);
}
