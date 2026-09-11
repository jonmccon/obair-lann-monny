# Task t_d61c1fa2: Security Headers (vercel.json) — CSP, COOP, HSTS

## Overview
Added HTTP security headers to `vercel.json` for all routes (`/(.*)`) to harden the site, mitigate clickjacking, guard against XSS, enforce origin isolation, and upgrade transport security.

## Configured Headers

### 1. Content-Security-Policy (CSP)
```
default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://esm.sh; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://esm.sh; frame-src https://player.simplecast.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; require-trusted-types-for 'script'; trusted-types default
```

#### Directive Rationale & Domain Analysis:
- `default-src 'self'`: Restricts fallback resource loading to same-origin.
- `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://esm.sh`:
  - `'self'`: Allows site scripts (e.g. `/js/gallery-init.js`, `/_vercel/insights/script.js`, `/_vercel/speed-insights/script.js`).
  - `'unsafe-inline'`: Required for inline `<script>` tags across templates (no-js class toggle in `base.njk`, GA4 idle callback loader in `base.njk`, JSON-LD structured data in `schema-person.njk`/`breadcrumbs.njk`, password hashing logic in `nda-splash.test.mjs`, piles grid script in `projectsPilesGrid.njk`, resume script in `resume.njk`, and contact form script in `contact.njk`).
  - `https://www.googletagmanager.com`: Required for GA4 gtag loader script tag injection.
  - `https://esm.sh`: Required for dynamic ES module import of Three.js (`https://esm.sh/three@0.169.0`) used in the homepage 3D interactive hero chart.
- `style-src 'self' 'unsafe-inline'`:
  - `'self'`: Allows same-origin stylesheets.
  - `'unsafe-inline'`: Required for inlined `<style>` tag bundle injected by Eleventy (`fonts.css`, `index.css`, `new-colors.css`, `tailwind.css`).
  - Note on Google Fonts: `fonts.googleapis.com` is omitted because Task t_c514c49d self-hosted all web fonts locally in `/fonts/` via `public/css/fonts.css`.
- `font-src 'self' data:`:
  - `'self'`: Allows locally hosted webfonts (`/fonts/*.woff2`).
  - `data:`: Allows embedded base64 fonts if any.
  - Note on Google Fonts: `fonts.gstatic.com` is omitted as fonts are now same-origin.
- `img-src 'self' data: https:`:
  - Allows local images, data URI placeholders, and external images (e.g. external media, CDN assets).
- `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.analytics.google.com https://esm.sh`:
  - Allows GA4 analytics beacon requests and Three.js module fetching / dependency resolution via `esm.sh`.
- `frame-src https://player.simplecast.com`:
  - Required for embedded Simplecast podcast episode players on `_includes/layouts/home.njk`.
- `frame-ancestors 'none'`:
  - Disallows embedding the site in iframes anywhere, resolving clickjacking vulnerabilities (L1 finding).
- `base-uri 'self'`: Prevents `<base>` tag injection attacks.
- `form-action 'self'`: Restricts form submissions to same-origin endpoints (e.g., `/api/contact`).
- `require-trusted-types-for 'script'; trusted-types default`: Enforces DOM XSS mitigation and trusted types policy.

### 2. Cross-Origin-Opener-Policy (COOP)
```
Cross-Origin-Opener-Policy: same-origin
```
Enforces process isolation for top-level browsing contexts from cross-origin documents.

### 3. Strict-Transport-Security (HSTS)
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```
Enforces HTTPS with a 2-year max-age, covers subdomains, and qualifies for HSTS preload list submission.

## Automated Verification
- Added test suite in `tests/security-headers.test.mjs` verifying:
  1. `vercel.json` contains valid global headers configuration.
  2. `Strict-Transport-Security` includes `max-age`, `includeSubDomains`, and `preload`.
  3. `Cross-Origin-Opener-Policy` is `same-origin`.
  4. `Content-Security-Policy` has all required directives (`frame-ancestors 'none'`, `Trusted-Types`, `googletagmanager.com`, `esm.sh`, `simplecast.com`) and excludes obsolete Google Fonts CDN domains.
- Full test suite passed: `109 pass, 0 fail, 7 skipped` (out of 116 tests).
- Build succeeded: `1062 files written`.
