import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { Pagination } from "@/components/pagination/pagination";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("Pagination", () => {
  test("renders correctly", () => {
    const props = { ...mocks.pageContext.pagination };
    const tree = createSnapshotsRenderer(<Pagination {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
