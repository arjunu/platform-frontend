import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { branch, compose, renderNothing, setDisplayName } from "recompose";

import { Section } from "../../Shared";
import { externalRoutes } from "../../../../../config/externalRoutes";
import { FormHighlightGroup } from "../../../../shared/forms/FormHighlightGroup";
import { AccountAddress } from "../../../../shared/AccountAddress";
import { EEtoFormTypes } from "../../../../../modules/eto-flow/types";
import { appConnect } from "../../../../../store";
import { selectUserId } from "../../../../../modules/auth/selectors";

interface IStateProps {
  issuerId: string | undefined
}

interface IProps {
  issuerId: string
}

const NoPendingNomineesComponent: React.FunctionComponent<IProps> = ({ issuerId }) =>
  <>
    <Section>
      <p>
        <FormattedHTMLMessage
          tagName="span"
          id="eto.form.eto-nominee.select-nominee-text"
          values={{ href: externalRoutes.neufundSupportHome }} />
      </p>

      <FormHighlightGroup>
        <AccountAddress address={issuerId} data-test-id="issuer-id" />
      </FormHighlightGroup>


    </Section>
  </>;

const NoPendingNominees = compose<IProps, {}>(
  setDisplayName(EEtoFormTypes.EtoVotingRights),
  appConnect<IStateProps>({
    stateToProps: s => ({
      issuerId:selectUserId(s)
    })
  }),
  branch<IStateProps>(({ issuerId }) => issuerId === undefined, renderNothing),
)(NoPendingNomineesComponent);

export {NoPendingNominees}
