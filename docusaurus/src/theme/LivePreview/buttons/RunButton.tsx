import { Run } from "@lqv/codebooth";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";

import styles from "../LivePreview.module.css";

export function RunButton() {
	return (
		<Run className={styles.button} shortcut="Mod-Enter" title="Refresh (⌘↩)">
			<ArrowClockwiseIcon />
		</Run>
	);
}
