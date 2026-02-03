class Doc {
	lines: string[];

	constructor(html: string) {
		this.lines = html.split("\n");
	}

	line(search: string) {
		const index = this.lines.findIndex((l) => l.includes(search));
		if (index === -1) {
			throw new Error(`no line matching "${search}"`);
		}

		return new Line(index, this);
	}

	range(start: string, end: string) {
		const startIndex = this.lines.findIndex((l) => l.includes(start));
		if (startIndex === -1) {
			throw new Error(`no line matching "${start}"`);
		}

		const endIndex = this.lines.findIndex((l) => l.includes(end));
		if (endIndex === -1) {
			throw new Error(`no line matching "${end}"`);
		}

		return new LineRange(startIndex, endIndex, this);
	}

	toString() {
		return this.lines.join("\n");
	}
}

class Line {
	constructor(
		private index: number,
		public parent: Doc,
	) {}

	before(str: string, indent = 0) {
		const newLines = str.split("\n");
		if (newLines[0].trim().length === 0) newLines.shift();
		if (newLines.at(-1).trim().length === 0) newLines.pop();

		if (newLines.length === 0) return this;

		const whitespaceLength = newLines.reduce(
			(acc, curr) => Math.min(acc, leadingWhitespace(curr)),
			leadingWhitespace(newLines[0]),
		);

		const priorIndent =
			this.index === 0 ? 0 : leadingWhitespace(this.parent.lines[this.index]);

		for (let i = 0; i < newLines.length; ++i) {
			newLines[i] =
				" ".repeat(priorIndent + indent) + newLines[i].slice(whitespaceLength);
		}

		this.parent.lines.splice(this.index, 0, ...newLines);
		return this;
	}

	after(str: string, indent = 0) {
		const newLines = str.split("\n");
		if (newLines[0].trim().length === 0) newLines.shift();
		if (newLines.at(-1).trim().length === 0) newLines.pop();

		if (newLines.length === 0) return this;

		const whitespaceLength = newLines.reduce(
			(acc, curr) => Math.min(acc, leadingWhitespace(curr)),
			leadingWhitespace(newLines[0]),
		);

		const priorIndent =
			this.index === 0 ? 0 : leadingWhitespace(this.parent.lines[this.index]);

		for (let i = 0; i < newLines.length; ++i) {
			newLines[i] =
				" ".repeat(priorIndent + indent) + newLines[i].slice(whitespaceLength);
		}

		this.parent.lines.splice(this.index + 1, 0, ...newLines);
		return this;
	}

	toString() {
		return this.parent.toString();
	}
}

class LineRange {
	constructor(
		private startIndex: number,
		private endIndex: number,
		public parent: Doc,
	) {}

	inner() {
		return new LineRange(this.startIndex + 1, this.endIndex - 1, this.parent);
	}

	wrap(start: string, end: string) {
		const priorIndent =
			this.startIndex === 0
				? 0
				: leadingWhitespace(this.parent.lines[this.startIndex]);

		const indent = " ".repeat(priorIndent);

		this.parent.lines.splice(this.startIndex, 0, indent + start);
		for (let i = this.startIndex + 1; i < this.endIndex + 2; ++i) {
			this.parent.lines[i] = " ".repeat(2) + this.parent.lines[i];
		}
		this.parent.lines.splice(this.endIndex + 2, 0, indent + end);
		return this;
	}

	toString() {
		return this.parent.toString();
	}
}

function leadingWhitespace(str: string) {
	return str.match(/^\s*/)[0]?.length ?? 0;
}

export function modify(
	html: string,
	callback: (doc: Doc) => Doc | Line = (doc) => doc,
) {
	return callback(new Doc(html)).toString();
}
