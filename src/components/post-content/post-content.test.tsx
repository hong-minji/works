import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { PostContent } from "@/components/post-content";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("PostContent", () => {
  test("renders correctly", () => {
    const props = {
      title: mocks.markdownRemark.frontmatter.title,
      body: mocks.markdownRemark.html,
    };

    const tree = createSnapshotsRenderer(<PostContent {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
