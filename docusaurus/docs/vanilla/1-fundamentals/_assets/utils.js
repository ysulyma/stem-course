/* helper functions */

/**
 * Find a single element using a CSS selector.
 * @param {string} selector CSS selector
 * @param {Node} target Defaults to document.
 */
function $(selector, target = document) {
	return target.querySelector(selector);
}

/**
 * Find an array of elements using a CSS selector.
 * @param {string} selector CSS selector
 * @param {Node} target Defaults to document.
 */
function $$(selector, target = document) {
	return Array.from(target.querySelectorAll(selector));
}

/**
 * Create an element node
 * @param {string} tagName Name of the tag to create
 * @param attrs Attributes to add
 * @param children Array of
 */
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
			if (typeof child === "string") {
				node.appendChild($t(child));
			} else if (child instanceof Node) {
				node.appendChild(child);
			}
		}
	}

	return node;
}

/**
 * Create a text node
 * @param {string} text Text to use
 */
function $t(text) {
	return document.createTextNode(text);
}
