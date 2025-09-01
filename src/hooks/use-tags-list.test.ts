import { describe, expect, test, beforeEach, mock } from "bun:test";
import { renderHook } from "@testing-library/react";
import { StaticQuery, useStaticQuery } from "gatsby";

import * as mocks from "@/mocks";
import { useTagsList } from "@/hooks/use-tags-list";

const mockedUseStaticQuery = useStaticQuery as ReturnType<typeof mock>;
const mockedStaticQuery = StaticQuery as unknown as ReturnType<typeof mock>;

describe("useTagsList", () => {
  beforeEach(() => {
    const props = {
      ...mocks.siteMetadata,
      allMarkdownRemark: mocks.allMarkdownRemark,
    };

    mockedStaticQuery.mockImplementationOnce(({ render }) => render(props));
    mockedUseStaticQuery.mockReturnValue(props);
  });

  test("should return an array of tags", () => {
    const { result } = renderHook(() => useTagsList());
    expect(result.current).toEqual([
      { fieldValue: "typography", totalCount: 1 },
      { fieldValue: "design inspiration", totalCount: 1 },
    ]);
  });

  test("should return an empty array if no tags are found", () => {
    const props = {
      ...mocks.siteMetadata,
      allMarkdownRemark: {
        ...mocks.allMarkdownRemark,
        group: [],
      },
    };

    mockedStaticQuery.mockImplementationOnce(({ render }) => render(props));
    mockedUseStaticQuery.mockReturnValue(props);

    const { result } = renderHook(() => useTagsList());
    expect(result.current).toEqual([]);
  });
});
