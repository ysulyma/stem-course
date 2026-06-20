"use client";

import { type LocalValueConfig, usePersistentState } from "@liqvid/hydration";
import { ArticleIcon, VideoIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

const persistence = {
	default: true,
	name: "pref.video",
	source: "localStorage",
	type: "boolean",
} satisfies LocalValueConfig;

import styles from "./ToggleTextVideo.module.css";

const prefersVideoClass = "prefers-video";

export function ToggleTextVideo() {
	const [active, _, toggle] = usePersistentState(persistence);

	useEffect(() => {
		document.body.classList.toggle(prefersVideoClass, active);
	}, [active]);

	return (
		<button
			aria-checked={active}
			className={styles.button}
			onClick={toggle}
			role="switch"
			title={`Toggle between video and text (currently ${active ? "video" : "text"})`}
			type="button"
		>
			<div className={styles.thumb} />
			<VideoIcon className={styles.video} weight="fill" />
			<ArticleIcon className={styles.text} weight="fill" />
		</button>
	);
}
