# Stacked Layout System Documentation

## Introduction

The **Stacked Layout** is a unique presentation system for displaying multiple markdown files as visually stacked "papers" on a single page. This layout creates an engaging user experience where each piece of content appears as a separate paper that sits on top of a stack, with intuitive navigation controls to flip through them.

### Visual Metaphor

Think of this layout like a stack of physical papers on a desk:
- Papers stack on top of each other with slight offsets and rotations for depth
- The top paper is always the active one
- You can flip papers aside to reveal what's underneath
- Papers that have been viewed slide out of view
- You can always reset the stack to start over

### When to Use This Layout

The stacked layout is perfect for:

- **Research notes collections** - Present related research findings as separate papers
- **Project evolution/iterations** - Show how a project developed over time
- **Multi-part articles or series** - Break long content into digestible chunks
- **Tutorial steps** - Guide users through a process step-by-step
- **Documentation chapters** - Organize documentation into logical sections
- **Portfolios** - Showcase multiple pieces of work in an interactive way

## File Structure

The stacked layout system consists of the following files:

### Created Files

1. **`_includes/layouts/stacked.njk`**
   - Main layout template that extends `base.njk`
   - Renders papers and navigation controls
   - Handles accessibility markup

2. **`public/css/stacked.css`**
   - Complete styling for the stacked papers effect
   - Animations and transitions
   - Responsive design rules
   - Dark mode support

3. **`public/js/stacked.js`**
   - Client-side navigation logic
   - Keyboard shortcuts
   - State management
   - Accessibility features

4. **`docs/STACKED-LAYOUT.md`** (this file)
   - Comprehensive documentation
   - Usage examples
   - Configuration options

### Modified Files

- **`eleventy.config.js`** - No modifications needed, as `./public/` is already passed through

## Usage Guide

### Basic Usage

Create a markdown file with the `stacked.njk` layout and define your papers in the front matter:

```markdown
---
layout: layouts/stacked.njk
title: My Stacked Papers
stackedItems:
  - title: "First Paper"
    date: 2026-01-20
    content: "<p>This is the first paper content.</p>"
  - title: "Second Paper"
    date: 2026-01-21
    content: "<p>This is the second paper content.</p>"
permalink: /stacks/example/
---
```

### Content Format

Each item in the `stackedItems` array should have:

- **`title`** (required) - The paper's heading
- **`date`** (optional) - Publication or creation date
- **`content`** (required) - HTML content for the paper body

### Organization Patterns

#### 1. Research Notes Collection

```markdown
---
layout: layouts/stacked.njk
title: Climate Research Notes
stackedItems:
  - title: "Literature Review"
    date: 2026-01-10
    content: "<p>Summary of existing research...</p>"
  - title: "Methodology"
    date: 2026-01-15
    content: "<p>Research approach and methods...</p>"
  - title: "Findings"
    date: 2026-01-20
    content: "<p>Key discoveries and data...</p>"
permalink: /research/climate/
---
```

#### 2. Project Evolution/Iterations

```markdown
---
layout: layouts/stacked.njk
title: Website Redesign Journey
stackedItems:
  - title: "Initial Concept"
    date: 2025-12-01
    content: "<p>Our first ideas and sketches...</p>"
  - title: "First Prototype"
    date: 2025-12-15
    content: "<p>Testing the initial design...</p>"
  - title: "User Feedback"
    date: 2026-01-05
    content: "<p>What users told us...</p>"
  - title: "Final Design"
    date: 2026-01-20
    content: "<p>The polished result...</p>"
permalink: /projects/redesign/
---
```

#### 3. Multi-Part Articles or Series

```markdown
---
layout: layouts/stacked.njk
title: Learning JavaScript - A Series
stackedItems:
  - title: "Part 1: Variables and Data Types"
    content: "<p>Understanding the basics...</p>"
  - title: "Part 2: Functions and Scope"
    content: "<p>Writing reusable code...</p>"
  - title: "Part 3: Objects and Arrays"
    content: "<p>Working with complex data...</p>"
permalink: /tutorials/javascript-series/
---
```

#### 4. Tutorial Steps

```markdown
---
layout: layouts/stacked.njk
title: Setting Up Your Development Environment
stackedItems:
  - title: "Step 1: Install Node.js"
    content: "<p>Download from nodejs.org...</p>"
  - title: "Step 2: Configure Your Editor"
    content: "<p>Install VS Code extensions...</p>"
  - title: "Step 3: Create Your First Project"
    content: "<p>Initialize with npm...</p>"
permalink: /guides/setup/
---
```

