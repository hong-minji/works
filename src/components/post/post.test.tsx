import React from "react";
import { StaticQuery, useStaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import * as mocks from "@/mocks";
import { Post } from "@/components/post";
import { createSnapshotsRenderer, renderWithCoilProvider } from "@/utils/render-with-coil-provider";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("Post", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) => render(mocks.siteMetadata));
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const props = { post: mocks.markdownRemark };
    const tree = createSnapshotsRenderer(<Post {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("buttons is rendered correctly and exists", () => {
    const props = { post: mocks.markdownRemark };
    const el = renderWithCoilProvider(<Post {...props} />);
    expect(el.getByText("All Articles")).toBeInTheDocument();
  });
});
