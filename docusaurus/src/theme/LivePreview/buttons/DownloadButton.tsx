import { useBoothStore } from "@lqv/codebooth";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import { useCallback } from "react";
import { useStore } from "zustand/react";

import { getFileType, getMimeType, viewContents } from "../utils";

import styles from "../LivePreview.module.css";

export function DownloadButton() {
	const getActiveFile = useStore(
		useBoothStore(),
		(state) => state.getActiveFile,
	);

	const onClick = useCallback(() => {
		const { filename, view } = getActiveFile();
		download({
			content: viewContents(view),
			filename,
			mime: getMimeType(getFileType(filename)),
		});
	}, [getActiveFile]);

	return (
		<button className={styles.button} title="Download" type="button">
			<DownloadSimpleIcon onClick={onClick} />
		</button>
	);
}

async function download({
	content,
	filename,
	mime,
}: {
	content: string;
	filename: string;
	mime: string;
}) {
	const blob = new Blob([content], { type: mime });

	const url = URL.createObjectURL(blob);

	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;

	// Append to the DOM
	document.body.appendChild(anchor);

	// Trigger `click` event
	anchor.click();

	// Remove element from DOM
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}
