import { DocsPreferredVersionContextProvider } from "@docusaurus/plugin-content-docs/client";
import { composeProviders } from "@docusaurus/theme-common";
import {
	AnnouncementBarProvider,
	ColorModeProvider,
	NavbarProvider,
	PluginHtmlClassNameProvider,
	ScrollControllerProvider,
} from "@docusaurus/theme-common/internal";
import type { Props } from "@theme/Layout/Provider";
import type { ReactNode } from "react";

const Provider = composeProviders([
	ColorModeProvider,
	AnnouncementBarProvider,
	ScrollControllerProvider,
	DocsPreferredVersionContextProvider,
	PluginHtmlClassNameProvider,
	NavbarProvider,
]);

export default function LayoutProvider({ children }: Props): ReactNode {
	return <Provider>{children}</Provider>;
}
