import { createActionFactory } from "@neufund/shared";
import { goBack, push } from "connected-react-router";
import { LocationDescriptorObject, Path } from "history";

import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { profileRoutes } from "../../components/settings/routes";
import { recoverRoutes } from "../../components/wallet-selector/wallet-recover/router/recoverRoutes";
import { walletRoutes } from "../../components/wallet/routes";
import { TLoginRouterState } from "./types";

export const routingActions = {
  // navigation primitives
  goBack,
  push: (location: Path | LocationDescriptorObject) => push(location as any),

  // default routes
  goHome: () => push(appRoutes.root),

  //kyc routes
  goToKYCHome: () => push(kycRoutes.start),
  goToKYCIndividualStart: () => push(kycRoutes.individualStart),
  goToKYCIndividualDocumentVerification: () => push(kycRoutes.individualDocumentVerification),
  goToKYCIndividualAddress: () => push(kycRoutes.individualAddress),
  goToKYCIndividualUpload: () => push(kycRoutes.individualUpload),

  goToKYCLegalRepresentative: () => push(kycRoutes.legalRepresentative),
  goToKYCBusinessData: () => push(kycRoutes.businessData),
  goToKYCBeneficialOwners: () => push(kycRoutes.beneficialOwners),

  // dashboard
  goToDashboard: () => push(appRoutes.dashboard),
  goToProfile: () => push(appRoutes.profile),

  // registration
  goToRegister: () => push(appRoutes.register),

  // login
  goToLogin: (state: TLoginRouterState) => push(appRoutes.login, state),

  // Successful password recovery
  goToSuccessfulRecovery: () => push(recoverRoutes.success),

  // wallet
  goToWallet: () => push(appRoutes.wallet),

  // deposit founds
  goToDepositEuroToken: () => push(walletRoutes.euroToken),
  goToDepositEth: () => push(walletRoutes.eth),

  // external paths
  openInNewWindow: createActionFactory("OPEN_IN_NEW_WINDOW", (path: string) => ({ path })),

  // Portfolio
  goToPortfolio: () => push(appRoutes.portfolio),

  //seed backup
  goToSeedBackup: () => push(profileRoutes.seedBackup),

  // Marketing emails
  goToUnsubscriptionSuccess: () => push(appRoutes.unsubscriptionSuccess),

  // other...
  // TODO: Replace with a dedicated 404 page
  goTo404: () => push(appRoutes.root),
};
