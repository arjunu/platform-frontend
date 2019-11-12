import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EColumnSpan } from "../../layouts/Container";
import { Button, EButtonLayout, EIconPosition } from "../../shared/buttons";
import { Panel } from "../../shared/Panel";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as personImage from "../../../assets/img/person.png";
import * as styles from "./PersonalAccountDetails.module.scss";

interface IStateProps {
  personalData: {
    firstName?: string;
    lastName?: string;
    street?: string;
    city?: string;
    birthDate?: string;
    zipCode?: string;
    country?: string;
    isHighIncome?: boolean;
  };
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

interface IOwnState {
  isDataHidden: boolean;
}

interface IRecordProps {
  label: TTranslatedString;
  value: TTranslatedString;
}

const Record: React.FunctionComponent<IRecordProps> = ({ value, label }) => (
  <div className={styles.record}>
    <div className={styles.label}>{label}</div>
    <div className={styles.value}>{value}</div>
  </div>
);

class PersonalAccountDetailsLayout extends React.Component<
  IStateProps & IExternalProps,
  IOwnState
> {
  state = {
    isDataHidden: true,
  };

  private toggleDataVisibility = (): void => {
    this.setState(state => ({ isDataHidden: !state.isDataHidden }));
  };

  render(): React.ReactNode {
    const { isDataHidden } = this.state;
    const { personalData } = this.props;

    return (
      <Panel
        columnSpan={this.props.columnSpan}
        headerText={<FormattedMessage id="settings.account-details.title" />}
        rightComponent={<img src={personImage} className={styles.image} alt="" />}
      >
        <div className={styles.content}>
          <div>
            {personalData.firstName && personalData.lastName && (
              <Record
                label={<FormattedMessage id="settings.account-details.full-name" />}
                value={`${personalData.firstName} ${personalData.lastName}`}
              />
            )}
            {!isDataHidden && (
              <>
                {personalData.birthDate && (
                  <Record
                    label={<FormattedMessage id="settings.account-details.date-of-birth" />}
                    value={personalData.birthDate}
                  />
                )}
                {personalData.street &&
                  personalData.city &&
                  personalData.zipCode &&
                  personalData.country && (
                    <Record
                      label={<FormattedMessage id="settings.account-details.address" />}
                      value={`${personalData.street}, ${personalData.city} ${
                        personalData.zipCode
                      }, ${personalData.country}`}
                    />
                  )}
                {process.env.NF_DISABLE_HIGH_INCOME !== "1" && (
                  <Record
                    label={<FormattedMessage id="settings.account-details.income" />}
                    value={personalData.isHighIncome ? "yes" : "no"}
                  />
                )}
              </>
            )}
            <div className={styles.explanation}>
              <FormattedHTMLMessage
                tagName="span"
                id="settings.account-details.explanation"
                values={{ href: externalRoutes.neufundSupportHome }}
              />
            </div>
          </div>
          <div className="text-center">
            <Button
              iconPosition={EIconPosition.ICON_AFTER}
              svgIcon={arrowRight}
              layout={EButtonLayout.SECONDARY}
              onClick={this.toggleDataVisibility}
            >
              {isDataHidden ? (
                <FormattedMessage id="settings.account-details.button-show" />
              ) : (
                <FormattedMessage id="settings.account-details.button-hide" />
              )}
            </Button>
          </div>
        </div>
      </Panel>
    );
  }
}

const PersonalAccountDetails = compose<React.FunctionComponent<IExternalProps>>(
  appConnect<IStateProps>({
    stateToProps: s => ({
      personalData: s.kyc.individualData || {},
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualData()),
  }),
)(PersonalAccountDetailsLayout);

export { PersonalAccountDetails, PersonalAccountDetailsLayout };
