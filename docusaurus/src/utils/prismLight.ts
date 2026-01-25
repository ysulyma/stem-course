/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type PrismTheme, themes } from "prism-react-renderer";

const baseTheme = themes.github;

export default {
	...baseTheme,
	styles: [
		...baseTheme.styles,
		{
			style: {
				color: "#0550AE",
				fontWeight: "bold",
			},
			types: ["title"],
		},
		{
			style: {
				color: "#953800",
			},
			types: ["parameter"],
		},
		{
			style: {
				color: "#005CC5",
			},
			types: ["boolean", "rule", "color", "number", "constant", "property"],
		},
		{
			style: {
				color: "#22863A",
			},
			types: ["atrule", "tag"],
		},
		{
			style: {
				color: "#24292E",
			},
			types: ["script"],
		},
		{
			style: {
				color: "#D73A49",
			},
			types: ["operator", "unit", "rule"],
		},
		{
			style: {
				color: "#C6105F",
			},
			types: ["font-matter", "string", "attr-value"],
		},
		{
			style: {
				color: "#116329",
			},
			types: ["class-name"],
		},
		{
			style: {
				color: "#0550AE",
			},
			types: ["attr-name"],
		},
		{
			style: {
				color: "#CF222E",
			},
			types: ["keyword"],
		},
		{
			style: {
				color: "#8250DF",
			},
			types: ["function"],
		},
		{
			style: {
				color: "#6F42C1",
			},
			types: ["selector"],
		},
		{
			style: {
				color: "#E36209",
			},
			types: ["variable"],
		},
		{
			style: {
				color: "#6B6B6B",
			},
			types: ["comment"],
		},
	],
} satisfies PrismTheme;
