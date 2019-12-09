import { SagaGenerator } from "typed-redux-saga";

import { ITxData } from "./../../../lib/web3/types";

export type GeneralTransactionGeneratorReturnType = SagaGenerator<ITxData>;
export type GeneralTransactionFlowReturnType = SagaGenerator<void>;
