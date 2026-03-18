module.exports = {
	tags: [
		"galleries"
	],
	"layout": "layouts/gallery.njk",
	"permalink": "/galleries/{{ page.filePathStem.replace('/galleries/', '/') }}/",
};
