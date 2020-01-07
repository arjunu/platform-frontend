[![CircleCI](https://circleci.com/gh/Neufund/platform-frontend.svg?style=svg)](https://circleci.com/gh/Neufund/platform-frontend)


![Neufund logo](https://neufund.org/img/logo-neufund.svg)

A monorepo of Neufund frontend.

## packages

 - [web](./packages/web) - web UI deployed on `platform.neufund.org`
 - [shared](./packages/shared) - shared business logic
 - more coming soon...

## scripts

### `yarn deduplicate`

Removes duplicated transitive dependencies. Run after major dependencies upgrade to clean up `node_modules`.

Under the hood uses [`yarn-deduplicate`](https://github.com/atlassian/yarn-deduplicate)
package.

## Docs

- [Component Development Guidelines](./docs/component-development-guidelines.md)
- [React Guidelines](./docs/react-guidelines.md)
- [Testing production build](./docs/testing-prod-build.md)
- [Working with Intl](./docs/working-with-intl.md)
- [Feature flags](./docs/feature-flags.md)
- [Security Policy](./SECURITY.md)
