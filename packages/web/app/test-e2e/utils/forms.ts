import { findKey, forEach } from "lodash";

import { Dictionary } from "../../types";
import { confirmAccessModal, formFieldValue } from "./index";
import { formField, formFieldErrorMessage, tid } from "./selectors";

type TFormFieldFixture =
  | {
      value: string;
      type: "tags" | "single-file" | "date" | "select" | "range" | "radio";
    }
  | {
      values: Dictionary<boolean>;
      type: "checkbox";
    }
  | {
      checked: boolean;
      type: "toggle";
    }
  | {
      type: "media";
      values: Record<string, string>;
    }
  | {
      type: "multiple-files";
      values: string[];
    }
  | {
      type: "submit";
    }
  | {
      type: "rich-text";
      value: string;
    }
  | {
      type: "custom";
      method: string;
      value: any;
      options?: object;
    }
  | string;

export type TFormFixture = {
  [fieldIdentifier: string]: TFormFieldFixture;
};

export type TFormFixtureExpectedValues = {
  [fieldIdentifier: string]: string;
};

export const fillField = (key: string, value: string, parent: string = "body") =>
  cy.get(parent).within(() => {
    cy.get(formField(key))
      .clear()
      .wait(200)
      .type(value)
      .blur();
  });

// workaround for cypress issue with range input
//@see https://github.com/cypress-io/cypress/issues/1570
export const changeRangeInputValue = ($range: any) => (value: string) => {
  /* tslint:disable */
  const nativeInputValueSetter = (Object as any).getOwnPropertyDescriptor(
    (window as any).HTMLInputElement.prototype,
    "value",
  ).set;

  nativeInputValueSetter.call($range[0], value);
  $range[0].dispatchEvent(new Event("change", { value, bubbles: true } as EventInit));
  /* tslint:disable */
};

export const checkField = (key: string, value: string, parent: string = "body") => {
  cy.get(parent).within(() => {
    cy.get(formField(key)).should("have.value", value);
  });
};

const isSubmitField = (field: TFormFieldFixture) =>
  typeof field === "object" && field.type === "submit";

/**
 * Fill out a form
 * @param fixture - Which form fixture to load
 * @param submit - whether to submit the form or not, default true
 * @param methods - custom methods to fill input
 */
export const fillForm = (
  fixture: TFormFixture,
  { submit = true, methods = {} }: { submit?: boolean; methods?: any } = {},
) => {
  forEach(fixture, (field, key) => {
    // the default is just typing a string into the input
    if (typeof field === "string") {
      fillField(key, field);
    }
    // rich text area
    else if (field.type === "rich-text") {
      fillField(key, field.value);
    }
    // date
    else if (field.type === "date") {
      const values = field.value.split("/");
      cy.get(formField(key)).each((subField, index) => {
        cy.wrap(subField).type(values[index], { delay: 0 });
      });
    }
    // select field
    else if (field.type === "select") {
      cy.get(formField(key)).select(field.value);
    }

    //TODO changes here are not reflected in other parts of UI.
    // Need to investigate this further
    else if (field.type === "range") {
      cy.get(formField(key)).then(input => changeRangeInputValue(input)(field.value));
    }
    // check or uncheck a radio
    else if (field.type === "radio") {
      cy.get(formField(key))
        .filter(formFieldValue(key, field.value))
        .check({ force: true });
    }
    //check or uncheck a checkbox
    else if (field.type === "checkbox") {
      const element = cy.get(formField(key));

      forEach(field.values, (checked, value) => {
        if (checked) {
          element.filter(formFieldValue(key, value)).check({ force: true });
        } else {
          element.filter(formFieldValue(key, value)).uncheck({ force: true });
        }
      });
    }
    //check or uncheck a single checkbox
    else if (field.type === "toggle") {
      const element = cy.get(formField(key));

      if (field.checked) {
        element.check({ force: true });
      } else {
        element.uncheck({ force: true });
      }
    }
    // tags
    else if (field.type === "tags") {
      cy.get(formField(key))
        .then($form => $form.find("input"))
        .type(field.value, { force: true, timeout: 20 })
        .wait(1000)
        .type("{enter}", { force: true });
    }
    // files
    else if (field.type === "single-file") {
      uploadSingleFileToField(key, field.value);
    } else if (field.type === "multiple-files") {
      uploadMultipleFilesToFieldWithTid(key, field.values);
    } else if (field.type === "media") {
      const socialProfilesTid = tid(key);

      cy.get(socialProfilesTid).then($socialProfiles => {
        forEach(field.values, (value, key) => {
          const $button = $socialProfiles.find(tid(`social-profiles.profile-button.${key}`));

          if (!$button.hasClass("is-selected")) {
            $button.click();
          }

          fillField(`social-profiles.profile-input.${key}`, value, socialProfilesTid);
        });
      });
    } else if (field.type === "custom") {
      const method = methods[field.method];

      if (!method) {
        throw new Error(`Cannot find custom method ${method}`);
      }

      method(key, field.value, field.options);
    }
  });

  if (submit) {
    const submitField = findKey(fixture, isSubmitField);

    if (!submitField) {
      throw new Error("Please provide 'submit' fixture");
    }

    cy.get(tid(submitField)).awaitedClick();
  }
};

