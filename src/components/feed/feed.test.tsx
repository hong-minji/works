import React from "react";
import { test, describe, expect } from "bun:test";

import * as mocks from "@/mocks";
import { Feed } from "@/components/feed";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("Feed", () => {
  test("renders correctly", () => {
    expect(createSnapshotsRenderer(<Feed edges={mocks.edges} />).toJSON()).toMatchSnapshot();
  });
});
