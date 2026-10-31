import { getPublicPosts, getPublicEnPosts, isSearchExcludedPost } from "@/lib/posts";

// Keep this in sync with `site` in astro.config.mjs.
const SITE_URL = "https://kit-connect.netlify.app/";
const SITE_ORIGIN = new URL(SITE_URL).origin;

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function resolveLocalImageUrl(source: string, pageUrl: URL): string | null {
  const trimmed = source.trim();
  if (!trimmed || /^(data|blob|javascript):/i.test(trimmed)) return null;

  try {
    const imageUrl = new URL(trimmed, pageUrl);
    if (imageUrl.protocol !== "https:" && imageUrl.protocol !== "http:") return null;

    // This sitemap lists images hosted on Kit Connect itself.
    // External image hosts are omitted because they require separate verification.
    if (imageUrl.origin !== SITE_ORIGIN) return null;

    imageUrl.hash = "";
    return imageUrl.href;
  } catch {
    return null;
  }
}

function extractImageSources(body: string | undefined): string[] {
  if (!body) return [];

  const sources: string[] = [];

  // HTML images written directly in Markdown, e.g. <img src="/images/photo.avif">
  const htmlImagePattern = /<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  for (const match of body.matchAll(htmlImagePattern)) {
    const source = match[1] ?? match[2] ?? match[3];
    if (source) sources.push(source);
  }

  // Markdown images, e.g. ![description](/images/photo.avif)
  const markdownImagePattern = /!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))/g;
  for (const match of body.matchAll(markdownImagePattern)) {
    const source = match[1] ?? match[2];
    if (source) sources.push(source);
  }

  return sources;
}

function getArticleImageUrls(
  post: { data: { hero?: string }; body?: string },
  pageUrl: URL,
): string[] {
  const rawSources = [post.data.hero, ...extractImageSources(post.body)];
  const uniqueUrls = new Set<string>();

  for (const source of rawSources) {
    if (!source) continue;
    const resolved = resolveLocalImageUrl(source, pageUrl);
    if (resolved) uniqueUrls.add(resolved);
  }

  // Google supports up to 1,000 images for one page in an image sitemap.
  return [...uniqueUrls].slice(0, 1000);
}

function encodeSlugPath(slug: string): string {
  return slug
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export async function GET() {
  const [jpPosts, enPosts] = await Promise.all([
    getPublicPosts(),
    getPublicEnPosts(),
  ]);

  const urlEntries: string[] = [];

  const collections = [
    { posts: jpPosts, basePath: "/blog" },
    { posts: enPosts, basePath: "/en/blog" },
  ];

  for (const collection of collections) {
    for (const post of collection.posts) {
      // Do not advertise images from pages that carry noindex/noimageindex.
      // Shared images can still be listed through other, indexable article pages.
      if (isSearchExcludedPost(post)) continue;

      const slugPath = encodeSlugPath(post.slug);
      const pageUrl = new URL(`${collection.basePath}/${slugPath}/`, SITE_URL);
      const imageUrls = getArticleImageUrls(post, pageUrl);

      // Do not emit page entries that have no images.
      if (imageUrls.length === 0) continue;

      const imageXml = imageUrls
        .map((imageUrl) => `      <image:image>\n        <image:loc>${escapeXml(imageUrl)}</image:loc>\n      </image:image>`)
        .join("\n");

      urlEntries.push(
        `  <url>\n    <loc>${escapeXml(pageUrl.href)}</loc>\n${imageXml}\n  </url>`,
      );
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urlEntries,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
