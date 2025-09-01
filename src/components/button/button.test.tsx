import React from "react";
import { describe, test, expect } from "bun:test";
import { render as reactTestingLibraryRender } from "@testing-library/react";

import { Button } from "@/components/button/button";
import { createSnapshotsRenderer } from "@/utils/render-with-coil-provider";

describe("Button", () => {
  test("renders correctly", () => {
    const props = { title: "Button", to: "/" };
    const tree = createSnapshotsRenderer(<Button {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with external link", () => {
    const props = { title: "Button", to: "https://example.com" };
    const tree = createSnapshotsRenderer(<Button {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders correctly with custom class name", () => {
    const props = { title: "Button", to: "/", className: "custom-class-name" };
    const tree = createSnapshotsRenderer(<Button {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("the title is rendered correctly and exists", () => {
    const props = { title: "Text", to: "/" };
    const tree = reactTestingLibraryRender(<Button {...props} />);
    expect(tree.getByText(props.title)).toBeInTheDocument();
  });
});
