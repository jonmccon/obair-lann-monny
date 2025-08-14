# Contributing to Obair Lann Monny

Thank you for your interest in contributing to this creative practice site! This document provides detailed guidelines for contributing code, content, and improvements.

## 🎨 Types of Contributions

### Content Contributions
- **Project documentation**: New creative projects, artworks, or design work
- **Process posts**: Work-in-progress documentation and creative process insights
- **About page updates**: Personal or professional information updates

### Code Contributions
- **Feature enhancements**: New functionality, improved user experience
- **Bug fixes**: Resolving issues with site functionality or build process
- **Performance improvements**: Optimizations for speed, accessibility, or SEO
- **Documentation**: Improvements to setup instructions, guides, or code documentation

## 🚀 Getting Started

### Development Environment Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/obair-lann-monny.git
   cd obair-lann-monny
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/jonmccon/obair-lann-monny.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start development server**:
   ```bash
   npm start
   ```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## 📝 Content Guidelines

### Writing Style
- **Process-focused**: Include process documentation, not just final results
- **Personal voice**: Write in first person when documenting personal work
- **Technical detail**: Include technical specifications for coding/creative projects
- **Accessibility**: Always include descriptive alt text for images

### Project Documentation Structure
Each project should include:
- **Overview**: What the project is and its purpose
- **Process**: How it was made, challenges encountered
- **Technology**: Tools, languages, or techniques used
- **Outcome**: Results, learnings, or next steps

### Metadata Requirements
All content must include proper frontmatter:

```yaml
---
title: "Descriptive Project Title"
description: "Brief one-sentence description"
category: "blog" or "inprogress" 
date: YYYY-MM-DD
tags: 
    - relevant-tag
    - another-tag
images: 
- src: "./image1.jpg"
- src: "./image2.png"
---
```

### Image Guidelines
- **High quality**: Use high-resolution images (Eleventy will optimize them)
- **Descriptive filenames**: `project-name-screenshot-01.jpg`
- **Alt text**: Always provide meaningful alt text
- **File size**: Original files can be large, optimization is automatic
- **Formats**: JPG for photos, PNG for graphics/screenshots

### Tag Standards
Use existing tags when possible:

**Creative Disciplines:**
- `generative`, `illustration`, `branding`, `uxui`, `product`, `dataviz`, `system`

**Technology:**
- `p5`, `python`, `arduino`, `rpi`, `midi`, `html`, `javascript`

**Context:**
- `art`, `design`, `classroom`, `podcast`, `research`, `process`, `event`

## 💻 Code Guidelines

### JavaScript Style
- Use **tabs** for indentation
- Include **semicolons**
- Use **const/let** instead of var
- Follow existing patterns in `eleventy.config.js`

### CSS Style
- Use **tabs** for indentation
- Organize by specificity: global → components → utilities
- Use **CSS custom properties** for theming
- Support both light and dark modes

### HTML/Template Style
- Use **semantic HTML elements**
- Include proper **ARIA labels** where needed
- Test with **keyboard navigation**
- Ensure **responsive design**

### File Naming Conventions
- **Folders**: kebab-case (`my-new-feature`)
- **JavaScript files**: camelCase (`myUtilityFunction.js`)
- **Markdown files**: kebab-case (`project-name.md`)
- **Image files**: descriptive with project prefix (`project-screenshot-01.jpg`)

## 🔧 Development Workflow

### For New Features

1. **Create feature branch**:
   ```bash
   git checkout -b feature/descriptive-name
   ```

2. **Make changes** following the guidelines above

3. **Test thoroughly**:
   ```bash
   npm start      # Test in development
   npm run build  # Test production build
   ```

4. **Commit with descriptive messages**:
   ```bash
   git commit -m "Add gallery component for project pages"
   ```

5. **Push and create pull request**:
   ```bash
   git push origin feature/descriptive-name
   ```

### For Content Updates

1. **Work on main branch** for content-only changes
2. **Test content locally** before pushing
3. **Use descriptive commit messages**:
   ```bash
   git commit -m "Add new project: Interactive Data Visualization"
   ```

### Commit Message Standards

Use the present tense and be specific:
- ✅ `Add image optimization for gallery component`
- ✅ `Fix responsive layout on mobile devices`
- ✅ `Update about page with recent work`
- ❌ `Updates`
- ❌ `Fixed stuff`
- ❌ `WIP`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Site builds without errors (`npm run build`)
- [ ] Development server runs (`npm start`)
- [ ] All images load correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Navigation functions properly
- [ ] Dark/light mode switching works
- [ ] All links are functional

### Content Testing
- [ ] Markdown renders correctly
- [ ] Image shortcodes work
- [ ] Frontmatter is valid
- [ ] Tags display properly
- [ ] Date formatting is correct

## 🐛 Bug Reports

When reporting bugs, include:

1. **Environment details**:
   - Operating system
   - Node.js version (`node --version`)
   - npm version (`npm --version`)

2. **Steps to reproduce**:
   - What you did
   - What you expected
   - What actually happened

3. **Error messages**:
   - Full error text
   - Browser console errors
   - Terminal output

## 🚀 Pull Request Process

### Before Submitting
- [ ] Code follows style guidelines
- [ ] All tests pass locally
- [ ] Images are optimized and have alt text
- [ ] Documentation is updated if needed
- [ ] Commit messages are descriptive

### Pull Request Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Content update
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] All images load
- [ ] Responsive design verified
- [ ] Build succeeds

## Screenshots
Include screenshots for visual changes.
```

### Review Process
1. **Automated checks** must pass
2. **Manual review** by maintainer
3. **Address feedback** if requested
4. **Merge** when approved

## 🎯 Project Vision

This site aims to:
- **Document creative process** as much as finished work
- **Share knowledge** about creative coding and design
- **Maintain high quality** in both content and code
- **Be accessible** to all users
- **Perform well** on all devices

## 📚 Resources

### Learning Resources
- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)

### Design Resources
- [p5.js Learning](https://p5js.org/learn/)
- [Creative Coding](https://github.com/terkelg/awesome-creative-coding)
- [Design Systems](https://designsystemsrepo.com/)

## 💬 Communication

- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions and ideas
- **Email**: [jonmccon@gmail.com](mailto:jonmccon@gmail.com) for direct contact

## 🙏 Recognition

Contributors will be acknowledged in:
- Repository contributors list
- About page (for significant contributions)
- Project documentation (for specific features)

Thank you for contributing to this creative practice documentation!