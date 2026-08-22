import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('homepage headline', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('contains the new position statement headline', () => {
    assert.ok(
      html.includes('The work has its own energy'),
      'headline not found in rendered HTML'
    );
  });

  it('does not contain the old intersection headline', () => {
    assert.ok(
      !html.includes('Operating at the intersection'),
      'old headline still present'
    );
  });
});