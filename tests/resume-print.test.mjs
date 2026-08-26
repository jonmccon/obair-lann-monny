import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = readFileSync(resolve('content/resume.njk'), 'utf8');
const printStyles = source.slice(source.indexOf('@media print'), source.indexOf('{% endcss %}'));

describe('Resume print layout', () => {
  it('uses fragmentable columns instead of a grid', () => {
    assert.match(printStyles, /\.resume-body\s*{\s*display:\s*block;/);
    assert.match(printStyles, /\.resume-main-col\s*{[^}]*float:\s*left;[^}]*width:\s*calc\(100% - 2\.65in\);/s);
    assert.match(printStyles, /\.resume-side-col\s*{[^}]*float:\s*right;[^}]*width:\s*2\.2in;/s);
  });
});
