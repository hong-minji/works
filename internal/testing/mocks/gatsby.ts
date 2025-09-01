import { mock } from "bun:test";
import * as gatsby from "gatsby";

export default {
  ...gatsby,
  graphql: mock(),
  StaticQuery: mock(),
  useStaticQuery: mock(),
};
