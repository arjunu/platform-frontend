import { TFormFixture, TFormFixtureExpectedValues } from "../utils/forms";

// about form
export const aboutFormSubmit: TFormFixture = {
  "eto-registration-company-information-submit": {
    type: "submit",
  },
};

export const aboutFormRequired: TFormFixture = {
  companyDescription: {
    type: "rich-text",
    value: "..also Beer!",
  },
  brandName: "Davecoin",
  companyWebsite: "https://neufund.org",
  companyOneliner: "Free icecream for all",
  keyQuoteFounder: "Let's make it a great day.",
  companyPreviewCardBanner: {
    value: "cover_768_400.png",
    type: "single-file",
  },
};

export const aboutForm: TFormFixture = {
  ...aboutFormRequired,
  ...aboutFormSubmit,
  keyQuoteInvestor: "They're making it a great day!",
  "eto-registration-company-logo": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "eto-registration-company-banner": {
    value: "cover_1250x400.png",
    type: "single-file",
  },
};

// legal info
export const legalInfoRequiredForm: TFormFixture = {
  companyLegalDescription: "Sunt elogiumes fallere camerarius, emeritis tabeses.",
  foundingDate: {
    value: "22/02/1999",
    type: "date",
  },
  companyShareCapital: "5000",
  shareCapitalCurrencyCode: "EUR",
  "shareholders.0.fullName": "Marcin Rudolf",
  "shareholders.0.shareCapital": "90",
  "eto-registration-legal-information-submit": {
    type: "submit",
  },
};

export const legalInfoForm: TFormFixture = {
  ...legalInfoRequiredForm,
  vatNumber: "123456",
  numberOfEmployees: {
    value: "10-99",
    type: "select",
  },
  numberOfFounders: "3",
  companyStage: {
    value: "c_round",
    type: "select",
  },
  lastFundingSizeEur: "1000000",
  "eto-registration-legal-information-submit": {
    type: "submit",
  },
};

// investment terms
export const investmentTermsRequiredForm: TFormFixture = {
  shareCapitalCurrencyCode: "EUR",
  newShareNominalValue: "150",
  newShareNominalValueEur: "150",
  preMoneyValuationEur: "1000000",
  existingShareCapital: "1253862",
  minimumNewSharesToIssue: "10000",
  newSharesToIssue: "20000",
  "eto-registration-investment-terms-submit": {
    type: "submit",
  },
};

export const investmentTermsForm: TFormFixture = {
  ...investmentTermsRequiredForm,
  authorizedCapital: "100",
  newSharesToIssueInWhitelist: "5000",
  whitelistDiscountFraction: "50",
  newSharesToIssueInFixedSlots: "1000",
  fixedSlotsMaximumDiscountFraction: "60",
  "eto-registration-investment-terms-submit": {
    type: "submit",
  },
};

// investment terms expected values
export const investmentTermsRequiredFormExpectedResult: TFormFixtureExpectedValues = {
  shareCapitalCurrencyCode: "EUR",
  newShareNominalValue: "150",
  newShareNominalValueEur: "150",
  preMoneyValuationEur: "1 000 000",
  existingShareCapital: "1 253 862",
  minimumNewSharesToIssue: "10 000",
  newSharesToIssue: "20 000",
};

export const investmentTermsFormExpectedResult: TFormFixtureExpectedValues = {
  ...investmentTermsRequiredFormExpectedResult,
  authorizedCapital: "100",
  newSharesToIssueInWhitelist: "5 000",
  publicDiscountFraction: "40",
  whitelistDiscountFraction: "50",
  newSharesToIssueInFixedSlots: "1 000",
  fixedSlotsMaximumDiscountFraction: "60",
};

// eto terms
export const etoTermsRequiredForm: TFormFixture = {
  minTicketEur: "1000",
  whitelistDurationDays: {
    value: "5",
    type: "range",
  },
  publicDurationDays: {
    value: "14",
    type: "range",
  },
  signingDurationDays: {
    value: "15",
    type: "range",
  },
  tokenTradeableOnSuccess: {
    checked: false,
    type: "toggle",
  },
  "eto-registration-eto-terms-submit": {
    type: "submit",
  },
};

