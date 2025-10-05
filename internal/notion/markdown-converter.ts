import { notion } from "./client";
import { retryWithBackoff } from "./utils";
import { downloadImage } from "./image-downloader";
import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function convertBlocksToMarkdown(pageId: string): Promise<string> {
  try {
    const blocks = await fetchAllBlocks(pageId);
    const processedBlocks: string[] = [];

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.type === "table") {
        // Process table block with its children
        const tableMarkdown = await processTableBlock(block);
        processedBlocks.push(tableMarkdown);
      } else {
        // Process the block and its children recursively
        const markdown = await processBlockWithChildren(block);
        if (markdown) {
          processedBlocks.push(markdown);
        }
      }
    }

    return processedBlocks.join("\n\n");
  } catch (error) {
    console.error(`Failed to convert blocks to markdown for page ${pageId}:`, error);
    // Return empty string on error to allow build to continue
    return "";
  }
}

async function processBlockWithChildren(
  block: BlockObjectResponse,
  indentLevel: number = 0
): Promise<string> {
  const indent = "  ".repeat(indentLevel); // Use 2 spaces for each indent level
  let markdown = "";

  // Process the current block
  const blockContent = await blockToMarkdown(block, indentLevel);
  if (blockContent) {
    markdown = blockContent;
  }

  // Check if block has children and fetch them
  if ((block as any).has_children) {
    const children = await fetchAllBlocks(block.id);
    const childrenMarkdown: string[] = [];

    for (const child of children) {
      if (child.type === "table") {
        // Tables don't get indented
        const tableMarkdown = await processTableBlock(child);
        childrenMarkdown.push(tableMarkdown);
      } else {
        // Process child blocks with increased indent
        const childMarkdown = await processBlockWithChildren(child, indentLevel + 1);
        if (childMarkdown) {
          childrenMarkdown.push(childMarkdown);
        }
      }
    }

    if (childrenMarkdown.length > 0) {
      // For toggle blocks, insert children content inside the details tag
      if (block.type === "toggle") {
        markdown = markdown.replace(
          "<!-- Toggle content will be added here -->",
          childrenMarkdown.join("\n\n")
        );
      } else {
        // For other blocks, append children below
        markdown += "\n" + childrenMarkdown.join("\n");
      }
    }
  }

  return markdown;
}

async function fetchAllBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  try {
    while (true) {
      const response: any = await retryWithBackoff(async () => {
        return await notion.blocks.children.list({
          block_id: pageId,
          start_cursor: cursor,
        });
      });

      blocks.push(
        ...response.results.filter(
          (block: any): block is BlockObjectResponse => "type" in block
        )
      );

      if (!response.has_more) break;
      cursor = response.next_cursor ?? undefined;
    }

    console.log(`✅ Fetched ${blocks.length} blocks for page ${pageId}`);
  } catch (error) {
    console.error(`❌ Failed to fetch blocks for page ${pageId}:`, error);
    // Return what we have so far rather than failing completely
  }

  return blocks;
}

async function blockToMarkdown(block: BlockObjectResponse, indentLevel: number = 0): Promise<string> {
  const type = block.type;
  const indent = "  ".repeat(indentLevel);

  switch (type) {
    case "paragraph":
      const paragraphText = richTextToMarkdown(block.paragraph.rich_text);
      return paragraphText ? `${indent}${paragraphText}` : "";

    case "heading_1":
      // Headings don't get indented
      return `# ${richTextToMarkdown(block.heading_1.rich_text)}`;

    case "heading_2":
      // Headings don't get indented
      return `## ${richTextToMarkdown(block.heading_2.rich_text)}`;

    case "heading_3":
      // Headings don't get indented
      return `### ${richTextToMarkdown(block.heading_3.rich_text)}`;

    case "bulleted_list_item":
      return `${indent}- ${richTextToMarkdown(block.bulleted_list_item.rich_text)}`;

    case "numbered_list_item":
      return `${indent}1. ${richTextToMarkdown(block.numbered_list_item.rich_text)}`;

    case "to_do":
      const checked = block.to_do.checked ? "x" : " ";
      return `${indent}- [${checked}] ${richTextToMarkdown(block.to_do.rich_text)}`;

    case "toggle":
      // Toggle blocks as collapsible sections (using HTML details tag)
      return `${indent}<details>\n${indent}<summary>${richTextToMarkdown(block.toggle.rich_text)}</summary>\n\n${indent}<!-- Toggle content will be added here -->\n${indent}</details>`;

    case "code":
      const language = block.code.language || "";
      const code = richTextToMarkdown(block.code.rich_text);
      // Code blocks preserve their own indentation
      return `${indent}\`\`\`${language}\n${code}\n${indent}\`\`\``;

    case "quote":
      // Apply indent to each line of the quote
      const quoteText = richTextToMarkdown(block.quote.rich_text);
      const quotedLines = quoteText.split('\n').map(line => `${indent}> ${line}`).join('\n');
      return quotedLines;

    case "callout":
      const emoji = block.callout.icon?.type === "emoji" ? block.callout.icon.emoji : "💡";
      const calloutText = richTextToMarkdown(block.callout.rich_text);
      const calloutLines = `${emoji} **Note:** ${calloutText}`.split('\n').map(line => `${indent}> ${line}`).join('\n');
      return calloutLines;

    case "divider":
      return `${indent}---`;

    case "image":
      const originalImageUrl =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;

      // Download image and get local path
      const localImagePath = await downloadImage(originalImageUrl);

      const caption =
        block.image.caption.length > 0
          ? richTextToMarkdown(block.image.caption)
          : "Image";
      return `${indent}![${caption}](${localImagePath})`;

    case "video":
      const videoUrl =
        block.video.type === "external"
          ? block.video.external.url
          : block.video.file.url;
      return `${indent}[Video](${videoUrl})`;

    case "file":
      const fileUrl =
        block.file.type === "external"
          ? block.file.external.url
          : block.file.file.url;
      const fileName = block.file.caption.length > 0
        ? richTextToMarkdown(block.file.caption)
        : "Download File";
      return `${indent}[${fileName}](${fileUrl})`;

    case "pdf":
      const pdfUrl =
        block.pdf.type === "external"
          ? block.pdf.external.url
          : block.pdf.file.url;
      return `${indent}[PDF Document](${pdfUrl})`;

    case "bookmark":
      const bookmarkUrl = block.bookmark.url;
      const bookmarkCaption = block.bookmark.caption.length > 0
        ? richTextToMarkdown(block.bookmark.caption)
        : bookmarkUrl;
      return `${indent}[${bookmarkCaption}](${bookmarkUrl})`;

    case "equation":
      return `${indent}$${block.equation.expression}$`;

    case "table_of_contents":
      return `${indent}[[Table of Contents]]`;

    case "link_to_page":
      // Handle internal links
      return `${indent}[Internal Link](notion://${block.link_to_page.page_id || block.link_to_page.database_id})`;

    case "synced_block":
      // Synced blocks need special handling
      console.warn("Synced blocks are not fully supported yet");
      return "";

    case "table":
      // Table blocks are handled separately in convertBlocksToMarkdown
      return "";

    case "column_list":
      // Column lists are containers, their children will be processed
      return "";

    case "column":
      // Columns are containers, their children will be processed
      return "";

    default:
      console.warn(`Unsupported block type: ${type}`);
      return "";
  }
}

