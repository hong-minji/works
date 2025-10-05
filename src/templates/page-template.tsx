import React, { type FC } from "react";
import { graphql } from "gatsby";
import { marked } from "marked";

import { Meta } from "@/components/meta";
import { Page } from "@/components/page";
import { Layout } from "@/components/layout";
import { Sidebar } from "@/components/sidebar";
import { useSiteMetadata } from "@/hooks/use-site-metadata";

// Configure marked to support GitHub Flavored Markdown
marked.setOptions({
  gfm: true, // Enable GitHub Flavored Markdown
  breaks: true, // Enable line breaks
});

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

  const { content, title } = post;

  // Convert markdown content to HTML
  const htmlContent = marked(content || '');

  return (
    <Layout>
      <Sidebar />
      <Page title={title}>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
