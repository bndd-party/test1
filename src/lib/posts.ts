import { getCollection } from "astro:content";

export async function getPublicPosts() {
  return getCollection("blog", ({ data }) => !data.draft);
}

export async function getPublicEnPosts() {
  return getCollection("enblog", ({ data }) => !data.draft);
}


// Articles intentionally excluded from search, including localized counterparts.
const SEARCH_EXCLUDED_SLUGS = new Set(["2026-08-11-v2"]);

export function isSearchExcludedPost(post: {
  slug: string;
  data: { noIndex?: boolean };
}): boolean {
  return post.data.noIndex === true || SEARCH_EXCLUDED_SLUGS.has(post.slug);
}
