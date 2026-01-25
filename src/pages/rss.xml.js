import rss from "@astrojs/rss";
import { getPublicPosts } from "@/lib/posts";

export async function GET(context) {
  // 公開済み記事のみ取得
  const posts = await getPublicPosts();

  // 新しい順
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: "Kit Connect",
    description: "フィギュア・プラモデル制作と写真の記録。",
    site: context.site, // 本番では site が必要（後述）
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? "",
      pubDate: post.data.pubDate,
      link: `/blog/${post.slug}/`,
      // RSSリーダーによっては <content:encoded> を読んでくれる
      // 必要なら後で `customData` を強化できる
    })),
    customData: `<language>ja-jp</language>`,
  });
}
