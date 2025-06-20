// types.ts

export type ContentType =
  | "blog"
  | "podcast_transcript"
  | "call_transcript"
  | "linkedin_post"
  | "reddit_comment"
  | "book"
  | "other"
  | "pdf";

export interface KnowledgeItem {
  title: string;
  content: string;
  content_type: ContentType;
  source_url?: string;
  author?: string;
  user_id?: string;
}

export interface KnowledgeBase {
  team_id: string;
  items: KnowledgeItem[];
}
