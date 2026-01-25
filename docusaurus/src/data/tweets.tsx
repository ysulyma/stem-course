/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable @docusaurus/no-untranslated-text */

import React from "react";

import type { Props as Tweet } from "../components/Tweet";

export type TweetItem = Tweet & {
	showOnHomepage: boolean;
};

const TWEETS: TweetItem[] = [
	{
		content: (
			<>
				We&apos;ve been using Docusaurus for all the Redux org docs sites for
				the last couple years, and it&apos;s great! We&apos;ve been able to
				focus on content, customize some presentation and features, and It Just
				Works.
			</>
		),
		date: "Oct 26, 2021",
		githubUsername: "markerikson",
		handle: "acemarke",
		name: "Mark Erikson",
		showOnHomepage: true,
		url: "https://x.com/acemarke/status/1452725153998245891",
	},
	{
		content: (
			<>
				I&apos;ve used Docusaurus for two websites this year, and I&apos;ve been
				very happy about the v2. Looks good, and simple to setup.
			</>
		),
		date: "Jan 20, 2021",
		githubUsername: "arcanis",
		handle: "arcanis",
		name: "Maël",
		showOnHomepage: true,
		url: "https://x.com/arcanis/status/1351620354561732608",
	},
	{
		content: (
			<>
				Docusaurus v2 doubles as a really nice little static site generator tool
				for content-focused sites, love it 👏
			</>
		),
		date: "Mar 25, 2021",
		githubUsername: "mlynch",
		handle: "maxlynch",
		name: "Max Lynch",
		showOnHomepage: true,
		url: "https://x.com/maxlynch/status/1375113166007455748",
	},
	{
		content: (
			<>
				We&apos;ve been using V2 since January and it has been great - we spend
				less time building documentation and more time building 🛳
				<br />
				<br />
				Thanks <b>@docusaurus</b> team 🦖
			</>
		),
		date: "Nov 18, 2020",
		githubUsername: "supabase",
		handle: "supabase",
		name: "Supabase",
		showOnHomepage: true,
		url: "https://x.com/supabase/status/1328960757149671425",
	},
	{
		content: (
			<>
				Continue to be impressed and excited about Docusaurus v2 alpha releases.
				Already using the sidebar items generator to help monorepo workspace
				devs create their own doc pages without any configuration needed.
			</>
		),
		date: "Apr 27, 2021",
		githubUsername: "paularmstrong",
		handle: "paularmstrong",
		name: "Paul Armstrong",
		showOnHomepage: true,
		url: "https://x.com/paularmstrong/status/1387059593373700100",
	},
	{
		content: (
			<>
				.<b>@docusaurus</b> ❤️
			</>
		),
		date: "Nov 17, 2020",
		githubUsername: "sanketsahu",
		handle: "sanketsahu",
		name: "Sanket Sahu",
		showOnHomepage: false,
		url: "https://x.com/sanketsahu/status/1328677366642528257",
	},
	{
		content: (
			<>
				Been doing a lot of work with <b>@docusaurus</b> lately and I have to
				say it is really fun to work with. A lot of really cool features. I love
				that you can easily reuse content by creating a markdown file and
				importing it as a component. 🔥
			</>
		),
		date: "Mar 24, 2021",
		githubUsername: "debs-obrien",
		handle: "debs_obrien",
		name: "Debbie O'Brien",
		showOnHomepage: true,
		url: "https://x.com/debs_obrien/status/1374615572298801155",
	},
	{
		content: (
			<>
				The #IOTA wiki is now part of the <b>@docusaurus</b> showcase. We even
				have the honor of being a favorite. We are really happy that we found
				this project. It helped us a lot to improve the documentation. And we
				still have a lot of plans with things like tutorials, versioning and
				i18n.
			</>
		),
		date: "Oct 11, 2021",
		githubUsername: "Dr-Electron",
		handle: "Dr_Electron",
		name: "Dr.Electron",
		showOnHomepage: true,
		url: "https://x.com/Dr_Electron/status/1443635328376508433",
	},
	{
		content: (
			<>
				https://testing-library.com just got a nice update! We&apos;re now on
				the latest version of <b>@docusaurus</b> thanks to @matanbobi,
				@TensorNo, and @nickemccurdy 💙
				<br />
				<br />
				My favorite new feature: dark mode!! 🌑/☀️
			</>
		),
		date: "Nov 4, 2020",
		githubUsername: "kentcdodds",
		handle: "kentcdodds",
		name: "Kent C. Dodds",
		showOnHomepage: true,
		url: "https://x.com/kentcdodds/status/1323806816019468288",
	},
	{
		content: <>I like docusaurus much more, it&apos;s so snappy.</>,
		date: "Nov 25, 2021",
		githubUsername: "banteg",
		handle: "bantg",
		name: "banteg",
		showOnHomepage: false,
		url: "https://x.com/bantg/status/1463608561368457225",
	},
	{
		content: (
			<>
				Happy to share Temporal&apos;s first open source sponsorship — of{" "}
				<b>@docusaurus</b>!
				<br />
				<br />
				@temporalio uses it for https://docs.temporal.io, and it has been a huge
				boon to our docs team. @sebastienlorber is an incredible steward of the
				project, support it if you can!
			</>
		),
		date: "Jul 23, 2021",
		githubUsername: "sw-yx",
		handle: "swyx",
		name: "swyx",
		showOnHomepage: true,
		url: "https://x.com/swyx/status/1418405515684581378",
	},
	{
		content: (
			<>
				I hear <b>@docusaurus</b> is a good tool for that!
			</>
		),
		date: "Jan 5, 2022",
		githubUsername: "rachelnabors",
		handle: "rachelnabors",
		name: "R 'Nearest' Nabors 💙",
		showOnHomepage: false,
		url: "https://x.com/rachelnabors/status/1478490902037467137",
	},
	{
		content: (
			<>
				I did try Docusaurus, and I really liked it! Still investigating various
				options but it&apos;s probably at the top of my list for sure
			</>
		),
		date: "May 19, 2021",
		githubUsername: "dabit3",
		handle: "dabit3",
		name: "Nader Dabit",
		showOnHomepage: false,
		url: "https://x.com/dabit3/status/1394685348375052295",
	},
	{
		content: (
			<>
				I ❤️ <b>@docusaurus</b> - it makes it so easy to spin up docs, blogs and
				simple websites. I&apos;ve used it to:
				<br />
				<br /> ✅ Replatform my blog with GitHub pages <br />✅ Build a website
				for a local business <br />✅ Build internal facing blog/docs sites with
				@AzureStaticApps
			</>
		),
		date: "Dec 10, 2021",
		githubUsername: "johnnyreilly",
		handle: "johnny_reilly",
		name: "John Reilly",
		showOnHomepage: false,
		url: "https://x.com/johnny_reilly/status/1469238609266028545",
	},
	{
		content: (
			<>
				Docusaurus is mind-bendingly flexible. <br />
				<br />
				&quot;Wait! We need to have two products documented on the same site and
				both need to be translated into multiple languages!&quot;
				<br />
				<br /> ... and that&apos;s actually easy. Loving it!
			</>
		),
		date: "Aug 6, 2021",
		githubUsername: "tinkertim",
		handle: "tinkertim",
		name: "Tim Post 💉💉💉",
		showOnHomepage: false,
		url: "https://x.com/tinkertim/status/1423358665726304260",
	},
	{
		content: (
			<>
				🥳🎊🥳🎊🥳🎊🥳🎊 The @reactnative website just migrated to{" "}
				<b>@docusaurus</b>
				v2
				<br />
				Some obvious changes: <br />🌔 Dark mode <br />
				⚡️ SPA navigation / prefetching <br />🧐 @algolia DocSearch v3 <br />💥
				@mdx_js enable many new possibilities <br />
				<br />
				Check it out: https://reactnative.dev
			</>
		),
		date: "Oct 29, 2020",
		githubUsername: "slorber",
		handle: "sebastienlorber",
		name: "Sebastien Lorber",
		showOnHomepage: false,
		url: "https://x.com/sebastienlorber/status/1321784071815680000",
	},
	{
		content: (
			<>
				We just updated the Create React App docs to Docusaurus v2. Now with
				dark mode! 😎
				<br />
				<br />
				Thanks to the <b>@docusaurus</b> team for their help! ❤️
				<br />
				<br />
				https://create-react-app.dev
			</>
		),
		date: "Oct 16, 2019",
		githubUsername: "iansu",
		handle: "iansu",
		name: "Ian Sutherland",
		showOnHomepage: false,
		url: "https://x.com/iansu/status/1184149586048245760",
	},
	{
		content: (
			<>
				New #mobx docs are online! More modern, fixing many UI issues.
				<br />
				<br />👏 @cloverich did the awesome job of migrating from ancient
				gitbook -&gt; <b>@docusaurus</b>! 👏 <br />
				<br />
				No real content updates yet, but contributing and publishing has become
				way easier
			</>
		),
		date: "Oct 8, 2019",
		githubUsername: "mweststrate",
		handle: "mweststrate",
		name: "Michel Weststrate",
		showOnHomepage: false,
		url: "https://x.com/mweststrate/status/1181276252293853186",
	},
	{
		content: (
			<>
				The new website has landed 🚀 powered by <b>@docusaurus</b> v2 and made
				by @_semoal kudos to him 👏 #verdaccio #nodejs awesome contribution ❤️‍🔥
				(video made with react remotion @JNYBGR ) all Open Source and hosted on
				@Netlify https://verdaccio.org
			</>
		),
		date: "Jul 28, 2021",
		githubUsername: "verdaccio",
		handle: "verdaccio_npm",
		name: "verdaccio",
		showOnHomepage: false,
		url: "https://x.com/verdaccio_npm/status/1420187249145118722",
	},

	{
		content: (
			<>
				I made a <b>@docusaurus</b> website for answers to the H5BP Front End
				Interview Questions! Hopefully it makes the browsing experience easier -
				https://frontendinterviewhandbook.com
			</>
		),
		date: "Jul 19, 2020",
		githubUsername: "yangshun",
		handle: "yangshunz",
		name: "Yangshun Tay",
		showOnHomepage: false,
		url: "https://x.com/yangshunz/status/1284536949718478848",
	},

	{
		content: (
			<>
				Just upgraded our website to <b>@docusaurus</b> latest with
				internationalization support 🥳
				<br />
				<br />
				Before that, we had to build 2 separate versions of the website to get
				it in English + French.
				<br />
				<br />
				Now, it&apos;s working out of the box, with proper meta tags for SEO 👌
			</>
		),
		date: "Mar 19, 2021",
		githubUsername: "Pierre-Gilles",
		handle: "pierregillesl",
		name: "Pierre-Gilles Leymarie",
		showOnHomepage: false,
		url: "https://x.com/pierregillesl/status/1372839188698001408",
	},
	{
		content: (
			<>
				Today I tried <b>@docusaurus</b> in a project, I really like the ease
				and speed of developing with it \o/
			</>
		),
		date: "Jan 10, 2022",
		githubUsername: "biantris",
		handle: "biantris_",
		name: "biazita",
		showOnHomepage: false,
		url: "https://x.com/biantris_/status/1480259279487741953",
	},
];

export default TWEETS;
