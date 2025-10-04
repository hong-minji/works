import { type CreatePagesArgs } from "gatsby";

interface CategoriesQueryResult {
  allNotionPost: {
    group: Array<{
      fieldValue: string;
      totalCount: number;
    }>;
  };
}

const categoriesQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<CategoriesQueryResult>(`
    {
      allNotionPost(
        filter: {
          template: { eq: "post" }, draft: { ne: true }
        }
        sort: { date: DESC }
      ) {
        group(field: { category: SELECT }) {
          fieldValue
          totalCount
        }
      }
    }
  `);

  return result?.data?.allNotionPost?.group ?? [];
};

export { categoriesQuery };
