---
sidebar_position: 2
---

# Command line

## General tricks

### Go to last directory

This will change to the last directory you were in.

```bash
cd -
```

## History

Use `Ctrl-r` to search through your command history.

## Clipboard

### Copying to the clipboard

This will copy the contents of `file.txt` to your clipboard.

```bash
cat file.txt | pbcopy
```

### Pasting from the clipboard

This will paste the contents of your clipboard into the file `file.txt`.

```bash
pbpaste > file.txt
```
