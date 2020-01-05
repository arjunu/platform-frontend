import { mapValues } from "lodash";
import { fromRenderProps } from "recompose";

import { Values } from "../../../types";
import { ContainerContext, TContainerContext } from "../../../utils/InversifyProvider";

/**
 * Injects into a component dependencies from DI container (inversify container)
 */
// here we need to have `any` as we don't know the types
// tslint:disable-next-line:no-any-on-steroid
const withDependencies = <T extends Record<string, any>>(obj: Record<keyof T, symbol>) =>
  fromRenderProps<T, {}, NonNullable<TContainerContext>>(
    ContainerContext.Consumer,
    // typings for `mapValues` are not correct so need to force cast as any
    // tslint:disable-next-line:no-any-on-steroid
    container => mapValues(obj, value => container && container.get<Values<T>>(value)) as any,
  );

export { withDependencies };
