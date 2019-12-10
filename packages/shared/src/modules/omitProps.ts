import { omit } from "lodash/fp";
import { mapProps } from "recompose";

export const omitProps = (keys: string[]) => mapProps<object, object>(props => omit(keys, props));
