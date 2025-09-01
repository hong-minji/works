import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { SidebarMenu } from "@/components/sidebar-menu";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("SidebarMenu", () => {
  test("renders correctly", () => {
    const props = { menu: mocks.menu };
    const tree = createSnapshotsRenderer(<SidebarMenu {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
