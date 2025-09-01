import { type Fields } from "./fields";
import { type Frontmatter } from "./frontmatter";

interface Node {
  id: string;
  html: string;
  fields: Fields;
  frontmatter: Frontmatter;
}

export { type Node };