export const checkForm = (fixture: TFormFixture, expectedValues: TFormFixtureExpectedValues) => {
  forEach(expectedValues, (value, key) => {
    const field = fixture[key];
    // the default is just typing a string into the input
    if (typeof field === "string") {
      checkField(key, value);
    }
    // date
    else if (field.type === "date") {
      const values = field.value.split("/");
      cy.get(formField(key)).each((subField, index) => {
        cy.wrap(subField).should("contain", values[index]);
      });
    }
    // select field
    else if (field.type === "select") {
      cy.get(formField(key)).should("have.value", field.value);
    }

    //TODO changes here are not reflected in other parts of UI.
    // Need to investigate this further
    else if (field.type === "range") {
      cy.get(formField(key)).should("have.value", field.value);
    }
    // check or uncheck a radio
    else if (field.type === "radio") {
      cy.get(`input[name="${key}"][value="${value}"]`).should("be.checked");
    }
    //check or uncheck a checkbox
    else if (field.type === "checkbox") {
      const element = cy.get(formField(key));

      forEach(field.values, checked => {
        if (checked) {
          element.should("be.checked");
        } else {
          element.should("be.unchecked");
        }
      });
    }
    // tags
    else if (field.type === "tags") {
      cy.get(formField(key))
        .then($form => $form.find("input"))
        .should("have.value", field.value);
    }
  });
};

/**
 * Returns field error message.
 * In case there is no error empty string is returned
 * @param formTid Form TID
 * @param key Field name
 * @returns Chainable string
 */
export const getFieldError = (formTid: string, key: string): Cypress.Chainable<string> => {
  const errorMessageTid = formFieldErrorMessage(key);

  return cy.get(formTid).then($form => $form.find(errorMessageTid).text());
};

/**
 * Upload ipfs document to a dropzone field
 * @param targetTid - test id of the dropzone field
 * @param fixture - which fixture to load
 */
export const uploadDocumentToFieldWithTid = (
  targetTid: string,
  fixture: string,
  options: { acceptWallet: boolean } = { acceptWallet: true },
) => {
  cy.get(`${tid(targetTid)} ${tid("eto-add-document-drop-zone")}`).dropFile(fixture);

  cy.get(tid("documents-ipfs-modal-continue")).click();

  if (options.acceptWallet) {
    confirmAccessModal();
  }

  cy.get(`${tid(targetTid)} ${tid("documents-download-document")}`).should("exist");
};

/**
 * Upload single file to a field (through drag and drop)
 * @param name - field name
 * @param fixture - which fixture to load
 */
export const uploadSingleFileToField = (name: string, fixture: string) => {
  cy.get(formField(name)).within(() => {
    cy.root().dropFile(fixture);
    cy.get("img").should("exist");
  });
};

/**
 * Upload multiple files to a field (thought drag and drop)
 * @param name - field name
 * @param fixtures - which fixtures to load
 */
export const uploadMultipleFilesToFieldWithTid = (name: string, fixtures: string[]) => {
  fixtures.forEach(fixture =>
    cy.get(formField(name)).within(() => {
      cy.get(tid("multi-file-upload-dropzone")).dropFile(fixture);

      cy.get(tid(`multi-file-upload-file-${fixture}`)).should("exist");
    }),
  );
};
