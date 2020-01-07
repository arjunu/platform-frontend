import { makeEthereumAddressChecksummed } from "../../modules/web3/utils";
import { EthereumAddress } from "../../utils/opaque-types/types";

export const ETO_FIXTURES: any = require("../../../../../git_modules/platform-contracts-artifacts/localhost/eto_fixtures.json");
export const ETO_TERMS_FIXTURES: any = require("../../../../../git_modules/platform-contracts-artifacts/localhost/eto_terms_contraints_fixtures.json");
export const FIXTURE_ACCOUNTS: any = require("../../../../../git_modules/platform-contracts-artifacts/localhost/fixtures.json");

export const etoFixtureByName = (name: string) => {
  const etoAddress = Object.keys(ETO_FIXTURES).find(a => ETO_FIXTURES[a].name === name);
  if (etoAddress) {
    return ETO_FIXTURES[etoAddress];
  } else {
    throw new Error(
      `Cannot find ${name} in ETO_FIXTURES. Please check if the fixtures are in sync`,
    );
  }
};

export const etoProductFixtureIdByName = (name: string): string => {
  const productId = Object.keys(ETO_TERMS_FIXTURES).find(
    fixtureKey => ETO_TERMS_FIXTURES[fixtureKey].name === name,
  );
  if (productId) {
    return productId;
  } else {
    throw new Error(
      `Cannot find ${name} in ETO_TERMS_FIXTURES. Please check if the fixtures are in sync`,
    );
  }
};

export const etoFixtureAddressByName = (name: string): string => {
  const address = Object.keys(ETO_FIXTURES).find(
    a => ETO_FIXTURES[a].name === name,
  ) as EthereumAddress;
  if (address) {
    return makeEthereumAddressChecksummed(address);
  } else {
    throw new Error(
      `Cannot find ${name} in ETO_FIXTURES. Please check if the fixtures are in sync`,
    );
  }
};

export const accountFixtureByName = (name: string) => {
  const address = Object.keys(FIXTURE_ACCOUNTS).find(f => FIXTURE_ACCOUNTS[f].name === name);
  if (address) {
    return FIXTURE_ACCOUNTS[address];
  } else {
    throw new Error(
      `Cannot find ${name} in FIXTURE_ACCOUNTS. Please check if the fixtures are in sync`,
    );
  }
};

export const accountFixtureAddress = (name: string) => {
  const fixture = accountFixtureByName(name);
  return makeEthereumAddressChecksummed(fixture.definition.address);
};

export const accountFixtureSeed = (name: string) => {
  const fixture = accountFixtureByName(name);
  return fixture.definition.seed.toString();
};

export const accountFixturePrivateKey = (name: string) => {
  const fixture = accountFixtureByName(name);
  return fixture.definition.privateKey as string;
};
