import React from "react";
import { test, describe, expect } from "bun:test";
import { fireEvent } from "@testing-library/dom";

import { ThemeSwitcher } from "@/components/theme-switcher/theme-switcher";
import { createSnapshotsRenderer, renderWithCoilProvider } from "@/utils/render-with-coil-provider";

describe("ThemeSwitcher", () => {
  test("renders correctly", () => {
    const tree = createSnapshotsRenderer(<ThemeSwitcher />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("dark theme is set correctly", () => {
    window.localStorage.setItem(
      "diesel:theme-atom",
      JSON.stringify({ mode: "dark" }),
    );

    const { getByTitle } = renderWithCoilProvider(<ThemeSwitcher />);

    window.localStorage.removeItem("diesel:theme-atom");

    expect(getByTitle("dark")).not.toBeNull();
  });

  test("light theme is set correctly", () => {
    const { getByTitle } = renderWithCoilProvider(<ThemeSwitcher />);

    expect(getByTitle("light")).not.toBeNull();
  });

  test("theme switching works correctly", () => {
    const { getByTitle, getByRole } = renderWithCoilProvider(<ThemeSwitcher />);

    expect(getByTitle("light")).not.toBeNull();

    const button = getByRole("button");

    fireEvent.click(button);

    expect(getByTitle("dark")).not.toBeNull();
  });
});
