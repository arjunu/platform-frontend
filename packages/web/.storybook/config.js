import "../app/polyfills.sideEffect";

import "./setup-styles.sideEffect";

import * as React from "react";
import { configure, addDecorator, addParameters } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";
import StoryRouter from "storybook-react-router";
import { withScreenshot } from "storycap";
import { withA11y } from "@storybook/addon-a11y";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

// Load the locale data for all your defined locales
import { addLocaleData } from "react-intl";
import enLocaleData from "react-intl/locale-data/en";

import { withStore, withSuspense } from "../app/utils/storeDecorator.unsafe";

import languageEn from "../intl/locales/en-en.json";

// Provide your messages
const messages = {
  en: languageEn,
};

const getMessages = locale => messages[locale];

// Set intl configuration
addLocaleData(enLocaleData);
setIntlConfig({
  locales: ["en"],
  defaultLocale: "en",
  getMessages,
  textComponent: React.Fragment,
});

addDecorator(withA11y);
addDecorator(withScreenshot);

addParameters({
  screenshot: {
    // wait for component to load and render before taking screenshots
    delay: 1000,
    viewports: {
      // Mobile
      "375x667": {
        width: 375,
        height: 667,
      },
      // Tablet
      "768x800": {
        width: 768,
        height: 800,
      },
      // Desktop
      "1200x800": {
        width: 1200,
        height: 800,
      },
    },
  },
});

addDecorator(withIntl);
addDecorator(StoryRouter());
addDecorator(withStore());
addDecorator(withSuspense());

// Load storybook
const req = require.context("../app/components/", true, /stories\.tsx$/);

function loadStories() {
  req.keys().forEach(req);
}

const newViewports = {
  768: {
    name: "768px wide",
    styles: {
      width: "768px",
      height: "800px",
    },
  },
  992: {
    name: "992px wide",
    styles: {
      width: "990px",
      height: "800px",
    },
  },
  1200: {
    name: "1200px wide",
    styles: {
      width: "1200px",
      height: "800px",
    },
  },
};

addParameters({
  viewport: {
    viewports: { ...INITIAL_VIEWPORTS, ...newViewports },
  },
});

configure(loadStories, module);
