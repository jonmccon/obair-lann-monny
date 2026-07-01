module.exports = {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
	"permalink": "/design/{{ page.filePathStem.replace('/design/', '/') }}/",
};
