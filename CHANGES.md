# Changes for t_f56f7eb0

## L1 a11y fix: post-content link contrast/affordance

Added `text-decoration: underline` to inline links within post content and post body elements in `public/css/index.css`:

```css
.post-content a[href],
.post-body a[href] {
	text-decoration: underline;
}
```

This ensures inline links inside post/article body content have a non-color visual affordance (underline) meeting WCAG / Lighthouse "link-in-text-block" requirements without affecting existing `.post-content.bg-black` color overrides.
