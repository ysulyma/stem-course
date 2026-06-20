import { docusaurusPersistColorScheme } from "@liqvid/color-scheme/docusaurus";
import { useColorScheme } from "@liqvid/color-scheme/react";
import { HydrateVariants } from "@liqvid/hydration";
import MDXComponents from "@theme-original/MDXComponents";
import { useState } from "react";

function darkUrl(src: string | undefined) {
	if (!src) return src;

	// if (src.startsWith("/v/")) {
	// 	src += "?theme=dark";
	// }

	return src;
}

export default {
	...MDXComponents,
	iframe: ({ src, ...props }: React.ComponentProps<"iframe">) => {
		const { colorScheme } = useColorScheme();
		const [initialColorScheme] = useState(colorScheme);

		return (
			<HydrateVariants
				{...docusaurusPersistColorScheme}
				value={initialColorScheme}
				variants={[
					{
						children: <iframe src={darkUrl(src)} {...props} />,
						eq: "dark",
					},
					{
						children: <iframe src={src} {...props} />,
						eq: "light",
					},
				]}
			/>
		);
	},
};
