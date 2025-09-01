import React from "react";
import { test, describe, expect } from "bun:test";

import { Icon } from "@/components/icon/icon";
import { icons } from "@/constants/icons";
import { getIcon } from "@/utils/get-icon";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("Icon", () => {
  test("renders correctly", () => {
    const [x] = Object.keys(icons) as Array<keyof typeof icons>;
    const props = { name: x, icon: getIcon(x) };
    const tree = createSnapshotsRenderer(<Icon {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom size", () => {
    const [x] = Object.keys(icons) as Array<keyof typeof icons>;
    const props = { name: x, icon: getIcon(x), size: 32 };
    const tree = createSnapshotsRenderer(<Icon {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom color", () => {
    const [x] = Object.keys(icons) as Array<keyof typeof icons>;
    const props = { name: x, icon: getIcon(x), color: "red" };
    const tree = createSnapshotsRenderer(<Icon {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom size and color", () => {
    const [x] = Object.keys(icons) as Array<keyof typeof icons>;
    const props = {
      name: x,
      icon: getIcon(x),
      size: 32,
      color: "red",
    };
    const tree = createSnapshotsRenderer(<Icon {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
