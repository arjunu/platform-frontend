import BigNumber from "bignumber.js";
import { filter, map } from "lodash/fp";
import { all, fork, put, select } from "redux-saga/effects";

import { ECurrency } from "../../components/shared/formatters/utils";
import { InvestorPortfolioMessage } from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { Q18 } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EEtoState, TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IUser } from "../../lib/api/users/interfaces";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { ETOTerms } from "../../lib/contracts/ETOTerms";
import { promisify } from "../../lib/contracts/typechain-runtime";
import { IAppState } from "../../store";
import { addBigNumbers } from "../../utils/BigNumberUtils";
import { nonNullable } from "../../utils/nonNullable";
import { convertFromUlps, convertToUlps } from "../../utils/NumberUtils";
import { EthereumAddress } from "../../utils/opaque-types/types";
import { actions, TAction, TActionFromCreator } from "../actions";
import { selectUser, selectUserId } from "../auth/selectors";
import { calculateSnapshotDate } from "../contracts/utils";
import { InvalidETOStateError } from "../eto/errors";
import { isOnChain } from "../eto/utils";
import { neuCall, neuTakeEvery, neuTakeLatest } from "../sagasUtils";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { ITokenDisbursal } from "./types";
import {
  convertToCalculatedContribution,
  convertToInvestorTicket,
  convertToTokenDisbursal,
  convertToWhitelistTicket,
} from "./utils";

export function* loadInvestorTickets({ logger }: TGlobalDependencies, action: TAction): any {
  if (action.type !== "INVESTOR_TICKET_ETOS_LOAD") return;

  try {
    yield all(
      map(
        (eto: TEtoSpecsData) => put(actions.investorEtoTicket.loadEtoInvestorTicket(eto)),
        filter(eto => eto.state === EEtoState.ON_CHAIN, action.payload.etos),
      ),
    );

    yield;
  } catch (e) {
    logger.error("Could not load investor tickets", e);
  }
}

export function* loadInvestorTicket(
  { contractsService }: TGlobalDependencies,
  action: TAction,
): any {
  if (action.type !== "INVESTOR_TICKET_LOAD") return;

  if (action.payload.eto.state !== EEtoState.ON_CHAIN) {
    throw new Error("Should be called only when eto is on chain");
  }

  const etoId = action.payload.eto.etoId;
  const user: IUser = yield select((state: IAppState) => selectUser(state.auth));

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);

  const { investorTickerRaw, contribution } = yield all({
    investorTickerRaw: etoContract.investorTicket(user.userId),
    contribution: neuCall(loadComputedContributionFromContract, action.payload.eto),
  });

  yield put(
    actions.investorEtoTicket.setEtoInvestorTicket(
      etoId,
      convertToInvestorTicket(investorTickerRaw),
    ),
  );

  yield put(actions.investorEtoTicket.setInitialCalculatedContribution(etoId, contribution));
}

export function* loadComputedContributionFromContract(
  { contractsService }: TGlobalDependencies,
  eto: TEtoSpecsData,
  amountEuroUlps?: string,
  isICBM = false,
): any {
  if (eto.state !== EEtoState.ON_CHAIN) return;

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);

  const newInvestorContributionEurUlps =
    amountEuroUlps || convertToUlps((eto.minTicketEur && eto.minTicketEur.toString()) || "0");

  const from: ReturnType<typeof selectEthereumAddressWithChecksum> = yield select(
    selectEthereumAddressWithChecksum,
  );

  // TODO: check whether typechain but still is not fixed
  // sorry no typechain, typechain has a bug with boolean casting
  const contributionRaw = yield promisify(etoContract.rawWeb3Contract.calculateContribution, [
    from,
    isICBM,
    newInvestorContributionEurUlps,
  ]);

  return convertToCalculatedContribution(contributionRaw);
}

export function* loadClaimables({
  contractsService,
  logger,
  notificationCenter,
}: TGlobalDependencies): any {
  const user: IUser = yield select((state: IAppState) => selectUser(state.auth));
  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  const tokens: [ECurrency, EthereumAddress][] = [
    [ECurrency.EUR_TOKEN, euroToken.address as EthereumAddress],
    [ECurrency.ETH, etherToken.address as EthereumAddress],
  ];
  try {
    const tokensDisbursalRaw = yield feeDisbursal.claimableMutipleByToken(
      tokens.map(([, address]) => address),
      neumark.address,
      user.userId,
    );
    const tokensDisbursal: ITokenDisbursal[] = yield tokens.map(([token], i) =>
      // claimableMultipeByToken preserves tokens order so it's safe to get exact response by index
      convertToTokenDisbursal(token, tokensDisbursalRaw[i]),
    );

    yield put(actions.investorEtoTicket.setTokensDisbursal(tokensDisbursal));
  } catch (error) {
    yield put(actions.investorEtoTicket.setTokensDisbursalError());

    logger.error("Failed to load claimables", error);
    notificationCenter.error(
      createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_CLAIMABLES),
    );
  }
}

