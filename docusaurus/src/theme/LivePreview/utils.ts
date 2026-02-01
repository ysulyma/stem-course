import type { EditorView } from "@codemirror/view";

import type { SupportedLanguage } from ".";

export function serializeDocument(doc: Document) {
	return Array.from(doc.childNodes)
		.map((node) => {
			if (isDocumentTypeNode(node)) {
				let str = `<!DOCTYPE ${node.nodeName}`;
				if (node.publicId) {
					str += ` PUBLIC ${JSON.stringify(node.publicId)}`;
				}
				if (node.systemId) {
					str += ` ${JSON.stringify(node.systemId)}`;
				}
				str += ">";
				return str;
			} else if (isElement(node)) {
				return node.outerHTML;
			}
			return node.toString();
		})
		.join("");
}

function isDocumentTypeNode(node: Node): node is DocumentType {
	return node.nodeType === node.DOCUMENT_TYPE_NODE;
}

function isElement(node: Node): node is Element {
	return node.nodeType === node.ELEMENT_NODE;
}

export function normalizePath(path: string) {
	if (path.startsWith("./")) return path.slice("./".length);
	return path;
}

/**
 * Merge <link> and <script> tags into a single document
 */
export function render({
	css = {},
	js = {},
	html,
}: {
	css?: Record<string, string>;
	js?: Record<string, string>;
	html: string;
}) {
	const doc = new DOMParser().parseFromString(html, "text/html");

	// replace <link> tags
	for (const linkTag of Array.from(
		doc.querySelectorAll("link[href]"),
	) as HTMLLinkElement[]) {
		const href = linkTag.getAttribute("href");
		const styleSheet = css[normalizePath(href)];
		if (!styleSheet) continue;

		const style = doc.createElement("style");
		style.textContent = styleSheet;
		linkTag.replaceWith(style);
	}

	// replace <script> tags
	for (const scriptTag of Array.from(
		doc.querySelectorAll("script[src]"),
	) as HTMLScriptElement[]) {
		const src = scriptTag.getAttribute("src");
		const script = js[normalizePath(src)];
		if (!script) continue;

		scriptTag.removeAttribute("src");
		scriptTag.textContent = script;
	}

	// insert client script
	{
		const script = document.createElement("script");
		script.appendChild(document.createTextNode(clientScript));
		doc.querySelector("head").appendChild(script);
	}

	return serializeDocument(doc);
}

export function viewContents(view: EditorView) {
	return view.state.doc.toString();
}

export function getMimeType(extension: SupportedLanguage) {
	switch (extension) {
		case "css":
			return "text/css";
		case "html":
			return "text/html";
		case "js":
		case "jsx":
		case "ts":
		case "tsx":
			return "text/javascript";
	}
}

/**
 * Get file extension.
 * @param filename Name of file.
 * @returns File extension.
 */

export function getFileType(filename: string): SupportedLanguage {
	return filename.slice(filename.lastIndexOf(".") + 1) as SupportedLanguage;
}

/**
 * Format a string for friendly display
 * NOTE: You often need to use `suppressHydrationWarning` with this function.
 * */
// export function formatShortcut(sh: Shortcut) {
// 	let str = ariaKeyShortcuts(sh);
//
// 	switch (platform) {
// 		case "mac":
// 			str = str
// 				.replaceAll("Meta", "⌘")
// 				.replaceAll("Shift", "⇧")
// 				.replaceAll("Enter", "↩")
// 				.replaceAll("+", " ");
// 	}
//
// 	return str;
// }

export function parseMetaString(meta: string): Record<string, string> {
	return Object.fromEntries(
		Array.from(meta.matchAll(/\b([a-z]+)="([^"]+?)"/g)).map(($_) =>
			$_.slice(1),
		),
	);
}

const clientScript = `
/* update CSS without reloading */
window.addEventListener("message", ({data}) => {
  switch (data.type) {
    case "color-scheme":
      document.body.style.colorScheme = data.colorScheme;
      break;
  }
});

`;
