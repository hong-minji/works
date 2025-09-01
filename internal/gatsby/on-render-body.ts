import React from "react";

import { type RenderBodyArgs } from "gatsby";

import { themeAtomKey } from "../../src/hooks/use-theme";

const onRenderBody = ({ setHtmlAttributes, setPreBodyComponents }: RenderBodyArgs) => {
  setPreBodyComponents([
    React.createElement("script", {
      key: "inline",
      dangerouslySetInnerHTML: {
        __html: `
          void function() {
            var cachedMode;

            try {
              var preferredTheme = JSON.parse(localStorage.getItem("${themeAtomKey}"));

              if (preferredTheme && preferredTheme.mode) {
                cachedMode = preferredTheme.mode;
              }
            } catch (err) { }

            function setTheme(newTheme) {
              document.documentElement.className = newTheme;
            }

            var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

            setTheme(cachedMode || (darkQuery.matches ? "dark" : "light"));
          }()
        `,
      },
    }),
  ]);

  setHtmlAttributes({ lang: "en" });
};

export { onRenderBody };
