import { SneakyScript } from "@liqvid/hydration";
import { isClient } from "@liqvid/ssr";
import { Root as Slot } from "@radix-ui/react-slot";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import { Children, cloneElement, useId } from "react";

export const ExternalLink = (props: React.JSX.IntrinsicElements["a"]) => (
	<a rel="noopener noreferrer" target="_blank" {...props} />
);

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

// ⌘⇧↩⌥⎋⌃
export const Kbd = ({ shortcut }) => {
	return <kbd style={{ fontSize: "1.1em" }}>{shortcut}</kbd>;
};

// pretty sure this is all of them :P
type Browser = "chrome" | "firefox" | "safari";

export function BrowserTabs({ children }: { children: React.ReactNode }) {
	const id = useId();

	const currentBrowser = isClient ? getBrowser() : "unknown";

	const content = (
		<Tabs>
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

function getBrowser(): Browser {
	const { userAgent } = navigator;
	if (userAgent.includes("Chrome")) return "chrome";
	if (userAgent.includes("Safari")) return "safari";
	if (userAgent.includes("Firefox")) return "firefox";
	return "chrome";
}

function capitalize(str: string) {
	return str[0].toUpperCase() + str.slice(1);
}
