/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import ShowcaseSearchBar from "@site/src/pages/showcase/_components/ShowcaseSearchBar";
import Heading from "@theme/Heading";
import Layout from "@theme/Layout";
import type { ReactNode } from "react";

import ShowcaseCards from "./_components/ShowcaseCards";
import ShowcaseFilters from "./_components/ShowcaseFilters";

const TITLE = translate({ message: "Docusaurus Site Showcase" });
const DESCRIPTION = translate({
	message: "List of websites people are building with Docusaurus",
});
const SUBMIT_URL = "https://github.com/facebook/docusaurus/discussions/7826";

function ShowcaseHeader() {
	return (
		<section className="margin-top--lg margin-bottom--lg text--center">
			<Heading as="h1">{TITLE}</Heading>
			<p>{DESCRIPTION}</p>
			{/* <Link className="button button--primary" to={SUBMIT_URL}> */}
			{/* 	<Translate id="showcase.header.button"> */}
			{/* 		🙏 Please add your site */}
			{/* 	</Translate> */}
			{/* </Link> */}
		</section>
	);
}

export default function Showcase(): ReactNode {
	return (
		<Layout description={DESCRIPTION} title={TITLE}>
			<main className="margin-vert--lg">
				<ShowcaseHeader />
				<ShowcaseFilters />
				<div
					className="container"
					style={{ display: "flex", marginLeft: "auto" }}
				>
					<ShowcaseSearchBar />
				</div>
				<ShowcaseCards />
			</main>
		</Layout>
	);
}
