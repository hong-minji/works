import { notion, DATABASE_ID } from "./client";
import { retryWithBackoff } from "./utils";
import type {
  QueryDatabaseResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export async function fetchNotionPages(): Promise<PageObjectResponse[]> {
  try {
    // Use retry logic for API calls
    const response = await retryWithBackoff(async () => {
      const result: QueryDatabaseResponse = await notion.databases.query({
        database_id: DATABASE_ID,
        filter: {
          property: "Draft",
          checkbox: {
            equals: false,
          },
        },
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
      });
      return result;
    });

    const pages = response.results.filter(
      (page): page is PageObjectResponse => "properties" in page
    );

    console.log(`✅ Successfully fetched ${pages.length} pages from Notion`);
    return pages;
  } catch (error) {
    console.error("❌ Failed to fetch Notion pages after retries:", error);

    // Provide more detailed error information
    if ((error as any)?.code === 'unauthorized') {
      throw new Error('Notion API authentication failed. Please check your NOTION_API_KEY.');
    }
    if ((error as any)?.code === 'object_not_found') {
      throw new Error('Notion database not found. Please check your NOTION_DATABASE_ID and ensure the integration has access to it.');
    }
    if ((error as any)?.code === 'rate_limited') {
      throw new Error('Notion API rate limit exceeded. Please try again later.');
    }

    throw error;
  }
}
