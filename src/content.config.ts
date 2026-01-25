// src/content.config.ts
import { defineCollection, z } from "astro:content";

/**
 * JP/EN共通の frontmatter schema（img運用）
 * - pubDate: "2026-05-05" みたいな文字列でも通すため z.coerce.date()
 * - hero / coverImage: public/ 以下のURL文字列をそのまま保持（ImageMetadata化しない）
 * - tags: 省略時に [] になるよう default
 * - draft: 省略時 false
 */
const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),

  // 重要：frontmatter の "2026-05-05" を Date に変換して通す
  pubDate: z.coerce.date(),

  // tags が無い記事でも落ちないようにする
  tags: z.array(z.string()).default([]),

  // 下書きフラグ
  draft: z.boolean().default(false),

  // ★追加：サムネ/ヒーロー（img運用なので文字列でOK）
  hero: z.string().optional(),
  heroAlt: z.string().optional(),
  coverImage: z.string().optional(),
  coverAlt: z.string().optional(),
});

const blog = defineCollection({
  type: "content",
  schema: baseSchema,
});

const enblog = defineCollection({
  type: "content",
  schema: baseSchema,
});

export const collections = { blog, enblog };
