import Heading from "@theme/Heading";
import clsx from "clsx";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

type FeatureItem = {
	title: string;
	Svg: React.ComponentType<React.ComponentProps<"svg">>;
	description: ReactNode;
};

const FeatureList: FeatureItem[] = [
	{
		description: (
			<>
				No prior background is assumed, but by the end you will be a seasoned
				frontend developer.
			</>
		),
		Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
		title: "Comprehensive",
	},
	{
		description: (
			<>
				2d and 3d graphics, running Python in the browser, interactive
				videos—whatever you want to achieve, we've got you covered.
			</>
		),
		Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
		title: "Tons of examples",
	},
	{
		description: <>All our examples can be run in the browser!</>,
		Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
		title: "Interactive",
	},
];

function Feature({ title, Svg, description }: FeatureItem) {
	return (
		<div className={clsx("col col--4")}>
			<div className="text--center">
				<Svg className={styles.featureSvg} role="img" />
			</div>
			<div className="text--center padding-horiz--md">
				<Heading as="h3">{title}</Heading>
				<p>{description}</p>
			</div>
		</div>
	);
}

export default function HomepageFeatures(): ReactNode {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					{FeatureList.map((props, idx) => (
						<Feature key={idx} {...props} />
					))}
				</div>
			</div>
		</section>
	);
}
