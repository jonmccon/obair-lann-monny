import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve('content/resume.njk'), 'utf8');

describe('Resume print layout', () => {
  it('uses fragmentable columns instead of a grid', () => {
    const printStart = source.indexOf('@media print');
    const printEnd = source.indexOf('{% endcss %}', printStart);
    assert.ok(printStart >= 0 && printEnd > printStart, 'resume print styles exist');
    const printStyles = source.slice(printStart, printEnd);

    assert.match(printStyles, /\.resume-body\s*{\s*display:\s*block;/);
    assert.match(printStyles, /\.resume-main-col\s*{[^}]*float:\s*left;[^}]*width:\s*calc\(100% - 2\.65in\);/s);
    assert.match(printStyles, /\.resume-side-col\s*{[^}]*float:\s*right;[^}]*width:\s*2\.2in;/s);
  });
});
