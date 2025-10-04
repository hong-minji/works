import { type CreatePagesArgs } from "gatsby";

interface NotionPostsQueryResult {
  allNotionPost: {
    edges?: Array<{
      node: {
        slug: string;
        template?: string;
        fields?: {
          slug: string;
        };
      };
    }>;
  };
}

const notionPostsQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<NotionPostsQueryResult>(`
    {
      allNotionPost(
        filter: {
          draft: { ne: true }
        }
      ) {
        edges {
          node {
            slug
            template
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  return result?.data?.allNotionPost;
};

export { notionPostsQuery };