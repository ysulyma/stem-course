/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { translate } from "@docusaurus/Translate";
import { useSearchName } from "@site/src/pages/showcase/_utils";
import type { ReactNode } from "react";

import styles from "./styles.module.css";

export default function ShowcaseSearchBar(): ReactNode {
	const [searchName, setSearchName] = useSearchName();
	return (
		<div className={styles.searchBar}>
			<input
				onInput={(e) => {
					setSearchName(e.currentTarget.value);
				}}
				placeholder={translate({
					id: "showcase.searchBar.placeholder",
					message: "Search for site name...",
				})}
				value={searchName}
			/>
		</div>
	);
}
