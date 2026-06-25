import PhotoSwipeLightbox from '/js/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from '/js/photoswipe.esm.min.js';

document.querySelectorAll('.photo-gallery').forEach((galleryEl) => {
	const lightbox = new PhotoSwipeLightbox({
		gallery: galleryEl,
		children: 'a',
		pswpModule: PhotoSwipe,
		preload: [1, 1]
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
