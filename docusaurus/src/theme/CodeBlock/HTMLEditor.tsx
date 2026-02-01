import { indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { useEffect, useRef } from "react";

import { basicSetup } from "./cm-setup";

export function HTMLEditor({
	content,
	refresh,
	view: propsView,
}: {
	content: string;
	refresh: () => boolean;
	view: React.RefObject<EditorView>;
}) {
	const ref = useRef(null);
	useEffect(() => {
		const view = new EditorView({
			state: EditorState.create({
				doc: content,
				extensions: [
					basicSetup,
					keymap.of([indentWithTab]),
					// refresh iframe
					keymap.of([
						{
							key: "Mod-Enter",
							run: refresh,
						},
					]),
					html(),
				],
			}),
		});

		ref.current.replaceWith(view.dom);
		propsView.current = view;
	}, [content, refresh, propsView]);
	return <div ref={ref} />;
}
