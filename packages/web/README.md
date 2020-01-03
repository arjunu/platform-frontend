## Web

[![Project dependencies Status](https://david-dm.org/Neufund/platform-frontend/status.svg?path=packages/web)](https://david-dm.org/Neufund/platform-frontend?path=packages/web)
[![Project devDependencies Status](https://david-dm.org/Neufund/platform-frontend/dev-status.svg?path=packages/web)](https://david-dm.org/Neufund/platform-frontend?type=dev&path=packages/web)

A web UI of neufund platform.

### Useful links:

**Storybook** (latest `master`): https://neufund.github.io/platform-frontend/

## Running project

#### Using external backend and ethereum node (recommended way to start frontend quickly)

Set `NF_REMOTE_BACKEND_PROXY_ROOT` and `NF_REMOTE_NODE_PROXY_ROOT` variables in your .env file and
run `yarn start:remote` to connect to remote backend and node.

#### Running production build locally

```bash
yarn build:prod # build production bundle

sh ./scripts/prod-like-srv.sh # run the server
```

#### Uploading contracts

To upload modified version of Neufund Smartcontract that allows for easier blockchain development
you need to checkout
[`kk/frontend-platform-fixtures`](https://github.com/Neufund/platform-contracts/pull/55) branch and
run `yarn fixture`.

Typechain (it generates typed wrappers on smartcontracts) runs automatically after doing `yarn` to
trigger it manually do: `yarn generate:contracts`.

## Running tests

```bash
yarn test
```

### Fix all autofixable errors

```bash
yarn lint:fix
```

### Production build

```bash
yarn build:prod
```

### Extracting translations from the app

```bash
yarn intl:extract
```

[Read more](./docs/working-with-intl.md)

### Update contract artifacts submodule

If you need to push the contract artifacts to the newest version yourself, then run.

```bash
yarn contract-artifacts:update
```

then commit the submodules change. It is important to commit before you run yarn, since the yarn
prepare script will revert uncommited changes to git submodules, and repin them to the local
version.

```bash
yarn
```

If somebody else committed a new version of the submodules, just run yarn, and everything will be
updated

You will most of the time not need this as updating the contracts is included in

```bash
yarn lint:fix
```

job
