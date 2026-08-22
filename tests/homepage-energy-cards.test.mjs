import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('homepage energy cards', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('renders at least one energy card', () => {
    assert.ok(html.includes('energy-card'), 'no energy card elements found');
  });

  it('does not render old home-featured-row DOM elements', () => {
    // Check for the DOM element/attribute, not just the CSS class string
    // CSS may still define .home-featured-row but the markup elements should be gone
    assert.ok(
      !html.includes('class="home-featured-row'),
      'old home-featured-row class still on DOM elements — energy cards may not have replaced them'
    );
  });

  it('renders at least two different card energy types', () => {
    const types = ['energy-card--loud', 'energy-card--quiet', 'energy-card--image', 'energy-card--badge', 'energy-card--artifact'];
    const found = types.filter(t => html.includes(t));
    assert.ok(found.length >= 2, `Only ${found.length} card type(s) rendered — need at least 2`);
  });
});
