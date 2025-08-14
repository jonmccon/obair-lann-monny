# Eleventy Blog Portfolio - obair-lann-monny

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

This is an Eleventy v2-based static site generator that builds a portfolio blog with image galleries and content management. The site features a homepage with an image grid display, blog posts, and "inProgress" content sections.

## Working Effectively

### Bootstrap and Setup
```bash
# Node version requirement - project requires Node >=14 (from package.json)
# Works with Node 16 (.nvmrc) or newer (tested with Node 20)
node --version  # Should show v16+ or newer

# Install dependencies
npm install

# Build the site
# NEVER CANCEL: Build may take up to 10 minutes for clean builds due to image processing. Set timeout to 15+ minutes.
npm run build

# Start development server with live reload
npm run start    # Runs on http://localhost:8080
```

### Development Commands
```bash
# Development server with live reload - INCLUDES drafts
npm run start

# Production build - EXCLUDES drafts
npm run build

# Debug mode with verbose output
npm run debug

# Debug development server
npm run debugstart

# Performance benchmarking
npm run benchmark

# GitHub Pages build (if needed)
npm run build-ghpages
```

## Build Times and Timeouts
- **NEVER CANCEL builds or long-running commands**
- `npm install`: 3-60 seconds for subsequent installs, ~60 seconds first time. Set timeout to 3+ minutes.
- `npm run build`: 3-10 seconds for incremental builds, up to 10 minutes for clean builds with full image processing. **NEVER CANCEL: Set timeout to 15+ minutes**.
- `npm run start`: 2-3 seconds to start server.
- **Clean builds process all images which takes significantly longer than incremental builds.**

## Validation and Testing

### Manual Validation Requirements
After making changes, ALWAYS:

1. **Build and run the application**:
   ```bash
   npm run build && npm run start
   ```

2. **Test the homepage image gallery**: Navigate to http://localhost:8080 and verify:
   - Image gallery loads with portfolio thumbnails
   - Images are properly optimized (AVIF, WebP, JPEG formats)
   - Navigation links work (Home, Archive, About Me, TPQ)

3. **Test content pages**:
   - Navigate to `/blog/` to see blog post listings
   - Open individual blog posts to verify images and content render
   - Check `/inProgress/` content if making changes to that section

4. **Test responsive behavior**: Resize browser to verify image grid adapts properly

### Common Validation Scenarios
- **After content changes**: Always verify the specific content renders properly
- **After image changes**: Check that images load and are properly optimized
- **After template changes**: Test multiple content types (blog posts, inProgress items, homepage)

## Repository Structure

### Key Directories
```
/content/           # All content (markdown files)
  /blog/           # Published blog posts
  /inProgress/     # Draft/work-in-progress content
  /feed/           # RSS/JSON feed templates
  /about/          # About page
/_includes/         # Nunjucks templates and layouts
  /layouts/        # Page layouts (base.njk, home.njk, post.njk)
/_data/             # Site metadata and configuration
/public/            # Static assets (CSS, etc.)
/_site/             # Generated output (do not edit)
```

### Important Files
- `eleventy.config.js` - Main Eleventy configuration
- `eleventy.config.images.js` - Image processing configuration  
- `eleventy.config.drafts.js` - Draft content handling
- `package.json` - Dependencies and scripts
- `.nvmrc` - Node version specification (16)
- `netlify.toml` - Netlify deployment configuration

## Content Management

### Blog Posts
- Located in `/content/blog/[project-name]/`
- Use markdown with Nunjucks frontmatter
- Images defined in frontmatter `images:` array are processed for homepage gallery
- Individual posts use `{% image %}` shortcode for content images

### InProgress Content
- Located in `/content/inProgress/[date]/`
- Follows same structure as blog posts
- Excluded from production builds by default (draft system)
- Included in development server builds

### Image Handling
```markdown
<!-- In content, use the image shortcode -->
{% image "./filename.jpg", "Alt text" %}

<!-- In frontmatter for gallery -->
---
images:
  - src: "content/blog/project-name/image.png"
    alt: "Description"
---
```

## Critical Issues and Solutions

### Image Shortcode Comments
**CRITICAL**: Do NOT comment out Nunjucks image shortcodes with HTML comments. Nunjucks processes them anyway.

❌ **Wrong**:
```markdown
<!-- {% image "./image.jpg", "alt" %} -->
```

✅ **Correct**:
```markdown
{# {% image "./image.jpg", "alt" %} #}
```
Or simply delete the line entirely.

### Common Build Failures
1. **Missing image files**: Ensure all images referenced in `{% image %}` shortcodes exist at the specified paths
2. **Image path mismatches**: Verify exact filename spelling and case sensitivity
3. **Commented shortcodes**: Remove or properly comment Nunjucks shortcodes

### Draft System
- Development server (`npm run start`): Shows ALL content including inProgress
- Production build (`npm run build`): Excludes inProgress content and drafts
- This is controlled by `BUILD_DRAFTS` environment variable

## Architecture Notes

### Image Processing
- Uses @11ty/eleventy-img for optimization
- Generates multiple formats: AVIF, WebP, JPEG
- Images processed during build are cached for faster subsequent builds
- Homepage gallery pulls from frontmatter `images` arrays across all content

### Template Engine
- Uses Nunjucks templating with markdown content
- Base layout: `_includes/layouts/base.njk`
- Homepage template: `_includes/layouts/home.njk` (includes image grid)
- Post template: `_includes/layouts/post.njk`

### Collections
- `collections.posts` - All blog posts
- `collections.images` - Processed images for homepage gallery
- Tag-based collections for organization

## Common Tasks and Outputs

### Repository Root Contents
```
.editorconfig          eleventy.config.js      package.json
.git/                  eleventy.config.drafts.js  public/
.github/               eleventy.config.images.js  netlify.toml
.gitignore            LICENSE                  README.md
.nojekyll             .nvmrc                   _data/
.vscode/              content/                 _includes/
```

### Package.json Scripts
- `build` - Production build
- `start` - Development server  
- `debug` - Debug build
- `debugstart` - Debug development server
- `benchmark` - Performance analysis

### Build Output
A successful build generates ~51 files in `_site/` directory including:
- HTML pages for all content
- Optimized images in `/img/`
- RSS/JSON feeds
- Sitemap
- Tag pages

## Debugging

### Build Issues
```bash
# Run with debug output to see detailed processing
npm run debug

# Check for template errors
npm run debugstart
```

### Image Issues
- Verify file exists: `ls -la content/path/to/image.jpg`
- Check exact filename spelling and case
- Ensure image shortcodes are not HTML-commented

### Development Server Issues
- Check port 8080 is available
- Verify Node version matches .nvmrc (16)
- Clear browser cache if changes not appearing

## Performance Notes
- First builds are slower due to image processing
- Subsequent builds use cached processed images
- Image optimization happens at build time, not request time
- Consider image file sizes - large images (>4MB) take longer to process