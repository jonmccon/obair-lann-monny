import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// Homepage narrative rebuild (PR2, 2026-11-17): the old Three.js WebGL
// headline billboard + DOM-headline fallback scaffolding
// (data-chart-headline / home-axis-headline-text) was replaced by a
// single, always-visible <h1> -- the approved hero line from the vault
// copy doc, rendered server-side with no JS fallback needed.
describe('homepage headline', () => {
  const html = readFileSync('_site/index.html', 'utf8');
  // Use JSDOM (not a raw string/regex match) for the <h1> count -- the
  // site's own inline CSS carries a comment that contains the literal
  // text "<h1>" (describing the now-removed WebGL billboard fallback),
  // which a plain string/regex match would miscount as a second heading.
  const document = new JSDOM(html).window.document;

  it('renders exactly one <h1> on the homepage, with the approved hero line', () => {
    const h1Elements = document.querySelectorAll('h1');
    assert.equal(h1Elements.length, 1, `expected exactly one <h1>, found ${h1Elements.length}`);
    assert.deepEqual(
      [...h1Elements[0].querySelectorAll('.home-hero-line')].map(line => line.textContent.trim()),
      [
        'I work where you work: in the field, on the sales floor, in the emergency room.',
        'I build what’s missing, from first research to something your team can run without me.',
      ]
    );
  });

  it('does not render the old Three.js WebGL headline/canvas scaffolding', () => {
    // Query actual DOM elements/attributes, not raw substrings -- the
    // orphaned (PR3-scope) CSS for the old hero still defines rules like
    // ".home-axis-headline-text { ... }" in the inlined <style> block,
    // so a plain string match on the class NAME would false-positive on
    // dead CSS that no longer matches any element.
    assert.equal(document.querySelectorAll('[data-chart-headline]').length, 0, 'stale data-chart-headline overlay element still present');
    assert.equal(document.querySelectorAll('.home-axis-headline-text').length, 0, 'stale .home-axis-headline-text element still present');
    assert.equal(document.querySelectorAll('[data-axis-canvas]').length, 0, 'stale WebGL canvas ([data-axis-canvas]) element still present');
    assert.ok(!html.includes('esm.sh/three'), 'stale Three.js esm.sh module import still present');
  });
});
