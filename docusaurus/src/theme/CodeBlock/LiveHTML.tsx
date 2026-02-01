/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Babel from "@babel/standalone";
import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";
import { useCallback, useEffect, useRef } from "react";

// import { CSSEditor } from "./CSSEditor";
import { findLines } from "./disableLines";
import { extractCSS, extractHead } from "./extractCSS";

// import { HTMLEditor } from "./HTMLEditor";
// import { TSXEditor } from "./TSXEditor";

// import { HTMLEditor } from "./HTMLEditor";
// import { TSXEditor } from "./TSXEditor";

import { Tabs } from "radix-ui";

import { viewContents } from "../LivePreview/utils";

import { CSSEditor } from "./CSSEditor";

import styles from "./LiveHTML.module.css";

const Mod =
	!ExecutionEnvironment.canUseDOM || navigator.platform === "MacIntel"
		? "Cmd"
		: "Ctrl";

const VERSIONS = {
	liqvid: "2.1.7",
};

export function LiveHTML({
	children,
	module,
	...props
}: {
	children: string;
	module: unknown;
}) {
	const tsxView = useRef(null);
	const cssView = useRef(null);
	const htmlView = useRef(null);
	const iframe = useRef(null);
	const content = useRef(null);

	if (content.current === undefined) {
		let styles, head, linesToFreeze;
		children = children.trim();
		[children, styles] = extractCSS(children);
		[children, head] = extractHead(children);
		[children, linesToFreeze] = findLines(children);
		content.current = {
			children,
			head,
			linesToFreeze,
			styles,
		};
	}

	// optimize css changes
	const lastTSX = useRef(null);
	const refresh = useCallback(() => {
		if (!tsxView.current) return;
		const tsx = viewContents(tsxView.current);
		const css = viewContents(cssView.current);
		const head = viewContents(htmlView.current);

		if (lastTSX.current === tsx) {
			iframe.current.contentWindow.postMessage({
				action: "update-css",
				value: css,
			});
		} else {
			iframe.current.srcdoc = render({ css, head, module: props.module, tsx });
		}
		lastTSX.current = tsx;

		return true;
	}, []);

	useEffect(() => {
		refresh();
	}, [refresh]);

	// collapse
	const contentRef = useRef(null);
	useEffect(() => {
		const content = contentRef.current;
		if (!content) return null;

		// need to set height for collapse animation to work
		content.style.height = `${content.scrollHeight}px`;
	}, []);
	const toggleCollapse = useCallback((e: React.MouseEvent<HTMLElement>) => {
		const container = e.target.closest(".tabs-container");
		container.classList.toggle("collapsed");
	}, []);

	// tab switching
	const toggleTab = useCallback((e) => {
		const tabs = Array.from(
			e.target.parentNode.querySelectorAll(".tabs__item"),
		) as HTMLElement[];

		// set tabs
		for (const tab of tabs) {
			if (tab === e.target) {
				tab.classList.add("tabs__item--active");
				tab.setAttribute("aria-selected", "true");
			} else {
				tab.classList.remove("tabs__item--active");
				tab.setAttribute("aria-selected", "false");
			}
		}

		// set panels
		const panels = Array.from(
			e.target.parentNode.parentNode.querySelectorAll("*[role=tabpanel]"),
		) as HTMLElement[];
		const index = tabs.indexOf(e.target);
		for (let i = 0; i < panels.length; ++i) {
			if (i === index) {
				panels[i].removeAttribute("hidden");
			} else {
				panels[i].setAttribute("hidden", "hidden");
			}
		}
	}, []);

	return (
		<div className={`tabs-container ${styles.liqvidPreview}`}>
			<ul aria-orientation="horizontal" className={`tabs`} role="tablist">
				<li
					className={styles.liqvidPreviewCollapse}
					onClick={toggleCollapse}
					role="button"
				></li>
				<li
					aria-selected="true"
					className={`tabs__item tabs__item--active`}
					onClick={toggleTab}
					role="tab"
					tabIndex="0"
				>
					TSX
				</li>
				<li
					aria-selected="false"
					className={`tabs__item`}
					onClick={toggleTab}
					role="tab"
					tabIndex="-1"
				>
					CSS
				</li>
				{content.current.head && (
					<li
						aria-selected="false"
						className={`tabs__item`}
						onClick={toggleTab}
						role="tab"
						tabIndex="-1"
					>
						&lt;head&gt;
					</li>
				)}
				<li
					className={styles.liqvidPreviewRefresh}
					onClick={refresh}
					role="button"
					title={`${Mod}+Enter`}
				>
					Refresh
				</li>
			</ul>
			<div className="margin-vert--md" ref={contentRef}>
				<div role="tabpanel">
					<TSXEditor
						content={content.current.children}
						linesToFreeze={content.current.linesToFreeze}
						refresh={refresh}
						view={tsxView}
					/>
				</div>
				<div hidden role="tabpanel">
					<CSSEditor
						content={content.current.styles}
						refresh={refresh}
						view={cssView}
					/>
				</div>
				{content.current.head && (
					<div hidden role="tabpanel">
						<HTMLEditor
							content={content.current.head}
							refresh={refresh}
							view={htmlView}
						/>
					</div>
				)}
				<iframe allowFullScreen ref={iframe} title="Preview" />
			</div>
		</div>
	);
}

