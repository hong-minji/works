import { type Edge } from "./edge";

interface AllMarkdownRemark {
  edges: Array<Edge>;
  group: Array<{
    fieldValue: string;
    totalCount: number;
  }>;
}

export { type AllMarkdownRemark };
