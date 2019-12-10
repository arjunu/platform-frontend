import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { EEtoDocumentType, IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { EOfferingDocumentType } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { actions } from "../../../../modules/actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../../modules/eto/types";
import { appConnect } from "../../../../store";
import { assertNever } from "@neufund/shared";
import { etherscanAddressLink, etoPublicViewLink } from "../../../appRouteUtils";
import { TagWithFallback } from "../../../shared/Tag";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
  isEmbedded: boolean;
  innerClass?: string;
}

interface IWithProps {
  termSheet: IEtoDocument;
  prospectusApproved: IEtoDocument;
  smartContractOnChain: boolean;
}

interface IDispatchProps {
  downloadDocument: (document: IEtoDocument) => void;
}

const hasDocument = (document: IEtoDocument): boolean =>
  Boolean(document && document.name && document.name.length);

const getApprovedDocumentTitle = (offeringDocumentType: EOfferingDocumentType) => {
  switch (offeringDocumentType) {
    case EOfferingDocumentType.PROSPECTUS:
      return <FormattedMessage id="shared-component.eto-overview.prospectus-approved" />;

    case EOfferingDocumentType.MEMORANDUM:
      return <FormattedMessage id="shared-component.eto-overview.investment-memorandum" />;

    default:
      return assertNever(offeringDocumentType);
  }
};

const TagsWidgetLayout: React.FunctionComponent<IWithProps & IExternalProps & IDispatchProps> = ({
  eto,
  termSheet,
  prospectusApproved,
  smartContractOnChain,
  downloadDocument,
  innerClass,
  isEmbedded,
}) => {
  const termsSheetTagCommonProps = {
    innerClass,
    condition: hasDocument(termSheet),
    textElement: <FormattedMessage id="shared-component.eto-overview.term-sheet" />,
    "data-test-id": "eto-overview-term-sheet-button",
  };

  const approvedDocumentTagCommonProps = {
    innerClass,
    condition: hasDocument(prospectusApproved),
    textElement: getApprovedDocumentTitle(eto.product.offeringDocumentType),
    "data-test-id": "eto-overview-prospectus-approved-button",
  };

  return (
    <div className={styles.tagsWrapper}>
      <TagWithFallback
        condition={!!eto.company.companyPitchdeckUrl}
        to={eto.company.companyPitchdeckUrl ? eto.company.companyPitchdeckUrl.url : ""}
        textElement={<FormattedMessage id="shared-component.eto-overview.pitch-deck" />}
        innerClass={innerClass}
        data-test-id="eto-overview-pitch-deck-button"
      />

      {isEmbedded ? (
        <TagWithFallback
          {...termsSheetTagCommonProps}
          to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
        />
      ) : (
        <TagWithFallback
          {...termsSheetTagCommonProps}
          onClick={() => downloadDocument(termSheet)}
        />
      )}

      {isEmbedded ? (
        <TagWithFallback
          {...approvedDocumentTagCommonProps}
          to={etoPublicViewLink(eto.previewCode, eto.product.jurisdiction)}
        />
      ) : (
        <TagWithFallback
          {...approvedDocumentTagCommonProps}
          onClick={() => {
            downloadDocument(prospectusApproved);
          }}
        />
      )}

      <TagWithFallback
        condition={smartContractOnChain}
        to={etherscanAddressLink(eto.etoId)}
        textElement={
          <FormattedMessage id="shared-component.eto-overview.smart-contract-on-chain" />
        }
        data-test-id="eto-overview-smart-contract-on-chain-button"
        innerClass={innerClass}
      />
    </div>
  );
};

const TagsWidget = compose<IDispatchProps & IWithProps & IExternalProps, IExternalProps>(
  appConnect<{}, IDispatchProps, IExternalProps>({
    dispatchToProps: (dispatch, { eto }) => ({
      downloadDocument: (document: IEtoDocument) =>
        dispatch(actions.eto.downloadEtoDocument(document, eto)),
    }),
  }),
  withProps<IWithProps, IExternalProps & IDispatchProps>(props => {
    const documentsByType = keyBy(props.eto.documents, document => document.documentType);

    return {
      smartContractOnChain: Boolean(props.eto.contract),
      termSheet: documentsByType[EEtoDocumentType.SIGNED_TERMSHEET],
      prospectusApproved: documentsByType[EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT],
    };
  }),
)(TagsWidgetLayout);

export { TagsWidget, TagsWidgetLayout };