const IMPORTS = {
	// "@liqvid/katex": "liqvid_katex.js",
	// "@liqvid/mathjax": "liqvid_mathjax.js",
	// "@liqvid/react-three": [
	// 	"https://unpkg.com/three@0.141.0/build/three.min.js",
	// 	"react_three_fiber.js",
	// 	"liqvid_react_three.js",
	// ],
	// "@liqvid/xyjax": "liqvid_xyjax.js",
	// "@react-three/drei": [
	// 	"https://unpkg.com/three@0.141.0/build/three.min.js",
	// 	"react_three_fiber.js",
	// 	"react_three_drei.js",
	// ],
	// "@react-three/fiber": [
	// 	"https://unpkg.com/three@0.141.0/build/three.min.js",
	// 	"react_three_fiber.js",
	// ],
	// three: "https://unpkg.com/three@0.141.0/build/three.min.js",
};

function getUmdImports(tsx: string) {
	const scripts = [];
	for (const key in IMPORTS) {
		if (tsx.match(key)) {
			if (typeof IMPORTS[key] === "string") {
				let src = IMPORTS[key];
				if (!src.startsWith("http")) {
					src = `${location.origin}/imports/${src}`;
				}
				if (!scripts.includes(src)) {
					scripts.push(src);
				}
			} else {
				for (let src of IMPORTS[key]) {
					if (!src.startsWith("http")) {
						src = `${location.origin}/imports/${src}`;
					}
					if (!scripts.includes(src)) {
						scripts.push(src);
					}
				}
			}
		}
	}
	return scripts.map((src) => `<script src="${src}"></script>`).join("\n");
}

function render({ tsx, css = "", module, head = "" }) {
	const opts = {
		filename: "demo.tsx",
		presets: ["react", "typescript"],
	};
	if (!module) {
		opts.plugins = [
			[
				"transform-modules-umd",
				{
					exactGlobals: true,
					globals: {
						"@liqvid/katex": "Liqvid_Katex",
						"@liqvid/mathjax": "Liqvid_MathJax",
						"@liqvid/react-three": "Liqvid_ReactThree",
						"@liqvid/utils/animation": "Liqvid.Utils.animation",
						"@liqvid/utils/misc": "Liqvid.Utils.misc",
						"@liqvid/utils/react": "Liqvid.Utils.react",
						"@liqvid/xyjax": "Liqvid_XyJax",
						"@react-three/drei/core/OrbitControls": "ReactThreeDrei",
						"@react-three/fiber": "ReactThreeFiber",
						katex: "katex",
						liqvid: "Liqvid",
						mathjax: "MathJax",
						"ractive-player": "RactivePlayer",
						react: "React",
						"react-dom": "ReactDOM",
						"react-dom/client": "ReactDOM",
						three: "THREE",
					},
				},
			],
		];
		opts.presets.unshift("env");
	}
	try {
		const importScripts = getUmdImports(tsx);
		const js = Babel.transform(tsx, opts).code;

		let doc = String.raw`
 <!DOCTYPE html>
 <html>
 <head>
   <title></title>
 
   <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
   <meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1"/>
 
   <!-- Liqvid -->
   <link href="https://unpkg.com/liqvid@${VERSIONS.liqvid}/dist/liqvid.min.css" rel="stylesheet" type="text/css"/>
   <style id="user-styles" type="text/css">${css}</style>
   <script type="text/javascript">
   window.addEventListener("message", msg => {
     if (msg.data.action === "update-css") {
       document.getElementById("user-styles").textContent = msg.data.value;
     }
   });
   </script>
   ${head}
 </head>
 <body>
   <main></main>
    <script src="https://unpkg.com/@liqvid/polyfills/dist/waapi.js"></script>
   `;

		if (module) {
			doc += String.raw`<script type="module">${esmShImports(js)}</script>`;
		} else {
			doc += String.raw`<!-- production -->
     <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.1.0/umd/react.production.min.js"></script>
     <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.1.0/umd/react-dom.production.min.js"></script>
     
     <script src="https://unpkg.com/liqvid@${VERSIONS.liqvid}/dist/liqvid.min.js"></script>
     ${importScripts}
     
     <script crossorigin integrity="sha384-ImWMbbJ1rSn1mn+2vsKm/wN6Vc7hPNB2VKN0lX3FAzGK+c7M2mD6ZZcwknuKlP7K" src="https://cdn.rangetouch.com/2.0.1/rangetouch.js"></script>
   
     <script>${js}</script>`;
		}

		doc += String.raw`</body>
     </html>`;

		return doc;
	} catch (e) {
		return String.raw`<html><body><pre>${e}</pre></body></html>`;
	}
}

function esmShImports(str) {
	return str.replace(
		/(import .+? from\s+)(["'])(.+?)\2(;?)/gm,
		(match, start, q, name, end) => {
			const pkgName = getPackageName(name);

			// https://github.com/esm-dev/esm.sh/issues/276
			// if (pkgName in VERSIONS) {
			//   name = `${pkgName}@${VERSIONS[pkgName]}` + name.slice(pkgName.length);
			// }
			// if (pkgName in DEPS) {
			//   name += `?dev&deps=` + deps(...DEPS[pkgName]);
			// }
			return `${start}${q}https://esm.sh/${name}${q}${end}`;
		},
	);
}

function deps(...keys) {
	return keys.map((key) => `${key}@${VERSIONS[key]}`).join(",");
}

function getPackageName(name) {
	if (name[0] === "@") {
		return name.split("/").slice(0, 2).join("/");
	} else {
		return name.split("/")[0];
	}
}
