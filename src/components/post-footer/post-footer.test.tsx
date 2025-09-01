import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { PostFooter } from "@/components/post-footer";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("PostFooter", () => {
  test("renders correctly", () => {
    const props = { date: mocks.markdownRemark.frontmatter.date };
    const tree = createSnapshotsRenderer(<PostFooter {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
