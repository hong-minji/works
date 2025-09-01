import { describe, expect, test, spyOn } from "bun:test";

import { getDefaultColorMode } from "./get-default-color-mode";

describe("getDefaultColorMode", () => {
  test("successful return color mode", () => {
    expect(getDefaultColorMode()).toBe("light");
    const matchMediaSpy = spyOn(window, "matchMedia");
    matchMediaSpy.mockReturnValue({ matches: true } as MediaQueryList);
    expect(getDefaultColorMode()).toBe("dark");
    matchMediaSpy.mockReturnValue({} as MediaQueryList);
    expect(getDefaultColorMode()).toBe("light");
    matchMediaSpy.mockRestore();
  });

  test("successful return default color mode on ssr", () => {
    const matchMediaSpy = spyOn(window, "matchMedia");
    matchMediaSpy.mockReturnValue({ matches: true } as MediaQueryList);

    const windowSpy: ReturnType<typeof spyOn> = spyOn(global, "window");
    windowSpy.mockReturnValue(undefined);
    expect(window).toBeUndefined();

    expect(getDefaultColorMode()).toBe("light");
    windowSpy.mockRestore();

    expect(getDefaultColorMode()).toBe("dark");
    matchMediaSpy.mockRestore();
  });
});
