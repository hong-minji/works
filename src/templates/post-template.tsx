import React, { type FC } from "react";

import { graphql } from "gatsby";
import { marked } from "marked";

import { type Node } from "@/types/node";
import { Meta } from "@/components/meta";
import { Post } from "@/components/post";
import { Layout } from "@/components/layout";
import { useSiteMetadata } from "@/hooks/use-site-metadata";

// Configure marked to support GitHub Flavored Markdown tables
marked.setOptions({
  gfm: true, // Enable GitHub Flavored Markdown
  breaks: true, // Enable line breaks
});

interface NotionPostNode {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  description: string;
  content: string;
  category: string;
  socialImage?: string;
  fields?: {
    slug: string;
    tagSlugs: string[];
  };
}

interface PostTemplateProps {
  data: {
    markdownRemark?: Node;
    notionPost?: NotionPostNode;
  };
}

const PostTemplate: FC<PostTemplateProps> = ({ data }) => {
  const { markdownRemark, notionPost } = data;

  if (notionPost) {
    // Debug: Log the raw markdown content
    console.log('Raw markdown content:', notionPost.content);

    // Convert markdown content to HTML (marked supports GFM tables by default)
    const htmlContent = marked(notionPost.content || '');

    // Debug: Log the converted HTML
    console.log('Converted HTML content:', htmlContent);

    // Debug: Check if tables are present
    if (htmlContent.includes('<table>')) {
      console.log('✅ Tables found in HTML');
    } else {
      console.log('❌ No tables found in HTML');
    }

    const adaptedPost = {
      id: notionPost.id,
      html: htmlContent,
      fields: notionPost.fields || {
        slug: notionPost.slug,
        tagSlugs: [],
      },
      frontmatter: {
        title: notionPost.title,
        date: notionPost.date,
        tags: notionPost.tags,
        description: notionPost.description,
        socialImage: notionPost.socialImage ? { publicURL: notionPost.socialImage } : undefined,
      },
    };

    return (
      <Layout>
        <Post post={adaptedPost as any} />
      </Layout>
    );
  }

  if (markdownRemark) {
    return (
      <Layout>
        <Post post={markdownRemark} />
      </Layout>
    );
  }

  return null;
};

export const query = graphql`
  query PostTemplate($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        slug
        tagSlugs
      }
      frontmatter {
        date
        tags
        title
        description
        socialImage {
          publicURL
        }
      }
    }
    notionPost(slug: { eq: $slug }) {
      id
      title
      slug
      date
      tags
      description
      content
      category
      socialImage
      fields {
        slug
        tagSlugs
      }
    }
  }
`;

export const Head: FC<PostTemplateProps> = ({ data }) => {
  const { title, description, url } = useSiteMetadata();
  const { markdownRemark, notionPost } = data;

  const postData = notionPost || markdownRemark;

  if (!postData) return null;

  const postTitle = notionPost
    ? notionPost.title
    : markdownRemark?.frontmatter?.title || "";

  const postDescription = notionPost
    ? notionPost.description
    : markdownRemark?.frontmatter?.description || description || "";

  const socialImage = notionPost
    ? notionPost.socialImage
    : markdownRemark?.frontmatter?.socialImage?.publicURL;

  const image = socialImage && url.concat(socialImage);

  return (
    <Meta
      title={`${postTitle} - ${title}`}
      description={postDescription}
      image={image}
    />
  );
};

export default PostTemplate;
