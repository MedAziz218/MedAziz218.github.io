# Writing with Hugo

Each post lives in its own folder under `content/posts/`, with an `index.md` file and optional images beside it.

Create a draft from the project directory:

```powershell
hugo new content posts/my-first-post/index.md
```

In this workspace Hugo is installed locally; use `../../work/hugo-compatible/hugo.exe` in place of `hugo` if it is not on your PATH.

A post looks like this:

```markdown
---
title: "Your post title"
date: 2026-09-28
draft: true
summary: "A short introduction to the post."
tags: ["Linux", "Embedded systems"]
categories: ["Tutorial"]
---

Your introduction goes here.

## Getting started

Write Markdown here, including code blocks and images.
```

Use categories for Tutorial, Guide, Project notes, or Experience, and tags for related technologies or topics. Hugo automatically generates the tag and category pages. Blowfish adds reading time, a table of contents, code highlighting, search, and a light/dark switch.

Preview drafts with `hugo server -D`. Set `draft: false` when ready, then build with `hugo --minify`. Building updates `dist/`; publishing is a separate step.

For an image beside `index.md`, use `![Description](photo.jpg)`. Naming a suitable image `feature.jpg` makes it the post's featured image in Blowfish.

Edit `content/about.md` for your biography and `content/projects/_index.md` for projects. Theme settings are in `config/_default/`. Your updated work biography and first post are still pending.

