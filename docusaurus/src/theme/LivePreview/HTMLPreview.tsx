import { useColorMode } from "@docusaurus/theme-common";
import { useBoothStore } from "@lqv/codebooth";
import { useCallback, useEffect, useRef } from "react";

import { render, viewContents } from "./utils";

import styles from "./LivePreview.module.css";

import type { LivePreviewMeta } from ".";

export function HTMLPreview({
	meta,
}: {
	meta?: Record<string, LivePreviewMeta>;
}) {
	const store = useBoothStore();

	const { colorMode } = useColorMode();

	const iframe = useRef<HTMLIFrameElement>(null);

	const setColorMode = useCallback(() => {
		iframe.current?.contentWindow.postMessage(
			{
				colorScheme: colorMode,
				type: "color-scheme",
			},
			"*",
		);
	}, [colorMode]);

	useEffect(() => {
		setColorMode();
	}, [setColorMode]);

	useEffect(() => {
		const frame = iframe.current;
		if (!frame) return;

		frame.addEventListener("load", setColorMode);

		return () => {
			frame.removeEventListener("load", setColorMode);
		};
	});

	const refresh = useCallback(() => {
		const { groups, activeGroup } = store.getState();
		const files = groups?.[activeGroup]?.files ?? [];

		const args = files.reduce(
			(acc, { filename, view }) => {
				const language = filename.slice(filename.lastIndexOf(".") + 1);

				switch (language) {
					case "css":
						acc.css[filename] = viewContents(view);
						break;
					case "js":
						if (meta?.[filename]?.type === "module") {
							acc.esm[filename] = viewContents(view);
						} else {
							acc.js[filename] = viewContents(view);
						}
						break;
					case "html":
						acc.html = viewContents(view);
						break;
				}
				return acc;
			},
			{ css: {}, esm: {}, html: "", js: {} } as Parameters<typeof render>[0],
		);

		iframe.current.srcdoc = render(args);

		return true;
	}, [meta, store]);

	// initial render
	useEffect(() => {
		refresh();

		return store.subscribe(
			(state) => state.run,
			() => {
				refresh();
			},
		);
	}, [refresh, store]);

	return (
		<iframe
			allowFullScreen
			className={styles.iframe}
			ref={iframe}
			title="Preview"
		/>
	);
}
