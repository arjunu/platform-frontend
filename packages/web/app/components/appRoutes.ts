export const appRoutes = {
  verify: "/email-verify",
  icbmMigration: "/migrate",
  walletUnlock: "/wallet-unlock-etherlock",

  root: "/",

  register: "/register",

  registerIssuer: "/eto/register",

  registerNominee: "/nominee/register",
  login: "/login",

  restore: "/restore",

  etoIssuerView: "/eto/view",

  etoPublicView: "/eto/view/:jurisdiction/:previewCode",
  etoPublicViewById: "/eto/by-id/:jurisdiction/:etoId",

  etoWidgetView: "/embed/eto/widget/:previewCode",

  kyc: "/kyc",
  onfido: "/onfido",
  wallet: "/wallet",
  dashboard: "/dashboard",
  documents: "/documents",
  profile: "/profile",
  demo: "/demo",
  eto: "/eto",

  etoRegister: "/eto/registration",

  portfolio: "/portfolio",

  unsubscription: "/unsubscription/:email",
  unsubscriptionSuccess: "/unsubscription/success",

  /*
   * the following routes shouldn't be used in the code,
   * they are only there to catch accidental user input
   * or for backward compatibility
   */

  /*
   * @deprecated
   * */
  etoLanding: "/eto-landing",

  /*
   * @deprecated
   * */
  loginIssuer: "/eto/login",
  /*
   * @deprecated
   * */
  loginNominee: "/nominee/login",
  /*
  @deprecated
   */
  restoreIssuer: "/eto/restore",
  /*
   * @deprecated
   * */
  restoreNominee: "/nominee/restore",
  /*
   * @deprecated Route with eto jurisdiction should be used instead. This is only for backward compatibility.
   */
  etoPublicViewByIdLegacyRoute: "/eto/by-id/:etoId",
  /*
   * @deprecated Route with eto jurisdiction should be used instead. This is only for backward compatibility.
   */
  etoPublicViewLegacyRoute: "/eto/view/:previewCode",
};
