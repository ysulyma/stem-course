/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable global-require */

import Translate, { translate } from "@docusaurus/Translate";
import React from "react";

const QUOTES = [
	{
		name: 'Christopher "vjeux" Chedeau',
		text: (
			<Translate
				description="Quote of Christopher Chedeau on the home page"
				id="homepage.quotes.christopher-chedeau"
			>
				I&apos;ve helped open source many projects at Facebook and every one
				needed a website. They all had very similar constraints: the
				documentation should be written in markdown and be deployed via GitHub
				pages. I’m so glad that Docusaurus now exists so that I don’t have to
				spend a week each time spinning up a new one.
			</Translate>
		),
		thumbnail: require("./quotes/christopher-chedeau.jpg"),
		title: translate({
			description: "Title of quote of Christopher Chedeau on the home page",
			id: "homepage.quotes.christopher-chedeau.title",
			message: "Lead Prettier Developer",
		}),
	},
	{
		name: "Hector Ramos",
		text: (
			<Translate
				description="Quote of Hector Ramos on the home page"
				id="homepage.quotes.hector-ramos"
			>
				Open source contributions to the React Native docs have skyrocketed
				after our move to Docusaurus. The docs are now hosted on a small repo in
				plain markdown, with none of the clutter that a typical static site
				generator would require. Thanks Slash!
			</Translate>
		),
		thumbnail: require("./quotes/hector-ramos.jpg"),
		title: translate({
			description: "Title of quote of Hector Ramos on the home page",
			id: "homepage.quotes.hector-ramos.title",
			message: "Lead React Native Advocate",
		}),
	},
	{
		name: "Ricky Vetter",
		text: (
			<Translate
				description="Quote of Ricky Vetter on the home page"
				id="homepage.quotes.risky-vetter"
			>
				Docusaurus has been a great choice for the ReasonML family of projects.
				It makes our documentation consistent, i18n-friendly, easy to maintain,
				and friendly for new contributors.
			</Translate>
		),
		thumbnail: require("./quotes/ricky-vetter.jpg"),
		title: translate({
			description: "Title of quote of Ricky Vetter on the home page",
			id: "homepage.quotes.risky-vetter.title",
			message: "ReasonReact Developer",
		}),
	},
];

export default QUOTES;