export function* getIncomingPayouts({
  contractsService,
  logger,
  notificationCenter,
}: TGlobalDependencies): any {
  const { feeDisbursal, euroToken, etherToken, neumark } = contractsService;

  try {
    const { euroTokenIncomingPayout, etherTokenIncomingPayout } = yield all({
      euroTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        euroToken.address,
        neumark.address,
      ),
      etherTokenIncomingPayout: feeDisbursal.getNonClaimableDisbursals(
        etherToken.address,
        neumark.address,
      ),
    });
    const snapshotDate = calculateSnapshotDate(yield neumark.currentSnapshotId);
    const euroTokenIncomingPayoutValue = addBigNumbers(
      euroTokenIncomingPayout.map((v: BigNumber[]) => v[1]),
    );
    const etherTokenIncomingPayoutValue = addBigNumbers(
      etherTokenIncomingPayout.map((v: BigNumber[]) => v[1]),
    );

    if (euroTokenIncomingPayoutValue || etherTokenIncomingPayoutValue) {
      yield put(
        actions.investorEtoTicket.setIncomingPayouts({
          euroTokenIncomingPayoutValue,
          etherTokenIncomingPayoutValue,
          snapshotDate,
        }),
      );
    } else {
      yield put(actions.investorEtoTicket.resetIncomingPayouts());
    }
  } catch (error) {
    logger.error("Failed to load incoming payouts", error);
    yield put(actions.investorEtoTicket.setIncomingPayoutsError());
    notificationCenter.error(
      createMessage(InvestorPortfolioMessage.INVESTOR_PORTFOLIO_FAILED_TO_LOAD_INCOMING_PAYOUTS),
    );
  }
}

export function* loadPersonalTokenDiscount(
  { contractsService }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.eto.loadTokenTerms>,
): Iterator<any> {
  const { eto } = action.payload;

  if (!isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const userId: string = nonNullable(yield select(selectUserId));

  const etoTerms: ETOTerms = yield contractsService.getEtoTerms(eto.contract.etoTermsAddress);

  const whitelistTicketRaw = yield etoTerms.whitelistTicket(userId);
  const whitelistTicket = convertToWhitelistTicket(whitelistTicketRaw);

  const whitelistDiscountFrac = Q18.mul("1").minus(whitelistTicket.fullTokenPriceFrac);

  let discountTokenPriceUlps: BigNumber = new BigNumber("0");
  // only check for price when we have discount
  if (whitelistTicket.isWhitelisted) {
    discountTokenPriceUlps = yield etoTerms.calculatePriceFraction(
      Q18.minus(whitelistDiscountFrac),
    );
  }

  yield put(
    actions.investorEtoTicket.setTokenPersonalDiscount(eto.etoId, {
      whitelistDiscountAmountEurUlps: whitelistTicket.whitelistDiscountAmountEurUlps.toString(),
      whitelistDiscountFrac: convertFromUlps(whitelistDiscountFrac).toNumber(),
      whitelistDiscountUlps: discountTokenPriceUlps.toString(),
    }),
  );
}

export function* investorTicketsSagas(): any {
  yield fork(neuTakeEvery, "INVESTOR_TICKET_ETOS_LOAD", loadInvestorTickets);
  yield fork(neuTakeEvery, "INVESTOR_TICKET_LOAD", loadInvestorTicket);
  yield fork(
    neuTakeLatest,
    actions.investorEtoTicket.loadTokenPersonalDiscount,
    loadPersonalTokenDiscount,
  );

  yield fork(
    neuTakeEvery,
    [
      actions.investorEtoTicket.loadClaimables,
      actions.investorEtoTicket.loadClaimablesInBackground,
    ],
    loadClaimables,
  );
  yield fork(
    neuTakeEvery,
    [
      actions.investorEtoTicket.getIncomingPayouts,
      actions.investorEtoTicket.getIncomingPayoutsInBackground,
    ],
    getIncomingPayouts,
  );
}
