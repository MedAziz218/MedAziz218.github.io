import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs';
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const posts = JSON.parse(readFileSync(new URL('./posts.json', import.meta.url), 'utf8')).filter(p => !p.draft);
const slugs = new Set();
for (const p of posts) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) throw Error('Post slugs must be unique lowercase URL slugs.');
  if (!p.title || !p.summary || !Array.isArray(p.tags) || !Array.isArray(p.body) || !/^\d{4}-\d{2}-\d{2}$/.test(p.date) || Number.isNaN(Date.parse(p.date))) throw Error('Incomplete post: ' + p.slug);
  slugs.add(p.slug);
}
posts.sort((a,b) => b.date.localeCompare(a.date));
const topicSlug = t => Buffer.from(t).toString('hex');
const topics = [...new Set(posts.flatMap(p => p.tags))].sort();
const tags = p => `<div class="post-tags">${p.tags.map(t => `<a href="/topics/${topicSlug(t)}/">${escape(t)}</a>`).join('')}</div>`;
const minutes = p => Math.max(1, Math.ceil(p.body.map(b => b.text).join(' ').split(/\s+/).length / 220));
const cards = list => list.map(p => `<article class="post-card"><div class="post-meta"><span>${escape(p.type || 'Essay')}</span> · <time datetime="${escape(p.date)}">${escape(p.date)}</time> · ${minutes(p)} min read</div><h3><a href="/posts/${p.slug}/">${escape(p.title)}</a></h3><p>${escape(p.summary)}</p>${tags(p)}</article>`).join('');
const filters = selected => `<nav class="topic-nav" aria-label="Filter posts by topic"><a href="/writing/"${!selected ? ' aria-current="page"' : ''}>All posts</a>${topics.map(t => `<a href="/topics/${topicSlug(t)}/"${selected === t ? ' aria-current="page"' : ''}>${escape(t)}</a>`).join('')}</nav>`;
let home = readFileSync(new URL('./home.html', import.meta.url), 'utf8');
const empty = '<p class="empty-posts">No posts published yet. Tutorials, project notes, and personal experiences will appear here.</p>';
home = home.replace('<!-- WRITING -->', `<section id="writing" aria-labelledby="writing-heading"><div class="section-top"><h2 id="writing-heading">Writing</h2><a href="/writing/">All posts ↗</a></div>${posts.length ? filters() + cards(posts.slice(0, 5)) : empty}</section>`);
const head = home.slice(0, home.indexOf('<body>'));
const shell = (title, content) => head.replace(/<title>.*?<\/title>/, `<title>${escape(title)} — Aziz</title>`).replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(title)} — writing by Mohamed Aziz Lahdheri.">`) + `<body><a class="skip" href="#main">Skip to content</a><div class="wrap"><header><a class="brand mono" href="/">aziz<span>.</span></a><nav aria-label="Main navigation"><a href="/writing/">Writing</a><a href="/#projects">Projects</a><a href="/#about">About</a></nav></header><main id="main" class="reading">${content}</main><footer><a href="/">← Home</a><span>Mohamed Aziz Lahdheri</span></footer></div></body></html>`;
const manifest = new URL('./generated-pages.json', import.meta.url);
const previous = existsSync(manifest) ? JSON.parse(readFileSync(manifest, 'utf8')) : [];
const generated = [];
function save(path, content) { const url = new URL('./dist/' + path, import.meta.url); mkdirSync(new URL('.', url), { recursive: true }); writeFileSync(url, content); generated.push(path); }
save('index.html', home);
save('writing/index.html', shell('Writing', `<p class="eyebrow">Tutorials · Guides · Experiences</p><h1>Writing.</h1>${posts.length ? filters() + cards(posts) : empty}`));
for (const topic of topics) save(`topics/${topicSlug(topic)}/index.html`, shell(topic, `<p class="eyebrow">Browse by topic</p><h1>${escape(topic)}</h1>${filters(topic)}${cards(posts.filter(p => p.tags.includes(topic)))}`));
for (const p of posts) {
  const body = p.body.map(b => b.type === 'code' ? `<pre><code>${escape(b.text)}</code></pre>` : b.type === 'heading' ? `<h2>${escape(b.text)}</h2>` : `<p>${escape(b.text)}</p>`).join('');
  save(`posts/${p.slug}/index.html`, shell(p.title, `<a href="/writing/">← All writing</a><article class="prose"><div class="post-meta">${escape(p.type || 'Essay')} · <time datetime="${escape(p.date)}">${escape(p.date)}</time> · ${minutes(p)} min read</div><h1>${escape(p.title)}</h1><p class="intro">${escape(p.summary)}</p>${tags(p)}<div class="article-body">${body}</div></article>`));
}
for (const path of previous) {
  if (!generated.includes(path) && /^(posts\/[a-z0-9-]+|topics\/[a-f0-9]+)\/index\.html$/.test(path)) {
    const url = new URL('./dist/' + path, import.meta.url);
    if (existsSync(url)) unlinkSync(url);
  }
}
writeFileSync(manifest, JSON.stringify(generated, null, 2));
console.log(`Built portfolio, writing archive, ${posts.length} posts and ${topics.length} topic pages.`);
