(() => {
	const switcher = document.getElementById("color-switcher");

	switcher.addEventListener("click", () => {
		const colorScheme = switcher.dataset.value;
		let newColorScheme;

		switch (colorScheme) {
			case "light":
				newColorScheme = "dark";
				break;
			case "dark":
				newColorScheme = "system";
				break;
			case "system":
				newColorScheme = "light";
				break;
		}

		// set document color scheme
		document.documentElement.style.colorScheme =
			newColorScheme === "system" ? "light dark" : newColorScheme;

		// update switcher
		switcher.dataset.value = newColorScheme;
		switcher.ariaLabel = `Switch between light and dark mode (currently ${newColorScheme} mode)`;
	});
})();
