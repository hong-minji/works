import { describe, expect, test, beforeEach, mock } from "bun:test";
import { renderHook } from "@testing-library/react";
import { StaticQuery, useStaticQuery } from "gatsby";

import * as mocks from "@/mocks";
import { useSiteMetadata } from "@/hooks/use-site-metadata";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("useSiteMetadata", () => {
  beforeEach(() => {
    mockedStaticQuery.mockImplementationOnce(({ render }) =>
      render(mocks.siteMetadata),
    );
    mockedUseStaticQuery.mockReturnValue(mocks.siteMetadata);
  });

  test("should return site metadata", () => {
    const { result } = renderHook(() => useSiteMetadata());
    expect(result.current).toEqual({
      ...mocks.siteMetadata.site.siteMetadata,
    });
  });

  test("should return an empty object if no site metadata is found", () => {
    const props = {
      ...mocks.siteMetadata,
      site: {
        ...mocks.siteMetadata.site,
        siteMetadata: {},
      },
    };

    mockedStaticQuery.mockImplementationOnce(({ render }) => render(props));
    mockedUseStaticQuery.mockReturnValue(props);

    const { result } = renderHook(() => useSiteMetadata());
    expect(result.current as {}).toEqual({});
  });
});
