import React, { type ReactElement } from "react";

import { CoilProvider } from "@alxshelepenok/diesel";
import { type WrapRootElementBrowserArgs } from "gatsby";

const wrapRootElement = ({ element }: WrapRootElementBrowserArgs): ReactElement => (
  <CoilProvider>{element}</CoilProvider>
);

export { wrapRootElement };
