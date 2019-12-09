import * as BigNumber from "bignumber.js";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as chaiBignumber from "chai-bignumber";
import * as sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(chaiBignumber(BigNumber));
chai.use(sinonChai);

// make sure that tests fail on unhandled promise rejection
process.on("unhandledRejection", (reason, p) => {
  // tslint:disable-next-line
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});
