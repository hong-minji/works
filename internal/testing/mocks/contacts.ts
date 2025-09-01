import { icons } from "@/constants/icons";

export default [
  {
    name: "rss",
    contact: "#",
  },
  {
    name: "email",
    contact: "#",
  },
  {
    name: "github",
    contact: "#",
  },
  {
    name: "x",
    contact: "#",
  },
  {
    name: "telegram",
    contact: "#",
  },
] as {
  name: keyof typeof icons;
  contact: string;
}[];
