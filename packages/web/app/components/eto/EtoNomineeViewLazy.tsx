import * as React from "react";

import { lazyLoad } from "../../utils/lazyLoad";
import { TLinkedNomineeComponentProps } from "./EtoNomineeView";

const NomineeEtoView:React.LazyExoticComponent<React.ComponentType<TLinkedNomineeComponentProps>> =
  React.lazy(
  () => import('./EtoNomineeView')
    .then((exports) => ({ default: exports.EtoNomineeView }))
);

export const EtoNomineeViewLazy = lazyLoad(NomineeEtoView);
