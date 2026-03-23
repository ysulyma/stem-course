import { SneakyScript } from "@liqvid/hydration";
import { isClient } from "@liqvid/ssr";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import { Children, cloneElement, useId } from "react";

export const ExternalLink = (props: React.JSX.IntrinsicElements["a"]) => (
	<a rel="noopener noreferrer" target="_blank" {...props} />
);

export const MdnApi = ({ children, link, noCode = false }) => {
	const content = noCode ? children : <code>{children}</code>;
	return (
		<ExternalLink
			href={`https://developer.mozilla.org/en-US/docs/Web/API/${link}`}
		>
			{content}
		</ExternalLink>
	);
};

export const MDN = ({ tag, attribute }) => (
	<ExternalLink
		href={
			`https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/${tag}` +
			(attribute ? `#${attribute}` : "")
		}
	>
		<code>{attribute || `<${tag}>`}</code>
	</ExternalLink>
);

export const CSSProp = ({ property, value }) => (
	<code>
		<ExternalLink
			href={`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/${property}`}
		>
			{property}
		</ExternalLink>
		{value && `: ${value}`}
	</code>
);

export const CSSSelector = ({ selector }) => (
	<code>
		<ExternalLink
			href={`https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/${selector}`}
		>
			{selector}
		</ExternalLink>
	</code>
);

export const ThreeDocs = ({
	item,
	prefix = false,
}: {
	item: string;
	prefix?: boolean;
}) => (
	<code>
		<ExternalLink href={`https://threejs.org/docs/#${item}`}>
			{`${prefix ? "THREE." : ""}${item}`}
		</ExternalLink>
	</code>
);

type KbdProps =
	| {
			shortcut: string;
			osVariants?: never;
	  }
	| {
			osVariants: {
				linux: string;
				mac: string;
				windows?: string;
			};
			shortcut?: never;
	  };

// ⌘⇧↩⌥⎋⌃←↑→↓
export const Kbd = (props: KbdProps) => {
	const id = useId();

	if (typeof props.shortcut === "string") {
		return <kbd>{localize(props.shortcut)}</kbd>;
	}

	const { osVariants } = props;

	const currentOS = isClient ? getOS() : "linux";

	if (isClient) {
		return (
			<kbd>
				{localize(
					currentOS === "mac"
						? `mac(${osVariants[currentOS]})`
						: osVariants[currentOS],
				)}
			</kbd>
		);
	}

	return (
		<>
			<kbd id={`${id}-linux`}>{osVariants.linux}</kbd>
			<kbd id={`${id}-mac`}>{localize(`mac(${osVariants.mac})`)}</kbd>
			<kbd id={`${id}-windows`}>{osVariants.windows ?? osVariants.linux}</kbd>
			<SneakyScript>{`
			const browser = (${getBrowser})();
      for (const b of ["linux", "mac", "windows") {
        const elt = document.getElementById(${JSON.stringify(id)} + "-" + b);
        if (b === browser) {
          elt.removeAttribute("id");
        } else {
          elt.remove();
        }
      }
`}</SneakyScript>
		</>
	);
};

function localize(shortcut: string) {
	const $_ = shortcut.match(/^mac\((.+)\)$/);
	if (!$_) return shortcut;
	return $_[1]
		.split("+")
		.map((part) => {
			switch (part) {
				// modifiers
				case "Alt":
					return "⌥";
				case "Cmd":
					return "⌘";
				case "Ctrl":
					return "⌃";
				case "Shift":
					return "⇧";
				// arrows
				case "Down":
					return "↓";
				case "Up":
					return "↑";
				case "Left":
					return "←";
				case "Right":
					return "→";
				// other
				case "Enter":
					return "↩";
				default:
					return part;
			}
		})
		.join("");
}

