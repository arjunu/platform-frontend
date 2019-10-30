import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { Panel } from "../../shared/Panel";
import { IPerson, PeopleSwiperWidget } from "../../shared/PeopleSwiperWidget";
import { TabContent, Tabs } from "../../shared/Tabs";
import { DashboardHeading } from "../shared/DashboardHeading";
import { areThereIndividuals, selectActiveCarouselTab } from "../shared/EtoViewUtils";

const Individuals: React.FunctionComponent<{ eto: TEtoWithCompanyAndContractReadonly }> = ({ eto }) => {
  const {
    advisors,
    team,
    boardMembers,
    keyAlliances,
    keyCustomers,
    partners,
    notableInvestors,
  } = eto.company;

  return (
    <>
      {areThereIndividuals(team) && (
        <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
          <DashboardHeading title={<FormattedMessage id="eto.public-view.carousel.team" />} />
          <Panel>
            <PeopleSwiperWidget people={(team && (team.members as IPerson[])) || []} key={"team"} />
          </Panel>
        </Container>
      )}

      {areThereIndividuals(partners) && (
        <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
          <DashboardHeading
            title={<FormattedMessage id="eto.public-view.carousel.tab.partners" />}
          />
          <Panel>
            <PeopleSwiperWidget people={partners.members as IPerson[]} key="partners" />
          </Panel>
        </Container>
      )}

      {areThereIndividuals(notableInvestors) && (
        <Container columnSpan={EColumnSpan.THREE_COL} type={EContainerType.INHERIT_GRID}>
          <DashboardHeading
            title={<FormattedMessage id="eto.public-view.carousel.tab.investors" />}
          />
          <Panel>
            <PeopleSwiperWidget
              people={notableInvestors.members as IPerson[]}
              key="notableInvestors"
            />
          </Panel>
        </Container>
      )}

      {(areThereIndividuals(advisors) ||
        areThereIndividuals(partners) ||
        areThereIndividuals(keyCustomers) ||
        areThereIndividuals(keyAlliances) ||
        areThereIndividuals(boardMembers)) && (
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <Tabs
            className="mb-3"
            layoutSize="large"
            layoutOrnament={false}
            selectedIndex={selectActiveCarouselTab([
              notableInvestors,
              advisors,
              keyCustomers,
              boardMembers,
              keyAlliances,
            ])}
          >
            {areThereIndividuals(advisors) && (
              <TabContent tab={<FormattedMessage id="eto.public-view.carousel.tab.advisors" />}>
                <Panel>
                  <PeopleSwiperWidget people={advisors.members as IPerson[]} key={"team"} />
                </Panel>
              </TabContent>
            )}
            {areThereIndividuals(keyCustomers) && (
              <TabContent
                tab={<FormattedMessage id="eto.public-view.carousel.tab.key-customers" />}
              >
                <Panel>
                  <PeopleSwiperWidget
                    key="keyCustomers"
                    people={keyCustomers.members as IPerson[]}
                  />
                </Panel>
              </TabContent>
            )}
            {areThereIndividuals(boardMembers) && (
              <TabContent
                tab={<FormattedMessage id="eto.public-view.carousel.tab.board-members" />}
              >
                <Panel>
                  <PeopleSwiperWidget
                    key="boardMembers"
                    people={boardMembers.members as IPerson[]}
                  />
                </Panel>
              </TabContent>
            )}
            {areThereIndividuals(keyAlliances) && (
              <TabContent
                tab={<FormattedMessage id="eto.public-view.carousel.tab.key-alliances" />}
              >
                <Panel>
                  <PeopleSwiperWidget
                    key="keyAlliances"
                    people={keyAlliances.members as IPerson[]}
                  />
                </Panel>
              </TabContent>
            )}
          </Tabs>
        </Container>
      )}
    </>
  );
};

export { Individuals };
