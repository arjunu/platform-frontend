import { TFormFixture } from "../utils/forms";

// about form
export const aboutForm: TFormFixture = {
  "eto-registration-company-logo": {
    value: "example.jpg",
    type: "file",
  },
  "eto-registration-company-banner": {
    value: "example.jpg",
    type: "file",
  },
  brandName: "Davecoin",
  companyWebsite: "https://neufund.org",
  companyOneliner: "Free icecream for all",
  companyDescription: "..also Beer!",
  keyQuoteFounder: "Let's make it a great day.",
  keyQuoteInvestor: "They're making it a great day!",
  "eto-about-category": {
    value: "Science",
    type: "tags",
  },
  "eto-registration-company-information-submit": {
    value: "",
    type: "submit",
  },
};

// legal info
export const legalInfoForm: TFormFixture = {
  vatNumber: "123456",
  foundingDate: {
    value: "22/02/99",
    type: "date",
  },
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
  companyShares: "5000",
  "shareholders.0.fullName": "Marcin Rudolf",
  "shareholders.0.shares": "90",
  "eto-registration-legal-information-submit": {
    value: "",
    type: "submit",
  },
};

// investment terms
export const investmentTermsForm: TFormFixture = {
  shareNominalValueEur: "1",
  preMoneyValuationEur: "1000000",
  existingCompanyShares: "1000",
  authorizedCapitalShares: "100",
  minimumNewSharesToIssue: "10000",
  newSharesToIssue: "20000",
  newSharesToIssueInWhitelist: "5000",
  whitelistDiscountFraction: "20",
  "eto-registration-investment-terms-submit": {
    value: "",
    type: "submit",
  },
};

// eto terms
export const etoTermsForm: TFormFixture = {
  minTicketEur: "750",
  maxTicketEur: "10000",
  additionalTerms: "There must always be sausage in the fridge!",
  enableTransferOnSuccess: {
    value: "",
    type: "check",
  },
  "eto-registration-eto-terms-submit": {
    value: "",
    type: "submit",
  },
};

// key individuals
export const etoKeyIndividualsForm: TFormFixture = {
  "team.members.0.name": "Zoe",
  "team.members.0.role": "Boss",
  "team.members.0.description": "Yoga 4 life",
  "team.members.0.website": "http://www.zoe.com",
  "team.members.0.image": {
    value: "example.jpg",
    type: "file",
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
    value: "example.jpg",
    type: "file",
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
    value: "example.jpg",
    type: "file",
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
    value: "example.jpg",
    type: "file",
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
    value: "example.jpg",
    type: "file",
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
    value: "example.jpg",
    type: "file",
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
    value: "example.jpg",
    type: "file",
  },
  "partners.members.0.socialChannels": {
    type: "media",
    values: {
      medium: "https://medium.com/Blabla",
      twitter: "https://twitter.com/Blabla",
      linkedin: "https://linkedin.com/Blabla",
    },
  },

  "eto-registration-key-individuals-submit": {
    value: "",
    type: "submit",
  },
};

// product vision form
export const productVisionForm: TFormFixture = {
  inspiration: "Something about inspiration",
  companyMission: "Something about the mission",
  productVision: "Something about the vision",
  problemSolved: "Something about the key problem",
  customerGroup: "Who do we target?",
  targetMarketAndIndustry: "Target market and industry",
  keyCompetitors: "Key competition",
  sellingProposition: "The selling prop",
  keyBenefitsForInvestors: "Benefits for our investors",
  useOfCapital: "Cash is all around me",
  "useOfCapitalList.0.description": "Food",
  "useOfCapitalList.0.percent": "30",
  "useOfCapitalList.1.description": "Yoga",
  "useOfCapitalList.1.percent": "65",
  marketTraction: "Something about the market traction",
  roadmap: "Our roadmap",
  businessModel: "A great one for sure",
  marketingApproach: "Our Marketing",

  "eto-registration-product-vision-submit": {
    value: "",
    type: "submit",
  },
};

// media form
export const mediaForm: TFormFixture = {
  "companyVideo.url": "https://www.youtube.com/watch?v=oHg5SJYRHA0",
  "companySlideshare.url": "https://neufund.org/",
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
    value: "",
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
    value: "",
    type: "submit",
  },
};

// token info
export const equityTokenInfoForm: TFormFixture = {
  "eto-registration-token-logo": {
    value: "example.jpg",
    type: "file",
  },
  equityTokenName: "Sharpcoin",
  equityTokenSymbol: "X#C",
  "eto-registration-token-info-submit": {
    value: "",
    type: "submit",
  },
};

// voting rights
export const votingRights: TFormFixture = {
  liquidationPreferenceMultiplier: {
    value: "1.5",
    type: "select",
  },
  "eto-registration-voting-rights-submit": {
    value: "",
    type: "submit",
  },
};