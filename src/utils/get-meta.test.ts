import { describe, expect, test, spyOn, mock } from "bun:test";

import { getMeta } from "./get-meta";

describe("getMeta", () => {
  test("successful getting value by key", () => {
    const getElementsByTagNameSpy = spyOn(document.head, "getElementsByTagName");

    const title = {
      name: "title",
      content: "any title",
    };

    const description = {
      name: "description",
      content: "any description",
    };

    getElementsByTagNameSpy.mockReturnValue([
      { getAttribute: mock((key: keyof typeof title) => title[key]) },
      { getAttribute: mock((key: keyof typeof description) => description[key]) },
    ] as unknown as HTMLCollectionOf<HTMLElement>);

    expect(getMeta(document.head, "title")).toBe("any title");
    expect(getMeta(document.head, "description")).toBe("any description");
    expect(getMeta(document.head, "og:image")).toBe("");
  });
});
