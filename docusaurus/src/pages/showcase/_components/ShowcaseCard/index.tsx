/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import { TagList, Tags, type TagType, type User } from "@site/src/data/users";
import { sortBy } from "@site/src/utils/jsUtils";
import Heading from "@theme/Heading";
import Image from "@theme/IdealImage";
import clsx from "clsx";
import React from "react";

import FavoriteIcon from "../FavoriteIcon";

import styles from "./styles.module.css";

function TagItem({
	label,
	description,
	color,
}: {
	label: string;
	description: string;
	color: string;
}) {
	return (
		<li className={styles.tag} title={description}>
			<span className={styles.textLabel}>{label.toLowerCase()}</span>
			<span className={styles.colorLabel} style={{ backgroundColor: color }} />
		</li>
	);
}

function ShowcaseCardTag({ tags }: { tags: TagType[] }) {
	const tagObjects = tags.map((tag) => ({ tag, ...Tags[tag] }));

	// Keep same order for all tags
	const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
		TagList.indexOf(tagObject.tag),
	);

	return (
		<>
			{tagObjectsSorted.map((tagObject, index) => {
				return <TagItem key={index} {...tagObject} />;
			})}
		</>
	);
}

function ShowcaseCard({ user }: { user: User }) {
	return (
		<li className="card shadow--md" key={user.title}>
			<div className={clsx("card__image", styles.showcaseCardImage)}>
				<Link
					className={styles.showcaseCardLink}
					href={user.website}
					target="_blank"
				>
					<Image alt={user.title} img={user.preview} />
				</Link>
			</div>
			<div className="card__body">
				<div className={clsx(styles.showcaseCardHeader)}>
					<Heading as="h4" className={styles.showcaseCardTitle}>
						<Link
							className={styles.showcaseCardLink}
							href={user.website}
							target="_blank"
						>
							{user.title}
						</Link>
					</Heading>
					{user.tags.includes("favorite") && (
						<FavoriteIcon size="medium" style={{ marginRight: "0.25rem" }} />
					)}
					{user.source && (
						<Link
							className={clsx(
								"button button--secondary button--sm",
								styles.showcaseCardSrcBtn,
							)}
							href={user.source}
						>
							<Translate id="showcase.card.sourceLink">source</Translate>
						</Link>
					)}
				</div>
				<p className={styles.showcaseCardBody}>{user.description}</p>
			</div>
			<ul className={clsx("card__footer", styles.cardFooter)}>
				<ShowcaseCardTag tags={user.tags} />
			</ul>
		</li>
	);
}

export default React.memo(ShowcaseCard);
