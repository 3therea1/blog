import fs from "node:fs";
import { marked } from "marked";

const today = new Date().toISOString().slice(0, 10);

function escape(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function monthLabel(date) {
  const month = new Date(date + "T12:00Z").toLocaleString("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return month.toUpperCase();
}

function readPost(file) {
  const text = fs.readFileSync(`posts/${file}`, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`${file}: missing the --- block at the top`);
  }

  const [, head, body] = match;
  const fields = {};

  for (const line of head.split("\n")) {
    const [key, value = ""] = line.split(/:\s*(.*)/);
    fields[key.trim()] = value.trim();
  }

  if (!fields.title || !/^\d{4}-\d{2}-\d{2}$/.test(fields.date)) {
    throw new Error(`${file}: needs "title:" and "date: YYYY-MM-DD"`);
  }

  const minutes = Math.max(1, Math.round(body.split(/\s+/).length / 200));

  return {
    ...fields,
    slug: file.slice(0, -3),
    body,
    meta: `${monthLabel(fields.date)} · ${minutes} MIN`,
  };
}

const posts = fs
  .readdirSync("posts")
  .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
  .map(readPost)
  .filter((post) => post.draft !== "true" && post.date <= today)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((post, index, all) => ({ ...post, seed: all.length - index }));

function page(title, main) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${escape(title)}</title>
  <meta name="theme-color" content="#9ea8d8">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%233e62aa'/%3E%3Cpath d='M8 2v12M2 8h12M4 4l8 8M12 4l-8 8' stroke='%23f2f5ff' stroke-width='1.2'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <div class="page">
    <div class="corner">
      <a href="https://3therea1.dev">home</a>
    </div>

    <div class="wrap">
${main}
    </div>

    <div class="corner bottom-right" lang="ja">日記</div>
  </div>

  <script src="/sea.js"></script>
</body>
</html>
`;
}

function listItem(post) {
  const summary = post.summary ? `<p>${escape(post.summary)}</p>` : "";

  return `
      <a class="post" href="/${post.slug}/">
        <canvas data-seed="${post.seed}"></canvas>
        <div>
          <div class="meta">${post.meta}</div>
          <h2>${escape(post.title)}</h2>
          ${summary}
        </div>
      </a>`;
}

function indexPage() {
  const list = posts.length ? posts.map(listItem).join("\n") : "<p>nothing here yet</p>";

  return page(
    "blog · 3therea1",
    `    <section>
      <div class="intro">
        <h1>blog</h1>
        <p>my thoughts</p>
      </div>
${list}
    </section>`,
  );
}

function postPage(post, older, newer) {
  const olderLink = older ? `<a href="/${older.slug}/">← older</a>` : "<span></span>";
  const newerLink = newer ? `<a href="/${newer.slug}/">newer →</a>` : "<span></span>";

  return page(
    `${post.title} · 3therea1`,
    `    <article class="paper">
      <canvas class="band" data-seed="${post.seed}"></canvas>

      <div class="sheet">
        <div class="meta">${post.meta}</div>
        <h1>${escape(post.title)}</h1>

${marked.parse(post.body)}

        <div class="nav">
          ${olderLink}
          <a href="/">all posts</a>
          ${newerLink}
        </div>
      </div>
    </article>`,
  );
}

fs.rmSync("dist", { recursive: true, force: true });
fs.cpSync("assets", "dist", { recursive: true });

if (fs.existsSync("posts/images")) {
  fs.cpSync("posts/images", "dist/images", { recursive: true });
}

fs.writeFileSync("dist/index.html", indexPage());

posts.forEach((post, index) => {
  const older = posts[index + 1];
  const newer = posts[index - 1];

  fs.mkdirSync(`dist/${post.slug}`);
  fs.writeFileSync(`dist/${post.slug}/index.html`, postPage(post, older, newer));
});

console.log(`built ${posts.length} post(s)`);
