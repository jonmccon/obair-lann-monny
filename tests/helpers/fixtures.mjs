/**
 * Test fixtures and sample data
 */

export const sampleMetadata = {
	title: 'Test Site',
	url: 'https://example.com',
	language: 'en',
	description: 'A test site',
	author: {
		name: 'Test Author',
		email: 'test@example.com',
		url: 'https://example.com/author',
	},
};

export const samplePost = {
	url: '/design/sample-project/',
	date: new Date('2024-01-15'),
	data: {
		title: 'Sample Project',
		tags: ['design', 'web'],
		images: [
			{ src: './test.jpg', alt: 'Test image' },
		],
		featured: false,
		draft: false,
	},
};

export const sampleFeaturedPost = {
	url: '/design/featured-project/',
	date: new Date('2024-02-01'),
	data: {
		title: 'Featured Project',
		tags: ['design'],
		images: [
			{ src: './featured.jpg', alt: 'Featured image' },
		],
		featured: true,
		draft: false,
	},
};

export const sampleGallery = {
	url: '/galleries/test-gallery/',
	date: new Date('2024-03-01'),
	data: {
		title: 'Test Gallery',
		tags: ['galleries'],
		draft: false,
	},
};

export const sampleCollection = [samplePost, sampleFeaturedPost, sampleGallery];

export const sampleHtmlContent = `
	<h1>Test Heading</h1>
	<p>This is a test paragraph with some content.</p>
	<picture>
		<source srcset="test.webp" type="image/webp">
		<img src="test.jpg" alt="Test">
	</picture>
	<p>More content after the image.</p>
	<iframe src="video.mp4"></iframe>
	<script>console.log('test');</script>
`;
