/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import clsx from "clsx";
import React, { useId } from "react";

import { useOperator } from "../../_utils";

import styles from "./styles.module.css";

export default function OperatorButton() {
	const id = useId();
	const [operator, toggleOperator] = useOperator();
	// TODO add translations
	return (
		<>
			<input
				aria-label="Toggle between or and and for the tags you selected"
				checked={operator === "AND"}
				className="screen-reader-only"
				id={id}
				onChange={toggleOperator}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						toggleOperator();
					}
				}}
				type="checkbox"
			/>
			<label className={clsx(styles.checkboxLabel, "shadow--md")} htmlFor={id}>
				{/* eslint-disable @docusaurus/no-untranslated-text */}
				<span className={styles.checkboxLabelOr}>OR</span>
				<span className={styles.checkboxLabelAnd}>AND</span>
				{/* eslint-enable @docusaurus/no-untranslated-text */}
			</label>
		</>
	);
}
