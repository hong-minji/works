import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { NotionPostFrontmatter } from "../../src/types/notion-post";
import { convertBlocksToMarkdown } from "./markdown-converter";
import { downloadImage } from "./image-downloader";

export async function transformNotionPage(
  page: PageObjectResponse
): Promise<{ frontmatter: NotionPostFrontmatter; content: string }> {
  const properties = page.properties;

  const getText = (prop: any): string => {
    if (prop?.type === "title") {
      return prop.title.map((t: any) => t.plain_text).join("");
    }
    if (prop?.type === "rich_text") {
      return prop.rich_text.map((t: any) => t.plain_text).join("");
    }
    return "";
  };

  const getSelect = (prop: any): string => {
    if (prop?.type === "select") {
      return prop.select?.name || "";
    }
    if (prop?.type === "rich_text") {
      return prop.rich_text.map((t: any) => t.plain_text).join("");
    }
    return "";
  };

  const getMultiSelect = (prop: any): string[] =>
    prop?.type === "multi_select"
      ? prop.multi_select.map((s: any) => s.name)
      : [];

  const getDate = (prop: any): string =>
    prop?.type === "date" ? prop.date?.start || "" : "";

  const getCheckbox = (prop: any): boolean =>
    prop?.type === "checkbox" ? prop.checkbox : false;

  const getFiles = (prop: any): string | undefined => {
    if (prop?.type === "files" && prop.files.length > 0) {
      const file = prop.files[0];
      return file.type === "external" ? file.external.url : file.file?.url;
    }
    return undefined;
  };

  // Helper to generate a slug from title or page ID
  const generateSlug = (title: string, pageId: string): string => {
    if (title) {
      // Convert title to slug format
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/^-+|-+$/g, ''); // Trim hyphens from start and end
    }
    // Fallback to page ID if no title
    return `post-${pageId.slice(0, 8)}`;
  };

  // Get title with fallback
  const title = getText(properties.Title) || getText(properties.Name) || `Untitled ${page.id.slice(0, 8)}`;

  // Get slug with fallback generation
  const rawSlug = getText(properties.Slug);
  const slug = rawSlug || generateSlug(title, page.id);

  // Get date with fallback to created time
  const date = getDate(properties.Date) || page.created_time.split('T')[0];

  // Get template with better defaults
  const template = (getSelect(properties.Template) || "post") as "post" | "page";

  // Get social image and download if exists
  const socialImageUrl = getFiles(properties["Social Image"]);
  let socialImage: string | undefined = undefined;
  if (socialImageUrl) {
    try {
      socialImage = await downloadImage(socialImageUrl);
    } catch (error) {
      console.error(`Failed to download social image for ${title}:`, error);
      socialImage = socialImageUrl; // Fallback to original URL
    }
  }

  const frontmatter: NotionPostFrontmatter = {
    title,
    slug,
    date,
    category: getSelect(properties.Category) || "uncategorized",
    tags: getMultiSelect(properties.Tags),
    description: getText(properties.Description) || "",
    draft: getCheckbox(properties.Draft),
    template,
    socialImage,
  };

  const content = await convertBlocksToMarkdown(page.id);

  return { frontmatter, content };
}
