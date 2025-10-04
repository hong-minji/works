import type { GatsbyNode } from "gatsby";

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type NotionPost implements Node {
      title: String!
      slug: String!
      date: Date! @dateformat
      category: String!
      tags: [String!]!
      description: String!
      content: String!
      socialImage: String
      notionId: String!
      createdTime: Date! @dateformat
      lastEditedTime: Date! @dateformat
      fields: NotionPostFields
    }

    type NotionPostFields {
      slug: String
      tagSlugs: [String]
    }
  `;

  createTypes(typeDefs);
};
