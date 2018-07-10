import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { FUNDING_ROUNDS } from "../registration/pages/LegalInformation";

import { Accordion, AccordionElement } from "../../shared/Accordion";
import { DocumentsWidget } from "../../shared/DocumentsWidget";
import { MediaLinksWidget } from "../../shared/MediaLinksWidget";
import { NewsWidget } from "../../shared/NewsWidget";
import { Panel } from "../../shared/Panel";
import { PeopleSwiperWidget } from "../../shared/PeopleSwiperWidget";
import { SectionHeader } from "../../shared/SectionHeader";
import { SocialProfilesList } from "../../shared/SocialProfilesList";
import { Tabs } from "../../shared/Tabs";
import { Video } from "../../shared/Video";
import { EtoTimeline } from "../overview/EtoTimeline";
import { Cover } from "../publicView/Cover";

import * as facebookIcon from "../../../assets/img/inline_icons/social_facebook.svg";
import * as linkedinIcon from "../../../assets/img/inline_icons/social_linkedin.svg";
import * as mediumIcon from "../../../assets/img/inline_icons/social_medium.svg";
import * as redditIcon from "../../../assets/img/inline_icons/social_reddit.svg";
import * as telegramIcon from "../../../assets/img/inline_icons/social_telegram.svg";
import { EtoOverviewStatus } from "../overview/EtoOverviewStatus";
import * as styles from "./EtoPublicComponent.module.scss";

const DEFAULT_PLACEHOLDER = "N/A";

const tabsData = [
  { text: "tab 1", isActive: true, onClick: () => {} },
  { text: "tab 2", onClick: () => {} },
  { text: "tab 3", onClick: () => {} },
];

const people = [
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
  {
    name: "name",
    image: "image",
    description:
      "Nunc dictum erat velit, a fermentum felis sagittis nec. Maecenas imperdiet mauris sit amet dignissim viverra. Maecenas auctor, eros non viverra tincidunt, tellus.",
    role: "role",
  },
];

const swiperSingleRowSettings = {
  slidesPerView: 5,
  spaceBetween: 100,
  breakpoints: {
    640: {
      slidesPerView: 1,
    },
    1200: {
      slidesPerView: 3,
      spaceBetween: 0,
    },
  },
};

const swiperMultiRowSettings = {
  slidesPerView: 3,
  slidesPerColumn: 2,
  spaceBetween: 80,
  breakpoints: {
    640: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
  },
};

const profilesData = [
  {
    name: "LinkedIn",
    url: "linkedin.com",
    svgIcon: linkedinIcon,
  },
  {
    name: "Facebook",
    url: "facebook.com",
    svgIcon: facebookIcon,
  },
  {
    name: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "Reddit",
    url: "reddit.com",
    svgIcon: redditIcon,
  },
  {
    name: "Telegram",
    svgIcon: telegramIcon,
  },
];

const documentsData = [
  {
    name: "section name",
    documents: [
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.pdf",
      },
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.pdf",
      },
    ],
  },
  {
    name: "section name",
    documents: [
      {
        name: "test file",
        url: "test.pdf",
      },
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.doc",
      },
      {
        name: "test file",
        url: "test.pdf",
      },
    ],
  },
];

const mediaLinksData = [
  {
    title: "sample link",
    url: "url",
  },
  {
    title: "sample link",
    url: "url",
  },
  {
    title: "sample link",
    url: "url",
  },
];

const day = 86400000;
const etoStartDate = Date.now() - 20 * day;
const bookBuildingEndDate = etoStartDate + 16 * day;
const whitelistedEndDate = bookBuildingEndDate + 7 * day;
const publicEndDate = whitelistedEndDate + 7 * day;
const inSigningEndDate = publicEndDate + 14 * day;
const etoEndDate = inSigningEndDate + 7 * day;

interface IProps {
  companyData: any;
  etoData: any;
}

interface ICurrencies {
  [key: string]: string;
}

export const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR",
};

