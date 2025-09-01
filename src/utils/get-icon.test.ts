import { describe, expect, test } from "bun:test";

import { icons } from "@/constants/icons";

import { getIcon } from "./get-icon";

describe("getIcon", () => {
  test("successful return icon", () => {
    expect(getIcon("x")).toBe(icons.x);
    expect(getIcon("rss")).toEqual(icons.rss);
    expect(getIcon("line")).toEqual(icons.line);
    expect(getIcon("github")).toBe(icons.github);
    expect(getIcon("email")).toEqual(icons.email);
    expect(getIcon("weibo")).toEqual(icons.weibo);
    expect(getIcon("gitlab")).toEqual(icons.gitlab);
    expect(getIcon("medium")).toEqual(icons.medium);
    expect(getIcon("codepen")).toEqual(icons.codepen);
    expect(getIcon("youtube")).toEqual(icons.youtube);
    expect(getIcon("mastodon")).toEqual(icons.mastodon);
    expect(getIcon("facebook")).toEqual(icons.facebook);
    expect(getIcon("telegram")).toEqual(icons.telegram);
    expect(getIcon("linkedin")).toEqual(icons.linkedin);
    expect(getIcon("instagram")).toEqual(icons.instagram);
    expect(getIcon("soundcloud")).toEqual(icons.soundcloud);
  });
});
