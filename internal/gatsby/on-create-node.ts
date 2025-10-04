import { type Node, type GatsbyNode } from "gatsby";
import { createFilePath } from "gatsby-source-filesystem";

import { routes } from "./constants/routes";
import { concat } from  "../../src/utils/concat";
import { type Edge } from "../../src/types/edge";
import { toKebabCase } from "../../src/utils/to-kebab-case";

const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Handle MarkdownRemark nodes
  if (node.internal.type === "MarkdownRemark") {
    const { frontmatter, parent } = node as Node & Edge["node"];
    const { tags, category, slug } = frontmatter || {};

    if (slug) {
      const dirname = parent && getNode(parent)?.relativeDirectory;
      const value = typeof dirname === "string" ? concat("/", dirname, "/", slug) : concat("/", slug);

      createNodeField({ node, name: "slug", value });
    } else {
      const value = createFilePath({ node, getNode });
      createNodeField({ node, name: "slug", value });
    }

    if (tags) {
      const value = tags.map((tag) => concat(routes.tagRoute, "/", toKebabCase(tag), "/"));

      createNodeField({ node, name: "tagSlugs", value });
    }

    if (category) {
      const value = concat(routes.categoryRoute, "/", toKebabCase(category));

      createNodeField({ node, name: "categorySlug", value });
    }
  }

  // Handle NotionPost nodes
  if (node.internal.type === "NotionPost") {
    const notionNode = node as any;
    const { tags, category, slug } = notionNode;

    if (slug) {
      createNodeField({ node, name: "slug", value: concat("/", slug) });
    }

    if (tags && tags.length > 0) {
      const value = tags.map((tag: string) => concat(routes.tagRoute, "/", toKebabCase(tag), "/"));
      createNodeField({ node, name: "tagSlugs", value });
    }

    if (category) {
      const value = concat(routes.categoryRoute, "/", toKebabCase(category));
      createNodeField({ node, name: "categorySlug", value });
    }
  }
};

export { onCreateNode };