export const KbdTable = ({ caption, shortcuts }) => (
	<table>
		{caption && <caption>{caption}</caption>}
		<thead>
			<tr>
				<th>Key</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			{shortcuts.map(({ key, action }) => {
				let reactKey: string;
				let content: React.ReactNode;
				if (typeof key === "object" && "raw" in key) {
					reactKey = key.raw;
					content = key.raw;
				} else {
					reactKey = key;
					content = <Kbd shortcut={key} />;
				}
				return (
					<tr key={reactKey}>
						<td>{content}</td>
						<td>{action}</td>
					</tr>
				);
			})}
		</tbody>
	</table>
);

// pretty sure this is all of them :P
type Browser = "chrome" | "firefox" | "safari";

export function BrowserTabs({
	children,
	groupId = "browser",
	...props
}: React.ComponentProps<typeof Tabs>) {
	const currentBrowser = isClient ? getBrowser() : "unknown";

	const content = (
		<Tabs groupId={groupId} {...props}>
			{/** biome-ignore lint/suspicious/noExplicitAny: we are doing evil things :) */}
			{Children.map(children, (child: any) => {
				if (child.type !== TabItem) return child;

				const browser = child.props.value;
				return cloneElement(child, {
					default: browser === currentBrowser,
					label: (
						<>
							<img alt="" src={`/img/${browser}-logo.svg`} />
							{`${capitalize(browser)}`}
						</>
					),
				});
			})}
		</Tabs>
	);

	if (isClient) return content;
	return (
		<>
			{content}
			<SneakyScript>{`
const browser = (${getBrowser})();
const container = document.currentScript.previousElementSibling;
const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));
const tabs = Array.from(container.querySelectorAll(".tabs__item"));
for (let i = 0; i < tabs.length; ++i) {
  const tab = tabs[i];
  const isActive = tab.innerHTML.includes(browser);
  tab.setAttribute("aria-selected", String(isActive));
  tab.setAttribute("tabindex", isActive ? 0 : -1);
  tab.classList.toggle("tabs__item--active", isActive);

  if (isActive) {
    panels[i].removeAttribute("hidden");
  } else {
    panels[i].setAttribute("hidden", "");
  }
}`}</SneakyScript>
		</>
	);
}

// pretty sure this is all of them :P
type OperatingSystem = "linux" | "mac" | "windows";

export function OSTabs({
	children,
	groupId = "os",
	...props
}: React.ComponentProps<typeof Tabs>) {
	const currentOs = isClient ? getOS() : "unknown";

	const content = (
		<Tabs groupId={groupId} {...props}>
			{/** biome-ignore lint/suspicious/noExplicitAny: we are doing evil things :) */}
			{Children.map(children, (child: any) => {
				if (child.type !== TabItem) return child;

				const os = child.props.value;
				return cloneElement(child, {
					default: os === currentOs,
					label: (
						<>
							<img alt="" src={`/img/${os}-logo.svg`} />
							{`${capitalize(os)}`}
						</>
					),
				});
			})}
		</Tabs>
	);

	if (isClient) return content;
	return (
		<>
			{content}
			<SneakyScript>{`
const browser = (${getBrowser})();
const container = document.currentScript.previousElementSibling;
const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));
const tabs = Array.from(container.querySelectorAll(".tabs__item"));
for (let i = 0; i < tabs.length; ++i) {
  const tab = tabs[i];
  const isActive = tab.innerHTML.includes(browser);
  tab.setAttribute("aria-selected", String(isActive));
  tab.setAttribute("tabindex", isActive ? 0 : -1);
  tab.classList.toggle("tabs__item--active", isActive);

  if (isActive) {
    panels[i].removeAttribute("hidden");
  } else {
    panels[i].setAttribute("hidden", "");
  }
}`}</SneakyScript>
		</>
	);
}

function getBrowser(): Browser {
	const { userAgent } = navigator;
	if (userAgent.includes("Chrome")) return "chrome";
	if (userAgent.includes("Safari")) return "safari";
	if (userAgent.includes("Firefox")) return "firefox";
	return "chrome";
}

function getOS(): OperatingSystem {
	const { platform } = navigator;
	if (platform.includes("MacIntel")) return "mac";
	if (platform.includes("Win32")) return "windows";
	if (platform.includes("Linux")) return "linux";
	return "mac";
}

function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1);
}
