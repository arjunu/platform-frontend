import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { branch, compose, renderNothing } from "recompose";

import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import { selectTxAdditionalData, selectTxDetails } from "../../../../modules/tx/sender/selectors";
import { TRefundAdditionalData } from "../../../../modules/tx/transactions/refund/types";
import { ETxSenderType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { RequiredByKeys } from "../../../../types";
import { ButtonArrowRight } from "../../../shared/buttons/Button";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { RefundTransactionDetails } from "./RefundDetails";

interface IStateProps {
  additionalData?: TRefundAdditionalData;
  txData: Readonly<ITxData>;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = RequiredByKeys<IStateProps, "additionalData"> & IDispatchProps;

export const RefundSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  additionalData,
  txData,
  onAccept,
}) => (
  <Container data-test-id="modals.tx-sender.user-refund-flow">
    <Heading className="mb-4" size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="user-refund-flow.summary" />
    </Heading>

    <p>
      <FormattedHTMLMessage
        tagName="span"
        id="user-refund-flow.description"
        values={{ companyName: additionalData.companyName }}
      />
    </p>

    <RefundTransactionDetails txData={txData} className="mb-4" additionalData={additionalData} />

    <Row>
      <Col className="text-center">
        <ButtonArrowRight
          onClick={onAccept}
          innerClassName="mt-4"
          data-test-id="modals.tx-sender.user-refund-flow.summary.accept"
        >
          <FormattedMessage id="user-refund-flow.confirm" />
        </ButtonArrowRight>
      </Col>
    </Row>
  </Container>
);

export const RefundSummary = compose<TComponentProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      txData: selectTxDetails(state)!,
      additionalData: selectTxAdditionalData<ETxSenderType.INVESTOR_REFUND>(state),
    }),
    dispatchToProps: dispatch => ({
      onAccept: () => dispatch(actions.txSender.txSenderAccept()),
    }),
  }),
  branch<IStateProps>(props => props.additionalData === undefined, renderNothing),
)(RefundSummaryLayout);
