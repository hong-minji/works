import { type CreatePagesArgs } from "gatsby";

import { type Edge } from "../../../src/types/edge";

interface PostsQueryResult {
  allMarkdownRemark: {
    edges?: Array<Edge>;
  };
}

const postsQuery = async (graphql: CreatePagesArgs["graphql"]) => {
  const result = await graphql<PostsQueryResult>(`
    {
      allMarkdownRemark(
        filter: {
          frontmatter: { draft: { ne: true }, template: { eq: "post" } }
        }
      ) {
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

  return result?.data?.allMarkdownRemark;
};

export { postsQuery };
