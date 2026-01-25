/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useClearQueryString } from "@docusaurus/theme-common";
import React, { type ReactNode } from "react";

export default function ClearAllButton(): ReactNode {
	const clearQueryString = useClearQueryString();
	// TODO translate
	return (
		<button
			className="button button--outline button--primary"
			onClick={() => clearQueryString()}
			type="button"
		>
			Clear All
		</button>
	);
}