async function processTableBlock(tableBlock: BlockObjectResponse): Promise<string> {
  try {
    // Fetch table rows (children of the table block)
    const tableRows = await fetchAllBlocks(tableBlock.id);

    if (tableRows.length === 0) {
      return "<!-- Empty table -->";
    }

    const markdownRows: string[] = [];
    let hasHeader = false;

    // Check if first row looks like a header
    if (tableRows.length > 0 && tableRows[0].type === "table_row" && tableRows[0].table_row) {
      const firstRowCells = tableRows[0].table_row.cells || [];

      // Detect if the first row is a header based on:
      // 1. All cells have bold text
      // 2. Cells are relatively short (likely labels)
      // 3. Different formatting from second row
      hasHeader = firstRowCells.every(cell => {
        if (!cell || cell.length === 0) return false;
        const text = cell[0];
        // Check if text is bold or looks like a header
        return text.annotations?.bold ||
               (text.plain_text && text.plain_text.length <= 20 && !text.plain_text.includes('.'));
      });
    }

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      if (row.type === "table_row" && row.table_row) {
        const cells = row.table_row.cells || [];
        const cellContents = cells.map(cell =>
          richTextToMarkdown(cell).trim() || " "
        );

        // Create markdown table row
        markdownRows.push(`| ${cellContents.join(" | ")} |`);

        // ALWAYS add header separator after first row for GFM table compatibility
        // This is required for marked and other GFM parsers to recognize the table
        if (i === 0) {
          const separator = cellContents.map(() => "---").join(" | ");
          markdownRows.push(`| ${separator} |`);
        }
      }
    }

    if (markdownRows.length === 0) {
      return "<!-- Table with no rows -->";
    }

    return markdownRows.join("\n");
  } catch (error) {
    console.error(`Failed to process table block ${tableBlock.id}:`, error);
    return "<!-- Error processing table -->";
  }
}

function richTextToMarkdown(richTexts: RichTextItemResponse[]): string {
  // Group consecutive texts with same formatting
  const groups: Array<{texts: RichTextItemResponse[], annotations: any, href?: string}> = [];

  for (const text of richTexts) {
    const lastGroup = groups[groups.length - 1];
    const isSameFormat = lastGroup &&
      lastGroup.annotations.bold === text.annotations.bold &&
      lastGroup.annotations.italic === text.annotations.italic &&
      lastGroup.annotations.code === text.annotations.code &&
      lastGroup.annotations.strikethrough === text.annotations.strikethrough &&
      lastGroup.href === text.href;

    if (isSameFormat) {
      lastGroup.texts.push(text);
    } else {
      groups.push({
        texts: [text],
        annotations: text.annotations,
        href: text.href
      });
    }
  }

  // Convert each group to markdown
  return groups.map(group => {
    let result = group.texts.map(t => t.plain_text).join("");

    if (group.annotations.bold) result = `**${result}**`;
    if (group.annotations.italic) result = `*${result}*`;
    if (group.annotations.code) result = `\`${result}\``;
    if (group.annotations.strikethrough) result = `~~${result}~~`;

    if (group.href) result = `[${result}](${group.href})`;

    return result;
  }).join("");
}
