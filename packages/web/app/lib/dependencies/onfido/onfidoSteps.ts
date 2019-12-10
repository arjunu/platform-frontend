import { IIntlHelpers } from "@neufund/shared"
import { ILogger } from "../logger";

const getOnfidoSteps = (logger: ILogger, intl: IIntlHelpers) => {
  if (!intl.locale.startsWith("en")) {
    logger.warn(
      `'${intl.locale}' locale is used that's not supported by Onfido. Please do proper translation manually.`,
      new Error("Unsupported locale used to start Onfido sdk"),
    );
  }

  return [
    {
      type: "welcome",
      options: {
        title: intl.formatIntlMessage("kyc.onfido.welcome.title"),
        descriptions: [intl.formatIntlMessage("kyc.onfido.welcome.descriptions")],
      },
    },
    {
      type: "document",
      options: {
        documentTypes: {
          passport: true,
          driving_licence: false,
          national_identity_card: true,
        },
      },
    },
    {
      type: "face",
      options: {
        // https://github.com/onfido/onfido-sdk-ui/issues/860 enable video force mode when implemented
        requestedVariant: "video",
        uploadFallback: false,
      },
    },
  ];
};

export { getOnfidoSteps };