export const etoTermsForm: TFormFixture = {
  ...etoTermsRequiredForm,
  maxTicketEur: "100000",
  whitelistDurationDays: {
    value: "5",
    type: "range",
  },
  publicDurationDays: {
    value: "14",
    type: "range",
  },
  signingDurationDays: {
    value: "15",
    type: "range",
  },
};

export const etoTermsRequiredFormExpectedValues: TFormFixtureExpectedValues = {
  minTicketEur: "1000",
};

export const etoTermsFormExpectedValues: TFormFixtureExpectedValues = {
  ...etoTermsRequiredFormExpectedValues,
  maxTicketEur: "100000",
};

// key individuals
export const etoKeyIndividualsFormSubmit: TFormFixture = {
  "eto-registration-key-individuals-submit": {
    type: "submit",
  },
};
export const etoKeyIndividualsForm: TFormFixture = {
  "team.members.0.name": "Zoe",
  "team.members.0.role": "Boss",
  "team.members.0.description": "Yoga 4 life",
  "team.members.0.website": "http://www.zoe.com",
  "team.members.0.image": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "team.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/zoe",
      twitter: "https://twitter.com/zoe",
      linkedin: "https://linkedin.com/zoe",
    },
  },

  "advisors.members.0.name": "Marcin",
  "advisors.members.0.role": "Boss",
  "advisors.members.0.description": "Yoga 4 life",
  "advisors.members.0.website": "http://www.zoe.com",
  "advisors.members.0.image": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "advisors.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/marcin",
      twitter: "https://twitter.com/marcin",
      linkedin: "https://linkedin.com/marcin",
    },
  },

  "keyAlliances.members.0.name": "Dave",
  "keyAlliances.members.0.role": "Boss",
  "keyAlliances.members.0.description": "Yoga 4 life",
  "keyAlliances.members.0.website": "http://www.zoe.com",
  "keyAlliances.members.0.image": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "keyAlliances.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/dave",
      twitter: "https://twitter.com/dave",
      linkedin: "https://linkedin.com/dave",
    },
  },

  "boardMembers.members.0.name": "Moe",
  "boardMembers.members.0.role": "Boss",
  "boardMembers.members.0.description": "Yoga 4 life",
  "boardMembers.members.0.website": "http://www.zoe.com",
  "boardMembers.members.0.image": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "boardMembers.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/moe",
      twitter: "https://twitter.com/moe",
      linkedin: "https://linkedin.com/moe",
    },
  },

  "notableInvestors.members.0.name": "Gunther",
  "notableInvestors.members.0.role": "Boss",
  "notableInvestors.members.0.description": "Yoga 4 life",
  "notableInvestors.members.0.website": "http://www.zoe.com",
  "notableInvestors.members.0.image": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "notableInvestors.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/Gunther",
      twitter: "https://twitter.com/Gunther",
      linkedin: "https://linkedin.com/Gunther",
    },
  },

  "keyCustomers.members.0.name": "Hognob",
  "keyCustomers.members.0.role": "Boss",
  "keyCustomers.members.0.description": "Yoga 4 life",
  "keyCustomers.members.0.website": "http://www.zoe.com",
  "keyCustomers.members.0.image": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "keyCustomers.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/Hognob",
      twitter: "https://twitter.com/Hognob",
      linkedin: "https://linkedin.com/Hognob",
    },
  },

  "partners.members.0.name": "Blabla",
  "partners.members.0.role": "Boss",
  "partners.members.0.description": "Yoga 4 life",
  "partners.members.0.website": "http://www.zoe.com",
  "partners.members.0.image": {
    value: "example_150x150.png",
    type: "single-file",
  },
  "partners.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/Blabla",
      twitter: "https://twitter.com/Blabla",
      linkedin: "https://linkedin.com/Blabla",
    },
  },

  ...etoKeyIndividualsFormSubmit,
};

export const productVisionRequiredForm: TFormFixture = {
  useOfCapital: "Cash is all around me",

  "useOfCapitalList.0.description": "Food",
  "useOfCapitalList.0.percent": "35",
  "useOfCapitalList.1.description": "Yoga",
  "useOfCapitalList.1.percent": "65",

  "eto-registration-product-vision-submit": {
    type: "submit",
  },
};

