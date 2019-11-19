import * as React from "react";

import { lazyLoad } from "../../../utils/lazyLoad";

const NomineeDocuments:React.LazyExoticComponent<React.ComponentType> = React.lazy(
  () => import('./NomineeDocuments')
    .then((exports) => ({ default: exports.NomineeDocuments }))
);

export const NomineeDocumentsLazy = lazyLoad(NomineeDocuments);
