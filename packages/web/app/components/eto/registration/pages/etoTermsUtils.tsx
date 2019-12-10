import { invariant } from "@neufund/shared"
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EProductName } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { THumanReadableFormat, ToHumanReadableForm } from "../../../shared/ToHumanReadableForm";

export const convertAmountToText = (amount: number) =>
  amount === 0 ? (
    <FormattedMessage id="common.number-quantity.unlimited" />
  ) : (
    <ToHumanReadableForm number={amount} format={THumanReadableFormat.SHORT} />
  );

export const getProductMeaningfulName = (productName: EProductName) => {
  switch (productName) {
    case EProductName.HNWI_ETO_DE:
      return <FormattedMessage id="eto.form.section.eto-terms.product.name.hnwi-eto-de" />;
    case EProductName.HNWI_ETO_LI:
      return <FormattedMessage id="eto.form.section.eto-terms.product.name.hnwi-eto-li" />;
    case EProductName.MINI_ETO_LI:
      return <FormattedMessage id="eto.form.section.eto-terms.product.name.mini-eto-li" />;
    case EProductName.RETAIL_ETO_DE:
      return <FormattedMessage id="eto.form.section.eto-terms.product.name.retail-eto-de" />;
    case EProductName.RETAIL_ETO_LI_SECURITY:
      return (
        <FormattedMessage id="eto.form.section.eto-terms.product.name.retail-eto-li-security" />
      );
    case EProductName.RETAIL_ETO_LI_VMA:
      return <FormattedMessage id="eto.form.section.eto-terms.product.name.retail-eto-li-vma" />;
    case EProductName.FIFTH_FORCE_ETO:
      return invariant(false, "Fifth Force eto should not be displayed on UI");
    default:
      return productName;
  }
};
