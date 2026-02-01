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
		(globalThis.document?.fullscreenElement ?? null) !== null,
	);

	useEventListener(
		"fullscreenchange",
		() => {
			setFullScreen(!!globalThis.document?.fullscreenElement);
		},
		useRef(globalThis.document),
	);

	return (
		<button
			className={styles.button}
			onClick={() => {
				if (globalThis.document?.fullscreenElement) {
					document.exitFullscreen();
				} else {
					elt.current?.requestFullscreen();
				}
			}}
			title={isFullScreen ? "Exit full screen" : "Full screen"}
			type="button"
		>
			{isFullScreen ? <CornersInIcon /> : <CornersOutIcon />}
		</button>
	);
}
