import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { Accordion, AccordionElement, AccordionField } from "../../shared/Accordion";
import { ChartDoughnutLazy } from "../../shared/charts/ChartDoughnutLazy";
import { Field } from "../../shared/Field";
import { Panel } from "../../shared/Panel";
import { DashboardHeading } from "../shared/DashboardHeading";
import { CHART_COLORS } from "../shared/EtoView";

import * as styles from "./PublicView.module.scss";

const EtoAccordionElements: React.FunctionComponent<{
  eto: TEtoWithCompanyAndContractReadonly;
}> = ({ eto }) => {
  const {
    keyBenefitsForInvestors,
    targetMarketAndIndustry,
    roadmap,
    marketingApproach,
    useOfCapitalList,
    inspiration,
    companyMission,
    marketTraction,
    problemSolved,
    productVision,
    customerGroup,
    sellingProposition,
    keyCompetitors,
    businessModel,
    useOfCapital,
  } = eto.company;

  const shouldShowComponent =
    inspiration ||
    companyMission ||
    customerGroup ||
    productVision ||
    problemSolved ||
    marketTraction ||
    keyCompetitors ||
    sellingProposition ||
    useOfCapitalList ||
    marketingApproach ||
    roadmap ||
    targetMarketAndIndustry ||
    keyBenefitsForInvestors;

  return shouldShowComponent ? (
    <Container columnSpan={EColumnSpan.TWO_COL} type={EContainerType.INHERIT_GRID}>
      <Container columnSpan={EColumnSpan.TWO_COL}>
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto.public-view.product-vision.title" />}
          />
          <Panel>
            <Accordion openFirst={true}>
              {inspiration ? (
                <AccordionField
                  name="inspiration"
                  title={<FormattedMessage id="eto.form.product-vision.inspiration" />}
                  value={inspiration}
                />
              ) : null}

              {companyMission ? (
                <AccordionField
                  name="companyMission"
                  title={<FormattedMessage id="eto.form.product-vision.company-mission" />}
                  value={companyMission}
                />
              ) : null}

              {productVision ? (
                <AccordionField
                  name="productVision"
                  title={<FormattedMessage id="eto.form.product-vision.product-vision" />}
                  value={productVision}
                />
              ) : null}

              {problemSolved ? (
                <AccordionField
                  name="problemSolved"
                  title={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
                  value={problemSolved}
                />
              ) : null}

              {customerGroup ? (
                <AccordionField
                  name="customerGroup"
                  title={<FormattedMessage id="eto.form.product-vision.customer-group" />}
                  value={customerGroup}
                />
              ) : null}

              {targetMarketAndIndustry ? (
                <AccordionField
                  name="targetMarketAndIndustry"
                  title={<FormattedMessage id="eto.form.product-vision.target-segment" />}
                  value={targetMarketAndIndustry}
                />
              ) : null}

              {keyCompetitors ? (
                <AccordionField
                  name="keyCompetitors"
                  title={<FormattedMessage id="eto.form.product-vision.key-competitors" />}
                  value={keyCompetitors}
                />
              ) : null}

              {sellingProposition ? (
                <AccordionField
                  name="sellingProposition"
                  title={<FormattedMessage id="eto.form.product-vision.selling-proposition" />}
                  value={sellingProposition}
                />
              ) : null}

              {keyBenefitsForInvestors ? (
                <AccordionField
                  name="keyBenefitsForInvestors"
                  title={
                    <FormattedMessage id="eto.form.product-vision.key-benefits-for-investors" />
                  }
                  value={keyBenefitsForInvestors}
                />
              ) : null}

              {(useOfCapitalList && useOfCapitalList.some(e => e && e.percent && e.percent > 0)) ||
              useOfCapital ? (
                <AccordionElement
                  title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
                >
                  {useOfCapital && (
                    <p>
                      <Field name="useOfCapital" value={useOfCapital} />
                    </p>
                  )}

                  {useOfCapitalList && (
                    <ChartDoughnutLazy
                      className={styles.doughnut}
                      layout="vertical"
                      data={{
                        datasets: [
                          {
                            data: useOfCapitalList.reduce((acc: number[], d) => {
                              if (d && d.percent) {
                                acc.push(d.percent * 100);
                              }
                              return acc;
                            }, []),
                            backgroundColor: useOfCapitalList.map(
                              (_, i: number) => CHART_COLORS[i],
                            ),
                          },
                        ],
                        labels: (useOfCapitalList || []).map(d => d && d.description) as string[],
                      }}
                    />
                  )}
                </AccordionElement>
              ) : null}

              {marketTraction ? (
                <AccordionField
                  name="marketTraction"
                  title={<FormattedMessage id="eto.form.product-vision.market-traction" />}
                  value={marketTraction}
                />
              ) : null}

              {roadmap ? (
                <AccordionField
                  name="roadmap"
                  title={<FormattedMessage id="eto.form.product-vision.roadmap" />}
                  value={roadmap}
                />
              ) : null}

              {businessModel ? (
                <AccordionField
                  name="businessModel"
                  title={<FormattedMessage id="eto.form.product-vision.business-model" />}
                  value={businessModel}
                />
              ) : null}

              {marketingApproach ? (
                <AccordionField
                  name="marketingApproach"
                  title={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
                  value={marketingApproach}
                />
              ) : null}
            </Accordion>
          </Panel>
        </>
      </Container>
    </Container>
  ) : null;
};

export { EtoAccordionElements };
