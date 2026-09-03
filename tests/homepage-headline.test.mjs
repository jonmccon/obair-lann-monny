import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('homepage headline', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('renders the headline overlay used by the Three.js billboard', () => {
    // The headline copy is data-driven, so assert on the WebGL headline
    // scaffolding rather than a specific string.
    assert.ok(
      html.includes('data-chart-headline'),
      'headline overlay ([data-chart-headline]) not found in rendered HTML'
    );
    assert.ok(
      html.includes('home-axis-headline-text'),
      'headline text element not found in rendered HTML'
    );
  });

  it('renders the WebGL chart canvas alongside the headline', () => {
    assert.ok(
      html.includes('data-axis-canvas'),
      'WebGL canvas ([data-axis-canvas]) not found in rendered HTML'
    );
  });
});