#### 5. Documentation Chapters

```markdown
---
layout: layouts/stacked.njk
title: API Documentation
stackedItems:
  - title: "Authentication"
    content: "<p>How to authenticate requests...</p>"
  - title: "Endpoints"
    content: "<p>Available API endpoints...</p>"
  - title: "Error Handling"
    content: "<p>Common errors and solutions...</p>"
permalink: /docs/api/
---
```

## Features

### Navigation Controls

The layout includes fixed navigation controls with the following buttons:

- **Previous (←)** - Go to the previous paper (disabled when on first paper)
- **Next (→)** - Go to the next paper (disabled when on last paper)
- **Reset (⟲)** - Return to the first paper and reset all flipped states

### Keyboard Shortcuts

- **Arrow Left (←)** - Previous paper
- **Arrow Right (→)** - Next paper
- **Home** - Reset to first paper

### Flip Aside Interaction

Each paper has a "Flip Aside" button that:
- Animates the paper sliding off to the side with rotation
- Automatically advances to the next paper
- Marks the paper as "flipped" in the state

### Position Indicator

Shows current position in the format "2 / 5" to help users track progress.

### Responsive Design

- **Desktop** - Controls positioned at top-right
- **Mobile** - Controls move to bottom center in a horizontal layout
- Papers adjust padding and sizing for smaller screens

### Accessibility

- **ARIA labels** on all interactive elements
- **Keyboard navigation** fully supported
- **Screen reader announcements** for state changes
- **Focus management** for active paper
- **High contrast mode** support
- **Reduced motion** support for users with motion sensitivity

### Dark Mode Support

Automatically adapts to system dark mode preferences:
- Dark background for papers
- Adjusted text colors
- Maintains readability in both modes

## Configuration Options

### Customizing Stack Offset

Adjust the visual stacking depth by modifying the CSS variable:

```css
:root {
  --paper-offset: 30px; /* Default is 20px */
}
```

### Adjusting Animations

Change the animation timing and easing:

```css
.paper {
  transition: all 0.4s ease-in-out; /* Default is 0.6s cubic-bezier */
}
```

### Changing Paper Width

Adjust the maximum width of papers:

```css
:root {
  --paper-width: min(1000px, 95vw); /* Default is min(800px, 90vw) */
}
```

### Modifying Rotation Angles

Edit the rotation for stacked papers:

```css
.paper.stacked:nth-child(1) {
  transform: translateX(-50%) translateY(calc(var(--paper-offset) * -1)) rotate(-2deg);
  /* Default is -1deg */
}
```

### Custom Shadow

Adjust the paper shadow:

```css
:root {
  --paper-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); /* Default is 0 4px 12px */
}
```

## Examples

### Example 1: Simple Three-Paper Stack

```markdown
---
layout: layouts/stacked.njk
title: Quick Start Guide
stackedItems:
  - title: "Introduction"
    content: "<p>Welcome to our platform!</p>"
  - title: "Getting Started"
    content: "<p>Create your first project in 3 steps...</p>"
  - title: "Next Steps"
    content: "<p>Explore advanced features...</p>"
permalink: /stacks/quick-start/
---
```

### Example 2: Research Notes with Dates

```markdown
---
layout: layouts/stacked.njk
title: User Research Findings
stackedItems:
  - title: "Interview Session 1"
    date: 2026-01-10
    content: "<p>Key insights from first interviews...</p><ul><li>Users want simpler navigation</li></ul>"
  - title: "Interview Session 2"
    date: 2026-01-15
    content: "<p>Follow-up findings...</p><ul><li>Mobile experience is crucial</li></ul>"
  - title: "Synthesis"
    date: 2026-01-20
    content: "<p>Overall conclusions...</p><ol><li>Redesign navigation</li></ol>"
permalink: /research/user-findings/
---
```

### Example 3: Project Iterations without Dates

```markdown
---
layout: layouts/stacked.njk
title: Logo Design Process
stackedItems:
  - title: "Concept Sketches"
    content: "<p>Initial hand-drawn ideas...</p><img src='/img/sketches.jpg' alt='Sketches'>"
  - title: "Digital Mockups"
    content: "<p>Refined digital versions...</p><img src='/img/mockups.jpg' alt='Mockups'>"
  - title: "Final Logo"
    content: "<p>The chosen design...</p><img src='/img/final.jpg' alt='Final logo'>"
permalink: /design/logo-process/
---
```

