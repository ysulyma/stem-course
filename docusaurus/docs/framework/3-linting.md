# Formatters / Linters

A **formatter** adds linebreaks, indentation, etc. to your code to make it more readable. A formatter maintains a consistent formatting style across your entire codebase.

A **linter** flags potential bugs in your code.

We will use [Biome](https://biomejs.dev/), a popular combined-linter-and-formatter which is very fast.

## Installation

For more details, follow the guide at [Biome - Getting Started](https://biomejs.dev/guides/getting-started/).

Run the following commands copied from the installation guide:

```bash
npm i -D -E @biomejs/biome # installs Biome
npx @biomejs/biome init    # initializes the biome.json config file
```

:::info
`npm i -D -E @biomejs/biome` is shorthand for

```bash
npm install --save-dev --save-exact @biomejs/biome
```

The `--save-dev` flag saves Biome to [`devDependencies`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#devdependencies) instead of [`dependencies`](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#dependencies).

The [`--save-exact`](https://docs.npmjs.com/cli/v8/commands/npm-install#save-exact) flag pins an **exact** version of Biome, e.g. `2.3.14`; by default, packages are installed with a [semver range](https://devhints.io/semver) such as `^2.3.14`, which means "any version compatible with `2.3.14`".
:::

You should now have a `biome.json` file in the root of your repository.

## VSCode extension

Instead of running Biome manually, we can configure it to run automatically every time we save a file. For more details, consult the [Biome - VS Code extension guide](https://biomejs.dev/reference/vscode/).

1. [Install the Biome VS Code extension](vscode:extension/biomejs.biome).

2. Press `⇧⌘P` to open the Command Palette. Choose `Preferences: Open User Settings (JSON)`.

3. Add the following to the end of the file (inside the braces):
   ```js
     "editor.codeActionsOnSave": {
       "source.fixAll.biome": "explicit",
       "source.organizeImports.biome": "explicit",
     },
     "editor.formatOnSave": true,
     "[css]": {
       "editor.defaultFormatter": "biomejs.biome",
     },
     "[html]": {
       "editor.defaultFormatter": "biomejs.biome",
     },
     "[javascript]": {
       "editor.defaultFormatter": "biomejs.biome",
     },
     "[javascriptreact]": {
       "editor.defaultFormatter": "biomejs.biome",
     },
     "[typescript]": {
       "editor.defaultFormatter": "biomejs.biome",
     },
     "[typescriptreact]": {
       "editor.defaultFormatter": "biomejs.biome",
     }
   ```

Now Biome will auto-format your code every time you save! You no longer need to use the `Format Document` command.

## Alternatives

- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) and [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) are high-performance formatters/linters.

- Older repos use [Prettier](https://prettier.io/) for formatting and [ESLint](https://eslint.org/) for linting. You should not use these for new projects since they are drastically slower than modern alternatives. (Prettier is not that bad, but it's common for ESLint to take over a minute on sufficiently complicated codebases.)

:::info
In general, the JavaScript/TypeScript ecosystem is moving/has moved away from JS/TS for **tooling** in favor of **compiled languages** (Go, Rust, Zig, etc.), which are drastically faster.
:::
