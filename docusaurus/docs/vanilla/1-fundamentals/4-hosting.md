---
sidebar_position: 4
---

# Hosting

Now that you've made your site, how do you get it online?

## SFTP

[Cyberduck](https://cyberduck.io) is a popular SFTP client.

[Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

:::danger
Hosting content on an academic department webpage **is not recommended** since **you will lose access to it** when you change institutions.
:::

## GitHub Pages

### Git in general

First make sure you [have Git installed](https://git-scm.com/install/) as well as [a GitHub account](https://github.com/signup).

There are a few ways to use Git:

- via the command line: see this [Git cheat sheet](https://git-scm.com/cheat-sheet) for common commands.

- VSCode has [an integrated Source Control feature](https://code.visualstudio.com/docs/sourcecontrol/overview)

- [GitHub Desktop](https://desktop.github.com/download/) is a desktop GUI for Git/GitHub

- [lazygit](https://github.com/jesseduffield/lazygit/) is a terminal GUI for Git.

GitHub pages is an easy way to publish

### GitHub pages

[GitHub Pages documentation](https://docs.github.com/en/pages)

Clone my [repository](https://github.com/ysulyma/ysulyma.github.io)

```bash
git clone git@github.com:ysulyma/ysulyma.github.io.git
mv ysulyma.github.io <your-username>.github.io # replace with your username
cd <your-username>.github.io
rm -rf .git # remove .git history so that it's linked to your account instead of mine
```

```

```
