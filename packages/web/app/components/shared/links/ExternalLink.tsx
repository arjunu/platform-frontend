import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../../types";

type TProps = Omit<
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "target" | "rel"
>;

/**
 * Generate anchor tag with target="_blank" and correct rel value to prevent tabnabbing
 * See https://www.owasp.org/index.php/Reverse_Tabnabbing
 * @note If it's a cypress run (NF_CYPRESS_RUN flag set) then links are opened in the same tab
 */
const ExternalLink: React.FunctionComponent<TProps & TDataTestId> = ({
  href,
  children,
  "data-test-id": dataTestId,
  ...rest
}) => (
  <a
    href={href}
    target={process.env.NF_CYPRESS_RUN === "1" ? undefined : "_blank"}
    rel="noopener noreferrer"
    data-test-id={`${dataTestId} shared.links.external-link`}
    {...rest}
  >
    {children || href}
    {/* Hide accessibility improvement on e2e tests as often we get text content of anchor to compare to some pattern */}
    {process.env.NF_CYPRESS_RUN !== "1" && (
      <span className="sr-only">
        (<FormattedMessage id="links.external-link.opens-in-new-window" />)
      </span>
    )}
  </a>
);

export { ExternalLink };
