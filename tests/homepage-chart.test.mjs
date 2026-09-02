import { readFileSync } from 'fs';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('homepage 3D chart', () => {
  const html = readFileSync('_site/index.html', 'utf8');

  it('renders the axis canvas (WebGL target)', () => {
    assert.ok(html.includes('data-axis-canvas'), 'data-axis-canvas WebGL target missing');
  });

  it('renders data-chart-duration on at least one project', () => {
    assert.ok(html.includes('data-chart-duration'), 'no data-chart-duration attributes found');
  });

  it('renders data-chart-collaboration on at least one project', () => {
    assert.ok(html.includes('data-chart-collaboration'), 'no data-chart-collaboration attributes found');
  });

  it('renders data-chart-medium on at least one project', () => {
    assert.ok(html.includes('data-chart-medium'), 'no data-chart-medium attributes found');
  });

  it('uses new axis labels', () => {
    assert.ok(html.includes('solo'), 'new axis label "solo" not found');
    assert.ok(html.includes('team'), 'new axis label "team" not found');
    assert.ok(html.includes('technical'), 'new axis label "technical" not found');
    assert.ok(html.includes('visual'), 'new axis label "visual" not found');
    assert.ok(html.includes('duration'), 'new axis label "duration" not found');
  });
});
