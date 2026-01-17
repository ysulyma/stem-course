(() => {
	const max = 30;
	const value = 100;

	const container = document.getElementById("container");

	const table = document.createElement("table");

	// table header
	const thead = document.createElement("thead");
	{
		const tr = document.createElement("tr");
		{
			const th = document.createElement("th");
			th.appendChild(document.createTextNode("Base"));
			tr.appendChild(th);
		}
		{
			const th = document.createElement("th");
			th.appendChild(document.createTextNode("Value"));
			tr.appendChild(th);
		}

		thead.appendChild(tr);
	}
	table.appendChild(thead);

	// table body
	const tbody = document.createElement("tbody");
	for (let base = 2; base < max; ++base) {
		const tr = document.createElement("tr");

		const th = document.createElement("th");
		th.appendChild(document.createTextNode(base));
		tr.appendChild(th);

		const td = document.createElement("th");
		td.appendChild(document.createTextNode(value.toString(base)));
		tr.appendChild(td);

		tbody.appendChild(tr);
	}

	table.appendChild(tbody);

	// append to container
	container.appendChild(table);
})();
