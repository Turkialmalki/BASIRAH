import { z } from "zod";
import { LocalizedText, VisualAsset } from "./base";
import { SceneSchema } from "./scenes";

export const ContentRightsStatus = z.enum([
  "original",
  "licensed",
  "public_domain",
  "fair_use_commentary",
  "pending_review",
]);

export const ContentRights = z.object({
  rightsStatus: ContentRightsStatus,
  sourceType: z.enum(["book", "article", "url", "original", "public_data"]),
  license: z.string().optional(),
  publisher: z.string().optional(),
  author: z.string().optional(),
  permission: z.string().optional(),
  expiry: z.string().datetime().optional(),
  territory: z.string().default("global"),
});
export type ContentRights = z.infer<typeof ContentRights>;

export const Chapter = z.object({
  id: z.string().uuid(),
  order: z.number().int().nonnegative(),
  title: LocalizedText,
  scenes: z.array(SceneSchema).min(1),
});
export type Chapter = z.infer<typeof Chapter>;

export const Course = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  title: LocalizedText,
  subtitle: LocalizedText.optional(),
  category: z.string(),
  coverAsset: VisualAsset.optional(),
  estimatedMinutes: z.number().int().positive(),
  chapters: z.array(Chapter).min(1),
  contentRights: ContentRights,
  /** internal citations for factual content; may be surfaced under "المصادر" */
  sources: z.array(z.object({ title: z.string(), url: z.string().url().optional() })).default([]),
  status: z.enum(["draft", "in_review", "published", "archived"]).default("draft"),
});
export type Course = z.infer<typeof Course>;
