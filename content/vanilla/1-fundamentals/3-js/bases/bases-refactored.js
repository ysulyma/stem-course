(() => {
	const minBase = 2;
	const maxBase = 32;
	const rowsPerTable = 10;

	// container element
	const container = $("#container");

	function makeTables(value) {
		for (
			let tableStart = minBase;
			tableStart < maxBase;
			tableStart += rowsPerTable
		) {
			const tableEnd = Math.min(tableStart + rowsPerTable, maxBase);
			const table = $e("table");

			// table header
			table.appendChild(
				$e("thead", [
					$e("tr", [$e("th", ["Base"]), $e("th", ["Value"])]),
				]),
			);

			// table body
			const tbody = $e("tbody");
			for (let base = tableStart; base <= tableEnd; ++base) {
				tbody.appendChild(
					$e("tr", base === 10 ? { class: "decimal" } : {}, [
						$e("th", [base]),
						$e("td", [value.toString(base)]),
					]),
				);
			}
			table.appendChild(tbody);

			// append to container
			container.appendChild(table);
		}
	}

	function bindEventListeners() {
		const input = $("input");

		input.addEventListener("change", (e) => {
			console.log(e);
			const value = parseFloat(e.target.value);
			if (Number.isNaN(value)) return;

			// inefficient but easy
			// container.replaceChildren();
			// makeTables(value);

			// more efficient but duplicates some logic
			const cells = $$("tbody td", container);
			for (let index = 0; index < cells.length; ++index) {
				const base = index + 2;
				const cell = cells[index];
				cell.innerHTML = value.toString(base);
			}
		});
	}

	makeTables(parseFloat($("input").value));
	bindEventListeners();

	/* helper functions */
	function $(selector, target = document) {
		return target.querySelector(selector);
	}

	function $$(selector, target = document) {
		return Array.from(target.querySelectorAll(selector));
	}

	/** Create an element node */
	function $e(tagName, attrs, children) {
		const node = document.createElement(tagName);

		if (Array.isArray(attrs) && typeof children === "undefined") {
			children = attrs;
			attrs = {};
		}

		if (attrs) {
			for (const [key, value] of Object.entries(attrs)) {
				node.setAttribute(key, value);
			}
		}

		if (Array.isArray(children)) {
			for (const child of children) {
				node.append(child);
			}
		}

		return node;
	}
})();
