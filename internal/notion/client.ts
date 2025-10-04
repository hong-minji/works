import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error(
    "NOTION_API_KEY is required in environment variables. " +
    "Please create a .env.development file with your Notion integration token."
  );
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error(
    "NOTION_DATABASE_ID is required in environment variables. " +
    "Please add your Notion database ID to .env.development file."
  );
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const DATABASE_ID = process.env.NOTION_DATABASE_ID;
