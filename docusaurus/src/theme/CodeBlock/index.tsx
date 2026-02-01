import type { WrapperProps } from "@docusaurus/types";
import type CodeBlockType from "@theme/CodeBlock";
import CodeBlock from "@theme-original/CodeBlock";
import type { ReactNode } from "react";

import { useLiveContext } from "../LivePreview";

import { LiveHTML } from "./LiveHTML";

type Props = WrapperProps<typeof CodeBlockType> & { live?: boolean };

export default function CodeBlockWrapper(props: Props): ReactNode {
	const { livePreview } = useLiveContext();
	const language = props.className?.match(/language-([^\s]+)/)?.[1];

	if (livePreview) {
		// console.log(props);
		return "duck";
	}
	return <CodeBlock {...props} />;
}
