import { EditorSelection, type SelectionRange } from "@codemirror/state";
import type { EditorView } from "@codemirror/view";
import { useBoothStore } from "@lqv/codebooth";
import { BracketsCurlyIcon } from "@phosphor-icons/react";
import * as prettier from "prettier";
import htmlPlugin from "prettier/plugins/html";
import cssPlugin from "prettier/plugins/postcss";
import { useCallback, useEffect } from "react";
import { useStore } from "zustand";

import { getFileType } from "../utils";

import styles from "../LivePreview.module.css";

export function FormatButton({ shortcut }: { shortcut?: string }) {
	const store = useBoothStore();
	const getActiveFile = useStore(store, (state) => state.getActiveFile);

	const formatCurrentFile = useCallback(async () => {
		const { filename, view } = getActiveFile();
		const extn = getFileType(filename);

		let formatter: Formatter;
		switch (extn) {
			case "css":
				formatter = (code) =>
					prettier.format(code, {
						filepath: filename,
						parser: "css",
						plugins: [cssPlugin],
					});
				break;
			case "html":
				formatter = (code) =>
					prettier.format(code, { filepath: filename, plugins: [htmlPlugin] });
				break;
			case "js":
				formatter = (code) => prettier.format(code, { filepath: filename });
				break;
		}

		formatView(view, formatter);
	}, [getActiveFile]);

	/* add keyboard shortcuts */
	useEffect(() => {
		store.setState((prev) => ({
			shortcuts: {
				...prev.shortcuts,
				[shortcut]: {
					key: shortcut,
					run: () => {
						formatCurrentFile();
						return true;
					},
				},
			},
		}));

		return () => {
			store.setState((prev) => ({
				shortcuts: Object.fromEntries(
					Object.entries(prev.shortcuts).filter(([key]) => key !== shortcut),
				),
			}));
		};
	}, [shortcut, store.setState, formatCurrentFile]);

	return (
		<button
			className={styles.button}
			onClick={formatCurrentFile}
			title="Format (⌘;)"
			type="button"
		>
			<BracketsCurlyIcon />
		</button>
	);
}

type Formatter = (code: string) => Promise<string>;

async function formatView(view: EditorView, formatter: Formatter) {
	const unformatted = view.state.doc.toString();

	try {
		const formatted = await formatter(unformatted);
		console.log(formatted);

		const newSelection = preserveSelection(
			view.state.selection.main,
			unformatted,
			formatted,
		);

		view.dispatch(
			view.state.update({
				changes: {
					from: 0,
					insert: formatted,
					to: view.state.doc.length,
				},
				selection: newSelection,
			}),
		);
	} catch (e) {
		console.error(e);
	}
}

/** Characters that get inserted by Prettier */
const aestheticChars = /[\s(),;]/g;

/** Preserve selection when formatting with Prettier */
function preserveSelection(
	selection: SelectionRange,
	unformatted: string,
	formatted: string,
): EditorSelection {
	return EditorSelection.single(
		offset(selection.anchor, unformatted, formatted),
		offset(selection.head, unformatted, formatted),
	);
}

/** Guess the cursor offset in text after applying formatting */
function offset(pos: number, ugly: string, pretty: string): number {
	let newPos = 0;

	const normalized = ugly.slice(0, pos).replace(/[\s(),]/g, "");

	for (let i = 0; i < normalized.length && newPos < pretty.length; ++newPos) {
		if (pretty[newPos].match(aestheticChars)) {
			continue;
		}

		i++;
	}

	return newPos;
}
