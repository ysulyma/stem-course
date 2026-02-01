import { translate } from "@docusaurus/Translate";
import { useBoothStore } from "@lqv/codebooth";
import { CheckIcon, CopySimpleIcon } from "@phosphor-icons/react";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "zustand/react";

import { viewContents } from "../utils";

import styles from "../LivePreview.module.css";
import copyStyles from "./copy-styles.module.css";

function title() {
	return translate({
		description: "The copy button label on code blocks",
		id: "theme.CodeBlock.copy",
		message: "Copy",
	});
}

function ariaLabel(isCopied: boolean) {
	return isCopied
		? translate({
				description: "The copied button label on code blocks",
				id: "theme.CodeBlock.copied",
				message: "Copied",
			})
		: translate({
				description: "The ARIA label for copy code blocks button",
				id: "theme.CodeBlock.copyButtonAriaLabel",
				message: "Copy code to clipboard",
			});
}

export function CopyButton() {
	const [isCopied, setIsCopied] = useState(false);
	const copyTimeout = useRef<number | undefined>(undefined);

	const getActiveFile = useStore(
		useBoothStore(),
		(state) => state.getActiveFile,
	);

	const copyCode = useCallback(async () => {
		const { view } = getActiveFile();
		await navigator.clipboard.writeText(viewContents(view));
		setIsCopied(true);
		copyTimeout.current = window.setTimeout(() => {
			setIsCopied(false);
		}, 1000);
	}, [getActiveFile]);

	useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

	return (
		<button
			aria-label={ariaLabel(isCopied)}
			className={classNames(
				styles.button,
				isCopied && copyStyles.copyButtonCopied,
			)}
			onClick={copyCode}
			title={title()}
			type="button"
		>
			<span aria-hidden="true" className={copyStyles.copyButtonIcons}>
				<CopySimpleIcon className={copyStyles.copyButtonIcon} />
				<CheckIcon className={copyStyles.copyButtonSuccessIcon} color="green" />
			</span>
		</button>
	);
}
