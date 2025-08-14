# Development Guide

This guide provides detailed information about the technical aspects of developing for the Obair Lann Monny site.

## 🏗️ Architecture Overview

### Eleventy Configuration

The site uses Eleventy with several custom configurations:

#### Main Config (`eleventy.config.js`)
- **Image processing**: Automatic optimization via `@11ty/eleventy-img`
- **Bundle plugin**: CSS bundling and optimization
- **Syntax highlighting**: Code block highlighting
- **Navigation**: Automatic navigation generation
- **RSS feeds**: JSON and XML feeds

#### Draft System (`eleventy.config.drafts.js`)
- Posts marked with `draft: true` are excluded from production builds
- Drafts are automatically included in development mode
- Environment variable `BUILD_DRAFTS` controls draft inclusion

#### Image Processing (`eleventy.config.images.js`)
- Generates multiple formats: AVIF, WebP, auto-fallback
- Creates responsive image sets
- Lazy loading enabled by default
- Images are processed relative to the markdown file location

### Directory Structure Details

```
obair-lann-monny/
├── _data/
│   └── metadata.js         # Site-wide metadata
├── _includes/
│   ├── layouts/           # Page layouts
│   └── postslist.njk      # Reusable post list component
├── content/
│   ├── blog/              # Project posts
│   ├── inProgress/        # WIP documentation
│   ├── about/             # About page
│   ├── feed/              # RSS feed templates
│   ├── sitemap/           # Sitemap generation
│   ├── tags.njk           # Tag listing page
│   └── index.njk          # Homepage
├── public/
│   ├── css/               # Styles (copied to _site/css/)
│   └── img/               # Static images
└── _site/                 # Generated site (git-ignored)
    ├── css/               # Processed styles
    ├── img/               # Optimized images
    └── [content]          # Generated HTML
```

## 🎨 Template System

### Layouts

**Base Layout** (`_includes/layouts/base.njk`):
- HTML document structure
- Meta tags and head content
- Navigation and footer
- CSS bundle inclusion

**Post Layout** (`_includes/layouts/post.njk`):
- Blog post template
- Metadata display
- Next/previous navigation
- Image gallery support

**Home Layout** (`_includes/layouts/home.njk`):
- Homepage-specific layout
- Post list integration
- Featured content sections

### Data Cascade

Eleventy's data cascade works as follows (highest to lowest priority):
1. Front matter data in content files
2. Template data files
3. Directory data files (`_data/` folder)
4. Global data files

### Custom Shortcodes

**Image Shortcode** (`{% image "path", "alt text" %}`):
```javascript
// Usage in markdown
{% image "./screenshot.jpg", "Project screenshot showing the interface" %}

// Generates optimized images with:
// - Multiple formats (AVIF, WebP, JPEG)
// - Responsive sizing
// - Lazy loading
// - Proper alt text
```

## 🖼️ Image Processing

### How It Works

1. **Source images** are placed alongside markdown files
2. **Eleventy Image plugin** processes them during build
3. **Multiple formats** are generated for optimal loading
4. **Responsive images** are created with srcset attributes
5. **Images are cached** to speed up subsequent builds

### Best Practices

- Use high-quality source images (plugin will optimize)
- Place images in the same folder as the content
- Use descriptive filenames
- Always include alt text
- Prefer JPG for photos, PNG for graphics

### Troubleshooting Images

**"File not found" errors:**
- Ensure image files exist in the correct location
- Check file paths are relative to the markdown file
- Verify file extensions match exactly

**Build slowness:**
- Image processing is the main cause of slow builds
- Images are cached after first processing
- Consider fewer/smaller images during development

## 🎯 Content Management

### Frontmatter Schema

**Required fields:**
```yaml
---
title: "Project Title"
description: "Brief description for meta tags and lists"
date: 2025-01-15
---
```

**Optional fields:**
```yaml
---
category: "blog" | "inprogress"  # Content type
tags: 
  - "design"
  - "creative-coding"
images:                          # Featured images for galleries
  - src: "./image1.jpg"
  - src: "./image2.png"
draft: true                      # Hide from production
eleventyNavigation:              # Add to main navigation
  key: "About"
  order: 3
---
```

### Collections

Eleventy automatically creates collections:
- `collections.all` - All content
- `collections.posts` - Blog posts (with `posts` tag)
- `collections.inProgress` - WIP posts (with `inProgress` tag)
- Custom tag collections (e.g., `collections.design`)

