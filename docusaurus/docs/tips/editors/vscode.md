# VS Code

## Keyboard shortcuts

[Keyboard shortcuts cheatsheet](https://code.visualstudio.com/shortcuts/keyboard-shortcuts-macos.pdf)

## Settings

Press `⇧⌘P` to open the Command Palette, then choose `Preferences: Open User Settings (JSON)`.

[VS Code Settings docs](https://code.visualstudio.com/docs/configure/settings)

### Format-on-save

Add the following to automatically format files whenever you save them:

```json
    "editor.formatOnSave": true,
```

### Hide files from view

Use `files.exclude` to hide files from the Explorer view:

```json
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/.DS_Store": true,
        "**/Thumbs.db": true,
        "node_modules": true
    }
```

## Useful extensions

- [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Total TypeScript](https://marketplace.visualstudio.com/items?itemName=mattpocock.ts-error-translator)
- [Vim emulation](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim)
