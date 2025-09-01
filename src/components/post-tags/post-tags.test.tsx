import React from "react";
import { test, describe, expect } from "bun:test";
import { render as reactTestingLibraryRender } from "@testing-library/react";

import * as mocks from "@/mocks";
import { PostTags } from "@/components/post-tags";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("PostTags", () => {
  test("renders correctly", () => {
    const props = {
      tags: mocks.markdownRemark.frontmatter.tags,
      tagSlugs: mocks.markdownRemark.fields.tagsSlugs,
    };

    const tree = createSnapshotsRenderer(<PostTags {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("buttons is rendered correctly and exists", () => {
    const props = {
      tags: mocks.markdownRemark.frontmatter.tags,
      tagSlugs: mocks.markdownRemark.fields.tagsSlugs,
    };

    const tree = reactTestingLibraryRender(<PostTags {...props} />);

    props.tags.forEach((tag) => {
      expect(tree.getByText(tag)).toBeInTheDocument();
    });
  });
});
