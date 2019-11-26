import * as React from "react";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../modules/actions";
import { selectEtos } from "../../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { RequiredByKeys } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { EtoOverviewThumbnail } from "../../eto/overview/EtoOverviewThumbnail/EtoOverviewThumbnail";
import { EtosComingSoonThumbnail } from "../../eto/overview/EtoOverviewThumbnail/EtosComingSoonThumbnail";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { ELoadingIndicator, LoadingIndicator } from "../../shared/loading-indicator";

import * as styles from "./EtoList.module.scss";

interface IStateProps {
  etos?: TEtoWithCompanyAndContractReadonly[];
}

type TExternalProps = {
  mockedEtos?: NonNullable<React.ComponentProps<typeof EtoOverviewThumbnail>["mockedEto"]>[];
  shouldOpenInNewWindow?: boolean;
};

type TListProps = RequiredByKeys<IStateProps, "etos">;

const EtoListThumbnails: React.FunctionComponent<TListProps & TExternalProps> = ({
  etos,
  mockedEtos = [],
  shouldOpenInNewWindow,
}) => (
  <Container type={EContainerType.INHERIT_GRID} className={styles.progressSectionLayout}>
    {etos.map(eto => (
      <EtoOverviewThumbnail
        eto={eto}
        key={eto.previewCode}
        shouldOpenInNewWindow={shouldOpenInNewWindow}
      />
    ))}

    {mockedEtos.map(eto => (
      <EtoOverviewThumbnail
        mockedEto={eto}
        key={eto.id}
        shouldOpenInNewWindow={shouldOpenInNewWindow}
      />
    ))}

    {etos.length + mockedEtos.length < 4 && <EtosComingSoonThumbnail />}
  </Container>
);

const EtoListLayout: React.FunctionComponent<TExternalProps & IStateProps> = ({
  etos,
  mockedEtos,
  shouldOpenInNewWindow,
}) => (
  <>
    {etos ? (
      <EtoListThumbnails
        etos={etos}
        mockedEtos={mockedEtos}
        shouldOpenInNewWindow={shouldOpenInNewWindow}
      />
    ) : (
      <Container columnSpan={EColumnSpan.THREE_COL}>
        <LoadingIndicator type={ELoadingIndicator.HEXAGON} />
      </Container>
    )}
  </>
);

const EtoList = compose<IStateProps & TExternalProps, TExternalProps>(
  setDisplayName("EtoList"),
  onEnterAction({
    actionCreator: d => {
      d(actions.eto.loadEtos());
    },
  }),
  appConnect<IStateProps>({
    stateToProps: state => ({
      etos: selectEtos(state),
    }),
  }),
)(EtoListLayout);

export { EtoList };
