import React, { type FC } from "react";
import { graphql } from "gatsby";

import { Meta } from "@/components/meta";
import { Page } from "@/components/page";
import { Layout } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
import { useSiteMetadata } from "@/hooks/use-site-metadata";

interface PageTemplateProps {
  data: {
    notionPost?: {
      id: string;
      title: string;
      content: string;
      description?: string;
      date?: string;
    };
  };
}

const PageTemplate: FC<PageTemplateProps> = ({ data }) => {
  const post = data.notionPost;

  if (!post) {
    return (
      <Layout>
        <Sidebar />
        <Page title="Page Not Found">
          <div>This page could not be found.</div>
        </Page>
      </Layout>
    );
  }

  const { content: body, title } = post;

  return (
    <Layout>
      <Sidebar />
      <Page title={title}>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query PageTemplate($slug: String!) {
    notionPost(slug: { eq: $slug }) {
      id
      title
      content
      description
      date
    }
  }
`;

export const Head: FC<PageTemplateProps> = ({ data }) => {
  const { title, description, url } = useSiteMetadata();

  const post = data.notionPost;

  if (!post) {
    return <Meta title={`Page Not Found - ${title}`} description={description || ""} />;
  }

  const pageTitle = post.title;
  const pageDescription = post.description || description || "";

  return (
    <Meta
      title={`${pageTitle} - ${title}`}
      description={pageDescription}
    />
  );
};

export default PageTemplate;
