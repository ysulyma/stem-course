import { CornersInIcon, CornersOutIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";

import styles from "../LivePreview.module.css";

export function FullScreenButton({
	elt,
}: {
	elt: React.RefObject<HTMLElement>;
}) {
	const [isFullScreen, setFullScreen] = useState(
		document.fullscreenElement !== null,
	);

	useEventListener(
		"fullscreenchange",
		() => {
			setFullScreen(!!document.fullscreenElement);
		},
		useRef(document),
	);

	return (
		<button
			className={styles.button}
			onClick={() => {
				if (document.fullscreenElement) {
					document.exitFullscreen();
				} else {
					elt.current?.requestFullscreen();
				}
			}}
			title={isFullScreen ? "Full screen" : "Exit full screen"}
			type="button"
		>
			{isFullScreen ? <CornersInIcon /> : <CornersOutIcon />}
		</button>
	);
}
