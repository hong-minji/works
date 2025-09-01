import React, { type ReactElement, type ReactNode, type FC } from "react";
import { CoilProvider } from "@alxshelepenok/diesel";
import { render, type RenderOptions } from "@testing-library/react";
import renderer, { type ReactTestRenderer, type TestRendererOptions } from "react-test-renderer";

interface WithCoilProviderProps {
  children: ReactNode;
}

const WithCoilProvider: FC<WithCoilProviderProps> = ({ children }) => (
  <CoilProvider>{children}</CoilProvider>
);

const renderWithCoilProvider = (
  ui: ReactElement,
  options?: RenderOptions,
) => render(ui, { wrapper: WithCoilProvider, ...options });

export const createSnapshotsRenderer = (
  nextElement: ReactElement,
  options?: TestRendererOptions,
): ReactTestRenderer =>
  renderer.create(<CoilProvider>{nextElement}</CoilProvider>, options);

export { renderWithCoilProvider };
