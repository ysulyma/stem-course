import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";
import { CodeBooth, EditorPanel, Resize, Run } from "@lqv/codebooth";
import { ArrowClockwiseIcon, IconContext } from "@phosphor-icons/react";
import MDXCode from "@theme/MDXComponents/Code";
import MDXPre from "@theme/MDXComponents/Pre";
import {
	createContext,
	isValidElement,
	useContext,
	useMemo,
	useRef,
} from "react";

import { IntegratedEditor } from "./ColorSchemeAwareEditor";
import { basicSetup } from "./cm-setup";
import {
	editorTheme,
	editorThemeDark,
	highlightingExtension,
} from "./cm-theme";
import { DownloadButton } from "./DownloadButton";
import { FullScreenButton } from "./FullScreenButton";
import { HTMLPreview } from "./HTMLPreview";
import { FileTabs } from "./livecode/FileTabs";

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

export function LivePreview({ children }: { children?: React.ReactNode }) {
	const files = useMemo((): LivePreviewFile[] => {
		if (!Array.isArray(children)) return [];

		return Array.from(children).reduce((acc, child) => {
			if (!isReactElement(child, MDXPre)) return acc;
			const code = child.props.children;
			if (!isReactElement(code, MDXCode)) return acc;

			const language = code.props.className?.match(/language-([^\s]+)/)?.[1];
			if (!language) return acc;

			// biome-ignore lint/suspicious/noExplicitAny: types are not completely specified
			const filename = (code.props as any).metastring?.match(
				/title="([^"]+)"/,
			)?.[1];
			if (!filename) return acc;

			const content = code.props.children;
			if (typeof content !== "string") return acc;

			acc.push({ content, filename, language });
			return acc;
		}, [] as LivePreviewFile[]);
	}, [children]);

	const root = useRef<HTMLElement>(null);

	return (
		<CodeBooth className={styles.LivePreview} ref={root}>
			<div className={styles.header}>
				<FileTabs classNames={{ tab: styles.TabsTrigger }} />
				<div className={styles.controls}>
					<IconContext.Provider
						value={{ color: "currentColor", size: 24, weight: "bold" }}
					>
						<div className={styles.controlGroup}>
							<Run
								className={styles.button}
								shortcut="Mod-Enter"
								title="Refresh (⌘↩)"
							>
								<ArrowClockwiseIcon />
							</Run>
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
