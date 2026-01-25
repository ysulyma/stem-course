/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type PrismTheme, themes } from "prism-react-renderer";

const baseTheme = themes.vsDark;

export default {
	plain: {
		backgroundColor: "#212121",
		color: "#D4D4D4",
	},
	styles: [
		...baseTheme.styles,
		{
			style: {
				color: "#569CD6",
				fontWeight: "bold",
			},
			types: ["title"],
		},
		{
			style: {
				color: "#9CDCFE",
			},
			types: ["property", "parameter"],
		},
		{
			style: {
				color: "#D4D4D4",
			},
			types: ["script"],
		},
		{
			style: {
				color: "#569CD6",
			},
			types: ["boolean", "arrow", "atrule", "tag"],
		},
		{
			style: {
				color: "#B5CEA8",
			},
			types: ["number", "color", "unit"],
		},
		{
			style: {
				color: "#CE9178",
			},
			types: ["font-matter"],
		},
		{
			style: {
				color: "#C586C0",
			},
			types: ["keyword", "rule"],
		},
		{
			style: {
				color: "#D16969",
			},
			types: ["regex"],
		},
		{
			style: {
				color: "#4EC9B0",
			},
			types: ["maybe-class-name"],
		},
		{
			style: {
				color: "#4FC1FF",
			},
			types: ["constant"],
		},
	],
} satisfies PrismTheme;
