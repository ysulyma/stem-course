import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";
import { CodeBooth, EditorPanel, Resize } from "@lqv/codebooth";
import { IconContext } from "@phosphor-icons/react";
import MDXCode from "@theme/MDXComponents/Code";
import MDXPre from "@theme/MDXComponents/Pre";
import {
	createContext,
	isValidElement,
	useContext,
	useMemo,
	useRef,
} from "react";

import { CopyButton } from "./buttons/CopyButton";
import { DownloadButton } from "./buttons/DownloadButton";
import { FullScreenButton } from "./buttons/FullScreenButton";
import { RunButton } from "./buttons/RunButton";
import { IntegratedEditor } from "./ColorSchemeAwareEditor";
import { basicSetup } from "./cm-setup";
import {
	editorTheme,
	editorThemeDark,
	highlightingExtension,
} from "./cm-theme";
import { HTMLPreview } from "./HTMLPreview";
import { FileTabs } from "./livecode/FileTabs";
import { parseMetaString } from "./utils";

import styles from "./LivePreview.module.css";

export type SupportedLanguage = "css" | "html" | "js" | "jsx" | "ts" | "tsx";

export interface LivePreviewFile {
	content: string;
	filename: string;
	language: SupportedLanguage;
}

export interface LivePreviewContext {
	files: LivePreviewFile[];
	livePreview: boolean;
	registerFile: (file: LivePreviewFile) => void;
}

const context = createContext<LivePreviewContext>({
	files: [],
	livePreview: false,
	registerFile: () => {},
});

export function useLiveContext() {
	return useContext(context);
}

function isReactElement<P>(
	obj: unknown,
	component: (props: P) => React.ReactNode,
): obj is React.ReactElement<P> {
	return isValidElement(obj) && obj.type === component;
}

export function LivePreview({
	children,
	height,
}: {
	children?: React.ReactNode;
	height?: number;
}) {
	const files = useMemo((): LivePreviewFile[] => {
		if (isReactElement(children, MDXPre)) children = [children];

		return Array.from(children).reduce((acc, child) => {
			if (!isReactElement(child, MDXPre)) return acc;
			const code = child.props.children;
			if (!isReactElement(code, MDXCode)) return acc;

			const language = code.props.className?.match(/language-([^\s]+)/)?.[1] as
				| SupportedLanguage
				| undefined;
			if (!language) return acc;

			// biome-ignore lint/suspicious/noExplicitAny: types are not completely specified
			const attrs = parseMetaString((code.props as any).metastring ?? "");
			if (!attrs.title) return acc;

			const content = code.props.children;
			if (typeof content !== "string") return acc;

			acc.push({ content, filename: attrs.title, language });
			return acc;
		}, [] as LivePreviewFile[]);
	}, [children]);

	const root = useRef<HTMLElement>(null);

	return (
		<CodeBooth
			className={styles.LivePreview}
			ref={root}
			style={height ? { height: `${height}px` } : {}}
		>
			<div className={styles.header}>
				<FileTabs classNames={{ tab: styles.TabsTrigger }} />
				<div className={styles.controls}>
					<IconContext.Provider
						value={{ color: "currentColor", size: "24px", weight: "bold" }}
					>
						<div className={styles.controlGroup}>
							<RunButton />
							<CopyButton />
						</div>
						<div className={styles.controlGroup}>
							<DownloadButton />
							<FullScreenButton elt={root} />
						</div>
					</IconContext.Provider>
				</div>
			</div>

			<div className={styles.split}>
				{files.map(({ content, filename, language }) => (
					<EditorPanel
						className={styles.TabsContent}
						filename={filename}
						key={filename}
					>
						<IntegratedEditor
							className={styles.editor}
							content={content}
							darkExtensions={[
								editorThemeDark,
								highlightingExtension(language, "dark"),
							]}
							extensions={[basicSetup, languageExtension(language)]}
							lightExtensions={[
								editorTheme,
								highlightingExtension(language, "light"),
							]}
						/>
					</EditorPanel>
				))}

				<Resize max={0.3} min={0.1} />

				<HTMLPreview />
			</div>
		</CodeBooth>
	);
}

// /**
//  * Language-specific tab icon
//  */
// function LanguageIcon({ language }: { language: SupportedLanguage }) {
// 	const content = {
// 		css: "#",
// 		html: "〈〉",
// 		js: "JS",
// 	};
//
// 	return (
// 		<span
// 			className={classNames(
// 				styles.languageIcon,
// 				styles[`language-${language}`],
// 			)}
// 		>
// 			{content[language]}
// 		</span>
// 	);
// }

export function languageExtension(language: SupportedLanguage): Extension {
	switch (language) {
		case "css":
			return css();
		case "html":
			return html();
		case "js":
			return javascript();
		case "jsx":
			return javascript({ jsx: true });
		case "ts":
			return javascript({ typescript: true });
		case "tsx":
			return javascript({ jsx: true, typescript: true });
	}
}
