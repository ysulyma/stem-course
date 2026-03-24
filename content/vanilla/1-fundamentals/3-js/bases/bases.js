(() => {
	const max = 30;
	const value = 100;


	const container = document.getElementById("container");

	const table = $e("table");

	// table header
	const thead = $e("thead");
	{
		const tr = $e("tr");
		{
			const th = $e("th");
			th.append("Base");
			tr.append(th);
		}
		{
			const th = $e("th");
			th.append("Value");
			tr.append(th);
		}

		thead.appendChild(tr);
	}
	table.appendChild(thead);

	// table body
	const tbody = $e("tbody");
	for (let base = 2; base < max; ++base) {
		const tr = $e("tr");

		const th = $e("th");
		th.appendChild(document.createTextNode(base));
		tr.appendChild(th);

		const td = $e("th");
		td.appendChild(document.createTextNode(value.toString(base)));
		tr.appendChild(td);

		tbody.appendChild(tr);
	}

	table.appendChild(tbody);

	// append to container
	container.appendChild(table);
})();