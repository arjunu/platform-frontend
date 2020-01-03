## Web

[![Project dependencies Status](https://david-dm.org/Neufund/platform-frontend/status.svg?path=packages/wallet)](https://david-dm.org/Neufund/platform-frontend?path=packages/wallet)
[![Project devDependencies Status](https://david-dm.org/Neufund/platform-frontend/dev-status.svg?path=packages/wallet)](https://david-dm.org/Neufund/platform-frontend?type=dev&path=packages/wallet)

### Useful links:

## Running project

To run the app locally we need to provide a couple of native dependencies (XCode, AndroidStudio).
Setup differs between platform therefore the best place to follow is
[Getting Started](https://facebook.github.io/react-native/docs/getting-started) guide for
`React Native CLI Quickstart` (sections **Installing dependencies** and **Preparing the Android
device** (just for android development).

After environment setup is completed you can start the app in emulator (`yarn start:ios` or
`yarn start:android`).

## Scripts

#### Start app on **ios** emulator

```bash
yarn start:ios
```

#### Start app on **android** emulator

```bash
yarn start:android
```

#### Start react devtools for component tree debugging

```bash
yarn start:devtools
```

#### Lint file structure with prettier

```bash
yarn format
```

To fix automatically formatting issues use

```bash
yarn format:fix
```
