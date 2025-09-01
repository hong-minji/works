import React from "react";
import { StaticQuery, useStaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import * as mocks from "@/mocks";
import { Sidebar } from "@/components/sidebar";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("Sidebar", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const props = { isHome: true };
    const tree = createSnapshotsRenderer(<Sidebar {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
