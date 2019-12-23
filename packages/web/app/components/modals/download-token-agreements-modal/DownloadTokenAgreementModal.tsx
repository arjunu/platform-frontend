import { map } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose } from "recompose";

import {
  EEtoDocumentType,
  IEtoDocument,
  immutableDocumentName,
} from "../../../lib/api/eto/EtoFileApi.interfaces";
import { IImmutableFileId } from "../../../lib/api/immutable-storage/ImmutableStorage.interfaces";
import { actions } from "../../../modules/actions";
import { selectEtoWithCompanyAndContractById } from "../../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import { appConnect } from "../../../store";
import { getInvestorDocumentTitles } from "../../documents/utils";
import {
  selectDownloadAgreementModalEtoId,
  selectDownloadAgrementModalIsOpen,
} from "../../portfolio/selectors";
import { Button } from "../../shared/buttons";
import { EButtonLayout, EButtonWidth } from "../../shared/buttons/Button";
import { DocumentLabel } from "../../shared/DocumentLink";
import { EHeadingSize, Heading } from "../../shared/Heading";
import { Modal } from "../Modal";
import { InfoList } from "../tx-sender/shared/InfoList";
import { InfoRow } from "../tx-sender/shared/InfoRow";

import iconDownload from "../../../assets/img/inline_icons/download.svg";
import * as styles from "./DownloadTokenAgreementModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  eto: TEtoWithCompanyAndContractReadonly | undefined;
  pendingDownloads: ReturnType<typeof selectPendingDownloads>;
}

interface IDispatchProps {
  onClose?: () => void;
  generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => void;
  downloadDocument: (immutableFileId: IImmutableFileId, fileName: string) => void;
}

type IComponentProps = IStateProps & IDispatchProps;

// TODO: Add storybook
const DownloadTokenAgreementModalComponent: React.FunctionComponent<IComponentProps> = ({
  isOpen,
  onClose,
  generateTemplateByEtoId,
  downloadDocument,
  eto,
  pendingDownloads,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <Container>
      <Row className="mb-4">
        <Col>
          <Heading size={EHeadingSize.SMALL} level={4}>
            <FormattedMessage id="portfolio.section.my-assets.modal.header" />
          </Heading>
        </Col>
      </Row>
      {eto && (
        <InfoList>
          <>
            {/* Based on https://github.com/Neufund/platform-frontend/issues/2102#issuecomment-453086304 */}
            {map(
              (document: IEtoDocument) =>
                [EEtoDocumentType.SIGNED_INVESTMENT_AND_SHAREHOLDER_AGREEMENT].includes(
                  document.documentType,
                ) ? (
                  <InfoRow
                    key={document.ipfsHash}
                    caption={
                      <DocumentLabel
                        title={
                          getInvestorDocumentTitles(eto.product.offeringDocumentType)[
                            document.documentType
                          ]
                        }
                      />
                    }
                    value={
                      <Button
                        className={styles.icon}
                        layout={EButtonLayout.GHOST}
                        svgIcon={iconDownload}
                        width={EButtonWidth.NO_PADDING}
                        iconProps={{
                          alt: <FormattedMessage id="common.download" />,
                        }}
                        disabled={pendingDownloads[document.ipfsHash]}
                        data-test-id={`modals.portfolio.portfolio-assets.download-agreements-${eto.etoId}.download`}
                        onClick={() =>
                          downloadDocument(
                            {
                              ipfsHash: document.ipfsHash,
                              mimeType: document.mimeType,
                              asPdf: true,
                            },
                            immutableDocumentName[document.documentType],
                          )
                        }
                      />
                    }
                  />
                ) : null,
              eto.documents,
            )}
            {map(
              (template: IEtoDocument) =>
                [
                  EEtoDocumentType.COMPANY_TOKEN_HOLDER_AGREEMENT,
                  EEtoDocumentType.RESERVATION_AND_ACQUISITION_AGREEMENT,
                ].includes(template.documentType) ? (
                  <InfoRow
                    key={template.ipfsHash}
                    caption={
                      <DocumentLabel
                        title={
                          getInvestorDocumentTitles(eto.product.offeringDocumentType)[
                            template.documentType
                          ]
                        }
                      />
                    }
                    value={
                      <Button
                        className={styles.icon}
                        svgIcon={iconDownload}
                        layout={EButtonLayout.GHOST}
                        width={EButtonWidth.NO_PADDING}
                        iconProps={{
                          alt: <FormattedMessage id="common.download" />,
                        }}
                        disabled={pendingDownloads[template.ipfsHash]}
                        data-test-id={`modals.portfolio.portfolio-assets.download-agreements-${eto.etoId}.download`}
                        onClick={() =>
                          generateTemplateByEtoId({ ...template, asPdf: true }, eto.etoId)
                        }
                      />
                    }
                  />
                ) : null,
              eto.templates,
            )}
          </>
        </InfoList>
      )}
    </Container>
  </Modal>
);

const DownloadTokenAgreementModal = compose<IComponentProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectDownloadAgreementModalEtoId(state);
      const eto = etoId ? selectEtoWithCompanyAndContractById(state, etoId) : undefined;
      return {
        eto,
        isOpen: etoId ? selectDownloadAgrementModalIsOpen(state) : false,
        pendingDownloads: selectPendingDownloads(state),
      };
    },
    dispatchToProps: dispatch => ({
      downloadDocument: (immutableFileId: IImmutableFileId, fileName: string) => {
        dispatch(actions.immutableStorage.downloadImmutableFile(immutableFileId, fileName));
      },
      generateTemplateByEtoId: (immutableFileId: IEtoDocument, etoId: string) => {
        dispatch(actions.etoDocuments.generateTemplateByEtoId(immutableFileId, etoId));
      },
      onClose: () => {
        dispatch(actions.portfolio.hideDownloadAgreementModal());
      },
    }),
  }),
)(DownloadTokenAgreementModalComponent);

export { DownloadTokenAgreementModal };