export const EtoPublicComponent: React.SFC<IProps> = ({ companyData, etoData }) => {
  return (
    <div>
      <Cover
        companyName={companyData.brandName}
        companyOneliner={companyData.companyOneliner}
        companyLogo={{
          alt: companyData.brandName,
          srcSet: {
            "1x": companyData.companyLogo,
          },
        }}
        companyBanner={{
          alt: companyData.brandName,
          srcSet: {
            "1x": companyData.companyBanner,
          },
        }}
        tags={companyData.categories}
      />

      <EtoOverviewStatus
        image={{
          srcSet: {
            "1x": "",
          },
          alt: "",
        }}
        className="mb-4"
        prospectusApproved={true}
        onchain={false}
        tokenPrice="10000"
        companyEquity=""
        companyValuation="10000000"
        declaredCap="100000"
        status="campaigning"
        tokenName={companyData.equityTokenName}
        tokenSymbol={companyData.equityTokenName}
        campaigningWidget={{
          amountBacked: "20",
          investorsBacked: 2,
        }}
        publicWidget={{
          endInDays: 5,
          investorsBacked: 20,
          tokensGoal: 30,
          raisedTokens: 12,
        }}
      />

      <Row>
        <Col className="mb-4">
          <SectionHeader hasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.eto-timeline" />
          </SectionHeader>
          <Panel>
            <EtoTimeline
              bookBuildingEndDate={bookBuildingEndDate}
              whitelistedEndDate={whitelistedEndDate}
              publicEndDate={publicEndDate}
              inSigningEndDate={inSigningEndDate}
              etoStartDate={etoStartDate}
              etoEndDate={etoEndDate}
              status="campaigning"
            />
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={8} className="mb-4">
          <SectionHeader hasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.about" />
          </SectionHeader>
          <Panel className="mb-4">
            <p className="mb-4">{companyData.companyDescription || DEFAULT_PLACEHOLDER}</p>
            <div className="d-flex justify-content-between">
              <Link to={companyData.companyWebsite || ""} target="_blank">
                {companyData.companyWebsite || DEFAULT_PLACEHOLDER}
              </Link>
              <SocialProfilesList profiles={profilesData} />
            </div>
          </Panel>
          <SectionHeader hasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.legal-information.title" />
          </SectionHeader>
          <Panel className={styles.legalInformation}>
            <Row>
              <Col>
                <div className={styles.group}>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.legal-company-name" />
                    </span>
                    <span className={styles.value}>{companyData.name || DEFAULT_PLACEHOLDER}</span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.incorporation-date" />
                    </span>
                    <span className={styles.value}>
                      {companyData.foundingDate || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.registration-number" />
                    </span>
                    <span className={styles.value}>
                      {companyData.registrationNumber || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.number-of-founders" />
                    </span>
                    <span className={styles.value}>
                      {companyData.numberOfFounders || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.number-of-employees" />
                    </span>
                    <span className={styles.value}>
                      {companyData.numberOfEmployees || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.last-founding-amount" />
                    </span>
                    <span className={styles.value}>
                      {companyData.lastFundingSizeEur
                        ? `€ ${companyData.lastFundingSizeEur}`
                        : DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.last-founding-round" />
                    </span>
                    <span className={styles.value}>
                      {companyData.companyStage
                        ? FUNDING_ROUNDS[companyData.companyStage]
                        : DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                </div>
              </Col>
              <Col>
                {/* TODO: Add chart */}
                <div className={styles.group}>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.pre-money-valuation" />
                    </span>
                    <span className={styles.value}>
                      {etoData.fullyDilutedPreMoneyValuationEur
                        ? `€ ${etoData.fullyDilutedPreMoneyValuationEur}`
                        : DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.existing-shares" />
                    </span>
                    <span className={styles.value}>
                      {etoData.existingCompanyShares || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.minimum-new-shares-to-issue" />
                    </span>
                    <span className={styles.value}>
                      {etoData.minimumNewSharesToIssue || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.entry}>
                    <span className={styles.label}>
                      <FormattedMessage id="eto.public-view.legal-information.share-nominal" />
                    </span>
                    <span className={styles.value}>
                      {etoData.shareNominalValueEur || DEFAULT_PLACEHOLDER}
                    </span>
                  </div>
                </div>
              </Col>
            </Row>
          </Panel>
        </Col>
        <Col xs={12} md={4} className="mb-4">
          <Video youTubeId="aqz-KE-bpKQ" className="mb-4" />
          <NewsWidget isEditable={false} activeTab="news" news={[]} />
          {/* TODO: Add news */}
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <SectionHeader hasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.token-terms.title" />
          </SectionHeader>
          <Panel className={styles.tokenTerms}>
            <div className={styles.group}>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.soft-cap" />
                </span>
                <span className={styles.value} />
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.hard-cap" />
                </span>
                <span className={styles.value} />
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.minimum-token-cap" />
                </span>
                <span className={styles.value}>
                  {etoData.minimumNewSharesToIssue || DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.maximum-token-cap" />
                </span>
                <span className={styles.value}>{}</span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.token-discount" />
                </span>
                <span className={styles.value}>
                  {etoData.discountScheme || DEFAULT_PLACEHOLDER}
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.tokens-per-share" />
                </span>
                <span className={styles.value}>
                  {etoData.equityTokensPerShare || DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.new-share-price" />
                </span>
                <span className={styles.value}>
                  €{" "}
                  {etoData.fullyDilutedPreMoneyValuationEur && etoData.existingCompanyShares
                    ? etoData.fullyDilutedPreMoneyValuationEur / etoData.existingCompanyShares
                    : DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.fundraising-currency" />
                </span>
                <span className={styles.value}>
                  {etoData.currencies
                    ? etoData.currencies.map((currency: string) => CURRENCIES[currency]).join(" / ")
                    : DEFAULT_PLACEHOLDER}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.minimum-ticket-size" />
                </span>
                <span className={styles.value}>{etoData.minTicketEu || DEFAULT_PLACEHOLDER}</span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.maximum-ticket-size" />
                </span>
                <span className={styles.value}>
                  <FormattedMessage id="eto.public-view.token-terms.unlimited" />
                </span>
              </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.pre-sale-duration" />
                </span>
                <span className={styles.value}>
                  {etoData.whitelistDurationDays || DEFAULT_PLACEHOLDER}{" "}
                  <FormattedMessage id="eto.public-view.token-terms.days" />
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.public-offer-duration" />
                </span>
                <span className={styles.value}>
                  <FormattedMessage id="eto.public-view.token-terms.weeks" />
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.token-transfers" />
                </span>
                <span className={styles.value}>
                  {etoData.enableTransferOnSuccess ? (
                    <FormattedMessage id="eto.public-view.token-terms.enabled" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.disabled" />
                  )}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>Voting rights</span>
                <span className={styles.value}>
                  {etoData.generalVotingRule === "no_voting_rights" || "negative" ? (
                    <FormattedMessage id="eto.public-view.token-terms.disabled" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.enabled" />
                  )}
                </span>
              </div>
              <div className={styles.entry}>
                <span className={styles.label}>
                  <FormattedMessage id="eto.public-view.token-terms.liquidation-preferences" />
                </span>
                <span className={styles.value}>
                  {etoData.liquidationPreferenceMultiplier !== 0 ? (
                    <FormattedMessage id="eto.public-view.token-terms.enabled" />
                  ) : (
                    <FormattedMessage id="eto.public-view.token-terms.disabled" />
                  )}
                </span>
              </div>
            </div>
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <Tabs tabs={tabsData} hasDivider={false} size="large" className="mb-4" />
          <Panel>
            <PeopleSwiperWidget {...swiperMultiRowSettings} people={people} />
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col className="mb-4">
          <Tabs tabs={tabsData} hasDivider={false} size="large" className="mb-4" />
          <Panel>
            <PeopleSwiperWidget {...swiperSingleRowSettings} people={people} layout="vertical" />
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col xs={12} md={8} className="mb-4">
          <SectionHeader hasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.public-view.product-vision.title" />
          </SectionHeader>
          <Panel>
            <Accordion>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.problem-solved" />}
              >
                <p>{companyData.problemSolved || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.customer-group" />}
              >
                <p>{companyData.customerGroup || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.product-vision" />}
              >
                <p>{companyData.productVision || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.inspiration" />}
              >
                <p>{companyData.inspiration || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.key-product-priorities" />}
              >
                <p>{companyData.keyProductPriorities || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.use-of-capital" />}
              >
                <p>{companyData.useOfCapital || DEFAULT_PLACEHOLDER}</p>
                {/* TODO: Add chart */}
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.sales-model" />}
              >
                <p>{companyData.salesModel || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.marketing-approach" />}
              >
                <p>{companyData.marketingApproach}</p>
              </AccordionElement>
              <AccordionElement
                title={<FormattedMessage id="eto.form.product-vision.selling-proposition" />}
              >
                <p>{companyData.sellingProposition || DEFAULT_PLACEHOLDER}</p>
              </AccordionElement>
            </Accordion>
          </Panel>
        </Col>
        <Col xs={12} md={4}>
          <SectionHeader hasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.form.documents.title" />
          </SectionHeader>
          <DocumentsWidget className="mb-4" groups={documentsData} />
          <SectionHeader hasDecorator={false} className="mb-4">
            <FormattedMessage id="eto.form.media-links.title" />
          </SectionHeader>
          <MediaLinksWidget links={mediaLinksData} />
        </Col>
      </Row>
    </div>
  );
};