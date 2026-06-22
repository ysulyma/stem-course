import { docusaurusPersistColorScheme } from "@liqvid/color-scheme/docusaurus";
import { useColorScheme } from "@liqvid/color-scheme/react";
import { HydrateVariants } from "@liqvid/hydration";
import { useEffect, useRef, useState } from "react";

function darkUrl(src: string | undefined) {
	if (!src) return src;

	if (src.startsWith("/v/")) {
		src += "?theme=dark";
	}

	return src;
}

export function LiqvidVideo({
	src,
	style: propsStyle,
	...props
}: React.ComponentProps<"iframe">) {
	const { colorScheme } = useColorScheme();
	const [initialColorScheme] = useState(colorScheme);

	const ref = useSyncColorScheme();

	const style: React.CSSProperties = {
		aspectRatio: "16/9",
		width: "100%",
		...propsStyle,
	};

	return (
		<HydrateVariants
			{...docusaurusPersistColorScheme}
			value={initialColorScheme}
			variants={[
				{
					children: (
						<iframe ref={ref} src={darkUrl(src)} style={style} {...props} />
					),
					eq: "dark",
				},
				{
					children: <iframe ref={ref} src={src} style={style} {...props} />,
					eq: "light",
				},
			]}
		/>
	);
}

function useSyncColorScheme() {
	const ref = useRef<HTMLIFrameElement>(null);

	const { colorScheme } = useColorScheme();

	useEffect(() => {
		console.log("POSTING");
		ref.current?.contentWindow?.postMessage(
			{ type: "color-scheme", value: colorScheme },
			"*",
		);
	}, [colorScheme]);

	return ref;
}
