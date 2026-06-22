import MDXComponents from "@theme-original/MDXComponents";

import { LiqvidVideo } from "../components/LiqvidVideo";

export default {
	...MDXComponents,
	iframe: (props: React.ComponentProps<"iframe">) => {
		if (props.src?.startsWith("/v")) {
			return <LiqvidVideo {...props} />;
		}
		return <iframe {...props} />;
	},
};
