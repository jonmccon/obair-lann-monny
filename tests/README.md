# Test Suite Documentation

This directory contains the comprehensive test suite for the obair-lann-monny Eleventy portfolio site.

## Test Coverage

**Total: 99 tests across 6 test files**
- ✅ 92 passing
- ⏭️ 7 skipped (intentionally)
- ❌ 0 failing

## Test Files

### High Priority Tests

#### 1. `filters.test.js` (42 tests)
Tests all custom Nunjucks filters defined in `eleventy.config.js`:
- `readableDate` - Date formatting with Luxon
- `htmlDateString` - HTML datetime attribute formatting
- `wordCount` - Word counting with HTML stripping
- `excerpt` - Content excerpting with word limits
- `stripHomepageMedia` - Media removal for homepage cards
- `head` - Array slicing utility
- `min` - Minimum value finder
- `getAllTags` - Tag collection from items
- `filterTagList` - Tag filtering (removes nav, all, post, etc.)
- `shuffle` - Array randomization
- `getRelatedProjects` - Related content by tags and dates

#### 2. `collections.test.js` (22 tests)
Tests Eleventy collection generation and filtering:
- `projects` - Design projects with images
- `featuredProjects` - Featured flag filtering
- `semiFeaturedProjects` - Semi-featured flag filtering
- `process` - Process tag filtering
- `aboutPages` - About page URL filtering
- `galleries` - Gallery collections with SKIP_GALLERIES support

### Medium Priority Tests

#### 3. `data-files.test.js` (5 tests)
Tests `_data` directory modules:
- `password.js` - Password protection system
- `metadata.js` - Site metadata
- `galleryPhotos.js` - Gallery photo metadata generation
- `photoCategories.js` - Photo category data
- `profile.js` - Profile data

#### 4. `drafts.test.js` (13 tests)
Tests draft/publish behavior from `eleventy.config.drafts.js`:
- `eleventyComputedPermalink` - Permalink generation for drafts
- `eleventyComputedExcludeFromCollections` - Collection exclusion logic
- Environment variable handling (BUILD_DRAFTS)

#### 5. `build.test.js` (5 tests - skipped in CI)
Integration tests for the build process:
- Build completion
- Output directory generation
- Critical file generation
- Tailwind CSS compilation
- SKIP_GALLERIES flag behavior

**Note:** Build tests are skipped in CI because they require full build dependencies that aren't always available in test environments.

### Existing Tests

#### 6. `nda-splash.test.js` (12 tests)
Tests the NDA/password protection feature:
- NDA overlay content and copy
- Password form UI
- Password unlock logic with Web Crypto API
- Session storage persistence
- Hash generation

## Test Helpers

### `helpers/test-utils.js`
Shared utilities for testing:
- `createMockEleventyConfig()` - Mock Eleventy configuration
- `createMockPageContext()` - Mock page context for shortcodes
- `createMockCollectionItem()` - Mock collection items
- `wait()` - Promise-based delay

### `helpers/fixtures.js`
Sample test data:
- `sampleMetadata` - Site metadata
- `samplePost` - Sample blog post
- `sampleFeaturedPost` - Sample featured post
- `sampleGallery` - Sample gallery
- `sampleCollection` - Collection of sample items
- `sampleHtmlContent` - HTML content for testing

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
node --test --experimental-vm-modules tests/filters.test.js

# Run with verbose output
npm test -- --verbose
```

## CI/CD Integration

Tests run automatically on:
- Push to main/master branches
- Pull requests to main/master branches

### GitHub Actions Workflow
- `.github/workflows/test.yml`
- Runs on Node.js 22.x
- Uses `npm ci` for clean dependency installation
- Runs `npm test` command

## Skipped Tests

### Build Tests (5 tests)
Skipped because they require:
- Full Tailwind CSS setup
- Complete build environment
- Time-consuming compilation

These tests are useful for local development but skip in CI for speed.

### CommonJS Module Tests (2 tests)
Skipped because:
- `_data/*.js` files are CommonJS (required by Eleventy)
- Package.json has `"type": "module"` for ES modules
- Direct loading causes module system conflicts
- Functionality is tested through integration tests instead

## Test Philosophy

1. **Unit Tests**: Test individual functions and filters in isolation
2. **Integration Tests**: Test how components work together
3. **Mock Strategy**: Use mocks for Eleventy internals and filesystem
4. **Fixtures**: Reusable test data for consistency
5. **Skip Smart**: Skip tests that require heavy dependencies or are redundant

## Adding New Tests

When adding new functionality:

1. **For filters**: Add tests to `filters.test.js`
2. **For collections**: Add tests to `collections.test.js`
3. **For data files**: Add tests to `data-files.test.js`
4. **For drafts**: Add tests to `drafts.test.js`
5. **For new features**: Create a new test file following the naming pattern

### Test Template

```javascript
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Feature name', () => {
  test('should do something', () => {
    const result = myFunction(input);
    assert.equal(result, expectedOutput);
  });
});
```

## Coverage Goals

Current coverage focuses on:
- ✅ Core filters and utilities
- ✅ Collection generation
- ✅ Data file modules
- ✅ Draft behavior
- ✅ NDA protection

Future coverage opportunities:
- Shortcode testing (image, heroImage, galleryImage)
- Template rendering tests
- URL generation tests
- Content validation tests
- Accessibility tests

## Dependencies

Test dependencies (in package.json):
- Node.js built-in test runner
- `jsdom` - DOM manipulation for testing HTML
- `luxon` - Date/time library (also used in production)

No additional test frameworks needed - using Node.js native testing.
