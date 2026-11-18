import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Homepage narrative rebuild (PR2, 2026-11-17): the Three.js radial-clock
// chart ("homepage-axis-hero") was replaced by the hero + bio + 7
// narrative case-study blocks. These assertions replace the old
// data-chart-*/data-axis-canvas checks with checks for the new block
// structure and the data-project-slug/data-project-tags hooks the
// 2026-11-11 handoff's deferred query-param work (Coordination A.3)
// still needs.
describe('homepage narrative blocks', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('does not render the old Three.js WebGL canvas target', () => {
    assert.ok(!html.includes('data-axis-canvas'), 'stale data-axis-canvas WebGL target still present');
  });

  it('does not render the old radial-chart data attributes', () => {
    assert.ok(!html.includes('data-chart-duration'), 'stale data-chart-duration attribute still present');
    assert.ok(!html.includes('data-chart-collaboration'), 'stale data-chart-collaboration attribute still present');
    assert.ok(!html.includes('data-chart-medium'), 'stale data-chart-medium attribute still present');
  });

  it('renders all 7 case-study blocks with data-project-slug + data-project-tags hooks', () => {
    const slugs = [
      'priority-tax-relief',
      'seattle-creative-directory',
      'android-gemini',
      'resonance-ai',
      'pwc',
      'lumedic',
      'providence',
    ];
    for (const slug of slugs) {
      assert.ok(html.includes(`data-project-slug="${slug}"`), `data-project-slug missing for ${slug}`);
    }
    assert.ok(/data-project-tags="[^"]*"/.test(html), 'no data-project-tags attribute found');
  });

  it('renders sequence indicators 01 / 07 through 07 / 07', () => {
    for (let i = 1; i <= 7; i++) {
      const seq = `${String(i).padStart(2, '0')} / 07`;
      assert.ok(html.includes(seq), `sequence indicator "${seq}" not found`);
    }
  });
});
