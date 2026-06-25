import PhotoSwipeLightbox from '/js/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from '/js/photoswipe.esm.min.js';

document.querySelectorAll('.photo-gallery').forEach((galleryEl) => {
	const lightbox = new PhotoSwipeLightbox({
		gallery: galleryEl,
		children: 'a',
		pswpModule: PhotoSwipe,
		preload: [1, 1]
	});

	// Add a chain-link button to the lightbox top bar that links to the standalone photo page.
	// Uses tagName:'a' so it is a real link (right-click → open in new tab works, etc.).
	// 'uiRegister' fires inside pswp.init() before any slide is shown — the href is filled in
	// on the first 'change' event, which also fires during init before the lightbox is visible.
	lightbox.on('uiRegister', function() {
		lightbox.pswp.ui.registerElement({
			name: 'permalink',
			title: 'View photo page',
			ariaLabel: 'View photo page',
			order: 9,
			isButton: true,
			tagName: 'a',
			html: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" /></svg>',
			onInit: (el, pswp) => {
				pswp.on('change', () => {
					const data = pswp.currSlide && pswp.currSlide.data;
					const photoUrl = data && data.element && data.element.getAttribute('data-photo-url');
					if (photoUrl) el.href = photoUrl;
				});
			}
		});
	});

	// Sync browser URL with the current photo while the lightbox is open.
	// 'afterInit' is the correct PhotoSwipe 5 event that fires after pswp.init()
	// with currSlide already set. ('pswpOpen' does not exist in PhotoSwipe 5.)
	lightbox.on('afterInit', () => {
		const pswp = lightbox.pswp;
		const syncUrl = () => {
			const el = pswp.currSlide && pswp.currSlide.data && pswp.currSlide.data.element;
			const deepLink = el && el.getAttribute('data-deep-link-url');
			if (deepLink) history.replaceState(null, '', deepLink);
		};
		syncUrl();
		pswp.on('change', syncUrl);
		pswp.on('close', () => {
			history.replaceState(null, '', location.pathname + location.search);
		});
	});

	lightbox.init();

	// Deep-link: if the page URL contains a #photo-<slug> hash, open that photo.
	// querySelectorAll is scoped to this galleryEl, so idx is -1 for any gallery
	// that doesn't contain the slug — the guard below ensures only the correct
	// gallery opens its lightbox.
	const hash = location.hash;
	if (hash.startsWith('#photo-')) {
		const photoSlug = hash.slice(7);
		const anchors = Array.from(galleryEl.querySelectorAll('a[data-photo-slug]'));
		const idx = anchors.findIndex((a) => a.getAttribute('data-photo-slug') === photoSlug);
		if (idx >= 0) lightbox.loadAndOpen(idx);
	}
});
