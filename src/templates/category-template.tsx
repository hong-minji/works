import React, { type FC } from "react";

import { graphql } from "gatsby";

import { Feed } from "@/components/feed";
import { Meta } from "@/components/meta";
import { Page } from "@/components/page";
import { Layout } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
import { Pagination } from "@/components/pagination";
import { useSiteMetadata } from "@/hooks/use-site-metadata";
import type { PageContext } from "@/types/page-context";

interface CategoryTemplateProps {
  data: {
    allNotionPost: {
      edges: Array<{
        node: {
          fields: {
            categorySlug: string;
            slug: string;
          };
          slug: string;
          title: string;
          date: string;
          description: string;
          category: string;
        };
      }>;
    };
  };
  pageContext: PageContext;
}

const CategoryTemplate: FC<CategoryTemplateProps> = ({ data, pageContext }) => {
  const { group, pagination } = pageContext;
  const { prevPagePath, nextPagePath, hasPrevPage, hasNextPage } = pagination;

  // Transform NotionPost data to match Feed component format
  const edges = data.allNotionPost.edges.map(edge => ({
    node: {
      fields: {
        categorySlug: edge.node.fields?.categorySlug || '/category/uncategorized',
        slug: edge.node.fields?.slug || edge.node.slug
      },
      frontmatter: {
        title: edge.node.title,
        date: edge.node.date,
        description: edge.node.description,
        category: edge.node.category,
        slug: edge.node.slug
      }
    }
  }));

  return (
    <Layout>
      <Sidebar />
      <Page title={group}>
        <Feed edges={edges} />
        <Pagination
          prevPagePath={prevPagePath}
          nextPagePath={nextPagePath}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
        />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query CategoryTemplate($group: String, $limit: Int!, $offset: Int!) {
    allNotionPost(
      limit: $limit
      skip: $offset
      filter: {
        category: { eq: $group }
        template: { eq: "post" }
        draft: { ne: true }
      }
      sort: { date: DESC }
    ) {
      edges {
        node {
          fields {
            slug
            categorySlug
          }
          slug
          title
          date
          category
          description
        }
      }
    }
  }
`;

export const Head: FC<CategoryTemplateProps> = ({ pageContext }) => {
  const { title, description } = useSiteMetadata();

  const {
    group,
    pagination: { currentPage: page },
  } = pageContext;

  const pageTitle =
    page > 0 ? `${group} - Page ${page} - ${title}` : `${group} - ${title}`;

  return <Meta title={pageTitle} description={description} />;
};

export default CategoryTemplate;
