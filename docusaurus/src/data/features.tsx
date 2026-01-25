/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Translate, { translate } from "@docusaurus/Translate";
import React, { type ReactNode } from "react";

export type FeatureItem = {
	title: string;
	image: {
		src: string;
		width: number;
		height: number;
	};
	text: ReactNode;
};

const FEATURES: FeatureItem[] = [
	{
		image: {
			height: 717.96,
			src: "/img/undraw_typewriter.svg",
			width: 1009.54,
		},
		text: (
			<Translate id="homepage.features.powered-by-mdx.text">
				Save time and focus on text documents. Simply write docs and blog posts
				with MDX, and Docusaurus builds them into static HTML files ready to be
				served. You can even embed React components in your Markdown thanks to
				MDX.
			</Translate>
		),
		title: translate({
			id: "homepage.features.powered-by-mdx.title",
			message: "Powered by MDX",
		}),
	},
	{
		image: {
			height: 731.18,
			src: "/img/undraw_react.svg",
			width: 1108,
		},
		text: (
			<Translate id="homepage.features.built-using-react.text">
				Extend and customize your project&apos;s layout by writing React
				components. Leverage the pluggable architecture, and design your own
				site while reusing the same data created by Docusaurus plugins.
			</Translate>
		),
		title: translate({
			id: "homepage.features.built-using-react.title",
			message: "Built Using React",
		}),
	},
	{
		image: {
			height: 776.59,
			src: "/img/undraw_around_the_world.svg",
			width: 1137,
		},
		text: (
			<Translate id="homepage.features.ready-for-translations.text">
				Localization comes out-of-the-box. Use git, Crowdin, or any other
				translation manager to translate your docs and deploy them individually.
			</Translate>
		),
		title: translate({
			id: "homepage.features.ready-for-translations.title",
			message: "Ready for Translations",
		}),
	},
	{
		image: {
			height: 693.31,
			src: "/img/undraw_version_control.svg",
			width: 1038.23,
		},
		text: (
			<Translate id="homepage.features.document-versioning.text">
				Support users on all versions of your project. Document versioning helps
				you keep documentation in sync with project releases.
			</Translate>
		),
		title: translate({
			id: "homepage.features.document-versioning.title",
			message: "Document Versioning",
		}),
	},
	{
		image: {
			height: 736.21,
			src: "/img/undraw_algolia.svg",
			width: 1137.97,
		},
		text: (
			<Translate id="homepage.features.content-search.text">
				Make it easy for your community to find what they need in your
				documentation. We proudly support Algolia documentation search.
			</Translate>
		),
		title: translate({
			id: "homepage.features.content-search.title",
			message: "Content Search",
		}),
	},
];

export default FEATURES;
