import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { SidebarCopyright } from "@/components/sidebar-copyright";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("SidebarCopyright", () => {
  test("renders correctly", () => {
    const props = { copyright: mocks.siteMetadata.site.siteMetadata.copyright };
    const tree = createSnapshotsRenderer(<SidebarCopyright {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with empty string", () => {
    const props = { copyright: "" };
    const tree = createSnapshotsRenderer(<SidebarCopyright {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
