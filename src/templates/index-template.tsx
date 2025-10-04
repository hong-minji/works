import React, { type FC } from "react";

import { graphql } from "gatsby";

import { Feed } from "@/components/feed";
import { Meta } from "@/components/meta";
import { Page } from "@/components/page";
import { Layout } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
import { Pagination } from "@/components/pagination";
import { useSiteMetadata } from "@/hooks/use-site-metadata";
import type { AllMarkdownRemark } from "@/types/all-markdown-remark";
import type { PageContext } from "@/types/page-context";

interface IndexTemplateProps {
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

const IndexTemplate: FC<IndexTemplateProps> = ({ data, pageContext }) => {
  const { pagination } = pageContext;
  const { hasNextPage, hasPrevPage, prevPagePath, nextPagePath } = pagination;

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
      <Sidebar isHome />
      <Page>
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
  query IndexTemplate($limit: Int!, $offset: Int!) {
    allNotionPost(
      limit: $limit
      skip: $offset
      sort: { date: DESC }
      filter: { template: { eq: "post" }, draft: { ne: true } }
    ) {
      edges {
        node {
          fields {
            categorySlug
            slug
          }
          slug
          title
          date
          description
          category
          template
        }
      }
    }
  }
`;

export const Head: FC<IndexTemplateProps> = ({ pageContext }) => {
  const { title, description } = useSiteMetadata();
  const {
    pagination: { currentPage: page },
  } = pageContext;
  const pageTitle = page > 0 ? `Posts - Page ${page} - ${title}` : title;

  return <Meta title={pageTitle} description={description} />;
};

export default IndexTemplate;
