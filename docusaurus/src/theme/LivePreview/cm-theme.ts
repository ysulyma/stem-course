import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { ColorMode } from "@docusaurus/theme-common";
import { classHighlighter, tags } from "@lezer/highlight";
import { type PrismTheme, themes as prismThemes } from "prism-react-renderer";

import type { SupportedLanguage } from ".";

function findStyle(styles: PrismTheme["styles"], type: string) {
	return styles.filter((s) => s.types.includes(type))?.at(-1)?.style;
}

function editorThemeFromPrism(theme: PrismTheme, dark = false): Extension {
	const editorTheme = EditorView.theme(
		{
			".cm-activeLineGutter": { color: "light-dark(black, white)" },
			".cm-activeLineGutter, .cm-foldGutter, .cm-gutter, .cm-gutters-before, .cm-gutterElement":
				{
					backgroundColor: theme.plain.backgroundColor,
				},
			".cm-content": {
				font: "var(--ifm-code-font-size) / var(--ifm-pre-line-height) var(--ifm-font-family-monospace)",
			},
			".cm-cursor": {
				backgroundColor: "light-dark(black, white)",
				width: "1.5px",
			},
			".cm-gutters": {
				paddingLeft: "8px",
			},
			".cm-lineNumbers": {
				font: "var(--ifm-code-font-size) / var(--ifm-pre-line-height) var(--ifm-font-family-monospace)",
			},
			".cm-scroller": {
				...theme.plain,
			},
      ".cm-tooltip": {
        backgroundColor: `hsl(from ${theme.plain.backgroundColor} h s calc(l ${dark ? "+" : "-"} 5))`,
        borderColor: `hsl(from var(--prism-sep) h s calc(l ${dark ? "+" : "-"} 5))`,
      },
			"&": {
				height: "100%",
			},
		},
		{ dark },
	);

	return editorTheme;
}

function cssFromPrismTheme(theme: PrismTheme) {
	return syntaxHighlighting(
		HighlightStyle.define([
			{ tag: tags.comment, ...findStyle(theme.styles, "comment") },
			{ tag: tags.keyword, ...findStyle(theme.styles, "function") },
			{ color: "orange", tag: tags.atom },
			{ tag: tags.meta, ...findStyle(theme.styles, "doctype") },
			{ tag: tags.operator, ...findStyle(theme.styles, "selector") },
			{ tag: tags.propertyName, ...findStyle(theme.styles, "property") },
			{ tag: tags.string, ...findStyle(theme.styles, "attr-value") },
			{ tag: tags.typeName, ...findStyle(theme.styles, "tag") },
		]),
	);
}

function htmlFromPrismTheme(theme: PrismTheme) {
	return syntaxHighlighting(
		HighlightStyle.define([
			{ tag: tags.comment, ...findStyle(theme.styles, "comment") },
			{ tag: tags.meta, ...findStyle(theme.styles, "doctype") },
			{ tag: tags.propertyName, ...findStyle(theme.styles, "attr-name") },
			{ tag: tags.string, ...findStyle(theme.styles, "attr-value") },
			{ tag: tags.typeName, ...findStyle(theme.styles, "tag") },
		]),
	);
}

function jsFromPrismTheme(theme: PrismTheme) {
	return syntaxHighlighting(
		HighlightStyle.define([
			{ tag: tags.comment, ...findStyle(theme.styles, "comment") },
			{ tag: tags.keyword, ...findStyle(theme.styles, "keyword") },
			{ tag: tags.meta, ...findStyle(theme.styles, "doctype") },
			{ tag: tags.propertyName, ...findStyle(theme.styles, "property-access") },
			{ tag: tags.string, ...findStyle(theme.styles, "attr-value") },
			{ tag: tags.typeName, ...findStyle(theme.styles, "tag") },

			{ tag: tags.variableName, ...findStyle(theme.styles, "variable") },
		]),
	);
}

export const editorTheme = [
	editorThemeFromPrism(prismThemes.github),
	syntaxHighlighting(classHighlighter),
];

export const editorThemeDark = [
	editorThemeFromPrism(prismThemes.dracula, true),
	syntaxHighlighting(classHighlighter),
];

export const cssHighlighting = [
	cssFromPrismTheme(prismThemes.github),
	syntaxHighlighting(classHighlighter),
];
export const cssHighlightingDark = cssFromPrismTheme(prismThemes.dracula);

export const htmlHighlighting = htmlFromPrismTheme(prismThemes.github);
export const htmlHighlightingDark = htmlFromPrismTheme(prismThemes.dracula);

export const jsHighlighting = jsFromPrismTheme(prismThemes.github);
export const jsHighlightingDark = jsFromPrismTheme(prismThemes.dracula);

export function highlightingExtension(
	language: SupportedLanguage,
	scheme: ColorMode,
) {
	switch (language) {
		case "css":
			return scheme === "light" ? cssHighlighting : cssHighlightingDark;
		case "html":
			return scheme === "light" ? htmlHighlighting : htmlHighlightingDark;
		case "js":
		case "jsx":
		case "ts":
		case "tsx":
			return scheme === "light" ? jsHighlighting : jsHighlightingDark;
	}
}