## Styling Customization

### CSS Variables Available to Override

You can override these CSS variables in your custom CSS:

```css
:root {
  --paper-width: min(800px, 90vw);
  --paper-offset: 20px;
  --paper-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### How to Adjust Paper Appearance

Add custom CSS in your page or site-wide:

```css
/* Make papers more compact */
.paper {
  padding: 1rem;
  border-radius: 4px;
}

/* Adjust header styling */
.paper-header h2 {
  font-size: 1.8rem;
  color: #2c3e50;
}

/* Customize the flip button */
.flip-button {
  background: #3498db;
  font-weight: bold;
}
```

### Custom Color Schemes

Override the existing color variables:

```css
/* Light mode custom colors */
:root {
  --paper-bg: #fafafa;
  --paper-text: #222;
}

.paper {
  background: var(--paper-bg);
  color: var(--paper-text);
}

/* Dark mode custom colors */
@media (prefers-color-scheme: dark) {
  :root {
    --paper-bg: #2d2d2d;
    --paper-text: #eee;
  }
}
```

## Accessibility

### Keyboard Navigation

All functionality is available via keyboard:
- Tab through interactive elements
- Arrow keys for navigation
- Home key to reset
- Enter/Space to activate buttons

### ARIA Labels Used

- `role="region"` on the papers container
- `aria-label` on navigation controls
- `aria-live="polite"` on position indicator
- `aria-disabled` on disabled buttons
- Screen reader only text via `.sr-only` class

### Screen Reader Considerations

- Papers are announced with their titles
- Position indicator updates are announced
- State changes (reset) are announced
- Focus is managed appropriately

### Focus Management

- Active paper receives `tabindex="0"`
- Controls are keyboard accessible
- Visible focus indicators on all interactive elements

## Browser Support

### Requirements

- Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support
- CSS custom properties (CSS variables)
- CSS transforms and transitions

### Tested Browsers

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Fallback Behavior

For older browsers:
- Papers will still render in order
- Navigation controls will function
- Animations may degrade gracefully
- Layout remains readable

## Troubleshooting

### Common Issues and Solutions

#### JavaScript not loading

**Problem:** Navigation doesn't work, papers don't respond to controls.

**Solutions:**
1. Check browser console for errors
2. Verify `/js/stacked.js` is accessible
3. Ensure script tag is present in the layout
4. Check that `./public/` is in passthrough copy config

#### Papers not stacking correctly

**Problem:** All papers appear at once or don't stack properly.

**Solutions:**
1. Verify CSS file is loaded
2. Check that `stackedItems` array is correctly formatted in front matter
3. Ensure each paper has required `title` and `content` fields
4. Check browser console for JavaScript errors

#### Navigation not working

**Problem:** Buttons don't respond or don't navigate.

**Solutions:**
1. Verify JavaScript is loaded and initialized
2. Check that paper elements have correct classes
3. Ensure button IDs match (`prev-button`, `next-button`, `reset-button`)
4. Check for JavaScript errors in console

#### Keyboard shortcuts not responding

**Problem:** Arrow keys and Home key don't work.

**Solutions:**
1. Make sure focus is not in an input field
2. Check that event listener is attached
3. Verify no other scripts are preventing default key behavior

#### Styling issues on mobile

**Problem:** Layout breaks on mobile devices.

**Solutions:**
1. Check viewport meta tag is present in base layout
2. Verify responsive CSS is loading
3. Test in mobile device mode in browser dev tools
4. Check for CSS conflicts with other styles

#### Dark mode not working

**Problem:** Papers don't adapt to dark mode.

**Solutions:**
1. Verify browser supports `prefers-color-scheme`
2. Check that dark mode CSS rules are present
3. Test by switching system theme
4. Ensure no overriding styles

## Future Enhancements

Possible improvements that could be added:

1. **Drag-to-flip** - Allow dragging papers to flip them
2. **Swipe gestures** - Touch device swipe navigation
3. **Bookmark/save position** - Remember user's position
4. **Share specific paper** - Deep linking to individual papers
5. **Print mode** - Flatten stack for printing
6. **Animation options** - Different animation styles
7. **Custom themes** - Pre-built color schemes
8. **Progress tracking** - Track which papers have been read
9. **Search within stack** - Find specific content
10. **Export/download** - Save papers as PDF

## Credits

Designed and implemented for the Eleventy blog portfolio "obair-lann-monny".

## License

Follows the same license as the parent project.
