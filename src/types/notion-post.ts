export interface NotionPostFrontmatter {
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  draft: boolean;
  template: "post" | "page";
  socialImage?: string;
}

export interface NotionPostNode {
  id: string;
  frontmatter: NotionPostFrontmatter;
  content: string;
  excerpt: string;
  notionId: string;
  createdTime: string;
  lastEditedTime: string;
  internal: {
    type: "NotionPost";
    contentDigest: string;
    mediaType: string;
  };
}
