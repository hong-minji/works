import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { Page } from "@/components/page/page";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("Page", () => {
  test("renders correctly", () => {
    const props = {
      children: mocks.markdownRemark.html,
      title: mocks.markdownRemark.frontmatter.title,
    };

    const tree = createSnapshotsRenderer(<Page {...props}>{props.children}</Page>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
