import { type CreatePagesArgs } from "gatsby";

import { type Edge } from "../../../src/types/edge";

interface PagesQueryResult {
  allMarkdownRemark: {
    edges?: Array<Edge>;
  };
}

const pagesQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<PagesQueryResult>(`
    {
      allMarkdownRemark(filter: { frontmatter: { draft: { ne: true } } }) {
        edges {
          node {
            frontmatter {
              template
              slug
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  return result?.data?.allMarkdownRemark?.edges ?? [];
};

export { pagesQuery };
