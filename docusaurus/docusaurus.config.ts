import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
	// Set the /<baseUrl>/ pathname under which your site is served
	// For GitHub pages deployment, it is often '/<projectName>/'
	baseUrl: "/",
	favicon: "img/favicon.ico",

	// Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
	future: {
		v4: true, // Improve compatibility with the upcoming Docusaurus v4
	},

	// Even if you don't use internationalization, you can use this field to set
	// useful metadata like html lang. For example, if your site is Chinese, you
	// may want to replace "en" with "zh-Hans".
	i18n: {
		defaultLocale: "en",
		locales: ["en"],
	},

	onBrokenLinks: "throw",

	// GitHub pages deployment config.
	// If you aren't using GitHub pages, you don't need these.
	// organizationName: "facebook", // Usually your GitHub org/user name.

	plugins: [
		() => ({
			configureWebpack() {
				return {
					module: {
						rules: [{ test: /\.html$/, use: "raw-loader" }],
					},
				};
			},
			name: "loadHTML",
		}),
		[
			"@docusaurus/plugin-ideal-image",
			{
				disableInDev: false,
				max: 1030, // max resized image's size.
				min: 640, // min resized image's size. if original is lower, use that size.
				quality: 70,
				steps: 2, // the max number of images generated between min and max (inclusive)
			},
		],
	],

	presets: [
		[
			"classic",
			{
				blog: {
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
					feedOptions: {
						type: ["rss", "atom"],
						xslt: true,
					},
					onInlineAuthors: "warn",
					// Useful options to enforce blogging best practices
					onInlineTags: "warn",
					onUntruncatedBlogPosts: "warn",
					showReadingTime: true,
				},
				docs: {
					// Please change this to your repo.
					// Remove this to remove the "edit this page" links.
					editUrl:
						"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
					sidebarPath: "./sidebars.ts",
				},
				theme: {
					customCss: "./src/css/custom.css",
				},
			} satisfies Preset.Options,
		],
	],
	projectName: "docusaurus", // Usually your repo name.
	tagline:
		"Learn to make interactive web visualizations, specifically aimed at STEM content",

	themeConfig: {
		// algolia: {
		// 	// Public API key: it is safe to commit it
		// 	apiKey: "YOUR_SEARCH_API_KEY",
		// 	// The application ID provided by Algolia
		// 	appId: "YOUR_APP_ID",
		//
		// 	// Optional: whether you want to use the new Ask AI feature (undefined by default)
		// 	askAi: "YOUR_ALGOLIA_ASK_AI_ASSISTANT_ID",
		//
		// 	// Optional: see doc section below
		// 	contextualSearch: true,
		//
		// 	// Optional: Specify domains where the navigation should occur through window.location instead on history.push. Useful when our Algolia config crawls multiple documentation sites and we want to navigate with window.location.href to them.
		// 	externalUrlRegex: "external\\.com|domain\\.com",
		//
		// 	indexName: "YOUR_INDEX_NAME",
		//
		// 	// Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
		// 	insights: false,
		//
		// 	// Optional: Replace parts of the item URLs from Algolia. Useful when using the same search index for multiple deployments using a different baseUrl. You can use regexp or string in the `from` param. For example: localhost:3000 vs myCompany.com/docs
		// 	replaceSearchResultPathname: {
		// 		from: "/docs/", // or as RegExp: /\/docs\//
		// 		to: "/",
		// 	},
		//
		// 	// Optional: path for search page that enabled by default (`false` to disable it)
		// 	searchPagePath: "search",
		//
		// 	// Optional: Algolia search parameters
		// 	searchParameters: {},
		//
		// 	//... other Algolia params
		// },
		colorMode: {
			respectPrefersColorScheme: true,
		},
		footer: {
			copyright: `Copyright © ${new Date().getFullYear()} Yuri Sulyma. Built with Docusaurus.`,
			links: [
				// {
				// 	title: "Docs",
				// 	items: [
				// 		{
				// 			label: "Tutorial",
				// 			to: "/docs/intro",
				// 		},
				// 	],
				// },
				{
					items: [
						{
							href: "https://discord.gg/u8Qab99zHx",
							label: "Discord",
						},
					],
					title: "Community",
				},
				{
					items: [
						// {
						// 	label: "Blog",
						// 	to: "/blog",
						// },
						{
							href: "https://github.com/ysulyma/stem-course",
							label: "GitHub",
						},
					],
					title: "More",
				},
			],
			style: "dark",
		},
		// Replace with your project's social card
		image: "img/docusaurus-social-card.jpg",
		navbar: {
			items: [
				{
					label: "🍦 Vanilla",
					position: "left",
					sidebarId: "tutorialSidebar",
					type: "docSidebar",
				},
				{
					label: "🪩 Framework",
					position: "left",
					sidebarId: "reactSidebar",
					type: "docSidebar",
				},
				// {
				// 	label: "🤯 Video",
				// 	position: "left",
				// 	sidebarId: "liqvidSidebar",
				// 	type: "docSidebar",
				// },
				{
					label: "🧐 Tips",
					position: "left",
					sidebarId: "tipsSidebar",
					type: "docSidebar",
				},
				{ label: "🖼 Showcase", position: "right", to: "showcase" },
				// {
				// 	position: "right",
				// 	type: "localeDropdown",
				// },
				{
					href: "https://github.com/ysulyma/stem-course",
					label: "GitHub",
					position: "right",
				},
			],
			logo: {
				alt: "My Site Logo",
				src: "img/logo.svg",
			},
			title: "JS × STEM",
		},
		prism: {
			additionalLanguages: ["bash", "css"],
			darkTheme: prismThemes.dracula,
			theme: prismThemes.github,
		},
	} satisfies Preset.ThemeConfig,

	themes: ["@docusaurus/theme-live-codeblock"],
	title: "JavaScript for STEM",

	// Set the production url of your site here
	url: "https://stem-course.liqvidjs.org",
};

export default config;
