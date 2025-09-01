import React from "react";
import { StaticQuery, useStaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import * as mocks from "@/mocks";
import { PostAuthor } from "@/components/post-author";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("PostAuthor", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );

    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const tree = createSnapshotsRenderer(<PostAuthor />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
