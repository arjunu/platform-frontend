import { Q18 } from "../config/constants";

import * as airProfileThumbnail from "../assets/img/eto_offers/investment_thumbnails_air_profile.jpg";
import * as emfluxThumbnail from "../assets/img/eto_offers/investment_thumbnails_emflux_motors.jpg";
import * as icbmThumbnail from "../assets/img/eto_offers/investment_thumbnails_icbm_capital_raise.png";
import * as mySwooopThumbnail from "../assets/img/eto_offers/investment_thumbnails_my_swooop.jpg";
import * as ngraveThumbnail from "../assets/img/eto_offers/investment_thumbnails_ngrave.jpg";

export type TMockEto = {
  brandName: string;
  companyPreviewCardBanner: string;
  categories: string[];
  keyQuoteFounder: string;
  url: string;
  id: string;
  totalAmount?: string;
};

export const etoMockCompanies: TMockEto[] = [
  {
    brandName: "ICBM Capital Raise",
    url: "https://commit.neufund.org",
    totalAmount: Q18.mul("12582992.64").toString(),
    companyPreviewCardBanner: icbmThumbnail,
    id: "icbm",
    categories: ["Technology", "Blockchain"],
    keyQuoteFounder:
      "More than a thousand investors participated in Neufund’s first fundraise in 2017.",
  },
  {
    brandName: "NGRAVE",
    url: "https://www.ngrave.io/",
    companyPreviewCardBanner: ngraveThumbnail,
    id: "ngrave",
    categories: ["Blockchain", "Belgium"],
    keyQuoteFounder:
      "Next gen cryptocurrency hardware wallet developed with one sole focus: no compromise on security. Create, manage and initiate transactions with you Ngrave wallet fully offline without the need to expose it to a physical or network connection.",
  },
  {
    brandName: "Emflux Motors",
    url: "http://www.emfluxmotors.com/",
    companyPreviewCardBanner: emfluxThumbnail,
    id: "emflux",
    categories: ["Mobility", "India"],
    keyQuoteFounder:
      "Electric superbike changing the landscape of transportation & mobility. India-based venture backed by both crypto and traditional investors with a mission to power 10 million electric bikes in India by 2027.",
  },
  {
    brandName: "mySWOOOP",
    url: "https://www.myswooop.de/",
    companyPreviewCardBanner: mySwooopThumbnail,
    id: "my-swooop",
    categories: ["Re-Commerce", "Germany"],
    keyQuoteFounder:
      "Omni-channel re-commerce platform buying and selling new and used electronics. With tailored software technology, mySWOOOP automatically determines current market prices in real-time assuring attractive resale-margins.",
  },
  {
    brandName: "AirProfile",
    url: "https://www.air-profile.com/",
    companyPreviewCardBanner: airProfileThumbnail,
    id: "air-profile",
    categories: ["Cleantech", "Germany"],
    keyQuoteFounder:
      "Based on a new patented technology for detecting precise wind speed, Air Profile boosts the energy transition all over the world. The device simplifies the wind resource assessment for each and every wind farm project worldwide.",
  },
];
