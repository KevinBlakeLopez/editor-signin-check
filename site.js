// Draws the test site from the content files, in the browser. A throwaway:
// a real site is built into plain HTML before it's published.
"use strict";

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]);

// Pages CMS writes image paths from the site root ("/media/hero.svg"). On a
// GitHub Pages project site the root is the repository's folder, so drop the
// leading slash and let the path resolve from this page.
const asset = (path) => String(path ?? "").replace(/^\/+/, "");

// Links typed by editors: keep web, mail and phone links, anchors and
// relative paths; drop anything else (such as "javascript:").
const safeHref = (href) => {
  const value = String(href ?? "").trim();
  const scheme = value.match(/^([a-z][a-z0-9+.-]*):/i);
  return !scheme || ["http", "https", "mailto", "tel"].includes(scheme[1].toLowerCase()) ? value : "";
};

const button = (link) => {
  const href = safeHref(link?.href);
  return link?.text && href ? `<a class="button" href="${escape(href)}">${escape(link.text)}</a>` : "";
};

const BLOCKS = {
  hero: (block, isTitle) => {
    const tag = isTitle ? "h1" : "h2";
    const image = block.image?.src
      ? `<img src="${escape(asset(block.image.src))}" alt="${escape(block.image.alt)}">`
      : "";
    return `
      <section class="hero">
        <div>
          <${tag}>${escape(block.heading)}</${tag}>
          ${block.text ? `<p class="lede">${escape(block.text)}</p>` : ""}
          ${button(block.link)}
        </div>
        ${image}
      </section>`;
  },
  // The editor's HTML, shown as it is. Fine for a test; a real build
  // sanitizes it first.
  richText: (block) => `<section class="text">${block.html ?? ""}</section>`,
  cardGrid: (block) => `
    <section class="cards">
      ${block.heading ? `<h2>${escape(block.heading)}</h2>` : ""}
      <ul>
        ${(block.cards ?? [])
          .map((card) => `<li><h3>${escape(card.heading)}</h3>${card.text ? `<p>${escape(card.text)}</p>` : ""}</li>`)
          .join("")}
      </ul>
    </section>`,
  callToAction: (block) => `
    <section class="cta">
      <h2>${escape(block.heading)}</h2>
      ${block.text ? `<p>${escape(block.text)}</p>` : ""}
      ${button(block.link)}
    </section>`,
};

const news = (items) => {
  const sorted = [...(items ?? [])].sort((a, b) => String(b.date ?? "").localeCompare(String(a.date ?? "")));
  const list = sorted
    .map(
      (item) =>
        `<li><h3>${escape(item.title)}</h3>` +
        (item.date ? `<p class="date"><time datetime="${escape(item.date)}">${escape(item.date)}</time></p>` : "") +
        (item.summary ? `<p>${escape(item.summary)}</p>` : "") +
        "</li>",
    )
    .join("");
  return `
    <section class="news" id="news" aria-labelledby="news-title">
      <h2 id="news-title">News</h2>
      ${list ? `<ul>${list}</ul>` : "<p>No news yet.</p>"}
    </section>`;
};

async function load(path) {
  // "no-store" so an edit shows as soon as GitHub Pages has published it.
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} answered ${response.status}`);
  return response.json();
}

async function render() {
  const main = document.getElementById("content");
  try {
    const [home, newsItems] = await Promise.all([load("content/home.json"), load("content/news.json")]);
    document.title = home.seo?.title || home.title || "Test site";
    if (home.seo?.description) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = home.seo.description;
      document.head.append(meta);
    }
    const blocks = home.blocks ?? [];
    // The first hero carries the page's one <h1>; without one, the page title does.
    const heroIsTitle = blocks[0]?.type === "hero";
    const title = heroIsTitle ? "" : `<h1 class="page-title">${escape(home.title)}</h1>`;
    const sections = blocks
      .map((block, index) => {
        const draw = BLOCKS[block.type];
        return draw
          ? draw(block, heroIsTitle && index === 0)
          : `<p class="status">This test site can't show a "${escape(block.type)}" section.</p>`;
      })
      .join("");
    main.innerHTML = title + sections + news(newsItems);
  } catch (error) {
    main.innerHTML = `<p class="status">The content didn't load: ${escape(error.message)}</p>`;
    console.error(error);
  }
}

render();
