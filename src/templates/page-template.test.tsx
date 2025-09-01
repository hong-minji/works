import React from "react";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import { StaticQuery, useStaticQuery } from "gatsby";

import * as mocks from "@/mocks";
import { getMeta } from "@/utils/get-meta";
import { createSnapshotsRenderer, renderWithCoilProvider } from "@/utils/render-with-coil-provider";

import PageTemplate, { Head as GatsbyHead } from "./page-template";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("PageTemplate", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("renders correctly", () => {
    const props = {
      data: {
        markdownRemark: mocks.markdownRemark,
      },
    };

    const tree = createSnapshotsRenderer(<PageTemplate {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("head renders correctly", () => {
    const props = {
      data: {
        markdownRemark: mocks.markdownRemarkWithoutDescription,
      },
    };

    const { container } = renderWithCoilProvider(<GatsbyHead {...props} />);

    expect(getMeta(container, "twitter:card")).toEqual("summary_large_image");
    expect(getMeta(container, "twitter:title")).toEqual("Humane Typography in the Digital Age - Blog by John Doe");
    expect(getMeta(container, "og:title")).toEqual("Humane Typography in the Digital Age - Blog by John Doe");
    expect(getMeta(container, "twitter:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "og:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
  });
});
