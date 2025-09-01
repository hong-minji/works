import React from "react";
import { StaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import * as mocks from "@/mocks";
import { SidebarAuthor } from "@/components/sidebar-author";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

const mockedStaticQuery = mock((props) => <StaticQuery {...props} />);

describe("SidebarAuthor", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(() => <></>);
  });

  test("renders correctly", () => {
    const props = { isHome: false, author: mocks.author };
    const tree = createSnapshotsRenderer(<SidebarAuthor {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
