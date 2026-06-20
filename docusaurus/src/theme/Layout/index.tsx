import ErrorBoundary from "@docusaurus/ErrorBoundary";
import {
	PageMetadata,
	SkipToContentFallbackId,
	ThemeClassNames,
	useColorMode,
} from "@docusaurus/theme-common";
import { SyncDocusaurusColorSchemeWithLiqvid } from "@liqvid/color-scheme/docusaurus";
import { ColorSchemeMetaTag } from "@liqvid/color-scheme/react";
import AnnouncementBar from "@theme/AnnouncementBar";
import ErrorPageContent from "@theme/ErrorPageContent";
import Footer from "@theme/Footer";
import type { Props } from "@theme/Layout";
import LayoutProvider from "@theme/Layout/Provider";
import Navbar from "@theme/Navbar";
import SkipToContent from "@theme/SkipToContent";
import clsx from "clsx";
import { type ReactNode, useEffect, useEffectEvent } from "react";

import styles from "./styles.module.css";

export default function Layout(props: Props): ReactNode {
	const {
		children,
		noFooter,
		wrapperClassName,
		// Not really layout-related, but kept for convenience/retro-compatibility
		title,
		description,
	} = props;

	return (
		<LayoutProvider>
			<PageMetadata description={description} title={title} />

			<SkipToContent />

			<AnnouncementBar />

			<Navbar />

			<div
				className={clsx(
					ThemeClassNames.layout.main.container,
					ThemeClassNames.wrapper.main,
					styles.mainWrapper,
					wrapperClassName,
				)}
				id={SkipToContentFallbackId}
			>
				<SyncDocusaurusColorSchemeWithLiqvid>
					<Shortcut />
					<ColorSchemeMetaTag />
					<ErrorBoundary
						fallback={(params) => <ErrorPageContent {...params} />}
					>
						{children}
					</ErrorBoundary>
				</SyncDocusaurusColorSchemeWithLiqvid>
			</div>

			{!noFooter && <Footer />}
		</LayoutProvider>
	);
}

function Shortcut() {
	const { colorMode, setColorMode } = useColorMode();

	const toggle = useEffectEvent(() => {
		setColorMode(colorMode === "light" ? "dark" : "light");
	});

	const listener = useEffectEvent((event: KeyboardEvent) => {
		if (event.key === "'" && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			toggle();
		}
	});

	useEffect(() => {
		window.addEventListener("keydown", listener);

		return () => {
			window.removeEventListener("keydown", listener);
		};
	});

	return null;
}
