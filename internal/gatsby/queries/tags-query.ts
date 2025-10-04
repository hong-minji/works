import { type CreatePagesArgs } from "gatsby";

interface TagsQueryResult {
  allNotionPost: {
    group: Array<{
      fieldValue: string;
      totalCount: number;
    }>;
  };
}

const tagsQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<TagsQueryResult>(`
    {
      allNotionPost(
        filter: {
          template: { eq: "post" }, draft: { ne: true }
        }
      ) {
        group(field: { tags: SELECT }) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  return result?.data?.allNotionPost?.group || [];
};

export { tagsQuery };
