# Publishing a post

Add an entry to `posts.json`, then run `node build.mjs`. Each published post gets its own page and appears on its topic pages. Drafts are excluded. The home page shows the five most recent published posts.

Use this structure, replacing the example fields with your own content:

```json
{
  "slug": "my-first-post",
  "title": "Your post title",
  "date": "2026-09-28",
  "type": "Tutorial",
  "summary": "A short description of what readers will learn.",
  "tags": ["Linux", "Embedded systems"],
  "draft": true,
  "body": [
    {"type": "paragraph", "text": "Your introduction."},
    {"type": "heading", "text": "Getting started"},
    {"type": "paragraph", "text": "Explain the steps or share your experience."},
    {"type": "code", "text": "Your code goes here."}
  ]
}
```

Set `draft` to `false` when ready. Types can be Tutorial, Guide, Project notes, Experience, or another description that fits. Topic tags are independent of post type and can be combined freely. Text is escaped for safe display; HTML is not supported in post text. Dates use YYYY-MM-DD. Reading time is calculated from content.

Keep unpublished work information out of public posts. The current biography is intentionally brief until updated career details are supplied.
