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
    notionPost?: NotionPostNode;
  };
}

const PostTemplate: FC<PostTemplateProps> = ({ data }) => {
  const { notionPost } = data;

  if (!notionPost) {
    return null;
  }

  // Convert markdown content to HTML (marked supports GFM tables by default)
  const htmlContent = marked(notionPost.content || '');

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
};

export const query = graphql`
  query PostTemplate($slug: String!) {
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
  const { notionPost } = data;

  if (!notionPost) return null;

  const postTitle = notionPost.title;
  const postDescription = notionPost.description || description || "";
  const image = notionPost.socialImage && url.concat(notionPost.socialImage);

  return (
    <Meta
      title={`${postTitle} - ${title}`}
      description={postDescription}
      image={image}
    />
  );
};

export default PostTemplate;
