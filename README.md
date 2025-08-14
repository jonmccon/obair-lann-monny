# Obair Lann Monny

> A design & art studio portfolio and creative practice documentation site

This repository contains the source code for [jonmccon.com](https://jonmccon.com), a portfolio and creative practice blog built with [Eleventy](https://www.11ty.dev/). The site showcases creative work, design projects, generative art, and process documentation from Jonny McConnell's design and art studio.

## 🎯 Repository Purpose

This site serves as:
- **Portfolio showcase** for design, art, and creative coding projects
- **Process documentation** for ongoing creative work and studio practice
- **Creative output** including generative art, data visualization, and interactive projects
- **Professional presence** and contact point for collaborations

## 🏗️ Project Structure

```
obair-lann-monny/
├── _data/                  # Global data files
│   └── metadata.js         # Site metadata and configuration
├── _includes/              # Reusable templates and layouts
├── content/                # All site content
│   ├── blog/              # Completed project posts
│   ├── inProgress/        # Work-in-progress documentation
│   ├── about/             # About page content
│   └── index.njk          # Homepage template
├── public/                # Static assets
│   ├── css/               # Stylesheets
│   └── img/               # Images and media
├── eleventy.config.js     # Main Eleventy configuration
├── eleventy.config.drafts.js # Draft post handling
├── eleventy.config.images.js # Image processing setup
└── package.json           # Dependencies and scripts
```

### Key Components

- **Blog Posts** (`content/blog/`): Completed projects with full documentation, images, and project details
- **In Progress** (`content/inProgress/`): Ongoing work, experiments, and process documentation
- **Image Processing**: Automated optimization and responsive image generation using `@11ty/eleventy-img`
- **Draft System**: Development posts can be marked as drafts and shown only in development mode
- **Navigation**: Automatic navigation generation using `@11ty/eleventy-navigation`

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jonmccon/obair-lann-monny.git
   cd obair-lann-monny
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The site will be available at `http://localhost:8080`

### Available Commands

- `npm start` - Start development server with hot reloading
- `npm run build` - Build production site to `_site/` directory
- `npm run debug` - Run build with debug information
- `npm run debugstart` - Start dev server with debug output
- `npm run benchmark` - Run performance benchmarking

## ✨ Adding New Content

### Creating a New Blog Post

1. **Create a new folder** in `content/blog/` with your project name:
   ```
   content/blog/my-new-project/
   ```

2. **Add your main content file** as `project-name.md`:
   ```markdown
   ---
   title: My New Project
   description: Brief description of the project
   category: Design
   date: 2025-01-15
   tags: 
       - design
       - creative-coding
   images: 
   - src: "./image1.png"
   - src: "./image2.jpg"
   ---

   # Project content goes here
   
   Use markdown for your content...
   
   {% image "./local-image.jpg", "Alt text description" %}
   ```

3. **Add images** to the same folder as your markdown file

### Creating Work-in-Progress Posts

1. **Create a folder** in `content/inProgress/` with a date prefix:
   ```
   content/inProgress/250115/experiment-name.md
   ```

2. **Use the same frontmatter structure** but with `category: inprogress`

### Working with Drafts

- Add `draft: true` to your frontmatter to hide posts in production
- Drafts are automatically shown in development mode (`npm start`)
- Remove the draft flag when ready to publish

### Image Handling

- **Place images** in the same folder as your markdown file
- **Use the image shortcode** for automatic optimization:
  ```markdown
  {% image "./my-image.jpg", "Descriptive alt text" %}
  ```
- **Images are automatically optimized** to multiple formats (AVIF, WebP, fallback)
- **Responsive sizing** is handled automatically

## 🎨 Design System & Styling

### CSS Architecture

- **Custom properties** for consistent theming (see `public/css/index.css`)
- **Dark/light mode** support via CSS `prefers-color-scheme`
- **Responsive grid layouts** with utility classes:
  - `.two-column` - Two-column grid layout
  - `.three-column` - Three-column grid layout

### Typography & Colors

```css
/* Main theme colors */
--color-gray-20: #e0e0e0;
--color-gray-50: #C0C0C0;
--color-gray-90: #333;
--background-color: #e6e6e6;
--text-color: var(--color-gray-90);
```

### Creative Disciplines & Tags

The site organizes content around these creative areas:
- **Visual Design**: generative, illustration, branding, uxui, product, dataviz, system
- **Technology**: p5, python, arduino, rpi, midi, html, javascript  
- **Context**: art, design, classroom, podcast, research, process, event

## 🔧 Development Workflow

### For New Features

1. **Create a feature branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Make your changes** following the code style guidelines below

3. **Test locally**
   ```bash
   npm start  # Test in development
   npm run build  # Test production build
   ```

4. **Commit with descriptive messages**
   ```bash
   git add .
   git commit -m "Add new feature: brief description"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/new-feature-name
   ```

### For Content Updates

1. **Work directly on main branch** for content-only changes
2. **Test content locally** before pushing
3. **Use descriptive commit messages** like "Add new project: Project Name"

## 📝 Contributing Guidelines

### Code Style

- **JavaScript**: Use tabs for indentation, semicolons required
- **CSS**: Use tabs, organize by specificity (global → components → utilities)
- **Markdown**: Use consistent heading hierarchy, descriptive alt text for images
- **Commit messages**: Use present tense, be specific ("Add project gallery" not "Updates")

### File Naming

- **Folders**: Use kebab-case (`my-project-name`)
- **Files**: Use kebab-case for markdown, camelCase for JavaScript
- **Images**: Descriptive names with project prefix (`project-screenshot-01.jpg`)

### Content Guidelines

- **Project posts**: Include process documentation, not just final results
- **Image quality**: Use high-resolution images, Eleventy will optimize them
- **Alt text**: Always provide descriptive alt text for accessibility
- **Tags**: Use existing tags when possible, create new ones sparingly

### Pull Request Process

1. **Describe your changes** clearly in the PR description
2. **Include screenshots** for visual changes
3. **Test thoroughly** on multiple screen sizes if making layout changes
4. **Reference issues** if applicable

## 🛠️ Troubleshooting

### Common Issues

**Build takes a long time or hangs**
- This is usually due to image processing. Eleventy optimizes all images on build.
- For development, images are only processed once and cached.

**Images not displaying**
- Check file paths are relative to the markdown file
- Ensure image files are committed to the repository
- Verify the image shortcode syntax: `{% image "./path.jpg", "alt text" %}`

**Drafts showing in production**
- Remove `draft: true` from frontmatter
- Check that `BUILD_DRAFTS` environment variable is not set in production

**Styling issues**
- Check browser dev tools for CSS errors
- Verify custom property names are correctly defined
- Test in both light and dark mode

### Getting Help

- **Eleventy Documentation**: [11ty.dev/docs](https://www.11ty.dev/docs/)
- **Repository Issues**: Use GitHub issues for bugs and feature requests
- **Contact**: [jonmccon@gmail.com](mailto:jonmccon@gmail.com)

## 📚 Useful Resources

### Eleventy Resources
- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Eleventy Plugins](https://www.11ty.dev/docs/plugins/)
- [Eleventy Community](https://github.com/11ty/eleventy/discussions)

### Design & Creative Coding
- [p5.js Reference](https://p5js.org/reference/)
- [Creative Coding Resources](https://github.com/terkelg/awesome-creative-coding)
- [Generative Art Tools](https://github.com/kosmos/awesome-generative-art)

### Web Development
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Obair Lann Monny** is Irish Gaelic for "workshop" or "laboratory" - reflecting the experimental and process-focused nature of this creative practice.