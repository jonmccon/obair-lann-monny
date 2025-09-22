module.exports = {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	"permalink": "/projects/{{ page.filePathStem.replace('/blog/', '/') }}/",
};
