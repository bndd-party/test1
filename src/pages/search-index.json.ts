import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

type SearchIndexItem = {
  title: string;
  description: string;
  url: string;
  pubDate: string;
  body: string;
  lang: "ja" | "en";
};

const normalizeBody = (s: string) => s.replace(/\s+/g, " ").trim();

export const GET: APIRoute = async () => {
  const ja = await getCollection("blog", ({ data }) => !data.draft);
  const en = await getCollection("enblog", ({ data }) => !data.draft);

  const jaData: SearchIndexItem[] = ja.map((p) => ({
    title: p.data.title,
    description: p.data.description ?? "",
    url: `/blog/${p.slug}/`,
    pubDate: p.data.pubDate ? p.data.pubDate.toISOString().slice(0, 10) : "",
    body: normalizeBody(p.body ?? ""),
    lang: "ja",
  }));

  const enData: SearchIndexItem[] = en.map((p) => ({
    title: p.data.title,
    description: p.data.description ?? "",
    url: `/en/blog/${p.slug}/`,
    pubDate: p.data.pubDate ? p.data.pubDate.toISOString().slice(0, 10) : "",
    body: normalizeBody(p.body ?? ""),
    lang: "en",
  }));

  // 新しい順に並べたい場合（任意）
  const data = [...jaData, ...enData].sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1));

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};
