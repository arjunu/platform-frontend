import * as React from "react";
import { ComponentEnhancer, nest } from "recompose";

export function withContainer<T>(Layout: React.ComponentType<T>): ComponentEnhancer<T, T> {
  return WrapperComponent => nest(Layout, WrapperComponent);
}
