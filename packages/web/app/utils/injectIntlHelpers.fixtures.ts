import { IIntlHelpers } from "@neufund/shared"

/**
 * This dummy wrapper should be extended when we use more fields
 */
export const dummyIntl: IIntlHelpers = {
  formatIntlMessage: (id: string) => id,
  formatHTMLMessage: (id: string) => id,
  locale: "en-en",
} as any;