### Navigation

Navigation is handled by the `@11ty/eleventy-navigation` plugin:
```yaml
---
eleventyNavigation:
  key: "Page Name"    # Display name
  order: 1           # Sort order
  parent: "Parent"   # For nested navigation
---
```

## 🎨 Styling Architecture

### CSS Organization

The main stylesheet (`public/css/index.css`) is organized as:

1. **CSS Custom Properties** - Theme variables
2. **Reset/Base** - Element defaults
3. **Layout** - Grid systems and major layout
4. **Components** - Reusable UI components
5. **Utilities** - Single-purpose classes

### Theme System

**Light/Dark Mode:**
```css
:root {
  --color-gray-90: #333;
  --background-color: #e6e6e6;
  --text-color: var(--color-gray-90);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-gray-90: #dad8d8;
    --background-color: #292929;
  }
}
```

**Layout Utilities:**
```css
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1em;
}

.three-column {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1em;
}
```

### Adding New Styles

1. **Check existing styles** before adding new ones
2. **Use custom properties** for consistent theming
3. **Consider responsive design** for all screen sizes
4. **Test in both** light and dark modes

## 🔧 Build Process

### Development Mode

```bash
npm start
# Equivalent to: npx @11ty/eleventy --serve --quiet
```

**Features:**
- Live reload on file changes
- Draft posts included
- Fast incremental builds
- Local development server on port 8080

### Production Build

```bash
npm run build
# Equivalent to: npx @11ty/eleventy
```

**Features:**
- Draft posts excluded
- Full image optimization
- Minified output
- Production-ready assets

### Debug Mode

```bash
npm run debug
# Shows detailed Eleventy processing information
```

### Performance Monitoring

```bash
npm run benchmark
# Shows performance metrics for the build process
```

## 🚨 Common Issues

### Build Errors

**Template rendering errors:**
- Check frontmatter YAML syntax
- Verify all referenced images exist
- Ensure shortcode syntax is correct

**Image processing errors:**
- Confirm image files are present
- Check file paths are relative to markdown files
- Verify image formats are supported

**Plugin errors:**
- Update all Eleventy plugins to latest versions
- Check Node.js version compatibility
- Clear node_modules and reinstall

### Performance Issues

**Slow builds:**
- Image processing is the main bottleneck
- Use fewer images during development
- Images are cached after first processing

**Large bundle sizes:**
- Eleventy automatically optimizes images
- CSS is bundled and minified
- No JavaScript is included by default

## 🧪 Testing

### Manual Testing Checklist

**Build Testing:**
- [ ] `npm run build` completes without errors
- [ ] All pages generate correctly
- [ ] Images are optimized and load properly
- [ ] No broken links

**Development Testing:**
- [ ] `npm start` runs without errors
- [ ] Live reload works for content changes
- [ ] Draft posts appear in development
- [ ] Navigation functions correctly

**Cross-browser Testing:**
- [ ] Latest Chrome, Firefox, Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Test both light and dark mode

**Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Images have proper alt text
- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatibility

## 📚 Advanced Topics

### Custom Plugins

To add new Eleventy plugins:
```javascript
// eleventy.config.js
const newPlugin = require("eleventy-plugin-name");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(newPlugin, {
    // plugin options
  });
};
```

### Custom Filters

Add custom template filters:
```javascript
// eleventy.config.js
eleventyConfig.addFilter("myFilter", function(value) {
  return value.toUpperCase();
});
```

Usage in templates:
```nunjucks
{{ title | myFilter }}
```

### Custom Collections

Create custom content collections:
```javascript
// eleventy.config.js
eleventyConfig.addCollection("featured", function(collectionApi) {
  return collectionApi.getFilteredByTag("posts").filter(post => {
    return post.data.featured;
  });
});
```

### Environment Variables

Set different behavior for different environments:
```javascript
// Check environment
if (process.env.NODE_ENV === "production") {
  // Production-only configuration
}

// Draft handling
if (process.env.BUILD_DRAFTS) {
  // Include drafts
}
```

## 🔗 Additional Resources

- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Eleventy Image Plugin](https://www.11ty.dev/docs/plugins/image/)
- [Nunjucks Template Guide](https://mozilla.github.io/nunjucks/templating.html)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web Performance Best Practices](https://web.dev/performance/)

This development guide should help you understand and work with the technical aspects of the Obair Lann Monny site. For content guidelines and contribution processes, see the main README and CONTRIBUTING files.