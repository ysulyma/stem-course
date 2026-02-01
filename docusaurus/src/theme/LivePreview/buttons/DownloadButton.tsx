import { useBoothStore } from "@lqv/codebooth";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import JSZip from "jszip";
import { useCallback } from "react";
import { useStore } from "zustand/react";
import { useShallow } from "zustand/shallow";

import { getFileType, getMimeType, viewContents } from "../utils";

import styles from "../LivePreview.module.css";

export function DownloadButton() {
	const store = useBoothStore();

	const { activeGroup, groups } = useStore(
		store,
		useShallow((state) => ({
			activeGroup: state.activeGroup,
			groups: state.groups,
		})),
	);

	const downloadCurrent = useCallback(() => {
		const { filename, view } = store.getState().getActiveFile();
		download({
			content: viewContents(view),
			filename,
			mime: getMimeType(getFileType(filename)),
		});
	}, [store]);

	const downloadZip = useCallback(async () => {
		const zip = new JSZip();
		const { activeGroup, groups } = store.getState();

		for (const { filename, view } of groups[activeGroup].files) {
			zip.file(filename, viewContents(view));
		}

		const content = await zip.generateAsync({ type: "blob" });

		download({
			content,
			filename: "example.zip",
		});
	}, [store]);

	const numFiles = groups[activeGroup]?.files.length ?? 0;

	if (numFiles <= 1) {
		return (
			<button
				className={styles.button}
				disabled={numFiles === 0}
				onClick={downloadCurrent}
				title="Download"
				type="button"
			>
				<DownloadSimpleIcon />
			</button>
		);
	}

	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className={styles.button} title="Download">
				<DownloadSimpleIcon />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content
					align="end"
					className={styles.DropdownMenuContent}
					sideOffset={2}
				>
					<DropdownMenu.Item
						className={styles.DropdownMenuItem}
						onClick={downloadCurrent}
					>
						Current file
					</DropdownMenu.Item>
					<DropdownMenu.Item
						className={styles.DropdownMenuItem}
						onClick={downloadZip}
					>
						All as .zip
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
}

async function download({
	content,
	filename,
	mime,
}:
	| {
			content: string;
			filename: string;
			mime: string;
	  }
	| {
			content: Blob;
			filename: string;
			mime?: undefined;
	  }) {
	let blob: Blob;
	if (typeof content === "string") {
		blob = new Blob([content], { type: mime });
	} else {
		blob = content;
	}

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
