import { Run } from "@lqv/codebooth";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";

import styles from "../LivePreview.module.css";

export function RunButton({ shortcut }: { shortcut?: string }) {
	return (
		<Run className={styles.button} shortcut={shortcut} title="Refresh (⌘↩)">
			<ArrowClockwiseIcon />
		</Run>
	);
}
