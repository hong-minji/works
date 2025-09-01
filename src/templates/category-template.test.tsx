import React from "react";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import { StaticQuery, useStaticQuery } from "gatsby";

import * as mocks from "@/mocks";
import { getMeta } from "@/utils/get-meta";
import { createSnapshotsRenderer, renderWithCoilProvider } from "@/utils/render-with-coil-provider";

import CategoryTemplate, { Head as GatsbyHead } from "./category-template";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("CategoryTemplate", () => {
  const props = {
    data: {
      allMarkdownRemark: mocks.allMarkdownRemark,
    },
    pageContext: mocks.pageContext,
  };

  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const tree = createSnapshotsRenderer(<CategoryTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("head renders correctly", () => {
    const { container } = renderWithCoilProvider(<GatsbyHead {...props} />);

    expect(getMeta(container, "twitter:card")).toEqual("summary_large_image");
    expect(getMeta(container, "og:title")).toEqual("Typography - Page 2 - Blog by John Doe");
    expect(getMeta(container, "twitter:title")).toEqual("Typography - Page 2 - Blog by John Doe");
    expect(getMeta(container, "twitter:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "og:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
  });
});
