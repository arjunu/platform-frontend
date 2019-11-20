import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { ECountries } from "../../../utils/enums/countriesEnum";
import { Message } from "../../modals/message/Message";
import { ButtonArrowRight, EButtonLayout } from "../../shared/buttons";
import { VALUES } from "../../shared/forms/fields/FormSelectCountryField.unsafe";

import * as cityIcon from "../../../assets/img/eto/city.png";

interface IExternalProps {
  closeModal: () => void;
  restrictedJurisdiction: ECountries;
}

interface IDispatchProps {
  confirm: () => void;
}

const JurisdicitonDisclaimerModalLayout: React.FunctionComponent<IExternalProps &
  IDispatchProps> = ({ closeModal, confirm, restrictedJurisdiction }) => (
  <Message
    data-test-id="jurisdiction-disclaimer-modal"
    image={<img src={cityIcon} alt="Image" className="mb-3 w-50" />}
    text={
      <FormattedMessage
        id="jurisdiction-disclaimer.text"
        values={{
          jurisdiction: VALUES[restrictedJurisdiction],
          breakingLine: <br />,
        }}
      />
    }
  >
    <ButtonArrowRight onClick={closeModal} data-test-id="jurisdiction-disclaimer-modal.deny">
      <FormattedMessage id="form.select.yes-i-am" />
    </ButtonArrowRight>
    <ButtonArrowRight
      onClick={confirm}
      layout={EButtonLayout.GHOST}
      data-test-id="jurisdiction-disclaimer-modal.confirm"
    >
      <FormattedMessage id="form.select.no-i-am-not" />
    </ButtonArrowRight>
  </Message>
);

const JurisdictionDisclaimerModal = appConnect<{}, IDispatchProps, IExternalProps>({
  dispatchToProps: dispatch => ({
    confirm: () => dispatch(actions.eto.confirmJurisdictionDisclaimer()),
  }),
})(JurisdicitonDisclaimerModalLayout);

export { JurisdictionDisclaimerModal, JurisdicitonDisclaimerModalLayout };
