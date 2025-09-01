import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { SidebarContacts } from "@/components/sidebar-contacts";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("SidebarContacts", () => {
  test("renders null on empty contacts", () => {
    const props = { contacts: [] };
    const tree = createSnapshotsRenderer(<SidebarContacts {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders a list of non-empty contacts", () => {
    const props = { contacts: mocks.contacts };
    const tree = createSnapshotsRenderer(<SidebarContacts {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
