import { useBoothStore } from "@lqv/codebooth";
import { useCallback, useEffect, useRef } from "react";

import { render, viewContents } from "./utils";

import styles from "./LivePreview.module.css";

export function HTMLPreview() {
	const store = useBoothStore();

	const iframe = useRef<HTMLIFrameElement>(null);

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
						acc.js[filename] = viewContents(view);
						break;
					case "html":
						acc.html = viewContents(view);
						break;
				}
				return acc;
			},
			{ css: {}, html: "", js: {} } as Parameters<typeof render>[0],
		);

		iframe.current.srcdoc = render(args);

		return true;
	}, [store]);

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
