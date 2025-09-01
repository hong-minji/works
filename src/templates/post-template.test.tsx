import React from "react";
import { StaticQuery, useStaticQuery } from "gatsby";
import { test, describe, expect, beforeEach, mock } from "bun:test";

import * as mocks from "@/mocks";
import { getMeta } from "@/utils/get-meta";
import { createSnapshotsRenderer, renderWithCoilProvider } from "@/utils/render-with-coil-provider";

import PostTemplate, { Head as GatsbyHead } from "./post-template";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("PostTemplate", () => {
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

    const tree = createSnapshotsRenderer(<PostTemplate {...props} />).toJSON();
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
    expect(getMeta(container, "description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "twitter:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
    expect(getMeta(container, "og:description")).toEqual("Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam. Sed arcu.");
  });
});
