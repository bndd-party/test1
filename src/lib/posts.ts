import { getCollection } from "astro:content";

export async function getPublicPosts() {
  return getCollection("blog", ({ data }) => !data.draft);
}

export async function getPublicEnPosts() {
  return getCollection("enblog", ({ data }) => !data.draft);
}