// product vision form
export const productVisionForm: TFormFixture = {
  ...productVisionRequiredForm,
  inspiration: {
    type: "rich-text",
    value: "Something about inspiration",
  },
  companyMission: {
    type: "rich-text",
    value: "Something about the mission",
  },
  productVision: {
    type: "rich-text",
    value: "Something about the vision",
  },
  problemSolved: {
    type: "rich-text",
    value: "Something about the key problem",
  },
  customerGroup: {
    type: "rich-text",
    value: "Who do we target?",
  },
  targetMarketAndIndustry: {
    type: "rich-text",
    value: "Market traction",
  },
  keyCompetitors: {
    type: "rich-text",
    value: "Key competition",
  },
  sellingProposition: {
    type: "rich-text",
    value: "The selling prop",
  },
  keyBenefitsForInvestors: {
    type: "rich-text",
    value: "Benefits for our investors",
  },

  marketTraction: {
    type: "rich-text",
    value: "Something about the market traction",
  },
  roadmap: {
    type: "rich-text",
    value: "Our roadmap",
  },
  businessModel: {
    type: "rich-text",
    value: "A great one for sure",
  },
  marketingApproach: {
    type: "rich-text",
    value: "Our Marketing",
  },
  "eto-registration-product-vision-submit": {
    type: "submit",
  },
};

// media form
export const mediaRequiredForm: TFormFixture = {
  "companyVideo.url": "https://www.youtube.com/watch?v=oHg5SJYRHA0",
  "companySlideshare.url": "https://neufund.org/",
  "companyPitchdeckUrl.url": "https://neufund.org/cms_resources/whitepaper.pdf",

  "eto-registration-media-submit": {
    type: "submit",
  },
};

export const mediaForm: TFormFixture = {
  ...mediaRequiredForm,
  socialChannels: {
    type: "media",
    values: {
      twitter: "https://twitter.com/neufund",
      facebook: "https://facebook.com/neufund",
      linkedin: "https://linkedin.com/neufund",
      slack: "https://slack.com/neufund",
      medium: "https://medium.com/neufund",
      reddit: "https://reddit.com/#neufund",
      telegram: "https://telegram.com/neufund",
      github: "https://github.com/neufund",
      instagram: "https://instagram.com/neufund",
      gplus: "https://goggle-plus.com/neufund",
      youtube: "https://youtube.com/neufund",
      xing: "https://xing.com/neufund",
      bitcointalk: "https://bitcointalk.com/neufund",
    },
  },
  "companyNews.0.publication": "Publication name",
  "companyNews.0.url": "https://neufund.org/",
  "companyNews.0.title": "The neufund chronicle",
  "marketingLinks.0.url": "https://neufund.org/",
  "marketingLinks.0.title": "Another marketing resource",

  "eto-registration-media-submit": {
    type: "submit",
  },
};

// risk form
export const riskForm: TFormFixture = {
  riskLiquidityDescription: "Info about liquidity risks",
  riskThirdPartyDescription: "Third party financing risks",
  riskThirdPartySharesFinancing: "Third party shares risks",
  riskBusinessModelDescription: "Business Model Risks",
  riskMaxDescription: "Maximum risks",

  "eto-registration-risk-submit": {
    type: "submit",
  },
};

// token info
export const equityTokenInfoForm: TFormFixture = {
  "eto-registration-token-logo": {
    value: "example_200x200.png",
    type: "single-file",
  },
  equityTokenName: "Sharpcoin",
  equityTokenSymbol: "X#C",
  "eto-registration-token-info-submit": {
    type: "submit",
  },
};

// voting rights
export const votingRights: TFormFixture = {
  generalVotingDurationDays: "11",
  restrictedActVotingDurationDays: "15",
  votingFinalizationDurationDays: "12",
  shareholdersVotingQuorum: "45",
  advisoryBoardSelector: { value: "true", type: "radio" },
  advisoryBoard: "asdfasdf",
  liquidationPreferenceMultiplier: {
    value: "2",
    type: "select",
  },
  hasFoundersVesting: { type: "radio", value: "false" },
  "eto-registration-voting-rights-submit": {
    type: "submit",
  },
};

export const votingRightsExpectedValues: TFormFixtureExpectedValues = {
  generalVotingDurationDays: "11",
  restrictedActVotingDurationDays: "15",
  votingFinalizationDurationDays: "12",
  shareholdersVotingQuorum: "45",
  advisoryBoard: "asdfasdf",
  liquidationPreferenceMultiplier: "2",
  hasFoundersVesting: "false",
};
