import { Compartment, type Extension } from "@codemirror/state";
import { useColorMode } from "@docusaurus/theme-common";
import { Editor, useBoothStore } from "@lqv/codebooth";
import { useEffect } from "react";
import { useStore } from "zustand";

const colorSchemeCompartment = new Compartment();

/**
 * Editor integrated with Docusaurus color scheme
 */
export function IntegratedEditor({
	extensions,
	lightExtensions,
	darkExtensions,
	...props
}: React.ComponentProps<typeof Editor> & {
	lightExtensions?: Extension;
	darkExtensions?: Extension;
}) {
	const { colorMode } = useColorMode();

	const state = useStore(useBoothStore());

	useEffect(() => {
		const file = state.groups[props.group]?.files.find(
			(f) => f.filename === props.filename,
		);
		if (!file) return;
		const { view } = file;

		view.dispatch({
			effects: colorSchemeCompartment.reconfigure(
				colorMode === "light" ? lightExtensions : darkExtensions,
			),
		});
	}, [
		colorMode,
		darkExtensions,
		lightExtensions,
		props.filename,
		props.group,
		state,
	]);

	return (
		<Editor
			extensions={[
				...extensions,
				colorSchemeCompartment.of(
					colorMode === "dark" ? darkExtensions : lightExtensions,
				),
			]}
			{...props}
		/>
	);
}
