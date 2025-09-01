import React from "react";
import { test, describe, expect } from "bun:test";

import { Meta } from "@/components/meta";
import { getMeta } from "@/utils/get-meta";
import { renderWithCoilProvider } from "@/utils/render-with-coil-provider";

describe("Meta", () => {
  test("should contain correct metadata", async () => {
    const { container } = renderWithCoilProvider(
      <Meta description="description" title="title" image="image" />,
    );

    expect(getMeta(container, "description")).toEqual("description");
    expect(getMeta(container, "twitter:description")).toEqual("description");
    expect(getMeta(container, "twitter:title")).toEqual("title");
    expect(getMeta(container, "og:title")).toEqual("title");
    expect(getMeta(container, "og:description")).toEqual("description");
    expect(getMeta(container, "og:image")).toEqual("image");
  });
});
