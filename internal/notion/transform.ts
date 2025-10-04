import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { NotionPostFrontmatter } from "../../src/types/notion-post";
import { convertBlocksToMarkdown } from "./markdown-converter";

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

  const frontmatter: NotionPostFrontmatter = {
    title: getText(properties.Title),
    slug: getText(properties.Slug),
    date: getDate(properties.Date),
    category: getSelect(properties.Category),
    tags: getMultiSelect(properties.Tags),
    description: getText(properties.Description),
    draft: getCheckbox(properties.Draft),
    template: getSelect(properties.Template) as "post" | "page",
    socialImage: getFiles(properties["Social Image"]),
  };

  const content = await convertBlocksToMarkdown(page.id);

  return { frontmatter, content };
}
