import React from "react";
import { test, describe, expect } from "bun:test";

import { Layout } from "@/components/layout";
import { createSnapshotsRenderer, renderWithCoilProvider } from "@/utils/render-with-coil-provider";

describe("Layout", () => {
  const LayoutWithChildren = () => <Layout>test</Layout>;

  test("renders correctly", () => {
    const tree = createSnapshotsRenderer(<LayoutWithChildren />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("dark theme is set correctly", () => {
    window.localStorage.setItem(
      "diesel:theme-atom",
      JSON.stringify({ mode: "dark" }),
    );

    renderWithCoilProvider(<LayoutWithChildren />);

    window.localStorage.removeItem("diesel:theme-atom");

    expect(document.documentElement.className).toBe("dark");
  });

  test("light theme is set correctly", () => {
    renderWithCoilProvider(<LayoutWithChildren />);

    expect(document.documentElement.className).toBe("light");
  });
});
