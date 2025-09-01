import { icons } from "@/constants/icons";

const getIcon = (name: keyof typeof icons) => icons[name] || {};

export { getIcon };
