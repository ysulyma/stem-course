/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import { translate } from "@docusaurus/Translate";
import { sortBy } from "@site/src/utils/jsUtils";

/*
 * ADD YOUR SITE TO THE DOCUSAURUS SHOWCASE
 *
 * Please don't submit a PR yourself: use the Github Discussion instead:
 * https://github.com/facebook/docusaurus/discussions/7826
 *
 * Instructions for maintainers:
 * - Add the site in the json array below
 * - `title` is the project's name (no need for the "Docs" suffix)
 * - A short (≤120 characters) description of the project
 * - Use relevant tags to categorize the site (read the tag descriptions on the
 *   https://docusaurus.io/showcase page and some further clarifications below)
 * - Add a local image preview (decent screenshot of the Docusaurus site)
 * - The image MUST be added to the GitHub repository, and use `require("img")`
 * - The image has to have minimum width 640 and an aspect of no wider than 2:1
 * - If a website is open-source, add a source link. The link should open
 *   to a directory containing the `docusaurus.config.js` file
 * - Resize images: node admin/scripts/resizeImage.js
 * - Run optimizt manually (see resize image script comment)
 * - Open a PR and check for reported CI errors
 *
 * Example PR: https://github.com/facebook/docusaurus/pull/7620
 */

// LIST OF AVAILABLE TAGS
// Available tags to assign to a showcase site
// Please choose all tags that you think might apply.
// We'll remove inappropriate tags, but it's less likely that we add tags.
export type TagType =
	// DO NOT USE THIS TAG: we choose sites to add to favorites
	"favorite" | "2d" | "3d" | "audio" | "react" | "vanilla";

// Add sites to this list
// prettier-ignore
const Users: User[] = [
	{
		description: "See numbers written in different bases",
		preview: require("./showcase/bases-table.png"),
		source:
			"https://github.com/ysulyma/stem-course/tree/main/content/vanilla/1-fundamentals/3-js/bases",
		tags: ["vanilla"],
		title: "Number bases",
		website: "/content/vanilla/1-fundamentals/3-js/bases/",
	},
	{
		description: "Hear the graph of a 3D function",
		preview: require("./showcase/hear-graph.png"),
		source:
			"https://github.com/ysulyma/stem-course/tree/main/content/framework/app/audio-graph-3d",
		tags: ["3d", "audio", "react"],
		title: "Graph audiation",
		website: "/content/framework/audio-graph-3d.html",
	},
];

export type User = {
	title: string;
	description: string;
	preview: string | null; // null = use our serverless screenshot service
	website: string;
	source: string | null;
	tags: TagType[];
};

export type Tag = {
	label: string;
	description: string;
	color: string;
};

// biome-ignore assist/source/useSortedKeys: ordering is significant here
export const Tags: { [type in TagType]: Tag } = {
	vanilla: {
		color: "light-dark(#ddd, #fff)",
		description: translate({
			id: "showcase.tag.opensource.description",
			message: "Examples written in plain JavaScript (no React or TypeScript)",
		}),
		label: translate({ message: "Vanilla" }),
	},
	react: {
		color: "teal",
		description: translate({
			id: "showcase.tag.opensource.description",
			message: "Examples written in React",
		}),
		label: translate({ message: "React" }),
	},
	"2d": {
		color: "#39ca30",
		description: translate({
			id: "showcase.tag.opensource.description",
			message: "2D graphics (SVG or Canvas)",
		}),
		label: translate({ message: "2D" }),
	},

	"3d": {
		color: "#14cfc3",
		description: translate({
			id: "showcase.tag.personal.description",
			message: "3D graphics (THREE.js)",
		}),
		label: translate({ message: "3D" }),
	},

	audio: {
		color: "#dfd545",
		description: translate({
			id: "showcase.tag.product.description",
			message: "Examples using the web audio API",
		}),
		label: translate({ message: "Audio" }),
	},
	favorite: {
		color: "#e9669e",
		description: translate({
			id: "showcase.tag.favorite.description",
			message:
				"Our favorite Docusaurus sites that you must absolutely check out!",
		}),
		label: translate({ message: "Favorite" }),
	},
};

export const TagList = Object.keys(Tags) as TagType[];
function sortUsers() {
	let result = Users;
	// Sort by site name
	result = sortBy(result, (user) => user.title.toLowerCase());
	// Sort by favorite tag, favorites first
	result = sortBy(result, (user) => !user.tags.includes("favorite"));
	return result;
}

export const sortedUsers = sortUsers();
